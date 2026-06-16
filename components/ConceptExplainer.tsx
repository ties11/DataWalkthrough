"use client";

import { useState } from "react";

interface Citation {
  authors: string;
  title: string;
  year: number;
  journal?: string;
  url?: string;
}

interface ConceptExplainerProps {
  concept: string;
  summary: string;
  edgeCases?: string[];
  mathDepth?: string;        // plain text or LaTeX-free explanation
  citations?: Citation[];
}

type Section = "edge" | "math" | "lit";

export default function ConceptExplainer({
  concept,
  summary,
  edgeCases = [],
  mathDepth,
  citations = [],
}: ConceptExplainerProps) {
  const [open, setOpen] = useState<Set<Section>>(new Set());

  function toggle(s: Section) {
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(s) ? next.delete(s) : next.add(s);
      return next;
    });
  }

  const sections: { id: Section; label: string; icon: string; content: React.ReactNode }[] = [
    {
      id: "edge",
      label: "Exceptions & Edge Cases",
      icon: "⚠",
      content: edgeCases.length ? (
        <ul className="cexp-edge-list">
          {edgeCases.map((e, i) => <li key={i}>{e}</li>)}
        </ul>
      ) : <p className="cexp-empty">No edge cases documented yet.</p>,
    },
    {
      id: "math",
      label: "Mathematical Depth",
      icon: "∑",
      content: mathDepth ? (
        <div className="cexp-math-body">{mathDepth}</div>
      ) : <p className="cexp-empty">No deeper derivation provided yet.</p>,
    },
    {
      id: "lit",
      label: "Academic Literature",
      icon: "📚",
      content: citations.length ? (
        <ol className="cexp-citations">
          {citations.map((c, i) => (
            <li key={i} className="cexp-citation">
              <span className="cexp-citation-authors">{c.authors}</span>{" "}
              <span className="cexp-citation-year">({c.year})</span>.{" "}
              {c.url ? (
                <a href={c.url} target="_blank" rel="noopener noreferrer" className="cexp-citation-title">
                  {c.title}
                </a>
              ) : (
                <span className="cexp-citation-title">{c.title}</span>
              )}
              {c.journal && <span className="cexp-citation-journal">. <em>{c.journal}</em></span>}
              <span className="cexp-citation-dot">.</span>
            </li>
          ))}
        </ol>
      ) : <p className="cexp-empty">No citations linked yet.</p>,
    },
  ];

  return (
    <div className="cexp">
      {/* Base explanation */}
      <div className="cexp-base">
        <div className="cexp-concept-label">Concept</div>
        <h3 className="cexp-concept-name">{concept}</h3>
        <p className="cexp-summary">{summary}</p>
      </div>

      {/* Expandable depth sections */}
      <div className="cexp-accordions">
        {sections.map((s) => {
          const isOpen = open.has(s.id);
          return (
            <div key={s.id} className={`cexp-accordion ${isOpen ? "is-open" : ""}`}>
              <button
                className="cexp-accordion-trigger"
                onClick={() => toggle(s.id)}
                aria-expanded={isOpen}
              >
                <span className="cexp-acc-icon">{s.icon}</span>
                <span className="cexp-acc-label">{s.label}</span>
                <span className={`cexp-acc-chevron ${isOpen ? "is-open" : ""}`}>▾</span>
              </button>
              {isOpen && (
                <div className="cexp-accordion-body">
                  {s.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
