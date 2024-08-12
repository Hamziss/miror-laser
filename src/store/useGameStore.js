import { create } from "zustand";

export const useGameStore = create((set) => ({
  sourcePosition: [0, 0, 0],
  globePosition: [0, 0, 0],
  isDragging: false,

  //simple setters
  setSourcePosition: (newPos) => set((state) => ({ sourcePosition: newPos })),
  setGlobePosition: (newPos) => set((state) => ({ globePosition: newPos })),
  setIsDragging: (value) => set((state) => ({ isDragging: value })),
}));

