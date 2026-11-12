//! Gray-Scott starter. Build: rustc -O main.rs && ./main  ->  out.pgm
#![allow(dead_code, unused_variables)]
use std::fs::File;
use std::io::{BufWriter, Write};

const N: usize = 256;
const DU: f32 = 0.21;
const DV: f32 = 0.105;
const F: f32 = 0.037;
const K: f32 = 0.06;

fn at(i: usize, j: usize) -> usize { j * N + i }

fn laplacian(a: &[f32], i: usize, j: usize) -> f32 {
    // TODO step 2: neighbours minus 4x centre, wrapping at the edges (use % N)
    0.0
}

/// One Euler step with dt = 1: read from (u, v), write into (nu, nv).
fn step(u: &[f32], v: &[f32], nu: &mut [f32], nv: &mut [f32]) {
    nu.copy_from_slice(u);
    nv.copy_from_slice(v);
    // TODO step 3: for every cell
    //   uvv = u*v*v
    //   nu = u + DU*lap(u) - uvv + F*(1 - u)
    //   nv = v + DV*lap(v) + uvv - (F + K)*v
}

fn main() -> std::io::Result<()> {
    let (mut u, mut v) = (vec![1.0f32; N * N], vec![0.0f32; N * N]);
    let (mut nu, mut nv) = (u.clone(), v.clone());
    for j in N / 2 - 8..N / 2 + 8 {
        for i in N / 2 - 8..N / 2 + 8 {
            u[at(i, j)] = 0.5;
            v[at(i, j)] = 0.25;
        }
    }
    for _ in 0..5000 {
        step(&u, &v, &mut nu, &mut nv);
        std::mem::swap(&mut u, &mut nu);
        std::mem::swap(&mut v, &mut nv);
    }
    let mut f = BufWriter::new(File::create("out.pgm")?);
    writeln!(f, "P2\n{} {}\n255", N, N)?;
    for j in 0..N {
        let row: Vec<String> = (0..N).map(|i| (((v[at(i, j)] * 3.0).clamp(0.0, 1.0) * 255.0) as u8).to_string()).collect();
        writeln!(f, "{}", row.join(" "))?;
    }
    println!("wrote out.pgm, total V = {:.1}", v.iter().sum::<f32>());
    Ok(())
}
