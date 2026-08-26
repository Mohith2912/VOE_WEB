import { useState } from "react";
import "./Navbar.css";
import eecLogo from "../eec-logo.png";
import VOEContinuousLogo from "./VOEContinuousLogo.jsx";

function Navbar({ setActivePage }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { number: "01", name: "HOME", page: "home" },
    { number: "02", name: "ABOUT", page: "about" },
    { number: "03", name: "GALLERY", page: "gallery" },
    { number: "04", name: "TEAM", page: "team" },
    { number: "05", name: "EVENTS", page: "events" },
      { number: "06", name: "CONTACT", page: "contact" },

  ];

  const handleNavigation = (page) => {
    console.log("Clicked:", page);

    setActivePage(page);
    setMenuOpen(false);
  };

  return (
    <>
      <nav className="navbar">

        <button
          className={`menu-btn ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className="navbar-brand-group">
          <VOEContinuousLogo onClick={() => handleNavigation("home")} />

          <img
            src={eecLogo}
            alt="Easwari Engineering College"
            className="navbar-eec-logo"
            onClick={() => handleNavigation("home")}
          />
        </div>

      </nav>

      <div
        className={`menu-overlay ${menuOpen ? "show" : ""}`}
        onClick={() => setMenuOpen(false)}
      ></div>

      <div className={`side-menu ${menuOpen ? "open" : ""}`}>

        <div className="menu-header">
          <span>NAVIGATION</span>
          <span className="menu-line"></span>
        </div>

        <div className="side-menu-content">

          {navItems.map((item) => (
            <button
              key={item.name}
              className="menu-item"
              onClick={() => handleNavigation(item.page)}
            >
              <span className="menu-number">
                {item.number}
              </span>

              <span className="menu-name">
                {item.name}
              </span>

              <span className="menu-arrow">
                ↗
              </span>
            </button>
          ))}

        </div>

        <div className="menu-footer">
          <span>VOICE OF EASWARI</span>
        </div>

      </div>
    </>
  );
}

export default Navbar;