/**
 * Top-Funnel Content Gap Analyzer
 * Finds awareness-stage content opportunities using AI-powered topic analysis
 * Integrates with existing Apps Script environment variables
 */

// Top-Funnel Topic Taxonomy - Froala & Filestack Focus
const TOP_FUNNEL_TAXONOMY = {
    // Awareness Stage Topics - "What is" content
    awareness: {
        // Editor & Content Creation Definitions
        editor_definitions: [
            "what is WYSIWYG editor", "what is rich text editor", "what is HTML editor",
            "what is visual editor", "what is content editor", "what is text editor",
            "what is inline editing", "what is markdown editor", "what is code editor",
            "what is syntax highlighting", "what is collaborative editing", "what is real-time editing",
            "what is content management", "what is document editing", "what is text formatting",
            "what is editor customization", "what is editor plugin", "what is editor theme"
        ],
        
        // File Management Definitions
        file_definitions: [
            "what is file upload", "what is file picker", "what is file transformation",
            "what is image processing", "what is file conversion", "what is CDN",
            "what is cloud storage", "what is file optimization", "what is image optimization",
            "what is file compression", "what is thumbnail generation", "what is asset management",
            "what is digital asset management", "what is file delivery", "what is upload widget",
            "what is drag and drop upload", "what is bulk upload", "what is file security"
        ],
        
        // Web Development Fundamentals
        web_fundamentals: [
            "JavaScript basics", "HTML fundamentals", "CSS introduction",
            "React overview", "Vue.js basics", "Angular introduction",
            "API basics", "SDK explained", "plugin development overview",
            "responsive design basics", "mobile optimization introduction",
            "web components explained", "progressive web apps overview"
        ],

        // Business & Industry Concepts
        business_concepts: [
            "content management explained", "digital asset management overview",
            "SaaS business model", "API economy basics", "developer tools market",
            "content marketing fundamentals", "user experience basics",
            "web development workflow", "content creation process",
            "editorial workflow explained", "publishing platform basics"
        ],

        // Technology Trends  
        tech_trends: [
            "future of content editing", "collaborative editing trends",
            "headless CMS movement", "API-first development", "jamstack architecture",
            "no-code content tools", "visual editing evolution", "real-time collaboration",
            "cloud-based editing", "mobile content creation", "AI-powered editing"
        ]
    },

    // Problem Recognition Stage - "Why does this matter" content
    problem_recognition: {
        // Pain Points & Challenges
        pain_points: [
            "software development challenges", "scaling problems", "security vulnerabilities",
            "performance bottlenecks", "user experience issues", "technical debt",
            "team collaboration problems", "remote work challenges",
            "customer acquisition difficulties", "retention problems",
            "data management issues", "integration challenges",
            "compliance requirements", "budget constraints",
            "time-to-market pressure", "skill shortage",
            "technology adoption barriers", "change management"
        ],

        // Warning Signs & Symptoms
        warning_signs: [
            "signs you need DevOps", "when to migrate to cloud",
            "symptoms of bad UX", "indicators of technical debt",
            "signs of security breach", "red flags in development",
            "warning signs of churn", "symptoms of poor performance",
            "indicators of scaling issues", "signs of team burnout",
            "symptoms of data silos", "warning signs of outdated tech",
            "indicators of compliance risk", "signs of poor code quality"
        ],

        // Impact & Consequences
        consequences: [
            "cost of poor security", "impact of slow websites",
            "consequences of technical debt", "price of bad UX",
            "cost of developer turnover", "impact of downtime",
            "consequences of data breaches", "price of poor performance",
            "cost of manual processes", "impact of outdated systems",
            "consequences of poor documentation", "price of vendor lock-in"
        ]
    },

    // Solution Exploration Stage - "How to approach this" content
    solution_exploration: {
        // Approaches & Methodologies
        approaches: [
            "agile vs waterfall", "microservices vs monolith",
            "cloud vs on-premise", "build vs buy decisions",
            "in-house vs outsourcing", "open source vs proprietary",
            "SQL vs NoSQL databases", "REST vs GraphQL APIs",
            "manual vs automated testing", "traditional vs DevOps",
            "centralized vs decentralized", "synchronous vs asynchronous"
        ],

        // Framework Comparisons
        comparisons: [
            "React vs Vue vs Angular", "AWS vs Google Cloud vs Azure",
            "Docker vs Kubernetes", "MongoDB vs PostgreSQL",
            "GitHub vs GitLab vs Bitbucket", "Slack vs Microsoft Teams",
            "Zoom vs Google Meet", "Shopify vs WooCommerce",
            "Stripe vs PayPal", "Mailchimp vs SendGrid",
            "HubSpot vs Salesforce", "Notion vs Confluence"
        ],

        // Decision Frameworks
        decisions: [
            "how to choose a tech stack", "selecting the right database",
            "picking a cloud provider", "choosing development methodology",
            "selecting monitoring tools", "picking security solutions",
            "choosing collaboration tools", "selecting analytics platform",
            "picking payment processor", "choosing CMS platform",
            "selecting email service", "picking hosting provider"
        ]
    },

    // Content Types for Top-Funnel
    content_types: {
        // Educational Content
        guides: [
            "complete guide to", "ultimate guide to", "beginner's guide to",
            "step-by-step guide", "comprehensive overview", "introduction to",
            "getting started with", "basics of", "fundamentals of",
            "crash course in", "primer on", "overview of"
        ],

        // Comparative Content
        comparisons: [
            "vs", "compared", "comparison", "alternatives to",
            "competitors", "similar to", "better than", "versus",
            "pros and cons", "advantages and disadvantages",
            "strengths and weaknesses", "side by side comparison"
        ],

        // Explanatory Content
        explanations: [
            "how does", "why is", "what are the benefits",
            "what are the advantages", "what makes", "how to understand",
            "explaining", "demystifying", "breaking down",
            "simplifying", "understanding", "decoded"
        ],

        // List Content
        lists: [
            "best", "top", "essential", "must-have", "important",
            "popular", "trending", "recommended", "useful",
            "powerful", "effective", "proven", "leading",
            "game-changing", "innovative", "cutting-edge"
        ],

        // Trend Content
        trends: [
            "trends in", "future of", "evolution of", "next generation",
            "emerging", "upcoming", "latest in", "innovations in",
            "developments in", "advances in", "breakthroughs in",
            "state of", "outlook for", "predictions for"
        ]
    },

    // Industry-Specific Topics
    industries: {
        saas: [
            "SaaS metrics", "subscription business model", "customer success",
            "product-led growth", "user onboarding", "feature adoption",
            "SaaS marketing", "freemium strategy", "churn reduction",
            "expansion revenue", "net retention", "SaaS pricing",
            "multi-tenant architecture", "SaaS security", "compliance"
        ],

        ecommerce: [
            "online store optimization", "conversion rate optimization",
            "shopping cart abandonment", "payment processing",
            "inventory management", "order fulfillment", "shipping strategies",
            "customer reviews", "personalization", "mobile commerce",
            "omnichannel retail", "marketplace selling", "dropshipping"
        ],

        fintech: [
            "digital banking", "payment innovation", "cryptocurrency",
            "blockchain applications", "regulatory compliance", "KYC processes",
            "fraud prevention", "risk management", "open banking",
            "robo-advisors", "digital wallets", "peer-to-peer payments"
        ],

        healthcare: [
            "digital health", "telemedicine", "health informatics",
            "medical devices", "patient data security", "HIPAA compliance",
            "healthcare analytics", "electronic health records",
            "remote monitoring", "AI in healthcare", "precision medicine"
        ],

        education: [
            "online learning", "educational technology", "learning management systems",
            "student engagement", "assessment tools", "personalized learning",
            "virtual classrooms", "educational apps", "skill development",
            "certification programs", "microlearning", "gamification"
        ],

        marketing: [
            "digital marketing", "content strategy", "social media marketing",
            "email marketing", "influencer marketing", "affiliate marketing",
            "performance marketing", "marketing automation", "lead generation",
            "customer segmentation", "marketing analytics", "attribution modeling"
        ]
    }
};

