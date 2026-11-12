var e=`// Synthesizer starter. Run: node main.ts  ->  out.wav   (Node 23.6+ runs TypeScript directly)
import { writeFileSync } from "node:fs";

const RATE = 44100;

function writeWav(path: string, samples: Float32Array): void {
  const buf = Buffer.alloc(44 + samples.length * 2);
  buf.write("RIFF", 0); buf.writeUInt32LE(36 + samples.length * 2, 4); buf.write("WAVEfmt ", 8);
  buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(RATE, 24); buf.writeUInt32LE(RATE * 2, 28); buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34);
  buf.write("data", 36); buf.writeUInt32LE(samples.length * 2, 40);
  samples.forEach((s, i) => buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, s)) * 32767), 44 + i * 2));
  writeFileSync(path, buf);
}

type Shape = "sine" | "saw" | "square" | "triangle";

/** phase is in [0, 1). Returns a sample in [-1, 1]. */
function oscillator(phase: number, shape: Shape = "sine"): number {
  // TODO step 2: saw, square, triangle, then PolyBLEP to remove aliasing
  return Math.sin(2 * Math.PI * phase);
}

function envelope(t: number, gateTime: number, a = 0.01, d = 0.1, s = 0.7, r = 0.3): number {
  // TODO step 3: ADSR. Level in [0, 1] at time t for a key held gateTime seconds
  return 1;
}

function lowpass(samples: Float32Array, cutoff: number): void {
  // TODO step 4: one-pole first, y += alpha * (x - y), then a state variable filter
}

function render(freq: number, seconds: number): Float32Array {
  const out = new Float32Array(Math.floor(seconds * RATE));
  let phase = 0;
  for (let n = 0; n < out.length; n++) {
    out[n] = 0.4 * oscillator(phase) * envelope(n / RATE, seconds * 0.7);
    phase = (phase + freq / RATE) % 1;
  }
  lowpass(out, 2000);
  return out;
}

writeWav("out.wav", render(220, 1));
console.log("wrote out.wav");
`;export{e as default};