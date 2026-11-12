var e=`// Quadcopter controller starter (altitude axis). Run: node main.ts   (Node 23.6+ runs TypeScript directly)
const DT = 0.002;       // 500 Hz control loop
const MASS = 1.2;       // kg
const G = 9.81;
const MAX_THRUST = 30;  // N, all four rotors

class PID {
  kp: number; ki: number; kd: number;
  integral = 0;
  prevError = 0;

  constructor(kp: number, ki: number, kd: number) {
    this.kp = kp; this.ki = ki; this.kd = kd;
  }

  update(error: number, dt: number): number {
    // TODO step 1: proportional + integral + derivative terms
    // TODO step 6: anti-windup (clamp the integral), filter the derivative
    return 0;
  }
}

/** Step 1 models height only. TODO step 2: full 3D state with a quaternion. */
class Quad {
  z = 0;
  vz = 0;

  step(thrust: number, dt: number): void {
    thrust = Math.min(Math.max(thrust, 0), MAX_THRUST);
    this.vz += (thrust / MASS - G) * dt;
    this.z += this.vz * dt;
    if (this.z < 0) { this.z = 0; this.vz = 0; } // on the ground
  }
}

function mix(thrust: number, roll: number, pitch: number, yaw: number): number[] {
  // TODO step 3: four demands -> four rotor thrusts (X configuration)
  return [thrust / 4, thrust / 4, thrust / 4, thrust / 4];
}

const quad = new Quad(), pid = new PID(0, 0, 0), target = 1.0;
for (let n = 0; n <= 2500; n++) {
  const hover = MASS * G * 0.9; // deliberately wrong: the I term must fix it
  const rotors = mix(hover + pid.update(target - quad.z, DT), 0, 0, 0);
  quad.step(rotors.reduce((a, b) => a + b, 0), DT);
  if (n % 250 === 0) console.log(\`t=\${(n * DT).toFixed(1).padStart(4)}s  z=\${quad.z.toFixed(3).padStart(6)} m  target \${target.toFixed(1)} m\`);
}
`;export{e as default};