"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";

const FURTHER_READING = [
  {
    category: "Foundations",
    items: [
      {
        title: "The Elements of Statistical Learning",
        authors: "Hastie, Tibshirani, Friedman",
        desc: "The canonical graduate-level ML textbook. Dense but definitive — the reference you'll come back to.",
        url: "https://hastie.su.domains/ElemStatLearn/",
        free: true,
      },
      {
        title: "Mathematics for Machine Learning",
        authors: "Deisenroth, Faisal, Ong",
        desc: "Covers linear algebra, multivariate calculus, and probability from first principles, tied directly to ML.",
        url: "https://mml-book.github.io/",
        free: true,
      },
    ],
  },
  {
    category: "Deep Learning & Transformers",
    items: [
      {
        title: "Deep Learning",
        authors: "Goodfellow, Bengio, Courville",
        desc: "The deep learning textbook — covers backprop, CNNs, RNNs, attention, and generative models.",
        url: "https://www.deeplearningbook.org/",
        free: true,
      },
      {
        title: "Attention Is All You Need",
        authors: "Vaswani et al., 2017",
        desc: "The original Transformer paper. Short, clear, and foundational — a must-read now that you know the math.",
        url: "https://arxiv.org/abs/1706.03762",
        free: true,
      },
      {
        title: "The Illustrated Transformer",
        authors: "Jay Alammar",
        desc: "The best visual walkthrough of the Transformer architecture. Great companion to the paper.",
        url: "https://jalammar.github.io/illustrated-transformer/",
        free: true,
      },
    ],
  },
  {
    category: "Practical ML & Engineering",
    items: [
      {
        title: "Hands-On Machine Learning (3rd ed.)",
        authors: "Aurélien Géron",
        desc: "Best practical book for sklearn + Keras. Covers the full pipeline with real code.",
        url: "https://www.oreilly.com/library/view/hands-on-machine-learning/9781098125967/",
        free: false,
      },
      {
        title: "Designing Machine Learning Systems",
        authors: "Chip Huyen",
        desc: "Production ML — data pipelines, training loops, monitoring, deployment. The gap most courses don't cover.",
        url: "https://www.oreilly.com/library/view/designing-machine-learning/9781098107956/",
        free: false,
      },
      {
        title: "Made With ML",
        authors: "Goku Mohandas",
        desc: "Free end-to-end MLOps course covering production pipelines, testing, and deployment.",
        url: "https://madewithml.com/",
        free: true,
      },
    ],
  },
  {
    category: "Recommender Systems",
    items: [
      {
        title: "Recommender Systems Handbook",
        authors: "Ricci et al.",
        desc: "Comprehensive academic reference covering CF, content-based, knowledge-based, and hybrid approaches.",
        url: "https://link.springer.com/book/10.1007/978-1-0716-2197-4",
        free: false,
      },
      {
        title: "Neural Collaborative Filtering",
        authors: "He et al., 2017",
        desc: "Paper introducing neural nets into matrix factorisation — the foundation of modern deep recommenders.",
        url: "https://arxiv.org/abs/1708.05031",
        free: true,
      },
    ],
  },
  {
    category: "Research & Staying Current",
    items: [
      {
        title: "Papers With Code",
        authors: "paperswithcode.com",
        desc: "Every major ML paper with linked implementations. The fastest way to find SOTA for any task.",
        url: "https://paperswithcode.com/",
        free: true,
      },
      {
        title: "Andrej Karpathy's YouTube",
        authors: "Andrej Karpathy",
        desc: "Zero-to-hero neural network series — builds everything from scratch including GPT. Exceptional.",
        url: "https://www.youtube.com/@AndrejKarpathy",
        free: true,
      },
      {
        title: "distill.pub",
        authors: "Various",
        desc: "Long-form interactive ML articles with beautiful visualisations. Quality over quantity.",
        url: "https://distill.pub/",
        free: true,
      },
    ],
  },
];

