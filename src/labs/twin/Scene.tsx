import { Suspense, useMemo, useRef, useState, useEffect, useId } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Line } from "@react-three/drei";
import * as THREE from "three";
import type { Solution } from "./model";
import assets from "../../data/assets.json";
export type CameraPose = {
  owner: string;
  position: [number, number, number];
  target: [number, number, number];
};
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

const curve = (points: number[][]) =>
  new THREE.CatmullRomCurve3(
    points.map((p) => new THREE.Vector3(...(p as [number, number, number]))),
  );
const paths = [
  curve([
    [-0.25, -2.7, 0],
    [-0.38, -1.1, 0],
    [-0.1, 0.3, 0],
    [0, 1.6, 0],
    [0.2, 2.8, 0],
  ]),
  curve([
    [-0.8, -2.7, 0.35],
    [-1, -1.3, 0.35],
    [-0.8, 0.2, 0.35],
    [-0.7, 1.5, 0.3],
    [0.15, 2.6, 0],
  ]),
  curve([
    [-0.85, -0.8, 0.35],
    [-0.6, -0.6, 0.2],
    [-0.3, -0.5, 0],
  ]),
  curve([
    [-0.8, 1.2, 0.3],
    [-0.4, 1.35, 0.1],
    [0, 1.5, 0],
  ]),
];
function Vessel({
  path,
  color,
  radius = 0.07,
}: {
  path: THREE.CatmullRomCurve3;
  color: string;
  radius?: number;
}) {
  const geo = useMemo(
    () => new THREE.TubeGeometry(path, 80, radius, 10, false),
    [path, radius],
  );
  useEffect(() => () => geo.dispose(), [geo]);
  return (
    <mesh geometry={geo}>
      <meshPhysicalMaterial
        color={color}
        roughness={0.28}
        metalness={0.05}
        transparent
        opacity={0.72}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
function Tracer({
  path,
  offset,
  solution,
  timeRef,
  index,
}: {
  path: THREE.CatmullRomCurve3;
  offset: number;
  solution: Solution;
  timeRef: React.RefObject<number>;
  index: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const point = useMemo(() => new THREE.Vector3(), []);
  useFrame(() => {
    if (!ref.current) return;
    const t = timeRef.current;
    const s =
      solution.samples[
        Math.min(
          solution.samples.length - 1,
          Math.floor((t / (solution.period * 2)) * solution.samples.length),
        )
      ];
    const q = index === 1 ? s?.superficialFlow : s?.flow;
    const u = (((t * 0.13 * (q < 0 ? -1 : 1) + offset) % 1) + 1) % 1;
    path.getPoint(u, point);
    ref.current.position.copy(point);
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.035, 8, 8]} />
      <meshBasicMaterial color="#fff5df" />
    </mesh>
  );
}
function Valve({
  solution,
  timeRef,
  large = false,
}: {
  solution: Solution;
  timeRef: React.RefObject<number>;
  large?: boolean;
}) {
  const left = useRef<THREE.Group>(null),
    right = useRef<THREE.Group>(null);
  useFrame(() => {
    const t = timeRef.current;
    const s =
      solution.samples[
        Math.min(
          solution.samples.length - 1,
          Math.floor((t / (solution.period * 2)) * solution.samples.length),
        )
      ];
    const opening =
      s?.flow > 0
        ? 0.22 + Math.min(0.7, s.flow * 0.28)
        : solution.parameters.leak * 0.45;
    if (left.current) left.current.rotation.z = -opening;
    if (right.current) right.current.rotation.z = opening;
  });
  return (
    <group
      position={large ? [0, 0, 0] : [-0.25, -0.2, 0]}
      scale={large ? 3.3 : 1}
    >
      <mesh>
        <cylinderGeometry args={[0.26, 0.26, 1.5, 32, 1, true]} />
        <meshPhysicalMaterial
          color="#a74362"
          side={THREE.DoubleSide}
          transparent
          opacity={0.32}
          roughness={0.3}
        />
      </mesh>
      <group ref={left} position={[-0.24, -0.1, 0]}>
        <mesh
          position={[0.12, 0.12, 0]}
          rotation={[0, 0, -0.65]}
          scale={[1, 1.7, 0.12]}
        >
          <sphereGeometry args={[0.23, 24, 16]} />
          <meshStandardMaterial color="#f1d9c9" side={THREE.DoubleSide} />
        </mesh>
      </group>
      <group ref={right} position={[0.24, -0.1, 0]}>
        <mesh
          position={[-0.12, 0.12, 0]}
          rotation={[0, 0, 0.65]}
          scale={[1, 1.7, 0.12]}
        >
          <sphereGeometry args={[0.23, 24, 16]} />
          <meshStandardMaterial color="#f1d9c9" side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}
function Flow({
  solution,
  timeRef,
  valveOnly,
}: {
  solution: Solution;
  timeRef: React.RefObject<number>;
  valveOnly: boolean;
}) {
  return (
    <>
      {!valveOnly && (
        <>
          <mesh position={[-0.5, -1, 0]} scale={[0.85, 1.3, 0.55]}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial
              color="#705263"
              transparent
              opacity={0.12}
              wireframe
            />
          </mesh>
          {paths.map((p, i) => (
            <group key={i}>
              <Vessel
                path={p}
                color={i === 0 ? "#62a5d6" : i === 1 ? "#d580ac" : "#74cabb"}
                radius={i < 2 ? 0.1 : 0.055}
              />
              {Array.from({ length: i < 2 ? 12 : 4 }, (_, j) => (
                <Tracer
                  key={j}
                  path={p}
                  offset={j / (i < 2 ? 12 : 4)}
                  solution={solution}
                  timeRef={timeRef}
                  index={i}
                />
              ))}
            </group>
          ))}
          {solution.parameters.collateral && (
            <Vessel
              path={curve([
                [-0.3, -1, 0],
                [0.8, -0.5, 0],
                [1, 1.2, 0],
                [0.3, 2.8, 0],
              ])}
              color="#e8ba77"
              radius={0.045}
            />
          )}
        </>
      )}
      <Valve solution={solution} timeRef={timeRef} large={valveOnly} />
    </>
  );
}
function Anatomy({
  tissues,
  selected,
  onSelect,
  cut,
  isolate,
}: {
  tissues: string[];
  selected: string;
  onSelect: (s: string) => void;
  cut: boolean;
  isolate: boolean;
}) {
  const gltf = useGLTF("/media/anatomy/left-leg-reference.glb");
  const scene = useMemo(() => {
    const s = gltf.scene.clone(true);
    s.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.material = (o.material as THREE.Material).clone();
        o.castShadow = false;
      }
    });
    s.scale.setScalar(6.8189171764);
    s.position.set(-0.557983469, -2.688606646, -0.547637842);
    return s;
  }, [gltf]);
  useEffect(() => {
    scene.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        const tissue = o.userData.tissue ?? "vein";
        o.visible =
          tissues.includes(tissue) &&
          (!isolate || o.userData.bodypartsId === selected);
        const m = o.material as THREE.MeshStandardMaterial;
        m.transparent = true;
        m.opacity = tissue === "muscle" ? 0.22 : tissue === "bone" ? 0.38 : 1;
        m.depthWrite = tissue === "vein";
        m.color.set(
          o.userData.bodypartsId === selected
            ? "#ffcf7a"
            : tissue === "vein"
              ? "#86b6dc"
              : tissue === "bone"
                ? "#e4d7bf"
                : "#9c6c79",
        );
        m.clippingPlanes = cut
          ? [new THREE.Plane(new THREE.Vector3(0, 0, -1), 0.05)]
          : [];
        m.needsUpdate = true;
      }
    });
  }, [scene, tissues, selected, cut, isolate]);
  return (
    <primitive
      object={scene}
      onClick={(e: any) => {
        e.stopPropagation();
        onSelect(e.object.userData.bodypartsId);
      }}
    />
  );
}
export default function Scene({
  mode,
  solution,
  timeRef,
  cameraPose,
}: {
  mode: string;
  solution: Solution;
  timeRef: React.RefObject<number>;
  cameraPose?: React.RefObject<CameraPose>;
}) {
  const controls = useRef<any>(null),
    sceneId = useId();
  const [isolate, setIsolate] = useState(false);
  const [tissues, setTissues] = useState(["bone", "muscle", "vein"]),
    [selected, setSelected] = useState(""),
    [cut, setCut] = useState(false),
    [reset, setReset] = useState(0);
  return (
    <div className="scene-wrap">
      <Canvas
        key={reset}
        camera={{ position: [0, 0.3, 9], fov: 43 }}
        gl={{ antialias: true, localClippingEnabled: true, alpha: false }}
        onCreated={({ gl }) => gl.setClearColor("#172025")}
      >
        <ambientLight intensity={1.6} />
        <directionalLight position={[4, 5, 7]} intensity={3} />
        <directionalLight
          position={[-4, 1, -3]}
          intensity={1.8}
          color="#a1c1e6"
        />
        <Suspense fallback={null}>
          {mode === "anatomy" ? (
            <Anatomy
              tissues={tissues}
              selected={selected}
              onSelect={setSelected}
              cut={cut}
              isolate={isolate}
            />
          ) : (
            <Flow
              solution={solution}
              timeRef={timeRef}
              valveOnly={mode === "valve"}
            />
          )}
        </Suspense>
        <OrbitControls
          ref={controls}
          makeDefault
          enableDamping
          minDistance={3}
          maxDistance={17}
          onStart={() => {
            if (cameraPose) cameraPose.current.owner = sceneId;
          }}
        />
        {cameraPose && (
          <CameraSync pose={cameraPose} id={sceneId} controls={controls} />
        )}
      </Canvas>
      <div className="scene-top">
        <span className="nature-badge">
          {mode === "anatomy"
            ? "ANATOMÍA DE REFERENCIA · BODYPARTS3D"
            : mode === "valve"
              ? "VÁLVULA ILUSTRATIVA · NO BIOMECÁNICA"
              : "RED EDUCATIVA · UNIDADES RELATIVAS"}
        </span>
        <button
          onClick={() => {
            if (cameraPose) {
              cameraPose.current.owner = "reset";
              cameraPose.current.position = [0, 0.3, 9];
              cameraPose.current.target = [0, 0, 0];
            }
            setReset((r) => r + 1);
          }}
          className="dark-button"
        >
          Restablecer vista
        </button>
      </div>
      {mode === "anatomy" && (
        <div className="scene-structures">
          <select
            aria-label="Seleccionar estructura anatómica"
            value={selected}
            onChange={(e) => {
              setSelected(e.target.value);
              setIsolate(false);
            }}
          >
            <option value="">Seleccionar estructura…</option>
            {assets
              .filter((a) => a.sourceIdentifier)
              .map((a) => (
                <option key={a.id} value={a.sourceIdentifier}>
                  {a.title}
                </option>
              ))}
          </select>
          <button
            className="dark-button"
            disabled={!selected}
            onClick={() => setIsolate(!isolate)}
          >
            {isolate ? "Volver al territorio" : "Aislar selección"}
          </button>
        </div>
      )}
      {mode === "anatomy" && (
        <div className="scene-layers">
          {[
            ["vein", "Venas"],
            ["muscle", "Músculos"],
            ["bone", "Huesos"],
          ].map(([v, l]) => (
            <label key={v}>
              <input
                type="checkbox"
                checked={tissues.includes(v)}
                onChange={() =>
                  setTissues((t) =>
                    t.includes(v) ? t.filter((x) => x !== v) : [...t, v],
                  )
                }
              />
              {l}
            </label>
          ))}
          <label>
            <input
              type="checkbox"
              checked={cut}
              onChange={(e) => setCut(e.target.checked)}
            />
            Corte visual
          </label>
        </div>
      )}
      <div className="scene-bottom">
        <span>
          {selected
            ? (assets.find((a) => a.sourceIdentifier === selected)?.title ??
              selected)
            : "Arrastra para girar · Rueda para ampliar"}
        </span>
        <span>
          {mode === "anatomy"
            ? "Pierna izquierda · 12 estructuras"
            : "Superficial · Profundo · Conexiones"}
        </span>
      </div>
    </div>
  );
}
