import { useState, useEffect, useRef } from "react";

/* ─── GLOBAL STYLES ─── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap');

*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

:root {
  --ink: #080f0a;
  --forest: #0d1f13; --forest2: #142819; --forest3: #1b3421; --forest4: #224028;
  --gold: #a87b2e; --gold2: #c9973e; --gold3: #e0b55a; --gold4: #f0d08a;
  --cream: #f4efe4; --cream2: #ede5d5; --cream3: #e3d8c3;
  --muted: #6b8570; --muted2: #4d6657; --muted3: #8fa897;
  --signal-red: #7a1f1f; --signal-grn: #1e5c30;
  --off: #f8f5ee;
}

html { scroll-behavior: smooth; }
body { font-family: 'Inter', sans-serif; background: var(--cream); color: var(--ink); overflow-x: hidden; }

::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: var(--forest); }
::-webkit-scrollbar-thumb { background: var(--gold2); }

/* ── NAV ── */
.nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 300;
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 60px; transition: all .35s;
}
.nav.scrolled {
  background: rgba(8,15,10,.97); backdrop-filter: blur(16px);
  padding: 13px 60px; border-bottom: 1px solid rgba(168,123,46,.14);
}
.nav-brand { display: flex; flex-direction: column; gap: 1px; }
.nav-wordmark {
  font-family: 'Libre Baskerville', serif; font-size: 19px; font-weight: 700;
  color: var(--cream); letter-spacing: .05em;
}
.nav-wordmark span { color: var(--gold3); }
.nav-sub { font-size: 8.5px; letter-spacing: .28em; text-transform: uppercase; color: rgba(244,239,228,.3); }
.nav-links { display: flex; gap: 28px; }
.nav-link {
  font-size: 10.5px; letter-spacing: .14em; text-transform: uppercase;
  color: rgba(244,239,228,.55); text-decoration: none; cursor: pointer;
  background: none; border: none; font-family: 'Inter', sans-serif;
  transition: color .2s;
}
.nav-link:hover { color: var(--gold3); }
.nav-cta {
  font-size: 9.5px; letter-spacing: .2em; text-transform: uppercase;
  padding: 10px 24px; border: 1px solid var(--gold2); color: var(--gold3);
  background: none; cursor: pointer; font-family: 'Inter', sans-serif;
  font-weight: 500; transition: all .2s;
}
.nav-cta:hover { background: var(--gold2); color: var(--forest); }

