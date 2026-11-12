import { THREE, V, wire, path, floor, INK, DIM, RED, SKY } from '../kit.js'
export const view = { az: 0.6, el: 0.35, dist: 6.5 }

export default function (g) {
  const board = (c, o) => {
    const b = wire(new THREE.BoxGeometry(2.6, 0.12, 1.6), c, o)
    b.add(wire(new THREE.BoxGeometry(0.5, 0.16, 0.5), c, o))
    return b
  }
  const real = board(INK, 1), ghost = board(DIM, 0.8)
  real.add(path([V(), V(1.9, 0, 0)], SKY, 0.9), path([V(), V(0, 1.2, 0)], SKY, 0.9), path([V(), V(0, 0, 1.4)], SKY, 0.9))
  const grav = path([V(), V(0, -1.9, 0)], RED, 0.95)
  const accel = path([V(), V(0, -1.9, 0)], RED, 0.4)
  g.add(real, ghost, grav, accel, floor(8, 8, -2.2, 0.22))
  return (t, dt, p) => {
    const rx = Math.sin(t * 0.7) * 0.55, ry = t * 0.25, rz = Math.sin(t * 0.9 + 1) * 0.4
    real.rotation.set(rx, ry, rz)
    // The ghost is gyro-only integration: it drifts until the filter corrects it.
    const drift = (1.12 - p) * ((t % 9) * 0.11)
    ghost.rotation.set(rx + drift, ry + drift * 0.6, rz - drift * 0.8)
    accel.rotation.set(Math.sin(t * 31) * 0.12, 0, Math.sin(t * 47 + 2) * 0.12)
  }
}
