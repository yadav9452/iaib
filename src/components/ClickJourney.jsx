import React, { useEffect, useRef, useState } from 'react'
import { BookOpen, Router, Server, ChevronLeft, ChevronRight, Play, Pause, RotateCcw, Lock, Loader2, FileText, MousePointer2, Search, Link, ShieldCheck, Send, Download, MonitorSmartphone } from 'lucide-react'

/* Anchor points (percent of the stage) used by lines and moving messages */
const A = {
  bTop: [22, 38], dns: [36, 25],
  bRight: [31, 54], r1: [48, 54], r2: [64, 54], sLeft: [76, 54],
}
const TO_DNS = [A.bTop, A.dns]
const TO_SERVER = [A.bRight, A.r1, A.r2, A.sLeft]
const rev = (p) => [...p].reverse()

const PHASES = [
  { label: 'Find the address', Icon: Search, steps: [0, 1, 2] },
  { label: 'Connect', Icon: ShieldCheck, steps: [3] },
  { label: 'Ask', Icon: Send, steps: [4, 5] },
  { label: 'Receive', Icon: Download, steps: [6] },
  { label: 'Show', Icon: MonitorSmartphone, steps: [7] },
]

const makeSteps = (host, path) => [
  { title: 'You click a link', text: `You click a link to ${host}${path}. The browser has the name of the website, but not where it lives.`, key: 'Link / URL', life: 'Like choosing a friend’s name in your contacts.', move: null, at: 'browser' },
  { title: 'Ask DNS: “Where is this?”', text: `Computers find each other by numbers (IP addresses). The browser asks DNS, the internet’s phonebook, for the number of ${host}.`, key: 'DNS', life: 'Like looking up a name in a phonebook.', move: { path: TO_DNS, label: `Where is ${host}?`, tone: 'ask' }, at: 'dns' },
  { title: 'DNS replies with the IP address', text: 'DNS finds the name in its list and sends back the number. Now the browser knows which computer to contact.', key: 'IP address', life: 'Like getting the phone number for that name.', move: { path: rev(TO_DNS), label: '93.184.215.14', tone: 'answer' }, at: 'browser' },
  { title: 'Open a secure connection', text: 'Browser and server say hello and agree on a secret code (HTTPS). After this, nobody in between can read the messages.', key: 'HTTPS (padlock)', life: 'Like sealing a letter in an envelope.', move: { path: [...TO_SERVER, ...rev(TO_SERVER).slice(1)], label: 'Hello! Let’s talk securely', tone: 'secure', dur: 2600 }, at: 'server' },
  { title: 'Send the HTTP request', text: `The browser sends “GET ${path}, please”. The message is cut into small packets that hop from router to router.`, key: 'HTTP request', life: 'Like a waiter taking your order to the kitchen.', move: { path: TO_SERVER, label: `GET ${path}`, tone: 'ask', packets: 3 }, at: 'server' },
  { title: 'The server finds the file', text: 'The server is just another computer that is always on. It looks for the page you asked for.', key: 'Server', life: 'Like the kitchen preparing your dish.', move: null, at: 'server' },
  { title: 'Response: 200 OK + the page', text: 'The server sends back a status code (200 means OK) together with the HTML, CSS and pictures.', key: 'Status code', life: 'Like the waiter saying “Here’s your order!”', move: { path: rev(TO_SERVER), label: '200 OK + HTML', tone: 'ok', packets: 3 }, at: 'browser' },
  { title: 'The browser shows the page', text: 'The browser reads the HTML (structure), adds the CSS (style), runs the JavaScript (behaviour) and draws the page. All in about one second!', key: 'Rendering', life: 'Like putting the dish on the table, ready to enjoy.', move: null, at: 'browser' },
]

/* Point at fraction t (0..1) along a polyline */
function along(pts, t) {
  const seg = []
  let total = 0
  for (let i = 1; i < pts.length; i++) {
    const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])
    seg.push(d); total += d
  }
  let dist = t * total
  for (let i = 0; i < seg.length; i++) {
    if (dist <= seg[i] || i === seg.length - 1) {
      const f = seg[i] ? Math.min(1, dist / seg[i]) : 1
      return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f]
    }
    dist -= seg[i]
  }
  return pts[pts.length - 1]
}

