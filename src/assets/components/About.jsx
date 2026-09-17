import "./About.css";

const valueCards = [
  {
    num: "01",
    icon: "💡",
    title: "CREATE",
    desc: "Turn ideas into projects, events, and impactful initiatives.",
  },
  {
    num: "02",
    icon: "🤝",
    title: "CONNECT",
    desc: "Bring students together and build meaningful connections across departments and interests.",
  },
  {
    num: "03",
    icon: "⭐",
    title: "LEAD",
    desc: "Encourage students to take initiative, grow leadership skills, and drive positive change.",
  },
  {
    num: "04",
    icon: "🚀",
    title: "INSPIRE",
    desc: "Motivate students to explore, innovate, and make a difference together.",
  },
];

const activities = [
  { num: "01", title: "TECHNOLOGY & INNOVATION",   desc: "Encouraging students to explore technology, build ideas, and innovate." },
  { num: "02", title: "CREATIVE ACTIVITIES",        desc: "Creating opportunities for students to express their creativity and ideas." },
  { num: "03", title: "EVENTS & ACTIVITIES",        desc: "Organising engaging experiences that bring students together." },
  { num: "04", title: "COLLABORATION",              desc: "Building a culture where students learn and grow together." },
  { num: "05", title: "SKILL DEVELOPMENT",          desc: "Helping students discover and develop skills beyond the classroom." },
  { num: "06", title: "STUDENT INITIATIVES",        desc: "Providing a platform for students to turn their ideas into meaningful initiatives." },
];

function About() {
  return (
    <section className="about-page">

      {/* ========================= ABOUT INTRO ========================= */}
      <div className="about-intro">
        <p className="about-label">ABOUT VOE</p>

        <h1>
          More Than A Club.
          <span>A Community.</span>
        </h1>

        <p className="about-description">
          <strong>VOICE OF EASWARIANS (VOE)</strong> is a student-driven community
          created to bring Easwarians together through technology,
          creativity, collaboration, and meaningful campus experiences.
        </p>

        <p className="about-description">
          VOE provides a platform where students can express their ideas,
          explore their interests, develop new skills, and work together
          to create an active and connected campus community.
        </p>
      </div>

      {/* ========================= CORE VALUES ========================= */}
      <div className="about-values">
        {valueCards.map((card) => (
          <div className="about-value-card" key={card.num}>
            <span>{card.num}</span>
            <div className="card-icon">{card.icon}</div>
            <h2>{card.title}</h2>
            <p>{card.desc}</p>
            <button
              className="card-arrow"
              aria-label={`Explore VOE activities related to ${card.title}`}
              onClick={() => document.getElementById("about-activities")?.scrollIntoView({ behavior: "smooth" })}
            >
              →
            </button>
          </div>
        ))}
      </div>

      {/* ========================= WHAT WE DO ========================= */}
      <div className="about-activities" id="about-activities">
        <div className="activities-heading">
          <p>WHAT WE DO</p>
          <h2>
            Turning Ideas Into
            <span> Experiences.</span>
          </h2>
        </div>

        <div className="activities-grid">
          {activities.map((a) => (
            <div className="activity" key={a.num}>
              <span>{a.num}</span>
              <h3>{a.title}</h3>
              <p>{a.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ========================= WHY VOE ========================= */}
      <div className="why-voe">
        <p className="about-label">WHY VOE?</p>

        <h2>
          More Than A Club.
          <br />
          <span>A Community Of Voices.</span>
        </h2>

        <p>
          VOE gives every Easwarian a space to learn,
          collaborate, experiment, contribute, and make
          their voice heard beyond the classroom.
        </p>
      </div>

    </section>
  );
}

export default About;
