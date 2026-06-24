import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, TrendingUp, Hammer, PiggyBank } from "lucide-react";
import { PageHero } from "@/components/features/PageHero";

export const metadata: Metadata = {
  title: "Advice — Horizon Pro",
  description: "Guides, tips, and market insights for buyers, sellers, and renters.",
};

const ARTICLES = [
  {
    icon: BookOpen,
    category: "First-time buyers",
    title: "A 5-step guide to your first home purchase",
    excerpt: "From pre-approval to closing day — the milestones every first-time buyer should know.",
  },
  {
    icon: TrendingUp,
    category: "Market trends",
    title: "What rising interest rates mean for buyers in 2026",
    excerpt: "How to think about affordability and timing in the current rate environment.",
  },
  {
    icon: Hammer,
    category: "Sellers",
    title: "5 renovations that actually move the needle on resale",
    excerpt: "Where to spend (and where not to) before listing your property.",
  },
  {
    icon: PiggyBank,
    category: "Finances",
    title: "Hidden costs of homeownership most buyers miss",
    excerpt: "Property taxes, maintenance, insurance — budget realistically for the long run.",
  },
];

export default function AdvicePage() {
  return (
    <div className="min-h-screen">
      <PageHero
        eyebrow="Advice"
        title="Learn before you list — or buy."
        subtitle="Plain-language guides on every major decision in the real estate journey."
      />

      <section className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {ARTICLES.map(({ icon: Icon, category, title, excerpt }) => (
            <Link
              key={title}
              href="#"
              className="group block rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-all hover:border-rose-200 hover:shadow-md"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                <Icon className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-rose-600">{category}</span>
              <h3 className="mt-2 text-xl font-black text-slate-900 group-hover:text-rose-700">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">{excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