function Mover({ move }) {
  const [t, setT] = useState(0)
  const start = useRef(null)
  const dur = move.dur || 1800
  const n = move.packets || 1
  const lag = 0.12
  useEffect(() => {
    let raf
    start.current = null
    const tick = (now) => {
      if (start.current === null) start.current = now
      const p = Math.min(1, (now - start.current) / dur)
      setT(p)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [move, dur])
  const ease = (x) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2)
  return (
    <>
      {Array.from({ length: n }).map((_, i) => {
        const local = Math.max(0, Math.min(1, (t * (1 + lag * (n - 1)) - lag * i)))
        const [x, y] = along(move.path, ease(local))
        const done = t >= 1
        return (
          <div key={i} className={`mover ${move.tone} ${done ? 'arrived' : ''}`} style={{ left: `${x}%`, top: `${y}%`, opacity: done && i > 0 ? 0 : 1 }}>
            <span className="mv-dot" />
            {i === 0 && <span className="mv-label">{move.tone === 'secure' && <Lock size={14} />}{move.label}</span>}
          </div>
        )
      })}
    </>
  )
}

function MiniBrowser({ step, host, path }) {
  const states = [
    <div className="mbx-center"><span className="mbx-link">{host}{path}</span><MousePointer2 size={20} className="mbx-cursor" fill="#15171c" /></div>,
    <div className="mbx-center"><Loader2 size={22} className="spin" /> Finding address…</div>,
    <div className="mbx-center"><Loader2 size={22} className="spin" /> Got the number!</div>,
    <div className="mbx-center"><Lock size={20} /> Connecting securely…</div>,
    <div className="mbx-center"><Loader2 size={22} className="spin" /> Asking the server…</div>,
    <div className="mbx-center"><Loader2 size={22} className="spin" /> Waiting…</div>,
    <div className="mbx-center col"><span>Downloading…</span><span className="mbx-bar"><i /></span></div>,
    <div className="mbx-page"><b>About us</b><i /><i /><i className="short" /><span className="mbx-btn">Read more</span></div>,
  ]
  return (
    <div className="mbx">
      <div className="mbx-top"><span /><span /><span /><div className="mbx-addr">{step >= 3 && <Lock size={10} />} {host}{path}</div></div>
      <div className="mbx-body" key={step}>{states[step]}</div>
    </div>
  )
}

export default function ClickJourney({ url = 'https://www.example.com/about' }) {
  let host = 'www.example.com', path = '/about'
  try { const u = new URL(url); host = u.host; path = u.pathname || '/' } catch {}
  const steps = makeSteps(host, path)
  const [step, setStep] = useState(0)
  const [auto, setAuto] = useState(false)

  useEffect(() => {
    if (!auto) return
    if (step >= steps.length - 1) { setAuto(false); return }
    const t = setTimeout(() => setStep((s) => s + 1), 3400)
    return () => clearTimeout(t)
  }, [auto, step, steps.length])

  const cur = steps[step]
  const lit = { dns: step === 1 || step === 2, net: step >= 3 && step !== 5 ? true : step === 5 }
  const phase = PHASES.findIndex((p) => p.steps.includes(step))
  const go = (s) => { setAuto(false); setStep(Math.max(0, Math.min(steps.length - 1, s))) }

  return (
    <div className="journey">
      <div className="journey-stage">
        <div className="phase-bar">
          {PHASES.map((p, i) => (
            <button key={p.label} className={`phase ${i === phase ? 'now' : ''} ${i < phase ? 'done' : ''}`} onClick={() => go(p.steps[0])}>
              <p.Icon size={16} /> {p.label}
            </button>
          ))}
        </div>

        <svg className="journey-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
          <line x1={A.bTop[0]} y1={A.bTop[1]} x2={A.dns[0]} y2={A.dns[1]} className={lit.dns ? 'lit' : ''} />
          <line x1={A.bRight[0]} y1={A.bRight[1]} x2={A.r1[0]} y2={A.r1[1]} className={step >= 3 ? (step === 3 ? 'lit secure' : 'lit') : ''} />
          <line x1={A.r1[0]} y1={A.r1[1]} x2={A.r2[0]} y2={A.r2[1]} className={step >= 3 ? (step === 3 ? 'lit secure' : 'lit') : ''} />
          <line x1={A.r2[0]} y1={A.r2[1]} x2={A.sLeft[0]} y2={A.sLeft[1]} className={step >= 3 ? (step === 3 ? 'lit secure' : 'lit') : ''} />
        </svg>

        {/* Browser */}
        <div className={`jn jn-browser ${cur.at === 'browser' ? 'active' : ''}`}>
          <MiniBrowser step={step} host={host} path={path} />
          <div className="jn-name">Your browser</div>
        </div>

        {/* DNS */}
        <div className={`jn jn-dns ${cur.at === 'dns' ? 'active' : ''}`}>
          <div className="jn-card">
            <div className="jn-card-head"><BookOpen size={18} /> DNS phonebook</div>
            <div className={`dns-row ${step >= 1 ? (step >= 2 ? 'found' : 'search') : ''}`}><span>{host.replace(/^www\./, '')}</span><span className="mono">93.184.215.14</span></div>
            <div className="dns-row dim"><span>google.com</span><span className="mono">142.250.…</span></div>
          </div>
        </div>

        {/* Routers */}
        {[['r1', 'Router'], ['r2', 'Router']].map(([k, l]) => (
          <div key={k} className={`jn-router ${step === 3 || step === 4 || step === 6 ? 'busy' : ''}`} style={{ left: `${A[k][0]}%`, top: `${A[k][1]}%` }}>
            <div className="jr-icon"><Router size={30} /></div>
            <div className="jr-label">{l}</div>
          </div>
        ))}

        {/* Server */}
        <div className={`jn jn-server ${cur.at === 'server' ? 'active' : ''}`}>
          <div className="jn-card">
            <div className="jn-card-head"><Server size={18} /> Web server</div>
            {['index.html', 'about.html', 'style.css'].map((f) => (
              <div key={f} className={`srv-file ${step >= 5 && f === `${path.replace('/', '') || 'index'}.html` ? 'found' : ''} ${step >= 5 && f === 'index.html' && path === '/' ? 'found' : ''}`}><FileText size={14} /> {f}</div>
            ))}
            {step >= 5 && step <= 6 && <div className="srv-ok">200 OK</div>}
          </div>
        </div>

        {cur.move && <Mover key={step} move={cur.move} />}
        <div className="journey-progress"><div style={{ width: `${((step + 1) / steps.length) * 100}%` }} /></div>
      </div>

      <div className="journey-panel">
        <div className="step-dots">
          {steps.map((s, i) => (
            <button key={i} className={`dot ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`} onClick={() => go(i)} title={s.title}>{i + 1}</button>
          ))}
        </div>
        <div className="step-label">Step {step + 1} of {steps.length} · {PHASES[phase].label}</div>
        <h3 key={`h${step}`} className="swap">{cur.title}</h3>
        <p key={`p${step}`} className="swap">{cur.text}</p>
        <div className="jn-extra" key={`x${step}`}>
          <div><span className="jn-label">Key word</span><span className="jn-key">{cur.key}</span></div>
          <div><span className="jn-label">In real life</span><span className="jn-life">{cur.life}</span></div>
        </div>
        <div className="row wrap">
          <button className="btn ghost" onClick={() => go(step - 1)} disabled={step === 0}><ChevronLeft size={18} /> Back</button>
          <button className="btn" onClick={() => go(step + 1)} disabled={step === steps.length - 1}>Next step <ChevronRight size={18} /></button>
          <button className="btn ghost" onClick={() => { if (step === steps.length - 1) setStep(0); setAuto((a) => !a) }}>{auto ? <><Pause size={16} /> Pause</> : <><Play size={16} /> Auto-play</>}</button>
          <button className="btn ghost" onClick={() => go(0)} title="Restart"><RotateCcw size={16} /></button>
        </div>
      </div>
    </div>
  )
}
