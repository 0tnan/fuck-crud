// GPS solver starter. Run: node main.ts   (Node 23.6+ runs TypeScript directly)
const C = 299_792_458;      // speed of light, m/s
const EARTH_R = 6_371_000;
const SAT_R = 26_571_000;   // orbit radius of GPS satellites

type Vec = [number, number, number];

function onSphere(radius: number, latDeg: number, lonDeg: number): Vec {
  const lat = (latDeg * Math.PI) / 180, lon = (lonDeg * Math.PI) / 180;
  return [radius * Math.cos(lat) * Math.cos(lon), radius * Math.cos(lat) * Math.sin(lon), radius * Math.sin(lat)];
}

const dist = (a: number[], b: number[]): number => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

/** Returns [x, y, z, clock bias in metres]. */
function solve(sats: Vec[], rho: number[], iterations = 8): number[] {
  const est = [0, 0, 0, 0];
  for (let it = 0; it < iterations; it++) {
    // TODO step 2: residuals r_i = rho_i - (|s_i - x| + b) and rows of H:
    //              [-(s_i - x)/|s_i - x|, 1]
    // TODO step 3: solve (H^T H) dx = H^T r (4x4, Gaussian elimination), est += dx
  }
  return est;
}

const places = [[60, 10], [30, -40], [20, 50], [70, 120], [10, 0], [45, 80]];
const noise = [1.3, -2.1, 0.4, 2.6, -0.8, -1.5]; // metres
const truth = onSphere(EARTH_R, 48.85, 2.35);
const bias = 1e-4; // seconds, unknown to the solver
const sats = places.map(([lat, lon]) => onSphere(SAT_R, lat, lon));
const rho = sats.map((s, i) => dist(s, truth) + C * bias + noise[i]);
console.log("pseudoranges (km):", rho.map((r) => (r / 1000).toFixed(0)).join(" "));
const est = solve(sats, rho);
console.log(`position error: ${(dist(est, truth) / 1000).toFixed(3)} km`);
console.log(`clock bias: ${((est[3] / C) * 1e6).toFixed(2)} microseconds (truth 100.00)`);
// TODO step 4: convert est to latitude, longitude, height on WGS-84
