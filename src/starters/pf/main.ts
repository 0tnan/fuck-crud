// Particle filter starter. Run: node main.ts   (Node 23.6+ runs TypeScript directly)
const N = 1000;
const BEACONS = [[-4, -3], [5, -2], [0, 5]];
const RANGE_NOISE = 0.3;
const MOTION_NOISE = 0.05;

interface Particle { x: number; y: number; w: number }

const uniform = (lo: number, hi: number): number => lo + (hi - lo) * Math.random();
function gauss(sigma: number): number {
  const u = 1 - Math.random(), v = Math.random();
  return sigma * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

const measure = (x: number, y: number): number[] => BEACONS.map(([bx, by]) => Math.hypot(x - bx, y - by));

/** Move every particle by the commanded motion, each with its own noise. */
function predict(particles: Particle[], dx: number, dy: number): void {
  for (const p of particles) {
    p.x += dx + gauss(MOTION_NOISE);
    p.y += dy + gauss(MOTION_NOISE);
  }
}

function weigh(particles: Particle[], z: number[]): void {
  // TODO step 3: w_i = product over beacons of exp(-(z - expected)^2 / (2 sigma^2)),
  //              computed in log space, then normalised to sum to 1
  for (const p of particles) p.w = 1 / particles.length;
}

function resample(particles: Particle[]): Particle[] {
  // TODO step 4: systematic resampling (one random offset, N evenly spaced pointers)
  // TODO step 5: replace a few particles with random ones to survive kidnapping
  return particles;
}

let particles: Particle[] = Array.from({ length: N }, () => ({ x: uniform(-6, 6), y: uniform(-6, 6), w: 0 }));
let x = 2, y = 0;
const f = (v: number): string => (v >= 0 ? "+" : "") + v.toFixed(2);
for (let step = 0; step < 60; step++) {
  const a = step * 0.1, dx = -0.2 * Math.sin(a), dy = 0.2 * Math.cos(a); // drive in a circle
  x += dx; y += dy;
  const z = measure(x, y).map((r) => r + gauss(RANGE_NOISE));
  predict(particles, dx, dy);
  weigh(particles, z);
  particles = resample(particles);
  if (step % 10 === 0) {
    const ex = particles.reduce((s, p) => s + p.x, 0) / N, ey = particles.reduce((s, p) => s + p.y, 0) / N;
    console.log(`step ${String(step).padStart(2)}  truth (${f(x)}, ${f(y)})  estimate (${f(ex)}, ${f(ey)})  error ${Math.hypot(ex - x, ey - y).toFixed(2)}`);
  }
}
