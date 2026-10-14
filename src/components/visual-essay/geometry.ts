// Small, dependency-free 3D / 4D geometry used by the scenes.

export type V2 = [number, number];
export type V3 = [number, number, number];
export type V4 = [number, number, number, number];

/** Rotate around the vertical axis (yaw) and then the horizontal axis (pitch). */
export function rotate3([x, y, z]: V3, yaw: number, pitch: number): V3 {
  const cy = Math.cos(yaw), sy = Math.sin(yaw);
  const x1 = x * cy + z * sy;
  const z1 = -x * sy + z * cy;
  const cp = Math.cos(pitch), sp = Math.sin(pitch);
  const y2 = y * cp - z1 * sp;
  const z2 = y * sp + z1 * cp;
  return [x1, y2, z2];
}

export interface Camera {
  cx: number;
  cy: number;
  scale: number;
  /** Distance of the eye from the origin. Larger = flatter perspective. */
  dist: number;
}

/** Perspective projection of a 3D point. Positive y is up. Returns [sx, sy, depth]. */
export function project3([x, y, z]: V3, cam: Camera): [number, number, number] {
  const k = cam.dist / (cam.dist - z);
  return [cam.cx + x * k * cam.scale, cam.cy - y * k * cam.scale, z];
}

export type Plane4 = "xy" | "xz" | "yz" | "xw" | "yw" | "zw";
const AXIS: Record<string, number> = { x: 0, y: 1, z: 2, w: 3 };

/** Rotate a 4D point in a sequence of coordinate planes. */
export function rotate4(p: V4, angles: Partial<Record<Plane4, number>>): V4 {
  const out: V4 = [p[0], p[1], p[2], p[3]];
  for (const plane of Object.keys(angles) as Plane4[]) {
    const a = angles[plane] ?? 0;
    if (!a) continue;
    const i = AXIS[plane[0]], j = AXIS[plane[1]];
    const c = Math.cos(a), s = Math.sin(a);
    const pi = out[i], pj = out[j];
    out[i] = pi * c - pj * s;
    out[j] = pi * s + pj * c;
  }
  return out;
}

/** Perspective projection from 4D to 3D, like a lamp casting a 3D shadow. */
export function project4to3([x, y, z, w]: V4, wDist = 3): V3 {
  const k = wDist / (wDist - w);
  return [x * k, y * k, z * k];
}

export interface Cube {
  /** Vertex coordinates as bit arrays (each 0 or 1) of length n. */
  bits: number[][];
  /** Index pairs; each edge joins two vertices that differ in exactly one coordinate. */
  edges: [number, number][];
  /** For each edge, the axis it runs along. */
  edgeAxis: number[];
}

/** The n-dimensional cube: 2^n vertices, n·2^(n−1) edges. */
export function hypercube(n: number): Cube {
  const count = 1 << n;
  const bits: number[][] = [];
  for (let i = 0; i < count; i++) {
    const b: number[] = [];
    for (let k = 0; k < n; k++) b.push((i >> k) & 1);
    bits.push(b);
  }
  const edges: [number, number][] = [];
  const edgeAxis: number[] = [];
  for (let i = 0; i < count; i++) {
    for (let k = 0; k < n; k++) {
      const j = i ^ (1 << k);
      if (j > i) {
        edges.push([i, j]);
        edgeAxis.push(k);
      }
    }
  }
  return { bits, edges, edgeAxis };
}

/** Counts of k-dimensional faces of an n-cube: C(n,k)·2^(n−k). */
export function faceCount(n: number, k: number): number {
  if (k > n) return 0;
  let c = 1;
  for (let i = 0; i < k; i++) c = (c * (n - i)) / (i + 1);
  return c * Math.pow(2, n - k);
}

/** Signed area of a projected polygon (screen coords, y down). Positive = clockwise on screen. */
export function signedArea(pts: V2[]): number {
  let a = 0;
  for (let i = 0; i < pts.length; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[(i + 1) % pts.length];
    a += x1 * y2 - x2 * y1;
  }
  return a / 2;
}
