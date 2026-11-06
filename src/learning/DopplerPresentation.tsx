import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line, RoundedBox } from "@react-three/drei";
import { useEffect, useId, useMemo, useRef } from "react";
import * as THREE from "three";
import { dopplerState, dopplerValue } from "./dopplerModel";
import { cellGeometry } from "./geometry";
import type { Stage } from "./types";
function Beam({
  angle,
  velocity,
  invert,
  timeRef,
}: {
  angle: number;
  velocity: number;
  invert: boolean;
  timeRef: React.RefObject<number>;
}) {
  const cells = useRef<THREE.InstancedMesh>(null),
    helper = useMemo(() => new THREE.Object3D(), []),
    geometry = useMemo(cellGeometry, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  const rad = (angle * Math.PI) / 180,
    probe: [number, number, number] = [
      Math.cos(rad) * 2.5,
      Math.sin(rad) * 2.5,
      0,
    ];
  const projected = velocity * Math.cos(rad),
    color =
      projected === 0
        ? "#8a969e"
        : projected > 0 !== invert
          ? "#bd3c36"
          : "#3579a2";
  useFrame(() => {
    if (!cells.current) return;
    for (let i = 0; i < 48; i++) {
      const a = i * 2.399963,
        r = 0.17 * Math.sqrt(((i % 9) + 1) / 10);
      helper.position.set(
        ((((i / 48 + (timeRef.current * velocity) / 240) % 1) + 1) % 1) * 4.7 -
          2.35,
        Math.sin(a) * r,
        Math.cos(a) * r,
      );
      helper.rotation.set(0.3, 0, Math.PI / 2);
      helper.updateMatrix();
      cells.current.setMatrixAt(i, helper.matrix);
    }
    cells.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.3, 5, 48, 1, true]} />
        <meshStandardMaterial
          color="#bbc8cf"
          roughness={0.5}
          side={THREE.DoubleSide}
          transparent
          opacity={0.26}
          depthWrite={false}
        />
      </mesh>
      <instancedMesh
        ref={cells}
        args={[geometry, undefined, 48]}
        frustumCulled={false}
      >
        <meshStandardMaterial color={color} roughness={0.6} />
      </instancedMesh>
      <Line
        points={[
          [probe[0], probe[1], 0],
          [0, 0, 0],
        ]}
        color="#998265"
        lineWidth={2}
        dashed
        dashSize={0.09}
        gapSize={0.06}
      />
      <group position={probe} rotation={[0, 0, rad - Math.PI / 2]}>
        <RoundedBox args={[0.79, 0.3, 0.43]} radius={0.08} smoothness={4}>
          <meshStandardMaterial color="#dce4e8" roughness={0.42} />
        </RoundedBox>
        <RoundedBox
          args={[0.68, 0.07, 0.34]}
          radius={0.025}
          position={[0, -0.165, 0]}
        >
          <meshStandardMaterial color="#4c6374" roughness={0.8} />
        </RoundedBox>
        <RoundedBox
          args={[0.31, 0.57, 0.31]}
          radius={0.1}
          position={[0, 0.38, 0]}
        >
          <meshStandardMaterial color="#edf0f1" roughness={0.55} />
        </RoundedBox>
        <Line
          points={[
            [0, 0.65, 0],
            [0.08, 0.82, 0],
            [0.32, 0.94, 0],
            [0.58, 0.99, 0],
          ]}
          color="#9ba9b2"
          lineWidth={5}
        />
      </group>
      <mesh
        position={[velocity >= 0 ? 1.8 : -1.8, 0.5, 0]}
        rotation={[0, 0, velocity >= 0 ? -Math.PI / 2 : Math.PI / 2]}
      >
        <coneGeometry args={[0.09, 0.28, 18]} />
        <meshBasicMaterial color="#667d8b" />
      </mesh>
      <Line
        points={[
          [-0.4, -0.6, 0],
          [0.4, -0.6, 0],
        ]}
        color="#9cabb4"
        lineWidth={1}
      />
    </>
  );
}
function Sampling({
  shift,
  prf,
  progress,
}: {
  shift: number;
  prf: number;
  progress: number;
}) {
  const wrapped = dopplerState("DP06", { shift, prf }).wrapped;
  const line = (f: number) =>
    Array.from(
      { length: 601 },
      (_, i) =>
        `${35 + (i / 600) * 470},${140 - Math.sin(((2 * Math.PI * f) / prf) * ((i / 600) * 6)) * 65}`,
    ).join(" ");
  return (
    <div className="sampling-window">
      <span className="eyebrow">SEÑAL CONTINUA Y MUESTRAS</span>
      <svg
        viewBox="0 0 540 280"
        role="img"
        aria-label="Comparación de señal y representación plegada en instantes de muestreo"
      >
        <path d="M35 140H505" stroke="#cbd4da" />
        <polyline
          points={line(shift)}
          fill="none"
          stroke="#bd292e"
          strokeWidth="2"
        />
        <polyline
          points={line(wrapped)}
          fill="none"
          stroke="#356d98"
          strokeWidth="2"
          strokeDasharray="5 4"
        />
        {Array.from({ length: 7 }, (_, i) => (
          <g key={i}>
            <path
              d={`M${35 + (i / 6) * 470} 50V220`}
              stroke="#dce3e8"
              strokeDasharray="3 5"
            />
            <circle
              cx={35 + (i / 6) * 470}
              cy={140 - Math.sin(((2 * Math.PI * shift) / prf) * i) * 65}
              r={i <= progress * 6 ? 6 : 3}
              fill={i <= progress * 6 ? "#bd292e" : "#fff"}
              stroke="#bd292e"
            />
            <text
              x={35 + (i / 6) * 470}
              y="244"
              textAnchor="middle"
              fill="#5c6a75"
              fontSize="12"
            >
              {i}
            </text>
          </g>
        ))}
      </svg>
      <div className="sampling-legend">
        <span>— Señal impuesta</span>
        <span>··· Representación</span>
      </div>
      <small>
        Instantes de muestra · la superposición en las muestras explica el
        plegamiento.
      </small>
    </div>
  );
}
export default function DopplerPresentation({
  id,
  stage,
  phase,
  timeRef,
}: {
  id: string;
  stage: Stage;
  phase: number;
  timeRef: React.RefObject<number>;
}) {
  const values = stage.values ?? {},
    state = dopplerState(id, values),
    { p } = state,
    clipId = useId().replace(/:/g, "");
  timeRef.current = phase * 6;
  const color =
    id === "DP02"
      ? p.velocity >= 0 !== Boolean(p.invert)
        ? "#bd3c36"
        : "#3579a2"
      : "#bd292e";
  const isBeam = ["DP01", "DP02", "DP05"].includes(id),
    plotBottom = isBeam || id === "DP06" ? 335 : 225,
    verticalScale = (plotBottom - 35) / 300,
    baseline = 35 + (state.baseline - 35) * verticalScale,
    amplitude = 135 * verticalScale;
  const points = Array.from({ length: 401 }, (_, i) => {
    const t = (i / 400) * 6,
      y = baseline - (dopplerValue(id, values, t) / state.range) * amplitude;
    return `${60 + (i / 400) * 600},${y}`;
  }).join(" ");
  const event = id === "DP10" ? 1.5 : p.eventTime,
    isInterval = id === "DP07" || id === "DP10";
  return (
    <div
      className={`guided-doppler ${isBeam || id === "DP06" ? "has-mechanism" : ""}`}
    >
      {(isBeam || id === "DP06") && (
        <div className="guided-doppler-mechanism">
          {isBeam ? (
            <>
              <div className="beam-label">
                <b>Haz y flujo</b>
                <span>θ = {p.angle}° · esquema espacial</span>
              </div>
              <Canvas dpr={[1, 1.5]} camera={{ position: [0, 1, 8], fov: 44 }}>
                <ambientLight intensity={1.5} />
                <directionalLight position={[3, 4, 6]} intensity={2.5} />
                <Beam
                  angle={p.angle}
                  velocity={p.velocity}
                  invert={Boolean(p.invert)}
                  timeRef={timeRef}
                />
                <OrbitControls enableDamping minDistance={5} maxDistance={11} />
              </Canvas>
              <div className="beam-reading">
                <span>
                  Flujo impuesto <b>{p.velocity} cm/s</b>
                </span>
                <span>
                  Proyección{" "}
                  <b>
                    {(p.velocity * Math.cos((p.angle * Math.PI) / 180)).toFixed(
                      1,
                    )}{" "}
                    cm/s
                  </b>
                </span>
              </div>
            </>
          ) : (
            <Sampling shift={p.shift} prf={p.prf} progress={phase} />
          )}
        </div>
      )}
      <div className="guided-spectrum">
        <header>
          <span className="eyebrow">SEÑAL SINTÉTICA · NO ADQUIRIDA</span>
          <b>
            {id === "DP06"
              ? "Señal pulsada"
              : isInterval
                ? "Intervalo y referencia temporal"
                : "Presentación temporal"}
          </b>
        </header>
        <svg
          viewBox={`0 0 720 ${plotBottom + 55}`}
          role="img"
          aria-label={`Curva sintética de ${id}`}
        >
          <defs>
            <clipPath id={clipId}>
              <rect x="60" y="35" width="600" height={plotBottom - 35} />
            </clipPath>
          </defs>
          {Array.from({ length: 7 }, (_, i) => (
            <g key={i}>
              <path
                d={`M${60 + i * 100} 35V${plotBottom}M60 ${35 + (i / 6) * (plotBottom - 35)}H660`}
                stroke="#e3e8ec"
              />
              <text
                x={60 + i * 100}
                y={plotBottom + 22}
                textAnchor="middle"
                fontSize="12"
                fill="#5c6a75"
              >
                {i}
              </text>
            </g>
          ))}
          <g clipPath={`url(#${clipId})`}>
            <path d={`M60 ${baseline}H660`} stroke="#72828f" />
            {isInterval && (
              <rect
                x={60 + event * 100}
                y="35"
                width={p.duration * 100}
                height={plotBottom - 35}
                fill="#bd292e16"
              />
            )}
            <polyline
              points={points}
              fill="none"
              stroke={color}
              strokeWidth="3"
            />
            {id === "DP06" &&
              [-1, 1].map((s) => (
                <path
                  key={s}
                  d={`M60 ${baseline - s * amplitude}H660`}
                  stroke="#65727b"
                  strokeDasharray="5 4"
                />
              ))}
            <path
              d={`M${60 + phase * 600} 35V${plotBottom}`}
              stroke="#9b6d7b"
              strokeWidth="1"
            />
            {isInterval &&
              [event, event + p.duration].map((t) => (
                <path
                  key={t}
                  d={`M${60 + t * 100} 45V${plotBottom - 10}`}
                  stroke="#bd292e"
                  strokeDasharray="5 5"
                />
              ))}
          </g>
          <text
            x="49"
            y={baseline + 4}
            textAnchor="end"
            fontSize="12"
            fill="#5c6a75"
          >
            0
          </text>
          {[-1, 1].map((sign) => {
            const y = baseline - sign * amplitude;
            return y >= 35 && y <= plotBottom ? (
              <text key={sign} x="49" y={y + 4} textAnchor="end" fill="#5c6a75">
                {sign > 0 ? "+" : "−"}
                {state.range}
              </text>
            ) : null;
          })}
          <text x="60" y="22" fill="#5c6a75" fontSize="12">
            {["DP01", "DP05"].includes(id) ? "v·cos θ (cm/s)" : state.unit}
          </text>
          <text
            x="360"
            y={plotBottom + 48}
            textAnchor="middle"
            fontSize="12"
            fill="#5c6a75"
          >
            Tiempo sintético (s)
          </text>
        </svg>
        <div className="spectrum-values">
          {id === "DP06" ? (
            <>
              <span>
                Original <b>{p.shift} Hz</b>
              </span>
              <span>
                Nyquist <b>±{state.nyquist} Hz</b>
              </span>
              <span>
                Representación <b>{state.wrapped} Hz</b>
              </span>
            </>
          ) : isInterval ? (
            <>
              <span>
                Evento <b>{event.toFixed(2)} s</b>
              </span>
              <span>
                Intervalo <b>{p.duration.toFixed(2)} s</b>
              </span>
            </>
          ) : id === "DP05" ? (
            <>
              <span>
                Frecuencia <b>{p.frequency} MHz</b>
              </span>
              <span>
                Δf ideal <b>{state.shift.toFixed(0)} Hz</b>
              </span>
            </>
          ) : (
            <>
              <span>
                Escala <b>{p.scale} cm/s</b>
              </span>
              <span>
                Base <b>{p.baseline}%</b>
              </span>
            </>
          )}
        </div>
        {id === "DP02" && (
          <p className="color-context">
            Mapa {p.invert ? "invertido" : "inicial"} · rojo/azul describen la
            presentación, no el tipo de vaso.
          </p>
        )}
        {id === "DP04" && p.scale < 25 && (
          <p className="color-context">
            Rango corto: recorte de presentación. No es una demostración de
            aliasing.
          </p>
        )}
        {id === "DP10" && (
          <p className="color-context">
            Referencia SVS/AVF/AVLS 2023 §1.3.1:{" "}
            {p.deep
              ? ">1 s · femoral común, femoral y poplítea."
              : ">0,5 s · troncos superficiales, tibiales, femoral profunda y perforantes."}{" "}
            La curva es sintética; el territorio profundo no comparte un único
            umbral.
          </p>
        )}
      </div>
    </div>
  );
}
