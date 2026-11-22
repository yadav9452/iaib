import React, { useState } from 'react'
import { Bone, Shirt, Brain, Lock } from 'lucide-react'
import { Highlighted } from './highlight.jsx'

const HTML = `<div class="card">
  <h1>Aarav Sharma</h1>
  <p>Class 10 · Loves football and coding</p>
  <button id="like">Like <span id="n">0</span></button>
</div>`

const CSS = `body {
  font-family: Arial;
  background: #f3f4f6;
}
.card {
  background: white;
  padding: 32px;
  border-radius: 16px;
}
h1 { color: #d7262d; }
button { background: #d7262d; color: white; }`

// Layout helpers applied with the CSS layer (kept out of the code shown to students)
const FRAME_CSS = `body { display: grid; place-items: center; min-height: calc(100vh - 52px); }
.card { text-align: center; } button { border: none; border-radius: 99px; padding: 12px 24px; font-size: 20px; }`

const JS = `let n = 0;
document.getElementById('like').onclick = () => {
  n++;
  document.getElementById('n').textContent = n;
};`

const LAYERS = [
  { k: 'html', name: 'HTML', role: 'The skeleton: what is on the page', Icon: Bone },
  { k: 'css', name: 'CSS', role: 'The clothes: how it looks', Icon: Shirt },
  { k: 'js', name: 'JavaScript', role: 'The brain: what it does', Icon: Brain },
]

export default function LayersDemo() {
  const [on, setOn] = useState({ html: true, css: false, js: false })
  const [tab, setTab] = useState('html')
  const doc = on.html
    ? `<!DOCTYPE html><html><head><style>body{font-size:21px;margin:26px}</style><style>${on.css ? FRAME_CSS + CSS : ''}</style></head><body>${HTML}${on.js ? `<script>${JS}<\/script>` : ''}</body></html>`
    : `<html><body style="font-family:Arial;color:#6b7078;display:grid;place-items:center;height:95vh">No HTML means nothing to show.</body></html>`
  const code = { html: HTML, css: CSS, js: JS }

  return (
    <div className="layers">
      <div className="layers-left">
        {LAYERS.map((l) => (
          <label key={l.k} className={`layer-toggle ${on[l.k] ? 'on' : ''}`}>
            <input type="checkbox" checked={on[l.k]} onChange={() => { setOn((o) => ({ ...o, [l.k]: !o[l.k] })); setTab(l.k) }} />
            <span className="icon-circle"><l.Icon size={22} /></span>
            <span className="lt-text"><b>{l.name}</b><small>{l.role}</small></span>
            <span className="switch" />
          </label>
        ))}
        <div className="code-peek">
          <div className="tabs">
            {LAYERS.map((l) => <button key={l.k} className={tab === l.k ? 'active' : ''} onClick={() => setTab(l.k)}>{l.name}</button>)}
          </div>
          <pre><Highlighted code={code[tab]} lang={tab} /></pre>
        </div>
      </div>
      <div className="browser-frame">
        <div className="browser-bar"><span /><span /><span /><div className="addr"><Lock size={12} /> aarav.netlify.app</div></div>
        <iframe title="layers" srcDoc={doc} sandbox="allow-scripts" />
      </div>
    </div>
  )
}
