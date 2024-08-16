import { create } from "zustand";

export const useLevelStore = create((set, get) => ({
  stars: {},
  objects: [],
  sourcePosition: [0, 0, 0],
  globePosition: [0, 0, 0],
  cameraPosition: [0, 0, 0],
  bloom: {},


  //simple setters
  setSourcePosition: (newPos) => set((state) => ({ sourcePosition: newPos })),
  setGlobePosition: (newPos) => set((state) => ({ globePosition: newPos })),
  setCameraPosition: (newPos) => set((state) => ({ cameraPosition: newPos })),


  // Add this new method
  updateCameraPosition: (position) => {
    const state = get();
    state.cameraPosition = position;
  },

  setObjects: (objects) => set((state) => ({ objects })),
  addObject: (object) => set((state) => ({ objects: [...state.objects, object] })),
  addObjects: (objects) => set((state) => ({ objects: [...state.objects, ...objects] })),
  deleteObject: (object) => set((state) => ({ objects: state.objects.filter((o) => o !== object) })),
  updateObjectPosition: (objectId, position) => set((state) => {
    const updatedObjects = state.objects.map((obj) => {
      if (obj.objectId === objectId) {
        return { ...obj, props: { ...obj.props, position } };
      }
      return obj;
    });
    return { objects: updatedObjects };
  }),
  updateObjectRotation: (objectId, rotation) => set((state) => {
    const updatedObjects = state.objects.map((obj) => {
      if (obj.objectId === objectId) {
        return { ...obj, props: { ...obj.props, rotation } };
      }
      return obj;
    });
    return { objects: updatedObjects };
  }),
  loadLevelData: (levelId) => {
    const loadLevelData = async () => {
      try {
        const data = await import(`../levels/${levelId}.json`);

        set((state) => ({
          objects: data.default.objects,
          sourcePosition: data.default.sourcePosition,
          globePosition: data.default.globePosition,
          cameraPosition: data.default.cameraPosition,
          stars: data.default.stars,
          bloom: data.default.bloom,
        }));
      } catch (error) {
        console.error("Error importing level data:", error);
      }
    };
    loadLevelData();
  },

  //global setter
  setLevelData: (data) => set((state) => ({ ...state, ...data })),
}));

