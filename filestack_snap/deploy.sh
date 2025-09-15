#!/bin/bash

# 🚀 Snap Filestack Deployment Script
echo "🚀 Starting Snap Filestack deployment..."

# Create deployment directory
DEPLOY_DIR="snap-filestack-deploy"
echo "📁 Creating deployment directory: $DEPLOY_DIR"
mkdir -p $DEPLOY_DIR

# Copy necessary files
echo "📄 Copying files for deployment..."
cp index.html $DEPLOY_DIR/
cp styles.css $DEPLOY_DIR/
cp script.js $DEPLOY_DIR/
cp ai-code-generator.html $DEPLOY_DIR/ 2>/dev/null || echo "⚠️ ai-code-generator.html not found, skipping"
cp simple-ai-generator.html $DEPLOY_DIR/ 2>/dev/null || echo "⚠️ simple-ai-generator.html not found, skipping"
cp example_page.html $DEPLOY_DIR/ 2>/dev/null || echo "⚠️ example_page.html not found, skipping"

# Copy documentation folder
if [ -d "complete_filestack_js" ]; then
    echo "📚 Copying documentation folder..."
    cp -r complete_filestack_js $DEPLOY_DIR/
else
    echo "⚠️ complete_filestack_js folder not found"
fi

# Create a simple README for the deployment
cat > $DEPLOY_DIR/README.md << EOF
# Snap Filestack - Deployed Version

This folder contains the production-ready files for Snap Filestack.

## Files included:
- index.html - Main application
- styles.css - Styling
- script.js - JavaScript functionality  
- ai-code-generator.html - Standalone AI generator
- simple-ai-generator.html - Simple AI generator
- complete_filestack_js/ - Documentation for AI search

## Deployment:
1. Upload all files to your web host
2. Configure your domain DNS
3. Set up production Qdrant database
4. Update Qdrant URLs in script.js

See DEPLOYMENT.md for detailed instructions.
EOF

echo "✅ Deployment files ready in: $DEPLOY_DIR/"
echo ""
echo "📋 Next steps:"
echo "1. Upload the contents of '$DEPLOY_DIR' to your web host"
echo "2. Configure your DNS (see DEPLOYMENT.md)"
echo "3. Set up production Qdrant database"
echo "4. Update Qdrant URLs in script.js"
echo ""
echo "🌐 Your site will be live at: https://yourdomain.com"