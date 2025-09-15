import { QdrantClient } from '@qdrant/js-client-rest';
import OpenAI from 'openai';
import { config } from './config.js';

// Initialize clients
const qdrant = new QdrantClient({ url: config.qdrant.url });
const openai = new OpenAI({ apiKey: config.openai.apiKey });

/**
 * Enhanced context retrieval using vector database
 * This replaces the simple keyword matching in your AI generator
 */
export async function getRelevantContext(query, limit = 10) {
    try {
        // Generate embedding for the query
        const embeddingResponse = await openai.embeddings.create({
            model: config.openai.model,
            input: query
        });
        
        const queryEmbedding = embeddingResponse.data[0].embedding;
        
        // Search in Qdrant for relevant documents
        const searchResults = await qdrant.search(config.qdrant.collectionName, {
            vector: queryEmbedding,
            limit: limit,
            with_payload: true,
            with_vectors: false
        });
        
        // Format results for AI context
        const context = {
            html: {},
            filestack: {
                interfaces: {},
                classes: {},
                examples: [],
                types: {}
            },
            relevantCode: [],
            vectorSearchResults: []
        };
        
        // Process search results
        searchResults.forEach(result => {
            const payload = result.payload;
            
            // Add to vector search results
            context.vectorSearchResults.push({
                title: payload.title,
                category: payload.category,
                filename: payload.filename,
                content: payload.content,
                relevance: result.score,
                chunk: payload.chunk_index + 1,
                totalChunks: payload.total_chunks
            });
            
            // Categorize by type
            if (payload.filename.includes('__interfaces__')) {
                context.filestack.interfaces[payload.filename] = {
                    title: payload.title,
                    category: payload.category,
                    content: payload.content,
                    relevance: result.score
                };
            } else if (payload.filename.includes('__classes__')) {
                context.filestack.classes[payload.filename] = {
                    title: payload.title,
                    category: payload.category,
                    content: payload.content,
                    relevance: result.score
                };
            }
            
            // Extract code snippets if present
            if (payload.content.includes('```') || payload.content.includes('code')) {
                context.relevantCode.push({
                    source: `Vector Search - ${payload.filename}`,
                    code: payload.content,
                    language: 'typescript',
                    relevance: result.score
                });
            }
        });
        
        return context;
        
    } catch (error) {
        console.error('Error retrieving vector context:', error);
        return {
            html: {},
            filestack: {},
            relevantCode: [],
            vectorSearchResults: []
        };
    }
}

/**
 * Get context for specific Filestack features
 */
export async function getFeatureContext(feature, limit = 5) {
    const queries = {
        'picker': 'file picker configuration options parameters',
        'transform': 'image transformation resize crop rotate blur',
        'upload': 'file upload configuration options',
        'security': 'security policy signature authentication',
        'cms': 'content management system file handling',
        'image': 'image processing transformation options',
        'pdf': 'PDF file handling conversion options'
    };
    
    const query = queries[feature] || feature;
    return await getRelevantContext(query, limit);
}

/**
 * Enhanced context preparation for AI generation
 */
export async function prepareEnhancedContext(query, options = {}) {
    const {
        includeHtml = true,
        includeJs = true,
        includeTypes = true,
        includeExamples = true,
        maxResults = 15
    } = options;
    
    // Get vector search results
    const vectorContext = await getRelevantContext(query, maxResults);
    
    // Prepare final context
    const context = {
        html: vectorContext.html,
        filestack: vectorContext.filestack,
        relevantCode: vectorContext.relevantCode,
        vectorSearchResults: vectorContext.vectorSearchResults,
        searchQuery: query,
        totalResults: vectorContext.vectorSearchResults.length
    };
    
    // Filter based on options
    if (!includeJs) {
        context.filestack = {};
        context.relevantCode = context.relevantCode.filter(code => 
            code.source.includes('HTML')
        );
    }
    
    if (!includeTypes) {
        context.filestack.interfaces = {};
        context.filestack.types = {};
    }
    
    if (!includeExamples) {
        context.filestack.examples = [];
    }
    
    return context;
}

// Example usage
if (import.meta.url === `file://${process.argv[1]}`) {
    const query = process.argv[2] || "picker configuration for CMS";
    
    console.log(`🔍 Testing enhanced context for: "${query}"`);
    
    prepareEnhancedContext(query).then(context => {
        console.log(`\n📊 Context Summary:`);
        console.log(`- Vector search results: ${context.totalResults}`);
        console.log(`- Filestack interfaces: ${Object.keys(context.filestack.interfaces).length}`);
        console.log(`- Filestack classes: ${Object.keys(context.filestack.classes).length}`);
        console.log(`- Relevant code snippets: ${context.relevantCode.length}`);
        
        console.log(`\n🔝 Top 3 most relevant results:`);
        context.vectorSearchResults.slice(0, 3).forEach((result, index) => {
            console.log(`${index + 1}. ${result.title} (${result.category})`);
            console.log(`   Relevance: ${(result.relevance * 100).toFixed(2)}%`);
            console.log(`   File: ${result.filename}`);
            console.log(`   Content: ${result.content.substring(0, 100)}...\n`);
        });
    });
}
