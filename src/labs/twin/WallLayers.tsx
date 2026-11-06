import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { valveWallGeometry } from "../../learning/geometry";
export default function WallLayers({ large }: { large: boolean }) {
  const layers = useMemo(
    () =>
      large
        ? [
            { geometry: valveWallGeometry(0.24, 0.255), color: "#e7b6ad" },
            { geometry: valveWallGeometry(0.255, 0.276), color: "#bc7e7f" },
            { geometry: valveWallGeometry(0.276, 0.293), color: "#ddc3b6" },
          ]
        : [{ geometry: valveWallGeometry(0.24, 0.268), color: "#b8cbd6" }],
    [large],
  );
  useEffect(() => () => layers.forEach((l) => l.geometry.dispose()), [layers]);
  return (
    <group>
      {layers.map((l, i) => (
        <mesh key={i} geometry={l.geometry}>
          <meshStandardMaterial
            color={l.color}
            side={THREE.DoubleSide}
            roughness={0.62}
            metalness={0.01}
            transparent={!large}
            opacity={large ? 1 : 0.25}
            depthWrite={large}
          />
        </mesh>
      ))}
    </group>
  );
}
