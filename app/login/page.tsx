"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LogoMark from "@/components/LogoMark";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";

type Mode = "signin" | "signup";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  );
}

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [oauthBusy, setOauthBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ text: string; type: "error" | "success" } | null>(null);

  // If already signed in, go home
  useEffect(() => {
    if (!loading && user) router.replace("/");
  }, [user, loading, router]);

  async function signInWithOAuth(provider: "google" | "github" | "apple") {
    setOauthBusy(provider);
    setMsg(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/` },
    });
    if (error) {
      setMsg({ text: error.message, type: "error" });
      setOauthBusy(null);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMsg({ text: "Account created! Check your email to confirm.", type: "success" });
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.replace("/");
      }
    } catch (e: unknown) {
      setMsg({ text: e instanceof Error ? e.message : "Something went wrong.", type: "error" });
    } finally {
      setBusy(false);
    }
  }

  if (loading) return null;

  return (
    <div className="auth-page">
      {/* Left panel — branding */}
      <div className="auth-brand">
        <div className="auth-brand-inner">
          <Link href="/" className="auth-brand-logo">
            <LogoMark size={48} dark />
            <span className="auth-brand-name">Data<span style={{color:"#2ed2b6"}}>Walkthrough</span></span>
          </Link>
          <div className="auth-brand-tagline">
            A complete walkthrough of all subjects in data science and machine learning, with hands-on coding examples.
          </div>
          <ul className="auth-brand-features">
            <li>25 subjects across 6 phases</li>
            <li>Theory, math, and hands-on exercises</li>
            <li>Progress synced across devices</li>
            <li>Personalised learning path</li>
          </ul>
        </div>
      </div>

      {/* Right panel — auth form */}
      <div className="auth-form-panel">
        <div className="auth-form-inner">
          <div className="auth-form-head">
            <h1 className="auth-form-title">
              {mode === "signin" ? "Welcome back" : "Create account"}
            </h1>
            <p className="auth-form-sub">
              {mode === "signin"
                ? "Sign in to sync your progress across devices."
                : "Free forever. No card required."}
            </p>
          </div>

          {/* OAuth buttons */}
          <div className="auth-oauth-row">
            <button
              className="auth-oauth-btn"
              onClick={() => signInWithOAuth("google")}
              disabled={!!oauthBusy}
            >
              {oauthBusy === "google" ? <span className="auth-spinner" /> : <GoogleIcon />}
              Google
            </button>
            <button
              className="auth-oauth-btn"
              onClick={() => signInWithOAuth("github")}
              disabled={!!oauthBusy}
            >
              {oauthBusy === "github" ? <span className="auth-spinner" /> : <GitHubIcon />}
              GitHub
            </button>
            <button
              className="auth-oauth-btn"
              onClick={() => signInWithOAuth("apple")}
              disabled={!!oauthBusy}
            >
              {oauthBusy === "apple" ? <span className="auth-spinner" /> : <AppleIcon />}
              Apple
            </button>
          </div>

          <div className="auth-divider"><span>or continue with email</span></div>

          {/* Email form */}
          <form className="auth-email-form" onSubmit={submit}>
            <label className="auth-label">
              Email
              <input
                className="auth-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </label>
            <label className="auth-label">
              Password
              <input
                className="auth-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === "signup" ? "Min 6 characters" : "••••••••"}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                required
              />
            </label>

            {msg && (
              <div className={`auth-msg auth-msg-${msg.type}`}>{msg.text}</div>
            )}

            <button
              className="auth-submit"
              type="submit"
              disabled={busy || !email || !password}
            >
              {busy
                ? <><span className="auth-spinner" /> Working…</>
                : mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>

          <p className="auth-switch">
            {mode === "signin" ? (
              <>No account?{" "}
                <button className="auth-switch-btn" onClick={() => { setMode("signup"); setMsg(null); }}>
                  Create one free
                </button>
              </>
            ) : (
              <>Already have one?{" "}
                <button className="auth-switch-btn" onClick={() => { setMode("signin"); setMsg(null); }}>
                  Sign in
                </button>
              </>
            )}
          </p>

          <p className="auth-back">
            <Link href="/" className="auth-back-link">← Continue without account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
