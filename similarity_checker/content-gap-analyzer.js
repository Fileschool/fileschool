/**
 * Content Gap Analyzer - AI-Powered SEO Content Strategy Tool
 * Analyzes your content database to find untapped opportunities
 */

// Topic Taxonomy - Froala & Filestack Industry Focus
const TOPIC_TAXONOMY = {
    // Rich Text Editors & WYSIWYG (Froala's core domain)
    rich_text_editors: [
        "rich text editor", "WYSIWYG editor", "HTML editor", "text editor",
        "content editor", "visual editor", "inline editing", "markdown editor",
        "code editor", "syntax highlighting", "text formatting", "editor plugins",
        "content management", "document editing", "collaborative editing",
        "real-time editing", "editor customization", "editor themes",
        "editor toolbar", "text manipulation", "content creation tools"
    ],
    
    // File Management & Upload (Filestack's core domain)
    file_management: [
        "file upload", "file picker", "file storage", "file transformation",
        "image upload", "video upload", "document management", "asset management",
        "file processing", "image processing", "file conversion", "CDN",
        "cloud storage", "file delivery", "file optimization", "image optimization",
        "file security", "upload widget", "drag and drop upload", "bulk upload",
        "file compression", "image resizing", "thumbnail generation"
    ],
    
    // Web Development (common ground for both)
    web_development: [
        "JavaScript", "HTML", "CSS", "React", "Vue", "Angular", "jQuery",
        "TypeScript", "Node.js", "API integration", "SDK", "plugin development",
        "widget integration", "responsive design", "mobile optimization",
        "progressive web apps", "single page applications", "component libraries",
        "UI frameworks", "frontend frameworks", "web components"
    ],
    
    // Content Management Systems
    cms_platforms: [
        "WordPress", "Drupal", "Joomla", "Shopify", "Magento", "WooCommerce",
        "Squarespace", "Wix", "Ghost", "Strapi", "Contentful", "Sanity",
        "headless CMS", "content management", "blog platforms", "e-commerce platforms",
        "website builders", "CMS integration", "content publishing", "editorial workflow"
    ],
    
    // Developer Tools & Integration
    developer_tools: [
        "SDK", "API", "webhook", "plugin", "extension", "integration",
        "npm package", "composer package", "CDN integration", "third-party integration",
        "authentication", "authorization", "CORS", "CSRF protection",
        "rate limiting", "error handling", "debugging", "testing", "documentation"
    ],
    
    // User Experience & Design
    user_experience: [
        "user interface", "user experience", "UX design", "UI design",
        "accessibility", "usability", "responsive design", "mobile-first design",
        "cross-browser compatibility", "performance optimization", "loading speed",
        "user workflow", "drag and drop", "keyboard shortcuts", "touch gestures"
    ],
    
    // Business & Industry Use Cases
    business_applications: [
        "content marketing", "blogging", "e-commerce", "digital asset management",
        "document management", "collaboration tools", "productivity tools",
        "enterprise software", "SaaS applications", "web applications",
        "mobile applications", "customer portals", "admin dashboards",
        "editorial systems", "publishing platforms", "media management"
    ],
    
    // Technical Implementation
    technical_implementation: [
        "performance optimization", "security", "scalability", "load balancing",
        "caching", "database optimization", "server-side rendering", "client-side rendering",
        "lazy loading", "code splitting", "bundling", "minification",
        "compression", "image optimization", "video optimization", "SEO optimization"
    ]
};

