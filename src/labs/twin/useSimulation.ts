import { useEffect, useRef, useState, useCallback } from "react";
import { solve, type Parameters, type Solution } from "./model";
export function useSolution(parameters: Parameters, enabled = true) {
  const [solution, setSolution] = useState(() => solve(parameters));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const worker = useRef<Worker | null>(null),
    serial = useRef(0);
  useEffect(() => {
    try {
      worker.current = new Worker(
        new URL("./simulation.worker.ts", import.meta.url),
        { type: "module" },
      );
    } catch {
      worker.current = null;
    }
    return () => worker.current?.terminate();
  }, []);
  useEffect(() => {
    if (!enabled) return;
    const id = ++serial.current;
    setBusy(true);
    setError("");
    const instance = worker.current;
    const complete = (value: Solution) => {
      if (serial.current === id) {
        setSolution(value);
        setBusy(false);
      }
    };
    if (instance) {
      instance.onmessage = (e) => {
        if (e.data.id === id && e.data.solution) complete(e.data.solution);
      };
      instance.onerror = () => {
        setError(
          "No se pudo calcular esta combinación. Restaura el escenario.",
        );
        setBusy(false);
      };
    }
    const pending = setTimeout(() => {
      if (instance) instance.postMessage({ id, parameters });
      else complete(solve(parameters));
    }, 70);
    return () => clearTimeout(pending);
  }, [parameters, enabled]);
  // Hide old readouts in the same render that receives new conditions.
  const pending =
    enabled &&
    (Object.keys(parameters) as (keyof Parameters)[]).some(
      (key) => solution.parameters[key] !== parameters[key],
    );
  return { solution, busy: busy || pending, error };
}
export function useModelClock(period: number, start = true) {
  const reduced =
    typeof matchMedia === "function" &&
    matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [playing, setPlaying] = useState(start && !reduced),
    [time, setTime] = useState(0);
  const [speed, setSpeed] = useState(1);
  const timeRef = useRef(0);
  const seek = useCallback(
    (value: number) => {
      timeRef.current = Math.max(0, Math.min(period * 2, value));
      setTime(timeRef.current);
    },
    [period],
  );
  useEffect(() => {
    if (!playing) return;
    let frame = 0,
      last = performance.now(),
      draw = last;
    const tick = (now: number) => {
      const dt = Math.min(0.08, (now - last) / 1000);
      last = now;
      if (!document.hidden) {
        timeRef.current = (timeRef.current + dt * speed) % (period * 2);
        if (now - draw > 45) {
          setTime(timeRef.current);
          draw = now;
        }
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [period, playing, speed]);
  return { time, timeRef, seek, playing, setPlaying, speed, setSpeed };
}
