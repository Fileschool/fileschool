import { Navbar } from "@/components/Navbar";
import { Uploader } from "@/components/Uploader";

export default function Home() {
  const apiKey = process.env.NEXT_PUBLIC_FILESTACK_API_KEY ?? "";

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex flex-1 items-center justify-center px-6 py-16 sm:py-24">
        <div className="w-full max-w-2xl">
          <div className="mb-8 text-center">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-paper px-3 py-1 text-xs font-medium text-ink-muted shadow-card">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              File sharing, on fire
            </span>
            <h1 className="text-balance text-4xl font-bold tracking-tight text-ink sm:text-5xl">
              Share a file. <span className="text-brand">Get a link.</span>
            </h1>
            <p className="mx-auto mt-4 max-w-md text-pretty text-base text-ink-muted">
              Drop a file (up to 500 KB) and we&apos;ll store it on Filestack
              and hand you a link you can send anywhere.
            </p>
            <div className="mx-auto mt-6 max-w-lg rounded-xl border border-blue-100 bg-blue-50/50 p-4 text-center">
              <p className="text-[11px] leading-relaxed text-blue-600/80">
                <strong>GDPR Notice:</strong> This is a Filestack demonstration use case. 
                Files are automatically deleted after <strong>one week</strong>. 
                Do not upload sensitive data.
              </p>
            </div>
          </div>

          <Uploader apiKey={apiKey} />

          {!apiKey && (
            <p className="mt-4 text-center text-xs text-ink-muted">
              Set{" "}
              <code className="font-mono">NEXT_PUBLIC_FILESTACK_API_KEY</code>{" "}
              in <code className="font-mono">.env.local</code> to enable
              uploads.
            </p>
          )}
        </div>
      </main>

      <footer className="border-t border-border bg-paper/60">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4 text-xs text-ink-muted">
          <div className="flex items-center gap-4">
            <span>Built with Filestack</span>
            <a href="https://discord.gg/filestack" target="_blank" rel="noreferrer" className="hover:text-ink transition-colors">
              Discord
            </a>
          </div>
          <span>© {new Date().getFullYear()} Fireshare</span>
        </div>
      </footer>
    </div>
  );
}
