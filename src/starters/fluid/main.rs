//! Stable fluids starter. Build: rustc -O main.rs && ./main
#![allow(dead_code, unused_variables)]

const N: usize = 32; // interior cells per side; arrays have a 1-cell border
const SIZE: usize = (N + 2) * (N + 2);

fn ix(i: usize, j: usize) -> usize { i + (N + 2) * j }

fn set_bnd(b: u8, x: &mut [f32]) {
    // TODO step 5: copy edges from the inside; negate u on left/right (b=1), v on top/bottom (b=2)
}

fn diffuse(b: u8, x: &mut [f32], x0: &[f32], diff: f32, dt: f32) {
    // TODO step 2: about 20 Gauss-Seidel sweeps of
    //   x[i,j] = (x0[i,j] + a * (sum of 4 neighbours of x)) / (1 + 4a),  a = dt*diff*N*N
    x.copy_from_slice(x0);
    set_bnd(b, x);
}

fn advect(b: u8, d: &mut [f32], d0: &[f32], u: &[f32], v: &[f32], dt: f32) {
    // TODO step 3: trace each cell centre backwards by dt*N*(u,v), bilinear sample d0
    d.copy_from_slice(d0);
    set_bnd(b, d);
}

fn project(u: &mut [f32], v: &mut [f32], p: &mut [f32], div: &mut [f32]) {
    // TODO step 4: div = -0.5*(du/dx + dv/dy)/N, solve for p, subtract grad p
}

struct Fluid { u: Vec<f32>, v: Vec<f32>, dens: Vec<f32> }

impl Fluid {
    fn step(&mut self, dt: f32, visc: f32, diff: f32) {
        let (mut u0, mut v0) = (self.u.clone(), self.v.clone());
        diffuse(1, &mut self.u, &u0, visc, dt);
        diffuse(2, &mut self.v, &v0, visc, dt);
        project(&mut self.u, &mut self.v, &mut u0, &mut v0);
        let (mut u0, mut v0) = (self.u.clone(), self.v.clone());
        advect(1, &mut self.u, &u0, &u0, &v0, dt);
        advect(2, &mut self.v, &v0, &u0, &v0, dt);
        project(&mut self.u, &mut self.v, &mut u0, &mut v0);
        let d0 = self.dens.clone();
        diffuse(0, &mut self.dens, &d0, diff, dt);
        let d0 = self.dens.clone();
        advect(0, &mut self.dens, &d0, &self.u, &self.v, dt);
    }
}

fn main() {
    let mut f = Fluid { u: vec![0.0; SIZE], v: vec![0.0; SIZE], dens: vec![0.0; SIZE] };
    for _ in 0..20 {
        f.dens[ix(N / 2, 4)] += 4.0; // a source of smoke near the bottom
        f.v[ix(N / 2, 4)] += 2.0;    // blowing upwards
        f.step(0.1, 0.0, 0.0001);
    }
    let ramp: Vec<char> = " .:-=+*#%@".chars().collect();
    for j in (1..=N).rev().step_by(2) {
        let row: String = (1..=N).map(|i| ramp[((f.dens[ix(i, j)] * 9.0) as usize).min(9)]).collect();
        println!("{}", row);
    }
}
