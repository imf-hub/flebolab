import { References } from "../../shared/References";
import { useEffect, useRef, useState } from "react";
import { dopplerLessons } from "../../data/educational";
import { Note, Range, SourceLink } from "../../shared/UI";
import { RotateCcw } from "lucide-react";
import { wrapDoppler, projectedVelocity } from "./physics";
import waterloo from "../../data/waterloo";
function Experimental() {
  const asset = waterloo;
  return (
    <div className="experimental-cine">
      <video
        src={asset.videoPath}
        poster={asset.posterPath}
        controls
        playsInline
        preload="metadata"
      />
      <p>{asset.caption}</p>
      <p>{asset.protocol}</p>
      <Note>
        {asset.calibration.temporalNote} No se importaron matrices RF ni una
        serie numérica de velocidades; no se trazan curvas experimentales a
        partir del raster.
      </Note>
      <details>
        <summary>Reconstrucción publicada y límites</summary>
        <img
          src={asset.figurePath}
          alt="Comparación B-mode y campos vectoriales publicada por los autores"
          loading="lazy"
        />
        <ul>
          {asset.limitations.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
        <p>{asset.attribution}</p>
      </details>
      <SourceLink
        href={asset.sourceUrl}
        label="Waterloo / Open-H-RF · CC BY 4.0"
      />
    </div>
  );
}
export default function Doppler({
  id,
  onSelect,
}: {
  id: string;
  onSelect: (id: string) => void;
}) {
  const lesson = dopplerLessons.find((l) => l.id === id) ?? dopplerLessons[0];
  const [values, setValues] = useState<Record<string, number>>({});
  useEffect(
    () =>
      setValues(
        Object.fromEntries(lesson.controls.map((c) => [c.id, c.defaultValue])),
      ),
    [lesson.id],
  );
  const val = (key: string, fallback: number) => values[key] ?? fallback;
  const angle = val("angle", 45),
    velocity = val("velocity", 20),
    scale = val("scale", 50),
    baseline = 185 + val("baseline", 0) * 2.5,
    frequency = val("frequency", 5),
    shift =
      (2 *
        frequency *
        1e6 *
        (velocity / 100) *
        Math.cos((angle * Math.PI) / 180)) /
      1540;
  const alias = lesson.demo === "aliasing",
    prf = val("prf", 1000),
    original = val("shift", 800),
    wrapped = wrapDoppler(original, prf);
  const curveColor =
    lesson.demo === "color" && velocity === 0
      ? "#66727a"
      : lesson.demo === "color"
        ? velocity >= 0 !== Boolean(val("invert", 0))
          ? "#bd332d"
          : "#286fa0"
        : "#bd292e";
  const duration = val("duration", 0.7),
    event = lesson.demo === "reflux" ? 1.5 : val("eventTime", 2);
  const pts = Array.from({ length: 400 }, (_, i) => {
    const t = (i / 399) * 6;
    let y =
      velocity * (0.7 + 0.3 * Math.sin((t / val("period", 4)) * Math.PI * 2));
    if (lesson.demo === "direction" || lesson.demo === "angle")
      y = projectedVelocity(y, angle);
    if (alias) y = wrapped;
    if (lesson.demo === "timing" || lesson.demo === "reflux")
      y = t < event ? 12 : t < event + duration ? -14 : 6;
    if (lesson.demo === "phasicity")
      y =
        20 *
        (1 -
          (val("modulation", 60) / 100) *
            Math.cos((t / val("period", 4)) * Math.PI * 2));
    return `${60 + (t / 6) * 600},${Math.max(35, Math.min(335, baseline - (y / (alias ? prf / 2 : scale)) * 135))}`;
  }).join(" ");
  return (
    <div className="doppler-layout">
      <aside className="lab-sidebar">
        <div className="sidebar-heading">
          <span className="eyebrow">DOPPLER / 10 PERSPECTIVAS</span>
        </div>
        <div className="scenario-list">
          {dopplerLessons.map((l) => (
            <button
              key={l.id}
              className={l.id === id ? "active" : ""}
              onClick={() => onSelect(l.id)}
            >
              <span>{l.id.slice(2)}</span>
              <div>
                <small>
                  {l.nature === "experimental"
                    ? "Cine experimental"
                    : "Demostración interactiva"}
                </small>
                <b>{l.title}</b>
              </div>
            </button>
          ))}
        </div>
      </aside>
      <section className="doppler-stage">
        <div className="stage-title">
          <div>
            <span className="eyebrow">
              {lesson.id} /{" "}
              {lesson.nature === "experimental"
                ? "DATOS EXPERIMENTALES"
                : "PRINCIPIOS DE ADQUISICIÓN"}
            </span>
            <h2>{lesson.title}</h2>
          </div>
        </div>
        <p className="lead-small">{lesson.intro}</p>
        {lesson.demo === "experimental" ? (
          <Experimental />
        ) : (
          <>
            <div className="doppler-display">
              <div className="nature-badge">
                ESQUEMA SINTÉTICO · NO ES UN ESPECTRO ADQUIRIDO
              </div>
              <svg
                viewBox="0 0 720 390"
                role="img"
                aria-label={`Demostración ${lesson.title}`}
              >
                <defs>
                  <pattern
                    id="grid"
                    width="60"
                    height="35"
                    patternUnits="userSpaceOnUse"
                  >
                    <path d="M60 0H0V35" fill="none" stroke="#dce3e8" />
                  </pattern>
                </defs>
                <rect
                  x="60"
                  y="35"
                  width="600"
                  height="300"
                  fill="url(#grid)"
                />
                <path
                  d={`M60 35V335H660M60 ${baseline}H660`}
                  stroke="#65727b"
                  fill="none"
                />
                <polyline
                  points={pts}
                  fill="none"
                  stroke={curveColor}
                  strokeWidth="2.5"
                />
                {(lesson.demo === "timing" || lesson.demo === "reflux") && (
                  <>
                    <rect
                      x={60 + (event / 6) * 600}
                      y="35"
                      width={(duration / 6) * 600}
                      height="300"
                      fill="#c7657925"
                    />
                    <path
                      d={`M${60 + (event / 6) * 600} 50v260M${60 + ((event + duration) / 6) * 600} 50v260`}
                      stroke="#bd292e"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={60 + ((event + duration / 2) / 6) * 600}
                      y="75"
                      textAnchor="middle"
                      fill="#a3212b"
                      fontSize="14"
                    >
                      {duration.toFixed(2)} s
                    </text>
                  </>
                )}
                {Array.from({ length: 7 }, (_, i) => (
                  <text
                    key={i}
                    x={60 + i * 100}
                    y="357"
                    textAnchor="middle"
                    fontSize="12"
                    fill="#65727b"
                  >
                    {i}s
                  </text>
                ))}
                <text
                  x="47"
                  y={baseline + 4}
                  textAnchor="end"
                  fill="#65727b"
                  fontSize="12"
                >
                  0
                </text>
                <text
                  x="60"
                  y="22"
                  textAnchor="start"
                  fill="#65727b"
                  fontSize="12"
                >
                  {alias
                    ? "Hz"
                    : lesson.demo === "direction" || lesson.demo === "angle"
                      ? "v·cos θ (cm/s)"
                      : "cm/s"}
                </text>
                {alias &&
                  [-1, 1].map((sign) => (
                    <g key={sign}>
                      <line
                        x1="60"
                        x2="660"
                        y1={baseline - sign * 135}
                        y2={baseline - sign * 135}
                        stroke="#65727b"
                        strokeDasharray="5 5"
                      />
                      <text
                        x="65"
                        y={baseline - sign * 135 - 5}
                        fill="#65727b"
                        fontSize="12"
                      >
                        {(sign * prf) / 2} Hz · Nyquist
                      </text>
                    </g>
                  ))}
                <text
                  x="360"
                  y="384"
                  textAnchor="middle"
                  fill="#65727b"
                  fontSize="11"
                >
                  Tiempo sintético (s) · 0 a 6
                </text>
              </svg>
              {(lesson.demo === "direction" || lesson.demo === "angle") && (
                <div className="doppler-metrics">
                  <span>
                    cos θ ={" "}
                    <b>{Math.cos((angle * Math.PI) / 180).toFixed(3)}</b>
                  </span>
                  <span>f₀ = {frequency} MHz · c = 1540 m/s</span>
                  <span>
                    Desplazamiento ideal <b>{shift.toFixed(0)} Hz</b>
                  </span>
                </div>
              )}
              {alias && (
                <div className="doppler-metrics">
                  <span>
                    Señal original <b>{original} Hz</b>
                  </span>
                  <span>
                    Nyquist <b>±{prf / 2} Hz</b>
                  </span>
                  <span>
                    Representación <b>{wrapped} Hz</b>
                  </span>
                </div>
              )}
              {lesson.demo === "color" && (
                <div className="color-key">
                  <span
                    style={{
                      background: val("invert", 0) ? "#428cd6" : "#dd665b",
                    }}
                  />
                  Hacia el transductor
                  <span
                    style={{
                      background: val("invert", 0) ? "#dd665b" : "#428cd6",
                    }}
                  />
                  Se aleja del transductor
                </div>
              )}
            </div>
            <div className="doppler-controls">
              {lesson.controls.map((c) => (
                <Range
                  key={c.id}
                  label={c.label}
                  value={val(c.id, c.defaultValue)}
                  min={c.min}
                  max={c.max}
                  step={c.step}
                  display={
                    c.id === "deep"
                      ? val("deep", 0)
                        ? ">1 s: femoral común/femoral/poplítea"
                        : ">0,5 s: segmentos enumerados debajo"
                      : `${val(c.id, c.defaultValue)}${c.unit}`
                  }
                  onChange={(n) => setValues((v) => ({ ...v, [c.id]: n }))}
                />
              ))}
              <button
                className="button quiet"
                onClick={() =>
                  setValues(
                    Object.fromEntries(
                      lesson.controls.map((c) => [c.id, c.defaultValue]),
                    ),
                  )
                }
              >
                <RotateCcw size={14} />
                Restaurar
              </button>
            </div>
            {lesson.formula && <div className="formula">{lesson.formula}</div>}
            {lesson.demo === "reflux" && (
              <Note>
                Referencia del territorio:{" "}
                {val("deep", 0)
                  ? "femoral común, femoral y poplítea: >1 s"
                  : "troncos superficiales, venas tibiales, femoral profunda y perforantes: >0,5 s"}
                . La duración del esquema es {duration.toFixed(2)} s. Su
                interpretación clínica requiere segmento, maniobra y estudio
                completo.
              </Note>
            )}
          </>
        )}
        <div className="explanation-box">
          <div className="eyebrow">PARA LLEVAR A LA EXPLORACIÓN</div>
          <h3>{lesson.takeaway}</h3>
          <details>
            <summary>Explicación y fuentes</summary>
            <ul>
              {lesson.keyPoints.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <References ids={lesson.sourceIds} />
          </details>
        </div>
      </section>
    </div>
  );
}
