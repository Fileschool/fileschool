"use client";

import { FC, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ListingGrid } from "@/components/features/ListingGrid";
import { useListingStore } from "@/store/listingStore";
import { readFilters } from "@/components/features/SearchFilters";

export const SearchResults: FC = () => {
  const params = useSearchParams();
  const listings = useListingStore((s) => s.listings);

  const filters = useMemo(
    () => readFilters(new URLSearchParams(params.toString())),
    [params],
  );

  const results = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    const city = filters.city.trim().toLowerCase();
    const minPrice = filters.minPrice ? Number(filters.minPrice) : null;
    const maxPrice = filters.maxPrice ? Number(filters.maxPrice) : null;
    const minBeds = filters.minBeds ? Number(filters.minBeds) : null;
    const minBaths = filters.minBaths ? Number(filters.minBaths) : null;
    const type = filters.propertyType.trim().toLowerCase();

    return listings.filter((l) => {
      if (q && !l.title.toLowerCase().includes(q) && !l.description.toLowerCase().includes(q)) return false;
      if (city && !l.city.toLowerCase().includes(city)) return false;
      if (type && l.propertyType.toLowerCase() !== type) return false;
      if (minPrice !== null && l.price < minPrice) return false;
      if (maxPrice !== null && l.price > maxPrice) return false;
      if (minBeds !== null && l.bedrooms < minBeds) return false;
      if (minBaths !== null && l.bathrooms < minBaths) return false;
      return true;
    });
  }, [listings, filters]);

  return (
    <div className="flex-1 space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <span className="text-sm font-bold text-slate-900 uppercase tracking-widest opacity-60">
          {results.length} {results.length === 1 ? "result" : "results"}
        </span>
      </div>
      <ListingGrid listings={results} />
    </div>
  );
};
