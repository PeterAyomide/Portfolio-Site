import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollScene from "./src/components/ScrollScene";

gsap.registerPlugin(ScrollTrigger);

const PROFILE = {
  firstName: "Peter",
  lastName: "Adegboye",
  role: "Agentic Systems Engineer",
  subtitle: "Solo Founder · AI Automation",
  email: "peteradegboye17@gmail.com",
  github: "https://github.com/PeterAyomide",
  linkedin: "https://www.linkedin.com/in/peter-ayomide/",
  x: "https://x.com/",
  calendly: "https://calendly.com/",
  resume: "#",
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Manrope:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: auto; }
  
  body { 
    background: #040e09; 
    color: #cee8db;
    font-family: 'Manrope', system-ui, sans-serif;
    overflow-x: hidden;
  }

  .scroll-scene {
    position: relative;
    isolation: isolate;
  }
  .scroll-scene-content {
    position: relative;
    min-height: 100vh;
    transform-style: preserve-3d;
  }
  .scene-shell {
    position: relative;
    min-height: 100vh;
    perspective: 1400px;
    transform-style: preserve-3d;
    overflow: hidden;
  }
  .scene-darken {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 40%, rgba(4,14,9,0.05), rgba(0,0,0,0.95));
    opacity: 0;
    pointer-events: none;
    z-index: 5;
  }
  .scene-stage {
    position: relative;
    z-index: 4;
    transform-style: preserve-3d;
    will-change: transform, opacity, filter;
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #040e09; }
  ::-webkit-scrollbar-thumb { background: rgba(0,232,122,0.3); border-radius: 2px; }

  .mono { font-family: 'JetBrains Mono', monospace; }
  .syne { font-family: 'Space Grotesk', sans-serif; }

  /* Nav */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 60px;
    background: linear-gradient(to bottom, rgba(4,14,9,0.95), transparent);
    backdrop-filter: blur(2px);
  }
  .nav-logo {
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 800;
    font-size: 1.1rem;
    color: #f0faf5;
    letter-spacing: -0.02em;
  }
  .nav-logo span { color: #00e87a; }
  .nav-links { display: flex; gap: 32px; align-items: center; }
  .nav-menu-btn {
    display: none;
    width: 40px;
    height: 40px;
    border-radius: 8px;
    border: 1px solid rgba(206,232,219,0.2);
    background: rgba(4,14,9,0.6);
    color: #cee8db;
    cursor: pointer;
    align-items: center;
    justify-content: center;
  }
  .mobile-menu {
    display: none;
    position: fixed;
    top: 72px;
    left: 16px;
    right: 16px;
    z-index: 120;
    border: 1px solid rgba(0,232,122,0.2);
    background: rgba(4,14,9,0.95);
    border-radius: 12px;
    padding: 14px;
    backdrop-filter: blur(10px);
  }
  .mobile-menu.open { display: grid; gap: 10px; }
  .mobile-menu a {
    text-decoration: none;
    color: #cee8db;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.76rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 10px 12px;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px;
  }
  .nav-link {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.72rem;
    letter-spacing: 0.12em;
    color: #5a8070;
    text-decoration: none;
    text-transform: uppercase;
    transition: color 0.2s;
  }
  .nav-link:hover { color: #00e87a; }
  .nav-cta {
    background: transparent;
    border: 1px solid rgba(0,232,122,0.5);
    color: #00e87a;
    padding: 8px 20px;
    border-radius: 4px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.72rem;
    letter-spacing: 0.1em;
    cursor: pointer;
    transition: all 0.2s;
    text-decoration: none;
    text-transform: uppercase;
  }
  .nav-cta:hover { background: rgba(0,232,122,0.1); border-color: #00e87a; }

  /* Hero */
  .hero {
    height: 100vh;
    display: flex; flex-direction: column;
    align-items: flex-start; justify-content: center;
    padding: 0 60px;
    position: relative;
  }
  .hero-scene .hero {
    padding-top: 80px;
  }
  .hero-eyebrow {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.72rem;
    letter-spacing: 0.25em;
    color: #00e87a;
    text-transform: uppercase;
    margin-bottom: 20px;
    display: flex; align-items: center; gap: 12px;
  }
  .hero-eyebrow::before {
    content: '';
    width: 32px; height: 1px;
    background: #00e87a;
  }
  .hero-name {
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 800;
    font-size: clamp(3.5rem, 8vw, 7rem);
    line-height: 0.95;
    letter-spacing: -0.04em;
    color: #f0faf5;
    margin-bottom: 8px;
  }
  .hero-name .accent { color: #00e87a; }
  .hero-title {
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 600;
    font-size: clamp(1.2rem, 3vw, 2rem);
    color: #3a6050;
    margin-bottom: 28px;
    letter-spacing: -0.02em;
  }
  .hero-desc {
    max-width: 520px;
    font-size: 1rem;
    line-height: 1.7;
    color: #7aaa92;
    margin-bottom: 40px;
  }
  .hero-actions { display: flex; gap: 16px; align-items: center; }
  .btn-primary {
    background: #00e87a;
    color: #040e09;
    border: none;
    padding: 14px 32px;
    border-radius: 4px;
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 700;
    font-size: 0.9rem;
    letter-spacing: 0.02em;
    cursor: pointer;
    transition: all 0.2s;
    text-decoration: none;
    display: inline-block;
  }
  .btn-primary:hover { background: #00ff88; transform: translateY(-1px); }
  .btn-ghost {
    background: transparent;
    color: #cee8db;
    border: 1px solid rgba(206,232,219,0.2);
    padding: 14px 32px;
    border-radius: 4px;
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s;
    text-decoration: none;
    display: inline-block;
  }
  .btn-ghost:hover { border-color: rgba(206,232,219,0.5); color: #f0faf5; }
  .scroll-hint {
    position: absolute;
    bottom: 40px; left: 60px;
    display: flex; flex-direction: column; align-items: center; gap: 8px;
  }
  .scroll-hint-line {
    width: 1px; height: 48px;
    background: linear-gradient(to bottom, transparent, #00e87a);
    animation: scrollPulse 2s ease-in-out infinite;
  }
  .scroll-hint-text {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.2em;
    color: #3a6050;
    text-transform: uppercase;
    writing-mode: vertical-rl;
  }
  @keyframes scrollPulse {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 1; }
  }

  /* Sections */
  .section {
    padding: 100px 60px;
    position: relative;
  }
  .projects-scene .section,
  .about-scene .section {
    min-height: 100vh;
  }
  .projects-stage {
    transform: translate3d(0, 10vh, -180px);
    opacity: 0.3;
    filter: saturate(0.8);
  }
  .about-stage {
    clip-path: inset(100% 0% 0% 0%);
    will-change: clip-path;
  }
  .section-glass {
    background: rgba(4, 14, 9, 0.8);
    backdrop-filter: blur(12px);
    border-top: 1px solid rgba(0,232,122,0.06);
  }
  .section-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: #00e87a;
    margin-bottom: 12px;
    display: flex; align-items: center; gap: 12px;
  }
  .section-label::after { content: ''; flex: 1; height: 1px; max-width: 60px; background: rgba(0,232,122,0.3); }
  .section-title {
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 800;
    font-size: clamp(2rem, 4vw, 3.5rem);
    letter-spacing: -0.04em;
    color: #f0faf5;
    line-height: 1.05;
    margin-bottom: 60px;
  }

  /* Projects */
  .projects-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }
  @media (max-width: 900px) {
    .projects-grid { grid-template-columns: 1fr; }
    .nav { padding: 20px 24px; }
    .hero { padding: 0 24px; }
    .section { padding: 80px 24px; }
    .nav-links { display: none; }
    .nav-menu-btn { display: inline-flex; }
    .hero-name { font-size: 3rem; }
    .hero-actions { flex-wrap: wrap; }
    .hero-actions .btn-primary,
    .hero-actions .btn-ghost {
      flex: 1 1 220px;
      text-align: center;
    }
    .scroll-hint { display: none; }
  }
  @media (max-width: 560px) {
    .hero-actions .btn-primary,
    .hero-actions .btn-ghost {
      width: 100%;
      max-width: 100%;
      padding: 13px 18px;
    }
  }

  .project-card {
    background: rgba(8, 22, 14, 0.7);
    border: 1px solid rgba(0,232,122,0.1);
    border-radius: 16px;
    padding: 36px;
    position: relative;
    overflow: hidden;
    transition: border-color 0.3s, transform 0.3s;
    cursor: default;
    will-change: transform;
  }
  .project-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: var(--card-color, #00e87a);
    opacity: 0.6;
    transition: opacity 0.3s;
  }
  .project-card:hover {
    border-color: rgba(0,232,122,0.25);
    transform: translateY(-4px);
  }
  .project-card:hover::before { opacity: 1; }

  .project-card-b {
    --card-color: #1a7aff;
    border-color: rgba(26,122,255,0.1);
  }
  .project-card-b:hover { border-color: rgba(26,122,255,0.25); }

  .project-badge {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 20px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-bottom: 20px;
  }
  .badge-green { background: rgba(0,232,122,0.12); color: #00e87a; border: 1px solid rgba(0,232,122,0.3); }
  .badge-blue { background: rgba(26,122,255,0.12); color: #4da3ff; border: 1px solid rgba(26,122,255,0.3); }

  .project-name {
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 800;
    font-size: 2rem;
    letter-spacing: -0.04em;
    color: #f0faf5;
    margin-bottom: 4px;
  }
  .project-tagline {
    font-size: 0.9rem;
    color: #5a8070;
    margin-bottom: 20px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.72rem;
    letter-spacing: 0.05em;
  }
  .project-desc {
    font-size: 0.9rem;
    line-height: 1.75;
    color: #7aaa92;
    margin-bottom: 28px;
  }

  /* Features */
  .features-list { margin-bottom: 28px; display: flex; flex-direction: column; gap: 10px; }
  .feature-item {
    display: flex; gap: 12px; align-items: flex-start;
    padding: 12px 14px;
    background: rgba(0,0,0,0.25);
    border: 1px solid rgba(255,255,255,0.04);
    border-radius: 8px;
  }
  .feature-dot {
    width: 6px; height: 6px; border-radius: 50%;
    margin-top: 6px; flex-shrink: 0;
  }
  .dot-green { background: #00e87a; box-shadow: 0 0 8px rgba(0,232,122,0.5); }
  .dot-blue { background: #4da3ff; box-shadow: 0 0 8px rgba(77,163,255,0.5); }
  .feature-label {
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 600;
    font-size: 0.82rem;
    color: #cee8db;
    margin-bottom: 2px;
  }
  .feature-desc { font-size: 0.8rem; color: #4a7060; line-height: 1.5; }

  /* Metrics */
  .metrics-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
  .metric-pill {
    padding: 4px 12px;
    background: rgba(0,0,0,0.35);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.68rem;
    letter-spacing: 0.05em;
    color: #7aaa92;
  }

  /* Tech stack */
  .tech-row { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 24px; }
  .tech-tag {
    padding: 3px 10px;
    background: rgba(0,0,0,0.4);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 4px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.68rem;
    letter-spacing: 0.05em;
    color: #5a8070;
  }

  /* Demo placeholder */
  .demo-placeholder {
    border: 1px dashed rgba(0,232,122,0.15);
    border-radius: 10px;
    aspect-ratio: 16/7;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 10px;
    background: rgba(0,0,0,0.25);
    margin-top: 8px;
    transition: border-color 0.2s;
  }
  .demo-placeholder:hover { border-color: rgba(0,232,122,0.3); }
  .demo-play {
    width: 44px; height: 44px; border-radius: 50%;
    border: 1px solid rgba(0,232,122,0.3);
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s;
  }
  .demo-placeholder:hover .demo-play { border-color: rgba(0,232,122,0.6); background: rgba(0,232,122,0.05); }
  .demo-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.2em;
    color: #3a5548;
    text-transform: uppercase;
  }
  .demo-placeholder-b .demo-play { border-color: rgba(26,122,255,0.3); }
  .demo-placeholder-b:hover { border-color: rgba(26,122,255,0.3); }
  .demo-placeholder-b:hover .demo-play { border-color: rgba(26,122,255,0.6); background: rgba(26,122,255,0.05); }

  /* Card actions */
  .card-actions { display: flex; gap: 10px; margin-top: 20px; }
  .btn-card {
    flex: 1; padding: 10px 0;
    border-radius: 6px;
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 600;
    font-size: 0.78rem;
    letter-spacing: 0.04em;
    cursor: pointer;
    transition: all 0.2s;
    text-align: center;
    border: none;
    text-decoration: none;
    display: flex; align-items: center; justify-content: center; gap: 6px;
  }
  .btn-card-primary { background: rgba(0,232,122,0.12); color: #00e87a; border: 1px solid rgba(0,232,122,0.25); }
  .btn-card-primary:hover { background: rgba(0,232,122,0.2); }
  .btn-card-primary-b { background: rgba(26,122,255,0.1); color: #4da3ff; border: 1px solid rgba(26,122,255,0.25); }
  .btn-card-primary-b:hover { background: rgba(26,122,255,0.18); }
  .btn-card-ghost { background: transparent; color: #5a8070; border: 1px solid rgba(255,255,255,0.07); }
  .btn-card-ghost:hover { color: #cee8db; border-color: rgba(255,255,255,0.15); }
  .btn-disabled { opacity: 0.4; cursor: not-allowed; }
  .btn-disabled:hover { transform: none !important; background: inherit !important; }

  /* About section */
  .about-grid { display: grid; grid-template-columns: 1fr 1.6fr; gap: 60px; align-items: start; }
  @media (max-width: 800px) { .about-grid { grid-template-columns: 1fr; } }
  .about-avatar {
    aspect-ratio: 1;
    background: rgba(8,22,14,0.8);
    border: 1px solid rgba(0,232,122,0.1);
    border-radius: 16px;
    overflow: hidden;
    display: block;
    max-width: 280px;
  }
  .about-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 20%;
    display: block;
  }
  .about-text p { font-size: 0.95rem; line-height: 1.8; color: #7aaa92; margin-bottom: 16px; }
  .about-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 32px; }
  @media (max-width: 700px) { .about-stats { grid-template-columns: 1fr; } }
  .about-stat {
    padding: 16px;
    background: rgba(0,0,0,0.3);
    border: 1px solid rgba(0,232,122,0.08);
    border-radius: 8px;
  }
  .stat-kicker {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 600;
    font-size: 0.68rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #00e87a;
    margin-bottom: 8px;
  }
  .stat-label { font-size: 0.85rem; color: #7aaa92; line-height: 1.6; }

  /* Footer */
  .footer {
    padding: 80px 60px 48px;
    background: rgba(2, 8, 5, 0.9);
    border-top: 1px solid rgba(0,232,122,0.07);
    position: relative;
  }
  .footer-inner { max-width: 600px; margin: 0 auto; text-align: center; }
  .footer-tag {
    display: inline-block;
    padding: 4px 14px;
    background: rgba(0,232,122,0.08);
    border: 1px solid rgba(0,232,122,0.2);
    border-radius: 20px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.15em;
    color: #00e87a;
    text-transform: uppercase;
    margin-bottom: 24px;
  }
  .footer-heading {
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 800;
    font-size: clamp(2rem, 5vw, 3.5rem);
    letter-spacing: -0.04em;
    color: #f0faf5;
    margin-bottom: 16px;
    line-height: 1.1;
  }
  .footer-sub { font-size: 0.9rem; color: #4a7060; margin-bottom: 40px; line-height: 1.7; }
  .footer-email {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.85rem;
    color: #00e87a;
    letter-spacing: 0.05em;
    text-decoration: none;
    border-bottom: 1px solid rgba(0,232,122,0.3);
    padding-bottom: 2px;
    transition: border-color 0.2s;
  }
  .footer-email:hover { border-color: #00e87a; }
  .footer-bottom {
    margin-top: 60px;
    padding-top: 24px;
    border-top: 1px solid rgba(255,255,255,0.05);
    display: flex; justify-content: space-between; align-items: center;
    flex-wrap: wrap; gap: 12px;
  }
  .footer-copy { font-size: 0.75rem; color: #2a4535; font-family: 'JetBrains Mono', monospace; }
  .footer-links { display: flex; gap: 24px; }
  .footer-link { font-size: 0.75rem; color: #3a5548; text-decoration: none; transition: color 0.2s; font-family: 'JetBrains Mono', monospace; }
  .footer-link:hover { color: #00e87a; }

  /* Service section */
  .services-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
  .service-card {
    background: rgba(8,22,14,0.65);
    border: 1px solid rgba(0,232,122,0.1);
    border-radius: 12px;
    padding: 24px;
  }
  .service-title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.2rem;
    color: #f0faf5;
    margin-bottom: 12px;
    letter-spacing: -0.02em;
  }
  .service-text {
    color: #7aaa92;
    font-size: 0.88rem;
    line-height: 1.65;
    margin-bottom: 16px;
  }
  .service-outcomes {
    font-family: 'JetBrains Mono', monospace;
    color: #4da3ff;
    font-size: 0.7rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  @media (max-width: 1000px) { .services-grid { grid-template-columns: 1fr; } }

  .engagement-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin-top: 22px;
  }
  .engagement-item {
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(0,0,0,0.22);
    border-radius: 8px;
    padding: 11px 12px;
    color: #7aaa92;
    font-size: 0.82rem;
  }
  @media (max-width: 700px) { .engagement-list { grid-template-columns: 1fr; } }

  .contact-actions {
    display: flex;
    justify-content: center;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 28px;
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation: none !important;
      transition: none !important;
      scroll-behavior: auto !important;
    }
    .scroll-scene-content,
    .scene-stage,
    .project-card,
    .about-stage {
      transform: none !important;
      clip-path: none !important;
      opacity: 1 !important;
      filter: none !important;
    }
  }

  /* Animations */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .fade-up { animation: fadeUp 0.7s ease forwards; }
  .delay-1 { animation-delay: 0.1s; opacity: 0; }
  .delay-2 { animation-delay: 0.2s; opacity: 0; }
  .delay-3 { animation-delay: 0.3s; opacity: 0; }
  .delay-4 { animation-delay: 0.45s; opacity: 0; }
  .delay-5 { animation-delay: 0.6s; opacity: 0; }

  /* Divider line */
  .divider { 
    height: 1px; 
    background: linear-gradient(to right, transparent, rgba(0,232,122,0.2), transparent);
    margin: 0 60px;
  }
`;

const projects = [
  {
    id: "agencyos",
    name: "AgencyOS",
    badge: "Production",
    badgeClass: "badge-green",
    tagline: "AI Operating System for Agencies",
    desc: "A production-grade AI digital employee that lives inside your agency. Learns your company from internal documents, proactively scores and researches leads, drafts outreach emails, and delivers daily intelligence briefings — with human approval at every step.",
    color: "#00e87a",
    cardClass: "",
    demoClass: "",
    dotClass: "dot-green",
    btnPrimary: "btn-card-primary",
    features: [
      { label: "CorporateBrain (RAG)", desc: "Upload docs → auto-chunk + embed into pgvector → natural language Q&A with session memory" },
      { label: "LeadSentinel", desc: "LLM lead scoring with priority levels, real-time glassmorphism dashboard, bulk scoring" },
      { label: "Sentinel Agent", desc: "5-step pipeline: Fetch → KB Search → Web Research → Draft → Save proposals for human review" },
      { label: "Daily Manager Briefing", desc: "Morning intelligence via Telegram, SMTP email, or JSON API — fully schedulable" },
      { label: "Internet Prospector", desc: "Natural language prospect discovery via parallel DuckDuckGo searches + LLM extraction" },
    ],
    tech: ["FastAPI", "Python", "Supabase", "pgvector", "RAG", "HMAC-SHA256", "Slack Bot", "Telegram Bot", "DuckDuckGo", "OpenAI API"],
    metrics: ["5-step autonomous pipeline", "Human-in-loop approval", "3 delivery channels", "HMAC webhook security", "Rate limiting"],
    liveUrl: "#",
    repoUrl: "https://github.com/PeterAyomide/AgencyOS",
    caseStudyUrl: "#",
  },
  {
    id: "forestwise",
    name: "ForestWise",
    badge: "Live on Edge",
    badgeClass: "badge-blue",
    tagline: "Domain AI Case Study: Vertical Intelligence in Production",
    desc: "ForestWise is my proof that I can go deep in any business domain, not just generic chat apps. I used forestry as the testbed to model expert workflows, merge live field signals, and ship a resilient AI assistant that still performs under real production constraints.",
    color: "#1a7aff",
    cardClass: "project-card-b",
    demoClass: "demo-placeholder-b",
    dotClass: "dot-blue",
    btnPrimary: "btn-card-primary-b",
    features: [
      { label: "Deep Vertical Modeling", desc: "Captured domain-specific decision logic so recommendations reflect how real specialists think and execute" },
      { label: "Real-World Data Fusion", desc: "Combines climate and soil signals to support smarter planning decisions, not generic one-size-fits-all answers" },
      { label: "Reliability Architecture", desc: "Multi-model fallback design keeps the assistant responsive when one provider degrades or fails" },
      { label: "Workflow-Aware Guidance", desc: "Adapts recommendations based on project intent, helping teams move from analysis to action" },
      { label: "Production Delivery", desc: "Edge deployment architecture optimized for global availability and low-latency responses" },
    ],
    tech: ["Cloudflare Workers", "JavaScript", "Cerebras", "Groq", "LLaMA 3.1", "RAG", "SoilGrids API", "NASA POWER", "OpenMeteo", "OpenWeather"],
    metrics: ["Edge-deployed globally", "Multi-LLM fallback", "Nigerian species DB", "5 project types", "Conversation memory"],
    liveUrl: "#",
    repoUrl: "https://github.com/PeterAyomide/ForestWise-5.0",
    caseStudyUrl: "#",
  },
];

const services = [
  {
    title: "AI Workflow Automation",
    text: "I design and ship custom agent pipelines that remove repetitive operational work from your team.",
    outcomes: "Lead qualification, outbound drafting, daily briefings",
  },
  {
    title: "RAG + Internal Knowledge Systems",
    text: "Turn your scattered docs and SOPs into a searchable system your team can query in plain language.",
    outcomes: "Faster onboarding, accurate responses, lower support load",
  },
  {
    title: "Reliable API Integrations",
    text: "I connect LLMs, messaging, and external APIs with fallback logic and security safeguards.",
    outcomes: "Higher uptime, fewer failures, production confidence",
  },
];

const engagementModel = [
  "Freelance and contract roles",
  "Remote-first collaboration",
  "Greenfield builds and system upgrades",
  "Fast communication and weekly delivery updates",
];

export default function Portfolio() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isMobileViewport = window.matchMedia("(max-width: 900px)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasLowCpu = typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency <= 4;
    const hasLowMemory = typeof navigator.deviceMemory === "number" && navigator.deviceMemory <= 4;
    const useLiteScene = isMobileViewport || prefersReducedMotion || hasLowCpu || hasLowMemory;

    const w = window.innerWidth || 1000;
    const h = window.innerHeight || 700;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 200);
    camera.position.set(0, 0, 9);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !useLiteScene,
      powerPreference: useLiteScene ? "low-power" : "high-performance",
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, useLiteScene ? 1.25 : 1.8));
    renderer.setClearColor(0x040e09, 1);

    // Torus knot — main mathematical hero object
    const knotGeo = new THREE.TorusKnotGeometry(2, 0.5, useLiteScene ? 108 : 180, useLiteScene ? 14 : 20, 2, 3);
    const knotMat = new THREE.MeshPhongMaterial({
      color: 0x011408,
      emissive: new THREE.Color(0x00e87a),
      emissiveIntensity: 0.18,
      shininess: 110,
      specular: new THREE.Color(0x00e87a),
    });
    const knot = new THREE.Mesh(knotGeo, knotMat);
    scene.add(knot);

    // Wireframe overlay
    const wireGeo = new THREE.TorusKnotGeometry(2, 0.52, useLiteScene ? 60 : 90, useLiteScene ? 10 : 14, 2, 3);
    const wireMat = new THREE.MeshBasicMaterial({ wireframe: true, color: 0x00e87a, transparent: true, opacity: 0.18 });
    const wire = new THREE.Mesh(wireGeo, wireMat);
    scene.add(wire);

    // Orbital rings
    const makeRing = (r, color, opacity, rx, ry, rz) => {
      const mesh = new THREE.Mesh(
        new THREE.TorusGeometry(r, 0.013, 8, useLiteScene ? 72 : 120),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity })
      );
      mesh.rotation.set(rx, ry, rz);
      scene.add(mesh);
      return mesh;
    };
    const ring1 = makeRing(4.6, 0x00e87a, 0.28, 0, 0, 0);
    const ring2 = makeRing(5.3, 0x1a7aff, 0.22, Math.PI / 3, Math.PI / 6, 0);
    const ring3 = makeRing(6.1, 0x00e87a, 0.1, -Math.PI / 4, 0, Math.PI / 5);

    // Fibonacci sphere particles
    const N = useLiteScene ? 1200 : 2800;
    const pos = new Float32Array(N * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = golden * i;
      const dist = 14 + (Math.random() - 0.5) * 5;
      pos[i * 3] = Math.cos(theta) * r * dist;
      pos[i * 3 + 1] = y * dist;
      pos[i * 3 + 2] = Math.sin(theta) * r * dist;
    }
    const pg = new THREE.BufferGeometry();
    pg.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const pts = new THREE.Points(pg, new THREE.PointsMaterial({ color: 0x00e87a, size: 0.05, transparent: true, opacity: 0.45, sizeAttenuation: true }));
    scene.add(pts);

    // Lights
    scene.add(new THREE.AmbientLight(0x001a0a, 5));
    const pl1 = new THREE.PointLight(0x00e87a, 14, 22);
    scene.add(pl1);
    const pl2 = new THREE.PointLight(0x1a7aff, 10, 22);
    scene.add(pl2);

    let mx = 0, my = 0;
    const onMouse = (e) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    if (!isMobileViewport && !prefersReducedMotion) {
      window.addEventListener("mousemove", onMouse, { passive: true });
    }

    let animId = null;
    let t = 0;
    const renderFrame = () => {
      animId = requestAnimationFrame(renderFrame);
      t += 0.004;

      knot.rotation.x = t * 0.22;
      knot.rotation.y = t * 0.38;
      wire.rotation.x = t * 0.22;
      wire.rotation.y = t * 0.38;

      ring1.rotation.z = t * 0.14;
      ring2.rotation.x = Math.PI / 3 + t * 0.09;
      ring3.rotation.y = t * 0.07;

      pts.rotation.y = t * 0.025;
      pts.rotation.x = t * 0.01;

      pl1.position.set(Math.sin(t * 0.6) * 7, Math.cos(t * 0.4) * 4, Math.sin(t * 0.3) * 6);
      pl2.position.set(Math.cos(t * 0.6) * 7, Math.sin(t * 0.4) * 4, Math.cos(t * 0.3) * 6);

      camera.position.x += (mx * 0.7 - camera.position.x) * 0.035;
      camera.position.y += (my * 0.4 - camera.position.y) * 0.035;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    const startAnimation = () => {
      if (animId === null) {
        animId = requestAnimationFrame(renderFrame);
      }
    };
    const stopAnimation = () => {
      if (animId !== null) {
        cancelAnimationFrame(animId);
        animId = null;
      }
    };
    const onVisibilityChange = () => {
      if (document.hidden) {
        stopAnimation();
      } else {
        startAnimation();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    startAnimation();

    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, useLiteScene ? 1.25 : 1.8));
    };
    window.addEventListener("resize", onResize);

    return () => {
      stopAnimation();
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      knotGeo.dispose();
      knotMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      ring1.geometry.dispose();
      ring1.material.dispose();
      ring2.geometry.dispose();
      ring2.material.dispose();
      ring3.geometry.dispose();
      ring3.material.dispose();
      pg.dispose();
      pts.material.dispose();
      renderer.dispose();
    };
  }, []);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <div ref={containerRef} style={{ background: "#040e09", color: "#cee8db", fontFamily: "'Manrope', system-ui, sans-serif", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{CSS}</style>

      {/* Three.js canvas — fixed background */}
      <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, zIndex: 0, pointerEvents: "none" }} />

      {/* Radial vignette */}
      <div style={{ position: "fixed", inset: 0, background: "radial-gradient(ellipse 70% 70% at 65% 40%, transparent 10%, #040e09 75%)", zIndex: 1, pointerEvents: "none" }} />

      {/* Content layer */}
      <div style={{ position: "relative", zIndex: 2 }}>

        {/* ── NAV ── */}
        <nav className="nav">
          <div className="nav-logo syne">{PROFILE.firstName}<span>.</span></div>
          <div className="nav-links">
            <a className="nav-link" href="#projects">Projects</a>
            <a className="nav-link" href="#services">Services</a>
            <a className="nav-link" href="#about">About</a>
            <a className="nav-cta" href="#contact">Hire Me</a>
          </div>
          <button
            className="nav-menu-btn"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
            aria-label="Toggle mobile navigation"
          >
            {mobileMenuOpen ? "x" : "="}
          </button>
        </nav>

        <div className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`} id="mobile-nav">
          <a href="#projects" onClick={closeMenu}>Projects</a>
          <a href="#services" onClick={closeMenu}>Services</a>
          <a href="#about" onClick={closeMenu}>About</a>
          <a href="#contact" onClick={closeMenu}>Contact</a>
        </div>

        {/* ── HERO ── */}
        <section className="hero" id="hero">
          <div className="hero-eyebrow fade-up delay-1">{PROFILE.role}</div>
          <h1 className="hero-name fade-up delay-2">
            {PROFILE.firstName}<br />
            <span className="accent">{PROFILE.lastName}</span>
          </h1>
          <p className="hero-title fade-up delay-3">{PROFILE.subtitle}</p>
          <p className="hero-desc fade-up delay-4">
            I build production-grade AI systems — autonomous agents, RAG pipelines, and intelligent integrations — that solve real problems for real businesses. BSc Forestry → Self-taught AI engineer.
          </p>
          <div className="hero-actions fade-up delay-5">
            <a className="btn-primary" href="#projects">View Projects ↓</a>
            <a className="btn-ghost" href={PROFILE.resume} target="_blank" rel="noreferrer">Resume</a>
            <a className="btn-ghost" href="#contact">Get in Touch</a>
          </div>
          <div className="scroll-hint">
            <div className="scroll-hint-line" />
            <span className="scroll-hint-text">Scroll</span>
          </div>
        </section>

        {/* ── PROJECTS ── */}
        <section className="section section-glass" id="projects">
          <div className="section-label mono">Work</div>
          <h2 className="section-title syne">Selected<br />Production Systems</h2>
          <div className="projects-grid">
            {projects.map((p) => (
              <div key={p.id} className={`project-card ${p.cardClass}`} style={{ "--card-color": p.color }}>
                <span className={`project-badge ${p.badgeClass}`}>{p.badge}</span>
                <div className="project-name syne">{p.name}</div>
                <div className="project-tagline mono">{p.tagline}</div>
                <p className="project-desc">{p.desc}</p>

                {/* Demo placeholder */}
                <div className={`demo-placeholder ${p.demoClass}`}>
                  <div className="demo-play">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M4 2.5L13 8L4 13.5V2.5Z" fill={p.color} opacity="0.7" />
                    </svg>
                  </div>
                  <span className="demo-label mono">Demo · Coming Soon</span>
                </div>

                {/* Features */}
                <div className="features-list" style={{ marginTop: 24 }}>
                  {p.features.map((f) => (
                    <div key={f.label} className="feature-item">
                      <div className={`feature-dot ${p.dotClass}`} />
                      <div>
                        <div className="feature-label syne">{f.label}</div>
                        <div className="feature-desc">{f.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Metrics */}
                <div className="metrics-row">
                  {p.metrics.map((m) => (
                    <span key={m} className="metric-pill mono">{m}</span>
                  ))}
                </div>

                {/* Tech */}
                <div style={{ marginBottom: 8 }}>
                  <span className="section-label mono" style={{ fontSize: "0.62rem", marginBottom: 8, display: "inline-flex" }}>Stack</span>
                </div>
                <div className="tech-row">
                  {p.tech.map((t) => (
                    <span key={t} className="tech-tag mono">{t}</span>
                  ))}
                </div>

                {/* Actions */}
                <div className="card-actions">
                  <a
                    className={`btn-card ${p.btnPrimary} ${p.liveUrl === "#" ? "btn-disabled" : ""}`}
                    href={p.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-disabled={p.liveUrl === "#"}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2"/>
                      <path d="M4.5 3.5L8 6L4.5 8.5" fill="currentColor" opacity="0.8"/>
                    </svg>
                    Live Demo
                  </a>
                  <a className="btn-card btn-card-ghost" href={p.repoUrl} target="_blank" rel="noreferrer" aria-label={`${p.name} source code`}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M6 1C3.24 1 1 3.24 1 6C1 8.21 2.43 10.09 4.41 10.74C4.66 10.79 4.75 10.63 4.75 10.49V9.59C3.38 9.89 3.09 9 3.09 9C2.86 8.43 2.53 8.27 2.53 8.27C2.07 7.96 2.56 7.97 2.56 7.97C3.07 8 3.34 8.49 3.34 8.49C3.79 9.24 4.49 9.02 4.77 8.9C4.82 8.57 4.95 8.35 5.09 8.23C3.99 8.11 2.83 7.68 2.83 5.79C2.83 5.24 3.03 4.79 3.35 4.44C3.3 4.32 3.12 3.81 3.4 3.12C3.4 3.12 3.82 2.99 4.75 3.64C5.14 3.53 5.57 3.48 6 3.48C6.43 3.48 6.86 3.53 7.25 3.64C8.18 2.99 8.6 3.12 8.6 3.12C8.88 3.81 8.7 4.32 8.65 4.44C8.97 4.79 9.17 5.24 9.17 5.79C9.17 7.69 8 8.11 6.9 8.23C7.08 8.38 7.25 8.68 7.25 9.14V10.49C7.25 10.63 7.34 10.79 7.59 10.74C9.57 10.09 11 8.21 11 6C11 3.24 8.76 1 6 1Z" fill="currentColor"/>
                    </svg>
                    Source
                  </a>
                  <a className="btn-card btn-card-ghost" href={p.caseStudyUrl} target="_blank" rel="noreferrer" aria-label={`${p.name} case study`}>
                    Case Study
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="divider" />

        <section className="section section-glass" id="services">
          <div className="section-label mono">Hiring Value</div>
          <h2 className="section-title syne">How I Help<br />Teams Ship</h2>
          <div className="services-grid">
            {services.map((service) => (
              <article className="service-card" key={service.title}>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-text">{service.text}</p>
                <p className="service-outcomes">{service.outcomes}</p>
              </article>
            ))}
          </div>
          <div className="engagement-list">
            {engagementModel.map((item) => (
              <div className="engagement-item" key={item}>{item}</div>
            ))}
          </div>
        </section>

        <div className="divider" />

        {/* ── ABOUT ── */}
        <section className="section section-glass" id="about">
          <div className="section-label mono">Background</div>
          <h2 className="section-title syne">About<br />Me</h2>
          <div className="about-grid">
            <div>
              <div className="about-avatar">
                <img src="/images/adegboye_peter.jpg" alt="Peter Adegboye headshot" loading="lazy" />
              </div>
            </div>
            <div className="about-text">
              <p>
                I'm a 22-year-old solo founder and agentic systems engineer. My background in Forest Production & Products gave me something most AI engineers don't have — deep domain expertise in a vertical where AI is completely underutilized.
              </p>
              <p>
                I build production AI systems: autonomous agent pipelines, RAG knowledge bases, multi-LLM integrations, and API backends. I don't just prototype — I ship architectures with proper security, error handling, and real-world reliability.
              </p>
              <p>
                Currently pursuing freelance AI automation work with global clients while building toward a technology company that applies AI to problems most people aren't paying attention to yet.
              </p>
              <div className="contact-actions">
                <a className="btn-primary" href={`mailto:${PROFILE.email}`}>Email Me</a>
                <a className="btn-ghost" href={PROFILE.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
                <a className="btn-ghost" href={PROFILE.github} target="_blank" rel="noreferrer">GitHub</a>
              </div>
              <div className="about-stats">
                <div className="about-stat">
                  <div className="stat-kicker">Built In Production</div>
                  <div className="stat-label">Systems designed for real teams with reliability, security, and operational guardrails in place.</div>
                </div>
                <div className="about-stat">
                  <div className="stat-kicker">No No-Code Dependency</div>
                  <div className="stat-label">Custom engineering approach from API orchestration to backend architecture for long-term control.</div>
                </div>
                <div className="about-stat">
                  <div className="stat-kicker">End-to-End Ownership</div>
                  <div className="stat-label">From discovery and design through deployment, testing, monitoring, and continuous iteration.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CONTACT / FOOTER ── */}
        <footer className="footer" id="contact">
          <div className="footer-inner">
            <div className="footer-tag mono">Available for Work</div>
            <h2 className="footer-heading syne">Let's Build<br />Something Real</h2>
            <p className="footer-sub">
              Looking to automate your agency's operations, build an intelligent lead pipeline, or integrate AI into your existing stack? Let's talk.
            </p>
            <div className="contact-actions">
              <a className="btn-primary" href={PROFILE.calendly} target="_blank" rel="noreferrer">Book a Call</a>
              <a className="btn-ghost" href={`mailto:${PROFILE.email}`}>Email Me</a>
            </div>
            <a className="footer-email mono" href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>

            <div className="footer-bottom">
              <span className="footer-copy mono">© 2026 {PROFILE.firstName} {PROFILE.lastName}</span>
              <div className="footer-links">
                <a className="footer-link mono" href={PROFILE.github} target="_blank" rel="noreferrer">GitHub</a>
                <a className="footer-link mono" href={PROFILE.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
                <a className="footer-link mono" href={PROFILE.x} target="_blank" rel="noreferrer">X</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
