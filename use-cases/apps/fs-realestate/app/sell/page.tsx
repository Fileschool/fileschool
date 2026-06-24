import type { Metadata } from "next";
import Link from "next/link";
import { Camera, TrendingUp, Users, Sparkles } from "lucide-react";
import { PageHero } from "@/components/features/PageHero";

export const metadata: Metadata = {
  title: "Sell Your Property — Horizon Pro",
  description: "List your property on Horizon Pro and reach thousands of motivated buyers.",
};

export default function SellPage() {
  const steps = [
    { icon: Camera, title: "1. Showcase with great photos", copy: "Drop in photos — we deliver them via Filestack's CDN with on-the-fly resizing." },
    { icon: Sparkles, title: "2. Write a standout listing", copy: "Highlight unique features and lifestyle details that buyers actually search for." },
    { icon: TrendingUp, title: "3. Price competitively", copy: "Benchmark against comparable listings in your city before going live." },
    { icon: Users, title: "4. Connect with serious buyers", copy: "Inbound enquiries land directly in your dashboard inbox." },
  ];

  return (
    <div className="min-h-screen">
      <PageHero
        eyebrow="Sellers"
        title="Get your property in front of the right buyers."
        subtitle="From photography to closing, we'll help your listing stand out in a crowded market."
      >
        <Link href="/listings/new" className="btn-primary inline-flex h-12 px-8">
          Create a listing
        </Link>
      </PageHero>

      <section className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {steps.map(({ icon: Icon, title, copy }) => (
            <div key={title} className="flex gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-500">{copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
