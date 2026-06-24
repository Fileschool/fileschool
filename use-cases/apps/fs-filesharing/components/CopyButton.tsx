"use client";

import { useState } from "react";

export function CopyButton() {
  const [copied, setCopied] = useState(false);

  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center justify-center rounded-lg border border-border bg-paper px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-brand/60 hover:text-brand"
    >
      {copied ? "Copied!" : "Copy link"}
    </button>
  );
}
