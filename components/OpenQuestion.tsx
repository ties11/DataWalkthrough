"use client";

import { useState } from "react";

interface OpenQuestionProps {
  question: string;
  sampleAnswer: string;
  /** Keywords / synonyms that count as correct indicators */
  keywords?: string[];
  placeholder?: string;
}

type EvalState = "idle" | "submitted" | "self-correct" | "self-incorrect";

function keywordCheck(input: string, keywords: string[]): { pass: boolean; matched: string[] } {
  const lower = input.toLowerCase();
  const matched = keywords.filter((k) => lower.includes(k.toLowerCase()));
  return { pass: matched.length >= Math.max(1, Math.ceil(keywords.length * 0.4)), matched };
}

export default function OpenQuestion({
  question,
  sampleAnswer,
  keywords = [],
  placeholder = "Type your answer here…",
}: OpenQuestionProps) {
  const [input, setInput] = useState("");
  const [state, setState] = useState<EvalState>("idle");
  const [kwResult, setKwResult] = useState<{ pass: boolean; matched: string[] } | null>(null);

  function submit() {
    if (!input.trim()) return;
    const result = keywords.length ? keywordCheck(input, keywords) : null;
    setKwResult(result);
    setState("submitted");
  }

  function reset() {
    setInput("");
    setState("idle");
    setKwResult(null);
  }

  return (
    <div className="oq">
      {/* Question */}
      <div className="oq-question-label">Open Question</div>
      <p className="oq-question">{question}</p>

      {/* Answer textarea */}
      <textarea
        className={`oq-textarea ${state !== "idle" ? "oq-textarea-submitted" : ""}`}
        rows={5}
        placeholder={placeholder}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={state !== "idle"}
      />

      {/* Submit */}
      {state === "idle" && (
        <button className="oq-submit" onClick={submit} disabled={!input.trim()}>
          Submit answer
        </button>
      )}

      {/* After submission: show sample answer + auto eval */}
      {state !== "idle" && (
        <>
          {/* Keyword-based suggestion */}
          {kwResult && (
            <div className={`oq-kw-result oq-kw-${kwResult.pass ? "pass" : "miss"}`}>
              {kwResult.pass ? (
                <>
                  <span className="oq-kw-icon">✓</span>
                  <span>
                    Looks good — your answer contains key concepts:{" "}
                    <strong>{kwResult.matched.join(", ")}</strong>.
                  </span>
                </>
              ) : (
                <>
                  <span className="oq-kw-icon">△</span>
                  <span>
                    Your answer may be incomplete. Try including:{" "}
                    <strong>{keywords.filter((k) => !kwResult.matched.includes(k)).join(", ")}</strong>.
                  </span>
                </>
              )}
            </div>
          )}

          {/* Sample answer reveal */}
          <div className="oq-sample">
            <div className="oq-sample-label">Sample answer</div>
            <p className="oq-sample-text">{sampleAnswer}</p>
          </div>

          {/* Self-evaluation (only before they've chosen) */}
          {state === "submitted" && (
            <div className="oq-self-eval">
              <div className="oq-self-label">How did you do?</div>
              <div className="oq-self-btns">
                <button
                  className="oq-self-btn oq-self-correct"
                  onClick={() => setState("self-correct")}
                >
                  ✓ My answer matches
                </button>
                <button
                  className="oq-self-btn oq-self-incorrect"
                  onClick={() => setState("self-incorrect")}
                >
                  ✗ My answer is incorrect
                </button>
              </div>
            </div>
          )}

          {/* Outcome feedback */}
          {state === "self-correct" && (
            <div className="oq-outcome oq-outcome-correct">
              Great — understanding confirmed. Move on when ready.
            </div>
          )}
          {state === "self-incorrect" && (
            <div className="oq-outcome oq-outcome-incorrect">
              No problem — re-read the sample answer carefully and try rephrasing it in your own words.
            </div>
          )}

          {/* Try again */}
          {(state === "self-correct" || state === "self-incorrect") && (
            <button className="oq-retry" onClick={reset}>Try again</button>
          )}
        </>
      )}
    </div>
  );
}
