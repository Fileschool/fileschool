import 'dotenv/config';

export const config = {
    // OpenAI Configuration
    openai: {
        apiKey: process.env.OPENAI_API_KEY || 'your-openai-api-key-here',
        model: 'text-embedding-3-large', // Using large model for better embeddings
        embeddingDimensions: 3072 // Dimensions for text-embedding-3-large
    },
    
    // Qdrant Configuration
    qdrant: {
        url: process.env.QDRANT_URL || 'http://localhost:6333',
        collectionName: 'filestack_docs',
        vectorSize: 3072
    },
    
    // Document Processing
    docs: {
        batchSize: 5, // Process docs in small batches to avoid rate limits
        delayBetweenBatches: 1000, // 1 second delay between batches
        maxTokens: 8000 // Max tokens per document chunk
    }
};
