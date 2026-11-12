var e=`//! IMU fusion starter (one axis). Build: rustc -O main.rs && ./main
#![allow(dead_code, unused_variables)]
use std::f64::consts::PI;

const DT: f64 = 0.01;
const GYRO_BIAS: f64 = 0.03;   // rad/s, unknown to the filter
const ACCEL_NOISE: f64 = 0.08; // rad

struct Rng(u64);
impl Rng {
    fn uniform(&mut self) -> f64 {
        self.0 = self.0.wrapping_mul(6364136223846793005).wrapping_add(1442695040888963407);
        ((self.0 >> 11) as f64 + 1.0) / ((1u64 << 53) as f64 + 2.0)
    }
    /// Gaussian noise with the Box-Muller transform.
    fn gauss(&mut self, sigma: f64) -> f64 {
        let (u, v) = (self.uniform(), self.uniform());
        sigma * (-2.0 * u.ln()).sqrt() * (2.0 * PI * v).cos()
    }
}

struct Complementary { alpha: f64, angle: f64 }

impl Complementary {
    fn update(&mut self, gyro: f64, accel_angle: f64) -> f64 {
        // TODO step 2: blend the integrated gyro with the accelerometer angle
        self.angle += gyro * DT; // gyro only: this drifts
        self.angle
    }
}

/// State: angle and bias. TODO step 3: predict with the gyro, correct with the accelerometer.
struct Kalman { angle: f64, bias: f64, p: [[f64; 2]; 2] }

impl Kalman {
    fn update(&mut self, gyro: f64, accel_angle: f64) -> f64 {
        self.angle
    }
}

fn main() {
    let mut rng = Rng(7);
    let mut filter = Complementary { alpha: 0.98, angle: 0.0 };
    let mut worst: f64 = 0.0;
    for n in 0..3000 {
        let t = n as f64 * DT;
        let truth = 0.5 * (0.8 * t).sin();
        let rate = 0.4 * (0.8 * t).cos();
        let gyro = rate + GYRO_BIAS + rng.gauss(0.005);
        let acc = truth + rng.gauss(ACCEL_NOISE);
        let est = filter.update(gyro, acc);
        worst = worst.max((est - truth).abs());
        if n % 500 == 0 {
            println!("t={:5.1}s  truth {:+.3}  estimate {:+.3}  error {:+.3}", t, truth, est, est - truth);
        }
    }
    println!("worst error: {:.1} degrees", worst.to_degrees());
}
`;export{e as default};