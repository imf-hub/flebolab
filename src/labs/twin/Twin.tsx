import {
  lazy,
  Suspense,
  useMemo,
  useState,
  useRef,
  useLayoutEffect,
} from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useReducedMotion } from "motion/react";
import {
  Play,
  Pause,
  RotateCcw,
  Download,
  ArrowLeftRight,
  Bookmark,
  Activity,
  Layers3,
  Network,
  Maximize2,
  Info,
  BookOpen,
  ArrowDownUp,
} from "lucide-react";
import { scenarios, sanitize, type Parameters } from "./model";
import {
  presentations,
  parseTwinQuery,
  scenarioParameters,
  type ViewMode,
  type Metric,
} from "./scenarioConfig";
import { sampleAt } from "./transport";
import { useSolution, useModelClock } from "./useSimulation";
import { modelMoments } from "./moments";
import { ShareButton } from "../../shared/UI";
import { References } from "../../shared/References";
import { download, readLocal, saveLocal, fullscreen } from "../../shared/utils";
import ControlsPanel from "./ControlsPanel";
import Circuit from "./Circuit";
import "./workbench.css";
const Scene = lazy(() => import("./VenousScene"));
const Chart = lazy(() => import("./Chart"));
const views = [
  {
    id: "flow",
    label: "Red y flujo",
    description: "Sigue cada rama",
    icon: Network,
  },
  {
    id: "valve",
    label: "Válvula",
    description: "Apertura y coaptación",
    icon: Activity,
  },
  {
    id: "anatomy",
    label: "Anatomía",
    description: "Capas y estructuras",
    icon: Layers3,
  },
  {
    id: "circuit",
    label: "Circuito",
    description: "Lee las ecuaciones",
    icon: ArrowDownUp,
  },
] as const;
export default function Twin() {
  const [query, setQuery] = useSearchParams();
  const state = useMemo(() => parseTwinQuery(query), [query.toString()]);
  const p = useMemo(() => state.parameters, [JSON.stringify(state.parameters)]);
  const { scenario, view: mode } = state,
    config = presentations[scenario],
    active = scenarios.find((s) => s.id === scenario)!;
  const reduced = useReducedMotion();
  const [channel, setChannel] = useState<"deep" | "superficial">(
    config.focus === "compression" ? "superficial" : "deep",
  );
  const [metric, setMetric] = useState<Metric>(config.metric),
    [compare, setCompare] = useState(false),
    [bId, setBId] = useState(config.compare),
    [controlsOpen, setControlsOpen] = useState(true),
    [saved, setSaved] = useState(
      readLocal<string[]>("flebo-twin-favorites", []),
    );
  const clock = useModelClock(p.period),
    { time, timeRef, seek, playing, setPlaying, speed, setSpeed } = clock;
  const { solution, busy, error } = useSolution(p);
  const bP = useMemo(
    () => sanitize({ ...scenarioParameters(bId), period: p.period }),
    [bId, p.period],
  );
  const { solution: b, busy: bBusy } = useSolution(bP, compare);
  const cameraPose = useRef<import("./VenousScene").CameraPose>({
    owner: "",
    position: [0, 0.3, 9],
    target: [0, 0, 0],
  });
  const moments = useMemo(() => modelMoments(solution), [solution]);
  useLayoutEffect(() => {
    setMetric(config.metric);
    setChannel(config.focus === "compression" ? "superficial" : "deep");
    setBId(config.compare);
    seek(0);
    setPlaying(!reduced);
    cameraPose.current.owner = "";
  }, [scenario]);
  const setMode = (view: ViewMode) =>
    setQuery(
      (old) => {
        const next = new URLSearchParams(old);
        next.set("view", view);
        return next;
      },
      { replace: true },
    );
  const select = (id: string) => {
    seek(0);
    setControlsOpen(true);
    setQuery({ scenario: id });
  };
  const update = (name: keyof Parameters, value: number | boolean) => {
    if (name === "period") seek(0);
    setQuery(
      {
        scenario,
        p: JSON.stringify(sanitize({ ...p, [name]: value })),
        view: mode,
      },
      { replace: true },
    );
  };
  const sample = sampleAt(solution, time),
    other = sampleAt(b, time);
  const favorite = () => {
    const next = saved.includes(scenario)
      ? saved.filter((id) => id !== scenario)
      : [...saved, scenario];
    setSaved(next);
    saveLocal("flebo-twin-favorites", next);
  };
  const startComparison = () => {
    setCompare(!compare);
    cameraPose.current.owner = "";
    if (mode === "anatomy") setMode(config.view);
  };
  const jump = (value: number) => {
    setPlaying(false);
    seek(value);
  };
  const exportData = () =>
    download(
      `flebotwin-${scenario}.csv`,
      "# " +
        JSON.stringify({
          modelVersion: solution.modelVersion,
          sampleSchemaVersion: 3,
          parameters: solution.parameters,
          nature: "Modelo educativo propio; unidades relativas",
          converged: solution.converged,
          cycleResidual: solution.cycleResidual,
          minimumVolume: solution.minimumVolume,
        }) +
        "\n" +
        Object.keys(solution.samples[0]).join(",") +
        "\n" +
        solution.samples.map((s) => Object.values(s).join(",")).join("\n"),
      "text/csv",
    );
  const cue =
    mode === "anatomy"
      ? "Referencia anatómica independiente. Red y flujo muestra los efectos del experimento."
      : state.custom
        ? `Condiciones modificadas · Vía colateral ${p.collateral ? "activa" : "inactiva"}.`
        : config.cue;
  const renderScene = (result: typeof solution, secondary = false) =>
    mode === "circuit" ? (
      <Circuit solution={result} time={time} />
    ) : (
      <Suspense
        fallback={
          <div className="scene-wrap loading">Preparando el visor 3D…</div>
        }
      >
        <Scene
          mode={mode}
          solution={result}
          timeRef={timeRef}
          focus={
            secondary
              ? (presentations[bId]?.focus ?? config.focus)
              : config.focus
          }
          cameraPose={compare ? cameraPose : undefined}
        />
      </Suspense>
    );
  return (
    <section
      className="twin-studio twin-workbench"
      data-scenario={scenario}
      data-view={mode}
    >
      <header className="studio-heading">
        <div className="workbench-brand">
          <span className="eyebrow">LAB 01</span>
          <h1>FleboTwin</h1>
          <span>Experimenta y observa en tiempo real</span>
        </div>
        <label className="compact-scenario">
          Experimento
          <select
            aria-label="Seleccionar experimento"
            value={scenario}
            onChange={(e) => select(e.target.value)}
          >
            {scenarios.map((s) => (
              <option key={s.id} value={s.id}>
                {s.id} · {presentations[s.id].short}
              </option>
            ))}
          </select>
        </label>
        <div className="button-row">
          <Link
            className="button secondary"
            to={`/aprender/${scenario}`}
            aria-label="Explicación guiada de este experimento"
          >
            <Play size={14} />
            <span>Explicar</span>
          </Link>
          <ShareButton />
          <button
            className="icon-button"
            aria-label="Presentación a pantalla completa"
            onClick={() => fullscreen()}
          >
            <Maximize2 size={17} />
          </button>
        </div>
      </header>
      <div className="studio-layout">
        <aside className="experiment-rail">
          <div className="rail-heading">
            <span>EXPERIMENTOS</span>
            <b>12</b>
          </div>
          <div className="experiment-list">
            {scenarios.map((s, i) => (
              <button
                key={s.id}
                data-testid={`scenario-${s.id}`}
                className={scenario === s.id ? "active" : ""}
                aria-pressed={scenario === s.id}
                onClick={() => select(s.id)}
              >
                <span>{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <small>{s.family}</small>
                  <b>{presentations[s.id].short}</b>
                </div>
                {saved.includes(s.id) && <Bookmark size={12} />}
              </button>
            ))}
          </div>
          <Link className="rail-reference" to="/bibliografia">
            <BookOpen size={13} /> Fuentes médicas
          </Link>
        </aside>
        <div className="experiment-stage">
          <div className="experiment-title">
            <div>
              <span className="eyebrow">
                {scenario} {state.custom ? "/ PERSONALIZADO" : "/ EXPERIMENTO"}
              </span>
              <h2>{config.short}</h2>
            </div>
            <div className="button-row">
              <span className="model-live">
                <i className="status-dot" />
                {busy ? "Calculando" : playing ? "En movimiento" : "Pausado"}
              </span>
              <button
                className={`icon-button ${saved.includes(scenario) ? "selected" : ""}`}
                aria-label="Guardar escenario"
                onClick={favorite}
              >
                <Bookmark size={16} />
              </button>
            </div>
          </div>
          <div
            className="experiment-view-tabs"
            role="group"
            aria-label="Vista del experimento"
          >
            {views.map((v) => (
              <button
                key={v.id}
                className={mode === v.id ? "active" : ""}
                aria-pressed={mode === v.id}
                onClick={() => setMode(v.id)}
              >
                <v.icon size={20} />
                <span>
                  <b>{v.label}</b>
                  <small>{v.description}</small>
                </span>
              </button>
            ))}
          </div>
          <div className="live-workspace">
            <div className="model-column">
              <div
                className={`experiment-viewport ${compare ? "is-comparing" : ""}`}
                aria-busy={busy || (compare && bBusy)}
              >
                <div className="viewport-cell">
                  {compare && (
                    <span className="comparison-label">A · {config.short}</span>
                  )}
                  {renderScene(solution)}
                </div>
                {compare && (
                  <div className="viewport-cell">
                    <span className="comparison-label">
                      B · {presentations[bId]?.short ?? "Referencia"}
                    </span>
                    {renderScene(b, true)}
                  </div>
                )}
                {(busy || (compare && bBusy)) && (
                  <div className="calculation-overlay">
                    Actualizando el modelo…
                  </div>
                )}
              </div>
              <div className="experiment-playback">
                <button
                  className="play-button"
                  aria-label={playing ? "Pausar ciclo" : "Reproducir ciclo"}
                  disabled={busy || !solution.converged}
                  onClick={() => setPlaying(!playing)}
                >
                  {playing ? <Pause size={18} /> : <Play size={18} />}
                </button>
                <button
                  className="icon-button"
                  aria-label="Volver al inicio"
                  onClick={() => seek(0)}
                >
                  <RotateCcw size={15} />
                </button>
                <input
                  aria-label="Tiempo del modelo"
                  type="range"
                  value={time}
                  min={0}
                  max={p.period * 2}
                  step={0.01}
                  onChange={(e) => jump(+e.target.value)}
                />
                <output aria-label="Tiempo actual">
                  {time.toFixed(2)}
                  <small> / {(p.period * 2).toFixed(0)} s</small>
                </output>
                <select
                  aria-label="Velocidad de animación"
                  value={speed}
                  onChange={(e) => setSpeed(+e.target.value)}
                >
                  {[0.25, 0.5, 1, 2].map((n) => (
                    <option value={n} key={n}>
                      {n}×
                    </option>
                  ))}
                </select>
              </div>
              <div className="model-moments" aria-label="Momentos del modelo">
                <span>DETÉN EN</span>
                <button
                  disabled={busy || p.pump < 0.02}
                  onClick={() => jump(moments.contraction)}
                >
                  Contracción
                </button>
                <button
                  disabled={busy}
                  onClick={() => jump(moments.relaxation)}
                >
                  Relajación
                </button>
                <button
                  disabled={busy || moments.reverse === null}
                  title={
                    moments.reverse === null
                      ? "Este perfil no presenta flujo inverso en la rama profunda"
                      : "Detener en el mínimo de flujo calculado"
                  }
                  onClick={() =>
                    moments.reverse !== null && jump(moments.reverse)
                  }
                >
                  Flujo inverso
                </button>
              </div>
            </div>
            <div className="analysis-column">
              <div className="analysis-heading">
                <Activity size={15} />
                <h3>Curvas y lecturas</h3>
                <span>
                  {sample.pump * p.pump > 0.02 ? "Contracción" : "Relajación"}
                </span>
              </div>
              <div className="experiment-readouts">
                {[
                  [
                    "Flujo de rama profunda",
                    sample.flow,
                    other.flow,
                    "Flujo profundo",
                  ],
                  [
                    "Presión distal profunda",
                    sample.pressure,
                    other.pressure,
                    "Presión profunda",
                  ],
                  [
                    "Volumen distal superficial",
                    sample.superficialVolume,
                    other.superficialVolume,
                    "Volumen superficial",
                  ],
                  [
                    "Flujo de conexión",
                    sample.perforator,
                    other.perforator,
                    "Conexión",
                  ],
                ].map(([label, value, otherValue, short]) => (
                  <div key={label as string}>
                    <small>{short}</small>
                    <output aria-label={label as string}>
                      {busy ? "—" : (value as number).toFixed(3)}
                      <span> u.r.</span>
                    </output>
                    {compare && (
                      <small className="comparison-readout">
                        B {(otherValue as number).toFixed(3)}
                      </small>
                    )}
                  </div>
                ))}
              </div>
              <div className="experiment-chart">
                <div className="chart-heading">
                  <div className="segmented">
                    {[
                      ["flow", "Flujo"],
                      ["pressure", "Presión"],
                      ["volume", "Volumen"],
                    ].map(([id, label]) => (
                      <button
                        key={id}
                        aria-pressed={metric === id}
                        className={metric === id ? "active" : ""}
                        onClick={() => setMetric(id as Metric)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <button
                    className="icon-button"
                    aria-label="Exportar curvas CSV"
                    disabled={busy}
                    onClick={exportData}
                  >
                    <Download size={15} />
                  </button>
                </div>
                <div className="chart-channel">
                  <span>
                    {compare ? (
                      <span
                        className="curve-keys"
                        aria-label="A línea roja continua; B línea azul punteada"
                      >
                        <i />A<i />B
                      </span>
                    ) : (
                      "DISTAL"
                    )}
                  </span>
                  <button
                    aria-pressed={channel === "deep"}
                    onClick={() => setChannel("deep")}
                  >
                    Profundo
                  </button>
                  <button
                    aria-pressed={channel === "superficial"}
                    onClick={() => setChannel("superficial")}
                  >
                    Superficial
                  </button>
                </div>
                <Suspense
                  fallback={
                    <div className="chart-placeholder">Cargando curvas…</div>
                  }
                >
                  <Chart
                    a={solution}
                    b={compare ? b : undefined}
                    time={time}
                    onTime={jump}
                    metric={metric}
                    channel={channel}
                  />
                </Suspense>
                <div className="comparison-command">
                  <button
                    className={`button quiet ${compare ? "selected" : ""}`}
                    aria-pressed={compare}
                    onClick={startComparison}
                  >
                    <ArrowLeftRight size={15} />
                    {compare ? "Cerrar comparación" : "Comparar A/B"}
                  </button>
                  {compare && (
                    <select
                      aria-label="Escenario de comparación"
                      value={bId}
                      onChange={(e) => setBId(e.target.value)}
                    >
                      <option value="baseline">Referencia del modelo</option>
                      {scenarios.map((s) => (
                        <option value={s.id} key={s.id}>
                          {s.id} · {presentations[s.id].short}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="experiment-cue">
            <Info size={14} />
            <p>{error || cue}</p>
            <details className="workbench-method">
              <summary>Modelo y fuentes</summary>
              <div>
                <h3>{active.title}</h3>
                <p>{active.focus}</p>
                <p>
                  Cuatro compartimentos y unidades relativas. Los trazadores
                  siguen el flujo calculado; el calibre representa volumen a
                  longitud fija. Valvas, músculo y postura son esquemas, sin
                  calibración individual ni validación biomecánica.
                </p>
                <References
                  ids={[
                    "uiphemodynamics",
                    "esvs2022",
                    "keijsers2015",
                    "ferlito2026",
                  ]}
                />
                <Link to="/fuentes#modelo">
                  Ecuaciones y límites del modelo ↗
                </Link>
              </div>
            </details>
          </div>
        </div>
        <ControlsPanel
          parameters={p}
          update={update}
          reset={() => select(scenario)}
          open={controlsOpen}
          setOpen={setControlsOpen}
        />
      </div>
    </section>
  );
}
