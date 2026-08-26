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

      <div className="hero-logo-stage intro-complete">
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
