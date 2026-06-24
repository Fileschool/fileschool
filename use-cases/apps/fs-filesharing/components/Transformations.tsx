"use client";

import { useState } from "react";

type Props = {
  handle: string;
  mimetype: string;
};

type Transform = {
  id: string;
  label: string;
  description: string;
  tasks: string[];
};

const IMAGE_TRANSFORMATIONS: Transform[] = [
  {
    id: "thumbnail",
    label: "Thumbnail",
    description: "resize=width:300",
    tasks: ["resize=width:300"],
  },
  {
    id: "square",
    label: "Square crop",
    description: "resize=width:300,height:300,fit:crop",
    tasks: ["resize=width:300,height:300,fit:crop"],
  },
  {
    id: "rotate",
    label: "Rotate 90°",
    description: "rotate=deg:90",
    tasks: ["resize=width:300", "rotate=deg:90"],
  },
  {
    id: "blur",
    label: "Blur",
    description: "blur=amount:8",
    tasks: ["resize=width:300", "blur=amount:8"],
  },
  {
    id: "sepia",
    label: "Sepia",
    description: "sepia=tone:80",
    tasks: ["resize=width:300", "sepia=tone:80"],
  },
  {
    id: "polaroid",
    label: "Polaroid",
    description: "polaroid",
    tasks: ["resize=width:300", "polaroid"],
  },
  {
    id: "rounded",
    label: "Rounded",
    description: "rounded_corners=radius:30",
    tasks: ["resize=width:300", "rounded_corners=radius:30"],
  },
  {
    id: "mono",
    label: "Grayscale",
    description: "monochrome",
    tasks: ["resize=width:300", "monochrome"],
  },
];

function buildUrl(handle: string, tasks: string[]): string {
  return `https://cdn.filestackcontent.com/${tasks.join("/")}/${handle}`;
}

export function Transformations({ handle, mimetype }: Props) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!mimetype.startsWith("image/")) return null;

  const onCopy = async (id: string, url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1600);
    } catch {
      setCopiedId(null);
    }
  };

  return (
    <section className="w-full rounded-2xl border border-border bg-paper p-5 shadow-card sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-ink">
            Try a Filestack transformation
          </h3>
          <p className="mt-0.5 text-xs text-ink-muted">
            Each image is generated on-the-fly by the Filestack CDN — just edit
            the URL.
          </p>
        </div>
        <a
          href="https://www.filestack.com/docs/api/processing/"
          target="_blank"
          rel="noreferrer"
          className="hidden text-xs font-medium text-brand hover:text-brand-600 sm:inline"
        >
          Docs ↗
        </a>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {IMAGE_TRANSFORMATIONS.map((t) => {
          const url = buildUrl(handle, t.tasks);
          const copied = copiedId === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onCopy(t.id, url)}
              className="group relative overflow-hidden rounded-xl border border-border bg-paper text-left transition hover:border-brand/60 hover:shadow-card"
              title={`Copy URL: ${url}`}
            >
              <div className="flex aspect-square items-center justify-center bg-[color:var(--color-border)]/30">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={t.label}
                  loading="lazy"
                  className="max-h-full max-w-full"
                />
              </div>
              <div className="px-3 py-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-xs font-semibold text-ink">
                    {t.label}
                  </span>
                  <span
                    className={[
                      "text-[10px] font-semibold uppercase tracking-wide",
                      copied ? "text-brand" : "text-ink-muted",
                    ].join(" ")}
                  >
                    {copied ? "Copied" : "Copy"}
                  </span>
                </div>
                <p className="mt-0.5 truncate font-mono text-[10px] text-ink-muted">
                  {t.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
