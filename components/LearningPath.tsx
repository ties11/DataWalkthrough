"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SUBJECTS } from "@/content";
import { Subject } from "@/content/types";
import { getAllProgress, ProgressData } from "@/lib/progress";
import SubjectIcon from "./SubjectIcon";

const PHASE_META: Record<number, { label: string; color: string }> = {
  0: { label: "Foundations",        color: "#2ed2b6" },
  1: { label: "Core Models",        color: "#6c63ff" },
  2: { label: "Model Evaluation",   color: "#e0a127" },
  3: { label: "Unsupervised",       color: "#15a86b" },
  4: { label: "Deep Learning",      color: "#db5757" },
  5: { label: "Advanced Topics",    color: "#9fe6c4" },
  6: { label: "Capstone",           color: "#f0c060" },
};

function getPhaseCompletion(
  subjects: Subject[],
  allProgress: Record<string, ProgressData>
): { done: number; total: number; pct: number } {
  const total = subjects.reduce((s, sub) => {
    return s + (sub.quiz?.length || 0) + sub.exercises.reduce((n, e) => n + e.parts.length, 0);
  }, 0);
  const done = subjects.reduce((s, sub) => {
    const p = allProgress[sub.slug];
    if (!p) return s;
    return s + new Set(p.completed_quizzes).size + new Set(p.completed_exercises).size;
  }, 0);
  return { done, total, pct: total > 0 ? Math.min(100, Math.round((done / total) * 100)) : 0 };
}

