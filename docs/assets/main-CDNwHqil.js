var e=`//! Synthesizer starter. Build: rustc -O main.rs && ./main  ->  out.wav
#![allow(dead_code, unused_variables)]
use std::f32::consts::PI;
use std::fs::File;
use std::io::{BufWriter, Write};

const RATE: u32 = 44100;

fn write_wav(path: &str, samples: &[f32]) -> std::io::Result<()> {
    let mut f = BufWriter::new(File::create(path)?);
    let bytes = samples.len() as u32 * 2;
    f.write_all(b"RIFF")?;
    f.write_all(&(36 + bytes).to_le_bytes())?;
    f.write_all(b"WAVEfmt ")?;
    f.write_all(&16u32.to_le_bytes())?;
    f.write_all(&1u16.to_le_bytes())?; // PCM
    f.write_all(&1u16.to_le_bytes())?; // mono
    f.write_all(&RATE.to_le_bytes())?;
    f.write_all(&(RATE * 2).to_le_bytes())?;
    f.write_all(&2u16.to_le_bytes())?;
    f.write_all(&16u16.to_le_bytes())?;
    f.write_all(b"data")?;
    f.write_all(&bytes.to_le_bytes())?;
    for &s in samples {
        f.write_all(&((s.clamp(-1.0, 1.0) * 32767.0) as i16).to_le_bytes())?;
    }
    Ok(())
}

/// phase is in [0, 1). Returns a sample in [-1, 1].
fn oscillator(phase: f32) -> f32 {
    // TODO step 2: saw, square, triangle, then PolyBLEP to remove aliasing
    (2.0 * PI * phase).sin()
}

fn envelope(t: f32, gate_time: f32) -> f32 {
    // TODO step 3: ADSR. Level in [0, 1] at time t for a key held gate_time seconds
    1.0
}

fn lowpass(samples: &mut [f32], cutoff: f32) {
    // TODO step 4: one-pole first, y += alpha * (x - y), then a state variable filter
}

fn main() -> std::io::Result<()> {
    let freq = 220.0;
    let mut phase = 0.0f32;
    let mut out = Vec::with_capacity(RATE as usize);
    for n in 0..RATE {
        out.push(0.4 * oscillator(phase) * envelope(n as f32 / RATE as f32, 0.7));
        phase = (phase + freq / RATE as f32).fract();
    }
    lowpass(&mut out, 2000.0);
    write_wav("out.wav", &out)?;
    println!("wrote out.wav");
    Ok(())
}
`;export{e as default};