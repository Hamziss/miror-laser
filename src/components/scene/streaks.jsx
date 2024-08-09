// components/Streaks.js
import { setupTextures } from "@/lib/helpers";
import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function Streaks({ reflectRef }) {
  const [streakTexture] = useTexture(["/textures/electric.png"]);
  setupTextures([streakTexture], true);
  const streaksRef = useRef();
  const obj = new THREE.Object3D();

  useFrame(() => {
    const range = reflectRef.current.update();
    updateStreaks(streaksRef, reflectRef, range, obj);
    streakTexture.offset.x -= 0.0021;
  });

  return (
    <instancedMesh
      ref={streaksRef}
      args={[null, null, 100]}
      instanceMatrix-usage={THREE.DynamicDrawUsage}
    >
      <planeGeometry args={[1, 0.2]} />
      <meshBasicMaterial
        color="orange"
        map={streakTexture}
        transparent
        opacity={3}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  );
}

function updateStreaks(streaksRef, reflectRef, range, obj) {
  const f = new THREE.Vector3();
  const t = new THREE.Vector3();
  const n = new THREE.Vector3();

  for (let i = 0; i < range - 1; i++) {
    f.fromArray(reflectRef.current.positions, i * 3);
    t.fromArray(reflectRef.current.positions, i * 3 + 3);
    n.subVectors(t, f).normalize();
    obj.position.addVectors(f, t).divideScalar(2);
    obj.scale.set(t.distanceTo(f) * 1, 1.2, 1);
    obj.rotation.set(0, 0, Math.atan2(n.y, n.x));
    obj.updateMatrix();
    streaksRef.current.setMatrixAt(i, obj.matrix);
  }

  streaksRef.current.count = range - 1;

  streaksRef.current.instanceMatrix.updateRange.count = (range - 1) * 16;
  streaksRef.current.instanceMatrix.needsUpdate = true;
}
