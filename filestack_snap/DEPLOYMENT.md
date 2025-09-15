# 🚀 Snap Filestack Deployment Guide

This guide covers deploying your Snap Filestack application with AI Code Generator to a live website.

## 📋 Prerequisites

- Your domain name
- Access to your domain's DNS settings
- OpenAI API key (for AI features)
- Qdrant database (for AI vector search)

## 🎯 Deployment Options

### Option 1: Netlify (Recommended - Easy)

#### Step 1: Prepare Your Files
1. Create a new folder for deployment:
```bash
mkdir snap-filestack-deploy
cd snap-filestack-deploy
```

2. Copy these files to the deployment folder:
```
index.html
styles.css
script.js
ai-code-generator.html (optional standalone)
simple-ai-generator.html (optional standalone)
example_page.html
complete_filestack_js/ (entire folder)
```

#### Step 2: Deploy to Netlify
1. Go to [netlify.com](https://netlify.com)
2. Sign up/login
3. Drag & drop your deployment folder to Netlify
4. Get your site URL (e.g., `amazing-site-123.netlify.app`)

#### Step 3: Configure Custom Domain
1. In Netlify dashboard → Site settings → Domain management
2. Click "Add custom domain"
3. Enter your domain: `yourdomain.com`
4. Netlify will show you DNS records to add

### Option 2: Vercel (Fast & Free)

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Deploy
```bash
cd C:\Users\Carl Justine Cruz\idr\snap_for_idr
vercel --prod
```

#### Step 3: Configure Domain
```bash
vercel domains add yourdomain.com
```

### Option 3: GitHub Pages (Free)

#### Step 1: Create GitHub Repository
1. Go to [github.com](https://github.com)
2. Create new repository: `snap-filestack`
3. Upload your files

#### Step 2: Enable Pages
1. Repository → Settings → Pages
2. Source: Deploy from branch
3. Branch: main
4. Your site: `https://yourusername.github.io/snap-filestack`

#### Step 3: Custom Domain
1. In Pages settings, add your custom domain
2. Enable HTTPS

## 🌐 DNS Configuration

### For Netlify/Vercel:
Add these DNS records to your domain:

**A Records:**
```
@ → 75.2.60.5
www → 75.2.60.5
```

**Or CNAME (preferred):**
```
@ → your-site.netlify.app
www → your-site.netlify.app
```

### For GitHub Pages:
**A Records:**
```
@ → 185.199.108.153
@ → 185.199.109.153
@ → 185.199.110.153
@ → 185.199.111.153
```

**CNAME:**
```
www → yourusername.github.io
```

## ⚙️ Production Configuration

### 1. Environment Setup

The AI features require a hosted Qdrant database. Options:

#### Option A: Qdrant Cloud (Recommended)
1. Go to [qdrant.tech](https://qdrant.tech)
2. Create account and cluster
3. Get your cluster URL and API key
4. Update the connection in your code:

```javascript
// In script.js, update checkAIVectorDatabase function
const response = await fetch('https://your-cluster.qdrant.io/collections', {
    method: 'GET',
    headers: { 
        'Accept': 'application/json',
        'api-key': 'your-api-key-here'
    }
});
```

#### Option B: Self-hosted Qdrant
Deploy Qdrant to a cloud server (DigitalOcean, AWS, etc.):

```bash
# On your server
docker run -p 6333:6333 -p 6334:6334 \
  -e QDRANT__SERVICE__CORS_ALLOW_ORIGIN="*" \
  -v $(pwd)/qdrant_storage:/qdrant/storage \
  qdrant/qdrant
```

### 2. Update Production URLs

Update these URLs in your code:

**In `script.js`:**
```javascript
// Replace localhost:6333 with your production Qdrant URL
const response = await fetch('https://your-qdrant-host.com/collections', {
```

**In `index.html` (if using separate AI page):**
```javascript
// Same URL updates for any Qdrant connections
```

### 3. Index Your Documentation

On your production Qdrant instance:

```bash
# Update config.js with production Qdrant URL
export const config = {
    qdrant: {
        url: 'https://your-qdrant-host.com',
        // ... rest of config
    }
};

# Run indexing
npm run index
```

## 🔒 Security Considerations

### 1. API Keys
- ✅ OpenAI keys are stored client-side (users enter their own)
- ✅ Qdrant API key should be in server environment if possible
- ✅ No sensitive keys in client code

### 2. CORS Setup
Make sure your Qdrant instance allows CORS from your domain:

```bash
# Docker
-e QDRANT__SERVICE__CORS_ALLOW_ORIGIN="https://yourdomain.com"

# Or allow all (less secure)
-e QDRANT__SERVICE__CORS_ALLOW_ORIGIN="*"
```

### 3. Rate Limiting
Consider adding rate limiting for the AI endpoints if you expect high usage.

## 📝 Quick Deployment Checklist

- [ ] Choose hosting platform (Netlify/Vercel/GitHub Pages)
- [ ] Prepare deployment files
- [ ] Deploy to hosting platform
- [ ] Configure custom domain DNS records  
- [ ] Set up production Qdrant database
- [ ] Update Qdrant URLs in code
- [ ] Index documentation in production Qdrant
- [ ] Test AI functionality on live site
- [ ] Configure CORS properly
- [ ] Test from your custom domain

## 🆘 Troubleshooting

### AI Features Not Working
1. Check browser console for CORS errors
2. Verify Qdrant URL is accessible
3. Confirm collection `filestack_docs` exists
4. Test with `curl https://your-qdrant-host.com/collections`

### DNS Issues
1. Use DNS checker: [whatsmydns.net](https://whatsmydns.net)
2. Wait 24-48 hours for propagation
3. Clear DNS cache: `ipconfig /flushdns` (Windows)

### General Issues
1. Check browser developer tools
2. Verify all files uploaded correctly
3. Test on different devices/browsers

## 🎉 Success!

Once deployed, your site will be live at:
- `https://yourdomain.com` - Main Snap Filestack interface
- `https://yourdomain.com/ai-code-generator.html` - Standalone AI generator
- `https://yourdomain.com/simple-ai-generator.html` - Simple AI generator

The AI Code Generator will be accessible via the sidebar in the main interface!