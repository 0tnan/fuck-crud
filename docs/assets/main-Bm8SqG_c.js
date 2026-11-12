var e=`// IMU fusion starter (one axis). Run: node main.ts   (Node 23.6+ runs TypeScript directly)
const DT = 0.01;
const GYRO_BIAS = 0.03;   // rad/s, unknown to the filter
const ACCEL_NOISE = 0.08; // rad

/** Gaussian noise with the Box-Muller transform. */
function gauss(sigma: number): number {
  const u = 1 - Math.random(), v = Math.random();
  return sigma * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

interface Filter { update(gyro: number, accelAngle: number): number }

class Complementary implements Filter {
  alpha = 0.98;
  angle = 0;
  update(gyro: number, accelAngle: number): number {
    // TODO step 2: blend the integrated gyro with the accelerometer angle
    this.angle += gyro * DT; // gyro only: this drifts
    return this.angle;
  }
}

/** State: angle and bias. TODO step 3: predict with the gyro, correct with the accelerometer. */
class Kalman implements Filter {
  angle = 0;
  bias = 0;
  P = [[1, 0], [0, 1]];
  update(gyro: number, accelAngle: number): number {
    return this.angle;
  }
}

const filter: Filter = new Complementary();
let worst = 0;
for (let n = 0; n < 3000; n++) {
  const t = n * DT;
  const truth = 0.5 * Math.sin(0.8 * t), rate = 0.4 * Math.cos(0.8 * t);
  const est = filter.update(rate + GYRO_BIAS + gauss(0.005), truth + gauss(ACCEL_NOISE));
  worst = Math.max(worst, Math.abs(est - truth));
  if (n % 500 === 0) console.log(\`t=\${t.toFixed(1).padStart(5)}s  truth \${truth.toFixed(3)}  estimate \${est.toFixed(3)}  error \${(est - truth).toFixed(3)}\`);
}
console.log(\`worst error: \${((worst * 180) / Math.PI).toFixed(1)} degrees\`);
`;export{e as default};