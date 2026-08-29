import "./Footer.css";

function Footer({ setActivePage }) {
  const nav = (page) => setActivePage(page);

  const links = [
    { icon: "🏠", label: "HOME",    page: "home"    },
    { icon: "👤", label: "ABOUT",   page: "about"   },
    { icon: "🖼️", label: "GALLERY", page: "gallery" },
    { icon: "📅", label: "EVENTS",  page: "events"  },
  ];

  return (
    <footer className="footer">
      <div className="footer-container">

        {/* ── BRAND ── */}
        <div className="footer-brand">
          <h2 className="footer-logo">VOE</h2>
          <p className="footer-tagline">Voice of Easwarians</p>
          <span className="footer-slogan">Your Voice. Our Campus. One Community.</span>

          <div className="footer-social-icons">
            <a href="https://www.instagram.com/voe.eec" target="_blank" rel="noopener noreferrer"
               className="footer-icon-btn" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
              </svg>
            </a>
            <a href="#" className="footer-icon-btn" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect x="2" y="9" width="4" height="12"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
            <a href="#" className="footer-icon-btn" aria-label="YouTube">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
                <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none"/>
              </svg>
            </a>
            <a href="mailto:voe@easwari.ac.in" className="footer-icon-btn" aria-label="Email">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </a>
          </div>
        </div>

        {/* ── DIVIDER ── */}
        <div className="footer-divider" />

        {/* ── QUICK LINKS ── */}
        <div className="footer-links">
          <h3 className="footer-section-title">QUICK LINKS</h3>
          <ul className="footer-link-list">
            {links.map((item) => (
              <li key={item.page}>
                <button className="footer-link-item" onClick={() => nav(item.page)}>
                  <span className="fl-icon">{item.icon}</span>
                  <span className="fl-label">{item.label}</span>
                  <span className="fl-arrow">›</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* ── DIVIDER ── */}
        <div className="footer-divider" />

        {/* ── CONNECT ── */}
        <div className="footer-connect">
          <h3 className="footer-section-title">CONNECT</h3>
          <p>Stay connected with VOE and be part of our growing community.</p>
          <div className="footer-cta-buttons">
            <a href="https://www.instagram.com/voe.eec" target="_blank" rel="noopener noreferrer"
               className="footer-cta-btn footer-cta-insta">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
              </svg>
              INSTAGRAM
            </a>
            <a href="#" className="footer-cta-btn footer-cta-linkedin">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect x="2" y="9" width="4" height="12"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
              LINKEDIN
            </a>
          </div>
        </div>

      </div>

      {/* ── FOOTER BOTTOM ── */}
      <div className="footer-bottom">
        <span>© 2026 VOE — VOICE OF EASWARIANS</span>
        <span>CREATE • CONNECT • LEAD • INSPIRE</span>
      </div>
    </footer>
  );
}

export default Footer;