/* ── HERO ── */
.hero {
  min-height: 100vh; background: var(--forest);
  display: flex; flex-direction: column;
  position: relative; overflow: hidden;
}
.hero-tex {
  position: absolute; inset: 0; opacity: .035;
  background-size: 3px 3px;
  background-image:
    linear-gradient(45deg,#c9973e 25%,transparent 25%,transparent 75%,#c9973e 75%),
    linear-gradient(45deg,#c9973e 25%,transparent 25%,transparent 75%,#c9973e 75%);
  background-position: 0 0, 1.5px 1.5px;
}
.hero-vline { position: absolute; top: 0; bottom: 0; width: 1px; background: rgba(168,123,46,.06); }
.hero-content {
  flex: 1; display: flex; flex-direction: column; justify-content: center;
  padding: 140px 60px 100px; position: relative; z-index: 2; max-width: 820px;
}
.hero-kicker { display: inline-flex; align-items: center; gap: 12px; margin-bottom: 30px; }
.hero-pill {
  font-size: 9px; letter-spacing: .26em; text-transform: uppercase;
  padding: 5px 16px; background: rgba(168,123,46,.12);
  border: 1px solid rgba(168,123,46,.3); color: var(--gold3);
}
.hero-sep { width: 1px; height: 16px; background: rgba(168,123,46,.3); }
.hero-est { font-size: 9px; letter-spacing: .22em; text-transform: uppercase; color: rgba(244,239,228,.28); }
.hero h1 {
  font-family: 'Libre Baskerville', serif;
  font-size: clamp(42px, 5.5vw, 72px); font-weight: 700;
  line-height: 1.08; color: var(--cream); letter-spacing: -.015em; margin-bottom: 10px;
}
.hero h1 .accent { font-style: italic; font-weight: 400; color: var(--gold3); display: block; }
.hero h1 .sub-h {
  display: block; font-size: .52em; font-weight: 400; font-style: normal;
  color: rgba(244,239,228,.38); margin-top: 14px; letter-spacing: .01em;
  line-height: 1.55; font-family: 'Inter', sans-serif;
}
.hero-rule { width: 60px; height: 1px; background: var(--gold2); margin: 28px 0; }
.hero-body {
  font-size: 15px; line-height: 1.9; color: rgba(244,239,228,.52);
  max-width: 560px; margin-bottom: 40px; font-weight: 300;
}
.hero-body strong { color: rgba(244,239,228,.8); font-weight: 500; }
.hero-btns { display: flex; gap: 12px; flex-wrap: wrap; }
.btn-gold {
  font-size: 10px; letter-spacing: .2em; text-transform: uppercase;
  padding: 15px 38px; background: var(--gold2); color: var(--forest);
  border: none; cursor: pointer; font-family: 'Inter', sans-serif;
  font-weight: 600; transition: background .2s;
}
.btn-gold:hover { background: var(--gold3); }
.btn-outline {
  font-size: 10px; letter-spacing: .2em; text-transform: uppercase;
  padding: 14px 38px; border: 1px solid rgba(244,239,228,.18);
  color: rgba(244,239,228,.6); background: none; cursor: pointer;
  font-family: 'Inter', sans-serif; transition: all .2s;
}
.btn-outline:hover { border-color: var(--gold2); color: var(--gold3); }
.proof-bar {
  display: grid; grid-template-columns: repeat(5, 1fr);
  border-top: 1px solid rgba(168,123,46,.12); position: relative; z-index: 2;
}
.pb-item { padding: 18px 20px; border-right: 1px solid rgba(168,123,46,.08); }
.pb-item:last-child { border: none; }
.pb-n {
  font-family: 'Libre Baskerville', serif; font-size: 24px;
  font-weight: 700; color: var(--gold3); line-height: 1;
}
.pb-l { font-size: 8.5px; letter-spacing: .18em; text-transform: uppercase; color: rgba(244,239,228,.3); margin-top: 4px; }

/* ── CONVICTION BAND ── */
.conv-band { background: var(--gold2); padding: 0; }
.conv-inner { display: flex; align-items: stretch; max-width: 100%; }
.cb-item {
  flex: 1; padding: 24px 32px; text-align: center;
  border-right: 1px solid rgba(8,15,10,.12);
}
.cb-item:last-child { border: none; }
.cb-cap { font-size: 8.5px; letter-spacing: .22em; text-transform: uppercase; color: rgba(8,15,10,.5); margin-bottom: 4px; font-weight: 600; }
.cb-val { font-family: 'Libre Baskerville', serif; font-size: 16px; color: var(--forest); font-weight: 700; }

/* ── SECTION SHARED ── */
.s-in { max-width: 1160px; margin: 0 auto; }
.eyebrow {
  font-size: 9px; letter-spacing: .28em; text-transform: uppercase;
  color: var(--gold2); margin-bottom: 12px;
  display: flex; align-items: center; gap: 10px;
}
.eyebrow::before { content: ''; width: 22px; height: 1px; background: var(--gold2); display: block; }
.eyebrow.light { color: var(--gold3); }
.eyebrow.light::before { background: var(--gold3); }
.s-h {
  font-family: 'Libre Baskerville', serif;
  font-size: clamp(28px, 3.2vw, 44px); font-weight: 700;
  line-height: 1.18; letter-spacing: -.01em;
}
.s-sub { font-size: 14px; line-height: 1.9; color: var(--muted2); font-weight: 300; max-width: 580px; margin-top: 12px; }

/* ── PHILOSOPHY / MANIFESTO ── */
.manifesto { background: var(--off); padding: 96px 60px; }
.mfst-grid { display: grid; grid-template-columns: 1fr 1.55fr; gap: 90px; align-items: start; }
.mfst-pull {
  font-family: 'Libre Baskerville', serif; font-size: 20px; font-style: italic;
  line-height: 1.65; color: var(--forest2); border-left: 3px solid var(--gold2);
  padding-left: 20px; margin-top: 24px;
}
.mfst-body { font-size: 14px; line-height: 1.95; color: #354a3b; font-weight: 300; margin-top: 22px; }
.mfst-body strong { color: var(--forest2); font-weight: 600; }
.mfst-badge-row { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 26px; }
.mfst-badge {
  font-size: 9.5px; letter-spacing: .12em; text-transform: uppercase;
  padding: 5px 13px; border: 1px solid rgba(13,31,19,.15); color: var(--muted2);
}
.vc-pillars { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: rgba(13,31,19,.12); margin-top: 32px; }
.vcp { background: var(--off); padding: 22px 20px; }
.vcp-ico { font-size: 9px; letter-spacing: .2em; text-transform: uppercase; color: var(--gold2); margin-bottom: 8px; font-weight: 600; }
.vcp-t { font-size: 13px; font-weight: 600; color: var(--forest); margin-bottom: 5px; }
.vcp-d { font-size: 12px; color: var(--muted); line-height: 1.65; }

/* ── DUAL MANDATE ── */
.dual { background: var(--forest2); padding: 96px 60px; }
.dual-intro { max-width: 640px; margin-bottom: 52px; }
.dual-intro-body { font-size: 14px; line-height: 1.9; color: rgba(244,239,228,.45); font-weight: 300; margin-top: 12px; }
.dual-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; background: rgba(168,123,46,.07); }
.dcard { padding: 44px 36px; position: relative; overflow: hidden; background: rgba(13,31,19,.55); }
.dcard-bar { position: absolute; top: 0; left: 0; right: 0; height: 2px; }
.dcard-label {
  font-size: 9px; letter-spacing: .24em; text-transform: uppercase;
  padding: 5px 14px; display: inline-flex; align-items: center; gap: 7px; margin-bottom: 22px;
}
.dcard-label.r { background: rgba(122,31,31,.2); border: 1px solid rgba(122,31,31,.35); color: #e8a0a0; }
.dcard-label.g { background: rgba(30,92,48,.2); border: 1px solid rgba(30,92,48,.35); color: #8ed49e; }
.dcard-dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; }
.dcard-h { font-family: 'Libre Baskerville', serif; font-size: 24px; font-weight: 700; color: var(--cream); margin-bottom: 12px; line-height: 1.25; }
.dcard-p { font-size: 13px; line-height: 1.85; color: rgba(244,239,228,.42); margin-bottom: 26px; font-weight: 300; }
.dcard-sigs { list-style: none; display: flex; flex-direction: column; gap: 9px; }
.dcard-sigs li { font-size: 12px; color: rgba(244,239,228,.5); display: flex; align-items: flex-start; gap: 10px; line-height: 1.55; }
.dcard-sigs li::before { content: '—'; color: var(--gold2); flex-shrink: 0; }
.dcard-ft { margin-top: 30px; padding-top: 22px; border-top: 1px solid rgba(168,123,46,.12); font-size: 10.5px; color: var(--gold3); letter-spacing: .08em; }

/* ── OPERATING PLATFORM ── */
.platform { background: var(--cream2); padding: 96px 60px; }
.plat-grid { display: grid; grid-template-columns: 1.1fr 2fr; gap: 80px; align-items: start; margin-top: 52px; }
.plat-name { font-family: 'Libre Baskerville', serif; font-size: 26px; font-weight: 700; color: var(--forest); line-height: 1.2; margin-bottom: 12px; }
.plat-name span { display: block; font-size: 15px; font-weight: 400; font-style: italic; color: var(--gold2); margin-bottom: 4px; }
.plat-desc { font-size: 13px; line-height: 1.9; color: var(--muted2); font-weight: 300; margin-bottom: 24px; }
.plat-stats { display: flex; flex-direction: column; gap: 1px; }
.plat-stat { background: var(--cream3); padding: 18px 20px; border-left: 2px solid var(--gold2); }
.plat-stat-n { font-family: 'Libre Baskerville', serif; font-size: 28px; color: var(--gold2); font-weight: 700; line-height: 1; }
.plat-stat-l { font-size: 9.5px; letter-spacing: .14em; text-transform: uppercase; color: var(--muted2); margin-top: 3px; }
.plat-caps { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1px; background: rgba(13,31,19,.1); }
.pcap { background: var(--cream2); padding: 26px 22px; }
.pcap-n { font-size: 9px; letter-spacing: .2em; text-transform: uppercase; color: var(--gold2); margin-bottom: 8px; font-weight: 600; }
.pcap-t { font-size: 13px; font-weight: 600; color: var(--forest); margin-bottom: 6px; line-height: 1.3; }
.pcap-d { font-size: 12px; color: var(--muted); line-height: 1.65; }
.playbook-bar {
  background: var(--forest3); padding: 28px 32px; margin-top: 2px;
  display: flex; align-items: center; gap: 32px;
}
.playbook-bar-icon { font-size: 9px; letter-spacing: .22em; text-transform: uppercase; color: var(--gold3); flex-shrink: 0; writing-mode: vertical-rl; }
.playbook-bar-text { font-family: 'Libre Baskerville', serif; font-size: 17px; font-style: italic; color: rgba(244,239,228,.65); line-height: 1.6; }
.playbook-bar-text strong { color: var(--gold3); font-style: normal; }

/* ── TRACK RECORD ── */
.track { background: var(--forest); padding: 96px 60px; }
.tr-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; margin-top: 52px; background: rgba(168,123,46,.07); }
.tcard { background: rgba(13,31,19,.5); padding: 36px 28px; cursor: default; }
.tcard.clickable { cursor: pointer; transition: background .2s; }
.tcard.clickable:hover { background: rgba(13,31,19,.8); }
.tc-type { font-size: 9px; letter-spacing: .22em; text-transform: uppercase; display: flex; align-items: center; gap: 8px; margin-bottom: 18px; }
.tc-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.tc-dot.d { background: var(--signal-red); box-shadow: 0 0 6px rgba(122,31,31,.5); }
.tc-dot.h { background: #3d9c5a; box-shadow: 0 0 6px rgba(30,92,48,.5); }
.tc-dot.e { background: var(--gold2); }
.tc-type-label { color: rgba(244,239,228,.4); font-weight: 500; }
.tc-rev { font-family: 'Libre Baskerville', serif; font-size: 22px; color: var(--gold3); font-weight: 700; line-height: 1; margin-bottom: 6px; }
.tc-cat { font-size: 11px; font-weight: 600; color: var(--cream); margin-bottom: 10px; letter-spacing: .03em; }
.tc-desc { font-size: 12px; color: rgba(244,239,228,.38); line-height: 1.7; font-weight: 300; }
.tc-result { margin-top: 20px; padding-top: 18px; border-top: 1px solid rgba(168,123,46,.1); font-size: 11px; color: var(--gold3); letter-spacing: .06em; font-weight: 500; }
.track-note { margin-top: 28px; font-size: 11px; color: rgba(244,239,228,.25); text-align: center; letter-spacing: .06em; }

/* ── CONTROL CONVICTION ── */
.ctrl { background: var(--cream3); padding: 96px 60px; }
.ctrl-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; margin-top: 52px; }
.ctrl-body { font-size: 14px; line-height: 1.95; color: var(--muted2); font-weight: 300; }
.ctrl-stats { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1px; background: rgba(13,31,19,.15); margin-top: 32px; }
.ctrl-stat { background: var(--cream3); padding: 20px 18px; }
.ctrl-stat-n { font-family: 'Libre Baskerville', serif; font-size: 30px; color: var(--gold2); font-weight: 700; line-height: 1; }
.ctrl-stat-l { font-size: 9.5px; letter-spacing: .14em; text-transform: uppercase; color: var(--muted2); margin-top: 4px; }
.ctrl-box { background: var(--forest); padding: 44px; border-left: 3px solid var(--gold2); }
.ctrl-box-title { font-family: 'Libre Baskerville', serif; font-size: 19px; font-style: italic; color: rgba(244,239,228,.7); margin-bottom: 24px; line-height: 1.5; }
.ctrl-list { list-style: none; display: flex; flex-direction: column; gap: 15px; }
.ctrl-list li { font-size: 13px; color: rgba(244,239,228,.5); line-height: 1.65; padding-bottom: 15px; border-bottom: 1px solid rgba(168,123,46,.08); display: flex; gap: 14px; }
.ctrl-list li:last-child { border: none; padding: 0; }
.ctrl-list-n { font-family: 'Libre Baskerville', serif; font-size: 11px; color: var(--gold2); flex-shrink: 0; font-style: italic; margin-top: 2px; }

/* ── PORTFOLIO ── */
.portfolio { background: var(--off); padding: 96px 60px; }
.port-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px; }
.port-access { font-size: 11px; color: var(--muted); display: flex; align-items: center; gap: 7px; }
.port-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; background: rgba(13,31,19,.1); }
.pc { background: var(--off); padding: 30px 26px; min-height: 190px; position: relative; transition: background .2s; }
.pc:hover:not(.locked) { background: var(--cream2); }
.pc.locked .pc-body { filter: blur(6px); user-select: none; pointer-events: none; }
.lock-overlay {
  position: absolute; inset: 0; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 8px; z-index: 2;
  background: rgba(248,245,238,.6); backdrop-filter: blur(2px); cursor: pointer;
}
.lock-icon { font-size: 20px; color: var(--muted2); }
.lock-lbl { font-size: 9px; letter-spacing: .2em; text-transform: uppercase; color: var(--muted2); }
.lock-btn {
  font-size: 9px; letter-spacing: .18em; text-transform: uppercase;
  padding: 7px 18px; background: var(--forest); color: var(--gold3);
  border: none; cursor: pointer; font-family: 'Inter', sans-serif;
  font-weight: 600; margin-top: 4px; transition: background .2s;
}
.lock-btn:hover { background: var(--gold2); color: var(--forest); }
.pc-cat { font-size: 9px; letter-spacing: .2em; text-transform: uppercase; color: var(--gold2); margin-bottom: 9px; font-weight: 600; }
.pc-name { font-family: 'Libre Baskerville', serif; font-size: 22px; font-weight: 700; color: var(--forest); margin-bottom: 7px; line-height: 1.2; }
.pc-status { font-size: 11px; color: var(--muted); display: flex; align-items: center; gap: 6px; }
.pdot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; flex-shrink: 0; }
.pdot.h { background: #3d9c5a; }
.pdot.d { background: var(--signal-red); }
.pdot.e { background: var(--gold2); }
.pc-desc { font-size: 12px; color: var(--muted2); margin-top: 11px; line-height: 1.65; }
.port-cta-row { display: flex; justify-content: flex-end; margin-top: 18px; }
.btn-outline-dark {
  font-size: 10px; letter-spacing: .2em; text-transform: uppercase;
  padding: 12px 28px; border: 1px solid rgba(13,31,19,.2); color: var(--muted2);
  background: none; cursor: pointer; font-family: 'Inter', sans-serif; transition: all .2s;
}
.btn-outline-dark:hover { border-color: var(--gold2); color: var(--gold2); }

/* ── WHY VDA ── */
.why { background: var(--forest3); padding: 96px 60px; }
.why-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: rgba(168,123,46,.08); margin-top: 52px; }
.wcard { background: rgba(21,52,33,.45); padding: 32px 22px; }
.wc-n { font-family: 'Libre Baskerville', serif; font-size: 36px; color: rgba(168,123,46,.22); font-weight: 700; line-height: 1; margin-bottom: 12px; }
.wc-t { font-size: 14px; font-weight: 600; color: var(--cream); margin-bottom: 8px; line-height: 1.3; }
.wc-d { font-size: 12px; color: rgba(244,239,228,.38); line-height: 1.7; font-weight: 300; }
.why-bottom { margin-top: 2px; background: rgba(168,123,46,.06); padding: 28px 32px; display: flex; align-items: center; justify-content: space-between; gap: 32px; }
.why-bottom-text { font-family: 'Libre Baskerville', serif; font-size: 18px; font-style: italic; color: rgba(244,239,228,.5); line-height: 1.6; max-width: 700px; }
.why-bottom-text em { color: rgba(244,239,228,.7); }
.why-cta {
  font-size: 10px; letter-spacing: .2em; text-transform: uppercase;
  padding: 13px 28px; border: 1px solid rgba(168,123,46,.4); color: var(--gold3);
  background: none; cursor: pointer; font-family: 'Inter', sans-serif; white-space: nowrap;
  transition: all .2s; flex-shrink: 0;
}
.why-cta:hover { background: rgba(168,123,46,.12); }

