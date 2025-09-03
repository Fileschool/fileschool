/**
 * Apps Script Example for Blog Similarity Checker
 * This shows how to call OpenAI and Qdrant directly from Apps Script
 */

/**
 * Required function for Google Apps Script web apps
 * This function is called when the web app is accessed
 */
function doGet() {
  // Return the HTML content as a web app
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Blog Similarity Checker')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Get API keys from Apps Script environment variables
 * Set these in Apps Script: Extensions -> Apps Script -> Project Settings -> Script Properties
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
 * Generate comprehensive similarity analysis using GPT-4o-mini with parallel processing
 * Optimized version that processes multiple blogs in parallel for better performance
 */
function analyzeSimilarityWithGPT(draftText, similarBlogs, apiKeys) {
  if (!apiKeys.openaiKey) {
    throw new Error('OpenAI API key not found');
  }
  
  try {
    console.log(`🚀 Starting parallel GPT analysis for ${Math.min(similarBlogs.length, 3)} blogs`);
    
    // Process only top 3 blogs in parallel for optimal performance
    const blogsToAnalyze = similarBlogs.slice(0, 3);
    const requests = [];
    
    // Create all HTTP requests in parallel
    blogsToAnalyze.forEach((blog, i) => {
      const similarity = (blog.score * 100).toFixed(1);
      const fullBlogContent = blog.payload.content || 'No content available';
      
      // Truncate content if too long - increased context size for better analysis quality
      const maxContentLength = 80000; // Increased to 80K for comprehensive analysis
      const truncatedDraft = draftText.length > maxContentLength ? 
        draftText.substring(0, maxContentLength) + '...[truncated]' : draftText;
      const truncatedBlog = fullBlogContent.length > maxContentLength ? 
        fullBlogContent.substring(0, maxContentLength) + '...[truncated]' : fullBlogContent;
      
      const prompt = `Analyze similarity between draft and blog post. Be concise but specific.

DRAFT (${truncatedDraft.length} chars):
${truncatedDraft}

EXISTING BLOG "${blog.payload.title}" (${truncatedBlog.length} chars):
${truncatedBlog}

Provide analysis with:
1. **OVERALL ASSESSMENT**: Core overlap explanation
2. **KEY OVERLAPS**: Exact matching phrases/concepts
3. **SIMILAR SECTIONS**: Create a table showing 5 similar section pairs:

| Draft Section | Similar Blog Section | Why Similar |
|---------------|---------------------|-------------|
| "Exact quote from draft..." | "Corresponding quote from blog..." | Brief explanation |
| "Another draft quote..." | "Matching blog quote..." | Brief explanation |

4. **RISK LEVEL**: High/Medium/Low duplicate content risk
5. **RECOMMENDATIONS**: Specific rewrite suggestions

Be specific about overlapping content and include actual quoted text in the table.`;
      
      const request = {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKeys.openaiKey}`,
          'Content-Type': 'application/json'
        },
        payload: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a content similarity analyst. Provide concise, actionable analysis.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
                     max_tokens: 16384, // Set to model's maximum supported completion tokens
          temperature: 0.1 // Reduced for consistency
        })
      };
      
      requests.push({
        blog: blog,
        similarity: similarity,
        request: request,
        fullContentLength: fullBlogContent.length,
        index: i
      });
    });
    
    // Execute all requests in parallel using UrlFetchApp.fetchAll
    console.log(`📡 Executing ${requests.length} parallel GPT requests`);
    const responses = UrlFetchApp.fetchAll(
      requests.map(req => ({
        url: 'https://api.openai.com/v1/chat/completions',
        ...req.request
      }))
    );
    
    // Process responses
    const detailedAnalyses = [];
    responses.forEach((response, i) => {
      const requestData = requests[i];
      
      if (response.getResponseCode() === 200) {
        const data = JSON.parse(response.getContentText());
        const analysis = data.choices[0].message.content;
        
        console.log(`✅ GPT analysis completed for blog ${i + 1}: ${requestData.blog.payload.title}`);
        
        detailedAnalyses.push({
          blogTitle: requestData.blog.payload.title || 'Untitled',
          similarity: requestData.similarity,
          analysis: analysis,
          contentLength: requestData.fullContentLength,
          draftLength: draftText.length
        });
      } else {
        const errorResponse = response.getContentText();
        console.warn(`❌ GPT analysis failed for blog ${i + 1}: ${response.getResponseCode()}`);
        
        detailedAnalyses.push({
          blogTitle: requestData.blog.payload.title || 'Untitled',
          similarity: requestData.similarity,
          analysis: `Analysis failed. Error: ${response.getResponseCode()}`,
          contentLength: requestData.fullContentLength,
          draftLength: draftText.length
        });
      }
    });
    
    console.log(`🎉 Parallel GPT analysis completed for ${detailedAnalyses.length} blogs`);
    return detailedAnalyses;
    
  } catch (error) {
    console.error('Error analyzing with GPT:', error);
    return [{
      blogTitle: 'Analysis Error',
      similarity: 'N/A',
      analysis: `GPT analysis failed: ${error.message}`,
      contentLength: 0,
      draftLength: draftText.length
    }];
  }
}

/**
 * Generate embedding for text using OpenAI
 */
function generateEmbedding(text, apiKeys) {
  if (!apiKeys.openaiKey) {
    throw new Error('OpenAI API key not found in script properties');
  }
  
  try {
    const response = UrlFetchApp.fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKeys.openaiKey}`,
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({
        model: 'text-embedding-3-large',
        input: text
      })
    });
    
    if (response.getResponseCode() !== 200) {
      throw new Error(`OpenAI API error: ${response.getResponseCode()} - ${response.getContentText()}`);
    }
    
    const data = JSON.parse(response.getContentText());
    return data.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw new Error(`Failed to generate embedding: ${error.message}`);
  }
}

/**
 * Search for similar vectors in Qdrant
 */
function searchSimilarBlogs(embedding, source = 'filestack', topK = 5, apiKeys) {
  if (!apiKeys.qdrantUrl || !apiKeys.qdrantKey) {
    throw new Error('Qdrant URL or API key not found in script properties');
  }
  
  const collectionName = source === 'filestack' ? 'filestack_blogs' : 'froala_blogs';
  
  try {
    const response = UrlFetchApp.fetch(`${apiKeys.qdrantUrl}/collections/${collectionName}/points/search`, {
      method: 'POST',
      headers: {
        'api-key': apiKeys.qdrantKey,
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({
        vector: embedding,
        limit: topK,
        with_payload: true
      })
    });
    
    if (response.getResponseCode() !== 200) {
      throw new Error(`Qdrant API error: ${response.getResponseCode()} - ${response.getContentText()}`);
    }
    
    const data = JSON.parse(response.getContentText());
    return data.result || [];
  } catch (error) {
    console.error('Error searching Qdrant:', error);
    throw new Error(`Failed to search similar blogs: ${error.message}`);
  }
}

// Removed separate section comparison - now integrated into AI analysis

// Removed all complex helper functions - keeping only the basic createWordComparison function

/**
 * Extract keywords from text (simple implementation)
 */
function extractKeywords(text, topN = 10) {
  // Enhanced stop words list - more comprehensive filtering
  const stopWords = new Set([
    // Articles
    'the', 'a', 'an',
    // Conjunctions
    'and', 'or', 'but', 'nor', 'yet', 'so',
    // Prepositions
    'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up', 'down', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'among', 'within', 'without', 'against', 'toward', 'towards', 'upon', 'across', 'behind', 'beneath', 'beside', 'beyond', 'inside', 'outside', 'under', 'over',
    // Common verbs
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'shall', 'must', 'ought',
    // Pronouns
    'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'her', 'its', 'our', 'their', 'mine', 'yours', 'hers', 'ours', 'theirs', 'myself', 'yourself', 'himself', 'herself', 'itself', 'ourselves', 'yourselves', 'themselves',
    // Common words
    'very', 'really', 'quite', 'rather', 'just', 'only', 'even', 'still', 'also', 'too', 'as', 'well', 'so', 'such', 'much', 'many', 'few', 'little', 'more', 'most', 'less', 'least', 'some', 'any', 'all', 'both', 'each', 'every', 'either', 'neither', 'other', 'another', 'same', 'different', 'similar', 'like', 'unlike',
    // Time words
    'now', 'then', 'today', 'yesterday', 'tomorrow', 'always', 'never', 'often', 'sometimes', 'usually', 'rarely', 'ever', 'already', 'yet', 'still', 'soon', 'later', 'early', 'late',
    // Place words
    'here', 'there', 'where', 'everywhere', 'anywhere', 'nowhere', 'somewhere', 'away', 'back', 'forward', 'backward', 'upward', 'downward', 'home', 'abroad', 'inside', 'outside',
    // Common adjectives
    'good', 'bad', 'big', 'small', 'large', 'little', 'high', 'low', 'long', 'short', 'wide', 'narrow', 'thick', 'thin', 'heavy', 'light', 'strong', 'weak', 'hard', 'soft', 'easy', 'difficult', 'simple', 'complex', 'new', 'old', 'young', 'fresh', 'stale', 'clean', 'dirty', 'hot', 'cold', 'warm', 'cool',
    // Common adverbs
    'very', 'really', 'quite', 'rather', 'just', 'only', 'even', 'still', 'also', 'too', 'as', 'well', 'so', 'such', 'much', 'many', 'few', 'little', 'more', 'most', 'less', 'least', 'some', 'any', 'all', 'both', 'each', 'every', 'either', 'neither', 'other', 'another', 'same', 'different', 'similar', 'like', 'unlike',
    // Numbers and quantities
    'one', 'two', 'three', 'first', 'second', 'third', 'last', 'next', 'previous', 'current', 'recent', 'old', 'new', 'modern', 'ancient', 'old', 'young', 'fresh', 'stale',
    // Common tech/business words that don't add value
    'use', 'using', 'used', 'get', 'gets', 'getting', 'got', 'gotten', 'make', 'makes', 'making', 'made', 'take', 'takes', 'taking', 'took', 'taken', 'go', 'goes', 'going', 'went', 'gone', 'come', 'comes', 'coming', 'came', 'see', 'sees', 'seeing', 'saw', 'seen', 'know', 'knows', 'knowing', 'knew', 'known',
    // Common filler words
    'like', 'um', 'uh', 'well', 'you know', 'i mean', 'sort of', 'kind of', 'basically', 'actually', 'literally', 'honestly', 'frankly', 'obviously', 'clearly', 'naturally', 'certainly', 'definitely', 'absolutely', 'completely', 'totally', 'entirely', 'wholly', 'fully', 'partly', 'partially', 'mostly', 'mainly', 'primarily', 'chiefly', 'largely', 'generally', 'usually', 'typically', 'normally', 'commonly', 'frequently', 'often', 'sometimes', 'occasionally', 'rarely', 'seldom', 'hardly', 'scarcely', 'barely', 'almost', 'nearly', 'approximately', 'roughly', 'about', 'around', 'roughly', 'exactly', 'precisely', 'accurately', 'correctly', 'properly', 'appropriately', 'suitably', 'adequately', 'sufficiently', 'enough', 'too', 'also', 'as well', 'in addition', 'additionally', 'furthermore', 'moreover', 'besides', 'likewise', 'similarly', 'equally', 'likewise', 'in the same way', 'in the same manner', 'in the same fashion', 'in the same style', 'in the same form', 'in the same shape', 'in the same size', 'in the same color', 'in the same pattern', 'in the same design', 'in the same layout', 'in the same structure', 'in the same format', 'in the same style', 'in the same way', 'in the same manner', 'in the same fashion', 'in the same style', 'in the same form', 'in the same shape', 'in the same size', 'in the same color', 'in the same pattern', 'in the same design', 'in the same layout', 'in the same structure', 'in the same format'
  ]);
  
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.has(word));
  
  const wordCount = {};
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });
  
  return Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN);
}

