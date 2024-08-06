import { OrbitControls, PerspectiveCamera, Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useEffect, useState } from "react";
import { CameraPositionLogger } from "../../components/camera-logger";
import { level1 } from "../../game/levels/1";

import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Scene from "../../Scene";
import Mirror from "../../game/objects/mirror";
import Triangle from "../../game/objects/triangle";

const objectComponents = {
  Mirror,
  Triangle,
  // Add other components here as needed
};

export default function GamePage() {
  const { id } = useParams();
  const [levelData, setLevelData] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0, z: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [editingObjectId, setEditingObjectId] = useState(false);

  useEffect(() => {
    const loadLevelData = async () => {
      // const data = await fetchLevelData(id);
      setLevelData(level1);
    };
    loadLevelData();
  }, [id]);

  if (!levelData) {
    return <div>Loading...</div>;
  }

  const sceneObjects = levelData.objects.map((obj, index) => {
    const Component = objectComponents[obj.type];
    return (
      <Component
        key={`${obj.type}-${index}`}
        {...obj.props}
        setIsDragging={setIsDragging}
        isEditing={editingObjectId === `${obj.type}-${index}`}
        onStartEditing={() =>
          setEditingObjectId((prev) =>
            prev === `${obj.type}-${index}` ? false : `${obj.type}-${index}`,
          )
        }
      />
    );
  });

  return (
    <>
      <Link
        to="/"
        className="fixed left-3 top-3 z-50 cursor-pointer"
        unstable_viewTransition
      >
        <Button size="icon" className="h-16 w-16 bg-gray-800">
          <Home />
        </Button>
      </Link>
      <Canvas
        orthographic
        camera={{ zoom: 100 }}
        style={{ width: "100vw", height: "100vh" }}
      >
        <color attach="background" args={["#010000"]} />
        <PerspectiveCamera makeDefault position={[7.35, 2.25, 9.83]} />
        <Scene setIsDragging={setIsDragging}>{sceneObjects}</Scene>
        <Stars
          speed={1.5} // Speed of the star field
          radius={150} // Radius of the inner sphere containing stars
          depth={50} // Depth of the area where stars can be placed
          count={3000} // Number of stars
          factor={3} // Size factor for the stars
          saturation={5} // Saturation of the stars
          fade={true} // Whether the stars should fade as they get farther away
        />
        <EffectComposer>
          <Bloom
            mipmapBlur
            luminanceThreshold={2}
            luminanceSmoothing={0.0}
            intensity={1.4}
          />
        </EffectComposer>
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={!isDragging && !editingObjectId}
        />
        <CameraPositionLogger setPosition={setPosition} />
      </Canvas>{" "}
      {/* <PositionDisplay position={position} /> */}
    </>
  );
}