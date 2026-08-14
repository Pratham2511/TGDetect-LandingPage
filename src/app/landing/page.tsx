'use client';

/**
 * TGDetect Landing Page — V3 DEFINITIVE FINAL BUILD
 *
 * Structure (13 sections, each with its own color scheme):
 *  1. Hero (deep-forest)
 *  2. Stats Bar (morning-mist)
 *  3. What is TGDetect / Overview (morning-mist)
 *  4. Four Core Objectives (golden-woodland)
 *  5. V16 Apex Architecture (ocean-cove)
 *  6. Key Features (ocean-cove)
 *  7. Performance Results (arctic-dawn)
 *  8. How It Works (deep-forest)
 *  9. Tech Stack (golden-woodland)
 * 10. Datasets (morning-mist)
 * 11. CTA / Get Started (midnight-forest)
 * 12. Footer (midnight-forest)
 *
 * Animations: GSAP + ScrollTrigger + Lenis smooth scroll + Framer Motion entry.
 * Custom cursor on desktop. Mobile SVG fallback for Three.js.
 * Respects prefers-reduced-motion.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Inter } from 'next/font/google';
import './landing.css';

const GraphCanvas = dynamic(() => import('./GraphCanvas'), { ssr: false });

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

const GITHUB_URL = 'https://github.com/Pratham2511/TGDetect-LandingPage';
const VERCEL_URL = 'https://tgdetect.vercel.app';

// ============================================================
// MOBILE SVG GRAPH FALLBACK
// ============================================================
const MobileGraphSVG = () => (
  <svg
    viewBox="0 0 360 240"
    className="hero-graph-svg-mobile"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Edges */}
    <line x1="180" y1="60" x2="90" y2="120" stroke="#1A6FFF" strokeWidth="1" opacity="0.35" />
    <line x1="180" y1="60" x2="270" y2="110" stroke="#1A6FFF" strokeWidth="1.5" opacity="0.45" />
    <line x1="90" y1="120" x2="140" y2="185" stroke="#FF4444" strokeWidth="2" opacity="0.75" />
    <line x1="270" y1="110" x2="230" y2="185" stroke="#00D4FF" strokeWidth="1" opacity="0.4" />
    <line x1="90" y1="120" x2="50" y2="185" stroke="#00D4FF" strokeWidth="1" opacity="0.3" />
    <line x1="230" y1="185" x2="300" y2="160" stroke="#8B5CF6" strokeWidth="1" opacity="0.4" />
    <line x1="140" y1="185" x2="100" y2="220" stroke="#FF4444" strokeWidth="1.5" opacity="0.5" />
    <line x1="180" y1="60" x2="180" y2="30" stroke="#00D4FF" strokeWidth="1" opacity="0.25" />
    {/* Moving data dots */}
    <circle r="3" fill="#1A6FFF" opacity="0.9">
      <animateMotion dur="3s" repeatCount="indefinite" path="M180,60 L90,120" />
    </circle>
    <circle r="3" fill="#FF4444" opacity="0.9">
      <animateMotion dur="2.2s" repeatCount="indefinite" path="M90,120 L140,185" />
    </circle>
    <circle r="2.5" fill="#8B5CF6" opacity="0.8">
      <animateMotion dur="3.5s" repeatCount="indefinite" path="M270,110 L230,185" />
    </circle>
    {/* Normal nodes */}
    <circle cx="180" cy="60" r="7" fill="#1A6FFF" opacity="0.9" />
    <circle cx="90" cy="120" r="6" fill="#00D4FF" opacity="0.75" />
    <circle cx="270" cy="110" r="7" fill="#1A6FFF" opacity="0.8" />
    <circle cx="50" cy="185" r="5" fill="#00D4FF" opacity="0.6" />
    <circle cx="230" cy="185" r="6" fill="#00D4FF" opacity="0.7" />
    <circle cx="300" cy="160" r="5" fill="#8B5CF6" opacity="0.6" />
    <circle cx="100" cy="220" r="5" fill="#00D4FF" opacity="0.5" />
    <circle cx="180" cy="30" r="4" fill="#00D4FF" opacity="0.4" />
    {/* Threat node with pulse */}
    <circle cx="140" cy="185" r="9" fill="#FF4444" opacity="0.9" />
    <circle cx="140" cy="185" r="9" fill="none" stroke="#FF4444" strokeWidth="1">
      <animate attributeName="r" values="9;20;9" dur="2s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
    </circle>
  </svg>
);

