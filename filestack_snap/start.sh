#!/bin/bash

echo "🚀 Starting Filestack Documentation Indexer..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if OpenAI API key is set
if [ -z "$OPENAI_API_KEY" ]; then
    echo "⚠️  OPENAI_API_KEY environment variable not set."
    echo "Please set it with: export OPENAI_API_KEY='your-api-key-here'"
    echo "Or edit config.js directly."
    echo ""
fi

# Start Qdrant database
echo "🐳 Starting Qdrant database..."
docker-compose up -d

# Wait for Qdrant to be ready
echo "⏳ Waiting for Qdrant to be ready..."
sleep 5

# Check if Qdrant is responding
if curl -s http://localhost:6333/collections > /dev/null; then
    echo "✅ Qdrant is ready!"
else
    echo "❌ Qdrant is not responding. Please check Docker logs:"
    echo "   docker-compose logs qdrant"
    exit 1
fi

echo ""
echo "🎯 Next steps:"
echo "1. Index your documents: npm run index"
echo "2. Search documents: npm run search"
echo "3. Or use interactive mode: npm run search"
echo ""
echo "📚 Your documents will be indexed from: ./complete_filestack_js/structured/"
echo "🔍 Search will be available at: http://localhost:6333"
echo ""
echo "Happy indexing! 🚀"
