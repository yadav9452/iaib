import React, { useState } from 'react'

const PRESETS = [
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'https://www.google.com/search?q=how+does+the+web+work',
  'https://en.wikipedia.org/wiki/World_Wide_Web#History',
  'http://localhost:5173/about',
]

const COLORS = {
  protocol: '#D7262D',
  subdomain: '#C2410C',
  domain: '#047857',
  tld: '#1D4ED8',
  port: '#7C3AED',
  path: '#A16207',
  query: '#BE185D',
  hash: '#4338CA',
}

const EXPLAIN = {
  protocol: ['Protocol', 'The language/rules used. https = HTTP + security (the padlock).'],
  subdomain: ['Subdomain', 'A section of the site, e.g. www, en, mail.'],
  domain: ['Domain name', 'The human-friendly name someone registered.'],
  tld: ['Top-level domain', '.com, .org, .in, .edu … the last part of the name.'],
  port: ['Port', 'Which “door” on the server to knock on. Usually hidden (443 for https).'],
  path: ['Path', 'Which page or file on that server you want.'],
  query: ['Query string', 'Extra info sent to the server, e.g. what you searched for.'],
  hash: ['Fragment', 'Jumps to a section of the page. Never sent to the server!'],
}

function dissect(raw) {
  const u = new URL(raw.trim())
  const parts = []
  parts.push({ k: 'protocol', v: u.protocol + '//' })
  const labels = u.hostname.split('.')
  if (labels.length >= 3) {
    parts.push({ k: 'subdomain', v: labels.slice(0, labels.length - 2).join('.') + '.' })
    parts.push({ k: 'domain', v: labels[labels.length - 2] })
    parts.push({ k: 'tld', v: '.' + labels[labels.length - 1] })
  } else if (labels.length === 2) {
    parts.push({ k: 'domain', v: labels[0] })
    parts.push({ k: 'tld', v: '.' + labels[1] })
  } else {
    parts.push({ k: 'domain', v: u.hostname })
  }
  if (u.port) parts.push({ k: 'port', v: ':' + u.port })
  parts.push({ k: 'path', v: u.pathname })
  if (u.search) parts.push({ k: 'query', v: u.search })
  if (u.hash) parts.push({ k: 'hash', v: u.hash })
  return parts
}

export default function UrlDissector() {
  const [url, setUrl] = useState(PRESETS[0])
  const [hover, setHover] = useState(null)
  let parts = null
  let error = null
  try { parts = dissect(url) } catch { error = 'That doesn’t look like a full URL yet — include https://' }

  return (
    <div className="url-tool">
      <input className="text-input big" value={url} onChange={(e) => setUrl(e.target.value)} spellCheck={false} placeholder="Paste any URL…" />
      <div className="row wrap">
        {PRESETS.map((p) => (
          <button key={p} className="chip" onClick={() => setUrl(p)}>{new URL(p).hostname}</button>
        ))}
      </div>
      {error && <div className="url-error">{error}</div>}
      {parts && (
        <>
          <div className="url-split card">
            {parts.map((p, i) => (
              <span key={i} className={`url-part ${hover === p.k ? 'hl' : ''}`} style={{ color: COLORS[p.k], borderColor: COLORS[p.k] }}
                onMouseEnter={() => setHover(p.k)} onMouseLeave={() => setHover(null)}>{p.v}</span>
            ))}
          </div>
          <div className="url-legend">
            {parts.map((p, i) => (
              <div key={i} title={EXPLAIN[p.k][1]} className={`legend-item ${hover === p.k ? 'hl' : ''}`} style={{ borderColor: COLORS[p.k] }}
                onMouseEnter={() => setHover(p.k)} onMouseLeave={() => setHover(null)}>
                <span className="lg-dot" style={{ background: COLORS[p.k] }} />
                <b style={{ color: COLORS[p.k] }}>{EXPLAIN[p.k][0]}</b>
                <code>{p.v}</code>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
