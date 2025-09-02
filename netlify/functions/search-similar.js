/**
 * Netlify function to search for similar vectors in Qdrant
 * Uses environment variables for Qdrant credentials
 */

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Check if Qdrant credentials are configured
    if (!process.env.QDRANT_URL || !process.env.QDRANT_API_KEY) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Qdrant credentials not configured' })
      };
    }

    // Parse request body
    const { embedding, source = 'filestack', limit = 5 } = JSON.parse(event.body);
    
    if (!embedding) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Embedding is required' })
      };
    }

    const collectionName = source === 'filestack' ? 'filestack_blogs' : 'froala_blogs';

    // Call Qdrant API
    const response = await fetch(process.env.QDRANT_URL, {
      method: 'POST',
      headers: {
        'api-key': process.env.QDRANT_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        vector: embedding,
        limit: limit,
        with_payload: true,
        collection: collectionName
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Qdrant API error:', response.status, errorText);
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ error: `Qdrant API error: ${response.status}` })
      };
    }

    const data = await response.json();
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ result: data.result || [] })
    };

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};