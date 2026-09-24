# PortOptimiser demo

Scroll-driven concept demonstration for the EMCR Pitch to Partner project.

## What this is
A single-page, Apple-inspired scrollytelling demonstration that explains a hypothetical port schedule disruption and how PortOptimiser could support recovery decisions.

The scenario and KPI labels are illustrative only; they are not validated against a specific terminal.

## Tech
- HTML
- CSS
- JavaScript
- GSAP + ScrollTrigger (CDN)
- Netlify-ready static hosting

## Local preview
Open `index.html` in a browser. For the most reliable local preview, run a simple static server such as `python -m http.server 8000` and visit `http://localhost:8000`.

## Deploy on Netlify
1. Connect this GitHub repository to Netlify.
2. Build command: leave blank.
3. Publish directory: `.`
4. Deploy.

## Design intent
- Scroll-only interaction
- Premium minimal visual language
- Mobile-first QR experience
- One disruption → one recovery story → five focused scenes
- Connected operational systems can provide the current schedule and operating data
- Scheduler expertise enters through natural language when human context or priorities are needed
- The LLM is an interaction/translation layer; the optimisation model remains the scheduling engine
- Clear separation of data systems, LLM interface, optimisation engine and human decision authority; no separate AI infeasibility detector is assumed
