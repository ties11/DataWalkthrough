"use client";

import { useState } from "react";
import { Block, Subject } from "@/content/types";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import SubjectIcon from "./SubjectIcon";

// ─────────────────────────────────────────────────────────────
//  Inline rich text: renders \( ... \) as KaTeX, plus simple
//  inline HTML (<em>, <code>) from the content strings.
// ─────────────────────────────────────────────────────────────
function RichText({ html }: { html: string }) {
  const parts = html.split(/(\\\(.*?\\\))/g);
  return (
    <>
      {parts.map((part, i) => {
        const m = part.match(/^\\\((.*)\\\)$/);
        if (m) return <InlineMath key={i} math={m[1]} />;
        return <span key={i} dangerouslySetInnerHTML={{ __html: part }} />;
      })}
    </>
  );
}

// ─────────────────────────────────────────────────────────────
//  One content block, rendered by kind.
// ─────────────────────────────────────────────────────────────
function BlockView({ block }: { block: Block }) {
  switch (block.kind) {
    case "para":
      return (
        <p className="reader-para">
          <RichText html={block.html} />
        </p>
      );

    case "heading":
      return <h3 className="reader-subhead">{block.text}</h3>;

    case "equation":
      return (
        <div className="reader-eq">
          {block.label && <div className="reader-eq-label">{block.label}</div>}
          <BlockMath math={block.tex} />
        </div>
      );

    case "callout": {
      return (
        <aside className={`reader-callout reader-callout-${block.tone}`}>
          {block.title && <div className="reader-callout-title">{block.title}</div>}
          <div className="reader-callout-body">
            <RichText html={block.html} />
          </div>
        </aside>
      );
    }

    case "table":
      return (
        <div className="reader-table-wrap">
          <table className="reader-table">
            <thead>
              <tr>
                {block.headers.map((h, i) => (
                  <th key={i}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "image":
      return (
        <figure className="reader-figure">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={block.src} alt={block.caption || ""} />
          {block.caption && <figcaption>{block.caption}</figcaption>}
        </figure>
      );

    default:
      return null;
  }
}

// ─────────────────────────────────────────────────────────────
//  The reader: scholarly two-column layout.
//  Left rail = subject identity + table of contents + progress.
//  Main = the reading column.
// ─────────────────────────────────────────────────────────────
export default function TheoryReader({ subject, embedded = false }: { subject: Subject; embedded?: boolean }) {
  const [page, setPage] = useState(0);
  const pages = subject.theory;
  const current = pages[page];
  const pct = Math.round(((page + 1) / pages.length) * 100);

  return (
    <div className="reader-root">
      {/* ── Left rail ─────────────────────────────────────── */}
      <aside className="reader-rail">
        <div className="reader-rail-inner">
      {!embedded && (
            <>
              <div className="reader-eyebrow">Data Science · Theory</div>
              <h1 className="reader-subject">
                <span className="reader-subject-icon"><SubjectIcon name={subject.icon} size={26} /></span>
                {subject.title}
              </h1>
              <p className="reader-blurb">{subject.blurb}</p>
            </>
          )}
          {embedded && (
            <div className="reader-eyebrow" style={{ marginBottom: 24 }}>
              Contents
            </div>
          )}
          <nav className="reader-toc">
            {pages.map((pg, i) => {
              const state =
                i === page ? "current" : i < page ? "done" : "upcoming";
              return (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`reader-toc-item reader-toc-${state}`}
                >
                  <span className="reader-toc-num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="reader-toc-label">{pg.title}</span>
                </button>
              );
            })}
          </nav>

          <div className="reader-progress">
            <div className="reader-progress-track">
              <div
                className="reader-progress-fill"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="reader-progress-label">
              {pct}% · page {page + 1} of {pages.length}
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main reading column ───────────────────────────── */}
      <main className="reader-main">
        <div className="reader-col">
          <div className="reader-badge">{current.badge}</div>
          <h2 className="reader-title">{current.title}</h2>
          <div className="reader-rule" />

          {current.blocks.map((b, i) => (
            <BlockView key={i} block={b} />
          ))}

          {/* Sources on the last page */}
          {page === pages.length - 1 && (
            <div className="reader-sources">
              <div className="reader-sources-head">Sources</div>
              <ul>
                {subject.sources.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Navigation */}
          <div className="reader-nav">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 0}
              className="reader-nav-btn"
            >
              ← Previous
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page === pages.length - 1}
              className="reader-nav-btn reader-nav-btn-primary"
            >
              Next →
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
