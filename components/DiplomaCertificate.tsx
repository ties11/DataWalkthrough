"use client";

import { useRef } from "react";

interface DiplomaCertificateProps {
  name: string;
  completedDate?: Date;
}

function formatDate(d: Date) {
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default function DiplomaCertificate({
  name,
  completedDate = new Date(),
}: DiplomaCertificateProps) {
  const certRef = useRef<HTMLDivElement>(null);

  function printCert() {
    // Add a class to body so print CSS can show only the cert
    document.body.classList.add("printing-cert");
    window.print();
    // Clean up after print dialog closes
    window.addEventListener("afterprint", () => {
      document.body.classList.remove("printing-cert");
    }, { once: true });
  }

  return (
    <div className="diploma-wrap">
      {/* Print button — hidden in print */}
      <div className="diploma-toolbar no-print">
        <button className="ex-btn" onClick={printCert}>
          ⎙ Download / Print Certificate
        </button>
        <span className="diploma-toolbar-note">Opens your browser&apos;s print dialog. Choose &quot;Save as PDF&quot; for a digital copy.</span>
      </div>

      {/* Certificate card */}
      <div className="diploma-cert" ref={certRef} id="diploma-cert">
        {/* Decorative border */}
        <div className="diploma-border" aria-hidden="true">
          <div className="diploma-corner diploma-corner-tl" />
          <div className="diploma-corner diploma-corner-tr" />
          <div className="diploma-corner diploma-corner-bl" />
          <div className="diploma-corner diploma-corner-br" />
        </div>

        {/* Accent stripe */}
        <div className="diploma-stripe" />

        {/* Content */}
        <div className="diploma-inner">
          <div className="diploma-eyebrow">DataWalkthrough · Certificate of Completion</div>

          <div className="diploma-seal" aria-hidden="true">🎓</div>

          <p className="diploma-presented">This certificate is proudly presented to</p>
          <h1 className="diploma-name">{name}</h1>

          <p className="diploma-body">
            for successfully completing the <strong>DataWalkthrough</strong> program —
            a comprehensive study of Data Science and Machine Learning spanning
            6 phases and 25 subjects, including theory, mathematics, and
            hands-on coding exercises.
          </p>

          <div className="diploma-phases">
            <span>Phase 0 · Foundations</span>
            <span>Phase 1 · Supervised Learning</span>
            <span>Phase 2 · Model Evaluation</span>
            <span>Phase 3 · Unsupervised Learning</span>
            <span>Phase 4 · Deep Learning</span>
            <span>Phase 5 · Advanced Topics</span>
            <span>Phase 6 · Capstone Project</span>
          </div>

          <div className="diploma-footer">
            <div className="diploma-sig">
              <div className="diploma-sig-line" />
              <div className="diploma-sig-name">Ties Waenink</div>
              <div className="diploma-sig-role">Creator, DataWalkthrough</div>
            </div>
            <div className="diploma-date-block">
              <div className="diploma-date-label">Date of completion</div>
              <div className="diploma-date">{formatDate(completedDate)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