// ============================================================
// LOGO
// ============================================================
function Logo() {
  return (
    <a href="#section-hero" className="nav-logo" aria-label="TGDetect Home">
      <span className="nav-logo-icon">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <circle cx="3" cy="11" r="2" fill="#1A6FFF" />
          <circle cx="11" cy="6" r="2" fill="#00D4FF" />
          <circle cx="19" cy="11" r="2" fill="#1A6FFF" />
          <line className="node-line" x1="3" y1="11" x2="11" y2="6" stroke="#1A6FFF" strokeWidth="1.2" />
          <line className="node-line" x1="11" y1="6" x2="19" y2="11" stroke="#00D4FF" strokeWidth="1.2" />
          <line className="node-line" x1="3" y1="11" x2="19" y2="11" stroke="#1A6FFF" strokeWidth="1.2" strokeDasharray="2 2" />
        </svg>
      </span>
      <span className="nav-logo-text">
        <span className="accent">TG</span>Detect
      </span>
    </a>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function LandingPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('section-overview');
  const landingRef = useRef<HTMLDivElement>(null);

  // Detect mobile on mount
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Navbar scroll state
  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 60);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // GSAP + Lenis + ScrollTrigger setup
  useEffect(() => {
    let lenis: any;
    let rafId = 0;
    let cleanupFns: (() => void)[] = [];

    const init = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      const LenisModule = await import('lenis');
      const LenisClass = LenisModule.default;

      gsap.registerPlugin(ScrollTrigger);

      // Lenis smooth scroll
      lenis = new LenisClass({ lerp: 0.075, smoothWheel: true });
      const raf = (time: number) => {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);

      lenis.on('scroll', ScrollTrigger.update);

      // Custom cursor (desktop only)
      if (!isMobile) {
        const cursor = document.querySelector('.custom-cursor') as HTMLElement;
        const ring = document.querySelector('.custom-cursor-ring') as HTMLElement;
        if (cursor && ring) {
          const handleMove = (e: MouseEvent) => {
            gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.08 });
            gsap.to(ring, { x: e.clientX, y: e.clientY, duration: 0.45 });
          };
          window.addEventListener('mousemove', handleMove);
          cleanupFns.push(() => window.removeEventListener('mousemove', handleMove));
        }
      }

      // Check reduced motion
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!prefersReduced) {
        // Section reveal animations
        gsap.utils.toArray<HTMLElement>('.reveal-up').forEach((el) => {
          gsap.from(el, {
            scrollTrigger: {
              trigger: el,
              start: 'top 86%',
              toggleActions: 'play none none reverse',
            },
            y: 36,
            opacity: 0,
            duration: 0.85,
            ease: 'power3.out',
          });
        });

        // Stagger card groups
        gsap.utils.toArray<HTMLElement>('.stagger-group').forEach((group) => {
          const cards = group.querySelectorAll(':scope > .stagger-item');
          if (cards.length > 0) {
            gsap.from(cards, {
              scrollTrigger: {
                trigger: group,
                start: 'top 82%',
              },
              y: 40,
              opacity: 0,
              duration: 0.7,
              stagger: 0.1,
              ease: 'power3.out',
            });
          }
        });

        // Counter animations
        gsap.utils.toArray<HTMLElement>('.counter-target').forEach((el) => {
          const target = parseFloat(el.dataset.target || '0');
          const isDecimal = el.dataset.decimal === 'true';
          const suffix = el.dataset.suffix || '';
          ScrollTrigger.create({
            trigger: el,
            start: 'top 90%',
            once: true,
            onEnter: () => {
              const obj = { val: 0 };
              gsap.to(obj, {
                val: target,
                duration: 2.2,
                ease: 'power2.out',
                onUpdate: () => {
                  el.textContent = (isDecimal ? obj.val.toFixed(1) : Math.round(obj.val).toString()) + suffix;
                },
              });
            },
          });
        });

        // Metric bar fills
        gsap.utils.toArray<HTMLElement>('.metric-bar-fill').forEach((bar) => {
          const targetWidth = bar.dataset.width || '100%';
          gsap.set(bar, { width: '0%' });
          ScrollTrigger.create({
            trigger: bar,
            start: 'top 90%',
            once: true,
            onEnter: () => {
              gsap.to(bar, { width: targetWidth, duration: 2, ease: 'expo.out' });
            },
          });
        });

        // Active orb activation based on section in view (color journey)
        const sections = gsap.utils.toArray<HTMLElement>('section[data-scheme]');
        sections.forEach((section) => {
          ScrollTrigger.create({
            trigger: section,
            start: 'top 50%',
            end: 'bottom 50%',
            onEnter: () => updateOrbsForScheme(section.dataset.scheme || 'deep-forest'),
            onEnterBack: () => updateOrbsForScheme(section.dataset.scheme || 'deep-forest'),
          });
        });
      }

      // Active section detection for nav links
      const navIds = ['section-overview', 'section-architecture', 'section-features', 'section-results', 'section-cta'];
      navIds.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: 'top 30%',
          end: 'bottom 30%',
          onEnter: () => setActiveSection(id),
          onEnterBack: () => setActiveSection(id),
        });
      });

      ScrollTrigger.refresh();

      cleanupFns.push(() => {
        cancelAnimationFrame(rafId);
        if (lenis) lenis.destroy();
        ScrollTrigger.getAll().forEach((t) => t.kill());
      });
    };

    init();
    return () => cleanupFns.forEach((fn) => fn());
  }, [isMobile]);

  // Update orb visibility based on active section (colors stay constant — V1 palette)
  // Orb 1 (top-right): blue, Orb 2 (center-left): cyan, Orb 3 (bottom-right): purple
  const updateOrbsForScheme = (_scheme: string) => {
    const orbColors = [
      'radial-gradient(circle, #1A6FFF, transparent 70%)',
      'radial-gradient(circle, #00D4FF, transparent 70%)',
      'radial-gradient(circle, #8B5CF6, transparent 70%)',
    ];
    const orbs = document.querySelectorAll<HTMLElement>('.bg-orb');
    orbs.forEach((orb, i) => {
      orb.style.background = orbColors[i] || orbColors[0];
      orb.classList.add('active');
    });
  };

  // Copy to clipboard handler
  const handleCopy = useCallback(() => {
    const cmd = `git clone https://github.com/Pratham2511/TGDetect-LandingPage.git
cd TGDetect-LandingPage
npm install
npm run dev`;
    navigator.clipboard.writeText(cmd).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  // Smooth scroll to section
  const scrollTo = (id: string) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      const top = el.offsetTop - 70;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const navLinks = [
    { id: 'section-overview', label: 'Overview' },
    { id: 'section-architecture', label: 'Architecture' },
    { id: 'section-features', label: 'Features' },
    { id: 'section-results', label: 'Results' },
    { id: 'section-cta', label: 'Get Started' },
  ];

  return (
    <div className={`landing-page ${inter.className}`} ref={landingRef}>
      {/* Custom cursor — desktop only */}
      {!isMobile && (
        <>
          <div className="custom-cursor" />
          <div className="custom-cursor-ring" />
        </>
      )}

      {/* Ambient background orbs */}
      <div className="bg-orbs" aria-hidden>
        <div className="bg-orb bg-orb-1 active" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-orb bg-orb-3" />
      </div>

      {/* ── NAVBAR ── */}
      <nav className={`landing-nav ${navScrolled ? 'scrolled' : ''}`} aria-label="Main navigation">
        <Logo />
        <div className={`nav-links ${menuOpen ? 'mobile-open' : ''}`}>
          {navLinks.map((link) => (
            <a
              key={link.id}
              className={activeSection === link.id ? 'active' : ''}
              onClick={() => scrollTo(link.id)}
            >
              {link.label}
            </a>
          ))}
          {/* Mobile-only CTA buttons shown at bottom of drawer */}
          <div className="nav-cta-mobile">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              onClick={() => setMenuOpen(false)}
            >
              GitHub
            </a>
            <a
              href={VERCEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              onClick={() => setMenuOpen(false)}
            >
              Live Demo →
            </a>
          </div>
        </div>
        <div className="nav-cta">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
            style={{ fontSize: '14px', padding: '8px 16px' }}
          >
            GitHub
          </a>
          <a
            href={VERCEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ fontSize: '14px', padding: '8px 18px' }}
          >
            Live Demo →
          </a>
        </div>
        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen((m) => !m)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      <main className="landing-main">
        {/* ── HERO ── */}
        <section id="section-hero" data-scheme="deep-forest" className="hero-section">
          <div className="hero-bg-overlay" />
          <div className="hero-inner">
            <div className="hero-left">
              <span className="hero-eyebrow-badge">
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: 'var(--sec-accent-cool)',
                    display: 'inline-block',
                  }}
                />
                [ RESEARCH PROJECT ] — V16 Apex TGNN — Academic APT Detection Framework
              </span>

              <h1 className="hero-headline">
                <span className="line">
                  See <span className="gradient-text">Every</span> Threat.
                </span>
                <span className="line">
                  Trace <span className="gradient-text">Every</span> Step.
                </span>
                <span className="line">
                  Stop <span className="gradient-text">Every</span> APT.
                </span>
              </h1>

              <p className="hero-subheadline">
                TGDetect deploys a V16 Apex Temporal Graph Neural Network that models network
                telemetry as a living temporal graph — detecting Advanced Persistent Threats
                with 98.9% F1 accuracy and zero false positives across 1 million benchmark
                dataset events.
              </p>

              <div className="hero-cta-row">
                <a
                  href={VERCEL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  Explore the Platform →
                </a>
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  View on GitHub
                </a>
              </div>

              {/* Research disclaimer */}
              <div className="hero-disclaimer">
                <span className="disclaimer-icon">ℹ</span>
                <p>
                  Academic research prototype — evaluated on public cybersecurity benchmark
                  datasets. Live production deployment is planned for future development.
                </p>
              </div>

              <div className="hero-metrics-strip">
                <span className="metric-prefix">
                  <span className="static-dot" />
                  [ BENCHMARK RESULTS ]
                </span>
                <span>Precision:</span> <span className="metric-val">1.000</span>
                <span className="metric-sep">|</span>
                <span>Recall:</span> <span className="metric-val">0.978</span>
                <span className="metric-sep">|</span>
                <span>F1:</span> <span className="metric-val">0.989</span>
                <span className="metric-sep">|</span>
                <span>ROC-AUC:</span> <span className="metric-val">0.989</span>
              </div>
            </div>

            <div className="hero-right">
              <div className="hero-canvas-wrapper">
                {!isMobile && <GraphCanvas />}
              </div>
              {isMobile && <MobileGraphSVG />}
            </div>
          </div>

          {/* Scroll indicator — desktop only */}
          <div className="scroll-indicator">
            <span className="scroll-indicator-label">SCROLL TO EXPLORE</span>
            <svg
              className="scroll-arrow"
              width="16"
              height="22"
              viewBox="0 0 16 22"
              fill="none"
            >
              <path
                d="M8 2 L8 18 M2 12 L8 18 L14 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </section>

        {/* ── STATS BAR ── */}
        <section id="section-stats" data-scheme="morning-mist" className="stats-section">
          <div className="stats-inner">
            {[
              { target: 98.9, decimal: true, suffix: '%', label: 'F1 Score — OOD 1M Events' },
              { target: 100.0, decimal: true, suffix: '%', label: 'Precision — Zero False Positives' },
              { target: 97.8, decimal: true, suffix: '%', label: 'Recall — Threats Captured' },
              { target: 1, decimal: false, suffix: 'M+', label: 'Events Evaluated (2 Epochs)' },
              { target: 6, decimal: false, suffix: '', label: 'Architecture Modules — V16 Apex' },
            ].map((stat, i) => (
              <div className="stat-block" key={i}>
                <div className="stat-number">
                  <span
                    className="counter-target"
                    data-target={stat.target}
                    data-decimal={stat.decimal}
                    data-suffix={stat.suffix}
                  >
                    0{stat.suffix}
                  </span>
                </div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── OVERVIEW ── */}
        <section id="section-overview" data-scheme="morning-mist">
          <div className="section-container">
            <div className="overview-inner">
              <div>
                <span className="section-eyebrow reveal-up">THE PLATFORM</span>
                <h2 className="section-headline reveal-up">
                  <span className="gradient-text">A New Paradigm in</span>
                  <br />
                  <span className="gradient-text">Threat Detection</span>
                </h2>
                <p className="section-subheadline reveal-up" style={{ marginBottom: '24px' }}>
                  Advanced Persistent Threats don&apos;t announce themselves. They move slowly,
                  laterally, and silently — across dozens of network hops over days or weeks.
                  Traditional rule-based and static ML systems see events in isolation. They miss
                  the pattern.
                </p>
                <p className="section-subheadline reveal-up" style={{ marginBottom: '24px' }}>
                  TGDetect sees network telemetry as what it fundamentally is: a living, evolving
                  temporal graph — where every process, file access, DNS query, and lateral
                  connection is a node or edge with a timestamp. Our V16 Apex TGNN learns the
                  causal, temporal signature of attack chains in this graph — detecting threats
                  that are invisible to conventional systems.
                </p>

                <ul className="bullet-list stagger-group">
                  {[
                    'Fuses DARPA TC v3, UNSW-NB15, and LANL NetFlow into a unified temporal graph',
                    'Detects multi-stage APT chains spanning hours or days',
                    'Adapts continuously to evolving attack behaviors via online concept drift adaptation',
                    'Provides full attack chain reconstruction from detection back to initial compromise',
                    'Maps every finding to MITRE ATT&CK tactics and techniques',
                    'Evaluated on 1,000,000+ events across public cybersecurity benchmark datasets',
                  ].map((b, i) => (
                    <li key={i} className="bullet-item stagger-item">
                      <span className="bullet-check">
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                          <path
                            d="M2 5.5 L4.5 8 L9 3"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pipeline diagram */}
              <div className="pipeline-diagram stagger-group">
                {[
                  {
                    title: 'Multi-Source Log Ingestion',
                    sub: 'DARPA TC · UNSW-NB15 · LANL',
                    color: 'var(--sec-accent-1)',
                    icon: (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <ellipse cx="12" cy="5" rx="9" ry="3" stroke="currentColor" strokeWidth="2" />
                        <path d="M3 5v6c0 1.66 4 3 9 3s9-1.34 9-3V5" stroke="currentColor" strokeWidth="2" />
                        <path d="M3 11v6c0 1.66 4 3 9 3s9-1.34 9-3v-6" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    ),
                  },
                  {
                    title: 'Temporal Graph Construction',
                    sub: 'Nodes: Entities · Edges: Events',
                    color: 'var(--sec-accent-cool)',
                    icon: (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <circle cx="5" cy="6" r="2.5" stroke="currentColor" strokeWidth="2" />
                        <circle cx="19" cy="6" r="2.5" stroke="currentColor" strokeWidth="2" />
                        <circle cx="12" cy="18" r="2.5" stroke="currentColor" strokeWidth="2" />
                        <line x1="7" y1="6" x2="17" y2="6" stroke="currentColor" strokeWidth="2" />
                        <line x1="6" y1="8" x2="11" y2="16" stroke="currentColor" strokeWidth="2" />
                        <line x1="18" y1="8" x2="13" y2="16" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    ),
                  },
                  {
                    title: 'V16 Apex TGNN Engine',
                    sub: 'CausalHTAConv · GRU · GRL',
                    color: 'var(--sec-accent-2)',
                    icon: (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
                        <rect x="8" y="8" width="8" height="3" fill="currentColor" />
                        <rect x="8" y="13" width="8" height="3" fill="currentColor" />
                      </svg>
                    ),
                  },
                  {
                    title: 'Alert + Explanation + Trace',
                    sub: 'MITRE ATT&CK · Attack Chain',
                    color: 'var(--sec-accent-warm)',
                    icon: (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M12 2 L20 6 V12 C20 16 16.5 20 12 22 C7.5 20 4 16 4 12 V6 Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinejoin="round"
                        />
                        <path d="M9 12 L11 14 L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ),
                  },
                ].map((box, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="pipeline-box stagger-item" style={{ borderColor: box.color }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="pipeline-box-title">{box.title}</div>
                        <div className="pipeline-box-sub">{box.sub}</div>
                      </div>
                      <div className="pipeline-box-icon" style={{ color: box.color }}>
                        {box.icon}
                      </div>
                    </div>
                    {i < 3 && (
                      <div className="pipeline-connector">
                        <svg width="24" height="36" viewBox="0 0 24 36" preserveAspectRatio="none">
                          <line
                            x1="12"
                            y1="0"
                            x2="12"
                            y2="30"
                            stroke="var(--sec-accent-1)"
                            strokeWidth="2"
                            strokeDasharray="4 4"
                          />
                          <path
                            d="M6 24 L12 32 L18 24"
                            stroke="var(--sec-accent-1)"
                            strokeWidth="2"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── OBJECTIVES ── */}
        <section id="section-objectives" data-scheme="golden-woodland">
          <div className="section-container">
            <div className="section-header reveal-up">
              <span className="section-eyebrow">RESEARCH OBJECTIVES</span>
              <h2 className="section-headline">
                <span className="gradient-text">
                  Built Around Four
                  <br />
                  Scientific Pillars
                </span>
              </h2>
            </div>

            <div className="objectives-grid stagger-group">
              {[
                {
                  icon: (
                    <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
                      <circle cx="10" cy="24" r="4" fill="currentColor" />
                      <circle cx="38" cy="14" r="4" fill="currentColor" />
                      <circle cx="38" cy="34" r="4" fill="currentColor" />
                      <circle cx="24" cy="24" r="5" fill="currentColor" />
                      <line x1="14" y1="24" x2="19" y2="24" stroke="currentColor" strokeWidth="2" />
                      <line x1="29" y1="22" x2="34" y2="15" stroke="currentColor" strokeWidth="2" />
                      <line x1="29" y1="26" x2="34" y2="33" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  ),
                  label: 'O1 — TEMPORAL MODELING',
                  title: 'Heterogeneous Continuous-Time TGNN',
                  body: 'Fuses authentication, audit, network flow, DNS, and cloud API logs into a single unified temporal graph. Models every entity — IPs, processes, files, users — as nodes, and every interaction as a directed, timestamped edge. The TGNN propagates information across this graph through time, learning the causal patterns of multi-step APT campaigns.',
                  badge: 'embed_dim=64 · 4 attention heads · 2 TGNN layers',
                },
                {
                  icon: (
                    <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
                      <path
                        d="M38 24 A14 14 0 1 1 24 10"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        fill="none"
                      />
                      <path d="M28 10 L24 10 L24 14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      <path
                        d="M32 24 A8 8 0 1 1 24 16"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        fill="none"
                        opacity="0.5"
                      />
                    </svg>
                  ),
                  label: 'O2 — ADAPTIVE LEARNING',
                  title: 'Online Concept Drift Adaptation',
                  body: 'APT attackers evolve. Our system monitors model accuracy in real time using statistical drift detection. When attack behaviors shift, the V16 Apex engine automatically adapts via Rehearsal Buffer rotation — replaying representative historical events to prevent catastrophic forgetting while absorbing new threat patterns.',
                  badge: 'Rehearsal Buffer: 10% snapshot replay · Continual Learning',
                },
                {
                  icon: (
                    <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
                      <circle cx="14" cy="14" r="4" fill="currentColor" />
                      <circle cx="34" cy="24" r="4" fill="currentColor" />
                      <circle cx="14" cy="34" r="4" fill="currentColor" />
                      <path
                        d="M30 24 L18 24 M16 18 L18 22 L14 22"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />
                      <path
                        d="M16 30 L18 26 L14 26"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />
                    </svg>
                  ),
                  label: 'O3 — INCIDENT RECONSTRUCTION',
                  title: 'Automated Attack Chain Reconstruction',
                  body: 'When an alert fires, TGDetect doesn\'t just tell you something happened — it tells you everything that led there. The backtracking engine traverses the temporal graph backward from the detection point, identifying every compromised node and lateral movement step, from the final stage back to the initial point of compromise.',
                  badge: 'Temporal BFS/DFS · Attention-weighted path scoring',
                },
                {
                  icon: (
                    <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
                      <rect x="14" y="10" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2.5" />
                      <line x1="18" y1="16" x2="22" y2="16" stroke="currentColor" strokeWidth="2" />
                      <line x1="18" y1="20" x2="26" y2="20" stroke="currentColor" strokeWidth="2" />
                      <path d="M16 28 L16 38 L32 38 L32 28" stroke="currentColor" strokeWidth="2.5" />
                      <line x1="24" y1="28" x2="24" y2="38" stroke="currentColor" strokeWidth="2" />
                      <circle cx="24" cy="34" r="2" fill="currentColor" />
                    </svg>
                  ),
                  label: 'O4 — EXPLAINABLE AI',
                  title: 'MITRE ATT&CK Temporal Explainability',
                  body: 'Every detection is explained: WHAT was detected, WHEN each step occurred, HOW the attacker progressed, and WHY each event was classified malicious — using the TGNN\'s own attention weights as attribution. Findings map automatically to MITRE ATT&CK tactics and techniques, giving analysts the full picture in seconds.',
                  badge: 'MITRE ATT&CK mapping · Attention-weight attribution',
                },
              ].map((c, i) => (
                <div key={i} className="objective-card card-hover stagger-item">
                  <div className="objective-icon-wrap">{c.icon}</div>
                  <div className="objective-label">{c.label}</div>
                  <h3 className="objective-title">{c.title}</h3>
                  <p className="objective-body">{c.body}</p>
                  <span className="metrics-badge">{c.badge}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ARCHITECTURE ── */}
        <section id="section-architecture" data-scheme="ocean-cove">
          <div className="section-container">
            <div className="section-header reveal-up">
              <span className="section-eyebrow">THE ENGINE</span>
              <h2 className="section-headline">
                <span className="gradient-text">
                  V16 Apex — Six Modules,
                  <br />
                  One Flawless System
                </span>
              </h2>
              <p className="section-subheadline">
                Every module in V16 Apex solves a specific failure mode of conventional threat
                detection. Together, they form a causally rigorous, domain-invariant,
                memory-persistent detection engine.
              </p>
            </div>

            <div className="arch-grid stagger-group">
              {[
                {
                  heading: 'UniversalEncoder',
                  subtitle: 'Node Representation',
                  body: 'Instead of memorizing node IDs, the Universal Encoder extracts three behavioral numeric traits per event — frequency, temporal_burst, and rarity — and fuses them with hash-embedded node identities through a 2-layer GELU MLP. This enables zero-shot generalization to previously unseen network nodes.',
                  code: `Input: (src_id, dst_id) → MD5 hash → 10,000 buckets
Concat: [hash_embed || frequency || burst || rarity]
Output: 64-dim behavioral node embedding`,
                },
                {
                  heading: 'MultiResTimeEncoder',
                  subtitle: 'Temporal Encoding',
                  body: 'Converts raw elapsed time Δt into a 32-dimensional dense vector using learned fine and coarse cosine frequencies — analogous to transformer positional encoding. Captures both micro-burst timing (milliseconds) and long-term behavioral cycles (hours/days). Both short attack bursts and slow-moving lateral movement are represented faithfully.',
                  code: `TE(Δt) = [cos(ω₁·Δt), cos(ω₂·Δt), ..., cos(ω₁₆·Δt)]
Dimensions: TIME_DIM = 32
Frequency range: fine-grain → coarse-grain`,
                },
                {
                  heading: 'MemBank GRU',
                  subtitle: 'Dynamic Memory',
                  body: 'Every node maintains a 64-dimensional persistent memory state, updated by a GRUCell at each interaction. Crucially, memory decays exponentially with inactivity — and the decay rate is modulated by the node\'s historical risk score. High-risk nodes decay slower, ensuring long-dormant APT stages are not forgotten. A Rehearsal Buffer of 10% historical snapshots is injected during training to immunize against catastrophic forgetting.',
                  code: `decay(t) = exp(-λ · Δt · risk_weight)
memory_state = GRUCell(prev_state · decay, new_message)
MEMORY_DIM = 64`,
                },
                {
                  heading: 'CausalHTAConv',
                  subtitle: 'Causal Graph Convolution',
                  body: 'The core message-passing mechanism. A 4-head heterogeneous temporal attention convolution that computes Q/K/V over concatenated source state, destination state, and temporal encoding. A strict causal mask (Δt > 1e-4) ensures information only flows forward in time — preventing temporal leakage where future data could improperly influence past classifications. 2 layers deep.',
                  code: `Causal Mask: attention(i→j) = 0 if t_j < t_i
Heads: NUM_HEADS = 4, EMBED_DIM = 64
Layers: N_LAYERS = 2`,
                },
                {
                  heading: 'GRL + Domain Head',
                  subtitle: 'Adversarial Domain Generalization',
                  body: 'During backpropagation, gradients from the domain classification head (DARPA vs UNSW vs LANL) are reversed and amplified. This forces the TGNN to actively unlearn dataset-specific signatures, producing domain-invariant threat representations that generalize to unseen networks without retraining. This is the key to out-of-distribution performance.',
                  code: `Forward: z → domain_classifier → cross_entropy
Backward: ∇z → GRL → -λ · ∇z (gradient reversal)
Effect: Feature space becomes domain-agnostic`,
                },
                {
                  heading: 'SupervisedContrastiveLoss',
                  subtitle: 'Tactic Embedding Clustering',
                  body: 'A multi-task training objective that simultaneously optimizes anomaly detection (FocalBCE), domain invariance (GRL CrossEntropy), and tactic representation quality (SupCon). The contrastive loss pulls events sharing the same MITRE ATT&CK tactic together in latent space while pushing different tactics apart — producing tight, discriminative embeddings for each attack phase.',
                  code: `L_total = FocalBCE (detection)
        + λ₁ · CrossEntropy (domain)
        + λ₂ · SupConLoss (tactic clustering)`,
                },
              ].map((m, i) => (
                <div key={i} className="arch-card card-hover stagger-item">
                  <h3 className="arch-heading">{m.heading}</h3>
                  <div className="arch-subtitle">{m.subtitle}</div>
                  <p className="arch-body">{m.body}</p>
                  <pre className="code-block">{m.code}</pre>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section id="section-features" data-scheme="ocean-cove">
          <div className="section-container">
            <div className="section-header reveal-up">
              <span className="section-eyebrow">CAPABILITIES</span>
              <h2 className="section-headline">
                <span className="gradient-text">
                  Research-Grade Detection
                  <br />
                  Capabilities
                </span>
              </h2>
            </div>

            <div className="features-grid stagger-group">
              {[
                {
                  title: 'Research Detection Interface',
                  body: 'Simulates real-time threat detection using benchmark and synthetic datasets. Demonstrates the full detection pipeline with live-updating visualizations, counters, and activity feeds in research mode.',
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M3 12 H7 L9 6 L13 18 L15 12 H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ),
                },
                {
                  title: 'Multi-Source Data Fusion',
                  body: 'Accepts 12+ log formats — CSV, JSON, Syslog, NetFlow v5/v9, Zeek JSON, Suricata EVE, Windows Event, AWS CloudTrail, and more. Intelligent column mapping auto-detects and normalizes heterogeneous schemas into the unified temporal graph representation.',
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <circle cx="6" cy="6" r="3" stroke="currentColor" strokeWidth="2" />
                      <circle cx="18" cy="6" r="3" stroke="currentColor" strokeWidth="2" />
                      <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="2" />
                      <circle cx="18" cy="18" r="3" stroke="currentColor" strokeWidth="2" />
                      <line x1="9" y1="6" x2="15" y2="6" stroke="currentColor" strokeWidth="2" />
                      <line x1="6" y1="9" x2="6" y2="15" stroke="currentColor" strokeWidth="2" />
                      <line x1="18" y1="9" x2="18" y2="15" stroke="currentColor" strokeWidth="2" />
                      <line x1="9" y1="18" x2="15" y2="18" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  ),
                },
                {
                  title: 'MITRE ATT&CK Mapping',
                  body: 'Every detection automatically maps to MITRE ATT&CK tactics and techniques across all 11 tactic categories — Initial Access through Command & Control. Security analysts receive findings in the language they already know, with technique IDs and confidence scores.',
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 2 L20 5 V11 C20 16 16.5 20 12 22 C7.5 20 4 16 4 11 V5 Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                      <path d="M9 12 L11 14 L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ),
                },
                {
                  title: 'Full Attack Chain Reconstruction',
                  body: 'One click from alert to full incident reconstruction. The backtracking engine traces backward through the temporal graph, identifying every compromised entity, credential, and lateral movement hop — from the exfiltration point all the way back to the initial access vector.',
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <circle cx="5" cy="12" r="2.5" fill="currentColor" />
                      <circle cx="19" cy="12" r="2.5" fill="currentColor" />
                      <circle cx="12" cy="5" r="2" fill="currentColor" opacity="0.6" />
                      <circle cx="12" cy="19" r="2" fill="currentColor" opacity="0.6" />
                      <line x1="7" y1="12" x2="17" y2="12" stroke="currentColor" strokeWidth="2" strokeDasharray="2 2" />
                      <path d="M5 9.5 L5 7 L9 5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                      <path d="M19 14.5 L19 17 L15 19" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    </svg>
                  ),
                },
                {
                  title: 'Continuous Drift Adaptation',
                  body: 'Statistical drift detectors monitor prediction error distributions in real time. When adversarial behaviors evolve, the rehearsal-based continual learning pipeline automatically fine-tunes the model — maintaining detection accuracy on both old and new threat patterns simultaneously.',
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M20 12 A8 8 0 1 1 12 4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        fill="none"
                      />
                      <path d="M16 4 L20 4 L20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path
                        d="M16 12 A4 4 0 1 1 12 8"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        fill="none"
                        opacity="0.5"
                      />
                    </svg>
                  ),
                },
                {
                  title: 'Temporal Explainability (XAI)',
                  body: 'Translates complex TGNN decisions into human-readable security analyst reports. Attention weights, temporal influence scores, and decision path visualization answer WHAT, WHEN, HOW, and WHY for every alert — building analyst trust and enabling faster incident response.',
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M9 4 C9 2.5 10 2 12 2 C14 2 15 2.5 15 4 L15 9 L18 17 C18 19 17 20 15 20 L9 20 C7 20 6 19 6 17 L9 9 Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                      <line x1="9" y1="9" x2="15" y2="9" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  ),
                },
              ].map((f, i) => (
                <div key={i} className="feature-card card-hover stagger-item">
                  <div className="feature-icon-wrap">{f.icon}</div>
                  <h3 className="feature-title">{f.title}</h3>
                  <p className="feature-body">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── RESULTS ── */}
        <section id="section-results" data-scheme="arctic-dawn">
          <div className="section-container">
            <div className="section-header center reveal-up">
              <span className="section-eyebrow">BENCHMARK RESULTS</span>
              <h2 className="section-headline">
                <span className="gradient-text">
                  Numbers That Speak
                  <br />
                  For Themselves
                </span>
              </h2>
              <p className="section-subheadline" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                V16 Apex was evaluated on a formal 1,000,000-event Out-of-Distribution showdown
                across 2 training epochs — conditions designed to stress-test cross-dataset
                generalization — the model evaluated on data distributions not seen during training.
              </p>
            </div>

            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
              {/* Eval context box */}
              <div className="eval-context-box reveal-up">
                <div className="eval-context-label">📊 EVALUATION METHODOLOGY</div>
                <p>
                  All metrics are research benchmarks obtained via Out-of-Distribution evaluation
                  on publicly available cybersecurity datasets. These do not represent production
                  deployment performance.
                </p>
                <div className="eval-context-details">
                  <span>Dataset: DARPA TC v3 + UNSW-NB15 + LANL NetFlow</span>
                  <span>Protocol: 1,000,000 events · 2 training epochs · Full OOD</span>
                </div>
              </div>

              <div className="metrics-grid stagger-group">
                {[
                  { value: '100.0%', label: 'Precision', desc: 'Zero False Positives across 1M OOD events', width: '100%' },
                  { value: '97.8%', label: 'Recall', desc: '97.8% of all hidden APT chains caught', width: '97.8%' },
                  { value: '98.9%', label: 'F1 Score', desc: 'Harmonic precision-recall balance', width: '98.9%' },
                  { value: '0.989', label: 'ROC-AUC', desc: 'Threshold-independent discrimination', width: '98.9%' },
                ].map((m, i) => (
                  <div key={i} className="metric-card stagger-item">
                    <div className="metric-value">{m.value}</div>
                    <div className="metric-label">{m.label}</div>
                    <div className="metric-desc">{m.desc}</div>
                    <div className="metric-bar">
                      <div className="metric-bar-fill" data-width={m.width} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="key-finding-box reveal-up">
                <span className="key-finding-label">⚡ KEY FINDING</span>
                <p>
                  A Precision of <strong>1.000</strong> across 1,000,000 extreme out-of-distribution
                  events means TGDetect produced literally <strong>zero false positives</strong> —
                  while still catching <strong>97.8%</strong> of all hidden, mutating APT causal
                  chains.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section id="section-how-it-works" data-scheme="deep-forest">
          <div className="section-container">
            <div className="section-header center reveal-up">
              <span className="section-eyebrow">DETECTION PIPELINE</span>
              <h2 className="section-headline">
                <span className="gradient-text">
                  From Raw Logs to
                  <br />
                  Full Threat Intelligence
                </span>
              </h2>
            </div>

            <div className="how-it-works-row stagger-group">
              {[
                {
                  num: '01',
                  title: 'Load & Graph Construction',
                  body: 'Network telemetry from public cybersecurity benchmark datasets — DARPA TC, UNSW-NB15, LANL NetFlow — or custom data exports is parsed, normalized, and assembled into a continuous-time temporal graph. Entities become nodes; interactions become directed, timestamped edges.',
                  icon: (
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                      <ellipse cx="12" cy="5" rx="9" ry="3" stroke="currentColor" strokeWidth="2" />
                      <path d="M3 5v6c0 1.66 4 3 9 3s9-1.34 9-3V5" stroke="currentColor" strokeWidth="2" />
                      <path d="M3 11v6c0 1.66 4 3 9 3s9-1.34 9-3v-6" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  ),
                },
                {
                  num: '02',
                  title: 'V16 Apex TGNN Analysis',
                  body: 'The temporal graph flows through the V16 Apex engine: Universal Encoder projects behavioral features, CausalHTAConv performs causal attention message-passing, MemBank GRU maintains persistent memory with exponential time-decay, and the GRL scrubs domain-specific noise. Every event gets a threat probability.',
                  icon: (
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                      <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
                      <rect x="8" y="8" width="8" height="3" fill="currentColor" />
                      <rect x="8" y="13" width="8" height="3" fill="currentColor" />
                    </svg>
                  ),
                },
                {
                  num: '03',
                  title: 'Alert, Reconstruct & Explain',
                  body: 'Detected threats trigger full attack chain reconstruction — the backtracking engine traverses the temporal graph backward to the initial compromise. Every finding maps to MITRE ATT&CK tactics. Analysts receive a complete, explained timeline of the entire attack scenario.',
                  icon: (
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 2 L20 6 V12 C20 16 16.5 20 12 22 C7.5 20 4 16 4 12 V6 Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                      <path d="M12 8 V13 M12 16 V16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  ),
                },
              ].map((s, i) => (
                <div key={i} className="step-card card-hover stagger-item">
                  <span className="step-number">{s.num}</span>
                  <div className="step-icon-wrap">{s.icon}</div>
                  <h3 className="step-title">{s.title}</h3>
                  <p className="step-body">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TECH STACK ── */}
        <section id="section-tech-stack" data-scheme="golden-woodland">
          <div className="section-container" style={{ paddingTop: '60px', paddingBottom: '60px' }}>
            <div className="section-header center reveal-up">
              <span className="section-eyebrow">BUILT WITH</span>
            </div>
            <div className="tech-badges reveal-up">
              {[
                'Next.js 16', 'TypeScript 5', 'React 19', 'Tailwind CSS 4',
                'Three.js', 'PyTorch (backend model)', 'Recharts', 'shadcn/ui',
                'GSAP', 'Lucide React',
              ].map((t, i) => (
                <span key={i} className="tech-badge">{t}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ── DATASETS ── */}
        <section id="section-datasets" data-scheme="morning-mist">
          <div className="section-container" style={{ paddingTop: '60px', paddingBottom: '60px' }}>
            <div className="section-header center reveal-up">
              <span className="section-eyebrow">EVALUATED ON</span>
              <h2 className="section-headline">
                <span className="gradient-text">Real-World Benchmark Datasets</span>
              </h2>
            </div>

            <div className="datasets-grid stagger-group">
              {[
                {
                  badge: 'BENCHMARK',
                  badgeClass: 'benchmark',
                  title: 'DARPA Transparent Computing v3',
                  body: "Comprehensive provenance graph dataset from DARPA's TC program. Captures fine-grained OS-level activity including process execution, file operations, network connections, and IPC — representing sophisticated APT scenarios including supply chain attacks.",
                  detail: 'Entity types: Processes · Files · Sockets · IPC',
                },
                {
                  badge: 'BENCHMARK',
                  badgeClass: 'benchmark',
                  title: 'UNSW-NB15 Network Intrusion',
                  body: "Generated by the Cyber Range Lab at UNSW Canberra. Contains 2.5M network records with 9 attack families including Fuzzers, Analysis, Backdoors, DoS, Exploits, Generic, Reconnaissance, Shellcode, and Worms alongside normal traffic.",
                  detail: 'Records: 2.5M · Classes: 9 attack families',
                },
                {
                  badge: 'PUBLIC DATASET',
                  badgeClass: 'public-dataset',
                  title: 'Los Alamos National Laboratory NetFlow',
                  body: "Anonymized network flow data from LANL's publicly released enterprise network dataset spanning 58 days, including a known red-team attack campaign. Provides high-volume, enterprise-scale validation for scalable detection under realistic conditions.",
                  detail: 'Duration: 58 days · Type: Enterprise NetFlow',
                },
              ].map((d, i) => (
                <div key={i} className="dataset-card card-hover stagger-item">
                  <span className={`dataset-badge ${d.badgeClass}`}>{d.badge}</span>
                  <h3 className="dataset-title">{d.title}</h3>
                  <p className="dataset-body">{d.body}</p>
                  <div className="dataset-detail">{d.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section id="section-cta" data-scheme="midnight-forest" style={{ padding: '160px 0' }}>
          <div className="section-container" style={{ paddingTop: 0, paddingBottom: 0 }}>
            <div className="cta-section-inner reveal-up">
              <span className="section-eyebrow">OPEN SOURCE RESEARCH — MIT LICENSE</span>
              <h2 className="cta-headline">
                <span className="gradient-text">
                  Explore TGDetect.
                  <br />
                  Running in Minutes.
                </span>
              </h2>
              <p className="cta-sub">
                Clone the repository, install dependencies, and run npm run dev.
                The full V16 Apex TGNN platform — complete with detection simulation, attack
                backtracking, and explainability — is ready instantly.
              </p>

              <div className="terminal-block">
                <button
                  className={`terminal-copy-btn ${copied ? 'copied' : ''}`}
                  onClick={handleCopy}
                  aria-label="Copy install command"
                >
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
                <span className="prompt">$</span>git clone https://github.com/Pratham2511/TGDetect-LandingPage.git
                {'\n'}
                <span className="prompt">$</span>cd TGDetect-LandingPage
                {'\n'}
                <span className="prompt">$</span>npm install
                {'\n'}
                <span className="prompt">$</span>npm run dev
              </div>

              <div className="cta-buttons">
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  ↓ Download on GitHub
                </a>
                <a
                  href={VERCEL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  Launch Live Demo →
                </a>
              </div>

              <div className="trust-badges">
                <span className="trust-badge">
                  <span className="check">✓</span> MIT Licensed
                </span>
                <span className="trust-badge">
                  <span className="check">✓</span> Open Source
                </span>
                <span className="trust-badge">
                  <span className="check">✓</span> Next.js 16
                </span>
                <span className="trust-badge">
                  <span className="check">✓</span> TypeScript 5
                </span>
                <span className="trust-badge">
                  <span className="check">✓</span> Academic Research Project
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <section id="section-footer" data-scheme="midnight-forest" style={{ padding: '48px 0' }}>
          <div className="footer-inner">
            <Logo />
            <div className="footer-links">
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
              >
                GitHub
              </a>
              <a
                href={VERCEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
              >
                Live Demo
              </a>
              <a href="#section-overview" className="footer-link" onClick={(e) => { e.preventDefault(); scrollTo('section-overview'); }}>
                Documentation
              </a>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
              >
                License
              </a>
            </div>
          </div>
          <div className="footer-copyright">
            © 2026 TGDetect. V16 Apex Temporal Graph Neural Network — Advanced Persistent Threat
            Detection. All evaluations performed on publicly available benchmark datasets.
          </div>
        </section>
      </main>
    </div>
  );
}
