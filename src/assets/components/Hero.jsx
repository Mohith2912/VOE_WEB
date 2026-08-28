import "./Hero.css";
import voeLogo from "../voe-logo.png";

function Hero({ setActivePage }) {
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
          <button
            className="primary-btn"
            onClick={() => setActivePage("events")}
          >
            <span>Explore Events</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: "8px" }}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>

          <button
            className="secondary-btn"
            onClick={() => setActivePage("about")}
          >
            <span>About VOE</span>
          </button>
        </div>
      </div>

      <div className="hero-logo-stage intro-complete">
        <img
          className="voe-logo-emblem"
          src={voeLogo}
          alt="Voice of Easwarians logo"
        />
      </div>

      {/* Subtle luxury scroll indicator */}
      <div className="hero-scroll-cue" aria-hidden="true">
        <span className="scroll-pill" />
      </div>
    </section>
  );
}

export default Hero;
