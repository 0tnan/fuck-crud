import { V, line, path, set, INK, DIM, RED } from '../kit.js'
export const view = { az: 0.5, el: 0.28, dist: 10 }

export default function (g) {
  const M = 900
  const helix = line(M, INK, 0.95), i_ = line(M, DIM, 0.8), msg = line(M, RED, 0.95)
  g.add(helix, i_, msg, path([V(-4, 0.5, 0), V(4, 0.5, 0)], DIM, 0.5))
  g.add(path([V(-4, 1.5, -1.9), V(-4, -0.5, -1.9), V(4, -0.5, -1.9), V(4, 1.5, -1.9)], DIM, 0.3, true))
  return (t, dt, p) => {
    const beta = 1.5 + p * 5.5
    for (let i = 0; i < M; i++) {
      const x = -4 + 8 * i / (M - 1), s = x + t * 0.35
      // phase = carrier + integral of the message; frequency is its derivative
      const ph = 9 * s + beta * Math.sin(1.7 * s) + 0.4 * beta * Math.sin(4.1 * s)
      const m = Math.cos(1.7 * s) + Math.cos(4.1 * s) * 0.96
      set(helix.a, i, x, 0.5 + Math.cos(ph) * 0.85, Math.sin(ph) * 0.85)
      set(i_.a, i, x, 0.5 + Math.cos(ph) * 0.85, -1.9)
      set(msg.a, i, x, -1.7 + m * 0.3, 0)
    }
    helix.upd(); i_.upd(); msg.upd()
  }
}
