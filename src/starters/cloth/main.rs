//! Cloth starter: a hanging rope first. Build: rustc -O main.rs && ./main
#![allow(dead_code, unused_variables)]

const DT: f64 = 1.0 / 60.0;
const REST: f64 = 0.1;
const GRAVITY: [f64; 3] = [0.0, -9.81, 0.0];

#[derive(Clone)]
struct Particle { pos: [f64; 3], prev: [f64; 3], pinned: bool }

impl Particle {
    fn new(x: f64, y: f64, z: f64, pinned: bool) -> Particle {
        Particle { pos: [x, y, z], prev: [x, y, z], pinned }
    }

    fn verlet(&mut self, damping: f64) {
        if self.pinned { return; }
        for k in 0..3 {
            let cur = self.pos[k];
            self.pos[k] = cur + (cur - self.prev[k]) * damping + GRAVITY[k] * DT * DT;
            self.prev[k] = cur;
        }
    }
}

fn dist(a: &Particle, b: &Particle) -> f64 {
    (0..3).map(|k| (a.pos[k] - b.pos[k]).powi(2)).sum::<f64>().sqrt()
}

fn satisfy(p: &mut [Particle], i: usize, j: usize, rest: f64) {
    // TODO step 2: measure the distance between p[i] and p[j], and move each
    //              (unless pinned) half of the error along the line joining them
}

fn main() {
    // a horizontal rope of 20 particles, pinned at one end
    let mut rope: Vec<Particle> = (0..20).map(|i| Particle::new(i as f64 * REST, 0.0, 0.0, i == 0)).collect();
    let links: Vec<(usize, usize)> = (0..19).map(|i| (i, i + 1)).collect();
    // TODO step 3: build a W x H grid with structural, shear and bend links
    // TODO step 4: wind force per triangle, sphere collision
    for frame in 0..240 {
        for p in rope.iter_mut() {
            p.verlet(0.99);
        }
        for _ in 0..8 {
            for &(i, j) in &links {
                satisfy(&mut rope, i, j, REST);
            }
        }
        if frame % 40 == 0 {
            let lowest = rope.iter().map(|p| p.pos[1]).fold(0.0, f64::min);
            let length: f64 = links.iter().map(|&(i, j)| dist(&rope[i], &rope[j])).sum();
            println!("frame {:3}  lowest y {:8.3}  rope length {:7.3} (want 1.900)", frame, lowest, length);
        }
    }
}
