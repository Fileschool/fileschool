import json
import sys
import os
import requests

DEEPSEEK_API_KEY = "sk-4f83e81073eb49c6b78400444a3dbc92"
DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions"

DATASETS = {
    "filestack": "filestack_blog_data.json",
    "froala": "froala_blog_data.json",
}

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))


def load_blog_data(dataset_name):
    filepath = os.path.join(SCRIPT_DIR, DATASETS[dataset_name])
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)


def build_blog_catalog(blogs):
    """Build a compact catalog of all blogs: title + URL + short excerpt."""
    catalog_lines = []
    for i, blog in enumerate(blogs, 1):
        title = blog.get("title", "Untitled")
        url = blog.get("link") or blog.get("url", "")
        content = blog.get("content", "")
        # Take first 200 chars of content as excerpt for better context
        excerpt = content[:200].replace("\n", " ").strip()
        catalog_lines.append(f"{i}. \"{title}\"\n   URL: {url}\n   Excerpt: {excerpt}...")
    return "\n".join(catalog_lines)


def check_cannibalization(topic, dataset_name):
    blogs = load_blog_data(dataset_name)
    catalog = build_blog_catalog(blogs)

    system_prompt = f"""You are an SEO expert specializing in content cannibalization analysis for the {dataset_name.capitalize()} blog.

Content cannibalization occurs when multiple pages on the same website target the same or very similar keywords/topics, causing them to compete against each other in search engine rankings. This dilutes ranking power and confuses search engines about which page to rank.

Your job is to analyze a proposed blog topic against ALL existing blog posts and determine:
1. Whether the proposed topic would cannibalize any existing content
2. The severity of the cannibalization risk (High / Medium / Low / None)
3. Which specific existing posts it would compete with and WHY
4. If there IS cannibalization risk, suggest 5 alternative topic angles that:
   - Are closely related to the original idea
   - Would NOT compete with existing content
   - Would fill genuine content gaps
   - Target different search intent or long-tail keywords

CRITICAL: When suggesting alternative topics, you MUST cross-check each suggestion against the ENTIRE existing blog catalog to ensure NONE of your suggestions would also cannibalize existing content. If a suggestion overlaps with any existing post, discard it and come up with a different one. Every alternative you propose must be verified as safe against all existing posts.

IMPORTANT — RELEASE/CHANGELOG ARTICLES ARE NOT TRUE CANNIBALIZATION:
Posts that are release announcements, changelogs, version updates (e.g. "What's New in 4.0", "v3.2 Release", "Product Update") serve a fundamentally different search intent (news/announcement) compared to evergreen content (tutorials, guides, how-tos). If the proposed topic overlaps with a release/changelog article, still mention it for awareness but do NOT count it as high cannibalization — the search intents are different. A how-to guide about a feature mentioned in a release post is COMPLEMENTARY, not competing.

IMPORTANT — HYPERLINK ALL POST REFERENCES:
Whenever you mention or reference an existing blog post, you MUST use markdown hyperlink format: [Post Title](URL). The URL is provided in the catalog above. Never mention a post by title alone or by number alone — always hyperlink it. For example, write [React File Upload Tutorial with Filestack](https://blog.filestack.com/...) instead of just "Post #575" or "React File Upload Tutorial".

CRITICAL — DO NOT HALLUCINATE CODE OR PRODUCT DETAILS:
- Do NOT invent or assume code snippets, API methods, function names, SDK properties, configuration options, or product features for {dataset_name.capitalize()} or any other product.
- If you are not certain about a specific API method or product capability, say "refer to the official documentation" instead of making something up.
- Only reference product capabilities that are clearly evident from the existing blog content provided to you.

Be thorough. Check for:
- Direct keyword overlap (same primary keywords)
- Semantic overlap (different words, same topic)
- Search intent overlap (both targeting same user query)
- Subtopic cannibalization (new post covers ground already in existing post's sections)
- But differentiate between true competition (same intent) and complementary content (different intent)"""

    user_prompt = f"""PROPOSED BLOG TOPIC: "{topic}"

EXISTING BLOG CATALOG ({len(blogs)} posts):
{catalog}

Analyze the proposed topic against ALL {len(blogs)} existing posts above. Provide:

1. **CANNIBALIZATION VERDICT**: High / Medium / Low / None
2. **COMPETING POSTS**: List every existing post that would compete, with:
   - The post title and URL
   - Overlapping keywords/themes
   - Why they would cannibalize each other
3. **SEARCH INTENT ANALYSIS**: What search intent does the proposed topic target, and do any existing posts already satisfy that intent?
4. **RECOMMENDATION**: Should this topic proceed as-is, be modified, or be abandoned?
5. **ALTERNATIVE TOPICS** (if cannibalization risk exists): 5 alternative angles that avoid competition with existing content. For each alternative:
   - State the suggested topic
   - Cross-check it against EVERY existing post in the catalog above
   - Explicitly confirm which existing posts you checked it against and why it does NOT overlap
   - If an alternative would cannibalize ANY existing post, discard it and suggest a different one instead"""

    headers = {
        "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": "deepseek-chat",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        "max_tokens": 8192,
        "temperature": 0.3,
        "stream": True,
    }

    print(f"\nAnalyzing \"{topic}\" against {len(blogs)} {dataset_name.capitalize()} blogs...\n")
    print("=" * 70)

    try:
        response = requests.post(
            DEEPSEEK_API_URL,
            headers=headers,
            json=payload,
            stream=True,
            timeout=120,
        )
        response.raise_for_status()

        for line in response.iter_lines():
            if not line:
                continue
            line = line.decode("utf-8")
            if line.startswith("data: "):
                data_str = line[6:]
                if data_str.strip() == "[DONE]":
                    break
                try:
                    chunk = json.loads(data_str)
                    delta = chunk["choices"][0].get("delta", {})
                    content = delta.get("content", "")
                    if content:
                        print(content, end="", flush=True)
                except json.JSONDecodeError:
                    continue

        print("\n" + "=" * 70)

    except requests.exceptions.RequestException as e:
        print(f"\nAPI Error: {e}")
        if hasattr(e, "response") and e.response is not None:
            print(f"Response: {e.response.text}")
        sys.exit(1)


def main():
    print("=" * 70)
    print("  BLOG CANNIBALIZATION CHECKER")
    print("  Powered by DeepSeek AI")
    print("=" * 70)

    # Dataset selection
    print("\nAvailable datasets:")
    for i, name in enumerate(DATASETS.keys(), 1):
        print(f"  {i}. {name.capitalize()}")

    while True:
        choice = input("\nSelect dataset (number or name): ").strip().lower()
        if choice in DATASETS:
            dataset_name = choice
            break
        try:
            idx = int(choice) - 1
            dataset_name = list(DATASETS.keys())[idx]
            break
        except (ValueError, IndexError):
            print("Invalid choice. Try again.")

    # Topic input loop
    while True:
        topic = input(f"\nEnter blog topic idea (or 'quit' to exit): ").strip()
        if topic.lower() in ("quit", "exit", "q"):
            print("Goodbye!")
            break
        if not topic:
            print("Please enter a topic.")
            continue

        check_cannibalization(topic, dataset_name)
        print()


if __name__ == "__main__":
    main()
