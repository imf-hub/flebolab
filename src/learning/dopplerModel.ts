import { projectedVelocity, wrapDoppler } from "../labs/dus/physics";
export function dopplerState(id: string, values: Record<string, number> = {}) {
  const p = {
    angle: 45,
    velocity: 20,
    scale: 50,
    baseline: 0,
    frequency: 5,
    prf: 1000,
    shift: 800,
    invert: 0,
    duration: 0.7,
    eventTime: 2,
    period: 4,
    modulation: 60,
    deep: 0,
    ...values,
  };
  const shift =
    (2 *
      p.frequency *
      1e6 *
      (p.velocity / 100) *
      Math.cos((p.angle * Math.PI) / 180)) /
    1540;
  return {
    p,
    shift,
    wrapped: wrapDoppler(p.shift, p.prf),
    nyquist: p.prf / 2,
    baseline: 185 + p.baseline * 2.5,
    unit: id === "DP06" ? "Hz" : "cm/s",
    range: id === "DP06" ? p.prf / 2 : p.scale,
  };
}
export function dopplerValue(
  id: string,
  values: Record<string, number>,
  t: number,
) {
  const { p, wrapped } = dopplerState(id, values);
  let y = p.velocity * (0.7 + 0.3 * Math.sin((t / p.period) * Math.PI * 2));
  if (id === "DP01" || id === "DP05") y = projectedVelocity(y, p.angle);
  if (id === "DP06") y = wrapped;
  if (id === "DP07" || id === "DP10") {
    const event = id === "DP10" ? 1.5 : p.eventTime;
    y = t < event ? 12 : t < event + p.duration ? -14 : 6;
  }
  if (id === "DP08")
    y =
      20 * (1 - (p.modulation / 100) * Math.cos((t / p.period) * Math.PI * 2));
  return y;
}
