import { leafletScale, valveAperture, leafletPoint } from "./valveVisual";
import { describe, it, expect } from "vitest";
import {
  presentations,
  parseTwinQuery,
  scenarioParameters,
} from "./scenarioConfig";
import { scenarios, solve, defaults } from "./model";
import { sampleAt, integratedFlow, type FlowKey } from "./transport";
import { assetUrl } from "../../shared/assets";
describe("contratos de cada experimento visible", () => {
  for (const scenario of scenarios)
    it(`${scenario.id}: vista, controles y resultado pertenecen al mismo perfil`, () => {
      const config = presentations[scenario.id],
        state = parseTwinQuery(new URLSearchParams({ scenario: scenario.id }));
      expect(config).toBeDefined();
      expect(state.view).toBe(config.view);
      expect(state.parameters).toEqual(scenarioParameters(scenario.id));
      expect(state.custom).toBe(false);
      expect(["flow", "valve"]).toContain(config.view);
      const solution = solve(state.parameters);
      expect(solution.converged).toBe(true);
      for (const key of [
        "flow",
        "superficialFlow",
        "deepOut",
        "superficialOut",
        "perforator",
        "collateral",
      ] as FlowKey[])
        expect(
          integratedFlow(solution.samples, key).every(Number.isFinite),
        ).toBe(true);
      for (const sample of solution.samples) {
        expect(sample.superficialVolume).toBeGreaterThan(0);
        expect(sample.proximalDeepVolume).toBeGreaterThan(0);
        expect(sample.proximalSuperficialVolume).toBeGreaterThan(0);
      }
    });
  it("válvulas abren su visor; una colateral existe solo en su perfil", () => {
    expect(parseTwinQuery(new URLSearchParams("scenario=TW06")).view).toBe(
      "valve",
    );
    expect(scenarioParameters("TW09").collateral).toBe(false);
    expect(scenarioParameters("TW10").collateral).toBe(true);
    expect(
      solve(scenarioParameters("TW10")).samples.some((s) => s.collateral > 0),
    ).toBe(true);
    expect(
      solve(scenarioParameters("TW09")).samples.every(
        (s) => s.collateral === 0,
      ),
    ).toBe(true);
  });
  it("URL, valores modificados y perfiles inválidos se resuelven sin estado obsoleto", () => {
    expect(
      parseTwinQuery(new URLSearchParams("scenario=TW02")).parameters.posture,
    ).toBe(90);
    expect(
      parseTwinQuery(new URLSearchParams("scenario=TW01")).parameters.posture,
    ).toBe(0);
    const custom = parseTwinQuery(
      new URLSearchParams({
        scenario: "TW02",
        p: JSON.stringify({ ...defaults, pump: 1.5 }),
      }),
    );
    expect(custom.custom).toBe(true);
    expect(custom.parameters.pump).toBe(1.5);
    expect(
      parseTwinQuery(new URLSearchParams("scenario=desconocido&p=malformado"))
        .scenario,
    ).toBe("TW01");
    expect(
      parseTwinQuery(new URLSearchParams("scenario=TW06&view=anatomy")).view,
    ).toBe("anatomy");
  });
  it("los marcadores de tiempo usan la muestra correspondiente y limitan los extremos", () => {
    const s = solve({});
    expect(sampleAt(s, -10)).toBe(s.samples[0]);
    expect(sampleAt(s, 999)).toBe(s.samples.at(-1));
    const value = sampleAt(s, 3.14);
    expect(value.t).toBeLessThanOrEqual(3.14);
    expect(3.14 - value.t).toBeLessThan(0.04);
  });
  it("medios y descargas respetan el subdirectorio de GitHub Pages", () => {
    expect(
      assetUrl("/media/anatomy/left-leg-reference.glb", "/flebolab/"),
    ).toBe("/flebolab/media/anatomy/left-leg-reference.glb");
    expect(assetUrl("/references/flebolab.bib", "/flebolab/")).toBe(
      "/flebolab/references/flebolab.bib",
    );
    expect(assetUrl("https://doi.org/10.1002/cnm.2714", "/flebolab/")).toBe(
      "https://doi.org/10.1002/cnm.2714",
    );
  });
});

describe("valvas confinadas dentro de su pared", () => {
  it("la apertura conserva las inserciones y no expulsa el borde fuera de la luz", () => {
    for (const q of [-20, -1, 0, 0.00001, 0.2, 1, 4, 20])
      for (const leak of [0, 0.02, 0.4, 1]) {
        const scale = leafletScale(q, leak);
        expect(scale).toBeGreaterThan(0);
        expect(scale).toBeLessThanOrEqual(1);
        const tip = -0.24 + 0.24 * scale;
        expect(tip).toBeGreaterThanOrEqual(-0.24);
        expect(tip).toBeLessThanOrEqual(0);
      }
  });
  it("el estado competente en reposo coapta y la fuga deja un defecto de coaptación", () => {
    expect(valveAperture(0, 0)).toBe(0);
    expect(valveAperture(-1, 0)).toBe(0);
    expect(valveAperture(-1, 0.65)).toBeGreaterThan(0);
    expect(valveAperture(1, 0)).toBeGreaterThan(0);
  });
});

it("las superficies semilunares mantienen la inserción y la luz en todo el rango", () => {
  for (const side of [-1, 1] as const)
    for (let i = 0; i <= 24; i++)
      for (let j = 0; j <= 10; j++)
        for (const aperture of [0, 0.4, 0.85]) {
          const theta = -Math.PI / 2 + (Math.PI * i) / 24;
          const [x, y, z] = leafletPoint(side, theta, j / 10, aperture);
          expect(x * x + z * z).toBeLessThanOrEqual(0.24 * 0.24 + 1e-10);
          expect(y).toBeGreaterThanOrEqual(0);
          if (j === 0) expect(x * x + z * z).toBeCloseTo(0.24 * 0.24, 8);
          if (j === 10 && aperture === 0) expect(x).toBeCloseTo(0, 8);
        }
});
