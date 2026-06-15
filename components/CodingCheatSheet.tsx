"use client";

import { useState } from "react";

const SECTIONS = [
  {
    heading: "Load & Split Data",
    items: [
      {
        term: "Load a sklearn dataset",
        note: "Returns (X, y) directly.",
        code: "from sklearn.datasets import load_iris\nX, y = load_iris(return_X_y=True)\nprint(X.shape)  # (150, 4)",
      },
      {
        term: "Train / test split",
        note: "80 / 20 split, reproducible.",
        code: "from sklearn.model_selection import train_test_split\nX_train, X_test, y_train, y_test = \\\n  train_test_split(X, y, test_size=0.2, random_state=42)",
      },
    ],
  },
  {
    heading: "Fit & Predict",
    items: [
      {
        term: "Instantiate → fit → predict",
        note: "Every sklearn model follows the same three-step API.",
        code: "from sklearn.linear_model import LogisticRegression\nmodel = LogisticRegression(max_iter=1000, random_state=42)\nmodel.fit(X_train, y_train)\npreds = model.predict(X_test)",
      },
      {
        term: "Predict probabilities",
        note: "Required for ROC-AUC. Take column 1 for binary tasks.",
        code: "proba = model.predict_proba(X_test)[:, 1]",
      },
      {
        term: "Convenience score",
        note: "accuracy for classifiers, R² for regressors.",
        code: "acc = model.score(X_test, y_test)\nprint(round(acc, 2))",
      },
    ],
  },
  {
    heading: "Common Metrics",
    items: [
      {
        term: "Classification",
        note: "Import from sklearn.metrics.",
        code: "from sklearn.metrics import (\n  accuracy_score, precision_score,\n  recall_score, roc_auc_score\n)\nprint(round(accuracy_score(y_test, preds), 2))",
      },
      {
        term: "Regression",
        note: "R² ∈ [0, 1]; higher is better.",
        code: "from sklearn.metrics import r2_score, mean_squared_error\nr2 = r2_score(y_test, preds)\nprint(f\"R2: {r2:.2f}\")",
      },
      {
        term: "Cross-validation",
        note: "5-fold gives 5 scores; take the mean.",
        code: "from sklearn.model_selection import cross_val_score\nscores = cross_val_score(model, X, y, cv=5)\nprint(round(scores.mean(), 2))",
      },
    ],
  },
  {
    heading: "NumPy Essentials",
    items: [
      {
        term: "Create & inspect",
        note: ".shape is a tuple (rows, cols).",
        code: "import numpy as np\na = np.array([1, 2, 3])\nA = np.array([[1, 2], [3, 4]])\nprint(A.shape)  # (2, 2)",
      },
      {
        term: "Math",
        note: "All operate element-wise unless noted.",
        code: "np.mean(a)         # 2.0\nnp.std(a)          # 0.816\nnp.dot(a, a)       # 14\nA @ A              # matrix multiply\nnp.linalg.det(A)   # determinant",
      },
      {
        term: "Print helpers",
        note: "round() works on scalars; .round() on arrays.",
        code: "print(round(float(val), 2))\nprint(np.round(arr, 4))",
      },
    ],
  },
  {
    heading: "Pandas Essentials",
    items: [
      {
        term: "Missing values",
        note: "isna() returns a boolean mask.",
        code: "import pandas as pd\ndf.isna().sum()          # per column\ndf.isna().sum().sum()    # total\ndf.fillna(0)             # replace NaN",
      },
      {
        term: "GroupBy",
        note: "Split → apply → combine.",
        code: "grouped = df.groupby('col')['val'].mean()\nprint(grouped['group_name'])",
      },
    ],
  },
  {
    heading: "Print Patterns",
    items: [
      {
        term: "Shape & size",
        note: "Always print shape before diving in.",
        code: "print(X.shape)          # (442, 10)\nprint(len(X_train))     # 353",
      },
      {
        term: "Rounded numbers",
        note: "Use round() for scalars, f-strings for labels.",
        code: "print(round(val, 2))\nprint(f\"Accuracy: {acc:.2f}\")\nprint(f\"R2: {r2:.2f}\")",
      },
      {
        term: "Space-separated counts",
        note: "print() separates args with a space by default.",
        code: "print(len(X_train), len(X_test))  # 353 89",
      },
    ],
  },
];

export default function CodingCheatSheet() {
  const [open, setOpen] = useState(false);

  return (
    <div className="code-ref">
      <button className="code-ref-toggle" onClick={() => setOpen((o) => !o)}>
        <span>Quick Reference</span>
        <span className="code-ref-chevron">{open ? "▴ hide" : "▾ show"}</span>
      </button>

      {open && (
        <>
          <div className="poster-toolbar" style={{ marginTop: 12 }}>
            <button className="ex-btn" onClick={() => window.print()}>
              ⎙ Print / Save as PDF
            </button>
          </div>

          <div className="poster" id="code-ref-poster">
            <div className="poster-accent-bar" />
            <div className="poster-inner">
              <header className="poster-head">
                <div className="poster-head-text">
                  <h1 className="poster-title">Coding Quick Reference</h1>
                  <p className="poster-tag">Common patterns for every exercise</p>
                </div>
                <div className="poster-head-meta">
                  {SECTIONS.length} sections<br />
                  All exercises<br />
                  Python / sklearn
                </div>
              </header>

              <div className="poster-grid cref-grid">
                {SECTIONS.map((section, si) => (
                  <section key={si} className="poster-section">
                    <h2 className="poster-section-head">
                      <span className="poster-section-num">
                        {String(si + 1).padStart(2, "0")}
                      </span>
                      {section.heading}
                    </h2>
                    <ul className="poster-items">
                      {section.items.map((item, ii) => (
                        <li key={ii} className="poster-item cref-item">
                          <span className="poster-term">{item.term}</span>
                          <span className="poster-note">{item.note}</span>
                          <pre className="cref-code">{item.code}</pre>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>

              <footer className="poster-foot">
                <span>Data Science Learning Platform · Coding Quick Reference</span>
                <span>Works in every exercise, every subject</span>
              </footer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
