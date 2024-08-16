import { useState } from "react";

const useLoadLevelData = (levelId) => {
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   const loadLevelData = async () => {
  //     try {
  //       const data = await import(`../levels/${levelId}.json`);

  //       useLevelStore.getState().setObjects(data.default.objects);
  //       useLevelStore.getState().setSourcePosition(data.default.sourcePosition);
  //       useLevelStore.getState().setGlobePosition(data.default.globePosition);
  //       useLevelStore
  //         .getState()
  //         .updateCameraPosition(data.default.cameraPosition);
  //     } catch (error) {
  //       console.error("Error importing level data:", error);
  //       setError(error);
  //     }
  //   };
  //   loadLevelData();
  // }, [levelId]);

  return { error };
};

export default useLoadLevelData;
