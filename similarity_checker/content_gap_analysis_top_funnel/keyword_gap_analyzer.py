#!/usr/bin/env python3
"""
Keyword-Focused Content Gap Analyzer
Generates 10 unique content ideas per keyword based on existing content analysis
"""

import os
import json
import openai
from qdrant_client import QdrantClient
from qdrant_client.http import models
from dotenv import load_dotenv
import time
import numpy as np

load_dotenv()

class KeywordGapAnalyzer:
    def __init__(self):
        self.openai_client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        self.qdrant_client = QdrantClient(
            host=os.getenv('QDRANT_HOST', 'localhost'),
            port=int(os.getenv('QDRANT_PORT', 6333))
        )
        
        # Define keyword sets with funnel stages
        self.froala_keywords = {
            "what is a wysiwyg editor": ["top"],
            "visual html editor": ["top", "middle"],
            "html to wysiwyg": ["bottom", "middle", "top"],
            "html editor linux": ["bottom", "middle", "top"],
            "text to html editor": ["bottom", "middle", "top"],
            "best wysiwyg html editor": ["bottom", "middle", "top"],
            "html code writer": ["bottom", "middle", "top"],
            "html editor software": ["bottom", "middle", "top"],
            "best javascript wysiwyg editor": ["top"],
            "html rich text editor": ["top"],
            "easy html editor": ["top"],
            "wysiwyg editors": ["top", "middle"]
        }
        
        self.filestack_keywords = {
            "javascript image editing": ["middle", "bottom"],
            "ocr api free": ["top", "middle"],
            "photo editing SDK": ["bottom"],
            "free images cdn": ["top", "middle"],
            "quick image upload": ["top", "middle"],
            "OCR SDK for Android": ["bottom"],
            "embed file upload in website": ["middle", "bottom"],
            "OCR data capture": ["middle", "bottom"],
            "File delivery": ["middle"],
            "react image editor": ["bottom"],
            "image tagging software": ["middle"],
            "react download file from api": ["bottom"],
            "Invoice OCR api": ["bottom"],
            "object recognition api": ["bottom"],
            "forms recognition sdk": ["bottom"],
            "fast upload files": ["top", "middle"],
            "Upload file for sharing": ["top", "middle"],
            "ai image tagging": ["middle", "bottom"],
            "Photo editor API": ["bottom"],
            "website to upload files": ["top", "middle"],
            "Upload html file to website": ["middle"],
            "image upload service": ["top", "middle"],
            "capture ocr": ["middle"],
            "file upload services": ["top", "middle"],
            "upload file check for virus": ["middle", "bottom"],
            "Upload file UI": ["top", "middle"],
            "mobile file upload": ["top", "middle"],
            "file upload website": ["top", "middle"],
            "uploader app": ["top", "middle"]
        }
    
    def get_all_content_titles(self, collection_name):
        """Retrieve all content titles from a collection"""
        try:
            points = self.qdrant_client.scroll(
                collection_name=collection_name,
                limit=1000,
                with_payload=True
            )[0]
            
            titles = []
            for point in points:
                if point.payload and 'title' in point.payload:
                    titles.append(point.payload['title'])
            
            print(f"DATA: Retrieved {len(titles)} existing titles from {collection_name}")
            return titles
            
        except Exception as e:
            print(f"ERROR: Error retrieving content from {collection_name}: {e}")
            return []
    
    def find_most_relevant_existing_content(self, keyword, existing_titles, limit=30):
        """Find the most relevant existing content for a keyword using embeddings"""
        try:
            if not existing_titles:
                return []
            
            print(f"SEARCH: Finding most relevant existing content for keyword '{keyword}'...")
            
            # Generate embedding for the keyword
            keyword_embedding = self.openai_client.embeddings.create(
                model="text-embedding-3-large",
                input=f"{keyword} content topics and related subjects"
            ).data[0].embedding
            
            # Generate embeddings for existing titles in batches
            batch_size = 50
            title_similarities = []
            
            for i in range(0, len(existing_titles), batch_size):
                batch_titles = existing_titles[i:i + batch_size]
                
                try:
                    batch_response = self.openai_client.embeddings.create(
                        model="text-embedding-3-large",
                        input=batch_titles
                    )
                    
                    # Calculate similarities
                    for j, existing_embedding in enumerate(batch_response.data):
                        existing_vector = existing_embedding.embedding
                        
                        # Calculate cosine similarity
                        similarity = np.dot(keyword_embedding, existing_vector) / (
                            np.linalg.norm(keyword_embedding) * np.linalg.norm(existing_vector)
                        )
                        
                        title_similarities.append({
                            'title': batch_titles[j],
                            'similarity': similarity
                        })
                    
                    time.sleep(0.2)  # Rate limiting
                    
                except Exception as batch_error:
                    print(f"WARNING:  Batch similarity calculation error: {batch_error}")
                    continue
            
            # Sort by similarity and get most relevant
            most_relevant = sorted(title_similarities, key=lambda x: x['similarity'], reverse=True)[:limit]
            relevant_titles = [item['title'] for item in most_relevant]
            
            print(f"SUCCESS: Found {len(relevant_titles)} most relevant existing titles for '{keyword}'")
            return relevant_titles
            
        except Exception as e:
            print(f"ERROR: Error finding relevant content for '{keyword}': {e}")
            # Fallback to first N titles
            return existing_titles[:limit]

    def generate_keyword_content_ideas_with_relevant_content(self, keyword, funnel_stages, source_name, relevant_existing_titles):
        """Generate 10 unique content ideas using pre-filtered relevant existing content"""
        
        # Create context about the most relevant existing content
        existing_context = "\\n".join([f"- {title}" for title in relevant_existing_titles])
        funnel_list = ", ".join(funnel_stages)
        
        # Define service-specific context
        if source_name.lower() == 'froala':
            service_context = "Froala is a WYSIWYG rich text editor. Focus on text editing, content creation, HTML editing, and web development."
        else:  # filestack
            service_context = "Filestack is a file upload, processing, and delivery service. Focus on file uploads, image processing, OCR, APIs, and file management."
        
        prompt = f"""{service_context}

Generate exactly 10 unique content ideas for the keyword: "{keyword}"
Target funnel stages: {funnel_list}

MOST RELEVANT EXISTING CONTENT TO AVOID DUPLICATING:
{existing_context}

REQUIREMENTS:
1. All ideas must be relevant to "{keyword}" and {source_name}
2. Must be unique compared to existing content above
3. Include appropriate funnel stage distribution
4. Focus on practical, valuable content

TITLE FORMATTING RULES:
- NO colons (:) in titles - use direct, clear titles instead
- NO "How to:" or "Guide to:" prefixes with colons
- Use direct action titles: "Build JavaScript Image Editor" not "How to: Build JavaScript Image Editor"
- Use simple descriptive titles: "JavaScript Image Processing Tutorial" not "Advanced Techniques: JavaScript Image Processing"

CRITICAL: Return ONLY JSON array - no explanations.

[{{"title":"Content idea 1","category":"Category","difficulty":"beginner","content_type":"guide","target_audience":"developers","keywords":["{keyword}","related"],"value_proposition":"Why valuable","funnel_stage":"top","keyword_focus":"{keyword}","uniqueness_angle":"What makes it unique"}}]"""

        try:
            response = self.openai_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.4,
                max_tokens=2000
            )
            
            content = response.choices[0].message.content.strip()
            
            # Clean JSON
            if content.startswith('```json'):
                content = content.replace('```json', '').replace('```', '')
            elif content.startswith('```'):
                content = content.replace('```', '', 2)
            
            content = content.strip()
            
            # Parse and validate
            try:
                ideas = json.loads(content)
                if isinstance(ideas, list):
                    # Clean up titles - remove colons and fix formatting
                    cleaned_ideas = []
                    for idea in ideas:
                        if isinstance(idea, dict) and 'title' in idea:
                            original_title = idea['title']
                            cleaned_title = self.clean_title(original_title)
                            
                            if cleaned_title != original_title:
                                print(f"🧹 Cleaned title: '{original_title}' → '{cleaned_title}'")
                            
                            idea['title'] = cleaned_title
                            cleaned_ideas.append(idea)
                    
                    # Ensure we have exactly 10 ideas
                    if len(cleaned_ideas) > 10:
                        cleaned_ideas = cleaned_ideas[:10]
                    elif len(cleaned_ideas) < 10:
                        print(f"WARNING:  Only got {len(cleaned_ideas)} ideas for '{keyword}', using what we have")
                    
                    return cleaned_ideas
                else:
                    print(f"ERROR: Invalid format for keyword '{keyword}'")
                    return self.get_fallback_keyword_ideas(keyword, funnel_stages, source_name)
                    
            except json.JSONDecodeError as e:
                print(f"ERROR: JSON parsing failed for keyword '{keyword}': {e}")
                print(f"SEARCH: Content preview: {content[:200]}...")
                return self.get_fallback_keyword_ideas(keyword, funnel_stages, source_name)
                
        except Exception as e:
            print(f"ERROR: Error generating ideas for keyword '{keyword}': {e}")
            return self.get_fallback_keyword_ideas(keyword, funnel_stages, source_name)

    def generate_keyword_content_ideas(self, keyword, funnel_stages, source_name, existing_titles):
        """Generate 10 unique content ideas for a specific keyword"""
        
        # Find the most relevant existing content for this keyword using embeddings
        relevant_existing_titles = self.find_most_relevant_existing_content(keyword, existing_titles, limit=40)
        
        # Create context about the most relevant existing content
        existing_context = "\\n".join([f"- {title}" for title in relevant_existing_titles])
        funnel_list = ", ".join(funnel_stages)
        
        # Define service-specific context
        if source_name.lower() == 'froala':
            service_context = "Froala is a WYSIWYG rich text editor. Focus on text editing, content creation, HTML editing, and web development."
        else:  # filestack
            service_context = "Filestack is a file upload, processing, and delivery service. Focus on file uploads, image processing, OCR, APIs, and file management."
        
        prompt = f"""{service_context}

Generate exactly 10 unique content ideas for the keyword: "{keyword}"
Target funnel stages: {funnel_list}

EXISTING CONTENT TO AVOID DUPLICATING:
{existing_context}

REQUIREMENTS:
1. All ideas must be relevant to "{keyword}" and {source_name}
2. Must be unique compared to existing content
3. Include appropriate funnel stage distribution
4. Focus on practical, valuable content

TITLE FORMATTING RULES:
- NO colons (:) in titles - use direct, clear titles instead
- NO "How to:" or "Guide to:" prefixes with colons
- Use direct action titles: "Build JavaScript Image Editor" not "How to: Build JavaScript Image Editor"
- Use simple descriptive titles: "JavaScript Image Processing Tutorial" not "Advanced Techniques: JavaScript Image Processing"

CRITICAL: Return ONLY JSON array - no explanations.

[{{"title":"Content idea 1","category":"Category","difficulty":"beginner","content_type":"guide","target_audience":"developers","keywords":["{keyword}","related"],"value_proposition":"Why valuable","funnel_stage":"top","keyword_focus":"{keyword}","uniqueness_angle":"What makes it unique"}}]"""

        try:
            response = self.openai_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.4,
                max_tokens=2000
            )
            
            content = response.choices[0].message.content.strip()
            
            # Clean JSON
            if content.startswith('```json'):
                content = content.replace('```json', '').replace('```', '')
            elif content.startswith('```'):
                content = content.replace('```', '', 2)
            
            content = content.strip()
            
            # Parse and validate
            try:
                ideas = json.loads(content)
                if isinstance(ideas, list):
                    # Clean up titles - remove colons and fix formatting
                    cleaned_ideas = []
                    for idea in ideas:
                        if isinstance(idea, dict) and 'title' in idea:
                            original_title = idea['title']
                            cleaned_title = self.clean_title(original_title)
                            
                            if cleaned_title != original_title:
                                print(f"🧹 Cleaned title: '{original_title}' → '{cleaned_title}'")
                            
                            idea['title'] = cleaned_title
                            cleaned_ideas.append(idea)
                    
                    # Ensure we have exactly 10 ideas
                    if len(cleaned_ideas) > 10:
                        cleaned_ideas = cleaned_ideas[:10]
                    elif len(cleaned_ideas) < 10:
                        print(f"WARNING:  Only got {len(cleaned_ideas)} ideas for '{keyword}', using what we have")
                    
                    return cleaned_ideas
                else:
                    print(f"ERROR: Invalid format for keyword '{keyword}'")
                    return self.get_fallback_keyword_ideas(keyword, funnel_stages, source_name)
                    
            except json.JSONDecodeError as e:
                print(f"ERROR: JSON parsing failed for keyword '{keyword}': {e}")
                print(f"SEARCH: Content preview: {content[:200]}...")
                return self.get_fallback_keyword_ideas(keyword, funnel_stages, source_name)
                
        except Exception as e:
            print(f"ERROR: Error generating ideas for keyword '{keyword}': {e}")
            return self.get_fallback_keyword_ideas(keyword, funnel_stages, source_name)
    
    def clean_title(self, title):
        """Clean up title formatting - remove colons and improve readability"""
        if not title or not isinstance(title, str):
            return title
        
        # Remove colons and clean up common patterns
        cleaned = title.strip()
        
        # Handle "How to: Something" → "How to Something" 
        if ': ' in cleaned:
            # Split on colon and reconstruct
            parts = cleaned.split(': ', 1)
            if len(parts) == 2:
                prefix = parts[0].strip()
                suffix = parts[1].strip()
                
                # Handle common prefixes
                if prefix.lower() in ['how to', 'guide to', 'tutorial', 'tips for']:
                    cleaned = f"{prefix} {suffix}"
                elif prefix.lower() in ['advanced', 'complete', 'ultimate', 'best']:
                    cleaned = f"{prefix} {suffix}"
                else:
                    # For other cases, just concatenate without colon
                    cleaned = f"{prefix} {suffix}"
        
        # Handle single colons at the end (remove them)
        if cleaned.endswith(':'):
            cleaned = cleaned[:-1].strip()
        
        # Handle multiple colons - replace all with spaces
        while ':' in cleaned:
            cleaned = cleaned.replace(':', ' ')
        
        # Clean up extra spaces
        cleaned = ' '.join(cleaned.split())
        
        return cleaned

    def get_fallback_keyword_ideas(self, keyword, funnel_stages, source_name):
        """Generate fallback ideas when GPT fails"""
        base_ideas = []
        funnel_stage = funnel_stages[0] if funnel_stages else "middle"
        
        if source_name.lower() == 'froala':
            base_ideas = [
                {"title": f"Complete {keyword.title()} Guide", "category": "Guide", "difficulty": "beginner", "content_type": "guide", "target_audience": "developers", "keywords": [keyword, "guide"], "value_proposition": f"Comprehensive {keyword} guide", "funnel_stage": funnel_stage, "keyword_focus": keyword, "uniqueness_angle": "Complete coverage"},
                {"title": f"{keyword.title()} Best Practices and Tips", "category": "Best Practices", "difficulty": "intermediate", "content_type": "guide", "target_audience": "developers", "keywords": [keyword, "best practices"], "value_proposition": f"Optimize your {keyword} usage", "funnel_stage": funnel_stage, "keyword_focus": keyword, "uniqueness_angle": "Best practices focus"},
                {"title": f"Troubleshooting Common {keyword.title()} Issues", "category": "Troubleshooting", "difficulty": "intermediate", "content_type": "guide", "target_audience": "developers", "keywords": [keyword, "troubleshooting"], "value_proposition": f"Solve {keyword} problems", "funnel_stage": "bottom", "keyword_focus": keyword, "uniqueness_angle": "Problem-solving focus"}
            ]
        else:  # filestack
            base_ideas = [
                {"title": f"Ultimate {keyword.title()} Implementation Guide", "category": "Implementation", "difficulty": "intermediate", "content_type": "tutorial", "target_audience": "developers", "keywords": [keyword, "implementation"], "value_proposition": f"Master {keyword} implementation", "funnel_stage": funnel_stage, "keyword_focus": keyword, "uniqueness_angle": "Implementation focus"},
                {"title": f"{keyword.title()} API Integration Tutorial", "category": "API", "difficulty": "intermediate", "content_type": "tutorial", "target_audience": "developers", "keywords": [keyword, "api"], "value_proposition": f"Integrate {keyword} APIs", "funnel_stage": "bottom", "keyword_focus": keyword, "uniqueness_angle": "API integration"},
                {"title": f"Performance Optimization for {keyword.title()}", "category": "Performance", "difficulty": "advanced", "content_type": "guide", "target_audience": "developers", "keywords": [keyword, "performance"], "value_proposition": f"Optimize {keyword} performance", "funnel_stage": "bottom", "keyword_focus": keyword, "uniqueness_angle": "Performance focus"}
            ]
        
        # Extend to 10 ideas with variations
        extended_ideas = base_ideas.copy()
        for i in range(len(base_ideas), 10):
            variation = base_ideas[i % len(base_ideas)].copy()
            variation["title"] = f"{variation['title']} - Part {(i // len(base_ideas)) + 1}"
            variation["uniqueness_angle"] = f"{variation['uniqueness_angle']} - detailed approach"
            extended_ideas.append(variation)
        
        return extended_ideas[:10]
    
    def calculate_title_similarity_with_gpt(self, idea_title, existing_titles):
        """Use GPT-4o-mini to calculate semantic title similarity with batching for large lists"""
        if not existing_titles:
            return []
        
        # For large lists, process in smaller batches to avoid token limits
        max_batch_size = 20  # Same as HTML interface
        
        if len(existing_titles) <= max_batch_size:
            return self._calculate_title_similarity_batch(idea_title, existing_titles)
        else:
            # Process in batches
            all_scores = []
            for i in range(0, len(existing_titles), max_batch_size):
                batch = existing_titles[i:i + max_batch_size]
                batch_scores = self._calculate_title_similarity_batch(idea_title, batch)
                all_scores.extend(batch_scores)
            return all_scores
    
    def _calculate_title_similarity_batch(self, idea_title, title_batch):
        """Process a single batch of title similarities"""
        prompt = f"""You are a content similarity expert. Compare the proposed content idea with existing article titles to determine semantic similarity.

PROPOSED IDEA: "{idea_title}"

EXISTING TITLES:
{chr(10).join([f'{i + 1}. "{title}"' for i, title in enumerate(title_batch)])}

For each existing title, rate how similar it is to the proposed idea on a scale of 0.0 to 1.0, where:
- 1.0 = Essentially the same topic (duplicate content)
- 0.8-0.9 = Very similar topic with slight variation
- 0.6-0.7 = Related topic but different angle
- 0.4-0.5 = Somewhat related
- 0.0-0.3 = Different topics

Consider semantic meaning, not just word matching. For example:
- "How to install X" vs "Integrating X guide" = high similarity (~0.85)
- "React file upload" vs "File handling in React" = high similarity (~0.8)
- "Best practices for X" vs "X tutorial" = medium similarity (~0.6)

CRITICAL: Respond with ONLY a valid JSON array of exactly {len(title_batch)} numbers, no explanations:
[0.85, 0.23, 0.91, 0.45]"""

        try:
            response = self.openai_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.1,  # Low temperature for consistent scoring
                max_tokens=400  # Increased from 200 to handle larger arrays
            )
            
            response_content = response.choices[0].message.content.strip()
            
            # Clean up response more thoroughly (same as HTML interface)
            if response_content.startswith('```json'):
                response_content = response_content.replace('```json', '').replace('```', '')
            elif response_content.startswith('```'):
                response_content = response_content.replace('```', '', 2)  # Remove first and last ```
            
            # Remove any trailing text after the JSON array
            import re
            array_match = re.search(r'\[[\s\S]*?\]', response_content)
            if array_match:
                response_content = array_match.group(0)
            
            # Fix common JSON formatting issues
            response_content = response_content.replace(',]', ']')  # Remove trailing commas
            response_content = response_content.replace(',,', ',')  # Remove double commas
            response_content = re.sub(r'\s+', ' ', response_content)  # Normalize whitespace
            response_content = response_content.strip()
            
            # Check if JSON array is incomplete (missing closing bracket)
            if response_content.startswith('[') and not response_content.endswith(']'):
                print('⚠️ Detected incomplete JSON array, attempting to fix...')
                response_content = response_content + ']'
            
            # Remove any trailing incomplete elements (e.g., ", 0" without closing)
            response_content = re.sub(r',\s*\d*\.?\d*\s*$', ']', response_content)
            response_content = response_content.replace(']]', ']')
            
            print(f"DEBUG: Cleaned JSON for parsing: {response_content[:100]}...")
            
            import json
            scores = json.loads(response_content)
            
            # Ensure we have the right number of scores
            if isinstance(scores, list):
                if len(scores) < len(title_batch):
                    # Pad with default values if array is too short
                    while len(scores) < len(title_batch):
                        scores.append(0.3)
                elif len(scores) > len(title_batch):
                    # Truncate if array is too long
                    scores = scores[:len(title_batch)]
                return scores
            else:
                return [0.3] * len(title_batch)
            
        except Exception as e:
            print(f"WARNING:  GPT title similarity failed, falling back to basic matching: {e}")
            # Fallback to basic word matching
            return [self.basic_word_similarity(idea_title, title) for title in title_batch]
    
    def basic_word_similarity(self, title1, title2):
        """Fallback basic word similarity calculation"""
        words1 = set(title1.lower().split())
        words2 = set(title2.lower().split())
        intersection = words1.intersection(words2)
        return len(intersection) / max(len(words1), len(words2)) if words1 or words2 else 0
    
    def verify_idea_uniqueness(self, idea, relevant_existing_titles, threshold=0.65):
        """Enhanced uniqueness check using GPT title similarity + content embeddings like HTML interface"""
        try:
            idea_title = idea['title']
            idea_text = f"{idea['title']} {idea.get('value_proposition', '')}"
            
            if not relevant_existing_titles:
                return {"is_unique": True, "similarity": 0.0, "most_similar": "", "confidence": "high", "total_checked": 0}
            
            # Step 1: Get GPT-4o-mini title similarity analysis (like HTML interface)
            print(f"GPT: Using GPT-4o-mini for intelligent title similarity analysis...")
            title_similarities = self.calculate_title_similarity_with_gpt(idea_title, relevant_existing_titles)
            
            # Step 2: Generate content embeddings for comparison
            idea_embedding = self.openai_client.embeddings.create(
                model="text-embedding-3-large",
                input=idea_text
            ).data[0].embedding
            
            batch_response = self.openai_client.embeddings.create(
                model="text-embedding-3-large",
                input=relevant_existing_titles
            )
            
            max_combined_similarity = 0
            most_similar = ""
            
            # Step 3: Combine title similarity (70% weight) + content similarity (30% weight)
            for j, existing_embedding in enumerate(batch_response.data):
                existing_vector = existing_embedding.embedding
                
                # Calculate content similarity via embeddings
                content_similarity = np.dot(idea_embedding, existing_vector) / (
                    np.linalg.norm(idea_embedding) * np.linalg.norm(existing_vector)
                )
                
                # Get title similarity from GPT analysis
                title_similarity = title_similarities[j] if j < len(title_similarities) else 0.3
                
                # Combined score: 70% title similarity + 30% content similarity (like HTML interface)
                combined_score = (title_similarity * 0.7) + (content_similarity * 0.3)
                
                if combined_score > max_combined_similarity:
                    max_combined_similarity = combined_score
                    most_similar = relevant_existing_titles[j]
            
            is_unique = bool(max_combined_similarity < threshold)
            
            return {
                "is_unique": is_unique,
                "similarity": float(max_combined_similarity),
                "most_similar": most_similar,
                "confidence": "high" if max_combined_similarity < 0.45 else "medium" if max_combined_similarity < 0.65 else "low",
                "total_checked": len(relevant_existing_titles)
            }
            
        except Exception as e:
            print(f"WARNING:  Error verifying uniqueness for '{idea['title'][:40]}...': {e}")
            return {"is_unique": True, "similarity": 0.5, "most_similar": "verification_failed", "confidence": "low", "total_checked": 0}
    
    def analyze_keywords_for_source(self, source_name):
        """Analyze all keywords for a specific source"""
        print(f"\\nTARGET: Analyzing keywords for {source_name.upper()}")
        print("=" * 60)
        
        # Get keywords for this source
        if source_name.lower() == 'froala':
            keywords_dict = self.froala_keywords
            collection_name = 'froala'
        else:
            keywords_dict = self.filestack_keywords
            collection_name = 'filestack'
        
        # Get existing content
        existing_titles = self.get_all_content_titles(collection_name)
        
        # Analyze each keyword
        all_keyword_gaps = {}
        total_unique_ideas = 0
        
        for keyword, funnel_stages in keywords_dict.items():
            print(f"\\nSEARCH: Analyzing keyword: '{keyword}' (funnel: {', '.join(funnel_stages)})")
            
            # Generate ideas for this keyword
            ideas = self.generate_keyword_content_ideas(keyword, funnel_stages, source_name, existing_titles)
            
            # Verify uniqueness of each idea
            unique_ideas = []
            for idea in ideas:
                uniqueness_check = self.verify_idea_uniqueness(idea, existing_titles)
                
                idea['uniqueness_verification'] = uniqueness_check
                
                if uniqueness_check['is_unique']:
                    unique_ideas.append(idea)
                    print(f"  SUCCESS: Unique: {idea['title'][:60]}... (similarity: {uniqueness_check['similarity']:.2f})")
                else:
                    print(f"  ERROR: Similar: {idea['title'][:60]}... (similarity: {uniqueness_check['similarity']:.2f} to '{uniqueness_check['most_similar'][:40]}...')")
            
            all_keyword_gaps[keyword] = {
                'funnel_stages': funnel_stages,
                'total_ideas_generated': len(ideas),
                'unique_ideas': unique_ideas,
                'unique_count': len(unique_ideas),
                'all_ideas': ideas  # Include all for reference
            }
            
            total_unique_ideas += len(unique_ideas)
            print(f"  DATA: Result: {len(unique_ideas)}/{len(ideas)} unique ideas for '{keyword}'")
            
            time.sleep(0.3)  # Rate limiting
        
        print(f"\\nCOMPLETE: Analysis complete for {source_name}!")
        print(f"DATA: Total unique content opportunities: {total_unique_ideas}")
        print(f"STATS: Average unique ideas per keyword: {total_unique_ideas / len(keywords_dict):.1f}")
        
        return {
            'source_name': source_name,
            'collection_name': collection_name,
            'total_keywords': len(keywords_dict),
            'total_unique_ideas': total_unique_ideas,
            'keyword_gaps': all_keyword_gaps,
            'existing_content_count': len(existing_titles),
            'analysis_timestamp': time.time()
        }
    
    def generate_complete_keyword_report(self):
        """Generate complete keyword gap analysis for both sources"""
        report = {
            'analysis_metadata': {
                'timestamp': time.time(),
                'analysis_type': 'keyword_focused_gaps',
                'total_sources': 2
            },
            'source_analyses': {}
        }
        
        # Analyze both sources
        for source in ['froala', 'filestack']:
            print(f"\\n{'='*20} ANALYZING {source.upper()} {'='*20}")
            analysis = self.analyze_keywords_for_source(source)
            report['source_analyses'][source] = analysis
        
        # Calculate summary stats
        total_keywords = sum(data['total_keywords'] for data in report['source_analyses'].values())
        total_unique_ideas = sum(data['total_unique_ideas'] for data in report['source_analyses'].values())
        
        report['analysis_metadata']['total_keywords_analyzed'] = total_keywords
        report['analysis_metadata']['total_unique_ideas_found'] = total_unique_ideas
        
        # Save report
        output_file = 'keyword_content_gaps.json'
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        
        print(f"\\n📋 Complete keyword analysis saved to {output_file}")
        print(f"DATA: Summary: {total_unique_ideas} unique ideas across {total_keywords} keywords")
        
        return report


    def analyze_single_keyword(self, source_name, keyword):
        """Analyze a single keyword for focused content gap analysis"""
        print(f"\\nTARGET: Single Keyword Analysis")
        print("=" * 50)
        print(f"SEARCH: Source: {source_name.upper()}")
        print(f"KEYWORD:  Keyword: '{keyword}'")
        print()
        
        # Validate source and keyword
        if source_name.lower() == 'froala':
            collection_name = 'froala'
            if keyword not in self.froala_keywords:
                print(f"WARNING:  Warning: '{keyword}' not in predefined Froala keywords")
                print("Available keywords:", list(self.froala_keywords.keys()))
                funnel_stages = ['top', 'middle', 'bottom']  # Default
            else:
                funnel_stages = self.froala_keywords[keyword]
        elif source_name.lower() == 'filestack':
            collection_name = 'filestack'
            if keyword not in self.filestack_keywords:
                print(f"WARNING:  Warning: '{keyword}' not in predefined Filestack keywords")
                print("Available keywords:", list(self.filestack_keywords.keys()))
                funnel_stages = ['top', 'middle', 'bottom']  # Default
            else:
                funnel_stages = self.filestack_keywords[keyword]
        else:
            print(f"ERROR: Invalid source '{source_name}'. Use 'froala' or 'filestack'")
            return None
        
        print(f"TARGET: Target funnel stages: {', '.join(funnel_stages)}")
        print()
        
        # Get existing content
        existing_titles = self.get_all_content_titles(collection_name)
        if not existing_titles:
            print(f"ERROR: No existing content found in {collection_name} collection")
            return None
        
        # Get the most relevant existing content for this keyword (for both generation and verification)
        relevant_existing_titles = self.find_most_relevant_existing_content(keyword, existing_titles, limit=50)
        
        # Generate ideas for this specific keyword
        print(f"GPT: Generating 10 unique content ideas for '{keyword}'...")
        ideas = self.generate_keyword_content_ideas_with_relevant_content(keyword, funnel_stages, source_name, relevant_existing_titles)
        
        if not ideas:
            print(f"ERROR: Failed to generate ideas for '{keyword}'")
            return None
        
        # Verify uniqueness against ONLY the relevant existing content (much faster!)
        unique_ideas = []
        print(f"\\nSUCCESS: Verifying uniqueness against {len(relevant_existing_titles)} most relevant articles...")
        
        for i, idea in enumerate(ideas, 1):
            print(f"\\nIDEA {i}: {idea['title'][:60]}...")
            uniqueness_check = self.verify_idea_uniqueness(idea, relevant_existing_titles)  # Only check against relevant titles!
            
            idea['uniqueness_verification'] = uniqueness_check
            
            if uniqueness_check['is_unique']:
                unique_ideas.append(idea)
                print(f"      SUCCESS: UNIQUE (similarity: {uniqueness_check['similarity']:.2f}, confidence: {uniqueness_check['confidence']})")
            else:
                print(f"      ERROR: DUPLICATE (similarity: {uniqueness_check['similarity']:.2f})")
                print(f"         Similar to: '{uniqueness_check['most_similar'][:60]}...'")
        
        # Results summary
        print(f"\\nCOMPLETE: Analysis Complete for '{keyword}'")
        print("=" * 50)
        print(f"DATA: Generated: {len(ideas)} ideas")
        print(f"SUCCESS: Unique: {len(unique_ideas)} ideas")
        print(f"ERROR: Duplicates: {len(ideas) - len(unique_ideas)} ideas")
        print(f"STATS: Success rate: {len(unique_ideas) / len(ideas) * 100:.1f}%")
        
        if unique_ideas:
            print(f"\\nIDEAS: UNIQUE CONTENT OPPORTUNITIES:")
            for i, idea in enumerate(unique_ideas, 1):
                verification = idea['uniqueness_verification']
                print(f"\\n{i}. {idea['title']}")
                print(f"   TARGET: Funnel: {idea.get('funnel_stage', 'N/A')} | Difficulty: {idea.get('difficulty', 'N/A')} | Type: {idea.get('content_type', 'N/A')}")
                print(f"   IDEAS: Value: {idea.get('value_proposition', 'N/A')}")
                print(f"   SEARCH: Uniqueness: {verification['confidence']} confidence (similarity: {verification['similarity']:.2f})")
                if idea.get('keywords'):
                    print(f"   KEYWORD:  Keywords: {', '.join(idea['keywords'])}")
        
        return {
            'keyword': keyword,
            'source': source_name,
            'funnel_stages': funnel_stages,
            'total_generated': len(ideas),
            'unique_ideas': unique_ideas,
            'unique_count': len(unique_ideas),
            'success_rate': len(unique_ideas) / len(ideas) * 100,
            'existing_content_count': len(existing_titles)
        }