/**
 * Generate recommendations based on similarity scores
 */
function generateRecommendations(similarBlogs) {
  if (!similarBlogs || similarBlogs.length === 0) {
    return {
      action: 'proceed',
      message: '🟢 GOOD: No similar content found. You\'re good to go!',
      color: 'green'
    };
  }
  
  const highestSimilarity = similarBlogs[0].score * 100;
  
  if (highestSimilarity >= 85) {
    return {
      action: 'complete_rewrite',
      message: `🔴 STOP: ${highestSimilarity.toFixed(1)}% similarity detected! Complete rewrite required.`,
      details: 'This content is too similar to existing articles. Consider a completely different angle or topic.',
      color: 'red'
    };
  } else if (highestSimilarity >= 70) {
    return {
      action: 'major_revision',
      message: `🟡 CAUTION: ${highestSimilarity.toFixed(1)}% similarity. Major revisions needed.`,
      details: 'Significant overlap detected. Change your angle, add unique insights, or focus on different aspects.',
      color: 'orange'
    };
  } else if (highestSimilarity >= 50) {
    return {
      action: 'minor_revision',
      message: `🟡 REVIEW: ${highestSimilarity.toFixed(1)}% similarity. Minor revisions suggested.`,
      details: 'Some overlap detected. Add more unique content, personal insights, or different examples.',
      color: 'yellow'
    };
  } else {
    return {
      action: 'proceed',
      message: `🟢 GOOD: ${highestSimilarity.toFixed(1)}% similarity. Proceed with confidence!`,
      details: 'Low similarity detected. Your content is sufficiently unique.',
      color: 'green'
    };
  }
}

