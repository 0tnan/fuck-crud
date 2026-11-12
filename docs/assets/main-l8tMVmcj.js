var e=`// Path tracer starter. Run: node main.ts  ->  out.ppm   (Node 23.6+ runs TypeScript directly)
import { writeFileSync } from "node:fs";

const W = 400, H = 225;

type Vec = [number, number, number];

const add = (a: Vec, b: Vec): Vec => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a: Vec, b: Vec): Vec => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const mul = (a: Vec, s: number): Vec => [a[0] * s, a[1] * s, a[2] * s];
const dot = (a: Vec, b: Vec): number => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const unit = (a: Vec): Vec => mul(a, 1 / Math.sqrt(dot(a, a)));

/** Nearest positive t where the ray hits the sphere, or null. */
function hitSphere(center: Vec, radius: number, origin: Vec, dir: Vec): number | null {
  // TODO step 3: solve |origin + t*dir - center|^2 = radius^2
  return null;
}

function rayColor(origin: Vec, dir: Vec, depth = 0): Vec {
  // TODO step 3: shade by the normal when hitSphere returns a t
  // TODO step 4: scatter in a random direction and recurse (stop at depth 8)
  // TODO step 5: metal (reflect) and glass (refract + Schlick)
  const t = 0.5 * (dir[1] + 1);
  return add(mul([1, 1, 1], 1 - t), mul([0.5, 0.7, 1.0], t));
}

const toByte = (x: number): number => Math.floor(255.99 * Math.min(Math.max(x, 0), 1));

const rows: string[] = [\`P3\\n\${W} \${H}\\n255\`];
const aspect = W / H;
for (let j = 0; j < H; j++) {
  for (let i = 0; i < W; i++) {
    const u = ((i + 0.5) / W) * 2 - 1;
    const v = 1 - ((j + 0.5) / H) * 2;
    // TODO step 4: average many jittered samples, then gamma-correct
    const c = rayColor([0, 0, 0], unit([u * aspect, v, -1]));
    rows.push(c.map(toByte).join(" "));
  }
}
writeFileSync("out.ppm", rows.join("\\n") + "\\n");
console.log("wrote out.ppm");
`;export{e as default};