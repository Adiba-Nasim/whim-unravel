import { useState, useEffect, useRef } from "react";
import HomeScreen from "./components/HomeScreen";
import QuizScreen from "./components/QuizScreen";
import RitualScreen from "./components/RitualScreen";
import ResultScreen from "./components/ResultScreen";
import { QUESTIONS } from "./constants/questions";
import { getRecommendation } from "./utils/recommendation";
import { fetchOracleDialogue } from "./utils/fetchOracle";
import {MusicPlayer} from "./components/MusicPlayer";


export default function App() {
  const [screen, setScreen] = useState("home");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [recommendation, setRecommendation] = useState(null);
  const [oracleText, setOracleText] = useState("");
  const [animKey, setAnimKey] = useState(0);
  const [ready, setReady] = useState(false);

  const visibleQuestions = QUESTIONS.filter((q) => {
    if (!q.showIf) return true;
    return q.showIf(answers);
  });

  const currentQuestion = visibleQuestions[questionIndex];
  const progress = (questionIndex / visibleQuestions.length) * 100;

  async function handleChoice(questionId, value) {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    if (questionIndex < visibleQuestions.length - 1) {
      setAnimKey((k) => k + 1);
      setQuestionIndex((i) => i + 1);
    } else {
      setScreen("ritual");
      setReady(false);

      const rec = await getRecommendation(newAnswers);
      setRecommendation(rec);

      const dialogue = await fetchOracleDialogue(newAnswers, rec);
      setOracleText(dialogue);

      setReady(true);
    }
  }

  function handleReveal() {
    if (ready) {
      setScreen("result");
    }
  }

  function restart() {
    setScreen("home");
    setQuestionIndex(0);
    setAnswers({});
    setRecommendation(null);
    setOracleText("");
    setAnimKey(0);
    setReady(false);
  }

  return (
    <div className="oracle-app">
      <MusicPlayer />
      {screen === "home" && <HomeScreen onStart={() => setScreen("quiz")} />}
      {screen === "quiz" && currentQuestion && (
        <QuizScreen
          question={currentQuestion}
          progress={progress}
          animKey={animKey}
          onChoice={handleChoice}
        />
      )}
      {screen === "ritual" && (
        <RitualScreen onReveal={handleReveal} ready={ready} />
      )}
      {screen === "result" && recommendation && (
        <ResultScreen
          recommendation={recommendation}
          oracleText={oracleText}
          onRestart={restart}
        />
      )}
    </div>
  );
}