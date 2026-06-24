import type { Metadata } from "next";
import Link from "next/link";
import { Home, MapPin, Calculator, Building2 } from "lucide-react";
import { PageHero } from "@/components/features/PageHero";

export const metadata: Metadata = {
  title: "Buy a Property — Horizon Pro",
  description: "Browse premium real estate listings and find your next home with Horizon Pro.",
};

export default function BuyPage() {
  const tiles = [
    { icon: Home, title: "Single-family homes", copy: "Detached homes across every neighbourhood." },
    { icon: Building2, title: "Condos & apartments", copy: "Urban living with concierge services." },
    { icon: MapPin, title: "Search by city", copy: "Discover trending listings in your target area." },
    { icon: Calculator, title: "Affordability tools", copy: "Estimate monthly payments and closing costs." },
  ];

  return (
    <div className="min-h-screen">
      <PageHero
        eyebrow="Buyers"
        title="Find a place you'll love coming home to."
        subtitle="Explore curated listings, neighbourhood guides, and financing tools designed to help you make confident decisions."
      >
        <Link href="/" className="btn-primary inline-flex h-12 px-8">
          Browse listings
        </Link>
      </PageHero>

      <section className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {tiles.map(({ icon: Icon, title, copy }) => (
            <div key={title} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">{title}</h3>
              <p className="mt-1 text-sm text-slate-500">{copy}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
