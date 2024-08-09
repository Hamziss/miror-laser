import { invalidate } from "@react-three/fiber";
import {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import * as THREE from "three";

function createEvent(api, hit, intersect, intersects) {
  return {
    api,
    object: intersect.object,
    position: intersect.point,
    direction: intersect.direction,
    reflect: intersect.reflect,
    normal: intersect.face ? intersect.face.normal : null,
    intersect,
    intersects,
    stopPropagation: () => (hit.stopped = true),
  };
}

export const Reflect = forwardRef(
  (
    {
      children,
      onUpdate,
      start: _start = [0, 0, 0],
      end: _end = [0, 0, 0],
      bounce = 10,
      far = 100,
      ...props
    },
    fRef,
  ) => {
    bounce = (bounce || 1) + 1;

    const scene = useRef();
    const vStart = new THREE.Vector3();
    const vEnd = new THREE.Vector3();
    const vDir = new THREE.Vector3();
    const vPos = new THREE.Vector3();

    let intersect = null;
    let intersects = [];

    const api = useMemo(
      () => ({
        number: 0,
        objects: [],
        hits: new Map(),
        uniqueHits: new Set(),
        start: new THREE.Vector3(),
        end: new THREE.Vector3(),
        raycaster: new THREE.Raycaster(),
        positions: new Float32Array(
          Array.from({ length: (bounce + 10) * 3 }, () => 0),
        ),
        setRay: (_start = [0, 0, 0], _end = [0, 0, 0]) => {
          api.start.set(..._start);
          api.end.set(..._end);
        },
        update: () => {
          api.number = 0;
          intersects = [];
          const newUniqueHits = new Set();

          vStart.copy(api.start);
          vEnd.copy(api.end);
          vDir.subVectors(vEnd, vStart).normalize();
          vStart.toArray(api.positions, api.number++ * 3);

          let rayEnded = false;

          // Run a full cycle until bounces run out or the ray points into nothing
          while (true) {
            api.raycaster.set(vStart, vDir);
            intersect = api.raycaster.intersectObjects(api.objects, false)[0];

            if (api.number < bounce && intersect) {
              intersects.push(intersect);
              intersect.direction = vDir.clone();

              newUniqueHits.add(intersect.object.uuid);

              intersect.point.toArray(api.positions, api.number++ * 3);

              if (intersect.object.noReflect) {
                // If the object doesn't reflect, end the ray here
                rayEnded = true;
                break;
              } else if (intersect.face) {
                vDir.reflect(
                  intersect.object
                    .localToWorld(intersect.face.normal)
                    .sub(intersect.object.getWorldPosition(vPos))
                    .normalize(),
                );
                intersect.reflect = vDir.clone();
                vStart.copy(intersect.point);
              } else {
                // If there's no face (e.g., for non-mesh objects), end the ray
                rayEnded = true;
                break;
              }
            } else {
              break;
            }
          }

          if (!rayEnded) {
            // If the ray didn't end on an object, extend it to the far distance
            vEnd
              .addVectors(vStart, vDir.multiplyScalar(far))
              .toArray(api.positions, api.number++ * 3);
          }

          // Reset and count up once again
          api.number = 1;

          // Check onRayOut
          api.hits.forEach((hit, key) => {
            if (!newUniqueHits.has(key)) {
              api.hits.delete(key);
              if (hit.intersect.object.onRayOut) {
                invalidate();
                hit.intersect.object.onRayOut(
                  createEvent(api, hit, hit.intersect, intersects),
                );
              }
            }
          });

          // Check onRayOver and onRayMove
          for (intersect of intersects) {
            api.number++;

            if (!api.hits.has(intersect.object.uuid)) {
              const hit = {
                key: intersect.object.uuid,
                intersect,
                stopped: false,
              };
              api.hits.set(intersect.object.uuid, hit);

              if (intersect.object.onRayOver) {
                invalidate();
                intersect.object.onRayOver(
                  createEvent(api, hit, intersect, intersects),
                );
              }
            }

            const hit = api.hits.get(intersect.object.uuid);

            if (intersect.object.onRayMove) {
              invalidate();
              intersect.object.onRayMove(
                createEvent(api, hit, intersect, intersects),
              );
            }

            if (hit.stopped || intersect.object.noReflect) break;

            if (intersect === intersects[intersects.length - 1]) api.number++;
          }

          // Update uniqueHits with the new set
          api.uniqueHits = newUniqueHits;

          return Math.max(2, api.number);
        },
      }),
      [bounce, far],
    );

    useLayoutEffect(() => void api.setRay(_start, _end), [..._start, ..._end]);
    useImperativeHandle(fRef, () => api, [api]);

    useLayoutEffect(() => {
      api.objects = [];
      scene.current.traverse((object) => {
        if (object.onRayOver || object.onRayOut || object.onRayMove) {
          api.objects.push(object);
        }
      });
      scene.current.updateWorldMatrix(true, true);
    });

    return (
      <group ref={scene} {...props}>
        {children}
      </group>
    );
  },
);

Reflect.displayName = "Reflect";
export default Reflect;
