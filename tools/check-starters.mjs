// Compiles and runs every starter file in a temp folder. Usage: npm run check
import { execFileSync, spawnSync } from 'node:child_process'
import { cpSync, mkdtempSync, readdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const root = new URL('../src/starters/', import.meta.url).pathname
const has = (cmd) => spawnSync('which', [cmd]).status === 0
const tmp = mkdtempSync(join(tmpdir(), 'starters-'))
let failed = 0
const run = (label, cmd, args, cwd) => {
  const r = spawnSync(cmd, args, { cwd, encoding: 'utf8', timeout: 120000 })
  if (r.status !== 0) { failed++; console.log(`FAIL ${label}\n${(r.stderr || r.stdout || '').slice(0, 600)}`) }
  return r.status === 0
}
const rust = has('rustc')
if (!rust) console.log('rustc not found: Rust starters are not checked')
for (const slug of readdirSync(root)) {
  const dir = join(tmp, slug)
  cpSync(join(root, slug), dir, { recursive: true })
  run(`${slug} py`, 'python3', ['main.py'], dir)
  if (run(`${slug} c build`, 'cc', ['-std=c11', '-Wall', '-Wextra', '-Werror', '-o', 'main_c', 'main.c', '-lm'], dir)) run(`${slug} c`, './main_c', [], dir)
  run(`${slug} ts`, 'node', ['main.ts'], dir)
  if (rust && run(`${slug} rs build`, 'rustc', ['-O', '-o', 'main_rs', 'main.rs'], dir)) run(`${slug} rs`, './main_rs', [], dir)
}
const tsc = new URL('../node_modules/.bin/tsc', import.meta.url).pathname
for (const slug of readdirSync(root)) {
  run(`${slug} tsc`, tsc, ['--noEmit', '--strict', '--target', 'es2022', '--module', 'nodenext', '--types', 'node', '--allowImportingTsExtensions', join(root, slug, 'main.ts')], root)
}
rmSync(tmp, { recursive: true, force: true })
console.log(failed ? `${failed} check(s) failed` : 'all starters OK')
process.exit(failed ? 1 : 0)
