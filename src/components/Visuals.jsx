import React, { useEffect, useRef, useState } from 'react'
import {
  Lock, MousePointer2, Laptop, Smartphone, Tv, Gamepad2, Server, Snowflake, Zap, MonitorOff,
  CheckCircle2, XCircle, ShieldCheck, RotateCcw, ArrowRight,
} from 'lucide-react'

/* ---------- Animated network on red cover slides ---------- */
const NODES = [[8, 20], [22, 62], [35, 28], [48, 74], [58, 18], [70, 52], [84, 30], [92, 76], [15, 88], [76, 90], [40, 50], [64, 82]]
const LINKS = [[0, 2], [2, 4], [4, 6], [1, 3], [3, 5], [5, 7], [0, 1], [2, 10], [10, 5], [6, 5], [1, 8], [3, 11], [11, 9], [7, 9], [10, 3], [4, 10]]

export function NetworkBg() {
  return (
    <svg className="net-bg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      {LINKS.map(([a, b], i) => {
        const [x1, y1] = NODES[a], [x2, y2] = NODES[b]
        return (
          <g key={i}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} />
            {i % 2 === 0 && (
              <circle r="0.55" className="net-dot">
                <animateMotion dur={`${3 + (i % 5)}s`} repeatCount="indefinite" path={`M${x1},${y1} L${x2},${y2}`} begin={`${i * 0.4}s`} />
              </circle>
            )}
          </g>
        )
      })}
      {NODES.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="0.9" className="net-node" style={{ animationDelay: `${i * 0.3}s` }} />)}
    </svg>
  )
}

/* ---------- Typing address bar on the title slide ---------- */
export function TypingBar({ text = 'https://www.how-the-web-works.com', speed = 70 }) {
  const [n, setN] = useState(0)
  const [clicked, setClicked] = useState(false)
  useEffect(() => {
    if (n < text.length) { const t = setTimeout(() => setN(n + 1), speed); return () => clearTimeout(t) }
    const t = setTimeout(() => setClicked(true), 500)
    return () => clearTimeout(t)
  }, [n, text, speed])
  return (
    <div className={`typing-bar ${clicked ? 'clicked' : ''}`}>
      <Lock size={18} />
      <span className="typed">{text.slice(0, n)}<span className="caret" /></span>
      <span className="go-btn">Go <ArrowRight size={16} /></span>
      <MousePointer2 className="cursor" size={26} fill="#fff" />
    </div>
  )
}

