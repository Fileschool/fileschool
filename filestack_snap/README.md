# Filestack Documentation Indexer

A simple document indexing system using Qdrant vector database, OpenAI embeddings, and Docker for semantic search of Filestack documentation.

## Features

- 🚀 **Vector Database**: Uses Qdrant for efficient similarity search
- 🤖 **AI Embeddings**: OpenAI's text-embedding-3-large model for semantic understanding
- 📚 **Document Processing**: Automatically chunks and indexes large documents
- 🔍 **Semantic Search**: Find relevant content using natural language queries
- 🐳 **Docker Ready**: Simple setup with Docker Compose

## Quick Start

### 1. Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ installed
- OpenAI API key

### 2. Setup

```bash
# Clone or download the project files
# Make sure you have the complete_filestack_js/structured folder with your JSON docs

# Install dependencies
npm install

# Set your OpenAI API key
export OPENAI_API_KEY="your-api-key-here"
# Or edit config.js directly

# Start Qdrant database
docker-compose up -d
```

### 3. Index Documents

```bash
# Index all Filestack documentation
npm run index
```

This will:
- Process all JSON files in `complete_filestack_js/structured/`
- Generate embeddings using OpenAI
- Store vectors in Qdrant database
- Handle rate limiting with batching

### 4. Search Documents

```bash
# Interactive search mode
npm run search

# Or search with a specific query
npm run search "picker configuration options"
```

## Project Structure

```
├── docker-compose.yml          # Qdrant database setup
├── package.json               # Node.js dependencies
├── config.js                  # Configuration settings
├── index-docs.js             # Document indexing script
├── search-docs.js            # Search functionality
├── README.md                  # This file
└── complete_filestack_js/    # Your Filestack docs (existing)
    └── structured/
        ├── *.json            # Documentation files
        └── ...
```

## Configuration

Edit `config.js` to customize:

- **OpenAI Model**: Change embedding model (default: text-embedding-3-large)
- **Vector Size**: Adjust based on your embedding model
- **Batch Size**: Control processing speed vs. rate limiting
- **Chunk Size**: Maximum tokens per document chunk

## Usage Examples

### Index Documents
```bash
# Process and index all documentation
node index-docs.js
```

### Search Documents
```bash
# Interactive search
node search-docs.js

# Direct search
node search-docs.js "how to configure image transformations"
```

### Example Queries
- "picker configuration for CMS"
- "image resize parameters"
- "security policy setup"
- "upload file handling"
- "transform options for images"

## API Integration

You can also use this as a library in your own code:

```javascript
import { searchDocuments } from './search-docs.js';

const results = await searchDocuments("picker configuration", 10);
console.log(results);
```

## Docker Commands

```bash
# Start Qdrant
docker-compose up -d

# Stop Qdrant
docker-compose down

# View logs
docker-compose logs qdrant

# Reset database (removes all data)
docker-compose down -v
docker-compose up -d
```

## Troubleshooting

### Common Issues

1. **OpenAI API Rate Limits**: The system automatically batches requests and adds delays
2. **Memory Issues**: Large documents are automatically chunked
3. **Qdrant Connection**: Ensure Docker is running and ports 6333/6334 are available

### Performance Tips

- Use smaller batch sizes if hitting rate limits
- Adjust chunk sizes based on your document complexity
- Monitor Qdrant memory usage for large document collections

## Cost Estimation

- **OpenAI Embeddings**: ~$0.13 per 1M tokens (text-embedding-3-large)
- **Estimated cost**: $1-5 for indexing 135+ documentation files
- **Search queries**: ~$0.13 per 1M tokens for each search

## Next Steps

- Integrate with your AI code generator
- Add document update capabilities
- Implement caching for frequent queries
- Add authentication and access control

## License

MIT License - feel free to modify and use as needed.
