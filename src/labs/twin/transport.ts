import type { Sample } from "./model";
export type FlowKey =
  | "flow"
  | "superficialFlow"
  | "perforator"
  | "collateral"
  | "deepOut"
  | "superficialOut";
/** Desplazamiento simbólico por integral de flujo, sin unidades de velocidad anatómica. */
export function integratedFlow(samples: Sample[], key: FlowKey) {
  const phases = [0];
  for (let i = 1; i < samples.length; i++) {
    phases.push(
      phases[i - 1] +
        (((samples[i - 1][key] + samples[i][key]) *
          (samples[i].t - samples[i - 1].t)) /
          2) *
          0.24,
    );
  }
  return phases;
}
export function phaseAt(samples: Sample[], phases: number[], time: number) {
  let lo = 0,
    hi = samples.length - 1;
  while (lo < hi - 1) {
    const middle = (lo + hi) >> 1;
    if (samples[middle].t > time) hi = middle;
    else lo = middle;
  }
  const span = samples[hi].t - samples[lo].t;
  const weight = span
    ? Math.max(0, Math.min(1, (time - samples[lo].t) / span))
    : 0;
  return phases[lo] + (phases[hi] - phases[lo]) * weight;
}

export function sampleAt(solution: import("./model").Solution, time: number) {
  const samples = solution.samples;
  let lo = 0,
    hi = samples.length - 1;
  const target = Math.max(0, Math.min(solution.period * 2, time));
  while (lo < hi - 1) {
    const middle = (lo + hi) >> 1;
    if (samples[middle].t > target) hi = middle;
    else lo = middle;
  }
  return target >= samples[hi].t ? samples[hi] : samples[lo];
}
