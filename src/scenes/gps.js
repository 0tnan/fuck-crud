import { THREE, V, wire, circle, segs, dots, path, set, INK, DIM, RED, SKY } from '../kit.js'
export const view = { az: 0.5, el: 0.3, dist: 10.5 }

export default function (g) {
  const K = 7, R = 3.2
  g.add(wire(new THREE.SphereGeometry(1.3, 14, 9), DIM, 0.4))
  const rx = V(0.55, 0.95, 0.7).setLength(1.3)
  const recv = dots(1, 0.2, RED), est = dots(1, 0.16, INK), sats = dots(K, 0.17, SKY)
  rx.toArray(recv.a)
  const rays = segs(K, INK, 0.55), err = path([rx, rx], RED, 0.9)
  const orbits = []
  for (let i = 0; i < K; i++) {
    const o = circle(R, DIM, 0.28)
    o.rotation.set(Math.PI / 2 + 0.9 * Math.sin(i * 2.4), i * 0.9, 0)
    o.updateMatrix()
    orbits.push(o); g.add(o)
  }
  g.add(recv, est, sats, rays, err)
  const s = V(), e = V()
  return (t, dt, p) => {
    const k = 3 + Math.round(p * (K - 3))
    for (let i = 0; i < K; i++) {
      const a = t * 0.18 + i * 1.7
      s.set(Math.cos(a) * R, Math.sin(a) * R, 0).applyMatrix4(orbits[i].matrix)
      const show = i < k && s.dot(rx) > -1.5
      set(sats.a, i, s.x, s.y, s.z)
      set(rays.a, i * 2, s.x, s.y, s.z)
      if (show) set(rays.a, i * 2 + 1, rx.x, rx.y, rx.z); else set(rays.a, i * 2 + 1, s.x, s.y, s.z)
    }
    // Gauss-Newton: each iteration roughly halves what is left of the error.
    const it = Math.floor((t % 5) / 0.45)
    e.set(-1.6, 1.9, -1.2).lerp(rx, 1 - Math.pow(0.42, it) * (1.3 - p * 0.3) / 1.3)
    e.toArray(est.a); e.toArray(err.a, 3)
    sats.upd(); rays.upd(); est.upd(); err.upd()
  }
}
