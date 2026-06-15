"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { SUBJECTS } from "@/content";
import { getAllProgress, ProgressData } from "@/lib/progress";

// Seven daily challenge subjects — cycles through SUBJECTS by day-of-year
function getWeeklyChallenges(): typeof SUBJECTS {
  const day = Math.floor(Date.now() / 86400000);
  const out: typeof SUBJECTS = [];
  for (let i = 0; i < 7; i++) {
    out.push(SUBJECTS[(day + i) % SUBJECTS.length]);
  }
  return out;
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function AccountPage() {
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [allProgress, setAllProgress] = useState<Record<string, ProgressData>>({});
  const [progressLoaded, setProgressLoaded] = useState(false);

  const weeklyChallenges = getWeeklyChallenges();

  useEffect(() => {
    if (user) {
      setDisplayName(user.user_metadata?.display_name || "");
      getAllProgress().then((p) => { setAllProgress(p); setProgressLoaded(true); });
    }
  }, [user]);

  const totalMastery = SUBJECTS.reduce((s, sub) => s + (allProgress[sub.slug]?.mastery_score || 0), 0);
  const completedSubjects = SUBJECTS.filter((sub) => {
    const total = (sub.quiz?.length || 0) + sub.exercises.reduce((n, e) => n + e.parts.length, 0);
    const p = allProgress[sub.slug];
    const done = p ? new Set(p.completed_quizzes).size + new Set(p.completed_exercises).size : 0;
    return total > 0 && done >= total;
  }).length;
  const totalItems = SUBJECTS.reduce((s, sub) =>
    s + (sub.quiz?.length || 0) + sub.exercises.reduce((n, e) => n + e.parts.length, 0), 0);
  const totalDone = SUBJECTS.reduce((s, sub) => {
    const p = allProgress[sub.slug];
    return s + (p ? new Set(p.completed_quizzes).size + new Set(p.completed_exercises).size : 0);
  }, 0);
  const programPct = totalItems > 0 ? Math.round((totalDone / totalItems) * 100) : 0;

  const initials = (() => {
    const name = user?.user_metadata?.display_name || user?.email || "";
    const parts = name.split(/[\s@.]+/).filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return (parts[0]?.[0] || "?").toUpperCase();
  })();

  function isChallengeStarted(slug: string) {
    const p = allProgress[slug];
    return p && (p.completed_quizzes.length > 0 || p.completed_exercises.length > 0);
  }

  async function saveDisplayName() {
    if (!displayName.trim()) return;
    setSavingName(true);
    const { error } = await supabase.auth.updateUser({ data: { display_name: displayName.trim() } });
    setSavingName(false);
    if (error) setMsg(error.message);
    else setMsg("Display name saved!");
  }

  async function submit() {
    setBusy(true);
    setMsg(null);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMsg("Account created! Check your email to confirm, then sign in.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setMsg("Signed in. Your progress will now sync.");
      }
    } catch (e: unknown) {
      setMsg(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    setMsg("Signed out. Progress on this device is still saved locally.");
  }

  return (
    <main className="account">
      <div className="account-inner">
        <div className="account-topnav">
          <Link href="/" className="shell-back">← All subjects</Link>
          <Link href="/dashboard" className="shell-back" style={{ marginLeft: "auto" }}>Dashboard →</Link>
        </div>

        <h1 className="account-title">Account</h1>

        {loading ? (
          <p className="account-lede">Loading…</p>
        ) : user ? (
          <>
            {/* Avatar + name */}
            <div className="account-profile">
              <div className="account-avatar">{initials}</div>
              <div className="account-profile-info">
                <div className="account-profile-name">
                  {user.user_metadata?.display_name || user.email}
                </div>
                <div className="account-profile-email">{user.email}</div>
              </div>
            </div>

            {/* Progress summary */}
            {progressLoaded && (
              <div className="account-stats">
                <div className="account-stat">
                  <div className="account-stat-value">{programPct}%</div>
                  <div className="account-stat-label">Program</div>
                </div>
                <div className="account-stat">
                  <div className="account-stat-value">{completedSubjects}</div>
                  <div className="account-stat-label">Subjects done</div>
                </div>
                <div className="account-stat">
                  <div className="account-stat-value">{totalMastery.toLocaleString()}</div>
                  <div className="account-stat-label">Mastery pts</div>
                </div>
                <div className="account-stat">
                  <div className="account-stat-value">{totalDone}</div>
                  <div className="account-stat-label">Items done</div>
                </div>
              </div>
            )}

            {/* Personalisation */}
            <div className="account-section">
              <div className="account-section-head">Personalisation</div>
              <label className="account-label">
                Display name
                <div className="account-name-row">
                  <input
                    type="text"
                    className="account-input"
                    value={displayName}
                    placeholder="How should we call you?"
                    onChange={(e) => setDisplayName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && saveDisplayName()}
                  />
                  <button
                    className="account-name-save"
                    onClick={saveDisplayName}
                    disabled={savingName || !displayName.trim()}
                  >
                    {savingName ? "…" : "Save"}
                  </button>
                </div>
              </label>
            </div>

            {/* Weekly challenges */}
            <div className="account-section">
              <div className="account-section-head">Weekly Challenges</div>
              <p className="account-section-lede">
                One subject per day — work through the full curriculum in {Math.ceil(SUBJECTS.length / 7)} weeks.
              </p>
              <div className="account-challenges">
                {weeklyChallenges.map((sub, i) => {
                  const started = isChallengeStarted(sub.slug);
                  return (
                    <Link
                      key={sub.slug}
                      href={`/subjects/${sub.slug}`}
                      className={`account-challenge ${started ? "is-done" : ""}`}
                    >
                      <div className="account-challenge-day">{DAY_LABELS[i]}</div>
                      <div className={`account-challenge-dot ${started ? "is-done" : ""}`} />
                      <div className="account-challenge-title">{sub.title}</div>
                    </Link>
                  );
                })}
              </div>
            </div>

            <button className="ex-btn" onClick={signOut} style={{ marginTop: "8px" }}>
              Sign out
            </button>
          </>
        ) : (
          <>
            <p className="account-lede">
              Use the entire platform without an account — progress saves in this browser. Sign in to sync across devices and access your dashboard.
            </p>

            <div className="account-tabs">
              <button
                className={`account-tab ${mode === "signin" ? "is-active" : ""}`}
                onClick={() => setMode("signin")}
              >
                Sign in
              </button>
              <button
                className={`account-tab ${mode === "signup" ? "is-active" : ""}`}
                onClick={() => setMode("signup")}
              >
                Create account
              </button>
            </div>

            <div className="account-form">
              <label className="account-label">
                Email
                <input
                  type="email"
                  className="account-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </label>
              <label className="account-label">
                Password
                <input
                  type="password"
                  className="account-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                />
              </label>
              <button
                className="reader-nav-btn-primary account-submit"
                onClick={submit}
                disabled={busy || !email || !password}
              >
                {busy ? "Working…" : mode === "signup" ? "Create account" : "Sign in"}
              </button>
            </div>
          </>
        )}

        {msg && <p className="account-msg">{msg}</p>}
      </div>
      <div className="account-footer-links">
        <Link href="/about" className="account-footer-link">About the creator</Link>
        <Link href="/complete" className="account-footer-link">Completion page</Link>
      </div>
    </main>
  );
}
