import { useState, useEffect } from "react";

import Navbar from "./assets/components/Navbar.jsx";
import Hero from "./assets/components/Hero.jsx";
import MissionVision from "./assets/components/MissionVision.jsx";
import Team from "./assets/components/Team.jsx";
import About from "./assets/components/About.jsx";
import Contact from "./assets/components/Contact.jsx";
import Footer from "./assets/components/Footer.jsx";

function App() {
  const [activePage, setActivePage] = useState("home");

  // Scroll to top whenever a new page is selected
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [activePage]);

  return (
    <>
      {/* ================= NAVBAR ================= */}

      <Navbar setActivePage={setActivePage} />


      {/* ================= HOME ================= */}

      {activePage === "home" && (
        <>
          <Hero setActivePage={setActivePage} />
          <MissionVision />
        </>
      )}


      {/* ================= ABOUT ================= */}

      {activePage === "about" && (
        <About />
      )}


      {/* ================= GALLERY ================= */}

      {activePage === "gallery" && (
        <div
          style={{
            minHeight: "100vh",
            paddingTop: "120px",
            color: "white",
            textAlign: "center",
          }}
        >
          <h1>GALLERY</h1>
          <p>VOE gallery will appear here.</p>
        </div>
      )}


      {/* ================= TEAM ================= */}

      {activePage === "team" && (
        <Team />
      )}


      {/* ================= EVENTS ================= */}

      {activePage === "events" && (
        <div
          style={{
            minHeight: "100vh",
            paddingTop: "120px",
            color: "white",
            textAlign: "center",
          }}
        >
          <h1>EVENTS</h1>
          <p>Upcoming VOE events will appear here.</p>
        </div>
      )}


      {/* ================= CONTACT ================= */}

      {activePage === "contact" && (
        <Contact />
      )}


      {/* ================= FOOTER ================= */}

      <Footer setActivePage={setActivePage} />
    </>
  );
}

export default App;