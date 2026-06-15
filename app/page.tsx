"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SUBJECTS } from "@/content";
import SubjectIcon from "@/components/SubjectIcon";
import LearningPath from "@/components/LearningPath";
import { getAllProgress, ProgressData } from "@/lib/progress";
import { useAuth } from "@/lib/auth";
import { getProfile, recommendedPhase, goalLabel, Profile } from "@/lib/profile";
import OnboardingModal from "@/components/OnboardingModal";

const PHASES: { num: number; label: string; description: string }[] = [
  { num: 0, label: "Foundations", description: "Statistics, linear algebra, calculus, and data wrangling — the bedrock everything else builds on." },
  { num: 1, label: "Core Supervised Models", description: "The essential supervised learning algorithms: regression, classification, and powerful ensembles." },
  { num: 2, label: "Model Evaluation", description: "Know when your model is actually good. Bias–variance, cross-validation, and classification metrics." },
  { num: 3, label: "Unsupervised Learning", description: "Find structure in unlabelled data through clustering and dimensionality reduction." },
  { num: 4, label: "Deep Learning", description: "Neural networks, backpropagation, and the architectural building blocks of modern AI." },
  { num: 5, label: "Advanced Topics", description: "Time series forecasting, NLP, and specialised domains that extend the core ML toolkit." },
  { num: 6, label: "Capstone", description: "End-to-end on a real dataset — apply everything from all six phases in one complete project." },
];

type HomeView = "path" | "grid";

