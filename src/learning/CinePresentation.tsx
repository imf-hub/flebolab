import { useEffect, useRef, useState, useId } from "react";
import clips from "../data/dus";
import waterloo from "../data/waterloo";
import type { Stage } from "./types";
export default function CinePresentation({
  stage,
  phase,
  experimental = false,
  onReady,
}: {
  stage: Stage;
  phase: number;
  experimental?: boolean;
  onReady?: () => void;
}) {
  const clipKey = useId().replace(/:/g, "");
  const [videoState, setVideoState] = useState<"loading" | "ready" | "error">(
      "loading",
    ),
    [atlases, setAtlases] = useState<Record<string, "ready" | "error">>({});
  const video = useRef<HTMLVideoElement>(null),
    videoTarget = useRef(0),
    [length, setLength] = useState(0),
    clip = clips.find((c) => c.id === stage.clipId) ?? clips[0];
  const frame = Math.max(
    0,
    Math.min(clip.frameCount - 1, Math.round(phase * (clip.frameCount - 1))),
  );
  const atlas = clip.frameAtlases?.find(
      (a) => frame >= a.startFrame && frame < a.startFrame + a.count,
    ),
    tile = atlas ? frame - atlas.startFrame : 0;
  const syncVideo = () => {
    const element = video.current;
    if (
      element &&
      !element.seeking &&
      length > 0 &&
      Math.abs(element.currentTime - videoTarget.current) > 0.025
    )
      element.currentTime = videoTarget.current;
  };
  useEffect(() => {
    videoTarget.current = Math.max(0, Math.min(length - 0.04, phase * length));
    if (experimental) syncVideo();
  }, [phase, length, experimental]);
  useEffect(() => {
    if (experimental || !atlas) return;
    // SVG image load events are inconsistent for cached resources. Observe a native image request too.
    const current = new Image();
    const ready = () => {
      setAtlases((a) =>
        a[atlas.src] === "ready" ? a : { ...a, [atlas.src]: "ready" },
      );
      onReady?.();
    };
    current.onload = ready;
    current.onerror = () => setAtlases((a) => ({ ...a, [atlas.src]: "error" }));
    current.src = atlas.src;
    if (current.complete && current.naturalWidth > 0) ready();
    const next = clip.frameAtlases?.find(
      (a) => a.startFrame === atlas.startFrame + atlas.count,
    );
    if (next) {
      const image = new Image();
      image.src = next.src;
    }
    return () => {
      current.onload = null;
      current.onerror = null;
    };
  }, [atlas?.src, experimental, clip.id, onReady]);
  if (experimental)
    return (
      <div className="guided-cine">
        <header>
          <span>WATERLOO · RENDERIZADO EXPERIMENTAL</span>
          <b>Flujo femoral</b>
        </header>
        <div className="guided-video-viewport">
          <video
            ref={video}
            src={waterloo.videoPath}
            poster={waterloo.posterPath}
            preload="auto"
            playsInline
            onLoadedMetadata={(e) => {
              const duration = e.currentTarget.duration;
              setLength(duration);
              videoTarget.current = Math.max(
                0,
                Math.min(duration - 0.04, phase * duration),
              );
              // Request a decoded paused frame, including at time zero; a poster alone is not readiness.
              e.currentTarget.currentTime = videoTarget.current;
            }}
            onSeeked={() => {
              setVideoState("ready");
              onReady?.();
              syncVideo();
            }}
            onLoadedData={() => {
              setVideoState("ready");
              onReady?.();
            }}
            onError={() => setVideoState("error")}
            data-ready={videoState === "ready"}
            aria-label="Renderizado experimental Waterloo"
          />
          {videoState !== "ready" && (
            <span className="guided-resource-loading" role="status">
              {videoState === "error"
                ? "Video no disponible. Consulta su origen en Texto y fuentes."
                : "Cargando renderizado original…"}
            </span>
          )}
        </div>
        <div className="cine-source-time">
          <span>Posición del extracto</span>
          <b>{(phase * 100).toFixed(0)}%</b>
        </div>
        <p>
          Renderizado publicado. Sin matrices RF ni serie cuantitativa
          importada.
        </p>
      </div>
    );
  return (
    <div className="guided-cine">
      <header>
        <span>CINE REAL · THROMBUS+ · MODO B</span>
        <b>
          {clip.segment} · {clip.side === "L" ? "izquierdo" : "derecho"}
        </b>
      </header>
      <div className="guided-frame-viewport">
        {atlas ? (
          <svg
            className="guided-frame-svg"
            role="img"
            aria-label={`Cuadro original ${frame + 1} de ${clip.frameCount}`}
            viewBox={`${(tile % atlas.columns) * clip.width} ${Math.floor(tile / atlas.columns) * clip.height} ${clip.width} ${clip.height}`}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <clipPath id={clipKey}>
                <rect
                  x={(tile % atlas.columns) * clip.width}
                  y={Math.floor(tile / atlas.columns) * clip.height}
                  width={clip.width}
                  height={clip.height}
                />
              </clipPath>
            </defs>
            <image
              href={atlas.src}
              width={atlas.columns * clip.width}
              height={atlas.rows * clip.height}
              clipPath={`url(#${clipKey})`}
              onLoad={() => {
                setAtlases((a) => ({ ...a, [atlas.src]: "ready" }));
                onReady?.();
              }}
              onError={() =>
                setAtlases((a) => ({ ...a, [atlas.src]: "error" }))
              }
              data-ready={atlases[atlas.src] === "ready"}
            />
          </svg>
        ) : (
          <img src={clip.poster} alt="Referencia del cine" />
        )}
        {atlas && atlases[atlas.src] !== "ready" && (
          <span className="guided-resource-loading" aria-live="off">
            {atlases[atlas.src] === "error"
              ? "Cuadros no disponibles. Abre el laboratorio para revisar el recurso."
              : "Cargando cuadros originales…"}
          </span>
        )}
        <span className="indexed-frame-number">
          CUADRO ORIGINAL {frame + 1} / {clip.frameCount}
        </span>
      </div>
      <div className="cine-source-time">
        <span>
          Tiempo de adquisición{" "}
          <b>{((frame * clip.frameTimeMs) / 1000).toFixed(2)} s</b>
        </span>
        <span>{clip.fps.toFixed(2)} cuadros/s de origen</span>
      </div>
      <p>
        La guía avanza por cuadros originales a su ritmo docente. No se generan
        cuadros intermedios. La medición espacial requiere calibración validada.
      </p>
    </div>
  );
}
