# Blog Content Tools

Two tools to help plan blog content before writing: a **Cannibalization Checker** and a **Content Gap Analyzer**.

Both tools work by comparing your idea against every existing blog post in the Filestack or Froala catalog, using AI to surface overlaps and opportunities.

---

## Getting Started

1. Open a terminal / command prompt
2. Navigate to this folder:
   ```
   cd cannibal_checker
   ```
3. Start the local server:
   ```
   python serve.py
   ```
4. A browser tab will open automatically at **http://localhost:8000**

You'll see two tabs at the top of the page:

- **Cannibalization Checker** — use before writing a new post
- **Content Gap Analyzer** — use when looking for new topic ideas

---

## Cannibalization Checker

Use this **before you commit to a blog topic** to find out whether the idea would compete with something already published.

### How to use it

1. Select the dataset (**Filestack** or **Froala**)
2. Type your proposed blog topic into the text field (e.g. "How to upload large files in React")
3. Click **Check Cannibalization**

### What you'll get

The tool runs a two-pass analysis:

- **Pass 1** scans every existing post for potential overlaps
- **Pass 2** does a deep analysis on the flagged posts and produces a full report

The report includes:

| Section | What it tells you |
|---|---|
| **Cannibalization Verdict** | A rating of **High**, **Medium**, **Low**, or **None** — shown as a colored badge |
| **Competing Posts** | Which existing posts overlap, with links to each one and an explanation of why they compete |
| **Search Intent Analysis** | Whether the proposed topic targets a search intent already covered |
| **Recommendation** | Whether to proceed as-is, adjust the angle, or pick a different topic |
| **Alternative Topics** | If there's overlap, 5 alternative angles that avoid competing with existing content |

### Content Brief (optional next step)

After the analysis finishes, a **Generate Content Brief** section appears below the report.

- Pick one of the suggested alternative topics, or type your own
- Click **Generate Brief**

This produces a full writing brief including:

- Target keywords and search intent
- Suggested meta title and description
- Full heading outline (H2/H3 structure)
- What to cover and what to avoid
- Internal linking opportunities (with links to existing posts)
- Recommended format, word count, and CTAs

> The brief will never include made-up code examples or assumed product features. If technical details are needed, it will point to the official documentation instead.

---

## Content Gap Analyzer

Use this **when you need fresh topic ideas** and want to know what's missing from the blog.

### How to use it

1. Select the dataset (**Filestack** or **Froala**)
2. Optionally type a focus area (e.g. "React", "image processing", "file uploads") — or leave it blank to analyze everything
3. Click **Find Content Gaps**

### What you'll get

The tool runs a two-pass analysis:

- **Pass 1** reads through every post and maps out what topics, keywords, how-to guides, comparisons, and troubleshooting articles already exist
- **Pass 2** uses that map to identify what's missing

The report includes:

| Section | What it tells you |
|---|---|
| **Missing "How To" Articles** | 15 tutorial topics that don't exist yet, with suggested titles and brief outlines |
| **Missing Comparison Articles** | 5 "vs" or comparison topics relevant to the product |
| **Missing Developer Guides & Deep Dives** | 10 in-depth technical articles developers would bookmark — architecture guides, best practices, performance optimization, security hardening, integration patterns, etc. |
| **Thin Content to Expand** | Existing posts that are too shallow and should be updated |
| **Quick Wins** | 5 easy posts that fill obvious gaps with minimal effort |

Each suggestion is cross-checked against the full catalog to confirm it doesn't overlap with anything already published. Existing posts are linked so you can review them directly.

---

## Tips

- **Run the cannibalization check first** before starting any new post. It only takes a moment and can save hours of wasted writing.
- **Use the content gap analyzer** during planning sessions to build out your editorial calendar.
- **Try different focus areas** in the gap analyzer to drill into specific topic clusters (e.g. "security", "Python", "WYSIWYG editors").
- All existing posts mentioned in the reports are clickable links — use them to review what's already published before writing.

---

## Datasets

The tools come with two blog datasets:

| Dataset | File | Description |
|---|---|---|
| Filestack | `filestack_blog_data.json` | All published Filestack blog posts |
| Froala | `froala_blog_data.json` | All published Froala blog posts |

To update a dataset, replace the corresponding JSON file with a fresh export.
