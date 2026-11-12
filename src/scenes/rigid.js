import { V, circle, path, INK, DIM, RED } from '../kit.js'
export const view = { az: 0, el: 0, dist: 9, sway: 0.3 }

export default function (g) {
  const W = 3.2, H = 2.2, N = 18
  g.add(path([V(-W, -H, 0), V(W, -H, 0), V(W, H, 0), V(-W, H, 0)], INK, 0.8, true))
  const arrow = path([V(), V(0, -1, 0)], RED, 0.9)
  g.add(arrow)
  const B = []
  for (let i = 0; i < N; i++) {
    const r = 0.22 + Math.random() * 0.3
    const m = circle(1, i % 5 ? INK : DIM, 0.95, 40)
    m.add(path([V(), V(1, 0, 0)], INK, 0.6))
    m.scale.setScalar(r)
    g.add(m)
    B.push({ m, r, x: (Math.random() * 2 - 1) * (W - 1), y: (Math.random() * 2 - 1) * (H - 1), vx: 0, vy: 0, a: 0 })
  }
  return (t, dt, p) => {
    const n = 5 + Math.round(p * (N - 5))
    const ga = t * 0.32, gx = Math.sin(ga) * 6, gy = -Math.cos(ga) * 6
    arrow.rotation.z = ga
    const h = dt / 3
    for (let s = 0; s < 3 && dt > 0; s++) {
      for (let i = 0; i < n; i++) {
        const b = B[i]
        b.vx += gx * h; b.vy += gy * h
        b.x += b.vx * h; b.y += b.vy * h
        b.a -= b.vx * h / b.r
        if (b.x < -W + b.r) { b.x = -W + b.r; b.vx *= -0.5 }
        if (b.x > W - b.r) { b.x = W - b.r; b.vx *= -0.5 }
        if (b.y < -H + b.r) { b.y = -H + b.r; b.vy *= -0.5 }
        if (b.y > H - b.r) { b.y = H - b.r; b.vy *= -0.5 }
      }
      for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
        const a = B[i], b = B[j]
        let nx = b.x - a.x, ny = b.y - a.y
        const d = Math.hypot(nx, ny), pen = a.r + b.r - d
        if (pen <= 0 || d === 0) continue
        nx /= d; ny /= d
        const ma = a.r * a.r, mb = b.r * b.r, inv = 1 / (ma + mb)
        a.x -= nx * pen * mb * inv; a.y -= ny * pen * mb * inv
        b.x += nx * pen * ma * inv; b.y += ny * pen * ma * inv
        const rel = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny
        if (rel > 0) continue
        const jimp = -1.4 * rel * ma * mb * inv
        a.vx -= jimp / ma * nx; a.vy -= jimp / ma * ny
        b.vx += jimp / mb * nx; b.vy += jimp / mb * ny
      }
    }
    B.forEach((b, i) => { b.m.visible = i < n; b.m.position.set(b.x, b.y, 0); b.m.rotation.z = b.a })
  }
}