/**
 * Performance timing for backend
 */
const BackendTimer = {
  start(label) {
    const startTime = new Date().getTime();
    console.log(`⏱️ [BACKEND START] ${label} at ${startTime}`);
    return startTime;
  },
  end(label, startTime) {
    const endTime = new Date().getTime();
    const elapsed = endTime - startTime;
    console.log(`⏱️ [BACKEND END] ${label}: ${elapsed}ms`);
    return elapsed;
  }
};

/**
 * Main function to check blog similarity
 */
function checkBlogSimilarity(draftText, source = 'filestack') {
  const totalStart = BackendTimer.start('TOTAL_BACKEND');
  
  try {
    // Get API keys from environment variables
    const apiKeysStart = BackendTimer.start('GET_API_KEYS');
    const apiKeys = getApiKeys();
    BackendTimer.end('GET_API_KEYS', apiKeysStart);
    
    // Validate API keys
    if (!apiKeys.openaiKey) {
      throw new Error('OpenAI API key not set in script properties. Go to Extensions > Apps Script > Project Settings > Script Properties and add OPENAI_API_KEY');
    }
    
    if (!apiKeys.qdrantUrl || !apiKeys.qdrantKey) {
      throw new Error('Qdrant credentials not set in script properties. Add QDRANT_URL and QDRANT_API_KEY');
    }
    
    // Generate embedding for draft
    const embeddingStart = BackendTimer.start('GENERATE_EMBEDDING');
    const draftEmbedding = generateEmbedding(draftText, apiKeys);
    BackendTimer.end('GENERATE_EMBEDDING', embeddingStart);
    
    // Search for similar blogs - increased to get more for GPT analysis
    const searchStart = BackendTimer.start('SEARCH_SIMILAR_BLOGS');
    const similarBlogs = searchSimilarBlogs(draftEmbedding, source, 10, apiKeys);
    BackendTimer.end('SEARCH_SIMILAR_BLOGS', searchStart);
    
    // Minimal logging for performance
    console.log(`✅ Found ${similarBlogs.length} similar blogs`);
    if (similarBlogs.length > 0) {
      const topSimilarity = (similarBlogs[0].score * 100).toFixed(1);
      console.log(`🎯 Top similarity: ${topSimilarity}% - ${similarBlogs[0].payload.title}`);
    }
    
    // Extract keywords from draft
    const keywordStart = BackendTimer.start('EXTRACT_KEYWORDS');
    const draftKeywords = extractKeywords(draftText);
    
         // Extract keywords from TOP similar article only (not aggregated)
     let similarKeywords = [];
     if (similarBlogs.length > 0) {
       const topSimilarContent = similarBlogs[0].payload.content || '';
       similarKeywords = extractKeywords(topSimilarContent);
     }
     BackendTimer.end('EXTRACT_KEYWORDS', keywordStart);
    
    // Generate recommendations
    const recStart = BackendTimer.start('GENERATE_RECOMMENDATIONS');
    const recommendations = generateRecommendations(similarBlogs);
    BackendTimer.end('GENERATE_RECOMMENDATIONS', recStart);
    
    // Get parallel GPT analysis for top 3 blogs only
    let gptAnalyses = [];
    try {
      const gptStart = BackendTimer.start('PARALLEL_GPT_ANALYSIS');
      gptAnalyses = analyzeSimilarityWithGPT(draftText, similarBlogs, apiKeys);
      BackendTimer.end('PARALLEL_GPT_ANALYSIS', gptStart);
    } catch (error) {
      console.warn('GPT analysis failed, continuing with basic analysis:', error);
      gptAnalyses = [];
    }
    
    // Format results - ensure everything is properly defined
    const results = {
      recommendations: recommendations || { message: 'Analysis complete', color: 'green' },
      draftKeywords: draftKeywords || [],
      similarKeywords: similarKeywords || [],
      gptAnalyses: gptAnalyses || [],
      similarBlogs: [],
      source: source || 'filestack',
      totalChecked: 0
    };

    // Process similarBlogs safely
    if (similarBlogs && Array.isArray(similarBlogs)) {
      try {
        results.similarBlogs = similarBlogs.map(function(blog) {
          if (!blog || !blog.payload) {
            return {
              title: 'Untitled',
              url: '',
              similarity: '0.0',
              description: '',
              categories: [],
              content: '',
              fullContent: '',
              keywords: []
            };
          }
          
          const content = blog.payload.content || '';
          const displayContent = content.length > 3000 ? 
            content.substring(0, 3000) + '... (content truncated for display)' : content;
          
          return {
            title: blog.payload.title || 'Untitled',
            url: blog.payload.url || '',
            similarity: blog.score ? (blog.score * 100).toFixed(1) : '0.0',
            description: blog.payload.description || '',
            categories: blog.payload.categories || [],
            content: displayContent,
            fullContent: content,
            keywords: extractKeywords(content, 5)
          };
        });
        results.totalChecked = similarBlogs.length;
      } catch (e) {
        console.error('Error processing similar blogs:', e);
        results.similarBlogs = [];
        results.totalChecked = 0;
      }
    }
    
    BackendTimer.end('TOTAL_BACKEND', totalStart);
    console.log('✅ Similarity check completed successfully:', results);
    return results;
    
  } catch (error) {
    BackendTimer.end('TOTAL_BACKEND', totalStart);
    console.error('❌ Error checking similarity:', error);
    return {
      error: error.message || 'Unknown error occurred'
    };
  }
}

