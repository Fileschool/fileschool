import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchFilters } from "@/components/features/SearchFilters";
import { SearchResults } from "@/components/features/SearchResults";
import { PageHero } from "@/components/features/PageHero";

export const metadata: Metadata = {
  title: "Search Properties — Horizon Pro",
  description: "Filter listings by city, price, property type, beds, and baths.",
};

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <PageHero
        eyebrow="Search"
        title="Find your next property"
        subtitle="Refine the listings by location, price, type, and features."
      />

      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex flex-col gap-10 lg:flex-row">
          <Suspense fallback={<aside className="w-full shrink-0 lg:w-[320px]" />}>
            <SearchFilters />
          </Suspense>
          <Suspense fallback={<div className="flex-1" />}>
            <SearchResults />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
