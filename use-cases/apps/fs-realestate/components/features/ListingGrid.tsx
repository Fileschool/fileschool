import { FC } from "react";
import { ListingCard } from "./ListingCard";
import type { IListingGridProps } from "@/interfaces/listing.interface";

export const ListingGrid: FC<IListingGridProps> = ({ listings }) => {
  if (listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-navy-800/50">
          <span className="text-3xl">🏠</span>
        </div>
        <h3 className="text-lg font-semibold text-white">No listings yet</h3>
        <p className="mt-1 text-sm text-slate-400">
          Be the first to add a property listing.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
};
