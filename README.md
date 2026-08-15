<p align="center">
  <img src="public/logo.svg" alt="TGDetect Logo" width="80" height="80" />
</p>

<h1 align="center">TGDetect — Landing Page</h1>

<p align="center">
  <strong>V16 Apex Temporal Graph Neural Network for Advanced Persistent Threat Detection</strong><br/>
  Academic Research Project &middot; MIT Licensed &middot; Open Source
</p>

<p align="center">
  <a href="https://github.com/Pratham2511/TGDetect-LandingPage"><strong>View on GitHub</strong></a>
  &nbsp;&middot;&nbsp;
  <a href="https://tgdetect.vercel.app"><strong>Live Demo</strong></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript" alt="TypeScript 5" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/Three.js-0.185-000000?logo=threedotjs" alt="Three.js" />
  <img src="https://img.shields.io/badge/GSAP-3.15-88CE02?logo=greensock" alt="GSAP" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="MIT License" />
</p>

---

## Overview

TGDetect is a research platform deploying a **V16 Apex Temporal Graph Neural Network** to identify Advanced Persistent Threats (APTs). The landing page showcases the project's architecture, research results, and capabilities — all evaluated on publicly available cybersecurity benchmark datasets.

> **Note:** This is an academic research prototype. All evaluations are performed on publicly available benchmark datasets (DARPA TC v3, UNSW-NB15, LANL NetFlow) using Out-of-Distribution evaluation methodology. Live production deployment is planned for future development.

---

## Key Metrics

| Metric | Value |
| :--- | :---: |
| **Precision** | 100.0% |
| **Recall** | 97.8% |
| **F1 Score** | 98.9% |
| **ROC-AUC** | 0.989 |
| **Benchmark Events** | 1,000,000+ |
| **Architecture Modules** | 6 |

---

## Features

### Interactive Landing Experience

- **Neural Signal Color System** — 8 distinct premium color schemes that transition as users scroll through 12 themed sections, from deep void-space to warm nebula to electric midnight
- **3D Temporal Graph Network** — Real-time Three.js visualization with 24 interactive nodes, 28 edges, and mouse-driven parallax rotation
- **Magnetic Cursor** — Custom cursor with color-reactive ring that adapts to each section's color scheme (desktop only)
- **Text Scramble Animations** — Matrix-style text decode effect on every section headline
- **3D Card Tilt** — Holographic card hover effects with shine layer on all interactive cards
- **Terminal Typewriter** — Animated terminal that types out quickstart commands when the CTA section enters the viewport
- **Particle Burst Effects** — Celebration particles burst from stat counters when they reach their target values
- **Scroll-Triggered Spotlight** — Radial gradient spotlight follows the mouse cursor across dark sections
- **Ambient Floating Orbs** — Three large blurred gradient orbs that slowly drift in the background
- **Architecture Boot Sequence** — Cards appear one-by-one with scan-line sweep animations
- **Smooth Scrolling** — Lenis-powered smooth scroll with GSAP ScrollTrigger orchestration

### Content Sections (12 Total)

1. **Hero** — Project overview, CTA buttons, Three.js graph visualization
2. **Stats Bar** — Key performance metrics with animated counters
3. **Overview** — Graph-centric approach to APT detection with pipeline diagram
4. **Core Objectives** — 4 research objectives (Temporal Modeling, Adaptive Learning, Incident Reconstruction, Explainable AI)
5. **Architecture** — 6 V16 Apex modules with code blocks (UniversalEncoder, MultiResTimeEncoder, MemBank GRU, CausalHTAConv, GRL + Domain Head, SupervisedContrastiveLoss)
6. **Features** — 6 key capabilities (Research Detection Interface, Multi-Format Data Support, MITRE ATT&CK Mapping, Attack Chain Reconstruction, Continuous Drift Adaptation, Temporal Explainability)
7. **Results** — Performance metrics with evaluation methodology box
8. **How It Works** — 3-step walkthrough (Load & Graph Construction, V16 Apex TGNN Analysis, Alert & Reconstruct)
9. **Tech Stack** — Technology badges (Next.js, TypeScript, React, Tailwind, Three.js, PyTorch, etc.)
10. **Datasets** — 3 benchmark datasets (DARPA TC v3, UNSW-NB15, LANL NetFlow)
11. **CTA / Get Started** — Quickstart terminal with copy-to-clipboard
12. **Footer** — Links, copyright, and disclaimer

### Responsive Design

- Desktop: Full multi-column layouts, custom cursor, Three.js 3D scene
- Mobile: Single-column layouts, animated SVG graph fallback, hamburger menu
- Extra small phones (<380px): Further optimized typography and spacing

### Accessibility

- `prefers-reduced-motion` media query disables all animations
- Semantic HTML section structure
- ARIA labels on interactive elements
- Keyboard-navigable hamburger menu

