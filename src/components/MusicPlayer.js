import { useEffect, useRef, useState } from "react";

export function MusicPlayer() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const hasStarted = useRef(false);

  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = 0.35;

    const handleTimeUpdate = () => {
      if (audio.currentTime >= 40) {
        audio.currentTime = 0;
        audio.play();
      }
    };
    audio.addEventListener("timeupdate", handleTimeUpdate);
    return () => audio.removeEventListener("timeupdate", handleTimeUpdate);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;

    const startAudio = () => {
      if (hasStarted.current) return;
      hasStarted.current = true;
      audio.play().then(() => setPlaying(true)).catch(() => {});
    };

    const events = ["click", "touchstart", "keydown"];
    events.forEach(e => window.addEventListener(e, startAudio, { once: true }));
    return () => events.forEach(e => window.removeEventListener(e, startAudio));
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (audio.paused) {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/oracle-theme.mp3" />
      <button className="music-btn" onClick={toggle} title="Toggle music">
        {playing ? "♫" : "🔇"}
      </button>
    </>
  );
}