import React, { useEffect, useState } from 'react'
import { Laptop, Server, Mail, FileText, Send, RotateCcw, Code2 } from 'lucide-react'

const OPTIONS = [
  { label: 'About page', path: '/about', code: 200, text: 'OK', file: 'about.html', page: '<h1 style="color:#d7262d">About us</h1><p>We love the web!</p>', say: 'The server found about.html and sent it back.' },
  { label: 'Home page', path: '/', code: 200, text: 'OK', file: 'index.html', page: '<h1 style="color:#d7262d">Welcome!</h1><p>This is the home page.</p>', say: 'The server found index.html and sent it back.' },
  { label: 'A page that doesn’t exist', path: '/pizza', code: 404, text: 'Not Found', file: null, page: '<h1>404</h1><p>Sorry, this page was not found.</p>', say: 'There is no pizza.html on the server, so it answers 404 Not Found.' },
  { label: 'Server has a bug', path: '/crash', code: 500, text: 'Server Error', file: 'crash', page: '<h1>500</h1><p>Oops! Something broke on the server.</p>', say: 'The server tried, but its own code crashed, so it answers 500.' },
]
const FILES = ['index.html', 'about.html', 'contact.html']

const CAPTIONS = [
  'Pick a page, then press “Send request”.',
  'The browser sends a request: “Please GET this page.”',
  'The server receives it and looks for the file.',
  'The server sends a response with a status code.',
  'The browser shows the result to you.',
]

const tone = (c) => (c === 200 ? 'ok' : c === 404 ? 'client' : 'server')

export default function HttpExchange() {
  const [opt, setOpt] = useState(OPTIONS[0])
  const [phase, setPhase] = useState(0) // 0 idle, 1 request flying, 2 server working, 3 response flying, 4 shown
  const [raw, setRaw] = useState(false)

  useEffect(() => {
    if (phase === 0 || phase === 4) return
    const t = setTimeout(() => setPhase((p) => p + 1), phase === 2 ? 1300 : 1500)
    return () => clearTimeout(t)
  }, [phase])

  const pick = (o) => { setOpt(o); setPhase(0) }
  const resDoc = `<html><body style="font-family:Arial;padding:18px;color:#1e1e1e;font-size:20px">${opt.page}</body></html>`

  return (
    <div className="rr">
      <div className="row wrap">
        <span className="muted">Ask for:</span>
        {OPTIONS.map((o) => <button key={o.path} className={`chip ${o === opt ? 'active' : ''}`} onClick={() => pick(o)}>{o.label}</button>)}
        <span className="spacer" />
        <button className="btn" onClick={() => setPhase(1)} disabled={phase > 0 && phase < 4}><Send size={16} /> Send request</button>
        <button className="btn ghost" onClick={() => setPhase(0)}><RotateCcw size={16} /></button>
      </div>

      <div className="rr-stage">
        <div className={`card rr-end ${phase === 1 || phase === 4 ? 'active' : ''}`}>
          <div className="rr-head"><div className="icon-circle"><Laptop size={24} /></div><b>Browser</b></div>
          <div className="mini-browser">
            <div className="mb-bar">myschool.in{opt.path}</div>
            {phase === 4 ? <iframe title="result" srcDoc={resDoc} /> : <div className="mb-wait">{phase === 0 ? 'Nothing loaded yet' : 'Loading…'}</div>}
          </div>
        </div>

        <div className="rr-lane">
          <div className="lane-line" />
          {phase === 1 && <div className="env go"><Mail size={18} /> GET {opt.path}</div>}
          {phase === 3 && <div className={`env back ${tone(opt.code)}`}><Mail size={18} /> {opt.code} {opt.text}</div>}
          <div className="lane-labels"><span>request →</span><span>← response</span></div>
        </div>

        <div className={`card rr-end ${phase === 2 || phase === 3 ? 'active' : ''}`}>
          <div className="rr-head"><div className="icon-circle"><Server size={24} /></div><b>Server</b></div>
          <div className="file-list">
            {FILES.map((f) => (
              <div key={f} className={`file ${phase >= 2 && opt.file === f ? 'found' : ''}`}><FileText size={16} /> {f}</div>
            ))}
            {phase >= 2 && phase < 4 && (
              <div className={`server-say ${tone(opt.code)}`}>
                {opt.code === 200 ? `Found ${opt.file}!` : opt.code === 404 ? `No ${opt.path.slice(1)}.html here…` : 'Error! My code crashed.'}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="rr-steps">
        {CAPTIONS.slice(1).map((c, i) => (
          <div key={i} className={`rr-step ${phase === i + 1 ? 'now' : ''} ${phase > i + 1 ? 'done' : ''}`}><span className="num-circle sm">{i + 1}</span>{c}</div>
        ))}
      </div>

      <div className="row wrap">
        {phase === 4
          ? <div className={`result-band ${tone(opt.code)}`}><b>{opt.code} {opt.text}</b> · {opt.say}</div>
          : <div className="muted">{CAPTIONS[phase]}</div>}
        <span className="spacer" />
        <span className="code ok">200 OK</span><span className="code client">404 Not Found</span><span className="code server">500 Server Error</span>
        <button className="tool" onClick={() => setRaw((r) => !r)}><Code2 size={15} /> {raw ? 'Hide' : 'Show'} the real messages</button>
      </div>

      {raw && (
        <div className="grid-2">
          <pre className="raw card"><b className="kw">GET</b> {opt.path} HTTP/1.1{'\n'}Host: myschool.in{'\n'}User-Agent: Chrome</pre>
          <pre className="raw card"><b className={`code ${tone(opt.code)}`}>HTTP/1.1 {opt.code} {opt.text}</b>{'\n'}Content-Type: text/html{'\n\n'}{opt.page.replace(/ style="[^"]*"/g, '')}</pre>
        </div>
      )}
    </div>
  )
}
