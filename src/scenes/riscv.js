import { V, dots, path, set, rgb, INK, DIM, RED, SKY } from '../kit.js'
export const view = { az: 0.3, el: 0.18, dist: 9.5 }

export default function (g) {
  const C = 16, R = 11, s = 0.4
  const D = dots(C * R, 0.2, INK, 1, true)
  const heat = new Float32Array(C * R)
  const xy = (i) => [((i % C) - (C - 1) / 2) * s, ((R - 1) / 2 - Math.floor(i / C)) * s]
  for (let i = 0; i < C * R; i++) {
    const [x, y] = xy(i), row = Math.floor(i / C)
    set(D.a, i, x, row === 4 || row === 7 ? 99 : y, 0)   // rows 4 and 7 are gaps
  }
  const frame = (r0, r1, c) => {
    const x = C / 2 * s + 0.08, y0 = ((R - 1) / 2 - r0) * s + 0.24, y1 = ((R - 1) / 2 - r1) * s - 0.24
    return path([V(-x, y0, 0), V(x, y0, 0), V(x, y1, 0), V(-x, y1, 0)], c, 0.55, true)
  }
  // rows 0-3 program, 5-6 the 32 registers, 8-10 memory
  g.add(D, frame(0, 3, INK), frame(5, 6, SKY), frame(8, 10, INK))
  const h = s * 0.42
  const pc = path([V(-h, -h, 0.02), V(h, -h, 0.02), V(h, h, 0.02), V(-h, h, 0.02)], RED, 1, true)
  const jump = path([V(), V(), V()], RED, 0.5)
  g.add(pc, jump)
  const dim = rgb(DIM), ink = rgb(INK)
  let at = 0, acc = 0, loopTo = 0
  return (t, dt, p) => {
    acc += dt
    if (acc > 0.11) {
      acc = 0
      const from = at
      at++
      if (at >= 64 || Math.random() < 0.12) { at = loopTo; loopTo = Math.floor(Math.random() * 40) }
      if (at !== from + 1) {
        const [x0, y0] = xy(from), [x1, y1] = xy(at)
        set(jump.a, 0, x0, y0, 0); set(jump.a, 1, (x0 + x1) / 2, (y0 + y1) / 2, 0.9); set(jump.a, 2, x1, y1, 0)
        jump.upd()
      }
      heat[at] = 1
      heat[C * 5 + Math.floor(Math.random() * 32)] = 1
      if (p > 0.55 && Math.random() < 0.5) heat[C * 8 + Math.floor(Math.random() * 48)] = 1
      const [x, y] = xy(at)
      pc.position.set(x, y, 0)
    }
    for (let i = 0; i < C * R; i++) {
      heat[i] *= 0.93
      for (let c = 0; c < 3; c++) D.c[i * 3 + c] = dim[c] * 0.55 + (ink[c] - dim[c] * 0.55) * heat[i]
    }
    D.updc()
  }
}
