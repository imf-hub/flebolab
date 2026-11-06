/** Abertura ilustrativa, sin pretender resolver la mecánica de las valvas. */
export function valveAperture(flow: number, leak: number) {
  const reverseConductance = Math.max(0, Math.min(1, leak));
  return flow > 1e-6
    ? Math.min(0.85, 0.18 + flow * 0.36)
    : reverseConductance * 0.62;
}
export function leafletScale(flow: number, leak: number) {
  return 1 - valveAperture(flow, leak);
}
/** Superficie semilunar: inserción parietal fija y borde libre hacia proximal. */
export function leafletPoint(
  side: 1 | -1,
  angle: number,
  radial: number,
  aperture: number,
): [number, number, number] {
  const c = Math.max(0, Math.cos(angle)),
    r = 0.24,
    v = Math.max(0, Math.min(1, radial));
  return [
    side * r * c * (1 - v * (1 - Math.max(0, Math.min(0.85, aperture)))),
    0.4 * v * Math.sqrt(c) + 0.075 * Math.sin(Math.PI * v) * c,
    r * Math.sin(angle),
  ];
}
