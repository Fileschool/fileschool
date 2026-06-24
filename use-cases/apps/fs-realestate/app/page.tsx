"use client";

import { HeroSection } from "@/components/features/HeroSection";
import { Sidebar } from "@/components/features/Sidebar";
import { ListingGrid } from "@/components/features/ListingGrid";
import { BrowseByPropertyType, PopularCities } from "@/components/features/BottomSections";
import { ChevronDown, ArrowUpDown } from "lucide-react";
import { useListingStore } from "@/store/listingStore";

export default function HomePage() {
  const listings = useListingStore((state) => state.listings);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection />

      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col gap-10 lg:flex-row">
          {/* Sidebar Filters */}
          <Sidebar />

          {/* Main Content */}
          <main className="flex-1">
            <div className="mb-10 space-y-4">
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="text-[32px] font-black tracking-tight text-slate-900">
                    Trending Listings in Canada
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">Presented by Horizon Pro Canada</p>
                </div>
                <button className="flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-rose-600 transition-colors">
                  <ArrowUpDown className="h-4 w-4" />
                  Suggested
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
              
              <div className="border-b border-slate-100 pb-4">
                <span className="text-sm font-bold text-slate-900 uppercase tracking-widest opacity-60">
                  {listings.length} RESULTS
                </span>
              </div>
            </div>

            <ListingGrid listings={listings} />

            {/* Bottom Sections */}
            <BrowseByPropertyType />
            <PopularCities />
          </main>
        </div>
      </div>
    </div>
  );
}
