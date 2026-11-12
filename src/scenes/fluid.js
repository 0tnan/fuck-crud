import { V, segs, dots, path, set, INK, DIM, RED } from '../kit.js'
export const view = { az: 0, el: 1.0, dist: 9.5, sway: 0.25 }

export default function (g) {
  const N = 1600, G = 19, S = 3
  const P = dots(N, 0.045, INK, 0.9)
  const F = segs(G * G, DIM, 0.8)
  const core = dots(4, 0.16, RED, 1)
  g.add(P, F, core, path([V(-S, 0, -S), V(S, 0, -S), V(S, 0, S), V(-S, 0, S)], INK, 0.5, true))
  const rnd = () => (Math.random() * 2 - 1) * S
  for (let i = 0; i < N; i++) set(P.a, i, rnd(), 0, rnd())
  const vort = [[0, 1.6, 2.2], [2.1, 1.9, -1.8], [4, 1.1, 1.5], [1, 2.3, -1.2]]
  const c = new Float32Array(8)
  let k = 4
  const vel = (x, z) => {
    let u = 0, w = 0
    for (let i = 0; i < k; i++) {
      const dx = x - c[i * 2], dz = z - c[i * 2 + 1], r2 = dx * dx + dz * dz + 0.3
      u += -dz * vort[i][2] / r2
      w += dx * vort[i][2] / r2
    }
    return [u, w]
  }
  return (t, dt, p) => {
    k = 1 + Math.round(p * 3)
    for (let i = 0; i < 4; i++) {
      c[i * 2] = Math.cos(t * 0.21 + vort[i][0]) * vort[i][1]
      c[i * 2 + 1] = Math.sin(t * 0.27 + vort[i][0] * 2) * vort[i][1]
      set(core.a, i, c[i * 2], i < k ? 0 : 99, c[i * 2 + 1])
    }
    for (let i = 0; i < N; i++) {
      let x = P.a[i * 3], z = P.a[i * 3 + 2]
      const [u, w] = vel(x, z)
      x += u * dt * 0.5; z += w * dt * 0.5
      if (Math.abs(x) > S || Math.abs(z) > S || Math.random() < 0.002) { x = rnd(); z = rnd() }
      P.a[i * 3] = x; P.a[i * 3 + 2] = z
    }
    for (let j = 0; j < G; j++) for (let i = 0; i < G; i++) {
      const x = (i / (G - 1) * 2 - 1) * S, z = (j / (G - 1) * 2 - 1) * S
      let [u, w] = vel(x, z)
      const m = Math.hypot(u, w), s = Math.min(m, 1.6) / (m + 1e-6) * 0.16
      const n = (j * G + i) * 2
      set(F.a, n, x, 0, z); set(F.a, n + 1, x + u * s, 0, z + w * s)
    }
    P.upd(); F.upd(); core.upd()
  }
}
