import { segs, dots, set, INK, RED } from '../kit.js'
export const view = { az: 0.55, el: 0.12, dist: 9.5 }

export default function (g) {
  const W = 28, H = 18, s = 0.21, N = W * H
  const pos = new Float32Array(N * 3), prev = new Float32Array(N * 3)
  const pinned = new Uint8Array(N)
  for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
    const k = j * W + i
    set(pos, k, (i - (W - 1) / 2) * s, 2 - j * s, 0)
    if (j === 0 && i % 9 === 0) pinned[k] = 1
  }
  prev.set(pos)
  const links = []
  for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
    const k = j * W + i
    if (i < W - 1) links.push(k, k + 1)
    if (j < H - 1) links.push(k, k + W)
  }
  const L = segs(links.length / 2, INK, 0.75)
  const pins = dots(4, 0.16, RED)
  let np = 0
  for (let k = 0; k < N; k++) if (pinned[k]) set(pins.a, np++, pos[k * 3], pos[k * 3 + 1], pos[k * 3 + 2])
  g.add(L, pins)
  let acc = 0, time = 0
  const step = (wind) => {
    const h = 1 / 60
    time += h
    for (let k = 0; k < N; k++) {
      if (pinned[k]) continue
      const i = k * 3
      const gust = (Math.sin(time * 1.3 + pos[i] * 1.2) * 0.5 + 0.6) * wind
      for (let c = 0; c < 3; c++) {
        const f = c === 1 ? -7 : c === 2 ? gust : 0
        const x = pos[i + c]
        pos[i + c] = x + (x - prev[i + c]) * 0.985 + f * h * h
        prev[i + c] = x
      }
    }
    for (let it = 0; it < 5; it++) for (let l = 0; l < links.length; l += 2) {
      const a = links[l] * 3, b = links[l + 1] * 3
      const dx = pos[b] - pos[a], dy = pos[b + 1] - pos[a + 1], dz = pos[b + 2] - pos[a + 2]
      const d = Math.hypot(dx, dy, dz) || 1e-6, e = (d - s) / d * 0.5
      const wa = pinned[links[l]] ? 0 : 1, wb = pinned[links[l + 1]] ? 0 : 1
      if (wa + wb === 0) continue
      const ka = wa * 2 / (wa + wb) * e, kb = wb * 2 / (wa + wb) * e
      pos[a] += dx * ka; pos[a + 1] += dy * ka; pos[a + 2] += dz * ka
      pos[b] -= dx * kb; pos[b + 1] -= dy * kb; pos[b + 2] -= dz * kb
    }
  }
  return (t, dt, p) => {
    acc = Math.min(acc + dt, 0.05)
    while (acc >= 1 / 60) { step(1 + p * 9); acc -= 1 / 60 }
    for (let l = 0; l < links.length; l++) {
      const k = links[l] * 3
      set(L.a, l, pos[k], pos[k + 1], pos[k + 2])
    }
    L.upd()
  }
}
