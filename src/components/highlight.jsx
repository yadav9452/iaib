import React from 'react'

// Tiny line-based syntax highlighter for HTML, CSS and JS (enough for classroom snippets)
const RULES = {
  html: [
    [/<!--.*?-->/y, 'tk-com'],
    [/<\/?[a-zA-Z][a-zA-Z0-9]*/y, 'tk-tag'],
    [/\/?>/y, 'tk-tag'],
    [/\s[a-zA-Z-]+(?==)/y, 'tk-attr'],
    [/"[^"]*"|'[^']*'/y, 'tk-str'],
    [/=/y, 'tk-pun'],
    [/[^<>"'=\s]+|\s+/y, null],
  ],
  css: [
    [/\/\*.*?\*\//y, 'tk-com'],
    [/^[^{:;]+(?=\s*\{)/y, 'tk-sel'],
    [/[a-z-]+(?=\s*:)/y, 'tk-prop'],
    [/#[0-9a-fA-F]{3,8}\b/y, 'tk-num'],
    [/-?\d+(\.\d+)?(px|em|rem|%|vh|vw)?/y, 'tk-num'],
    [/[{}:;,]/y, 'tk-pun'],
    [/[a-zA-Z-]+/y, 'tk-val'],
    [/\s+|./y, null],
  ],
  js: [
    [/\/\/.*$/y, 'tk-com'],
    [/"[^"]*"|'[^']*'|`[^`]*`/y, 'tk-str'],
    [/\b(const|let|var|function|return|if|else|new)\b/y, 'tk-kw'],
    [/\b(document|window|console)\b/y, 'tk-obj'],
    [/\.?[a-zA-Z_$][\w$]*(?=\s*\()/y, 'tk-fn'],
    [/\d+/y, 'tk-num'],
    [/[{}()[\];,.=+]/y, 'tk-pun'],
    [/[a-zA-Z_$][\w$]*|\s+|./y, null],
  ],
}

export function highlightLine(line, lang = 'html') {
  const rules = RULES[lang] || RULES.html
  const out = []
  let i = 0
  let guard = 0
  while (i < line.length && guard++ < 2000) {
    let matched = false
    for (const [re, cls] of rules) {
      re.lastIndex = i
      if (re.source.startsWith('^') && i !== 0) continue
      const m = re.exec(line)
      if (m && m.index === i && m[0].length) {
        out.push(cls ? <span key={i} className={cls}>{m[0]}</span> : m[0])
        i += m[0].length
        matched = true
        break
      }
    }
    if (!matched) { out.push(line[i]); i++ }
  }
  return out
}

export function Highlighted({ code, lang }) {
  return code.split('\n').map((l, i) => <div key={i}>{highlightLine(l, lang)}{l === '' ? ' ' : null}</div>)
}