/**
 * Example usage - call this from your HTML interface
 */
function testSimilarityCheck() {
  const draftText = `
    How to build a great rich text editor for modern web applications.
    Rich text editors are essential components that allow users to format text...
  `;
  
  const results = checkBlogSimilarity(draftText, 'filestack');
  console.log('Similarity check results:', results);
  
  return results;
}

/**
 * Function to be called from HTML via google.script.run
 */
function processSimilarityCheck(draftText, source) {
  return checkBlogSimilarity(draftText, source);
}

/**
 * Top-Funnel Content Gap Analysis Functions
 * Uses the same API keys from environment variables
 */

/**
 * Analyze a batch of top-funnel content combinations for gaps
 */
function analyzeTopFunnelBatch(combinations, config) {
  const totalStart = BackendTimer.start('TOP_FUNNEL_BATCH');
  
  try {
    // Get API keys from environment variables (same as similarity checker)
    const apiKeysStart = BackendTimer.start('GET_API_KEYS');
    const apiKeys = getApiKeys();
    BackendTimer.end('GET_API_KEYS', apiKeysStart);
    
    // Validate API keys
    if (!apiKeys.openaiKey || !apiKeys.qdrantUrl || !apiKeys.qdrantKey) {
      throw new Error('API credentials not set in script properties');
    }
    
    const results = [];
    
    combinations.forEach((combination, index) => {
      try {
        const gapAnalysis = analyzeTopFunnelGap(combination, config, apiKeys);
        if (gapAnalysis) {
          results.push(gapAnalysis);
        }
      } catch (error) {
        console.warn(`Failed to analyze combination ${index}:`, error);
        // Continue with other combinations
      }
    });
    
    BackendTimer.end('TOP_FUNNEL_BATCH', totalStart);
    console.log(`✅ Top-funnel batch analysis completed: ${results.length} gaps found`);
    return results;
    
  } catch (error) {
    BackendTimer.end('TOP_FUNNEL_BATCH', totalStart);
    console.error('❌ Error in top-funnel batch analysis:', error);
    return [];
  }
}

