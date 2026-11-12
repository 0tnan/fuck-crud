// One renderer, one canvas. Scenes are loaded on demand and swapped in place.
import gsap from 'gsap'
import { THREE } from './kit.js'

const mods = import.meta.glob('./scenes/*.js')
const BASE = { az: 0.6, el: 0.3, dist: 8.5, sway: 0.3, y: -0.3 }

export class Stage {
  constructor(canvas) {
    this.canvas = canvas
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
    this.camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100)
    this.scene = new THREE.Scene()
    this.view = { ...BASE, off: 0, zoom: 1 }
    this.p = 1
    this.t = 0
    this.tok = 0
    this.mouse = { x: 0, y: 0, tx: 0, ty: 0 }
    this.still = matchMedia('(prefers-reduced-motion: reduce)').matches
    addEventListener('pointermove', (e) => {
      this.mouse.tx = e.clientX / innerWidth - 0.5
      this.mouse.ty = e.clientY / innerHeight - 0.5
    })
    new ResizeObserver(() => this.resize()).observe(canvas)
    this.resize()
    let last = performance.now()
    const loop = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      this.frame(dt)
      requestAnimationFrame(loop)
    }
    requestAnimationFrame(loop)
  }

  resize() {
    const w = this.canvas.clientWidth, h = this.canvas.clientHeight
    if (!w || !h) return
    this.renderer.setSize(w, h, false)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
  }

  async show(slug) {
    if (slug === this.slug) return
    this.slug = slug
    const tok = ++this.tok
    const m = await mods[`./scenes/${slug}.js`]()
    if (tok !== this.tok) return
    this.clear()
    const g = new THREE.Group()
    this.disposers = []
    this.update = m.default(g, { renderer: this.renderer, onDispose: (f) => this.disposers.push(f) })
    this.group = g
    this.scene.add(g)
    const v = { ...BASE, ...m.view }
    if (this.still) Object.assign(this.view, v)
    else {
      gsap.to(this.view, { ...v, duration: 0.9, ease: 'power3.out', overwrite: 'auto' })
      gsap.fromTo(this.canvas, { opacity: 0 }, { opacity: 1, duration: 0.45, ease: 'power1.out', overwrite: true })
    }
  }

  clear() {
    if (!this.group) return
    this.scene.remove(this.group)
    this.group.traverse((o) => {
      o.geometry?.dispose()
      for (const m of [].concat(o.material || [])) m.dispose()
    })
    this.disposers.forEach((f) => f())
    this.group = this.update = null
  }

  /** p in 0..1: how much of the build is on screen. turn nudges the camera. */
  progress(p, turn = 0, zoom = 1) {
    if (this.still) { this.p = p; this.view.off = turn; this.view.zoom = zoom; return }
    gsap.to(this, { p, duration: 1.1, ease: 'power2.out', overwrite: 'auto' })
    gsap.to(this.view, { off: turn, zoom, duration: 1.4, ease: 'power3.inOut', overwrite: 'auto' })
  }

  frame(dt) {
    const { view: v, mouse: m, camera: cam } = this
    if (!this.still) this.t += dt
    m.x += (m.tx - m.x) * 0.05
    m.y += (m.ty - m.y) * 0.05
    const az = v.az + v.off + Math.sin(this.t * 0.22) * v.sway + m.x * 0.25
    const el = Math.max(-1.4, Math.min(1.4, v.el + m.y * 0.12))
    const d = v.dist * v.zoom * Math.max(1, 1.35 / cam.aspect)
    cam.position.set(Math.sin(az) * Math.cos(el) * d, Math.sin(el) * d + v.y, Math.cos(az) * Math.cos(el) * d)
    cam.lookAt(0, v.y, 0)
    if (this.update) this.update(this.t, this.still ? 0 : dt, this.p)
    this.renderer.render(this.scene, cam)
  }
}
