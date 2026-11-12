var e=`//! N-body starter. Build: rustc -O main.rs && ./main
#![allow(dead_code, unused_variables)]

const NB: usize = 60;
const G: f64 = 1.0;
const EPS: f64 = 0.05;
const DT: f64 = 0.01;

#[derive(Clone, Copy, Default)]
struct Body { x: f64, y: f64, vx: f64, vy: f64, ax: f64, ay: f64, m: f64 }

/// Direct O(N^2) sum. Reference for the Barnes-Hut version.
fn accelerations(b: &mut [Body]) {
    for i in 0..b.len() {
        let (mut ax, mut ay) = (0.0, 0.0);
        for j in 0..b.len() {
            if i == j { continue; }
            let (dx, dy) = (b[j].x - b[i].x, b[j].y - b[i].y);
            let inv = G * b[j].m / (dx * dx + dy * dy + EPS * EPS).powf(1.5);
            ax += dx * inv;
            ay += dy * inv;
        }
        b[i].ax = ax;
        b[i].ay = ay;
    }
}

fn tree_accelerations(b: &mut [Body], theta: f64) {
    // TODO step 3: build a quadtree storing mass and centre of mass per node
    // TODO step 4: walk it, opening a cell only when size / distance > theta
    accelerations(b);
}

fn energy(b: &[Body]) -> f64 {
    let mut e = 0.0;
    for i in 0..b.len() {
        e += 0.5 * b[i].m * (b[i].vx * b[i].vx + b[i].vy * b[i].vy);
        for j in i + 1..b.len() {
            let (dx, dy) = (b[i].x - b[j].x, b[i].y - b[j].y);
            e -= G * b[i].m * b[j].m / (dx * dx + dy * dy + EPS * EPS).sqrt();
        }
    }
    e
}

fn step(b: &mut [Body]) {
    // TODO step 2: replace Euler with leapfrog (half kick, drift, half kick)
    tree_accelerations(b, 0.5);
    for p in b.iter_mut() {
        p.x += p.vx * DT;
        p.y += p.vy * DT;
        p.vx += p.ax * DT;
        p.vy += p.ay * DT;
    }
}

/// Small deterministic generator, so the starter needs no crate.
struct Rng(u64);
impl Rng {
    fn next(&mut self) -> f64 {
        self.0 = self.0.wrapping_mul(6364136223846793005).wrapping_add(1442695040888963407);
        (self.0 >> 11) as f64 / (1u64 << 53) as f64
    }
}

fn main() {
    let mut rng = Rng(1);
    let mut bodies = vec![Body::default(); NB];
    for b in bodies.iter_mut() {
        b.x = rng.next() * 2.0 - 1.0;
        b.y = rng.next() * 2.0 - 1.0;
        b.vx = -b.y * 0.8; // TODO step 5: a real disc
        b.vy = b.x * 0.8;
        b.m = 1.0 / NB as f64;
    }
    for s in 0..=200 {
        if s % 50 == 0 {
            println!("step {:4}  energy {:+.6}", s, energy(&bodies));
        }
        step(&mut bodies);
    }
}
`;export{e as default};