def main():
    import argparse
    
    # Set up argument parser
    parser = argparse.ArgumentParser(
        description="TARGET: Keyword-Focused Content Gap Analyzer",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Single keyword analysis
  python keyword_gap_analyzer.py --filestack --keyword "file uploader"
  python keyword_gap_analyzer.py --froala --keyword "wysiwyg editor"
  
  # Multiple specific keywords sequentially
  python keyword_gap_analyzer.py --filestack --keywords "file uploader" "javascript image editing" "ocr api free"
  python keyword_gap_analyzer.py --froala --keywords "wysiwyg editor" "html to wysiwyg" "best wysiwyg html editor"
  
  # AUTO MODE - All keywords sequentially (RECOMMENDED - fresh token limits per keyword)
  python keyword_gap_analyzer.py --filestack --auto
  python keyword_gap_analyzer.py --froala --auto
  
  # All keywords in single large request (may hit token limits)
  python keyword_gap_analyzer.py --filestack --all
  python keyword_gap_analyzer.py --froala --all
  
  # List available keywords
  python keyword_gap_analyzer.py --filestack --list-keywords
  python keyword_gap_analyzer.py --froala --list-keywords
        """
    )
    
    # Source selection (mutually exclusive)
    source_group = parser.add_mutually_exclusive_group(required=True)
    source_group.add_argument('--filestack', action='store_true', help='Analyze Filestack keywords')
    source_group.add_argument('--froala', action='store_true', help='Analyze Froala keywords')
    
    # Analysis type (mutually exclusive)
    analysis_group = parser.add_mutually_exclusive_group(required=True)
    analysis_group.add_argument('--keyword', type=str, help='Analyze a specific keyword')
    analysis_group.add_argument('--keywords', nargs='+', help='Analyze multiple specific keywords sequentially')
    analysis_group.add_argument('--auto', action='store_true', help='Analyze ALL keywords sequentially (fresh request per keyword)')
    analysis_group.add_argument('--all', action='store_true', help='Analyze all keywords for the source (single large request)')
    analysis_group.add_argument('--list-keywords', action='store_true', help='List available keywords for the source')
    
    # Parse arguments
    args = parser.parse_args()
    
    # Determine source
    source_name = 'filestack' if args.filestack else 'froala'
    
    # Initialize analyzer
    analyzer = KeywordGapAnalyzer()
    
    print("TARGET Keyword-Focused Content Gap Analyzer")
    print("=" * 60)
    
    # Handle different modes
    if args.list_keywords:
        # List available keywords
        if source_name == 'froala':
            keywords_dict = analyzer.froala_keywords
        else:
            keywords_dict = analyzer.filestack_keywords
        
        print(f"📋 Available {source_name.upper()} keywords:")
        print()
        for keyword, funnel_stages in keywords_dict.items():
            print(f"  KEYWORD:  '{keyword}' → funnel: {', '.join(funnel_stages)}")
        print(f"\\nDATA: Total: {len(keywords_dict)} keywords available")
        
    elif args.keyword:
        # Analyze single keyword
        result = analyzer.analyze_single_keyword(source_name, args.keyword)
        if result:
            print(f"\\nSAVED: Single keyword analysis complete!")
            print(f"NEXT: You can now run the setup script to upload these gaps to Qdrant")
    
    elif args.keywords:
        # Analyze multiple keywords sequentially
        print(f"PROCESS: Analyzing {len(args.keywords)} keywords sequentially for {source_name.upper()}")
        print("=" * 60)
        
        results = []
        total_unique = 0
        total_generated = 0
        
        for i, keyword in enumerate(args.keywords, 1):
            print(f"\\nSEARCH: Processing keyword {i}/{len(args.keywords)}: '{keyword}'")
            print("-" * 40)
            
            result = analyzer.analyze_single_keyword(source_name, keyword)
            
            if result:
                results.append(result)
                total_unique += result['unique_count']
                total_generated += result['total_generated']
                print(f"SUCCESS: Keyword '{keyword}' complete: {result['unique_count']}/{result['total_generated']} unique ideas")
            else:
                print(f"ERROR: Failed to analyze keyword '{keyword}'")
            
            # Short pause between keywords
            if i < len(args.keywords):
                print(f"WAIT: Pausing 3 seconds before next keyword...")
                time.sleep(3)
        
        # Summary of all keywords
        print(f"\\nCOMPLETE: SEQUENTIAL ANALYSIS COMPLETE")
        print("=" * 50)
        print(f"DATA: Keywords processed: {len(results)}/{len(args.keywords)}")
        print(f"IDEAS: Total unique ideas: {total_unique}")
        print(f"STATS: Total ideas generated: {total_generated}")
        print(f"TARGET: Overall success rate: {total_unique / total_generated * 100:.1f}%" if total_generated > 0 else "No ideas generated")
        
        # Show breakdown by keyword
        if results:
            print(f"\\n📋 BREAKDOWN BY KEYWORD:")
            for result in results:
                print(f"  KEYWORD:  '{result['keyword']}': {result['unique_count']}/{result['total_generated']} unique ({result['success_rate']:.1f}%)")
        
        print(f"\\nSAVED: Sequential analysis complete!")
        print(f"NEXT: Run the setup script to upload all gaps to Qdrant")
    
    elif args.auto:
        # Analyze ALL keywords sequentially (fresh request per keyword)
        if source_name == 'froala':
            keywords_dict = analyzer.froala_keywords
        else:
            keywords_dict = analyzer.filestack_keywords
        
        all_keywords = list(keywords_dict.keys())
        
        print(f"AUTO MODE: Analyzing ALL {len(all_keywords)} {source_name.upper()} keywords sequentially")
        print(f"PROCESS: Each keyword gets a fresh API request (token limits reset per keyword)")
        print("=" * 70)
        
        results = []
        total_unique = 0
        total_generated = 0
        failed_keywords = []
        
        for i, keyword in enumerate(all_keywords, 1):
            print(f"\\nSEARCH: Processing keyword {i}/{len(all_keywords)}: '{keyword}'")
            print("-" * 50)
            
            result = analyzer.analyze_single_keyword(source_name, keyword)
            
            if result:
                results.append(result)
                total_unique += result['unique_count']
                total_generated += result['total_generated']
                print(f"SUCCESS: '{keyword}' → {result['unique_count']}/{result['total_generated']} unique ideas ({result['success_rate']:.1f}%)")
            else:
                failed_keywords.append(keyword)
                print(f"ERROR: '{keyword}' → FAILED")
            
            # Pause between keywords to respect rate limits
            if i < len(all_keywords):
                print(f"WAIT: Cooling down for 2 seconds...")
                time.sleep(2)
        
        # Final comprehensive summary
        print(f"\\nCOMPLETE: AUTO ANALYSIS COMPLETE")
        print("=" * 60)
        print(f"DATA: Total keywords: {len(all_keywords)}")
        print(f"SUCCESS: Successful: {len(results)}")
        print(f"ERROR: Failed: {len(failed_keywords)}")
        print(f"IDEAS: Total unique ideas: {total_unique}")
        print(f"STATS: Total ideas generated: {total_generated}")
        print(f"TARGET: Overall success rate: {total_unique / total_generated * 100:.1f}%" if total_generated > 0 else "No ideas generated")
        
        # Show top performing keywords
        if results:
            print(f"\\nTOP: TOP PERFORMING KEYWORDS:")
            top_results = sorted(results, key=lambda x: x['unique_count'], reverse=True)[:5]
            for i, result in enumerate(top_results, 1):
                print(f"  {i}. '{result['keyword']}' → {result['unique_count']} unique ideas")
        
        # Show failed keywords if any
        if failed_keywords:
            print(f"\\nWARNING:  FAILED KEYWORDS ({len(failed_keywords)}):")
            for keyword in failed_keywords:
                print(f"  - '{keyword}'")
            print(f"\\nIDEAS: You can retry failed keywords individually with:")
            print(f"   python keyword_gap_analyzer.py --{source_name} --keyword \"failed_keyword\"")
        
        # Save results to JSON file
        auto_report = {
            'analysis_metadata': {
                'timestamp': time.time(),
                'analysis_type': 'auto_keyword_sequential',
                'source': source_name,
                'total_keywords': len(all_keywords),
                'successful_keywords': len(results),
                'failed_keywords': len(failed_keywords),
                'total_unique_ideas': total_unique,
                'total_generated_ideas': total_generated,
                'overall_success_rate': total_unique / total_generated * 100 if total_generated > 0 else 0
            },
            'results': results,
            'failed_keywords': failed_keywords
        }
        
        output_file = f'{source_name}_auto_keyword_gaps.json'
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(auto_report, f, indent=2, ensure_ascii=False)
        
        print(f"\\nSAVED: Complete auto analysis finished!")
        print(f"FILE: Results saved to: {output_file}")
        print(f"NEXT: Run the setup script to upload all {total_unique} unique gaps to Qdrant")
        
    elif args.all:
        # Analyze all keywords (existing functionality)
        print("Generating complete keyword gap analysis...")
        print()
        report = analyzer.generate_complete_keyword_report()
        
        # Print summary
        print(f"\\nDATA: FINAL SUMMARY")
        print("=" * 40)
        for source, data in report['source_analyses'].items():
            print(f"SEARCH: {source.upper()}:")
            print(f"   FILE: Keywords analyzed: {data['total_keywords']}")
            print(f"   IDEAS: Unique ideas found: {data['total_unique_ideas']}")
            print(f"   STATS: Avg per keyword: {data['total_unique_ideas'] / data['total_keywords']:.1f}")
            
            # Show top keywords by unique ideas
            sorted_keywords = sorted(
                data['keyword_gaps'].items(), 
                key=lambda x: x[1]['unique_count'], 
                reverse=True
            )
            print(f"   TOP: Top keywords by unique ideas:")
            for keyword, gap_data in sorted_keywords[:3]:
                print(f"      • '{keyword}': {gap_data['unique_count']} unique ideas")
            print()


if __name__ == '__main__':
    main()