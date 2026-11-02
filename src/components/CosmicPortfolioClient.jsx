'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import animePkg from 'animejs';
import { TESSERACT_ROOMS, EXPERIENCE_ROLES } from '../data/portfolioData';

const COSMIC_MARKUP = '<!-- =====================================================================\n       TRIPLE-LAYER COMPOSITE ENGINE:\n       1. #cosmic-webgl (z-0): True 3D Three.js Universe (3D Planets, Earth, Galaxy)\n       2. #cosmic-stage (z-1): 4D Tesseract Corridor, Comet, & Star Trails\n       3. #bh-portal-canvas (z-2): Photorealistic Gargantua Black Hole Portal Shader\n          (When zooming in, the black Event Horizon center fades to transparent\n           so the next visual shines directly through the core of the black hole!)\n       ===================================================================== -->\n  <canvas id="cosmic-webgl" class="fixed inset-0 w-full h-full z-0 pointer-events-none"></canvas>\n  <canvas id="cosmic-stage" class="fixed inset-0 w-full h-full z-[1] pointer-events-none"></canvas>\n  <canvas id="bh-portal-canvas" class="fixed inset-0 w-full h-full z-[2] pointer-events-none"></canvas>\n\n  <!-- =====================================================================\n       LAYER 30: SUPERNOVA PRELOADER (000 - 100)\n       ===================================================================== -->\n  <div id="preloader-overlay" class="fixed inset-0 z-40 flex flex-col justify-between p-8 md:p-14 bg-transparent pointer-events-auto">\n    <div class="flex items-center justify-between">\n      <div class="font-mono-tech text-[10px] tracking-[0.24em] text-amber-200/60 uppercase flex items-center gap-2">\n        <span class="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>\n        <span>3D ORBITAL ENGINE // INITIALIZING DAFIAN COSMOS</span>\n      </div>\n      <button id="btn-skip-preloader" type="button" class="hud-module px-3.5 py-1.5 rounded-full font-mono-tech text-[10px] tracking-[0.2em] uppercase text-white/70 hover:text-white hover:border-amber-300/50 transition">\n        Skip Intro ↗\n      </button>\n    </div>\n\n    <div class="w-full">\n      <div id="preloader-counter" class="font-mono-tech font-light text-[76px] sm:text-[120px] md:text-[156px] leading-[0.88] tracking-[-0.04em] text-white/95">\n        000\n      </div>\n      <div class="w-full h-[2px] bg-white/10 my-4 relative overflow-hidden rounded-full">\n        <div id="preloader-bar" class="h-full bg-gradient-to-r from-amber-400 via-white to-cyan-400 w-0"></div>\n      </div>\n      <div class="flex items-center justify-between font-mono-tech text-[10px] tracking-[0.22em] text-white/50 uppercase">\n        <span id="preloader-status" class="font-goozeman tracking-wider text-xs text-amber-200/90">IGNITING SINGULARITY</span>\n        <span id="preloader-coords">RA 17h 45m 40.04s · EVENT HORIZON PORTAL READY</span>\n      </div>\n    </div>\n  </div>\n\n  <!-- =====================================================================\n       LAYER 25: HYPERSPACE WARP OVERLAY (CONTACT -> HERO ORIGIN LOOP)\n       ===================================================================== -->\n  <div id="warp-overlay" class="fixed inset-0 z-30 pointer-events-none opacity-0 flex flex-col justify-between p-8 md:p-12 transition-opacity duration-300">\n    <div class="flex justify-end">\n      <button id="btn-skip-warp" type="button" class="pointer-events-auto hud-module px-4 py-1.5 rounded-full font-mono-tech text-[11px] tracking-widest text-white/85 hover:text-white hover:border-amber-400/60 transition flex items-center gap-2">\n        <span>Skip</span>\n        <span class="px-1.5 py-0.5 text-[9px] bg-white/10 rounded">ESC</span>\n      </button>\n    </div>\n    <div class="flex items-center justify-between font-mono-tech text-[10px] tracking-[0.22em] text-cyan-200/80 uppercase">\n      <span class="font-goozeman text-xs tracking-wider">TRANSIT — RETURNING TO ORIGIN</span>\n      <span id="warp-velocity-readout">99.998% c</span>\n    </div>\n  </div>\n\n  <!-- =====================================================================\n       LAYER 20: SCI-FI TELEMETRY HUD NAVBAR & FOOTER\n       ===================================================================== -->\n  <header id="hud-header" class="fixed top-0 left-0 right-0 z-20 px-5 sm:px-10 py-5 flex items-center justify-between pointer-events-none opacity-0">\n    <div class="flex items-center gap-3 pointer-events-auto">\n      <button id="btn-brand-origin" type="button" class="hud-module px-3.5 py-1.5 rounded-full flex items-center gap-2.5 text-left group hover:border-amber-300/50 transition">\n        <svg class="w-4 h-4 text-amber-300 group-hover:rotate-90 transition-transform duration-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">\n          <path d="M12 2L22 12L12 22L2 12L12 2Z" />\n          <circle cx="12" cy="12" r="3" fill="currentColor" />\n        </svg>\n        <span class="font-goozeman text-sm sm:text-base text-white tracking-wider">DAFIAN</span>\n      </button>\n      <span class="font-mono-tech text-[10px] tracking-[0.2em] text-white/45 hidden sm:inline">PORTFOLIO \'26</span>\n      <span id="hud-sector-badge" class="hidden xl:inline-flex items-center gap-2 ml-2 px-3 py-1 rounded-full hud-module font-mono-tech text-[10px] tracking-[0.16em] text-amber-200/85">\n        <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>\n        <span id="hud-sector-text">LOC. 00 · GARGANTUA SINGULARITY</span>\n      </span>\n    </div>\n\n    <nav class="pointer-events-auto hud-module px-2.5 sm:px-4 py-1.5 rounded-full flex items-center gap-1 sm:gap-3">\n      <button type="button" data-nav-scroll="0.22" class="nav-item font-mono-tech text-[11px] sm:text-xs text-white/65 hover:text-white flex items-baseline gap-1.5">\n        <span class="nav-index text-[9px] text-amber-300/70">01</span>\n        <span class="font-goozeman tracking-wider">Works</span>\n      </button>\n      <button type="button" data-nav-scroll="0.58" class="nav-item font-mono-tech text-[11px] sm:text-xs text-white/65 hover:text-white flex items-baseline gap-1.5">\n        <span class="nav-index text-[9px] text-amber-300/70">02</span>\n        <span class="font-goozeman tracking-wider">About</span>\n      </button>\n      <button type="button" data-nav-scroll="0.76" class="nav-item font-mono-tech text-[11px] sm:text-xs text-white/65 hover:text-white flex items-baseline gap-1.5">\n        <span class="nav-index text-[9px] text-amber-300/70">03</span>\n        <span class="font-goozeman tracking-wider">Experience</span>\n      </button>\n      <button type="button" data-nav-scroll="0.93" class="nav-item font-mono-tech text-[11px] sm:text-xs text-white/65 hover:text-white flex items-baseline gap-1.5">\n        <span class="nav-index text-[9px] text-amber-300/70">04</span>\n        <span class="font-goozeman tracking-wider">Contact</span>\n      </button>\n    </nav>\n\n    <div class="flex items-center gap-2.5 pointer-events-auto">\n      <button id="btn-cosmic-map" type="button" class="hidden md:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full hud-module font-mono-tech text-[11px] tracking-[0.12em] text-white/75 hover:text-amber-300 hover:border-amber-300/50 transition" title="Peta Navigasi Planet 3D">\n        <span class="sr-only">🪐</span>\n        <span class="w-2 h-2 rounded-full border border-cyan-400"></span>\n        <span class="font-goozeman tracking-wider">Galaxy Map</span>\n      </button>\n      <button id="btn-sound-toggle" type="button" class="flex items-center gap-2 px-3.5 py-1.5 rounded-full hud-module font-mono-tech text-[11px] tracking-[0.12em] text-white/80 hover:text-white hover:border-amber-300/50 transition">\n        <div class="flex items-end gap-[2px] h-3 w-3.5">\n          <span class="eq-bar-1 w-[1.5px] h-1 bg-amber-300 transition-all"></span>\n          <span class="eq-bar-2 w-[1.5px] h-2 bg-amber-300 transition-all"></span>\n          <span class="eq-bar-3 w-[1.5px] h-1.5 bg-amber-300 transition-all"></span>\n          <span class="eq-bar-4 w-[1.5px] h-2.5 bg-amber-300 transition-all"></span>\n        </div>\n        <span id="sound-label" class="font-goozeman tracking-wider">Sound</span>\n      </button>\n    </div>\n  </header>\n\n  <footer id="hud-footer" class="fixed bottom-0 left-0 right-0 z-20 px-6 sm:px-12 py-4 flex items-center justify-between pointer-events-none opacity-0">\n    <div class="flex items-center gap-2.5 font-mono-tech text-[10px] sm:text-[11px] tracking-[0.12em] text-white/55">\n      <span class="text-amber-300">↓</span>\n      <span id="hud-scroll-prompt">Scroll to zoom into the Black Hole portal</span>\n    </div>\n\n    <div class="hidden md:flex items-center gap-3 pointer-events-auto hud-module px-3.5 py-1.5 rounded-full">\n      <div id="hud-progress-track" class="w-36 h-1 bg-white/15 cursor-pointer relative rounded-full overflow-hidden">\n        <div id="hud-progress-fill" class="h-full bg-gradient-to-r from-amber-400 via-white to-cyan-400 w-0"></div>\n      </div>\n      <span id="hud-progress-pct" class="font-mono-tech text-[10px] text-amber-200 w-8">00%</span>\n    </div>\n\n    <div class="font-mono-tech text-[10px] sm:text-[11px] tracking-[0.16em] text-white/45 uppercase">\n      <span id="hud-clock">10:48:25</span>\n      <span class="text-white/25 mx-1">UTC+7</span>\n      <span class="hidden sm:inline text-white/35">· INDONESIA</span>\n    </div>\n  </footer>\n\n  <!-- =====================================================================\n       SCENE 1: HERO — "GARGANTUA BLACK HOLE PORTAL & PLANETARY HORIZON" (0% - 16%)\n       ===================================================================== -->\n  <section id="scene-hero" class="scene-layer scene-active z-10 px-6 sm:px-12 md:px-16">\n    <!-- Sci-Fi Telemetry Callout pointing to Gargantua Black Hole -->\n    <div id="hero-bh-callout" class="hidden md:flex items-center gap-3 fixed top-[22%] right-[9%] pointer-events-none">\n      <div class="w-16 h-[1px] bg-gradient-to-r from-amber-300 to-transparent -rotate-[22deg] origin-left"></div>\n      <div class="cosmic-card px-4 py-2.5 text-left">\n        <div class="font-mono-tech text-[9px] tracking-[0.22em] text-amber-300/85 uppercase flex items-center gap-1.5">\n          <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>\n          <span>LOC. 00 // GARGANTUA SINGULARITY</span>\n        </div>\n        <div class="font-goozeman text-sm text-white tracking-wider mt-0.5">Event Horizon Portal</div>\n        <div class="font-mono-tech text-[10px] text-white/55">Zoom in to dissolve core into Tesseract</div>\n      </div>\n    </div>\n\n    <!-- Planetary Horizon Callout (Top Left) -->\n    <div id="hero-planet-callout" class="hidden lg:flex items-center gap-3 fixed top-[19%] left-[6%] pointer-events-none">\n      <div class="cosmic-card px-3.5 py-2 flex items-center gap-2.5">\n        <span class="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#38bdf8]"></span>\n        <div class="font-mono-tech text-[9px] tracking-[0.18em] text-white/75 uppercase">\n          <div>MILLER-PRIME &amp; KRONOS-IX</div>\n          <div class="text-cyan-300/75 text-[8px]">TIDAL HORIZON · RELATIVISTIC LENSING</div>\n        </div>\n      </div>\n    </div>\n\n    <!-- Monumental Hero Typography with Goozeman Font -->\n    <div class="mt-auto mb-14 sm:mb-20 max-w-4xl">\n      <h1 id="hero-title" class="font-goozeman text-[50px] sm:text-[82px] md:text-[106px] leading-[0.94] uppercase text-white mb-5 drop-shadow-[0_10px_35px_rgba(0,0,0,0.95)]">\n        <div class="overflow-hidden">\n          <span class="hero-char">M</span><span class="hero-char">U</span><span class="hero-char">H</span><span class="hero-char">A</span><span class="hero-char">M</span><span class="hero-char">M</span><span class="hero-char">A</span><span class="hero-char">D</span>\n        </div>\n        <div class="overflow-hidden text-amber-100">\n          <span class="hero-char">D</span><span class="hero-char">A</span><span class="hero-char">F</span><span class="hero-char">I</span><span class="hero-char">A</span><span class="hero-char">N</span>\n        </div>\n      </h1>\n\n      <p class="text-xs sm:text-sm md:text-[15px] text-white/75 max-w-md leading-[1.65] mb-7 font-normal drop-shadow-[0_4px_14px_rgba(0,0,0,0.9)]">\n        Building scalable web applications &amp; exploring<br />\n        the frontier of AI, Web3, and 3D Interactive Systems.\n      </p>\n\n      <div class="flex flex-wrap items-center gap-4 sm:gap-6">\n        <button id="btn-hero-contact" type="button" class="group bg-white text-black pl-5 pr-1.5 py-1.5 rounded-full font-medium text-xs sm:text-sm flex items-center gap-3.5 hover:bg-amber-100 transition shadow-[0_0_30px_rgba(229,184,105,0.3)]">\n          <span class="font-goozeman tracking-wider">Get in touch</span>\n          <span class="w-7 h-7 rounded-full bg-[#E59838] text-black flex items-center justify-center text-xs group-hover:translate-x-0.5 transition-transform">\n            ↗\n          </span>\n        </button>\n\n        <button type="button" data-open-modal="github" class="tech-module-chip px-4 py-2 text-xs sm:text-sm text-white/85 hover:text-white flex items-center gap-1.5">\n          <span class="font-goozeman tracking-wider">GitHub</span>\n          <span class="text-amber-300 text-xs">↗</span>\n        </button>\n\n        <button type="button" data-open-modal="telegram" class="tech-module-chip px-4 py-2 text-xs sm:text-sm text-white/85 hover:text-white flex items-center gap-1.5">\n          <span class="font-goozeman tracking-wider">Telegram</span>\n          <span class="text-amber-300 text-xs">↗</span>\n        </button>\n\n        <button id="btn-enter-singularity" type="button" class="tech-module-chip px-4 py-2 font-mono-tech text-[11px] tracking-wider text-amber-200/90 hover:text-white">\n          Enter Singularity ↓\n        </button>\n      </div>\n    </div>\n  </section>\n\n  <!-- =====================================================================\n       SCENE 2: 01 / WORKS — "INSIDE THE TESSERACT" (16% - 52%)\n       ===================================================================== -->\n  <section id="scene-works" class="scene-layer z-10 px-6 sm:px-12 md:px-16">\n    <!-- Sub-view A: INSIDE THE TESSERACT INTRO (16% - 22%) -->\n    <div id="tesseract-intro-card" class="cosmic-card p-6 sm:p-9 max-w-2xl mt-auto mb-24">\n      <div class="flex items-center justify-between font-mono-tech text-[10px] tracking-[0.24em] text-amber-300/85 uppercase mb-3">\n        <span>01 &nbsp; — &nbsp; SELECTED WORK // BEYOND THE BLACK HOLE CORE</span>\n        <span>SYS.TESSERACT</span>\n      </div>\n      <h2 class="font-goozeman text-4xl sm:text-6xl md:text-[70px] leading-[0.98] uppercase text-white mb-5">\n        INSIDE THE<br />TESSERACT\n      </h2>\n      <p class="text-xs sm:text-sm text-white/70 max-w-md leading-[1.68] mb-6">\n        Past the faded event horizon, time is a direction you can walk. Every project by <strong class="text-white">Dafian</strong> is a room in the 3D lattice, lit at the moment it was built.\n      </p>\n      <div class="grid grid-cols-3 gap-4 pt-4 border-t border-white/15 font-mono-tech">\n        <div class="tech-module-chip p-2.5">\n          <div class="text-[9px] tracking-[0.2em] text-amber-300/70 uppercase">ROOMS</div>\n          <div class="text-xs sm:text-sm text-white mt-0.5">05</div>\n        </div>\n        <div class="tech-module-chip p-2.5">\n          <div class="text-[9px] tracking-[0.2em] text-amber-300/70 uppercase">SPAN</div>\n          <div class="text-xs sm:text-sm text-white mt-0.5">2023.10 — 2026.02</div>\n        </div>\n        <div class="tech-module-chip p-2.5">\n          <div class="text-[9px] tracking-[0.2em] text-amber-300/70 uppercase">DIRECTION</div>\n          <div class="text-xs sm:text-sm text-cyan-300 mt-0.5">Scroll to travel back</div>\n        </div>\n      </div>\n    </div>\n\n    <!-- Sub-view B: ACTIVE TESSERACT PROJECT ROOM (22% - 52%) -->\n    <div id="tesseract-room-container" class="w-full max-w-[1240px] mx-auto my-auto hidden opacity-0">\n      <div id="tesseract-room-grid" class="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-10 items-center">\n        <div id="room-preview-col" class="lg:col-span-7">\n          <div class="flex items-center justify-between font-mono-tech text-[10px] tracking-[0.2em] text-amber-200/80 uppercase mb-2 px-1">\n            <span id="room-frame-top-label">ROOM 01 &nbsp; — &nbsp; SIDE PROJECT</span>\n            <span class="text-cyan-300/70">● 3D HOLOGRAPHIC ARTIFACT</span>\n          </div>\n\n          <div id="btn-room-preview-box" role="button" tabindex="0" class="tesseract-bay p-3 sm:p-4 cursor-pointer group">\n            <div id="room-preview-screen" class="w-full h-60 sm:h-72 md:h-[310px] bg-[#06070B] rounded overflow-hidden flex flex-col justify-between relative border border-white/10">\n            </div>\n          </div>\n\n          <div class="flex items-center justify-between font-mono-tech text-[10px] tracking-[0.2em] text-white/55 uppercase mt-2.5 px-1">\n            <span id="room-frame-date" class="text-amber-300">2026.02</span>\n            <button id="btn-click-enter-room" type="button" class="text-white/75 hover:text-amber-300 transition">\n              <span>[ CLICK TO ENTER ROOM ]</span>\n            </button>\n          </div>\n        </div>\n\n        <div id="room-details-col" class="lg:col-span-5">\n          <div class="cosmic-card p-6 sm:p-7 flex flex-col justify-center">\n            <div class="flex items-center justify-between font-mono-tech text-[10px] tracking-[0.22em] text-amber-300/85 uppercase mb-2">\n              <span id="room-meta-header">01 &nbsp; / &nbsp; SIDE PROJECT</span>\n              <span class="text-white/35">DAFIAN.SYS</span>\n            </div>\n\n            <h3 id="room-title" class="font-goozeman text-3xl sm:text-5xl uppercase text-white leading-[0.98] mb-5">\n              ROCKY\n            </h3>\n\n            <div class="grid grid-cols-3 gap-2.5 mb-4">\n              <div class="tech-module-chip p-2.5">\n                <div class="font-mono-tech text-[8px] tracking-[0.18em] text-white/45 uppercase">PERIOD</div>\n                <div id="room-period" class="font-mono-tech text-white/95 mt-1 text-[10px]">Aug 2025 – Present</div>\n              </div>\n              <div class="tech-module-chip p-2.5">\n                <div class="font-mono-tech text-[8px] tracking-[0.18em] text-white/45 uppercase">STATUS</div>\n                <div class="flex items-center gap-1.5 mt-1 text-[10px] font-mono-tech text-white/95">\n                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>\n                  <span id="room-status">Active</span>\n                </div>\n              </div>\n              <div class="tech-module-chip p-2.5">\n                <div class="font-mono-tech text-[8px] tracking-[0.18em] text-white/45 uppercase">GOAL</div>\n                <div id="room-goal" class="font-mono-tech text-amber-200 mt-1 text-[10px]">Published on npm</div>\n              </div>\n            </div>\n\n            <p id="room-desc" class="text-xs sm:text-[13px] text-white/70 leading-[1.65] mb-4">\n              Local CLI memory for AI coding agents. Remembers failed commands and the fixes that actually worked.\n            </p>\n\n            <div id="room-stack-list" class="flex flex-wrap gap-1.5 font-mono-tech text-[9px] tracking-[0.14em] text-white/80 uppercase mb-6">\n            </div>\n\n            <div class="flex flex-wrap items-center gap-3 pt-2 border-t border-white/10">\n              <button id="btn-enter-room-main" type="button" class="group bg-white text-black pl-4 pr-1.5 py-1.5 rounded-full font-medium text-xs flex items-center gap-2.5 hover:bg-amber-100 transition">\n                <span class="font-goozeman tracking-wider">Enter room</span>\n                <span class="w-6 h-6 rounded-full bg-amber-500 text-black flex items-center justify-center text-[11px]">↗</span>\n              </button>\n              <button id="btn-room-code" type="button" class="tech-module-chip px-3.5 py-1.5 font-mono-tech text-xs text-white/80 hover:text-white">\n                Code ↗\n              </button>\n              <button id="btn-room-live" type="button" class="tech-module-chip px-3.5 py-1.5 font-mono-tech text-xs text-white/80 hover:text-white">\n                Live Demo ↗\n              </button>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n\n    <div class="fixed bottom-12 left-1/2 -translate-x-1/2 z-20 w-[92%] max-w-2xl pointer-events-auto">\n      <div class="hud-module px-5 py-2.5 rounded-full flex items-center justify-between gap-4">\n        <span id="tesseract-counter-badge" class="font-mono-tech text-[10px] tracking-[0.2em] text-amber-300">\n          01 / 05\n        </span>\n        <div class="flex-1 flex items-center justify-between relative py-1">\n          <div class="absolute left-0 right-0 h-[1px] bg-white/15 top-1/2 -translate-y-1/2"></div>\n          <button type="button" data-room-jump="0" class="room-dot-btn relative z-10 flex flex-col items-center group">\n            <span class="w-2.5 h-2.5 rounded-full bg-amber-400 ring-4 ring-amber-400/20 transition-all"></span>\n            <span class="font-mono-tech text-[9px] text-white/85 mt-1">2026.02</span>\n          </button>\n          <button type="button" data-room-jump="1" class="room-dot-btn relative z-10 flex flex-col items-center group">\n            <span class="w-2 h-2 rounded-full bg-white/35 group-hover:bg-white transition-all"></span>\n            <span class="font-mono-tech text-[9px] text-white/40 mt-1">2025.10</span>\n          </button>\n          <button type="button" data-room-jump="2" class="room-dot-btn relative z-10 flex flex-col items-center group">\n            <span class="w-2 h-2 rounded-full bg-white/35 group-hover:bg-white transition-all"></span>\n            <span class="font-mono-tech text-[9px] text-white/40 mt-1">2025.07</span>\n          </button>\n          <button type="button" data-room-jump="3" class="room-dot-btn relative z-10 flex flex-col items-center group">\n            <span class="w-2 h-2 rounded-full bg-white/35 group-hover:bg-white transition-all"></span>\n            <span class="font-mono-tech text-[9px] text-white/40 mt-1">2024.07</span>\n          </button>\n          <button type="button" data-room-jump="4" class="room-dot-btn relative z-10 flex flex-col items-center group">\n            <span class="w-2 h-2 rounded-full bg-white/35 group-hover:bg-white transition-all"></span>\n            <span class="font-mono-tech text-[9px] text-white/40 mt-1">2023.10</span>\n          </button>\n        </div>\n        <span id="tesseract-active-name" class="hidden sm:inline font-goozeman text-xs tracking-wider text-amber-200">\n          ROCKY\n        </span>\n      </div>\n    </div>\n  </section>\n\n  <!-- =====================================================================\n       SCENE 3: 02 / ABOUT — "3D EARTH, MOON, EXOPLANETS & COMET" (52% - 70%)\n       ===================================================================== -->\n  <section id="scene-about" class="scene-layer z-10 px-6 sm:px-12 md:px-16">\n    <div class="w-full max-w-[1220px] mx-auto my-auto pt-8 pb-10">\n      <div class="font-mono-tech text-[10px] tracking-[0.24em] text-cyan-300/85 uppercase mb-2">\n        02 &nbsp; — &nbsp; ABOUT DAFIAN // 3D PLANETARY ORBIT\n      </div>\n\n      <h2 id="about-headline" class="font-goozeman text-2xl sm:text-4xl md:text-[42px] leading-[1.18] max-w-3xl mb-6 text-white drop-shadow-[0_6px_24px_rgba(0,0,0,0.9)]">\n        I build web apps that actually get used, not just demo projects.\n        <span class="text-amber-200/75">Lately: Rocky, a local memory that stops AI coding agents from repeating the same mistakes.</span>\n      </h2>\n\n      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-6">\n        <div class="lg:col-span-6 cosmic-card p-5 sm:p-6 flex flex-col justify-between space-y-3 text-xs sm:text-[13px] text-white/75 leading-[1.68]">\n          <div class="flex items-center justify-between font-mono-tech text-[9px] tracking-[0.22em] text-amber-300/80 uppercase border-b border-white/10 pb-2">\n            <span>ENGINEERING TRANSMISSION // BIO</span>\n            <span>SECTOR 02.A</span>\n          </div>\n          <p>\n            I\'m <strong class="text-white font-semibold">Dafian</strong>, an Informatics engineering graduate and Full Stack Developer based in Indonesia, architecting high-reliability enterprise platforms and Web3 applications.\n          </p>\n          <p>\n            My stack leans on Vue, React, TypeScript, and Laravel, backed by enough SQL optimization to know when a query is doing something wrong. I\'ve shipped systems for MSMEs, accounting firms, and retail enterprises end-to-end.\n          </p>\n          <p>\n            Beyond standard web apps, I combine AI agent tooling, blockchain smart contracts, and 3D WebGL motion design into cohesive products.\n          </p>\n        </div>\n\n        <div class="lg:col-span-6 cosmic-card p-5 sm:p-6 flex flex-col justify-between">\n          <div class="flex items-center justify-between font-mono-tech text-[9px] tracking-[0.22em] text-cyan-300/80 uppercase border-b border-white/10 pb-2 mb-2">\n            <span>PROFILE TELEMETRY MATRIX</span>\n            <span>ID // DAFIAN-26</span>\n          </div>\n          <div class="divide-y divide-white/10 text-xs">\n            <div class="py-2 grid grid-cols-12 gap-2">\n              <span class="col-span-4 font-mono-tech text-[10px] text-white/45 uppercase">EDUCATION</span>\n              <span class="col-span-8 text-white/95 font-medium">Informatics Engineering (2022–2026)</span>\n            </div>\n            <div class="py-2 grid grid-cols-12 gap-2">\n              <span class="col-span-4 font-mono-tech text-[10px] text-white/45 uppercase">CURRENT</span>\n              <span class="col-span-8 text-white/95">Enterprise Retail Group · Full Stack Dev</span>\n            </div>\n            <div class="py-2 grid grid-cols-12 gap-2">\n              <span class="col-span-4 font-mono-tech text-[10px] text-white/45 uppercase">FOCUS</span>\n              <span class="col-span-8 text-amber-300">Web3, Blockchain, AI &amp; 3D WebGL</span>\n            </div>\n            <div class="py-2 grid grid-cols-12 gap-2">\n              <span class="col-span-4 font-mono-tech text-[10px] text-white/45 uppercase">ACHIEVEMENT</span>\n              <span class="col-span-8 text-white/95">World Computer Hacker League 2025, Regional</span>\n            </div>\n            <div class="py-2 grid grid-cols-12 gap-2">\n              <span class="col-span-4 font-mono-tech text-[10px] text-white/45 uppercase">LANGUAGES</span>\n              <span class="col-span-8 text-white/95">Bahasa Indonesia (Native) · English (C1)</span>\n            </div>\n            <div class="py-2 grid grid-cols-12 gap-2">\n              <span class="col-span-4 font-mono-tech text-[10px] text-white/45 uppercase">LOCATION</span>\n              <span class="col-span-8 text-cyan-300">West Java, Indonesia (6.9175° S, 107.6191° E)</span>\n            </div>\n          </div>\n        </div>\n      </div>\n\n      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">\n        <div class="lg:col-span-6 cosmic-card p-4 sm:p-5">\n          <div class="font-mono-tech text-[9px] tracking-[0.22em] text-amber-300/80 uppercase mb-3">CAPABILITIES MODULE</div>\n          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">\n            <div class="tech-module-chip px-3 py-2 flex items-center gap-2 text-white/90"><span class="font-mono-tech text-amber-300 text-[10px]">01</span> Full-Stack Dev</div>\n            <div class="tech-module-chip px-3 py-2 flex items-center gap-2 text-white/90"><span class="font-mono-tech text-amber-300 text-[10px]">02</span> Web3 &amp; Chain</div>\n            <div class="tech-module-chip px-3 py-2 flex items-center gap-2 text-white/90"><span class="font-mono-tech text-amber-300 text-[10px]">03</span> AI &amp; Agents</div>\n            <div class="tech-module-chip px-3 py-2 flex items-center gap-2 text-white/90"><span class="font-mono-tech text-amber-300 text-[10px]">04</span> SQL &amp; Backend</div>\n            <div class="tech-module-chip px-3 py-2 flex items-center gap-2 text-white/90"><span class="font-mono-tech text-amber-300 text-[10px]">05</span> Cloud DevOps</div>\n            <div class="tech-module-chip px-3 py-2 flex items-center gap-2 text-white/90"><span class="font-mono-tech text-amber-300 text-[10px]">06</span> System Design</div>\n          </div>\n        </div>\n\n        <div class="lg:col-span-6 cosmic-card p-4 sm:p-5">\n          <div class="font-mono-tech text-[9px] tracking-[0.22em] text-cyan-300/80 uppercase mb-3">CORE TECH STACK</div>\n          <div class="flex flex-wrap gap-2 text-xs font-mono-tech">\n            <span class="tech-module-chip px-3 py-1.5 text-white/90">Laravel</span>\n            <span class="tech-module-chip px-3 py-1.5 text-white/90">Vue.js</span>\n            <span class="tech-module-chip px-3 py-1.5 text-white/90">React</span>\n            <span class="tech-module-chip px-3 py-1.5 text-white/90">TypeScript</span>\n            <span class="tech-module-chip px-3 py-1.5 text-white/90">PHP</span>\n            <span class="tech-module-chip px-3 py-1.5 text-amber-300">Three.js 3D</span>\n            <span class="tech-module-chip px-3 py-1.5 text-cyan-300">Anime.js</span>\n            <span class="tech-module-chip px-3 py-1.5 text-white/90">Stellar</span>\n            <span class="tech-module-chip px-3 py-1.5 text-white/90">DevOps</span>\n          </div>\n        </div>\n      </div>\n    </div>\n  </section>\n\n  <!-- =====================================================================\n       SCENE 4: 03 / EXPERIENCE — "STAR TRAILS, 3D MOONS & HORIZON" (70% - 88%)\n       ===================================================================== -->\n  <section id="scene-experience" class="scene-layer z-10 px-6 sm:px-12 md:px-16">\n    <div id="exp-intro-header" class="w-full max-w-3xl mx-auto mt-auto mb-16 text-center">\n      <div class="font-mono-tech text-[10px] tracking-[0.24em] text-amber-300/80 uppercase mb-2">\n        03 &nbsp; — &nbsp; EXPERIENCE\n      </div>\n      <h2 class="font-goozeman text-3xl sm:text-5xl md:text-6xl uppercase text-white leading-[0.96] mb-3">\n        PROFESSIONAL<br />EXPERIENCE\n      </h2>\n      <p class="text-xs sm:text-sm text-white/65 max-w-md mx-auto leading-relaxed">\n        A long exposure since Oct 2023, shutter still open. The sky turns once a year here; each moon is a month, each trail a role.\n      </p>\n    </div>\n\n    <div id="exp-card-box" class="w-full max-w-4xl mx-auto mt-auto mb-12 text-center hidden">\n      <div class="inline-flex flex-wrap justify-center items-center gap-2.5 mb-4 pointer-events-auto">\n        <button type="button" data-exp-select="0" class="exp-tab-btn tech-module-chip px-3.5 py-1.5 font-mono-tech text-[10px] tracking-[0.16em] text-amber-300 border-amber-400/70 transition">\n          01 · Current (\'26)\n        </button>\n        <button type="button" data-exp-select="1" class="exp-tab-btn tech-module-chip px-3.5 py-1.5 font-mono-tech text-[10px] tracking-[0.16em] text-white/55 hover:text-white transition">\n          02 · Qualitech (\'25)\n        </button>\n        <button type="button" data-exp-select="2" class="exp-tab-btn tech-module-chip px-3.5 py-1.5 font-mono-tech text-[10px] tracking-[0.16em] text-white/55 hover:text-white transition">\n          03 · Lintasarta (\'24)\n        </button>\n        <button type="button" data-exp-select="3" class="exp-tab-btn tech-module-chip px-3.5 py-1.5 font-mono-tech text-[10px] tracking-[0.16em] text-white/55 hover:text-white transition">\n          04 · KJA Kasir (\'23)\n        </button>\n      </div>\n\n      <div class="cosmic-card p-6 sm:p-8 text-left">\n        <div class="flex flex-wrap items-center justify-between gap-2 font-mono-tech text-[10px] tracking-[0.22em] text-amber-300 uppercase mb-2 pb-2 border-b border-white/10">\n          <span id="exp-period-badge">01 &nbsp; • &nbsp; CURRENT &nbsp; — &nbsp; DEC 2024 – PRESENT</span>\n          <span id="exp-sky-angle" class="text-cyan-300">ORBITAL ROTATION: 045° N</span>\n        </div>\n\n        <h3 id="exp-role-title" class="font-goozeman text-2xl sm:text-4xl text-white mb-1">\n          Full Stack Developer\n        </h3>\n        <div id="exp-company" class="text-xs text-white/60 font-mono-tech tracking-wider uppercase mb-5">\n          PT Juriya Ritel Indonesia — Retail Group · Core Operations System\n        </div>\n\n        <div id="exp-bullets" class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2.5 text-xs text-white/75 leading-relaxed mb-5">\n        </div>\n\n        <div id="exp-tags" class="flex flex-wrap gap-2 pt-3 border-t border-white/10 font-mono-tech text-[10px] tracking-wider text-white/75">\n        </div>\n      </div>\n    </div>\n  </section>\n\n  <!-- =====================================================================\n       SCENE 5: 04 / CONTACT — "3D SPIRAL GALAXY & HYPERSPACE RETURN" (88% - 100%)\n       ===================================================================== -->\n  <section id="scene-contact" class="scene-layer z-10 px-6 sm:px-12 md:px-16">\n    <div class="w-full max-w-[1180px] mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">\n      <div class="lg:col-span-7 cosmic-card p-6 sm:p-9">\n        <div class="flex items-center justify-between font-mono-tech text-[10px] tracking-[0.24em] text-amber-300/85 uppercase mb-3">\n          <span>04 &nbsp; — &nbsp; CONTACT DAFIAN</span>\n          <span>GALACTIC NEXUS // 3D</span>\n        </div>\n        <h2 class="font-goozeman text-4xl sm:text-6xl md:text-[72px] leading-[0.95] uppercase text-white mb-4">\n          LET\'S<br />CONNECT\n        </h2>\n        <p class="text-xs sm:text-sm text-white/65 max-w-md leading-[1.65] mb-6">\n          I\'m always interested in discussing new opportunities, innovative 3D &amp; full-stack projects, or having a conversation about AI &amp; Web3.\n        </p>\n\n        <div class="space-y-2.5 max-w-lg mb-7">\n          <div class="tech-module-chip px-4 py-3 flex items-center justify-between group">\n            <span class="font-mono-tech text-[10px] tracking-[0.2em] text-amber-300/80 uppercase">EMAIL</span>\n            <button id="btn-copy-email" type="button" class="font-mono-tech text-xs sm:text-sm text-white group-hover:text-amber-200 transition flex items-center gap-2">\n              <span id="contact-email-text">dafiannnn@gmail.com</span>\n              <span class="px-2 py-0.5 rounded bg-white/10 text-[9px] text-amber-300">Copy</span>\n            </button>\n          </div>\n          <div class="tech-module-chip px-4 py-3 flex items-center justify-between group">\n            <span class="font-mono-tech text-[10px] tracking-[0.2em] text-amber-300/80 uppercase">GITHUB</span>\n            <button type="button" data-open-modal="github" class="font-mono-tech text-xs sm:text-sm text-white group-hover:text-amber-200 transition flex items-center gap-1.5">\n              <span>@Dapzsyzofc</span>\n              <span class="text-amber-300">↗</span>\n            </button>\n          </div>\n          <div class="tech-module-chip px-4 py-3 flex items-center justify-between group">\n            <span class="font-mono-tech text-[10px] tracking-[0.2em] text-amber-300/80 uppercase">TELEGRAM</span>\n            <a href="https://t.me/DapzSYZ" target="_blank" rel="noopener noreferrer" class="font-mono-tech text-xs sm:text-sm text-white group-hover:text-amber-200 transition flex items-center gap-1.5">\n              <span>@DapzSYZ</span>\n              <span class="text-amber-300">↗</span>\n            </a>\n          </div>\n        </div>\n\n        <div class="flex flex-wrap items-center gap-3.5">\n          <button id="btn-open-transmission" type="button" class="bg-white text-black px-5 py-2.5 rounded-full font-medium text-xs hover:bg-amber-100 transition">\n            <span class="font-goozeman tracking-wider">Send Cosmic Transmission ✦</span>\n          </button>\n          <button id="btn-trigger-warp" type="button" class="tech-module-chip px-4 py-2.5 font-mono-tech text-[11px] tracking-wider text-amber-200 hover:text-white">\n            Warp to Origin (Gargantua) ⟳\n          </button>\n        </div>\n      </div>\n\n      <div class="lg:col-span-5 flex flex-col items-center justify-center">\n        <button id="btn-galaxy-core" type="button" class="group relative w-60 h-60 rounded-full flex items-center justify-center focus:outline-none" title="Klik untuk Hyperspace Warp kembali ke Gargantua">\n          <span class="absolute inset-4 rounded-full border border-amber-300/20 group-hover:scale-110 transition-transform duration-700"></span>\n          <span class="absolute inset-12 rounded-full border border-dashed border-cyan-300/30 animate-spin" style="animation-duration: 28s;"></span>\n          <div class="hud-module px-4 py-2 rounded-full font-mono-tech text-[10px] tracking-[0.22em] text-amber-200 group-hover:bg-white group-hover:text-black uppercase transition flex items-center gap-2">\n            <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>\n            <span>RETURN TO ORIGIN ↗</span>\n          </div>\n        </button>\n      </div>\n    </div>\n  </section>\n\n  <!-- =====================================================================\n       MODAL: ROOM INSPECTOR / 3D GALAXY MAP / TRANSMISSION FORM\n       ===================================================================== -->\n  <div id="cosmic-modal" class="fixed inset-0 z-50 hidden items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">\n    <div class="cosmic-card w-full max-w-2xl p-6 sm:p-8 relative max-h-[88vh] overflow-y-auto">\n      <div class="flex items-center justify-between pb-4 border-b border-white/10 mb-5">\n        <div class="font-mono-tech text-[10px] tracking-[0.22em] text-amber-300 uppercase" id="modal-subtitle">\n          TESSERACT ROOM INSPECTOR\n        </div>\n        <button id="btn-close-modal" type="button" class="tech-module-chip w-8 h-8 flex items-center justify-center text-white/80 hover:text-white text-xs">\n          ✕\n        </button>\n      </div>\n      <div id="modal-body" class="space-y-4"></div>\n    </div>\n  </div>\n\n  <!-- Toast Notification -->\n  <div id="cosmic-toast" class="fixed top-20 right-6 z-50 pointer-events-none opacity-0 translate-y-2 transition-all duration-300 cosmic-card px-4 py-2.5 font-mono-tech text-[11px] text-white flex items-center gap-2">\n    <span class="w-2 h-2 rounded-full bg-emerald-400"></span>\n    <span id="cosmic-toast-text">Copied to clipboard</span>\n  </div>';

