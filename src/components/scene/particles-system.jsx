// components/ParticleSystem.js
import { useGameStore } from "@/store/useGameStore";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const PARTICLE_COUNT = 100;

export default function ParticleSystem() {
  const { sourcePosition } = useGameStore();
  const particleSystemRef = useRef();
  const particles = useMemo(() => createParticles(), []);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    updateParticles(particleSystemRef, particles, dummy, sourcePosition);
  });

  return (
    <instancedMesh ref={particleSystemRef} args={[null, null, PARTICLE_COUNT]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshPhongMaterial
        color={[(255 / 255) * 9, (96 / 255) * 9, (1 / 255) * 9]}
        emissive={[(255 / 255) * 4.5, (96 / 255) * 4.5, (1 / 255) * 4.5]}
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        shininess={1}
      />
    </instancedMesh>
  );
}

function createParticles() {
  return Array.from({ length: PARTICLE_COUNT }, () => ({
    t: Math.random() * 100,
    factor: 20 + Math.random() * 100,
    speed: 0.00000001 + Math.random() / 2000,
    radialDistance: Math.random() * 1,
    theta: Math.random() * Math.PI * 2,
    phi: Math.random() * Math.PI,
    mx: 0,
    my: 0,
    mz: 0,
  }));
}

function updateParticles(particleSystemRef, particles, dummy, sourcePosition) {
  particles.forEach((particle, i) => {
    let { t, factor, speed, radialDistance, theta, phi } = particle;
    t = particle.t += speed / 2;

    const x = Math.sin(phi) * Math.cos(theta) * radialDistance;
    const y = Math.cos(phi) * radialDistance;
    const z = Math.sin(phi) * Math.sin(theta) * radialDistance;

    particle.mx += (sourcePosition[0] - particle.mx) * 1;
    particle.my += (sourcePosition[1] - particle.my) * 1;
    particle.mz += (sourcePosition[2] - particle.mz) * 1;

    dummy.position.set(
      particle.mx + x + Math.sin(t * factor) * 0.1,
      particle.my + y + Math.cos(t * factor) * 0.1,
      particle.mz + z + Math.sin(t * factor) * 0.1,
    );

    const scale = (Math.cos(t) * 0.3 + 0.7) * 0.009;
    dummy.scale.set(scale, scale, scale);
    dummy.rotation.set(t * 0.5, t * 0.3, t * 0.2);
    dummy.updateMatrix();
    particleSystemRef.current.setMatrixAt(i, dummy.matrix);
  });

  particleSystemRef.current.instanceMatrix.needsUpdate = true;
}
