//! 2D physics engine starter. Build: rustc -O main.rs && ./main
#![allow(dead_code, unused_variables)]

const DT: f64 = 1.0 / 120.0;
const GRAVITY: f64 = -9.81;

#[derive(Clone, Debug)]
struct Body {
    x: f64, y: f64, vx: f64, vy: f64,
    angle: f64, omega: f64,
    radius: f64,
    inv_mass: f64, // 0 means static
    inv_inertia: f64,
    restitution: f64,
}

impl Body {
    fn ball(x: f64, y: f64, radius: f64) -> Body {
        Body { x, y, vx: 0.0, vy: 0.0, angle: 0.0, omega: 0.0, radius, inv_mass: 1.0, inv_inertia: 1.0, restitution: 0.5 }
    }

    /// Semi-implicit Euler: velocity first, then position.
    fn integrate(&mut self) {
        if self.inv_mass == 0.0 { return; }
        self.vy += GRAVITY * DT;
        self.x += self.vx * DT;
        self.y += self.vy * DT;
        self.angle += self.omega * DT;
    }

    fn collide_floor(&mut self) {
        // TODO step 2: if the circle goes below y = 0, push it out and reflect vy
        //              using the restitution coefficient
    }
}

fn collide(a: &mut Body, b: &mut Body) {
    // TODO step 2: circle vs circle -> normal, penetration, impulse
    // TODO step 3: polygons with the separating axis theorem
    // TODO step 5: friction impulse along the tangent, clamped by mu * normal impulse
}

fn main() {
    let mut bodies = vec![Body::ball(0.0, 5.0, 0.5)];
    for step in 0..360 {
        for b in bodies.iter_mut() {
            b.integrate();
            b.collide_floor();
        }
        for i in 0..bodies.len() {
            let (left, right) = bodies.split_at_mut(i + 1);
            for other in right.iter_mut() {
                collide(&mut left[i], other);
            }
        }
        if step % 12 == 0 {
            println!("t={:5.2}  y={:7.3}", step as f64 * DT, bodies[0].y);
        }
    }
}
