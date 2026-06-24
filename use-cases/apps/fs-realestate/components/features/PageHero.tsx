import { FC, ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface IPageHeroProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export const PageHero: FC<IPageHeroProps> = ({ eyebrow, title, subtitle, children }) => {
  return (
    <div className="bg-slate-50">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 pt-12 pb-16">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-bold text-slate-400 transition-colors hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
        <span className="text-xs font-black text-rose-600 uppercase tracking-widest">{eyebrow}</span>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">{title}</h1>
        {subtitle && <p className="mt-3 max-w-2xl text-base text-slate-500">{subtitle}</p>}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </div>
  );
};
