export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span
        aria-hidden
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-300 via-brand to-brand-600 text-white shadow-pop"
      >
        <FlameIcon className="h-4.5 w-4.5" width={18} height={18} />
      </span>
      <span className="text-base font-semibold tracking-tight text-ink">
        Fireshare
      </span>
    </div>
  );
}

export function FlameIcon({
  className = "",
  width = 20,
  height = 20,
}: {
  className?: string;
  width?: number;
  height?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      width={width}
      height={height}
      className={className}
      aria-hidden
    >
      <path d="M13.5 1.5c-.4.3-.6.8-.5 1.3.3 1.6-.2 3-1.4 4.3-.4.5-.9 1-1.3 1.4-1 .9-1.7 1.6-2.2 2.5-.4.7-.7 1.6-.6 2.5.1 1.1.6 1.9 1.4 2.4.4.2.8.2 1.1 0 .3-.2.5-.6.5-1 0-.6 0-1 .3-1.4.2-.3.5-.5.7-.4.3.1.5.4.6.9.4 2.5-.3 4.1-1.9 4.9-.6.3-.8 1-.4 1.6.2.4.5.6.8.7.4.1.8 0 1.1-.2 3.5-2 5.3-5.3 5.3-9.6 0-2.3-.7-4.3-2.1-6.1C14.4 4 13.7 3 13.6 2c-.1-.7-.7-.9-1.1-.5z" />
    </svg>
  );
}
