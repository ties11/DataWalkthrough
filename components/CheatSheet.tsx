"use client";

import { Subject } from "@/content/types";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import SubjectIcon from "./SubjectIcon";

export default function CheatSheet({ subject }: { subject: Subject }) {
  const totalItems = subject.cheatsheet.reduce((n, s) => n + s.items.length, 0);

  return (
    <div className="poster-wrap">
      <div className="poster-toolbar">
        <button className="ex-btn" onClick={() => window.print()}>
          ⎙ Print / Save as PDF
        </button>
      </div>

      <div className="poster" id="cheat-poster">
        {/* Top accent stripe */}
        <div className="poster-accent-bar" />

        <div className="poster-inner">
          {/* Header */}
          <header className="poster-head">
            <div className="poster-head-icon">
              <SubjectIcon name={subject.icon} size={30} />
            </div>
            <div className="poster-head-text">
              <h1 className="poster-title">{subject.title}</h1>
              <p className="poster-tag">Quick-reference cheat sheet</p>
            </div>
            <div className="poster-head-meta">
              <span>{subject.cheatsheet.length} sections</span><br />
              <span>{totalItems} key concepts</span><br />
              <span>Phase {subject.phase}</span>
            </div>
          </header>

          {/* Sections */}
          <div className="poster-grid">
            {subject.cheatsheet.map((section, si) => (
              <section key={si} className="poster-section">
                <h2 className="poster-section-head">
                  <span className="poster-section-num">{String(si + 1).padStart(2, "0")}</span>
                  {section.heading}
                </h2>
                <ul className="poster-items">
                  {section.items.map((item, ii) => (
                    <li key={ii} className="poster-item">
                      <span className="poster-term">{item.term}</span>
                      <span className="poster-note">{item.note}</span>
                      {item.formula && (
                        <span className="poster-formula">
                          <InlineMath math={item.formula} />
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          {/* Footer */}
          <footer className="poster-foot">
            <span>{subject.title} · Data Science Learning Platform</span>
            <span>{subject.sources.length} academic source{subject.sources.length !== 1 ? "s" : ""}</span>
          </footer>
        </div>
      </div>
    </div>
  );
}