import { create } from "zustand";

export const useGameStore = create((set) => ({
  // states
  isDragging: false,
  isGlobeExploded: false,
  levelCompleted: false,
  editingObjectId: null,

  //simple setters
  setIsDragging: (value) => set((state) => ({ isDragging: value })),
  setEditingObjectId: (objectId) => set((state) => ({ editingObjectId: state.editingObjectId === objectId ? null : objectId })),
  setGlobeExploded: (isExploded) => set((state) => ({ isGlobeExploded: isExploded })),
  setLevelCompleted: (completed) => set((state) => ({ levelCompleted: completed })),
  reset: () => set(() => ({
    isDragging: false,
    isGlobeExploded: false,
    levelCompleted: false,
    editingObjectId: null
  })),
}));

