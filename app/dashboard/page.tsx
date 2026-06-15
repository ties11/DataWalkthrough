"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { SUBJECTS } from "@/content";
import { getAllProgress, ProgressData } from "@/lib/progress";
import { useAuth } from "@/lib/auth";
import SubjectIcon from "@/components/SubjectIcon";

const PHASE_COLORS: Record<number, string> = {
  0: "#2ed2b6", 1: "#6c63ff", 2: "#e0a127",
  3: "#15a86b", 4: "#db5757", 5: "#9fe6c4", 6: "#f0c060",
};
const PHASE_LABELS: Record<number, string> = {
  0: "Foundations", 1: "Core Models", 2: "Model Evaluation",
  3: "Unsupervised", 4: "Deep Learning", 5: "Advanced Topics", 6: "Capstone",
};

function CompletionModal({ displayName, onClose }: { displayName: string | null; onClose: () => void }) {
  return (
    <div className="complete-modal-overlay" onClick={onClose}>
      <div className="complete-modal" onClick={(e) => e.stopPropagation()}>
        <button className="complete-modal-close" onClick={onClose} aria-label="Close">✕</button>
        <div className="complete-modal-trophy">🏆</div>
        <h2 className="complete-modal-title">
          {displayName ? `Congratulations, ${displayName}!` : "You did it!"}
        </h2>
        <p className="complete-modal-body">
          You&apos;ve completed all 6 phases of the Data Science program — from probability and
          linear algebra through Transformers, recommenders, and a full end-to-end Titanic pipeline.
        </p>
        <div className="complete-modal-phases">
          {[0,1,2,3,4,5,6].map((ph) => (
            <div key={ph} className="complete-modal-phase">
              <div className="complete-modal-phase-dot" style={{ background: PHASE_COLORS[ph] }} />
              <span className="complete-modal-phase-text">Phase {ph} — {PHASE_LABELS[ph]}</span>
            </div>
          ))}
        </div>
        <div className="complete-modal-actions">
          <Link href="/complete" className="complete-modal-cta" onClick={onClose}>
            View full completion page →
          </Link>
          <button className="complete-modal-later" onClick={onClose}>
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}

const PHASE_META: Record<number, { label: string; color: string; description: string }> = {
  0: { label: "Foundations",         color: "#2ed2b6", description: "Stats, algebra, calculus, data wrangling" },
  1: { label: "Core Models",         color: "#6c63ff", description: "Regression, trees, SVMs, ensembles" },
  2: { label: "Model Evaluation",    color: "#e0a127", description: "Bias–variance, CV, classification metrics" },
  3: { label: "Unsupervised",        color: "#15a86b", description: "Clustering, PCA, DBSCAN" },
  4: { label: "Deep Learning",       color: "#db5757", description: "Neural nets, CNNs, Transformers" },
  5: { label: "Advanced Topics",     color: "#9fe6c4", description: "Time series, NLP, Recommenders" },
  6: { label: "Capstone",            color: "#f0c060", description: "End-to-end real-dataset project" },
};

function PhaseRing({ pct, color, size = 72 }: { pct: number; color: string; size?: number }) {
  const r = size / 2 - 6;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="dash-ring-svg">
      <circle cx={size / 2} cy={size / 2} r={r} className="dash-ring-track" />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        className="dash-ring-fill"
        style={{
          stroke: color,
          strokeDasharray: `${(pct / 100) * circ} ${circ}`,
          transform: `rotate(-90deg)`,
          transformOrigin: "center",
        }}
      />
    </svg>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [allProgress, setAllProgress] = useState<Record<string, ProgressData>>({});
  const [loaded, setLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const shownModal = useRef(false);

  useEffect(() => {
    getAllProgress().then((p) => { setAllProgress(p); setLoaded(true); });
    const handler = () => getAllProgress().then(setAllProgress);
    window.addEventListener("progress-synced", handler);
    return () => window.removeEventListener("progress-synced", handler);
  }, []);

  const getTotal = (slugs: string[]) =>
    slugs.reduce((s, slug) => {
      const sub = SUBJECTS.find((x) => x.slug === slug);
      if (!sub) return s;
      return s + (sub.quiz?.length || 0) + sub.exercises.reduce((n, e) => n + e.parts.length, 0);
    }, 0);

  const getDone = (slugs: string[]) =>
    slugs.reduce((s, slug) => {
      const p = allProgress[slug];
      if (!p) return s;
      return s + new Set(p.completed_quizzes).size + new Set(p.completed_exercises).size;
    }, 0);

  const phases = Array.from(new Set(SUBJECTS.map((s) => s.phase))).sort();

  const totalItems = getTotal(SUBJECTS.map((s) => s.slug));
  const totalDone = getDone(SUBJECTS.map((s) => s.slug));
  const totalPct = totalItems > 0 ? Math.round((totalDone / totalItems) * 100) : 0;
  const totalMastery = SUBJECTS.reduce((s, sub) => s + (allProgress[sub.slug]?.mastery_score || 0), 0);
  const completedSubjects = SUBJECTS.filter((sub) => {
    const total = (sub.quiz?.length || 0) + sub.exercises.reduce((n, e) => n + e.parts.length, 0);
    const done = getDone([sub.slug]);
    return total > 0 && done >= total;
  }).length;

  // Most recently active subjects (have some progress, not 100% done)
  const activeSubjects = SUBJECTS
    .filter((sub) => {
      const p = allProgress[sub.slug];
      if (!p) return false;
      const done = new Set(p.completed_quizzes).size + new Set(p.completed_exercises).size;
      const total = (sub.quiz?.length || 0) + sub.exercises.reduce((n, e) => n + e.parts.length, 0);
      return done > 0 && done < total;
    })
    .slice(0, 3);

  // Next recommended: first subject with 0 progress in the earliest phase with incomplete subjects
  const nextUp = SUBJECTS.find((sub) => {
    const p = allProgress[sub.slug];
    const done = p ? new Set(p.completed_quizzes).size + new Set(p.completed_exercises).size : 0;
    return done === 0;
  });

  const displayName = user?.user_metadata?.display_name || user?.email?.split("@")[0] || null;

  // Show modal once per session when program is complete
  useEffect(() => {
    if (loaded && totalPct === 100 && !shownModal.current) {
      const dismissed = sessionStorage.getItem("complete-modal-dismissed");
      if (!dismissed) {
        shownModal.current = true;
        setShowModal(true);
      }
    }
  }, [loaded, totalPct]);

  function closeModal() {
    setShowModal(false);
    sessionStorage.setItem("complete-modal-dismissed", "1");
  }

  return (
    <div className="dash">
      {showModal && <CompletionModal displayName={displayName} onClose={closeModal} />}
      {/* Top bar */}
      <header className="dash-bar">
        <Link href="/" className="shell-back">← All subjects</Link>
        <h1 className="dash-bar-title">Dashboard</h1>
        <Link href="/account" className="shell-account" style={{ marginLeft: "auto" }}>
          {user ? (displayName || "Account") : "Sign in"}
        </Link>
      </header>

      <div className="dash-body">
        {/* Hero stats row */}
        <div className="dash-stats-row">
          <div className="dash-stat">
            <div className="dash-stat-value">{loaded ? totalPct : "—"}%</div>
            <div className="dash-stat-label">Program complete</div>
            <div className="dash-stat-bar">
              <div className="dash-stat-bar-fill" style={{ width: `${totalPct}%` }} />
            </div>
          </div>
          <div className="dash-stat">
            <div className="dash-stat-value">{loaded ? completedSubjects : "—"}</div>
            <div className="dash-stat-label">Subjects finished</div>
            <div className="dash-stat-sub">of {SUBJECTS.length} total</div>
          </div>
          <div className="dash-stat">
            <div className="dash-stat-value">{loaded ? totalMastery.toLocaleString() : "—"}</div>
            <div className="dash-stat-label">Total mastery pts</div>
          </div>
          <div className="dash-stat">
            <div className="dash-stat-value">{loaded ? totalDone : "—"}</div>
            <div className="dash-stat-label">Items completed</div>
            <div className="dash-stat-sub">of {totalItems} total</div>
          </div>
        </div>

        <div className="dash-main">
          {/* Phase progress */}
          <section className="dash-section">
            <h2 className="dash-section-title">Phase Progress</h2>
            <div className="dash-phases">
              {phases.map((ph) => {
                const meta = PHASE_META[ph];
                const subs = SUBJECTS.filter((s) => s.phase === ph);
                const slugs = subs.map((s) => s.slug);
                const total = getTotal(slugs);
                const done = getDone(slugs);
                const pct = total > 0 ? Math.min(100, Math.round((done / total) * 100)) : 0;
                const subsDone = subs.filter((s) => {
                  const t = (s.quiz?.length || 0) + s.exercises.reduce((n, e) => n + e.parts.length, 0);
                  return t > 0 && getDone([s.slug]) >= t;
                }).length;

                return (
                  <div key={ph} className="dash-phase-card">
                    <div className="dash-phase-ring-wrap">
                      <PhaseRing pct={pct} color={meta.color} size={64} />
                      <span className="dash-phase-ring-pct" style={{ color: pct > 0 ? meta.color : undefined }}>
                        {pct}%
                      </span>
                    </div>
                    <div className="dash-phase-info">
                      <div className="dash-phase-tag" style={{ color: meta.color, borderColor: meta.color }}>
                        Phase {ph}
                      </div>
                      <div className="dash-phase-name">{meta.label}</div>
                      <div className="dash-phase-stat">{subsDone}/{subs.length} subjects · {done}/{total} items</div>
                    </div>
                    <Link href="/" className="dash-phase-action" style={{ color: meta.color }}>
                      View →
                    </Link>
                  </div>
                );
              })}
            </div>
          </section>

          <div className="dash-side">
            {/* Continue learning */}
            {activeSubjects.length > 0 && (
              <section className="dash-section">
                <h2 className="dash-section-title">Continue Learning</h2>
                <div className="dash-active-list">
                  {activeSubjects.map((sub) => {
                    const p = allProgress[sub.slug];
                    const done = p ? new Set(p.completed_quizzes).size + new Set(p.completed_exercises).size : 0;
                    const total = (sub.quiz?.length || 0) + sub.exercises.reduce((n, e) => n + e.parts.length, 0);
                    const pct = Math.round((done / total) * 100);
                    const meta = PHASE_META[sub.phase] ?? PHASE_META[0];
                    return (
                      <Link key={sub.slug} href={`/subjects/${sub.slug}`} className="dash-active-card">
                        <span className="dash-active-icon" style={{ color: meta.color }}>
                          <SubjectIcon name={sub.icon} size={24} />
                        </span>
                        <div className="dash-active-info">
                          <div className="dash-active-title">{sub.title}</div>
                          <div className="dash-active-bar">
                            <div className="dash-active-fill" style={{ width: `${pct}%`, background: meta.color }} />
                          </div>
                          <div className="dash-active-pct" style={{ color: meta.color }}>{pct}%</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Next up */}
            {nextUp && (
              <section className="dash-section">
                <h2 className="dash-section-title">Next Up</h2>
                <Link href={`/subjects/${nextUp.slug}`} className="dash-next-card">
                  <span className="dash-next-icon" style={{ color: PHASE_META[nextUp.phase]?.color }}>
                    <SubjectIcon name={nextUp.icon} size={28} />
                  </span>
                  <div>
                    <div className="dash-next-phase">Phase {nextUp.phase} · {PHASE_META[nextUp.phase]?.label}</div>
                    <div className="dash-next-title">{nextUp.title}</div>
                    <div className="dash-next-blurb">{nextUp.blurb}</div>
                  </div>
                  <span className="dash-next-arrow">→</span>
                </Link>
              </section>
            )}

            {/* Greeting / progress nudge */}
            <section className="dash-section dash-greeting">
              {loaded && totalPct === 0 ? (
                <>
                  <div className="dash-greeting-emoji">👋</div>
                  <p>Welcome{displayName ? `, ${displayName}` : ""}! Pick a subject below to start your journey through data science.</p>
                  <Link href="/" className="dash-cta">Browse subjects →</Link>
                </>
              ) : loaded && totalPct === 100 ? (
                <>
                  <div className="dash-greeting-emoji">🏆</div>
                  <p>You&apos;ve completed the entire program{displayName ? `, ${displayName}` : ""}! Impressive dedication.</p>
                  <Link href="/complete" className="dash-cta">View completion page →</Link>
                </>
              ) : (
                <>
                  <div className="dash-greeting-emoji">📈</div>
                  <p>{totalPct}% through the program{displayName ? `, ${displayName}` : ""}. Keep it up — consistency beats intensity.</p>
                  <Link href="/" className="dash-cta">Continue →</Link>
                </>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
