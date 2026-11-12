// Trajectory planner starter. Run: node main.ts   (Node 23.6+ runs TypeScript directly)
const MU_SUN = 1.32712440018e20; // m^3/s^2
const AU = 1.495978707e11;       // m
const R_EARTH = 1.0 * AU, R_MARS = 1.524 * AU;
const DAY = 86400;

interface State { x: number; y: number; vx: number; vy: number }
interface Transfer { dv1: number; dv2: number; time: number; phase: number }

const circularSpeed = (r: number): number => Math.sqrt(MU_SUN / r);

function rk4Step(s: State, dt: number): State {
  // TODO step 1: classic RK4 on d/dt (r, v) = (v, -mu r / |r|^3)
  return s;
}

function solveKepler(M: number, e: number): number {
  // TODO step 3: Newton's method on E - e sin E - M = 0
  return M;
}

function hohmann(r1: number, r2: number): Transfer {
  // TODO step 4: a = (r1 + r2)/2, vis-viva v^2 = mu (2/r - 1/a) at both ends,
  //              time = pi sqrt(a^3/mu), phase = pi - n2 * time
  return { dv1: 0, dv2: 0, time: 0, phase: 0 };
}

// TODO step 5: Lambert's problem with universal variables

const km = (v: number): string => (v / 1000).toFixed(2);
console.log(`Earth orbital speed: ${km(circularSpeed(R_EARTH))} km/s`);
console.log(`Mars orbital speed:  ${km(circularSpeed(R_MARS))} km/s`);
const t = hohmann(R_EARTH, R_MARS);
console.log(`Hohmann: dv1 ${km(t.dv1)} + dv2 ${km(t.dv2)} = ${km(t.dv1 + t.dv2)} km/s (want about 5.6)`);
console.log(`transfer time: ${(t.time / DAY).toFixed(0)} days (want about 259), phase angle ${((t.phase * 180) / Math.PI).toFixed(1)} deg (want about 44)`);
