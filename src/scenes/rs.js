import { V, dots, path, set, rgb, INK, DIM, RED, SKY } from '../kit.js'
export const view = { az: 0.3, el: 0.25, dist: 9.5 }

export default function (g) {
  const C = 20, R = 10, s = 0.34, PAR = 4
  const D = dots(C * R, 0.19, INK, 1, true)
  const bad = new Float32Array(C * R), flash = new Float32Array(C * R)
  const X = (i) => ((i % C) - (C - 1) / 2) * s, Y = (i) => ((R - 1) / 2 - Math.floor(i / C)) * s
  const scan = path([V(0, -R * s / 2 - 0.2, 0.05), V(0, R * s / 2 + 0.2, 0.05)], INK, 0.9)
  const split = (C / 2 - PAR) * s
  g.add(D, scan, path([V(split, -R * s / 2 - 0.2, 0), V(split, R * s / 2 + 0.2, 0)], SKY, 0.5))
  const ink = rgb(INK), sky = rgb(SKY), red = rgb(RED), dim = rgb(DIM)
  let last = -1
  return (t, dt, p) => {
    const cycle = Math.floor(t / 3.2), u = (t % 3.2) / 3.2
    if (cycle !== last) {
      last = cycle
      // a burst error: consecutive symbols wiped out, as a scratch or a fade would
      for (let n = 0; n < 2 + Math.round(p * 3); n++) {
        const at = Math.floor(Math.random() * C * R), len = 2 + Math.round(p * 5)
        for (let i = at; i < Math.min(at + len, C * R); i++) bad[i] = 1
      }
    }
    const sx = (Math.min(u * 1.25, 1) - 0.5) * C * s
    scan.position.x = sx
    for (let i = 0; i < C * R; i++) {
      if (bad[i] && X(i) < sx) { bad[i] = 0; flash[i] = 1 }
      flash[i] *= 0.94
      const base = i % C >= C - PAR ? sky : ink
      const c = bad[i] ? red : base, k = bad[i] ? 1 : 0.55 + 0.45 * flash[i]
      set(D.a, i, X(i), Y(i), bad[i] ? Math.sin(t * 20 + i) * 0.06 : 0)
      set(D.c, i, c[0] * k, c[1] * k, c[2] * k)
    }
    D.upd(); D.updc()
  }
}
