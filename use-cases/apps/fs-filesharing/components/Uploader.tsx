"use client";

import { useCallback, useRef, useState } from "react";
import { MAX_FILE_BYTES, formatBytes } from "@/lib/utils";
import { Transformations } from "@/components/Transformations";

type UploadedFile = {
  handle: string;
  url: string;
  filename: string;
  mimetype: string;
  size: number;
};

type ShareState =
  | { kind: "idle" }
  | { kind: "uploading"; progress: number; file: File }
  | { kind: "saving"; file: File }
  | { kind: "done"; code: string; shareUrl: string; uploaded: UploadedFile }
  | { kind: "error"; message: string };

type FilestackStoreResponse = {
  url: string;
  size: number;
  type: string;
  filename: string;
  key: string;
};

function handleFromUrl(url: string): string {
  return url.replace(/^https:\/\/cdn\.filestackcontent\.com\//, "").split("?")[0];
}

function uploadToFilestack(
  file: File,
  apiKey: string,
  onProgress: (pct: number) => void,
): Promise<FilestackStoreResponse> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const params = new URLSearchParams({
      key: apiKey,
      filename: file.name,
    });
    xhr.open(
      "POST",
      `https://www.filestackapi.com/api/store/S3?${params.toString()}`,
    );
    xhr.setRequestHeader(
      "Content-Type",
      file.type || "application/octet-stream",
    );

    xhr.upload.onprogress = (evt) => {
      if (evt.lengthComputable) {
        onProgress(Math.round((evt.loaded / evt.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const json = JSON.parse(xhr.responseText) as FilestackStoreResponse;
          resolve(json);
        } catch {
          reject(new Error("Filestack returned an invalid response"));
        }
      } else {
        let msg = `Filestack upload failed (${xhr.status})`;
        try {
          const body = JSON.parse(xhr.responseText) as { error?: string };
          if (body.error) msg = `Filestack: ${body.error}`;
        } catch {
          if (xhr.responseText) msg = `Filestack: ${xhr.responseText}`;
        }
        reject(new Error(msg));
      }
    };

    xhr.onerror = () => reject(new Error("Network error uploading file"));
    xhr.send(file);
  });
}

