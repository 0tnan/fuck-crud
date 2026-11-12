import { segs, dots, set, INK, DIM } from '../kit.js'
export const view = { az: 0.3, el: 0.72, dist: 10 }

export default function (g) {
  const N = 2800, S = 3.5
  const P = dots(N, 0.055, INK, 0.9)
  const Q = segs(3000, DIM, 0.7)
  g.add(P, Q)
  const r = new Float32Array(N), a = new Float32Array(N)
  for (let i = 0; i < N; i++) {
    r[i] = 0.15 + 3.1 * Math.sqrt(Math.random())
    a[i] = (i % 2) * Math.PI + r[i] * 1.5 + (Math.random() - 0.5) * 1.1
    P.a[i * 3 + 1] = (Math.random() - 0.5) * 0.25 * Math.exp(-r[i] * 0.5)
  }
  let n = 0, maxD = 6
  const sq = (cx, cz, h) => {
    if (n + 4 > 3000) return
    const c = [[-h, -h], [h, -h], [h, h], [-h, h]]
    for (let i = 0; i < 4; i++) {
      set(Q.a, n * 2, cx + c[i][0], 0, cz + c[i][1])
      set(Q.a, n * 2 + 1, cx + c[(i + 1) % 4][0], 0, cz + c[(i + 1) % 4][1])
      n++
    }
  }
  // Barnes-Hut style quadtree over a sample of the bodies.
  const build = (idx, cx, cz, h, d) => {
    sq(cx, cz, h)
    if (idx.length <= 1 || d >= maxD) return
    for (const [sx, sz] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
      const sub = idx.filter((i) => (P.a[i * 3] > cx) === (sx > 0) && (P.a[i * 3 + 2] > cz) === (sz > 0))
      if (sub.length) build(sub, cx + sx * h / 2, cz + sz * h / 2, h / 2, d + 1)
    }
  }
  const sample = Array.from({ length: 150 }, (_, i) => i * 18)
  let acc = 1
  return (t, dt, p) => {
    for (let i = 0; i < N; i++) {
      a[i] += dt * 0.55 / (Math.pow(r[i], 1.3) + 0.35)
      P.a[i * 3] = Math.cos(a[i]) * r[i]
      P.a[i * 3 + 2] = Math.sin(a[i]) * r[i]
    }
    P.upd()
    acc += dt
    if (acc > 0.25) {
      acc = 0; n = 0; maxD = 1 + Math.round(p * 6)
      build(sample, 0, 0, S, 0)
      Q.count(n * 2); Q.upd()
    }
  }
}
