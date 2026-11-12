//! Particle filter starter. Build: rustc -O main.rs && ./main
#![allow(dead_code, unused_variables)]
use std::f64::consts::PI;

const N: usize = 1000;
const BEACONS: [(f64, f64); 3] = [(-4.0, -3.0), (5.0, -2.0), (0.0, 5.0)];
const RANGE_NOISE: f64 = 0.3;
const MOTION_NOISE: f64 = 0.05;

struct Rng(u64);
impl Rng {
    fn uniform(&mut self) -> f64 {
        self.0 = self.0.wrapping_mul(6364136223846793005).wrapping_add(1442695040888963407);
        ((self.0 >> 11) as f64 + 1.0) / ((1u64 << 53) as f64 + 2.0)
    }
    fn range(&mut self, lo: f64, hi: f64) -> f64 { lo + (hi - lo) * self.uniform() }
    fn gauss(&mut self, sigma: f64) -> f64 {
        let (u, v) = (self.uniform(), self.uniform());
        sigma * (-2.0 * u.ln()).sqrt() * (2.0 * PI * v).cos()
    }
}

#[derive(Clone, Copy)]
struct Particle { x: f64, y: f64, w: f64 }

/// Move every particle by the commanded motion, each with its own noise.
fn predict(p: &mut [Particle], dx: f64, dy: f64, rng: &mut Rng) {
    for q in p.iter_mut() {
        q.x += dx + rng.gauss(MOTION_NOISE);
        q.y += dy + rng.gauss(MOTION_NOISE);
    }
}

fn weigh(p: &mut [Particle], z: &[f64]) {
    // TODO step 3: w_i = product over beacons of exp(-(z - expected)^2 / (2 sigma^2)),
    //              computed in log space, then normalised to sum to 1
    let n = p.len() as f64;
    for q in p.iter_mut() { q.w = 1.0 / n; }
}

fn resample(p: &mut Vec<Particle>, rng: &mut Rng) {
    // TODO step 4: systematic resampling (one random offset, N evenly spaced pointers)
    // TODO step 5: replace a few particles with random ones to survive kidnapping
}

fn main() {
    let mut rng = Rng(5);
    let mut p: Vec<Particle> = (0..N)
        .map(|_| Particle { x: rng.range(-6.0, 6.0), y: rng.range(-6.0, 6.0), w: 0.0 })
        .collect();
    let (mut x, mut y) = (2.0f64, 0.0f64);
    for step in 0..60 {
        let a = step as f64 * 0.1;
        let (dx, dy) = (-0.2 * a.sin(), 0.2 * a.cos()); // drive in a circle
        x += dx;
        y += dy;
        let z: Vec<f64> = BEACONS.iter().map(|b| (x - b.0).hypot(y - b.1) + rng.gauss(RANGE_NOISE)).collect();
        predict(&mut p, dx, dy, &mut rng);
        weigh(&mut p, &z);
        resample(&mut p, &mut rng);
        if step % 10 == 0 {
            let ex = p.iter().map(|q| q.x).sum::<f64>() / N as f64;
            let ey = p.iter().map(|q| q.y).sum::<f64>() / N as f64;
            println!("step {:2}  truth ({:+.2}, {:+.2})  estimate ({:+.2}, {:+.2})  error {:.2}",
                     step, x, y, ex, ey, (ex - x).hypot(ey - y));
        }
    }
}
