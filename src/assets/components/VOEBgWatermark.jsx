import { useEffect, useRef } from "react";
import "./VOEBgWatermark.css";
import voeLogoImg from "../voe-logo.png";

/**
 * AtmosphereLayer / VOEBgWatermark
 *
 * Cinematic Atmospheric Layer inspired by:
 * 1. 5 Multi-colored Wave Blobs (Ice Blue, Sky Blue, Pink, Soft Cyan, Rose) with async drift.
 * 2. Decorative Flowing Water Waves (SVG paths).
 * 3. Restrained Particle Field (refractions/bubbles).
 * 4. Light Ray Ambient Sweep (water light reflection).
 * 5. Spatial VOE Logo Watermark.
 * 6. Interactive Cursor Halo Spotlight.
 */
export default function VOEBgWatermark() {
  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const ringRef = useRef(null);
  const auraRef = useRef(null);
  const cursorHaloRef = useRef(null);

  // Check for reduced motion preference
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (prefersReduced) return;

    const logo = logoRef.current;
    const ring = ringRef.current;
    const aura = auraRef.current;
    const halo = cursorHaloRef.current;

    // Parallax displacements
    const MAX_LOGO_SHIFT = 14;
    const MAX_RING_SHIFT = 8;
    const MAX_AURA_SHIFT = 6;
    const LERP = 0.05;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let mousePageX = window.innerWidth / 2;
    let mousePageY = window.innerHeight / 2;
    let haloCurrentX = mousePageX;
    let haloCurrentY = mousePageY;

    let rafId = null;
    let isRunning = true;

    const handleMouseMove = (e) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      targetX = nx * MAX_LOGO_SHIFT;
      targetY = ny * MAX_LOGO_SHIFT;

      mousePageX = e.clientX;
      mousePageY = e.clientY;
    };

    const animate = () => {
      if (!isRunning) return;

      currentX += (targetX - currentX) * LERP;
      currentY += (targetY - currentY) * LERP;

      haloCurrentX += (mousePageX - haloCurrentX) * 0.08;
      haloCurrentY += (mousePageY - haloCurrentY) * 0.08;

      if (logo) {
        logo.style.transform = `translate(${currentX}px, ${currentY}px)`;
      }
      if (ring) {
        const rx = (currentX / MAX_LOGO_SHIFT) * MAX_RING_SHIFT;
        const ry = (currentY / MAX_LOGO_SHIFT) * MAX_RING_SHIFT;
        ring.style.transform = `translate(${rx}px, ${ry}px)`;
      }
      if (aura) {
        const ax = (currentX / MAX_LOGO_SHIFT) * MAX_AURA_SHIFT;
        const ay = (currentY / MAX_LOGO_SHIFT) * MAX_AURA_SHIFT;
        aura.style.transform = `translate(${ax}px, ${ay}px)`;
      }
      if (halo) {
        halo.style.transform = `translate3d(${haloCurrentX}px, ${haloCurrentY}px, 0)`;
      }

      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    rafId = requestAnimationFrame(animate);

    return () => {
      isRunning = false;
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [prefersReduced]);

  // Restrained particle field (bubbles/refractions)
  const particles = [
    { top: "14%", left: "16%", size: "5px", cls: "p-blue", delay: "0s", dur: "18s" },
    { top: "26%", left: "84%", size: "7px", cls: "p-cyan", delay: "2s", dur: "22s" },
    { top: "38%", left: "10%", size: "4px", cls: "p-pink", delay: "4s", dur: "16s" },
    { top: "58%", left: "90%", size: "6px", cls: "p-blue", delay: "1s", dur: "20s" },
    { top: "76%", left: "20%", size: "8px", cls: "p-cyan", delay: "3s", dur: "24s" },
    { top: "86%", left: "78%", size: "5px", cls: "p-pink", delay: "5s", dur: "19s" },
    { top: "22%", left: "62%", size: "4px", cls: "p-blue", delay: "2.5s", dur: "17s" },
    { top: "50%", left: "46%", size: "6px", cls: "p-cyan", delay: "1.5s", dur: "21s" },
    { top: "32%", left: "34%", size: "5px", cls: "p-pink", delay: "3.5s", dur: "18s" },
    { top: "68%", left: "40%", size: "6px", cls: "p-blue", delay: "0.5s", dur: "23s" },
    { top: "10%", left: "48%", size: "4px", cls: "p-cyan", delay: "4.5s", dur: "15s" },
    { top: "92%", left: "52%", size: "5px", cls: "p-blue", delay: "2s", dur: "20s" },
  ];

  return (
    <div ref={containerRef} className="voe-bg-watermark" aria-hidden="true">
      {/* Interactive Cursor Halo Spotlight */}
      <div ref={cursorHaloRef} className="voe-bg-cursor-halo" />

      {/* Translucent Wave Layers / Blobs */}
      <div className="voe-wave-blob blob-ice" />
      <div className="voe-wave-blob blob-sky" />
      <div className="voe-wave-blob blob-pink" />
      <div className="voe-wave-blob blob-cyan" />
      <div className="voe-wave-blob blob-rose" />

      {/* Decorative Flowing Energy Curved Paths (Water Waves) */}
      <svg className="voe-decorative-lines" viewBox="0 0 1440 900" fill="none" preserveAspectRatio="none">
        <path
          d="M-100,250 C300,100 600,450 1000,200 C1250,50 1400,300 1600,180"
          stroke="url(#line-grad-1)"
          strokeWidth="1.5"
          strokeDasharray="8 12"
          opacity="0.6"
        />
        <path
          d="M-50,650 C400,500 750,800 1150,550 C1350,420 1500,600 1650,520"
          stroke="url(#line-grad-2)"
          strokeWidth="1.5"
          opacity="0.5"
        />
        <path
          d="M-150,400 C200,600 500,200 900,450 C1200,600 1450,250 1700,350"
          stroke="url(#line-grad-3)"
          strokeWidth="1"
          opacity="0.4"
        />
        <defs>
          <linearGradient id="line-grad-1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8EDCFF" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#FFB6D9" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#DDF6FF" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="line-grad-2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFD6EA" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#8EDCFF" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#B8F0FF" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="line-grad-3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#B8F0FF" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#FFD6EA" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#DDF6FF" stopOpacity="0.2" />
          </linearGradient>
        </defs>
      </svg>

      {/* Subtle Light Ray Ambient Sweep */}
      <div className="voe-ambient-light-ray" />

      {/* Atmospheric Ambient Mesh Glow */}
      <div ref={auraRef} className="voe-bg-watermark__aura" />

      {/* Rotating Monogram Ring Layer (Water ripple ring) */}
      <div ref={ringRef} className="voe-bg-watermark__ring" />

      {/* Floating Restrained Particle Field (Bubbles) */}
      <div className="voe-bg-particles">
        {particles.map((p, idx) => (
          <span
            key={idx}
            className={`voe-particle ${p.cls}`}
            style={{
              top: p.top,
              left: p.left,
              width: p.size,
              height: p.size,
              animationDelay: p.delay,
              animationDuration: p.dur,
            }}
          />
        ))}
      </div>

      {/* Central Spatial VOE Watermark Logo */}
      <img
        ref={logoRef}
        src={voeLogoImg}
        alt=""
        className="voe-bg-watermark__logo"
        draggable={false}
      />
    </div>
  );
}