const CONTENT_ASPECTS = {
    // Editor & Upload Performance
    performance: [
        "loading performance", "editor performance", "upload speed optimization",
        "file processing speed", "image optimization", "lazy loading",
        "caching strategies", "CDN performance", "bundle size optimization",
        "memory usage", "browser performance", "mobile performance"
    ],
    
    // Security & Privacy
    security: [
        "file upload security", "XSS prevention", "CSRF protection", 
        "secure file handling", "virus scanning", "malware detection",
        "access control", "data encryption", "privacy compliance",
        "GDPR compliance", "content sanitization", "authentication"
    ],
    
    // Integration & Implementation
    integration: [
        "WordPress integration", "React integration", "Vue integration",
        "Angular integration", "API integration", "SDK implementation",
        "plugin development", "widget customization", "third-party integration",
        "CMS integration", "headless CMS setup", "webhook integration"
    ],
    
    // User Experience & Design
    user_experience: [
        "user interface design", "accessibility features", "mobile responsiveness",
        "drag and drop functionality", "keyboard shortcuts", "user workflow",
        "customization options", "theming", "responsive design",
        "cross-browser compatibility", "touch interface", "user onboarding"
    ],
    
    // Development & Setup
    development: [
        "setup guide", "installation", "configuration", "getting started",
        "quick start", "implementation guide", "customization tutorial",
        "developer documentation", "code examples", "boilerplate code",
        "project setup", "environment setup", "troubleshooting"
    ],
    
    // Feature Comparisons
    comparison: [
        "vs alternatives", "feature comparison", "pricing comparison",
        "pros and cons", "migration guide", "evaluation criteria",
        "vendor comparison", "cost analysis", "ROI analysis",
        "decision guide", "selection criteria", "benchmark comparison"
    ],
    
    // Skill Level & Learning
    learning: [
        "beginner tutorial", "advanced techniques", "best practices",
        "common mistakes", "troubleshooting guide", "FAQs",
        "tips and tricks", "expert advice", "case studies",
        "real-world examples", "use cases", "implementation patterns"
    ],
    
    // Business & Strategy
    business: [
        "business benefits", "use cases", "industry applications",
        "enterprise features", "team collaboration", "workflow optimization",
        "productivity improvement", "cost savings", "scalability",
        "ROI benefits", "implementation strategy", "adoption guide"
    ],
    
    // Technical Deep Dives
    technical: [
        "architecture overview", "technical specifications", "API reference",
        "advanced configuration", "custom development", "extension development",
        "performance tuning", "scaling strategies", "optimization techniques",
        "technical requirements", "system architecture", "data flow"
    ],
    
    // Industry Specific
    industry_specific: [
        "e-commerce implementation", "content marketing use", "blog integration",
        "documentation systems", "educational platforms", "media management",
        "publishing workflows", "editorial systems", "collaborative editing",
        "content creation tools", "digital asset management", "customer portals"
    ]
};

// Global variables for analysis state
let analysisResults = [];
let currentConfig = {};
let topicCategories = [];

/**
 * Initialize the application
 */
document.addEventListener('DOMContentLoaded', function() {
    // Populate topic filter dropdown
    populateFilters();
    
    // Load saved configuration
    loadSavedConfig();
});

/**
 * Populate filter dropdowns with taxonomy data
 */
function populateFilters() {
    const topicFilter = document.getElementById('topicFilter');
    const aspectFilter = document.getElementById('aspectFilter');
    
    // Add topic categories to filter
    Object.keys(TOPIC_TAXONOMY).forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        topicFilter.appendChild(option);
    });
    
    // Add aspect categories to filter
    Object.keys(CONTENT_ASPECTS).forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        aspectFilter.appendChild(option);
    });
}

/**
 * Load saved configuration from localStorage
 */
function loadSavedConfig() {
    const saved = localStorage.getItem('contentGapConfig');
    if (saved) {
        const config = JSON.parse(saved);
        const source = config.source || 'filestack';
        
        // Set radio button selection
        document.getElementById('filestack').checked = (source === 'filestack');
        document.getElementById('froala').checked = (source === 'froala');
        
        // Update visual selection
        document.querySelectorAll('.radio-group').forEach(group => {
            group.classList.remove('selected');
        });
        
        if (source === 'froala') {
            document.querySelector('.radio-group:nth-child(2)').classList.add('selected');
        } else {
            document.querySelector('.radio-group:nth-child(1)').classList.add('selected');
        }
        
        document.getElementById('analysisDepth').value = config.analysisDepth || 'standard';
        document.getElementById('minSimilarity').value = config.minSimilarity || '0.4';
        
        // Update theme
        updateTheme(source);
    }
}

/**
 * Save current configuration to localStorage
 */
function saveCurrentConfig() {
    const source = document.querySelector('input[name="source"]:checked')?.value || 'filestack';
    const config = {
        source: source,
        collection: source === 'froala' ? 'froala_blogs' : 'filestack_blogs',
        analysisDepth: document.getElementById('analysisDepth').value,
        minSimilarity: document.getElementById('minSimilarity').value
    };
    localStorage.setItem('contentGapConfig', JSON.stringify(config));
    return config;
}

/**
 * Handle source selection
 */
