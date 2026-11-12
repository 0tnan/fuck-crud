//! Inverse kinematics starter (planar arm). Build: rustc -O main.rs && ./main
#![allow(dead_code, unused_variables)]

const LENGTHS: [f64; 3] = [1.0, 0.8, 0.6];

type Point = (f64, f64);

/// Joint positions for relative joint angles.
fn forward(angles: &[f64]) -> Vec<Point> {
    let (mut x, mut y, mut total) = (0.0, 0.0, 0.0);
    let mut pts = vec![(0.0, 0.0)];
    for (length, a) in LENGTHS.iter().zip(angles) {
        total += a;
        x += length * f64::cos(total);
        y += length * f64::sin(total);
        pts.push((x, y));
    }
    pts
}

/// Returns (shoulder, elbow), or None when the target is out of reach.
fn solve_two_link(l1: f64, l2: f64, target: Point) -> Option<(f64, f64)> {
    // TODO step 2: law of cosines for the elbow, atan2 for the shoulder
    None
}

fn fabrik(points: &mut [Point], target: Point, iterations: usize) {
    // TODO step 3: backward pass from the target, forward pass from the base
}

fn jacobian_step(angles: &mut [f64], target: Point, damping: f64) {
    // TODO step 4: build J (2 x n), then angles += J^T (J J^T + damping^2 I)^-1 * error
}

fn main() {
    let target: Point = (1.2, 1.1);
    let mut angles = [0.3, 0.3, 0.3];
    for it in 0..20 {
        let pts = forward(&angles);
        let tip = pts[pts.len() - 1];
        if it % 5 == 0 {
            let err = (tip.0 - target.0).hypot(tip.1 - target.1);
            println!("iteration {:2}  tip ({:+.3}, {:+.3})  distance to target {:.4}", it, tip.0, tip.1, err);
        }
        jacobian_step(&mut angles, target, 0.1);
    }
}