export default function CosmicPortfolioClient() {
  const containerRef = useRef(null);

  useEffect(() => {
    let cleanupFn = () => {};

    try {
const anime = animePkg.default || animePkg;
// ---------------------------------------------------------------------
    // 1. PORTFOLIO DATA FOR DAFIAN
    // ---------------------------------------------------------------------
    // Data imported from '@/data/portfolioData'

    // ---------------------------------------------------------------------
    // 2. REACTIVE WORLD STATE
    // ---------------------------------------------------------------------
    const worldState = {
      preloaderDone: false,
      preloaderProgress: 0,
      plasmaIntensity: 1.0,
      cosmicWebAlpha: 0.0,

      targetScroll: 0,
      currentScroll: 0,
      scrollVelocity: 0,
      smoothMouseX: 0,
      smoothMouseY: 0,
      rawMouseX: 0,
      rawMouseY: 0,

      isWarping: false,
      warpStreak: 0,
      warpFlash: 0,

      // Black Hole Portal Zoom & Core Dissolve State
      bhZoomProgress: 0.0,    // 0.0 (Hero idle) -> 1.0 (Fully zoomed through the Black Hole core)
      bhCoreDarkness: 1.0,    // 1.0 (Pitch black core) -> 0.0 (Core fades to transparent revealing Tesseract inside!)
      bhPortalAlpha: 1.0,     // Overall visibility of the Black Hole Portal layer

      // Anime.js Master Timeline interpolated state
      camProgress: 0,
      tesseractAlpha: 0.0,
      tesseractDepth: 0.0,
      activeRoomIdx: 0,

      aboutSkyAlpha: 0.0,
      cometProgress: 0.0,

      starTrailAlpha: 0.0,
      starTrailAngle: 0.0,
      ridgeHorizonY: 1.25,
      activeExpIdx: 0
    };

    // ---------------------------------------------------------------------
    // 3. WEB AUDIO API COSMIC SYNTHESIZER
    // ---------------------------------------------------------------------
    const cosmicAudio = {
      ctx: null,
      isPlaying: false,
      masterGain: null,
      filterNode: null,

      init() {
        if (this.ctx) return;
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.0;

        this.filterNode = this.ctx.createBiquadFilter();
        this.filterNode.type = 'lowpass';
        this.filterNode.frequency.value = 210;

        const freqs = [55.0, 82.41, 110.0, 164.81];
        freqs.forEach((f, idx) => {
          const osc = this.ctx.createOscillator();
          const oscGain = this.ctx.createGain();
          osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
          osc.frequency.value = f;
          oscGain.gain.value = idx === 0 ? 0.34 : 0.12;
          osc.connect(oscGain);
          oscGain.connect(this.filterNode);
          osc.start();
        });

        this.filterNode.connect(this.masterGain);
        this.masterGain.connect(this.ctx.destination);
      },

      toggle() {
        this.init();
        if (!this.ctx) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();
        this.isPlaying = !this.isPlaying;
        const now = this.ctx.currentTime;
        this.masterGain.gain.setTargetAtTime(this.isPlaying ? 0.16 : 0.0, now, 0.3);

        const btn = document.getElementById('btn-sound-toggle');
        const label = document.getElementById('sound-label');
        if (this.isPlaying) {
          btn.classList.add('sound-active');
          label.textContent = 'Sound';
          this.chime(660);
        } else {
          btn.classList.remove('sound-active');
          label.textContent = 'Muted';
        }
      },

      modulateWithVelocity(vel) {
        if (!this.isPlaying || !this.filterNode || !this.ctx) return;
        const targetFreq = Math.min(1200, 190 + Math.abs(vel) * 16000);
        this.filterNode.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.1);
      },

      chime(freq = 780) {
        if (!this.isPlaying || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.25, now + 0.15);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.22);
      }
    };

    // ---------------------------------------------------------------------
    // 4. REALISTIC APPLICATION PREVIEWS & SMOOTH DOM UPDATES
    // ---------------------------------------------------------------------
    let lastRenderedRoom = -1;
    let lastRenderedExp = -1;

    function buildRoomMockupHTML(room) {
      if (room.mockupType === 'rocky') {
        return `
          <div class="w-full h-full bg-[#050609] flex flex-col justify-between p-5 text-left relative">
            <div class="flex items-center justify-between border-b border-white/10 pb-2 font-mono-tech text-[10px] text-white/45">
              <div class="flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-amber-400"></span>
                <span class="text-white/80">rocky-memory-agent · v1.4.2</span>
              </div>
              <span class="text-amber-300">sqlite-vec · MCP</span>
            </div>
            <div class="my-auto py-4 text-center">
              <p class="font-goozeman text-xl sm:text-2xl text-[#F5D08A] tracking-wider leading-snug max-w-md mx-auto" style="text-shadow: 0 0 24px rgba(245, 180, 80, 0.4);">
                You have hit this error before.<br/>You do not remember what fixed it.
              </p>
              <div class="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded bg-white/[0.04] border border-amber-400/30 font-mono-tech text-[10px] text-amber-200">
                <span>$ rocky recall --fix "SQLITE_BUSY" → Hit 99.4% match</span>
              </div>
            </div>
            <div class="flex items-center justify-between font-mono-tech text-[9px] text-white/35 border-t border-white/10 pt-2">
              <span>LOCAL VECTOR STORE: 1,420 SESSIONS</span>
              <span class="text-emerald-400">● ZERO REPEATED ERRORS</span>
            </div>
          </div>
        `;
      }
      if (room.mockupType === 'vibing') {
        return `
          <div class="w-full h-full bg-[#0E100C] p-4 sm:p-5 flex flex-col justify-between text-left">
            <div class="flex items-center justify-between text-[10px] font-mono-tech text-white/50 border-b border-white/10 pb-2">
              <span class="font-goozeman text-white tracking-wider">Vibing Farmer</span>
              <span>1. Plan &nbsp; — &nbsp; 2. Sign &nbsp; — &nbsp; 3. Farm</span>
              <span class="px-2 py-0.5 rounded bg-lime-400/20 text-lime-300">Soroban Testnet</span>
            </div>
            <div class="grid grid-cols-12 gap-3 my-auto py-2">
              <div class="col-span-7 bg-[#D9C94A] text-black rounded p-3.5 flex flex-col justify-between">
                <div class="text-[9px] font-mono-tech uppercase opacity-75">STEP 1 · AUTONOMOUS VAULT</div>
                <div class="font-goozeman text-sm sm:text-base leading-tight my-1">How much do you want to put to work?</div>
                <div class="font-mono-tech font-bold text-2xl sm:text-3xl my-1">2,500 <span class="text-xs font-normal">USDC</span></div>
                <div class="mt-2 inline-block bg-black text-white text-[9px] font-mono-tech px-2.5 py-1 rounded self-start">Sign 1-Click Guardrail →</div>
              </div>
              <div class="col-span-5 bg-[#161912] border border-lime-300/20 rounded p-3 flex flex-col justify-between text-[10px]">
                <div>
                  <div class="text-white/40 font-mono-tech text-[8px] uppercase">SWARM TELEMETRY</div>
                  <div class="text-[#D9C94A] font-mono-tech mt-1">● 14.8% APY Optimized</div>
                  <div class="text-white/65 mt-1 text-[9px]">Sponsored by fee-bump relay (0 XLM gas)</div>
                </div>
                <div class="border-t border-white/10 pt-2 text-[9px] text-lime-300/80 font-mono-tech">
                  GUARDRAIL: ENFORCED
                </div>
              </div>
            </div>
          </div>
        `;
      }
      if (room.mockupType === 'openvote') {
        return `
          <div class="w-full h-full bg-gradient-to-b from-[#070C18] to-[#04060C] p-5 flex flex-col justify-between text-center relative">
            <div class="flex items-center justify-between text-[10px] font-mono-tech text-white/60 border-b border-white/10 pb-2">
              <span class="font-goozeman text-white tracking-wider">OpenVote</span>
              <span class="px-2.5 py-0.5 rounded bg-sky-500/30 border border-sky-400/40 text-sky-200 text-[9px]">Wallet Connected · 0x71C...9A</span>
            </div>
            <div class="my-auto py-3">
              <div class="text-[9px] font-mono-tech text-sky-300/80 uppercase tracking-widest mb-1.5">WCHL 2025 · On-Chain Governance</div>
              <div class="font-goozeman text-xl sm:text-3xl text-white leading-tight">Transparent Voting for<br/>Everyone</div>
              <p class="text-[10px] text-white/55 max-w-xs mx-auto mt-2">Single, multiple, and ranked-choice cryptographic ballots with instant quorum verification.</p>
            </div>
            <div class="text-[9px] font-mono-tech text-sky-300/60">SOLIDITY · MERKLE PROOF · ZERO TAMPERING</div>
          </div>
        `;
      }
      if (room.mockupType === 'msme') {
        return `
          <div class="w-full h-full bg-[#0C0E14] p-4 sm:p-5 flex flex-col justify-between text-left">
            <div class="flex items-center justify-between border-b border-white/10 pb-2">
              <span class="font-goozeman text-xs text-white tracking-wider">MSME Executive ERP Suite</span>
              <span class="font-mono-tech text-[9px] text-emerald-400">● 12 Active UMKM Branches</span>
            </div>
            <div class="grid grid-cols-4 gap-2.5 my-auto py-3">
              <div class="bg-[#151922] border border-white/10 rounded p-2.5">
                <div class="text-[8px] font-mono-tech text-white/45">BRANCHES</div>
                <div class="font-mono-tech font-bold text-lg text-emerald-400 mt-1">12</div>
              </div>
              <div class="bg-[#151922] border border-white/10 rounded p-2.5">
                <div class="text-[8px] font-mono-tech text-white/45">OPERATORS</div>
                <div class="font-mono-tech font-bold text-lg text-amber-300 mt-1">48</div>
              </div>
              <div class="bg-[#151922] border border-white/10 rounded p-2.5">
                <div class="text-[8px] font-mono-tech text-white/45">REPORTS</div>
                <div class="font-mono-tech font-bold text-lg text-sky-400 mt-1">184</div>
              </div>
              <div class="bg-[#151922] border border-white/10 rounded p-2.5">
                <div class="text-[8px] font-mono-tech text-white/45">SPEEDUP</div>
                <div class="font-mono-tech font-bold text-lg text-white mt-1">+35%</div>
              </div>
            </div>
            <div class="bg-[#12151E] rounded p-2.5 border border-white/10 flex items-center justify-between text-[10px] font-mono-tech text-white/65">
              <span>Automated Daily Cashflow &amp; Inventory Sync</span>
              <span class="text-amber-300">Export P&amp;L →</span>
            </div>
          </div>
        `;
      }
      return `
        <div class="w-full h-full bg-[#0A0D14] text-white p-4 sm:p-5 flex flex-col justify-between text-left">
          <div class="flex items-center justify-between border-b border-white/10 pb-2">
            <div class="font-goozeman text-xs text-white tracking-wider">KJA Kasir · Automated Ledger Engine</div>
            <span class="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-400/40 text-amber-200 text-[9px] font-mono-tech">4+ Financial Reports</span>
          </div>
          <div class="my-auto bg-[#111622] rounded border border-white/10 p-3">
            <div class="grid grid-cols-5 gap-2 text-[9px] font-mono-tech text-white/40 border-b border-white/10 pb-1">
              <span>ACCOUNT</span><span>DOC</span><span>DEBIT</span><span>CREDIT</span><span>BALANCE</span>
            </div>
            <div class="grid grid-cols-5 gap-2 text-[10px] font-mono-tech text-white/85 py-1.5 border-b border-white/5">
              <span>1102 · Inventory</span><span>PO-084</span><span>Rp 50.0M</span><span>—</span><span class="text-emerald-400">Balanced</span>
            </div>
            <div class="grid grid-cols-5 gap-2 text-[10px] font-mono-tech text-white/85 pt-1.5">
              <span>4100 · Revenue</span><span>INV-192</span><span>—</span><span>Rp 78.5M</span><span class="text-emerald-400">Posted</span>
            </div>
          </div>
          <div class="flex items-center justify-between text-[9px] font-mono-tech text-white/45">
            <span>GENERAL LEDGER · BALANCE SHEET · P&amp;L</span>
            <span class="text-cyan-300">Reconciled 100% →</span>
          </div>
        </div>
      `;
    }

    function renderTesseractRoom(idx) {
      const safeIdx = Math.max(0, Math.min(TESSERACT_ROOMS.length - 1, idx));
      if (safeIdx === lastRenderedRoom) return;
      lastRenderedRoom = safeIdx;

      const room = TESSERACT_ROOMS[safeIdx];
      const previewCol = document.getElementById('room-preview-col');
      const detailsCol = document.getElementById('room-details-col');

      if (safeIdx % 2 === 1) {
        previewCol.classList.add('lg:order-2');
        detailsCol.classList.add('lg:order-1');
      } else {
        previewCol.classList.remove('lg:order-2');
        detailsCol.classList.remove('lg:order-1');
      }

      document.getElementById('room-frame-top-label').textContent = `ROOM ${room.number}   —   ${room.category}`;
      document.getElementById('room-frame-date').textContent = room.stamp;
      document.getElementById('room-meta-header').textContent = `${room.number}   /   ${room.category}`;
      document.getElementById('room-title').textContent = room.title;
      document.getElementById('room-period').textContent = room.period;
      document.getElementById('room-status').textContent = room.status;
      document.getElementById('room-goal').textContent = room.goal;
      document.getElementById('room-desc').textContent = room.desc;
      document.getElementById('tesseract-counter-badge').textContent = `${room.number} / 05`;
      document.getElementById('tesseract-active-name').textContent = room.title;

      document.getElementById('room-stack-list').innerHTML = room.stack
        .map(s => `<span class="tech-module-chip px-2.5 py-1 text-white/85">${s}</span>`)
        .join('');

      document.getElementById('room-preview-screen').innerHTML = buildRoomMockupHTML(room);

      document.querySelectorAll('.room-dot-btn').forEach((btn, i) => {
        const dot = btn.querySelector('span:first-child');
        const lbl = btn.querySelector('span:last-child');
        if (i === safeIdx) {
          dot.className = 'w-2.5 h-2.5 rounded-full bg-amber-400 ring-4 ring-amber-400/20 transition-all';
          lbl.className = 'font-mono-tech text-[9px] text-white/90 mt-1';
        } else {
          dot.className = 'w-2 h-2 rounded-full bg-white/35 group-hover:bg-white transition-all';
          lbl.className = 'font-mono-tech text-[9px] text-white/40 mt-1';
        }
      });

      anime.remove('#room-details-col .cosmic-card', '#room-preview-col');
      anime({
        targets: ['#room-preview-col', '#room-details-col .cosmic-card'],
        opacity: [0.35, 1],
        translateY: [18, 0],
        scale: [0.985, 1],
        duration: 620,
        easing: 'easeOutQuint'
      });
    }

    function renderExperienceRole(idx) {
      const safeIdx = Math.max(0, Math.min(EXPERIENCE_ROLES.length - 1, idx));
      if (safeIdx === lastRenderedExp) return;
      lastRenderedExp = safeIdx;

      const role = EXPERIENCE_ROLES[safeIdx];
      document.getElementById('exp-period-badge').textContent = role.badge;
      document.getElementById('exp-sky-angle').textContent = role.skyAngle;
      document.getElementById('exp-role-title').textContent = role.title;
      document.getElementById('exp-company').textContent = role.company;

      document.getElementById('exp-bullets').innerHTML = role.bullets
        .map(b => `<div class="flex items-start gap-2.5"><span class="text-amber-300 mt-0.5">▹</span><span>${b}</span></div>`)
        .join('');

      document.getElementById('exp-tags').innerHTML = role.tags
        .map(t => `<span class="tech-module-chip px-2.5 py-1 text-white/80">${t}</span>`)
        .join('');

      document.querySelectorAll('.exp-tab-btn').forEach((btn, i) => {
        if (i === safeIdx) {
          btn.className = 'exp-tab-btn tech-module-chip px-3.5 py-1.5 font-mono-tech text-[10px] tracking-[0.16em] text-amber-300 border-amber-400/70 transition';
        } else {
          btn.className = 'exp-tab-btn tech-module-chip px-3.5 py-1.5 font-mono-tech text-[10px] tracking-[0.16em] text-white/55 hover:text-white transition';
        }
      });

      anime.remove('#exp-card-box .cosmic-card');
      anime({
        targets: '#exp-card-box .cosmic-card',
        opacity: [0.4, 1],
        translateY: [16, 0],
        scale: [0.985, 1],
        duration: 580,
        easing: 'easeOutQuint'
      });
    }

    // ---------------------------------------------------------------------
    // 5. ANIME.JS MASTER TIMELINE (WITH BLACK HOLE ZOOM & CORE FADE-TO-PORTAL)
    // ---------------------------------------------------------------------
    let masterTimeline = null;

    function buildMasterTimeline() {
      masterTimeline = anime.timeline({
        autoplay: false,
        duration: 10000,
        easing: 'linear'
      });

      masterTimeline.add({
        targets: worldState,
        camProgress: [0, 1],
        duration: 10000,
        easing: 'linear'
      }, 0);

      // PHASE 1: Zoom into the Black Hole (200ms -> 1850ms)
      // As we zoom closer, the black center (bhCoreDarkness) fades from 1.0 to 0.0
      // so the Tesseract & next visual appear directly inside the Black Hole core!
      masterTimeline.add({
        targets: worldState,
        bhZoomProgress: [0.0, 1.0],
        duration: 1650,
        easing: 'easeInOutQuad'
      }, 200);

      masterTimeline.add({
        targets: worldState,
        bhCoreDarkness: [1.0, 0.0],
        duration: 1050,
        easing: 'easeInOutSine'
      }, 450);

      // Reveal Tesseract Lattice right inside the fading Black Hole core!
      masterTimeline.add({
        targets: worldState,
        tesseractAlpha: [0.0, 1.0],
        duration: 1100,
        easing: 'easeOutCubic'
      }, 500);

      // Fade out outer Black Hole rings once zoomed all the way through (1450ms -> 1950ms)
      masterTimeline.add({
        targets: worldState,
        bhPortalAlpha: [1.0, 0.0],
        duration: 500,
        easing: 'easeOutQuad'
      }, 1450);

      masterTimeline.add({
        targets: worldState,
        tesseractDepth: [0, 4200],
        duration: 3500,
        easing: 'linear'
      }, 1700);

      masterTimeline.add({
        targets: worldState,
        tesseractAlpha: [1.0, 0.0],
        aboutSkyAlpha: [0.0, 1.0],
        cometProgress: [0.0, 1.0],
        duration: 1700,
        easing: 'easeInOutCubic'
      }, 4900);

      masterTimeline.add({
        targets: worldState,
        aboutSkyAlpha: [1.0, 0.0],
        starTrailAlpha: [0.0, 1.0],
        ridgeHorizonY: [1.25, 0.72],
        duration: 850,
        easing: 'easeInOutCubic'
      }, 6650);

      masterTimeline.add({
        targets: worldState,
        starTrailAngle: [0, Math.PI * 1.65],
        duration: 1850,
        easing: 'linear'
      }, 7000);

      masterTimeline.add({
        targets: worldState,
        starTrailAlpha: [1.0, 0.0],
        ridgeHorizonY: [0.72, 1.35],
        duration: 850,
        easing: 'easeInOutCubic'
      }, 8600);
    }

    function smoothstep(edge0, edge1, x) {
      const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
      return t * t * (3 - 2 * t);
    }

    function syncDOMScenesWithScroll(p) {
      const pct = Math.round(p * 100);
      document.getElementById('hud-progress-fill').style.width = `${pct}%`;
      document.getElementById('hud-progress-pct').textContent = `${String(pct).padStart(2, '0')}%`;

      const navButtons = document.querySelectorAll('[data-nav-scroll]');
      navButtons.forEach(btn => btn.classList.remove('active'));
      if (p >= 0.15 && p < 0.52) navButtons[0].classList.add('active');
      else if (p >= 0.52 && p < 0.70) navButtons[1].classList.add('active');
      else if (p >= 0.70 && p < 0.88) navButtons[2].classList.add('active');
      else if (p >= 0.88) navButtons[3].classList.add('active');

      // Scene 1: HERO
      const heroEl = document.getElementById('scene-hero');
      if (p < 0.165) {
        const heroFade = 1 - smoothstep(0.05, 0.135, p);
        const pullScale = 1 + (1 - heroFade) * 0.12;
        heroEl.style.opacity = heroFade.toFixed(3);
        heroEl.style.transform = `translate3d(0, ${-(1 - heroFade) * 24}px, 0) scale(${pullScale.toFixed(3)})`;
        heroEl.classList.toggle('scene-active', heroFade > 0.2);
      } else {
        heroEl.style.opacity = '0';
        heroEl.classList.remove('scene-active');
      }

      // Scene 2: WORKS (INSIDE THE TESSERACT)
      const worksEl = document.getElementById('scene-works');
      const introCard = document.getElementById('tesseract-intro-card');
      const roomContainer = document.getElementById('tesseract-room-container');

      if (p >= 0.12 && p < 0.535) {
        const enterA = smoothstep(0.12, 0.17, p);
        const exitA = 1 - smoothstep(0.485, 0.53, p);
        const sceneAlpha = Math.min(enterA, exitA);
        worksEl.style.opacity = sceneAlpha.toFixed(3);
        worksEl.classList.toggle('scene-active', sceneAlpha > 0.2);

        if (p < 0.22) {
          const introAlpha = 1 - smoothstep(0.185, 0.218, p);
          introCard.style.display = 'block';
          introCard.style.opacity = introAlpha.toFixed(3);
          introCard.style.transform = `translate3d(0, ${(1 - introAlpha) * -18}px, 0)`;
          roomContainer.classList.add('hidden');
        } else {
          introCard.style.display = 'none';
          roomContainer.classList.remove('hidden');
          const roomIn = smoothstep(0.22, 0.24, p);
          roomContainer.style.opacity = roomIn.toFixed(3);
          const roomNorm = Math.max(0, Math.min(0.999, (p - 0.22) / 0.27));
          const rIdx = Math.floor(roomNorm * TESSERACT_ROOMS.length);
          worldState.activeRoomIdx = rIdx;
          renderTesseractRoom(rIdx);
        }
      } else {
        worksEl.style.opacity = '0';
        worksEl.classList.remove('scene-active');
      }

      // Scene 3: ABOUT
      const aboutEl = document.getElementById('scene-about');
      if (p >= 0.51 && p < 0.715) {
        const aIn = smoothstep(0.51, 0.555, p);
        const aOut = 1 - smoothstep(0.665, 0.71, p);
        const aAlpha = Math.min(aIn, aOut);
        aboutEl.style.opacity = aAlpha.toFixed(3);
        aboutEl.style.transform = `translate3d(0, ${(1 - aAlpha) * 22}px, 0)`;
        aboutEl.classList.toggle('scene-active', aAlpha > 0.25);
      } else {
        aboutEl.style.opacity = '0';
        aboutEl.classList.remove('scene-active');
      }

      // Scene 4: EXPERIENCE
      const expEl = document.getElementById('scene-experience');
      const expIntro = document.getElementById('exp-intro-header');
      const expCard = document.getElementById('exp-card-box');
      if (p >= 0.69 && p < 0.895) {
        const eIn = smoothstep(0.69, 0.725, p);
        const eOut = 1 - smoothstep(0.85, 0.89, p);
        const eAlpha = Math.min(eIn, eOut);
        expEl.style.opacity = eAlpha.toFixed(3);
        expEl.classList.toggle('scene-active', eAlpha > 0.25);

        if (p < 0.735) {
          expIntro.classList.remove('hidden');
          expCard.classList.add('hidden');
        } else {
          expIntro.classList.add('hidden');
          expCard.classList.remove('hidden');
          const expNorm = Math.max(0, Math.min(0.999, (p - 0.735) / 0.13));
          const eIdx = Math.floor(expNorm * EXPERIENCE_ROLES.length);
          worldState.activeExpIdx = eIdx;
          renderExperienceRole(eIdx);
        }
      } else {
        expEl.style.opacity = '0';
        expEl.classList.remove('scene-active');
      }

      // Scene 5: CONTACT
      const contactEl = document.getElementById('scene-contact');
      if (p >= 0.87) {
        const cAlpha = smoothstep(0.87, 0.915, p);
        contactEl.style.opacity = String(worldState.isWarping ? 0 : cAlpha.toFixed(3));
        contactEl.style.transform = `translate3d(0, ${(1 - cAlpha) * 20}px, 0)`;
        contactEl.classList.toggle('scene-active', cAlpha > 0.25 && !worldState.isWarping);
      } else {
        contactEl.style.opacity = '0';
        contactEl.classList.remove('scene-active');
      }

      const sectorText = document.getElementById('hud-sector-text');
      const scrollPrompt = document.getElementById('hud-scroll-prompt');
      if (p < 0.15) {
        sectorText.textContent = 'LOC. 00 · GARGANTUA SINGULARITY';
        scrollPrompt.textContent = 'Scroll to zoom into the Black Hole portal';
      } else if (p < 0.52) {
        sectorText.textContent = `LOC. 01 · TESSERACT ROOM 0${worldState.activeRoomIdx + 1}`;
        scrollPrompt.textContent = 'Scroll to travel through 4D lattice';
      } else if (p < 0.70) {
        sectorText.textContent = 'LOC. 02 · 3D EARTH & EXOPLANETS';
        scrollPrompt.textContent = '6.9175° S, 107.6191° E · ORBITAL VIEW';
      } else if (p < 0.88) {
        sectorText.textContent = `LOC. 03 · CELESTIAL POLE 0${worldState.activeExpIdx + 1}`;
        scrollPrompt.textContent = 'Long exposure shutter open';
      } else {
        sectorText.textContent = 'LOC. 04 · 3D SPIRAL GALAXY';
        scrollPrompt.textContent = 'Scroll or click core to return to origin';
      }
    }

    // ---------------------------------------------------------------------
    // 6. HYPERSPACE WARP LOOP
    // ---------------------------------------------------------------------
    let activeWarpAnim = null;

    function triggerHyperspaceWarp() {
      if (worldState.isWarping) return;
      worldState.isWarping = true;
      cosmicAudio.chime(520);

      const warpOverlay = document.getElementById('warp-overlay');
      warpOverlay.style.opacity = '1';

      activeWarpAnim = anime.timeline({
        complete: () => finishHyperspaceWarp()
      });

      activeWarpAnim
        .add({
          targets: worldState,
          warpStreak: [0, 1],
          duration: 1450,
          easing: 'easeInExpo'
        })
        .add({
          targets: worldState,
          warpFlash: [0, 0.92, 0],
          warpStreak: [1, 0],
          duration: 900,
          easing: 'easeOutCubic',
          begin: () => {
            worldState.targetScroll = 0.0;
            worldState.currentScroll = 0.0;
            masterTimeline.seek(0);
            syncDOMScenesWithScroll(0);
          }
        });
    }

    function finishHyperspaceWarp() {
      if (activeWarpAnim) {
        activeWarpAnim.pause();
        activeWarpAnim = null;
      }
      worldState.isWarping = false;
      worldState.warpStreak = 0;
      worldState.warpFlash = 0;
      worldState.targetScroll = 0.0;
      worldState.currentScroll = 0.0;
      masterTimeline.seek(0);
      syncDOMScenesWithScroll(0);
      document.getElementById('warp-overlay').style.opacity = '0';
      playHeroEntranceAnimation();
    }

    function playHeroEntranceAnimation() {
      anime.remove('.hero-char');
      anime({
        targets: '.hero-char',
        translateY: ['108%', '0%'],
        opacity: [0, 1],
        delay: anime.stagger(34),
        duration: 950,
        easing: 'easeOutExpo'
      });
    }

    // =====================================================================
    // 7. DEDICATED PHOTOREALISTIC GARGANTUA BLACK HOLE PORTAL SHADER
    //    (Modeled directly on the uploaded WhatsApp video:
    //     - Steep diagonal/vertical volumetric fiery orange-gold accretion pillar
    //       with dark smoky dust veins & white-hot inner plasma streaks
    //     - Double-lensed concentric fibrous golden-white photon rings wrapping
    //       around the black sphere
    //     - Foreground icy-blue planet limb on the left with bright atmospheric glow
    //     - PORTAL CORE FADE: When zooming in (u_zoom: 0 -> 1), the black center
    //       fades to transparent (u_coreDarkness: 1 -> 0) revealing the next
    //       visuals right inside the Black Hole!)
    // =====================================================================
    const bhCanvas = document.getElementById('bh-portal-canvas');
    const bhGl = bhCanvas.getContext('webgl', { alpha: true, premultipliedAlpha: false, antialias: false });
    let bhProgram = null;
    let bhUniforms = {};

    const BH_VS = `
      attribute vec2 a_pos;
      varying vec2 v_uv;
      void main() {
        v_uv = a_pos * 0.5 + 0.5;
        gl_Position = vec4(a_pos, 0.0, 1.0);
      }
    `;

    const BH_FS = `
      precision highp float;
      varying vec2 v_uv;

      uniform vec2 u_res;
      uniform float u_time;
      uniform vec2 u_mouse;
      uniform float u_zoom;         // 0.0 (idle) -> 1.0 (zoomed all the way through)
      uniform float u_coreDarkness; // 1.0 (pitch black core) -> 0.0 (transparent portal to next visual)
      uniform float u_portalAlpha;  // Overall layer alpha

      float hash21(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise2(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        float a = hash21(i);
        float b = hash21(i + vec2(1.0, 0.0));
        float c = hash21(i + vec2(0.0, 1.0));
        float d = hash21(i + vec2(1.0, 1.0));
        return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        for (int i = 0; i < 4; i++) {
          v += a * noise2(p);
          p = p * 2.03 + vec2(1.7, 9.2);
          a *= 0.5;
        }
        return v;
      }

      void main() {
        if (u_portalAlpha <= 0.005) {
          gl_FragColor = vec4(0.0);
          return;
        }

        float aspect = u_res.x / max(1.0, u_res.y);

        // Smoothly interpolate Black Hole center from right-of-center (0.57, 0.50) to screen center (0.50, 0.50) as we zoom in
        vec2 bhCenter = mix(
          vec2(0.56 - u_mouse.x * 0.022, 0.50 + u_mouse.y * 0.022),
          vec2(0.50, 0.50),
          smoothstep(0.0, 0.45, u_zoom)
        );

        // Exponential zoom scale into the Black Hole core
        float zoomScale = 1.0 + pow(u_zoom, 1.85) * 8.2;
        vec2 p = (v_uv - bhCenter) * vec2(aspect, 1.0) * 1.48 / zoomScale;

        // Horizontal / sideways accretion disk orientation ("versi menyamping, garisnya jangan ke atas")
        // Subtle cinematic Gargantua horizontal tilt (-8 deg) where py runs horizontally along the disk
        // and px is the vertical cross-section across the disk & upper/lower lensed arches.
        float angTilt = -0.14;
        float ca = cos(angTilt);
        float sa = sin(angTilt);
        float p_along = p.x * ca + p.y * sa;
        float p_cross = -p.x * sa + p.y * ca;
        float px = p_cross;
        float py = p_along;

        float r = sqrt(px * px + py * py);
        float ang = atan(py, px);
        float rh = 0.235; // Event Horizon shadow radius

        // -----------------------------------------------------------------
        // 1. TEARDROP / ONION GRAVITATIONAL LENSING HALO WITH THICK BUNDLED RINGS
        // -----------------------------------------------------------------
        float teardrop = 1.0 + 0.48 * exp(-(px * px) / 0.045) * (py * py) / (r * r + 0.015);
        float r_halo = sqrt((px * 1.02) * (px * 1.02) + (py / teardrop) * (py / teardrop));

        float dr = max(0.0, r_halo - rh);
        float outside_eh = clamp((r - rh * 0.985) / 0.008, 0.0, 1.0);
        float halo_env = (exp(-dr * 4.8) + 0.35 * exp(-dr * 2.4)) * clamp((r - rh * 0.96) / 0.012, 0.0, 1.0);

        // Concentric thick bundled strands & fine brushed grooves in the lensed halo
        float tFlow = u_time * 0.18;
        float ring_phase = log(r_halo / rh + 1.0) * 34.0 - tFlow * 0.8;
        float azim_warp = fbm(vec2(r_halo * 9.0, sin(ang) * 2.2 + cos(ang) * 2.2 + tFlow * 0.3)) * 1.2;
        float thick_bands = 0.52 + 0.48 * cos(ring_phase + azim_warp);
        float fine_grooves = 0.5 + 0.5 * sin(ring_phase * 2.8 - azim_warp * 1.5);
        float streaks = fbm(vec2(r_halo * 24.0, sin(ang * 2.0) * 3.5 + cos(ang * 2.0) * 3.5 - tFlow * 0.4));

        float ring_pattern = (0.35 + 0.45 * pow(thick_bands, 1.35) + 0.25 * fine_grooves) * (0.65 + 0.65 * streaks);

        // Relativistic Doppler beaming: right side blazing cream-white & golden-amber; upper-left has clumpy dark dust lanes
        float doppler_halo = clamp(0.58 + 0.62 * (px / (r + 0.06)), 0.32, 1.25);
        float upper_left_clumps = clamp((-px * 2.8) * (py * 2.4 + 0.3), 0.0, 1.0) * pow(fbm(vec2(px * 14.0, py * 14.0 - tFlow * 0.5)), 1.3);
        float halo_intensity = halo_env * ring_pattern * doppler_halo * (1.0 - 0.62 * upper_left_clumps);

        // Distinct outer thin lensed ring arcs (as seen around the outer halo perimeter in the video)
        float outer_arc1 = exp(-pow((r_halo - 0.50) / 0.014, 2.0)) * (0.5 + 0.5 * streaks) * 0.55;
        float outer_arc2 = exp(-pow((r_halo - 0.55) / 0.009, 2.0)) * (0.5 + 0.5 * streaks) * 0.35;
        halo_intensity += (outer_arc1 + outer_arc2) * doppler_halo;

        // -----------------------------------------------------------------
        // 2. RAZOR-THIN INNER PHOTON RING & BLAZING EVENT HORIZON RIM
        // -----------------------------------------------------------------
        float photon_ring = exp(-pow((r - rh) / 0.0045, 2.0)) * (0.75 + 0.45 * clamp(px / (r + 0.01), -0.4, 1.0));
        float inner_rim = exp(-max(0.0, r_halo - rh) * 18.0) * clamp((r - rh * 0.98) / 0.01, 0.0, 1.0) * doppler_halo * 0.85;
        halo_intensity += inner_rim;

        // -----------------------------------------------------------------
        // 3. FOREGROUND THICK CLUMPED ACCRETION COLUMN ("Gumpalan Garis Tebal")
        // -----------------------------------------------------------------
        float col_curve = -0.015 * py + 0.020 * (py * py * py);
        float cx = px - col_curve;
        float col_half_w = 0.092 + 0.032 * (py * py);
        float col_env = exp(-pow(cx / col_half_w, 2.0) * 1.55) * exp(-(py * py) * 0.32);

        // Thick rope-like clumped plasma filaments flowing along the vertical column
        float flowY = py * 3.6 - u_time * 0.42;
        float warp_y = flowY + fbm(vec2(cx * 10.0, flowY * 0.7)) * 0.85;
        float warp_x = cx * 32.0 + (fbm(vec2(cx * 14.0, flowY * 1.2)) - 0.5) * 3.2;
        float f_main = fbm(vec2(warp_x, warp_y));
        float f_detail = fbm(vec2(warp_x * 2.1 + 4.3, warp_y * 2.2 - 1.9));

        // High-contrast thick braided ridges ("gumpalan garis yang tebal")
        float ridge1 = 1.0 - abs(2.0 * f_main - 1.0);
        float ridge2 = 1.0 - abs(2.0 * f_detail - 1.0);
        float clump_bundles = pow(clamp(0.65 * ridge1 + 0.35 * ridge2, 0.0, 1.0), 1.5);

        // Heavy dark charcoal-brown cosmic dust clumps embedded inside the left & center of the column
        float dust_field = fbm(vec2(cx * 26.0 - f_main * 2.2, flowY * 1.3 + 7.1));
        float left_center_mask = clamp((0.032 - cx) / 0.045, 0.0, 1.0);
        float dark_clumps = clamp((dust_field - 0.34) * 3.4, 0.0, 1.0) * left_center_mask;

        // Billowing dark smoke on the upper-left edge of the column
        float upper_smoke = exp(-pow((cx + 0.088) / 0.065, 2.0)) * clamp((py + 0.05) * 1.4, 0.0, 1.0) * pow(fbm(vec2(cx * 18.0, flowY * 0.95)), 1.2);

        // Blazing white-cream plasma spine along the right edge of the column & flaring into the top/bottom teardrop junctions
        float junction_flare = 0.45 + 1.15 * exp(-pow((abs(py) - 0.34) / 0.18, 2.0));
        float spine_center = 0.034 + 0.015 * (py * py);
        float spine_width = 0.018 + 0.024 * clamp((abs(py) - 0.18) * 2.5, 0.0, 1.0);
        float hot_spine = exp(-pow((cx - spine_center) / spine_width, 2.0)) * (0.55 + 0.65 * clump_bundles) * junction_flare * exp(-(py * py) * 0.45);

        // Color Palette matching the WhatsApp reference video
        vec3 c_dark   = vec3(0.14, 0.05, 0.02);
        vec3 c_rust   = vec3(0.75, 0.28, 0.07);
        vec3 c_orange = vec3(0.95, 0.50, 0.16);
        vec3 c_gold   = vec3(1.00, 0.84, 0.60);
        vec3 c_white  = vec3(1.00, 0.98, 0.94);

        float h_val = clamp(halo_intensity * 1.45, 0.0, 1.8) * outside_eh;
        vec3 halo_col =
          clamp(h_val * 1.6, 0.0, 1.0) * c_rust * 0.55 +
          clamp((h_val - 0.18) * 1.5, 0.0, 1.0) * c_orange * 0.65 +
          clamp((h_val - 0.42) * 1.6, 0.0, 1.0) * c_gold * 0.80 +
          clamp((h_val - 0.78) * 1.8, 0.0, 1.0) * c_white * 0.90 +
          photon_ring * c_white * 0.95;

        // Foreground clumped column colors
        float col_plasma = col_env * (0.28 + 1.25 * clump_bundles);
        float col_alpha = clamp(col_env * 1.45 + upper_smoke * 0.9, 0.0, 1.0);

        // When zooming deep into the Black Hole (u_coreDarkness -> 0.0), smoothly part/dissolve the center of the foreground column over the shadow so the portal opens cleanly!
        float coreMask = smoothstep(rh * 1.01, rh * 0.97, r);
        float columnPortalFade = mix(0.15, 1.0, u_coreDarkness);
        col_alpha *= mix(1.0, columnPortalFade, coreMask);

        vec3 fg_col =
          clamp(col_plasma * 1.5, 0.0, 1.0) * c_rust * 0.75 +
          clamp((col_plasma - 0.25) * 1.6, 0.0, 1.0) * c_orange * 0.85 +
          clamp((col_plasma - 0.60) * 1.8, 0.0, 1.0) * c_gold * 0.70 +
          hot_spine * c_white * 0.95;

        fg_col = fg_col * (1.0 - 0.84 * dark_clumps) + dark_clumps * col_env * c_dark * 0.35;
        fg_col = fg_col * (1.0 - 0.90 * upper_smoke);
        fg_col *= mix(1.0, columnPortalFade, coreMask);

        vec3 totalLight = halo_col * (1.0 - col_alpha * 0.90) + fg_col;
        totalLight = pow(clamp(totalLight, 0.0, 1.0), vec3(0.92));

        // -----------------------------------------------------------------
        // 4. FOREGROUND ICY-BLUE PLANET LIMB ON LEFT (Exact Match to Video!)
        // -----------------------------------------------------------------
        vec2 planetCenter = vec2(-0.62 - u_zoom * 0.85, 0.18 - u_zoom * 0.25);
        vec2 pp = (v_uv - planetCenter) * vec2(aspect, 1.0);
        float planetR = 0.82;
        float pd = length(pp);

        vec3 planetCol = vec3(0.0);
        float planetAlpha = 0.0;

        if (pd < planetR + 0.08) {
          if (pd < planetR) {
            vec2 sn = pp / planetR;
            float pz = sqrt(max(0.0, 1.0 - dot(sn, sn)));
            float cloudTex = fbm(sn * 14.0 + vec2(u_time * 0.02, -u_time * 0.01));
            float ridges = fbm(sn * 32.0);
            float limbFactor = pow(1.0 - pz, 1.8);

            vec3 iceDay = mix(vec3(0.14, 0.24, 0.36), vec3(0.72, 0.86, 0.96), cloudTex * 0.7 + ridges * 0.3);
            iceDay = mix(iceDay, vec3(0.92, 0.98, 1.0), limbFactor * 0.88);
            planetCol = iceDay;
            planetAlpha = 1.0;
          } else {
            float h = (pd - planetR) / 0.08;
            float atmoGlow = exp(-h * 4.8);
            planetCol = mix(vec3(0.38, 0.78, 1.0), vec3(1.0, 0.98, 0.95), exp(-h * 9.0));
            planetAlpha = atmoGlow * 0.92;
          }
        }

        // -----------------------------------------------------------------
        // 5. EVENT HORIZON BLACK CORE & PORTAL DISSOLVE LOGIC
        //    When u_coreDarkness == 1.0 (idle), the interior (r < rh) behind the column is solid pitch black.
        //    As you zoom in, u_coreDarkness fades -> 0.0 so the black center dissolves into a transparent portal!
        // -----------------------------------------------------------------
        float lightLum = clamp(length(totalLight) * 0.85, 0.0, 1.0);
        float outerAlpha = clamp(lightLum + col_alpha * 0.85 + halo_env * 0.55, 0.0, 1.0);

        // Inside the black hole shadow (where not covered by the foreground clumped column):
        float uncoveredCore = coreMask * (1.0 - col_alpha * 0.92);
        vec3 finalRGB = mix(totalLight, vec3(0.008, 0.008, 0.012), uncoveredCore * u_coreDarkness);

        // Subtle golden-cyan gravitational refraction shimmer as the black core dissolves open
        float portalShimmer = uncoveredCore * (1.0 - u_coreDarkness) * sin(u_zoom * 12.0 - r * 40.0) * 0.08;
        finalRGB += vec3(0.95, 0.75, 0.4) * max(0.0, portalShimmer);

        float finalAlpha = mix(outerAlpha, max(col_alpha, u_coreDarkness), coreMask);

        // Add rich cosmic starfield & subtle Milky Way nebula glow around Gargantua so the space backdrop is never flat black
        float bgNebula = fbm(v_uv * 4.5 + vec2(u_time * 0.015, -u_time * 0.01)) * fbm(v_uv * 9.0 - vec2(u_time * 0.01));
        vec3 nebulaGlow = mix(vec3(0.04, 0.07, 0.14), vec3(0.22, 0.14, 0.08), v_uv.x) * pow(bgNebula, 1.4) * 1.35 * (1.0 - coreMask);
        float starCell = hash21(floor(v_uv * u_res * 0.35));
        float starTwinkle = 0.5 + 0.5 * sin(u_time * 3.0 + starCell * 62.8);
        float starSpark = step(0.9965, starCell) * starTwinkle * (1.0 - coreMask);
        finalRGB += nebulaGlow + vec3(0.95, 0.97, 1.0) * starSpark * 0.85;
        finalAlpha = clamp(finalAlpha + length(nebulaGlow) * 0.85 + starSpark * 0.65, 0.0, 1.0);

        // Composite Foreground Icy Planet on the left over the outer edge of the Black Hole
        finalRGB = mix(finalRGB, planetCol, planetAlpha);
        finalAlpha = max(finalAlpha, planetAlpha);

        gl_FragColor = vec4(finalRGB, finalAlpha * u_portalAlpha);
      }
    `;

    function initBlackHolePortalShader() {
      if (!bhGl) return;
      function compile(type, src) {
        const s = bhGl.createShader(type);
        bhGl.shaderSource(s, src);
        bhGl.compileShader(s);
        return s;
      }
      const vs = compile(bhGl.VERTEX_SHADER, BH_VS);
      const fs = compile(bhGl.FRAGMENT_SHADER, BH_FS);
      bhProgram = bhGl.createProgram();
      bhGl.attachShader(bhProgram, vs);
      bhGl.attachShader(bhProgram, fs);
      bhGl.linkProgram(bhProgram);
      bhGl.useProgram(bhProgram);

      const buf = bhGl.createBuffer();
      bhGl.bindBuffer(bhGl.ARRAY_BUFFER, buf);
      bhGl.bufferData(bhGl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), bhGl.STATIC_DRAW);
      const loc = bhGl.getAttribLocation(bhProgram, 'a_pos');
      bhGl.enableVertexAttribArray(loc);
      bhGl.vertexAttribPointer(loc, 2, bhGl.FLOAT, false, 0, 0);

      ['u_res', 'u_time', 'u_mouse', 'u_zoom', 'u_coreDarkness', 'u_portalAlpha'].forEach(name => {
        bhUniforms[name] = bhGl.getUniformLocation(bhProgram, name);
      });
    }
    initBlackHolePortalShader();

    // =====================================================================
    // 8. TRUE 3D THREE.JS SPACE ENGINE (3D PLANETS, EARTH, MOON & GALAXY)
    // =====================================================================
    const webglCanvas = document.getElementById('cosmic-webgl');
    const renderer = new THREE.WebGLRenderer({
      canvas: webglCanvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020205, 0.00055);

    const camera = new THREE.PerspectiveCamera(48, window.innerWidth / window.innerHeight, 0.1, 4000);

    const ambientLight = new THREE.AmbientLight(0x161c2e, 0.55);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff4e0, 2.6);
    sunLight.position.set(160, 65, 140);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.1);
    rimLight.position.set(-140, -50, -90);
    scene.add(rimLight);

    function createProceduralPlanetTextures(type) {
      const w = 512, h = 256;
      const diffCanvas = document.createElement('canvas');
      diffCanvas.width = w; diffCanvas.height = h;
      const dCtx = diffCanvas.getContext('2d');

      const bumpCanvas = document.createElement('canvas');
      bumpCanvas.width = w; bumpCanvas.height = h;
      const bCtx = bumpCanvas.getContext('2d');

      const specCanvas = document.createElement('canvas');
      specCanvas.width = w; specCanvas.height = h;
      const sCtx = specCanvas.getContext('2d');

      const imgDiff = dCtx.createImageData(w, h);
      const imgBump = bCtx.createImageData(w, h);
      const imgSpec = sCtx.createImageData(w, h);

      function hash(n) { return Math.abs((Math.sin(n) * 43758.5453123) % 1); }
      function noise(x, y) {
        const ix = Math.floor(x), iy = Math.floor(y);
        const fx = x - ix, fy = y - iy;
        const ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
        const n00 = hash(ix + iy * 57.0);
        const n10 = hash(ix + 1 + iy * 57.0);
        const n01 = hash(ix + (iy + 1) * 57.0);
        const n11 = hash(ix + 1 + (iy + 1) * 57.0);
        return (n00 * (1 - ux) + n10 * ux) * (1 - uy) + (n01 * (1 - ux) + n11 * ux) * uy;
      }
      function fbm(x, y, octaves = 5) {
        let v = 0, amp = 0.5, freq = 1;
        for (let i = 0; i < octaves; i++) {
          v += amp * noise(x * freq, y * freq);
          freq *= 2.04;
          amp *= 0.5;
        }
        return v;
      }

      for (let y = 0; y < h; y++) {
        const v = y / h;
        const polar = Math.abs(v - 0.5) * 2.0;

        for (let x = 0; x < w; x++) {
          const u = x / w;
          const idx = (y * w + x) * 4;
          const nx = Math.cos(u * Math.PI * 2) * 3.5 + 10;
          const ny = Math.sin(u * Math.PI * 2) * 3.5 + 10;
          const nz = v * 6.0;

          if (type === 'gas_giant') {
            const warp = fbm(nx * 1.5, nz * 3.0, 4) * 0.45;
            const bandCoord = v * 18.0 + warp * 4.5;
            const band1 = Math.sin(bandCoord * Math.PI) * 0.5 + 0.5;
            const band2 = fbm(nx * 3.2 + band1, bandCoord * 1.6, 5);
            const stormDist = Math.hypot((u - 0.38) * 3.5, (v - 0.62) * 6.5);
            const storm = Math.exp(-stormDist * stormDist * 4.0);

            const r = Math.min(255, Math.floor(38 + band1 * 95 + band2 * 65 + storm * 85));
            const g = Math.min(255, Math.floor(48 + band1 * 82 + band2 * 62 + storm * 40));
            const b = Math.min(255, Math.floor(72 + band1 * 70 + band2 * 78));

            imgDiff.data[idx] = r; imgDiff.data[idx + 1] = g; imgDiff.data[idx + 2] = b; imgDiff.data[idx + 3] = 255;
            const bVal = Math.floor((band2 * 0.7 + storm * 0.3) * 255);
            imgBump.data[idx] = imgBump.data[idx + 1] = imgBump.data[idx + 2] = bVal; imgBump.data[idx + 3] = 255;
          } else if (type === 'earth') {
            const elev = fbm(nx * 1.8, nz * 1.8 + ny * 0.7, 6);
            const detail = fbm(nx * 8.0, nz * 8.0, 4);
            const isIce = polar > 0.84 - detail * 0.08;
            const isLand = elev > 0.49;

            let r, g, b, bump = 10, spec = 220;
            if (isIce) {
              r = 235; g = 242; b = 250; bump = 140; spec = 90;
            } else if (!isLand) {
              const shelf = Math.max(0, (elev - 0.32) / 0.17);
              r = Math.floor(6 + shelf * 18);
              g = Math.floor(24 + shelf * 58);
              b = Math.floor(58 + shelf * 85);
              bump = 4; spec = 245;
            } else {
              const mtn = Math.max(0, (elev - 0.49) / 0.35);
              const arid = fbm(nx * 2.5 + 30, nz * 2.5, 3);
              r = Math.floor(28 + arid * 95 + mtn * 85);
              g = Math.floor(58 + (1 - arid) * 45 + mtn * 65);
              b = Math.floor(26 + mtn * 65);
              bump = Math.min(255, Math.floor(60 + mtn * 195 + detail * 40));
              spec = 15;
            }

            imgDiff.data[idx] = r; imgDiff.data[idx + 1] = g; imgDiff.data[idx + 2] = b; imgDiff.data[idx + 3] = 255;
            imgBump.data[idx] = imgBump.data[idx + 1] = imgBump.data[idx + 2] = bump; imgBump.data[idx + 3] = 255;
            imgSpec.data[idx] = imgSpec.data[idx + 1] = imgSpec.data[idx + 2] = spec; imgSpec.data[idx + 3] = 255;
          } else if (type === 'lava_planet') {
            const n1 = fbm(nx * 3.0, nz * 3.0, 5);
            const crack = Math.abs(n1 - 0.52);
            const isMagma = crack < 0.028;
            imgDiff.data[idx] = isMagma ? 255 : Math.floor(22 + n1 * 38);
            imgDiff.data[idx + 1] = isMagma ? 115 : Math.floor(18 + n1 * 28);
            imgDiff.data[idx + 2] = isMagma ? 20 : Math.floor(20 + n1 * 32);
            imgDiff.data[idx + 3] = 255;

            const bVal = isMagma ? 10 : Math.floor(n1 * 255);
            imgBump.data[idx] = imgBump.data[idx + 1] = imgBump.data[idx + 2] = bVal; imgBump.data[idx + 3] = 255;
          } else if (type === 'moon') {
            const n1 = fbm(nx * 4.0, nz * 4.0, 5);
            const n2 = fbm(nx * 14.0, nz * 14.0, 3);
            const c = Math.floor(85 + n1 * 110 + (n2 - 0.5) * 45);
            imgDiff.data[idx] = c; imgDiff.data[idx + 1] = c; imgDiff.data[idx + 2] = Math.min(255, c + 6); imgDiff.data[idx + 3] = 255;
            imgBump.data[idx] = imgBump.data[idx + 1] = imgBump.data[idx + 2] = Math.floor((n1 * 0.6 + n2 * 0.4) * 255);
            imgBump.data[idx + 3] = 255;
          }
        }
      }

      dCtx.putImageData(imgDiff, 0, 0);
      bCtx.putImageData(imgBump, 0, 0);
      sCtx.putImageData(imgSpec, 0, 0);

      return {
        diffTex: new THREE.CanvasTexture(diffCanvas),
        bumpTex: new THREE.CanvasTexture(bumpCanvas),
        specTex: new THREE.CanvasTexture(specCanvas)
      };
    }

    function createAtmosphereMesh(radius, colorHex, intensity = 1.15) {
      const geo = new THREE.SphereGeometry(radius * 1.045, 48, 48);
      const mat = new THREE.ShaderMaterial({
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          uniform vec3 uColor;
          uniform float uIntensity;
          void main() {
            float rim = pow(0.68 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.8);
            gl_FragColor = vec4(uColor, clamp(rim * uIntensity, 0.0, 0.85));
          }
        `,
        uniforms: {
          uColor: { value: new THREE.Color(colorHex) },
          uIntensity: { value: intensity }
        },
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true,
        depthWrite: false
      });
      return new THREE.Mesh(geo, mat);
    }

    // 1. PLANET KRONOS-IX: REAL 3D RINGED GAS GIANT
    const kronosGroup = new THREE.Group();
    kronosGroup.position.set(-22, 12, -95);
    kronosGroup.rotation.z = 0.28;
    kronosGroup.rotation.x = 0.22;
    scene.add(kronosGroup);

    const kronosTex = createProceduralPlanetTextures('gas_giant');
    const kronosMesh = new THREE.Mesh(
      new THREE.SphereGeometry(7.2, 64, 64),
      new THREE.MeshStandardMaterial({
        map: kronosTex.diffTex,
        bumpMap: kronosTex.bumpTex,
        bumpScale: 0.25,
        roughness: 0.68,
        metalness: 0.08
      })
    );
    kronosGroup.add(kronosMesh);
    kronosGroup.add(createAtmosphereMesh(7.2, 0x60a5fa, 1.25));

    const kRingGeo = new THREE.RingGeometry(9.2, 19.5, 96, 4);
    const kRingMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vPos;
        void main() {
          vPos = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vPos;
        void main() {
          float r = length(vPos.xy);
          float normR = (r - 9.2) / (19.5 - 9.2);
          float bands = sin(normR * 95.0) * 0.5 + 0.5;
          float gap = smoothstep(0.02, 0.04, abs(normR - 0.48));
          vec3 col = mix(vec3(0.05, 0.07, 0.12), vec3(0.55, 0.68, 0.85), (1.0 - normR * 0.7) * bands);
          float alpha = gap * (0.45 + 0.45 * bands) * smoothstep(0.0, 0.06, normR) * smoothstep(1.0, 0.9, normR);
          gl_FragColor = vec4(col, alpha);
        }
      `,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false
    });
    const kronosRingMesh = new THREE.Mesh(kRingGeo, kRingMat);
    kronosRingMesh.rotation.x = Math.PI * 0.5;
    kronosGroup.add(kronosRingMesh);

    // 2. PLANET PYRO-V: REAL 3D VOLCANIC EXOWORLD
    const pyroGroup = new THREE.Group();
    pyroGroup.position.set(24, -14, -65);
    scene.add(pyroGroup);

    const pyroTex = createProceduralPlanetTextures('lava_planet');
    const pyroMesh = new THREE.Mesh(
      new THREE.SphereGeometry(4.2, 48, 48),
      new THREE.MeshStandardMaterial({
        map: pyroTex.diffTex,
        bumpMap: pyroTex.bumpTex,
        bumpScale: 0.35,
        roughness: 0.75
      })
    );
    pyroGroup.add(pyroMesh);
    pyroGroup.add(createAtmosphereMesh(4.2, 0xf97316, 1.1));

    // 3. REAL 3D EARTH & ORBITING 3D MOON (SCENE 3 — ABOUT)
    const earthGroup = new THREE.Group();
    earthGroup.position.set(0, -26, -165);
    scene.add(earthGroup);

    const earthTex = createProceduralPlanetTextures('earth');
    const earthMesh = new THREE.Mesh(
      new THREE.SphereGeometry(22.0, 64, 64),
      new THREE.MeshPhongMaterial({
        map: earthTex.diffTex,
        bumpMap: earthTex.bumpTex,
        bumpScale: 0.45,
        specularMap: earthTex.specTex,
        specular: new THREE.Color(0x60a5fa),
        shininess: 28
      })
    );
    earthGroup.add(earthMesh);
    earthGroup.add(createAtmosphereMesh(22.0, 0x38bdf8, 1.55));

    const moonTex = createProceduralPlanetTextures('moon');
    const moonMesh = new THREE.Mesh(
      new THREE.SphereGeometry(2.6, 48, 48),
      new THREE.MeshStandardMaterial({
        map: moonTex.diffTex,
        bumpMap: moonTex.bumpTex,
        bumpScale: 0.28,
        roughness: 0.88
      })
    );
    moonMesh.position.set(-28, 16, 12);
    earthGroup.add(moonMesh);

    // 4. 3D VOLUMETRIC SPIRAL GALAXY (SCENE 5 — CONTACT)
    const galaxyGroup = new THREE.Group();
    galaxyGroup.position.set(16, 1, -310);
    galaxyGroup.rotation.x = 0.62;
    galaxyGroup.rotation.z = -0.35;
    scene.add(galaxyGroup);

    const galCount = 18000;
    const galPos = new Float32Array(galCount * 3);
    const galCols = new Float32Array(galCount * 3);
    const colorInside = new THREE.Color(0xfff3d1);
    const colorMid = new THREE.Color(0xe59838);
    const colorOuter = new THREE.Color(0x3878c8);

    for (let i = 0; i < galCount; i++) {
      const r = Math.pow(Math.random(), 1.5) * 34.0;
      const spinAngle = r * 0.38;
      const branchAngle = ((i % 3) / 3) * Math.PI * 2;

      const randX = Math.pow(Math.random(), 2.6) * (Math.random() < 0.5 ? 1 : -1) * (0.6 + r * 0.12);
      const randY = Math.pow(Math.random(), 3.0) * (Math.random() < 0.5 ? 1 : -1) * (0.4 + r * 0.06);
      const randZ = Math.pow(Math.random(), 2.6) * (Math.random() < 0.5 ? 1 : -1) * (0.6 + r * 0.12);

      galPos[i * 3] = Math.cos(branchAngle + spinAngle) * r + randX;
      galPos[i * 3 + 1] = randY;
      galPos[i * 3 + 2] = Math.sin(branchAngle + spinAngle) * r + randZ;

      const mixedColor = colorInside.clone();
      if (r < 12) {
        mixedColor.lerp(colorMid, r / 12);
      } else {
        mixedColor.copy(colorMid).lerp(colorOuter, (r - 12) / 22);
      }
      galCols[i * 3] = mixedColor.r;
      galCols[i * 3 + 1] = mixedColor.g;
      galCols[i * 3 + 2] = mixedColor.b;
    }

    const galGeo = new THREE.BufferGeometry();
    galGeo.setAttribute('position', new THREE.BufferAttribute(galPos, 3));
    galGeo.setAttribute('color', new THREE.BufferAttribute(galCols, 3));
    const galMat = new THREE.PointsMaterial({
      size: 0.24,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const spiralGalaxyPoints = new THREE.Points(galGeo, galMat);
    galaxyGroup.add(spiralGalaxyPoints);

    // 5. DEEP 3D STARFIELD
    const deepStarCount = 7000;
    const deepStarPos = new Float32Array(deepStarCount * 3);
    const deepStarCol = new Float32Array(deepStarCount * 3);
    for (let i = 0; i < deepStarCount; i++) {
      deepStarPos[i * 3] = (Math.random() - 0.5) * 480;
      deepStarPos[i * 3 + 1] = (Math.random() - 0.5) * 320;
      deepStarPos[i * 3 + 2] = 60 - Math.random() * 440;

      const tint = Math.random();
      deepStarCol[i * 3] = tint > 0.7 ? 1.0 : 0.85;
      deepStarCol[i * 3 + 1] = tint > 0.7 ? 0.92 : 0.92;
      deepStarCol[i * 3 + 2] = tint > 0.3 ? 1.0 : 0.78;
    }
    const deepStarGeo = new THREE.BufferGeometry();
    deepStarGeo.setAttribute('position', new THREE.BufferAttribute(deepStarPos, 3));
    deepStarGeo.setAttribute('color', new THREE.BufferAttribute(deepStarCol, 3));
    const deepStarMat = new THREE.PointsMaterial({
      size: 0.32,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false
    });
    const deepStarPoints = new THREE.Points(deepStarGeo, deepStarMat);
    scene.add(deepStarPoints);

    const cameraSpline = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 52),
      new THREE.Vector3(6, 0, 4),
      new THREE.Vector3(0, 0, -55),
      new THREE.Vector3(-4, -3, -125),
      new THREE.Vector3(0, -1, -215),
      new THREE.Vector3(0, 2, -268)
    ]);

    const lookAtSpline = new THREE.CatmullRomCurve3([
      new THREE.Vector3(4, 0, 0),
      new THREE.Vector3(4, 0, -25),
      new THREE.Vector3(2, -2, -85),
      new THREE.Vector3(0, -14, -165),
      new THREE.Vector3(0, 4, -255),
      new THREE.Vector3(10, 1, -310)
    ]);

    // =====================================================================
    // 9. 2D PRECISION OVERLAY CANVAS + MAIN RENDER LOOP
    // =====================================================================
    const canvas = document.getElementById('cosmic-stage');
    const ctx = canvas.getContext('2d');
    let cw = window.innerWidth;
    let ch = window.innerHeight;

    function resizeAll() {
      cw = window.innerWidth;
      ch = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = cw * dpr;
      canvas.height = ch * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (bhGl) {
        const bhScale = Math.min(dpr, 1.5);
        bhCanvas.width = Math.floor(cw * bhScale);
        bhCanvas.height = Math.floor(ch * bhScale);
        bhGl.viewport(0, 0, bhCanvas.width, bhCanvas.height);
      }

      camera.aspect = cw / ch;
      camera.updateProjectionMatrix();
      renderer.setSize(cw, ch);
    }
    window.addEventListener('resize', resizeAll);
    resizeAll();

    const webNodes = Array.from({ length: 72 }, (_, i) => ({
      angle: (i / 72) * Math.PI * 2 + (Math.random() - 0.5) * 0.35,
      dist: 50 + Math.random() * 520
    }));

    const starTrails = Array.from({ length: 200 }, () => ({
      radius: 58 + Math.random() * Math.max(cw, ch) * 0.65,
      startAngle: Math.random() * Math.PI * 2,
      arcLen: 0.14 + Math.random() * 0.72,
      width: Math.random() * 1.1 + 0.25,
      alpha: 0.15 + Math.random() * 0.58,
      tint: Math.random() > 0.78 ? 'rgba(255, 236, 195,' : 'rgba(215, 232, 255,'
    }));

    let lastFrameTime = performance.now();
      let animFrameId = null;
      let isDisposed = false;
    let timeTick = 0;

    function animateUniverse(now) {
        if (isDisposed) return;
      const dt = Math.min(0.05, (now - lastFrameTime) / 1000);
      lastFrameTime = now;
      timeTick += dt;

      const smoothFactor = 1.0 - Math.exp(-dt * 7.5);
      const mouseFactor = 1.0 - Math.exp(-dt * 6.0);

      worldState.smoothMouseX += (worldState.rawMouseX - worldState.smoothMouseX) * mouseFactor;
      worldState.smoothMouseY += (worldState.rawMouseY - worldState.smoothMouseY) * mouseFactor;

      if (worldState.preloaderDone && !worldState.isWarping) {
        const diff = worldState.targetScroll - worldState.currentScroll;
        worldState.scrollVelocity = diff;
        worldState.currentScroll += diff * smoothFactor;

        masterTimeline.seek(worldState.currentScroll * masterTimeline.duration);
        syncDOMScenesWithScroll(worldState.currentScroll);
        cosmicAudio.modulateWithVelocity(diff);
      }

      // 1. Update 3D Planet Rotations & Orbits
      kronosMesh.rotation.y = timeTick * 0.18;
      kronosRingMesh.rotation.z = -timeTick * 0.06;

      pyroMesh.rotation.y = -timeTick * 0.24;
      pyroMesh.rotation.x = timeTick * 0.08;

      earthMesh.rotation.y = timeTick * 0.09;
      const moonOrbitAng = timeTick * 0.22 + worldState.currentScroll * 3.0;
      moonMesh.position.set(
        Math.cos(moonOrbitAng) * 32,
        Math.sin(moonOrbitAng * 0.7) * 10 + 8,
        Math.sin(moonOrbitAng) * 24
      );
      moonMesh.rotation.y = timeTick * 0.15;

      spiralGalaxyPoints.rotation.y = timeTick * 0.12;

      const t = Math.max(0, Math.min(1, worldState.currentScroll));
      const camPos = cameraSpline.getPointAt(t);
      const lookTarget = lookAtSpline.getPointAt(t);

      camera.position.set(
        camPos.x + worldState.smoothMouseX * 4.5,
        camPos.y - worldState.smoothMouseY * 3.2,
        camPos.z
      );
      camera.lookAt(
        lookTarget.x + worldState.smoothMouseX * 2.0,
        lookTarget.y - worldState.smoothMouseY * 1.5,
        lookTarget.z
      );

      // Render Layer 0: 3D Three.js Scene
      renderer.render(scene, camera);

      // Render Layer 1: 2D Precision Layer (Tesseract, Comet, Star Trails)
      ctx.clearRect(0, 0, cw, ch);
      const cx = cw * 0.5 + worldState.smoothMouseX * 18;
      const cy = ch * 0.5 + worldState.smoothMouseY * 12;

      if (!worldState.preloaderDone) {
        if (bhGl) {
          bhGl.clearColor(0, 0, 0, 0);
          bhGl.clear(bhGl.COLOR_BUFFER_BIT);
        }
        drawSupernovaPreloader(cx, cy);
        animFrameId = requestAnimationFrame(animateUniverse);
        return;
      }

      if (worldState.tesseractAlpha > 0.01) {
        drawArchitecturalTesseract(worldState.tesseractAlpha, worldState.tesseractDepth);
      }

      if (worldState.aboutSkyAlpha > 0.01) {
        drawRealisticComet(worldState.aboutSkyAlpha, worldState.cometProgress);
      }

      if (worldState.starTrailAlpha > 0.01) {
        drawAstrophotographyStarTrails(worldState.starTrailAlpha, worldState.starTrailAngle);
      }

      if (worldState.warpStreak > 0.01) {
        drawHyperspaceStreaks(cx, cy, worldState.warpStreak);
      }

      if (worldState.warpFlash > 0.01) {
        ctx.fillStyle = `rgba(245, 248, 255, ${worldState.warpFlash})`;
        ctx.fillRect(0, 0, cw, ch);
      }

      // Render Layer 2: Photorealistic Gargantua Black Hole Portal Shader
      // (As you zoom in, u_coreDarkness fades from 1.0 -> 0.0 so the Tesseract & 3D scene shine right through the black core!)
      if (bhGl && bhProgram) {
        bhGl.clearColor(0, 0, 0, 0);
        bhGl.clear(bhGl.COLOR_BUFFER_BIT);
        if (worldState.bhPortalAlpha > 0.005) {
          bhGl.useProgram(bhProgram);
          bhGl.uniform2f(bhUniforms.u_res, bhCanvas.width, bhCanvas.height);
          bhGl.uniform1f(bhUniforms.u_time, timeTick);
          bhGl.uniform2f(bhUniforms.u_mouse, worldState.smoothMouseX, worldState.smoothMouseY);
          bhGl.uniform1f(bhUniforms.u_zoom, worldState.bhZoomProgress);
          bhGl.uniform1f(bhUniforms.u_coreDarkness, worldState.bhCoreDarkness);
          bhGl.uniform1f(bhUniforms.u_portalAlpha, worldState.bhPortalAlpha);
          bhGl.drawArrays(bhGl.TRIANGLE_STRIP, 0, 4);
        }
      }

      animFrameId = requestAnimationFrame(animateUniverse);
    }

    function drawHyperspaceStreaks(cx, cy, streak) {
      ctx.save();
      for (let i = 0; i < 140; i++) {
        const ang = (i / 140) * Math.PI * 2 + (i % 7) * 0.13;
        const rStart = 30 + ((i * 37 + timeTick * 600) % (Math.max(cw, ch) * 0.6));
        const rEnd = rStart + streak * 260;
        ctx.strokeStyle = i % 3 === 0
          ? `rgba(125, 211, 252, ${streak * 0.85})`
          : `rgba(255, 251, 235, ${streak * 0.75})`;
        ctx.lineWidth = (i % 4 === 0) ? 2.2 : 1.1;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(ang) * rStart, cy + Math.sin(ang) * rStart);
        ctx.lineTo(cx + Math.cos(ang) * rEnd, cy + Math.sin(ang) * rEnd);
        ctx.stroke();
      }
      ctx.restore();
    }

    function drawSupernovaPreloader(cx, cy) {
      const p = worldState.preloaderProgress / 100;
      const webAlpha = worldState.cosmicWebAlpha;

      if (webAlpha > 0.01) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.strokeStyle = `rgba(232, 121, 189, ${webAlpha * 0.42})`;
        ctx.lineWidth = 0.85;
        for (let i = 0; i < webNodes.length; i++) {
          const n1 = webNodes[i];
          const spread = 0.35 + p * 1.35;
          const x1 = Math.cos(n1.angle + timeTick * 0.08) * n1.dist * spread;
          const y1 = Math.sin(n1.angle + timeTick * 0.08) * n1.dist * spread;

          ctx.fillStyle = `rgba(253, 215, 238, ${webAlpha * 0.85})`;
          ctx.fillRect(x1 - 1, y1 - 1, 2, 2);

          for (let j = i + 1; j < Math.min(webNodes.length, i + 4); j++) {
            const n2 = webNodes[j];
            const x2 = Math.cos(n2.angle + timeTick * 0.08) * n2.dist * spread;
            const y2 = Math.sin(n2.angle + timeTick * 0.08) * n2.dist * spread;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }
        }
        ctx.restore();
      }

      const coreR = Math.min(cw, ch) * 0.24 * worldState.plasmaIntensity;
      if (coreR > 2) {
        ctx.save();
        ctx.translate(cx, cy);
        for (let l = 0; l < 5; l++) {
          const ang = timeTick * (0.3 + l * 0.1) + l * 1.2;
          const ox = Math.cos(ang) * (l * 8);
          const oy = Math.sin(ang) * (l * 8);
          const g = ctx.createRadialGradient(ox, oy, coreR * 0.04, ox, oy, coreR * (1.2 + l * 0.15));
          g.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
          g.addColorStop(0.28, 'rgba(244, 114, 182, 0.55)');
          g.addColorStop(0.62, 'rgba(139, 92, 246, 0.18)');
          g.addColorStop(1, 'rgba(2, 2, 4, 0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(0, 0, coreR * 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    }

    function drawArchitecturalTesseract(alpha, depth) {
      ctx.save();
      ctx.globalAlpha = alpha;
      const vpX = cw * 0.5 + (worldState.activeRoomIdx % 2 === 0 ? -45 : 45) - worldState.smoothMouseX * 30;
      const vpY = ch * 0.5 - worldState.smoothMouseY * 20;

      const bgGrad = ctx.createRadialGradient(vpX, vpY, 30, vpX, vpY, Math.max(cw, ch) * 0.78);
      bgGrad.addColorStop(0, 'rgba(28, 18, 8, 0.25)');
      bgGrad.addColorStop(0.6, 'rgba(8, 6, 4, 0.65)');
      bgGrad.addColorStop(1, 'rgba(2, 2, 5, 0.88)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, cw, ch);

      const numFrames = 10;
      const offset = (depth % 500) / 500;

      for (let i = 0; i < numFrames; i++) {
        const norm = (i + offset) / numFrames;
        const scale = Math.pow(norm, 2.25) * 1.85 + 0.05;
        const w = cw * scale;
        const h = ch * scale;
        const rx = vpX - w * 0.5;
        const ry = vpY - h * 0.5;

        const frameAlpha = Math.sin(norm * Math.PI) * 0.5 * alpha;
        ctx.strokeStyle = `rgba(229, 184, 105, ${frameAlpha})`;
        ctx.lineWidth = norm > 0.65 ? 1.5 : 0.75;
        ctx.strokeRect(rx, ry, w, h);

        const tiers = 5;
        ctx.strokeStyle = `rgba(180, 125, 55, ${frameAlpha * 0.55})`;
        for (let t = 1; t < tiers; t++) {
          const sy = ry + (h / tiers) * t;
          ctx.beginPath();
          ctx.moveTo(rx, sy);
          ctx.lineTo(rx + w, sy);
          ctx.stroke();
        }
      }

      ctx.strokeStyle = `rgba(235, 185, 112, ${0.15 * alpha})`;
      ctx.lineWidth = 0.85;
      for (let r = 0; r < 12; r++) {
        const ang = (r / 12) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(vpX, vpY);
        ctx.lineTo(vpX + Math.cos(ang) * cw, vpY + Math.sin(ang) * cw);
        ctx.stroke();
      }
      ctx.restore();
    }

    function drawRealisticComet(alpha, progress) {
      ctx.save();
      ctx.globalAlpha = alpha;
      const headX = cw * (0.78 - progress * 0.06);
      const headY = ch * (0.24 + progress * 0.08);

      const dustGrad = ctx.createLinearGradient(headX, headY, headX + 190, headY + 340);
      dustGrad.addColorStop(0, 'rgba(210, 248, 245, 0.78)');
      dustGrad.addColorStop(0.28, 'rgba(94, 212, 208, 0.26)');
      dustGrad.addColorStop(0.7, 'rgba(45, 120, 140, 0.06)');
      dustGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = dustGrad;
      ctx.beginPath();
      ctx.moveTo(headX - 2, headY);
      ctx.quadraticCurveTo(headX + 120, headY + 140, headX + 240, headY + 360);
      ctx.lineTo(headX + 120, headY + 380);
      ctx.quadraticCurveTo(headX + 55, headY + 180, headX - 2, headY);
      ctx.fill();

      const coma = ctx.createRadialGradient(headX, headY, 1, headX, headY, 28);
      coma.addColorStop(0, '#FFFFFF');
      coma.addColorStop(0.35, 'rgba(153, 246, 228, 0.78)');
      coma.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = coma;
      ctx.beginPath();
      ctx.arc(headX, headY, 28, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function drawAstrophotographyStarTrails(alpha, rotAngle) {
      const poleX = cw * 0.5;
      const poleY = ch * 0.30;

      ctx.save();
      ctx.globalAlpha = alpha;

      ctx.save();
      ctx.translate(poleX, poleY);
      ctx.rotate(rotAngle);
      for (let i = 0; i < starTrails.length; i++) {
        const st = starTrails[i];
        ctx.strokeStyle = `${st.tint} ${st.alpha})`;
        ctx.lineWidth = st.width;
        ctx.beginPath();
        ctx.arc(0, 0, st.radius, st.startAngle, st.startAngle + st.arcLen);
        ctx.stroke();
      }
      ctx.restore();

      ctx.save();
      ctx.translate(poleX, poleY);
      ctx.strokeStyle = 'rgba(229, 184, 105, 0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, 62, 0, Math.PI * 2);
      ctx.stroke();

      const activeStart = -Math.PI * 0.75 + worldState.activeExpIdx * (Math.PI * 0.5);
      ctx.strokeStyle = '#E5B869';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(0, 0, 62, activeStart, activeStart + Math.PI * 0.38);
      ctx.stroke();

      const moons = 12;
      for (let m = 0; m < moons; m++) {
        const mAng = (m / moons) * Math.PI * 2 - Math.PI * 0.5;
        const mx = Math.cos(mAng) * 32;
        const my = Math.sin(mAng) * 32;
        const mr = 4.2;

        ctx.fillStyle = '#181A20';
        ctx.beginPath();
        ctx.arc(mx, my, mr, 0, Math.PI * 2);
        ctx.fill();

        const phase = Math.sin((m / moons) * Math.PI);
        ctx.fillStyle = `rgba(245, 232, 200, ${0.25 + phase * 0.75})`;
        ctx.beginPath();
        ctx.arc(mx, my, mr * (0.4 + 0.6 * phase), -Math.PI * 0.5, Math.PI * 0.5);
        ctx.fill();
      }
      ctx.restore();

      const ridgeTop = ch * worldState.ridgeHorizonY;
      ctx.fillStyle = '#020205';
      ctx.beginPath();
      ctx.moveTo(0, ch);
      ctx.lineTo(0, ridgeTop + 28);
      ctx.bezierCurveTo(cw * 0.22, ridgeTop - 12, cw * 0.55, ridgeTop - 18, cw, ridgeTop + 34);
      ctx.lineTo(cw, ch);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }

    // ---------------------------------------------------------------------
    // 10. MODAL & INTERACTIVE CONTROLS WIRING
    // ---------------------------------------------------------------------
    function showToast(msg) {
      const toast = document.getElementById('cosmic-toast');
      document.getElementById('cosmic-toast-text').textContent = msg;
      toast.classList.remove('opacity-0', 'translate-y-2');
      setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-2');
      }, 2600);
    }

    function openModal(type) {
      cosmicAudio.chime(740);
      const modal = document.getElementById('cosmic-modal');
      const subtitle = document.getElementById('modal-subtitle');
      const body = document.getElementById('modal-body');

      if (type === 'room') {
        const room = TESSERACT_ROOMS[worldState.activeRoomIdx];
        subtitle.textContent = `ROOM ${room.number} // ${room.category}`;
        body.innerHTML = `
          <h3 class="font-goozeman text-2xl sm:text-3xl text-white uppercase">${room.title}</h3>
          <div class="flex flex-wrap gap-4 font-mono-tech text-xs text-white/60">
            <span>${room.period}</span>
            <span>·</span>
            <span class="text-emerald-400">${room.status}</span>
            <span>·</span>
            <span class="text-amber-300">${room.goal}</span>
          </div>
          <div class="border border-white/15 rounded overflow-hidden my-3">
            ${buildRoomMockupHTML(room)}
          </div>
          <p class="text-xs sm:text-sm text-white/75 leading-relaxed">${room.desc}</p>
          <div class="pt-2 border-t border-white/10 flex flex-wrap gap-1.5 font-mono-tech text-[10px]">
            ${room.stack.map(s => `<span class="tech-module-chip px-2.5 py-1 text-amber-200">${s}</span>`).join('')}
          </div>
        `;
      } else if (type === 'map') {
        subtitle.textContent = '3D GALAXY & PLANETARY NAVIGATION';
        body.innerHTML = `
          <div class="space-y-2.5 font-mono-tech text-xs">
            <button type="button" data-map-jump="0.0" class="tech-module-chip w-full p-3.5 flex items-center justify-between text-left text-white/85 hover:text-white transition">
              <span>00 · Gargantua Black Hole Portal &amp; Icy Planet Horizon</span>
              <span class="text-amber-300">LOC. 00 ↗</span>
            </button>
            <button type="button" data-map-jump="0.25" class="tech-module-chip w-full p-3.5 flex items-center justify-between text-left text-white/85 hover:text-white transition">
              <span>01 · Inside the Tesseract &amp; Volcanic Planet Pyro-V</span>
              <span class="text-amber-300">LOC. 01 ↗</span>
            </button>
            <button type="button" data-map-jump="0.58" class="tech-module-chip w-full p-3.5 flex items-center justify-between text-left text-white/85 hover:text-white transition">
              <span>02 · 3D Earth, Cratered Moon &amp; Halley's Comet</span>
              <span class="text-cyan-300">LOC. 02 ↗</span>
            </button>
            <button type="button" data-map-jump="0.76" class="tech-module-chip w-full p-3.5 flex items-center justify-between text-left text-white/85 hover:text-white transition">
              <span>03 · Professional Experience (Star Trails &amp; 12 Moons)</span>
              <span class="text-amber-300">LOC. 03 ↗</span>
            </button>
            <button type="button" data-map-jump="0.95" class="tech-module-chip w-full p-3.5 flex items-center justify-between text-left text-white/85 hover:text-white transition">
              <span>04 · 3D Volumetric Spiral Galaxy &amp; Hyperspace Warp</span>
              <span class="text-amber-300">LOC. 04 ↗</span>
            </button>
          </div>
        `;
      } else if (type === 'transmission') {
        subtitle.textContent = 'DIRECT TRANSMISSION // DAFIAN';
        body.innerHTML = `
          <form id="transmission-form" class="space-y-4">
            <div>
              <label class="block font-mono-tech text-[10px] text-amber-300/80 uppercase mb-1">Name</label>
              <input type="text" required placeholder="Your name" class="w-full px-3.5 py-2 rounded bg-white/[0.05] border border-white/15 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400" />
            </div>
            <div>
              <label class="block font-mono-tech text-[10px] text-amber-300/80 uppercase mb-1">Email</label>
              <input type="email" required placeholder="you@domain.com" class="w-full px-3.5 py-2 rounded bg-white/[0.05] border border-white/15 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400" />
            </div>
            <div>
              <label class="block font-mono-tech text-[10px] text-amber-300/80 uppercase mb-1">Message</label>
              <textarea rows="3" required placeholder="Tell Dafian about your project..." class="w-full px-3.5 py-2 rounded bg-white/[0.05] border border-white/15 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"></textarea>
            </div>
            <button type="submit" class="w-full py-2.5 rounded-full bg-white text-black font-goozeman tracking-wider text-xs uppercase hover:bg-amber-100 transition">
              Send Message ↗
            </button>
          </form>
        `;
        const form = document.getElementById('transmission-form');
        if (form) {
          form.addEventListener('submit', (ev) => {
            ev.preventDefault();
            closeModal();
            showToast('Message transmitted to Dafian.');
          });
        }
      } else if (type === 'github') {
        subtitle.textContent = 'GITHUB PROFILE';
        body.innerHTML = `
          <div class="tech-module-chip p-4 space-y-2">
            <div class="font-goozeman text-lg text-white tracking-wider">github.com/Dapzsyzofc</div>
            <p class="text-xs text-white/65 leading-relaxed">Explore Dafian's production repositories, AI CLI tools, Stellar Soroban smart contracts, and 3D web systems.</p>
            <a href="https://github.com/Dapzsyzofc" target="_blank" rel="noopener noreferrer" class="inline-block mt-2 bg-white text-black px-4 py-1.5 rounded-full font-medium text-xs hover:bg-amber-100 transition">Open GitHub ?</a>
          </div>
        `;
      } else if (type === 'telegram') {
        subtitle.textContent = 'TELEGRAM';
        body.innerHTML = `
          <div class="tech-module-chip p-4 space-y-2">
            <div class="font-goozeman text-lg text-white tracking-wider">@DapzSYZ</div>
            <p class="text-xs text-white/65 leading-relaxed">Send a message via Telegram.</p>
            <a href="https://t.me/DapzSYZ" target="_blank" rel="noopener noreferrer" class="inline-block mt-2 bg-white text-black px-4 py-1.5 rounded-full font-medium text-xs hover:bg-amber-100 transition">Open Telegram ?</a>
          </div>
        `;
      }

      modal.classList.remove('hidden');
      modal.classList.add('flex');

      modal.querySelectorAll('[data-map-jump]').forEach(btn => {
        btn.addEventListener('click', () => {
          worldState.targetScroll = parseFloat(btn.getAttribute('data-map-jump') || '0');
          closeModal();
        });
      });
    }

    function closeModal() {
      const modal = document.getElementById('cosmic-modal');
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }

    // ---------------------------------------------------------------------
    // 11. INITIALIZATION & PRELOADER
    // ---------------------------------------------------------------------
    let preloaderAnim = null;

    function completePreloader() {
      if (worldState.preloaderDone) return;
      if (preloaderAnim) preloaderAnim.pause();
      worldState.preloaderDone = true;

      anime({
        targets: '#preloader-overlay',
        opacity: [1, 0],
        duration: 550,
        easing: 'easeOutQuad',
        complete: () => {
          document.getElementById('preloader-overlay').style.display = 'none';
        }
      });

      anime({
        targets: ['#hud-header', '#hud-footer'],
        opacity: [0, 1],
        duration: 850,
        easing: 'easeOutQuad'
      });

      playHeroEntranceAnimation();
      syncDOMScenesWithScroll(0);
    }

    function startSupernovaPreloader() {
      const counterEl = document.getElementById('preloader-counter');
      const barEl = document.getElementById('preloader-bar');

      preloaderAnim = anime.timeline({
        easing: 'easeInOutExpo',
        complete: () => completePreloader()
      });

      preloaderAnim.add({
        targets: worldState,
        preloaderProgress: [0, 100],
        plasmaIntensity: [0.65, 1.95, 0.0],
        cosmicWebAlpha: [0, 1, 0],
        duration: 2300,
        round: 1,
        update: () => {
          const v = Math.round(worldState.preloaderProgress);
          counterEl.textContent = String(v).padStart(3, '0');
          barEl.style.width = `${v}%`;
        }
      });
    }

    
      buildMasterTimeline();
      renderTesseractRoom(0);
      renderExperienceRole(0);
      startSupernovaPreloader();
      animFrameId = requestAnimationFrame(animateUniverse);

      const clockIntervalId = setInterval(() => {
        const now = new Date();
        const hh = String(now.getHours()).padStart(2, '0');
        const mm = String(now.getMinutes()).padStart(2, '0');
        const ss = String(now.getSeconds()).padStart(2, '0');
        const clockEl = document.getElementById('hud-clock');
        if (clockEl) clockEl.textContent = `${hh}:${mm}:${ss}`;
      }, 1000);

      window.addEventListener('wheel', (e) => {
        if (!worldState.preloaderDone || worldState.isWarping) return;
        const modal = document.getElementById('cosmic-modal');
        if (!modal.classList.contains('hidden')) return;

        const delta = e.deltaY * 0.00038;
        if (worldState.currentScroll > 0.96 && delta > 0.015) {
          triggerHyperspaceWarp();
          return;
        }
        worldState.targetScroll = Math.max(0, Math.min(1, worldState.targetScroll + delta));
      }, { passive: true });

      let touchStartY = 0;
      window.addEventListener('touchstart', (e) => {
        if (e.touches.length > 0) touchStartY = e.touches[0].clientY;
      }, { passive: true });

      window.addEventListener('touchmove', (e) => {
        if (!worldState.preloaderDone || worldState.isWarping) return;
        const modal = document.getElementById('cosmic-modal');
        if (!modal.classList.contains('hidden')) return;

        const currentY = e.touches[0].clientY;
        const dy = touchStartY - currentY;
        touchStartY = currentY;

        if (worldState.currentScroll > 0.96 && dy > 18) {
          triggerHyperspaceWarp();
          return;
        }
        worldState.targetScroll = Math.max(0, Math.min(1, worldState.targetScroll + dy * 0.0011));
      }, { passive: true });

      window.addEventListener('mousemove', (e) => {
        worldState.rawMouseX = (e.clientX / window.innerWidth) - 0.5;
        worldState.rawMouseY = (e.clientY / window.innerHeight) - 0.5;
      });

      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          if (worldState.isWarping) finishHyperspaceWarp();
          closeModal();
        } else if (e.key === 'ArrowDown' || e.key === 'PageDown') {
          if (!worldState.preloaderDone || worldState.isWarping) return;
          worldState.targetScroll = Math.min(1, worldState.targetScroll + 0.055);
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
          if (!worldState.preloaderDone || worldState.isWarping) return;
          worldState.targetScroll = Math.max(0, worldState.targetScroll - 0.055);
        }
      });

      document.getElementById('btn-skip-preloader').addEventListener('click', completePreloader);
      document.getElementById('btn-skip-warp').addEventListener('click', finishHyperspaceWarp);
      document.getElementById('btn-sound-toggle').addEventListener('click', () => cosmicAudio.toggle());
      document.getElementById('btn-cosmic-map').addEventListener('click', () => openModal('map'));
      document.getElementById('btn-brand-origin').addEventListener('click', () => {
        cosmicAudio.chime(660);
        worldState.targetScroll = 0;
      });

      document.querySelectorAll('[data-nav-scroll]').forEach(btn => {
        btn.addEventListener('click', () => {
          cosmicAudio.chime(780);
          worldState.targetScroll = parseFloat(btn.getAttribute('data-nav-scroll') || '0');
        });
      });

      document.getElementById('hud-progress-track').addEventListener('click', (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        worldState.targetScroll = ratio;
      });

      document.getElementById('btn-hero-contact').addEventListener('click', () => {
        cosmicAudio.chime(880);
        worldState.targetScroll = 0.94;
      });

      document.getElementById('btn-enter-singularity').addEventListener('click', () => {
        cosmicAudio.chime(540);
        worldState.targetScroll = 0.24;
      });

      document.querySelectorAll('[data-room-jump]').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.getAttribute('data-room-jump') || '0', 10);
          cosmicAudio.chime(620 + idx * 70);
          worldState.targetScroll = 0.23 + (idx / TESSERACT_ROOMS.length) * 0.26;
        });
      });

      ['btn-room-preview-box', 'btn-click-enter-room', 'btn-enter-room-main', 'btn-room-code', 'btn-room-live'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('click', () => openModal('room'));
      });

      document.querySelectorAll('[data-exp-select]').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.getAttribute('data-exp-select') || '0', 10);
          cosmicAudio.chime(700 + idx * 60);
          worldState.targetScroll = 0.745 + (idx / EXPERIENCE_ROLES.length) * 0.12;
        });
      });

      document.getElementById('btn-copy-email').addEventListener('click', () => {
        const email = 'dafiannnn@gmail.com';
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(email);
          }
        } catch (err) {}
        showToast('Copied dafiannnn@gmail.com to clipboard');
      });

      document.getElementById('btn-open-transmission').addEventListener('click', () => openModal('transmission'));
      document.getElementById('btn-trigger-warp').addEventListener('click', triggerHyperspaceWarp);
      document.getElementById('btn-galaxy-core').addEventListener('click', triggerHyperspaceWarp);
      document.getElementById('btn-close-modal').addEventListener('click', closeModal);

      document.querySelectorAll('[data-open-modal]').forEach(btn => {
        btn.addEventListener('click', () => {
          openModal(btn.getAttribute('data-open-modal'));
        });
      });
    

      cleanupFn = () => {
        isDisposed = true;
        if (animFrameId) cancelAnimationFrame(animFrameId);
        if (typeof clockIntervalId !== 'undefined') clearInterval(clockIntervalId);
        window.removeEventListener('resize', resizeAll);
        if (preloaderAnim) preloaderAnim.pause();
        if (renderer) renderer.dispose();
      };
    } catch (err) {
      console.error('Cosmic Engine Init Error:', err);
    }

    return () => {
      cleanupFn();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-[#020205] text-[#F5F7FA]"
      dangerouslySetInnerHTML={{ __html: COSMIC_MARKUP }}
    />
  );
}
