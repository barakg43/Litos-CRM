import { createSelectorFunctions } from "auto-zustand-selectors-hook";
import { create } from "zustand";
import { queryClient } from "../../../app/AppProviders";
import { UserDetails } from "../../../features/users/users";

type State = {
  user: UserDetails | null;
};
const initialState: State = {
  user: null,
};
type Actions = {
  login: (user: UserDetails) => void;
  logout: () => void;
  isAdmin: () => boolean;
};
const useAuthStoreBase = create<State & Actions>()((set, get) => ({
  ...initialState,
  login: (user: UserDetails) => {
    if (get().user) return; // fix rerenders bug that login submit multiple times
    set({ user });
  },
  logout: () => {
    set(initialState);
    queryClient.removeQueries({
      predicate: (query) => query.queryKey[0] !== "User",
    });
  },
  isAdmin: () => get().user?.role === "ADMIN",
}));
export const useAuthStore = createSelectorFunctions(useAuthStoreBase);
