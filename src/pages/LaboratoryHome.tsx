import { lazy, Suspense, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  ArrowRight,
  Play,
  Pause,
  Activity,
  ScanLine,
  Focus,
  MoveUpRight,
} from "lucide-react";
import { scenarioParameters, presentations } from "../labs/twin/scenarioConfig";
import { useSolution, useModelClock } from "../labs/twin/useSimulation";
import { sampleAt } from "../labs/twin/transport";
import { assetUrl } from "../shared/assets";
import landing from "../data/landing.json";
const Scene = lazy(() => import("../labs/twin/VenousScene"));
export default function LaboratoryHome() {
  const [experiment, setExperiment] = useState("TW06"),
    [hovered, setHovered] = useState(false);
  const p = useMemo(() => scenarioParameters(experiment), [experiment]),
    { solution, busy } = useSolution(p),
    clock = useModelClock(p.period),
    config = presentations[experiment];
  const sample = sampleAt(solution, clock.time),
    signal = useMemo(() => {
      const values = solution.samples.map((s) => s.flow),
        min = Math.min(...values),
        max = Math.max(...values);
      return solution.samples
        .filter((_, i) => i % 4 === 0)
        .map(
          (s) =>
            `${(s.t / (p.period * 2)) * 210},${40 - ((s.flow - min) / Math.max(0.01, max - min)) * 34}`,
        )
        .join(" ");
    }, [solution]);
  return (
    <div className="laboratory-home">
      <section className="kinetic-hero">
        <div className="hero-coordinate">
          IMF — MÉXICO <span>LABORATORIOS DIGITALES / 2026</span>
        </div>
        <div className="hero-copy">
          <motion.div
            className="hero-tag"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <i className="status-dot" /> FLEBOLOGÍA EN OTRA DIMENSIÓN
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08 }}
          >
            Explora el
            <br />
            <span>retorno venoso.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            Toca una variable. Sigue el flujo.
            <br />
            Comprende lo que cambia.
          </motion.p>
          <div className="hero-actions">
            <Link
              className="button primary"
              to={`/flebotwin?scenario=${experiment}`}
            >
              <Play size={15} /> Entrar al laboratorio{" "}
              <ArrowUpRight size={16} />
            </Link>
            <Link className="hero-text-link" to="/flebodus">
              Explorar cine real <ArrowRight size={15} />
            </Link>
          </div>
          <div className="hero-experiments">
            <span>PRUEBA AQUÍ</span>
            {[
              ["TW06", "Válvulas"],
              ["TW03", "Bomba"],
              ["TW02", "Gravedad"],
            ].map(([id, label]) => (
              <button
                key={id}
                className={experiment === id ? "active" : ""}
                aria-pressed={experiment === id}
                onClick={() => {
                  setExperiment(id);
                  clock.seek(0);
                }}
              >
                {label}
                {experiment === id && <motion.i layoutId="hero-active" />}
              </button>
            ))}
          </div>
        </div>
        <div className="hero-interactive">
          <div className="orbital-label">
            <span>01 — FLEBOTWIN / {config.short}</span>
            <b>LIVE 3D</b>
          </div>
          <Suspense
            fallback={
              <div className="hero-3d-loading">
                <span className="loading-orbit" />
                Iniciando el laboratorio…
              </div>
            }
          >
            <Scene
              mode={config.view}
              solution={solution}
              timeRef={clock.timeRef}
              focus={config.focus}
              hero
            />
          </Suspense>
          <div className="hero-instrument">
            <div>
              <small>{busy ? "CALCULANDO" : "FLUJO CALCULADO"}</small>
              <output>
                {sample.flow.toFixed(3)}
                <span> u.r.</span>
              </output>
              <span className="instrument-state">
                {sample.flow < 0
                  ? "Inversión del flujo"
                  : "Sentido de referencia"}
              </span>
            </div>
            <svg
              viewBox="0 0 210 48"
              role="img"
              aria-label="Curva del flujo del modelo"
            >
              <polyline
                points={signal}
                fill="none"
                stroke="var(--red)"
                strokeWidth="1.5"
              />
            </svg>
            <button
              className="icon-button"
              aria-label={
                clock.playing
                  ? "Pausar demostración"
                  : "Reproducir demostración"
              }
              onClick={() => clock.setPlaying(!clock.playing)}
            >
              {clock.playing ? <Pause size={15} /> : <Play size={15} />}
            </button>
          </div>
          <span className="hero-precision">
            MODELO EDUCATIVO · UNIDADES RELATIVAS · ARRASTRA PARA ROTAR
          </span>
        </div>
      </section>
      <section className="lab-launchpad" aria-label="Seleccionar laboratorio">
        <div className="launchpad-heading">
          <span>ELIGE TU PERSPECTIVA</span>
          <b>
            03 LABORATORIOS <span>↙</span>
          </b>
        </div>
        <div className="launchpad-grid">
          <Link className="launch-card twin-launch" to="/flebotwin">
            <div className="launch-card-top">
              <span>01 / HEMODINÁMICA</span>
              <Activity size={19} />
            </div>
            <h2>
              FleboTwin
              <ArrowUpRight />
            </h2>
            <p>Modifica. Observa. Compara.</p>
            <div className="launch-signal">
              <svg viewBox="0 0 210 48" aria-hidden="true">
                <polyline
                  points={signal}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
              <span>12 experimentos interactivos</span>
            </div>
          </Link>
          <Link
            className="launch-card dus-launch"
            to={`/flebodus?case=${landing.cine.id}`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onFocus={() => setHovered(true)}
            onBlur={() => setHovered(false)}
          >
            <img
              className="launch-media"
              src={assetUrl(landing.cine.poster)}
              alt="Cine real de compresión venosa"
            />
            {hovered && (
              <video
                className="launch-media"
                src={assetUrl(landing.cine.video)}
                autoPlay
                muted
                loop
                playsInline
              />
            )}
            <div className="launch-card-top">
              <span>02 / ECOGRAFÍA</span>
              <ScanLine size={19} />
            </div>
            <h2>
              FleboDUS
              <ArrowUpRight />
            </h2>
            <p>El movimiento, cuadro a cuadro.</p>
            <small>72 cines reales · 10 fundamentos Doppler</small>
          </Link>
          <Link
            className="launch-card vision-launch"
            to={`/flebovision?case=${landing.photo.id}`}
          >
            <img
              className="launch-media"
              src={assetUrl(landing.photo.image)}
              alt="Fotografía clínica del banco abierto TRICVI–C"
              loading="lazy"
            />
            <div className="launch-card-top">
              <span>03 / OBSERVACIÓN CLÍNICA</span>
              <Focus size={19} />
            </div>
            <h2>
              FleboVision
              <ArrowUpRight />
            </h2>
            <p>La diferencia está en el detalle.</p>
            <small>96 vistas · Zoom · Anotaciones · Comparación</small>
          </Link>
        </div>
      </section>
      <div className="home-footnote">
        <span>DISEÑADO PARA EXPLORAR. FUNDAMENTADO PARA APRENDER.</span>
        <Link to="/bibliografia">
          La evidencia detrás de cada experiencia <MoveUpRight size={13} />
        </Link>
      </div>
    </div>
  );
}
