import { useEffect, useState, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import "./GlobalLogos.css";

import voeLogoImg from "../voe-logo.png";
import eecLogoImg from "../eec-logo.png";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const preloadImage = (src) => {
  const image = new Image();
  if (image.decode) {
    image.src = src;
    return image.decode();
  }
  return new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = reject;
    image.src = src;
  });
};

export default function GlobalLogos({ onReveal, onComplete }) {
  const overlayRef = useRef(null);
  const canvasRef = useRef(null);
  const eecDestinationRef = useRef(null);
  const eecImageRef = useRef(null);

  // States
  const [isPlaying, setIsPlaying] = useState(false);
  const [assetsReady, setAssetsReady] = useState(false);
  const [overlayFading, setOverlayFading] = useState(false);
  const [showAuras, setShowAuras] = useState(false);
  const [showShock, setShowShock] = useState(false);
  const [showLightSweep, setShowLightSweep] = useState(false);
  const [isDismantled, setIsDismantled] = useState(false);

  // 25 High-Energy 3D Burst Fragments with wide spherical trajectory & perspective
  const fragments = useRef(
    Array.from({ length: 25 }, (_, index) => {
      const col = index % 5;
      const row = Math.floor(index / 5);
      const direction = index % 2 === 0 ? 1 : -1;

      return {
        id: index,
        col,
        row,
        left: `${col * 20}%`,
        top: `${row * 20}%`,
        bgX: `${col * 25}%`,
        bgY: `${row * 25}%`,
        burstX: (col - 2) * 175 + (row % 2 === 0 ? -40 : 40),
        burstY: (row - 2) * 175 + (col % 2 === 0 ? -40 : 40),
        burstZ: 190 + (index % 4) * 55,
        rotY: direction * (60 + index * 10),
        rotZ: direction * (135 + index * 14),
        scale: 0.7 + (index % 4) * 0.12,
      };
    })
  ).current;

  // Animation Controls
  const cameraAnim = useAnimation();
  const orbitHubAnim = useAnimation();
  const voeAnim = useAnimation();
  const eecAnim = useAnimation();
  const flashAnim = useAnimation();
  const fragmentAnim = useAnimation();

  // Particle System Mode: 'ambient' | 'orbit' | 'burst' | 'collapse' | 'none'
  const particleModeRef = useRef("ambient");
  const particleCenterRef = useRef({ x: 0, y: 0 });

  // Prepare both logos before starting the timeline.
  useEffect(() => {
    let cancelled = false;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      if (onComplete) onComplete();
    } else {
      Promise.all([preloadImage(voeLogoImg), preloadImage(eecLogoImg)])
        .then(() => {
          if (!cancelled) {
            setAssetsReady(true);
            setIsPlaying(true);
          }
        })
        .catch(() => {
          // A failed image should never trap the visitor behind the intro.
          if (!cancelled && onComplete) onComplete();
        });
    }
    return () => { cancelled = true; };
  }, [onComplete]);

  // Canvas Particle Physics Engine (Ultra-Energetic Fire, Water, Sparks)
  useEffect(() => {
    if (!isPlaying) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    particleCenterRef.current = { x: width / 2, y: height / 2 };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      particleCenterRef.current = { x: width / 2, y: height / 2 };
    };
    window.addEventListener("resize", handleResize);

    const particles = [];
    const maxParticles = width <= 768 ? 55 : 110;

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        const mode = particleModeRef.current;
        const center = particleCenterRef.current;

        if (mode === "burst" || mode === "collapse") {
          this.x = center.x + (Math.random() - 0.5) * 60;
          this.y = center.y + (Math.random() - 0.5) * 60;
          const angle = Math.random() * Math.PI * 2;
          const speed = 4 + Math.random() * 15;
          this.vx = Math.cos(angle) * speed;
          this.vy = Math.sin(angle) * speed;
          this.life = 1;
          this.decay = 0.008 + Math.random() * 0.015;
          this.size = 2.5 + Math.random() * 5.5;
          const rand = Math.random();
          if (rand < 0.48) {
            this.type = "fire";
            this.color = Math.random() > 0.5 ? "rgba(255, 75, 0," : "rgba(255, 200, 30,";
          } else if (rand < 0.9) {
            this.type = "water";
            this.color = Math.random() > 0.5 ? "rgba(0, 230, 255," : "rgba(30, 150, 255,";
          } else {
            this.type = "electric";
            this.color = "rgba(240, 250, 255,";
          }
        } else {
          this.x = Math.random() * width;
          this.y = Math.random() * height;
          this.vx = (Math.random() - 0.5) * 1.6;
          this.vy = (Math.random() - 0.5) * 1.6;
          this.life = 0.2 + Math.random() * 0.8;
          this.decay = 0.004 + Math.random() * 0.006;
          this.size = 1.5 + Math.random() * 3;
          this.type = "ambient";
          this.color = Math.random() > 0.5 ? "rgba(176, 38, 255," : "rgba(0, 229, 255,";
        }
      }

      update() {
        const mode = particleModeRef.current;
        const center = particleCenterRef.current;

        if (mode === "collapse") {
          const dx = center.x - this.x;
          const dy = center.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          this.vx += (dx / dist) * 1.15;
          this.vy += (dy / dist) * 1.15;
          this.vx *= 0.92;
          this.vy *= 0.92;
        } else if (mode === "orbit") {
          const dx = this.x - center.x;
          const dy = this.y - center.y;
          const angle = Math.atan2(dy, dx) + 0.07;
          const dist = Math.sqrt(dx * dx + dy * dy) * 0.985;
          this.x = center.x + Math.cos(angle) * dist;
          this.y = center.y + Math.sin(angle) * dist;
        }

        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;

        if (this.life <= 0 || this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
          this.reset();
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `${this.color} ${Math.max(0, this.life)})`;
        ctx.shadowBlur = this.type === "ambient" ? 0 : 8;
        ctx.shadowColor =
          this.type === "fire" ? "#ff5500" : this.type === "water" ? "#00ddff" : "#b026ff";
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    for (let i = 0; i < maxParticles; i++) {
      particles.push(new Particle());
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      animFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [isPlaying]);

  // Master Choreographed Sequence
  useEffect(() => {
    if (!isPlaying) return;

    let isMounted = true;

    const runMasterSequence = async () => {
      const delay = async (ms) => {
        await sleep(ms);
        if (!isMounted) throw new Error("Aborted");
      };
      const nextFrame = async () => {
        await new Promise((resolve) => requestAnimationFrame(resolve));
        if (!isMounted) throw new Error("Aborted");
      };

      try {
        const isMobile = window.innerWidth <= 768;

        // Position on the RIGHT side of the home page (matching .hero-logo-stage)
        const voeHeroTargetX = isMobile ? 0 : Math.min(window.innerWidth * 0.25, 340);
        const voeHeroTargetY = isMobile ? -30 : 20;

        // ACT I: Atmospheric start and dual materialization
        particleModeRef.current = "ambient";
        cameraAnim.set({ scale: 1, z: 0 });
        orbitHubAnim.set({ rotateY: 0, rotateX: 18 });
        voeAnim.set({ x: -160, y: 0, z: 0, scale: 0.1, opacity: 0, rotateY: -60, filter: "blur(14px)" });
        eecAnim.set({ x: 160, y: 0, z: 0, scale: 0.1, opacity: 0, rotateY: 60, filter: "blur(14px)" });
        flashAnim.set({ opacity: 0 });

        await delay(500);

        // VOE and EEC materialize at center with radiant glow
        await Promise.all([voeAnim.start({
          scale: 1,
          opacity: 1,
          rotateY: 0,
          filter: "blur(0px) drop-shadow(0 0 35px rgba(193, 92, 255, 0.95))",
          transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
        }), eecAnim.start({
          scale: 1,
          opacity: 1,
          rotateY: 0,
          filter: "blur(0px) drop-shadow(0 0 35px rgba(0, 229, 255, 0.95))",
          transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
        }), delay(700)]);
        if (!isMounted) return;

        // Dual 3D orbital revolution around center
        particleModeRef.current = "orbit";
        await Promise.all([orbitHubAnim.start({
          rotateY: 720,
          transition: { duration: 1.6, ease: "easeInOut" },
        }), voeAnim.start({
          z: [0, 90, 0, -90, 0],
          scale: [1, 1.2, 1, 0.85, 1],
          transition: { duration: 1.6, ease: "easeInOut" },
        }), eecAnim.start({
          z: [0, -90, 0, 90, 0],
          scale: [1, 0.85, 1, 1.2, 1],
          transition: { duration: 1.6, ease: "easeInOut" },
        }), delay(1600)]);
        if (!isMounted) return;

        // ACT II: EEC glides to the navbar position
        // Share the navbar's responsive dimensions, even before the site is revealed.
        const eecDestination = eecDestinationRef.current.getBoundingClientRect();
        await Promise.all([eecAnim.start({
          x: eecDestination.left + eecDestination.width / 2 - window.innerWidth / 2,
          y: eecDestination.top + eecDestination.height / 2 - window.innerHeight / 2,
          scale: eecDestination.width / eecImageRef.current.offsetWidth,
          opacity: 0.95,
          filter: "drop-shadow(0 0 6px rgba(0,229,255,0.4))",
          transition: { duration: 1.0, ease: [0.25, 1, 0.5, 1] },
        }),
        orbitHubAnim.start({
          rotateX: 0,
          transition: { duration: 1.0, ease: [0.25, 1, 0.5, 1] },
        }),

        // VOE centers in the MIDDLE of the main theme for the 3D spin & burst
        voeAnim.start({
          x: 0,
          y: 0,
          scale: 1.3,
          rotateY: 360,
          transition: { duration: 1.0, ease: "easeInOut" },
        }), delay(1000)]);
        if (!isMounted) return;

        particleCenterRef.current = {
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
        };

        // ACT III: elemental aura ignition at the center
        setShowAuras(true);
        await Promise.all([cameraAnim.start({
          scale: [1, 1.15, 1.08],
          transition: { duration: 0.8, ease: "easeInOut" },
        }), delay(800)]);
        if (!isMounted) return;

        // Pre-burst energy charge, flash, and shockwave
        setShowShock(true);
        await Promise.all([flashAnim.start({
          opacity: [0, 1, 0],
          transition: { duration: 0.22, ease: "easeOut" },
        }), delay(220)]);
        if (!isMounted) return;

        // ACT IV: burst the logo into multiple pieces
        setIsDismantled(true);
        particleModeRef.current = "burst";
        await nextFrame();

        // Scatter 25 fragments in 3D perspective with flame wisps and electric sparks
        await Promise.all([fragmentAnim.start((i) => {
          const f = fragments[i];
          return {
            x: f.burstX,
            y: f.burstY,
            z: f.burstZ,
            rotateY: f.rotY,
            rotateZ: f.rotZ,
            scale: f.scale,
            opacity: [1, 1],
            transition: { duration: 1.4, ease: [0.18, 0.75, 0.22, 1] },
          };
        }), delay(1400)]);
        if (!isMounted) return;

        // Maximum dispersion pause and gravity inversion
        particleModeRef.current = "collapse";
        await delay(400);

        // ACT V: recombine the logo with elemental effects
        // All 25 fragments magnetically spiral back into one solid piece at the center
        await Promise.all([fragmentAnim.start({
          x: 0,
          y: 0,
          z: 0,
          rotateY: 0,
          rotateZ: 0,
          scale: 1,
          opacity: 1,
          transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
        }), delay(1200)]);
        if (!isMounted) return;

        // Recombination snap as one solid piece
        setIsDismantled(false);
        setShowShock(false);
        particleModeRef.current = "none";

        flashAnim.start({
          opacity: [0, 0.65, 0],
          transition: { duration: 0.25 },
        });

        voeAnim.set({
          x: 0,
          y: 0,
          scale: 1.3,
          opacity: 1,
          filter: "drop-shadow(0 0 45px rgba(193, 92, 255, 1)) drop-shadow(0 0 55px rgba(255, 100, 0, 0.9))",
        });

        await delay(600);

        // ACT VI: move the recombined VOE logo to its homepage position
        setShowAuras(false);
        await Promise.all([voeAnim.start({
          x: voeHeroTargetX,
          y: voeHeroTargetY,
          scale: 1.2,
          opacity: 1,
          filter: "drop-shadow(0 0 35px rgba(193, 92, 255, 0.9))",
          transition: { duration: 1.1, ease: [0.25, 1, 0.5, 1] },
        }), cameraAnim.start({
          scale: 1,
          transition: { duration: 1.1, ease: "easeInOut" },
        }), delay(1100)]);
        if (!isMounted) return;

        // ACT VII: final radiant light sweep across the viewport
        setShowLightSweep(true);
        if (onReveal) onReveal();
        await delay(750);

        // Seamless transition into the homepage
        setOverlayFading(true);
        await delay(850);

        setIsPlaying(false);
        if (onComplete) onComplete();
      } catch {
        // Unmounts abort silently; unexpected errors reveal the site instead of trapping visitors.
        if (isMounted && onComplete) onComplete();
      }
    };

    runMasterSequence();

    return () => {
      isMounted = false;
    };
  }, [isPlaying, cameraAnim, orbitHubAnim, voeAnim, eecAnim, flashAnim, fragmentAnim, fragments, onReveal, onComplete]);

  if (!isPlaying) {
    return assetsReady ? null : (
      <div className="global-cinematic-overlay cinematic-loading" aria-live="polite">
        <span>Preparing the VOE experience…</span>
      </div>
    );
  }

  return (
    <div
      ref={overlayRef}
      className={`global-cinematic-overlay ${overlayFading ? "fade-out" : ""}`}
      aria-hidden="true"
    >
      <div ref={eecDestinationRef} className="cinematic-eec-destination" />
      {/* Expanding Atmospheric Rings */}
      <div className="cinematic-atmosphere" />

      {/* Particle Canvas */}
      <canvas ref={canvasRef} className="cinematic-canvas" />

      {/* White-Hot Flash */}
      <motion.div className="cinematic-flash-overlay" animate={flashAnim} />

      {/* Shockwave Ring */}
      <div className={`voe-elemental-shock ${showShock ? "active" : ""}`} />

      {/* Radiant Light Sweep */}
      <div className={`cinematic-light-sweep ${showLightSweep ? "animate-sweep" : ""}`} />

      {/* 3D Camera Stage */}
      <div className="cinematic-camera-stage">
        {/* 3D Orbit Hub */}
        <motion.div className="cinematic-orbit-hub" animate={orbitHubAnim}>
          {/* VOE Logo: 3D Rotate & Burst at Center -> Recombines as One Piece -> Moves to Right Side */}
          {/* Keep the VOE camera zoom independent of the docked EEC logo. */}
          <motion.div className="cinematic-node" animate={cameraAnim}>
          <motion.div className="cinematic-node" animate={voeAnim}>
            {/* Iconic Electroid & Flamy Visual Auras */}
            {showAuras && (
              <div className="voe-elemental-aura-stage">
                <div className="voe-elemental-fire" />
                <div className="voe-elemental-water" />
                <div className="voe-elemental-electricity" />
              </div>
            )}

            <img src={voeLogoImg} alt="Voice of Easwarians" className="cinematic-voe-img" style={{ opacity: isDismantled ? 0 : 1 }} />
            <div className="voe-dismantle-stage" style={{ opacity: isDismantled ? 1 : 0 }}>
              {fragments.map((f, i) => (
                <motion.div
                  key={f.id}
                  custom={i}
                  animate={fragmentAnim}
                  className="voe-dismantle-tile"
                  style={{
                    left: f.left,
                    top: f.top,
                    backgroundImage: `url(${voeLogoImg})`,
                    backgroundPosition: `${f.bgX} ${f.bgY}`,
                  }}
                />
              ))}
            </div>
          </motion.div>
          </motion.div>

          {/* EEC Institutional Logo Card docks at the top right. */}
          <motion.div className="cinematic-node" animate={eecAnim}>
            <div className="cinematic-eec-card">
              <img
                ref={eecImageRef}
                src={eecLogoImg}
                alt="Easwari Engineering College"
                className="cinematic-eec-img"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
