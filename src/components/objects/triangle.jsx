import { useState } from "react";

export default function Triangle(props) {
  const [hovered, hover] = useState(false);
  return (
    <mesh
      {...props}
      onRayOver={(e) => hover(true)}
      onRayOut={(e) => hover(false)}
      onRayMove={(e) => null /*console.log(e.direction)*/}
    >
      <cylinderGeometry args={[1, 1, 1, 3, 1]} />
      <meshBasicMaterial color={hovered ? [2, 2, 2] : "gray"} />
    </mesh>
  );
}
