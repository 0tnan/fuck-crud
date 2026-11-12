var e=`// FFT starter. Run: node main.ts   (Node 23.6+ runs TypeScript directly)
const RATE = 8000;
const N = 1024;

/** Complex numbers stored as two parallel arrays. */
interface Spectrum { re: Float64Array; im: Float64Array }

/** Slow reference transform, O(N^2). Keep it to test the fast one. */
function dft(x: Float64Array): Spectrum {
  const n = x.length, re = new Float64Array(n), im = new Float64Array(n);
  for (let k = 0; k < n; k++) {
    for (let t = 0; t < n; t++) {
      const a = (-2 * Math.PI * k * t) / n;
      re[k] += x[t] * Math.cos(a);
      im[k] += x[t] * Math.sin(a);
    }
  }
  return { re, im };
}

function fft(x: Float64Array): Spectrum {
  // TODO step 2: recursive radix-2 FFT (split even/odd, combine with twiddles)
  // TODO step 3: iterative in-place version with bit reversal
  return dft(x);
}

function hann(i: number, n: number): number {
  // TODO step 4: return 0.5 - 0.5*cos(2*pi*i/(n-1))
  return 1;
}

const signal = new Float64Array(N);
for (let t = 0; t < N; t++) {
  signal[t] = (Math.sin((2 * Math.PI * 440 * t) / RATE) + 0.5 * Math.sin((2 * Math.PI * 1250 * t) / RATE)) * hann(t, N);
}
const { re, im } = fft(signal);
const mag = (k: number): number => Math.hypot(re[k], im[k]);
for (let k = 1; k < N / 2 - 1; k++) {
  if (mag(k) > 50 && mag(k) >= mag(k - 1) && mag(k) >= mag(k + 1)) { // local peaks
    console.log(\`bin \${String(k).padStart(4)}  \${((k * RATE) / N).toFixed(1).padStart(7)} Hz  magnitude \${mag(k).toFixed(1).padStart(8)}\`);
  }
}
`;export{e as default};