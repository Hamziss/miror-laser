import * as THREE from "three";
export function setupTextures(textures, repeat = false) {

  textures.forEach((texture) => {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

    if (repeat) {
      texture.repeat.set(1, 1);
    }
  }
  )
}

export function calculateIntersectionPoint(x, y, size, camera) {
  const ndcX = (x / size.width) * 2 - 1;
  const ndcY = -(y / size.height) * 2 + 1;
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera);
  const planeNormal = new THREE.Vector3(0, 0, 1);
  const intersectionPoint = new THREE.Vector3();
  raycaster.ray.intersectPlane(
    new THREE.Plane(planeNormal, 0),
    intersectionPoint,
  );
  return intersectionPoint;
}
