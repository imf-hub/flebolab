import { describe, it, expect } from "vitest";
import { lessons, narrations } from "./catalog";
import { locateTime, captionAt, visualTimeline } from "./timeline";
import { sources } from "../data/educational";
import { medicalReferences } from "../data/references";
import { scenarioParameters } from "../labs/twin/scenarioConfig";
import { solve } from "../labs/twin/model";
import { sampleAt } from "../labs/twin/transport";
import { dopplerState, dopplerValue } from "./dopplerModel";
import { valveWallGeometry } from "./geometry";

describe("contrato de las explicaciones por concepto", () => {
  it("cada pieza tiene cuatro tomas específicas y fuentes resolubles", () => {
    expect(lessons.length).toBe(31);
    expect(new Set(lessons.map((l) => l.id)).size).toBe(31);
    const ids = new Set([...sources, ...medicalReferences].map((s) => s.id));
    for (const l of lessons) {
      expect(l.stages.length, l.id).toBe(4);
      expect(l.sourceIds.length).toBeGreaterThan(0);
      for (const id of l.sourceIds)
        expect(ids.has(id), `${l.id}: ${id}`).toBe(true);
      for (const s of l.stages) {
        expect(s.spoken.length).toBeGreaterThan(140);
        expect(s.phase.length).toBe(2);
        expect(s.phase.every((p) => p >= 0 && p <= 1)).toBe(true);
      }
    }
  });
  it("las marcas conservadas cubren el audio real sin huecos entre tomas", () => {
    for (const [id, n] of Object.entries(narrations)) {
      expect(n.transcriptVerified, id).toBe(true);
      expect(n.playbackRate).toBe(1);
      expect(n.duration).toBeGreaterThan(20);
      expect(n.stages[0].start).toBe(0);
      expect(n.stages.at(-1)!.end).toBe(n.duration);
      for (let i = 0; i < 4; i++) {
        const s = n.stages[i];
        expect(s.end).toBeGreaterThan(s.start);
        expect(s.speechEnd).toBeLessThanOrEqual(s.end);
        if (i < 3) expect(s.end).toBe(n.stages[i + 1].start);
      }
      for (const c of n.captions) {
        expect(c.end).toBeGreaterThan(c.start);
        expect(c.end).toBeLessThanOrEqual(n.duration);
      }
    }
  });
  it("los saltos adelante y atrás reconstruyen la misma toma y fase", () => {
    for (const lesson of lessons.filter((l) => narrations[l.id])) {
      const n = narrations[lesson.id];
      for (const t of [
        0,
        n.duration * 0.73,
        n.duration * 0.24,
        n.duration,
        n.duration * 0.73,
      ]) {
        const a = locateTime(t, lesson, n);
        expect(locateTime(t, lesson, n)).toEqual(a);
        expect(a.progress).toBeGreaterThanOrEqual(0);
        expect(a.progress).toBeLessThanOrEqual(1);
      }
      for (let i = 0; i < 4; i++)
        expect(locateTime(n.stages[i].start, lesson, n).index).toBe(i);
      expect(locateTime(-5, lesson, n).index).toBe(0);
      expect(locateTime(9999, lesson, n).index).toBe(3);
    }
  });
  it("las escenas de Twin consultan soluciones válidas y no simulan sliders cambiantes", () => {
    for (const l of lessons.filter((l) => l.group === "twin"))
      for (const stage of l.stages) {
        const solution = solve(scenarioParameters(stage.scenario!));
        expect(solution.converged, l.id).toBe(true);
        for (const p of stage.phase) {
          const row = sampleAt(solution, p * solution.period);
          expect(Object.values(row).every(Number.isFinite)).toBe(true);
        }
      }
  });
  it("la clasificación general C4 no se asigna a una subclase en las fotos", () => {
    const l = lessons.find((l) => l.id === "CEAP-C4")!;
    expect(l.stages.map((s) => s.clinicalClass)).toEqual([
      "C4",
      "C4",
      "C4",
      "C4",
    ]);
    expect(l.stages.map((s) => s.subclass)).toEqual([
      null,
      "C4a",
      "C4b",
      "C4c",
    ]);
  });
  it("los subtítulos devuelven las palabras de su intervalo y no inventan relleno", () => {
    const n = narrations.TW05;
    const c = n.captions[2];
    expect(captionAt((c.start + c.end) / 2, n)).toBe(c.text);
    expect(captionAt(n.duration + 1, n)).toBe("");
  });
});
it("las guías sin voz tienen reloj visual y texto completo sin marcas de audio inventadas", () => {
  for (const lesson of lessons) {
    const n = visualTimeline(lesson);
    expect(n.audio).toBe("");
    expect(n.engine).toBe("none");
    expect(n.transcriptVerified).toBe(false);
    expect(n.duration).toBeGreaterThan(45);
    expect(n.captions.map((c) => c.text).join(" ")).toBe(
      lesson.stages.map((s) => s.spoken).join(" "),
    );
    expect(n.stages.at(-1)!.end).toBe(n.duration);
    for (let i = 0; i < 4; i++)
      expect(locateTime(n.stages[i].start, lesson, n).index).toBe(i);
  }
});
it("las tomas de coaptación e inversión muestran el signo que explican", () => {
  for (const id of ["TW05", "TW06"]) {
    const lesson = lessons.find((l) => l.id === id)!;
    const stage = lesson.stages[2],
      s = solve(scenarioParameters(stage.scenario!));
    for (let i = 0; i <= 20; i++) {
      const phase =
        stage.phase[0] + (i / 20) * (stage.phase[1] - stage.phase[0]);
      const q = sampleAt(s, phase * s.period).flow;
      if (id === "TW05") expect(q).toBeCloseTo(0, 6);
      else expect(q).toBeLessThan(0);
    }
  }
});
describe("presentación Doppler coherente", () => {
  it("cambiar escala o línea base no altera la señal física impuesta", () => {
    for (const id of ["DP03", "DP04"])
      expect(
        dopplerValue(id, { velocity: 20, scale: 90, baseline: 30 }, 1.3),
      ).toBe(dopplerValue(id, { velocity: 20, scale: 20, baseline: 0 }, 1.3));
  });
  it("el plegamiento conserva las muestras discretas y cambia el signo mostrado", () => {
    const { wrapped } = dopplerState("DP06", { prf: 1000, shift: 800 });
    expect(wrapped).toBe(-200);
    for (let n = 0; n < 8; n++)
      expect(Math.sin(((2 * Math.PI * 800) / 1000) * n)).toBeCloseTo(
        Math.sin(((2 * Math.PI * wrapped) / 1000) * n),
        10,
      );
  });
  it("la proyección cambia de signo al cruzar perpendicular", () => {
    expect(dopplerValue("DP01", { angle: 25 }, 1)).toBeGreaterThan(0);
    expect(dopplerValue("DP01", { angle: 135 }, 1)).toBeLessThan(0);
    expect(dopplerValue("DP05", { angle: 90 }, 1)).toBeCloseTo(0, 10);
  });
});
it("la pared cortada conserva inserción, límites y normales finitas", () => {
  const g = valveWallGeometry(0.24, 0.255),
    position = g.getAttribute("position"),
    normal = g.getAttribute("normal");
  let roots = 0;
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i),
      y = position.getY(i),
      z = position.getZ(i),
      r = Math.hypot(x, z);
    expect(
      [x, y, z, normal.getX(i), normal.getY(i), normal.getZ(i)].every(
        Number.isFinite,
      ),
    ).toBe(true);
    expect(r).toBeGreaterThanOrEqual(0.24 - 1e-6);
    expect(r).toBeLessThanOrEqual(0.287 + 1e-6);
    if (Math.abs(y) < 1e-8 && Math.abs(r - 0.24) < 1e-6) roots++;
  }
  expect(roots).toBeGreaterThan(60);
  g.dispose();
});
