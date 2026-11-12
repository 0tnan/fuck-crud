import { MarchingCubes } from 'three/examples/jsm/objects/MarchingCubes.js'
import { THREE, wire, INK, DIM } from '../kit.js'
export const view = { az: 0.6, el: 0.3, dist: 9 }

export default function (g) {
  const mat = new THREE.MeshBasicMaterial({ color: INK, wireframe: true, transparent: true, opacity: 0.5 })
  const mc = new MarchingCubes(30, mat, false, false, 30000)
  mc.scale.setScalar(2.1)
  mc.isolation = 60
  g.add(mc, wire(new THREE.BoxGeometry(4.2, 4.2, 4.2), DIM, 0.5))
  return (t, dt, p) => {
    const n = 2 + Math.round(p * 4)
    mc.reset()
    for (let i = 0; i < n; i++) {
      mc.addBall(
        0.5 + 0.27 * Math.sin(t * 0.5 + i * 2.1),
        0.5 + 0.25 * Math.cos(t * 0.41 + i * 1.3),
        0.5 + 0.27 * Math.sin(t * 0.33 + i * 4.2), 0.55, 12)
    }
    mc.update()
  }
}
