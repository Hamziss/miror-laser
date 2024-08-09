// Scene.js
import { setupTextures } from "@/lib/helpers";
import { useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useDrag } from "@use-gesture/react";
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
  setIsDragging,
  isSourceDraggable = false,
  isGlobeDraggable = false,
  sourcePosition,
  setSourcePosition,
  globePosition,
  setGlobePosition,
}) {
  const fixedDirection = useMemo(() => new THREE.Vector3(0, -1, 0), []);
  const reflectRef = useRef();
  const sourceRef = useRef();
  const explodingGlobeRef = useRef();

  const { size, viewport, camera } = useThree();
  const aspect = size.width / viewport.width;

  const [
    streakTexture,
    glowTexture,
    sparkleTexture,
    cloudTexture,
    lavaTexture,
  ] = useTexture([
    "/textures/electric.png",
    "/textures/lensflare0_bw.jpg",
    "/textures/lavatile.jpg",
    "/textures/cloud.png",
    "/textures/lavatile.jpg",
  ]);

  // Set up textures
  setupTextures([cloudTexture, lavaTexture]);

  const bind = useDrag(
    ({ xy: [x, y], first, last }) => {
      if (first) setIsDragging(true);
      if (last) setIsDragging(false);
      const intersectionPoint = calculateIntersectionPoint(x, y, size, camera);
      setSourcePosition([intersectionPoint.x, intersectionPoint.y, 0]);
    },
    { pointerEvents: true },
  );
  const ExplodingGlobeBind = useDrag(
    ({ xy: [x, y], first, last }) => {
      if (first) setIsDragging(true);
      if (last) setIsDragging(false);
      const intersectionPoint = calculateIntersectionPoint(x, y, size, camera);
      setGlobePosition([intersectionPoint.x, intersectionPoint.y, 0]);
    },
    { pointerEvents: true },
  );

  useFrame(() => {
    const [startX, startY] = sourcePosition;
    const endX = startX + fixedDirection.x * 5;
    const endY = startY + fixedDirection.y * 5;

    reflectRef.current.setRay([startX, startY, 0], [endX, endY, 0]);
    const range = reflectRef.current.update();

    if (sourceRef.current) {
      sourceRef.current.position.set(startX, startY, 0);
    }
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
          explodingGlobeRef={explodingGlobeRef}
          position={globePosition}
          radius={1}
          bind={isSourceDraggable ? ExplodingGlobeBind : undefined}
        />
      </Reflect>
      <Streaks reflectRef={reflectRef} />
      <Glow reflectRef={reflectRef} />
      <Sparkles reflectRef={reflectRef} />
      <Source
        sourceRef={sourceRef}
        sourcePosition={sourcePosition}
        bind={isSourceDraggable ? bind : undefined}
        lavaTexture={lavaTexture}
      />
      <ParticleSystem sourcePosition={sourcePosition} />
    </>
  );
}

function calculateIntersectionPoint(x, y, size, camera) {
  const ndcX = (x / size.width) * 2 - 1;
  const ndcY = -(y / size.height) * 2 + 1;
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera);
  const planeNormal = new THREE.Vector3(0, 0, 1);
  const intersectionPoint = new THREE.Vector3();
  raycaster.ray.intersectPlane(
    new THREE.Plane(planeNormal, 0),
    intersectionPoint,
  );
  return intersectionPoint;
}
