import { useEffect, useState, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import "./VOEContinuousLogo.css";

import voeLogoImg from "../voe-logo.png";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function VOEContinuousLogo({ onClick }) {
  const canvasRef = useRef(null);

  // States
  const [isFragmented, setIsFragmented] = useState(false);
  const [showShockwave, setShowShockwave] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Grid fragmentation (8x8 = 64 fragments desktop, 6x6 = 36 mobile)
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;
  const gridRows = isMobile ? 6 : 8;
  const gridCols = isMobile ? 6 : 8;
  const totalFragments = gridRows * gridCols;

  const fragments = useRef(
    Array.from({ length: totalFragments }, (_, index) => {
      const row = Math.floor(index / gridCols);
      const col = index % gridCols;
      const angle = (index / totalFragments) * Math.PI * 2 + (Math.random() - 0.5);
      const distance = 45 + Math.random() * 75;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      const z = (Math.random() - 0.5) * 150;
      const rotX = (Math.random() - 0.5) * 720;
      const rotY = (Math.random() - 0.5) * 720;
      const rotZ = (Math.random() - 0.5) * 540;
      const scale = 0.5 + Math.random() * 0.6;

      return { id: index, row, col, x, y, z, rotX, rotY, rotZ, scale };
    })
  ).current;

  // Animation Controls
  const emblemAnim = useAnimation();
  const fragmentAnim = useAnimation();
  const flashAnim = useAnimation();

  // Particle Mode: 'spin' | 'charge' | 'burst' | 'collapse' | 'rest'
  const particleModeRef = useRef("rest");
  const lightningActiveRef = useRef(false);

  // Reduced motion check
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReducedMotion(prefersReduced);
  }, []);

  // 60FPS Canvas Physics Simulation (Fire, Water, Steam, Electric Sparks)
  useEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrameId;
    const size = isMobile ? 110 : 140;
    canvas.width = size;
    canvas.height = size;

    const particles = [];
    const maxParticles = isMobile ? 35 : 65;

    class AuraParticle {
      constructor() {
        this.reset();
      }

      reset() {
        const mode = particleModeRef.current;
        const cx = size / 2;
        const cy = size / 2;

        if (mode === "burst") {
          this.x = cx + (Math.random() - 0.5) * 15;
          this.y = cy + (Math.random() - 0.5) * 15;
          const angle = Math.random() * Math.PI * 2;
          const speed = 2 + Math.random() * 6;
          this.vx = Math.cos(angle) * speed;
          this.vy = Math.sin(angle) * speed;
          this.life = 1;
          this.decay = 0.015 + Math.random() * 0.025;
          this.size = 1.5 + Math.random() * 3.5;
        } else {
          // Orbit / Spin aura mode around perimeter (radius ~ 24px)
          const angle = Math.random() * Math.PI * 2;
          const radius = 20 + Math.random() * 10;
          this.x = cx + Math.cos(angle) * radius;
          this.y = cy + Math.sin(angle) * radius;
          this.angle = angle;
          this.radius = radius;
          this.speed = (0.04 + Math.random() * 0.04) * (Math.random() > 0.5 ? 1 : -1);
          this.life = 0.3 + Math.random() * 0.7;
          this.decay = 0.008 + Math.random() * 0.012;
          this.size = 1.2 + Math.random() * 2.2;
        }

        const rand = Math.random();
        if (rand < 0.48) {
          this.type = "fire";
          this.color = Math.random() > 0.5 ? "rgba(255, 70, 0," : "rgba(255, 180, 20,";
        } else if (rand < 0.9) {
          this.type = "water";
          this.color = Math.random() > 0.5 ? "rgba(0, 220, 255," : "rgba(20, 130, 255,";
        } else {
          this.type = "electric";
          this.color = "rgba(240, 250, 255,";
        }
      }

      update() {
        const mode = particleModeRef.current;
        const cx = size / 2;
        const cy = size / 2;

        if (mode === "burst") {
          this.x += this.vx;
          this.y += this.vy;
        } else if (mode === "collapse") {
          // Gravitational pull inward
          const dx = cx - this.x;
          const dy = cy - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          this.x += (dx / dist) * 2.5;
          this.y += (dy / dist) * 2.5;
        } else {
          // Orbiting aura
          this.angle += this.speed * (mode === "charge" ? 2.5 : 1);
          this.radius += (Math.random() - 0.5) * 1.5;
          this.x = cx + Math.cos(this.angle) * this.radius;
          this.y = cy + Math.sin(this.angle) * this.radius;
        }

        this.life -= this.decay;
        if (this.life <= 0 || this.x < 0 || this.x > size || this.y < 0 || this.y > size) {
          this.reset();
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `${this.color} ${Math.max(0, this.life)})`;
        ctx.shadowBlur = this.type === "fire" ? 8 : this.type === "water" ? 6 : 10;
        ctx.shadowColor =
          this.type === "fire" ? "#ff5500" : this.type === "water" ? "#00ddff" : "#b026ff";
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    for (let i = 0; i < maxParticles; i++) {
      particles.push(new AuraParticle());
    }

    const render = () => {
      ctx.clearRect(0, 0, size, size);

      // Micro lightning arcs around perimeter
      if (lightningActiveRef.current) {
        ctx.strokeStyle = "rgba(220, 245, 255, 0.9)";
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#00e5ff";

        const cx = size / 2;
        const cy = size / 2;
        const r = 23;

        for (let j = 0; j < 2; j++) {
          ctx.beginPath();
          const startAngle = Math.random() * Math.PI * 2;
          ctx.moveTo(cx + Math.cos(startAngle) * r, cy + Math.sin(startAngle) * r);
          for (let step = 1; step <= 4; step++) {
            const arcAngle = startAngle + (step * 0.25) * (Math.random() > 0.5 ? 1 : -1);
            const dr = r + (Math.random() - 0.5) * 8;
            ctx.lineTo(cx + Math.cos(arcAngle) * dr, cy + Math.sin(arcAngle) * dr);
          }
          ctx.stroke();
        }
        ctx.shadowBlur = 0;
      }

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      animFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [reducedMotion, isMobile]);

  // Seamless Master Continuous Loop Orchestrator
  useEffect(() => {
    if (reducedMotion) return;

    let isMounted = true;

    const runLoop = async () => {
      const delay = async (ms) => {
        await sleep(ms);
        if (!isMounted) throw new Error("Aborted");
      };

      try {
        while (isMounted) {
          // [0.0 – 0.7s] 1. Stabilization / Rest
          particleModeRef.current = "rest";
          lightningActiveRef.current = false;
          setIsFragmented(false);
          setShowShockwave(false);

          emblemAnim.set({
            rotateY: 0,
            rotateX: 0,
            scale: 1,
            opacity: 1,
            filter: "drop-shadow(0 0 10px rgba(176, 38, 255, 0.8))",
          });

          await delay(700);

          // [0.7 – 3.0s] 2. Smooth 360° 3D Spin with Fire + Water Aura
          particleModeRef.current = "spin";
          emblemAnim.start({
            rotateY: 360,
            rotateX: [0, 10, -10, 0],
            scale: [1, 1.06, 1],
            filter: [
              "drop-shadow(0 0 10px rgba(176, 38, 255, 0.8))",
              "drop-shadow(0 0 18px rgba(0, 229, 255, 0.95))",
              "drop-shadow(0 0 10px rgba(176, 38, 255, 0.8))",
            ],
            transition: { duration: 2.3, ease: [0.45, 0.05, 0.55, 0.95] },
          });

          await delay(2300);

          // [3.0 – 3.4s] 3. Energy Charging & Aura Contraction
          particleModeRef.current = "charge";
          lightningActiveRef.current = true;
          emblemAnim.start({
            scale: [1, 1.15],
            filter: "drop-shadow(0 0 25px rgba(255, 100, 0, 1))",
            transition: { duration: 0.4, ease: "easeIn" },
          });

          await delay(400);

          // [3.4 – 3.6s] 4. Electrical Overload
          emblemAnim.start({
            x: [-1, 1.5, -1.5, 1, 0],
            y: [1, -1, 1, -1, 0],
            transition: { duration: 0.2 },
          });

          await delay(200);

          // [3.6 – 3.7s] 5. White Electric Flash
          flashAnim.start({
            opacity: [0, 1, 0],
            transition: { duration: 0.12, ease: "easeOut" },
          });

          // [3.7 – 3.9s] 6. Micro Shockwave
          setShowShockwave(true);
          await delay(100);

          // [3.9 – 5.0s] 7. 3D VOE Fragmentation Burst into 64 Pieces
          setIsFragmented(true);
          particleModeRef.current = "burst";
          lightningActiveRef.current = false;

          fragmentAnim.start((i) => {
            const f = fragments[i];
            return {
              x: f.x,
              y: f.y,
              z: f.z,
              rotateX: f.rotX,
              rotateY: f.rotY,
              rotateZ: f.rotZ,
              scale: f.scale,
              opacity: [1, 0.9],
              transition: { duration: 1.1, ease: [0.08, 0.82, 0.17, 1] },
            };
          });

          await delay(1100);

          // [5.0 – 5.3s] 8. Maximum Dispersion Pause
          await delay(300);

          // [5.3 – 6.5s] 9. Magnetic Inward Spiral Reconstruction
          particleModeRef.current = "collapse";
          fragmentAnim.start({
            x: 0,
            y: 0,
            z: 0,
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0,
            scale: 1,
            opacity: 1,
            transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
          });

          await delay(1200);

          // [6.5 – 7.0s] 10. Reconstruction Snap & Stabilization
          setIsFragmented(false);
          setShowShockwave(false);
          particleModeRef.current = "rest";
          flashAnim.start({
            opacity: [0, 0.4, 0],
            transition: { duration: 0.2 },
          });

          emblemAnim.set({
            rotateY: 0,
            rotateX: 0,
            scale: 1,
            opacity: 1,
            filter: "drop-shadow(0 0 10px rgba(176, 38, 255, 0.8))",
          });

          await delay(500);
          // Seamlessly loops to next cycle
        }
      } catch {
        // Abort handled cleanly on unmount
      }
    };

    runLoop();

    return () => {
      isMounted = false;
    };
  }, [reducedMotion, emblemAnim, fragmentAnim, flashAnim, fragments]);

  return (
    <div
      className="voe-continuous-wrapper"
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label="VOE Home"
    >
      <div className="voe-continuous-stage">
        {/* Rotating Energy Ring */}
        <div className="voe-continuous-ring" />

        {/* Aura Canvas (Fire, Water, Sparks) */}
        {!reducedMotion && <canvas ref={canvasRef} className="voe-continuous-canvas" />}

        {/* White-Hot Flash */}
        <motion.div className="voe-continuous-flash" animate={flashAnim} />

        {/* Micro Shockwave */}
        <div className={`voe-continuous-shockwave ${showShockwave ? "active" : ""}`} />

        {/* 3D Spinning Emblem Node */}
        <motion.div className="voe-continuous-emblem-node" animate={emblemAnim}>
          {!isFragmented ? (
            <img src={voeLogoImg} alt="VOE Emblem" className="voe-continuous-img" />
          ) : (
            <div
              className="voe-continuous-fragment-grid"
              style={{
                gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
                gridTemplateRows: `repeat(${gridRows}, 1fr)`,
              }}
            >
              {fragments.map((f, i) => (
                <motion.div
                  key={f.id}
                  custom={i}
                  animate={fragmentAnim}
                  className="voe-continuous-fragment-tile"
                  style={{
                    backgroundImage: `url(${voeLogoImg})`,
                    backgroundSize: `${gridCols * 100}% ${gridRows * 100}%`,
                    backgroundPosition: `${(f.col / (gridCols - 1)) * 100}% ${
                      (f.row / (gridRows - 1)) * 100
                    }%`,
                  }}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Wordmark Text */}
      <span className="voe-continuous-text">VOE</span>
    </div>
  );
}
