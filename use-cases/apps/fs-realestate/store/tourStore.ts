import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useSyncExternalStore } from "react";

export type TourStepId =
  | "signin"
  | "list-property"
  | "uploader"
  | "fields"
  | "publish"
  | "view-listing"
  | "transformations"
  | "admin";

interface ITourState {
  currentStep: TourStepId | null;
  isActive: boolean;
  hasCompleted: boolean;
}

interface ITourActions {
  start: () => void;
  goTo: (step: TourStepId) => void;
  next: () => void;
  dismiss: () => void;
  complete: () => void;
  reset: () => void;
}

export const TOUR_ORDER: TourStepId[] = [
  "signin",
  "list-property",
  "uploader",
  "fields",
  "publish",
  "view-listing",
  "transformations",
  "admin",
];

export const useTourStore = create<ITourState & ITourActions>()(
  persist(
    (set, get) => ({
      currentStep: null,
      isActive: false,
      hasCompleted: false,

      start: () =>
        set({
          currentStep: "signin",
          isActive: true,
          hasCompleted: false,
        }),

      goTo: (step) => {
        if (!get().isActive) return;
        set({ currentStep: step });
      },

      next: () => {
        const current = get().currentStep;
        if (!current) return;
        const i = TOUR_ORDER.indexOf(current);
        if (i === -1 || i === TOUR_ORDER.length - 1) {
          set({ isActive: false, currentStep: null, hasCompleted: true });
        } else {
          set({ currentStep: TOUR_ORDER[i + 1] });
        }
      },

      dismiss: () =>
        set({ isActive: false, currentStep: null, hasCompleted: true }),

      complete: () =>
        set({ isActive: false, currentStep: null, hasCompleted: true }),

      reset: () =>
        set({
          isActive: true,
          currentStep: "signin",
          hasCompleted: false,
        }),
    }),
    {
      name: "horizon-pro-tour-storage",
      partialize: (state) => ({ hasCompleted: state.hasCompleted }),
    },
  ),
);

export function useTourHasHydrated(): boolean {
  return useSyncExternalStore(
    (cb) => useTourStore.persist.onFinishHydration(cb),
    () => useTourStore.persist.hasHydrated(),
    () => false,
  );
}
