import {
  useEffect,
  useRef,
  useState,
  useCallback,
  lazy,
  Suspense,
} from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  Pause,
  Play,
  RotateCcw,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Subtitles,
  Download,
  Focus,
  Check,
  Headphones,
  BookOpen,
} from "lucide-react";
import { useReducedMotion } from "motion/react";
import { lessons, narrations, groups } from "./catalog";
import { locateTime, captionAt, formatTime, visualTimeline } from "./timeline";
import { useNarration } from "./useNarration";
import type { Lesson, Narration, CameraGuide } from "./types";
import { scenarioParameters } from "../labs/twin/scenarioConfig";
import { References } from "../shared/References";
import { assetUrl } from "../shared/assets";
import { readLocal, saveLocal } from "../shared/utils";
import "./learning.css";
const Twin = lazy(() => import("./TwinPresentation")),
  Doppler = lazy(() => import("./DopplerPresentation")),
  Vision = lazy(() => import("./VisionPresentation")),
  Cine = lazy(() => import("./CinePresentation"));
export default function GuidedLesson() {
  const { id } = useParams(),
    lesson = lessons.find((l) => l.id === id);
  if (!lesson)
    return (
      <section className="container library-page">
        <h1>Elige una explicación</h1>
        <Link to="/aprender">Abrir el aula visual</Link>
      </section>
    );
  return <Player key={lesson.id} lesson={lesson} />;
}
function Player({ lesson }: { lesson: Lesson }) {
  const [mediaReady, setMediaReady] = useState(false);
  const markReady = useCallback(() => setMediaReady(true), []);
  useEffect(() => {
    document.title = `${lesson.title} · Aula visual · FLEBO LAB IMF`;
  }, [lesson.id]);
  const original = narrations[lesson.id];
  const narration: Narration = original ?? visualTimeline(lesson);
  const cameraCut = useRef<number | null>(null);
  const modelTime = useRef(0),
    guide = useRef<CameraGuide>({
      enabled: true,
      from: "overview",
      to: "overview",
      progress: 0,
    }),
    [manual, setManual] = useState(false),
    [subtitles, setSubtitles] = useState(true),
    [reviewed, setReviewed] = useState(
      readLocal<string[]>("flebo-guided-reviewed", []),
    ),
    reduced = useReducedMotion();
  const frame = (t: number) => {
    const p = locateTime(t, lesson, narration);
    if (cameraCut.current !== p.index) cameraCut.current = null;
    const snap = reduced || cameraCut.current === p.index;
    modelTime.current =
      p.phase *
      (["twin", "anatomy"].includes(lesson.group)
        ? scenarioParameters(p.stage.scenario ?? "TW03").period
        : 6);
    guide.current.from = snap
      ? p.stage.shot
      : (lesson.stages[Math.max(0, p.index - 1)]?.shot ?? "overview");
    guide.current.to = p.stage.shot;
    guide.current.progress = snap ? 1 : p.progress;
  };
  const clock = useNarration(narration, frame),
    current = locateTime(clock.time, lesson, narration),
    { index, stage, phase } = current;
  const cameraInput = () => {
    clock.pause();
    guide.current.enabled = false;
    setManual(true);
  };
  const follow = (take = index) => {
    cameraCut.current = take;
    guide.current.from = lesson.stages[take].shot;
    guide.current.to = lesson.stages[take].shot;
    guide.current.progress = 1;
    guide.current.enabled = true;
    setManual(false);
  };
  const siblings = lessons.filter((l) => l.group === lesson.group),
    position = siblings.findIndex((l) => l.id === lesson.id);
  const go = (i: number) => {
    const take = Math.max(0, Math.min(3, i));
    cameraCut.current = take;
    clock.seek(narration.stages[take].start);
    follow(take);
  };
  const jump = (t: number) => {
    const take = locateTime(t, lesson, narration).index;
    cameraCut.current = take;
    clock.seek(t);
    follow(take);
  };
  const mark = () => {
    const next = reviewed.includes(lesson.id)
      ? reviewed.filter((id) => id !== lesson.id)
      : [...reviewed, lesson.id];
    setReviewed(next);
    saveLocal("flebo-guided-reviewed", next);
  };
  const caption = captionAt(clock.time, narration);
  return (
    <section className="guided-page" data-lesson={lesson.id} data-stage={index}>
      <header className="guided-heading">
        <Link
          to="/aprender"
          className="guided-back"
          aria-label="Todas las explicaciones"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <span className="eyebrow">
            {groups.find((g) => g.id === lesson.group)?.name} / {lesson.id}
          </span>
          <h1>{lesson.title}</h1>
        </div>
        <Link className="button secondary" to={lesson.explore}>
          Explorar laboratorio
          <ArrowUpRight size={15} />
        </Link>
      </header>
      <div className="guided-layout">
        <aside className="guided-chapters">
          <div className="guided-section-label">
            <Headphones size={14} />
            <span>SECUENCIA GUIADA</span>
            <b>04</b>
          </div>
          {lesson.stages.map((s, i) => (
            <button
              key={s.title}
              className={i === index ? "active" : ""}
              aria-pressed={i === index}
              onClick={() => go(i)}
            >
              <span>{String(i + 1).padStart(2, "0")}</span>
              <div>
                <b>{s.title}</b>
                <small>{formatTime(narration.stages[i].start)}</small>
              </div>
              {i === index && <i />}
            </button>
          ))}
          <div className="guided-chapter-bottom">
            <span>Otra explicación</span>
            <select
              aria-label="Seleccionar explicación"
              value={lesson.id}
              onChange={(e) => {
                location.hash = `/aprender/${e.target.value}`;
              }}
            >
              {lessons.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.id} · {l.title}
                </option>
              ))}
            </select>
            <div>
              {position > 0 && (
                <Link to={`/aprender/${siblings[position - 1].id}`}>
                  ← Anterior
                </Link>
              )}
              {position < siblings.length - 1 && (
                <Link to={`/aprender/${siblings[position + 1].id}`}>
                  Siguiente →
                </Link>
              )}
            </div>
          </div>
        </aside>
        <div className="guided-center">
          <div className="guided-stage-heading">
            <span>
              {lesson.group === "vision"
                ? "FOTOGRAFÍA REAL Y CLASIFICACIÓN"
                : lesson.group === "cine"
                  ? "ADQUISICIÓN ORIGINAL"
                  : lesson.id === "DP09"
                    ? "RECURSO EXPERIMENTAL"
                    : "MECANISMO Y CONSECUENCIA"}
            </span>
            {["twin", "anatomy"].includes(lesson.group) && (
              <button
                onClick={() => follow()}
                className={manual ? "manual-camera" : ""}
              >
                <Focus size={13} />
                {manual ? "Recuperar cámara guiada" : "Cámara guiada"}
              </button>
            )}
          </div>
          <details className="guided-compact-context">
            <summary>Texto y fuentes</summary>
            <div>
              <h3>{stage.title}</h3>
              <p>{stage.spoken}</p>
              <References ids={lesson.sourceIds} />
              <div className="guided-compact-downloads">
                <a href={assetUrl(`/media/guides/${lesson.id}.json`)} download>
                  Guion y storyboard
                </a>
                {original && (
                  <>
                    <a href={assetUrl(narration.audio)} download>
                      Audio
                    </a>
                    <a href={assetUrl(narration.vtt)} download>
                      Subtítulos
                    </a>
                  </>
                )}
              </div>
            </div>
          </details>
          <div className="guided-visual">
            <Suspense
              fallback={
                <div className="loading">Preparando la explicación…</div>
              }
            >
              {lesson.group === "twin" || lesson.group === "anatomy" ? (
                <Twin
                  lesson={lesson}
                  stage={stage}
                  timeRef={modelTime}
                  phase={phase}
                  guide={guide}
                  onCameraInput={cameraInput}
                  onReady={markReady}
                />
              ) : lesson.group === "vision" ? (
                <Vision stage={stage} onReady={markReady} />
              ) : lesson.group === "cine" || lesson.id === "DP09" ? (
                <Cine
                  stage={stage}
                  phase={phase}
                  experimental={lesson.id === "DP09"}
                  onReady={markReady}
                />
              ) : (
                <Doppler
                  id={lesson.id}
                  stage={stage}
                  phase={phase}
                  timeRef={modelTime}
                  onReady={markReady}
                />
              )}
            </Suspense>
          </div>
          {subtitles && (
            <div
              className="guided-subtitle"
              aria-label="Subtítulo de la explicación"
            >
              <span>
                {clock.time === 0
                  ? "LISTO PARA COMENZAR"
                  : `TOMA ${index + 1} / 4`}
              </span>
              <p>
                {caption ||
                  (clock.time === 0
                    ? "Pulsa reproducir para comenzar. También puedes elegir una toma."
                    : "Pausa para observar el resultado.")}
              </p>
            </div>
          )}
          <div className="guided-player">
            <button
              className="guided-play"
              aria-label={
                clock.playing
                  ? "Pausar explicación"
                  : original
                    ? "Reproducir explicación"
                    : "Reproducir guía visual"
              }
              onClick={clock.toggle}
              disabled={!mediaReady}
            >
              {clock.playing ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button
              className="icon-button"
              aria-label="Reiniciar explicación"
              onClick={() => jump(0)}
            >
              <RotateCcw size={16} />
            </button>
            <input
              type="range"
              aria-label="Tiempo de la explicación"
              min="0"
              max={narration.duration}
              step=".1"
              value={clock.time}
              onChange={(e) => jump(+e.target.value)}
            />
            <output
              aria-label={
                original ? "Tiempo narrado" : "Tiempo de la guía visual"
              }
            >
              {formatTime(clock.time)}
              <small> / {formatTime(narration.duration)}</small>
            </output>
            <button
              className="icon-button"
              aria-label={clock.muted ? "Activar voz" : "Silenciar voz"}
              aria-pressed={clock.muted}
              onClick={clock.toggleMute}
              disabled={!original}
            >
              {clock.muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
            </button>
            <button
              className={`icon-button ${subtitles ? "selected" : ""}`}
              aria-label={subtitles ? "Ocultar subtítulos" : "Mostrar subtítulos"}
              aria-pressed={subtitles}
              onClick={() => setSubtitles(!subtitles)}
            >
              <Subtitles size={18} />
            </button>
          </div>
          <div className="guided-status">
            <span>
              {clock.error ||
                (!mediaReady
                  ? "Preparando el recurso visual…"
                  : !original
                    ? clock.playing
                      ? "Guía visual en curso · sin voz · tiempos de lectura"
                      : "Guía visual sin voz · reproducir o elegir una toma"
                    : clock.waiting
                      ? "Cargando audio…"
                      : clock.playing
                        ? "Narración en curso · 1×"
                        : "Pausado · puedes girar, observar o elegir otra toma")}
            </span>
            <div>
              <button
                disabled={index === 0}
                onClick={() => go(index - 1)}
                aria-label="Toma anterior"
              >
                <SkipBack size={13} />
              </button>
              <button
                disabled={index === 3}
                onClick={() => go(index + 1)}
                aria-label="Toma siguiente"
              >
                <SkipForward size={13} />
              </button>
            </div>
          </div>
        </div>
        <aside className="guided-inspector">
          <span className="eyebrow">
            {String(index + 1).padStart(2, "0")} / OBSERVA Y RELACIONA
          </span>
          <h2>{stage.title}</h2>
          <p className="guided-spoken">{stage.spoken}</p>
          <div className="guided-objective">
            <BookOpen size={16} />
            <div>
              <b>Al terminar</b>
              <p>{lesson.objective}</p>
            </div>
          </div>
          <details className="guided-sources">
            <summary>Fuentes y contexto médico</summary>
            <References ids={lesson.sourceIds} />
            <p>
              Modelo docente, esquema sintético y material de origen se
              identifican en cada vista. La explicación no sustituye evaluación
              clínica.
            </p>
          </details>
          <details className="guided-resources">
            <summary>
              <Download size={13} />
              Guion, audio y subtítulos
            </summary>
            <a href={assetUrl(`/media/guides/${lesson.id}.json`)} download>
              Guion y storyboard · JSON
            </a>
            {original ? (
              <>
                <a href={assetUrl(narration.audio)} download>
                  Audio MP3 · Rocío
                </a>
                <a href={assetUrl(narration.vtt)} download>
                  Subtítulos WebVTT
                </a>
                <a href={assetUrl(narration.package)} download>
                  Guion y tiempos editables
                </a>
                <small>
                  Voz en español · reproducción 1× · versión{" "}
                  {narration.sha256.slice(0, 8)}
                </small>
              </>
            ) : (
              <small>
                El texto de las cuatro tomas está disponible en los pasos.
              </small>
            )}
          </details>
          <button
            className={`button quiet guided-reviewed ${reviewed.includes(lesson.id) ? "selected" : ""}`}
            aria-pressed={reviewed.includes(lesson.id)}
            onClick={mark}
          >
            <Check size={14} />
            {reviewed.includes(lesson.id)
              ? "Marcada como revisada"
              : "Marcar como revisada"}
          </button>
          <small className="guided-local-note">
            Registro personal en este navegador. No acredita competencia
            clínica.
          </small>
        </aside>
      </div>
    </section>
  );
}
