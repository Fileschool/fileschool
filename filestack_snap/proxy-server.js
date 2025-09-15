import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Proxy requests to Qdrant
app.all('/qdrant/*', async (req, res) => {
    try {
        const qdrantUrl = `http://localhost:6333${req.path.replace('/qdrant', '')}`;
        const response = await fetch(qdrantUrl, {
            method: req.method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
        });
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Proxy server running on http://localhost:${port}`);
});