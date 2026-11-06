import { valveAperture, leafletPoint } from "./valveVisual";
import {
  Suspense,
  useMemo,
  useRef,
  useEffect,
  useLayoutEffect,
  useId,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { theme } from "../../shared/theme";
import * as THREE from "three";
import type { Solution } from "./model";
import { integratedFlow, phaseAt, sampleAt, type FlowKey } from "./transport";
import type { Focus } from "./scenarioConfig";
import ReferenceAnatomy from "./ReferenceAnatomy";
import FitCamera from "./FitCamera";
export type CameraPose = {
  owner: string;
  position: [number, number, number];
  target: [number, number, number];
};
const colors = {
  deep: theme.deep,
  superficial: theme.superficial,
  perforator: theme.perforator,
  collateral: theme.collateral,
};
const curve = (points: number[][]) =>
  new THREE.CatmullRomCurve3(
    points.map((p) => new THREE.Vector3(p[0], p[1], p[2])),
  );
const paths: Record<FlowKey, THREE.CatmullRomCurve3> = {
  flow: curve([
    [0.45, -1.3, 0],
    [0.45, -0.5, 0],
    [0.45, 0.2, 0],
    [0.45, 1, 0],
  ]),
  superficialFlow: curve([
    [-0.75, -1.3, 0.12],
    [-0.75, -0.4, 0.12],
    [-0.75, 0.3, 0.12],
    [-0.75, 1, 0.12],
  ]),
  perforator: curve([
    [-0.75, -1.25, 0.12],
    [-0.3, -1.15, 0.3],
    [0.45, -1.1, 0],
  ]),
  deepOut: curve([
    [0.45, 1, 0],
    [0.45, 1.9, 0],
    [0.15, 2.5, 0],
    [0, 2.6, 0],
  ]),
  superficialOut: curve([
    [-0.75, 1, 0.12],
    [-0.75, 1.9, 0.12],
    [-0.35, 2.5, 0.05],
    [0, 2.6, 0],
  ]),
  collateral: curve([
    [0.45, -1.3, 0],
    [1.5, -0.7, -0.1],
    [1.5, 1.3, -0.1],
    [0.7, 2.5, 0],
    [0, 2.6, 0],
  ]),
};
const largePath = curve([
  [0, -2, 0],
  [0, -0.5, 0],
  [0, 1, 0],
  [0, 2.5, 0],
]);
function Tube({
  path,
  color,
  highlight = false,
}: {
  path: THREE.CatmullRomCurve3;
  color: string;
  highlight?: boolean;
}) {
  const geometry = useMemo(
    () => new THREE.TubeGeometry(path, 48, 0.07, 10, false),
    [path],
  );
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <mesh geometry={geometry}>
      <meshPhysicalMaterial
        color={color}
        metalness={0.2}
        roughness={0.24}
        transparent
        opacity={highlight ? 0.52 : 0.23}
        emissive={color}
        emissiveIntensity={highlight ? 0.4 : 0.1}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
function Transport({
  solution,
  timeRef,
  branch,
  color,
  count = 16,
  path = paths[branch],
}: {
  solution: Solution;
  timeRef: React.RefObject<number>;
  branch: FlowKey;
  color: string;
  count?: number;
  path?: THREE.CatmullRomCurve3;
}) {
  const mesh = useRef<THREE.InstancedMesh>(null),
    material = useRef<THREE.MeshBasicMaterial>(null);
  const arrow = useRef<THREE.Mesh>(null);
  const tangent = useMemo(() => new THREE.Vector3(), []);
  const up = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  const phases = useMemo(
    () => integratedFlow(solution.samples, branch),
    [solution, branch],
  );
  const helper = useMemo(() => new THREE.Object3D(), []);
  useFrame(() => {
    if (!mesh.current) return;
    const t = timeRef.current,
      q = sampleAt(solution, t)[branch],
      phase = phaseAt(solution.samples, phases, t);
    for (let i = 0; i < count; i++) {
      path.getPoint((((phase + i / count) % 1) + 1) % 1, helper.position);
      helper.scale.setScalar(0.8 + Math.min(1, Math.abs(q)) * 0.35);
      helper.updateMatrix();
      mesh.current.setMatrixAt(i, helper.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
    material.current?.color.set(q < -0.00001 ? theme.reverse : color);
    if (arrow.current) {
      const at = ((phase % 1) + 1) % 1;
      path.getPoint(at, arrow.current.position);
      path.getTangent(at, tangent).multiplyScalar(q < 0 ? -1 : 1);
      arrow.current.quaternion.setFromUnitVectors(up, tangent.normalize());
      arrow.current.visible = Math.abs(q) > 1e-5;
      (arrow.current.material as THREE.MeshBasicMaterial).color.set(
        q < 0 ? theme.reverse : color,
      );
    }
  });
  return (
    <group>
      <instancedMesh
        ref={mesh}
        args={[undefined, undefined, count]}
        frustumCulled={false}
      >
        <sphereGeometry args={[0.032, 8, 8]} />
        <meshBasicMaterial ref={material} color={color} toneMapped={false} />
      </instancedMesh>
      <mesh ref={arrow}>
        <coneGeometry args={[0.075, 0.2, 12]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}
function Chamber({
  solution,
  timeRef,
  position,
  volumeKey,
  reference,
  color,
}: {
  solution: Solution;
  timeRef: React.RefObject<number>;
  position: [number, number, number];
  volumeKey:
    | "volume"
    | "superficialVolume"
    | "proximalDeepVolume"
    | "proximalSuperficialVolume";
  reference: number;
  color: string;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (mesh.current) {
      const radius = Math.sqrt(
        Math.max(0.1, sampleAt(solution, timeRef.current)[volumeKey]) /
          reference,
      );
      mesh.current.scale.set(0.145 * radius, 0.66, 0.145 * radius);
    }
  });
  return (
    <group position={position}>
      <mesh ref={mesh} scale={[0.145, 0.66, 0.145]}>
        <cylinderGeometry args={[1, 1, 2, 32, 1, true]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.38}
          roughness={0.18}
          clearcoat={1}
          transparent
          opacity={0.28}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      {[-0.66, 0.66].map((y) => (
        <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.145, 0.009, 6, 32]} />
          <meshBasicMaterial color={color} />
        </mesh>
      ))}
    </group>
  );
}
function Leaflet({
  solution,
  timeRef,
  branch,
  side,
}: {
  solution: Solution;
  timeRef: React.RefObject<number>;
  branch: "flow" | "superficialFlow";
  side: 1 | -1;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => {
    const positions: number[] = [],
      opened: number[] = [],
      indices: number[] = [];
    const uCount = 32,
      vCount = 14;
    for (let u = 0; u <= uCount; u++)
      for (let v = 0; v <= vCount; v++) {
        const angle = -Math.PI / 2 + (Math.PI * u) / uCount;
        positions.push(...leafletPoint(side, angle, v / vCount, 0));
        opened.push(...leafletPoint(side, angle, v / vCount, 0.85));
        if (u < uCount && v < vCount) {
          const a = u * (vCount + 1) + v,
            b = a + vCount + 1;
          indices.push(a, b, a + 1, b, b + 1, a + 1);
        }
      }
    const result = new THREE.BufferGeometry();
    result.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );
    result.setIndex(indices);
    result.computeVertexNormals();
    const target = new THREE.BufferGeometry();
    target.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(opened, 3),
    );
    target.setIndex(indices);
    target.computeVertexNormals();
    result.morphAttributes.position = [target.getAttribute("position")];
    result.morphAttributes.normal = [target.getAttribute("normal")];
    target.dispose();
    return result;
  }, [side]);
  useLayoutEffect(() => {
    mesh.current?.updateMorphTargets();
  }, [geometry]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  useFrame(() => {
    if (mesh.current?.morphTargetInfluences)
      mesh.current.morphTargetInfluences[0] =
        valveAperture(
          sampleAt(solution, timeRef.current)[branch],
          solution.parameters.leak,
        ) / 0.85;
  });
  return (
    <mesh ref={mesh} geometry={geometry}>
      <meshPhysicalMaterial
        color="#cb8a95"
        roughness={0.48}
        metalness={0.07}
        clearcoat={0.16}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
function Valve({
  solution,
  timeRef,
  large = false,
  x = 0.45,
  branch = "flow",
}: {
  solution: Solution;
  timeRef: React.RefObject<number>;
  large?: boolean;
  x?: number;
  branch?: "flow" | "superficialFlow";
}) {
  return (
    <group
      position={
        large ? [0, -0.35, 0] : [x, -0.12, branch === "flow" ? 0 : 0.12]
      }
      scale={large ? 4.2 : 0.63}
    >
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry
          args={[0.27, 0.27, 1.25, 48, 1, true, Math.PI / 4, Math.PI * 1.5]}
        />
        <meshPhysicalMaterial
          color="#497891"
          metalness={0.2}
          roughness={0.28}
          transparent
          opacity={0.22}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      {[-0.445, 0.805].map((y) => (
        <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.27, 0.006, 8, 48, Math.PI * 1.5]} />
          <meshBasicMaterial color="#497086" />
        </mesh>
      ))}
      <Leaflet
        solution={solution}
        timeRef={timeRef}
        branch={branch}
        side={-1}
      />
      <Leaflet solution={solution} timeRef={timeRef} branch={branch} side={1} />
    </group>
  );
}
function Muscle({
  solution,
  timeRef,
  focus,
}: {
  solution: Solution;
  timeRef: React.RefObject<number>;
  focus: Focus;
}) {
  const group = useRef<THREE.Group>(null),
    material = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(() => {
    const a =
      sampleAt(solution, timeRef.current).pump * solution.parameters.pump;
    if (group.current)
      group.current.scale.set(
        1 - Math.min(1.6, a) * 0.2,
        1,
        1 - Math.min(1.6, a) * 0.2,
      );
    if (material.current) material.current.emissiveIntensity = 0.1 + a * 0.6;
  });
  return (
    <group position={[0.45, -1.2, 0]} ref={group}>
      <mesh>
        <cylinderGeometry args={[0.34, 0.39, 1.65, 12, 4, true]} />
        <meshStandardMaterial
          ref={material}
          color="#956984"
          emissive="#a7798d"
          wireframe
          transparent
          opacity={focus === "pump" ? 0.35 : 0.12}
        />
      </mesh>
      {[-0.65, -0.3, 0.05, 0.4, 0.7].map((y) => (
        <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.37, 0.012, 6, 40]} />
          <meshBasicMaterial
            color={theme.superficial}
            transparent
            opacity={focus === "pump" ? 0.7 : 0.2}
          />
        </mesh>
      ))}
    </group>
  );
}
function Network({
  solution,
  timeRef,
  focus,
}: {
  solution: Solution;
  timeRef: React.RefObject<number>;
  focus: Focus;
}) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (group.current)
      group.current.rotation.z = THREE.MathUtils.damp(
        group.current.rotation.z,
        (-(90 - solution.parameters.posture) * Math.PI) / 180,
        4,
        delta,
      );
  });
  return (
    <group ref={group} position={[0, -0.15, 0]}>
      <Chamber
        solution={solution}
        timeRef={timeRef}
        position={[0.45, -1.3, 0]}
        volumeKey="volume"
        reference={12}
        color={colors.deep}
      />
      <Chamber
        solution={solution}
        timeRef={timeRef}
        position={[0.45, 1, 0]}
        volumeKey="proximalDeepVolume"
        reference={10}
        color={colors.deep}
      />
      <Chamber
        solution={solution}
        timeRef={timeRef}
        position={[-0.75, -1.3, 0.12]}
        volumeKey="superficialVolume"
        reference={11}
        color={colors.superficial}
      />
      <Chamber
        solution={solution}
        timeRef={timeRef}
        position={[-0.75, 1, 0.12]}
        volumeKey="proximalSuperficialVolume"
        reference={9}
        color={colors.superficial}
      />
      {(Object.keys(paths) as FlowKey[])
        .filter((key) => key !== "collateral" || solution.parameters.collateral)
        .map((branch) => {
          const color =
            branch === "perforator"
              ? colors.perforator
              : branch === "collateral"
                ? colors.collateral
                : branch.startsWith("superficial")
                  ? colors.superficial
                  : colors.deep;
          return (
            <group key={branch}>
              <Tube
                path={paths[branch]}
                color={color}
                highlight={
                  focus === "integrated" ||
                  (focus === "perforator" && branch === "perforator") ||
                  (focus === "collateral" && branch === "collateral")
                }
              />
              <Transport
                solution={solution}
                timeRef={timeRef}
                branch={branch}
                color={color}
                count={branch === "perforator" ? 9 : 16}
              />
            </group>
          );
        })}
      <Valve solution={solution} timeRef={timeRef} />
      <Valve
        solution={solution}
        timeRef={timeRef}
        x={-0.75}
        branch="superficialFlow"
      />
      <Muscle solution={solution} timeRef={timeRef} focus={focus} />
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          position={[0.45, 1.75 + i * 0.1, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <torusGeometry args={[0.17, 0.012, 8, 32]} />
          <meshBasicMaterial
            color={
              solution.parameters.obstruction > 1 ? theme.reverse : "#9aa8b0"
            }
            transparent
            opacity={0.2 + solution.parameters.obstruction / 10}
          />
        </mesh>
      ))}
      {solution.parameters.compression > 0 &&
        [-1.7, -1.35, -1].map((y) => (
          <mesh
            key={y}
            position={[-0.75, y, 0.12]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <torusGeometry
              args={[
                0.25 - solution.parameters.compression * 0.025,
                0.012,
                8,
                32,
              ]}
            />
            <meshBasicMaterial
              color={theme.superficial}
              transparent
              opacity={0.45 + solution.parameters.compression * 0.25}
            />
          </mesh>
        ))}
    </group>
  );
}
function CameraSync({
  pose,
  id,
  controls,
}: {
  pose: React.RefObject<CameraPose>;
  id: string;
  controls: React.RefObject<any>;
}) {
  const camera = useThree((s) => s.camera);
  useFrame(() => {
    const c = controls.current;
    if (!c) return;
    if (pose.current.owner === id) {
      camera.position.toArray(pose.current.position);
      c.target.toArray(pose.current.target);
    } else if (pose.current.owner) {
      camera.position.fromArray(pose.current.position);
      c.target.fromArray(pose.current.target);
      c.update();
    }
  });
  return null;
}
export default function VenousScene({
  mode,
  solution,
  timeRef,
  cameraPose,
  focus = "integrated",
  hero = false,
}: {
  mode: string;
  solution: Solution;
  timeRef: React.RefObject<number>;
  cameraPose?: React.RefObject<CameraPose>;
  focus?: Focus;
  hero?: boolean;
}) {
  const controls = useRef<any>(null),
    id = useId();
  const now = sampleAt(solution, timeRef.current);
  const reading =
    focus === "posture"
      ? ["Postura", `${solution.parameters.posture}°`]
      : focus === "pump"
        ? [
            "Bomba muscular",
            now.pump * solution.parameters.pump > 0.02
              ? "Contracción"
              : "Relajación",
          ]
        : focus === "valve"
          ? ["Flujo en la válvula", `${now.flow.toFixed(3)} u.r.`]
          : focus === "perforator"
            ? ["Conexión perforante", `${now.perforator.toFixed(3)} u.r.`]
            : focus === "collateral"
              ? ["Rama colateral", `${now.collateral.toFixed(3)} u.r.`]
              : focus === "obstruction"
                ? [
                    "Resistencia de salida",
                    `${solution.parameters.obstruction.toFixed(1)} u.r.`,
                  ]
                : focus === "compression"
                  ? [
                      "Presión exterior",
                      `${solution.parameters.compression.toFixed(2)} u.r.`,
                    ]
                  : ["Flujo profundo", `${now.flow.toFixed(3)} u.r.`];
  if (mode === "anatomy")
    return (
      <ReferenceAnatomy
        mode="anatomy"
        solution={solution}
        timeRef={timeRef}
        cameraPose={cameraPose}
      />
    );
  return (
    <div
      className={`scene-wrap kinetic-scene ${hero ? "hero-scene" : ""}`}
      data-view={mode}
      aria-label={
        mode === "valve"
          ? "Modelo valvular tridimensional"
          : "Red venosa tridimensional"
      }
    >
      <Canvas
        fallback={
          <div className="scene-fallback">
            <p>
              El visor 3D requiere WebGL. Puedes explorar las mismas ecuaciones
              en el circuito.
            </p>
            <a className="button secondary" href="#/flebotwin?view=circuit">
              Abrir circuito interactivo
            </a>
          </div>
        }
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.3, mode === "valve" ? 9.2 : 9], fov: 43 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight
          position={[3, 4, 5]}
          intensity={2.2}
          color="#ffffff"
        />
        <directionalLight
          position={[-4, -1, 2]}
          intensity={1.1}
          color="#f8e7e9"
        />
        <Suspense fallback={null}>
          {mode === "valve" ? (
            <>
              <Valve solution={solution} timeRef={timeRef} large />
              <Transport
                solution={solution}
                timeRef={timeRef}
                branch="flow"
                color={colors.deep}
                count={18}
                path={largePath}
              />
            </>
          ) : (
            <Network solution={solution} timeRef={timeRef} focus={focus} />
          )}
        </Suspense>
        <OrbitControls
          ref={controls}
          makeDefault
          enableDamping
          minDistance={4}
          maxDistance={15}
          enablePan={!hero}
          onStart={() => {
            if (cameraPose) cameraPose.current.owner = id;
          }}
        />
        {!hero && <FitCamera mode={mode} controls={controls} />}
        {cameraPose && (
          <CameraSync pose={cameraPose} id={id} controls={controls} />
        )}
      </Canvas>
      {!hero && (
        <div className="scene-reading">
          <small>{reading[0]}</small>
          <b>{reading[1]}</b>
        </div>
      )}
      <div className="scene-top">
        <span className="nature-badge">
          <i />{" "}
          {mode === "valve"
            ? "VÁLVULA · REPRESENTACIÓN DEL MODELO"
            : "RED VENOSA · MODELO EDUCATIVO"}
        </span>
        {!hero && (
          <button
            className="dark-button"
            onClick={() => {
              controls.current?.reset();
              if (cameraPose) cameraPose.current.owner = id;
            }}
          >
            Centrar vista
          </button>
        )}
      </div>
      {!hero && mode !== "valve" && (
        <div className="scene-legend">
          <span>
            <i />
            Profundo
          </span>
          <span>
            <i />
            Superficial
          </span>
          <span>
            <i />
            Conexión
          </span>
          {solution.parameters.collateral && (
            <span>
              <i />
              Colateral
            </span>
          )}
        </div>
      )}
      {!hero && (
        <div className="scene-bottom">
          <span>Arrastra para rotar · Scroll para acercar</span>
          <span>Flujo y volumen en unidades relativas</span>
        </div>
      )}
    </div>
  );
}