---

## Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router, Standalone Output) |
| **Language** | TypeScript 5 |
| **UI Library** | React 19 |
| **Styling** | Tailwind CSS 4 + Custom CSS Variables |
| **3D Graphics** | Three.js + @react-three/fiber + @react-three/drei |
| **Animations** | GSAP 3 + ScrollTrigger + Framer Motion |
| **Smooth Scroll** | Lenis |
| **Icons** | Lucide React |
| **UI Components** | shadcn/ui (Radix primitives) |
| **Charts** | Recharts |
| **Database** | Prisma ORM |
| **State Management** | Zustand |
| **Validation** | Zod |

---

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **npm** >= 9 (or **bun**)

### Installation

```bash
# Clone the repository
git clone https://github.com/Pratham2511/TGDetect-LandingPage.git

# Navigate to project directory
cd TGDetect-LandingPage

# Install dependencies
npm install

# Start development server
npm run dev
```

The landing page will be available at **http://localhost:3000/landing**

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm run start
```

---

## Project Structure

```
TGDetect-LandingPage/
├── public/
│   ├── logo.svg              # TGDetect branded graph icon
│   └── robots.txt
├── src/
│   ├── app/
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Main dashboard page
│   │   ├── api/
│   │   │   └── route.ts       # API route
│   │   └── landing/
│   │       ├── page.tsx       # ★ Landing page (main component, ~1100 lines)
│   │       ├── landing.css    # ★ Base stylesheet (8 color schemes + utilities)
│   │       ├── landing-desktop.css  # ★ Desktop layout (>=1024px)
│   │       ├── landing-mobile.css   # ★ Mobile layout (<1024px)
│   │       └── GraphCanvas.tsx      # ★ Three.js 3D graph visualization
│   ├── components/ui/         # shadcn/ui components
│   ├── hooks/                 # Custom React hooks
│   └── lib/
│       ├── db.ts              # Database client
│       └── utils.ts           # Utility functions
├── prisma/
│   └── schema.prisma          # Database schema
├── next.config.ts             # Next.js configuration
├── tailwind.config.ts         # Tailwind configuration
├── tsconfig.json              # TypeScript configuration
├── package.json
└── README.md
```

---

## Neural Signal Color System

The landing page uses a unique **8-scheme color journey** system. Each section has a distinct color palette defined via CSS custom properties (`data-scheme` attribute):

| Section | Scheme | Theme |
| :--- | :--- | :--- |
| Hero, How It Works | `void-space` | Ultra deep black-blue, electric violet + cyan |
| Stats Bar | `cosmic-dawn` | Warm cream/rose (LIGHT) |
| Overview, Datasets | `aurora-white` | Pure white with violet/teal accents (LIGHT) |
| Objectives | `nebula` | Deep purple/indigo, gold/amber accents |
| Architecture, Features | `ocean-abyss` | Deep ocean black, electric cyan, neon emerald |
| Results | `arctic-frost` | Ice white, electric blue/teal (LIGHT) |
| Tech Stack | `warm-ember` | Dark rich amber, gold glows |
| CTA, Footer | `event-horizon` | True void black, neon green portal |

Every element uses `var(--sec-*)` CSS variables — zero hardcoded colors.

---

## Datasets

All evaluations performed on publicly available cybersecurity benchmark datasets:

| Dataset | Type | Description |
| :--- | :--- | :--- |
| **DARPA TC v3** | Benchmark | DARPA Engagement Phase 3 network traffic data |
| **UNSW-NB15** | Benchmark | Network intrusion detection dataset with 45 features |
| **LANL NetFlow** | Public Dataset | Publicly released enterprise network dataset spanning 58 days |

---

## Architecture

The V16 Apex TGNN consists of 6 interconnected modules:

1. **UniversalEncoder** — Node representation learning
2. **MultiResTimeEncoder** — Temporal encoding with multi-resolution attention
3. **MemBank GRU** — Dynamic memory with rehearsal buffer for concept drift
4. **CausalHTAConv** — Causal heterogeneous temporal graph convolution
5. **GRL + Domain Head** — Adversarial domain generalization (Gradient Reversal Layer)
6. **SupervisedContrastiveLoss** — Tactic embedding clustering for MITRE ATT&CK alignment

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2026 TGDetect

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

## Author

**Pratham2511**

- [GitHub Profile](https://github.com/Pratham2511)
- [TGDetect Repository](https://github.com/Pratham2511/-TGDetect-Temporal-Graph)

---

<p align="center">
  <sub>Built with Next.js 16, React 19, Three.js, GSAP & Tailwind CSS 4</sub><br/>
  <sub>&copy; 2026 TGDetect — Academic Research Project</sub>
</p>