/* ── TEAM ── */
.team { background: var(--cream); padding: 96px 60px; }
.team-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: rgba(13,31,19,.1); margin-top: 48px; }
.tmc { background: var(--cream); padding: 26px 22px; transition: background .25s; }
.tmc:hover { background: var(--forest); }
.tmc:hover .tmc-name { color: var(--cream); }
.tmc:hover .tmc-role { color: var(--gold3); }
.tmc:hover .tmc-badge { background: rgba(168,123,46,.15); color: var(--gold3); }
.tmc-init {
  width: 40px; height: 40px; border-radius: 50%;
  background: var(--forest3); display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 600; color: var(--gold3); margin-bottom: 12px; letter-spacing: .04em;
}
.tmc-name { font-family: 'Libre Baskerville', serif; font-size: 15px; font-weight: 700; color: var(--forest); margin-bottom: 3px; line-height: 1.25; transition: color .25s; }
.tmc-role { font-size: 11px; color: var(--muted); line-height: 1.4; transition: color .25s; }
.tmc-badge {
  font-size: 9px; letter-spacing: .12em; text-transform: uppercase;
  padding: 3px 9px; background: rgba(13,31,19,.06); color: var(--muted2);
  display: inline-block; margin-top: 9px; transition: all .25s;
}
/* Founder card */
.tmc.founder {
  grid-column: span 2; background: var(--forest);
  display: flex; align-items: center; gap: 24px; padding: 28px 30px;
}
.tmc.founder:hover { background: var(--forest2); }
.founder-init {
  width: 54px; height: 54px; border-radius: 50%;
  background: var(--forest3); border: 1px solid rgba(168,123,46,.3);
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; font-weight: 700; color: var(--gold3); flex-shrink: 0; letter-spacing: .04em;
}
.founder-name { font-family: 'Libre Baskerville', serif; font-size: 20px; font-weight: 700; color: var(--cream); margin-bottom: 3px; }
.founder-role { font-size: 10px; letter-spacing: .18em; text-transform: uppercase; color: var(--gold3); margin-bottom: 5px; }
.founder-note { font-size: 12px; color: rgba(244,239,228,.38); font-weight: 300; line-height: 1.5; }

