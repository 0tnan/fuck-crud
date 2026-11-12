var e=`//! Quadcopter controller starter (altitude axis). Build: rustc -O main.rs && ./main
#![allow(dead_code, unused_variables)]

const DT: f64 = 0.002;         // 500 Hz control loop
const MASS: f64 = 1.2;         // kg
const G: f64 = 9.81;
const MAX_THRUST: f64 = 30.0;  // N, all four rotors

struct Pid { kp: f64, ki: f64, kd: f64, integral: f64, prev_error: f64 }

impl Pid {
    fn new(kp: f64, ki: f64, kd: f64) -> Pid {
        Pid { kp, ki, kd, integral: 0.0, prev_error: 0.0 }
    }

    fn update(&mut self, error: f64, dt: f64) -> f64 {
        // TODO step 1: proportional + integral + derivative terms
        // TODO step 6: anti-windup (clamp the integral), filter the derivative
        0.0
    }
}

/// Step 1 models height only. TODO step 2: full 3D state with a quaternion.
struct Quad { z: f64, vz: f64 }

impl Quad {
    fn step(&mut self, thrust: f64, dt: f64) {
        let thrust = thrust.clamp(0.0, MAX_THRUST);
        self.vz += (thrust / MASS - G) * dt;
        self.z += self.vz * dt;
        if self.z < 0.0 {
            self.z = 0.0; // on the ground
            self.vz = 0.0;
        }
    }
}

fn mix(thrust: f64, roll: f64, pitch: f64, yaw: f64) -> [f64; 4] {
    // TODO step 3: four demands -> four rotor thrusts (X configuration)
    [thrust / 4.0; 4]
}

fn main() {
    let mut quad = Quad { z: 0.0, vz: 0.0 };
    let mut pid = Pid::new(0.0, 0.0, 0.0);
    let target = 1.0;
    for n in 0..=2500 {
        let hover = MASS * G * 0.9; // deliberately wrong: the I term must fix it
        let thrust = hover + pid.update(target - quad.z, DT);
        let rotors = mix(thrust, 0.0, 0.0, 0.0);
        quad.step(rotors.iter().sum(), DT);
        if n % 250 == 0 {
            println!("t={:4.1}s  z={:6.3} m  target {:.1} m", n as f64 * DT, quad.z, target);
        }
    }
}
`;export{e as default};