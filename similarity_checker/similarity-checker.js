/**
 * Browser JavaScript version of the Blog Similarity Checker
 * Converted from Apps Script for GitHub Pages hosting
 */

// API Configuration - loaded from the main HTML file via localStorage
// Use window.window.CONFIG directly since it's set in the HTML file

/**
 * Performance timing for browser environment
 */
const BrowserTimer = {
  start(label) {
    const startTime = performance.now();
    console.log(`⏱️ [BROWSER START] ${label} at ${startTime}`);
    return startTime;
  },
  end(label, startTime) {
    const endTime = performance.now();
    const elapsed = endTime - startTime;
    console.log(`⏱️ [BROWSER END] ${label}: ${elapsed.toFixed(2)}ms`);
    return elapsed;
  }
};

/**
 * Generate comprehensive similarity analysis using GPT-4o-mini
 */
async function analyzeSimilarityWithGPT(draftText, similarBlogs) {
  if (!window.CONFIG.OPENAI_API_KEY || window.CONFIG.OPENAI_API_KEY === 'your-openai-api-key-here') {
    throw new Error('OpenAI API key not configured');
  }
  
  try {
    // Analyze each similar blog individually for detailed insights
    const detailedAnalyses = [];
    
    // Process in parallel for better performance
    const analysisPromises = [];
    
    for (let i = 0; i < Math.min(similarBlogs.length, 3); i++) {
      const blog = similarBlogs[i];
      const similarity = (blog.score * 100).toFixed(1);
      
      // Use the full content from the vector search results
      const fullBlogContent = blog.payload.content || 'No content available';
      
      const prompt = `You are an expert content analyst. Analyze the similarity between this draft content and an existing blog post.

DRAFT CONTENT (${draftText.length} characters):
${draftText}

EXISTING BLOG:
Title: ${blog.payload.title || 'Untitled'}
Similarity Score: ${similarity}%
Full Content (${fullBlogContent.length} characters):
${fullBlogContent}

Provide a comprehensive analysis with:

1. **OVERALL ASSESSMENT**: Why are these ${similarity}% similar? What's the core overlap?

2. **SECTION-BY-SECTION BREAKDOWN**: 
   - Introduction: How similar are the opening paragraphs? Quote specific overlapping text.
   - Main Content: Which specific sections/paragraphs overlap? Show exact matches.
   - Conclusion: How similar are the endings? Quote overlapping conclusions.

3. **EXACT OVERLAPS**: 
   - Copy and paste the exact phrases, sentences, or paragraphs that are too similar
   - Highlight which parts of your draft match which parts of the existing blog
   - Be specific about word-for-word matches vs. paraphrased content

4. **UNIQUE ELEMENTS**: What makes the draft different from the existing blog?

5. **ACTIONABLE RECOMMENDATIONS**: 
   - For each overlapping section, provide specific rewrite suggestions
   - Suggest alternative approaches, different examples, or unique angles

6. **RISK ASSESSMENT**: High/Medium/Low risk of being flagged as duplicate content

7. **CONTENT LENGTH ANALYSIS**: How does the draft length compare to the existing blog?

IMPORTANT: Since this is ${similarity}% similar, focus on finding and quoting the actual overlapping content. Don't just summarize - show the specific text that's too similar.`;

      // Log what GPT-4o-mini will analyze
      console.log(`\n🤖 === GPT-4O-MINI ANALYSIS INPUT for Blog ${i + 1} ===`);
      console.log(`📄 Blog Title: ${blog.payload.title || 'Untitled'}`);
      console.log(`🎯 Vector Similarity Score: ${similarity}%`);
      console.log(`📝 Draft Text Length: ${draftText.length} characters`);
      console.log(`📚 Blog Content Length: ${fullBlogContent.length} characters`);
      console.log(`\n📋 FULL DRAFT TEXT BEING ANALYZED:`);
      console.log(`"${draftText}"`);
      console.log(`\n📋 FULL BLOG CONTENT BEING ANALYZED:`);
      console.log(`"${fullBlogContent}"`);
      console.log(`\n🔍 GPT PROMPT BEING SENT (${prompt.length} chars):`);
      console.log(`"${prompt}"`);
      console.log('🤖 === END GPT INPUT ===\n');

      console.log(`🚀 Sending GPT request for Blog ${i + 1}...`);
      
      // Create promise for this analysis
      const analysisPromise = fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${window.CONFIG.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are an expert content analyst specializing in detecting content similarity and providing actionable recommendations for content uniqueness. You have access to the full content of both the draft and existing blogs, so provide detailed, specific analysis with concrete examples.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 4000,
          temperature: 0.2
        })
      }).then(async response => {
        if (response.ok) {
          const data = await response.json();
          const analysis = data.choices[0].message.content;
          
          // Log GPT response details
          console.log(`\n✅ === GPT-4O-MINI RESPONSE for Blog ${i + 1} ===`);
          console.log(`📊 Response Code: ${response.status}`);
          console.log(`📝 Analysis Length: ${analysis.length} characters`);
          console.log(`🔍 Token Usage: Input: ${data.usage?.prompt_tokens || 'N/A'}, Output: ${data.usage?.completion_tokens || 'N/A'}, Total: ${data.usage?.total_tokens || 'N/A'}`);
          console.log(`\n📋 FULL GPT ANALYSIS RESPONSE:`);
          console.log(`"${analysis}"`);
          console.log('✅ === END GPT RESPONSE ===\n');
          
          return {
            blogTitle: blog.payload.title || 'Untitled',
            similarity: similarity,
            analysis: analysis,
            contentLength: fullBlogContent.length,
            draftLength: draftText.length
          };
        } else {
          const errorResponse = await response.text();
          console.log(`\n❌ === GPT ERROR for Blog ${i + 1} ===`);
          console.log(`📊 Response Code: ${response.status}`);
          console.log(`❌ Error Response: ${errorResponse}`);
          console.log('❌ === END GPT ERROR ===\n');
          
          return {
            blogTitle: blog.payload.title || 'Untitled',
            similarity: similarity,
            analysis: `Analysis failed for this blog post. Error: ${response.status} - ${errorResponse}`,
            contentLength: fullBlogContent.length,
            draftLength: draftText.length
          };
        }
      });
      
      analysisPromises.push(analysisPromise);
    }
    
    // Wait for all analyses to complete in parallel
    const results = await Promise.all(analysisPromises);
    return results;
    
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
async function generateEmbedding(text) {
  if (!window.CONFIG.OPENAI_API_KEY || window.CONFIG.OPENAI_API_KEY === 'your-openai-api-key-here') {
    throw new Error('OpenAI API key not configured');
  }
  
  try {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${window.CONFIG.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'text-embedding-3-large',
        input: text
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    return data.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw new Error(`Failed to generate embedding: ${error.message}`);
  }
}

/**
 * Search for similar vectors in Qdrant
 */
async function searchSimilarBlogs(embedding, source = 'filestack', topK = 5) {
  if (!window.CONFIG.QDRANT_URL || window.CONFIG.QDRANT_URL === 'your-qdrant-url-here' || 
      !window.CONFIG.QDRANT_API_KEY || window.CONFIG.QDRANT_API_KEY === 'your-qdrant-api-key-here') {
    throw new Error('Qdrant credentials not configured');
  }
  
  const collectionName = source === 'filestack' ? 'filestack_blogs' : 'froala_blogs';
  
  try {
    const response = await fetch(window.CONFIG.QDRANT_URL, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'api-key': window.CONFIG.QDRANT_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        vector: embedding,
        limit: topK,
        with_payload: true,
        collection: collectionName
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Qdrant API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    return data.result || [];
  } catch (error) {
    console.error('Error searching Qdrant:', error);
    throw new Error(`Failed to search similar blogs: ${error.message}`);
  }
}

/**
 * Extract keywords from text (simple implementation)
 */
function extractKeywords(text, topN = 10) {
  // Simple keyword extraction - remove common words and count frequency
  const stopWords = new Set(['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those', 'a', 'an']);
  
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
 * Main function to check blog similarity
 */
async function checkBlogSimilarity(draftText, source = 'filestack') {
  const totalStart = BrowserTimer.start('TOTAL_BACKEND');
  
  try {
    // Validate configuration
    if (!window.CONFIG.OPENAI_API_KEY || window.CONFIG.OPENAI_API_KEY === 'your-openai-api-key-here') {
      throw new Error('OpenAI API key not configured. Please set your API key in the window.CONFIG object.');
    }
    
    if (!window.CONFIG.QDRANT_URL || window.CONFIG.QDRANT_URL === 'your-qdrant-url-here' || 
        !window.CONFIG.QDRANT_API_KEY || window.CONFIG.QDRANT_API_KEY === 'your-qdrant-api-key-here') {
      throw new Error('Qdrant credentials not configured. Please set your Qdrant URL and API key in the window.CONFIG object.');
    }
    
    // Generate embedding for draft
    const embeddingStart = BrowserTimer.start('GENERATE_EMBEDDING');
    const draftEmbedding = await generateEmbedding(draftText);
    BrowserTimer.end('GENERATE_EMBEDDING', embeddingStart);
    
    // Search for similar blogs
    const searchStart = BrowserTimer.start('SEARCH_SIMILAR_BLOGS');
    const similarBlogs = await searchSimilarBlogs(draftEmbedding, source, 10);
    BrowserTimer.end('SEARCH_SIMILAR_BLOGS', searchStart);
    
    // Log the Qdrant results to see what content we're working with
    console.log('=== QDRANT SEARCH RESULTS ===');
    console.log(`Found ${similarBlogs.length} similar blogs`);
    
    if (similarBlogs.length > 0) {
        const topBlog = similarBlogs[0];
        console.log('=== TOP SIMILAR BLOG (Most Similar) ===');
        console.log(`Title: ${topBlog.payload.title || 'Untitled'}`);
        console.log(`Similarity Score: ${(topBlog.score * 100).toFixed(1)}%`);
        console.log(`Content Length: ${(topBlog.payload.content || '').length} characters`);
        console.log(`Full Content: ${topBlog.payload.content || 'No content'}`);
        console.log('=== END TOP BLOG CONTENT ===');
    }
    
    // Extract keywords from draft
    const keywordStart = BrowserTimer.start('EXTRACT_KEYWORDS');
    const draftKeywords = extractKeywords(draftText);
    
    // Extract keywords from similar articles
    const allSimilarContent = similarBlogs.map(blog => blog.payload.content || '').join(' ');
    const similarKeywords = extractKeywords(allSimilarContent);
    BrowserTimer.end('EXTRACT_KEYWORDS', keywordStart);
    
    // Generate recommendations
    const recStart = BrowserTimer.start('GENERATE_RECOMMENDATIONS');
    const recommendations = generateRecommendations(similarBlogs);
    BrowserTimer.end('GENERATE_RECOMMENDATIONS', recStart);
    
    // Get comprehensive GPT analysis ONLY for top 3 most similar blogs for performance
    let gptAnalyses = [];
    try {
      const gptStart = BrowserTimer.start('GPT_ANALYSIS');
      const topBlogs = similarBlogs.slice(0, 3); // ONLY analyze top 3 highest similarity scores
      console.log(`🎯 Running GPT analysis on top ${topBlogs.length} blogs only (out of ${similarBlogs.length} total)`);
      gptAnalyses = await analyzeSimilarityWithGPT(draftText, topBlogs);
      BrowserTimer.end('GPT_ANALYSIS', gptStart);
    } catch (error) {
      console.warn('GPT analysis failed, continuing with basic analysis:', error);
      gptAnalyses = [];
    }
    
    // Format results - keep full content for GPT analysis but truncate for display
    const results = {
      recommendations: recommendations,
      draftKeywords: draftKeywords,
      similarKeywords: similarKeywords,
      gptAnalyses: gptAnalyses,
      similarBlogs: similarBlogs.map(blog => {
        const content = blog.payload.content || '';
        // Keep full content for accurate analysis, truncate only for UI display
        const displayContent = content.length > 2000 ? 
          content.substring(0, 2000) + '... (content truncated for display)' : content;
        
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
    
    BrowserTimer.end('TOTAL_BACKEND', totalStart);
    console.log('✅ Similarity check completed successfully:', results);
    return results;
    
  } catch (error) {
    BrowserTimer.end('TOTAL_BACKEND', totalStart);
    console.error('❌ Error checking similarity:', error);
    return {
      error: error.message || 'Unknown error occurred'
    };
  }
}

/**
 * Function to be called from HTML (replaces Apps Script processSimilarityCheck)
 */
window.processSimilarityCheck = async function(draftText, source) {
  return await checkBlogSimilarity(draftText, source);
};