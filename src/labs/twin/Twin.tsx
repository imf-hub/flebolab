import { lazy, Suspense, useMemo, useState, useRef, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  Play,
  Pause,
  RotateCcw,
  Download,
  ArrowLeftRight,
  Bookmark,
  Check,
  Activity,
  SlidersHorizontal,
  Layers3,
  Network,
  Maximize2,
  Info,
  ChevronDown,
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
import { Range, Note, ShareButton } from "../../shared/UI";
import { References } from "../../shared/References";
import { download, readLocal, saveLocal, fullscreen } from "../../shared/utils";
import Circuit from "./Circuit";
const Scene = lazy(() => import("./VenousScene"));
const Chart = lazy(() => import("./Chart"));
export default function Twin() {
  const [query, setQuery] = useSearchParams(),
    key = query.toString();
  const state = useMemo(() => parseTwinQuery(query), [key]);
  const pKey = JSON.stringify(state.parameters),
    p = useMemo(() => state.parameters, [pKey]);
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
    [controlsOpen, setControlsOpen] = useState(false),
    [saved, setSaved] = useState(
      readLocal<string[]>("flebo-twin-favorites", []),
    );
  const clock = useModelClock(p.period),
    { time, timeRef, seek, playing, setPlaying } = clock;
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
  useEffect(() => {
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
    setControlsOpen(false);
    setQuery({ scenario: id });
  };
  const update = (name: keyof Parameters, value: number | boolean) =>
    setQuery(
      {
        scenario,
        p: JSON.stringify(sanitize({ ...p, [name]: value })),
        view: mode,
      },
      { replace: true },
    );
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
  return (
    <section className="twin-studio" data-scenario={scenario} data-view={mode}>
      <header className="studio-heading">
        <div>
          <span className="eyebrow">
            <i className="status-dot" /> LAB 01 / HEMODINÁMICA
          </span>
          <h1>
            FleboTwin<span>Explora el mecanismo.</span>
          </h1>
        </div>
        <div className="button-row">
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
            Fuentes médicas <span>↗</span>
          </Link>
        </aside>
        <div className="experiment-stage">
          <div className="experiment-title">
            <div>
              <span className="eyebrow">
                {scenario}{" "}
                {state.custom
                  ? " / PERSONALIZADO"
                  : " / PERFIL DEL EXPERIMENTO"}
              </span>
              <AnimatePresence mode="wait">
                <motion.h2
                  key={scenario}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.16 }}
                >
                  {config.short}
                </motion.h2>
              </AnimatePresence>
            </div>
            <div className="button-row">
              <button
                className={`icon-button ${saved.includes(scenario) ? "selected" : ""}`}
                aria-label="Guardar escenario"
                onClick={favorite}
              >
                <Bookmark size={16} />
              </button>
              <button
                className={`button quiet ${controlsOpen ? "selected" : ""}`}
                aria-expanded={controlsOpen}
                onClick={() => setControlsOpen(!controlsOpen)}
              >
                <SlidersHorizontal size={15} /> Ajustar
              </button>
            </div>
          </div>
          <div
            className="experiment-view-tabs"
            role="group"
            aria-label="Vista del experimento"
          >
            {[
              ["flow", "Red y flujo", Network],
              ["valve", "Válvula", Activity],
              ["anatomy", "Anatomía", Layers3],
              ["circuit", "Circuito", Network],
            ].map(([id, label, Icon]: any) => (
              <button
                key={id}
                className={mode === id ? "active" : ""}
                aria-pressed={mode === id}
                onClick={() => setMode(id)}
              >
                <Icon size={14} />
                {label}
                {mode === id && (
                  <motion.i layoutId="view-active" className="view-active" />
                )}
              </button>
            ))}
            <span className="model-live">
              <i className="status-dot" />
              {busy ? "Calculando" : playing ? "En movimiento" : "Pausado"}
            </span>
          </div>
          <div
            className={`experiment-viewport ${compare ? "is-comparing" : ""}`}
            aria-busy={busy || (compare && bBusy)}
          >
            <div className="viewport-cell">
              {compare && (
                <span className="comparison-label">A / {config.short}</span>
              )}
              {mode === "circuit" ? (
                <Circuit solution={solution} time={time} />
              ) : (
                <Suspense
                  fallback={
                    <div className="scene-wrap loading">
                      <span className="loading-orbit" />
                      Preparando el visor 3D…
                    </div>
                  }
                >
                  <Scene
                    mode={mode}
                    solution={solution}
                    timeRef={timeRef}
                    focus={config.focus}
                    cameraPose={compare ? cameraPose : undefined}
                  />
                </Suspense>
              )}
            </div>
            {compare && (
              <div className="viewport-cell">
                <span className="comparison-label">
                  B / {presentations[bId]?.short ?? "Referencia"}
                </span>
                {mode === "circuit" ? (
                  <Circuit solution={b} time={time} />
                ) : (
                  <Suspense
                    fallback={
                      <div className="scene-wrap loading">
                        Preparando comparación…
                      </div>
                    }
                  >
                    <Scene
                      mode={mode}
                      solution={b}
                      timeRef={timeRef}
                      focus={config.focus}
                      cameraPose={cameraPose}
                    />
                  </Suspense>
                )}
              </div>
            )}
            {(busy || (compare && bBusy)) && (
              <div className="calculation-overlay">
                <span className="loading-orbit" />
                Actualizando el modelo
              </div>
            )}
            <AnimatePresence>
              {controlsOpen && (
                <motion.aside
                  className="experiment-controls"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="panel-heading">
                    <b>Modifica una condición</b>
                    <button
                      className="icon-button"
                      aria-label="Cerrar ajustes"
                      onClick={() => setControlsOpen(false)}
                    >
                      ×
                    </button>
                  </div>
                  <Range
                    label="Postura"
                    value={p.posture}
                    max={90}
                    step={1}
                    display={`${p.posture}°`}
                    onChange={(n) => update("posture", n)}
                  />
                  <Range
                    label="Activación de bomba"
                    value={p.pump}
                    max={1.6}
                    onChange={(n) => update("pump", n)}
                  />
                  <Range
                    label="Conductancia inversa"
                    value={p.leak}
                    max={1}
                    onChange={(n) => update("leak", n)}
                  />
                  <Range
                    label="Resistencia de salida"
                    value={p.obstruction}
                    min={1}
                    max={8}
                    step={0.1}
                    onChange={(n) => update("obstruction", n)}
                  />
                  <Range
                    label="Presión exterior"
                    value={p.compression}
                    max={1.5}
                    onChange={(n) => update("compression", n)}
                  />
                  <Range
                    label="Conexión perforante"
                    value={p.perforator}
                    max={1.6}
                    onChange={(n) => update("perforator", n)}
                  />
                  <Range
                    label="Período del ciclo"
                    value={p.period}
                    min={2}
                    max={10}
                    step={0.5}
                    display={`${p.period}s`}
                    onChange={(n) => {
                      update("period", n);
                      seek(0);
                    }}
                  />
                  <label className="check-field">
                    <input
                      type="checkbox"
                      checked={p.collateral}
                      onChange={(e) => update("collateral", e.target.checked)}
                    />
                    Vía colateral
                  </label>
                  <button
                    className="button quiet"
                    onClick={() => select(scenario)}
                  >
                    <RotateCcw size={14} />
                    Restaurar experimento
                  </button>
                  <small>
                    Unidades relativas. No son ajustes de un paciente.
                  </small>
                </motion.aside>
              )}
            </AnimatePresence>
          </div>
          <div className="experiment-playback">
            <button
              className="play-button"
              aria-label={playing ? "Pausar ciclo" : "Reproducir ciclo"}
              disabled={busy || !solution.converged}
              onClick={() => setPlaying(!playing)}
            >
              {playing ? <Pause size={16} /> : <Play size={16} />}
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
              onChange={(e) => {
                setPlaying(false);
                seek(+e.target.value);
              }}
            />
            <output aria-label="Tiempo actual">
              {time.toFixed(2)} <span>/ {(p.period * 2).toFixed(1)} s</span>
            </output>
            <span className="cycle-phase">
              {sample.pump > 0.02 ? "Contracción" : "Relajación"}
            </span>
          </div>
          <div className="experiment-readouts">
            {[
              ["Flujo de rama profunda", sample.flow, other.flow],
              ["Presión distal profunda", sample.pressure, other.pressure],
              [
                "Volumen distal superficial",
                sample.superficialVolume,
                other.superficialVolume,
              ],
              ["Flujo de conexión", sample.perforator, other.perforator],
            ].map(([label, value, otherValue]) => (
              <div key={label as string}>
                <small>{label}</small>
                <output aria-label={label as string}>
                  {busy ? "—" : (value as number).toFixed(3)}
                  <span> u.r.</span>
                </output>
                {compare && (
                  <small className="comparison-readout">
                    B {(otherValue as number).toFixed(3)} u.r.
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
              <div className="button-row">
                <button
                  className={`button quiet ${compare ? "selected" : ""}`}
                  aria-pressed={compare}
                  onClick={startComparison}
                >
                  <ArrowLeftRight size={14} />
                  Comparar
                </button>
                <button
                  className="icon-button"
                  aria-label="Exportar curvas CSV"
                  disabled={busy}
                  onClick={exportData}
                >
                  <Download size={15} />
                </button>
              </div>
            </div>
            {compare && (
              <label className="comparison-select">
                Referencia B
                <select
                  aria-label="Escenario de comparación"
                  value={bId}
                  onChange={(e) => setBId(e.target.value)}
                >
                  <option value="baseline">Referencia del modelo</option>
                  {scenarios.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.id} · {presentations[s.id].short}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <div className="chart-channel">
              <span>COMPARTIMENTO DISTAL</span>
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
                onTime={(n) => {
                  setPlaying(false);
                  seek(n);
                }}
                metric={metric}
                channel={channel}
              />
            </Suspense>
          </div>
          {error && <Note>{error}</Note>}
          <div className="experiment-cue">
            <Info size={14} />
            <p>
              {mode === "anatomy"
                ? "Anatomía de referencia independiente. Abre Red y flujo o Válvula para ver el efecto del experimento."
                : state.custom
                  ? `Condiciones modificadas. La escena y las curvas usan los valores de Ajustar. Vía colateral ${p.collateral ? "activada" : "desactivada"}.`
                  : config.cue}
            </p>
            <details>
              <summary>
                Contexto y fuentes <ChevronDown size={12} />
              </summary>
              <p>{active.focus}</p>
              <p>
                Los marcadores integran flujo calculado por rama; el calibre de
                los compartimentos representa volumen relativo a longitud fija.
                Las valvas y la orientación son representaciones educativas, sin
                calibración anatómica de paciente.
              </p>
              <References
                ids={[
                  "uiphemodynamics",
                  "esvs2022",
                  "keijsers2015",
                  "ferlito2026",
                ]}
              />
              <Link to="/fuentes#modelo">Modelo, ecuaciones y límites ↗</Link>
            </details>
          </div>
        </div>
      </div>
    </section>
  );
}
