import { useCallback, useEffect, useRef, useState } from "react";
import "./VideoIntro.css";

const mediaBase = `${import.meta.env.BASE_URL}media/`;

export default function VideoIntro({ onReveal, onComplete }) {
  const videoRef = useRef(null);
  const finishing = useRef(false);
  const timer = useRef(null);
  const [exiting, setExiting] = useState(false);
  const [playing, setPlaying] = useState(false);

  const finish = useCallback(() => {
    if (finishing.current) return;
    finishing.current = true;
    onReveal();
    setExiting(true);
    timer.current = window.setTimeout(onComplete, 450);
  }, [onComplete, onReveal]);

  useEffect(() => {
    let cancelled = false;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onPreference = () => { if (media.matches) finish(); };
    const onKey = (event) => { if (event.key === "Escape") finish(); };
    const watchdog = window.setTimeout(finish, 12000);
    media.addEventListener("change", onPreference);
    window.addEventListener("keydown", onKey);
    videoRef.current?.play()?.catch(() => { if (!cancelled) finish(); });
    return () => {
      cancelled = true;
      window.clearTimeout(watchdog);
      window.clearTimeout(timer.current);
      media.removeEventListener("change", onPreference);
      window.removeEventListener("keydown", onKey);
    };
  }, [finish]);

  return (
    <section className={`video-intro${exiting ? " video-intro--exiting" : ""}`}
      aria-label="VOE introduction">
      <video ref={videoRef} className="video-intro__film" autoPlay muted playsInline
        preload="auto" poster={`${mediaBase}voe-intro-poster.webp`}
        src={`${mediaBase}voe-intro.mp4`} aria-hidden="true" tabIndex={-1}
        onPlaying={() => setPlaying(true)} onEnded={finish} onError={finish} />
      <div className="video-intro__caption" aria-hidden="true">
        <span>VOICE OF EASWARIANS</span>
        <small>YOUR VOICE. OUR CAMPUS.</small>
      </div>
      <p className="video-intro__status" role="status">{!playing && !exiting ? "Preparing the VOE experience…" : ""}</p>
      <button className="video-intro__skip" onClick={finish}>Skip intro <span aria-hidden="true">↗</span></button>
    </section>
  );
}