/* ── CONTACT ── */
.contact { background: var(--forest2); padding: 96px 60px; }
.contact-grid { display: grid; grid-template-columns: 1fr 1.1fr; gap: 80px; align-items: start; }
.contact-reasons { margin-top: 32px; list-style: none; display: flex; flex-direction: column; }
.cr-item { padding: 16px 0; border-bottom: 1px solid rgba(168,123,46,.08); display: flex; align-items: flex-start; gap: 14px; }
.cr-icon { font-family: 'Libre Baskerville', serif; font-size: 16px; color: var(--gold2); flex-shrink: 0; margin-top: 2px; }
.cr-text { font-size: 13px; color: rgba(244,239,228,.48); line-height: 1.65; }
.cr-text strong { color: rgba(244,239,228,.75); font-weight: 600; }
.contact-book-link {
  margin-top: 28px; display: inline-flex; align-items: center; gap: 10px;
  font-size: 10px; letter-spacing: .18em; text-transform: uppercase;
  padding: 12px 24px; border: 1px solid rgba(168,123,46,.35); color: var(--gold3);
  text-decoration: none; transition: all .2s;
}
.contact-book-link:hover { background: rgba(168,123,46,.1); }
.cf { display: flex; flex-direction: column; gap: 14px; }
.cf-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.cf-field { display: flex; flex-direction: column; }
.cf-label { font-size: 9px; letter-spacing: .2em; text-transform: uppercase; color: rgba(244,239,228,.3); margin-bottom: 4px; }
.cf-input {
  width: 100%; padding: 12px 14px;
  background: rgba(244,239,228,.05); border: 1px solid rgba(244,239,228,.1);
  color: var(--cream); font-family: 'Inter', sans-serif; font-size: 13.5px;
  outline: none; transition: border-color .2s;
}
.cf-input::placeholder { color: rgba(244,239,228,.2); }
.cf-input:focus { border-color: var(--gold2); }
.cf-input option { background: #0d1f13; color: var(--cream); }
.cf-textarea { resize: vertical; min-height: 95px; }
.cf-submit {
  font-size: 10.5px; letter-spacing: .22em; text-transform: uppercase;
  padding: 16px; background: var(--gold2); color: var(--forest);
  border: none; cursor: pointer; font-family: 'Inter', sans-serif;
  font-weight: 700; width: 100%; transition: background .2s; margin-top: 4px;
}
.cf-submit:hover { background: var(--gold3); }
.cf-alt { margin-top: 12px; text-align: center; font-size: 11.5px; color: rgba(244,239,228,.3); }
.cf-alt a { color: var(--gold3); text-decoration: none; }
.cf-alt a:hover { text-decoration: underline; }

/* ── FOOTER ── */
.footer {
  background: var(--ink); padding: 26px 60px;
  display: flex; justify-content: space-between; align-items: center;
  flex-wrap: wrap; gap: 12px; border-top: 1px solid rgba(168,123,46,.1);
}
.footer-brand { font-family: 'Libre Baskerville', serif; font-size: 15px; color: rgba(244,239,228,.4); letter-spacing: .05em; }
.footer-brand span { color: var(--gold3); }
.footer-links { display: flex; gap: 20px; }
.footer-links a { font-size: 9.5px; letter-spacing: .14em; text-transform: uppercase; color: rgba(244,239,228,.22); text-decoration: none; }
.footer-links a:hover { color: var(--gold3); }
.footer-copy { font-size: 10px; color: rgba(244,239,228,.18); }

/* ── MODAL ── */
.modal-overlay {
  position: fixed; inset: 0; z-index: 500;
  background: rgba(8,15,10,.88); backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center;
}
.modal {
  background: var(--cream); max-width: 480px; width: 90%;
  padding: 52px; position: relative;
}
.modal::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0;
  height: 2px; background: linear-gradient(90deg, var(--gold), var(--gold3));
}
.modal-close {
  position: absolute; top: 16px; right: 18px;
  background: none; border: none; font-size: 20px;
  color: var(--muted2); cursor: pointer; line-height: 1;
}
.modal-close:hover { color: var(--forest); }
.modal-eye { font-size: 9px; letter-spacing: .24em; text-transform: uppercase; color: var(--gold2); margin-bottom: 8px; display: flex; align-items: center; gap: 8px; }
.modal-eye::before { content: ''; width: 18px; height: 1px; background: var(--gold2); display: block; }
.modal-title { font-family: 'Libre Baskerville', serif; font-size: 24px; font-weight: 700; color: var(--forest); margin-bottom: 7px; }
.modal-sub { font-size: 13px; color: var(--muted2); margin-bottom: 26px; line-height: 1.7; }
.modal-form { display: flex; flex-direction: column; gap: 11px; }
.modal-input {
  width: 100%; padding: 11px 13px;
  background: var(--cream2); border: 1px solid rgba(13,31,19,.12);
  color: var(--ink); font-family: 'Inter', sans-serif; font-size: 13.5px; outline: none; transition: border-color .2s;
}
.modal-input:focus { border-color: var(--gold2); }
.modal-submit {
  font-size: 10px; letter-spacing: .2em; text-transform: uppercase;
  padding: 14px; background: var(--forest); color: var(--gold3);
  border: none; cursor: pointer; font-family: 'Inter', sans-serif;
  font-weight: 700; width: 100%; transition: all .2s;
}
.modal-submit:hover { background: var(--gold2); color: var(--forest); }
.modal-note { font-size: 11px; color: var(--muted); margin-top: 7px; text-align: center; }

/* ── REVEAL ANIMATION ── */
.rv { opacity: 0; transform: translateY(18px); transition: opacity .6s ease, transform .6s ease; }
.rv.vis { opacity: 1; transform: none; }

