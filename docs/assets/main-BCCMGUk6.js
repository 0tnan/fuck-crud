var e=`//! FM receiver starter. Build: rustc -O main.rs && ./main
#![allow(dead_code, unused_variables)]
use std::f64::consts::PI;

const RATE: f64 = 240_000.0;     // sample rate of the I/Q stream
const DEVIATION: f64 = 75_000.0; // Hz, broadcast FM
const TONE: f64 = 1000.0;        // Hz, the message

/// One complex sample: in-phase and quadrature.
#[derive(Clone, Copy)]
struct Iq { i: f32, q: f32 }

/// An FM transmitter: integrate the message into a phase.
fn modulate(message: &[f32]) -> Vec<Iq> {
    let mut phase = 0.0f64;
    message.iter().map(|&m| {
        phase += 2.0 * PI * DEVIATION * m as f64 / RATE;
        Iq { i: phase.cos() as f32, q: phase.sin() as f32 }
    }).collect()
}

fn demodulate(iq: &[Iq]) -> Vec<f32> {
    // TODO step 3: for each sample, the angle of iq[n] * conj(iq[n-1]),
    //              scaled by RATE / (2*pi*DEVIATION) to get back to [-1, 1]
    vec![0.0; iq.len()]
}

fn lowpass_taps(cutoff: f64, n_taps: usize) -> Vec<f32> {
    // TODO step 4: windowed sinc. Then filter and decimate 240 kHz -> 48 kHz
    vec![1.0]
}

fn measure_frequency(x: &[f32], rate: f64) -> f64 {
    let crossings = x.windows(2).filter(|w| w[0] < 0.0 && w[1] >= 0.0).count();
    crossings as f64 * rate / x.len() as f64
}

fn main() {
    let count = (RATE / 10.0) as usize;
    let message: Vec<f32> = (0..count).map(|n| (2.0 * PI * TONE * n as f64 / RATE).sin() as f32).collect();
    let iq = modulate(&message);
    let audio = demodulate(&iq);
    let peak = audio.iter().fold(0.0f32, |m, a| m.max(a.abs()));
    println!("{} I/Q samples, |iq| = {:.3} (constant envelope)", iq.len(), iq[100].i.hypot(iq[100].q));
    println!("recovered tone: {:.0} Hz (want {:.0}), peak {:.2} (want 1.00)", measure_frequency(&audio, RATE), TONE, peak);
    // TODO step 5: de-emphasis, then write audio to a WAV file
}
`;export{e as default};