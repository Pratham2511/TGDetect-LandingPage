'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Inter } from 'next/font/google';
import { Github, ChevronDown, Copy, Check } from 'lucide-react';
import './landing.css';

const GraphCanvas = dynamic(() => import('./GraphCanvas'), { ssr: false });
const inter = Inter({ subsets: ['latin'], weight: ['300','400','500','600','700','800','900'] });

const GITHUB_URL = 'https://github.com/Pratham2511/-TGDetect-Temporal-Graph';

// ============================================================
// MOBILE SVG GRAPH FALLBACK — Neural Signal Colors
// ============================================================
const MobileGraphSVG = () => (
  <svg viewBox="0 0 360 240" className="hero-graph-svg-mobile" fill="none" aria-hidden="true">
    <line x1="180" y1="60" x2="90" y2="120" stroke="#6C63FF" strokeWidth="1" opacity="0.35" />
    <line x1="180" y1="60" x2="270" y2="110" stroke="#6C63FF" strokeWidth="1.5" opacity="0.45" />
    <line x1="90" y1="120" x2="140" y2="185" stroke="#FF6B35" strokeWidth="2" opacity="0.75" />
    <line x1="270" y1="110" x2="230" y2="185" stroke="#00F5FF" strokeWidth="1" opacity="0.4" />
    <line x1="90" y1="120" x2="50" y2="185" stroke="#B84DFF" strokeWidth="1" opacity="0.3" />
    <line x1="230" y1="185" x2="300" y2="160" stroke="#00F5FF" strokeWidth="1" opacity="0.4" />
    <line x1="140" y1="185" x2="100" y2="220" stroke="#FF6B35" strokeWidth="1.5" opacity="0.5" />
    <circle r="3" fill="#6C63FF" opacity="0.9">
      <animateMotion dur="3s" repeatCount="indefinite" path="M180,60 L90,120" />
    </circle>
    <circle r="3" fill="#FF6B35" opacity="0.9">
      <animateMotion dur="2.2s" repeatCount="indefinite" path="M90,120 L140,185" />
    </circle>
    <circle r="2.5" fill="#00F5FF" opacity="0.8">
      <animateMotion dur="3.5s" repeatCount="indefinite" path="M270,110 L230,185" />
    </circle>
    <circle cx="180" cy="60" r="7" fill="#6C63FF" opacity="0.9" />
    <circle cx="90" cy="120" r="6" fill="#B84DFF" opacity="0.75" />
    <circle cx="270" cy="110" r="7" fill="#6C63FF" opacity="0.8" />
    <circle cx="50" cy="185" r="5" fill="#B84DFF" opacity="0.6" />
    <circle cx="230" cy="185" r="6" fill="#00F5FF" opacity="0.7" />
    <circle cx="300" cy="160" r="5" fill="#00F5FF" opacity="0.6" />
    <circle cx="100" cy="220" r="5" fill="#B84DFF" opacity="0.5" />
    <circle cx="140" cy="185" r="10" fill="#FF6B35" opacity="0.9" />
    <circle cx="140" cy="185" r="10" fill="none" stroke="#FF6B35" strokeWidth="1">
      <animate attributeName="r" values="10;24;10" dur="2s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
    </circle>
  </svg>
);

// ============================================================
// LOGO COMPONENT
// ============================================================
function Logo() {
  return (
    <a href="#section-hero" className="nav-logo" aria-label="TGDetect Home" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
      <span style={{ display: 'flex' }}>
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <circle cx="3" cy="11" r="2" fill="#6C63FF" />
          <circle cx="11" cy="6" r="2" fill="#00F5FF" />
          <circle cx="19" cy="11" r="2" fill="#6C63FF" />
          <line x1="3" y1="11" x2="11" y2="6" stroke="#6C63FF" strokeWidth="1.2" />
          <line x1="11" y1="6" x2="19" y2="11" stroke="#00F5FF" strokeWidth="1.2" />
          <line x1="3" y1="11" x2="19" y2="11" stroke="#6C63FF" strokeWidth="1.2" strokeDasharray="2 2" />
        </svg>
      </span>
      <span className="nav-logo-text" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--sec-text-1)' }}>
        <span style={{ color: 'var(--sec-accent-1)' }}>TG</span>Detect
      </span>
    </a>
  );
}

