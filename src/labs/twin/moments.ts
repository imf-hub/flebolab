import type { Solution } from "./model";

/** Teaching stops are selected from the computed first cycle, never invented. */
export function modelMoments(solution: Solution) {
  const cycle = solution.samples.filter(
    (sample) => sample.t <= solution.period,
  );
  const peak = cycle.reduce((a, b) => (b.pump > a.pump ? b : a));
  const relaxed =
    cycle.find((sample) => sample.t > peak.t && sample.pump < 0.02) ??
    cycle.at(-1)!;
  const minimum = cycle.reduce((a, b) => (b.flow < a.flow ? b : a));
  return {
    contraction: peak.t,
    relaxation: relaxed.t,
    reverse: minimum.flow < -1e-5 ? minimum.t : null,
  };
}
