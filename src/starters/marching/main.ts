// Marching cubes starter. Run: node main.ts  ->  out.obj   (Node 23.6+ runs TypeScript directly)
import { writeFileSync } from "node:fs";

const N = 24; // cells per side
const ISO = 0;

/** Negative inside, positive outside. Start with a sphere of radius 0.7. */
const density = (x: number, y: number, z: number): number => Math.hypot(x, y, z) - 0.7;

/** Values at the (N+1)^3 grid corners, over the cube [-1, 1]^3. */
const grid = new Float32Array((N + 1) ** 3);
const at = (i: number, j: number, k: number): number => (i * (N + 1) + j) * (N + 1) + k;
const coord = (i: number): number => (i / N) * 2 - 1;
for (let i = 0; i <= N; i++)
  for (let j = 0; j <= N; j++)
    for (let k = 0; k <= N; k++) grid[at(i, j, k)] = density(coord(i), coord(j), coord(k));

const CORNERS = [[0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0], [0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]];

/** 8-bit case number: bit n is set when corner n is inside. */
function cubeIndex(i: number, j: number, k: number): number {
  let idx = 0;
  CORNERS.forEach(([dx, dy, dz], n) => {
    if (grid[at(i + dx, j + dy, k + dz)] < ISO) idx |= 1 << n;
  });
  return idx;
}

interface Mesh { vertices: number[][]; triangles: number[][] }

function polygonise(): Mesh {
  // TODO step 2: get EDGE_TABLE and TRI_TABLE (Paul Bourke, "Polygonising a scalar field")
  // TODO step 3: for each cell, interpolate a vertex on every crossed edge, emit triangles
  // TODO step 4: normals from the gradient of density()
  return { vertices: [], triangles: [] };
}

let crossed = 0;
for (let i = 0; i < N; i++)
  for (let j = 0; j < N; j++)
    for (let k = 0; k < N; k++) {
      const c = cubeIndex(i, j, k);
      if (c !== 0 && c !== 255) crossed++;
    }
console.log(`${crossed} of ${N ** 3} cells contain the surface`);
const mesh = polygonise();
const lines = [
  ...mesh.vertices.map((v) => `v ${v.map((x) => x.toFixed(5)).join(" ")}`),
  ...mesh.triangles.map((t) => `f ${t.map((x) => x + 1).join(" ")}`),
];
writeFileSync("out.obj", lines.join("\n") + "\n");
console.log(`wrote out.obj: ${mesh.vertices.length} vertices, ${mesh.triangles.length} triangles`);
