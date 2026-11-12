import { THREE, V, path, circle, line, wire, floor, INK, DIM, RED } from '../kit.js'
export const view = { az: 0.6, el: 0.4, dist: 8.5 }

export default function (g) {
  const q = new THREE.Group()
  q.add(path([V(-0.6, 0, -0.6), V(0.6, 0, 0.6)]), path([V(-0.6, 0, 0.6), V(0.6, 0, -0.6)]))
  q.add(wire(new THREE.BoxGeometry(0.3, 0.12, 0.3)))
  const blades = []
  for (const [x, z] of [[-0.6, -0.6], [0.6, 0.6], [-0.6, 0.6], [0.6, -0.6]]) {
    const r = circle(0.36, DIM, 0.9, 32)
    r.rotation.x = Math.PI / 2
    r.position.set(x, 0.06, z)
    const b = path([V(-0.36, 0, 0), V(0.36, 0, 0)], INK, 0.8)
    r.add(b); blades.push(b); q.add(r)
  }
  const way = [V(-2.4, 0.4, -1.6), V(2.2, 1.6, -1.2), V(1.8, -0.4, 1.8), V(-2, 1.2, 1.6)]
  const tgt = wire(new THREE.OctahedronGeometry(0.2), RED)
  const T = 260, trail = line(T, RED, 0.45)
  const lead = path([V(), V()], RED, 0.3)
  g.add(q, tgt, trail, lead, floor(8, 8, -1.6, 0.25))
  const pos = V(0, 0, 0), vel = V(), acc = V()
  for (let i = 0; i < T; i++) pos.toArray(trail.a, i * 3)
  return (t, dt, p) => {
    const w = way[Math.floor(t / 2.8) % 4]
    tgt.position.copy(w); tgt.rotation.y = t
    // PD position loop. Low damping overshoots and rings; tuned, it settles.
    const kp = 9, kd = 0.5 + p * 5
    acc.copy(w).sub(pos).multiplyScalar(kp).addScaledVector(vel, -kd).clampLength(0, 14)
    vel.addScaledVector(acc, dt); pos.addScaledVector(vel, dt)
    q.position.copy(pos)
    q.rotation.set(acc.z * 0.045, 0, -acc.x * 0.045)
    blades.forEach((b, i) => { b.rotation.z = t * (i % 2 ? 23 : -23) })
    if (dt > 0) { trail.a.copyWithin(0, 3); pos.toArray(trail.a, (T - 1) * 3); trail.upd() }
    pos.toArray(lead.a, 0); w.toArray(lead.a, 3); lead.upd()
  }
}
