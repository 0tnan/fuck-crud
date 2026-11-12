import { THREE, V, path, INK } from '../kit.js'
export const view = { az: 0, el: 0.5, dist: 9, sway: 0.3 }

const vert = 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }'
const sim = `precision highp float; varying vec2 vUv; uniform sampler2D tex; uniform vec2 px; uniform float f, k;
void main(){
  vec2 c = texture2D(tex, vUv).xy;
  vec2 lap = texture2D(tex, vUv + vec2(px.x, 0.)).xy + texture2D(tex, vUv - vec2(px.x, 0.)).xy
           + texture2D(tex, vUv + vec2(0., px.y)).xy + texture2D(tex, vUv - vec2(0., px.y)).xy - 4. * c;
  float r = c.x * c.y * c.y;
  gl_FragColor = vec4(c.x + lap.x * .2097 - r + f * (1. - c.x), c.y + lap.y * .105 + r - (f + k) * c.y, 0., 1.);
}`
const show = `precision highp float; varying vec2 vUv; uniform sampler2D tex; uniform vec3 ink;
void main(){
  float v = texture2D(tex, vUv).y;
  float edge = smoothstep(.12, .2, v) - smoothstep(.24, .34, v) * .75;
  gl_FragColor = vec4(ink, edge);
}`

export default function (g, { renderer, onDispose }) {
  const N = 256
  const opt = { type: THREE.HalfFloatType, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, wrapS: THREE.RepeatWrapping, wrapT: THREE.RepeatWrapping, depthBuffer: false }
  let a = new THREE.WebGLRenderTarget(N, N, opt), b = new THREE.WebGLRenderTarget(N, N, opt)
  const data = new Float32Array(N * N * 4)
  for (let i = 0; i < N * N; i++) data[i * 4] = 1
  for (let s = 0; s < 26; s++) {
    const cx = 20 + Math.random() * (N - 40) | 0, cy = 20 + Math.random() * (N - 40) | 0
    for (let y = -4; y <= 4; y++) for (let x = -4; x <= 4; x++) { const i = ((cy + y) * N + cx + x) * 4; data[i] = 0.5; data[i + 1] = 0.25 }
  }
  const seed = new THREE.DataTexture(data, N, N, THREE.RGBAFormat, THREE.FloatType)
  seed.needsUpdate = true
  const simMat = new THREE.ShaderMaterial({ vertexShader: vert, fragmentShader: sim, uniforms: { tex: { value: seed }, px: { value: new THREE.Vector2(1 / N, 1 / N) }, f: { value: 0.0367 }, k: { value: 0.0649 } } })
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), simMat)
  const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
  const ortho = new THREE.Scene().add(quad)
  const mat = new THREE.ShaderMaterial({ vertexShader: vert, fragmentShader: show, transparent: true, side: THREE.DoubleSide, depthWrite: false, uniforms: { tex: { value: null }, ink: { value: new THREE.Color(INK) } } })
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(6, 6), mat)
  plane.rotation.x = -Math.PI / 2
  g.add(plane, path([V(-3, 0, -3), V(3, 0, -3), V(3, 0, 3), V(-3, 0, 3)], INK, 0.5, true))
  onDispose(() => { a.dispose(); b.dispose(); seed.dispose(); quad.geometry.dispose(); simMat.dispose() })
  let first = true
  return (t, dt, p) => {
    if (dt === 0 && !first) return
    simMat.uniforms.f.value = 0.03 + 0.0067 * p
    const prev = renderer.getRenderTarget()
    for (let i = 0; i < (first ? 1800 : 10); i++) {
      renderer.setRenderTarget(b)
      renderer.render(ortho, cam)
      simMat.uniforms.tex.value = b.texture
      const s = a; a = b; b = s
    }
    first = false
    renderer.setRenderTarget(prev)
    mat.uniforms.tex.value = a.texture
  }
}
