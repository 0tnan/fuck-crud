import { THREE, V, circle, path, dots, wire, set, INK, DIM, RED, SKY } from '../kit.js'
export const view = { az: 0.3, el: 0.8, dist: 9.5 }

export default function (g) {
  const r1 = 1.4, r2 = 3.2, a = (r1 + r2) / 2, e = (r2 - r1) / (r2 + r1)
  const flat = (o) => { o.rotation.x = Math.PI / 2; return o }
  g.add(flat(circle(r1, INK, 0.6)), flat(circle(r2, INK, 0.6, 160)), wire(new THREE.IcosahedronGeometry(0.3, 1), SKY, 0.9))
  const at = (nu) => { const r = a * (1 - e * e) / (1 + e * Math.cos(nu)); return V(r * Math.cos(nu), 0, -r * Math.sin(nu)) }
  g.add(path(Array.from({ length: 80 }, (_, i) => at(Math.PI * i / 79)), RED, 0.9))
  g.add(path([V(r1, 0, 0), V(r1, 0, -0.7)], RED, 1), path([V(-r2, 0, 0), V(-r2, 0, 0.45)], RED, 1))
  const planets = dots(2, 0.2, INK), craft = dots(1, 0.17, RED)
  g.add(planets, craft)
  const w1 = 1.1, w2 = w1 * Math.pow(r1 / r2, 1.5)
  const T1 = 2.5, Tt = 5, T2 = 3.5
  return (t, dt, p) => {
    set(planets.a, 0, r1 * Math.cos(t * w1), 0, -r1 * Math.sin(t * w1))
    set(planets.a, 1, r2 * Math.cos(2 + t * w2), 0, -r2 * Math.sin(2 + t * w2))
    const u = t % (T1 + Tt + T2)
    let c
    if (u < T1) { const th = (u - T1) * w1; c = V(r1 * Math.cos(th), 0, -r1 * Math.sin(th)) }
    else if (u < T1 + Tt) {
      // Kepler's equation M = E - e sin E, solved by Newton's method
      const M = Math.PI * (u - T1) / Tt
      let E = M
      for (let i = 0; i < 6; i++) E -= (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E))
      c = at(2 * Math.atan2(Math.sqrt(1 + e) * Math.sin(E / 2), Math.sqrt(1 - e) * Math.cos(E / 2)))
    } else { const th = Math.PI + (u - T1 - Tt) * w2 * 2; c = V(r2 * Math.cos(th), 0, -r2 * Math.sin(th)) }
    c.toArray(craft.a)
    planets.upd(); craft.upd()
  }
}
