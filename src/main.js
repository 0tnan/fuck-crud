import '@fontsource-variable/big-shoulders'
import '@fontsource-variable/instrument-sans'
import '@fontsource-variable/jetbrains-mono'
import './style.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Stage } from './stage.js'
import { projects, TAGS, LEVELS } from './projects/index.js'
import { highlight } from './highlight.js'

gsap.registerPlugin(ScrollTrigger)

const still = matchMedia('(prefers-reduced-motion: reduce)').matches
const touch = matchMedia('(hover: none)').matches
const app = document.getElementById('app')
const stage = new Stage(document.getElementById('stage'))
const starters = import.meta.glob('./starters/*/main.*', { query: '?raw', import: 'default' })
const $ = (id) => document.getElementById(id)

const LANGS = [
  { id: 'py', label: 'Python', file: 'main.py', run: 'python3 main.py' },
  { id: 'c', label: 'C', file: 'main.c', run: 'cc -O2 -o main main.c -lm && ./main' },
  { id: 'rs', label: 'Rust', file: 'main.rs', run: 'rustc -O main.rs && ./main' },
  { id: 'ts', label: 'TypeScript', file: 'main.ts', run: 'node main.ts' },
]

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const no = (i) => String(i + 1).padStart(2, '0')
const fields = (p) => p.tags.map((t) => TAGS[t]).join(', ')
const store = {
  get: (k) => { try { return localStorage.getItem(k) } catch { return null } },
  set: (k, v) => { try { localStorage.setItem(k, v) } catch { /* private mode */ } },
}

function plate(p, showing = 'Complete build') {
  $('plate-title').textContent = p.title
  $('plate-no').textContent = `${no(projects.indexOf(p))} of ${projects.length}`
  $('plate-tags').textContent = fields(p)
  $('plate-step').textContent = showing
}

// ---------------------------------------------------------------- home

let filter = 'all'
let homeScroll = 0
let current = projects[0]
let previewTimer

function preview(p) {
  clearTimeout(previewTimer)
  previewTimer = setTimeout(() => {
    current = p
    stage.show(p.slug)
    plate(p)
    for (const li of app.querySelectorAll('.index li')) li.classList.toggle('on', li.dataset.slug === p.slug)
  }, 70)
}

function renderHome() {
  document.body.dataset.view = 'home'
  document.title = 'Fuck CRUD'
  app.innerHTML = `
    <section class="home">
      <header class="masthead">
        <h1><span class="line"><span>Fuck</span></span> <span class="line"><span class="struck">CRUD<i></i></span></span></h1>
        <p class="lede">Twenty projects where the hard part is the maths, the physics or the hardware. Not the form validation.</p>
        <p class="how">Pick one. You get the steps in order, what to learn first, and a starter file in Python, C, Rust or TypeScript.</p>
      </header>
      <nav class="filters" aria-label="Filter by field">
        ${[['all', 'All 20'], ...Object.entries(TAGS)].map(([id, label]) =>
          `<button type="button" data-tag="${id}" aria-pressed="${id === filter}">${label}</button>`).join('')}
      </nav>
      <ol class="index">
        ${projects.map((p, i) => `
          <li data-slug="${p.slug}" data-tags="${p.tags.join(' ')}">
            <a href="#/${p.slug}">
              <span class="no">${no(i)}</span>
              <span class="name">${p.title}</span>
              <span class="meta">${fields(p)}</span>
              <span class="pitch">${esc(p.pitch)}</span>
            </a>
          </li>`).join('')}
      </ol>
      <p class="colophon">Every starter file runs as it is, with no dependencies. The parts marked TODO are yours.</p>
    </section>`

  const rows = [...app.querySelectorAll('.index li')]
  const apply = () => {
    for (const li of rows) li.hidden = filter !== 'all' && !li.dataset.tags.split(' ').includes(filter)
    for (const b of app.querySelectorAll('.filters button')) b.setAttribute('aria-pressed', b.dataset.tag === filter)
  }
  apply()
  for (const b of app.querySelectorAll('.filters button')) {
    b.addEventListener('click', () => {
      filter = b.dataset.tag
      apply()
      const first = rows.find((li) => !li.hidden)
      if (first && rows.find((li) => li.dataset.slug === current.slug)?.hidden) preview(projects.find((p) => p.slug === first.dataset.slug))
    })
  }
  for (const li of rows) {
    const p = projects.find((x) => x.slug === li.dataset.slug)
    li.addEventListener('pointerenter', () => !touch && preview(p))
    li.querySelector('a').addEventListener('focus', () => preview(p))
  }
  if (touch) {
    // No hover on touch screens: the drawing follows the row in the middle of the list.
    const io = new IntersectionObserver((es) => {
      for (const e of es) if (e.isIntersecting && document.body.dataset.view === 'home') preview(projects.find((x) => x.slug === e.target.dataset.slug))
    }, { rootMargin: '-55% 0px -40% 0px' })
    rows.forEach((li) => io.observe(li))
  }
  stage.progress(1, 0, 1)
  preview(current)
}

