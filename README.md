# How the Web Works — From a Click to a Live Website

Interactive 60-minute session app (React + Vite) · upGrad School of Technology × IAIB

## Run it
```bash
npm install      # first time only
npm run dev      # opens http://localhost:5173 in your browser
```

## Offline / no-setup version
```bash
npm run build    # creates dist/index.html — a single file
```
Double-click `dist/index.html` (or `lecture.html` in this folder) to open it in any browser. No internet or server needed.

## Presenter controls
| Key | Action |
|---|---|
| ← / → / Space | Previous / next slide |
| A | Session map (jump to any slide) |
| N | Presenter notes (with timings) |
| H | “Stuck?” panel: common student mistakes and fixes |
| F | Fullscreen |

## Session plan (60 min)
- **Part 1 · 0–25 min — What happens when you open a link:** the one-second hook, internet in numbers, clients & servers, journey of a click, URL, spot-the-real-website game, DNS, request/response, HTML/CSS/JS, recap and key-word flip cards.
- **Part 2 · 25–60 min — Activity: build and publish a tiny page online (CodePen):** sign up → 4 guided steps (HTML, list & link, CSS, JS button) → save & share the /full/ link → showcase → wrap-up.

## Where to edit
- `src/slides.jsx` — all slides, segment timings, presenter notes
- `src/components/` — interactive pieces (click journey, URL dissector, DNS lookup, request/response, HTML/CSS/JS layers, guided coding steps, QR + showcase, help panel)
- `src/components/GuidedStep.jsx` — the code students type in each step
- `src/styles.css` — theme matched to the IAIB deck (Arial, red `#D7262D`, grey cards, pink accents)
- `src/assets/` — logos taken from the IAIB session deck
