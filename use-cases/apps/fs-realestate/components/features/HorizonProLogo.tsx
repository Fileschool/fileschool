import { FC } from "react";
import { cn } from "@/lib/utils";

interface IHorizonProLogoProps {
  className?: string;
  /** Show the wordmark next to the mark. */
  withWordmark?: boolean;
  /** Wordmark color override. Default: slate-900. */
  wordmarkClassName?: string;
}

/**
 * Horizon Pro identity. The mark is a stylised roof above a horizon line
 * with a sun bisected at the horizon — evoking real estate (roof) and
 * "horizon" (sunrise + line) in one geometric pictogram.
 */
export const HorizonProLogo: FC<IHorizonProLogoProps> = ({
  className,
  withWordmark = true,
  wordmarkClassName,
}) => {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-10 w-10 shrink-0">
        <defs>
          <linearGradient id="hp-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="55%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#be123c" />
          </linearGradient>
        </defs>
        <rect width="40" height="40" rx="10" fill="url(#hp-bg)" />
        {/* Setting sun behind the horizon */}
        <circle cx="20" cy="27" r="5.5" fill="#fff" opacity="0.18" />
        {/* Roof chevron */}
        <path
          d="M8.5 23 L20 11.5 L31.5 23"
          stroke="white"
          strokeWidth="2.6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Horizon line */}
        <line x1="7" y1="29.5" x2="33" y2="29.5" stroke="white" strokeWidth="2.6" strokeLinecap="round" />
        {/* Sun dot above horizon */}
        <circle cx="20" cy="26" r="1.8" fill="white" />
      </svg>
      {withWordmark && (
        <span className={cn("flex flex-col leading-none", wordmarkClassName)}>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Horizon</span>
          <span className="text-xl font-black tracking-tight text-slate-900">Horizon Pro</span>
        </span>
      )}
    </span>
  );
};

/**
 * Compact variant — single-line wordmark next to the mark, for tight spaces.
 */
export const HorizonProLogoCompact: FC<{ className?: string }> = ({ className }) => {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-8 w-8 shrink-0">
        <defs>
          <linearGradient id="hp-bg-c" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="55%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#be123c" />
          </linearGradient>
        </defs>
        <rect width="40" height="40" rx="10" fill="url(#hp-bg-c)" />
        <circle cx="20" cy="27" r="5.5" fill="#fff" opacity="0.18" />
        <path
          d="M8.5 23 L20 11.5 L31.5 23"
          stroke="white"
          strokeWidth="2.6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line x1="7" y1="29.5" x2="33" y2="29.5" stroke="white" strokeWidth="2.6" strokeLinecap="round" />
        <circle cx="20" cy="26" r="1.8" fill="white" />
      </svg>
      <span className="text-xl font-black tracking-tight text-slate-900">Horizon Pro</span>
    </span>
  );
};
