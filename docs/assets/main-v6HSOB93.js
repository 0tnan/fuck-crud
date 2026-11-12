var e=`//! Image codec starter. Build: rustc -O main.rs && ./main
#![allow(dead_code, unused_variables)]

type Block = [[f64; 8]; 8];

const QUANT: [[i32; 8]; 8] = [
    [16, 11, 10, 16, 24, 40, 51, 61], [12, 12, 14, 19, 26, 58, 60, 55],
    [14, 13, 16, 24, 40, 57, 69, 56], [14, 17, 22, 29, 51, 87, 80, 62],
    [18, 22, 37, 56, 68, 109, 103, 77], [24, 35, 55, 64, 81, 104, 113, 92],
    [49, 64, 78, 87, 103, 121, 120, 101], [72, 92, 95, 98, 112, 100, 103, 99],
];

/// Forward 8x8 DCT of a block of values centred on zero.
fn dct2(block: &Block) -> Block {
    // TODO step 2: F(u,v) = 1/4 C(u) C(v) sum f(x,y) cos((2x+1)u pi/16) cos((2y+1)v pi/16)
    //              with C(0) = 1/sqrt(2), otherwise 1
    [[0.0; 8]; 8]
}

fn idct2(coeffs: &Block) -> Block {
    // TODO step 2: the inverse transform
    [[0.0; 8]; 8]
}

fn quantise(coeffs: &Block) -> [[i32; 8]; 8] {
    // TODO step 3: round(coeffs[v][u] / QUANT[v][u])
    [[0; 8]; 8]
}

fn zigzag(block: &[[i32; 8]; 8]) -> Vec<i32> {
    // TODO step 4: return the 64 values in zigzag order, then run-length encode
    block.iter().flatten().copied().collect()
}

fn show(title: &str, block: &Block, decimals: usize) {
    println!("{}", title);
    for row in block {
        let cells: Vec<String> = row.iter().map(|x| format!("{:6.*}", decimals, x)).collect();
        println!("{}", cells.join(" "));
    }
}

fn main() {
    let mut block: Block = [[0.0; 8]; 8];
    for y in 0..8 { for x in 0..8 { block[y][x] = (x * 16 + y * 8) as f64 - 128.0; } } // a smooth gradient
    show("pixels (minus 128):", &block, 0);
    let coeffs = dct2(&block);
    show("DCT coefficients:", &coeffs, 1);
    let q = quantise(&coeffs);
    println!("non-zero after quantisation: {} of 64", zigzag(&q).iter().filter(|&&x| x != 0).count());
    let back = idct2(&coeffs);
    let mut err: f64 = 0.0;
    for y in 0..8 { for x in 0..8 { err = err.max((block[y][x] - back[y][x]).abs()); } }
    println!("round-trip error: {:.3} (want 0.000)", err);
}
`;export{e as default};