#!/usr/bin/env python3
"""
Content Gap Analyzer - Identifies missing content opportunities
by analyzing existing content in Qdrant and comparing with industry standards
"""

import os
import json
import openai
from qdrant_client import QdrantClient
from qdrant_client.http import models
from dotenv import load_dotenv
from collections import defaultdict
import time

load_dotenv()

class ContentGapAnalyzer:
    def __init__(self):
        self.openai_client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        self.qdrant_client = QdrantClient(
            host=os.getenv('QDRANT_HOST', 'localhost'),
            port=int(os.getenv('QDRANT_PORT', 6333))
        )
        
    def get_all_content_titles(self, collection_name):
        """Retrieve all content titles from a collection"""
        try:
            # Get all points from the collection
            points = self.qdrant_client.scroll(
                collection_name=collection_name,
                limit=1000,  # Adjust based on your collection size
                with_payload=True
            )[0]
            
            titles = []
            for point in points:
                if point.payload and 'title' in point.payload:
                    titles.append(point.payload['title'])
            
            print(f"📊 Retrieved {len(titles)} titles from {collection_name}")
            return titles
            
        except Exception as e:
            print(f"❌ Error retrieving content from {collection_name}: {e}")
            return []
    
    def analyze_content_themes(self, titles, source_name):
        """Use GPT to analyze existing content and identify themes/categories"""
        titles_text = "\n".join([f"- {title}" for title in titles[:100]])  # Limit for API
        
        prompt = f"""Analyze these {source_name} content titles and identify the main themes/categories covered:

EXISTING CONTENT TITLES:
{titles_text}

Identify:
1. Main content categories (e.g., "Integration Guides", "Best Practices", "Troubleshooting")
2. Popular topics within each category
3. Technical depth levels (beginner, intermediate, advanced)
4. Content formats (tutorials, comparisons, case studies, etc.)

Respond with a JSON object:
{{
    "categories": [
        {{
            "name": "Category Name",
            "topics": ["topic1", "topic2"],
            "content_count": 15,
            "depth_levels": ["beginner", "intermediate"],
            "formats": ["tutorial", "guide"]
        }}
    ],
    "total_content": {len(titles)},
    "coverage_analysis": "Brief analysis of what's well-covered vs gaps"
}}"""

        try:
            response = self.openai_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3,
                max_tokens=1000
            )
            
            content = response.choices[0].message.content.strip()
            if content.startswith('```json'):
                content = content.replace('```json', '').replace('```', '')
            
            return json.loads(content)
            
        except Exception as e:
            print(f"❌ Error analyzing themes: {e}")
            return {"categories": [], "total_content": len(titles)}

    def generate_industry_standard_topics(self, source_name):
        """Generate focused list of industry-standard topics specific to the source"""
        
        # Define specific contexts for each service
        if source_name.lower() == 'filestack':
            service_context = """Filestack is a file upload, processing, and delivery service for developers. 
Focus ONLY on file upload, file handling, image/video processing, CDN delivery, and developer integration topics.
NO quantum computing, AI, or unrelated topics."""
            
            core_topics = "file upload APIs, file processing workflows, image transformations, video handling, CDN integration"
            integrations = "React, Vue, Angular, Node.js, Python, PHP integration with file uploads"
            
        elif source_name.lower() == 'froala':
            service_context = """Froala is a WYSIWYG rich text editor for web applications.
Focus ONLY on text editing, content creation, editor customization, and web development integration topics.
NO quantum computing, AI, or unrelated topics."""
            
            core_topics = "WYSIWYG editing, rich text features, editor customization, content management"
            integrations = "React, Vue, Angular, WordPress, Django integration with Froala Editor"
            
        else:
            service_context = f"{source_name} service integration and usage"
            core_topics = "core functionality, basic features"
            integrations = "framework integrations"

        prompt = f"""{service_context}

Generate exactly 50 {source_name}-specific content topics split by funnel stage:

FUNNEL REQUIREMENTS:
- 25 TOP FUNNEL: Awareness, discovery, "what is", comparisons, getting started
- 25 BOTTOM/MIDDLE FUNNEL: Implementation, advanced usage, optimization, troubleshooting

TOPICS MUST BE ABOUT:
- {core_topics}
- {integrations}
- Performance optimization specific to {source_name}
- Security best practices for {source_name}
- Troubleshooting {source_name} issues

CRITICAL: Return ONLY JSON array - no explanations, no markdown.

[{{"title":"Topic 1","category":"Getting Started","difficulty":"beginner","content_type":"guide","target_audience":"developers","keywords":["keyword1","keyword2"],"value_proposition":"Brief description","funnel_stage":"top"}},{{"title":"Topic 2","category":"Implementation","difficulty":"advanced","content_type":"tutorial","target_audience":"developers","keywords":["keyword3","keyword4"],"value_proposition":"Another description","funnel_stage":"bottom"}}]"""

        try:
            response = self.openai_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3,
                max_tokens=3000  # Increased for 50 topics
            )
            
            content = response.choices[0].message.content.strip()
            
            # Clean up markdown code blocks
            if content.startswith('```json'):
                content = content.replace('```json', '').replace('```', '')
            elif content.startswith('```'):
                content = content.replace('```', '', 2)  # Remove first and last ```
            
            # Additional cleanup for common issues
            content = content.strip()
            
            # Try to parse JSON
            try:
                return json.loads(content)
            except json.JSONDecodeError as json_error:
                print(f"⚠️  JSON parsing failed: {json_error}")
                print(f"📄 Raw content length: {len(content)} chars")
                print(f"🔍 Content preview: {content[:200]}...")
                
                # Try to find valid JSON array in the response
                import re
                json_match = re.search(r'\[.*\]', content, re.DOTALL)
                if json_match:
                    try:
                        return json.loads(json_match.group())
                    except:
                        pass
                
                # If all else fails, try generating in smaller batches
                print("🔄 Trying batch generation approach...")
                batch_topics = self.generate_topics_in_batches(source_name)
                if batch_topics:
                    return batch_topics
                
                # Final fallback
                print("🔄 Using fallback industry topics")
                return self.get_fallback_industry_topics(source_name)
            
        except Exception as e:
            print(f"❌ Error generating industry topics: {e}")
            return self.get_fallback_industry_topics(source_name)

    def generate_topics_in_batches(self, source_name, batch_size=10):
        """Generate topics in smaller batches to avoid JSON issues"""
        all_topics = []
        
        # Define service-specific context
        if source_name.lower() == 'filestack':
            service_focus = "file upload, file processing, image transformations, CDN delivery"
            specific_keywords = ["file upload", "image processing", "video handling", "cdn", "api"]
        elif source_name.lower() == 'froala':
            service_focus = "WYSIWYG editor, rich text editing, content creation, editor customization"
            specific_keywords = ["wysiwyg", "rich text", "editor", "content", "customization"]
        else:
            service_focus = "core functionality"
            specific_keywords = ["integration", "api", "development"]
        
        # Generate 5 batches of 10 topics each (50 total)
        batch_configs = [
            {"category": "Getting Started", "funnel_stage": "top", "focus": f"beginner guides for {service_focus}"},
            {"category": "Integration", "funnel_stage": "bottom", "focus": f"framework integration with {service_focus}"},
            {"category": "Best Practices", "funnel_stage": "bottom", "focus": f"optimization and best practices for {service_focus}"},
            {"category": "Advanced Usage", "funnel_stage": "bottom", "focus": f"advanced techniques and customization for {service_focus}"},
            {"category": "Troubleshooting", "funnel_stage": "bottom", "focus": f"problem-solving and debugging for {service_focus}"}
        ]
        
        for batch_config in batch_configs:
            try:
                prompt = f"""Generate exactly {batch_size} {source_name}-specific content topics.

FOCUS: {batch_config['focus']}
FUNNEL STAGE: {batch_config['funnel_stage']} funnel
MUST INCLUDE KEYWORDS: {specific_keywords}

CRITICAL: Return ONLY valid JSON array - no explanations.

[{{"title":"Topic 1","category":"{batch_config['category']}","difficulty":"beginner","content_type":"guide","target_audience":"developers","keywords":["keyword1","keyword2"],"value_proposition":"Brief description","funnel_stage":"{batch_config['funnel_stage']}"}}]"""

                response = self.openai_client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0.4,
                    max_tokens=1200
                )
                
                content = response.choices[0].message.content.strip()
                
                # Clean content
                if content.startswith('```'):
                    content = content.replace('```json', '').replace('```', '')
                content = content.strip()
                
                # Parse batch
                batch = json.loads(content)
                if isinstance(batch, list):
                    all_topics.extend(batch)
                    print(f"✅ Generated {len(batch)} {batch_config['funnel_stage']} funnel topics for {batch_config['category']}")
                
                time.sleep(0.7)  # Rate limiting
                
            except Exception as e:
                print(f"⚠️  Batch generation failed for {batch_config['category']}: {e}")
                continue
        
        print(f"📊 Batch generation complete: {len(all_topics)} topics generated")
        return all_topics if all_topics else None

    def get_fallback_industry_topics(self, source_name):
        """Fallback industry topics when GPT fails - focused and funnel-aware"""
        if source_name.lower() == 'filestack':
            return [
                # TOP FUNNEL - Getting Started
                {"title": "What is Filestack? Complete File Upload Service Overview", "category": "Getting Started", "difficulty": "beginner", "content_type": "guide", "target_audience": "developers", "keywords": ["filestack", "file upload", "overview"], "value_proposition": "Introduction to Filestack services", "funnel_stage": "top"},
                {"title": "Filestack vs Competitors: File Upload Service Comparison", "category": "Comparison", "difficulty": "beginner", "content_type": "comparison", "target_audience": "developers", "keywords": ["filestack", "comparison", "alternatives"], "value_proposition": "Compare file upload solutions", "funnel_stage": "top"},
                {"title": "Getting Started with Filestack File Uploads", "category": "Getting Started", "difficulty": "beginner", "content_type": "tutorial", "target_audience": "developers", "keywords": ["getting started", "file upload", "tutorial"], "value_proposition": "First steps with Filestack", "funnel_stage": "top"},
                
                # BOTTOM FUNNEL - Implementation
                {"title": "Complete Guide to File Upload Security with Filestack", "category": "Security", "difficulty": "intermediate", "content_type": "guide", "target_audience": "developers", "keywords": ["file upload", "security", "validation"], "value_proposition": "Secure file upload implementation", "funnel_stage": "bottom"},
                {"title": "Optimizing Filestack Performance for Large Files", "category": "Performance", "difficulty": "advanced", "content_type": "tutorial", "target_audience": "developers", "keywords": ["performance", "large files", "optimization"], "value_proposition": "Large file handling techniques", "funnel_stage": "bottom"},
                {"title": "Filestack React Integration: Complete Implementation Guide", "category": "Integration", "difficulty": "intermediate", "content_type": "tutorial", "target_audience": "developers", "keywords": ["react", "integration", "implementation"], "value_proposition": "React integration best practices", "funnel_stage": "bottom"},
                {"title": "Advanced Filestack Image Processing Workflows", "category": "Advanced", "difficulty": "advanced", "content_type": "guide", "target_audience": "developers", "keywords": ["image processing", "workflows", "automation"], "value_proposition": "Advanced image processing techniques", "funnel_stage": "bottom"},
                {"title": "Troubleshooting Common Filestack Upload Errors", "category": "Troubleshooting", "difficulty": "intermediate", "content_type": "reference", "target_audience": "developers", "keywords": ["troubleshooting", "errors", "debugging"], "value_proposition": "Error resolution guide", "funnel_stage": "bottom"}
            ]
        elif source_name.lower() == 'froala':
            return [
                # TOP FUNNEL - Getting Started  
                {"title": "What is Froala Editor? Complete WYSIWYG Editor Overview", "category": "Getting Started", "difficulty": "beginner", "content_type": "guide", "target_audience": "developers", "keywords": ["froala", "wysiwyg", "editor", "overview"], "value_proposition": "Introduction to Froala WYSIWYG editor", "funnel_stage": "top"},
                {"title": "Froala vs TinyMCE vs CKEditor: Rich Text Editor Comparison", "category": "Comparison", "difficulty": "beginner", "content_type": "comparison", "target_audience": "developers", "keywords": ["froala", "comparison", "wysiwyg", "alternatives"], "value_proposition": "Compare WYSIWYG editor solutions", "funnel_stage": "top"},
                {"title": "Getting Started with Froala Editor Integration", "category": "Getting Started", "difficulty": "beginner", "content_type": "tutorial", "target_audience": "developers", "keywords": ["getting started", "froala", "integration"], "value_proposition": "First steps with Froala editor", "funnel_stage": "top"},
                
                # BOTTOM FUNNEL - Implementation
                {"title": "Advanced Froala Editor Customization Techniques", "category": "Customization", "difficulty": "advanced", "content_type": "guide", "target_audience": "developers", "keywords": ["customization", "advanced", "configuration"], "value_proposition": "Deep customization techniques for Froala", "funnel_stage": "bottom"},
                {"title": "Froala Editor Performance Optimization Guide", "category": "Performance", "difficulty": "intermediate", "content_type": "guide", "target_audience": "developers", "keywords": ["performance", "optimization", "speed"], "value_proposition": "Optimize Froala for better performance", "funnel_stage": "bottom"},
                {"title": "Building Custom Froala Editor Plugins", "category": "Development", "difficulty": "advanced", "content_type": "tutorial", "target_audience": "developers", "keywords": ["plugins", "custom", "development"], "value_proposition": "Create custom functionality with plugins", "funnel_stage": "bottom"},
                {"title": "Froala Editor Security and Content Sanitization", "category": "Security", "difficulty": "intermediate", "content_type": "guide", "target_audience": "developers", "keywords": ["security", "sanitization", "xss"], "value_proposition": "Secure content handling with Froala", "funnel_stage": "bottom"},
                {"title": "Mobile-Optimized Froala Editor Implementation", "category": "Mobile", "difficulty": "intermediate", "content_type": "tutorial", "target_audience": "developers", "keywords": ["mobile", "responsive", "touch"], "value_proposition": "Mobile-first Froala implementation", "funnel_stage": "bottom"}
            ]
        else:
            return [
                {
                    "title": f"{source_name} Complete Getting Started Guide",
                    "category": "Tutorial",
                    "difficulty": "beginner",
                    "content_type": "tutorial",
                    "target_audience": "developers",
                    "keywords": ["getting started", "tutorial", "basics"],
                    "value_proposition": "Comprehensive introduction guide"
                }
            ]

    def identify_content_gaps(self, existing_titles, industry_topics):
        """Compare existing content with industry standards to find gaps"""
        existing_titles_text = "\n".join([f"- {title}" for title in existing_titles[:50]])  # Limit for token efficiency
        industry_topics_text = "\n".join([f"- {topic['title']}" for topic in industry_topics[:30]])  # Limit for token efficiency
        
        prompt = f"""Find content gaps by comparing existing vs industry topics. Return ONLY JSON array - no explanations.

EXISTING: {len(existing_titles)} articles
INDUSTRY TOPICS: {len(industry_topics)} standards

Find 10 biggest gaps from industry topics NOT covered by existing content.

CRITICAL: Respond with ONLY this JSON format (no markdown, no text):

[{{"title":"Gap title","category":"Category","difficulty":"beginner","content_type":"guide","value_score":8,"uniqueness_score":9,"target_audience":"developers","keywords":["word1","word2"],"rationale":"Why valuable","differentiation":"How different"}}]"""

        try:
            response = self.openai_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3,
                max_tokens=1200
            )
            
            content = response.choices[0].message.content.strip()
            
            # Clean up markdown code blocks
            if content.startswith('```json'):
                content = content.replace('```json', '').replace('```', '')
            elif content.startswith('```'):
                content = content.replace('```', '', 2)
            
            content = content.strip()
            
            # Try to parse JSON with multiple fallback strategies
            try:
                return json.loads(content)
            except json.JSONDecodeError as json_error:
                print(f"⚠️  JSON parsing failed in identify_content_gaps: {json_error}")
                print(f"🔍 Content preview: {content[:200]}...")
                
                # Strategy 1: Find JSON after any explanatory text
                import re
                
                # Look for JSON array anywhere in the response
                json_patterns = [
                    r'\[[\s\S]*\]',  # Any JSON array
                    r'```json\s*(\[[\s\S]*\])\s*```',  # JSON in code blocks
                    r'```\s*(\[[\s\S]*\])\s*```',  # JSON in generic code blocks
                ]
                
                for pattern in json_patterns:
                    matches = re.findall(pattern, content, re.MULTILINE | re.DOTALL)
                    for match in matches:
                        try:
                            # If pattern has groups, use the group, otherwise use the full match
                            json_text = match if isinstance(match, str) and match.startswith('[') else match
                            if not json_text.startswith('['):
                                continue
                            parsed = json.loads(json_text)
                            if isinstance(parsed, list) and len(parsed) > 0:
                                print(f"✅ Extracted JSON with pattern: {pattern[:20]}...")
                                return parsed
                        except Exception as e:
                            continue
                
                # Strategy 2: Try to find individual JSON objects and build array
                object_pattern = r'\{[^{}]*\}'
                objects = re.findall(object_pattern, content)
                if objects:
                    try:
                        valid_objects = []
                        for obj in objects:
                            try:
                                parsed_obj = json.loads(obj)
                                if isinstance(parsed_obj, dict) and 'title' in parsed_obj:
                                    valid_objects.append(parsed_obj)
                            except:
                                continue
                        if valid_objects:
                            print(f"✅ Reconstructed {len(valid_objects)} JSON objects")
                            return valid_objects
                    except:
                        pass
                
                print("🔄 Using fallback gap identification")
                return []
            
        except Exception as e:
            print(f"❌ Error identifying gaps: {e}")
            return []

    def verify_gap_uniqueness(self, gaps, existing_titles):
        """Double-check that identified gaps are truly unique using vector search against Qdrant"""
        verified_gaps = []
        
        print(f"🔍 Verifying uniqueness of {len(gaps)} gaps against existing content...")
        
        # Get all existing titles for batch embedding generation
        sample_existing = existing_titles[:100]  # Reasonable sample
        
        for gap in gaps:
            try:
                # Generate embedding for the gap
                gap_embedding = self.openai_client.embeddings.create(
                    model="text-embedding-3-large",
                    input=gap['title']
                ).data[0].embedding
                
                # Use batch similarity calculation with existing titles
                max_similarity = 0
                most_similar = ""
                
                # Process in batches to avoid API rate limits
                batch_size = 10
                for i in range(0, min(len(sample_existing), 50), batch_size):
                    batch_titles = sample_existing[i:i + batch_size]
                    
                    try:
                        # Generate embeddings for batch
                        batch_response = self.openai_client.embeddings.create(
                            model="text-embedding-3-large",
                            input=batch_titles
                        )
                        
                        # Calculate similarities
                        for j, existing_embedding in enumerate(batch_response.data):
                            existing_vector = existing_embedding.embedding
                            
                            # Efficient cosine similarity calculation
                            import numpy as np
                            similarity = np.dot(gap_embedding, existing_vector) / (
                                np.linalg.norm(gap_embedding) * np.linalg.norm(existing_vector)
                            )
                            
                            if similarity > max_similarity:
                                max_similarity = similarity
                                most_similar = batch_titles[j]
                        
                        time.sleep(0.2)  # Rate limiting between batches
                        
                    except Exception as batch_error:
                        print(f"⚠️  Batch processing error: {batch_error}")
                        continue
                
                # Stricter threshold for content gaps (lower = more unique required)
                uniqueness_threshold = 0.60  # 60% similarity threshold
                
                if max_similarity < uniqueness_threshold:
                    gap['verified_uniqueness'] = max_similarity
                    gap['most_similar_existing'] = most_similar
                    gap['uniqueness_confidence'] = 'high' if max_similarity < 0.45 else 'medium'
                    verified_gaps.append(gap)
                    print(f"✅ Unique gap: {gap['title'][:60]}... (max similarity: {max_similarity:.2f})")
                else:
                    print(f"❌ Too similar: {gap['title'][:60]}... (similarity: {max_similarity:.2f} to '{most_similar[:40]}...')")
                
            except Exception as e:
                print(f"⚠️  Error verifying '{gap['title'][:40]}...': {e}")
                # Include with lower confidence if verification fails
                gap['verified_uniqueness'] = 0.5
                gap['most_similar_existing'] = 'verification_failed'
                gap['uniqueness_confidence'] = 'low'
                verified_gaps.append(gap)
        
        print(f"📊 Verification complete: {len(verified_gaps)}/{len(gaps)} gaps verified as unique")
        return verified_gaps

    def analyze_source(self, collection_name, source_name):
        """Complete gap analysis for a source"""
        print(f"\n🔍 Analyzing content gaps for {source_name} ({collection_name})")
        print("=" * 60)
        
        # Step 1: Get existing content
        print("📊 Retrieving existing content...")
        existing_titles = self.get_all_content_titles(collection_name)
        
        if not existing_titles:
            print(f"❌ No content found in {collection_name}")
            return None
        
        # Step 2: Analyze themes
        print("🧠 Analyzing content themes...")
        theme_analysis = self.analyze_content_themes(existing_titles, source_name)
        
        # Step 3: Generate industry standards
        print("📚 Generating industry standard topics...")
        industry_topics = self.generate_industry_standard_topics(source_name)
        
        # Step 4: Identify gaps
        print("🔍 Identifying content gaps...")
        content_gaps = self.identify_content_gaps(existing_titles, industry_topics)
        
        # Step 5: Verify uniqueness
        print("✅ Verifying gap uniqueness with embeddings...")
        verified_gaps = self.verify_gap_uniqueness(content_gaps, existing_titles)
        
        return {
            'source_name': source_name,
            'collection_name': collection_name,
            'existing_content_count': len(existing_titles),
            'theme_analysis': theme_analysis,
            'identified_gaps': len(content_gaps),
            'verified_gaps': verified_gaps,
            'analysis_timestamp': time.time()
        }

    def generate_gap_report(self, sources=['filestack', 'froala']):
        """Generate complete content gap report for specified sources"""
        report = {
            'analysis_metadata': {
                'timestamp': time.time(),
                'sources_analyzed': sources,
                'total_gaps_found': 0
            },
            'source_analyses': {}
        }
        
        for collection_name in sources:
            source_name = collection_name.title()
            analysis = self.analyze_source(collection_name, source_name)
            
            if analysis:
                report['source_analyses'][collection_name] = analysis
                report['analysis_metadata']['total_gaps_found'] += len(analysis['verified_gaps'])
        
        # Save report
        output_file = 'content_gaps_analysis.json'
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        
        print(f"\n📋 Analysis complete! Report saved to {output_file}")
        print(f"📊 Total verified gaps found: {report['analysis_metadata']['total_gaps_found']}")
        
        return report


def main():
    analyzer = ContentGapAnalyzer()
    
    print("🎯 Content Gap Analyzer")
    print("=" * 50)
    print("This tool analyzes your existing content in Qdrant")
    print("and identifies valuable content gaps based on industry standards.")
    print()
    
    # Generate the analysis
    report = analyzer.generate_gap_report(['filestack', 'froala'])
    
    # Summary
    print("\n📊 ANALYSIS SUMMARY")
    print("=" * 30)
    for source, analysis in report['source_analyses'].items():
        print(f"🔍 {analysis['source_name']}:")
        print(f"   📄 Existing content: {analysis['existing_content_count']} items")
        print(f"   🎯 Content gaps found: {len(analysis['verified_gaps'])} opportunities")
        print()


if __name__ == '__main__':
    main()