// ---------------------------------------------------------------- detail

function renderDetail(p) {
  const i = projects.indexOf(p)
  const next = projects[(i + 1) % projects.length]
  const lang = LANGS.find((l) => l.id === store.get('lang')) || LANGS[0]
  current = p
  document.body.dataset.view = 'detail'
  document.title = `${p.title} / Fuck CRUD`
  app.innerHTML = `
    <article class="detail">
      <div class="col">
        <a class="back" href="#/">All projects</a>
        <header class="head">
          <p class="sheet">Sheet ${no(i)} of ${projects.length}</p>
          <h1 style="--chars:${Math.max(...p.title.split(/\s+|(?<=-)/).map((w) => w.length))}"><span class="line"><span>${p.title}</span></span></h1>
          <p class="pitch">${esc(p.pitch)}</p>
          <dl class="facts">
            <div><dt>Fields</dt><dd>${fields(p)}</dd></div>
            <div><dt>Time</dt><dd>${p.time}</dd></div>
            <div><dt>Difficulty</dt><dd>${LEVELS[p.level]}</dd></div>
          </dl>
        </header>
        <section class="brief">
          <h2>What you build</h2>
          <p>${esc(p.build)}</p>
          <h2>Learn this first</h2>
          <ul>${p.know.map((k) => `<li>${esc(k)}</li>`).join('')}</ul>
          <figure class="formula">
            <div class="eq">${esc(p.formula.eq)}</div>
            <figcaption>${esc(p.formula.says)}</figcaption>
          </figure>
        </section>
        <h2 class="steps-title">The build, in ${p.steps.length} steps</h2>
        <ol class="steps">
          ${p.steps.map((s, n) => `
            <li class="step" data-n="${n}">
              <span class="step-no" aria-hidden="true">${n + 1}</span>
              <h3>${esc(s.t)}</h3>
              <p>${esc(s.d)}</p>
              <p class="check"><span>Done when</span> ${esc(s.check)}</p>
            </li>`).join('')}
        </ol>
      </div>
      <section class="code" id="code">
        <div class="code-in">
          <h2>Start here</h2>
          <p class="code-lede">${esc(p.out)} The comments marked TODO follow the step numbers above.</p>
          <div class="tabs" role="tablist" aria-label="Language">
            ${LANGS.map((l) => `<button type="button" role="tab" data-lang="${l.id}" aria-selected="${l.id === lang.id}" tabindex="${l.id === lang.id ? 0 : -1}">${l.label}</button>`).join('')}
          </div>
          <div class="code-bar">
            <code class="file"></code>
            <button type="button" class="copy">Copy</button>
            <a class="download" href="#"></a>
          </div>
          <pre tabindex="0"><code class="src"></code></pre>
          <p class="run">Run it with <code></code></p>
          <a class="next" href="#/${next.slug}"><span>Next project</span><b>${next.title}</b></a>
        </div>
      </section>
    </article>`

  plate(p)
  stage.show(p.slug)
  stage.progress(1, 0, 1)

  // --- steps drive the drawing
  const steps = [...app.querySelectorAll('.step')]
  const activate = (n) => {
    steps.forEach((el, k) => el.classList.toggle('on', k === n))
    if (n < 0) { plate(p); stage.progress(1, 0, 1); return }
    plate(p, `Step ${n + 1} of ${steps.length}: ${p.steps[n].t}`)
    stage.progress((n + 1) / steps.length, (n - (steps.length - 1) / 2) * 0.2, 0.92)
  }
  steps.forEach((el, n) => {
    ScrollTrigger.create({
      trigger: el, start: 'top 62%', end: 'bottom 62%',
      onEnter: () => activate(n), onEnterBack: () => activate(n),
      onLeaveBack: () => n === 0 && activate(-1),
    })
  })
  ScrollTrigger.create({
    trigger: '#code', start: 'top 70%',
    onEnter: () => { document.body.classList.add('in-code'); activate(-1) },
    onLeaveBack: () => { document.body.classList.remove('in-code'); activate(steps.length - 1) },
  })

  // --- starter code
  const tabs = [...app.querySelectorAll('[role=tab]')]
  const srcEl = app.querySelector('.src'), dl = app.querySelector('.download'), copy = app.querySelector('.copy')
  let source = '', url
  const load = async (l) => {
    store.set('lang', l.id)
    tabs.forEach((t) => { const on = t.dataset.lang === l.id; t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1 })
    const loader = starters[`./starters/${p.slug}/${l.file}`]
    source = await loader()
    if (current !== p) return
    srcEl.innerHTML = highlight(source, l.id)
    app.querySelector('.file').textContent = `${p.slug}/${l.file}`
    app.querySelector('.run code').textContent = l.run
    if (url) URL.revokeObjectURL(url)
    url = URL.createObjectURL(new Blob([source], { type: 'text/plain' }))
    dl.href = url
    dl.download = l.file
    dl.textContent = `Download ${l.file}`
    if (!still) gsap.fromTo(srcEl, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' })
    ScrollTrigger.refresh()
  }
  tabs.forEach((t, k) => {
    t.addEventListener('click', () => load(LANGS[k]))
    t.addEventListener('keydown', (e) => {
      const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
      if (!d) return
      const to = tabs[(k + d + tabs.length) % tabs.length]
      to.focus(); to.click()
    })
  })
  copy.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(source); copy.textContent = 'Copied' }
    catch { copy.textContent = 'Copy failed' }
    setTimeout(() => { copy.textContent = 'Copy' }, 1600)
  })
  load(lang)
}

