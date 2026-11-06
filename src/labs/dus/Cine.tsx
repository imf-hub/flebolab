import { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Repeat,
  Plus,
  Minus,
  Maximize2,
  Clock,
  LockKeyhole,
} from "lucide-react";
import {
  AnnotationLayer,
  AnnotationTools,
  useAnnotations,
} from "../../shared/Annotations";
import { fullscreen } from "../../shared/utils";
export default function Cine({
  clip,
  compact = false,
  sharedPlaying,
  sharedPhase,
  onPhase,
}: {
  clip: any;
  compact?: boolean;
  sharedPlaying?: boolean;
  sharedPhase?: number;
  onPhase?: (v: number) => void;
}) {
  const video = useRef<HTMLVideoElement>(null),
    box = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false),
    [frame, setFrame] = useState(0),
    [still, setStill] = useState(false),
    [loop, setLoop] = useState(true),
    [speed, setSpeed] = useState(1),
    [zoom, setZoom] = useState(1),
    [tool, setTool] = useState("pan"),
    [marksStart, setMarksStart] = useState<number | null>(null),
    [marksEnd, setMarksEnd] = useState<number | null>(null),
    [error, setError] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 }),
    [loopInterval, setLoopInterval] = useState(false);
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(
    null,
  );
  const ann = useAnnotations(clip.id);
  const count = clip.frameCount;
  const time = (frame * clip.frameTimeMs) / 1000;
  const atlas = clip.frameAtlases?.find(
    (a: any) => frame >= a.startFrame && frame < a.startFrame + a.count,
  );
  const tile = atlas ? frame - atlas.startFrame : 0;
  const indexed = !!atlas || clip.frameFiles?.length > 0;
  useEffect(() => {
    setFrame(0);
    setPlaying(false);
    setStill(false);
    setMarksStart(null);
    setMarksEnd(null);
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setLoopInterval(false);
    setError(false);
  }, [clip.id]);
  useEffect(() => {
    if (sharedPlaying !== undefined) {
      setPlaying(sharedPlaying);
      if (sharedPlaying) {
        setStill(false);
        video.current?.play().catch(() => setPlaying(false));
      } else video.current?.pause();
    }
  }, [sharedPlaying]);
  useEffect(() => {
    if (sharedPhase !== undefined && video.current)
      video.current.currentTime = sharedPhase * clip.duration;
  }, [sharedPhase]);
  useEffect(() => {
    if (video.current) video.current.playbackRate = speed;
  }, [speed]);
  const toggle = () => {
    if (!video.current) return;
    if (playing) {
      video.current.pause();
      setPlaying(false);
    } else {
      setStill(false);
      video.current.currentTime = time;
      video.current
        .play()
        .then(() => setPlaying(true))
        .catch(() => setError(true));
    }
  };
  const seek = (f: number, exact = true) => {
    const n = Math.max(0, Math.min(count - 1, Math.round(f)));
    setFrame(n);
    video.current?.pause();
    setPlaying(false);
    setStill(exact && indexed);
    if (video.current) video.current.currentTime = n / clip.fps;
    onPhase?.(n / count);
  };
  return (
    <div
      className="cine-player"
      ref={box}
      tabIndex={0}
      onKeyDown={(e) => {
        if (
          (e.target as HTMLElement).tagName === "INPUT" ||
          (e.target as HTMLElement).tagName === "SELECT"
        )
          return;
        if (e.key === " ") {
          e.preventDefault();
          toggle();
        }
        if (e.key === "ArrowRight") {
          e.preventDefault();
          seek(frame + 1);
        }
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          seek(frame - 1);
        }
      }}
    >
      <AnnotationTools
        tool={tool}
        setTool={(s) => {
          setTool(s);
          if (s !== "pan") {
            video.current?.pause();
            setPlaying(false);
            seek(frame);
          }
        }}
        {...ann}
      />
      <div
        className="cine-image"
        style={{
          aspectRatio: `${clip.width}/${clip.height}`,
          maxWidth: Math.round((580 * clip.width) / clip.height),
          margin: "0 auto",
          touchAction: zoom > 1 ? "none" : "auto",
        }}
        onPointerDown={(e) => {
          if (
            tool !== "pan" ||
            zoom <= 1 ||
            (e.target as HTMLElement).closest("button")
          )
            return;
          drag.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y };
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (d)
            setPan({
              x: Math.max(-200, Math.min(200, d.px + e.clientX - d.x)),
              y: Math.max(-200, Math.min(200, d.py + e.clientY - d.y)),
            });
        }}
        onPointerUp={() => (drag.current = null)}
      >
        <div
          className="cine-image-transform"
          style={{
            transform: `translate(${pan.x}px,${pan.y}px) scale(${zoom})`,
          }}
        >
          <video
            ref={video}
            src={clip.video}
            poster={clip.poster}
            preload="metadata"
            playsInline
            loop={loop}
            onTimeUpdate={(e) => {
              if (!still)
                setFrame(
                  Math.min(
                    count - 1,
                    Math.floor(e.currentTarget.currentTime * clip.fps),
                  ),
                );
              if (
                loopInterval &&
                marksStart !== null &&
                marksEnd !== null &&
                e.currentTarget.currentTime >=
                  Math.max(marksStart, marksEnd) / clip.fps
              )
                e.currentTarget.currentTime =
                  Math.min(marksStart, marksEnd) / clip.fps;
            }}
            onEnded={() => {
              if (!loop) setPlaying(false);
            }}
            onError={() => setError(true)}
            aria-label={`Cine real: ${clip.segment}`}
          />
          {still && atlas ? (
            <div
              className="atlas-frame"
              role="img"
              aria-label={`Cuadro ${frame + 1} de ${count}`}
              style={{
                backgroundImage: `url(${atlas.src})`,
                backgroundSize: `${atlas.columns * 100}% ${atlas.rows * 100}%`,
                backgroundPosition: `${((tile % atlas.columns) / (atlas.columns - 1)) * 100}% ${(Math.floor(tile / atlas.columns) / (atlas.rows - 1)) * 100}%`,
              }}
            />
          ) : still && clip.frameFiles?.[frame] ? (
            <img
              className="single-frame"
              src={clip.frameFiles[frame]}
              alt={`Cuadro ${frame + 1}`}
            />
          ) : null}
          <AnnotationLayer
            marks={ann.marks}
            tool={tool}
            onAdd={ann.add}
            viewBox={`0 0 ${clip.width} ${clip.height}`}
          />
        </div>
        <div className="cine-hud">
          <span>
            CINE REAL · {clip.site} ·{" "}
            {clip.side === "L" ? "IZQUIERDO" : "DERECHO"}
          </span>
          <span>
            {still && indexed ? "CUADRO INDEXADO" : "REPRODUCCIÓN"} {frame + 1}/
            {count}
          </span>
        </div>
        {error && (
          <div className="media-error">
            No se pudo cargar el cine.{" "}
            <button
              onClick={() => {
                setError(false);
                video.current?.load();
              }}
            >
              Reintentar
            </button>
          </div>
        )}
        <div className="zoom-tools">
          <button
            aria-label="Ampliar cine"
            onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
          >
            <Plus size={16} />
          </button>
          <button
            aria-label="Reducir cine"
            onClick={() => setZoom((z) => Math.max(1, z - 0.25))}
          >
            <Minus size={16} />
          </button>
          <button
            aria-label="Restaurar ampliación"
            onClick={() => {
              setZoom(1);
              setPan({ x: 0, y: 0 });
            }}
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>
      <div className="player-bar">
        <button
          className="round-button"
          aria-label={playing ? "Pausar cine" : "Reproducir cine"}
          onClick={toggle}
        >
          {playing ? <Pause size={17} /> : <Play size={17} />}
        </button>
        <button
          className="icon-button"
          title="Cuadro anterior (←)"
          aria-label="Cuadro anterior"
          onClick={() => seek(frame - 1)}
        >
          <SkipBack size={15} />
        </button>
        <button
          className="icon-button"
          title="Cuadro siguiente (→)"
          aria-label="Cuadro siguiente"
          onClick={() => seek(frame + 1)}
        >
          <SkipForward size={15} />
        </button>
        <input
          type="range"
          aria-label="Cuadro del cine"
          min={0}
          max={count - 1}
          step={1}
          value={frame}
          onChange={(e) => seek(+e.target.value)}
        />
        <span className="mono">{time.toFixed(2)}s</span>
        <select
          aria-label="Velocidad del cine"
          value={speed}
          onChange={(e) => setSpeed(+e.target.value)}
        >
          {[0.25, 0.5, 1, 1.5, 2].map((s) => (
            <option key={s} value={s}>
              {s}×
            </option>
          ))}
        </select>
        <button
          className={`icon-button ${loop ? "selected" : ""}`}
          aria-label="Repetir cine"
          onClick={() => setLoop(!loop)}
        >
          <Repeat size={15} />
        </button>
        <button
          className="icon-button"
          aria-label="Pantalla completa del cine"
          onClick={() => fullscreen(box.current)}
        >
          <Maximize2 size={15} />
        </button>
      </div>
      {!compact && (
        <div className="measurement-bar">
          <Clock size={15} />
          <span>Intervalo entre cuadros</span>
          <button onClick={() => setMarksStart(frame)}>
            A{" "}
            {marksStart === null
              ? "—"
              : (marksStart / clip.fps).toFixed(2) + "s"}
          </button>
          <button onClick={() => setMarksEnd(frame)}>
            B {marksEnd === null ? "—" : (marksEnd / clip.fps).toFixed(2) + "s"}
          </button>
          <b>
            {marksStart !== null && marksEnd !== null
              ? `Δ ${(Math.abs(marksEnd - marksStart) / clip.fps).toFixed(3)} s`
              : "Sitúa A y B"}
          </b>
          <button
            disabled={
              marksStart === null ||
              marksEnd === null ||
              marksStart === marksEnd
            }
            className={loopInterval ? "selected" : ""}
            onClick={() => {
              setLoopInterval(!loopInterval);
              if (video.current && marksStart !== null && marksEnd !== null)
                video.current.currentTime =
                  Math.min(marksStart, marksEnd) / clip.fps;
            }}
            aria-label="Repetir intervalo A B"
          >
            {loopInterval ? "A–B activado" : "Repetir A–B"}
          </button>
          <span
            title="Sin calibración espacial validada"
            className="disabled-measure"
          >
            <LockKeyhole size={12} />
            mm / cm/s
          </span>
        </div>
      )}
      <div className="viewer-caption">
        <span>{clip.fps.toFixed(2)} cuadros/s · Tiempo DICOM verificado</span>
        <span>
          {clip.width} × {clip.height}px
        </span>
      </div>
    </div>
  );
}
