import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { useSyncExternalStore } from "react";
import { IListingWithImages } from "@/interfaces/listing.interface";
import { nanoid } from "nanoid";

interface IListingState {
  listings: IListingWithImages[];
  isLoading: boolean;
}

interface IListingActions {
  addListing: (listing: Omit<IListingWithImages, "id" | "createdAt">) => void;
  removeListing: (id: string) => void;
  updateListing: (id: string, updates: Partial<IListingWithImages>) => void;
}

// Stable timestamps so server-rendered HTML matches client-hydrated state.
const SAMPLE_TS = Date.UTC(2026, 0, 1);

const INITIAL_LISTINGS: IListingWithImages[] = [
  {
    id: "1",
    ownerId: "system",
    title: "Modern Minimalist Villa",
    description: "Experience luxury living in this stunning minimalist villa located in the heart of the hills. Featuring floor-to-ceiling windows, an infinity pool, and state-of-the-art smart home integration.",
    price: 2500,
    bedrooms: 5,
    bathrooms: 4,
    sqft: 4500,
    address: "742 Evergreen Terrace",
    city: "Los Angeles",
    state: "CA",
    zip: "90210",
    propertyType: "House",
    status: "active",
    createdAt: SAMPLE_TS,
    images: [
      { id: "i1", listingId: "1", handle: "external", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80", filename: "hero.jpg", mimetype: "image/jpeg", size: 0, order: 0, createdAt: SAMPLE_TS },
      { id: "i2", listingId: "1", handle: "external", url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80", filename: "exterior.jpg", mimetype: "image/jpeg", size: 0, order: 1, createdAt: SAMPLE_TS }
    ]
  },
  {
    id: "2",
    ownerId: "system",
    title: "Urban Luxury Loft",
    description: "Industrial chic meets modern comfort. This spacious loft features exposed brick walls, original hardwood floors, and a private rooftop terrace with panoramic city views.",
    price: 1850,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1800,
    address: "123 Industrial Way",
    city: "New York",
    state: "NY",
    zip: "10001",
    propertyType: "Apartment",
    status: "active",
    createdAt: SAMPLE_TS,
    images: [
      { id: "i3", listingId: "2", handle: "external", url: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=800&q=80", filename: "loft.jpg", mimetype: "image/jpeg", size: 0, order: 0, createdAt: SAMPLE_TS }
    ]
  },
];

export const useListingStore = create<IListingState & IListingActions>()(
  persist(
    immer((set) => ({
      listings: INITIAL_LISTINGS,
      isLoading: false,

      addListing: (listing) =>
        set((state) => {
          state.listings.unshift({
            ...listing,
            id: nanoid(),
            createdAt: Date.now(),
          } as IListingWithImages);
        }),

      removeListing: (id) =>
        set((state) => {
          state.listings = state.listings.filter((l) => l.id !== id);
        }),

      updateListing: (id, updates) =>
        set((state) => {
          const index = state.listings.findIndex((l) => l.id === id);
          if (index !== -1) {
            state.listings[index] = { ...state.listings[index], ...updates };
          }
        }),
    })),
    {
      name: "horizon-pro-listings-storage",
    }
  )
);

/**
 * Returns true once the persisted store has finished hydrating from
 * localStorage. Components that read persisted data should gate their
 * render on this so SSR-rendered fallback content (e.g. INITIAL_LISTINGS)
 * does not flash before the real state arrives.
 */
export function useHasHydrated(): boolean {
  return useSyncExternalStore(
    (cb) => useListingStore.persist.onFinishHydration(cb),
    () => useListingStore.persist.hasHydrated(),
    () => false,
  );
}
