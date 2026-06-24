"use client";

import { FC, useCallback, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, X } from "lucide-react";
import { PROPERTY_TYPES } from "@/interfaces/listing.interface";
import { cn } from "@/lib/utils";

export interface ISearchFiltersValue {
  q: string;
  city: string;
  propertyType: string;
  minPrice: string;
  maxPrice: string;
  minBeds: string;
  minBaths: string;
}

export const EMPTY_FILTERS: ISearchFiltersValue = {
  q: "",
  city: "",
  propertyType: "",
  minPrice: "",
  maxPrice: "",
  minBeds: "",
  minBaths: "",
};

export function readFilters(params: URLSearchParams): ISearchFiltersValue {
  return {
    q: params.get("q") ?? "",
    city: params.get("city") ?? "",
    propertyType: params.get("type") ?? "",
    minPrice: params.get("minPrice") ?? "",
    maxPrice: params.get("maxPrice") ?? "",
    minBeds: params.get("minBeds") ?? "",
    minBaths: params.get("minBaths") ?? "",
  };
}

export const SearchFilters: FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const filters = useMemo(() => readFilters(new URLSearchParams(params.toString())), [params]);

  const update = useCallback(
    (patch: Partial<ISearchFiltersValue>) => {
      const next = new URLSearchParams(params.toString());
      const mapping: Record<keyof ISearchFiltersValue, string> = {
        q: "q",
        city: "city",
        propertyType: "type",
        minPrice: "minPrice",
        maxPrice: "maxPrice",
        minBeds: "minBeds",
        minBaths: "minBaths",
      };
      for (const [key, value] of Object.entries(patch) as [keyof ISearchFiltersValue, string][]) {
        const urlKey = mapping[key];
        if (value) next.set(urlKey, value);
        else next.delete(urlKey);
      }
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    },
    [params, pathname, router],
  );

  const activeCount = Object.values(filters).filter(Boolean).length;

  return (
    <aside className="w-full shrink-0 space-y-7 lg:w-[320px]">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Filters</h3>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={() => router.replace(pathname, { scroll: false })}
            className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-rose-600 hover:underline"
          >
            <X className="h-3 w-3" />
            Clear all ({activeCount})
          </button>
        )}
      </div>

      {/* Keyword */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Keyword</label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filters.q}
            onChange={(e) => update({ q: e.target.value })}
            className="input pl-10"
            placeholder="Title or description"
          />
        </div>
      </div>

      {/* City */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">City</label>
        <input
          type="text"
          value={filters.city}
          onChange={(e) => update({ city: e.target.value })}
          className="input"
          placeholder="e.g. Toronto"
        />
      </div>

      {/* Property type */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Property Type</label>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => update({ propertyType: "" })}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-bold transition-colors",
              !filters.propertyType
                ? "bg-slate-900 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300",
            )}
          >
            Any
          </button>
          {PROPERTY_TYPES.map((pt) => (
            <button
              key={pt.value}
              type="button"
              onClick={() => update({ propertyType: pt.value })}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-bold transition-colors",
                filters.propertyType === pt.value
                  ? "bg-slate-900 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300",
              )}
            >
              {pt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Price ($)</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            value={filters.minPrice}
            onChange={(e) => update({ minPrice: e.target.value })}
            className="input"
            placeholder="Min"
          />
          <input
            type="number"
            inputMode="numeric"
            value={filters.maxPrice}
            onChange={(e) => update({ maxPrice: e.target.value })}
            className="input"
            placeholder="Max"
          />
        </div>
      </div>

      {/* Beds */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Minimum Beds</label>
        <div className="flex flex-wrap gap-2">
          {["", "1", "2", "3", "4", "5"].map((n) => (
            <button
              key={`bed-${n || "any"}`}
              type="button"
              onClick={() => update({ minBeds: n })}
              className={cn(
                "min-w-[44px] rounded-lg px-3 py-1.5 text-xs font-bold transition-colors",
                filters.minBeds === n
                  ? "bg-slate-900 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300",
              )}
            >
              {n ? `${n}+` : "Any"}
            </button>
          ))}
        </div>
      </div>

      {/* Baths */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Minimum Baths</label>
        <div className="flex flex-wrap gap-2">
          {["", "1", "2", "3", "4"].map((n) => (
            <button
              key={`bath-${n || "any"}`}
              type="button"
              onClick={() => update({ minBaths: n })}
              className={cn(
                "min-w-[44px] rounded-lg px-3 py-1.5 text-xs font-bold transition-colors",
                filters.minBaths === n
                  ? "bg-slate-900 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300",
              )}
            >
              {n ? `${n}+` : "Any"}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};
