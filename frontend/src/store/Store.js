import { create } from "zustand";
import { persist } from "zustand/middleware";
export const useStore = create(persist((set) => ({
  isLoggedIn: null,
  Role: "",
  setRole: (role) => set({ Role: role }),
  setisLoggedIn: (user) => set({ user }),
}),
{name : "Consistent_login"},
));