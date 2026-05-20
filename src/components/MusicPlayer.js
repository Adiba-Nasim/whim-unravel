import { useEffect, useRef, useState } from "react";

export default function MusicPlayer() {
  const audioRef = useRef(null);
  const [muted, setMuted] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = 0.35;

    const handleTimeUpdate = () => {
      // Loop back to start at 40 seconds
      if (audio.currentTime >= 40) {
        audio.currentTime = 0;
        audio.play();
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    return () => audio.removeEventListener("timeupdate", handleTimeUpdate);
  }, []);

  useEffect(() => {
    if (started) return;

    const startAudio = () => {
      audioRef.current?.play().catch(() => {});
      setStarted(true);
    };

    // Auto-play on first user interaction
    const events = ["click", "touchstart", "keydown"];
    events.forEach(event => {
      window.addEventListener(event, startAudio, { once: true });
    });

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, startAudio);
      });
    };
  }, [started]);

  const toggle = () => {
    const audio = audioRef.current;
    if (audio.paused) {
      audio.play();
      setMuted(false);
    } else {
      audio.pause();
      setMuted(true);
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/oracle-theme.mp3" />
      <button className="music-btn" onClick={toggle} title="Toggle music">
        {muted ? "🔇" : "♫"}
      </button>
    </>
  );
}