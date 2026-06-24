# Fireshare

File sharing, on fire. A simple application to share files (up to 500 KB) instantly, built using Next.js and Filestack.

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Set your `NEXT_PUBLIC_FILESTACK_API_KEY` in `.env.local`
4. Set your database credentials (`TURSO_DATABASE_URL` / `TURSO_AUTH_TOKEN`) in `.env.local`
5. Run `npm run db:push` to apply the database schema
6. Run `npm run dev` to start the development server

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. You can start sharing files right away!
