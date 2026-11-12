import { line, set, INK, RED } from '../kit.js'
export const view = { az: 0.5, el: 0.42, dist: 9.5, y: -0.7 }

export default function (g) {
  const R = 24, B = 56, N = 112
  const rows = [], hs = []
  for (let r = 0; r < R; r++) {
    const l = line(B, INK, (1 - r / R) ** 1.4)
    rows.push(l); hs.push(new Float32Array(B)); g.add(l)
  }
  const wave = line(N, RED, 0.95)
  g.add(wave)
  const x = new Float32Array(N)
  let acc = 0
  return (t, dt, p) => {
    acc += dt
    if (acc < 0.05 && t > 0.1) return
    acc = 0
    const k = 1 + Math.round(p * 3)
    const f = [6 + 3 * Math.sin(t * 0.5), 18 + 7 * Math.sin(t * 0.31), 34 + 9 * Math.sin(t * 0.17 + 2), 47]
    const amp = [1, 0.7, 0.55, 0.4 + 0.4 * Math.sin(t * 3)]
    for (let n = 0; n < N; n++) {
      let s = 0
      for (let i = 0; i < k; i++) s += amp[i] * Math.sin(6.2832 * f[i] * n / N + t * (i + 1))
      x[n] = s
      set(wave.a, n, (n / (N - 1) - 0.5) * 6, -0.7 + s * 0.28, 2.6)
    }
    for (let r = R - 1; r > 0; r--) hs[r].set(hs[r - 1])
    for (let b = 0; b < B; b++) {
      let re = 0, im = 0
      for (let n = 0; n < N; n++) {
        const w = 0.5 - 0.5 * Math.cos(6.2832 * n / (N - 1)), a = 6.2832 * b * n / N
        re += x[n] * w * Math.cos(a); im -= x[n] * w * Math.sin(a)
      }
      hs[0][b] = Math.min(Math.hypot(re, im) / (N / 4), 1.2) * 1.5
    }
    for (let r = 0; r < R; r++) {
      for (let b = 0; b < B; b++) set(rows[r].a, b, (b / (B - 1) - 0.5) * 6, -0.7 + hs[r][b], 1.8 - r * 0.2)
      rows[r].upd()
    }
    wave.upd()
  }
}
