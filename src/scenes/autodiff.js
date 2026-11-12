import { V, circle, segs, dots, set, INK, DIM, RED } from '../kit.js'
export const view = { az: 0.35, el: 0.15, dist: 8.6 }

export default function (g) {
  const sizes = [3, 5, 5, 2]
  const nodes = sizes.map((n, l) => Array.from({ length: n }, (_, i) =>
    V(-3 + l * 2, (i - (n - 1) / 2) * 0.95, Math.sin(i * 2.3 + l) * 0.7)))
  const edges = []
  for (let l = 0; l < 3; l++) for (const a of nodes[l]) for (const b of nodes[l + 1]) edges.push([a, b, l])
  const E = segs(edges.length, DIM, 0.45)
  edges.forEach(([a, b], i) => { a.toArray(E.a, i * 6); b.toArray(E.a, i * 6 + 3) })
  g.add(E)
  for (const n of nodes.flat()) { const c = circle(0.17, INK, 1, 28); c.position.copy(n); g.add(c) }
  const fwd = dots(edges.length, 0.1, INK), back = dots(edges.length, 0.11, RED)
  g.add(fwd, back)
  const tmp = V()
  return (t, dt, p) => {
    const withBack = p > 0.45
    const u = (t * 0.28) % 1 * (withBack ? 2 : 1)   // 0..1 forward, 1..2 backward
    edges.forEach(([a, b, l], i) => {
      const f = u * 3 - l, r = (u - 1) * 3 - (2 - l)
      if (u < 1 && f >= 0 && f < 1) tmp.copy(a).lerp(b, f).toArray(fwd.a, i * 3); else set(fwd.a, i, 0, 99, 0)
      if (u >= 1 && r >= 0 && r < 1) tmp.copy(b).lerp(a, r).toArray(back.a, i * 3); else set(back.a, i, 0, 99, 0)
    })
    fwd.upd(); back.upd()
  }
}
