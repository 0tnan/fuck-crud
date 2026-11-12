// A small tokenizer: comments, strings, numbers, keywords. TODO comments get their own class.
const KW = {
  py: 'def class return if elif else for while in not and or import from as with lambda pass continue break None True False yield global is try except finally raise',
  c: 'int double float char void static const struct typedef enum return if else for while do continue break sizeof unsigned long short uint8_t uint16_t uint32_t int16_t int32_t size_t include define FILE complex',
  rs: 'fn let mut const struct enum impl for in if else while loop match return use pub self Self as type true false continue break where trait Some None Ok f32 f64 u8 u16 u32 u64 i16 i32 usize bool Vec Option String',
  ts: 'const let var function return if else for while of in new class interface type extends implements import from export this null undefined true false number string boolean void continue break constructor',
}
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const STR = `"(?:\\\\.|[^"\\\\\\n])*"|'(?:\\\\.|[^'\\\\\\n])*'`
const TAIL = `|(\\b\\d[\\d_]*(?:\\.\\d+)?(?:e[+-]?\\d+)?[A-Za-z0-9_]*\\b)|([A-Za-z_]\\w*)`
const RE = {
  py: new RegExp(`("""[\\s\\S]*?"""|#.*$)|(${STR})${TAIL}`, 'gm'),
  other: new RegExp(`(\\/\\/.*$|\\/\\*[\\s\\S]*?\\*\\/)|(${STR}|\`(?:\\\\.|[^\`\\\\])*\`)${TAIL}`, 'gm'),
}

export function highlight(src, lang) {
  const words = new Set(KW[lang].split(' '))
  const re = lang === 'py' ? RE.py : RE.other
  let out = '', last = 0
  for (const m of src.matchAll(re)) {
    out += esc(src.slice(last, m.index))
    last = m.index + m[0].length
    const t = esc(m[0])
    if (m[1]) out += `<span class="${m[1].includes('TODO') ? 'c todo' : 'c'}">${t}</span>`
    else if (m[2]) out += `<span class="s">${t}</span>`
    else if (m[3]) out += `<span class="n">${t}</span>`
    else out += words.has(m[0]) ? `<span class="k">${t}</span>` : t
  }
  return out + esc(src.slice(last))
}
