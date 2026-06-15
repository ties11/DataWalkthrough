"use client";

import { useEffect, useState } from "react";
import { Subject } from "@/content/types";
import { getProgress, markCompleted, resetSubjectQuiz, updateMastery } from "@/lib/progress";

export default function Quiz({
  subject,
  embedded = false,
  onProgress,
}: {
  subject: Subject;
  embedded?: boolean;
  onProgress?: () => void;
}) {
  const [selected, setSelected] = useState<Record<string, number>>({});
  const [mistakes, setMistakes] = useState<Record<string, number>>({});
  const [done, setDone] = useState<string[]>([]);
  const [isResetting, setIsResetting] = useState(false);
  const [retakes, setRetakes] = useState(0);

  useEffect(() => {
    async function loadData() {
      const p = await getProgress(subject.slug);
      setDone(p.completed_quizzes);
      setRetakes(p.quiz_retakes || 0);

      const previouslyDone: Record<string, number> = {};
      subject.quiz.forEach(q => {
        if (p.completed_quizzes.includes(q.id)) {
          previouslyDone[q.id] = q.correctIndex;
        }
      });
      setSelected(prev => ({ ...prev, ...previouslyDone }));
    }
    loadData();
  }, [subject.slug]);

  // Cycle through the question bank based on retake count
  const itemsPerPage = 5;
  const startIndex = (retakes * itemsPerPage) % subject.quiz.length;
  // If the bank is short, it wraps around safely
  const activeQuestions = subject.quiz.slice(startIndex, startIndex + itemsPerPage).length === itemsPerPage 
    ? subject.quiz.slice(startIndex, startIndex + itemsPerPage)
    : subject.quiz.slice(-itemsPerPage); // Fallback to last 5 if maths wrap weirdly

  async function choose(qId: string, optIndex: number, correctIndex: number) {
    if (selected[qId] !== undefined) return;
    setSelected((s) => ({ ...s, [qId]: optIndex }));
    
    if (optIndex === correctIndex) {
      const mistakesMade = mistakes[qId] || 0;
      const points = mistakesMade === 0 ? 5 : 2; // +5 for first try, +2 if they needed a second guess
      
      await updateMastery(subject.slug, points);
      const p = await markCompleted(subject.slug, 'quiz', qId);
      
      setDone(p.completed_quizzes);
      onProgress?.();
    } else {
      setMistakes((m) => ({ ...m, [qId]: (m[qId] || 0) + 1 }));
      await updateMastery(subject.slug, -1); // -1 point penalty
      onProgress?.(); 
    }
  }

  async function handleReset() {
    setIsResetting(true);
    const p = await resetSubjectQuiz(subject.slug);
    setSelected({}); 
    setDone([]);     
    setMistakes({});
    setRetakes(p.quiz_retakes);
    setIsResetting(false);
    onProgress?.();  
  }

  const correctCount = activeQuestions.filter((q) => done.includes(q.id)).length;

  const questionList = (
    <>
      {activeQuestions.map((q, qi) => {
        const pick = selected[q.id];
        const answered = pick !== undefined;
        const isCorrectlyAnswered = done.includes(q.id);

        return (
          <div key={q.id} className="quiz-q">
            <div className="quiz-q-num flex justify-between items-center">
              <span>Question {qi + 1}</span>
              {isCorrectlyAnswered && (
                <span className="text-accent text-[10px] uppercase tracking-widest flex items-center gap-1 font-mono">
                  ✓ Correct
                </span>
              )}
            </div>
            <div className="quiz-q-text">{q.question}</div>
            <div className="quiz-options">
              {q.options.map((opt, oi) => {
                let cls = "quiz-opt";
                if (answered) {
                  if (oi === q.correctIndex) cls += " quiz-opt-correct";
                  else if (oi === pick) cls += " quiz-opt-wrong";
                  else cls += " quiz-opt-muted";
                }
                return (
                  <button
                    key={oi}
                    className={cls}
                    onClick={() => choose(q.id, oi, q.correctIndex)}
                    disabled={answered}
                  >
                    <span className="quiz-opt-letter">{String.fromCharCode(65 + oi)}</span>
                    {opt}
                  </button>
                );
              })}
            </div>
            {answered && (
              <div className={`quiz-explain ${pick === q.correctIndex ? "quiz-explain-right" : "quiz-explain-wrong"}`}>
                <strong>{pick === q.correctIndex ? "Correct. " : "Not quite. "}</strong>
                {q.explanation}
              </div>
            )}
          </div>
        );
      })}

      {done.length === activeQuestions.length && (
        <div className="mt-12 pt-8 border-t border-border flex justify-center">
          <button
            onClick={handleReset}
            disabled={isResetting}
            className="px-6 py-3 text-sm font-mono text-foreground/60 hover:text-foreground border border-border hover:border-foreground/50 rounded transition-colors disabled:opacity-50"
          >
            {isResetting ? "Generating..." : "↺ Retake with new questions"}
          </button>
        </div>
      )}
    </>
  );

  const header = (
    <>
      <div className="reader-badge">Quiz</div>
      <h2 className="reader-title">Test Your Understanding</h2>
      <div className="reader-rule" />
      <p className="quiz-score-line">
        {correctCount} of {activeQuestions.length} correct
      </p>
    </>
  );

  if (embedded) return <main className="reader-main"><div className="reader-col">{header}{questionList}</div></main>;

  return (
    <div className="reader-root">
      <aside className="reader-rail">
        <div className="reader-rail-inner">
          <div className="reader-eyebrow">Theory Check</div>
          <h1 className="reader-subject"><span className="reader-subject-icon">{subject.icon}</span>{subject.title}</h1>
          <p className="reader-blurb">Answer each question to test your understanding. Correct answers and fewer mistakes improve your Mastery Score.</p>
          <div className="reader-progress">
            <div className="reader-progress-track">
              <div className="reader-progress-fill transition-all duration-500" style={{ width: `${(correctCount / activeQuestions.length) * 100}%` }} />
            </div>
            <div className="reader-progress-label">{correctCount} of {activeQuestions.length} correct</div>
          </div>
        </div>
      </aside>
      <main className="reader-main"><div className="reader-col"><div className="reader-badge">Quiz</div><h2 className="reader-title">Test Your Understanding</h2><div className="reader-rule" />{questionList}</div></main>
    </div>
  );
}