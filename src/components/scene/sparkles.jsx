// components/Sparkles.js
import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const SPARKLE_COUNT = 500;
const SPARKLE_SPEED = 0.008;

export default function Sparkles({ reflectRef }) {
  //TODO: change this texture
  const [sparkleTexture] = useTexture(["/textures/sparkles.jpg"]);

  const sparklesRef = useRef();
  const sparklesData = useMemo(() => createSparklesData(), []);
  const sparkleObj = new THREE.Object3D();

  useFrame(() => {
    const range = reflectRef.current.update();
    updateSparkles(sparklesRef, reflectRef, range, sparklesData, sparkleObj);
  });

  return (
    <instancedMesh
      ref={sparklesRef}
      args={[null, null, SPARKLE_COUNT]}
      instanceMatrix-usage={THREE.DynamicDrawUsage}
    >
      <planeGeometry />
      <meshBasicMaterial
        map={sparkleTexture}
        transparent
        color="#ff6000"
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        depthTest={true}
        toneMapped={false}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  );
}

function createSparklesData() {
  return Array.from({ length: SPARKLE_COUNT }, () => ({
    position: new THREE.Vector3(),
    scale: Math.random() * 0.03 + 0.01,
    velocity: new THREE.Vector3(
      (Math.random() - 0.5) * SPARKLE_SPEED,
      (Math.random() - 0.5) * SPARKLE_SPEED,
      (Math.random() - 0.5) * SPARKLE_SPEED,
    ),
    opacity: 1,
  }));
}

function updateSparkles(
  sparklesRef,
  reflectRef,
  range,
  sparklesData,
  sparkleObj,
) {
  sparklesData.forEach((sparkle, index) => {
    sparkle.position.add(sparkle.velocity);
    sparkle.opacity -= 0.01;

    if (sparkle.opacity <= 0) {
      resetSparkle(sparkle, reflectRef, range);
    }

    sparkleObj.position.copy(sparkle.position);
    sparkleObj.scale.setScalar(sparkle.scale * sparkle.opacity);
    sparkleObj.updateMatrix();
    sparklesRef.current.setMatrixAt(index, sparkleObj.matrix);
  });

  sparklesRef.current.instanceMatrix.needsUpdate = true;
}

function resetSparkle(sparkle, reflectRef, range) {
  const randomIndex = Math.floor(Math.random() * (range - 1));
  const position = new THREE.Vector3().fromArray(
    reflectRef.current.positions,
    randomIndex * 3,
  );
  sparkle.position.copy(position);
  sparkle.opacity = 1;
  sparkle.velocity.set(
    (Math.random() - 0.5) * SPARKLE_SPEED,
    (Math.random() - 0.5) * SPARKLE_SPEED,
    (Math.random() - 0.5) * SPARKLE_SPEED,
  );
}
