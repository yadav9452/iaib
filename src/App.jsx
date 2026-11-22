import React, { useEffect, useLayoutEffect, useMemo, useState, useCallback } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { PARTS, buildSlides } from './slides.jsx'
import { HelpPanel } from './components/Interactive.jsx'

export default function App() {
  // Shared lecture state (kept in memory for the session)
  const [liveUrl, setLiveUrl] = useState('')
  const [showcase, setShowcase] = useState([])
  const shared = { liveUrl, setLiveUrl, showcase, setShowcase }
  const slides = useMemo(() => buildSlides(), [])

  const [index, setIndex] = useState(() => {
    const n = parseInt(window.location.hash.replace('#', ''), 10)
    return Number.isFinite(n) && n >= 1 && n <= slides.length ? n - 1 : 0
  })
  const [showNotes, setShowNotes] = useState(false)
  const [showAgenda, setShowAgenda] = useState(false)
  const [showHelp, setShowHelp] = useState(false)

  const slide = slides[index]

  // Slides are designed on a 1600 x 900 canvas and scaled to fill the whole window
  const FOOTER = 52
  const [box, setBox] = useState({ w: 1600, h: 900, s: 1 })
  useLayoutEffect(() => {
    const fit = () => {
      const vw = window.innerWidth, vh = window.innerHeight - FOOTER
      const s = Math.min(vw / 1600, vh / 900)
      setBox({ w: vw / s, h: vh / s, s })
    }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  useEffect(() => { window.history.replaceState(null, '', `#${index + 1}`) }, [index])

  const go = useCallback((d) => setIndex((i) => Math.min(slides.length - 1, Math.max(0, i + d))), [slides.length])

  useEffect(() => {
    const onKey = (e) => {
      const tag = (e.target.tagName || '').toLowerCase()
      if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) return
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') { e.preventDefault(); go(1) }
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go(-1) }
      else if (e.key === 'n' || e.key === 'N') setShowNotes((v) => !v)
      else if (e.key === 'a' || e.key === 'A') setShowAgenda((v) => !v)
      else if (e.key === 'h' || e.key === 'H') setShowHelp((v) => !v)
      else if (e.key === 'f' || e.key === 'F') {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen?.()
        else document.exitFullscreen?.()
      } else if (e.key === 'Escape') { setShowAgenda(false); setShowHelp(false) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])

  return (
    <div className="app">
      <div className="viewport">
        <main
          className={`stage ${slide.full ? 'full' : ''}`}
          key={slide.id}
          style={{ width: box.w, height: box.h, transform: `scale(${box.s})` }}
        >
          {slide.render(shared)}
        </main>
      </div>

      {showNotes && (
        <aside className="notes">
          <div className="notes-head">Presenter notes <button onClick={() => setShowNotes(false)}><X size={18} /></button></div>
          <div className="notes-body">{slide.notes || 'No notes for this slide.'}</div>
        </aside>
      )}

      {showHelp && <HelpPanel onClose={() => setShowHelp(false)} />}

      {showAgenda && (
        <div className="overlay" onClick={() => setShowAgenda(false)}>
          <div className="agenda" onClick={(e) => e.stopPropagation()}>
            <div className="agenda-top"><h2>Session map</h2><button className="icon-btn" onClick={() => setShowAgenda(false)}><X size={20} /></button></div>
            {PARTS.map((p) => (
              <div key={p.id} className="agenda-part">
                <div className="agenda-part-head"><span className="pill">{p.label}</span> {p.name}</div>
                <div className="agenda-slides">
                  {slides.map((sl, i) => sl.part === p.id && (
                    <button key={sl.id} className={i === index ? 'current' : ''} onClick={() => { setIndex(i); setShowAgenda(false) }}>
                      {i + 1}. {sl.title}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <footer className="bottombar">
        <div className="progress">
          <div className="progress-fill" style={{ width: `${((index + 1) / slides.length) * 100}%` }} />
        </div>
        <div className="nav">
          <button onClick={() => go(-1)} disabled={index === 0} aria-label="Previous"><ChevronLeft size={18} /></button>
          <span className="count">{index + 1} / {slides.length}</span>
          <button onClick={() => go(1)} disabled={index === slides.length - 1} aria-label="Next"><ChevronRight size={18} /></button>
        </div>
      </footer>
    </div>
  )
}
