import { useEffect, useState, useRef, useCallback } from "react";
import { motion, useAnimation } from "framer-motion";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { createPortal } from "react-dom";
import "./GlobalLogos.css";

import voeLogoImg from "../voe-logo.jpeg";
// Fallback import. User must place eec-logo.jpeg!
import eecLogoImg from "../eec-logo.jpeg";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function GlobalLogos({ onLogoClick }) {
  const inlineContainerRef = useRef(null);
  
  // State management
  const [hasPlayed, setHasPlayed] = useState(true); // Default true to prevent flash
  const [isCinematic, setIsCinematic] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  
  // Effects State
  const [particlesMode, setParticlesMode] = useState("none"); // none, burst, converge
  const [showShockwave, setShowShockwave] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [showFragments, setShowFragments] = useState(false);
  const [lightningActive, setLightningActive] = useState(false);
  const [hazeActive, setHazeActive] = useState(false);

  // Layout calculations
  const [eecTargetRect, setEecTargetRect] = useState(null);
  const [voeTargetRect, setVoeTargetRect] = useState(null);

  // Grid Fragmentation Config
  const isMobile = window.innerWidth <= 768;
  const gridRows = isMobile ? 6 : 8;
  const gridCols = isMobile ? 6 : 8;
  const fragments = Array.from({ length: gridRows * gridCols }, (_, i) => ({
    id: i,
    row: Math.floor(i / gridCols),
    col: i % gridCols,
  }));

  // Controls
  const cameraControls = useAnimation();
  const orbitControls = useAnimation();
  const voeControls = useAnimation();
  const eecControls = useAnimation();
  const bgControls = useAnimation();
  const fragmentControls = useAnimation();
  const flashControls = useAnimation();

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  // Initialization & Check
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReducedMotion(prefersReduced);

    // Using sessionStorage to only play once per tab lifecycle
    const played = sessionStorage.getItem("voe_intro_played");
    
    if (prefersReduced || played === "true") {
      setHasPlayed(true);
      setIsCinematic(false);
    } else {
      setHasPlayed(false);
      setIsCinematic(true);
    }
  }, []);

  // The Main Cinematic Sequence
  useEffect(() => {
    if (!isCinematic) return;
    
    // We need target coordinates from the DOM to animate INTO them seamlessly
    if (inlineContainerRef.current) {
      const rect = inlineContainerRef.current.getBoundingClientRect();
      // Estimate inline button size (VOE text) and EEC logo size
      // The container starts at rect.left, rect.top
      setVoeTargetRect({ x: rect.left + 35, y: rect.top + 15, scale: 0.8 }); // Approximations based on Navbar
      setEecTargetRect({ x: rect.left + 125, y: rect.top + 50, scale: 0.8 }); 
    }

    let isMounted = true;

    const runSequence = async () => {
      const delay = async (ms) => {
        await sleep(ms);
        if (!isMounted) throw new Error("Aborted");
      };

      try {
        // 1. Initial State
        voeControls.set({ x: -100, y: 0, scale: 0.1, opacity: 0, rotateY: -20, filter: "blur(10px)" });
        eecControls.set({ x: 100, y: 0, scale: 0.1, opacity: 0, rotateY: 20, filter: "blur(10px)" });
        orbitControls.set({ rotate: 0, rotateX: 15 });
        bgControls.set({ opacity: 1 });
        cameraControls.set({ scale: 1, z: 0 });
        setHazeActive(true);
        setShowFragments(false);

        await delay(100);

        // 0.0 - 0.7: DUAL LOGO MATERIALIZATION
        voeControls.start({
          scale: 1, opacity: 1, rotateY: 0, filter: "blur(0px)",
          boxShadow: "0 0 40px rgba(176, 38, 255, 0.4)",
          transition: { duration: 0.7, ease: "easeOut" }
        });
        eecControls.start({
          scale: 1, opacity: 1, rotateY: 0, filter: "blur(0px)",
          boxShadow: "0 0 40px rgba(255, 100, 50, 0.4)",
          transition: { duration: 0.7, ease: "easeOut" }
        });
        await delay(700);

        // 0.7 - 2.0: 3D ORBIT
        orbitControls.start({ rotate: 360, transition: { duration: 1.3, ease: "easeInOut" } });
        voeControls.start({ rotate: -360, z: [0, 50, 0, -50, 0], transition: { duration: 1.3, ease: "easeInOut" } });
        eecControls.start({ rotate: -360, z: [0, -50, 0, 50, 0], transition: { duration: 1.3, ease: "easeInOut" } });
        await delay(1300);

        // 2.0 - 2.6: SYNCHRONIZE
        voeControls.start({ scale: 1.15, transition: { duration: 0.3, yoyo: 1 } });
        eecControls.start({ scale: 1.15, transition: { duration: 0.3, yoyo: 1 } });
        await delay(600);

        // 2.6 - 3.6: EEC SEPARATION (Moves to calculated layout position)
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const eecTx = eecTargetRect ? eecTargetRect.x - centerX : -centerX + 150;
        const eecTy = eecTargetRect ? eecTargetRect.y - centerY : -centerY + 100;

        eecControls.start({
          x: eecTx, y: eecTy, scale: 0.8, rotate: 0,
          boxShadow: "0 0 0px rgba(255,100,50,0)",
          transition: { duration: 1.0, ease: [0.4, 0, 0.2, 1] }
        });
        
        voeControls.start({ x: 0, y: 0, scale: 1.2, transition: { duration: 1.0, ease: "easeInOut" } });
        await delay(1000);

        // 3.6 - 4.2: VOE CAMERA FOCUS
        cameraControls.start({ scale: 1.4, transition: { duration: 0.6, ease: "easeOut" } });
        await delay(600);

        // 4.2 - 5.3: VOE 360 ROTATION
        voeControls.start({ rotateY: 360, rotateX: 10, transition: { duration: 1.1, ease: "easeInOut" } });
        await delay(1100);

        // 5.3 - 6.0: ELECTRICAL CHARGE
        setLightningActive(true);
        voeControls.start({
          x: [-2, 2, -1, 3, -3, 0],
          y: [1, -2, 2, -1, 1, 0],
          boxShadow: "0 0 80px rgba(176, 38, 255, 1)",
          transition: { duration: 0.7, repeat: Infinity, repeatType: "mirror" }
        });
        await delay(700);

        // 6.0 - 6.5: OVERLOAD (Flash)
        flashControls.start({ opacity: [0, 0.8, 0], transition: { duration: 0.5 } });
        await delay(500);

        // 6.5 - 7.2: FRAGMENTATION & SHOCKWAVE
        setShowShockwave(true);
        setShowFragments(true);
        setLightningActive(false);
        setParticlesMode("burst");
        cameraControls.start({ scale: 1.0, transition: { duration: 0.5, ease: "easeOut" } });
        
        voeControls.stop();
        voeControls.set({ opacity: 0 }); 

        fragmentControls.start((i) => {
          const angle = Math.random() * Math.PI * 2;
          const radius = 150 + Math.random() * 200;
          const tx = Math.cos(angle) * radius;
          const ty = Math.sin(angle) * radius;
          const tz = (Math.random() - 0.5) * 300;
          const rotX = Math.random() * 720;
          const rotY = Math.random() * 720;

          return {
            x: tx, y: ty, z: tz, rotateX: rotX, rotateY: rotY,
            opacity: [1, 0.8],
            transition: { duration: 0.7, ease: "easeOut" }
          };
        });
        await delay(700);

        // 7.2 - 8.3: FIRE + WATER EXPLOSION
        await delay(1100);

        // 8.3 - 8.8: CENTRAL ENERGY CORE (Reverse particles)
        setParticlesMode("converge");
        await delay(500);

        // 8.8 - 9.8: RECONSTRUCTION
        fragmentControls.start({
          x: 0, y: 0, z: 0, rotateX: 0, rotateY: 0, opacity: 1,
          transition: { duration: 1.0, ease: "easeInOut" }
        });
        await delay(900);

        // 9.8 - 10.3: FINAL SNAP
        setShowShockwave(false);
        setParticlesMode("none");
        setShowFragments(false);
        voeControls.set({ opacity: 1, x: 0, y: 0, rotateX: 0, rotateY: 0, boxShadow: "0 0 20px rgba(176,38,255,0.5)" });
        
        flashControls.start({ opacity: [0, 1, 0], transition: { duration: 0.3 } });
        await delay(300);

        // 10.3 - 11.0: LIGHT SWEEP & SNAP TO DOM
        const voeTx = voeTargetRect ? voeTargetRect.x - centerX : -centerX + 50;
        const voeTy = voeTargetRect ? voeTargetRect.y - centerY : -centerY + 30;

        voeControls.start({
          x: voeTx, y: voeTy, scale: 0.3,
          boxShadow: "0 0 0px rgba(176,38,255,0)",
          transition: { duration: 0.7, ease: "easeInOut" }
        });
        bgControls.start({ opacity: 0, transition: { duration: 0.7 } });
        setHazeActive(false);

        await delay(700);

        // Mark complete
        sessionStorage.setItem("voe_intro_played", "true");
        setIsCinematic(false);
      } catch (error) {
        // Animation aborted due to unmount or strict mode remount
        console.log("Animation sequence aborted");
      }
    };

    runSequence();

    return () => { isMounted = false; };
  }, [isCinematic, orbitControls, voeControls, eecControls, bgControls, cameraControls, fragmentControls, flashControls, eecTargetRect, voeTargetRect]);


  // Config for TS Particles
  const getParticleConfig = () => {
    if (particlesMode === "none") return { particles: { number: { value: 0 } } };
    
    const isBurst = particlesMode === "burst";
    return {
      fullScreen: { enable: false, zIndex: -1 },
      fpsLimit: 60,
      particles: {
        number: { value: isBurst ? (isMobile ? 150 : 300) : 100 },
        color: { value: ["#ff4500", "#1e90ff", "#00ffff", "#ff0000"] },
        shape: { type: ["circle", "triangle"] },
        opacity: { value: 0.8, random: true, anim: { enable: true, speed: 2, opacity_min: 0.1 } },
        size: { value: 5, random: true, anim: { enable: true, speed: 5, size_min: 0.1 } },
        move: {
          enable: true,
          speed: isBurst ? 25 : 8,
          direction: "none",
          random: true,
          straight: false,
          outModes: { default: isBurst ? "out" : "bounce" },
          attract: { enable: !isBurst, rotateX: 600, rotateY: 1200 }
        }
      },
      interactivity: { detectsOn: "canvas", events: { resize: true } },
      absorbers: !isBurst ? [{ color: "#000", opacity: 0, position: { x: 50, y: 50 }, size: { value: 10, limit: 50 } }] : [],
      detectRetina: true
    };
  };

  // Render Portal for Cinematic Overlay so it breaks out of Navbar
  const cinematicPortal = isCinematic && typeof document !== "undefined" ? createPortal(
    <div className="cinematic-overlay">
      <motion.div className="cinematic-bg" animate={bgControls} />
      <div className={`atmospheric-haze ${hazeActive ? 'active' : ''}`} />
      
      <motion.div className="white-hot-flash" animate={flashControls} />
      
      {showShockwave && <div className="shockwave fire" />}

      {particlesMode !== "none" && (
        <div className="particles-layer">
          <Particles id="tsparticles" init={particlesInit} options={getParticleConfig()} />
        </div>
      )}

      {lightningActive && (
        <div className="lightning-container">
          <svg width="400" height="400" viewBox="0 0 400 400">
             {/* Simple procedural-looking lightning paths */}
             <path className="lightning-path" d="M200,100 L220,150 L180,180 L230,220 L190,260 L210,300" />
             <path className="lightning-path" d="M100,200 L150,180 L180,220 L220,190 L260,210 L300,200" style={{ animationDelay: '0.1s' }}/>
          </svg>
        </div>
      )}

      <motion.div className="cinematic-camera" animate={cameraControls}>
        <motion.div className="orbit-center" animate={orbitControls}>
          
          <motion.div className="anim-logo-wrapper" animate={voeControls}>
             {!showFragments && <img src={voeLogoImg} alt="VOE" className="voe-cinematic-img" />}
             
             {showFragments && (
                <div className="fragmentation-container" style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)`, gridTemplateRows: `repeat(${gridRows}, 1fr)` }}>
                  {fragments.map((f, i) => (
                    <motion.div
                      key={f.id}
                      custom={i}
                      animate={fragmentControls}
                      className="logo-fragment"
                      style={{
                        backgroundPosition: `${(f.col / (gridCols - 1)) * 100}% ${(f.row / (gridRows - 1)) * 100}%`,
                        backgroundSize: `${gridCols * 100}% ${gridRows * 100}%`
                      }}
                    />
                  ))}
                </div>
             )}
          </motion.div>

          <motion.div className="anim-logo-wrapper" animate={eecControls}>
             <img src={eecLogoImg} alt="EEC" className="eec-cinematic-img" />
          </motion.div>

        </motion.div>
      </motion.div>
    </div>,
    document.body
  ) : null;

  // Render Inline Static Component for standard layout
  return (
    <>
      {cinematicPortal}
      <div className="branding-inline-container" ref={inlineContainerRef}>
        <button className="navbar-logo-btn" onClick={onLogoClick}>
          VOE
        </button>
        {/* We keep the EEC logo mounted but hide it visually if cinematic is running 
            to prevent layout shifts, although cinematic overlay covers everything anyway. */}
        <img 
          src={eecLogoImg} 
          alt="Easwari Engineering College" 
          className="eec-inline-logo" 
          style={{ opacity: isCinematic ? 0 : 0.9 }}
        />
      </div>
    </>
  );
}

export default GlobalLogos;
