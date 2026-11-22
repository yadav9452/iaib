import React from 'react'

// "A URL is like a postal address" diagram. Colours match the URL splitter below it.
const PARTS = [
  { code: 'https://', color: '#D7262D', title: 'How to travel', line: 'The safe road to take', art: 'road' },
  { code: 'www.youtube.com', color: '#047857', title: 'Which building', line: 'The website’s address', art: 'building' },
  { code: '/watch', color: '#A16207', title: 'Which room', line: 'The page inside the site', art: 'room' },
  { code: '?v=dQw4w9WgXcQ', color: '#BE185D', title: 'A note for the desk', line: 'Extra info for the server', art: 'desk' },
]

function Art({ kind, color }) {
  if (kind === 'road') {
    return (
      <svg viewBox="0 0 200 120" className="ua-svg">
        <rect x="0" y="74" width="200" height="34" rx="6" fill="#3a3d45" />
        <line x1="6" y1="91" x2="194" y2="91" stroke="#fff" strokeWidth="3" strokeDasharray="12 10" />
        <g className="ua-car">
          <rect x="18" y="54" width="58" height="22" rx="7" fill={color} />
          <path d="M30 55 L38 40 H60 L68 55 Z" fill={color} />
          <rect x="40" y="43" width="9" height="10" rx="2" fill="#fff" opacity=".85" />
          <rect x="52" y="43" width="9" height="10" rx="2" fill="#fff" opacity=".85" />
          <circle cx="32" cy="78" r="7" fill="#15171c" /><circle cx="64" cy="78" r="7" fill="#15171c" />
          <circle cx="32" cy="78" r="3" fill="#b9bec6" /><circle cx="64" cy="78" r="3" fill="#b9bec6" />
        </g>
        <rect x="160" y="30" width="4" height="44" fill="#646a73" />
        <circle cx="162" cy="26" r="17" fill="#fff" stroke={color} strokeWidth="3" />
        <rect x="154" y="24" width="16" height="12" rx="2" fill={color} />
        <path d="M157 24 v-4 a5 5 0 0 1 10 0 v4" fill="none" stroke={color} strokeWidth="2.5" />
      </svg>
    )
  }
  if (kind === 'building') {
    return (
      <svg viewBox="0 0 200 120" className="ua-svg">
        <rect x="10" y="108" width="180" height="4" rx="2" fill="#d5d9de" />
        <rect x="55" y="22" width="90" height="86" rx="4" fill="#eceef1" stroke="#b9bec6" strokeWidth="2" />
        <rect x="48" y="6" width="104" height="18" rx="4" fill={color} />
        <text x="100" y="19" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff" fontFamily="Arial">youtube.com</text>
        {[0, 1, 2].map((r) => [0, 1, 2].map((c) => (
          <rect key={`${r}${c}`} x={66 + c * 25} y={32 + r * 20} width="17" height="12" rx="2" fill={r === 1 && c === 1 ? color : '#fff'} stroke="#b9bec6" />
        )))}
        <rect x="88" y="88" width="24" height="20" rx="2" fill="#646a73" />
        <rect x="20" y="70" width="26" height="38" rx="3" fill="#f4f5f7" stroke="#d5d9de" />
        <rect x="154" y="58" width="30" height="50" rx="3" fill="#f4f5f7" stroke="#d5d9de" />
      </svg>
    )
  }
  if (kind === 'room') {
    return (
      <svg viewBox="0 0 200 120" className="ua-svg">
        <rect x="20" y="10" width="160" height="98" rx="4" fill="#f4f5f7" />
        <rect x="10" y="108" width="180" height="4" rx="2" fill="#d5d9de" />
        <rect x="74" y="34" width="52" height="74" rx="3" fill="#fff" stroke={color} strokeWidth="3" />
        <circle cx="116" cy="74" r="3.5" fill={color} />
        <rect x="70" y="14" width="60" height="16" rx="4" fill={color} />
        <text x="100" y="26" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff" fontFamily="Menlo, monospace">/watch</text>
        <rect x="32" y="40" width="28" height="16" rx="2" fill="#fff" stroke="#d5d9de" />
        <rect x="140" y="40" width="28" height="16" rx="2" fill="#fff" stroke="#d5d9de" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 200 120" className="ua-svg">
      <rect x="10" y="108" width="180" height="4" rx="2" fill="#d5d9de" />
      <rect x="30" y="62" width="140" height="10" rx="3" fill="#646a73" />
      <rect x="40" y="72" width="8" height="36" fill="#646a73" />
      <rect x="152" y="72" width="8" height="36" fill="#646a73" />
      <rect x="60" y="72" width="80" height="26" fill="#b9bec6" />
      <g className="ua-note">
        <rect x="76" y="20" width="58" height="40" rx="3" fill="#ffe680" transform="rotate(-6 105 40)" />
        <text x="104" y="38" textAnchor="middle" fontSize="10" fontWeight="700" fill="#15171c" fontFamily="Menlo, monospace" transform="rotate(-6 105 40)">v=dQw4…</text>
        <rect x="88" y="44" width="34" height="3" rx="1.5" fill={color} transform="rotate(-6 105 40)" />
      </g>
      <circle cx="152" cy="56" r="7" fill={color} />
      <rect x="146" y="56" width="12" height="4" rx="1" fill={color} />
    </svg>
  )
}

export default function UrlAnalogy() {
  return (
    <div className="ua">
      <div className="ua-url">
        {PARTS.map((p) => <span key={p.code} style={{ color: p.color, borderColor: p.color }}>{p.code}</span>)}
      </div>
      <div className="ua-grid">
        {PARTS.map((p, i) => (
          <div key={p.code} className="ua-card" style={{ '--c': p.color, '--i': i }}>
            <div className="ua-arrow" />
            <Art kind={p.art} color={p.color} />
            <div className="ua-text"><b>{p.title}</b><span>{p.line}</span></div>
          </div>
        ))}
      </div>
    </div>
  )
}
