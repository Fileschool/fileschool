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
3. **RISK LEVEL**: High/Medium/Low duplicate content risk
4. **RECOMMENDATIONS**: Specific rewrite suggestions

Be specific about overlapping content but keep response under 2000 characters.`;
      
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
                     max_tokens: 80000, // Increased to 80K tokens for comprehensive analysis
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

/**
 * Create word-by-word comparison between draft and similar article
 * Highlights exact matches and similar phrases
 */
function createWordComparison(draftText, similarText) {
  try {
    // Clean and normalize both texts
    const cleanDraft = draftText.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
    const cleanSimilar = similarText.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
    
    // Split into words
    const draftWords = cleanDraft.split(' ');
    const similarWords = cleanSimilar.split(' ');
    
    // Find exact word matches
    const exactMatches = [];
    const draftWordSet = new Set(draftWords);
    
    similarWords.forEach((word, index) => {
      if (draftWordSet.has(word) && word.length > 3) {
        exactMatches.push({
          word: word,
          position: index,
          type: 'exact'
        });
      }
    });
    
    // Find phrase matches (3+ consecutive words)
    const phraseMatches = [];
    for (let i = 0; i <= draftWords.length - 3; i++) {
      for (let j = 0; j <= similarWords.length - 3; j++) {
        const draftPhrase = draftWords.slice(i, i + 3).join(' ');
        const similarPhrase = similarWords.slice(j, j + 3).join(' ');
        
        if (draftPhrase === similarPhrase && draftPhrase.length > 10) {
          phraseMatches.push({
            phrase: draftPhrase,
            draftStart: i,
            similarStart: j,
            type: 'phrase'
          });
        }
      }
    }
    
    // Calculate similarity metrics
    const totalDraftWords = draftWords.length;
    const totalSimilarWords = similarWords.length;
    const matchingWords = exactMatches.length;
    const matchingPhrases = phraseMatches.length;
    
    const wordSimilarity = (matchingWords / Math.max(totalDraftWords, totalSimilarWords)) * 100;
    const phraseSimilarity = (matchingPhrases / Math.max(totalDraftWords, totalSimilarWords)) * 100;
    
    return {
      exactMatches: exactMatches.slice(0, 100), // Limit to first 100 matches
      phraseMatches: phraseMatches.slice(0, 50), // Limit to first 50 phrases
      metrics: {
        totalDraftWords,
        totalSimilarWords,
        matchingWords,
        matchingPhrases,
        wordSimilarity: wordSimilarity.toFixed(1),
        phraseSimilarity: phraseSimilarity.toFixed(1)
      }
    };
    
  } catch (error) {
    console.error('Error creating word comparison:', error);
    return {
      exactMatches: [],
      phraseMatches: [],
      metrics: {
        totalDraftWords: 0,
        totalSimilarWords: 0,
        matchingWords: 0,
        matchingPhrases: 0,
        wordSimilarity: '0.0',
        phraseSimilarity: '0.0'
      }
    };
  }
}

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
     let wordComparison = null;
     if (similarBlogs.length > 0) {
       const topSimilarContent = similarBlogs[0].payload.content || '';
       similarKeywords = extractKeywords(topSimilarContent);
       
       // Create word-by-word comparison for top article
       const comparisonStart = BackendTimer.start('WORD_COMPARISON');
       wordComparison = createWordComparison(draftText, topSimilarContent);
       BackendTimer.end('WORD_COMPARISON', comparisonStart);
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
    
         // Format results - keep full content for GPT analysis but truncate for display
     const results = {
       recommendations: recommendations,
       draftKeywords: draftKeywords,
       similarKeywords: similarKeywords,
       wordComparison: wordComparison, // Add word-by-word comparison
       gptAnalyses: gptAnalyses,
      similarBlogs: similarBlogs.map(blog => {
        const content = blog.payload.content || '';
        // Keep full content for accurate analysis, truncate only for UI display
        const displayContent = content.length > 3000 ? 
          content.substring(0, 3000) + '... (content truncated for display)' : content;
        
        return {
          title: blog.payload.title || 'Untitled',
          url: blog.payload.url || '',
          similarity: (blog.score * 100).toFixed(1),
          description: blog.payload.description || '',
          categories: blog.payload.categories || [],
          content: displayContent, // Only UI display is truncated
          fullContent: content, // Keep full content for potential future analysis
          keywords: extractKeywords(content, 5)
        };
      }),
      source: source,
      totalChecked: similarBlogs.length
    };
    
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