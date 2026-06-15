"use client";

import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { Subject, CodeExercise as Ex, ExercisePart } from "@/content/types";
import { runPython } from "@/lib/pyodide";
import { getProgress, markCompleted, updateMastery } from "@/lib/progress";

function normalise(s: string) {
  return s
    .split("\n")
    .map((l) => l.replace(/\s+$/, ""))
    .join("\n")
    .trim();
}

function tailMatches(stdout: string, expected: string) {
  const outLines = normalise(stdout).split("\n").filter(Boolean);
  const expLines = normalise(expected).split("\n").filter(Boolean);
  const tail = outLines.slice(-expLines.length).join("\n");
  return tail === expLines.join("\n");
}

function PartCard({
  slug,
  part,
  priorSolutions,
  unlocked,
  alreadyDone,
  onSolved,
  onProgress, // Added onProgress here
}: {
  slug: string;
  part: ExercisePart;
  priorSolutions: string[];
  unlocked: boolean;
  alreadyDone: boolean;
  onSolved: (partId: string) => void;
  onProgress?: () => void; // Added type definition
}) {
  const [code, setCode] = useState(part.starterCode);
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState<"idle" | "pass" | "fail">("idle");
  const [hintsShown, setHintsShown] = useState(0);
  const [gaveUp, setGaveUp] = useState(false);
  const [solved, setSolved] = useState(alreadyDone);

  async function handleRun() {
    setRunning(true);
    setOutput("Running…");
    const fullCode = [...priorSolutions, code].join("\n");
    const { stdout, error } = await runPython(fullCode);

    if (error) {
      setOutput(`${stdout}\n⚠️ ${error}`);
      setStatus("fail");
      await updateMastery(slug, -1); // Penalty for crashing
      onProgress?.();
    } else {
      setOutput(stdout || "(no output)");
      const pass = tailMatches(stdout, part.expectedStdout);
      setStatus(pass ? "pass" : "fail");
      
      if (!pass) {
        await updateMastery(slug, -1); // Penalty for failing logic check
        onProgress?.();
      }

      if (pass && !solved) {
        await updateMastery(slug, 15); // BIG REWARD for passing code
        await markCompleted(slug, "exercise", part.id);
        setSolved(true);
        onSolved(part.id);
      }
    }
    setRunning(false);
  }

  if (!unlocked) {
    return (
      <div className="part-card part-locked">
        <div className="part-head">
          <span className="part-letter">{part.label}</span>
          <span className="part-locked-label">
            Complete the previous part to unlock
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="part-card">
      <div className="part-head">
        <span className={`part-letter ${solved ? "part-letter-done" : ""}`}>
          {solved ? "✓" : part.label}
        </span>
        <p className="part-prompt">{part.prompt}</p>
      </div>

      <div className="ex-editor">
        <Editor
          height="200px"
          defaultLanguage="python"
          theme="vs-dark"
          value={code}
          onChange={(v) => setCode(v ?? "")}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "JetBrains Mono, monospace",
            scrollBeyondLastLine: false,
            padding: { top: 12 },
            lineNumbers: "off",
          }}
        />
      </div>

      <div className="ex-controls">
        <button className="ex-btn ex-btn-run" onClick={handleRun} disabled={running}>
          {running ? "Running…" : "▶ Run & check"}
        </button>
        <button
          className="ex-btn"
          onClick={async () => {
            setHintsShown((h) => Math.min(h + 1, part.hints.length));
            await updateMastery(slug, -2); // Penalty for requesting a hint
            onProgress?.();
          }}
          disabled={hintsShown >= part.hints.length}
        >
          Hint ({hintsShown}/{part.hints.length})
        </button>
        <button
          className="ex-btn"
          onClick={() => {
            setGaveUp(true);
            setCode(part.solution);
          }}
          disabled={gaveUp || solved}
        >
          Show solution
        </button>
      </div>

      {hintsShown > 0 && (
        <div className="ex-hints">
          {part.hints.slice(0, hintsShown).map((h, i) => (
            <div key={i} className="ex-hint">
              <strong>Hint {i + 1}:</strong> {h}
            </div>
          ))}
        </div>
      )}

      {output && (
        <div className={`ex-output ex-output-${status}`}>
          <div className="ex-output-head">
            {status === "pass" ? "✓ Correct" : "Output"}
          </div>
          <pre>{output}</pre>
        </div>
      )}

      {status === "fail" && (
        <div className="ex-result ex-result-info">
          Not matching yet. Expected this part to print:{" "}
          <code>{part.expectedStdout}</code>
        </div>
      )}
    </div>
  );
}

