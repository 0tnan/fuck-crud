import { THREE, V, segs, wire, path, floor, INK, DIM, RED } from '../kit.js'
export const view = { az: 0.2, el: 0.24, dist: 12.5, sway: 0.2 }

export default function (g) {
  const spheres = [[V(-1.2, -0.2, 0), 0.8], [V(0.8, 0.1, -0.7), 1.1], [V(2, -0.6, 1), 0.4]]
  for (const [c, r] of spheres) {
    const m = wire(new THREE.SphereGeometry(r, 12, 8), DIM, 0.5)
    m.position.copy(c)
    g.add(m)
  }
  g.add(floor(9, 9, -1, 0.25))
  const eye = V(-4.4, 1.3, 3.4)
  const corners = [V(-2.9, 1.6, 2.2), V(-2.3, 1.6, 3.1), V(-2.3, 0.5, 3.1), V(-2.9, 0.5, 2.2)]
  g.add(path(corners, INK, 0.9, true))
  for (const c of corners) g.add(path([eye, c], INK, 0.35))

  // Trace real rays: nearest sphere or the floor, mirror bounce, up to 4 hits.
  const pts = []
  const COLS = 9, ROWS = 6
  for (let j = 0; j < ROWS; j++) for (let i = 0; i < COLS; i++) {
    let o = eye.clone()
    const tgt = corners[0].clone().lerp(corners[1], i / (COLS - 1)).lerp(
      corners[3].clone().lerp(corners[2], i / (COLS - 1)), j / (ROWS - 1))
    let d = tgt.sub(eye).normalize()
    for (let b = 0; b < 4; b++) {
      let best = Infinity, n = null
      for (const [c, r] of spheres) {
        const oc = o.clone().sub(c), h = oc.dot(d), q = h * h - oc.lengthSq() + r * r
        if (q < 0) continue
        const t = -h - Math.sqrt(q)
        if (t > 1e-3 && t < best) { best = t; n = o.clone().addScaledVector(d, t).sub(c).normalize() }
      }
      if (d.y < 0) { const t = (-1 - o.y) / d.y; if (t > 1e-3 && t < best) { best = t; n = V(0, 1, 0) } }
      if (!n) { pts.push(o, o.clone().addScaledVector(d, 2.5)); break }
      const hit = o.clone().addScaledVector(d, best)
      pts.push(o, hit)
      d = d.clone().reflect(n)
      o = hit
    }
  }
  const rays = segs(pts.length / 2, RED, 0.75)
  pts.forEach((p, i) => p.toArray(rays.a, i * 3))
  g.add(rays)
  g.position.x = 1.2

  return (t, dt, p) => {
    const total = pts.length / 2
    const sweep = Math.min(1, (t * 0.16) % 1.25)
    rays.count(2 * Math.floor(total * sweep * (0.2 + 0.8 * p)))
  }
}
