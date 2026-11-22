import React, { useEffect, useRef, useState } from 'react'
import { Laptop, BookOpen, Smartphone, Globe, Search, ArrowRight, CheckCircle2, XCircle, WifiOff } from 'lucide-react'

// Example entries shown in the "phonebook" before any lookup.
const BOOK = [
  { name: 'google.com', ip: '142.250.183.14' },
  { name: 'youtube.com', ip: '142.250.67.206' },
  { name: 'wikipedia.org', ip: '103.102.166.224' },
  { name: 'instagram.com', ip: '157.240.16.174' },
]

const clean = (v) => v.trim().toLowerCase().replace(/^[a-z]+:\/\//, '').split(/[/?#:]/)[0].replace(/\.$/, '')

// Real DNS lookup over HTTPS (works in the browser; needs internet).
async function fetchJson(url, headers) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), 5000)
  try {
    const r = await fetch(url, { headers, signal: ctrl.signal })
    if (!r.ok) throw new Error('bad status')
    return await r.json()
  } finally { clearTimeout(t) }
}

async function resolve(name) {
  const sources = [
    () => fetchJson(`https://dns.google/resolve?name=${encodeURIComponent(name)}&type=A`),
    () => fetchJson(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=A`, { accept: 'application/dns-json' }),
  ]
  for (const src of sources) {
    try {
      const j = await src()
      const a = (j.Answer || []).filter((x) => x.type === 1).map((x) => x.data)
      if (a.length) return { status: 'found', ip: a[0], all: a, live: true }
      return { status: 'missing', live: true } // NXDOMAIN or no address
    } catch { /* try next source */ }
  }
  // Offline: fall back to the example phonebook
  const hit = BOOK.find((b) => b.name === name || `www.${b.name}` === name)
  return hit ? { status: 'found', ip: hit.ip, all: [hit.ip], live: false } : { status: 'offline' }
}

export default function DnsLookup() {
  const [query, setQuery] = useState('sot.upgrad.com')
  const [phase, setPhase] = useState(0) // 0 idle, 1 asking, 2 searching, 3 answer
  const [result, setResult] = useState(null)
  const [asked, setAsked] = useState('')
  const req = useRef(0)

  // 1 → 2 after a beat; 2 → 3 once the real answer has arrived (and a minimum pause has passed)
  useEffect(() => {
    if (phase === 1) { const t = setTimeout(() => setPhase(2), 1100); return () => clearTimeout(t) }
    if (phase === 2 && result) { const t = setTimeout(() => setPhase(3), 900); return () => clearTimeout(t) }
  }, [phase, result])

  const ask = (v) => {
    const name = clean(v !== undefined ? v : query)
    if (!name) return
    if (v !== undefined) setQuery(v)
    const id = ++req.current
    setAsked(name); setResult(null); setPhase(1)
    resolve(name).then((r) => { if (req.current === id) setResult(r) })
  }

  const inBook = BOOK.some((b) => b.name === asked)
  const rows = phase >= 2 && asked && !inBook
    ? [...BOOK, { name: asked, ip: result?.status === 'found' ? result.ip : result ? '—' : 'searching…', fresh: true }]
    : BOOK.map((b) => (b.name === asked && result?.status === 'found' ? { ...b, ip: result.ip } : b))

  return (
    <div className="dns2">
      <div className="analogy-row">
        <div className="card analogy">
          <div className="icon-circle"><Smartphone size={24} /></div>
          <div><div className="an-title">On your phone</div><div className="an-line"><b>Mom</b> <ArrowRight size={16} /> <span className="mono">98765 43210</span></div><div className="muted">You tap a name. The phone dials the number.</div></div>
        </div>
        <div className="card analogy red">
          <div className="icon-circle"><Globe size={24} /></div>
          <div><div className="an-title">On the internet</div><div className="an-line"><b>youtube.com</b> <ArrowRight size={16} /> <span className="mono">142.250.67.206</span></div><div>You type a name. DNS finds the number.</div></div>
        </div>
      </div>

      <div className="row">
        <input className="text-input" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && ask()} spellCheck={false} placeholder="Type any website, e.g. sot.upgrad.com" />
        <button className="btn" onClick={() => ask()}><Search size={18} /> Ask DNS</button>
      </div>
      <div className="row wrap">
        <span className="muted">Try:</span>
        {['sot.upgrad.com', 'google.com', 'youtube.com', 'wikipedia.org'].map((n) => <button key={n} className="chip" onClick={() => ask(n)}>{n}</button>)}
        <button className="chip" onClick={() => ask('gogle.cmo')}>gogle.cmo (typo)</button>
      </div>

      <div className="dns-flow">
        <div className={`card flow-box ${phase === 1 ? 'active' : ''}`}>
          <div className="icon-circle"><Laptop size={24} /></div>
          <div className="fb-title">1 · Browser asks</div>
          <div className="bubble">{phase >= 1 ? <>“Where is <b>{asked}</b>?”</> : 'Type a website and press Ask DNS.'}</div>
        </div>
        <ArrowRight className={`flow-arrow ${phase >= 1 ? 'on' : ''}`} size={32} />
        <div className={`card flow-box ${phase === 2 ? 'active' : ''}`}>
          <div className="icon-circle"><BookOpen size={24} /></div>
          <div className="fb-title">2 · DNS checks its phonebook</div>
          <table className="phonebook">
            <tbody>
              {rows.map((b) => (
                <tr key={b.name} className={`${phase >= 2 && b.name === asked ? (result?.status === 'found' ? 'found' : 'looking') : ''}`}>
                  <td>{b.name}</td><td className="mono">{b.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ArrowRight className={`flow-arrow ${phase >= 3 ? 'on' : ''}`} size={32} />
        <div className={`card flow-box ${phase === 3 ? (result?.status === 'found' ? 'done' : 'fail') : ''}`}>
          <div className="icon-circle">
            {phase === 3 && result?.status === 'missing' ? <XCircle size={24} /> : phase === 3 && result?.status === 'offline' ? <WifiOff size={24} /> : <CheckCircle2 size={24} />}
          </div>
          <div className="fb-title">3 · Answer</div>
          <div className="bubble">
            {phase < 3 && '…'}
            {phase === 3 && result?.status === 'found' && <>“<b>{asked}</b> is at <b className="mono">{result.ip}</b>.” Now the browser can go there.</>}
            {phase === 3 && result?.status === 'missing' && <>“No such name.” The browser shows <b>This site can’t be reached</b>.</>}
            {phase === 3 && result?.status === 'offline' && <>Couldn’t reach DNS right now. Check the internet connection and try again.</>}
          </div>
        </div>
      </div>
    </div>
  )
}
