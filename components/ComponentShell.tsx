"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Subject } from "@/content/types";
import { SUBJECTS } from "@/content";
import { getAllProgress, ProgressData } from "@/lib/progress"; 
import TheoryReader from "./TheoryReader";
import Quiz from "./Quiz";
import CodeExercises from "./CodeExercise";
import CheatSheet from "./CheatSheet";
import SubjectIcon from "./SubjectIcon";
import { LearningPathStrip } from "./LearningPath";
import { useAuth } from "@/lib/auth";

type Tab = "theory" | "quiz" | "practice" | "cheatsheet";

const TABS: { id: Tab; label: string }[] = [
  { id: "theory", label: "Theory" },
  { id: "quiz", label: "Quiz" },
  { id: "practice", label: "Practice" },
  { id: "cheatsheet", label: "Cheat Sheet" },
];

const PHASE_LABELS: Record<number, string> = {
  0: "Foundations",
  1: "Core Models",
  2: "Model Evaluation",
  3: "Unsupervised Learning",
  4: "Deep Learning",
  5: "Advanced Topics",
  6: "Capstone",
};

export default function SubjectShell({ subject }: { subject: Subject }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("theory");
  const [tick, setTick] = useState(0);
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  
  const [allProgress, setAllProgress] = useState<Record<string, ProgressData>>({});

  useEffect(() => {
    async function fetchAll() {
      const p = await getAllProgress();
      setAllProgress(p);
    }
    fetchAll();
  }, [subject.slug, tick]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function refreshProgress() {
    setTick((t) => t + 1);
  }

  const idx = SUBJECTS.findIndex((s) => s.slug === subject.slug);
  const prev = idx > 0 ? SUBJECTS[idx - 1] : null;
  const next = idx < SUBJECTS.length - 1 ? SUBJECTS[idx + 1] : null;

  const phases = Array.from(new Set(SUBJECTS.map((s) => s.phase))).sort(
    (a, b) => a - b
  );

  // --- CALCULATE PROGRESS TIERS ---

  // Helper: Count total items (quizzes + exercise parts) in a subject
  const getTotal = (s: Subject) => {
    const qCount = s.quiz?.length || 0;
    const eCount = s.exercises?.reduce((n, e) => n + (e.parts?.length || 0), 0) || 0;
    return qCount + eCount;
  };

  // Helper: Count unique completed items (Set removes duplicates to fix % errors)
  const getDone = (slug: string) => {
    const p = allProgress[slug];
    if (!p) return 0;
    const qDone = Array.isArray(p.completed_quizzes) ? new Set(p.completed_quizzes).size : 0;
    const eDone = Array.isArray(p.completed_exercises) ? new Set(p.completed_exercises).size : 0;
    return qDone + eDone;
  };

  // Phase Progress
  const phaseSubjects = SUBJECTS.filter(s => s.phase === subject.phase);
  const phaseTotal = phaseSubjects.reduce((sum, s) => sum + getTotal(s), 0);
  const phaseDone = phaseSubjects.reduce((sum, s) => sum + getDone(s.slug), 0);
  const phasePct = phaseTotal > 0 ? Math.min(100, Math.round((phaseDone / phaseTotal) * 100)) : 0;

  // Program Progress
  const progTotal = SUBJECTS.reduce((sum, s) => sum + getTotal(s), 0);
  const progDone = SUBJECTS.reduce((sum, s) => sum + getDone(s.slug), 0);
  const progPct = progTotal > 0 ? Math.min(100, Math.round((progDone / progTotal) * 100)) : 0;

  return (
    <div className="shell">
      <header className="shell-bar">
        <div className="shell-bar-top">
          <Link href="/" className="shell-back">
            ← All subjects
          </Link>

          <div className="shell-switch">
            <button
              className="shell-arrow"
              disabled={!prev}
              onClick={() => prev && router.push(`/subjects/${prev.slug}`)}
              title={prev ? `Previous: ${prev.title}` : "First subject"}
            >
              ‹
            </button>

            <div className="shell-picker" ref={pickerRef}>
              <button
                className="shell-id shell-id-btn"
                onClick={() => setPickerOpen((o) => !o)}
                aria-expanded={pickerOpen}
              >
                <span className="shell-icon">
                  <SubjectIcon name={subject.icon} size={22} />
                </span>
                {subject.title}
                <span className={`shell-caret ${pickerOpen ? "is-open" : ""}`}>
                  ▾
                </span>
              </button>

              {pickerOpen && (
                <div className="shell-menu">
                  {phases.map((ph) => (
                    <div key={ph} className="shell-menu-group">
                      <div className="shell-menu-phase">
                        Phase {ph} · {PHASE_LABELS[ph] ?? ""}
                      </div>
                      {SUBJECTS.filter((s) => s.phase === ph).map((s) => {
                        
                        // Calculate specific status for this subject in the dropdown
                        const sTotal = getTotal(s);
                        const sDone = getDone(s.slug);
                        
                        let statusText = "To go";
                        let statusCss = "opacity-30"; // Faint for untouched

                        if (sTotal > 0 && sDone === sTotal) {
                          statusText = "Completed";
                          statusCss = "text-accent opacity-100"; // Bright green for done
                        } else if (sDone > 0) {
                          statusText = "Busy";
                          statusCss = "opacity-70"; // Medium visibility for in-progress
                        }

                        return (
                          <button
                            key={s.slug}
                            className={`shell-menu-item flex justify-between items-center w-full ${
                              s.slug === subject.slug ? "is-current" : ""
                            }`}
                            onClick={() => {
                              setPickerOpen(false);
                              if (s.slug !== subject.slug)
                                router.push(`/subjects/${s.slug}`);
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <span className="shell-menu-icon">
                                <SubjectIcon name={s.icon} size={18} />
                              </span>
                              <span>{s.title}</span>
                            </div>
                            <span className={`text-[9px] font-mono uppercase tracking-widest ml-4 ${statusCss}`}>
                              {statusText}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              className="shell-arrow"
              disabled={!next}
              onClick={() => next && router.push(`/subjects/${next.slug}`)}
              title={next ? `Next: ${next.title}` : "Last subject"}
            >
              ›
            </button>
          </div>

          <div className="shell-progress-pair">
            <div className="shell-prog-item">
              <span className="shell-prog-label">Phase</span>
              <div className="shell-prog-track">
                <div className="shell-prog-fill" style={{ width: `${phasePct}%` }} />
              </div>
              <span className="shell-prog-pct">{phasePct}%</span>
            </div>
            <div className="shell-prog-item">
              <span className="shell-prog-label">Program</span>
              <div className="shell-prog-track">
                <div className="shell-prog-fill shell-prog-fill-accent" style={{ width: `${progPct}%` }} />
              </div>
              <span className="shell-prog-pct">{progPct}%</span>
            </div>
          </div>

          <Link href="/account" className="shell-account">
            {user
              ? (user.user_metadata?.display_name || user.email?.split("@")[0] || "Account")
              : "Sign in"}
          </Link>
        </div>

        {/* Learning path strip — visual "you are here" across phases */}
        <div className="shell-path-strip">
          <LearningPathStrip currentSlug={subject.slug} />
        </div>

        <nav className="shell-tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`shell-tab ${tab === t.id ? "shell-tab-active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      <div className="shell-body">
        {tab === "theory" && <TheoryReader subject={subject} embedded />}
        {tab === "quiz" && <Quiz subject={subject} embedded onProgress={refreshProgress} />}
        {tab === "practice" && (
          <CodeExercises subject={subject} embedded onProgress={refreshProgress} />
        )}
        {tab === "cheatsheet" && (
          <main className="reader-main">
            <CheatSheet subject={subject} />
          </main>
        )}
      </div>
    </div>
  );
}