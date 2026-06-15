import React from "react";

const common = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};
const dot = { fill: "currentColor", stroke: "none" };

const ICONS: Record<string, React.ReactNode> = {
  statistics: (
    <>
      <path d="M6 34 L34 34 M6 6 L6 34" {...common} />
      <circle cx="12" cy="14" r="3" {...dot} />
      <circle cx="26" cy="10" r="3" {...dot} />
      <circle cx="20" cy="26" r="3" {...dot} />
      <circle cx="31" cy="28" r="3" {...dot} />
    </>
  ),
  matrix: (
    <>
      <rect x="7" y="7" width="11" height="11" rx="2" {...dot} />
      <rect x="22" y="7" width="11" height="11" rx="2" {...common} />
      <rect x="7" y="22" width="11" height="11" rx="2" {...common} />
      <rect x="22" y="22" width="11" height="11" rx="2" {...dot} />
    </>
  ),
  calculus: (
    <>
      <path d="M6 8 C6 26 14 32 34 32" {...common} />
      <circle cx="26" cy="24" r="3.2" {...dot} />
    </>
  ),
  funnel: (
    <path
      d="M10 6 L30 6 L22 19 L22 31 L18 34 L18 19 Z"
      {...common}
      fill="currentColor"
      fillOpacity={0.25}
    />
  ),
  flask: (
    <>
      <path
        d="M16 6 L24 6 L24 16 L31 30 Q32 34 28 34 L12 34 Q8 34 9 30 L16 16 Z"
        {...common}
        fill="currentColor"
        fillOpacity={0.25}
      />
      <path d="M13 23 L27 23" {...common} />
    </>
  ),
  regression: (
    <>
      <path d="M6 30 L34 12" {...common} />
      <circle cx="12" cy="27" r="2.6" {...dot} />
      <circle cx="20" cy="22" r="2.6" {...dot} />
      <circle cx="28" cy="16" r="2.6" {...dot} />
    </>
  ),
  tree: (
    <>
      <path d="M20 6 L20 34 M20 14 L12 22 M20 14 L28 22 M12 22 L12 30 M28 22 L28 30" {...common} />
      <circle cx="20" cy="6" r="2.6" {...dot} />
      <circle cx="12" cy="30" r="2.6" {...dot} />
      <circle cx="28" cy="30" r="2.6" {...dot} />
    </>
  ),
  sigmoid: (
    <>
      <path d="M5 30 C14 30 14 10 20 10 C26 10 26 30 35 30" {...common} />
      <circle cx="20" cy="20" r="2.4" {...dot} />
    </>
  ),
  neighbors: (
    <>
      <circle cx="20" cy="20" r="3.2" {...dot} />
      <circle cx="9" cy="12" r="2.4" {...common} />
      <circle cx="30" cy="11" r="2.4" {...common} />
      <circle cx="11" cy="30" r="2.4" {...common} />
      <circle cx="31" cy="29" r="2.4" {...common} />
      <path d="M20 20 L9 12 M20 20 L30 11 M20 20 L11 30 M20 20 L31 29" {...common} strokeWidth={1.4} />
    </>
  ),
  boosting: (
    <>
      <rect x="7" y="24" width="6" height="10" rx="1.5" {...dot} />
      <rect x="17" y="17" width="6" height="17" rx="1.5" {...common} />
      <rect x="27" y="9" width="6" height="25" rx="1.5" {...dot} />
    </>
  ),
  margin: (
    <>
      <path d="M8 32 L32 8" {...common} />
      <path d="M5 23 L23 5" {...common} strokeWidth={1.2} strokeDasharray="3 3" />
      <path d="M17 35 L35 17" {...common} strokeWidth={1.2} strokeDasharray="3 3" />
      <circle cx="11" cy="11" r="2.4" {...dot} />
      <circle cx="29" cy="29" r="2.4" {...dot} />
    </>
  ),
  // Phase 2 — Model Evaluation
  balance: (
    <>
      <path d="M20 8 L20 32" {...common} />
      <path d="M12 32 L28 32" {...common} />
      <path d="M8 18 L32 18" {...common} strokeWidth={1.2} />
      <circle cx="12" cy="14" r="5" {...common} />
      <circle cx="28" cy="22" r="5" {...common} />
      <path d="M20 8 L12 14 M20 8 L28 14" {...common} strokeWidth={1.4} />
    </>
  ),
  folds: (
    <>
      <rect x="7" y="7" width="26" height="26" rx="3" {...common} />
      <path d="M7 15 L33 15" {...common} strokeWidth={1.5} strokeDasharray="4 2" />
      <path d="M7 23 L33 23" {...common} strokeWidth={1.5} strokeDasharray="4 2" />
      <path d="M7 31 L33 31" {...common} strokeWidth={1.5} strokeDasharray="4 2" />
      <rect x="7" y="7" width="26" height="8" rx="3" fill="currentColor" fillOpacity={0.15} stroke="none" />
    </>
  ),
  gauge: (
    <>
      <path d="M8 28 A14 14 0 1 1 32 28" {...common} />
      <path d="M20 28 L14 16" {...common} strokeWidth={2.5} strokeLinecap="round" />
      <circle cx="20" cy="28" r="2.5" {...dot} />
      <path d="M9 28 L11 28" {...common} strokeWidth={1.5} />
      <path d="M31 28 L29 28" {...common} strokeWidth={1.5} />
      <path d="M20 14 L20 16" {...common} strokeWidth={1.5} />
    </>
  ),
  // Phase 3 — Unsupervised Learning
  cluster: (
    <>
      <circle cx="12" cy="12" r="4.5" {...common} />
      <circle cx="10" cy="26" r="3.5" {...common} />
      <circle cx="18" cy="19" r="3" {...common} />
      <circle cx="28" cy="10" r="3.5" {...common} />
      <circle cx="30" cy="28" r="4.5" {...common} />
      <circle cx="24" cy="22" r="3" {...common} />
      <path d="M12 12 L10 26 M12 12 L18 19 M10 26 L18 19" {...common} strokeWidth={1} strokeDasharray="2 2" />
      <path d="M28 10 L30 28 M28 10 L24 22 M30 28 L24 22" {...common} strokeWidth={1} strokeDasharray="2 2" />
    </>
  ),
  pca: (
    <>
      <path d="M6 34 L34 34 M6 6 L6 34" {...common} />
      <path d="M8 32 L32 8" {...common} strokeWidth={2.5} />
      <path d="M22 18 L26 10 M22 18 L30 22" {...common} strokeWidth={1.8} />
      <circle cx="12" cy="22" r="2.5" {...dot} />
      <circle cx="18" cy="26" r="2.5" {...dot} />
      <circle cx="24" cy="14" r="2.5" {...dot} />
      <circle cx="28" cy="18" r="2.5" {...dot} />
    </>
  ),
  dbscan: (
    <>
      <circle cx="12" cy="20" r="6" {...common} strokeDasharray="3 2" />
      <circle cx="28" cy="20" r="6" {...common} strokeDasharray="3 2" />
      <circle cx="12" cy="20" r="2.5" {...dot} />
      <circle cx="28" cy="20" r="2.5" {...dot} />
      <circle cx="8" cy="14" r="1.8" {...dot} />
      <circle cx="16" cy="14" r="1.8" {...dot} />
      <circle cx="10" cy="26" r="1.8" {...dot} />
      <circle cx="24" cy="14" r="1.8" {...dot} />
      <circle cx="32" cy="26" r="1.8" {...dot} />
      <circle cx="30" cy="13" r="1.8" {...dot} />
      <circle cx="20" cy="8" r="1.5" {...common} strokeWidth={1.5} />
    </>
  ),
  // Phase 4 — Deep Learning
  neural: (
    <>
      <circle cx="9" cy="12" r="3" {...common} />
      <circle cx="9" cy="28" r="3" {...common} />
      <circle cx="20" cy="9" r="3" {...common} />
      <circle cx="20" cy="20" r="3" {...common} />
      <circle cx="20" cy="31" r="3" {...common} />
      <circle cx="31" cy="20" r="3" {...common} />
      <path d="M12 12 L17 9 M12 12 L17 20 M12 12 L17 31 M12 28 L17 9 M12 28 L17 20 M12 28 L17 31" {...common} strokeWidth={1.1} />
      <path d="M23 9 L28 20 M23 20 L28 20 M23 31 L28 20" {...common} strokeWidth={1.1} />
    </>
  ),
  cnn: (
    <>
      <rect x="6" y="12" width="8" height="16" rx="2" {...common} />
      <rect x="16" y="10" width="8" height="20" rx="2" {...common} />
      <rect x="26" y="14" width="8" height="12" rx="2" {...dot} />
      <path d="M14 20 L16 20 M24 20 L26 20" {...common} strokeWidth={1.5} />
      <path d="M10 8 L10 6 M20 8 L20 6 M30 8 L30 6" {...common} strokeWidth={1.2} />
    </>
  ),
  transformer: (
    <>
      <circle cx="20" cy="20" r="7" {...common} />
      <path d="M20 13 L20 6 M20 27 L20 34" {...common} strokeWidth={1.5} />
      <path d="M13 20 L6 20 M27 20 L34 20" {...common} strokeWidth={1.5} />
      <circle cx="20" cy="6" r="2.5" {...dot} />
      <circle cx="20" cy="34" r="2.5" {...dot} />
      <circle cx="6" cy="20" r="2.5" {...dot} />
      <circle cx="34" cy="20" r="2.5" {...dot} />
    </>
  ),
  // Phase 5 — Advanced Topics
  timeseries: (
    <>
      <path d="M6 34 L34 34 M6 6 L6 34" {...common} />
      <path d="M7 28 C10 28 11 16 14 16 C17 16 18 22 21 20 C24 18 25 10 28 12 C31 14 32 20 33 18" {...common} strokeWidth={2} />
      <circle cx="14" cy="16" r="2" {...dot} />
      <circle cx="21" cy="20" r="2" {...dot} />
      <circle cx="28" cy="12" r="2" {...dot} />
    </>
  ),
  nlp: (
    <>
      <rect x="7" y="10" width="26" height="20" rx="4" {...common} />
      <path d="M12 17 L28 17 M12 22 L22 22" {...common} strokeWidth={1.8} />
      <path d="M24 24 L28 28 L24 28" {...common} strokeWidth={1.5} fill="currentColor" fillOpacity={0.3} />
    </>
  ),
  recommend: (
    <>
      <rect x="6" y="6" width="12" height="12" rx="3" {...common} />
      <rect x="22" y="6" width="12" height="12" rx="3" {...common} />
      <rect x="6" y="22" width="12" height="12" rx="3" {...common} />
      <rect x="22" y="22" width="12" height="12" rx="3" {...common} fill="currentColor" fillOpacity={0.2} />
      <path d="M18 12 L22 12 M12 18 L12 22 M28 18 L28 22 M18 28 L22 28" {...common} strokeWidth={1.4} />
      <path d="M18 12 Q20 20 28 12" {...common} strokeWidth={1.2} strokeDasharray="2 2" />
    </>
  ),
  capstone: (
    <>
      <circle cx="20" cy="20" r="13" {...common} />
      <path d="M20 7 L20 20 L28 28" {...common} strokeWidth={2} />
      <circle cx="20" cy="20" r="2.5" fill="currentColor" stroke="none" />
      <path d="M13 6 L8 11 M27 6 L32 11" {...common} strokeWidth={1.6} />
    </>
  ),
};

export default function SubjectIcon({
  name,
  size = 40,
}: {
  name: string;
  size?: number;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      {ICONS[name] ?? ICONS.matrix}
    </svg>
  );
}