import "../styles/quiz.css";

export default function QuizScreen({ question, progress, animKey, onChoice }) {
  return (
    <div className="quiz-screen">
      {/* Background image — left half on desktop */}
      <div
        className="quiz-bg"
        style={{ backgroundImage: "url(/quiz-bg.webp)" }}
      ></div>

      {/* Dark overlay texture */}
      <div className="quiz-bg-texture"></div>

      {/* Progress bar */}
      <div className="progress-strip">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Question floats in the upper / left area */}
      <div className="question-area">
        <div className="question-text-wrap" key={animKey}>
          <p className="speaker-label">The Oracle speaks</p>
          <p className="question-text">{question.text}</p>
        </div>
      </div>

      {/* Dialogue box — bottom on mobile, right half on desktop */}
      <div
        className="dialogue-box"
        style={{ backgroundImage: "url(/starry-bg.webp)" }}
      >
        <div className="choices-grid" key={`choices-${animKey}`}>
          {question.choices.map((choice) => (
            <button
              key={choice.value}
              className="choice-btn"
              onClick={() => onChoice(question.id, choice.value)}
            >
              {choice.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}