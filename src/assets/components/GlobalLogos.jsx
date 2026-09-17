import { useEffect, useState, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import "./GlobalLogos.css";

import voeLogoImg from "../voe-logo.png";
import eecLogoImg from "../eec-logo.png";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function GlobalLogos({ onComplete }) {
  const overlayRef = useRef(null);
  const canvasRef = useRef(null);

  // States
  const [isPlaying, setIsPlaying] = useState(false);
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

  // Check sessionStorage and prefers-reduced-motion on mount
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasPlayed = sessionStorage.getItem("voeEecIntroPlayed");

    if (prefersReduced || hasPlayed === "true") {
      setIsPlaying(false);
      if (onComplete) onComplete();
    } else {
      setIsPlaying(true);
    }
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
    const maxParticles = 250;

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
        ctx.shadowBlur = this.type === "fire" ? 14 : this.type === "water" ? 10 : 16;
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

      try {
        const isMobile = window.innerWidth <= 768;
        const eecTargetX = -window.innerWidth / 2 + (isMobile ? 80 : 140);
        const eecTargetY = -window.innerHeight / 2 + 40;

        // Position on the RIGHT side of the home page (matching .hero-logo-stage)
        const voeHeroTargetX = isMobile ? 0 : Math.min(window.innerWidth * 0.25, 340);
        const voeHeroTargetY = isMobile ? -30 : 20;

        // [0.0 - 0.5s] ACT I: Dark Atmospheric Start & Dual Materialization
        particleModeRef.current = "ambient";
        cameraAnim.set({ scale: 1, z: 0 });
        orbitHubAnim.set({ rotateY: 0, rotateX: 18 });
        voeAnim.set({ x: -160, y: 0, z: 0, scale: 0.1, opacity: 0, rotateY: -60, filter: "blur(14px)" });
        eecAnim.set({ x: 160, y: 0, z: 0, scale: 0.1, opacity: 0, rotateY: 60, filter: "blur(14px)" });
        flashAnim.set({ opacity: 0 });

        await delay(500);

        // [0.5 - 1.2s] VOE + EEC Materialize at Center with radiant glow
        voeAnim.start({
          scale: 1,
          opacity: 1,
          rotateY: 0,
          filter: "blur(0px) drop-shadow(0 0 35px rgba(193, 92, 255, 0.95))",
          transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
        });
        eecAnim.start({
          scale: 1,
          opacity: 1,
          rotateY: 0,
          filter: "blur(0px) drop-shadow(0 0 35px rgba(0, 229, 255, 0.95))",
          transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
        });

        await delay(700);

        // [1.2 - 2.8s] Dual 3D 720° Orbital Revolution around center
        particleModeRef.current = "orbit";
        orbitHubAnim.start({
          rotateY: 720,
          transition: { duration: 1.6, ease: "easeInOut" },
        });
        voeAnim.start({
          z: [0, 90, 0, -90, 0],
          scale: [1, 1.2, 1, 0.85, 1],
          transition: { duration: 1.6, ease: "easeInOut" },
        });
        eecAnim.start({
          z: [0, -90, 0, 90, 0],
          scale: [1, 0.85, 1, 1.2, 1],
          transition: { duration: 1.6, ease: "easeInOut" },
        });

        await delay(1600);

        // [2.8 - 3.8s] ACT II: EEC GLIDES TO TOP LEFT (Navbar position)
        eecAnim.start({
          x: eecTargetX + 55,
          y: eecTargetY,
          scale: 0.38,
          opacity: 0.95,
          filter: "drop-shadow(0 0 6px rgba(0,229,255,0.4))",
          transition: { duration: 1.0, ease: [0.25, 1, 0.5, 1] },
        });

        // VOE centers in the MIDDLE of the main theme for the 3D spin & burst
        voeAnim.start({
          x: 0,
          y: 0,
          scale: 1.3,
          rotateY: 360,
          transition: { duration: 1.0, ease: "easeInOut" },
        });

        particleCenterRef.current = {
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
        };

        await delay(1000);

        // [3.8 - 4.6s] ACT III: ELECTROID & FLAMY VISUAL AURA IGNITION AT THE CENTER
        setShowAuras(true);
        cameraAnim.start({
          scale: [1, 1.15, 1.08],
          transition: { duration: 0.8, ease: "easeInOut" },
        });

        await delay(800);

        // [4.6 - 4.9s] Pre-Burst Energy Charging, Flash & Shockwave at Center
        setShowShock(true);
        flashAnim.start({
          opacity: [0, 1, 0],
          transition: { duration: 0.22, ease: "easeOut" },
        });

        await delay(150);

        // [4.9 - 6.4s] ACT IV: BURST THE LOGO INTO MULTIPLE PIECES AT THE CENTER
        setIsDismantled(true);
        particleModeRef.current = "burst";

        // Scatter 25 fragments in 3D perspective with flame wisps and electric sparks
        fragmentAnim.start((i) => {
          const f = fragments[i];
          return {
            x: f.burstX,
            y: f.burstY,
            z: f.burstZ,
            rotateY: f.rotY,
            rotateZ: f.rotZ,
            scale: f.scale,
            opacity: [1, 1],
            filter: "brightness(1.35) drop-shadow(0 0 22px rgba(109, 231, 255, 1)) drop-shadow(0 0 45px rgba(255, 100, 0, 0.85))",
            transition: { duration: 1.4, ease: [0.18, 0.75, 0.22, 1] },
          };
        });

        await delay(1400);

        // [6.4 - 6.8s] Maximum Dispersion Suspended Pause & Gravity Inversion
        particleModeRef.current = "collapse";
        await delay(400);

        // [6.8 - 8.1s] ACT V: RECOMBINE THE BURSTED LOGO AS ONE PIECE WITH ELECTROID & FLAMY VISUALS
        // All 25 fragments magnetically spiral back into one solid piece at the center
        fragmentAnim.start({
          x: 0,
          y: 0,
          z: 0,
          rotateY: 0,
          rotateZ: 0,
          scale: 1,
          opacity: 1,
          filter: "brightness(1.5) drop-shadow(0 0 50px rgba(143, 238, 255, 1)) drop-shadow(0 0 60px rgba(255, 120, 0, 0.9))",
          transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
        });

        await delay(1200);

        // [8.1 - 8.7s] Recombination Snap as One Solid Piece at the Center
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

        // [8.7 - 9.8s] ACT VI: RECOMBINED VOE MOVES FROM CENTER TO RIGHT SIDE OF HOME PAGE
        setShowAuras(false);
        voeAnim.start({
          x: voeHeroTargetX,
          y: voeHeroTargetY,
          scale: 1.2,
          opacity: 1,
          filter: "drop-shadow(0 0 35px rgba(193, 92, 255, 0.9))",
          transition: { duration: 1.1, ease: [0.25, 1, 0.5, 1] },
        });
        cameraAnim.start({
          scale: 1,
          transition: { duration: 1.1, ease: "easeInOut" },
        });

        await delay(1100);

        // [9.8 - 10.3s] ACT VII: Final Radiant Light Sweep Across Viewport
        setShowLightSweep(true);
        await delay(500);

        // [10.3 - 10.8s] Seamless Transition into the Home Page
        setOverlayFading(true);
        await delay(450);

        sessionStorage.setItem("voeEecIntroPlayed", "true");
        setIsPlaying(false);
        if (onComplete) onComplete();
      } catch {
        // Handled abort on unmount
      }
    };

    runMasterSequence();

    return () => {
      isMounted = false;
    };
  }, [isPlaying, cameraAnim, orbitHubAnim, voeAnim, eecAnim, flashAnim, fragmentAnim, fragments, onComplete]);

  if (!isPlaying) return null;

  return (
    <div
      ref={overlayRef}
      className={`global-cinematic-overlay ${overlayFading ? "fade-out" : ""}`}
      aria-hidden="true"
    >
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
      <motion.div className="cinematic-camera-stage" animate={cameraAnim}>
        {/* 3D Orbit Hub */}
        <motion.div className="cinematic-orbit-hub" animate={orbitHubAnim}>
          {/* VOE Logo: 3D Rotate & Burst at Center -> Recombines as One Piece -> Moves to Right Side */}
          <motion.div className="cinematic-node" animate={voeAnim}>
            {/* Iconic Electroid & Flamy Visual Auras */}
            {showAuras && (
              <div className="voe-elemental-aura-stage">
                <div className="voe-elemental-fire" />
                <div className="voe-elemental-water" />
                <div className="voe-elemental-electricity" />
              </div>
            )}

            {!isDismantled ? (
              <img src={voeLogoImg} alt="Voice of Easwarians" className="cinematic-voe-img" />
            ) : (
              <div className="voe-dismantle-stage">
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
            )}
          </motion.div>

          {/* EEC Institutional Logo Card at Top Left */}
          <motion.div className="cinematic-node" animate={eecAnim}>
            <div className="cinematic-eec-card">
              <img
                src={eecLogoImg}
                alt="Easwari Engineering College"
                className="cinematic-eec-img"
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
