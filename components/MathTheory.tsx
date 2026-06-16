"use client";

import { useState } from "react";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

/** A single annotated variable in a formula */
export interface FormulaVar {
  symbol: string;          // e.g. "\\alpha"
  name: string;            // e.g. "Learning rate"
  description: string;     // tooltip text
}

export interface MathTheoryProps {
  title: string;
  intro?: string;
  formula: string;         // full KaTeX formula string
  variables: FormulaVar[]; // annotated variables
  derivation?: string[];   // optional step-by-step derivation (KaTeX strings)
}

export default function MathTheory({
  title,
  intro,
  formula,
  variables,
  derivation = [],
}: MathTheoryProps) {
  const [activeVar, setActiveVar] = useState<FormulaVar | null>(null);
  const [showDeriv, setShowDeriv] = useState(false);

  return (
    <div className="mth">
      <div className="mth-head">
        <span className="mth-badge">∑ Math</span>
        <h3 className="mth-title">{title}</h3>
        {intro && <p className="mth-intro">{intro}</p>}
      </div>

      {/* Main formula display */}
      <div className="mth-formula-wrap">
        <BlockMath math={formula} />
      </div>

      {/* Variable glossary — hover/click to see tooltip */}
      <div className="mth-vars-label">Click a variable to learn what it means:</div>
      <div className="mth-vars">
        {variables.map((v, i) => (
          <button
            key={i}
            className={`mth-var-pill ${activeVar?.symbol === v.symbol ? "is-active" : ""}`}
            onClick={() => setActiveVar(activeVar?.symbol === v.symbol ? null : v)}
          >
            <InlineMath math={v.symbol} />
          </button>
        ))}
      </div>

      {/* Active variable tooltip */}
      {activeVar && (
        <div className="mth-var-tooltip">
          <div className="mth-var-tooltip-symbol"><InlineMath math={activeVar.symbol} /></div>
          <div className="mth-var-tooltip-name">{activeVar.name}</div>
          <div className="mth-var-tooltip-desc">{activeVar.description}</div>
        </div>
      )}

      {/* Optional step-by-step derivation */}
      {derivation.length > 0 && (
        <div className="mth-deriv-wrap">
          <button
            className="mth-deriv-toggle"
            onClick={() => setShowDeriv(!showDeriv)}
          >
            {showDeriv ? "▾ Hide derivation" : "▸ Show step-by-step derivation"}
          </button>
          {showDeriv && (
            <ol className="mth-deriv-steps">
              {derivation.map((step, i) => (
                <li key={i} className="mth-deriv-step">
                  <span className="mth-deriv-num">{i + 1}</span>
                  <BlockMath math={step} />
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </div>
  );
}