function ExerciseBlock({
  slug,
  ex,
  done,
  onSolved,
  onProgress, // Added onProgress here
}: {
  slug: string;
  ex: Ex;
  done: string[];
  onSolved: (id: string) => void;
  onProgress?: () => void; // Added type definition
}) {
  function isUnlocked(i: number) {
    if (i === 0) return true;
    return done.includes(ex.parts[i - 1].id);
  }

  return (
    <div className="ex-block">
      <h3 className="ex-block-title">{ex.title}</h3>
      <p className="ex-block-intro">{ex.intro}</p>
      {ex.parts.map((part, i) => (
        <PartCard
          key={part.id}
          slug={slug}
          part={part}
          priorSolutions={ex.parts.slice(0, i).map((p) => p.solution)}
          unlocked={isUnlocked(i)}
          alreadyDone={done.includes(part.id)}
          onSolved={onSolved}
          onProgress={onProgress} // Passed down to PartCard
        />
      ))}
    </div>
  );
}

export default function CodeExercises({
  subject,
  embedded = false,
  onProgress,
}: {
  subject: Subject;
  embedded?: boolean;
  onProgress?: () => void;
}) {
  const [done, setDone] = useState<string[]>([]);

  useEffect(() => {
    async function loadData() {
      const data = await getProgress(subject.slug);
      setDone(data.completed_exercises);
    }
    loadData();
  }, [subject.slug]);

  async function handleSolved() {
    const data = await getProgress(subject.slug);
    setDone(data.completed_exercises);
    onProgress?.();
  }
  
  const totalParts = subject.exercises.reduce((n, e) => n + e.parts.length, 0);
  const doneParts = subject.exercises
    .flatMap((e) => e.parts)
    .filter((p) => done.includes(p.id)).length;

  const body = (
    <>
      {subject.exercises.map((ex) => (
        <ExerciseBlock
          key={ex.id}
          slug={subject.slug}
          ex={ex}
          done={done}
          onSolved={handleSolved}
          onProgress={onProgress} // Passed down to ExerciseBlock
        />
      ))}
    </>
  );

  if (embedded) {
    return (
      <main className="reader-main">
        <div className="reader-col">
          <div className="reader-badge">Coding Practice</div>
          <h2 className="reader-title">Code It Out</h2>
          <div className="reader-rule" />
          <p className="quiz-score-line">
            {doneParts} of {totalParts} steps solved
          </p>
          {body}
        </div>
      </main>
    );
  }

  return (
    <div className="reader-root">
      <aside className="reader-rail">
        <div className="reader-rail-inner">
          <div className="reader-eyebrow">Practice</div>
          <h1 className="reader-subject">
            {subject.title}
          </h1>
          <p className="reader-blurb">
            Build the solution step by step. Each part is checked on its own and
            unlocks the next.
          </p>
          <div className="reader-progress">
            <div className="reader-progress-track">
              <div
                className="reader-progress-fill"
                style={{ width: `${(doneParts / totalParts) * 100}%` }}
              />
            </div>
            <div className="reader-progress-label">
              {doneParts} / {totalParts} completed
            </div>
          </div>
        </div>
      </aside>
      <main className="reader-main">
        <div className="reader-col">{body}</div>
      </main>
    </div>
  );
}