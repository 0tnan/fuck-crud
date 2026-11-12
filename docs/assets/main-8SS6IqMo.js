var e=`// 2D physics engine starter. Run: node main.ts   (Node 23.6+ runs TypeScript directly)
const DT = 1 / 120;
const GRAVITY = -9.81;

interface Body {
  x: number; y: number; vx: number; vy: number;
  angle: number; omega: number;
  radius: number;
  invMass: number; // 0 means static
  invInertia: number;
  restitution: number;
}

const ball = (x: number, y: number, radius: number): Body => ({
  x, y, vx: 0, vy: 0, angle: 0, omega: 0, radius, invMass: 1, invInertia: 1, restitution: 0.5,
});

/** Semi-implicit Euler: velocity first, then position. */
function integrate(b: Body): void {
  if (b.invMass === 0) return;
  b.vy += GRAVITY * DT;
  b.x += b.vx * DT;
  b.y += b.vy * DT;
  b.angle += b.omega * DT;
}

function collideFloor(b: Body): void {
  // TODO step 2: if the circle goes below y = 0, push it out and reflect vy
  //              using the restitution coefficient
}

function collide(a: Body, b: Body): void {
  // TODO step 2: circle vs circle -> normal, penetration, impulse
  // TODO step 3: polygons with the separating axis theorem
  // TODO step 5: friction impulse along the tangent, clamped by mu * normal impulse
}

const bodies: Body[] = [ball(0, 5, 0.5)];
for (let step = 0; step < 360; step++) {
  for (const b of bodies) { integrate(b); collideFloor(b); }
  for (let i = 0; i < bodies.length; i++)
    for (let j = i + 1; j < bodies.length; j++) collide(bodies[i], bodies[j]);
  if (step % 12 === 0) console.log(\`t=\${(step * DT).toFixed(2).padStart(5)}  y=\${bodies[0].y.toFixed(3).padStart(7)}\`);
}
`;export{e as default};