import { QdrantClient } from '@qdrant/js-client-rest';
import OpenAI from 'openai';
import fs from 'fs-extra';
import path from 'path';
import { config } from './config.js';

// Initialize clients
const qdrant = new QdrantClient({ url: config.qdrant.url });
const openai = new OpenAI({ apiKey: config.openai.apiKey });

// Helper function to chunk text
function chunkText(text, maxTokens = 8000) {
    const words = text.split(' ');
    const chunks = [];
    let currentChunk = [];
    let currentLength = 0;
    
    for (const word of words) {
        // Rough estimate: 1 word ≈ 1.3 tokens
        const wordTokens = Math.ceil(word.length / 4);
        
        if (currentLength + wordTokens > maxTokens && currentChunk.length > 0) {
            chunks.push(currentChunk.join(' '));
            currentChunk = [word];
            currentLength = wordTokens;
        } else {
            currentChunk.push(word);
            currentLength += wordTokens;
        }
    }
    
    if (currentChunk.length > 0) {
        chunks.push(currentChunk.join(' '));
    }
    
    return chunks;
}

// Process a single document
async function processDocument(filePath, filename) {
    try {
        console.log(`Processing: ${filename}`);
        
        // Read and parse JSON document
        const content = await fs.readJson(filePath);
        
        // Extract relevant text content
        let textContent = '';
        
        if (content.title) textContent += `Title: ${content.title}\n`;
        if (content.category) textContent += `Category: ${content.category}\n`;
        
        // Process sections
        if (content.sections) {
            content.sections.forEach(section => {
                if (section.heading) textContent += `\n## ${section.heading}\n`;
                if (section.text) textContent += `${section.text}\n`;
                
                // Include code blocks
                if (section.code_blocks) {
                    section.code_blocks.forEach(codeBlock => {
                        textContent += `\nCode (${codeBlock.language || 'text'}):\n${codeBlock.code}\n`;
                    });
                }
            });
        }
        
        // Chunk the content if it's too long
        const chunks = chunkText(textContent, config.docs.maxTokens);
        
        const documents = [];
        
        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            
            // Generate embedding
            const embeddingResponse = await openai.embeddings.create({
                model: config.openai.model,
                input: chunk
            });
            
            const embedding = embeddingResponse.data[0].embedding;
            
            documents.push({
                id: Math.floor(Math.random() * 1000000000),
                payload: {
                    filename: filename,
                    title: content.title || 'Unknown',
                    category: content.category || 'Unknown',
                    chunk_index: i,
                    total_chunks: chunks.length,
                    content: chunk,
                    url: content.url || '',
                    original_file: filePath
                },
                vector: embedding
            });
        }
        
        return documents;
        
    } catch (error) {
        console.error(`Error processing ${filename}:`, error.message);
        return [];
    }
}

// Main indexing function
async function indexDocuments() {
    try {
        console.log('🚀 Starting document indexing...');
        
        // Check if collection exists, create if not
        const collections = await qdrant.getCollections();
        const collectionExists = collections.collections.some(c => c.name === config.qdrant.collectionName);
        
        if (!collectionExists) {
            console.log(`Creating collection: ${config.qdrant.collectionName}`);
            await qdrant.createCollection(config.qdrant.collectionName, {
                vectors: {
                    size: config.qdrant.vectorSize,
                    distance: 'Cosine'
                }
            });
        } else {
            console.log(`Collection ${config.qdrant.collectionName} already exists`);
        }
        
        // Get all JSON files from the structured folder
        const docsPath = './complete_filestack_js/structured';
        const files = await fs.readdir(docsPath);
        const jsonFiles = files.filter(file => file.endsWith('.json'));
        
        console.log(`Found ${jsonFiles.length} JSON files to process`);
        
        // Process files in batches
        const allDocuments = [];
        
        for (let i = 0; i < jsonFiles.length; i += config.docs.batchSize) {
            const batch = jsonFiles.slice(i, i + config.docs.batchSize);
            console.log(`Processing batch ${Math.floor(i / config.docs.batchSize) + 1}/${Math.ceil(jsonFiles.length / config.docs.batchSize)}`);
            
            const batchPromises = batch.map(filename => 
                processDocument(path.join(docsPath, filename), filename)
            );
            
            const batchResults = await Promise.all(batchPromises);
            const batchDocuments = batchResults.flat();
            allDocuments.push(...batchDocuments);
            
            console.log(`Batch completed: ${batchDocuments.length} documents processed`);
            
            // Add delay between batches to avoid rate limits
            if (i + config.docs.batchSize < jsonFiles.length) {
                console.log(`Waiting ${config.docs.delayBetweenBatches}ms before next batch...`);
                await new Promise(resolve => setTimeout(resolve, config.docs.delayBetweenBatches));
            }
        }
        
        console.log(`Total documents to index: ${allDocuments.length}`);
        
        // Index documents in Qdrant
        if (allDocuments.length > 0) {
            console.log('📚 Indexing documents in Qdrant...');
            
            // Upsert documents (update if exists, insert if not)
            await qdrant.upsert(config.qdrant.collectionName, {
                points: allDocuments
            });
            
            console.log('✅ All documents indexed successfully!');
        }
        
        // Get collection info
        const collectionInfo = await qdrant.getCollection(config.qdrant.collectionName);
        console.log(`Collection info:`, collectionInfo);
        
    } catch (error) {
        console.error('❌ Error during indexing:', error);
        process.exit(1);
    }
}

// Run if called directly
if (import.meta.url.endsWith('index-docs.js')) {
    indexDocuments();
}
