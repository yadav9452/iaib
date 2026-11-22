import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Copy, Check, Pencil, Eye } from 'lucide-react'
import { highlightLine } from './highlight.jsx'

/* ---------- What students type into the online editor (CodePen-style: HTML / CSS / JS panels) ---------- */
const H1 = `<h1>Hi, I'm Your Name</h1>
<p>This is my very first website!</p>`

const H2 = `${H1}

<h2>My favourite things</h2>
<ul>
  <li>Cricket</li>
  <li>Music</li>
  <li>Pizza</li>
</ul>

<p>My favourite website is <a href="https://www.wikipedia.org">Wikipedia</a>.</p>`

const C3 = `h1 {
  color: #d7262d;
}

li {
  padding: 6px 0;
}

a {
  color: #d7262d;
  font-weight: bold;
}`

const H4 = `${H2}

<button id="hi">Say hi</button>`

const C4 = `${C3}

button {
  background-color: #d7262d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 16px;
}`

const J4 = `const button = document.getElementById("hi");

button.addEventListener("click", function () {
  button.textContent = "Thanks for visiting!";
});`

export const STEPS = {
  s1: { html: { prev: '', code: H1 }, css: { prev: '', code: '' }, js: { prev: '', code: '' }, focus: 'html' },
  s2: { html: { prev: H1, code: H2 }, css: { prev: '', code: '' }, js: { prev: '', code: '' }, focus: 'html' },
  s3: { html: { prev: H2, code: H2 }, css: { prev: '', code: C3 }, js: { prev: '', code: '' }, focus: 'css' },
  s4: { html: { prev: H2, code: H4 }, css: { prev: C3, code: C4 }, js: { prev: '', code: J4 }, focus: 'html' },
}

export const buildDoc = (html, css, js) =>
  `<!DOCTYPE html><html><head><style>body{font-size:21px;margin:26px}</style><style>${css}</style></head><body>${html}${js ? `<script>${js}<\/script>` : ''}</body></html>`

export const FINAL_DOC = buildDoc(H4, C4, J4)

/* ---------- Line diff (LCS) so new lines can be highlighted ---------- */
function newLines(prev, next) {
  const a = prev ? prev.split('\n') : []
  const b = next.split('\n')
  const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0))
  for (let i = a.length - 1; i >= 0; i--)
    for (let j = b.length - 1; j >= 0; j--)
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1])
  const added = new Set()
  let i = 0, j = 0
  while (j < b.length) {
    if (i < a.length && a[i] === b[j]) { i++; j++ }
    else if (i < a.length && dp[i + 1][j] >= dp[i][j + 1]) i++
    else { if (next) added.add(j); j++ }
  }
  return added
}

const PANELS = [
  { k: 'html', name: 'HTML' },
  { k: 'css', name: 'CSS' },
  { k: 'js', name: 'JS' },
]

export default function GuidedStep({ step, addr = 'codepen.io/your-name/pen/my-first-website' }) {
  const [tab, setTab] = useState(step.focus)
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState({ html: step.html.code, css: step.css.code, js: step.js.code })
  const [copied, setCopied] = useState(false)
  const viewRef = useRef(null)

  const diffs = useMemo(() => ({
    html: newLines(step.html.prev, step.html.code),
    css: newLines(step.css.prev, step.css.code),
    js: newLines(step.js.prev, step.js.code),
  }), [step])

  useEffect(() => {
    const el = viewRef.current?.querySelector('.cl.new')
    if (viewRef.current) viewRef.current.scrollTop = el ? Math.max(0, el.offsetTop - 60) : 0
  }, [tab, editing])

  const copy = async () => {
    try { await navigator.clipboard.writeText(text[tab]) } catch {}
    setCopied(true); setTimeout(() => setCopied(false), 1500)
  }

  const src = editing ? text : { html: step.html.code, css: step.css.code, js: step.js.code }
  const lines = step[tab].code ? step[tab].code.split('\n') : []

  return (
    <div className="guided">
      <div className="code-card">
        <div className="code-head">
          <div className="panel-tabs">
            {PANELS.map((p) => (
              <button key={p.k} className={`ptab ${tab === p.k ? 'active' : ''}`} onClick={() => setTab(p.k)}>
                {p.name}{diffs[p.k].size > 0 && <span className="new-dot" title="Changes in this step" />}
              </button>
            ))}
          </div>
          <span className="spacer" />
          {!editing && diffs[tab].size > 0 && <span className="legend-new">New lines highlighted</span>}
          <button className="tool" onClick={() => setEditing((e) => !e)}>{editing ? <><Eye size={15} /> Highlight view</> : <><Pencil size={15} /> Edit live</>}</button>
          <button className="tool" onClick={copy}>{copied ? <><Check size={15} /> Copied</> : <><Copy size={15} /> Copy</>}</button>
        </div>
        {editing ? (
          <textarea className="code-edit" value={text[tab]} onChange={(e) => setText((t) => ({ ...t, [tab]: e.target.value }))} spellCheck={false} placeholder={`Type ${tab.toUpperCase()} here…`} />
        ) : (
          <pre className="code-view" ref={viewRef}>
            {lines.length === 0 && <div className="empty-panel">Nothing in the {tab.toUpperCase()} panel yet.</div>}
            {lines.map((l, i) => (
              <div key={i} className={`cl ${diffs[tab].has(i) ? 'new' : ''}`}><span className="ln">{i + 1}</span><span className="lc">{l ? highlightLine(l, tab) : ' '}</span></div>
            ))}
          </pre>
        )}
      </div>
      <div className="browser-frame">
        <div className="browser-bar"><span /><span /><span /><div className="addr">{addr}</div><div className="preview-tag">Live preview</div></div>
        <iframe title="preview" srcDoc={buildDoc(src.html, src.css, src.js)} sandbox="allow-scripts allow-popups" />
      </div>
    </div>
  )
}
