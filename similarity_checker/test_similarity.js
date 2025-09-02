// Test script for improved similarity detection
// You can run this in Google Apps Script console or browser console

function testSimilarityDetection() {
  console.log("🧪 Testing Improved Similarity Detection Algorithm");
  
  const draftText = `
    How to Build Modern Web Applications with Rich Text Editors
    
    Rich text editors are essential components in modern web applications. They allow users to format text with bold, italic, underlines, and create lists. When building a web application, choosing the right rich text editor is crucial for user experience.
    
    Key features to consider:
    - Real-time collaboration
    - Custom styling options  
    - Mobile responsiveness
    - Performance optimization
    
    Implementation best practices include proper sanitization of user input, efficient DOM manipulation, and cross-browser compatibility testing.
  `;

  const similarText = `
    Building Rich Text Editors for Web Applications
    
    Modern web applications require sophisticated rich text editors that enable users to format content with bold, italic, underlines, and list creation. Selecting the appropriate rich text editor is vital for optimal user experience in web development.
    
    Important considerations:
    - Collaborative editing capabilities
    - Customizable styling features
    - Mobile-friendly design
    - Speed and performance
    
    Best practices for implementation involve input sanitization, DOM optimization, and comprehensive browser compatibility checks.
  `;

  // Test the improved comparison function
  const result = createWordComparison(draftText, similarText);
  
  console.log("📊 Test Results:");
  console.log(`Found ${result.sectionMatches.length} similar sections`);
  console.log(`Metrics:`, result.metrics);
  
  if (result.sectionMatches.length > 0) {
    console.log("\n🔍 Similar Sections Found:");
    result.sectionMatches.forEach((match, index) => {
      console.log(`\n--- Section Match #${index + 1} ---`);
      console.log(`Type: ${match.type}`);
      console.log(`Importance: ${match.importance}`);
      console.log(`Similarity: ${(match.similarity * 100).toFixed(1)}%`);
      
      if (match.type === 'exact_phrase') {
        console.log(`Draft Phrase: "${match.draftText}"`);
        console.log(`Similar Phrase: "${match.similarText}"`);
        console.log(`Word Count: ${match.wordCount}`);
      } else if (match.type === 'semantic_section') {
        console.log(`Draft Section: "${match.draftSection.substring(0, 100)}..."`);
        console.log(`Similar Section: "${match.similarSection.substring(0, 100)}..."`);
        console.log(`Common Concepts: ${match.commonConcepts.join(', ')}`);
      } else if (match.type === 'structural_pattern') {
        console.log(`Pattern Type: ${match.pattern}`);
        console.log(`Draft Text: "${match.draftText.substring(0, 100)}..."`);
        console.log(`Similar Text: "${match.similarText.substring(0, 100)}..."`);
      }
    });
  }
  
  // Test individual components
  console.log("\n🔧 Component Tests:");
  
  // Test exact phrase detection
  const phrases = findExactPhraseMatches(
    draftText.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim(),
    similarText.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim(),
    3, 10
  );
  console.log(`✅ Exact phrases found: ${phrases.length}`);
  phrases.forEach(phrase => {
    console.log(`  - "${phrase.draftText}" (${phrase.wordCount} words, ${(phrase.similarity * 100).toFixed(1)}% similar)`);
  });
  
  // Test semantic sections
  const sections = findSemanticSectionMatches(
    draftText.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim(),
    similarText.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim()
  );
  console.log(`✅ Semantic sections found: ${sections.length}`);
  sections.forEach(section => {
    console.log(`  - ${(section.similarity * 100).toFixed(1)}% similar section (${section.wordCount} words)`);
  });
  
  // Test structural patterns
  const patterns = findStructuralPatternMatches(draftText, similarText);
  console.log(`✅ Structural patterns found: ${patterns.length}`);
  patterns.forEach(pattern => {
    console.log(`  - ${pattern.pattern} pattern (${(pattern.similarity * 100).toFixed(1)}% similar)`);
  });
  
  console.log("\n🎉 Test completed successfully!");
  return result;
}

// Example usage
if (typeof window !== 'undefined') {
  // Browser environment - you can run testSimilarityDetection() in console
  window.testSimilarityDetection = testSimilarityDetection;
} else {
  // Apps Script environment
  testSimilarityDetection();
}