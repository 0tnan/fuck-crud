import { THREE, V, dots, circle, wire, path, set, INK, DIM, RED } from '../kit.js'
export const view = { az: 0.2, el: 0.95, dist: 10 }

export default function (g) {
  const N = 600, S = 3.1
  const P = dots(N, 0.05, INK, 0.9), robot = dots(1, 0.2, RED)
  const bx = [[-2.3, -2.1], [2.4, -1.2], [0.2, 2.5]]
  const rings = bx.map(([x, z]) => {
    const b = wire(new THREE.OctahedronGeometry(0.16), INK, 1)
    b.position.set(x, 0, z)
    const c = circle(1, DIM, 0.6, 128)
    c.rotation.x = Math.PI / 2
    c.position.set(x, 0, z)
    g.add(b, c)
    return c
  })
  g.add(P, robot, path([V(-S, 0, -S), V(S, 0, -S), V(S, 0, S), V(-S, 0, S)], INK, 0.5, true))
  const x = new Float32Array(N), z = new Float32Array(N), w = new Float32Array(N), nx = new Float32Array(N), nz = new Float32Array(N)
  const scatter = () => { for (let i = 0; i < N; i++) { x[i] = (Math.random() * 2 - 1) * S; z[i] = (Math.random() * 2 - 1) * S } }
  scatter()
  const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) * 0.8
  let px = 0, pz = 0, acc = 0, lost = 0
  return (t, dt, p) => {
    const k = 1 + Math.round(p * 2)
    const rx = 2.1 * Math.cos(t * 0.4), rz = 1.6 * Math.sin(t * 0.8)
    const mx = rx - px, mz = rz - pz
    px = rx; pz = rz
    lost += dt
    if (lost > 10) { lost = 0; scatter() }
    // predict: apply the odometry plus noise
    if (dt > 0) for (let i = 0; i < N; i++) { x[i] += mx + gauss() * 0.02; z[i] += mz + gauss() * 0.02 }
    acc += dt
    if (acc > 0.3) {
      acc = 0
      // update: weight by how well each particle explains the measured ranges
      let sum = 0
      for (let i = 0; i < N; i++) {
        let e = 0
        for (let b = 0; b < k; b++) {
          const d = Math.hypot(x[i] - bx[b][0], z[i] - bx[b][1]) - Math.hypot(rx - bx[b][0], rz - bx[b][1])
          e += d * d
        }
        sum += w[i] = Math.exp(-e / 0.18) + 1e-12
      }
      // systematic resampling
      let c = w[0], j = 0
      const u0 = Math.random() * sum / N
      for (let i = 0; i < N; i++) {
        const u = u0 + i * sum / N
        while (u > c && j < N - 1) c += w[++j]
        nx[i] = x[j] + gauss() * 0.05; nz[i] = z[j] + gauss() * 0.05
      }
      x.set(nx); z.set(nz)
    }
    for (let i = 0; i < N; i++) set(P.a, i, x[i], 0, z[i])
    set(robot.a, 0, rx, 0.02, rz)
    rings.forEach((c, b) => { c.visible = b < k; c.scale.setScalar(Math.hypot(rx - bx[b][0], rz - bx[b][1])) })
    P.upd(); robot.upd()
  }
}
