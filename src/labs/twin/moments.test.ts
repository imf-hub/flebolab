import { describe, expect, it } from "vitest";
import { solve } from "./model";
import { scenarioParameters } from "./scenarioConfig";
import { modelMoments } from "./moments";

describe("paradas docentes de la simulación", () => {
  it("sitúa contracción, relajación e inversión sobre muestras calculadas", () => {
    const solution = solve(scenarioParameters("TW06"));
    const moments = modelMoments(solution);
    const cycle = solution.samples.filter((s) => s.t <= solution.period);
    const contraction = cycle.find((s) => s.t === moments.contraction)!;
    const relaxation = cycle.find((s) => s.t === moments.relaxation)!;
    const reverse = cycle.find((s) => s.t === moments.reverse)!;
    expect(contraction.pump).toBe(Math.max(...cycle.map((s) => s.pump)));
    expect(relaxation.t).toBeGreaterThan(contraction.t);
    expect(relaxation.pump).toBeLessThan(0.02);
    expect(reverse.flow).toBe(Math.min(...cycle.map((s) => s.flow)));
    expect(reverse.flow).toBeLessThan(0);
    for (const t of Object.values(moments)) {
      expect(t).not.toBeNull();
      expect(t!).toBeGreaterThanOrEqual(0);
      expect(t!).toBeLessThanOrEqual(solution.period);
    }
  });
  it("no propone inversión para una válvula competente", () => {
    expect(modelMoments(solve(scenarioParameters("TW05"))).reverse).toBeNull();
  });
  it("mantiene las paradas en el primer ciclo al cambiar el período", () => {
    for (const period of [2, 3.137, 10]) {
      const solution = solve({ ...scenarioParameters("TW06"), period });
      const moments = modelMoments(solution);
      expect(moments.contraction / period).toBeCloseTo(0.2, 1);
      expect(moments.relaxation).toBeLessThan(period);
      expect(moments.reverse).toBeLessThanOrEqual(period);
    }
  });
});
