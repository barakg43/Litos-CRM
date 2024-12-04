import { create, StoreApi, UseBoundStore } from "zustand";
import { queryClient } from "../../../app/AppProviders";
import { UserDetails } from "../../../features/auth/auth";
type AuthState = {
  user: UserDetails | null;
  login: (user: UserDetails) => void;
  logout: () => void;
  isAdmin: () => boolean;
};
export const useAuthStore: UseBoundStore<StoreApi<AuthState>> = create(
  (set, get) => ({
    user: null,
    login: (user: UserDetails) => {
      set({ user });
    },
    logout: () => {
      set({ user: null });
      queryClient.removeQueries({
        predicate: (query) => query.queryKey[0] !== "User",
      });
    },
    isAdmin: () => {
      return get().user?.role === "ADMIN";
    },
  })
);