export function Uploader({ apiKey }: { apiKey: string }) {
  const [state, setState] = useState<ShareState>({ kind: "idle" });
  const [copied, setCopied] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setCopied(false);

      if (file.size > MAX_FILE_BYTES) {
        setState({
          kind: "error",
          message: `"${file.name}" is ${formatBytes(file.size)} — max is 500 KB.`,
        });
        return;
      }
      if (file.size <= 0) {
        setState({ kind: "error", message: "That file is empty." });
        return;
      }
      if (!apiKey) {
        setState({
          kind: "error",
          message:
            "Filestack API key is missing. Set NEXT_PUBLIC_FILESTACK_API_KEY and restart dev.",
        });
        return;
      }

      setState({ kind: "uploading", progress: 0, file });

      try {
        const res = await uploadToFilestack(file, apiKey, (pct) => {
          setState((prev) =>
            prev.kind === "uploading" ? { ...prev, progress: pct } : prev,
          );
        });

        const uploaded: UploadedFile = {
          handle: handleFromUrl(res.url),
          url: res.url,
          filename: res.filename ?? file.name,
          mimetype: res.type ?? file.type ?? "application/octet-stream",
          size: res.size ?? file.size,
        };

        const fingerprintStr = `${navigator.userAgent}-${navigator.language}-${screen.width}x${screen.height}-${Intl.DateTimeFormat().resolvedOptions().timeZone}`;
        const fingerprint = window.btoa(fingerprintStr);

        setState({ kind: "saving", file });

        const saveRes = await fetch("/api/share", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...uploaded, fingerprint }),
        });

        if (!saveRes.ok) {
          const body = await saveRes
            .json()
            .catch(() => ({}) as { error?: string });
          throw new Error(body.error ?? "Failed to save share");
        }

        const { code } = (await saveRes.json()) as { code: string };
        const shareUrl = `${window.location.origin}/s/${code}`;

        setState({ kind: "done", code, shareUrl, uploaded });
      } catch (err) {
        setState({
          kind: "error",
          message:
            err instanceof Error ? err.message : "Upload failed. Try again.",
        });
      }
    },
    [apiKey],
  );

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) void handleFile(file);
    },
    [handleFile],
  );

  const onCopy = useCallback(async () => {
    if (state.kind !== "done") return;
    try {
      await navigator.clipboard.writeText(state.shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }, [state]);

  const reset = () => {
    setState({ kind: "idle" });
    setCopied(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (state.kind === "done") {
    return (
      <div className="flex w-full flex-col gap-4">
      <div className="w-full rounded-2xl border border-border bg-paper p-6 shadow-card sm:p-8">
        <div className="mb-5 flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand/10 text-brand">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3.5 w-3.5"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </span>
          <h2 className="text-sm font-semibold text-ink">Your link is ready</h2>
        </div>

        <div className="mb-5 rounded-xl bg-[color:var(--color-border)]/30 p-4">
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">
                {state.uploaded.filename}
              </p>
              <p className="text-xs text-ink-muted">
                {formatBytes(state.uploaded.size)} · {state.uploaded.mimetype}
              </p>
            </div>
          </div>
        </div>

        <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-ink-muted">
          Shareable link
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            readOnly
            value={state.shareUrl}
            onFocus={(e) => e.currentTarget.select()}
            className="w-full flex-1 rounded-lg border border-border bg-background px-3 py-2.5 font-mono text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
          <button
            type="button"
            onClick={onCopy}
            className="inline-flex items-center justify-center rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand/40"
          >
            {copied ? "Copied!" : "Copy link"}
          </button>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
          <a
            href={state.shareUrl}
            target="_blank"
            rel="noreferrer"
            className="text-brand hover:text-brand-600"
          >
            Open share page ↗
          </a>
          <span className="text-border-strong">·</span>
          <button
            type="button"
            onClick={reset}
            className="text-ink-muted hover:text-ink"
          >
            Share another file
          </button>
        </div>
      </div>

      <Transformations
        handle={state.uploaded.handle}
        mimetype={state.uploaded.mimetype}
      />
      </div>
    );
  }

  const uploading = state.kind === "uploading";
  const saving = state.kind === "saving";
  const busy = uploading || saving;
  const progress = uploading ? state.progress : saving ? 100 : 0;

  return (
    <div className="w-full">
      <label
        htmlFor="fs-upload"
        onDragOver={(e) => {
          e.preventDefault();
          if (!busy) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={busy ? undefined : onDrop}
        className={[
          "relative flex min-h-[260px] w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-paper p-8 text-center shadow-card transition",
          dragOver
            ? "border-brand bg-brand/5"
            : "border-border hover:border-brand/60 hover:bg-brand/[0.03]",
          busy ? "pointer-events-none opacity-90" : "",
        ].join(" ")}
      >
        <input
          ref={fileInputRef}
          id="fs-upload"
          type="file"
          className="sr-only"
          disabled={busy}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void handleFile(f);
          }}
        />

        {!busy && (
          <>
            <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <path d="M12 3v13" />
                <path d="M6 9l6-6 6 6" />
                <path d="M5 21h14" />
              </svg>
            </span>
            <p className="text-base font-semibold text-ink">
              Drop a file here, or <span className="text-brand">browse</span>
            </p>
            <p className="mt-1 text-sm text-ink-muted">
              Max 500 KB · any file type
            </p>
          </>
        )}

        {busy && (
          <div className="flex w-full max-w-sm flex-col items-center">
            <p className="text-sm font-semibold text-ink">
              {uploading ? "Uploading to Filestack…" : "Creating share link…"}
            </p>
            <p className="mt-1 max-w-full truncate text-xs text-ink-muted">
              {state.file.name} · {formatBytes(state.file.size)}
            </p>
            <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-[color:var(--color-border)]">
              <div
                className="h-full bg-brand transition-[width] duration-200"
                style={{ width: `${Math.max(4, Math.round(progress))}%` }}
              />
            </div>
            <p className="mt-2 text-xs font-mono text-ink-muted">
              {Math.round(progress)}%
            </p>
          </div>
        )}
      </label>

      {state.kind === "error" && (
        <div className="mt-4 rounded-lg border border-brand/30 bg-brand/5 px-4 py-3 text-sm text-brand-700">
          {state.message}
        </div>
      )}
    </div>
  );
}
