import React from 'react'
import {
  MousePointerClick, Hammer, User, ChefHat, Server, Lightbulb, Link, BookOpen, Send,
  MonitorSmartphone, Code2, Globe, Rocket, Sparkles, Palette, ListChecks, Type, CheckCircle2,
  Users, Waves, Landmark, Hash, Lock, FileText, Shield, Home, Route, MapPin, DoorOpen, StickyNote,
  Bone, Shirt, Brain, ArrowRight, Share2, Smartphone, Wand2,
} from 'lucide-react'
import logoColor from './assets/logo-color.png'
import logoWhite from './assets/logo-white.png'
import ClickJourney from './components/ClickJourney.jsx'
import UrlDissector from './components/UrlDissector.jsx'
import DnsLookup from './components/DnsLookup.jsx'
import HttpExchange from './components/HttpExchange.jsx'
import LayersDemo from './components/LayersDemo.jsx'
import UrlAnalogy from './components/UrlAnalogy.jsx'
import GuidedStep, { STEPS, FINAL_DOC } from './components/GuidedStep.jsx'
import { LiveQR, Showcase } from './components/Interactive.jsx'
import { NetworkBg, TypingBar, CountUp, OneSecondBar, DeviceRows, SpotTheReal, FlipCards } from './components/Visuals.jsx'

export const PARTS = [
  { id: 'p1', label: 'Part 1', name: 'What happens when you open a link' },
  { id: 'p2', label: 'Part 2', name: 'Build and publish a tiny page (activity)' },
]

/* ---------- Building blocks that match the IAIB deck ---------- */
const Head = ({ title, sub, pill }) => (
  <header className="slide-head">
    <div className="sh-text">
      <h1>{title}</h1>
      {sub && <p className="sub">{sub}</p>}
    </div>
    <div className="sh-right">
      {pill && <span className="pill">{pill}</span>}
      <img src={logoColor} alt="upGrad School of Technology | IAIB" className="logo" />
    </div>
  </header>
)

const Cover = ({ kicker, title, sub, mark, children }) => (
  <div className="cover">
    <NetworkBg />
    <img src={logoWhite} alt="upGrad School of Technology | IAIB" className="cover-logo" />
    <div className="cover-body">
      <div className="cover-kicker">{kicker}</div>
      <h1>{title}</h1>
      {sub && <p>{sub}</p>}
      {children}
    </div>
    <div className="cover-mark">{mark}</div>
  </div>
)

const Card = ({ Icon, title, children, red, num }) => (
  <div className={`card ${red ? 'red' : ''}`}>
    {num ? <div className="num-circle">{num}</div> : Icon && <div className="icon-circle"><Icon size={24} /></div>}
    <h3>{title}</h3>
    <div className="card-text">{children}</div>
  </div>
)

const DoThis = ({ items }) => (
  <div className="do-this">
    {items.map((t, i) => (
      <div key={i} className="do-item"><span className="num-circle sm">{i + 1}</span><span>{t}</span></div>
    ))}
  </div>
)

const KeyTags = ({ items }) => (
  <div className="key-tags">
    <span className="kt-label">Key words</span>
    {items.map(([k, v]) => <span key={k} className="kt"><code>{k}</code> {v}</span>)}
  </div>
)

const Note = ({ lead, children, solid }) => (
  <div className={`band ${solid ? 'red' : ''}`}>{lead && <b>{lead}</b>} {children}</div>
)

const Fact = ({ children }) => (
  <div className="band soft fact"><span className="icon-circle sm"><Lightbulb size={18} /></span><span><b className="red-text">Did you know?</b> {children}</span></div>
)

