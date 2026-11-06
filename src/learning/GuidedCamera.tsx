import { useFrame, useThree } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import type { CameraGuide } from "./types";
const poses: Record<
  string,
  { angle: number; elevation: number; scale: number; target: number[] }
> = {
  overview: { angle: 0.12, elevation: 0.025, scale: 1.04, target: [0, 0.3, 0] },
  detail: { angle: 0.28, elevation: 0.1, scale: 0.78, target: [0, 0.45, 0] },
  section: { angle: -0.2, elevation: 0.045, scale: 1.02, target: [0, 0.3, 0] },
  deep: { angle: 0.13, elevation: 0.04, scale: 0.87, target: [0.3, -0.25, 0] },
  superficial: {
    angle: -0.23,
    elevation: 0.06,
    scale: 0.9,
    target: [-0.4, -0.2, 0],
  },
  outflow: { angle: -0.3, elevation: 0.08, scale: 0.92, target: [0.3, 0.5, 0] },
};
export default function GuidedCamera({
  guide,
  mode,
  controls,
}: {
  guide: React.RefObject<CameraGuide>;
  mode: string;
  controls: React.RefObject<any>;
}) {
  const { size, camera } = useThree(),
    vectors = useMemo(
      () => ({
        from: new THREE.Vector3(),
        to: new THREE.Vector3(),
        target: new THREE.Vector3(),
        targetB: new THREE.Vector3(),
      }),
      [],
    );
  useFrame(() => {
    if (!guide.current.enabled || !(camera instanceof THREE.PerspectiveCamera))
      return;
    const g = guide.current,
      a = poses[g.from] ?? poses.overview,
      b = poses[g.to] ?? poses.overview;
    const width = mode === "valve" ? 3.2 : mode === "anatomy" ? 4 : 5.7,
      height = mode === "valve" ? 6.6 : mode === "anatomy" ? 7.5 : 5.4;
    const tangent = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)),
      distance =
        Math.max(
          height / (2 * tangent),
          width / ((2 * tangent * size.width) / Math.max(1, size.height)),
        ) + 0.2;
    const place = (p: typeof a, v: THREE.Vector3) =>
      v.set(
        Math.sin(p.angle) * distance * p.scale,
        distance * p.elevation,
        Math.cos(p.angle) * distance * p.scale,
      );
    const x = Math.max(0, Math.min(1, g.progress / 0.2)),
      ease = x * x * (3 - 2 * x);
    place(a, vectors.from);
    place(b, vectors.to);
    camera.position.copy(vectors.from.lerp(vectors.to, ease));
    vectors.target
      .fromArray(a.target)
      .lerp(vectors.targetB.fromArray(b.target), ease);
    camera.lookAt(vectors.target);
    if (controls.current) {
      controls.current.target.copy(vectors.target);
      controls.current.update();
    }
  });
  return null;
}
