import type { Metadata } from "next";
import { PageHero } from "@/components/features/PageHero";

export const metadata: Metadata = {
  title: "FAQ — Horizon Pro",
  description: "Frequently asked questions about Horizon Pro.",
};

const FAQS = [
  {
    q: "Is this a real estate marketplace?",
    a: "No — this site is a demonstration of Filestack's image upload and delivery features. No real listings, transactions, or personal data are exchanged.",
  },
  {
    q: "Where are uploaded photos stored?",
    a: "Photos are uploaded directly to Filestack's File API and served via the Filestack CDN. They are not stored on this app's own servers.",
  },
  {
    q: "How does the image optimization work?",
    a: "Filestack's CDN applies on-the-fly transformations — resizing, cropping, format conversion (WebP/AVIF), and quality tuning — based on URL parameters.",
  },
  {
    q: "Will my account or listings persist?",
    a: "Account info and listings are saved to your browser's local storage only. Clearing site data will reset everything.",
  },
  {
    q: "Can I use this code in my own project?",
    a: "Yes — this is intended as a reference implementation. Feel free to adapt the patterns shown here.",
  },
];

export default function FaqPage() {
  return (
    <div className="min-h-screen">
      <PageHero
        eyebrow="Help"
        title="Frequently asked questions"
        subtitle="Answers to the most common questions about how this demo works."
      />

      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
        <dl className="space-y-6">
          {FAQS.map(({ q, a }) => (
            <div key={q} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <dt className="text-base font-bold text-slate-900">{q}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-slate-500">{a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