const GLOSSARY = [
  { term: 'Browser', Icon: MonitorSmartphone, def: 'The app you use to open websites.', eg: 'Chrome, Safari, Edge' },
  { term: 'Server', Icon: Server, def: 'A computer that is always on and stores website files.', eg: 'Like a kitchen that never closes' },
  { term: 'URL', Icon: Link, def: 'The full address of a page on the web.', eg: 'https://www.wikipedia.org' },
  { term: 'IP address', Icon: Hash, def: 'A number that identifies a computer on the internet.', eg: '142.250.183.14' },
  { term: 'DNS', Icon: BookOpen, def: 'The internet’s phonebook: turns names into IP addresses.', eg: 'youtube.com → numbers' },
  { term: 'HTTPS', Icon: Lock, def: 'The secure way browser and server talk. Look for the padlock.', eg: 'https:// = sealed envelope' },
  { term: 'Status code', Icon: FileText, def: 'A number in every reply that says how it went.', eg: '200 OK · 404 Not Found' },
  { term: 'HTML · CSS · JS', Icon: Code2, def: 'The three languages every web page is built from.', eg: 'Structure · Style · Behaviour' },
]

export function buildSlides() {
  return [
    /* =================== OPENING =================== */
    {
      id: 'title', part: 'p1', title: 'Title', full: true,
      notes: 'Welcome. Let the address bar type itself and “click”. Ask: “How many websites have you opened today?” Take two or three quick answers. (0–1 min)',
      render: () => (
        <Cover kicker="Ignite AI Buildathon  ·  Live session" title="How the Web Works" sub="From a click to a live website" mark="www">
          <TypingBar />
        </Cover>
      ),
    },
    {
      id: 'plan', part: 'p1', title: 'Today’s plan',
      notes: 'Explain the two halves. Part 1 is short and visual. Part 2 is hands-on: every student leaves with a live website. Read the three outcomes out loud. (1–2 min)',
      render: () => (
        <div className="slide">
          <Head title="Today’s Plan" pill="Agenda" />
          <div className="plan-grid">
            <div className="card red tall">
              <div className="icon-circle"><MousePointerClick size={26} /></div>
              <div className="card-kicker">Part 1 · Understand</div>
              <h3>What happens when you open a link</h3>
              <ul className="card-list">
                <li>Clients and servers</li>
                <li>The journey of a click</li>
                <li>URLs, DNS, requests and responses</li>
                <li>How the browser builds a page</li>
              </ul>
            </div>
            <div className="plan-arrow"><ArrowRight size={36} /></div>
            <div className="card tall">
              <div className="icon-circle"><Hammer size={26} /></div>
              <div className="card-kicker red-text">Part 2 · Build</div>
              <h3>Build and publish a tiny page</h3>
              <ul className="card-list">
                <li>Open a free online code editor</li>
                <li>Add text, a list and a link</li>
                <li>Style it with CSS, add a button with JS</li>
                <li>Share your live link</li>
              </ul>
            </div>
          </div>
          <div className="outcomes">
            <span className="kt-label">You will be able to</span>
            <span className="outcome"><CheckCircle2 size={18} /> Explain what happens after a click</span>
            <span className="outcome"><CheckCircle2 size={18} /> Build a page with HTML, CSS and JS</span>
            <span className="outcome"><CheckCircle2 size={18} /> Share your own website link</span>
          </div>
        </div>
      ),
    },

    /* =================== PART 1 =================== */
    {
      id: 'p1-cover', part: 'p1', title: 'Part 1 cover', full: true,
      notes: 'Part 1 starts. Keep it fast and visual: about 24 minutes.',
      render: () => <Cover kicker="Part 1" title="What Happens When You Open a Link" sub="The one second between your click and the page" mark="01" />,
    },
    {
      id: 'hook', part: 'p1', title: 'What happens in one second?',
      notes: 'Ask the question and let students guess out loud. Then show the one-second bar: four things happen, and the next slides open each one up. The split is approximate — it varies by site and network. (2–4 min)',
      render: () => (
        <div className="slide">
          <Head title="What Happens When You Click?" sub="You tap a link. About one second later a page appears. What happened in that second?" pill="Hook" />
          <div className="band-big red grow">
            <h2>A website is not inside your phone.</h2>
            <p>It lives on another computer, maybe in another country. In about one second your browser finds it, asks for it, and builds it on your screen.</p>
          </div>
          <OneSecondBar />
          <div className="band soft"><span className="icon-circle sm"><Lightbulb size={18} /></span><span><b className="red-text">Pause and think:</b> how does your phone know where that other computer is?</span></div>
        </div>
      ),
    },
    {
      id: 'facts', part: 'p1', title: 'The internet in numbers',
      notes: 'Quick wow moment. The internet is physical: cables under the sea, buildings full of servers. The first website from 1991 can still be visited at info.cern.ch — open it live if you have time. Figures are rounded. (4–5 min)',
      render: () => (
        <div className="slide">
          <Head title="The Internet in Numbers" sub="The web feels invisible, but it runs on real cables, real buildings and real computers." pill="Did you know?" />
          <div className="grid-4 grow">
            <div className="card stat red"><div className="icon-circle"><Users size={24} /></div><div className="stat-num"><CountUp to={5} suffix="+ billion" /></div><div className="stat-label">people use the internet</div></div>
            <div className="card stat"><div className="icon-circle"><Globe size={24} /></div><div className="stat-num"><CountUp to={1} suffix="+ billion" /></div><div className="stat-label">websites exist</div></div>
            <div className="card stat"><div className="icon-circle"><Waves size={24} /></div><div className="stat-num"><CountUp to={99} suffix="%" /></div><div className="stat-label">of data between countries travels through cables under the sea</div></div>
            <div className="card stat"><div className="icon-circle"><Landmark size={24} /></div><div className="stat-num"><CountUp to={1991} duration={1800} /></div><div className="stat-label">the first website went live — still online at info.cern.ch</div></div>
          </div>
          <Note solid>Every one of those websites works the same way. Let’s see how.</Note>
        </div>
      ),
    },
    {
      id: 'client-server', part: 'p1', title: 'Clients and servers',
      notes: 'Restaurant analogy. Watch the moving tickets: the order goes to the kitchen, the dish comes back. The customer (browser) never walks into the kitchen; the waiter (HTTP) carries messages. A server is just a computer that is always on, waiting for requests. (5–8 min)',
      render: () => (
        <div className="slide">
          <Head title="Clients and Servers" sub="Every website visit is a conversation between two computers. Think of a restaurant." pill="Part 1" />
          <div className="grid-3 grow">
            <Card Icon={User} title="Customer = Browser">The <b>client</b>. Your phone or laptop asks for a page: “Can I have the menu, please?”</Card>
            <Card Icon={Send} title="Waiter = HTTP" red>The <b>messenger</b>. Carries your order to the kitchen and brings the dish back.</Card>
            <Card Icon={ChefHat} title="Kitchen = Server">A <b>computer</b> that is always on. It prepares the page and sends it back.</Card>
          </div>
          <div className="order-track">
            <span className="ot-end">You</span>
            <div className="ot-line">
              <span className="ticket go">Order: “the home page, please”</span>
              <span className="ticket back">Dish: the web page</span>
            </div>
            <span className="ot-end">Server</span>
          </div>
          <DeviceRows />
        </div>
      ),
    },
    {
      id: 'journey', part: 'p1', title: 'The journey of a click',
      notes: 'Click “Next step” through all 8 steps. Read the key word and the real-life example for each step. This is the big picture; the next slides zoom into the URL, DNS and the request/response. (8–13 min)',
      render: () => (
        <div className="slide">
          <Head title="The Journey of a Click" sub="Eight steps, about one second. Click Next step to follow the link." pill="Part 1" />
          <ClickJourney />
        </div>
      ),
    },
    {
      id: 'url', part: 'p1', title: 'Anatomy of a URL',
      notes: 'A URL is like a full postal address. Try the preset links, then ask a student for a link they use (a YouTube video, a Google search). Point out the query after “?”. (13–15 min)',
      render: () => (
        <div className="slide">
          <Head title="Anatomy of a URL" sub="A URL is the full address of a page — just like a postal address. Then paste any link to split it." pill="Part 1" />
          <UrlAnalogy />
          <UrlDissector />
        </div>
      ),
    },
    {
      id: 'spot', part: 'p1', title: 'Spot the real website',
      notes: 'Safety skill students can use today. Rule: find the main domain — the part just before the first single “/” — and read it from right to left. Fake sites put a real name at the start to trick you. Let the class vote before you click. (15–17 min)',
      render: () => (
        <div className="slide">
          <Head title="Read the Address, Stay Safe" sub="Fake websites copy real names. The main domain tells you who really owns the page." pill="Part 1 · Game" />
          <div className="spot-layout">
            <SpotTheReal />
            <div className="spot-rules">
              <div className="card red">
                <div className="icon-circle"><Shield size={24} /></div>
                <h3>The golden rule</h3>
                <div className="card-text">Look at the part <b>just before the first single “/”</b>. Read it <b>from right to left</b>: that’s the real owner.</div>
              </div>
              <div className="card">
                <div className="icon-circle"><MapPin size={24} /></div>
                <h3>Example</h3>
                <div className="card-text mono">google.com<b>.fake-login.net</b>/signin<br /><span className="red-text">→ owned by fake-login.net</span></div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'dns', part: 'p1', title: 'DNS: the phonebook',
      notes: 'Start with the phone: you tap “Mom”, the phone dials a number. DNS is the same: you type youtube.com, DNS finds its number (IP address). Press Ask DNS, then click the typo chip to show what happens with a wrong name. (17–19 min)',
      render: () => (
        <div className="slide">
          <Head title="DNS: The Internet’s Phonebook" sub="People remember names. Computers need numbers. DNS works like the contacts list on your phone." pill="Part 1" />
          <DnsLookup />
        </div>
      ),
    },
    {
      id: 'http', part: 'p1', title: 'Request and response',
      notes: 'Send “About page” first and narrate each of the 4 steps as it lights up. Then try “A page that doesn’t exist” (404) and “Server has a bug” (500). Ask: whose mistake is a 404? Optional: “Show the real messages” to reveal the actual text. (19–22 min)',
      render: () => (
        <div className="slide">
          <Head title="Request and Response" sub="Your browser sends a request. The server sends back a response with a status code. Watch it happen." pill="Part 1" />
          <HttpExchange />
        </div>
      ),
    },
    {
      id: 'layers', part: 'p1', title: 'HTML, CSS and JavaScript',
      notes: 'Start with only HTML: plain page. Turn on CSS: it looks designed. Turn on JavaScript: the Like button works. This sets up Part 2, where they write all three themselves. (22–24 min)',
      render: () => (
        <div className="slide">
          <Head title="How the Browser Builds the Page" sub="The browser puts three kinds of files together. YouTube, Instagram and Wikipedia all use these same three. Switch each layer on." pill="Part 1" />
          <LayersDemo />
        </div>
      ),
    },
    {
      id: 'recap1', part: 'p1', title: 'Part 1 recap',
      notes: 'Ask a student to narrate the five steps in their own words. (24–25 min)',
      render: () => (
        <div className="slide">
          <Head title="Part 1: What You Learned" sub="Every time you open a link, these five things happen — in about one second." pill="Recap" />
          <div className="recap-flow">
            {[
              [Link, 'URL', 'You click an address'],
              [BookOpen, 'DNS', 'The name becomes an IP address'],
              [Send, 'Request', 'The browser asks the server'],
              [Server, 'Response', 'The server sends 200 OK + files'],
              [MonitorSmartphone, 'Render', 'HTML + CSS + JS on your screen'],
            ].map(([Icon, t, d], i, arr) => (
              <React.Fragment key={t}>
                <div className={`card recap-card ${i === 3 ? 'red' : ''}`} style={{ '--i': i }}>
                  <div className="num-circle">{i + 1}</div>
                  <Icon size={30} className="recap-icon" />
                  <h3>{t}</h3>
                  <div className="card-text">{d}</div>
                </div>
                {i < arr.length - 1 && <ArrowRight className="recap-arrow" size={28} style={{ '--i': i }} />}
              </React.Fragment>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'keywords', part: 'p1', title: 'Key words',
      notes: 'Quick check: point at a card, ask the class what it means, then tap to flip and reveal. (25–26 min)',
      render: () => (
        <div className="slide">
          <Head title="Key Words: Can You Explain Them?" sub="Say what each word means, then tap the card to check." pill="Quick check" />
          <FlipCards items={GLOSSARY} />
          <Note solid>Now it’s your turn: let’s build your own page online and share it.</Note>
        </div>
      ),
    },

    /* =================== PART 2: ACTIVITY =================== */
    {
      id: 'p2-cover', part: 'p2', title: 'Part 2 cover', full: true,
      notes: 'Part 2: hands-on, in the browser. No installs. Move at the pace of the slowest third; press H for the common-fixes panel.',
      render: () => <Cover kicker="Part 2  ·  Activity" title="Build and Publish a Tiny Page" sub="Right in your browser, using a free online code editor" mark="02" />,
    },
    {
      id: 'what-we-build', part: 'p2', title: 'What we will build',
      notes: 'Show the finished page so students know the goal — click the button in the preview. Walk through the steps briefly. (26–28 min)',
      render: () => (
        <div className="slide">
          <Head title="What We Will Build" sub="A one-page website about you, made online and shared with a real link." pill="Part 2" />
          <div className="build-overview">
            <div className="steps-list">
              {[
                [Globe, 'Get ready', 'Open CodePen and create a new Pen'],
                [Type, 'Step 1 · Your intro', 'A heading and a paragraph (HTML)'],
                [ListChecks, 'Step 2 · List and link', 'Favourite things and a link (HTML)'],
                [Palette, 'Step 3 · Style', 'Colours (CSS)'],
                [Sparkles, 'Step 4 · Make it yours', 'A button that reacts (JS)'],
                [Rocket, 'Publish', 'Save and share your live link'],
              ].map(([Icon, t, d], i) => (
                <div key={i} className="steps-row"><span className="icon-circle sm"><Icon size={18} /></span><b>{t}</b><span className="muted">{d}</span></div>
              ))}
            </div>
            <div className="browser-frame">
              <div className="browser-bar"><span /><span /><span /><div className="addr">codepen.io/your-name/full/my-first-website</div></div>
              <iframe title="final" srcDoc={FINAL_DOC} sandbox="allow-scripts" />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'setup', part: 'p2', title: 'Get ready: CodePen',
      notes: 'Everyone opens codepen.io and signs up (Google login is fastest) so they can save. Then Create → Pen. Point out the three panels and the live preview. Ideally ask students to create accounts before the session. Backup if CodePen is blocked: jsfiddle.net has the same HTML / CSS / JS panels. (28–31 min)',
      render: () => (
        <div className="slide">
          <Head title="Get Ready: Open an Online Editor" sub="We’ll use CodePen: a free website where you write code and see the result instantly. Nothing to install." pill="Part 2" />
          <div className="setup-grid">
            <div className="setup-steps">
              <Card num="1" title="Go to codepen.io">Open it in your browser (Chrome, Edge or Safari).</Card>
              <Card num="2" title="Sign up for free" red>Use <b>Sign up with Google</b>. You need an account to save and share.</Card>
              <Card num="3" title="Create a new Pen">Click <b>Create</b> → <b>Pen</b>. A “Pen” is one small project.</Card>
            </div>
            <div className="editor-diagram">
              <div className="ed-panels">
                <div className="ed-panel" style={{ '--i': 0 }}><Bone size={20} /><b>HTML</b><span>What’s on the page</span></div>
                <div className="ed-panel" style={{ '--i': 1 }}><Shirt size={20} /><b>CSS</b><span>How it looks</span></div>
                <div className="ed-panel" style={{ '--i': 2 }}><Brain size={20} /><b>JS</b><span>What it does</span></div>
              </div>
              <div className="ed-preview"><MonitorSmartphone size={30} /><b>Live preview</b><span>Updates as you type</span></div>
            </div>
          </div>
          <Note solid><CheckCircle2 size={20} /> Checkpoint: thumbs up when you see the empty HTML, CSS and JS panels.</Note>
        </div>
      ),
    },
    {
      id: 'step1', part: 'p2', title: 'Step 1 · Your intro',
      notes: 'Type into the HTML panel. In an online editor we don’t need <!DOCTYPE>, <head> or <body> — CodePen adds them for us. Explain: tags come in pairs, <h1> opens and </h1> closes. Students use their own name. (31–36 min)',
      render: () => (
        <div className="slide wide">
          <Head title="Step 1 · Introduce Yourself" sub="Type in the HTML panel. Tags wrap your text: an opening tag, your words, a closing tag." pill="Part 2 · Step 1" />
          <KeyTags items={[['<h1>', 'big heading'], ['<p>', 'paragraph'], ['</ >', 'closes a tag']]} />
          <DoThis items={['Click in the HTML panel', 'Type the two lines below', 'Change “Your Name” to your own name']} />
          <GuidedStep step={STEPS.s1} />
        </div>
      ),
    },
    {
      id: 'step2', part: 'p2', title: 'Step 2 · List and link',
      notes: '<ul> is a bulleted list and each <li> is one item. <a href> is a link — links are what make it a WEB of pages. Students pick their own three favourite things and a favourite site. (36–41 min)',
      render: () => (
        <div className="slide wide">
          <Head title="Step 2 · A List and a Link" sub="Links connect pages to each other. That’s why it’s called a web." pill="Part 2 · Step 2" />
          <KeyTags items={[['<h2>', 'smaller heading'], ['<ul>', 'bulleted list'], ['<li>', 'one list item'], ['<a href="…">', 'a link']]} />
          <DoThis items={['Add the highlighted lines in the HTML panel', 'Use three of your own favourite things', 'Click your link in the preview to test it']} />
          <GuidedStep step={STEPS.s2} />
        </div>
      ),
    },
    {
      id: 'step3', part: 'p2', title: 'Step 3 · Style with CSS',
      notes: 'Now switch to the CSS panel. Explain one rule: selector { property: value; }. Only three short rules. Let students change the h1 colour to any colour name (blue, green, purple). Same HTML, new look. (41–46 min)',
      render: () => (
        <div className="slide wide">
          <Head title="Step 3 · Style It with CSS" sub="Move to the CSS panel. Same HTML, new look." pill="Part 2 · Step 3" />
          <KeyTags items={[['h1', 'selector: what to style'], ['color', 'property: what to change'], ['#d7262d', 'value: the new look'], ['{ ; }', 'don’t forget these!']]} />
          <DoThis items={['Click in the CSS panel', 'Type the three rules below', 'Try your own heading colour (blue, green, purple)']} />
          <GuidedStep step={STEPS.s3} />
        </div>
      ),
    },
    {
      id: 'step4', part: 'p2', title: 'Step 4 · Make it yours',
      notes: 'Changes in all three panels — click the tabs with a dot. HTML: one button line. CSS: button style. JS: when the button is clicked, change its text. The id "hi" connects HTML and JS. Fast finishers: change colours, add another heading, add an image with <img src="…">. (46–50 min)',
      render: () => (
        <div className="slide wide">
          <Head title="Step 4 · Add a Button (JavaScript)" sub="A little JavaScript makes the page react. Check all three tabs — the dot shows what changed." pill="Part 2 · Step 4" />
          <KeyTags items={[['<button>', 'a clickable button'], ['id="hi"', 'a name tag JS can find'], ['addEventListener', '“when clicked, do this”']]} />
          <DoThis items={['HTML: add the <button> line', 'CSS: add the button style', 'JS: add the click code, then click your button']} />
          <GuidedStep step={STEPS.s4} />
        </div>
      ),
    },
    {
      id: 'publish', part: 'p2', title: 'Save and share',
      notes: 'Save the pen with a title. The full-page view shows only the website, without the editor: change /pen/ to /full/ in the address bar. Paste your own link here to show the QR; students open it on their phones. (50–55 min)',
      render: ({ liveUrl, setLiveUrl }) => (
        <div className="slide">
          <Head title="Save and Share Your Website" sub="Your page is already on the internet. Save it and anyone with the link can open it." pill="Part 2 · Publish" />
          <div className="publish">
            <div className="publish-steps">
              <Card num="1" title="Name and save">Click the pencil next to the title, call it <b>My First Website</b>, then press <b>Save</b>.</Card>
              <Card num="2" title="Open full page" red>In the address bar change <code>/pen/</code> to <code>/full/</code>. Now you see only your website.</Card>
              <Card num="3" title="Share the link">Copy that address and send it to a friend, or open it on your phone.</Card>
              <div className="band soft"><span className="icon-circle sm"><Lightbulb size={18} /></span><span><b className="red-text">Example:</b> codepen.io/aarav/<b>pen</b>/abc123 → codepen.io/aarav/<b>full</b>/abc123</span></div>
            </div>
            <LiveQR url={liveUrl} setUrl={setLiveUrl} />
          </div>
        </div>
      ),
    },
    {
      id: 'showcase', part: 'p2', title: 'Showcase',
      notes: 'Collect live links as students finish. Click a card to show its QR so the class can visit each other’s sites. Ask: “What happened when you opened your friend’s link?” — DNS, request, response, render. (55–58 min)',
      render: ({ showcase, setShowcase }) => (
        <div className="slide">
          <Head title="Showcase: Your Sites Are Live" sub="Open a classmate’s link. Think about what just happened: DNS → request → response → render." pill="Part 2 · Showcase" />
          <Showcase items={showcase} setItems={setShowcase} />
        </div>
      ),
    },
    {
      id: 'learned', part: 'p2', title: 'Today you learned',
      notes: 'Connect both halves: in Part 1 they saw how a page reaches them; in Part 2 they made their own page reach everyone. Set the take-home. (58–60 min)',
      render: () => (
        <div className="slide">
          <Head title="Today You Learned" pill="Wrap-up" />
          <div className="grid-4 grow">
            <Card Icon={MousePointerClick} title="How a link works"><span className="mono red-text">URL → DNS → request → response</span></Card>
            <Card Icon={Server} title="Clients and servers"><span className="mono red-text">a website = files on a server</span></Card>
            <Card Icon={Code2} title="HTML, CSS and JS"><span className="mono red-text">structure + style + behaviour</span></Card>
            <Card Icon={Share2} title="Publishing" red><span className="mono">your code → a live link</span></Card>
          </div>
          <div className="grid-2">
            <div className="band soft"><span className="icon-circle sm"><Wand2 size={18} /></span><span><b className="red-text">Take-home:</b> add an image and a new section about your hobbies, save, and share the new link.</span></div>
            <div className="band soft"><span className="icon-circle sm"><Smartphone size={18} /></span><span><b className="red-text">Try at home:</b> open info.cern.ch — the very first website, from 1991.</span></div>
          </div>
          <Note solid>Great work! You built and published a real website today.</Note>
        </div>
      ),
    },
    {
      id: 'thanks', part: 'p2', title: 'Questions', full: true,
      notes: 'Open the floor for questions. Thank the class.',
      render: () => <Cover kicker="Ignite AI Buildathon" title="Questions?" sub="Thank you. Now go build something for the web." mark="?" />,
    },
  ]
}
