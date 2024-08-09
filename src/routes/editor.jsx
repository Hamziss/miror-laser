import { OrbitControls, PerspectiveCamera, Stars } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { debounce } from "lodash";
import { Home } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import Mirror from "@/components/objects/mirror";
import Triangle from "@/components/objects/triangle";
import Scene from "@/components/scene";
import { Button } from "@/components/ui/button";
import { useLevaControls } from "@/hooks/useLevaControls";

const objectComponents = {
  Mirror,
  Triangle,
  // Add other components here as needed
};

function OptimizedCameraPositionLogger({ setPosition }) {
  const { camera } = useThree();

  const debouncedSetPosition = useMemo(
    () => debounce(setPosition, 100),
    [setPosition],
  );

  useFrame(() => {
    debouncedSetPosition({
      x: camera.position.x,
      y: camera.position.y,
      z: camera.position.z,
    });
  });

  return null;
}

const MemoizedCanvasContent = React.memo(function CanvasContent({
  sceneObjects,
  isDragging,
  editingObjectId,
  setIsDraggingCallback,
  memoizedControls,
  setPosition,
  setSourcePosition,
  sourcePosition = [0, 0, 0],
  globePosition = [0, 0, 0],
  setGlobePosition,
}) {
  return (
    <>
      <color attach="background" args={["#010000"]} />
      <PerspectiveCamera makeDefault position={[7.35, 2.25, 9.83]} />
      <Scene
        isSourceDraggable={true}
        isGlobeDraggable={true}
        sourcePosition={sourcePosition}
        setSourcePosition={setSourcePosition}
        globePosition={globePosition}
        setGlobePosition={setGlobePosition}
        setIsDragging={setIsDraggingCallback}
      >
        {sceneObjects}
      </Scene>

      <Stars
        speed={memoizedControls.starSpeed}
        radius={memoizedControls.starRadius}
        depth={memoizedControls.starDepth}
        count={memoizedControls.starCount}
        factor={memoizedControls.starFactor}
        saturation={memoizedControls.starSaturation}
        fade={true}
      />
      <EffectComposer>
        <Bloom
          mipmapBlur
          luminanceThreshold={memoizedControls.bloomLuminanceThreshold}
          luminanceSmoothing={memoizedControls.bloomLuminanceSmoothing}
          intensity={memoizedControls.bloomIntensity}
        />
      </EffectComposer>
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={!isDragging}
      />
      <OptimizedCameraPositionLogger setPosition={setPosition} />
    </>
  );
});

export default function EditorPage() {
  const [levelData, setLevelData] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0, z: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [editingObjectId, setEditingObjectId] = useState(false);
  const [sourcePosition, setSourcePosition] = useState([0, 0, 0]);
  const [globePosition, setGlobePosition] = useState([0, 0, 0]);
  const { controls, set } = useLevaControls({
    levelData,
    setLevelData,
    sourcePosition,
    globePosition,
  });

  const memoizedControls = useMemo(() => controls, Object.values(controls));

  useEffect(() => {
    const loadLevelData = async () => {
      try {
        const data = await import(
          `../levels/bcfcd1a8-9ec0-42a7-adce-ff07cba85fd4.json`
        );
        setLevelData(data.default);
        setSourcePosition(data.default.sourcePosition);
        setGlobePosition(data.default.globePosition);
      } catch (error) {
        console.error("Error importing level data:", error);
      }
    };
    loadLevelData();
  }, []);

  const setIsDraggingCallback = useCallback((value) => {
    setIsDragging(value);
  }, []);

  const onStartEditingCallback = useCallback((objectId) => {
    setEditingObjectId((prev) => (prev === objectId ? false : objectId));
  }, []);

  const sceneObjects = useMemo(() => {
    if (!levelData) return [];

    return levelData.objects.map((obj, index) => {
      const Component = objectComponents[obj.type];
      const objectId = `${obj.type}-${index}`;
      return (
        <Component
          key={objectId}
          {...obj.props}
          setIsDragging={setIsDraggingCallback}
          allowXYEditor={true}
          isEditing={editingObjectId === objectId}
          onStartEditing={() => onStartEditingCallback(objectId)}
        />
      );
    });
  }, [
    levelData,
    editingObjectId,
    setIsDraggingCallback,
    onStartEditingCallback,
  ]);

  if (!levelData) {
    return <div>Loading...</div>;
  }

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
      <Canvas
        orthographic
        camera={{ zoom: 100 }}
        style={{ width: "100vw", height: "100vh" }}
      >
        <MemoizedCanvasContent
          setSourcePosition={setSourcePosition}
          sourcePosition={sourcePosition}
          sceneObjects={sceneObjects}
          isDragging={isDragging}
          editingObjectId={editingObjectId}
          setIsDraggingCallback={setIsDraggingCallback}
          memoizedControls={memoizedControls}
          setPosition={setPosition}
          globePosition={globePosition}
          setGlobePosition={setGlobePosition}
        />
      </Canvas>
    </>
  );
}
