import React, { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { X, Plus, QrCode, ExternalLink, Trash2, LifeBuoy } from 'lucide-react'

function useQr(url, width = 420) {
  const [qr, setQr] = useState('')
  useEffect(() => {
    const u = (url || '').trim()
    if (!/^https?:\/\/\S+\.\S+/.test(u)) { setQr(''); return }
    QRCode.toDataURL(u, { width, margin: 1, color: { dark: '#1e1e1e', light: '#ffffff' } }).then(setQr).catch(() => setQr(''))
  }, [url, width])
  return qr
}

/* ---------- Teacher's live link + QR ---------- */
export function LiveQR({ url, setUrl }) {
  const qr = useQr(url)
  return (
    <div className="qr-side">
      <input className="text-input" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Paste your full-page link here…" spellCheck={false} />
      <div className="qr-box card">
        {qr ? <img src={qr} alt="QR code for the live site" /> : <div className="muted center-text"><QrCode size={48} /><br />The QR code appears here.<br />Students scan it to open the site.</div>}
      </div>
    </div>
  )
}

/* ---------- Showcase wall of student sites ---------- */
export function Showcase({ items, setItems }) {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [open, setOpen] = useState(null)
  const qr = useQr(open !== null ? items[open]?.url : '', 520)

  const add = () => {
    let u = url.trim()
    if (!u) return
    if (!/^https?:\/\//.test(u)) u = 'https://' + u
    setItems((it) => [...it, { name: name.trim() || `Student ${it.length + 1}`, url: u }])
    setName(''); setUrl('')
  }

  return (
    <div className="showcase">
      <div className="row">
        <input className="text-input" style={{ maxWidth: 260 }} value={name} onChange={(e) => setName(e.target.value)} placeholder="Student name" />
        <input className="text-input" value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} placeholder="codepen.io/name/full/abc123" spellCheck={false} />
        <button className="btn" onClick={add}><Plus size={18} /> Add</button>
      </div>
      <div className="show-grid">
        {items.length === 0 && <div className="card empty muted">Add each student’s live link as they finish. Click a card to show its QR code.</div>}
        {items.map((it, i) => (
          <div key={i} className="card show-card" onClick={() => setOpen(i)}>
            <div className="show-name">{it.name}</div>
            <div className="show-url">{it.url.replace(/^https?:\/\//, '')}</div>
            <div className="show-actions">
              <a href={it.url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="tool"><ExternalLink size={14} /> Open</a>
              <button className="tool" onClick={(e) => { e.stopPropagation(); setItems((x) => x.filter((_, j) => j !== i)) }}><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
      {open !== null && items[open] && (
        <div className="overlay" onClick={() => setOpen(null)}>
          <div className="qr-modal" onClick={(e) => e.stopPropagation()}>
            <button className="icon-btn close" onClick={() => setOpen(null)}><X size={20} /></button>
            <h2>{items[open].name}</h2>
            <div className="muted mono">{items[open].url}</div>
            {qr && <img src={qr} alt="QR code" />}
          </div>
        </div>
      )}
    </div>
  )
}

/* ---------- "Stuck?" help panel (press H) ---------- */
const FIXES = [
  ['I can’t save my pen', 'You need to be logged in. Sign up for free (Google login is quickest), then press Save.'],
  ['The preview doesn’t change', 'Wait a second — it updates as you type. If not, look for a Run button or refresh the page.'],
  ['Everything after a tag looks wrong', 'A tag was not closed. Check every <h1>, <p>, <li> and <a> has a matching closing tag like </p>.'],
  ['My CSS does nothing', 'CSS goes in the CSS panel, not the HTML panel. Check every rule has { } and each line ends with a semicolon ;'],
  ['The link doesn’t work', 'The address needs quotes and https:// — href="https://www.wikipedia.org"'],
  ['The button does nothing', 'The id must match exactly: id="hi" in HTML and getElementById("hi") in JS. Check spelling and quotes.'],
  ['My link opens the editor, not my site', 'In the address bar change /pen/ to /full/ — that shows only your website.'],
]

export function HelpPanel({ onClose }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="help" onClick={(e) => e.stopPropagation()}>
        <div className="help-head"><span className="icon-circle"><LifeBuoy size={22} /></span><h2>Stuck? Check these first</h2><button className="icon-btn" onClick={onClose}><X size={20} /></button></div>
        <div className="help-grid">
          {FIXES.map(([p, f]) => (
            <div key={p} className="card help-item"><b>{p}</b><span>{f}</span></div>
          ))}
        </div>
      </div>
    </div>
  )
}
