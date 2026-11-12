//! FFT starter. Build: rustc -O main.rs && ./main
#![allow(dead_code, unused_variables)]
use std::f64::consts::PI;

const RATE: f64 = 8000.0;
const N: usize = 1024;

#[derive(Clone, Copy)]
struct Complex { re: f64, im: f64 }

impl Complex {
    fn polar(angle: f64) -> Complex { Complex { re: angle.cos(), im: angle.sin() } }
    fn add(self, o: Complex) -> Complex { Complex { re: self.re + o.re, im: self.im + o.im } }
    fn mul(self, o: Complex) -> Complex {
        Complex { re: self.re * o.re - self.im * o.im, im: self.re * o.im + self.im * o.re }
    }
    fn abs(self) -> f64 { self.re.hypot(self.im) }
}

/// Slow reference transform, O(N^2). Keep it to test the fast one.
fn dft(x: &[Complex]) -> Vec<Complex> {
    let n = x.len();
    (0..n).map(|k| {
        let mut sum = Complex { re: 0.0, im: 0.0 };
        for t in 0..n {
            sum = sum.add(x[t].mul(Complex::polar(-2.0 * PI * (k * t % n) as f64 / n as f64)));
        }
        sum
    }).collect()
}

fn fft(x: &[Complex]) -> Vec<Complex> {
    // TODO step 2: recursive radix-2 FFT (split even/odd, combine with twiddles)
    // TODO step 3: iterative in-place version with bit reversal
    dft(x)
}

fn hann(i: usize, n: usize) -> f64 {
    // TODO step 4: return 0.5 - 0.5*cos(2*pi*i/(n-1))
    1.0
}

fn main() {
    let signal: Vec<Complex> = (0..N).map(|t| {
        let s = (2.0 * PI * 440.0 * t as f64 / RATE).sin() + 0.5 * (2.0 * PI * 1250.0 * t as f64 / RATE).sin();
        Complex { re: s * hann(t, N), im: 0.0 }
    }).collect();
    let mags: Vec<f64> = fft(&signal).iter().take(N / 2).map(|c| c.abs()).collect();
    for k in 1..N / 2 - 1 {
        if mags[k] > 50.0 && mags[k] >= mags[k - 1] && mags[k] >= mags[k + 1] { // local peaks
            println!("bin {:4}  {:7.1} Hz  magnitude {:8.1}", k, k as f64 * RATE / N as f64, mags[k]);
        }
    }
}
