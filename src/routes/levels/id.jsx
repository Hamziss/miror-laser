import { OrbitControls, PerspectiveCamera, Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Home } from "lucide-react";
import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";

import EndGameMenu from "@/components/end-game-menu";
import Mirror from "@/components/objects/mirror";
import Triangle from "@/components/objects/triangle";
import Scene from "@/components/scene";
import { Button } from "@/components/ui/button";
import { useGameStore } from "@/store/useGameStore";
import { useLevelStore } from "@/store/useLevelStore";

const objectComponents = {
  Mirror,
  Triangle,
  // Add other components here as needed
};

const MemoizedCanvasContent = React.memo(function CanvasContent({
  sceneObjects,
}) {
  const { isDragging } = useGameStore();
  const { objects, cameraPosition, loadLevelData, bloom, stars } =
    useLevelStore((state) => ({
      objects: state.objects,
      stars: state.stars,
      bloom: state.bloom,
      loadLevelData: state.loadLevelData,
      cameraPosition: state.cameraPosition,
    }));

  return (
    <>
      <color attach="background" args={["#010000"]} />
      <PerspectiveCamera makeDefault position={cameraPosition} />
      <Scene isSourceDraggable={false} isGlobeDraggable={false}>
        {sceneObjects}
      </Scene>
      <Stars
        speed={stars.starSpeed}
        radius={stars.starRadius}
        depth={stars.starDepth}
        count={stars.starCount}
        factor={stars.starFactor}
        saturation={stars.starSaturation}
        fade={true}
      />
      <EffectComposer>
        <Bloom
          mipmapBlur
          luminanceThreshold={bloom.bloomLuminanceThreshold}
          luminanceSmoothing={bloom.bloomLuminanceSmoothing}
          intensity={bloom.bloomIntensity}
        />
      </EffectComposer>
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={!isDragging}
      />
    </>
  );
});

export default function GamePage() {
  const { objects, loadLevelData } = useLevelStore((state) => ({
    objects: state.objects,
    loadLevelData: state.loadLevelData,
  }));
  const { editingObjectId, setGlobeExploded, setEditingObjectId, reset } =
    useGameStore();

  useEffect(() => {
    loadLevelData("bcfcd1a8-9ec0-42a7-adce-ff07cba85fd4");
  }, [loadLevelData]);

  const sceneObjects = useMemo(() => {
    if (!objects.length) return [];

    return objects.map((obj, index) => {
      const Component = objectComponents[obj.type];
      const objectId = `${obj.type}-${index}`;

      return (
        <Component
          key={objectId}
          objectId={objectId}
          {...obj.props}
          allowXYEditor={false}
          isEditing={editingObjectId === objectId}
          onStartEditing={() => setEditingObjectId(objectId)}
        />
      );
    });
  }, [objects, editingObjectId, setEditingObjectId]);

  if (!objects.length) {
    return <div>Loading...</div>;
  }
  const resetLevel = () => {
    reset();
    loadLevelData("bcfcd1a8-9ec0-42a7-adce-ff07cba85fd4");
  };

  return (
    <>
      <Link
        to="/"
        className="fixed left-3 top-3 z-50 cursor-pointer"
        unstable_viewTransition
      >
        <Button size="icon" className="h-16 w-16 bg-gray-800">
          <Home />
        </Button>
      </Link>
      <EndGameMenu onRestart={() => resetLevel()} />
      <Canvas
        orthographic
        camera={{ zoom: 100 }}
        style={{ width: "100vw", height: "100vh" }}
      >
        <MemoizedCanvasContent sceneObjects={sceneObjects} />
      </Canvas>
    </>
  );
}
