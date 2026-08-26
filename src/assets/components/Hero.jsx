import { useEffect, useState } from "react";
import "./Hero.css";
import voeLogo from "../voe-logo.png";

const logoFragments = Array.from({ length: 25 }, (_, index) => {
  const column = index % 5;
  const row = Math.floor(index / 5);
  const direction = index % 2 === 0 ? 1 : -1;

  return {
    id: `fragment-${index}`,
    style: {
      "--tile-left": `${column * 20}%`,
      "--tile-top": `${row * 20}%`,
      "--tile-background-x": `${column * 25}%`,
      "--tile-background-y": `${row * 25}%`,
      "--burst-x": `${(column - 2) * 210 + (row % 2 === 0 ? -30 : 30)}%`,
      "--burst-y": `${(row - 2) * 210 + (column % 2 === 0 ? -35 : 35)}%`,
      "--burst-rotate": `${direction * (120 + index * 14)}deg`,
      "--burst-rotate-y": `${direction * (45 + index * 7)}deg`,
      "--burst-scale": `${0.72 + (index % 4) * 0.08}`,
      "--burst-delay": `${(index % 5) * 12}ms`,
    },
  };
});

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function Hero({ setActivePage }) {
  const [reducedMotion] = useState(prefersReducedMotion);
  const [introComplete, setIntroComplete] = useState(reducedMotion);

  useEffect(() => {
    document.body.classList.toggle("voe-intro-active", !introComplete);

    return () => document.body.classList.remove("voe-intro-active");
  }, [introComplete]);

  return (
    <section className="hero" id="home">

      <div className="hero-content">

        <p className="hero-tag">
  YOUR VOICE • OUR CAMPUS • ONE COMMUNITY
        </p>

        <h1 className="hero-title">
  <small>VOICE OF</small>
  <span>EASWARIANS</span>
</h1>
        <p className="hero-description">
          The official club of Easwarians, empowering students
          through technology, innovation, creativity and collaboration.
        </p>

        <div className="hero-buttons">
          <a href="#events" className="primary-btn">
            Explore Events
          </a>

          <button
  className="secondary-btn"
  onClick={() => setActivePage("about")}
>
  ABOUT VOE
</button>
        </div>

      </div>

      {!introComplete && (
        <div className="voe-logo-intro" aria-hidden="true">
          <div className="voe-intro-aura">
            <span className="voe-intro-fire"></span>
            <span className="voe-intro-water"></span>
            <span className="voe-intro-electricity"></span>
          </div>
          <span className="voe-intro-shock"></span>
          <img
            className="voe-logo-intro-emblem"
            src={voeLogo}
            alt=""
            onAnimationEnd={(event) => {
              if (event.animationName === "voe-logo-intro") {
                setIntroComplete(true);
              }
            }}
          />
          <span className="voe-intro-fragments">
            {logoFragments.map((fragment) => (
              <span
                className="voe-intro-fragment"
                key={fragment.id}
                style={{
                  ...fragment.style,
                  backgroundImage: `url(${voeLogo})`,
                }}
              ></span>
            ))}
          </span>
        </div>
      )}

      <div className={`hero-logo-stage ${introComplete ? "intro-complete" : ""}`}>
        <img
          className="voe-logo-emblem"
          src={voeLogo}
          alt="Voice of Easwarians logo"
        />
      </div>

    </section>
  );
}

export default Hero;