// ============================================================
// MAIN LANDING PAGE COMPONENT
// ============================================================
export default function LandingPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);

  // ─── EFFECT 1: Mobile detection ───
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // ─── EFFECT 2: Nav scroll state ───
  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ─── EFFECT 3: MAIN GSAP + Animations ───
  useEffect(() => {
    const cleanups: (() => void)[] = [];

    (async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      const LenisModule = await import('lenis');

      gsap.registerPlugin(ScrollTrigger);

      const lenis = new LenisModule.default({ lerp: 0.075, smoothWheel: true });
      lenis.on('scroll', ScrollTrigger.update);
      const lenisTick = (time: number) => { lenis.raf(time * 1000); };
      gsap.ticker.add(lenisTick);
      gsap.ticker.lagSmoothing(0);
      cleanups.push(() => { gsap.ticker.remove(lenisTick); lenis.destroy(); ScrollTrigger.getAll().forEach(t => t.kill()); });

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced) return;

      // ─── CUSTOM CURSOR (desktop only) ───
      if (window.innerWidth >= 1024) {
        const dot = document.querySelector('.cursor-dot') as HTMLElement | null;
        const ring = document.querySelector('.cursor-ring') as HTMLElement | null;
        if (dot && ring) {
          let mx = 0, my = 0, rx = 0, ry = 0;
          window.addEventListener('mousemove', (e) => {
            mx = e.clientX; my = e.clientY;
            gsap.set(dot, { x: mx, y: my });
          });
          const tick = () => {
            rx += (mx - rx) * 0.15;
            ry += (my - ry) * 0.15;
            gsap.set(ring, { x: rx, y: ry });
            requestAnimationFrame(tick);
          };
          tick();

          document.querySelectorAll('a,button,.tilt-card,.tech-badge').forEach((el) => {
            el.addEventListener('mouseenter', () => gsap.to(ring, { scale: 2.2, opacity: 0.6, duration: 0.3 }));
            el.addEventListener('mouseleave', () => gsap.to(ring, { scale: 1, opacity: 0.4, duration: 0.3 }));
          });
        }
      }

      // ─── SCRAMBLE TEXT ───
      const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%';
      const scramble = (el: HTMLElement) => {
        const orig = el.textContent || '';
        let frame = 0;
        const run = () => {
          const prog = frame / 24;
          const done = Math.floor(prog * orig.length);
          el.textContent = orig.split('').map((c, i) => c === ' ' ? ' ' : i < done ? c : CHARS[Math.floor(Math.random() * CHARS.length)]).join('');
          if (++frame <= 24) requestAnimationFrame(run);
          else el.textContent = orig;
        };
        requestAnimationFrame(run);
      };
      gsap.utils.toArray<HTMLElement>('.scramble-text').forEach(el => {
        ScrollTrigger.create({ trigger: el, start: 'top 85%', once: true, onEnter: () => scramble(el) });
      });

      // ─── REVEAL UP ───
      gsap.utils.toArray<HTMLElement>('.reveal-up').forEach(el => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          opacity: 0, y: 36, duration: 0.7, ease: 'power3.out',
        });
      });

      // ─── STAGGER GROUPS ───
      gsap.utils.toArray<HTMLElement>('.stagger-group').forEach(group => {
        gsap.from(group.querySelectorAll('.stagger-item'), {
          scrollTrigger: { trigger: group, start: 'top 82%', once: true },
          opacity: 0, y: 30, duration: 0.6, stagger: 0.1, ease: 'power3.out',
        });
      });

      // ─── COUNTER + PARTICLE BURST ───
      const burstParticles = (el: HTMLElement) => {
        const rect = el.getBoundingClientRect();
        const container = document.createElement('div');
        container.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden;';
        document.body.appendChild(container);
        for (let i = 0; i < 12; i++) {
          const p = document.createElement('div');
          const angle = (i / 12) * Math.PI * 2;
          const dist = 40 + Math.random() * 60;
          const size = 3 + Math.random() * 4;
          const color = ['#6C63FF', '#00F5FF', '#B84DFF', '#FF6B35'][Math.floor(Math.random() * 4)];
          p.style.cssText = `position:absolute;left:${rect.left + rect.width / 2}px;top:${rect.top + rect.height / 2}px;width:${size}px;height:${size}px;border-radius:50%;background:${color};`;
          container.appendChild(p);
          gsap.to(p, {
            x: Math.cos(angle) * dist, y: Math.sin(angle) * dist,
            opacity: 0, scale: 0, duration: 0.8 + Math.random() * 0.4, ease: 'power2.out',
            onComplete: () => p.remove(),
          });
        }
        setTimeout(() => container.remove(), 2000);
      };

      gsap.utils.toArray<HTMLElement>('.counter-target').forEach(el => {
        const target = parseFloat(el.dataset.target || '0');
        const isDecimal = el.dataset.decimal === 'true';
        const suffix = el.dataset.suffix || '';
        const obj = { val: 0 };
        ScrollTrigger.create({
          trigger: el, start: 'top 90%', once: true,
          onEnter: () => {
            gsap.to(obj, {
              val: target, duration: 1.8, ease: 'power2.out',
              onUpdate: () => {
                el.textContent = (isDecimal ? obj.val.toFixed(1) : Math.floor(obj.val).toLocaleString()) + suffix;
              },
              onComplete: () => {
                el.classList.add('completed');
                burstParticles(el);
              },
            });
          },
        });
      });

      // ─── METRIC BAR FILLS ───
      gsap.utils.toArray<HTMLElement>('.metric-bar-fill').forEach(bar => {
        const w = bar.dataset.width || '0%';
        gsap.from(bar, {
          scrollTrigger: { trigger: bar, start: 'top 92%', once: true },
          width: '0%', duration: 1.2, ease: 'power3.out',
        });
        gsap.set(bar, { width: w });
      });

      // ─── 3D CARD TILT (desktop only) ───
      if (window.innerWidth >= 1024) {
        document.querySelectorAll<HTMLElement>('.tilt-card').forEach(card => {
          const shine = card.querySelector('.card-shine') as HTMLElement | null;
          card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -12;
            const rotateY = ((x - centerX) / centerX) * 12;
            gsap.to(card, { rotateX, rotateY, duration: 0.4, ease: 'power2.out', transformPerspective: 800 });
            if (shine) {
              shine.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.12), transparent 60%)`;
            }
          });
          card.addEventListener('mouseleave', () => {
            gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)', transformPerspective: 800 });
            if (shine) shine.style.background = 'none';
          });
        });
      }

      // ─── SPOTLIGHT ───
      document.querySelectorAll<HTMLElement>('.dark-section').forEach(section => {
        section.addEventListener('mousemove', (e) => {
          const rect = section.getBoundingClientRect();
          section.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
          section.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        });
      });

      // ─── TERMINAL TYPEWRITER ───
      const ctaSection = document.getElementById('section-cta');
      const termContent = document.querySelector('.terminal-content') as HTMLElement | null;
      if (ctaSection && termContent) {
        const lines = [
          '$ git clone https://github.com/Pratham2511/-TGDetect-Temporal-Graph.git',
          '$ cd -TGDetect-Temporal-Graph',
          '$ npm install',
          '$ npm run dev',
        ];
        ScrollTrigger.create({
          trigger: ctaSection, start: 'top 80%', once: true,
          onEnter: () => {
            let lineIdx = 0;
            let charIdx = 0;
            const typeLine = () => {
              if (lineIdx >= lines.length) {
                const cursor = document.createElement('span');
                cursor.style.cssText = 'display:inline-block;width:8px;height:16px;background:#00FF87;animation:blink 1s step-end infinite;vertical-align:middle;margin-left:2px;';
                termContent.appendChild(cursor);
                return;
              }
              const line = lines[lineIdx];
              const lineEl = document.createElement('div');
              termContent.appendChild(lineEl);
              const typeChar = () => {
                if (charIdx < line.length) {
                  lineEl.textContent = line.slice(0, charIdx + 1);
                  charIdx++;
                  setTimeout(typeChar, 18 + Math.random() * 32);
                } else {
                  charIdx = 0;
                  lineIdx++;
                  setTimeout(typeLine, 200);
                }
              };
              typeChar();
            };
            typeLine();
          },
        });
      }

      // ─── ARCH CARD BOOT ───
      gsap.utils.toArray<HTMLElement>('.arch-card').forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: { trigger: card, start: 'top 88%', once: true },
          opacity: 0, y: 24, duration: 0.5, delay: i * 0.08, ease: 'power3.out',
        });
      });

    })();

    return () => { cleanups.forEach(fn => fn()); };
  }, []);

  // ─── HANDLE COPY ───
  const handleCopy = useCallback(() => {
    const cmd = `git clone https://github.com/Pratham2511/-TGDetect-Temporal-Graph.git\ncd -TGDetect-Temporal-Graph\nnpm install\nnpm run dev`;
    navigator.clipboard.writeText(cmd).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  // ─── SCROLL TO HELPER ───
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <div className={`landing-page ${inter.className}`}>
      {/* ─── CUSTOM CURSOR (desktop) ─── */}
      <div className="cursor-dot" />
      <div className="cursor-ring" />

      {/* ─── AMBIENT ORBS ─── */}
      <div className="ambient-orbs" aria-hidden="true">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 1: HERO (void-space — DARK)
          ═══════════════════════════════════════════════════════════ */}
      <section
        id="section-hero"
        data-scheme="void-space"
        className="dark-section hero-section"
      >
        <div className="spotlight-layer" />

        {/* ── NAVBAR ── */}
        <nav className={`landing-nav ${navScrolled ? 'scrolled' : ''}`}>
          <Logo />
          <div className={`nav-links ${menuOpen ? 'mobile-open' : ''}`}>
            <a onClick={() => scrollTo('section-overview')}>Overview</a>
            <a onClick={() => scrollTo('section-objectives')}>Objectives</a>
            <a onClick={() => scrollTo('section-architecture')}>Architecture</a>
            <a onClick={() => scrollTo('section-features')}>Features</a>
            <a onClick={() => scrollTo('section-results')}>Results</a>
            <a onClick={() => scrollTo('section-tech-stack')}>Tech Stack</a>
            <div className="nav-cta-mobile">
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">
                <Github size={16} /> GitHub
              </a>
              <a onClick={() => scrollTo('section-cta')} className="btn-secondary">
                Get Started
              </a>
            </div>
          </div>
          <div className="nav-cta">
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">
              <Github size={16} /> GitHub
            </a>
          </div>
          <button
            className={`hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </nav>

        {/* ── HERO INNER ── */}
        <div className="hero-inner">
          <div className="hero-left">
            <div className="hero-eyebrow-badge">
              <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#00F5FF', display: 'inline-block', flexShrink: 0 }} />
              RESEARCH PROJECT
            </div>
            <h1 className="hero-headline">
              <span className="line">See <span className="gradient-text">Every</span> Threat.</span>
              <span className="line">Trace <span className="gradient-text">Every</span> Step.</span>
              <span className="line">Understand <span className="gradient-text">Every</span> Why.</span>
            </h1>
            <p className="hero-subheadline">
              TGDetect is a research platform for Advanced Persistent Threat detection
              using Temporal Graph Neural Networks. It transforms multi-source security
              logs into heterogeneous temporal graphs for deep structural analysis.
            </p>
            <div className="hero-cta-row">
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">
                <Github size={16} /> View &amp; Download on GitHub
              </a>
              <a onClick={() => scrollTo('section-overview')} className="btn-secondary">
                Explore Research Platform
              </a>
            </div>
            <div className="hero-disclaimer">
              This is an academic research project. Evaluations are performed on publicly available benchmark datasets.
            </div>
            <div className="hero-metrics-strip">
              <div className="hero-eyebrow-badge" style={{ marginBottom: 0 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#00F5FF', display: 'inline-block', flexShrink: 0 }} />
                BENCHMARK RESULTS
              </div>
            </div>
          </div>
          <div className="hero-right">
            <div className="hero-canvas-wrapper">
              {!isMobile && <GraphCanvas />}
            </div>
            {isMobile && <MobileGraphSVG />}
          </div>
        </div>

        {/* ── SCROLL INDICATOR ── */}
        <div className="scroll-indicator" style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, zIndex: 2 }}>
          <span className="scroll-indicator-label">Scroll to explore</span>
          <ChevronDown size={20} className="scroll-arrow" style={{ color: 'var(--sec-text-muted)' }} />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 2: STATS BAR (cosmic-dawn — LIGHT)
          ═══════════════════════════════════════════════════════════ */}
      <section id="section-stats" data-scheme="cosmic-dawn" className="stats-section">
        <div className="stats-inner">
          <div className="stat-block reveal-up">
            <div className="stat-number counter-target" data-target="98.9" data-decimal="true" data-suffix="%">0%</div>
            <div className="stat-label">F1 Score — Benchmark Evaluation</div>
          </div>
          <div className="stat-block reveal-up">
            <div className="stat-number counter-target" data-target="100.0" data-decimal="true" data-suffix="%">0%</div>
            <div className="stat-label">Precision — Zero False Positives</div>
          </div>
          <div className="stat-block reveal-up">
            <div className="stat-number counter-target" data-target="97.8" data-decimal="true" data-suffix="%">0%</div>
            <div className="stat-label">Recall — Threats Detected</div>
          </div>
          <div className="stat-block reveal-up">
            <div className="stat-number counter-target" data-target="1000000" data-suffix="+">0</div>
            <div className="stat-label">Benchmark Events Evaluated</div>
          </div>
          <div className="stat-block reveal-up">
            <div className="stat-number counter-target" data-target="6">0</div>
            <div className="stat-label">V16 Apex Architecture Modules</div>
          </div>
        </div>
        <p className="stats-footnote">
          All evaluations performed on publicly available datasets (DARPA TC v3, UNSW-NB15, LANL NetFlow). Results reflect benchmark performance, not real-time production deployment.
        </p>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 3: OVERVIEW (aurora-white — LIGHT)
          ═══════════════════════════════════════════════════════════ */}
      <section id="section-overview" data-scheme="aurora-white">
        <div className="section-container">
          <div className="section-header reveal-up">
            <div className="section-eyebrow" style={{ marginBottom: 12 }}>THE PLATFORM</div>
            <h2 className="section-headline scramble-text">A Graph-Centric Approach to APT Detection</h2>
            <p className="section-subheadline" style={{ marginTop: 16 }}>
              TGDetect moves beyond shallow feature engineering by constructing rich heterogeneous
              temporal graphs from multi-source security logs, enabling deep structural reasoning
              about attack patterns.
            </p>
          </div>
          <div className="overview-inner">
            <div className="reveal-up">
              <ul className="bullet-list">
                <li className="bullet-item">
                  <span className="bullet-check">✓</span>
                  <span>Transforms multi-source security logs (process, file, network, registry) into heterogeneous temporal graphs</span>
                </li>
                <li className="bullet-item">
                  <span className="bullet-check">✓</span>
                  <span>Preserves temporal ordering and multi-hop relationships between entities</span>
                </li>
                <li className="bullet-item">
                  <span className="bullet-check">✓</span>
                  <span>Uses a V16 Apex Temporal Graph Neural Network for deep structural analysis</span>
                </li>
                <li className="bullet-item">
                  <span className="bullet-check">✓</span>
                  <span>Adapts to concept drift with online learning for evolving threat landscapes</span>
                </li>
                <li className="bullet-item">
                  <span className="bullet-check">✓</span>
                  <span>Maps detections to MITRE ATT&CK techniques with temporal explainability</span>
                </li>
                <li className="bullet-item">
                  <span className="bullet-check">✓</span>
                  <span>Reconstructs full attack chains for automated incident investigation on benchmark data</span>
                </li>
              </ul>
            </div>
            <div className="reveal-up">
              <div className="pipeline-diagram">
                {[
                  { step: '01', label: 'Multi-Source Log Ingestion', desc: 'Process, file, network & registry events', color: 'var(--sec-accent-1)' },
                  { step: '02', label: 'Temporal Graph Construction', desc: 'Heterogeneous graph with time-aware edges', color: 'var(--sec-accent-3)' },
                  { step: '03', label: 'V16 Apex TGNN Engine', desc: 'Deep temporal graph neural network analysis', color: 'var(--sec-accent-2)' },
                  { step: '04', label: 'Alert + Explanation + Trace', desc: 'Detection, MITRE mapping & chain reconstruction', color: 'var(--sec-accent-1)' },
                ].map((item, i, arr) => (
                  <div key={i}>
                    <div className="pipeline-box" style={{ borderLeftColor: item.color, borderLeftWidth: 3 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: item.color, marginBottom: 6, fontFamily: 'monospace' }}>STEP {item.step}</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--sec-text-1)', marginBottom: 4 }}>{item.label}</div>
                      <div style={{ fontSize: 13, color: 'var(--sec-text-2)', lineHeight: 1.5 }}>{item.desc}</div>
                    </div>
                    {i < arr.length - 1 && (
                      <div className="pipeline-connector" style={{ padding: '10px 0', color: 'var(--sec-text-muted)' }}>
                        <svg width="20" height="24" viewBox="0 0 20 24" fill="none">
                          <path d="M10 0 L10 18 M4 12 L10 18 L16 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 4: OBJECTIVES (nebula — DARK)
          ═══════════════════════════════════════════════════════════ */}
      <section id="section-objectives" data-scheme="nebula" className="dark-section">
        <div className="spotlight-layer" />
        <div className="section-container">
          <div className="section-header center reveal-up">
            <div className="section-eyebrow" style={{ marginBottom: 12 }}>CORE OBJECTIVES</div>
            <h2 className="section-headline scramble-text">Four Research Pillars</h2>
          </div>
          <div className="objectives-grid stagger-group">
            {/* O1 */}
            <div
              className="tilt-card card-base objective-card stagger-item"
              style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
            >
              <div className="card-shine" style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none', zIndex: 1 }} />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--sec-accent-1)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 12 }}>O1 — Temporal Modeling</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--sec-text-1)', marginBottom: 10 }}>Heterogeneous Continuous-Time TGNN</h3>
                <p style={{ fontSize: 14, color: 'var(--sec-text-2)', lineHeight: 1.7 }}>
                  Capture precise temporal dynamics in APT attacks using continuous-time
                  temporal graph neural networks with heterogeneous node and edge types,
                  modeling the exact sequence and timing of adversarial operations.
                </p>
              </div>
            </div>
            {/* O2 */}
            <div
              className="tilt-card card-base objective-card stagger-item"
              style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
            >
              <div className="card-shine" style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none', zIndex: 1 }} />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--sec-accent-3)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 12 }}>O2 — Adaptive Learning</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--sec-text-1)', marginBottom: 10 }}>Online Concept Drift Adaptation</h3>
                <p style={{ fontSize: 14, color: 'var(--sec-text-2)', lineHeight: 1.7 }}>
                  Maintain detection accuracy as threat patterns evolve through online
                  learning mechanisms with memory bank modules and concept drift detection,
                  continuously adapting the model to new attack behaviors.
                </p>
              </div>
            </div>
            {/* O3 */}
            <div
              className="tilt-card card-base objective-card stagger-item"
              style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
            >
              <div className="card-shine" style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none', zIndex: 1 }} />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--sec-accent-2)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 12 }}>O3 — Incident Reconstruction</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--sec-text-1)', marginBottom: 10 }}>Automated Attack Chain Reconstruction</h3>
                <p style={{ fontSize: 14, color: 'var(--sec-text-2)', lineHeight: 1.7 }}>
                  Automatically piece together the full sequence of attacker actions
                  from initial compromise to data exfiltration, providing a complete
                  chronological attack narrative for forensic analysis on benchmark data.
                </p>
              </div>
            </div>
            {/* O4 */}
            <div
              className="tilt-card card-base objective-card stagger-item"
              style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
            >
              <div className="card-shine" style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none', zIndex: 1 }} />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--sec-accent-cool)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 12 }}>O4 — Explainable AI</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--sec-text-1)', marginBottom: 10 }}>MITRE ATT&CK Temporal Explainability</h3>
                <p style={{ fontSize: 14, color: 'var(--sec-text-2)', lineHeight: 1.7 }}>
                  Provide temporal explanations for model predictions mapped to
                  MITRE ATT&CK framework techniques, enabling analysts to understand
                  not just what was detected but when and why in the attack timeline.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 5: ARCHITECTURE (ocean-abyss — DARK)
          ═══════════════════════════════════════════════════════════ */}
      <section id="section-architecture" data-scheme="ocean-abyss" className="dark-section">
        <div className="spotlight-layer" />
        <div className="section-container">
          <div className="section-header center reveal-up">
            <div className="section-eyebrow" style={{ marginBottom: 12 }}>V16 APEX ARCHITECTURE</div>
            <h2 className="section-headline scramble-text">Six Core Modules</h2>
          </div>
          <div className="arch-grid stagger-group">
            {/* UniversalEncoder */}
            <div className="tilt-card card-base arch-card stagger-item" style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}>
              <div className="card-shine" style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none', zIndex: 1 }} />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--sec-accent-1)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 8 }}>MODULE 01</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--sec-text-1)', marginBottom: 10 }}>UniversalEncoder</h3>
                <div className="code-block" style={{ fontSize: 12, padding: '14px 16px' }}>{`class UniversalEncoder(nn.Module):
  def __init__(self, dim, heads=4):
    self.attn = MultiHeadAttention(dim, heads)
    self.ffn = FeedForward(dim)
  
  def forward(self, x, edge_index):
    h = self.attn(x, edge_index)
    return self.ffn(h)`}</div>
              </div>
            </div>
            {/* MultiResTimeEncoder */}
            <div className="tilt-card card-base arch-card stagger-item" style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}>
              <div className="card-shine" style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none', zIndex: 1 }} />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--sec-accent-2)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 8 }}>MODULE 02</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--sec-text-1)', marginBottom: 10 }}>MultiResTimeEncoder</h3>
                <div className="code-block" style={{ fontSize: 12, padding: '14px 16px' }}>{`class MultiResTimeEncoder(nn.Module):
  def __init__(self, dims=[32,64,128]):
    self.encoders = [
      TimeEncoding(d) for d in dims
    ]
  def forward(self, t, delta_t):
    return torch.cat([
      e(t, delta_t) for e in self.encoders
    ], dim=-1)`}</div>
              </div>
            </div>
            {/* MemBank GRU */}
            <div className="tilt-card card-base arch-card stagger-item" style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}>
              <div className="card-shine" style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none', zIndex: 1 }} />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--sec-accent-3)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 8 }}>MODULE 03</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--sec-text-1)', marginBottom: 10 }}>MemBank GRU</h3>
                <div className="code-block" style={{ fontSize: 12, padding: '14px 16px' }}>{`class MemBankGRU(nn.Module):
  def __init__(self, dim, mem_size=256):
    self.memory = nn.Parameter(
      torch.randn(mem_size, dim)
    )
    self.gru = nn.GRU(dim, dim)
  
  def forward(self, x):
    attn = x @ self.memory.T
    return self.gru(x, attn)`}</div>
              </div>
            </div>
            {/* CausalHTAConv */}
            <div className="tilt-card card-base arch-card stagger-item" style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}>
              <div className="card-shine" style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none', zIndex: 1 }} />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--sec-accent-cool)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 8 }}>MODULE 04</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--sec-text-1)', marginBottom: 10 }}>CausalHTAConv</h3>
                <div className="code-block" style={{ fontSize: 12, padding: '14px 16px' }}>{`class CausalHTAConv(MessagePassing):
  def __init__(self, in_dim, out_dim):
    super().__init__(aggr='add')
    self.lin = Linear(in_dim, out_dim)
  
  def message(self, x_j, t_j):
    decay = torch.exp(-0.1 * t_j)
    return self.lin(x_j) * decay`}</div>
              </div>
            </div>
            {/* GRL + Domain Head */}
            <div className="tilt-card card-base arch-card stagger-item" style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}>
              <div className="card-shine" style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none', zIndex: 1 }} />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--sec-accent-warm)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 8 }}>MODULE 05</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--sec-text-1)', marginBottom: 10 }}>GRL + Domain Head</h3>
                <div className="code-block" style={{ fontSize: 12, padding: '14px 16px' }}>{`class DomainDiscriminator(nn.Module):
  def __init__(self, dim, n_domains=3):
    self.grl = GradientReversal(1.0)
    self.head = nn.Sequential(
      Linear(dim, dim // 2),
      ReLU(),
      Linear(dim // 2, n_domains)
    )`}</div>
              </div>
            </div>
            {/* SupervisedContrastiveLoss */}
            <div className="tilt-card card-base arch-card stagger-item" style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}>
              <div className="card-shine" style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none', zIndex: 1 }} />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#CE93D8', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 8 }}>MODULE 06</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--sec-text-1)', marginBottom: 10 }}>SupervisedContrastiveLoss</h3>
                <div className="code-block" style={{ fontSize: 12, padding: '14px 16px' }}>{`class SupConLoss(nn.Module):
  def __init__(self, temp=0.07):
    self.temp = temp
  
  def forward(self, feats, labels):
    sim = F.cosine_similarity(
      feats[:,None],
      feats[None,:], dim=-1
    ) / self.temp
    mask = labels[:,None]==labels[None,:]
    return -log(
      exp(sim[mask]).sum(1) /
      exp(sim).sum(1)
    )`}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 6: FEATURES (ocean-abyss — DARK)
          ═══════════════════════════════════════════════════════════ */}
      <section id="section-features" data-scheme="ocean-abyss" className="dark-section">
        <div className="spotlight-layer" />
        <div className="section-container">
          <div className="section-header center reveal-up">
            <div className="section-eyebrow" style={{ marginBottom: 12 }}>PLATFORM CAPABILITIES</div>
            <h2 className="section-headline scramble-text">Key Features</h2>
          </div>
          <div className="features-grid stagger-group">
            {/* Feature 1: Research Detection Interface */}
            <div className="tilt-card card-base feature-card stagger-item" style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}>
              <div className="card-shine" style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none', zIndex: 1 }} />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--sec-accent-1)', marginBottom: 10 }}>Research Detection Interface</div>
                <p style={{ fontSize: 14, color: 'var(--sec-text-2)', lineHeight: 1.7 }}>
                  Interactive visualization of detection results on benchmark datasets with detailed
                  threat analysis, temporal event timelines, and multi-dimensional data exploration.
                </p>
              </div>
            </div>
            {/* Feature 2: Multi-Format Data Support */}
            <div className="tilt-card card-base feature-card stagger-item" style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}>
              <div className="card-shine" style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none', zIndex: 1 }} />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--sec-accent-2)', marginBottom: 10 }}>Multi-Format Data Support</div>
                <p style={{ fontSize: 14, color: 'var(--sec-text-2)', lineHeight: 1.7 }}>
                  Ingest and process multiple log formats including process events, file operations,
                  network flows, and registry modifications into unified temporal graph representations.
                </p>
              </div>
            </div>
            {/* Feature 3: MITRE ATT&CK Framework Mapping */}
            <div className="tilt-card card-base feature-card stagger-item" style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}>
              <div className="card-shine" style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none', zIndex: 1 }} />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--sec-accent-3)', marginBottom: 10 }}>MITRE ATT&CK Framework Mapping</div>
                <p style={{ fontSize: 14, color: 'var(--sec-text-2)', lineHeight: 1.7 }}>
                  Automatic mapping of detected threats to specific MITRE ATT&CK techniques and
                  tactics, providing standardized classification of adversarial behaviors.
                </p>
              </div>
            </div>
            {/* Feature 4: Attack Chain Reconstruction */}
            <div className="tilt-card card-base feature-card stagger-item" style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}>
              <div className="card-shine" style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none', zIndex: 1 }} />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--sec-accent-warm)', marginBottom: 10 }}>Attack Chain Reconstruction</div>
                <p style={{ fontSize: 14, color: 'var(--sec-text-2)', lineHeight: 1.7 }}>
                  Automated reconstruction of multi-stage attack chains from benchmark data,
                  tracing the full adversary path from initial access through lateral movement
                  to objective completion.
                </p>
              </div>
            </div>
            {/* Feature 5: Continuous Drift Adaptation */}
            <div className="tilt-card card-base feature-card stagger-item" style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}>
              <div className="card-shine" style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none', zIndex: 1 }} />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--sec-accent-cool)', marginBottom: 10 }}>Continuous Drift Adaptation</div>
                <p style={{ fontSize: 14, color: 'var(--sec-text-2)', lineHeight: 1.7 }}>
                  Online learning capabilities with memory bank mechanisms to detect and adapt
                  to concept drift, maintaining detection accuracy as attack patterns evolve over time.
                </p>
              </div>
            </div>
            {/* Feature 6: Temporal Explainability (XAI) */}
            <div className="tilt-card card-base feature-card stagger-item" style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}>
              <div className="card-shine" style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none', zIndex: 1 }} />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--sec-accent-1)', marginBottom: 10 }}>Temporal Explainability (XAI)</div>
                <p style={{ fontSize: 14, color: 'var(--sec-text-2)', lineHeight: 1.7 }}>
                  Time-aware explanations for model predictions, showing which temporal events
                  and graph relationships contributed most to each detection decision.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 7: RESULTS (arctic-frost — LIGHT)
          ═══════════════════════════════════════════════════════════ */}
      <section id="section-results" data-scheme="arctic-frost">
        <div className="section-container">
          <div className="section-header center reveal-up">
            <div className="section-eyebrow" style={{ marginBottom: 12 }}>PERFORMANCE</div>
            <h2 className="section-headline scramble-text">Numbers That Speak For Themselves</h2>
          </div>

          {/* Eval Methodology Box B */}
          <div className="eval-context-box reveal-up" style={{ marginBottom: 40, maxWidth: 800, margin: '0 auto 40px' }}>
            <div className="eval-context-label">Evaluation Methodology</div>
            <div className="eval-context-details">
              <span>Dataset: DARPA TC v3</span>
              <span>Split: Temporal hold-out (no data leakage)</span>
              <span>Metrics: Precision, Recall, F1, ROC-AUC</span>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="metrics-grid stagger-group">
            <div className="card-base metric-card stagger-item">
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--sec-text-2)', marginBottom: 8 }}>Precision</div>
              <div className="metric-value" style={{ fontSize: 56, fontWeight: 800, color: 'var(--sec-accent-1)', lineHeight: 1, marginBottom: 16 }}>100.0%</div>
              <div className="metric-bar">
                <div className="metric-bar-fill" data-width="100%" style={{ width: '100%' }} />
              </div>
              <p style={{ fontSize: 13, color: 'var(--sec-text-muted)', marginTop: 12 }}>Zero false positives on benchmark evaluation</p>
            </div>
            <div className="card-base metric-card stagger-item">
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--sec-text-2)', marginBottom: 8 }}>Recall</div>
              <div className="metric-value" style={{ fontSize: 56, fontWeight: 800, color: 'var(--sec-accent-1)', lineHeight: 1, marginBottom: 16 }}>97.8%</div>
              <div className="metric-bar">
                <div className="metric-bar-fill" data-width="97.8%" style={{ width: '97.8%' }} />
              </div>
              <p style={{ fontSize: 13, color: 'var(--sec-text-muted)', marginTop: 12 }}>Near-complete threat detection coverage</p>
            </div>
            <div className="card-base metric-card stagger-item">
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--sec-text-2)', marginBottom: 8 }}>F1 Score</div>
              <div className="metric-value" style={{ fontSize: 56, fontWeight: 800, color: 'var(--sec-accent-1)', lineHeight: 1, marginBottom: 16 }}>98.9%</div>
              <div className="metric-bar">
                <div className="metric-bar-fill" data-width="98.9%" style={{ width: '98.9%' }} />
              </div>
              <p style={{ fontSize: 13, color: 'var(--sec-text-muted)', marginTop: 12 }}>Harmonic mean of precision and recall</p>
            </div>
            <div className="card-base metric-card stagger-item">
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--sec-text-2)', marginBottom: 8 }}>ROC-AUC</div>
              <div className="metric-value" style={{ fontSize: 56, fontWeight: 800, color: 'var(--sec-accent-1)', lineHeight: 1, marginBottom: 16 }}>0.989</div>
              <div className="metric-bar">
                <div className="metric-bar-fill" data-width="98.9%" style={{ width: '98.9%' }} />
              </div>
              <p style={{ fontSize: 13, color: 'var(--sec-text-muted)', marginTop: 12 }}>Area under the ROC curve</p>
            </div>
          </div>

          {/* Key Finding Box */}
          <div className="key-finding-box reveal-up" style={{ marginTop: 40, maxWidth: 800, margin: '40px auto 0' }}>
            <div className="key-finding-label">Key Finding</div>
            <p style={{ fontSize: 15, color: 'var(--sec-text-2)', lineHeight: 1.7 }}>
              <strong style={{ color: 'var(--sec-text-1)' }}>Precision of 1.000</strong> on the DARPA TC v3 benchmark
              demonstrates the model&apos;s ability to distinguish benign from malicious activity with
              zero false alarms. This is critical in security operations where alert fatigue is
              a primary concern.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 8: HOW IT WORKS (void-space — DARK)
          ═══════════════════════════════════════════════════════════ */}
      <section id="section-how-it-works" data-scheme="void-space" className="dark-section">
        <div className="spotlight-layer" />
        <div className="section-container">
          <div className="section-header center reveal-up">
            <div className="section-eyebrow" style={{ marginBottom: 12 }}>WORKFLOW</div>
            <h2 className="section-headline scramble-text">How It Works</h2>
          </div>
          <div className="how-it-works-row stagger-group">
            {/* Step 1 */}
            <div className="tilt-card card-base step-card stagger-item" style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}>
              <div className="card-shine" style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none', zIndex: 1 }} />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ fontSize: 48, fontWeight: 900, color: 'var(--sec-accent-1)', opacity: 0.2, lineHeight: 1, marginBottom: 12, fontFamily: 'monospace' }}>01</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--sec-text-1)', marginBottom: 10 }}>Load &amp; Graph Construction</h3>
                <p style={{ fontSize: 14, color: 'var(--sec-text-2)', lineHeight: 1.7 }}>
                  Load cybersecurity event logs from public cybersecurity benchmark datasets.
                  The system automatically constructs heterogeneous temporal graphs with typed
                  nodes (processes, files, network connections) and time-stamped edges.
                </p>
              </div>
            </div>
            {/* Step 2 */}
            <div className="tilt-card card-base step-card stagger-item" style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}>
              <div className="card-shine" style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none', zIndex: 1 }} />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ fontSize: 48, fontWeight: 900, color: 'var(--sec-accent-2)', opacity: 0.2, lineHeight: 1, marginBottom: 12, fontFamily: 'monospace' }}>02</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--sec-text-1)', marginBottom: 10 }}>V16 Apex TGNN Analysis</h3>
                <p style={{ fontSize: 14, color: 'var(--sec-text-2)', lineHeight: 1.7 }}>
                  The V16 Apex Temporal Graph Neural Network processes the constructed graph
                  through six specialized modules: encoding, temporal modeling, memory banking,
                  causal convolution, domain adaptation, and contrastive learning to produce
                  threat classification scores.
                </p>
              </div>
            </div>
            {/* Step 3 */}
            <div className="tilt-card card-base step-card stagger-item" style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}>
              <div className="card-shine" style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none', zIndex: 1 }} />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ fontSize: 48, fontWeight: 900, color: 'var(--sec-accent-3)', opacity: 0.2, lineHeight: 1, marginBottom: 12, fontFamily: 'monospace' }}>03</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--sec-text-1)', marginBottom: 10 }}>Alert, Reconstruct &amp; Explain</h3>
                <p style={{ fontSize: 14, color: 'var(--sec-text-2)', lineHeight: 1.7 }}>
                  On benchmark data, the system generates alerts with MITRE ATT&CK technique
                  mappings, reconstructs the full attack chain chronologically, and provides
                  temporal explainability for each detection decision.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 9: TECH STACK (warm-ember — DARK)
          ═══════════════════════════════════════════════════════════ */}
      <section id="section-tech-stack" data-scheme="warm-ember">
        <div className="section-container">
          <div className="section-header center reveal-up">
            <div className="section-eyebrow" style={{ marginBottom: 12 }}>BUILT WITH</div>
            <h2 className="section-headline scramble-text">Tech Stack</h2>
          </div>
          <div className="tech-badges reveal-up">
            {['Next.js 16', 'TypeScript 5', 'React 19', 'Tailwind CSS 4', 'Three.js', 'PyTorch (model)', 'Recharts', 'shadcn/ui', 'GSAP', 'Lucide React'].map(tech => (
              <span className="tech-badge" key={tech}>{tech}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 10: DATASETS (aurora-white — LIGHT)
          ═══════════════════════════════════════════════════════════ */}
      <section id="section-datasets" data-scheme="aurora-white">
        <div className="section-container">
          <div className="section-header center reveal-up">
            <div className="section-eyebrow" style={{ marginBottom: 12 }}>DATA SOURCES</div>
            <h2 className="section-headline scramble-text">Benchmark Datasets</h2>
          </div>
          <div className="datasets-grid stagger-group">
            {/* DARPA TC v3 */}
            <div className="card-base dataset-card stagger-item">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--sec-text-1)' }}>DARPA TC v3</h3>
                <span className="dataset-badge benchmark">BENCHMARK</span>
              </div>
              <p style={{ fontSize: 14, color: 'var(--sec-text-2)', lineHeight: 1.7 }}>
                DARPA Engagement 3 dataset featuring multi-stage APT scenarios with provenance
                graphs. Contains labeled attack campaigns with detailed host-level event traces.
              </p>
            </div>
            {/* UNSW-NB15 */}
            <div className="card-base dataset-card stagger-item">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--sec-text-1)' }}>UNSW-NB15</h3>
                <span className="dataset-badge benchmark">BENCHMARK</span>
              </div>
              <p style={{ fontSize: 14, color: 'var(--sec-text-2)', lineHeight: 1.7 }}>
                Comprehensive network intrusion dataset with 49 features covering 9 categories
                of modern attacks. Widely used for evaluating network-based detection systems.
              </p>
            </div>
            {/* LANL NetFlow */}
            <div className="card-base dataset-card stagger-item">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--sec-text-1)' }}>LANL NetFlow</h3>
                <span className="dataset-badge public-dataset">PUBLIC DATASET</span>
              </div>
              <p style={{ fontSize: 14, color: 'var(--sec-text-2)', lineHeight: 1.7 }}>
                Publicly released enterprise network dataset spanning 58 days of network flow
                data. Provides authentic background traffic patterns for validation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 11: CTA (event-horizon — DARK)
          ═══════════════════════════════════════════════════════════ */}
      <section id="section-cta" data-scheme="event-horizon" className="dark-section">
        <div className="spotlight-layer" />
        <div className="section-container">
          <div className="cta-section-inner">
            <div className="reveal-up">
              <div className="hero-eyebrow-badge" style={{ marginBottom: 20, display: 'inline-flex' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--sec-accent-1)', display: 'inline-block', flexShrink: 0 }} />
                OPEN SOURCE RESEARCH — MIT LICENSE
              </div>
            </div>
            <h2 className="cta-headline scramble-text reveal-up">
              Explore TGDetect.<br />Running in Minutes.
            </h2>
            <p className="cta-sub reveal-up">
              Clone the repository, install dependencies, and start exploring detection simulation,
              attack backtracking, and temporal graph analysis on benchmark datasets.
            </p>

            {/* Terminal Block */}
            <div className="terminal-block reveal-up">
              <button className="terminal-copy-btn" onClick={handleCopy} aria-label="Copy commands">
                {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? 'Copied!' : 'Copy'}
              </button>
              <div className="terminal-content" />
            </div>

            {/* CTA Buttons */}
            <div className="cta-buttons reveal-up">
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">
                <Github size={16} /> View on GitHub
              </a>
              <a onClick={() => scrollTo('section-overview')} className="btn-secondary">
                Explore Platform
              </a>
            </div>

            {/* Trust Badges */}
            <div className="trust-badges reveal-up">
              {['MIT Licensed', 'Open Source', 'Academic Research', 'Next.js 16', 'TypeScript 5'].map(badge => (
                <span className="trust-badge" key={badge}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--sec-accent-1)', display: 'inline-block', flexShrink: 0 }} />
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 12: FOOTER (event-horizon)
          ═══════════════════════════════════════════════════════════ */}
      <section data-scheme="event-horizon">
        <footer>
          <div className="footer-inner">
            <Logo />
            <div className="footer-links">
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, fontWeight: 500, color: 'var(--sec-text-2)', textDecoration: 'none', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Github size={14} /> GitHub
              </a>
              <a onClick={() => scrollTo('section-architecture')} style={{ fontSize: 14, fontWeight: 500, color: 'var(--sec-text-2)', textDecoration: 'none', transition: 'color 0.2s', cursor: 'pointer' }}>
                Documentation
              </a>
              <a href={`${GITHUB_URL}/blob/main/LICENSE`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, fontWeight: 500, color: 'var(--sec-text-2)', textDecoration: 'none', transition: 'color 0.2s' }}>
                License
              </a>
              <a onClick={() => scrollTo('section-overview')} style={{ fontSize: 14, fontWeight: 500, color: 'var(--sec-text-2)', textDecoration: 'none', transition: 'color 0.2s', cursor: 'pointer' }}>
                Platform
              </a>
            </div>
          </div>
          <div className="footer-copyright">
            <p style={{ marginBottom: 6 }}>© 2026 TGDetect — Academic Research Project.</p>
            <p style={{ marginBottom: 4, opacity: 0.7 }}>V16 Apex Temporal Graph Neural Network for Advanced Persistent Threat Detection.</p>
            <p style={{ opacity: 0.5, fontSize: 12 }}>All evaluations performed on publicly available benchmark datasets.</p>
          </div>
        </footer>
      </section>
    </div>
  );
}