/* ── RESPONSIVE ── */
@media (max-width: 900px) {
  .nav { padding: 16px 24px; }
  .nav.scrolled { padding: 12px 24px; }
  .nav-links { display: none; }
  section, .manifesto, .dual, .platform, .track, .ctrl, .portfolio,
  .why, .team, .contact { padding: 64px 24px; }
  .hero-content { padding: 120px 24px 80px; }
  .mfst-grid { grid-template-columns: 1fr; gap: 40px; }
  .dual-grid { grid-template-columns: 1fr; }
  .plat-grid { grid-template-columns: 1fr; gap: 40px; }
  .plat-caps { grid-template-columns: 1fr 1fr; }
  .tr-grid { grid-template-columns: 1fr 1fr; }
  .ctrl-grid { grid-template-columns: 1fr; }
  .why-grid { grid-template-columns: 1fr 1fr; }
  .why-bottom { flex-direction: column; align-items: flex-start; }
  .team-grid { grid-template-columns: 1fr 1fr; }
  .tmc.founder { grid-column: span 2; }
  .contact-grid { grid-template-columns: 1fr; }
  .proof-bar { grid-template-columns: 1fr 1fr; }
  .conv-inner { flex-wrap: wrap; }
  .cb-item { flex: 1 0 50%; }
  .port-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 600px) {
  .tr-grid { grid-template-columns: 1fr; }
  .plat-caps { grid-template-columns: 1fr; }
  .why-grid { grid-template-columns: 1fr; }
  .tmc.founder { grid-column: span 2; flex-direction: column; }
  .port-grid { grid-template-columns: 1fr; }
  .port-header { flex-direction: column; align-items: flex-start; gap: 8px; }
  .proof-bar { grid-template-columns: 1fr 1fr; }
}
`;

/* ─── REVEAL HOOK ─── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".rv");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("vis"); io.unobserve(e.target); } }),
      { threshold: 0.05 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ─── SCROLL HELPER ─── */
function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ════════════════════════════════════════════════════
   MODAL
════════════════════════════════════════════════════ */
function Modal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-eye">Portfolio Access Request</div>
        <div className="modal-title">Qualified Counterparties Only</div>
        <p className="modal-sub">
          Van Dyke Acquisitions shares portfolio detail exclusively with verified principals,
          advisors, and institutional counterparties. Submit your information and we will
          respond within one business day.
        </p>
        <div className="modal-form">
          <input className="modal-input" placeholder="Full Name" type="text" />
          <input className="modal-input" placeholder="Organization / Fund / Firm" type="text" />
          <input className="modal-input" placeholder="Professional Email Address" type="email" />
          <input className="modal-input" placeholder="Title / Role" type="text" />
          <select className="modal-input" defaultValue="">
            <option value="" disabled>Reason for Access</option>
            <option>M&A Advisory / Deal Sourcing</option>
            <option>Founder Evaluating a Sale</option>
            <option>Creditor / Banker / Trustee</option>
            <option>PE / Family Office Co-Investment</option>
            <option>Strategic / Corporate Development</option>
            <option>Other</option>
          </select>
          <button className="modal-submit">Submit Access Request</button>
        </div>
        <p className="modal-note">All submissions are reviewed personally. Confidentiality guaranteed.</p>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   NAV
════════════════════════════════════════════════════ */
function Nav({ onModalOpen }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return (
    <nav className={`nav${scrolled ? " scrolled" : ""}`}>
      <div className="nav-brand">
        <div className="nav-wordmark">Van Dyke <span>Acquisitions</span></div>
        <div className="nav-sub">CPG Family Office · Control Investor · Est. 2014</div>
      </div>
      <div className="nav-links">
        {["manifesto", "mandate", "platform", "portfolio", "team"].map((id) => (
          <button key={id} className="nav-link" onClick={() => scrollTo(id)}>
            {id === "manifesto" ? "Philosophy" : id === "mandate" ? "Mandate" : id.charAt(0).toUpperCase() + id.slice(1)}
          </button>
        ))}
      </div>
      <button className="nav-cta" onClick={() => scrollTo("contact")}>Introduce a Situation</button>
    </nav>
  );
}

/* ════════════════════════════════════════════════════
   HERO
════════════════════════════════════════════════════ */
function Hero({ onModalOpen }) {
  return (
    <div className="hero">
      <div className="hero-tex" />
      <div className="hero-vline" style={{ left: "25%" }} />
      <div className="hero-vline" style={{ left: "50%" }} />
      <div className="hero-vline" style={{ left: "75%" }} />
      <div className="hero-content">
        <div className="hero-kicker">
          <div className="hero-pill">Control Investor</div>
          <div className="hero-sep" />
          <div className="hero-est">Established 2014 · CPG Exclusive</div>
        </div>
        <h1>
          We don't advise.<br />We don't observe.
          <span className="accent">We own. We operate.</span>
          <span className="sub-h">
            Van Dyke Acquisitions is a family office deploying permanent capital in control
            positions across the consumer packaged goods industry — with the operating platform,
            sector depth, and decision authority to transform companies that others won't touch
            and accelerate those that deserve better ownership.
          </span>
        </h1>
        <div className="hero-rule" />
        <p className="hero-body">
          In 10 years and <strong>20+ control acquisitions</strong>, we have operated CPG businesses
          from <strong>under $5M to over $300M</strong> in annual revenue. We have built brands from
          the factory floor, restructured P&Ls from the operating chair, and created exits that
          institutional capital couldn't engineer.{" "}
          <strong>No fund cycle. No LP pressure. One principal. Full accountability.</strong>
        </p>
        <div className="hero-btns">
          <button className="btn-gold" onClick={() => scrollTo("contact")}>Introduce a Situation</button>
          <button className="btn-outline" onClick={onModalOpen}>Request Portfolio Access</button>
        </div>
      </div>
      <div className="proof-bar">
        {[
          ["20+", "Control Acquisitions"],
          ["10+", "Years of Operation"],
          ["$300M", "Largest Co. Managed"],
          ["CPG", "Exclusive Category"],
          ["∞", "Holding Period"],
        ].map(([n, l]) => (
          <div key={l} className="pb-item">
            <div className="pb-n">{n}</div>
            <div className="pb-l">{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   CONVICTION BAND
════════════════════════════════════════════════════ */
function ConvictionBand() {
  const items = [
    ["Investment Type", "Control Acquisitions Only"],
    ["Category Focus", "Consumer Packaged Goods"],
    ["Capital Structure", "Permanent Family Office Capital"],
    ["Mandate", "Distressed & Growth-Stage"],
    ["Operating Arm", "VDA Operating Group · PVG Capital"],
  ];
  return (
    <div className="conv-band">
      <div className="conv-inner">
        {items.map(([cap, val]) => (
          <div key={cap} className="cb-item">
            <div className="cb-cap">{cap}</div>
            <div className="cb-val">{val}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   PHILOSOPHY / MANIFESTO
════════════════════════════════════════════════════ */
function Manifesto() {
  return (
    <section className="manifesto" id="manifesto">
      <div className="s-in">
        <div className="mfst-grid rv">
          <div>
            <div className="eyebrow">Our Conviction</div>
            <div className="s-h">More than a capital provider.</div>
            <div className="mfst-pull">
              "The firms that will define the next decade of CPG value creation are those with
              operating capabilities embedded at the ownership level — not just at the board level."
            </div>
            <div className="mfst-badge-row">
              {["Distressed M&A", "Turnaround", "Growth Acceleration", "Operational Control", "Brand Building", "Specialty Lending"].map((b) => (
                <span key={b} className="mfst-badge">{b}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="mfst-body">
              Van Dyke Acquisitions was not built to deploy capital and observe. It was built by
              operators — people who have run factories, restructured supply chains, rebuilt
              distribution networks, and navigated the complexity of consumer brands in distress
              and in growth. <strong>That is our edge. It compounds with every acquisition we make.</strong>
              <br /><br />
              We were founded in 2014 — originally as Golden Tiger Holdings — with a core beverage
              manufacturing business that at peak produced 8,000 cans per minute. The experience of
              building, scaling, and ultimately exiting that business gave us something no investment
              committee can manufacture:{" "}
              <strong>the credibility of having operated at scale in consumer goods</strong> before
              deploying a dollar of acquisition capital.
              <br /><br />
              Today, we bring that operating DNA to every situation we enter — whether a brand facing
              creditor pressure and needing immediate operational stabilization, or a founder-led
              business that has outgrown its current ownership structure and needs a partner who will
              act with speed and conviction.
            </p>
            <div className="vc-pillars">
              {[
                ["01 — Capital", "Permanent. No Expiry.", "Family office structure means we hold on our timeline, not a fund's calendar. Zero LP pressure."],
                ["02 — Control", "Majority or Full. Non-Negotiable.", "We take controlling stakes. The ability to act decisively is prerequisite, not preference."],
                ["03 — Operators", "We've Run These Businesses.", "Our team has held P&L ownership in CPG — manufacturing, brand, and distribution alike."],
                ["04 — Category", "CPG Only. Always.", "Exclusive sector focus drives insights, relationships, and pattern recognition that generalists lack."],
              ].map(([ico, t, d]) => (
                <div key={ico} className="vcp">
                  <div className="vcp-ico">{ico}</div>
                  <div className="vcp-t">{t}</div>
                  <div className="vcp-d">{d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════
   DUAL MANDATE
════════════════════════════════════════════════════ */
function DualMandate() {
  return (
    <section className="dual" id="mandate">
      <div className="s-in">
        <div className="dual-intro rv">
          <div className="eyebrow light">Investment Mandate</div>
          <div className="s-h" style={{ color: "var(--cream)" }}>Two types of situation.<br />One standard of rigor.</div>
          <p className="dual-intro-body">
            We have expanded beyond our original distressed mandate — not because we have softened
            our standards, but because the operating intensity we apply to turnarounds creates a
            genuine competitive advantage in healthy growth situations as well. Our diligence is
            the same. Our involvement is the same. Our accountability is the same.
          </p>
        </div>
        <div className="dual-grid rv">
          {/* Distressed */}
          <div className="dcard">
            <div className="dcard-bar" style={{ background: "linear-gradient(90deg,#7a1f1f,#c03535)" }} />
            <div className="dcard-label r">
              <span className="dcard-dot" style={{ background: "#c03535" }} />
              Distressed Acquisitions
            </div>
            <div className="dcard-h">When complexity creates opportunity.</div>
            <p className="dcard-p">
              Our founding mandate. We are among the few buyers in the consumer space with the
              operational infrastructure to pursue genuinely distressed CPG situations — not just
              financially stressed, but operationally broken. We move where institutional capital
              cannot, and we stabilize what others decline.
            </p>
            <ul className="dcard-sigs">
              {[
                "Brands under creditor pressure, covenant breach, or bank workout",
                "Post-bankruptcy assets and pre-insolvency acquisitions",
                "Receivership and trustee-directed sale processes",
                "Founder-led businesses with operational dysfunction",
                "Distressed debt positions convertible to equity control",
                "Special situations via PVG Capital, our credit affiliate",
              ].map((s) => <li key={s}>{s}</li>)}
            </ul>
            <div className="dcard-ft">10+ years of distressed CPG acquisition and turnaround track record</div>
          </div>
          {/* Growth */}
          <div className="dcard">
            <div className="dcard-bar" style={{ background: "linear-gradient(90deg,#1e5c30,#3d9c5a)" }} />
            <div className="dcard-label g">
              <span className="dcard-dot" style={{ background: "#3d9c5a" }} />
              Growth-Stage Acquisitions
            </div>
            <div className="dcard-h">When a brand deserves better ownership.</div>
            <p className="dcard-p">
              Our expanded mandate. Healthy CPG brands with real consumer pull but misaligned
              ownership, capital constraints, or growth plateaus are now equally compelling. We
              apply turnaround-caliber diligence and operational depth to acceleration — not just
              recovery. The result: a faster path to the brand's potential than any financial buyer
              can offer.
            </p>
            <ul className="dcard-sigs">
              {[
                "CPG brands with $2M–$50M revenue seeking a decisive control partner",
                "Founder transitions, succession situations, and majority exits",
                "PE-backed assets requiring a longer-horizon permanent owner",
                "Brands with channel gaps, distribution underperformance, or DTC-to-retail pivots",
                "Roll-up targets within our active CPG portfolio verticals",
              ].map((s) => <li key={s}>{s}</li>)}
            </ul>
            <div className="dcard-ft">Now actively acquiring healthy, growth-stage CPG companies</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════
   OPERATING PLATFORM
════════════════════════════════════════════════════ */
function Platform() {
  const caps = [
    ["Capability 01", "Portfolio Operations & Lean", "Factory-floor operational rigor applied to cost structure, throughput, and margin improvement across portfolio companies."],
    ["Capability 02", "Brand & Revenue Growth", "Channel strategy, DTC acceleration, retail distribution build-out, and performance marketing across the CPG stack."],
    ["Capability 03", "Innovation & Product", "Science-led formulation strategy, SKU rationalization, and category whitespace identification within CPG verticals."],
    ["Capability 04", "Technology & Systems", "ERP, data infrastructure, e-commerce platforms, and AI-assisted operational tooling deployed at the portfolio level."],
    ["Capability 05", "Specialty Lending (PVG Capital)", "Distressed debt, bridge financing, and transitional credit solutions for CPG companies in liquidity-constrained situations."],
    ["Capability 06", "Turnaround Consulting (SMB)", "Structured turnaround methodology available to portfolio companies and select third-party engagements."],
  ];
  return (
    <section className="platform" id="platform">
      <div className="s-in">
        <div className="eyebrow rv">Operating Platform</div>
        <div className="s-h rv">The VDA Operating Group.</div>
        <div className="plat-grid rv">
          <div>
            <div className="plat-name">
              <span>Proprietary Capability</span>
              The operating infrastructure behind every acquisition.
            </div>
            <p className="plat-desc">
              Unlike financial buyers who depend on incumbent management, VDA's Operating Group is a
              dedicated, cross-functional team deployed into portfolio companies from day one. We do
              not advise from the outside — we hold operating authority from the inside. This is the
              structural advantage that enables us to pursue situations that financial capital alone
              cannot resolve.
            </p>
            <div className="plat-stats">
              {[
                ["8", "Operating Disciplines Represented on Team"],
                ["PVG", "Capital — Specialty Lending Affiliate"],
                ["SMB", "Turnaround — Consulting Arm"],
              ].map(([n, l]) => (
                <div key={l} className="plat-stat">
                  <div className="plat-stat-n">{n}</div>
                  <div className="plat-stat-l">{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="plat-caps">
              {caps.map(([n, t, d]) => (
                <div key={n} className="pcap">
                  <div className="pcap-n">{n}</div>
                  <div className="pcap-t">{t}</div>
                  <div className="pcap-d">{d}</div>
                </div>
              ))}
            </div>
            <div className="playbook-bar">
              <div className="playbook-bar-icon">VDA Playbook</div>
              <div className="playbook-bar-text">
                We enter every acquisition with a{" "}
                <strong>proprietary CPG value creation playbook</strong> — built from a decade of
                operating experience across distressed turnarounds, brand acceleration, and
                manufacturing optimization. No two situations are identical; the playbook is
                calibrated, not templated.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════
   TRACK RECORD
════════════════════════════════════════════════════ */
function TrackRecord({ onModalOpen }) {
  const cards = [
    {
      type: "d", typeLabel: "Distressed — Turnaround",
      rev: "$50M–$150M", cat: "Beverage Manufacturing · CPG Infrastructure",
      desc: "Complete operational turnaround of a high-volume contract beverage manufacturer. At peak: 8,000 cans/minute. Full restructuring of cost base, management team, and customer portfolio prior to successful exit.",
      result: "Successfully Exited · Value Created at Exit",
    },
    {
      type: "d", typeLabel: "Distressed — Restructuring",
      rev: "$20M–$80M", cat: "Consumer Goods · Distribution & Fulfillment",
      desc: "Acquired a CPG distribution platform in operational distress. Restructured logistics infrastructure, renegotiated supplier contracts, and rebuilt the commercial organization. National distribution restored within 18 months.",
      result: "Successfully Stabilized & Grown",
    },
    {
      type: "h", typeLabel: "Growth-Stage — Acceleration",
      rev: "$5M–$25M", cat: "Functional Nutrition · Supplements",
      desc: "Control acquisition of an emerging supplements brand with strong DTC traction but constrained retail penetration. Deployed VDA Operating Group to build retail distribution, optimize formulation costs, and build subscription revenue.",
      result: "Revenue Tripled in 24 Months",
    },
    {
      type: "d", typeLabel: "Distressed — Special Situation",
      rev: "$100M–$300M", cat: "Consumer Manufacturing · Multi-Segment",
      desc: "PVG Capital provided bridge lending to a CPG manufacturer entering a covenant breach scenario. Converted to equity control. Full operational restructuring executed with VDA Operating Group embedded in management.",
      result: "Stabilized · Strategic Exit Achieved",
    },
    {
      type: "e", typeLabel: "View More", clickable: true,
      rev: "16+ Additional", cat: "Confidential Portfolio",
      desc: "Complete deal history including transaction structure, entry thesis, operating interventions, and exit outcomes shared exclusively with verified counterparties.",
      result: "→ Request Portfolio Access",
    },
    {
      type: "h", typeLabel: "Growth-Stage — Roll-Up",
      rev: "$2M–$15M", cat: "Wellness & Personal Care · Multi-Brand",
      desc: "Platform acquisition of multiple adjacently positioned CPG wellness brands. Consolidated operations under VDA infrastructure. Unified DTC strategy and shared fulfillment to accelerate margin expansion.",
      result: "Active — Platform Expanding",
    },
  ];
  return (
    <section className="track" id="track">
      <div className="s-in">
        <div className="rv">
          <div className="eyebrow light">Track Record</div>
          <div className="s-h" style={{ color: "var(--cream)" }}>20+ control acquisitions.<br />Proven across the full CPG spectrum.</div>
          <p className="s-sub" style={{ color: "rgba(244,239,228,.4)" }}>
            Representative situations from a 10-year operating history. Full portfolio details
            available to qualified counterparties upon verified request.
          </p>
        </div>
        <div className="tr-grid rv">
          {cards.map((c, i) => (
            <div key={i} className={`tcard${c.clickable ? " clickable" : ""}`} onClick={c.clickable ? onModalOpen : undefined}>
              <div className="tc-type">
                <span className={`tc-dot ${c.type}`} />
                <span className="tc-type-label">{c.typeLabel}</span>
              </div>
              <div className="tc-rev" style={c.clickable ? { fontSize: "18px", color: "rgba(244,239,228,.35)" } : {}}>{c.rev}</div>
              <div className="tc-cat" style={c.clickable ? { color: "rgba(244,239,228,.35)" } : {}}>{c.cat}</div>
              <p className="tc-desc">{c.desc}</p>
              <div className="tc-result" style={c.clickable ? { color: "var(--gold2)", cursor: "pointer" } : {}}>{c.result}</div>
            </div>
          ))}
        </div>
        <p className="track-note">All deal descriptions anonymized. Revenue ranges approximate. Full details available to qualified counterparties under NDA.</p>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════
   CONTROL CONVICTION
════════════════════════════════════════════════════ */
function ControlConviction() {
  return (
    <section className="ctrl" id="ctrl">
      <div className="s-in">
        <div className="rv">
          <div className="eyebrow">Why Control</div>
          <div className="s-h">Control is not a structure.<br />It is a standard of accountability.</div>
          <p className="s-sub">
            We take majority or full-control positions in every acquisition. It is the only structure
            that allows us to move with the speed and conviction that distressed and growth situations require.
          </p>
        </div>
        <div className="ctrl-grid rv">
          <div>
            <p className="ctrl-body">
              Institutional buyers and minority co-investors face structural limitations that slow
              value creation: committee approvals, LP sensitivities, and management team
              dependencies. As a family office with full operating capability and no fund clock, we
              face none of these constraints.
              <br /><br />
              When we acquire a business, we deploy the VDA Operating Group into the asset within
              weeks. We hold operating authority, not just board seats. We make decisions at the
              speed the business requires — not at the speed a committee permits.
            </p>
            <div className="ctrl-stats">
              {[
                ["20+", "Control Positions Held"],
                ["0", "Minority Stakes Ever Taken"],
                ["∞", "Fund Expiry Date"],
              ].map(([n, l]) => (
                <div key={l} className="ctrl-stat">
                  <div className="ctrl-stat-n">{n}</div>
                  <div className="ctrl-stat-l">{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="ctrl-box">
            <div className="ctrl-box-title">"What ownership looks like at Van Dyke"</div>
            <ul className="ctrl-list">
              {[
                ["I.", "Board control and operating authority exercised from the day of close — not delegated to incumbent management by default"],
                ["II.", "VDA Operating Group deployed on-site within 30 days of acquisition for every situation requiring stabilization"],
                ["III.", "Executive placement authority — including CEO, COO, and CFO — exercised when a situation requires leadership change"],
                ["IV.", "Direct access to captive manufacturing infrastructure, fulfillment network, and marketplace management capabilities"],
                ["V.", "Specialty lending via PVG Capital for bridge situations, working capital, and transitional credit within the portfolio"],
                ["VI.", "Exit on our timeline — strategic, financial, or continuation — with no fund clock forcing a suboptimal outcome"],
              ].map(([n, t]) => (
                <li key={n}>
                  <span className="ctrl-list-n">{n}</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════
   PORTFOLIO
════════════════════════════════════════════════════ */
function Portfolio({ onModalOpen }) {
  const open = [
    { cat: "Functional Nutrition · Weight Management", name: "APEX Weight", type: "h", status: "Growth-Stage · Active", desc: "GLP-1 companion stack platform. Addresses metabolic health, appetite regulation, and body composition for the post-GLP-1 consumer segment." },
    { cat: "Longevity · Cellular Health", name: "VIVA Longevity", type: "h", status: "Growth-Stage · Active", desc: "Science-backed longevity formulation platform anchored in NMN, NAD+ precursors, and mitochondrial health science." },
    { cat: "Microbiome · Gut-Brain Axis", name: "FLORA Pro", type: "h", status: "Growth-Stage · Active", desc: "Precision probiotic and prebiotic platform positioned at the intersection of clinical gut health science and clean-label CPG." },
  ];
  const locked = [
    { cat: "Beverage Manufacturing", name: "Flagship Exit", type: "e", status: "Exited · 8,000 cans/min peak", desc: "Core founding asset. Turnaround and exit. Full case study available to verified counterparties." },
    { cat: "Consumer Goods · Distressed", name: "Portfolio Co. B", type: "d", status: "Distressed Acquisition", desc: "Turnaround. $50M–$150M revenue range. Full P&L restructuring executed under VDA Operating Group control." },
    { cat: "Multi-Brand Platform · CPG", name: "Portfolio Co. C", type: "h", status: "Growth Roll-Up · Active", desc: "Wellness and personal care roll-up. Multiple brands consolidated under VDA infrastructure. Margin expansion ongoing." },
  ];
  return (
    <section className="portfolio" id="portfolio">
      <div className="s-in">
        <div className="port-header rv">
          <div>
            <div className="eyebrow">Portfolio</div>
            <div className="s-h">Current Holdings</div>
          </div>
          <div className="port-access">Full profiles require verified access</div>
        </div>
        <div className="port-grid rv">
          {open.map((p) => (
            <div key={p.name} className="pc">
              <div className="pc-body">
                <div className="pc-cat">{p.cat}</div>
                <div className="pc-name">{p.name}</div>
                <div className="pc-status"><span className={`pdot ${p.type}`} />{p.status}</div>
                <p className="pc-desc">{p.desc}</p>
              </div>
            </div>
          ))}
          {locked.map((p) => (
            <div key={p.name} className="pc locked" onClick={onModalOpen}>
              <div className="lock-overlay">
                <div className="lock-icon">🔒</div>
                <div className="lock-lbl">Confidential Holding</div>
                <button className="lock-btn">Request Access</button>
              </div>
              <div className="pc-body">
                <div className="pc-cat">{p.cat}</div>
                <div className="pc-name">{p.name}</div>
                <div className="pc-status"><span className={`pdot ${p.type}`} />{p.status}</div>
                <p className="pc-desc">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="port-cta-row rv">
          <button className="btn-outline-dark" onClick={onModalOpen}>Request Full Portfolio Access →</button>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════
   WHY VDA
════════════════════════════════════════════════════ */
function WhyVDA() {
  const cards = [
    ["I", "We move without committees", "Single family principal. No LP approval. No investment committee. When we decide, we act — at the speed your situation requires."],
    ["II", "We have operated what we acquire", "We have held P&L ownership in CPG businesses. We understand manufacturing margins, retail dynamics, and DTC economics from the operator's chair — not the board room."],
    ["III", "We solve situations others decline", "Creditor entanglements, broken management teams, operational dysfunction — these are not disqualifiers for us. They are the scenarios our platform was built for."],
    ["IV", "We own outcomes, not just positions", "Control positions mean full accountability. We don't manage from a distance. We are in the building, holding the operating lever, for as long as it takes to create the value the business deserves."],
  ];
  return (
    <section className="why" id="why">
      <div className="s-in">
        <div className="rv">
          <div className="eyebrow light">Why Van Dyke</div>
          <div className="s-h" style={{ color: "var(--cream)" }}>The four reasons serious counterparties<br />call us before anyone else.</div>
        </div>
        <div className="why-grid rv">
          {cards.map(([n, t, d]) => (
            <div key={n} className="wcard">
              <div className="wc-n">{n}</div>
              <div className="wc-t">{t}</div>
              <div className="wc-d">{d}</div>
            </div>
          ))}
        </div>
        <div className="why-bottom rv">
          <div className="why-bottom-text">
            "If you are representing a CPG situation — distressed or healthy — and you need a buyer
            who can move with conviction, operate without hesitation, and hold without a deadline:{" "}
            <em>that is precisely what we were built for.</em>"
          </div>
          <button className="why-cta" onClick={() => scrollTo("contact")}>Start a Conversation →</button>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════
   TEAM
════════════════════════════════════════════════════ */
function Team() {
  const members = [
    { init: "JB", name: "John Brady", role: "Executive Chairman", badge: "Principal" },
    { init: "DB", name: "David Bates", role: "President & CFO", badge: "Finance" },
    { init: "PM", name: "Paul Massingale", role: "Chief Operating Officer", badge: "Operations" },
    { init: "SJ", name: "Steve Jorgensen", role: "SVP, Portfolio Operations", badge: "Portfolio" },
    { init: "MM", name: "Michael Maldonado", role: "SVP, Innovation", badge: "Innovation" },
    { init: "SG", name: "Sara Green", role: "SVP, Family & Foundation", badge: "Family Office" },
    { init: "JC", name: "Jason Collyer", role: "VP, IT & Development", badge: "Technology" },
    { init: "JK", name: "Josh Kirkman", role: "VP, Group Revenue", badge: "Revenue" },
  ];
  return (
    <section className="team" id="team">
      <div className="s-in">
        <div className="rv">
          <div className="eyebrow">Leadership</div>
          <div className="s-h">The operators behind the office.</div>
          <p className="s-sub">
            A senior team spanning acquisitions, operations, technology, revenue, and portfolio
            management — unified by a decade of shared experience in consumer goods.
          </p>
        </div>
        <div className="team-grid rv">
          {/* Founder card */}
          <div className="tmc founder">
            <div className="founder-init">PG</div>
            <div>
              <div className="founder-name">Peter Griscom</div>
              <div className="founder-role">Founder</div>
              <div className="founder-note">Founded Van Dyke Acquisitions in 2014</div>
            </div>
          </div>
          {members.map((m) => (
            <div key={m.name} className="tmc">
              <div className="tmc-init">{m.init}</div>
              <div className="tmc-name">{m.name}</div>
              <div className="tmc-role">{m.role}</div>
              <span className="tmc-badge">{m.badge}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════
   CONTACT
════════════════════════════════════════════════════ */
function Contact() {
  const reasons = [
    ["I.", <><strong>Founders</strong> considering a majority exit or ownership transition in a CPG brand — distressed or growth-stage</>],
    ["II.", <><strong>Creditors, bankers, and trustees</strong> representing a CPG situation requiring a decisive buyer with operating capability</>],
    ["III.", <><strong>PE firms and family offices</strong> seeking a permanent home for a CPG asset — where a longer horizon creates superior outcomes</>],
    ["IV.", <><strong>M&A advisors and intermediaries</strong> running a process in the CPG or supplement space with a control buyer mandate</>],
    ["V.", <><strong>Management teams</strong> operating within a dysfunctional ownership structure who believe new ownership would unlock significant value</>],
  ];
  return (
    <section className="contact" id="contact">
      <div className="s-in">
        <div className="contact-grid">
          <div className="rv">
            <div className="eyebrow light">Introductions</div>
            <div className="s-h" style={{ color: "var(--cream)" }}>Tell us about your situation.</div>
            <p style={{ fontSize: 14, color: "rgba(244,239,228,.42)", marginTop: 14, lineHeight: 1.9, fontWeight: 300, maxWidth: 440 }}>
              We review every submission personally. If your CPG brand — distressed or healthy — is
              looking for a serious control investor with proven operating depth, we want to hear from
              you. We respond to every credible inquiry within one business day.
            </p>
            <ul className="contact-reasons">
              {reasons.map(([icon, text]) => (
                <li key={icon} className="cr-item">
                  <span className="cr-icon">{icon}</span>
                  <span className="cr-text">{text}</span>
                </li>
              ))}
            </ul>
            <a className="contact-book-link" href="https://calendar.app.google/fgvDmdZvmQoub1297" target="_blank" rel="noreferrer">
              → Book an Executive Meeting Directly
            </a>
          </div>
          <div className="rv">
            <div className="cf">
              <div className="cf-row">
                <div className="cf-field"><label className="cf-label">Full Name</label><input className="cf-input" placeholder="Your name" type="text" /></div>
                <div className="cf-field"><label className="cf-label">Company / Brand</label><input className="cf-input" placeholder="Organization name" type="text" /></div>
              </div>
              <div className="cf-row">
                <div className="cf-field"><label className="cf-label">Email Address</label><input className="cf-input" placeholder="Business email" type="email" /></div>
                <div className="cf-field"><label className="cf-label">Annual Revenue</label><input className="cf-input" placeholder="Approximate" type="text" /></div>
              </div>
              <div className="cf-field">
                <label className="cf-label">Situation Type</label>
                <select className="cf-input" defaultValue="">
                  <option value="" disabled>Select the best description</option>
                  <option>Distressed / Turnaround — Seeking a Control Buyer</option>
                  <option>Healthy Growth Brand — Majority Exit or Partnership</option>
                  <option>Founder Succession / Transition</option>
                  <option>Creditor / Banker / Trustee — Representing a Distressed Asset</option>
                  <option>PE / Family Office — Seeking a Permanent Home for a CPG Asset</option>
                  <option>M&A Advisor / Intermediary — Running a Control Sale Process</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="cf-field"><label className="cf-label">CPG Category</label><input className="cf-input" placeholder="e.g. Supplements, Beverage, Personal Care, Pet..." type="text" /></div>
              <div className="cf-field">
                <label className="cf-label">Overview</label>
                <textarea className="cf-input cf-textarea" placeholder="Brief description of your company and what you are looking for. The more specific, the faster we can respond." />
              </div>
              <button className="cf-submit">Submit to Van Dyke Acquisitions</button>
              <p className="cf-alt">Prefer a direct conversation?{" "}<a href="https://calendar.app.google/fgvDmdZvmQoub1297" target="_blank" rel="noreferrer">Book an executive meeting →</a></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════
   FOOTER
════════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand">Van Dyke <span>Acquisitions</span> · CPG Family Office</div>
      <div className="footer-links">
        <a href="#">Privacy</a>
        <a href="https://www.smbdistress.com" target="_blank" rel="noreferrer">SMB Turnaround</a>
        <a href="#">Disclosures</a>
        <a href="https://vdacq.com" target="_blank" rel="noreferrer">vdacq.com</a>
      </div>
      <div className="footer-copy">© 2014–2026 Van Dyke Acquisitions. All Rights Reserved.</div>
    </footer>
  );
}

/* ════════════════════════════════════════════════════
   APP
════════════════════════════════════════════════════ */
export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  useReveal();

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <>
      {modalOpen && <Modal onClose={() => setModalOpen(false)} />}
      <Nav onModalOpen={() => setModalOpen(true)} />
      <Hero onModalOpen={() => setModalOpen(true)} />
      <ConvictionBand />
      <Manifesto />
      <DualMandate />
      <Platform />
      <TrackRecord onModalOpen={() => setModalOpen(true)} />
      <ControlConviction />
      <Portfolio onModalOpen={() => setModalOpen(true)} />
      <WhyVDA />
      <Team />
      <Contact />
      <Footer />
    </>
  );
}
