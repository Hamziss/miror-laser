import { useGameStore } from "@/store/useGameStore";
import { useLevelStore } from "@/store/useLevelStore";
import { button, folder, useControls } from "leva";
import { useCallback } from "react";

export function useLevaControls() {
  const exportSettings = useCallback((controls) => {
    const { stars, bloom, ...levelStore } = useLevelStore.getState();
    const settings = {
      stars: {
        starSpeed: controls.starSpeed,
        starRadius: controls.starRadius,
        starDepth: controls.starDepth,
        starCount: controls.starCount,
        starFactor: controls.starFactor,
        starSaturation: controls.starSaturation,
      },
      bloom: {
        bloomIntensity: controls.bloomIntensity,
        bloomLuminanceThreshold: controls.bloomLuminanceThreshold,
        bloomLuminanceSmoothing: controls.bloomLuminanceSmoothing,
      },
      ...levelStore,
    };

    const blob = new Blob([JSON.stringify(settings, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leva-settings.json";
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const addMirror = useCallback(() => {
    const currentObjects = useLevelStore.getState().objects;
    const objectId = `Mirror-${currentObjects.length}`;
    useLevelStore.getState().addObject({
      objectId,
      type: "Mirror",
      props: {
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: 0.5,
        width: 0.2,
        height: 2.1,
        depth: 2.1,
      },
    });
  }, [useLevelStore]);

  const resetGlobe = useCallback(() => {
    useLevelStore.getState().setGlobeExploded(false);
  }, []);

  const [controls, set] = useControls(
    () => ({
      Stars: folder({
        starSpeed: { value: 1.5, min: 0, max: 5, step: 0.1 },
        starRadius: { value: 150, min: 50, max: 300, step: 10 },
        starDepth: { value: 50, min: 10, max: 100, step: 5 },
        starCount: { value: 3000, min: 100, max: 10000, step: 100 },
        starFactor: { value: 3, min: 1, max: 10, step: 0.5 },
        starSaturation: { value: 5, min: 0, max: 10, step: 0.5 },
      }),
      Bloom: folder({
        bloomIntensity: { value: 3, min: 0, max: 6, step: 0.1 },
        bloomLuminanceThreshold: { value: 1.9, min: 0, max: 5, step: 0.1 },
        bloomLuminanceSmoothing: { value: 1.0, min: 0, max: 6, step: 0.1 },
      }),
      "Reset Exploding Globe": button(resetGlobe),
      "Add Mirror": button(addMirror),
      "Delete Current Mirror": button(() => {
        const object = useLevelStore
          .getState()
          .objects.find(
            (o) => o.objectId === useGameStore.getState().editingObjectId,
          );

        useLevelStore.getState().deleteObject(object);
      }),
      "Export Settings": button(() => exportSettings(controls)),
    }),
    [addMirror, exportSettings, resetGlobe],
  );

  return { controls, set };
}
