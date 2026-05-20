import "../styles/home.css";
import "../styles/global.css";

const desktopBgStyle = {
  backgroundImage: `url('/homepage.jpg')`,
  backgroundSize: "cover",
  backgroundPosition: "center center",
  backgroundRepeat: "no-repeat",
  backgroundColor: "#0a0404",
};

const mobileBgStyle = {
  backgroundImage: `url('/homepage.jpg')`,
  backgroundSize: "cover",
  backgroundPosition: "center top",
  backgroundRepeat: "no-repeat",
};

const CornerSVG = () => (
  <span style={{ fontSize: 16, color: "var(--crimson)", opacity: 0.5, lineHeight: 1 }}>✦</span>
);

export default function HomeScreen({ onStart }) {
  return (
    <div className="home-screen">

      {/* Stage frame */}
      <div className="stage-frame" />

      {/* Scallop bar */}
      <div className="scallop-bar" />

      {/* Mobile bg — CSS hides this on desktop */}
      <div className="home-bg-mobile" style={mobileBgStyle} />

      {/* Desktop bg — CSS hides this on mobile */}
      <div className="home-bg-desktop" style={desktopBgStyle} />

      <div className="home-card-panel">
        <div className="book-container">
          <div className="book-spine" />
          <div className="book-page">

            <div className="corner-ornament tl"><CornerSVG /></div>
            <div className="corner-ornament tr"><CornerSVG /></div>
            <div className="corner-ornament bl"><CornerSVG /></div>
            <div className="corner-ornament br"><CornerSVG /></div>

            <p className="home-eyebrow">Vol. I &nbsp;—&nbsp; The Media Oracle</p>

            <h1 className="home-title">
              What Will You<br /><em>Consume</em> Tonight?
            </h1>

            <div className="home-rule" />

            <p className="home-subtitle">
              You do not yet know what you are looking for.<br />
              Answer seven questions. The Oracle will find it for you.
            </p>

            <button className="dive-btn" onClick={onStart}>
              Dive In
            </button>

            <div className="home-footer">
              <span className="home-footer-item">Movies</span>
              <span className="home-footer-item">Series</span>
              <span className="home-footer-item">Anime</span>
              <span className="home-footer-item">Books</span>
              <span className="home-footer-item">Manga</span>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}