// ---------------------------------------------------------------- routing

let first = true
async function route() {
  const p = projects.find((x) => x.slug === location.hash.replace(/^#\/?/, ''))
  if (document.body.dataset.view === 'home') homeScroll = scrollY
  ScrollTrigger.getAll().forEach((t) => t.kill())
  document.body.classList.remove('in-code')
  if (!still && !first) await gsap.to(app, { opacity: 0, x: p ? -28 : 28, duration: 0.2, ease: 'power2.in' })
  if (p) renderDetail(p); else renderHome()
  scrollTo(0, p ? 0 : homeScroll)
  gsap.set(app, { opacity: 1, x: 0 })
  if (!still) intro(p, first)
  first = false
}

function intro(p, firstLoad) {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  tl.from('.line > span', { yPercent: 105, duration: 0.8, stagger: 0.09 })
  if (p) {
    tl.from('.back, .sheet, .head .pitch, .facts, .brief', { opacity: 0, y: 14, duration: 0.5, stagger: 0.06 }, 0.15)
  } else {
    tl.fromTo('.struck i', { scaleX: 0 }, { scaleX: 1, duration: 0.45, ease: 'power4.inOut' }, 0.55)
    if (firstLoad) {
      tl.from('.lede, .how, .filters', { opacity: 0, y: 14, duration: 0.5, stagger: 0.07 }, 0.5)
      tl.from('.index li', { opacity: 0, x: -18, duration: 0.4, stagger: 0.025 }, 0.75)
    }
  }
}

addEventListener('hashchange', route)
route()
