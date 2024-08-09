// components/Glow.js
import { setupTextures } from "@/lib/helpers";
import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function Glow({ reflectRef }) {
  const [glowTexture] = useTexture(["/textures/lensflare0_bw.jpg"]);
  setupTextures([glowTexture]);
  const glowRef = useRef();
  const obj = new THREE.Object3D();

  useFrame((state) => {
    const range = reflectRef.current.update();
    updateGlow(glowRef, reflectRef, range, obj, state.clock);
  });

  return (
    <instancedMesh
      ref={glowRef}
      args={[null, null, 100]}
      instanceMatrix-usage={THREE.DynamicDrawUsage}
    >
      <planeGeometry />
      <meshBasicMaterial
        map={glowTexture}
        transparent
        opacity={0.05}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  );
}

function updateGlow(glowRef, reflectRef, range, obj, clock) {
  obj.scale.setScalar(0);
  obj.updateMatrix();
  glowRef.current.setMatrixAt(0, obj.matrix);

  for (let i = 1; i < range; i++) {
    obj.position.fromArray(reflectRef.current.positions, i * 3);
    obj.scale.setScalar(1.5);
    obj.rotation.set(0, 0, clock.elapsedTime / 10);
    obj.updateMatrix();
    glowRef.current.setMatrixAt(i, obj.matrix);
  }

  glowRef.current.count = range;
  glowRef.current.instanceMatrix.updateRange.count = range * 16;
  glowRef.current.instanceMatrix.needsUpdate = true;
}
