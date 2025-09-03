#!/usr/bin/env python3
"""
Setup Keyword-Focused Content Gaps Collection in Qdrant
Uploads keyword-based verified content gaps for targeted recommendations
"""

import os
import json
import openai
from qdrant_client import QdrantClient
from qdrant_client.http import models
from dotenv import load_dotenv
import uuid

load_dotenv()

class KeywordGapsUploader:
    def __init__(self):
        self.openai_client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        self.qdrant_client = QdrantClient(
            host=os.getenv('QDRANT_HOST', 'localhost'),
            port=int(os.getenv('QDRANT_PORT', 6333))
        )
        self.collection_name = "keyword_content_gaps"
        
    def create_keyword_gaps_collection(self):
        """Create or recreate the keyword-focused content gaps collection"""
        try:
            # Delete existing collection if it exists
            try:
                self.qdrant_client.delete_collection(self.collection_name)
                print(f"🗑️  Deleted existing {self.collection_name} collection")
            except:
                pass
            
            # Create new collection
            self.qdrant_client.create_collection(
                collection_name=self.collection_name,
                vectors_config=models.VectorParams(
                    size=3072,  # text-embedding-3-large dimensions
                    distance=models.Distance.COSINE
                )
            )
            print(f"✅ Created new {self.collection_name} collection")
            
        except Exception as e:
            print(f"❌ Error creating collection: {e}")
            return False
        
        return True
    
    def generate_embedding(self, text):
        """Generate embedding for text"""
        try:
            response = self.openai_client.embeddings.create(
                model="text-embedding-3-large",
                input=text
            )
            return response.data[0].embedding
        except Exception as e:
            print(f"❌ Error generating embedding: {e}")
            return None
    
    def upload_keyword_gaps_to_collection(self, gaps_report_file="keyword_content_gaps.json"):
        """Upload keyword-focused content gaps to Qdrant collection"""
        
        # Load the keyword gaps report
        try:
            with open(gaps_report_file, 'r', encoding='utf-8') as f:
                report = json.load(f)
        except Exception as e:
            print(f"❌ Error loading keyword gaps report: {e}")
            return False
        
        print(f"📊 Loading keyword-focused content gaps from {gaps_report_file}")
        
        # Prepare points for upload
        points = []
        point_id = 1
        
        for source_key, source_data in report['source_analyses'].items():
            source_name = source_data['source_name']
            keyword_gaps = source_data['keyword_gaps']
            
            total_gaps = sum(len(gap_data['unique_ideas']) for gap_data in keyword_gaps.values())
            print(f"🔍 Processing {total_gaps} unique gaps across {len(keyword_gaps)} keywords for {source_name}")
            
            for keyword, gap_data in keyword_gaps.items():
                unique_ideas = gap_data['unique_ideas']
                funnel_stages = gap_data['funnel_stages']
                
                print(f"  📝 Processing {len(unique_ideas)} unique ideas for keyword: '{keyword}'")
                
                for idea in unique_ideas:
                    # Create embedding text combining title, value proposition, and keyword focus
                    embedding_text = f"{idea['title']}. {idea.get('value_proposition', '')} {idea.get('uniqueness_angle', '')} {keyword}"
                    embedding = self.generate_embedding(embedding_text)
                    
                    if embedding:
                        # Create comprehensive payload
                        uniqueness_verification = idea.get('uniqueness_verification', {})
                        
                        payload = {
                            "title": idea['title'],
                            "source": source_name.lower(),
                            "keyword_focus": keyword,
                            "target_funnel_stages": funnel_stages,
                            "primary_funnel_stage": idea.get('funnel_stage', 'middle'),
                            "category": idea.get('category', 'general'),
                            "difficulty": idea.get('difficulty', 'intermediate'),
                            "content_type": idea.get('content_type', 'guide'),
                            "target_audience": idea.get('target_audience', 'developers'),
                            "keywords": idea.get('keywords', [keyword]),
                            "value_proposition": idea.get('value_proposition', ''),
                            "uniqueness_angle": idea.get('uniqueness_angle', ''),
                            
                            # Uniqueness verification data
                            "verified_unique": uniqueness_verification.get('is_unique', True),
                            "similarity_score": uniqueness_verification.get('similarity', 0.0),
                            "uniqueness_confidence": uniqueness_verification.get('confidence', 'medium'),
                            "most_similar_existing": uniqueness_verification.get('most_similar', ''),
                            
                            # Metadata
                            "gap_type": "keyword_focused",
                            "keyword_category": self.categorize_keyword(keyword, source_name),
                            "created_timestamp": report['analysis_metadata']['timestamp']
                        }
                        
                        points.append(models.PointStruct(
                            id=point_id,
                            vector=embedding,
                            payload=payload
                        ))
                        
                        point_id += 1
        
        print(f"📤 Prepared {len(points)} keyword-focused content gaps for upload")
        
        # Upload to Qdrant in batches
        try:
            batch_size = 50
            for i in range(0, len(points), batch_size):
                batch = points[i:i + batch_size]
                self.qdrant_client.upsert(
                    collection_name=self.collection_name,
                    points=batch
                )
                print(f"📤 Uploaded batch {i//batch_size + 1}/{(len(points)-1)//batch_size + 1}")
            
            print(f"🎉 Successfully uploaded {len(points)} keyword-focused content gaps")
            return True
            
        except Exception as e:
            print(f"❌ Error uploading to Qdrant: {e}")
            return False
    
    def categorize_keyword(self, keyword, source_name):
        """Categorize keyword for better organization"""
        keyword_lower = keyword.lower()
        
        if source_name.lower() == 'froala':
            if any(term in keyword_lower for term in ['what is', 'best', 'editor']):
                return 'awareness'
            elif any(term in keyword_lower for term in ['html', 'code', 'javascript']):
                return 'technical'
            else:
                return 'general'
        else:  # filestack
            if any(term in keyword_lower for term in ['api', 'sdk']):
                return 'api_integration'
            elif any(term in keyword_lower for term in ['upload', 'file']):
                return 'file_handling'
            elif any(term in keyword_lower for term in ['ocr', 'recognition']):
                return 'ai_processing'
            elif any(term in keyword_lower for term in ['image', 'photo']):
                return 'image_processing'
            else:
                return 'general'
    
    def verify_keyword_collection(self):
        """Verify the keyword-focused collection was created successfully"""
        try:
            info = self.qdrant_client.get_collection(self.collection_name)
            print(f"📊 Keyword Collection Verification:")
            print(f"   📄 Points count: {info.points_count}")
            print(f"   🎯 Vector size: {info.config.params.vectors.size}")
            print(f"   📏 Distance metric: {info.config.params.vectors.distance}")
            
            # Sample content gaps by source
            for source in ['froala', 'filestack']:
                sample = self.qdrant_client.scroll(
                    collection_name=self.collection_name,
                    scroll_filter=models.Filter(
                        must=[
                            models.FieldCondition(
                                key="source",
                                match=models.MatchValue(value=source)
                            )
                        ]
                    ),
                    limit=3,
                    with_payload=True
                )[0]
                
                print(f"\\n📋 Sample {source.title()} keyword gaps:")
                for point in sample:
                    payload = point.payload
                    print(f"   🎯 Keyword: '{payload['keyword_focus']}' | Funnel: {payload['primary_funnel_stage']}")
                    print(f"      📝 {payload['title']}")
                    print(f"      🔍 Uniqueness: {payload['uniqueness_confidence']} confidence")
            
            # Show keyword distribution
            self.show_keyword_distribution()
            
            return True
            
        except Exception as e:
            print(f"❌ Error verifying collection: {e}")
            return False
    
    def show_keyword_distribution(self):
        """Show distribution of content gaps by keyword and funnel stage"""
        try:
            # Get sample of all points to analyze distribution
            all_points = self.qdrant_client.scroll(
                collection_name=self.collection_name,
                limit=1000,  # Adjust based on expected size
                with_payload=True
            )[0]
            
            # Analyze distribution
            keyword_counts = {}
            funnel_counts = {}
            source_counts = {}
            
            for point in all_points:
                payload = point.payload
                
                # Count by keyword
                keyword = payload.get('keyword_focus', 'unknown')
                keyword_counts[keyword] = keyword_counts.get(keyword, 0) + 1
                
                # Count by funnel stage
                funnel = payload.get('primary_funnel_stage', 'unknown')
                funnel_counts[funnel] = funnel_counts.get(funnel, 0) + 1
                
                # Count by source
                source = payload.get('source', 'unknown')
                source_counts[source] = source_counts.get(source, 0) + 1
            
            print(f"\\n📊 Content Gap Distribution:")
            print(f"   📈 By Source: {dict(sorted(source_counts.items(), key=lambda x: x[1], reverse=True))}")
            print(f"   🎯 By Funnel Stage: {dict(sorted(funnel_counts.items(), key=lambda x: x[1], reverse=True))}")
            print(f"   🔤 Top Keywords by Gap Count:")
            
            top_keywords = sorted(keyword_counts.items(), key=lambda x: x[1], reverse=True)[:10]
            for keyword, count in top_keywords:
                print(f"      • '{keyword}': {count} gaps")
                
        except Exception as e:
            print(f"⚠️  Error showing distribution: {e}")