// Content Intent Patterns for Top-Funnel
const TOP_FUNNEL_PATTERNS = {
    awareness: [
        "what is {topic}",
        "introduction to {topic}",
        "{topic} explained",
        "{topic} overview",
        "{topic} basics",
        "{topic} fundamentals",
        "understanding {topic}",
        "{topic} for beginners",
        "{topic} definition",
        "guide to {topic}"
    ],
    
    problem_recognition: [
        "why {topic} matters",
        "{topic} challenges",
        "{topic} problems",
        "issues with {topic}",
        "{topic} pain points",
        "common {topic} mistakes",
        "{topic} warning signs",
        "when to use {topic}",
        "do you need {topic}",
        "{topic} red flags"
    ],
    
    solution_exploration: [
        "how to choose {topic}",
        "{topic} alternatives",
        "{topic} vs {alternative}",
        "best {topic} for",
        "{topic} comparison",
        "types of {topic}",
        "{topic} approaches",
        "{topic} strategies",
        "{topic} methods",
        "selecting {topic}"
    ]
};

// Global variables
let analysisResults = [];
let currentConfig = {};

/**
 * Initialize the application
 */
document.addEventListener('DOMContentLoaded', function() {
    // Load saved configuration
    loadSavedConfig();
});

/**
 * Load saved configuration from localStorage
 */
