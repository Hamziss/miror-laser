import { calculateIntersectionPoint } from "@/lib/helpers";
import { useGameStore } from "@/store/useGameStore";
import { Sphere, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useDrag } from "@use-gesture/react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const ExplodingGlobe = ({
  // position = [0, 0, 0],
  radius = 1,
  // bind,
  // explodingGlobeRef,
  // onIntersection,
}) => {
  const explodingGlobeRef = useRef();
  const { setIsDragging, globePosition, setGlobePosition } = useGameStore();
  const { size, viewport, camera } = useThree();
  const [
    baseColor,
    normalMap,
    tilesHeightMap,
    roughnessMap,
    tilesACMap,
    emissiveMap,
  ] = useTexture([
    "/textures/lava2/ground_0027_color_1k.jpg",
    "/textures/lava2/ground_0027_normal_opengl_1k.png",
    "/textures/lava2/ground_0027_height_1k.png",
    "/textures/lava2/ground_0027_roughness_1k.jpg",
    "/textures/lava2/ground_0027_ao_1k.jpg",
    "/textures/lava2/ground_0027_emissive_1k.jpg",
  ]);

  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();
  const [exploded, setExploded] = useState(false);
  const fragmentsRef = useRef([]);
  const explosionTimeoutRef = useRef(null);

  const sphereGeometry = useMemo(
    () => new THREE.SphereGeometry(radius, 32, 32),
    [radius],
  );

  const glowColor = new THREE.Color(
    242 / 255,
    66 / 255,
    26 / 255,
  ).multiplyScalar(10);
  const normalColor = new THREE.Color(0x2194ce);

  const createFragments = () => {
    const geometry = new THREE.IcosahedronGeometry(radius, 1);
    const material = new THREE.MeshPhongMaterial({
      map: baseColor,
      normalMap: normalMap,
      displacementMap: tilesHeightMap,
      roughnessMap: roughnessMap,
      aoMap: tilesACMap,
      emissiveMap: emissiveMap,
      specular: 0x111111,
      emissive: glowColor,
      emissiveIntensity: 1,
      displacementScale: 0.8,
    });

    const positionAttribute = geometry.getAttribute("position");

    for (let i = 0; i < positionAttribute.count; i++) {
      const fragment = new THREE.Mesh(geometry.clone(), material.clone());
      const position = new THREE.Vector3();
      position.fromBufferAttribute(positionAttribute, i);
      fragment.position.copy(position.multiplyScalar(0.1));
      fragment.velocity = new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5,
      );
      fragmentsRef.current.push(fragment);
    }
  };

  useEffect(() => {
    if (hovered && !exploded) {
      explosionTimeoutRef.current = setTimeout(() => {
        setExploded(true);
        createFragments();
      }, 500); // Delay of 500ms before exploding
    } else {
      clearTimeout(explosionTimeoutRef.current);
    }

    return () => clearTimeout(explosionTimeoutRef.current);
  }, [hovered, exploded]);

  useFrame(() => {
    if (exploded) {
      fragmentsRef.current.forEach((fragment) => {
        fragment.position.add(fragment.velocity);
        fragment.rotation.x += 0.01;
        fragment.rotation.y += 0.02;
      });
    } else if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  const handleRayIntersection = (ray) => {
    if (exploded) return null;

    const intersection = new THREE.Vector3();
    const intersectionPoint = ray.intersectSphere(
      new THREE.Sphere(new THREE.Vector3(...globePosition), radius),
      intersection,
    );

    if (intersectionPoint) {
      // if (onIntersection) {
      //   onIntersection(intersection, null); // Pass null for reflectedDirection
      // }

      return { point: intersection, direction: null, noReflect: false };
    }

    return null;
  };
  const ExplodingGlobeBind = useDrag(
    ({ xy: [x, y], first, last }) => {
      if (first) setIsDragging(true);
      if (last) setIsDragging(false);
      const intersectionPoint = calculateIntersectionPoint(x, y, size, camera);
      setGlobePosition([intersectionPoint.x, intersectionPoint.y, 0]);
    },
    { pointerEvents: true },
  );

  return (
    <group
      position={globePosition}
      ref={explodingGlobeRef}
      {...(ExplodingGlobeBind ? ExplodingGlobeBind() : {})}
    >
      {!exploded ? (
        <Sphere
          ref={meshRef}
          onRayOver={(e) => setHovered(true)}
          onRayOut={(e) => setHovered(false)}
          noReflect
          args={[radius, 32, 32]}
          onPointerOver={(e) => {
            e.stopPropagation();
            const intersection = handleRayIntersection(e.ray);
            if (intersection) {
              e.intersections.push({
                distance: intersection.point.distanceTo(e.ray.origin),
                point: intersection.point,
                object: meshRef.current,
                noReflect: false,
              });
            }
          }}
        >
          <meshStandardMaterial
            displacementScale={0.5}
            args={[2, 2, 512, 512]}
            map={baseColor}
            normalMap={normalMap}
            displacementMap={tilesHeightMap}
            roughnessMap={roughnessMap}
            aoMap={tilesACMap}
            emissiveMap={emissiveMap}
            emissive={"white"}
            emissiveIntensity={hovered ? 8 : 2}
            // color={hovered ? glowColor : normalColor}
            // shininess={2}
            // specular={0x111111}
            // emissive={hovered ? glowColor : normalColor}
            // emissiveIntensity={hovered ? 0.39 : 0}
          />
        </Sphere>
      ) : (
        fragmentsRef.current.map((fragment, index) => (
          <primitive key={index} object={fragment} />
        ))
      )}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
    </group>
  );
};

export default ExplodingGlobe;