/** Compact learning path shown inside the subject shell (horizontal strip). */
export function LearningPathStrip({ currentSlug }: { currentSlug: string }) {
  const [allProgress, setAllProgress] = useState<Record<string, ProgressData>>({});

  useEffect(() => {
    getAllProgress().then(setAllProgress);
    const handler = () => getAllProgress().then(setAllProgress);
    window.addEventListener("progress-synced", handler);
    return () => window.removeEventListener("progress-synced", handler);
  }, []);

  const phases = Array.from(new Set(SUBJECTS.map((s) => s.phase))).sort((a, b) => a - b);
  const currentPhase = SUBJECTS.find((s) => s.slug === currentSlug)?.phase ?? 0;

  return (
    <div className="lp-strip" aria-label="Learning path">
      {phases.map((ph, i) => {
        const meta = PHASE_META[ph] ?? { label: `Phase ${ph}`, color: "#2ed2b6" };
        const subs = SUBJECTS.filter((s) => s.phase === ph);
        const { pct } = getPhaseCompletion(subs, allProgress);
        const isCurrent = ph === currentPhase;
        const isPast = ph < currentPhase;

        return (
          <div key={ph} className="lp-strip-step">
            {i > 0 && (
              <div className={`lp-strip-connector ${isPast || isCurrent ? "is-active" : ""}`} />
            )}
            <div
              className={`lp-strip-node ${isCurrent ? "is-current" : ""} ${isPast && pct === 100 ? "is-done" : ""}`}
              style={isCurrent ? { borderColor: meta.color, color: meta.color } : {}}
              title={`Phase ${ph}: ${meta.label} — ${pct}%`}
            >
              <div
                className="lp-strip-fill"
                style={{ width: `${pct}%`, background: meta.color }}
              />
              <span className="lp-strip-num">{ph}</span>
            </div>
            <span
              className={`lp-strip-label ${isCurrent ? "is-current" : "is-hidden"}`}
              style={isCurrent ? { color: meta.color } : {}}
            >
              {meta.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/** Full learning path page / home section — shows phases before + after with subject nodes. */
export default function LearningPath({ highlightSlug }: { highlightSlug?: string }) {
  const [allProgress, setAllProgress] = useState<Record<string, ProgressData>>({});
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  useEffect(() => {
    getAllProgress().then(setAllProgress);
    const handler = () => getAllProgress().then(setAllProgress);
    window.addEventListener("progress-synced", handler);
    return () => window.removeEventListener("progress-synced", handler);
  }, []);

  const phases = Array.from(new Set(SUBJECTS.map((s) => s.phase))).sort((a, b) => a - b);
  const currentPhase = highlightSlug
    ? (SUBJECTS.find((s) => s.slug === highlightSlug)?.phase ?? null)
    : null;

  function getSubjectState(sub: Subject): "done" | "active" | "locked" | "unlocked" {
    const p = allProgress[sub.slug];
    const total = (sub.quiz?.length || 0) + sub.exercises.reduce((n, e) => n + e.parts.length, 0);
    const done = p ? new Set(p.completed_quizzes).size + new Set(p.completed_exercises).size : 0;
    if (total > 0 && done === total) return "done";
    if (done > 0) return "active";
    if (sub.slug === highlightSlug) return "active";
    return "unlocked";
  }

  return (
    <div className="lp-root">
      {phases.map((ph, phIdx) => {
        const meta = PHASE_META[ph] ?? { label: `Phase ${ph}`, color: "#2ed2b6" };
        const subs = SUBJECTS.filter((s) => s.phase === ph);
        const { done, total, pct } = getPhaseCompletion(subs, allProgress);
        const isCurrent = ph === currentPhase;
        const isExpanded = expanded[ph] !== false; // default open
        const isBeforeCurrent = currentPhase !== null && ph < currentPhase;
        const isAfterCurrent = currentPhase !== null && ph > currentPhase;

        return (
          <div
            key={ph}
            className={`lp-phase ${isCurrent ? "lp-phase-current" : ""} ${isBeforeCurrent ? "lp-phase-past" : ""} ${isAfterCurrent ? "lp-phase-future" : ""}`}
          >
            {/* Vertical connector line between phases */}
            {phIdx > 0 && (
              <div className="lp-vline-wrap">
                <div
                  className={`lp-vline ${isBeforeCurrent || isCurrent ? "is-active" : ""}`}
                  style={isBeforeCurrent || isCurrent ? { background: meta.color } : {}}
                />
              </div>
            )}

            {/* Phase header */}
            <button
              className="lp-phase-head"
              onClick={() => setExpanded((e) => ({ ...e, [ph]: !isExpanded }))}
              aria-expanded={isExpanded}
            >
              {/* Phase ring */}
              <div className="lp-phase-ring-wrap">
                <svg className="lp-phase-ring" viewBox="0 0 40 40">
                  <circle cx="20" cy="20" r="17" className="lp-ring-track" />
                  <circle
                    cx="20" cy="20" r="17"
                    className="lp-ring-fill"
                    style={{
                      stroke: meta.color,
                      strokeDasharray: `${(pct / 100) * 106.8} 106.8`,
                    }}
                  />
                </svg>
                <span className="lp-phase-ring-num" style={pct > 0 ? { color: meta.color } : {}}>
                  {ph}
                </span>
              </div>

              <div className="lp-phase-info">
                <div className="lp-phase-label-row">
                  <span className="lp-phase-tag" style={{ color: meta.color, borderColor: meta.color }}>
                    Phase {ph}
                  </span>
                  {isCurrent && (
                    <span className="lp-phase-here">← you are here</span>
                  )}
                </div>
                <span className="lp-phase-name">{meta.label}</span>
                <span className="lp-phase-stat">{done}/{total} completed · {pct}%</span>
              </div>

              <div className="lp-phase-bar-wrap">
                <div className="lp-phase-bar-track">
                  <div
                    className="lp-phase-bar-fill"
                    style={{ width: `${pct}%`, background: meta.color }}
                  />
                </div>
              </div>

              <span className={`lp-chevron ${isExpanded ? "" : "is-collapsed"}`}>▾</span>
            </button>

            {/* Subject nodes */}
            {isExpanded && (
              <div className="lp-subjects">
                {subs.map((sub, si) => {
                  const state = getSubjectState(sub);
                  return (
                    <div key={sub.slug} className="lp-subject-row">
                      {si < subs.length - 1 && (
                        <div
                          className={`lp-subject-vline ${state === "done" ? "is-done" : ""}`}
                          style={state === "done" ? { background: meta.color } : {}}
                        />
                      )}
                      <div className={`lp-subject-dot ${state}`}
                        style={state !== "locked" ? { borderColor: meta.color } : {}}
                      >
                        {state === "done" && (
                          <svg viewBox="0 0 12 12" width="10" height="10">
                            <path d="M2 6 L5 9 L10 3" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <Link
                        href={`/subjects/${sub.slug}`}
                        className={`lp-subject-card ${sub.slug === highlightSlug ? "is-current" : ""} ${state}`}
                        style={sub.slug === highlightSlug ? { borderColor: meta.color } : {}}
                      >
                        <span className="lp-subject-icon" style={state !== "locked" ? { color: meta.color } : {}}>
                          <SubjectIcon name={sub.icon} size={20} />
                        </span>
                        <span className="lp-subject-title">{sub.title}</span>
                        <span className={`lp-subject-badge ${state}`}
                          style={state === "done" ? { background: meta.color, color: "#0d0f12", borderColor: meta.color } : {}}>
                          {state === "done" ? "Done" : state === "active" ? "In progress" : "Start"}
                        </span>
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