function loadSavedConfig() {
    const saved = localStorage.getItem('topFunnelConfig');
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
        document.getElementById('funnelFocus').value = config.funnelFocus || 'awareness';
        document.getElementById('industryFocus').value = config.industryFocus || 'all';
        document.getElementById('minSimilarity').value = config.minSimilarity || '0.3';
        
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
        funnelFocus: document.getElementById('funnelFocus').value,
        industryFocus: document.getElementById('industryFocus').value,
        minSimilarity: document.getElementById('minSimilarity').value
    };
    localStorage.setItem('topFunnelConfig', JSON.stringify(config));
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
 * Generate top-funnel content combinations
 */
function generateTopFunnelCombinations(config) {
    const combinations = [];
    const limits = {
        quick: 25,
        standard: 100,
        comprehensive: 500
    };
    
    const limit = limits[config.analysisDepth] || 100;
    let count = 0;

    // Get relevant topics based on industry focus
    const industryTopics = config.industryFocus === 'all' ? 
        Object.values(TOP_FUNNEL_TAXONOMY.industries).flat() :
        TOP_FUNNEL_TAXONOMY.industries[config.industryFocus] || [];

    // Get relevant stages based on funnel focus
    const stageData = config.funnelFocus === 'mixed' ? 
        TOP_FUNNEL_TAXONOMY : 
        { [config.funnelFocus]: TOP_FUNNEL_TAXONOMY[config.funnelFocus] };

    // Generate combinations for each stage
    for (const [stageName, stageContent] of Object.entries(stageData)) {
        if (!TOP_FUNNEL_TAXONOMY[stageName]) continue;

        for (const [categoryName, topics] of Object.entries(stageContent)) {
            if (!Array.isArray(topics)) continue;

            // Combine with industry-specific topics if applicable
            const allTopics = config.industryFocus === 'all' ? 
                [...topics, ...industryTopics.slice(0, 10)] : 
                [...topics, ...industryTopics];

            for (const topic of allTopics.slice(0, 50)) { // Limit topics per category
                if (count >= limit) break;

                // Generate different content patterns
                const patterns = TOP_FUNNEL_PATTERNS[stageName] || TOP_FUNNEL_PATTERNS.awareness;
                
                for (const pattern of patterns.slice(0, 3)) { // Top 3 patterns per topic
                    if (count >= limit) break;

                    const searchQuery = pattern.replace('{topic}', topic);
                    const contentType = determineContentType(pattern);
                    
                    combinations.push({
                        topic,
                        pattern,
                        searchQuery,
                        funnelStage: stageName,
                        category: categoryName,
                        contentType,
                        industryRelevance: industryTopics.includes(topic) ? 'high' : 'medium',
                        priority: calculateTopFunnelPriority(topic, stageName, contentType, config)
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
 * Determine content type from pattern
 */
function determineContentType(pattern) {
    if (pattern.includes('vs') || pattern.includes('comparison')) return 'comparison';
    if (pattern.includes('guide') || pattern.includes('how to')) return 'guide';
    if (pattern.includes('what is') || pattern.includes('explained')) return 'explanation';
    if (pattern.includes('best') || pattern.includes('top')) return 'list';
    if (pattern.includes('trends') || pattern.includes('future')) return 'trend';
    return 'guide';
}

/**
 * Calculate priority score for top-funnel combinations
 */
function calculateTopFunnelPriority(topic, stage, contentType, config) {
    let priority = 50; // Base priority

    // High-value awareness topics
    const highValueTopics = [
        'AI', 'machine learning', 'cloud computing', 'cybersecurity', 'API',
        'SaaS', 'DevOps', 'automation', 'digital transformation', 'data analytics'
    ];
    
    if (highValueTopics.some(hvt => topic.toLowerCase().includes(hvt.toLowerCase()))) {
        priority += 25;
    }

    // Stage-based scoring
    const stageScores = {
        awareness: 20,        // Highest - top funnel focus
        problem_recognition: 15,
        solution_exploration: 10
    };
    priority += stageScores[stage] || 0;

    // Content type scoring
    const typeScores = {
        guide: 15,      // Educational content scores high
        explanation: 15,
        comparison: 12,
        list: 10,
        trend: 8
    };
    priority += typeScores[contentType] || 0;

    // Industry relevance boost
    if (config.industryFocus !== 'all') {
        priority += 10; // Focused industry content gets boost
    }

    // Search volume indicators (topics with high search potential)
    const highSearchTopics = [
        'what is', 'how to', 'best', 'vs', 'guide', 'tutorial', 
        'explained', 'overview', 'introduction'
    ];
    
    if (highSearchTopics.some(hst => topic.includes(hst))) {
        priority += 15;
    }

    return Math.min(priority, 100); // Cap at 100
}

/**
 * Main function to start top-funnel analysis
 */
async function startTopFunnelAnalysis() {
    // Save configuration
    const config = saveCurrentConfig();
    currentConfig = config;
    
    // Show loading state
    showLoadingState();
    
    try {
        // Generate topic combinations
        updateLoadingStatus('Generating top-funnel topic combinations...');
        const combinations = generateTopFunnelCombinations(config);
        
        updateLoadingStatus(`Analyzing ${combinations.length} opportunities for content gaps...`);
        
        // Analyze gaps in batches using Apps Script environment
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
                        .processTopFunnelAnalysis(batch, config);
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
        displayTopFunnelResults(gaps);
        
    } catch (error) {
        console.error('Top-funnel analysis failed:', error);
        hideLoadingState();
        showError(`Analysis failed: ${error.message}`);
    }
}

/**
 * Display top-funnel gap results
 */
function displayTopFunnelResults(gaps) {
    hideLoadingState();
    
    // Show results section
    document.getElementById('results').classList.add('show');
    document.getElementById('filterSection').style.display = 'block';
    
    // Update statistics
    updateTopFunnelStats(gaps);
    
    // Display gap cards
    renderTopFunnelGapCards(gaps);
}

/**
 * Update result statistics
 */
function updateTopFunnelStats(gaps) {
    const stats = {
        total: gaps.length,
        high: gaps.filter(g => g.priority >= 80).length,
        awareness: gaps.filter(g => g.funnelStage === 'awareness').length,
        avgOpportunity: gaps.length > 0 ? 
            Math.round(gaps.reduce((sum, g) => sum + g.priority, 0) / gaps.length) : 0
    };
    
    document.getElementById('totalGaps').textContent = stats.total;
    document.getElementById('highPriorityGaps').textContent = stats.high;
    document.getElementById('awarenessGaps').textContent = stats.awareness;
    document.getElementById('avgOpportunity').textContent = stats.avgOpportunity;
}

/**
 * Render gap cards in the results grid
 */
function renderTopFunnelGapCards(gaps) {
    const container = document.getElementById('gapResults');
    container.innerHTML = '';
    
    gaps.forEach(gap => {
        const card = createTopFunnelGapCard(gap);
        container.appendChild(card);
    });
}

/**
 * Create a top-funnel gap card element
 */
function createTopFunnelGapCard(gap) {
    const card = document.createElement('div');
    
    const priorityClass = getPriorityClass(gap.priority);
    card.className = `gap-card ${priorityClass}`;
    card.setAttribute('data-funnel-stage', gap.funnelStage);
    card.setAttribute('data-content-type', gap.contentType);
    card.setAttribute('data-priority', getPriorityLevel(gap.priority));
    
    // Create content description
    const contentDescription = generateContentDescription(gap);
    
    // Format GPT analysis for display
    const gptAnalysisHtml = gap.gptAnalysis ? 
        `<div class="gpt-analysis">
            <h4>🎯 Top-Funnel Strategy Analysis</h4>
            <div class="analysis-content">${formatGptAnalysis(gap.gptAnalysis)}</div>
            <button class="btn btn-sm btn-secondary toggle-analysis" onclick="toggleAnalysis(this)">Show Details</button>
        </div>` : '';
    
    card.innerHTML = `
        <div class="opportunity-score">${gap.priority}/100</div>
        <div class="gap-title">${gap.searchQuery}</div>
        <div class="gap-metadata">
            <span class="metadata-tag ${getPriorityBadgeClass(gap.priority)}">
                ${getPriorityLevel(gap.priority).toUpperCase()}
            </span>
            <span class="metadata-tag funnel-stage">
                ${gap.funnelStage.replace('_', ' ').toUpperCase()}
            </span>
            <span class="metadata-tag content-type">
                ${gap.contentType.toUpperCase()}
            </span>
        </div>
        <div class="gap-description">
            ${contentDescription}
            <br><br>
            <strong>Target Audience:</strong> ${getTargetAudience(gap.funnelStage)}<br>
            <strong>Content Goal:</strong> ${getContentGoal(gap.funnelStage)}
        </div>
        ${gptAnalysisHtml}
        <div class="gap-actions">
            <button class="btn btn-primary btn-sm" onclick="addToContentCalendar('${gap.searchQuery}', '${gap.funnelStage}')">
                📅 Add to Calendar
            </button>
            <button class="btn btn-secondary btn-sm" onclick="generateContentOutline('${gap.searchQuery}', '${gap.contentType}')">
                📝 Generate Outline
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
 * Generate content description for gap
 */
function generateContentDescription(gap) {
    const descriptions = {
        awareness: `Create educational content that introduces "${gap.topic}" to newcomers. This content should focus on explaining basic concepts, providing clear definitions, and helping readers understand the fundamentals without assuming prior knowledge.`,
        problem_recognition: `Develop content that helps readers recognize when they need to consider "${gap.topic}". Focus on pain points, warning signs, and scenarios where this topic becomes relevant to their business or workflow.`,
        solution_exploration: `Produce content that guides readers through different approaches to "${gap.topic}". Compare options, methodologies, and help them understand how to evaluate different solutions.`
    };
    
    return descriptions[gap.funnelStage] || descriptions.awareness;
}

/**
 * Get target audience for funnel stage
 */
function getTargetAudience(stage) {
    const audiences = {
        awareness: 'Complete beginners, newcomers to the space',
        problem_recognition: 'People experiencing related challenges',
        solution_exploration: 'Actively evaluating options and approaches'
    };
    
    return audiences[stage] || audiences.awareness;
}

/**
 * Get content goal for funnel stage  
 */
function getContentGoal(stage) {
    const goals = {
        awareness: 'Educate and build brand awareness',
        problem_recognition: 'Help identify problems and create urgency',
        solution_exploration: 'Guide evaluation and build consideration'
    };
    
    return goals[stage] || goals.awareness;
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
    const stageFilter = document.getElementById('stageFilter').value;
    const typeFilter = document.getElementById('typeFilter').value;
    
    const cards = document.querySelectorAll('.gap-card');
    
    cards.forEach(card => {
        let show = true;
        
        // Priority filter
        if (priorityFilter !== 'all' && card.getAttribute('data-priority') !== priorityFilter) {
            show = false;
        }
        
        // Stage filter
        if (stageFilter !== 'all' && card.getAttribute('data-funnel-stage') !== stageFilter) {
            show = false;
        }
        
        // Type filter
        if (typeFilter !== 'all' && card.getAttribute('data-content-type') !== typeFilter) {
            show = false;
        }
        
        card.style.display = show ? 'block' : 'none';
    });
}

/**
 * Add content idea to calendar
 */
function addToContentCalendar(query, stage) {
    alert(`Added "${query}" (${stage} stage) to content calendar!\n\n(This would integrate with your actual content management system)`);
}

/**
 * Generate content outline
 */
function generateContentOutline(query, type) {
    alert(`Generating ${type} outline for "${query}"...\n\n(This would create a detailed content outline using AI)`);
}

/**
 * Load sample data for demonstration
 */
function loadSampleData() {
    const sampleGaps = [
        {
            topic: "API",
            searchQuery: "what is API",
            funnelStage: "awareness",
            contentType: "explanation",
            priority: 95,
            category: "definitions",
            isGap: true
        },
        {
            topic: "DevOps",
            searchQuery: "DevOps vs traditional development",
            funnelStage: "solution_exploration", 
            contentType: "comparison",
            priority: 88,
            category: "approaches",
            isGap: true
        },
        {
            topic: "cloud computing",
            searchQuery: "signs you need cloud computing",
            funnelStage: "problem_recognition",
            contentType: "guide",
            priority: 82,
            category: "warning_signs",
            isGap: true
        },
        {
            topic: "machine learning",
            searchQuery: "machine learning for beginners",
            funnelStage: "awareness",
            contentType: "guide", 
            priority: 78,
            category: "definitions",
            isGap: true
        },
        {
            topic: "cybersecurity",
            searchQuery: "best cybersecurity practices",
            funnelStage: "solution_exploration",
            contentType: "list",
            priority: 75,
            category: "approaches",
            isGap: true
        }
    ];
    
    analysisResults = sampleGaps;
    displayTopFunnelResults(sampleGaps);
}

/**
 * Export results to CSV
 */
function exportResults() {
    if (!analysisResults.length) {
        alert('No results to export. Run an analysis first.');
        return;
    }
    
    const headers = ['Search Query', 'Funnel Stage', 'Content Type', 'Priority Score', 'Target Audience', 'Content Goal'];
    const rows = analysisResults.map(gap => [
        gap.searchQuery,
        gap.funnelStage.replace('_', ' '),
        gap.contentType,
        gap.priority,
        getTargetAudience(gap.funnelStage),
        getContentGoal(gap.funnelStage)
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.map(field => `"${field}"`).join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `top-funnel-opportunities-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

/**
 * Show loading state
 */
function showLoadingState() {
    document.getElementById('loading').classList.add('show');
    document.getElementById('startAnalysis').disabled = true;
    document.getElementById('results').classList.remove('show');
}

/**
 * Hide loading state
 */
function hideLoadingState() {
    document.getElementById('loading').classList.remove('show');
    document.getElementById('startAnalysis').disabled = false;
}

/**
 * Update loading status text
 */
function updateLoadingStatus(message) {
    document.getElementById('loadingStatus').textContent = message;
}

/**
 * Show error message
 */
function showError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = message;
    errorDiv.classList.add('show');
}

/**
 * Hide error message
 */
function hideError() {
    document.getElementById('error').classList.remove('show');
}