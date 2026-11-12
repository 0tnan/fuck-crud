var e=`// N-body starter. Run: node main.ts   (Node 23.6+ runs TypeScript directly)
const G = 1, EPS = 0.05, DT = 0.01;

interface Body { x: number; y: number; vx: number; vy: number; ax: number; ay: number; m: number }

/** Direct O(N^2) sum. Reference for the Barnes-Hut version. */
function accelerations(b: Body[]): void {
  for (const p of b) {
    p.ax = p.ay = 0;
    for (const q of b) {
      if (p === q) continue;
      const dx = q.x - p.x, dy = q.y - p.y;
      const inv = (G * q.m) / Math.pow(dx * dx + dy * dy + EPS * EPS, 1.5);
      p.ax += dx * inv;
      p.ay += dy * inv;
    }
  }
}

function treeAccelerations(b: Body[], theta = 0.5): void {
  // TODO step 3: build a quadtree storing mass and centre of mass per node
  // TODO step 4: walk it, opening a cell only when size / distance > theta
  accelerations(b);
}

function energy(b: Body[]): number {
  let e = 0;
  for (let i = 0; i < b.length; i++) {
    e += 0.5 * b[i].m * (b[i].vx ** 2 + b[i].vy ** 2);
    for (let j = i + 1; j < b.length; j++) {
      const dx = b[i].x - b[j].x, dy = b[i].y - b[j].y;
      e -= (G * b[i].m * b[j].m) / Math.sqrt(dx * dx + dy * dy + EPS * EPS);
    }
  }
  return e;
}

function step(b: Body[]): void {
  // TODO step 2: replace Euler with leapfrog (half kick, drift, half kick)
  treeAccelerations(b);
  for (const p of b) {
    p.x += p.vx * DT; p.y += p.vy * DT;
    p.vx += p.ax * DT; p.vy += p.ay * DT;
  }
}

/** Small deterministic generator (mulberry32), so runs are repeatable. */
function rng(seed: number): () => number {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const random = rng(1);
const n = 60;
const bodies: Body[] = Array.from({ length: n }, () => {
  const x = random() * 2 - 1, y = random() * 2 - 1;
  return { x, y, vx: -y * 0.8, vy: x * 0.8, ax: 0, ay: 0, m: 1 / n }; // TODO step 5: a real disc
});
for (let s = 0; s <= 200; s++) {
  if (s % 50 === 0) console.log(\`step \${String(s).padStart(4)}  energy \${energy(bodies).toFixed(6)}\`);
  step(bodies);
}
`;export{e as default};