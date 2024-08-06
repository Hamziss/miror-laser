import { useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useDrag } from "@use-gesture/react";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import Reflect from "./components/Reflect";

export default function Scene({ children, setIsDragging }) {
  const streaks = useRef();
  const glow = useRef();
  const reflect = useRef();
  const sourceRef = useRef();
  const [streakTexture, glowTexture] = useTexture([
    "/textures/electric.png",
    "/textures/lensflare0_bw.jpg",
  ]);
  const [cloudTexture, lavaTexture] = useTexture([
    "/textures/cloud.png",
    "/textures/lavatile.jpg",
  ]);
  cloudTexture.wrapS = cloudTexture.wrapT = THREE.RepeatWrapping;
  lavaTexture.wrapS = lavaTexture.wrapT = THREE.RepeatWrapping;

  streakTexture.wrapS = streakTexture.wrapT = THREE.RepeatWrapping;
  streakTexture.repeat.set(1, 1); // Adjust these values to control the RepeatWrapping

  const obj = new THREE.Object3D();
  const f = new THREE.Vector3();
  const t = new THREE.Vector3();
  const n = new THREE.Vector3();

  let i = 0;
  let range = 0;

  const [sourcePosition, setSourcePosition] = useState([0, 0, 0]);
  const fixedDirection = useMemo(() => new THREE.Vector3(0, -1, 0), []); // Fixed downward direction

  const { camera, size, viewport } = useThree();
  const aspect = size.width / viewport.width;

  const planeNormal = new THREE.Vector3(0, 0, 1);
  const planeTouchPoint = new THREE.Vector3(0, 0, 0);
  const raycaster = new THREE.Raycaster();

  const bind = useDrag(
    ({ xy: [x, y], first, last }) => {
      if (first) setIsDragging(true);
      if (last) setIsDragging(false);
      // Convert screen coordinates to normalized device coordinates
      const ndcX = (x / size.width) * 2 - 1;
      const ndcY = -(y / size.height) * 2 + 1;

      // Set up raycaster
      raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera);

      // Calculate the intersection point with the z=0 plane
      const intersectionPoint = new THREE.Vector3();
      raycaster.ray.intersectPlane(
        new THREE.Plane(planeNormal, 0),
        intersectionPoint,
      );

      // Update source position
      setSourcePosition([intersectionPoint.x, intersectionPoint.y, 0]);
    },
    { pointerEvents: true },
  );
  const particleCount = 100;
  const particleSystem = useRef();
  const [particleTexture] = useTexture(["/textures/lavatile.jpg"]); // You'll need to add this texture

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < particleCount; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.00000001 + Math.random() / 2000;
      const radialDistance = Math.random() * 1; // Distance from the center
      const theta = Math.random() * Math.PI * 2; // Angle around the circle
      const phi = Math.random() * Math.PI; // Angle from top to bottom
      temp.push({
        t,
        factor,
        speed,
        radialDistance,
        theta,
        phi,
        mx: 0,
        my: 0,
        mz: 0,
      });
    }
    return temp;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    const [startX, startY] = sourcePosition;
    // Calculate the end position by adding the fixed direction to the start position
    const endX = startX + fixedDirection.x * 5;
    const endY = startY + fixedDirection.y * 5;

    reflect.current.setRay([startX, startY, 0], [endX, endY, 0]);
    range = reflect.current.update();

    // Update the position of the source indicator
    if (sourceRef.current) {
      sourceRef.current.position.set(startX, startY, 0);
    }

    // The rest of the useFrame function remains the same
    for (i = 0; i < range - 1; i++) {
      f.fromArray(reflect.current.positions, i * 3);
      t.fromArray(reflect.current.positions, i * 3 + 3);
      n.subVectors(t, f).normalize();
      obj.position.addVectors(f, t).divideScalar(2);
      obj.scale.set(t.distanceTo(f) * 1, 1.2, 1);
      obj.rotation.set(0, 0, Math.atan2(n.y, n.x));
      obj.updateMatrix();
      streaks.current.setMatrixAt(i, obj.matrix);
    }

    streaks.current.count = range - 1;
    streaks.current.instanceMatrix.updateRange.count = (range - 1) * 16;
    streaks.current.instanceMatrix.needsUpdate = true;

    obj.scale.setScalar(0);
    obj.updateMatrix();
    glow.current.setMatrixAt(0, obj.matrix);

    for (i = 1; i < range; i++) {
      obj.position.fromArray(reflect.current.positions, i * 3);
      obj.scale.setScalar(1.5);
      obj.rotation.set(0, 0, state.clock.elapsedTime / 10);
      obj.updateMatrix();
      glow.current.setMatrixAt(i, obj.matrix);
    }
    particles.forEach((particle, i) => {
      let { t, factor, speed, radialDistance, theta, phi } = particle;
      t = particle.t += speed / 2;

      // Update particle position relative to the sun
      const x = Math.sin(phi) * Math.cos(theta) * radialDistance;
      const y = Math.cos(phi) * radialDistance;
      const z = Math.sin(phi) * Math.sin(theta) * radialDistance;

      // Smoothly move particles towards the sun's position
      particle.mx += (sourcePosition[0] - particle.mx) * 1;
      particle.my += (sourcePosition[1] - particle.my) * 1;
      particle.mz += (sourcePosition[2] - particle.mz) * 1;

      dummy.position.set(
        particle.mx + x + Math.sin(t * factor) * 0.1,
        particle.my + y + Math.cos(t * factor) * 0.1,
        particle.mz + z + Math.sin(t * factor) * 0.1,
      );

      const scale = (Math.cos(t) * 0.3 + 0.7) * 0.009; // Adjust the scale value here (0.02) to reduce the size
      dummy.scale.set(scale, scale, scale);
      dummy.rotation.set(t * 0.5, t * 0.3, t * 0.2); // Add some rotation for more dynamism
      dummy.updateMatrix();
      particleSystem.current.setMatrixAt(i, dummy.matrix);
    });

    particleSystem.current.instanceMatrix.needsUpdate = true;
    glow.current.count = range;
    glow.current.instanceMatrix.updateRange.count = range * 16;
    glow.current.instanceMatrix.needsUpdate = true;

    // Animate the streak texture to create a fluid or laser-like effect
    streakTexture.offset.x -= 0.0021; // Adjust the speed and direction as needed
    lavaTexture.offset.x -= 0.00031; // Adjust the speed and direction as needed
    lavaTexture.offset.y += 0.00021; // Adjust the speed and direction as needed
  });

  return (
    <>
      <Reflect
        ref={reflect}
        far={1000}
        bounce={100}
        start={[10, 5, 0]}
        end={[0, 0, 0]}
      >
        {children}
      </Reflect>
      <instancedMesh
        ref={streaks}
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
      <instancedMesh
        ref={glow}
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
      {/* Draggable source indicator */}
      <mesh ref={sourceRef} {...bind()} scale={4}>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshBasicMaterial
          map={lavaTexture}
          color={[(255 / 255) * 9, (96 / 255) * 9, (1 / 255) * 9]}
        />
      </mesh>
      {/* 3D Particle system for the sun */}
      <instancedMesh ref={particleSystem} args={[null, null, particleCount]}>
        <sphereGeometry args={[1, 8, 8]} />{" "}
        {/* Use low-poly spheres for better performance */}
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
    </>
  );
}
