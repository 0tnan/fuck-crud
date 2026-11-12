import { THREE, V, line, dots, wire, circle, floor, INK, DIM, RED } from '../kit.js'
export const view = { az: 0.7, el: 0.3, dist: 7.5, y: -0.2 }

export default function (g) {
  const N = 8, L = 0.62, base = V(0, -1.7, 0)
  const J = Array.from({ length: N }, (_, i) => V(0, -1.7 + i * L, 0))
  const arm = line(N, INK, 1), joints = dots(N, 0.14, INK)
  const tgt = wire(new THREE.OctahedronGeometry(0.2), RED, 1)
  const reach = circle((N - 1) * L, DIM, 0.35)
  reach.rotation.x = Math.PI / 2
  reach.position.y = -1.7
  const trail = line(160, RED, 0.35)
  g.add(arm, joints, tgt, reach, trail, floor(8, 8, -1.7, 0.25))
  let n = 0
  return (t, dt, p) => {
    const T = V(2.3 * Math.sin(t * 0.7), 0.4 + 1.5 * Math.sin(t * 0.9 + 1), 1.9 * Math.cos(t * 0.5))
    tgt.position.copy(T)
    tgt.rotation.y = t
    // FABRIK: drag the chain to the target, then drag it back to the base.
    const iters = 1 + Math.round(p * 7)
    for (let it = 0; it < iters; it++) {
      J[N - 1].copy(T)
      for (let i = N - 2; i >= 0; i--) J[i].sub(J[i + 1]).setLength(L).add(J[i + 1])
      J[0].copy(base)
      for (let i = 1; i < N; i++) J[i].sub(J[i - 1]).setLength(L).add(J[i - 1])
    }
    J.forEach((j, i) => { j.toArray(arm.a, i * 3); j.toArray(joints.a, i * 3) })
    if (dt > 0) { trail.a.copyWithin(0, 3); J[N - 1].toArray(trail.a, 159 * 3); n = Math.min(n + 1, 160) }
    trail.geometry.setDrawRange(160 - n, n)
    arm.upd(); joints.upd(); trail.upd()
  }
}
