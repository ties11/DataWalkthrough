"use client";

import { useState } from "react";

interface DonationBannerProps {
  /** Pass a real Tikkie URL once created, or leave undefined for placeholder state */
  tikkieUrl?: string;
  /** Pass a real Stripe URL once created, or leave undefined for placeholder state */
  stripeUrl?: string;
  /** Context label — "end of module" or "dashboard", etc. */
  context?: string;
}

export default function DonationBanner({
  tikkieUrl,
  stripeUrl,
  context = "module",
}: DonationBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const [showTikkie, setShowTikkie] = useState(false);

  if (dismissed) return null;

  return (
    <div className="don-banner">
      <button
        className="don-dismiss"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss donation banner"
      >
        ✕
      </button>

      <div className="don-inner">
        <div className="don-left">
          <div className="don-icon">☕</div>
          <div>
            <div className="don-title">Enjoying this {context}?</div>
            <p className="don-body">
              DataWalkthrough is free and always will be. If it helped you, a small
              contribution keeps it running and motivates new content.
            </p>
          </div>
        </div>

        <div className="don-actions">
          {/* Tikkie (NL) */}
          <button
            className="don-btn don-btn-tikkie"
            onClick={() => {
              if (tikkieUrl) window.open(tikkieUrl, "_blank");
              else setShowTikkie((v) => !v);
            }}
            title="Tikkie — Dutch mobile payment"
          >
            <span className="don-btn-flag">🇳🇱</span>
            Tikkie
          </button>

          {/* Stripe (international) */}
          {stripeUrl ? (
            <a
              href={stripeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="don-btn don-btn-stripe"
            >
              💳 Card / Stripe
            </a>
          ) : (
            <button className="don-btn don-btn-stripe don-btn-soon" disabled>
              💳 Card — coming soon
            </button>
          )}
        </div>
      </div>

      {/* Tikkie QR placeholder — shown when no URL is set yet */}
      {showTikkie && !tikkieUrl && (
        <div className="don-tikkie-placeholder">
          <div className="don-qr-mock" aria-label="QR code placeholder">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <rect x="4" y="4" width="30" height="30" rx="3" stroke="currentColor" strokeWidth="3"/>
              <rect x="12" y="12" width="14" height="14" rx="1" fill="currentColor"/>
              <rect x="46" y="4" width="30" height="30" rx="3" stroke="currentColor" strokeWidth="3"/>
              <rect x="54" y="12" width="14" height="14" rx="1" fill="currentColor"/>
              <rect x="4" y="46" width="30" height="30" rx="3" stroke="currentColor" strokeWidth="3"/>
              <rect x="12" y="54" width="14" height="14" rx="1" fill="currentColor"/>
              <rect x="46" y="46" width="10" height="10" rx="1" fill="currentColor"/>
              <rect x="62" y="46" width="14" height="10" rx="1" fill="currentColor"/>
              <rect x="46" y="62" width="14" height="14" rx="1" fill="currentColor"/>
              <rect x="66" y="62" width="10" height="14" rx="1" fill="currentColor"/>
            </svg>
          </div>
          <div className="don-qr-label">Tikkie link coming soon</div>
          <div className="don-qr-sub">A real Tikkie QR code will appear here once set up.</div>
        </div>
      )}
    </div>
  );
}
