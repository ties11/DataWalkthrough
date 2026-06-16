"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";

const PHASES = [
  { num: 0, label: "Foundations",  short: "Found.",   emoji: "📐" },
  { num: 1, label: "Supervised",   short: "Superv.",  emoji: "🎯" },
  { num: 2, label: "Evaluation",   short: "Eval.",    emoji: "📊" },
  { num: 3, label: "Unsupervised", short: "Unsup.",   emoji: "🔍" },
  { num: 4, label: "Deep Learning",short: "Deep L.",  emoji: "🧠" },
  { num: 5, label: "Advanced",     short: "Adv.",     emoji: "⚡" },
  { num: 6, label: "Capstone",     short: "Capstone", emoji: "🏁" },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const pathname = usePathname();

  // Close drawer on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  // Lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* ── Hamburger button (top-left on mobile) ─────────────── */}
      <button
        className="mob-hamburger"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
      >
        <span /><span /><span />
      </button>

      {/* ── Slide-in drawer ───────────────────────────────────── */}
      {open && (
        <div className="mob-drawer-backdrop" onClick={() => setOpen(false)}>
          <nav
            className="mob-drawer"
            onClick={(e) => e.stopPropagation()}
            aria-label="Main navigation"
          >
            {/* Header */}
            <div className="mob-drawer-head">
              <span className="mob-drawer-logo">
                <span className="mob-drawer-mark">DS</span>
                <span className="mob-drawer-site">DataWalkthrough</span>
              </span>
              <button className="mob-drawer-close" onClick={() => setOpen(false)} aria-label="Close menu">
                ✕
              </button>
            </div>

            {/* Phase links */}
            <div className="mob-drawer-section-label">Learning Phases</div>
            <ul className="mob-drawer-phases">
              {PHASES.map((p) => (
                <li key={p.num}>
                  <Link
                    href={`/#phase-${p.num}`}
                    className="mob-drawer-phase-link"
                  >
                    <span className="mob-drawer-phase-emoji">{p.emoji}</span>
                    <span>
                      <span className="mob-drawer-phase-num">Phase {p.num}</span>
                      <span className="mob-drawer-phase-name">{p.label}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Quick links */}
            <div className="mob-drawer-section-label">Quick Links</div>
            <ul className="mob-drawer-links">
              <li><Link href="/dashboard" className="mob-drawer-link">◈ Dashboard</Link></li>
              <li><Link href={user ? "/account" : "/login"} className="mob-drawer-link">
                {user ? "⚙ Account" : "→ Sign in"}
              </Link></li>
              <li><Link href="/about" className="mob-drawer-link">ℹ About</Link></li>
            </ul>
          </nav>
        </div>
      )}

      {/* ── Bottom phase bar (mobile only) ────────────────────── */}
      <nav className="mob-bottom-nav" aria-label="Phase navigation">
        {PHASES.map((p) => (
          <Link
            key={p.num}
            href={`/#phase-${p.num}`}
            className="mob-bottom-tab"
            title={p.label}
          >
            <span className="mob-bottom-emoji">{p.emoji}</span>
            <span className="mob-bottom-label">{p.short}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
