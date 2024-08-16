import { DEFAULT_HASH, DEFAULT_LEVEL_ID } from "@/contants";
import { create } from "zustand";
import { persist } from "zustand/middleware";



export const useUserStore = create(
  persist(
    (set, get) => ({
      currentLevelId: DEFAULT_LEVEL_ID,
      levelKey: DEFAULT_HASH,

      // setters
      setCurrentLevelId: (id) => set({ currentLevelId: id }),
      setLevelKey: (key) => set({ levelKey: key }),
    }),
    {
      name: "user",
    }
  )
);