export default function Home() {
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});
  const [allProgress, setAllProgress] = useState<Record<string, ProgressData>>({});
  const [view, setView] = useState<HomeView>("grid");
  const [profile, setProfile] = useState<Profile | null | "loading">("loading");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    async function loadProgress() {
      const p = await getAllProgress();
      setAllProgress(p);
    }
    loadProgress();
    const handler = () => getAllProgress().then(setAllProgress);
    window.addEventListener("progress-synced", handler);
    return () => window.removeEventListener("progress-synced", handler);
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setProfile(null); return; }
    getProfile().then((p) => {
      setProfile(p);
      // null means no row yet → first login → trigger onboarding
      if (p === null) setShowOnboarding(true);
    });
  }, [user, authLoading]);

  function handleOnboardingComplete() {
    setShowOnboarding(false);
    getProfile().then(setProfile);
  }

  function toggle(num: number) {
    setCollapsed((c) => ({ ...c, [num]: !c[num] }));
  }

  return (
    <>
    {showOnboarding && <OnboardingModal onComplete={handleOnboardingComplete} />}
    <main className="home">
      {/* Sticky top nav */}
      <nav className="home-nav">
        <div className="home-nav-inner">
          <div className="home-eyebrow">Learn Data Science</div>
          <div className="home-topbar-right">
            <div className="home-view-toggle">
              <button
                className={`home-view-btn ${view === "grid" ? "is-active" : ""}`}
                onClick={() => setView("grid")}
                title="Subject grid"
              >
                ⊞ Subjects
              </button>
              <button
                className={`home-view-btn ${view === "path" ? "is-active" : ""}`}
                onClick={() => setView("path")}
                title="Learning path"
              >
                ↓ Path
              </button>
            </div>
            <Link href="/dashboard" className="shell-account shell-account-dash" title="Dashboard">◈</Link>
            <Link href={user ? "/account" : "/login"} className="shell-account">
              {user
                ? (profile !== "loading" && profile?.display_name) || user.user_metadata?.display_name || user.email?.split("@")[0] || "Account"
                : "Sign in"}
            </Link>
          </div>
        </div>
      </nav>

      <div className="home-inner">
        {/* Personalised banner */}
        {profile && profile !== "loading" && (
          <div className="home-recommend-banner">
            <span className="home-recommend-icon">✦</span>
            <div className="home-recommend-text">
              <div className="home-recommend-label">
                {profile.display_name
                  ? `Welcome back, ${profile.display_name}`
                  : "Personalised path"}
              </div>
              <div className="home-recommend-msg">
                {profile.goal
                  ? `Goal: ${goalLabel(profile.goal)} · `
                  : ""}
                {profile.experience
                  ? `Recommended start: Phase ${recommendedPhase(profile.experience)} — ${PHASES[recommendedPhase(profile.experience)].label}`
                  : "Continue from where you left off."}
              </div>
            </div>
            <Link
              href={`#phase-${recommendedPhase(profile.experience)}`}
              className="home-recommend-link"
            >
              Jump there →
            </Link>
          </div>
        )}

        {/* Hero */}
        <div className="home-hero">
          <h1 className="home-title">From theory to code,<br/>one subject at a time.</h1>
          <p className="home-lede">
            The intuition, the mathematics, when and why to use it — hands-on
            coding that runs in the browser, and a quick-reference cheat sheet.
            Everything a subject needs, nothing it doesn&apos;t.
          </p>
          <div className="home-hero-pills">
            <span className="home-hero-pill home-hero-pill-accent">25 subjects</span>
            <span className="home-hero-pill">6 phases</span>
            <span className="home-hero-pill">Theory + code + quiz</span>
            <span className="home-hero-pill">Runs in the browser</span>
          </div>
        </div>

        {/* ── Learning Path view ── */}
        {view === "path" && (
          <div className="home-path-wrap">
            <LearningPath />
          </div>
        )}

        {/* ── Subject grid view ── */}
        {view === "grid" && PHASES.map((phase) => {
          const subjects = SUBJECTS.filter((s) => s.phase === phase.num);
          if (subjects.length === 0) return null;

          const isCollapsed = collapsed[phase.num];

          // Phase completion
          const phaseTotal = subjects.reduce((sum, s) =>
            sum + (s.quiz?.length || 0) + s.exercises.reduce((n, e) => n + e.parts.length, 0), 0);
          const phaseDone = subjects.reduce((sum, s) => {
            const p = allProgress[s.slug];
            if (!p) return sum;
            return sum + new Set(p.completed_quizzes).size + new Set(p.completed_exercises).size;
          }, 0);
          const phasePct = phaseTotal > 0 ? Math.min(100, Math.round((phaseDone / phaseTotal) * 100)) : 0;
          const phaseMastery = subjects.reduce((sum, s) => sum + (allProgress[s.slug]?.mastery_score || 0), 0);

          return (
            <section key={phase.num} className="home-phase" id={`phase-${phase.num}`}>
              <button
                className="home-phase-head"
                onClick={() => toggle(phase.num)}
                aria-expanded={!isCollapsed}
              >
                <span className={`home-phase-chevron ${isCollapsed ? "is-collapsed" : ""}`}>▾</span>
                <span className="home-phase-num">Phase {phase.num}</span>
                <span className="home-phase-label">{phase.label}</span>

                <span className="home-phase-count flex items-center gap-3">
                  {/* Inline mini progress bar */}
                  {phasePct > 0 && (
                    <span className="home-phase-pct-wrap">
                      <span className="home-phase-pct-track">
                        <span className="home-phase-pct-fill" style={{ width: `${phasePct}%` }} />
                      </span>
                      <span className="home-phase-pct-label">{phasePct}%</span>
                    </span>
                  )}
                  {subjects.length} subject{subjects.length === 1 ? "" : "s"}
                  {phaseMastery > 0 && (
                    <span className="opacity-50 font-mono text-[10px] uppercase tracking-widest">
                      · {phaseMastery} pts
                    </span>
                  )}
                </span>
              </button>

              {!isCollapsed && (
                <>
                  {phase.description && (
                    <p className="home-phase-desc">{phase.description}</p>
                  )}
                  <div className="home-grid">
                    {subjects.map((s) => {
                      const p = allProgress[s.slug];
                      const total = (s.quiz?.length || 0) + s.exercises.reduce((n, e) => n + e.parts.length, 0);
                      const done = p ? new Set(p.completed_quizzes).size + new Set(p.completed_exercises).size : 0;
                      const pct = total > 0 ? Math.min(100, Math.round((done / total) * 100)) : 0;

                      return (
                        <Link key={s.slug} href={`/subjects/${s.slug}`} className="home-card">
                          <span className="home-card-icon">
                            <SubjectIcon name={s.icon} size={36} />
                          </span>
                          <span className="home-card-title">{s.title}</span>
                          <span className="home-card-blurb">{s.blurb}</span>
                          {pct > 0 && (
                            <span className="home-card-progress">
                              <span className="home-card-progress-track">
                                <span className="home-card-progress-fill" style={{ width: `${pct}%` }} />
                              </span>
                              <span className="home-card-progress-label">{pct}%</span>
                            </span>
                          )}
                          <span className="home-card-meta">
                            {s.theory.length} lessons · {s.quiz.length} questions ·{" "}
                            {s.exercises.reduce((n, e) => n + e.parts.length, 0)} exercises
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </>
              )}
            </section>
          );
        })}
      </div>
      <footer className="home-footer">
        <Link href="/about" className="home-footer-about">
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="10" cy="10" r="8"/><path d="M10 9v5M10 7h.01"/></svg>
          About the creator
        </Link>
        <span className="home-footer-sep">·</span>
        <Link href="/dashboard" className="home-footer-link">Dashboard</Link>
        <span className="home-footer-sep">·</span>
        <Link href="/complete" className="home-footer-link">Completion page</Link>
      </footer>
    </main>
    </>
  );
}
