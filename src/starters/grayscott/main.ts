// Gray-Scott starter. Run: node main.ts  ->  out.pgm   (Node 23.6+ runs TypeScript directly)
import { writeFileSync } from "node:fs";

const N = 256;
const DU = 0.21, DV = 0.105, F = 0.037, K = 0.06;
const at = (i: number, j: number): number => j * N + i;

function laplacian(a: Float32Array, i: number, j: number): number {
  // TODO step 2: neighbours minus 4x centre, wrapping at the edges (use % N)
  return 0;
}

/** One Euler step with dt = 1: read from (u, v), write into (nu, nv). */
function step(u: Float32Array, v: Float32Array, nu: Float32Array, nv: Float32Array): void {
  nu.set(u);
  nv.set(v);
  // TODO step 3: for every cell
  //   uvv = u*v*v
  //   nu = u + DU*lap(u) - uvv + F*(1 - u)
  //   nv = v + DV*lap(v) + uvv - (F + K)*v
}

let u = new Float32Array(N * N).fill(1), v = new Float32Array(N * N);
let nu = new Float32Array(N * N), nv = new Float32Array(N * N);
for (let j = N / 2 - 8; j < N / 2 + 8; j++)
  for (let i = N / 2 - 8; i < N / 2 + 8; i++) { u[at(i, j)] = 0.5; v[at(i, j)] = 0.25; }
for (let n = 0; n < 5000; n++) {
  step(u, v, nu, nv);
  [u, nu] = [nu, u];
  [v, nv] = [nv, v];
}
const rows = [`P2\n${N} ${N}\n255`];
for (let j = 0; j < N; j++) {
  const row: number[] = [];
  for (let i = 0; i < N; i++) row.push(Math.floor(Math.min(Math.max(v[at(i, j)] * 3, 0), 1) * 255));
  rows.push(row.join(" "));
}
writeFileSync("out.pgm", rows.join("\n") + "\n");
console.log(`wrote out.pgm, total V = ${v.reduce((s, x) => s + x, 0).toFixed(1)}`);
