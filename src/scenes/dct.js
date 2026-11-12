import { dots, set, rgb, INK, DIM, RED } from '../kit.js'
export const view = { az: 0.65, el: 0.62, dist: 10.5 }

export default function (g) {
  const D = dots(4096, 0.05, INK, 1, true)
  g.add(D)
  const ink = rgb(INK), dim = rgb(DIM), red = rgb(RED)
  const C = (k, n) => Math.cos((2 * n + 1) * k * Math.PI / 16)
  return (t, dt, p) => {
    const keep = Math.round(p * 14)
    const scan = Math.floor(t * 2.5) % 15
    let n = 0
    for (let v = 0; v < 8; v++) for (let u = 0; u < 8; u++) {
      const on = u + v <= keep
      const amp = on ? 0.3 * (0.65 + 0.35 * Math.sin(t * 1.6 - (u + v) * 0.6)) : 0.02
      const col = !on ? dim : u + v === scan ? red : ink
      for (let j = 0; j < 8; j++) for (let i = 0; i < 8; i++) {
        set(D.a, n, (u - 3.5) * 0.84 + (i - 3.5) * 0.09, C(u, i) * C(v, j) * amp, (v - 3.5) * 0.84 + (j - 3.5) * 0.09)
        const k = on ? 1 : 0.6
        set(D.c, n, col[0] * k, col[1] * k, col[2] * k)
        n++
      }
    }
    D.upd(); D.updc()
  }
}
