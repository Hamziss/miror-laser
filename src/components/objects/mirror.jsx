import { TransformControls } from "@react-three/drei";
import { useRef, useState } from "react";

export default function Mirror({
  width = 1,
  height = 1,
  depth = 1,
  setIsDragging,
  isEditing,
  allowXYEditor = false,
  onStartEditing,
  ...props
}) {
  const [hovered, hover] = useState(false);
  const meshRef = useRef();
  const controlsRef = useRef();

  const handleRotationChange = (e) => {
    console.log("rotation change");
    setIsDragging(true);
    if (meshRef.current) {
      meshRef.current.rotation.x = 0;
      meshRef.current.rotation.y = 0;
    }
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
        <meshBasicMaterial
          color={hovered ? props.color || orangeColorLight : "gray"}
        />
      </mesh>
      {isEditing && (
        <>
          <TransformControls
            ref={controlsRef}
            object={meshRef.current}
            mode="rotate"
            showX={false}
            onMouseUp={() => (console.log("hre"), setIsDragging(false))}
            showY={false}
            size={0.8}
            onMouseDown={handleRotationChange}
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
            onMouseDown={handleRotationChange}
            space="local" // or "world"
          />
        </>
      )}
    </>
  );
}
