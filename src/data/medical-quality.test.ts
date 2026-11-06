import { describe, it, expect } from "vitest";
import { medicalReferences, controversies } from "./references";
import {
  sources,
  glossary,
  dopplerLessons,
  pathways,
  observationGuides,
  plates,
  animations,
} from "./educational";
import photos from "./vision.json";
import { wrapDoppler, projectedVelocity } from "../labs/dus/physics";
import { integratedFlow, phaseAt } from "../labs/twin/transport";
import { solve, type Sample } from "../labs/twin/model";

describe("trazabilidad médica del contenido publicado", () => {
  const ids = new Set(sources.map((s) => s.id));
  it("todas las unidades docentes conservan referencias resolubles", () => {
    for (const item of [
      ...glossary,
      ...dopplerLessons,
      ...pathways,
      ...plates,
      ...animations,
    ]) {
      expect(item.sourceIds.length, item.id).toBeGreaterThan(0);
      for (const id of item.sourceIds)
        expect(ids.has(id), `${item.id}: ${id}`).toBe(true);
    }
    for (const guide of observationGuides)
      for (const id of guide.sources)
        expect(ids.has(id), `${guide.id}: ${id}`).toBe(true);
    for (const c of controversies)
      for (const id of c.refs) expect(ids.has(id), `${c.id}: ${id}`).toBe(true);
  });
  it("no duplica DOI y explicita alcance, acceso y localizador de cada referencia", () => {
    const dois = medicalReferences
      .filter((r) => r.doi)
      .map((r) => r.doi!.toLowerCase());
    expect(new Set(dois).size).toBe(dois.length);
    expect(new Set(medicalReferences.map((r) => r.id)).size).toBe(
      medicalReferences.length,
    );
    for (const r of medicalReferences) {
      for (const key of [
        "title",
        "authors",
        "organization",
        "kind",
        "access",
        "locator",
        "scope",
        "limitations",
      ] as const)
        expect(r[key].length, `${r.id}: ${key}`).toBeGreaterThan(0);
      expect(r.url.startsWith("https://")).toBe(true);
      if (r.doi) expect(r.doi).toMatch(/^10\.\d{4,9}\/\S+$/);
    }
    expect(medicalReferences[0].id).toBe("uipduplex1");
    expect(medicalReferences.find((r) => r.id === "uipduplex1")!.doi).toBe(
      "10.1016/j.ejvs.2005.07.019",
    );
  });
  it("cada pareja térmica declara sus dimensiones reales y conserva la etiqueta C1 disyuntiva", () => {
    for (const p of photos.filter((p) => p.thermal)) {
      expect([p.thermalWidth, p.thermalHeight]).toEqual([320, 240]);
      expect([p.width, p.height]).toEqual([640, 480]);
    }
    for (const p of photos.filter((p) => p.ceap === "C1"))
      expect(p.category).toContain(" o ");
  });
});
describe("física de los esquemas y transporte simbólico", () => {
  it("el alias permanece en Nyquist y es invariante al sumar múltiplos de PRF", () => {
    for (const prf of [200, 1000, 2500])
      for (let f = -5000; f <= 5000; f += 71) {
        const value = wrapDoppler(f, prf);
        expect(value).toBeGreaterThanOrEqual(-prf / 2);
        expect(value).toBeLessThan(prf / 2);
        expect(wrapDoppler(f + 3 * prf, prf)).toBeCloseTo(value, 10);
      }
    expect(wrapDoppler(800, 1000)).toBe(-200);
  });
  it("la proyección se anula a 90 grados y cambia de signo al invertir dirección", () => {
    expect(projectedVelocity(20, 90)).toBeCloseTo(0, 10);
    expect(projectedVelocity(20, 60)).toBeCloseTo(10, 10);
    expect(projectedVelocity(-20, 60)).toBeCloseTo(-10, 10);
  });
  it("los marcadores se detienen en cero y avanzan según la rama, magnitud y signo", () => {
    const base = solve({}).samples[0];
    const samples = [0, 1, 2].map((t) => ({
      ...base,
      t,
      flow: 0,
      superficialFlow: -2,
      perforator: 1,
      collateral: 0.5,
    })) as Sample[];
    expect(phaseAt(samples, integratedFlow(samples, "flow"), 1.5)).toBe(0);
    expect(
      phaseAt(samples, integratedFlow(samples, "superficialFlow"), 1.5),
    ).toBeCloseTo(-0.72);
    expect(
      phaseAt(samples, integratedFlow(samples, "perforator"), 1.5),
    ).toBeCloseTo(0.36);
    expect(
      phaseAt(samples, integratedFlow(samples, "collateral"), 1.5),
    ).toBeCloseTo(0.18);
  });
});
