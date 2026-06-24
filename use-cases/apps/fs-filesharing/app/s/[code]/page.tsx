import Link from "next/link";
import { notFound } from "next/navigation";
import { eq, sql, and, gt } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { Navbar } from "@/components/Navbar";
import { CopyButton } from "@/components/CopyButton";
import { Transformations } from "@/components/Transformations";
import { formatBytes, fileIconKind } from "@/lib/utils";

type Params = { code: string };

export const dynamic = "force-dynamic";

async function getShare(code: string) {
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const rows = await db
    .select()
    .from(schema.shares)
    .where(
      and(
        eq(schema.shares.code, code),
        gt(schema.shares.createdAt, oneWeekAgo)
      )
    )
    .limit(1);
  return rows[0];
}

async function bumpViews(id: string) {
  await db
    .update(schema.shares)
    .set({ views: sql`${schema.shares.views} + 1` })
    .where(eq(schema.shares.id, id));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}) {
  const { code } = await params;
  const share = await getShare(code);
  if (!share) return { title: "Share not found" };
  return {
    title: `${share.filename} · Fireshare Use Case`,
    description: `Filestack Use Case: Shared file ${share.filename} (${formatBytes(share.size)}). This is a demonstration of Filestack's file sharing capabilities.`,
    keywords: ["Filestack", "File Sharing", "Use Case", "GDPR Compliant", "TTL"],
  };
}

export default async function SharePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { code } = await params;
  const share = await getShare(code);
  if (!share) notFound();

  await bumpViews(share.id);

  const kind = fileIconKind(share.mimetype);
  const downloadUrl = `${share.url}?dl=true`;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-4 py-1.5 text-sm font-semibold text-brand transition hover:bg-brand/20"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3.5 w-3.5"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          Share another file
        </Link>
      </Navbar>

      <main className="flex flex-1 items-start justify-center px-6 py-12 sm:py-16">
        <div className="w-full max-w-2xl">
          <div className="overflow-hidden rounded-2xl border border-border bg-paper shadow-card">
            <Preview
              kind={kind}
              url={share.url}
              filename={share.filename}
              mimetype={share.mimetype}
            />

            <div className="border-t border-border p-5 sm:p-6">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h1 className="truncate text-lg font-semibold text-ink">
                    {share.filename}
                  </h1>
                  <p className="mt-0.5 text-sm text-ink-muted">
                    {formatBytes(share.size)} · {share.mimetype} ·{" "}
                    {share.views + 1}{" "}
                    {share.views + 1 === 1 ? "view" : "views"}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <a
                  href={downloadUrl}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand/40"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M12 3v13" />
                    <path d="M18 15l-6 6-6-6" />
                    <path d="M5 21h14" />
                  </svg>
                  Download
                </a>
                <a
                  href={share.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-lg border border-border bg-paper px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-brand/60 hover:text-brand"
                >
                  Open raw
                </a>
                <CopyButton />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <Transformations handle={share.handle} mimetype={share.mimetype} />
          </div>

          <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50/50 p-4 text-center">
            <p className="text-xs font-medium text-blue-800">
              Fireshare Use Case Disclaimer
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-blue-600/80">
              This application is a demonstration use case for Filestack. 
              To comply with GDPR and privacy standards, all uploaded files are 
              automatically deleted after a <strong>one-week TTL (Time To Live)</strong>. 
              Do not upload sensitive or permanent data.
            </p>
          </div>

          <p className="mt-4 text-center text-xs text-ink-muted">
            Files are delivered via the Filestack CDN.
          </p>
        </div>
      </main>
    </div>
  );
}

function Preview({
  kind,
  url,
  filename,
  mimetype,
}: {
  kind: "image" | "video" | "audio" | "pdf" | "file";
  url: string;
  filename: string;
  mimetype: string;
}) {
  if (kind === "image") {
    return (
      <div className="flex min-h-[240px] items-center justify-center bg-[color:var(--color-border)]/20 p-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt={filename}
          className="max-h-[480px] max-w-full object-contain"
        />
      </div>
    );
  }

  if (kind === "video") {
    return (
      <div className="bg-black">
        <video
          src={url}
          controls
          className="mx-auto max-h-[520px] w-full"
        />
      </div>
    );
  }

  if (kind === "audio") {
    return (
      <div className="flex flex-col items-center gap-4 bg-[color:var(--color-border)]/30 px-6 py-10">
        <FileBadge kind="audio" />
        <audio src={url} controls className="w-full max-w-md" />
      </div>
    );
  }

  if (kind === "pdf") {
    return (
      <iframe
        src={url}
        title={filename}
        className="block h-[520px] w-full border-0"
      />
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 bg-[color:var(--color-border)]/30 px-6 py-14">
      <FileBadge kind="file" />
      <p className="text-sm text-ink-muted">{mimetype}</p>
    </div>
  );
}

function FileBadge({
  kind,
}: {
  kind: "image" | "video" | "audio" | "pdf" | "file";
}) {
  const label =
    kind === "audio"
      ? "Audio file"
      : kind === "pdf"
        ? "PDF"
        : kind === "video"
          ? "Video"
          : kind === "image"
            ? "Image"
            : "File";
  return (
    <div className="flex flex-col items-center">
      <span className="mb-2 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 text-brand">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-7 w-7"
        >
          <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
          <path d="M14 3v5h5" />
        </svg>
      </span>
      <span className="text-sm font-semibold text-ink">{label}</span>
    </div>
  );
}
