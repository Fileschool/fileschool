# 🌐 Making Your Site Live with Ngrok

## 🚀 Quick Setup

### Step 1: Start Your Services
```bash
# Start your local server (if not running)
python -m http.server 8000
# OR
npx serve . -p 8000
```

### Step 2: Tunnel Both Services

**Option A: Two Terminal Windows**
```bash
# Terminal 1: Tunnel your website
ngrok http 8000

# Terminal 2: Tunnel Qdrant database
ngrok http 6333
```

**Option B: Single Command (if you have ngrok Pro)**
```bash
ngrok start website qdrant
```

### Step 3: Configure Your Site
1. **Copy your website ngrok URL**: `https://abc123.ngrok.io`
2. **Copy your Qdrant ngrok URL**: `https://def456.ngrok.io` 
3. **Visit your website**: The system will automatically prompt for Qdrant URL
4. **Enter Qdrant URL** when prompted: `https://def456.ngrok.io`

## 🎯 Alternative Solutions

### Option 1: Use Qdrant Cloud (Recommended)
```bash
# Only tunnel your website
ngrok http 8000

# Use Qdrant Cloud URL when prompted:
https://your-cluster.qdrant.io
```

### Option 2: Use a Proxy Script
Create `proxy.js`:
```javascript
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

// Serve static files
app.use(express.static('.'));

// Proxy Qdrant requests
app.use('/qdrant', createProxyMiddleware({
  target: 'http://localhost:6333',
  changeOrigin: true,
  pathRewrite: { '^/qdrant': '' }
}));

app.listen(8000);
```

Then update your code to use `/qdrant` instead of `http://localhost:6333`.

## 🔧 Troubleshooting

### "Cannot connect to vector database"
1. ✅ **Check Qdrant is running**: `curl http://localhost:6333/collections`
2. ✅ **Enter correct ngrok URL**: Include `https://` and exact tunnel URL
3. ✅ **Clear localStorage**: `localStorage.removeItem('qdrantUrl')` in browser console

### CORS Issues
Add to docker-compose.yml:
```yaml
environment:
  - QDRANT__SERVICE__CORS_ALLOW_ORIGIN=*
```

### Ngrok Session Limits
- Free: 1 tunnel, 2 hour sessions
- Pro: Multiple tunnels, custom domains
- Consider upgrading for permanent testing

## 💡 Production Tips

For permanent hosting:
1. **Deploy to Netlify/Vercel**: Your HTML files
2. **Use Qdrant Cloud**: Managed vector database  
3. **Update URLs**: Replace localhost with production URLs

Your site will then work globally without ngrok! 🌍