import { QdrantClient } from '@qdrant/js-client-rest';
import OpenAI from 'openai';
import { config } from './config.js';

// Initialize clients
const qdrant = new QdrantClient({ url: config.qdrant.url });
const openai = new OpenAI({ apiKey: config.openai.apiKey });

// Search documents using semantic similarity
async function searchDocuments(query, limit = 5) {
    try {
        console.log(`🔍 Searching for: "${query}"`);
        
        // Generate embedding for the query
        const embeddingResponse = await openai.embeddings.create({
            model: config.openai.model,
            input: query
        });
        
        const queryEmbedding = embeddingResponse.data[0].embedding;
        
        // Search in Qdrant
        const searchResults = await qdrant.search(config.qdrant.collectionName, {
            vector: queryEmbedding,
            limit: limit,
            with_payload: true,
            with_vectors: false
        });
        
        console.log(`\n📋 Found ${searchResults.length} relevant documents:\n`);
        
        // Display results
        searchResults.forEach((result, index) => {
            console.log(`${index + 1}. ${result.payload.title} (${result.payload.category})`);
            console.log(`   Score: ${(result.score * 100).toFixed(2)}%`);
            console.log(`   File: ${result.payload.filename}`);
            console.log(`   Chunk: ${result.payload.chunk_index + 1}/${result.payload.total_chunks}`);
            console.log(`   Content Preview: ${result.payload.content.substring(0, 200)}...`);
            console.log('');
        });
        
        return searchResults;
        
    } catch (error) {
        console.error('❌ Error during search:', error);
        return [];
    }
}

// Interactive search mode
async function interactiveSearch() {
    const readline = await import('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    console.log('🔍 Interactive Search Mode');
    console.log('Type your search query or "quit" to exit\n');
    
    const askQuestion = () => {
        rl.question('Search query: ', async (query) => {
            if (query.toLowerCase() === 'quit') {
                rl.close();
                return;
            }
            
            if (query.trim()) {
                await searchDocuments(query.trim());
            }
            
            askQuestion();
        });
    };
    
    askQuestion();
}

// Run if called directly
if (import.meta.url.endsWith('search-docs.js')) {
    const query = process.argv[2];
    
    if (query) {
        // Search with command line argument
        searchDocuments(query);
    } else {
        // Interactive mode
        interactiveSearch();
    }
}
