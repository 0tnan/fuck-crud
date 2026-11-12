var e=`//! Trajectory planner starter. Build: rustc -O main.rs && ./main
#![allow(dead_code, unused_variables)]
use std::f64::consts::PI;

const MU_SUN: f64 = 1.32712440018e20; // m^3/s^2
const AU: f64 = 1.495978707e11;       // m
const R_EARTH: f64 = 1.0 * AU;
const R_MARS: f64 = 1.524 * AU;
const DAY: f64 = 86400.0;

#[derive(Clone, Copy)]
struct State { x: f64, y: f64, vx: f64, vy: f64 }

struct Transfer { dv1: f64, dv2: f64, time: f64, phase: f64 }

fn circular_speed(r: f64) -> f64 { (MU_SUN / r).sqrt() }

fn rk4_step(s: State, dt: f64) -> State {
    // TODO step 1: classic RK4 on d/dt (r, v) = (v, -mu r / |r|^3)
    s
}

fn solve_kepler(m: f64, e: f64) -> f64 {
    // TODO step 3: Newton's method on E - e sin E - M = 0
    m
}

fn hohmann(r1: f64, r2: f64) -> Transfer {
    // TODO step 4: a = (r1 + r2)/2, vis-viva v^2 = mu (2/r - 1/a) at both ends,
    //              time = pi sqrt(a^3/mu), phase = pi - n2 * time
    Transfer { dv1: 0.0, dv2: 0.0, time: 0.0, phase: 0.0 }
}

// TODO step 5: Lambert's problem with universal variables

fn main() {
    println!("Earth orbital speed: {:.2} km/s", circular_speed(R_EARTH) / 1000.0);
    println!("Mars orbital speed:  {:.2} km/s", circular_speed(R_MARS) / 1000.0);
    let t = hohmann(R_EARTH, R_MARS);
    println!("Hohmann: dv1 {:.2} + dv2 {:.2} = {:.2} km/s (want about 5.6)",
             t.dv1 / 1000.0, t.dv2 / 1000.0, (t.dv1 + t.dv2) / 1000.0);
    println!("transfer time: {:.0} days (want about 259), phase angle {:.1} deg (want about 44)",
             t.time / DAY, t.phase.to_degrees());
}
`;export{e as default};