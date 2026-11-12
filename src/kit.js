// Drawing kit shared by every scene: pale line-work on a blueprint sheet.
import * as THREE from 'three'
export { THREE }

export const INK = 0xdcebfa
export const DIM = 0x5b89bd
export const RED = 0xff6a4d
export const SKY = 0x8fd3ff

export const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z)
export const set = (a, i, x, y, z) => { a[i * 3] = x; a[i * 3 + 1] = y; a[i * 3 + 2] = z }

const lm = (c, o) => new THREE.LineBasicMaterial({ color: c, transparent: true, opacity: o })

function make(Ctor, n, mat) {
  const geo = new THREE.BufferGeometry()
  const a = new Float32Array(n * 3)
  geo.setAttribute('position', new THREE.BufferAttribute(a, 3))
  const o = new Ctor(geo, mat)
  o.a = a
  o.frustumCulled = false
  o.upd = () => { geo.attributes.position.needsUpdate = true }
  o.count = (k) => geo.setDrawRange(0, k)
  return o
}

/** Polyline with n vertices. */
export const line = (n, c = INK, o = 1, loop = false) => make(loop ? THREE.LineLoop : THREE.Line, n, lm(c, o))
/** n independent segments (2n vertices). */
export const segs = (n, c = INK, o = 1) => make(THREE.LineSegments, n * 2, lm(c, o))

export function path(pts, c = INK, o = 1, loop = false) {
  const l = line(pts.length, c, o, loop)
  pts.forEach((p, i) => p.toArray(l.a, i * 3))
  return l
}

/** Circle in the XY plane. */
export function circle(r, c = INK, o = 1, n = 96) {
  const pts = []
  for (let i = 0; i < n; i++) pts.push(V(Math.cos(i / n * 6.2832) * r, Math.sin(i / n * 6.2832) * r, 0))
  return path(pts, c, o, true)
}

export const wire = (geo, c = INK, o = 1) => new THREE.LineSegments(new THREE.EdgesGeometry(geo), lm(c, o))

let disc
function discTex() {
  if (disc) return disc
  const cv = document.createElement('canvas')
  cv.width = cv.height = 64
  const x = cv.getContext('2d')
  x.fillStyle = '#fff'
  x.beginPath(); x.arc(32, 32, 30, 0, 7); x.fill()
  disc = new THREE.CanvasTexture(cv)
  disc.keep = true
  return disc
}

/** Point cloud. With colors=true each point has its own colour in o.c. */
export function dots(n, size = 0.06, c = INK, o = 1, colors = false) {
  const p = make(THREE.Points, n, new THREE.PointsMaterial({
    size, color: colors ? 0xffffff : c, map: discTex(), alphaTest: 0.4,
    transparent: true, opacity: o, vertexColors: colors,
  }))
  if (colors) {
    p.c = new Float32Array(n * 3)
    p.geometry.setAttribute('color', new THREE.BufferAttribute(p.c, 3))
    p.updc = () => { p.geometry.attributes.color.needsUpdate = true }
  }
  return p
}

export function floor(size = 8, div = 8, y = 0, o = 0.3) {
  const gr = new THREE.GridHelper(size, div, DIM, DIM)
  gr.material.transparent = true
  gr.material.opacity = o
  gr.position.y = y
  return gr
}

export const rgb = (hex) => { const c = new THREE.Color(hex); return [c.r, c.g, c.b] }