/**
 * Analyze a single topic-funnel combination for content gaps
 */
function analyzeTopFunnelGap(combination, config, apiKeys) {
  try {
    // Generate embedding for the search query
    const embedding = generateEmbedding(combination.searchQuery, apiKeys);
    
    // Search for similar existing content
    const collectionName = config.collection || 'filestack_blogs';
    const similarContent = searchTopFunnelContent(embedding, collectionName, apiKeys, config);
    
    // Determine if this is a gap based on top-funnel criteria
    const isGap = evaluateTopFunnelGap(combination, similarContent, config);
    
    if (isGap) {
      // Generate GPT analysis for the top-funnel gap
      const gptAnalysis = generateTopFunnelGapAnalysis(combination, similarContent, apiKeys);
      
      return {
        ...combination,
        isGap: true,
        existingContent: similarContent,
        gapReason: generateGapReason(combination, similarContent),
        opportunityScore: calculateTopFunnelOpportunity(combination, similarContent, config),
        gptAnalysis: gptAnalysis
      };
    }
    
    return null; // Not a gap
  } catch (error) {
    console.error(`Error analyzing gap for ${combination.searchQuery}:`, error);
    return null;
  }
}

/**
 * Search for similar top-funnel content in Qdrant
 */
function searchTopFunnelContent(embedding, collectionName, apiKeys, config) {
  try {
    const response = UrlFetchApp.fetch(`${apiKeys.qdrantUrl}/collections/${collectionName}/points/search`, {
      method: 'POST',
      headers: {
        'api-key': apiKeys.qdrantKey,
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({
        vector: embedding,
        limit: 3, // Fewer results for top-funnel analysis
        with_payload: true,
        score_threshold: parseFloat(config.minSimilarity || '0.3')
      })
    });
    
    if (response.getResponseCode() !== 200) {
      throw new Error(`Qdrant API error: ${response.getResponseCode()}`);
    }
    
    const data = JSON.parse(response.getContentText());
    return data.result || [];
  } catch (error) {
    console.error('Error searching top-funnel content:', error);
    return [];
  }
}

/**
 * Evaluate if a combination represents a content gap for top-funnel
 */
function evaluateTopFunnelGap(combination, similarContent, config) {
  // If no similar content found, it's definitely a gap
  if (!similarContent || similarContent.length === 0) {
    return true;
  }
  
  // For top-funnel content, we're more lenient about gaps
  const threshold = parseFloat(config.minSimilarity || '0.3');
  const highestSimilarity = similarContent[0].score;
  
  // If highest similarity is below threshold, it's a gap
  if (highestSimilarity < threshold) {
    return true;
  }
  
  // Additional top-funnel specific criteria
  const topFunnelKeywords = [
    'what is', 'introduction', 'basics', 'explained', 'overview', 
    'beginners', 'guide', 'fundamentals', 'definition'
  ];
  
  const hasTopFunnelIntent = topFunnelKeywords.some(keyword => 
    combination.searchQuery.toLowerCase().includes(keyword)
  );
  
  // If this is clearly top-funnel content and similarity is moderate, still consider it a gap
  if (hasTopFunnelIntent && highestSimilarity < 0.5) {
    return true;
  }
  
  return false;
}

/**
 * Generate gap reason explanation
 */
function generateGapReason(combination, similarContent) {
  if (!similarContent || similarContent.length === 0) {
    return `No existing content found for "${combination.searchQuery}" - clear content gap`;
  }
  
  const highestSimilarity = (similarContent[0].score * 100).toFixed(1);
  return `Low similarity (${highestSimilarity}%) to existing content for "${combination.searchQuery}" - opportunity for better coverage`;
}

/**
 * Calculate opportunity score for top-funnel content gaps
 */
function calculateTopFunnelOpportunity(combination, similarContent, config) {
  let score = combination.priority || 50;
  
  // Boost score if no existing content at all
  if (!similarContent || similarContent.length === 0) {
    score += 25;
  }
  
  // Boost score for high-intent top-funnel keywords
  const highIntentKeywords = ['what is', 'how to', 'guide', 'explained', 'overview'];
  if (highIntentKeywords.some(keyword => combination.searchQuery.includes(keyword))) {
    score += 20;
  }
  
  // Boost awareness-stage content (highest value for top-funnel)
  if (combination.funnelStage === 'awareness') {
    score += 15;
  }
  
  // Boost educational content types
  if (['guide', 'explanation'].includes(combination.contentType)) {
    score += 10;
  }
  
  // Boost industry-specific content if focused
  if (config.industryFocus && config.industryFocus !== 'all') {
    score += 10;
  }
  
  return Math.min(score, 100);
}

/**
 * Generate GPT analysis for top-funnel content gaps
 */
function generateTopFunnelGapAnalysis(combination, similarContent, apiKeys) {
  if (!apiKeys.openaiKey) {
    return 'GPT analysis unavailable - API key not found';
  }
  
  try {
    const funnelStage = combination.funnelStage || 'awareness';
    const existingContentSummary = similarContent.length > 0 ? 
      `Existing content: "${similarContent[0].payload.title}" (${(similarContent[0].score * 100).toFixed(1)}% similar)` :
      'No similar existing content found';
    
    const prompt = `Analyze this top-funnel content gap opportunity:

CONTENT OPPORTUNITY: "${combination.searchQuery}"
FUNNEL STAGE: ${funnelStage}
CONTENT TYPE: ${combination.contentType}
${existingContentSummary}

Provide top-funnel content strategy analysis:

1. **AWARENESS VALUE**: Why this content attracts new visitors
2. **SEARCH INTENT**: What users are looking for when searching this
3. **BEGINNER-FRIENDLY APPROACH**: How to explain complex topics simply
4. **CONTENT STRUCTURE**: 
   - Hook and introduction
   - Core educational elements
   - Visual aids and examples
   - Clear next steps
5. **SEO OPPORTUNITY**: Primary and long-tail keywords to target
6. **TRAFFIC POTENTIAL**: Expected search volume and competition level
7. **CONVERSION PATH**: How this connects to your product/service
8. **COMPETITOR GAPS**: What existing content is missing

Focus on awareness-stage content that educates and builds trust.`;

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
            role: 'system',
            content: 'You are a content marketing expert specializing in top-funnel awareness content. Focus on educational content that attracts and informs new visitors.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.3
      })
    });
    
    if (response.getResponseCode() === 200) {
      const data = JSON.parse(response.getContentText());
      return data.choices[0].message.content;
    } else {
      return `GPT analysis failed: ${response.getResponseCode()}`;
    }
    
  } catch (error) {
    console.error('Error generating top-funnel gap analysis:', error);
    return `GPT analysis error: ${error.message}`;
  }
}

