var e=`//! Reed-Solomon starter. Build: rustc -O main.rs && ./main
#![allow(dead_code, unused_variables)]

const PRIM: u32 = 0x11d; // x^8 + x^4 + x^3 + x^2 + 1, the polynomial QR codes use
const NSYM: usize = 10;

/// Arithmetic in GF(256) through log and antilog tables.
struct Field { exp: [u8; 512], log: [u8; 256] }

impl Field {
    fn new() -> Field {
        let f = Field { exp: [0; 512], log: [0; 256] };
        // TODO step 1: x = 1; for i in 0..255: exp[i] = x, log[x] = i, x = x*2 (xor PRIM on overflow)
        //              then copy exp[i + 255] = exp[i] so sums of logs need no modulo
        f
    }

    fn mul(&self, a: u8, b: u8) -> u8 {
        // TODO step 1: 0 if either is 0, otherwise exp[log[a] + log[b]]
        0
    }

    fn poly_eval(&self, p: &[u8], x: u8) -> u8 {
        // TODO step 2: Horner's rule, highest degree first
        0
    }

    fn generator(&self, nsym: usize) -> Vec<u8> {
        // TODO step 3: product of (x - 2^i) for i in 0..nsym
        vec![1]
    }

    fn encode(&self, msg: &[u8], nsym: usize) -> Vec<u8> {
        // TODO step 3: remainder of msg * x^nsym divided by generator(nsym), appended to msg
        let mut out = msg.to_vec();
        out.resize(msg.len() + nsym, 0);
        out
    }

    fn has_errors(&self, block: &[u8], nsym: usize) -> bool {
        (0..nsym).any(|i| self.poly_eval(block, self.exp[i]) != 0)
    }
}

fn main() {
    let gf = Field::new();
    println!("2 * 128 in GF(256) = {} (want 29)", gf.mul(2, 128));
    let mut block = gf.encode(b"hello world", NSYM);
    let hex: String = block.iter().map(|b| format!("{:02x}", b)).collect();
    println!("codeword: {}", hex);
    println!("syndromes all zero: {} (want true, with real parity bytes)", !gf.has_errors(&block, NSYM));
    block[3] ^= 0xff;
    println!("after corrupting a byte, syndromes non-zero: {} (want true)", gf.has_errors(&block, NSYM));
    // TODO step 5: Berlekamp-Massey, Chien search, Forney -> repair the block
}
`;export{e as default};