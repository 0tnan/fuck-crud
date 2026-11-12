var e=`// Inverse kinematics starter (planar arm). Run: node main.ts   (Node 23.6+ runs TypeScript directly)
const LENGTHS = [1.0, 0.8, 0.6];

type Point = [number, number];

/** Joint positions for relative joint angles. */
function forward(angles: number[]): Point[] {
  const pts: Point[] = [[0, 0]];
  let x = 0, y = 0, total = 0;
  LENGTHS.forEach((length, i) => {
    total += angles[i];
    x += length * Math.cos(total);
    y += length * Math.sin(total);
    pts.push([x, y]);
  });
  return pts;
}

/** Returns [shoulder, elbow], or null when the target is out of reach. */
function solveTwoLink(l1: number, l2: number, target: Point): [number, number] | null {
  // TODO step 2: law of cosines for the elbow, atan2 for the shoulder
  return null;
}

function fabrik(points: Point[], target: Point, iterations = 10): Point[] {
  // TODO step 3: backward pass from the target, forward pass from the base
  return points;
}

function jacobianStep(angles: number[], target: Point, damping = 0.1): number[] {
  // TODO step 4: build J (2 x n), then angles += J^T (J J^T + damping^2 I)^-1 * error
  return angles;
}

const target: Point = [1.2, 1.1];
let angles = [0.3, 0.3, 0.3];
for (let it = 0; it < 20; it++) {
  const pts = forward(angles);
  const tip = pts[pts.length - 1];
  if (it % 5 === 0) {
    const err = Math.hypot(tip[0] - target[0], tip[1] - target[1]);
    console.log(\`iteration \${String(it).padStart(2)}  tip (\${tip[0].toFixed(3)}, \${tip[1].toFixed(3)})  distance to target \${err.toFixed(4)}\`);
  }
  angles = jacobianStep(angles, target);
}
`;export{e as default};