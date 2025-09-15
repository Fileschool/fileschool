# 🌟 Cloudflare Tunnel Setup (Better than Ngrok)

## Why Cloudflare Tunnel?
- ✅ **Completely FREE**
- ✅ **No session limits** 
- ✅ **Faster than ngrok**
- ✅ **No account required for temp tunnels**
- ✅ **Better security**

## 🚀 Quick Setup

### Step 1: Download Cloudflared
Go to: https://github.com/cloudflare/cloudflared/releases
Download the Windows version and put it in your PATH.

### Step 2: Start Tunnels

**Terminal 1: Your website**
```bash
cloudflared tunnel --url http://localhost:8000
```

**Terminal 2: Qdrant database**
```bash
cloudflared tunnel --url http://localhost:6333
```

### Step 3: Use the URLs
You'll get URLs like:
- Website: `https://abc-def-ghi.trycloudflare.com`
- Qdrant: `https://xyz-uvw-rst.trycloudflare.com`

## 🔧 Alternative: Single Tunnel with Config

Create `config.yml`:
```yaml
url: http://localhost:8000
tunnel: my-tunnel
ingress:
  - hostname: my-site.example.com
    service: http://localhost:8000
  - hostname: my-qdrant.example.com  
    service: http://localhost:6333
  - service: http_status:404
```

Then run:
```bash
cloudflared tunnel --config config.yml run
```

## 💡 Pro Tips

1. **Custom domains**: Sign up for free Cloudflare account for custom domains
2. **Persistent tunnels**: Create named tunnels that don't change URLs
3. **Auto HTTPS**: All tunnels are automatically HTTPS
4. **No CORS issues**: Better compatibility than ngrok

## 🎯 Final Setup

1. **Start Cloudflare tunnels** (2 terminals)
2. **Visit your website tunnel URL**
3. **Enter Qdrant tunnel URL** when prompted
4. **Done!** Your site is live globally

Much better than ngrok! 🎉