/**
 * Main top-funnel analysis function (called from HTML)
 */
function processTopFunnelAnalysis(combinations, config) {
  return analyzeTopFunnelBatch(combinations, config);
}

/**
 * Content Gap Analysis Functions
 * For the general content gap analyzer (not top-funnel specific)
 */

/**
 * Analyze a batch of content combinations for gaps (general purpose)
 */
function analyzeContentGapBatch(combinations, config) {
  const totalStart = BackendTimer.start('CONTENT_GAP_BATCH');
  
  try {
    // Get API keys from environment variables (same as similarity checker)
    const apiKeysStart = BackendTimer.start('GET_API_KEYS');
    const apiKeys = getApiKeys();
    BackendTimer.end('GET_API_KEYS', apiKeysStart);
    
    // Validate API keys
    if (!apiKeys.openaiKey || !apiKeys.qdrantUrl || !apiKeys.qdrantKey) {
      throw new Error('API credentials not set in script properties');
    }
    
    const results = [];
    
    combinations.forEach((combination, index) => {
      try {
        const gapAnalysis = analyzeContentGap(combination, config, apiKeys);
        if (gapAnalysis) {
          results.push(gapAnalysis);
        }
      } catch (error) {
        console.warn(`Failed to analyze combination ${index}:`, error);
        // Continue with other combinations
      }
    });
    
    BackendTimer.end('CONTENT_GAP_BATCH', totalStart);
    console.log(`✅ Content gap batch analysis completed: ${results.length} gaps found`);
    return results;
    
  } catch (error) {
    BackendTimer.end('CONTENT_GAP_BATCH', totalStart);
    console.error('❌ Error in content gap batch analysis:', error);
    return [];
  }
}

