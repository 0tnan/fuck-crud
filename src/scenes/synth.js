import { V, line, path, dots, set, INK, DIM, RED } from '../kit.js'
export const view = { az: 0.55, el: 0.35, dist: 9.5 }

export default function (g) {
  const H = 8, M = 220
  const parts = []
  for (let h = 0; h < H; h++) { const l = line(M, DIM, 0.85); parts.push(l); g.add(l) }
  const sum = line(M, INK, 1)
  g.add(sum)
  // ADSR envelope drawn above the sum, with a playhead.
  const env = [V(-3, 1.5, 1.4), V(-2.4, 2.5, 1.4), V(-1.6, 2.1, 1.4), V(1, 2.1, 1.4), V(3, 1.5, 1.4)]
  const head = dots(1, 0.16, RED)
  g.add(path(env, RED, 0.8), head)
  const envAt = (u) => {
    const x = -3 + u * 6
    for (let i = 0; i < 4; i++) if (x <= env[i + 1].x) return env[i].clone().lerp(env[i + 1], (x - env[i].x) / (env[i + 1].x - env[i].x))
    return env[4]
  }
  return (t, dt, p) => {
    const n = 1 + Math.round(p * (H - 1))
    const e = envAt((t * 0.22) % 1)
    const level = e.y - 1.5
    set(head.a, 0, e.x, e.y, e.z); head.upd()
    for (let i = 0; i < M; i++) {
      const x = (i / (M - 1) - 0.5) * 6
      let s = 0
      for (let h = 0; h < H; h++) {
        const k = 2 * h + 1
        const y = h < n ? Math.sin(k * (x * 1.6 - t * 1.4)) / k : 0
        s += y
        set(parts[h].a, i, x, y * 0.7 - 1.1, -h * 0.42)
      }
      set(sum.a, i, x, s * 0.9 * level + 0.2, 1.4)
    }
    parts.forEach((l, h) => { l.visible = h < n; l.upd() })
    sum.upd()
  }
}
