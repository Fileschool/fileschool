#!/usr/bin/env python3
"""
Setup Content Gaps Collection in Qdrant
Uploads verified content gaps to a dedicated collection for recommendations
"""

import os
import json
import openai
from qdrant_client import QdrantClient
from qdrant_client.http import models
from dotenv import load_dotenv
import uuid

load_dotenv()

class ContentGapsUploader:
    def __init__(self):
        self.openai_client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        self.qdrant_client = QdrantClient(
            host=os.getenv('QDRANT_HOST', 'localhost'),
            port=int(os.getenv('QDRANT_PORT', 6333))
        )
        self.collection_name = "content_gaps"
        
    def create_gaps_collection(self):
        """Create or recreate the content gaps collection"""
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
    
    def upload_gaps_to_collection(self, gaps_report_file="content_gaps_analysis.json"):
        """Upload verified content gaps to Qdrant collection"""
        
        # Load the gaps report
        try:
            with open(gaps_report_file, 'r', encoding='utf-8') as f:
                report = json.load(f)
        except Exception as e:
            print(f"❌ Error loading gaps report: {e}")
            return False
        
        print(f"📊 Loading content gaps from {gaps_report_file}")
        
        # Prepare points for upload
        points = []
        point_id = 1
        
        for source_key, source_data in report['source_analyses'].items():
            source_name = source_data['source_name']
            verified_gaps = source_data['verified_gaps']
            
            print(f"🔍 Processing {len(verified_gaps)} gaps for {source_name}")
            
            for gap in verified_gaps:
                # Create embedding for the gap title + description
                embedding_text = f"{gap['title']}. {gap.get('rationale', '')} {gap.get('differentiation', '')}"
                embedding = self.generate_embedding(embedding_text)
                
                if embedding:
                    # Create payload with all gap metadata
                    payload = {
                        "title": gap['title'],
                        "source": source_name.lower(),
                        "category": gap.get('category', 'general'),
                        "difficulty": gap.get('difficulty', 'intermediate'),
                        "content_type": gap.get('content_type', 'guide'),
                        "value_score": gap.get('value_score', 7),
                        "uniqueness_score": gap.get('uniqueness_score', 8),
                        "target_audience": gap.get('target_audience', 'developers'),
                        "keywords": gap.get('keywords', []),
                        "rationale": gap.get('rationale', ''),
                        "differentiation": gap.get('differentiation', ''),
                        "verified_uniqueness": gap.get('verified_uniqueness', 0.5),
                        "most_similar_existing": gap.get('most_similar_existing', ''),
                        "gap_type": "verified_unique",
                        "created_timestamp": report['analysis_metadata']['timestamp']
                    }
                    
                    points.append(models.PointStruct(
                        id=point_id,
                        vector=embedding,
                        payload=payload
                    ))
                    
                    print(f"  ✅ {gap['title'][:60]}...")
                    point_id += 1
        
        # Upload to Qdrant
        try:
            batch_size = 50
            for i in range(0, len(points), batch_size):
                batch = points[i:i + batch_size]
                self.qdrant_client.upsert(
                    collection_name=self.collection_name,
                    points=batch
                )
                print(f"📤 Uploaded batch {i//batch_size + 1}/{(len(points)-1)//batch_size + 1}")
            
            print(f"🎉 Successfully uploaded {len(points)} content gaps to {self.collection_name}")
            return True
            
        except Exception as e:
            print(f"❌ Error uploading to Qdrant: {e}")
            return False
    
    def verify_collection(self):
        """Verify the collection was created successfully"""
        try:
            info = self.qdrant_client.get_collection(self.collection_name)
            print(f"📊 Collection verification:")
            print(f"   📄 Points count: {info.points_count}")
            print(f"   🎯 Vector size: {info.config.params.vectors.size}")
            print(f"   📏 Distance metric: {info.config.params.vectors.distance}")
            
            # Sample a few points
            sample = self.qdrant_client.scroll(
                collection_name=self.collection_name,
                limit=3,
                with_payload=True
            )[0]
            
            print(f"\n📋 Sample content gaps:")
            for point in sample:
                payload = point.payload
                print(f"   🎯 {payload['source'].title()}: {payload['title']}")
                print(f"      📊 Value: {payload['value_score']}/10, Uniqueness: {payload['uniqueness_score']}/10")
            
            return True
            
        except Exception as e:
            print(f"❌ Error verifying collection: {e}")
            return False


def main():
    uploader = ContentGapsUploader()
    
    print("📤 Content Gaps Collection Setup")
    print("=" * 50)
    print("This tool uploads verified content gaps to a Qdrant collection")
    print("for use in the duplicate content recommendation system.")
    print()
    
    # Step 1: Create collection
    print("🔧 Creating content gaps collection...")
    if not uploader.create_gaps_collection():
        print("❌ Failed to create collection. Exiting.")
        return
    
    # Step 2: Upload gaps
    print("\n📤 Uploading content gaps...")
    if not uploader.upload_gaps_to_collection():
        print("❌ Failed to upload gaps. Exiting.")
        return
    
    # Step 3: Verify
    print("\n✅ Verifying collection...")
    uploader.verify_collection()
    
    print("\n🎉 Setup complete!")
    print(f"🔗 View collection: http://localhost:6333/dashboard#/collections/content_gaps")
    print("\n💡 Next steps:")
    print("1. The duplicate content checker will now use this collection")
    print("2. Re-run the gap analyzer periodically to refresh recommendations")
    print("3. Monitor which suggestions are most valuable to users")


if __name__ == '__main__':
    main()