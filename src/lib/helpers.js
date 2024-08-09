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