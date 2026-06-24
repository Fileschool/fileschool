import type { Metadata } from "next";
import { PageHero } from "@/components/features/PageHero";

export const metadata: Metadata = {
  title: "About — Horizon Pro",
  description: "Learn more about Horizon Pro and our mission.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <PageHero
        eyebrow="About"
        title="Real estate, reimagined for the modern buyer."
        subtitle="Horizon Pro is a demonstration application built to showcase Filestack's media delivery and transformation capabilities in a real-world product."
      />

      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 space-y-8 text-slate-600 leading-relaxed">
        <p>
          This site is a public reference implementation. It shows how a real estate marketplace can use Filestack
          to upload, store, and deliver high-quality property photography — including on-the-fly resizing, cropping,
          format conversion, and quality optimization through the Filestack CDN.
        </p>
        <p>
          No real listings or transactions are processed. Every property shown is illustrative, and any data you
          enter remains in your browser&apos;s local storage only.
        </p>
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6">
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">Powered by</p>
          <p className="mt-2 text-2xl font-black text-slate-900">Filestack File API + CDN</p>
        </div>
      </section>
    </div>
  );
}
