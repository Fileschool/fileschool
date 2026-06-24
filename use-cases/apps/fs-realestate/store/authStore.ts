import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { useSyncExternalStore } from "react";
import { IAuthState, IAuthActions, IUser } from "@/interfaces/user.interface";
import { nanoid } from "nanoid";

export const useAuthStore = create<IAuthState & IAuthActions>()(
  persist(
    immer((set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (email, name) =>
        set((state) => {
          const user: IUser = {
            id: nanoid(),
            email,
            name,
            role: "user",
            createdAt: Date.now(),
          };
          state.user = user;
          state.token = "local-token-" + nanoid();
          state.isAuthenticated = true;
        }),

      signup: (email, name) =>
        set((state) => {
          const user: IUser = {
            id: nanoid(),
            email,
            name,
            role: "user",
            createdAt: Date.now(),
          };
          state.user = user;
          state.token = "local-token-" + nanoid();
          state.isAuthenticated = true;
        }),

      logout: () =>
        set((state) => {
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
        }),
    })),
    {
      name: "horizon-pro-auth-storage",
    }
  )
);

/** Returns true once the auth store has hydrated from localStorage. */
export function useAuthHasHydrated(): boolean {
  return useSyncExternalStore(
    (cb) => useAuthStore.persist.onFinishHydration(cb),
    () => useAuthStore.persist.hasHydrated(),
    () => false,
  );
}
