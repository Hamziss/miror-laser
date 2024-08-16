// components/Source.js

import { calculateIntersectionPoint, setupTextures } from "@/lib/helpers";
import { useGameStore } from "@/store/useGameStore";
import { useLevelStore } from "@/store/useLevelStore";
import { useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useDrag } from "@use-gesture/react";
import { useRef } from "react";

export default function Source({ isSourceDraggable = false }) {
  const sourceRef = useRef();
  const { setIsDragging } = useGameStore();
  const { sourcePosition, setSourcePosition } = useLevelStore();

  const { size, viewport, camera } = useThree();

  const [lavaTexture] = useTexture(["/textures/lavatile.jpg"]);

  setupTextures([lavaTexture]);
  const dragBind = useDrag(
    ({ xy: [x, y], first, last }) => {
      if (first) setIsDragging(true);
      if (last) setIsDragging(false);
      const intersectionPoint = calculateIntersectionPoint(x, y, size, camera);
      setSourcePosition([intersectionPoint.x, intersectionPoint.y, 0]);
    },
    { pointerEvents: true },
  );
  useFrame(() => {
    const [startX, startY] = sourcePosition;

    lavaTexture.offset.x -= 0.00031;
    lavaTexture.offset.y += 0.00011;

    if (sourceRef.current) {
      sourceRef.current.position.set(startX, startY, 0);
    }
  });

  return (
    <mesh
      ref={sourceRef}
      {...(isSourceDraggable ? dragBind() : {})}
      scale={4}
      position={sourcePosition}
    >
      <sphereGeometry args={[0.1, 32, 32]} />
      <meshBasicMaterial
        map={lavaTexture}
        color={[(255 / 255) * 9, (96 / 255) * 9, (1 / 255) * 9]}
      />
    </mesh>
  );
}
