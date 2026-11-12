// Cloth starter: a hanging rope first. Run: node main.ts   (Node 23.6+ runs TypeScript directly)
const DT = 1 / 60;
const REST = 0.1;
const GRAVITY = [0, -9.81, 0];

interface Particle { pos: number[]; prev: number[]; pinned: boolean }

const particle = (x: number, y: number, z: number, pinned = false): Particle =>
  ({ pos: [x, y, z], prev: [x, y, z], pinned });

function verlet(p: Particle, damping = 0.99): void {
  if (p.pinned) return;
  for (let k = 0; k < 3; k++) {
    const cur = p.pos[k];
    p.pos[k] = cur + (cur - p.prev[k]) * damping + GRAVITY[k] * DT * DT;
    p.prev[k] = cur;
  }
}

const dist = (a: Particle, b: Particle): number =>
  Math.hypot(a.pos[0] - b.pos[0], a.pos[1] - b.pos[1], a.pos[2] - b.pos[2]);

function satisfy(a: Particle, b: Particle, rest: number): void {
  // TODO step 2: measure the distance between a and b, and move each
  //              (unless pinned) half of the error along the line joining them
}

// a horizontal rope of 20 particles, pinned at one end
const rope = Array.from({ length: 20 }, (_, i) => particle(i * REST, 0, 0, i === 0));
const links: [number, number][] = Array.from({ length: 19 }, (_, i) => [i, i + 1]);
// TODO step 3: build a W x H grid with structural, shear and bend links
// TODO step 4: wind force per triangle, sphere collision
for (let frame = 0; frame < 240; frame++) {
  for (const p of rope) verlet(p);
  for (let it = 0; it < 8; it++) for (const [i, j] of links) satisfy(rope[i], rope[j], REST);
  if (frame % 40 === 0) {
    const lowest = Math.min(...rope.map((p) => p.pos[1]));
    const length = links.reduce((s, [i, j]) => s + dist(rope[i], rope[j]), 0);
    console.log(`frame ${String(frame).padStart(3)}  lowest y ${lowest.toFixed(3).padStart(8)}  rope length ${length.toFixed(3)} (want 1.900)`);
  }
}
