import { FC } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FilestackLogo } from "@/components/features/FilestackBadge";
import { HorizonProLogoCompact } from "@/components/features/HorizonProLogo";

export const Footer: FC = () => {
  return (
    <footer className="mt-16 bg-white border-t border-slate-200">
      <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Logo Section */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="group inline-block">
              <HorizonProLogoCompact />
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              A demonstration real estate marketplace built end-to-end on Filestack&apos;s File API and image-transformation CDN.
            </p>
            <a
              href="https://www.filestack.com/signup/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-slate-900 transition-all hover:border-orange-300 hover:shadow-sm"
            >
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Powered by</span>
              <FilestackLogo />
              <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
            </a>
          </div>

          {/* Links Sections */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-6">
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-slate-900">For buyers</h4>
              <ul className="space-y-2 text-sm font-medium text-slate-600">
                <li><Link href="/search" className="hover:text-rose-500 hover:underline">Search properties</Link></li>
                <li><Link href="/buy" className="hover:text-rose-500 hover:underline">Buying guide</Link></li>
                <li><Link href="/advice" className="hover:text-rose-500 hover:underline">Advice & tips</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-bold text-slate-900">For sellers & agents</h4>
              <ul className="space-y-2 text-sm font-medium text-slate-600">
                <li><Link href="/sell" className="hover:text-rose-500 hover:underline">Sell your property</Link></li>
                <li><Link href="/listings/new" className="hover:text-rose-500 hover:underline">Post a listing</Link></li>
                <li><Link href="/agents" className="hover:text-rose-500 hover:underline">Find an agent</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-bold text-slate-900">About</h4>
              <ul className="space-y-2 text-sm font-medium text-slate-600">
                <li><Link href="/about" className="hover:text-rose-500 hover:underline">About us</Link></li>
                <li><Link href="/faq" className="hover:text-rose-500 hover:underline">FAQ</Link></li>
                <li><Link href="/contact" className="hover:text-rose-500 hover:underline">Contact us</Link></li>
              </ul>
            </div>
          </div>

          {/* Language Selection */}
          <div className="lg:col-span-2">
            <h4 className="text-lg font-bold text-slate-900 mb-4">Language</h4>
            <div className="space-y-3">
              <button className="flex items-center gap-3 text-sm font-bold text-slate-900 hover:text-rose-500 transition-colors">
                <span className="flex h-5 w-5 items-center justify-center rounded-sm bg-slate-100 text-[10px] overflow-hidden">🇨🇦</span>
                English
              </button>
              <button className="flex items-center gap-3 text-sm font-bold text-slate-600 hover:text-rose-500 transition-colors">
                <span className="flex h-5 w-5 items-center justify-center rounded-sm bg-slate-100 text-[10px] overflow-hidden">🇨🇦</span>
                French
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="bg-slate-900 py-4 px-4">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-2 text-center sm:flex-row sm:text-left">
          <p className="text-[11px] font-medium text-white/70 leading-relaxed">
            © Copyright 2026 horizonpro.com — Demonstration application. No real transactions take place on this site.
          </p>
          <a
            href="https://www.filestack.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-white/60 hover:text-white"
          >
            Built with
            <FilestackLogo invert />
          </a>
        </div>
      </div>
    </footer>
  );
};
