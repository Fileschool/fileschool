/**
 * Netlify function to analyze similarity using OpenAI GPT
 * Uses environment variables for API keys
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
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'OpenAI API key not configured' })
      };
    }

    // Parse request body
    const { draftText, blog, similarity } = JSON.parse(event.body);
    
    if (!draftText || !blog) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Draft text and blog data are required' })
      };
    }

    const fullBlogContent = blog.payload?.content || 'No content available';
    
    const prompt = `You are an expert content analyst. Analyze the similarity between this draft content and an existing blog post.

DRAFT CONTENT (${draftText.length} characters):
${draftText}

EXISTING BLOG:
Title: ${blog.payload?.title || 'Untitled'}
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

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
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
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ error: `OpenAI API error: ${response.status}` })
      };
    }

    const data = await response.json();
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        analysis: data.choices[0].message.content,
        usage: data.usage
      })
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