function selectSource(source) {
    // Update radio buttons
    document.getElementById('filestack').checked = (source === 'filestack');
    document.getElementById('froala').checked = (source === 'froala');
    
    // Update visual selection
    document.querySelectorAll('.radio-group').forEach(group => {
        group.classList.remove('selected');
    });
    event.target.closest('.radio-group').classList.add('selected');
    
    // Update theme based on source
    updateTheme(source);
}

/**
 * Update theme colors based on selected source
 */
function updateTheme(source) {
    const body = document.body;
    if (source === 'froala') {
        body.classList.add('froala-theme');
    } else {
        body.classList.remove('froala-theme');
    }
}

/**
 * Generate topic-aspect combinations for gap analysis
 */
function generateTopicAspectCombinations(depth = 'standard') {
    const combinations = [];
    const limits = {
        quick: 10,
        standard: 50,
        comprehensive: Infinity
    };
    
    const limit = limits[depth] || 50;
    let count = 0;
    
    // Generate combinations from taxonomy
    for (const [topicCategory, topics] of Object.entries(TOPIC_TAXONOMY)) {
        for (const [aspectCategory, aspects] of Object.entries(CONTENT_ASPECTS)) {
            for (const topic of topics) {
                for (const aspect of aspects) {
                    if (count >= limit) return combinations;
                    
                    combinations.push({
                        topic,
                        aspect,
                        topicCategory,
                        aspectCategory,
                        searchQuery: `${topic} ${aspect}`,
                        priority: calculateCombinationPriority(topic, aspect, topicCategory, aspectCategory)
                    });
                    count++;
                }
            }
        }
    }
    
    // Sort by priority (high to low)
    return combinations.sort((a, b) => b.priority - a.priority);
}

/**
 * Calculate priority score for topic-aspect combinations
 */
function calculateCombinationPriority(topic, aspect, topicCategory, aspectCategory) {
    let priority = 50; // Base priority
    
    // High-value topics
    const highValueTopics = ['React', 'Vue', 'Angular', 'Node.js', 'Python', 'AWS', 'Docker', 'Kubernetes'];
    if (highValueTopics.includes(topic)) priority += 20;
    
    // High-value aspects
    const highValueAspects = ['performance optimization', 'security best practices', 'beginner guide', 'vs alternatives'];
    if (highValueAspects.some(hva => aspect.includes(hva))) priority += 20;
    
    // Category combinations that work well together
    const goodCombinations = {
        frontend: ['performance', 'security', 'testing', 'skillLevel'],
        backend: ['performance', 'security', 'deployment', 'comparison'],
        cloud: ['deployment', 'security', 'business', 'comparison']
    };
    
    if (goodCombinations[topicCategory]?.includes(aspectCategory)) {
        priority += 15;
    }
    
    return Math.min(priority, 100); // Cap at 100
}

// Content gap analysis is now handled by Apps Script backend

/**
 * Calculate opportunity score for content gaps
 */
