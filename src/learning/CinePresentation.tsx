import { useEffect, useRef, useState, useId } from "react";
import clips from "../data/dus";
import waterloo from "../data/waterloo";
import type { Stage } from "./types";
export default function CinePresentation({
  stage,
  phase,
  experimental = false,
}: {
  stage: Stage;
  phase: number;
  experimental?: boolean;
}) {
  const clipKey = useId().replace(/:/g, "");
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
  if (experimental)
    return (
      <div className="guided-cine">
        <header>
          <span>WATERLOO · RENDERIZADO EXPERIMENTAL</span>
          <b>Flujo femoral</b>
        </header>
        <video
          ref={video}
          src={waterloo.videoPath}
          poster={waterloo.posterPath}
          preload="metadata"
          playsInline
          onLoadedMetadata={(e) => setLength(e.currentTarget.duration)}
          onSeeked={syncVideo}
          aria-label="Renderizado experimental Waterloo"
        />
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
            />
          </svg>
        ) : (
          <img src={clip.poster} alt="Referencia del cine" />
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
