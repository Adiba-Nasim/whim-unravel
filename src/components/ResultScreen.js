import "../styles/result.css";

function getPosterRows(item) {
  if (!item) return [];
  const rows = [];

  rows.push({ label: "Format", value: item.formatLabel || item.type });
  if (item.genre) rows.push({ label: "Genre", value: item.subgenre ? `${item.genre} — ${item.subgenre}` : item.genre });
  if (item.director) {
    const label = item.type === "Book" || item.type === "Manga" ? "Written By" : "Directed By";
    rows.push({ label, value: item.director.toUpperCase() });
  }
  if (item.durationLabel) rows.push({ label: "Runtime", value: item.durationLabel });
  rows.push({ label: "Description", value: item.description });
  if (item.cast) rows.push({ label: "Starring", value: item.cast.toUpperCase() });

  return rows;
}

export default function ResultScreen({ recommendation, oracleText, onRestart }) {
  const posterUrl = recommendation?.posterUrl || null;

  return (
    <div className="result-bg-screen">
      <div
        className="result-bg"
        style={{ backgroundImage: "url(/result-bg.jpg)" }}
      />

      <div className="result-screen">
        <p className="result-eyebrow">The Oracle has spoken</p>

        <div className="result-left">
          <div className="poster-card">
            <div className="poster-img-wrap">
              {posterUrl ? (
                <img src={posterUrl} alt={recommendation.title} className="poster-img" />
              ) : (
                <div className="poster-img-fallback">
                  <img src="/posterfallback.png" alt={recommendation.title} className="poster-img-fallback-mask" />
                  <p className="poster-img-fallback-text">{recommendation.title}</p>
                </div>
              )}
            </div>

            <div className="poster-meta">
              <div className="poster-title-row">
                <span className="poster-title">{recommendation.title}</span>
                {recommendation.year && <span className="poster-year">{recommendation.year}</span>}
              </div>

              <div className="poster-divider" />

              {getPosterRows(recommendation).map((row, i) => (
                <div className="poster-row" key={i}>
                  <span className="poster-row-label">{row.label}</span>
                  <span className="poster-row-value">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="result-right">
          <div className="oracle-result-box">
            <div className="oracle-speaker">The Oracle</div>
            <p className="oracle-dialogue">
              {oracleText || "The stars have aligned. This is your story."}
            </p>
          </div>

          <div className="result-actions">
            <button className="again-btn" onClick={onRestart}>
              Consult Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}