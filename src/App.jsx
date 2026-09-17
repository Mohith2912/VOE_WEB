import { useState, useEffect } from "react";

import Navbar from "./assets/components/Navbar.jsx";
import Hero from "./assets/components/Hero.jsx";
import MissionVision from "./assets/components/MissionVision.jsx";
import Team from "./assets/components/Team.jsx";
import About from "./assets/components/About.jsx";
import Contact from "./assets/components/Contact.jsx";
import Footer from "./assets/components/Footer.jsx";
import GlobalLogos from "./assets/components/GlobalLogos.jsx";
import VOEBgWatermark from "./assets/components/VOEBgWatermark.jsx";

function App() {
  const [activePage, setActivePage] = useState("home");
  const [introFinished, setIntroFinished] = useState(() => {
    return (
      typeof window !== "undefined" &&
      (sessionStorage.getItem("voeEecIntroPlayed") === "true" ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    );
  });

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
      {/* Standalone Consecutive Master Intro */}
      {!introFinished && (
        <GlobalLogos onComplete={() => setIntroFinished(true)} />
      )}

      {/* Main Website Theme & Pages (Revealed Consecutively After Intro) */}
      <div
        className="main-site-wrapper"
        style={{
          opacity: introFinished ? 1 : 0,
          transition: "opacity 0.6s ease-in-out",
          pointerEvents: introFinished ? "auto" : "none",
        }}
      >
        {/* ================= VOE BACKGROUND WATERMARK ================= */}
        <VOEBgWatermark />

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
        {activePage === "about" && <About />}

        {/* ================= GALLERY ================= */}
        {activePage === "gallery" && (
          <div
            style={{
              minHeight: "100vh",
              paddingTop: "140px",
              paddingBottom: "80px",
              color: "var(--text-primary)",
              textAlign: "center",
              position: "relative",
              zIndex: 2,
              background: "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                maxWidth: "600px",
                margin: "0 24px",
                padding: "60px 40px",
                background: "rgba(250, 251, 255, 0.88)",
                backdropFilter: "blur(28px) saturate(180%)",
                border: "1px solid rgba(203, 213, 225, 0.75)",
                borderRadius: "var(--radius-xl)",
                boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 1), 0 16px 44px -8px rgba(15, 23, 42, 0.06)",
              }}
            >
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "40px", fontWeight: "800", color: "#4C1D95", marginBottom: "12px", letterSpacing: "-0.5px" }}>GALLERY</h1>
              <p style={{ color: "#334155", fontSize: "16px", lineHeight: "1.7" }}>Curated VOE media, exhibits, and visual archives will appear here.</p>
            </div>
          </div>
        )}

        {/* ================= TEAM ================= */}
        {activePage === "team" && <Team />}

        {/* ================= EVENTS ================= */}
        {activePage === "events" && (
          <div
            style={{
              minHeight: "100vh",
              paddingTop: "140px",
              paddingBottom: "80px",
              color: "var(--text-primary)",
              textAlign: "center",
              position: "relative",
              zIndex: 2,
              background: "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                maxWidth: "600px",
                margin: "0 24px",
                padding: "60px 40px",
                background: "rgba(250, 251, 255, 0.88)",
                backdropFilter: "blur(28px) saturate(180%)",
                border: "1px solid rgba(203, 213, 225, 0.75)",
                borderRadius: "var(--radius-xl)",
                boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 1), 0 16px 44px -8px rgba(15, 23, 42, 0.06)",
              }}
            >
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "40px", fontWeight: "800", color: "#4C1D95", marginBottom: "12px", letterSpacing: "-0.5px" }}>EVENTS</h1>
              <p style={{ color: "#334155", fontSize: "16px", lineHeight: "1.7" }}>Upcoming VOE workshops, speaker sessions, and hackathons will appear here.</p>
            </div>
          </div>
        )}

        {/* ================= CONTACT ================= */}
        {activePage === "contact" && <Contact />}

        {/* ================= FOOTER ================= */}
        <Footer setActivePage={setActivePage} />
      </div>
    </>
  );
}

export default App;
