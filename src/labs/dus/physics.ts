/** Convención explícita de frecuencia aparente en [-PRF/2, PRF/2). */
export function wrapDoppler(frequency: number, prf: number) {
  return ((((frequency + prf / 2) % prf) + prf) % prf) - prf / 2;
}
export function projectedVelocity(velocity: number, angle: number) {
  return velocity * Math.cos((angle * Math.PI) / 180);
}
