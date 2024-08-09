import { button, folder, useControls } from "leva";
import { useCallback } from "react";

export function useLevaControls({
  levelData,
  setLevelData,
  sourcePosition,
  globePosition,
  objects,
}) {
  const exportSettings = useCallback(
    (controls, levelData, sourcePosition, globePosition) => {
      const settings = {
        Stars: {
          starSpeed: controls.starSpeed,
          starRadius: controls.starRadius,
          starDepth: controls.starDepth,
          starCount: controls.starCount,
          starFactor: controls.starFactor,
          starSaturation: controls.starSaturation,
        },
        Bloom: {
          bloomIntensity: controls.bloomIntensity,
          bloomLuminanceThreshold: controls.bloomLuminanceThreshold,
          bloomLuminanceSmoothing: controls.bloomLuminanceSmoothing,
        },
        ...levelData,
        sourcePosition,
        globePosition,
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
    },
    [],
  );

  const addMirror = useCallback(() => {
    setLevelData((prevData) => ({
      ...prevData,
      objects: [
        ...prevData.objects,
        {
          type: "Mirror",
          props: {
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            scale: 0.5,
            width: 0.2,
            height: 2.1,
            depth: 2.1,
          },
        },
      ],
    }));
  }, [setLevelData]);

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
      "Add Mirror": button(addMirror),
      "Export Settings": button(() =>
        exportSettings(controls, levelData, sourcePosition, globePosition),
      ),
    }),
    [levelData, addMirror, exportSettings, sourcePosition, globePosition],
  );

  return { controls, set };
}
