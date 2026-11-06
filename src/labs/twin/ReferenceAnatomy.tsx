import { assetUrl } from "../../shared/assets";
import {
  Suspense,
  useMemo,
  useRef,
  useState,
  useEffect,
  useId,
  useCallback,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Line } from "@react-three/drei";
import * as THREE from "three";
import type { Solution } from "./model";
import { integratedFlow, phaseAt, type FlowKey } from "./transport";
import assets from "../../data/assets";
import FitCamera from "./FitCamera";
import GuidedCamera from "../../learning/GuidedCamera";
import type { CameraGuide } from "../../learning/types";
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

function Anatomy({
  tissues,
  selected,
  onSelect,
  cut,
  isolate,
  onReady,
}: {
  tissues: string[];
  selected: string;
  onSelect: (s: string) => void;
  cut: boolean;
  isolate: boolean;
  onReady?: () => void;
}) {
  const gltf = useGLTF(assetUrl("/media/anatomy/left-leg-reference.glb"));
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
    onReady?.();
  }, [scene, onReady]);
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
            ? "#bd292e"
            : tissue === "vein"
              ? "#46779c"
              : tissue === "bone"
                ? "#b8aa8e"
                : "#9c6c79",
        );
        m.clippingPlanes = cut
          ? [new THREE.Plane(new THREE.Vector3(0, 0, -1), 0.05)]
          : [];
        m.needsUpdate = true;
      }
    });
  }, [scene, tissues, selected, cut, isolate]);
  useEffect(
    () => () => {
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh) (o.material as THREE.Material).dispose();
      });
    },
    [scene],
  );
  return (
    <primitive
      object={scene}
      dispose={null}
      onClick={(e: any) => {
        e.stopPropagation();
        if (typeof e.object.userData.bodypartsId === "string")
          onSelect(e.object.userData.bodypartsId);
      }}
    />
  );
}
export default function ReferenceAnatomy({
  mode,
  solution,
  timeRef,
  cameraPose,
  guidance,
  onCameraInput,
  guidedTissues,
  onTissuesChange,
  onReady,
}: {
  mode: string;
  solution: Solution;
  timeRef: React.RefObject<number>;
  cameraPose?: React.RefObject<CameraPose>;
  guidance?: React.RefObject<CameraGuide>;
  onCameraInput?: () => void;
  guidedTissues?: string[];
  onTissuesChange?: (tissues: string[]) => void;
  onReady?: () => void;
}) {
  const controls = useRef<any>(null),
    sceneId = useId();
  const [isolate, setIsolate] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const modelAvailable = useCallback(() => {
    setModelReady(true);
    onReady?.();
  }, [onReady]);
  const [tissues, setTissues] = useState(["bone", "muscle", "vein"]),
    [selected, setSelected] = useState(""),
    [cut, setCut] = useState(false),
    [reset, setReset] = useState(0);
  useEffect(() => {
    if (guidedTissues) {
      setTissues(guidedTissues);
      setIsolate(false);
    }
  }, [guidedTissues?.join(",")]);
  useEffect(() => {
    onTissuesChange?.(tissues);
  }, [tissues, onTissuesChange]);
  return (
    <div className="scene-wrap" data-model-ready={modelReady}>
      <Canvas
        dpr={[1, 1.5]}
        key={reset}
        camera={{ position: [0, 0.3, 9], fov: 43 }}
        gl={{ antialias: true, localClippingEnabled: true, alpha: false }}
        onCreated={({ gl }) => gl.setClearColor("#f7f9fb")}
      >
        <ambientLight intensity={1.6} />
        <directionalLight position={[4, 5, 7]} intensity={3} />
        <directionalLight
          position={[-4, 1, -3]}
          intensity={1.8}
          color="#a1c1e6"
        />
        <Suspense fallback={null}>
          <Anatomy
            tissues={tissues}
            selected={selected}
            onSelect={(id) => {
              onCameraInput?.();
              setSelected(id);
            }}
            cut={cut}
            isolate={isolate}
            onReady={modelAvailable}
          />
        </Suspense>
        <OrbitControls
          ref={controls}
          makeDefault
          enableDamping
          minDistance={3}
          maxDistance={17}
          onStart={() => {
            onCameraInput?.();
            if (cameraPose) cameraPose.current.owner = sceneId;
          }}
        />
        <FitCamera mode="anatomy" controls={controls} />
        {guidance && (
          <GuidedCamera guide={guidance} mode="anatomy" controls={controls} />
        )}
        {cameraPose && (
          <CameraSync pose={cameraPose} id={sceneId} controls={controls} />
        )}
      </Canvas>
      {!modelReady && (
        <div className="anatomy-resource-loading" role="status">
          <span className="model-resource-loading">Cargando anatomía 3D…</span>
        </div>
      )}
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
            onCameraInput?.();
            setModelReady(false);
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
              onCameraInput?.();
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
            onClick={() => {
              onCameraInput?.();
              setIsolate(!isolate);
            }}
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
                onChange={() => {
                  onCameraInput?.();
                  setTissues((t) =>
                    t.includes(v) ? t.filter((x) => x !== v) : [...t, v],
                  );
                }}
              />
              {l}
            </label>
          ))}
          <label>
            <input
              type="checkbox"
              checked={cut}
              onChange={(e) => {
                onCameraInput?.();
                setCut(e.target.checked);
              }}
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
            ? "Miembro inferior izquierdo · 12 estructuras"
            : "Superficial · Profundo · Conexiones"}
        </span>
      </div>
    </div>
  );
}
