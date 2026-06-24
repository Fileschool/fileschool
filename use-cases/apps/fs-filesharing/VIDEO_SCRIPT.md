# Fireshare — 2-Minute Walkthrough Script

**Total runtime: ~2:00** · Spoken word count ~300 · Pace ~150 wpm

---

### 🎬 SCENE 1 — Hook + Run it (0:00–0:20)

**[Screen: terminal in the project folder]**

> "Need to share a file and just get a link back? This is **Fireshare** — a tiny, open-source file-sharing app you can clone and ship in about five minutes. Let me show you."

**[Type and run]**

```bash
npm run dev
```

> "One command — `npm run dev` — and we're live on localhost:3000."

---

### 🎬 SCENE 2 — Show the project (0:20–0:40)

**[Screen: browser at localhost:3000]**

> "Here's the app. Clean landing page: 'Share a file, get a link.' Built with **Next.js 16** and **Filestack** for storage. Notice the details that make it real — files up to 500 KB, a GDPR notice, and everything auto-deletes after one week."

---

### 🎬 SCENE 3 — Upload + Retrieve (0:40–1:10)

**[Screen: drag a file into the uploader]**

> "Let's try it. I drop a file in — Filestack handles the upload to its CDN, and instantly..."

**[Show the generated short link]**

> "...we get a short shareable link. I copy it, open it in a new tab..."

**[Open the /s/[code] link]**

> "...and there's the file — preview, size, download button, even a view counter. Anyone with this link can grab it. That's the whole loop: **drop, link, share.**"

---

### 🎬 SCENE 4 — Back to code: the env vars (1:10–1:40)

**[Screen: editor, open `.env.example`]**

> "Now, how do you run your own? It's just three environment variables."

**[Highlight each line]**

```
NEXT_PUBLIC_FILESTACK_API_KEY=your_filestack_api_key
TURSO_DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your_turso_auth_token
```

> "A **Filestack API key** for uploads, and a **Turso** database URL and token — that's your serverless SQLite, wired up with Drizzle. Both have free tiers, so this costs you nothing to start."

---

### 🎬 SCENE 5 — Clone from GitHub + Outro (1:40–2:00)

**[Screen: GitHub repo page]**

> "To use it for your own project, clone the repo, run `npm install`, drop in those keys, then `npm run db:push` to set up the database — and `npm run dev`. That's it."

**[Screen: app running again]**

> "Clone it, customize it, ship it. Link's in the description. If this helped, hit subscribe — and go share something."

---

## 📋 On-screen text / b-roll cues

| Time | Overlay |
|------|---------|
| 0:00 | Title: **Fireshare — File sharing, on fire 🔥** |
| 0:12 | Code: `npm run dev` |
| 0:50 | Callout: *"Stored on Filestack CDN"* |
| 1:15 | Highlight the 3 env vars one by one |
| 1:45 | Commands: `npm install` → `npm run db:push` → `npm run dev` |
| 1:55 | End card: **⭐ Star the repo · Link below** |

---

## Notes (keep the recording accurate)

- The README says set keys in `.env.local`, but the repo actually ships a `.env` file — mention whichever you prefer, just be consistent on screen.
- Don't forget the **`npm run db:push`** step in the clone flow (Scene 5) — without it the DB has no `shares` table and uploads will fail. Worth showing it on screen.
- Optional flex if you have a spare 5 seconds: there's built-in **rate limiting (10 uploads/day)** and **image transformations** on the share page — nice "it's actually production-minded" beats.