/**
 * Analyze a single content combination for gaps (general purpose)
 */
function analyzeContentGap(combination, config, apiKeys) {
  try {
    // Generate embedding for the search query
    const embedding = generateEmbedding(combination.searchQuery, apiKeys);
    
    // Search for similar existing content
    const collectionName = config.collection || 'filestack_blogs';
    const similarContent = searchContentGap(embedding, collectionName, apiKeys, config);
    
    // Determine if this is a gap
    const isGap = evaluateContentGap(combination, similarContent, config);
    
    if (isGap) {
      // Generate GPT analysis for the content gap
      const gptAnalysis = generateContentGapAnalysis(combination, similarContent, apiKeys);
      
      return {
        ...combination,
        isGap: true,
        existingContent: similarContent,
        gapReason: generateContentGapReason(combination, similarContent),
        opportunityScore: calculateContentGapOpportunity(combination, similarContent, config),
        gptAnalysis: gptAnalysis
      };
    }
    
    return null; // Not a gap
  } catch (error) {
    console.error(`Error analyzing content gap for ${combination.searchQuery}:`, error);
    return null;
  }
}

/**
 * Search for similar content in Qdrant (general purpose)
 */
function searchContentGap(embedding, collectionName, apiKeys, config) {
  try {
    const response = UrlFetchApp.fetch(`${apiKeys.qdrantUrl}/collections/${collectionName}/points/search`, {
      method: 'POST',
      headers: {
        'api-key': apiKeys.qdrantKey,
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({
        vector: embedding,
        limit: 5,
        with_payload: true,
        score_threshold: parseFloat(config.minSimilarity || '0.4')
      })
    });
    
    if (response.getResponseCode() !== 200) {
      throw new Error(`Qdrant API error: ${response.getResponseCode()}`);
    }
    
    const data = JSON.parse(response.getContentText());
    return data.result || [];
  } catch (error) {
    console.error('Error searching content gap:', error);
    return [];
  }
}

/**
 * Evaluate if a combination represents a content gap (general purpose)
 */
function evaluateContentGap(combination, similarContent, config) {
  // If no similar content found, it's definitely a gap
  if (!similarContent || similarContent.length === 0) {
    return true;
  }
  
  // Check similarity threshold
  const threshold = parseFloat(config.minSimilarity || '0.4');
  const highestSimilarity = similarContent[0].score;
  
  // If highest similarity is below threshold, it's a gap
  return highestSimilarity < threshold;
}

/**
 * Generate gap reason explanation (general purpose)
 */
function generateContentGapReason(combination, similarContent) {
  if (!similarContent || similarContent.length === 0) {
    return `No existing content found for "${combination.searchQuery}" - clear content gap`;
  }
  
  const highestSimilarity = (similarContent[0].score * 100).toFixed(1);
  return `Low similarity (${highestSimilarity}%) to existing content for "${combination.searchQuery}" - opportunity for specialized coverage`;
}

/**
 * Calculate opportunity score for content gaps (general purpose)
 */
function calculateContentGapOpportunity(combination, similarContent, config) {
  let score = combination.priority || 50;
  
  // Boost score if no existing content at all
  if (!similarContent || similarContent.length === 0) {
    score += 30;
  }
  
  // Boost score for high-demand combinations
  const highDemandKeywords = ['beginner', 'tutorial', 'guide', 'vs', 'best', 'optimization'];
  if (highDemandKeywords.some(keyword => combination.aspect.includes(keyword))) {
    score += 20;
  }
  
  // Boost score for trending topics
  const trendingTopics = ['React', 'Next.js', 'TypeScript', 'Docker', 'Kubernetes', 'AWS'];
  if (trendingTopics.includes(combination.topic)) {
    score += 15;
  }
  
  // Boost for technical implementation content
  if (['performance optimization', 'security best practices', 'deployment'].includes(combination.aspect)) {
    score += 15;
  }
  
  return Math.min(score, 100);
}

/**
 * Generate GPT analysis for content gaps
 */
function generateContentGapAnalysis(combination, similarContent, apiKeys) {
  if (!apiKeys.openaiKey) {
    return 'GPT analysis unavailable - API key not found';
  }
  
  try {
    const topic = combination.topic || combination.searchQuery;
    const aspect = combination.aspect || 'general content';
    const existingContentSummary = similarContent.length > 0 ? 
      `Existing content: "${similarContent[0].payload.title}" (${(similarContent[0].score * 100).toFixed(1)}% similar)` :
      'No similar existing content found';
    
    const prompt = `Analyze this content gap opportunity for ${combination.topicCategory || 'technical'} content:

CONTENT OPPORTUNITY: "${combination.searchQuery}"
TOPIC: ${topic}
ASPECT: ${aspect}
${existingContentSummary}

Provide actionable content strategy analysis:

1. **CONTENT OPPORTUNITY**: Why this is a valuable gap to fill
2. **TARGET AUDIENCE**: Who would benefit from this content  
3. **CONTENT ANGLE**: Unique approach to differentiate from existing content
4. **KEY TOPICS TO COVER**: 
   - Main concept explanations
   - Practical implementation details
   - Common use cases and examples
   - Best practices and tips
5. **CONTENT FORMAT**: Recommended format (tutorial, guide, comparison, etc.)
6. **COMPETITIVE ADVANTAGE**: How this content positions you vs competitors
7. **SEO POTENTIAL**: Search intent and keyword opportunities

Be specific and actionable for content creators.`;

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
            role: 'system',
            content: 'You are a content strategy expert specializing in technical content for developers and businesses. Provide concise, actionable analysis.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.3
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

/**
 * HTML Service functions for navigation between tools
 * These functions allow the frontend to switch between different analysis tools
 */

/**
 * Returns the main similarity checker HTML
 */
function getSimilarityCheckerHtml() {
  const htmlTemplate = HtmlService.createTemplateFromFile('index');
  return htmlTemplate.evaluate().getContent();
}

/**
 * Returns the content gap analyzer HTML
 */
function getContentGapAnalyzerHtml() {
  const htmlTemplate = HtmlService.createTemplateFromFile('content-gap-analyzer');
  return htmlTemplate.evaluate().getContent();
}

/**
 * Returns the top-funnel analyzer HTML
 */
function getTopFunnelAnalyzerHtml() {
  const htmlTemplate = HtmlService.createTemplateFromFile('top-funnel-analyzer');
  return htmlTemplate.evaluate().getContent();
}