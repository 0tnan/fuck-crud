// Stable fluids starter. Run: node main.ts   (Node 23.6+ runs TypeScript directly)
const N = 32; // interior cells per side; arrays have a 1-cell border
const SIZE = (N + 2) * (N + 2);
const ix = (i: number, j: number): number => i + (N + 2) * j;

type Field = Float32Array;

function setBnd(b: number, x: Field): void {
  // TODO step 5: copy edges from the inside; negate u on left/right (b=1), v on top/bottom (b=2)
}

function diffuse(b: number, x: Field, x0: Field, diff: number, dt: number): void {
  // TODO step 2: about 20 Gauss-Seidel sweeps of
  //   x[i,j] = (x0[i,j] + a * (sum of 4 neighbours of x)) / (1 + 4a),  a = dt*diff*N*N
  x.set(x0);
  setBnd(b, x);
}

function advect(b: number, d: Field, d0: Field, u: Field, v: Field, dt: number): void {
  // TODO step 3: trace each cell centre backwards by dt*N*(u,v), bilinear sample d0
  d.set(d0);
  setBnd(b, d);
}

function project(u: Field, v: Field, p: Field, div: Field): void {
  // TODO step 4: div = -0.5*(du/dx + dv/dy)/N, solve for p, subtract grad p
}

const u = new Float32Array(SIZE), v = new Float32Array(SIZE), dens = new Float32Array(SIZE);
const u0 = new Float32Array(SIZE), v0 = new Float32Array(SIZE), d0 = new Float32Array(SIZE);

function step(dt: number, visc: number, diff: number): void {
  u0.set(u); v0.set(v);
  diffuse(1, u, u0, visc, dt); diffuse(2, v, v0, visc, dt);
  project(u, v, u0, v0);
  u0.set(u); v0.set(v);
  advect(1, u, u0, u0, v0, dt); advect(2, v, v0, u0, v0, dt);
  project(u, v, u0, v0);
  d0.set(dens);
  diffuse(0, dens, d0, diff, dt);
  d0.set(dens);
  advect(0, dens, d0, u, v, dt);
}

for (let n = 0; n < 20; n++) {
  dens[ix(N / 2, 4)] += 4; // a source of smoke near the bottom
  v[ix(N / 2, 4)] += 2;    // blowing upwards
  step(0.1, 0, 0.0001);
}
const ramp = " .:-=+*#%@";
for (let j = N; j > 0; j -= 2) {
  let row = "";
  for (let i = 1; i <= N; i++) row += ramp[Math.min(Math.floor(dens[ix(i, j)] * 9), 9)];
  console.log(row);
}
