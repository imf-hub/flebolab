import { useCallback, useEffect, useRef, useState } from "react";
import { assetUrl } from "../shared/assets";
import type { Narration } from "./types";

export function useNarration(
  narration: Narration,
  onFrame: (t: number) => void,
) {
  const audio = useRef<HTMLAudioElement | null>(null),
    callback = useRef(onFrame),
    pendingSeek = useRef(0);
  const visual = useRef({ playing: false, anchor: 0, base: 0 });
  callback.current = onFrame;
  const [time, setTime] = useState(0),
    [playing, setPlaying] = useState(false),
    [waiting, setWaiting] = useState(false),
    [error, setError] = useState(""),
    [muted, setMuted] = useState(false);
  const timeRef = useRef(0);
  useEffect(() => {
    const element = new Audio(
      narration.audio ? assetUrl(narration.audio) : undefined,
    );
    audio.current = element;
    element.preload = "metadata";
    element.playbackRate = 1;
    let raf = 0,
      lastDraw = 0,
      alive = true;
    const sample = () => {
      if (!alive) return;
      let t =
        narration.audio && element.readyState >= 1
          ? element.currentTime
          : pendingSeek.current;
      if (!narration.audio && visual.current.playing) {
        t = Math.min(
          narration.duration,
          visual.current.base +
            (performance.now() - visual.current.anchor) / 1000,
        );
        pendingSeek.current = t;
        if (t >= narration.duration) {
          visual.current.playing = false;
          setPlaying(false);
        }
      }
      timeRef.current = t;
      callback.current(t);
      return t;
    };
    const paint = () => {
      const t = sample();
      if (t !== undefined) setTime(t);
    };
    const pause = () => {
      setPlaying(false);
      setWaiting(false);
      paint();
    };
    const play = () => {
      setPlaying(true);
      setWaiting(false);
      setError("");
    };
    const loaded = () => {
      if (pendingSeek.current > 0) element.currentTime = pendingSeek.current;
      paint();
    };
    const fail = () => {
      setPlaying(false);
      setWaiting(false);
      setError("No se pudo cargar la voz. Puedes seguir los pasos y su texto.");
    };
    element.addEventListener("loadedmetadata", loaded);
    element.addEventListener("play", play);
    element.addEventListener("playing", play);
    element.addEventListener("pause", pause);
    element.addEventListener("ended", pause);
    element.addEventListener("error", fail);
    element.addEventListener("seeked", paint);
    element.addEventListener("timeupdate", paint);
    const wait = () => setWaiting(true);
    element.addEventListener("waiting", wait);
    const visibility = () => {
      if (document.hidden) {
        element.pause();
        visual.current.playing = false;
        setPlaying(false);
      }
    };
    document.addEventListener("visibilitychange", visibility);
    const tick = (now: number) => {
      if (!alive) return;
      const t = sample();
      if (now - lastDraw > 80 && t !== undefined) {
        setTime(t);
        lastDraw = now;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    paint();
    return () => {
      alive = false;
      visual.current.playing = false;
      cancelAnimationFrame(raf);
      element.pause();
      element.removeAttribute("src");
      element.load();
      document.removeEventListener("visibilitychange", visibility);
      audio.current = null;
    };
  }, [narration.audio]);
  const seek = useCallback(
    (target: number) => {
      const t = Math.max(0, Math.min(narration.duration, target));
      pendingSeek.current = t;
      visual.current.playing = false;
      const element = audio.current;
      if (element) {
        element.pause();
        if (element.readyState >= 1) element.currentTime = t;
      }
      timeRef.current = t;
      callback.current(t);
      setTime(t);
      setPlaying(false);
    },
    [narration.duration],
  );
  const toggle = async () => {
    if (!narration.audio) {
      if (visual.current.playing) {
        visual.current.playing = false;
        setPlaying(false);
        return;
      }
      if (pendingSeek.current >= narration.duration - 0.15)
        pendingSeek.current = 0;
      visual.current = {
        playing: true,
        base: pendingSeek.current,
        anchor: performance.now(),
      };
      setPlaying(true);
      setError("");
      return;
    }
    const element = audio.current;
    if (!element) return;
    if (!element.paused) {
      element.pause();
      return;
    }
    if (element.currentTime >= narration.duration - 0.15)
      element.currentTime = 0;
    try {
      await element.play();
    } catch {
      setError(
        "La reproducción necesita una acción del navegador. Pulsa de nuevo para escuchar.",
      );
      setPlaying(false);
    }
  };
  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    if (audio.current) audio.current.muted = next;
  };
  return {
    time,
    timeRef,
    playing,
    waiting,
    error,
    muted,
    toggleMute,
    seek,
    toggle,
    pause: () => {
      audio.current?.pause();
      visual.current.playing = false;
      setPlaying(false);
    },
  };
}
