import { create, StoreApi, UseBoundStore } from "zustand";
import { queryClient } from "../../../app/AppProviders";
import { UserDetails } from "../../../features/auth/auth";
type AuthState = {
  user: UserDetails | null;
  isAuthenticated: boolean;
  login: (user: UserDetails) => void;
  logout: () => void;
};
export const useAuth: UseBoundStore<StoreApi<AuthState>> = create((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user: UserDetails) => {
    set({ user, isAuthenticated: true });
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
    queryClient.removeQueries({
      predicate: (query) => query.queryKey[0] !== "User",
    });
  },
}));
