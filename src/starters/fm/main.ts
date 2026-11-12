// FM receiver starter. Run: node main.ts   (Node 23.6+ runs TypeScript directly)
const RATE = 240_000;     // sample rate of the I/Q stream
const DEVIATION = 75_000; // Hz, broadcast FM
const TONE = 1000;        // Hz, the message

/** Complex samples as two parallel arrays: in-phase and quadrature. */
interface IQ { i: Float32Array; q: Float32Array }

/** An FM transmitter: integrate the message into a phase. */
function modulate(message: Float32Array): IQ {
  const i = new Float32Array(message.length), q = new Float32Array(message.length);
  let phase = 0;
  message.forEach((m, n) => {
    phase += (2 * Math.PI * DEVIATION * m) / RATE;
    i[n] = Math.cos(phase);
    q[n] = Math.sin(phase);
  });
  return { i, q };
}

function demodulate(iq: IQ): Float32Array {
  // TODO step 3: for each sample, the angle of iq[n] * conj(iq[n-1]),
  //              scaled by RATE / (2*pi*DEVIATION) to get back to [-1, 1]
  return new Float32Array(iq.i.length);
}

function lowpassTaps(cutoff: number, nTaps = 101): Float32Array {
  // TODO step 4: windowed sinc. Then filter and decimate 240 kHz -> 48 kHz
  return Float32Array.of(1);
}

function measureFrequency(x: Float32Array, rate: number): number {
  let crossings = 0;
  for (let n = 1; n < x.length; n++) if (x[n - 1] < 0 && x[n] >= 0) crossings++;
  return (crossings * rate) / x.length;
}

const message = Float32Array.from({ length: RATE / 10 }, (_, n) => Math.sin((2 * Math.PI * TONE * n) / RATE));
const iq = modulate(message);
const audio = demodulate(iq);
const peak = audio.reduce((m, a) => Math.max(m, Math.abs(a)), 0);
console.log(`${iq.i.length} I/Q samples, |iq| = ${Math.hypot(iq.i[100], iq.q[100]).toFixed(3)} (constant envelope)`);
console.log(`recovered tone: ${measureFrequency(audio, RATE).toFixed(0)} Hz (want ${TONE}), peak ${peak.toFixed(2)} (want 1.00)`);
// TODO step 5: de-emphasis, then write audio to a WAV file
