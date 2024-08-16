// Scene.js
import { useLevelStore } from "@/store/useLevelStore";
import { useFrame, useThree } from "@react-three/fiber";
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
  isSourceDraggable = false,
  isGlobeDraggable = false,
}) {
  const { sourcePosition, updateCameraPosition } = useLevelStore();
  const { camera } = useThree();
  const fixedDirection = useMemo(() => new THREE.Vector3(0, -1, 0), []);
  const reflectRef = useRef();

  useFrame(() => {
    const [startX, startY] = sourcePosition;
    const endX = startX + fixedDirection.x * 5;
    const endY = startY + fixedDirection.y * 5;

    reflectRef.current.setRay([startX, startY, 0], [endX, endY, 0]);
    const range = reflectRef.current.update();

    // update camera position
    updateCameraPosition([
      camera.position.x,
      camera.position.y,
      camera.position.z,
    ]);
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
        <ExplodingGlobe isGlobeDraggable={isGlobeDraggable} radius={1} />
      </Reflect>
      <Streaks reflectRef={reflectRef} />
      <Glow reflectRef={reflectRef} />
      <Sparkles reflectRef={reflectRef} />
      <Source isSourceDraggable={isSourceDraggable} />
      <ParticleSystem />
    </>
  );
}
