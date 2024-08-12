// Scene.js
import { useGameStore } from "@/store/useGameStore";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import ExplodingGlobe from "../objects/explode-globe";
import Reflect from "../Reflect";
import Glow from "./glow";
import ParticleSystem from "./particles-system";
import Source from "./source";
import Sparkles from "./sparkles";
import Streaks from "./streaks";

export default function Scene({
  children,
  // setIsDragging,
  isSourceDraggable = false,
  isGlobeDraggable = false,
  // sourcePosition,
  // setSourcePosition,
  // globePosition,
  // setGlobePosition,
}) {
  const { sourcePosition } = useGameStore();
  const fixedDirection = useMemo(() => new THREE.Vector3(0, -1, 0), []);
  const reflectRef = useRef();
  // const sourceRef = useRef();

  // const { size, viewport, camera } = useThree();
  // const aspect = size.width / viewport.width;

  // const [
  //   streakTexture,
  //   glowTexture,
  //   sparkleTexture,
  //   cloudTexture,
  //   lavaTexture,
  // ] = useTexture([
  //   "/textures/electric.png",
  //   "/textures/lensflare0_bw.jpg",
  //   "/textures/lavatile.jpg",
  //   "/textures/cloud.png",
  //   "/textures/lavatile.jpg",
  // ]);

  // Set up textures
  // setupTextures([cloudTexture, lavaTexture]);

  // const bind = useDrag(
  //   ({ xy: [x, y], first, last }) => {
  //     if (first) setIsDragging(true);
  //     if (last) setIsDragging(false);
  //     const intersectionPoint = calculateIntersectionPoint(x, y, size, camera);
  //     setSourcePosition([intersectionPoint.x, intersectionPoint.y, 0]);
  //   },
  //   { pointerEvents: true },
  // );

  console.log("rerender scene");

  useFrame(() => {
    const [startX, startY] = sourcePosition;
    const endX = startX + fixedDirection.x * 5;
    const endY = startY + fixedDirection.y * 5;

    reflectRef.current.setRay([startX, startY, 0], [endX, endY, 0]);
    const range = reflectRef.current.update();
  });

  return (
    <>
      <Reflect
        ref={reflectRef}
        far={1000}
        bounce={100}
        start={[10, 5, 0]}
        end={[0, 0, 0]}
      >
        {children}
        <ExplodingGlobe
          // explodingGlobeRef={explodingGlobeRef}
          // position={globePosition}
          radius={1}
          // bind={isSourceDraggable ? ExplodingGlobeBind : undefined}
        />
      </Reflect>
      <Streaks reflectRef={reflectRef} />
      <Glow reflectRef={reflectRef} />
      <Sparkles reflectRef={reflectRef} />
      <Source
      // sourceRef={sourceRef}
      // sourcePosition={sourcePosition}
      // setIsDragging={setIsDragging}
      // bind={isSourceDraggable ? bind : undefined}
      // lavaTexture={lavaTexture}
      />
      <ParticleSystem />
    </>
  );
}
