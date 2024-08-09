// components/Source.js

import { useFrame } from "@react-three/fiber";

export default function Source({
  sourceRef,
  sourcePosition,
  bind,
  lavaTexture,
}) {
  useFrame(() => {
    lavaTexture.offset.x -= 0.00031;
    lavaTexture.offset.y += 0.00011;
  });
  return (
    <mesh
      ref={sourceRef}
      {...(bind ? bind() : {})}
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
