import { useState } from "react";
import "./Contact.css";

function Contact() {
  const [formNotice, setFormNotice] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const subject = String(formData.get("subject") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const body = `From: ${name} (${email})\n\n${message}`;

    window.location.href = `mailto:voe@easwari.ac.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setFormNotice("An email draft should open in your mail app. Please send it there. If it does not open, email voe@easwari.ac.in directly.");
  };

  return (
    <section className="contact-page">

      {/* ================= HEADER ================= */}

      <div className="contact-header">
        <span className="contact-tag">GET IN TOUCH</span>

        <h1>
          LET'S <span>CONNECT.</span>
        </h1>

        <p>
          Have an idea, question, or collaboration in mind?
          Reach out to VOE and let's build something together.
        </p>
      </div>


      {/* ================= CONTACT CONTENT ================= */}

      <div className="contact-container">

        {/* CONTACT INFO */}

        <div className="contact-info">

          <h2>REACH VOE</h2>

          <p>
            Whether you want to collaborate, participate in an
            event, or simply connect with our community, we'd
            love to hear from you.
          </p>

          <div className="contact-details">

            <div className="contact-detail">
              <span className="detail-label">COLLEGE</span>
              <span className="detail-value">
                Easwari Engineering College
              </span>
            </div>

            <div className="contact-detail">
              <span className="detail-label">LOCATION</span>
              <span className="detail-value">
                Bharathi Salai, Ramapuram,
    Chennai, Tamil Nadu — 600089
              </span>
            </div>

          </div>

        </div>


        {/* CONTACT FORM */}

        <div className="contact-form-container">

          <h2>SEND US A MESSAGE</h2>

          <form
            className="contact-form"
            onSubmit={handleSubmit}
          >

            <div className="form-group">
              <label htmlFor="name">NAME</label>

              <input
                type="text"
                id="name"
                name="name"
                placeholder="Your name"
                required
              />
            </div>


            <div className="form-group">
              <label htmlFor="email">EMAIL</label>

              <input
                type="email"
                id="email"
                name="email"
                placeholder="Your email"
                required
              />
            </div>


            <div className="form-group">
              <label htmlFor="subject">SUBJECT</label>

              <input
                type="text"
                id="subject"
                name="subject"
                placeholder="What is this regarding?"
                required
              />
            </div>


            <div className="form-group">
              <label htmlFor="message">MESSAGE</label>

              <textarea
                id="message"
                name="message"
                rows="5"
                placeholder="Tell us what's on your mind..."
                required
              ></textarea>
            </div>


            <button type="submit" className="contact-submit">
              OPEN EMAIL DRAFT ↗
            </button>

            {formNotice && <p className="contact-form-notice" role="status">{formNotice}</p>}

          </form>

        </div>

      </div>


      {/* ================= MAP ================= */}

      <div className="contact-map-section">

        <div className="map-header">
          <span className="contact-tag">FIND US</span>

          <h2>
            OUR <span>CAMPUS.</span>
          </h2>
        </div>

        <div className="map-container">
  <iframe
    title="Easwari Engineering College Location"
    src="https://www.google.com/maps?q=Easwari+Engineering+College,+Bharathi+Salai,+Ramapuram,+Chennai,+Tamil+Nadu+600089&output=embed"
    loading="lazy"
    allowFullScreen
    referrerPolicy="no-referrer-when-downgrade"
  ></iframe>
</div>

      </div>


      {/* ================= COLLABORATION ================= */}

      <div className="contact-collaboration">

        <span className="contact-tag">
          LET'S CREATE TOGETHER
        </span>

        <h2>
          HAVE AN IDEA?
        </h2>

        <p>
          Let's turn your idea into something meaningful
          for the Easwarian community.
        </p>

      </div>

    </section>
  );
}

export default Contact;
