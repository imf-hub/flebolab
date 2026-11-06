import { useLayoutEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

/** Fit the schematic to the actual pane, including split comparison panes. */
export default function FitCamera({
  mode,
  controls,
}: {
  mode: string;
  controls: React.RefObject<any>;
}) {
  const { camera, size } = useThree();
  useLayoutEffect(() => {
    if (
      !(camera instanceof THREE.PerspectiveCamera) ||
      size.width < 1 ||
      size.height < 1
    )
      return;
    const width = mode === "valve" ? 3.1 : mode === "anatomy" ? 4 : 5.7;
    const height = mode === "valve" ? 6 : mode === "anatomy" ? 7.5 : 5.4;
    const tangent = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const distance =
      Math.max(
        height / (2 * tangent),
        width / ((2 * tangent * size.width) / size.height),
      ) + 0.15;
    const angle = mode === "valve" ? 0.3 : mode === "anatomy" ? 0 : 0.13;
    camera.position.set(
      Math.sin(angle) * distance,
      0.3,
      Math.cos(angle) * distance,
    );
    camera.lookAt(0, 0.3, 0);
    camera.updateProjectionMatrix();
    const fit = () => {
      if (controls.current) {
        controls.current.target.set(0, 0.3, 0);
        controls.current.update();
        controls.current.saveState();
      }
    };
    fit();
    const pending = requestAnimationFrame(fit);
    return () => cancelAnimationFrame(pending);
  }, [camera, size.width, size.height, mode, controls]);
  return null;
}
