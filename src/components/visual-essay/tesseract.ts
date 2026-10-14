import { Camera, Cube, Plane4, V4, hypercube, project3, project4to3, rotate3, rotate4 } from "./geometry";

export const TESSERACT: Cube = hypercube(4);

export interface ProjectOpts {
  rot4: Partial<Record<Plane4, number>>;
  yaw: number;
  pitch: number;
  cam: Camera;
  wDist?: number;
  /** Map a vertex (as bits) to 4D coordinates. Defaults to ±1 for each used axis. */
  coord?: (bits: number[]) => V4;
}

export const defaultCoord = (bits: number[]): V4 => [0, 1, 2, 3].map((k) => (k < bits.length ? bits[k] * 2 - 1 : 0)) as V4;

/** 4D → 3D (perspective "shadow") → 2D screen. Returns [sx, sy, depth] per vertex. */
export function projectCube(cube: Cube, o: ProjectOpts): [number, number, number][] {
  const coord = o.coord ?? defaultCoord;
  return cube.bits.map((b) => {
    const p4 = rotate4(coord(b), o.rot4);
    const p3 = project4to3(p4, o.wDist ?? 3);
    return project3(rotate3(p3, o.yaw, o.pitch), o.cam);
  });
}

/** The 8 cubic cells of a tesseract: fix one coordinate (axis) at 0 or 1. */
export const CELLS = [0, 1, 2, 3].flatMap((axis) => [0, 1].map((side) => ({ axis, side })));
export const AXIS_NAME = ["x", "y", "z", "w"];

export function cellHas(bits: number[], cell: { axis: number; side: number }) {
  return bits[cell.axis] === cell.side;
}
