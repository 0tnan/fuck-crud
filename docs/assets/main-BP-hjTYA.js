var e=`//! Marching cubes starter. Build: rustc -O main.rs && ./main  ->  out.obj
#![allow(dead_code, unused_variables)]
use std::fs::File;
use std::io::{BufWriter, Write};

const N: usize = 24; // cells per side
const ISO: f32 = 0.0;

/// Negative inside, positive outside. Start with a sphere of radius 0.7.
fn density(x: f32, y: f32, z: f32) -> f32 {
    (x * x + y * y + z * z).sqrt() - 0.7
}

/// Values at the (N+1)^3 grid corners, over the cube [-1, 1]^3.
struct Grid { values: Vec<f32> }

impl Grid {
    fn sample() -> Grid {
        let c = |i: usize| i as f32 * 2.0 / N as f32 - 1.0;
        let mut values = Vec::with_capacity((N + 1).pow(3));
        for i in 0..=N { for j in 0..=N { for k in 0..=N { values.push(density(c(i), c(j), c(k))); } } }
        Grid { values }
    }

    fn at(&self, i: usize, j: usize, k: usize) -> f32 {
        self.values[(i * (N + 1) + j) * (N + 1) + k]
    }

    /// 8-bit case number: bit n is set when corner n is inside.
    fn cube_index(&self, i: usize, j: usize, k: usize) -> u8 {
        const CORNERS: [(usize, usize, usize); 8] =
            [(0, 0, 0), (1, 0, 0), (1, 1, 0), (0, 1, 0), (0, 0, 1), (1, 0, 1), (1, 1, 1), (0, 1, 1)];
        let mut idx = 0u8;
        for (n, &(dx, dy, dz)) in CORNERS.iter().enumerate() {
            if self.at(i + dx, j + dy, k + dz) < ISO { idx |= 1 << n; }
        }
        idx
    }
}

/// Returns (vertices, triangles as indices into vertices).
fn polygonise(grid: &Grid) -> (Vec<[f32; 3]>, Vec<[usize; 3]>) {
    // TODO step 2: get EDGE_TABLE and TRI_TABLE (Paul Bourke, "Polygonising a scalar field")
    // TODO step 3: for each cell, interpolate a vertex on every crossed edge, emit triangles
    // TODO step 4: normals from the gradient of density()
    (Vec::new(), Vec::new())
}

fn main() -> std::io::Result<()> {
    let grid = Grid::sample();
    let mut crossed = 0;
    for i in 0..N { for j in 0..N { for k in 0..N {
        let c = grid.cube_index(i, j, k);
        if c != 0 && c != 255 { crossed += 1; }
    } } }
    println!("{} of {} cells contain the surface", crossed, N * N * N);
    let (verts, tris) = polygonise(&grid);
    let mut f = BufWriter::new(File::create("out.obj")?);
    for v in &verts { writeln!(f, "v {:.5} {:.5} {:.5}", v[0], v[1], v[2])?; }
    for t in &tris { writeln!(f, "f {} {} {}", t[0] + 1, t[1] + 1, t[2] + 1)?; }
    println!("wrote out.obj: {} vertices, {} triangles", verts.len(), tris.len());
    Ok(())
}
`;export{e as default};