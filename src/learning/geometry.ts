import * as THREE from "three";
/** Layered cutaway; dimensions are illustrative. Inner surface matches leaflet insertion radius at y=0. */
export function valveWallGeometry(inner: number, outer: number) {
  const positions: number[] = [],
    indices: number[] = [],
    nu = 72,
    heights = Array.from({ length: 33 }, (_, i) => -0.445 + (i / 32) * 1.25)
      .concat([0, 0.4, 0.6])
      .sort((a, b) => a - b),
    nv = heights.length - 1,
    start = Math.PI / 4,
    span = Math.PI * 1.5;
  const radius = (base: number, y: number) =>
    base + 0.032 * Math.sin(Math.PI * Math.max(0, Math.min(1, y / 0.6))) ** 2;
  for (let side = 0; side < 2; side++)
    for (let j = 0; j <= nv; j++)
      for (let i = 0; i <= nu; i++) {
        const y = heights[j],
          a = start + (i / nu) * span,
          r = radius(side ? outer : inner, y);
        positions.push(Math.sin(a) * r, y, Math.cos(a) * r);
      }
  const stride = nu + 1,
    layer = stride * (nv + 1);
  const quad = (a: number, b: number, c: number, d: number, reverse = false) =>
    indices.push(...(reverse ? [a, c, b, b, c, d] : [a, b, c, b, d, c]));
  for (let side = 0; side < 2; side++)
    for (let j = 0; j < nv; j++)
      for (let i = 0; i < nu; i++) {
        const a = side * layer + j * stride + i;
        quad(a, a + 1, a + stride, a + stride + 1, side === 0);
      }
  for (const j of [0, nv])
    for (let i = 0; i < nu; i++) {
      const a = j * stride + i;
      quad(a, a + layer, a + 1, a + layer + 1, j === nv);
    }
  for (const i of [0, nu])
    for (let j = 0; j < nv; j++) {
      const a = j * stride + i;
      quad(a, a + stride, a + layer, a + stride + layer, i === 0);
    }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}
export function cellGeometry() {
  const points = [];
  for (let side = 1; side >= -1; side -= 2)
    for (let i = 0; i <= 12; i++) {
      const r = side === 1 ? i / 12 : 1 - i / 12;
      points.push(
        new THREE.Vector2(
          Math.max(0.001, r),
          side *
            Math.sqrt(Math.max(0, 1 - r * r)) *
            (0.104 + 1.002 * r * r - 0.562 * r ** 4),
        ),
      );
    }
  const g = new THREE.LatheGeometry(points, 16);
  g.scale(0.043, 0.043, 0.043);
  return g;
}
