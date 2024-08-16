import { useGameStore } from "@/store/useGameStore";
import { useLevelStore } from "@/store/useLevelStore";
import { TransformControls } from "@react-three/drei";
import { useRef, useState } from "react";

export default function Mirror({
  width = 1,
  height = 1,
  objectId,
  depth = 1,
  isEditing,
  allowXYEditor = false,
  onStartEditing,
  ...props
}) {
  const { setIsDragging } = useGameStore();
  const { updateObjectPosition, updateObjectRotation } = useLevelStore();
  const [hovered, hover] = useState(false);
  const meshRef = useRef();
  const controlsRef = useRef();

  const handleRotationChange = (e) => {
    setIsDragging(true);
    if (meshRef.current) {
      meshRef.current.rotation.x = 0;
      meshRef.current.rotation.y = 0;
      updateObjectRotation(objectId, meshRef.current.rotation.toArray());
    }
  };
  const handlePositionChange = (e) => {
    setIsDragging(true);
    updateObjectPosition(objectId, meshRef.current.position.toArray());
  };
  const orangeColor = [255 / 255, 37 / 255, 26 / 255];
  const orangeColorLight = [
    (255 / 255) * 6.16,
    (37 / 255) * 6.16,
    (26 / 255) * 6.16,
  ];

  return (
    <>
      <mesh
        ref={meshRef}
        onRayOver={(e) => hover(true)}
        onRayOut={(e) => hover(false)}
        {...props}
        onClick={() => {
          onStartEditing();
        }}
      >
        <boxGeometry args={[width, height, depth]} />
        <meshBasicMaterial color={hovered ? orangeColorLight : "gray"} />
      </mesh>
      {isEditing && (
        <>
          <TransformControls
            ref={controlsRef}
            object={meshRef.current}
            mode="rotate"
            showX={false}
            onMouseUp={() => setIsDragging(false)}
            onObjectChange={handleRotationChange}
            showY={false}
            size={0.8}
            space="local" // or "world"
            // rotationSnap={Math.PI / 4}
          />
          <TransformControls
            ref={controlsRef}
            onMouseUp={() => setIsDragging(false)}
            object={meshRef.current}
            mode="translate"
            showX={allowXYEditor}
            showY={allowXYEditor}
            size={0.5}
            showZ={false}
            onObjectChange={handlePositionChange}
            space="local" // or "world"
          />
        </>
      )}
    </>
  );
}
