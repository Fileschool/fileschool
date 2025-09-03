/**
 * Content Gap Analyzer - Apps Script Backend
 * Standalone project for analyzing content gaps using AI-powered topic analysis
 */

/**
 * Required function for Google Apps Script web apps
 */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Content Gap Analyzer')
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
function searchSimilarContent(query, collection, threshold = 0.3, limit = 20) {
  const apiKeys = getApiKeys();
  if (!apiKeys.qdrantUrl || !apiKeys.qdrantKey) {
    throw new Error('Qdrant configuration not found');
  }

  try {
    // Generate embedding for the query
    const embedding = generateEmbedding(query, apiKeys.openaiKey);
    
    // Search Qdrant
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
 * Analyze content gap for a batch of topic combinations
 */
function analyzeContentGapBatch(combinations, config) {
  const apiKeys = getApiKeys();
  const collection = config.collection || 'filestack_blogs';
  const threshold = parseFloat(config.minSimilarity) || 0.3;
  
  const gaps = [];
  let processed = 0;
  
  for (const combo of combinations) {
    try {
      // Search for existing content on this topic
      const similar = searchSimilarContent(combo.searchQuery, collection, threshold, 5);
      
      // If no similar content found above threshold, it's a content gap
      if (similar.length === 0) {
        const gapResult = {
          ...combo,
          isGap: true,
          similarCount: 0,
          gapScore: combo.priority,
          recommendation: generateGapRecommendation(combo)
        };

        // Add GPT analysis for high-priority gaps
        if (combo.priority >= 70) {
          try {
            gapResult.gptAnalysis = generateContentGapAnalysis(combo, config, apiKeys);
          } catch (error) {
            console.warn(`GPT analysis failed for ${combo.searchQuery}:`, error.message);
          }
        }

        gaps.push(gapResult);
      } else {
        // Content exists, check if gap is significant
        const maxSimilarity = Math.max(...similar.map(s => s.score));
        if (maxSimilarity < threshold * 1.5) { // 1.5x threshold for partial gaps
          gaps.push({
            ...combo,
            isGap: true,
            similarCount: similar.length,
            maxSimilarity: (maxSimilarity * 100).toFixed(1),
            gapScore: combo.priority * (1 - maxSimilarity),
            recommendation: generatePartialGapRecommendation(combo, maxSimilarity)
          });
        }
      }
      
      processed++;
      
      // Rate limiting
      if (processed % 10 === 0) {
        Utilities.sleep(500);
      }
      
    } catch (error) {
      console.error(`Error analyzing ${combo.searchQuery}:`, error);
      continue;
    }
  }
  
  return gaps.sort((a, b) => b.gapScore - a.gapScore);
}

/**
 * Generate content gap recommendation
 */
function generateGapRecommendation(combo) {
  const recommendations = {
    high: [
      "High-impact opportunity - create comprehensive guide",
      "Strong search potential - develop detailed content",
      "Market gap identified - produce authoritative piece"
    ],
    medium: [
      "Good opportunity - create focused article",
      "Moderate potential - develop targeted content", 
      "Nice gap - produce helpful guide"
    ],
    low: [
      "Minor opportunity - consider brief article",
      "Low competition - create basic content",
      "Small gap - develop simple guide"
    ]
  };
  
  const level = combo.priority >= 80 ? 'high' : combo.priority >= 60 ? 'medium' : 'low';
  const options = recommendations[level];
  return options[Math.floor(Math.random() * options.length)];
}

/**
 * Generate partial gap recommendation
 */
function generatePartialGapRecommendation(combo, similarity) {
  return `Partial gap - existing content ${(similarity * 100).toFixed(1)}% similar. Consider unique angle or update approach.`;
}

/**
 * Generate detailed GPT analysis for content gaps
 */
function generateContentGapAnalysis(combo, config, apiKeys) {
  if (!apiKeys.openaiKey) {
    return "GPT analysis unavailable - API key not found";
  }

  const prompt = `As a content strategist for ${config.source === 'froala' ? 'Froala (rich text editor)' : 'Filestack (file upload/management)'}, analyze this content gap:

**Gap Identified:** ${combo.searchQuery}
**Topic Category:** ${combo.category}
**Content Type:** ${combo.contentType} 
**Priority Score:** ${combo.priority}/100

Please provide:

1. **Content Strategy**: Why this gap matters for our audience
2. **Article Structure**: Suggested outline with 5-7 main sections
3. **SEO Opportunities**: Target keywords and search intent
4. **Unique Angles**: How to differentiate from generic content
5. **Success Metrics**: How to measure content performance

Focus on ${config.source === 'froala' ? 'rich text editing, WYSIWYG editors, content creation' : 'file upload, image processing, digital asset management'} industry context.

Keep response under 500 words, use markdown formatting.`;

  try {
    const response = UrlFetchApp.fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKeys.openaiKey}`,
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
        max_tokens: 800,
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
    console.error('Error generating content gap analysis:', error);
    return `GPT analysis error: ${error.message}`;
  }
}

/**
 * Main content gap analysis function (called from HTML)
 */
function processContentGapAnalysis(combinations, config) {
  return analyzeContentGapBatch(combinations, config);
}