function calculateOpportunityScore(combination, existingContent) {
    let score = combination.priority;
    
    // Boost score if no existing content at all
    if (existingContent.length === 0) {
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
    
    return Math.min(score, 100);
}

/**
 * Main function to start gap analysis
 */
async function startGapAnalysis() {
    // Save configuration (API keys come from Apps Script environment)
    const config = saveCurrentConfig();
    currentConfig = config;
    
    // Show loading state
    showLoadingState();
    
    try {
        // Generate topic-aspect combinations
        updateLoadingStatus('Generating topic combinations...');
        const combinations = generateTopicAspectCombinations(config.analysisDepth);
        
        updateLoadingStatus(`Analyzing ${combinations.length} combinations for content gaps...`);
        
        // Analyze gaps in batches using Apps Script
        const batchSize = 10;
        const gaps = [];
        
        for (let i = 0; i < combinations.length; i += batchSize) {
            const batch = combinations.slice(i, i + batchSize);
            updateLoadingStatus(`Analyzing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(combinations.length/batchSize)}...`);
            
            // Process batch using Apps Script function
            try {
                const batchResults = await new Promise((resolve, reject) => {
                    google.script.run
                        .withSuccessHandler(resolve)
                        .withFailureHandler(reject)
                        .processContentGapAnalysis(batch, config);
                });
                
                // Collect gaps
                if (batchResults && Array.isArray(batchResults)) {
                    batchResults.forEach(result => {
                        if (result && result.isGap) {
                            gaps.push(result);
                        }
                    });
                }
            } catch (error) {
                console.warn(`Batch ${Math.floor(i/batchSize) + 1} failed:`, error);
                // Continue with other batches
            }
            
            // Add delay to respect rate limits
            if (i + batchSize < combinations.length) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        
        // Store results and display
        analysisResults = gaps;
        displayGapResults(gaps);
        
    } catch (error) {
        console.error('Gap analysis failed:', error);
        hideLoadingState();
        alert(`Analysis failed: ${error.message}`);
    }
}

/**
 * Display gap analysis results
 */
function displayGapResults(gaps) {
    hideLoadingState();
    
    // Show results section
    document.getElementById('resultsSection').style.display = 'block';
    document.getElementById('filterSection').style.display = 'block';
    
    // Update statistics
    updateResultStatistics(gaps);
    
    // Display gap cards
    renderGapCards(gaps);
}

/**
 * Update result statistics
 */
function updateResultStatistics(gaps) {
    const stats = {
        total: gaps.length,
        high: gaps.filter(g => g.opportunityScore >= 80).length,
        medium: gaps.filter(g => g.opportunityScore >= 60 && g.opportunityScore < 80).length,
        low: gaps.filter(g => g.opportunityScore < 60).length
    };
    
    document.getElementById('totalGaps').textContent = stats.total;
    document.getElementById('highPriorityGaps').textContent = stats.high;
    document.getElementById('mediumPriorityGaps').textContent = stats.medium;
    document.getElementById('lowPriorityGaps').textContent = stats.low;
}

/**
 * Render gap cards in the results grid
 */
function renderGapCards(gaps) {
    const container = document.getElementById('gapResults');
    container.innerHTML = '';
    
    gaps.forEach(gap => {
        const card = createGapCard(gap);
        container.appendChild(card);
    });
}

/**
 * Create a gap card element
 */
function createGapCard(gap) {
    const card = document.createElement('div');
    
    const priorityClass = getPriorityClass(gap.opportunityScore);
    card.className = `gap-card ${priorityClass}`;
    card.setAttribute('data-topic-category', gap.topicCategory);
    card.setAttribute('data-aspect-category', gap.aspectCategory);
    card.setAttribute('data-priority', getPriorityLevel(gap.opportunityScore));
    
    // Format GPT analysis for display
    const gptAnalysisHtml = gap.gptAnalysis ? 
        `<div class="gpt-analysis">
            <h4>📈 Content Strategy Analysis</h4>
            <div class="analysis-content">${formatGptAnalysis(gap.gptAnalysis)}</div>
            <button class="btn btn-sm btn-secondary toggle-analysis" onclick="toggleAnalysis(this)">Show Details</button>
        </div>` : '';
    
    card.innerHTML = `
        <div class="gap-title">${gap.topic} - ${gap.aspect}</div>
        <span class="gap-priority ${getPriorityBadgeClass(gap.opportunityScore)}">
            ${getPriorityLevel(gap.opportunityScore).toUpperCase()} PRIORITY
        </span>
        <div class="gap-details">
            <strong>Search Query:</strong> "${gap.searchQuery}"<br>
            <strong>Opportunity Score:</strong> ${gap.opportunityScore}/100<br>
            <strong>Gap Reason:</strong> ${gap.gapReason}<br>
            <strong>Category:</strong> ${gap.topicCategory} → ${gap.aspectCategory}
        </div>
        ${gptAnalysisHtml}
        <div class="gap-actions">
            <button class="btn btn-primary btn-sm" onclick="addToContentCalendar('${gap.searchQuery}')">
                📅 Add to Calendar
            </button>
            <button class="btn btn-secondary btn-sm" onclick="viewSimilarContent('${gap.searchQuery}')">
                🔍 View Similar
            </button>
        </div>
    `;
    
    return card;
}

/**
 * Format GPT analysis for HTML display
 */
function formatGptAnalysis(analysis) {
    // Convert markdown-like formatting to HTML
    return analysis
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n- /g, '<br>• ')
        .replace(/\n\n/g, '<br><br>')
        .replace(/\n/g, '<br>');
}

/**
 * Toggle GPT analysis display
 */
function toggleAnalysis(button) {
    const analysisContent = button.parentElement.querySelector('.analysis-content');
    const isHidden = analysisContent.style.display === 'none' || !analysisContent.style.display;
    
    if (isHidden) {
        analysisContent.style.display = 'block';
        button.textContent = 'Hide Details';
    } else {
        analysisContent.style.display = 'none';
        button.textContent = 'Show Details';
    }
}

/**
 * Get priority class for styling
 */
function getPriorityClass(score) {
    if (score >= 80) return 'high-priority';
    if (score >= 60) return 'medium-priority';
    return 'low-priority';
}

/**
 * Get priority level text
 */
function getPriorityLevel(score) {
    if (score >= 80) return 'high';
    if (score >= 60) return 'medium';
    return 'low';
}

/**
 * Get priority badge class
 */
function getPriorityBadgeClass(score) {
    if (score >= 80) return 'priority-high';
    if (score >= 60) return 'priority-medium';
    return 'priority-low';
}

/**
 * Filter results based on selected criteria
 */
function filterResults() {
    const priorityFilter = document.getElementById('priorityFilter').value;
    const topicFilter = document.getElementById('topicFilter').value;
    const aspectFilter = document.getElementById('aspectFilter').value;
    
    const cards = document.querySelectorAll('.gap-card');
    
    cards.forEach(card => {
        let show = true;
        
        // Priority filter
        if (priorityFilter !== 'all' && card.getAttribute('data-priority') !== priorityFilter) {
            show = false;
        }
        
        // Topic filter
        if (topicFilter !== 'all' && card.getAttribute('data-topic-category') !== topicFilter) {
            show = false;
        }
        
        // Aspect filter
        if (aspectFilter !== 'all' && card.getAttribute('data-aspect-category') !== aspectFilter) {
            show = false;
        }
        
        card.style.display = show ? 'block' : 'none';
    });
}

/**
 * Add content idea to calendar (placeholder)
 */
function addToContentCalendar(query) {
    // This would integrate with your content calendar system
    alert(`Added "${query}" to content calendar!\n\n(This would integrate with your actual content management system)`);
}

/**
 * View similar content for a query (placeholder)
 */
function viewSimilarContent(query) {
    // This would show existing similar content
    alert(`Showing similar content for "${query}"...\n\n(This would display related articles from your database)`);
}

/**
 * Load sample data for demonstration
 */
function loadSampleData() {
    const sampleGaps = [
        {
            topic: "React",
            aspect: "performance optimization",
            topicCategory: "frontend",
            aspectCategory: "performance",
            searchQuery: "React performance optimization",
            opportunityScore: 95,
            gapReason: "No comprehensive performance guide found",
            isGap: true,
            existingContent: []
        },
        {
            topic: "Next.js",
            aspect: "security best practices",
            topicCategory: "frontend", 
            aspectCategory: "security",
            searchQuery: "Next.js security best practices",
            opportunityScore: 88,
            gapReason: "Limited security-focused content",
            isGap: true,
            existingContent: []
        },
        {
            topic: "Docker",
            aspect: "beginner guide",
            topicCategory: "cloud",
            aspectCategory: "skillLevel",
            searchQuery: "Docker beginner guide",
            opportunityScore: 72,
            gapReason: "Existing guides too advanced",
            isGap: true,
            existingContent: []
        }
    ];
    
    analysisResults = sampleGaps;
    displayGapResults(sampleGaps);
}

/**
 * Export results to CSV
 */
function exportResults() {
    if (!analysisResults.length) {
        alert('No results to export. Run an analysis first.');
        return;
    }
    
    const headers = ['Topic', 'Aspect', 'Search Query', 'Priority', 'Opportunity Score', 'Gap Reason', 'Category'];
    const rows = analysisResults.map(gap => [
        gap.topic,
        gap.aspect,
        gap.searchQuery,
        getPriorityLevel(gap.opportunityScore),
        gap.opportunityScore,
        gap.gapReason,
        `${gap.topicCategory} → ${gap.aspectCategory}`
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.map(field => `"${field}"`).join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `content-gaps-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

/**
 * Show loading state
 */
function showLoadingState() {
    document.getElementById('loadingSection').style.display = 'block';
    document.getElementById('resultsSection').style.display = 'none';
}

/**
 * Hide loading state
 */
function hideLoadingState() {
    document.getElementById('loadingSection').style.display = 'none';
}

/**
 * Update loading status text
 */
function updateLoadingStatus(message) {
    document.getElementById('loadingStatus').textContent = message;
}