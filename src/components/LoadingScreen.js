import "../styles/quiz.css";

export default function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-glyph" />
      <p className="loading-text">The Oracle is reading your soul</p>
    </div>
  );
}