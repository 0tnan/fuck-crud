var e=`//! Path tracer starter. Build: rustc -O main.rs && ./main  ->  out.ppm
#![allow(dead_code, unused_variables)]
use std::fs::File;
use std::io::{BufWriter, Write};

const W: usize = 400;
const H: usize = 225;

#[derive(Clone, Copy)]
struct Vec3 { x: f64, y: f64, z: f64 }

fn v(x: f64, y: f64, z: f64) -> Vec3 { Vec3 { x, y, z } }
fn add(a: Vec3, b: Vec3) -> Vec3 { v(a.x + b.x, a.y + b.y, a.z + b.z) }
fn sub(a: Vec3, b: Vec3) -> Vec3 { v(a.x - b.x, a.y - b.y, a.z - b.z) }
fn mul(a: Vec3, s: f64) -> Vec3 { v(a.x * s, a.y * s, a.z * s) }
fn dot(a: Vec3, b: Vec3) -> f64 { a.x * b.x + a.y * b.y + a.z * b.z }
fn unit(a: Vec3) -> Vec3 { mul(a, 1.0 / dot(a, a).sqrt()) }

/// Nearest positive t where the ray hits the sphere.
fn hit_sphere(center: Vec3, radius: f64, origin: Vec3, dir: Vec3) -> Option<f64> {
    // TODO step 3: solve |origin + t*dir - center|^2 = radius^2
    None
}

fn ray_color(origin: Vec3, dir: Vec3, depth: u32) -> Vec3 {
    // TODO step 3: shade by the normal when hit_sphere returns Some(t)
    // TODO step 4: scatter in a random direction and recurse (stop at depth 8)
    // TODO step 5: metal (reflect) and glass (refract + Schlick)
    let t = 0.5 * (dir.y + 1.0);
    add(mul(v(1.0, 1.0, 1.0), 1.0 - t), mul(v(0.5, 0.7, 1.0), t))
}

fn to_byte(x: f64) -> u8 { (255.99 * x.clamp(0.0, 1.0)) as u8 }

fn main() -> std::io::Result<()> {
    let mut f = BufWriter::new(File::create("out.ppm")?);
    writeln!(f, "P3\\n{} {}\\n255", W, H)?;
    let aspect = W as f64 / H as f64;
    for j in 0..H {
        for i in 0..W {
            let u = (i as f64 + 0.5) / W as f64 * 2.0 - 1.0;
            let vv = 1.0 - (j as f64 + 0.5) / H as f64 * 2.0;
            // TODO step 4: average many jittered samples, then gamma-correct
            let c = ray_color(v(0.0, 0.0, 0.0), unit(v(u * aspect, vv, -1.0)), 0);
            writeln!(f, "{} {} {}", to_byte(c.x), to_byte(c.y), to_byte(c.z))?;
        }
    }
    println!("wrote out.ppm");
    Ok(())
}
`;export{e as default};