/* ---------- Count-up number ---------- */
export function CountUp({ to, decimals = 0, prefix = '', suffix = '', duration = 1400 }) {
  const [v, setV] = useState(0)
  const start = useRef(null)
  useEffect(() => {
    let raf
    const tick = (t) => {
      if (start.current === null) start.current = t
      const p = Math.min(1, (t - start.current) / duration)
      setV(to * (1 - Math.pow(1 - p, 3)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [to, duration])
  return <>{prefix}{v.toFixed(decimals)}{suffix}</>
}

/* ---------- One second, split up (hook slide) ---------- */
const SECOND = [
  { k: 'Find the address', sub: 'DNS lookup', w: 12 },
  { k: 'Connect securely', sub: 'HTTPS handshake', w: 16 },
  { k: 'Ask and receive', sub: 'Request + response', w: 30 },
  { k: 'Build the page', sub: 'HTML + CSS + JS', w: 42 },
]
export function OneSecondBar() {
  return (
    <div className="one-sec">
      <div className="os-head"><span className="os-big"><CountUp to={1} decimals={2} suffix="s" duration={2000} /></span><span className="muted">is all it takes — and four things happen in that time</span></div>
      <div className="os-bar">
        {SECOND.map((s, i) => (
          <div key={i} className="os-seg" style={{ flex: s.w, animationDelay: `${0.3 + i * 0.45}s` }}>
            <b>{s.k}</b><span>{s.sub}</span>
          </div>
        ))}
      </div>
      <div className="os-scale"><span>0 s</span><span>about 1 second</span></div>
    </div>
  )
}

/* ---------- Restaurant flow (clients & servers) ---------- */
export function DeviceRows() {
  const clients = [[Smartphone, 'Phone'], [Laptop, 'Laptop'], [Tv, 'Smart TV'], [Gamepad2, 'Game console']]
  const servers = [[Zap, 'Always switched on'], [MonitorOff, 'Usually no screen'], [Snowflake, 'Kept cool in data centres'], [Server, 'Stores the website files']]
  return (
    <div className="device-rows">
      <div className="dr"><span className="dr-label">Clients you use</span>{clients.map(([I, t]) => <span key={t} className="dr-chip"><I size={16} /> {t}</span>)}</div>
      <div className="dr"><span className="dr-label red-text">What a server is like</span>{servers.map(([I, t]) => <span key={t} className="dr-chip"><I size={16} /> {t}</span>)}</div>
    </div>
  )
}

/* ---------- Spot the real website (URL safety) ---------- */
const ROUNDS = [
  { q: 'You want to log in to Instagram. Which link is safe?', opts: ['https://instagram.com.free-followers.xyz/login', 'https://www.instagram.com/accounts/login'], a: 1, domain: ['free-followers.xyz', 'instagram.com'] },
  { q: 'A message says “Check your Google account”. Which link is real?', opts: ['https://accounts.google.com/signin', 'https://google.account-verify.net/signin'], a: 0, domain: ['google.com', 'account-verify.net'] },
  { q: 'Looking for deals. Which one is the real Amazon India?', opts: ['https://www.amaz0n.in/deals', 'https://www.amazon.in/deals'], a: 1, domain: ['amaz0n.in (zero, not o!)', 'amazon.in'] },
]

function highlight(url, domain) {
  const clean = domain.split(' ')[0]
  const i = url.indexOf(clean)
  if (i < 0) return url
  return <>{url.slice(0, i)}<mark>{url.slice(i, i + clean.length)}</mark>{url.slice(i + clean.length)}</>
}

export function SpotTheReal() {
  const [r, setR] = useState(0)
  const [pick, setPick] = useState(null)
  const [score, setScore] = useState(0)
  if (r >= ROUNDS.length) {
    return (
      <div className="card spot done-card">
        <ShieldCheck size={48} className="red-text" />
        <h3>You spotted {score} of {ROUNDS.length}!</h3>
        <p className="muted">Always read the main domain before you type a password.</p>
        <button className="btn" onClick={() => { setR(0); setPick(null); setScore(0) }}><RotateCcw size={16} /> Play again</button>
      </div>
    )
  }
  const round = ROUNDS[r]
  return (
    <div className="card spot">
      <div className="spot-head"><span className="pill">Round {r + 1} of {ROUNDS.length}</span><span className="muted">Score {score}</span></div>
      <h3>{round.q}</h3>
      <div className="spot-opts">
        {round.opts.map((o, i) => {
          const st = pick === null ? '' : i === round.a ? 'right' : i === pick ? 'wrong' : 'dim'
          return (
            <button key={i} className={`spot-opt ${st}`} onClick={() => { if (pick !== null) return; setPick(i); if (i === round.a) setScore((s) => s + 1) }}>
              <span className="mono">{pick === null ? o : highlight(o, round.domain[i])}</span>
              {pick !== null && (i === round.a ? <CheckCircle2 size={22} /> : <XCircle size={22} />)}
            </button>
          )
        })}
      </div>
      {pick !== null && (
        <div className="row">
          <span className={pick === round.a ? 'good' : 'bad'}>{pick === round.a ? 'Correct!' : 'Careful!'} The real website is <b>{round.domain[round.a]}</b>. The other one really belongs to <b>{round.domain[1 - round.a]}</b>.</span>
          <span className="spacer" />
          <button className="btn" onClick={() => { setR(r + 1); setPick(null) }}>Next <ArrowRight size={16} /></button>
        </div>
      )}
    </div>
  )
}

/* ---------- Flip cards (key words) ---------- */
export function FlipCards({ items }) {
  const [open, setOpen] = useState({})
  return (
    <div className="flip-grid">
      {items.map((it, i) => (
        <button key={it.term} className={`flip ${open[i] ? 'open' : ''}`} onClick={() => setOpen((o) => ({ ...o, [i]: !o[i] }))} style={{ '--i': i }}>
          <div className="flip-inner">
            <div className="flip-front"><span className="icon-circle"><it.Icon size={24} /></span><b>{it.term}</b><small>Tap to reveal</small></div>
            <div className="flip-back"><b>{it.term}</b><span>{it.def}</span><em>{it.eg}</em></div>
          </div>
        </button>
      ))}
    </div>
  )
}
