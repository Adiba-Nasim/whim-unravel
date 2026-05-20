import "../styles/ritual.css";

export default function RitualScreen({ onReveal, ready }) {
  return (
    <div className="ritual-screen">
      {/* full-screen bg image */}
      <div
        className="ritual-bg"
        style={{ backgroundImage: "url(/mirror.jpg)" }}
      />
      <div className="ritual-vignette" />

      {/* glow + button centered over the figure */}
      <div className="ritual-center">
        <div className="ritual-glow" />
        <button
          className={`ritual-btn ${ready ? "ritual-btn--ready" : "ritual-btn--waiting"}`}
          onClick={onReveal}
          disabled={!ready}
        >
          {ready ? "Read My Soul" : "The Oracle Stirs..."}
        </button>
      </div>

      {/* oracle dialogue box at bottom */}
      <div
        className="ritual-dialogue"
        style={{ backgroundImage: "url(/starry-bg.webp)" }}
      >
        <div className="ritual-dialogue-speaker">
          The Oracle
          <span className="ritual-dialogue-line" />
        </div>
        <p className="ritual-dialogue-text">
          The fog does not lift on its own. It waits for those who dare to ask.
          Something stirs in the glass — a world chosen for you, and you alone.
          Are you ready to lift the veil?
        </p>
      </div>
    </div>
  );
}