export default function CompletePage() {
  const { user } = useAuth();
  const displayName = user?.user_metadata?.display_name || user?.email?.split("@")[0] || null;

  return (
    <div className="complete-page">
      <header className="complete-topnav">
        <Link href="/" className="shell-back">← Back to platform</Link>
        <Link href="/dashboard" className="shell-account">Dashboard</Link>
      </header>

      <main className="complete-body">
        {/* Hero */}
        <section className="complete-hero">
          <div className="complete-trophy">🏆</div>
          <h1 className="complete-title">
            {displayName ? `Congratulations, ${displayName}!` : "Congratulations!"}
          </h1>
          <p className="complete-subtitle">
            You've completed the entire Data Science program — all 6 phases, from probability
            and linear algebra through transformers, recommenders, and a full end-to-end
            Titanic pipeline.
          </p>
          <div className="complete-stats-row">
            <div className="complete-stat">
              <span className="complete-stat-num">6</span>
              <span className="complete-stat-label">Phases completed</span>
            </div>
            <div className="complete-stat">
              <span className="complete-stat-num">100%</span>
              <span className="complete-stat-label">Program mastered</span>
            </div>
            <div className="complete-stat">
              <span className="complete-stat-num">🇳🇱</span>
              <span className="complete-stat-label">Easter egg found</span>
            </div>
          </div>
        </section>

        {/* What this means */}
        <section className="complete-section">
          <h2 className="complete-section-title">What you now know</h2>
          <div className="complete-phase-list">
            {[
              { num: 0, color: "#2ed2b6", label: "Foundations", summary: "Probability, linear algebra, calculus, and data wrangling — the mathematical bedrock." },
              { num: 1, color: "#6c63ff", label: "Core Models", summary: "Regression, decision trees, SVMs, and ensembles. How and why each model generalises." },
              { num: 2, color: "#e0a127", label: "Model Evaluation", summary: "Bias–variance, cross-validation, ROC, precision/recall. You can evaluate honestly." },
              { num: 3, color: "#15a86b", label: "Unsupervised", summary: "K-means, PCA, DBSCAN. Finding structure without labels." },
              { num: 4, color: "#db5757", label: "Deep Learning", summary: "Backprop, CNNs, Transformers, LoRA. Neural architectures from first principles." },
              { num: 5, color: "#9fe6c4", label: "Advanced Topics", summary: "Time series, NLP, recommender systems. Production-oriented techniques." },
              { num: 6, color: "#f0c060", label: "Capstone", summary: "End-to-end on Titanic. Pipeline, feature engineering, evaluation, and Dutch cities." },
            ].map((ph) => (
              <div key={ph.num} className="complete-phase-item">
                <div className="complete-phase-dot" style={{ background: ph.color }} />
                <div>
                  <div className="complete-phase-label" style={{ color: ph.color }}>
                    Phase {ph.num} — {ph.label}
                  </div>
                  <div className="complete-phase-summary">{ph.summary}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Where to go next */}
        <section className="complete-section">
          <h2 className="complete-section-title">Further reading</h2>
          <p className="complete-intro-text">
            This program covered a lot of ground, but data science is a field that keeps moving.
            These resources are what I&apos;d recommend next — curated rather than exhaustive.
          </p>
          {FURTHER_READING.map((cat) => (
            <div key={cat.category} className="complete-reading-group">
              <h3 className="complete-reading-cat">{cat.category}</h3>
              <div className="complete-reading-list">
                {cat.items.map((item) => (
                  <a
                    key={item.url}
                    href={item.url}
                    className="complete-reading-card"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="complete-reading-header">
                      <span className="complete-reading-title">{item.title}</span>
                      {item.free && <span className="complete-reading-free">Free</span>}
                    </div>
                    <div className="complete-reading-authors">{item.authors}</div>
                    <div className="complete-reading-desc">{item.desc}</div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Sign-off */}
        <section className="complete-signoff">
          <p>
            You put in the work. The math made sense, the code ran, and somewhere in Phase 6
            you smiled at a comment written in Dutch. That&apos;s the whole program.
          </p>
          <p>
            Good luck with whatever you build next. — <strong>Ties</strong>
          </p>
          <div className="complete-signoff-links">
            <Link href="/dashboard" className="complete-cta">View your progress</Link>
            <Link href="/about" className="complete-cta complete-cta-ghost">About the creator</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
