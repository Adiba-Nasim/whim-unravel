import { useEffect, useRef, useState } from "react";

export function MusicPlayer() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const hasStarted = useRef(false);

  // Volume + loop-at-40s
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

  // ── Mobile autoplay fix ──────────────────────────────────────────────────────
  // Rules:
  //  1. audio.play() MUST be called synchronously inside the user-gesture handler.
  //  2. Never await or defer it — that breaks the gesture context on iOS/Android.
  //  3. Use `capture: true` so we intercept the event before React's synthetic
  //     layer, which can sometimes delay the callback out of the gesture window.
  //  4. Attach directly to `document` (not `window`) — more reliable on iOS Safari.
  useEffect(() => {
    const audio = audioRef.current;

    const startAudio = () => {
      if (hasStarted.current) return;
      hasStarted.current = true;

      // Synchronous play — do NOT move this into a .then() or setTimeout
      const promise = audio.play();

      // .then() is only for updating UI state, never for triggering play
      if (promise !== undefined) {
        promise
          .then(() => setPlaying(true))
          .catch(() => {
            // Playback was rejected (e.g. user never interacted yet on a fresh
            // page load). Reset so the next gesture can retry.
            hasStarted.current = false;
          });
      }
    };

    const events = ["click", "touchend", "keydown"];

    // capture:true → fires before bubbling, closer to the raw gesture
    events.forEach((e) =>
      document.addEventListener(e, startAudio, { once: true, capture: true })
    );

    return () =>
      events.forEach((e) =>
        document.removeEventListener(e, startAudio, { capture: true })
      );
  }, []);

  // ── Manual toggle ────────────────────────────────────────────────────────────
  const toggle = () => {
    const audio = audioRef.current;
    if (audio.paused) {
      // Also synchronous — no await
      const promise = audio.play();
      if (promise !== undefined) {
        promise.then(() => setPlaying(true)).catch(() => { });
      }
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/oracle-theme.mp3" preload="auto" />
      <button className="music-btn" onClick={toggle} title="Toggle music">
        {playing ? "♫" : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="deep crimson" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
          </svg>
        )}
      </button>
    </>
  );
}