def main():
    uploader = KeywordGapsUploader()
    
    print("📤 Keyword-Focused Content Gaps Collection Setup")
    print("=" * 60)
    print("Uploading keyword-based verified content gaps to Qdrant")
    print("for targeted duplicate content recommendations.")
    print()
    
    # Step 1: Create collection
    print("🔧 Creating keyword-focused content gaps collection...")
    if not uploader.create_keyword_gaps_collection():
        print("❌ Failed to create collection. Exiting.")
        return
    
    # Step 2: Upload gaps
    print("\\n📤 Uploading keyword-focused content gaps...")
    if not uploader.upload_keyword_gaps_to_collection():
        print("❌ Failed to upload gaps. Exiting.")
        return
    
    # Step 3: Verify
    print("\\n✅ Verifying keyword collection...")
    uploader.verify_keyword_collection()
    
    print("\\n🎉 Keyword-focused setup complete!")
    print(f"🔗 View collection: http://localhost:6333/dashboard#/collections/keyword_content_gaps")
    print("\\n💡 Next steps:")
    print("1. The duplicate content checker will use this keyword-focused collection")
    print("2. Suggestions are now organized by target keywords and funnel stages")
    print("3. Re-run keyword analysis to refresh as content grows")


if __name__ == '__main__':
    main()