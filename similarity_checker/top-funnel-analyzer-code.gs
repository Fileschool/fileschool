/**
 * Content Gap Checker - Apps Script Backend  
 * Simple tool for checking if specific topics already exist in your content
 */

/**
 * Required function for Google Apps Script web apps
 */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('top-funnel-analyzer-index')
    .setTitle('Content Gap Checker')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Get API keys from Apps Script environment variables
 */
function getApiKeys() {
  const properties = PropertiesService.getScriptProperties();
  
  return {
    openaiKey: properties.getProperty('OPENAI_API_KEY'),
    qdrantUrl: properties.getProperty('QDRANT_URL'),
    qdrantKey: properties.getProperty('QDRANT_API_KEY')
  };
}

/**
 * Search for similar content in Qdrant vector database
 */
function searchSimilarContent(query, collection, threshold = 0.3, limit = 10) {
  const apiKeys = getApiKeys();
  if (!apiKeys.qdrantUrl || !apiKeys.qdrantKey) {
    throw new Error('Qdrant configuration not found');
  }

  try {
    // Generate embedding for the query using OpenAI
    const embedding = generateEmbedding(query, apiKeys.openaiKey);
    
    // Search Qdrant for similar content
    const searchPayload = {
      vector: embedding,
      limit: limit,
      score_threshold: threshold,
      with_payload: true
    };

    const response = UrlFetchApp.fetch(`${apiKeys.qdrantUrl}/collections/${collection}/points/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKeys.qdrantKey
      },
      payload: JSON.stringify(searchPayload)
    });

    if (response.getResponseCode() === 200) {
      const data = JSON.parse(response.getContentText());
      return data.result || [];
    } else {
      console.error('Qdrant search failed:', response.getResponseCode(), response.getContentText());
      return [];
    }
  } catch (error) {
    console.error('Error searching similar content:', error);
    return [];
  }
}

/**
 * Generate text embedding using OpenAI
 */
function generateEmbedding(text, apiKey) {
  if (!apiKey) {
    throw new Error('OpenAI API key not found');
  }

  try {
    const response = UrlFetchApp.fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({
        input: text,
        model: 'text-embedding-3-large'
      })
    });

    if (response.getResponseCode() === 200) {
      const data = JSON.parse(response.getContentText());
      return data.data[0].embedding;
    } else {
      throw new Error(`OpenAI API error: ${response.getResponseCode()}`);
    }
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

/**
 * Search for a specific manual topic to check for content gaps
 */
function searchManualTopic(query, config) {
  const collection = config.collection || 'filestack_blogs';
  const threshold = parseFloat(config.minSimilarity) || 0.3;
  
  try {
    // Search for similar content on this specific topic
    const similar = searchSimilarContent(query, collection, threshold, 10);
    
    // Return results sorted by similarity (highest first)
    return similar.sort((a, b) => b.score - a.score);
    
  } catch (error) {
    console.error('Error searching manual topic:', error);
    throw error;
  }
}

/**
 * Generate GPT analysis for manual gap using GPT-4o
 */
function generateManualGapAnalysis(query, config) {
  if (!getApiKeys().openaiKey) {
    return "GPT analysis unavailable - API key not found";
  }

  const prompt = `As a content strategist for ${config.source === 'froala' ? 'Froala (rich text editor)' : 'Filestack (file upload/management)'}, analyze this content gap:

**Gap Identified:** ${query}

Please provide focused analysis:

1. **Content Opportunity**: Why this specific topic matters for your audience
2. **Search Intent**: What questions users are asking about this topic
3. **Content Structure**: Suggested outline for this piece
4. **SEO Potential**: Keywords and phrases to target
5. **Content Angle**: Unique perspective to differentiate from competitors

Focus on ${config.source === 'froala' ? 'rich text editing, content creation, WYSIWYG editors' : 'file upload, image processing, digital asset management'}.

Keep response under 200 words, use markdown formatting.`;

  try {
    const response = UrlFetchApp.fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getApiKeys().openaiKey}`,
        'Content-Type': 'application/json'
      },
              payload: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ],
            max_tokens: 400,
            temperature: 0.7
        })
    });

    if (response.getResponseCode() === 200) {
      const data = JSON.parse(response.getContentText());
      return data.choices[0].message.content;
    } else {
      return `GPT analysis failed: ${response.getResponseCode()}`;
    }
    
  } catch (error) {
    console.error('Error generating manual gap analysis:', error);
    return `GPT analysis error: ${error.message}`;
  }
}