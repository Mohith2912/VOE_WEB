import { useEffect, useState, useCallback } from "react";
import { motion, useAnimation } from "framer-motion";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import "./GlobalLogos.css";

import voeLogo from "../voe-logo.jpeg";
// Since you haven't manually saved the .png yet, I'm switching this back to the SVG placeholder so the app doesn't crash.
// Please manually save the image you attached as eec-logo.png in the src/assets folder, then change this import.
import eecLogo from "../eec-logo.svg";

// Simple sleep helper
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function GlobalLogos() {
  const [isCinematic, setIsCinematic] = useState(true);
  const [showParticles, setShowParticles] = useState(false);
  const [particleConfig, setParticleConfig] = useState("burst"); // "burst" or "converge"
  const [showSweep, setShowSweep] = useState(false);
  const [hazeActive, setHazeActive] = useState(false);
  const [voeOpacity, setVoeOpacity] = useState(1);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Framer Motion controls
  const orbitControls = useAnimation();
  const voeControls = useAnimation();
  const eecControls = useAnimation();
  const bgControls = useAnimation();

  // Initialize tsparticles
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  useEffect(() => {
    // Check for reduced motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      setIsReducedMotion(true);
      setIsCinematic(false);
      return;
    }

    const runCinematicSequence = async () => {
      // Setup initial states
      voeControls.set({ x: -80, y: 0, scale: 0, opacity: 0, rotateY: -30, z: -100 });
      eecControls.set({ x: 80, y: 0, scale: 0, opacity: 0, rotateY: 30, z: -100 });
      orbitControls.set({ rotate: 0, rotateX: 20 }); // Slight tilt for 3D orbit
      bgControls.set({ opacity: 1 });
      setHazeActive(true);

      // 0.0–0.8 sec: Dual-logo appearance (depth, volumetric lighting illusion via shadow)
      voeControls.start({
        scale: 1, opacity: 1, rotateY: 0, z: 0,
        boxShadow: "0 0 30px rgba(176, 38, 255, 0.4)",
        transition: { duration: 0.8, ease: "easeOut" }
      });
      eecControls.start({
        scale: 1, opacity: 1, rotateY: 0, z: 0,
        boxShadow: "0 0 30px rgba(255, 100, 50, 0.4)",
        transition: { duration: 0.8, ease: "easeOut" }
      });
      await sleep(800);

      // 0.8–2.2 sec: VOE + EEC orbital revolution
      // We rotate the parent container, and counter-rotate the children to keep them upright
      orbitControls.start({
        rotate: 360,
        transition: { duration: 1.4, ease: "easeInOut" }
      });
      // Counter-rotate children to stay facing camera while orbiting
      voeControls.start({ rotate: -360, transition: { duration: 1.4, ease: "easeInOut" } });
      eecControls.start({ rotate: -360, transition: { duration: 1.4, ease: "easeInOut" } });
      await sleep(1400);

      // 2.2–2.8 sec: Synchronized logo interaction (pulse)
      voeControls.start({ scale: [1, 1.15, 1], transition: { duration: 0.6 } });
      eecControls.start({ scale: [1, 1.15, 1], transition: { duration: 0.6 } });
      await sleep(600);

      // 2.8–3.8 sec: EEC separates and moves to its final position
      // Calculate target screen position based on window size
      const targetX = -(window.innerWidth / 2) + 95; // roughly 20px left + 75px center of 150px container
      const eecTargetY = 80; 

      eecControls.start({
        x: targetX,
        y: eecTargetY,
        z: 0,
        scale: 0.8, // shrink to fit final layout
        boxShadow: "0 0 0px rgba(255, 100, 50, 0)", // remove glow
        transition: { duration: 1.0, ease: [0.4, 0.0, 0.2, 1] } // curved/smooth easing
      });
      
      // Move VOE to center zero to prepare for solo showcase
      voeControls.start({ x: 0, y: 0, transition: { duration: 1.0, ease: "easeInOut" } });
      await sleep(1000);

      // 3.8–4.5 sec: VOE camera push-in
      voeControls.start({
        scale: 1.5,
        boxShadow: "0 0 50px rgba(176, 38, 255, 0.6)",
        transition: { duration: 0.7, ease: "easeOut" }
      });
      await sleep(700);

      // 4.5–5.5 sec: VOE 360° rotation (Y-axis)
      voeControls.start({
        rotateY: 360,
        transition: { duration: 1.0, ease: "easeInOut" }
      });
      await sleep(1000);

      // 5.5–6.2 sec: Energy build-up
      // Simulating camera shake and intense glow
      voeControls.start({
        x: [0, -2, 2, -1, 1, 0],
        y: [0, 1, -1, 2, -2, 0],
        boxShadow: "0 0 80px rgba(176, 38, 255, 1)",
        transition: { duration: 0.7, repeat: 1 }
      });
      await sleep(700);

      // 6.2–6.8 sec: VOE fragmentation (show particles, hide logo)
      setVoeOpacity(0); // Hide the actual logo
      setParticleConfig("burst");
      setShowParticles(true); // Fire the burst particles
      await sleep(600);

      // 6.8–7.6 sec: Fire + water energy effect (let particles travel)
      // The burst particles inherently have fire/water colors configured below.
      await sleep(800);

      // 7.6–8.5 sec: Particle convergence
      // Switch particle config to pull them back in
      setParticleConfig("converge");
      await sleep(900);

      // 8.5–9.3 sec: VOE reconstruction (show logo, hide particles)
      setShowParticles(false);
      setVoeOpacity(1); // Show logo again
      voeControls.set({ rotateY: 0 }); // reset rotation
      voeControls.start({
        scale: [0.5, 1.2, 1], // pop in
        boxShadow: "0 0 20px rgba(176, 38, 255, 0.4)",
        transition: { duration: 0.8, ease: "easeOut" }
      });
      await sleep(800);

      // 9.3–10.0 sec: Final light sweep and transition to stable website state
      setShowSweep(true);
      
      // Move VOE to final top-left position
      const voeTargetY = -80;
      voeControls.start({
        x: targetX,
        y: voeTargetY,
        scale: 0.8,
        boxShadow: "0 0 0px rgba(176, 38, 255, 0)",
        transition: { duration: 0.7, ease: "easeInOut" }
      });
      
      // Fade out background
      bgControls.start({ opacity: 0, transition: { duration: 0.7 } });
      setHazeActive(false);

      await sleep(700);

      // End cinematic mode, snap to CSS layout
      setIsCinematic(false);
    };

    runCinematicSequence();
  }, [orbitControls, voeControls, eecControls, bgControls]);

  // Particle configuration for Burst (Fire & Water)
  const getParticleOptions = () => {
    const isBurst = particleConfig === "burst";
    return {
      fullScreen: { enable: false, zIndex: 9999 },
      fpsLimit: 60,
      particles: {
        number: {
          value: isBurst ? 250 : 150,
          density: { enable: true, value_area: 800 }
        },
        color: {
          value: ["#ff4500", "#1e90ff", "#ff8c00", "#00bfff"] // Fire and Water
        },
        shape: {
          type: ["circle", "triangle", "polygon"]
        },
        opacity: {
          value: 0.9,
          random: true,
          anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false }
        },
        size: {
          value: isBurst ? 6 : 4,
          random: true,
          anim: { enable: true, speed: 4, size_min: 0.1, sync: false }
        },
        move: {
          enable: true,
          speed: isBurst ? 20 : 10,
          direction: isBurst ? "none" : "none", // Will use attract to pull back
          random: true,
          straight: false,
          outModes: { default: isBurst ? "out" : "bounce" },
          // The converge phase uses an attractor at the center
          attract: { 
            enable: !isBurst, 
            rotateX: 600, 
            rotateY: 1200 
          }
        }
      },
      interactivity: {
        detectsOn: "canvas",
        events: { resize: true }
      },
      // When converging, add an absorber at the center to suck particles in
      absorbers: !isBurst ? [{
        color: "#000000",
        opacity: 0,
        position: { x: 50, y: 50 },
        size: { value: 20, limit: 100 }
      }] : [],
      detectRetina: true
    };
  };

  // If user prefers reduced motion or animation is over, just render the final static container
  if (isReducedMotion || !isCinematic) {
    return (
      <div className="global-logos-container">
        <div className="logo-wrapper" style={{ position: 'relative', margin: 0, top: 'auto', left: 'auto', width: '120px', height: '120px' }}>
          <img src={voeLogo} alt="VOE Logo" className="voe-logo" style={{ width: '100%', height: 'auto' }} />
        </div>
        <div className="logo-wrapper" style={{ position: 'relative', margin: 0, top: 'auto', left: 'auto', width: '120px', height: '120px' }}>
          <img src={eecLogo} alt="EEC Logo" className="eec-logo" style={{ width: '100%', height: 'auto' }} />
        </div>
      </div>
    );
  }

  // Cinematic Intro Render
  return (
    <div className="cinematic-overlay">
      <motion.div className="cinematic-bg" animate={bgControls} />
      <div className={`atmospheric-haze ${hazeActive ? 'active' : ''}`}></div>

      {showParticles && (
        <div className="particles-container">
          <Particles 
            id="tsparticles" 
            init={particlesInit} 
            options={getParticleOptions()} 
          />
        </div>
      )}

      {/* Orbit center wrapper */}
      <motion.div className="orbit-center" animate={orbitControls}>
        
        {/* VOE Logo */}
        <motion.div className="logo-wrapper" animate={voeControls} style={{ opacity: voeOpacity }}>
          <div className={`light-sweep-container ${showSweep ? 'sweep' : ''}`}>
             <img src={voeLogo} alt="VOE Logo" className="voe-logo" />
          </div>
        </motion.div>

        {/* EEC Logo */}
        <motion.div className="logo-wrapper" animate={eecControls}>
          <img src={eecLogo} alt="EEC Logo" className="eec-logo" />
        </motion.div>

      </motion.div>
    </div>
  );
}

export default GlobalLogos;
