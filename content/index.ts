import { Subject } from "./types";

// Phase 0 — Foundations
import { statisticsProbability } from "./statistics-probability";
import { linearAlgebra } from "./linear-algebra";
import { calculusOptimization } from "./calculus-optimization";
import { dataWrangling } from "./data-wrangling";
import { hypothesisTesting } from "./hypothesis-testing";

// Phase 1 — Core supervised learning
import { linearRegression } from "./linear-regression";
import { logisticRegression } from "./logistic-regression";
import { kNearestNeighbours } from "./k-nearest-neighbours";
import { supportVectorMachines } from "./support-vector-machines";
import { randomForests } from "./random-forests";
import { gradientBoosting } from "./gradient-boosting";

// Phase 2 — Model evaluation & selection
import { biasVarianceTradeoff } from "./bias-variance-tradeoffs";
import { crossValidation } from "./cross-validation";
import { classificationMetrics } from "./classification-metrics";

// Phase 3 — Unsupervised learning
import { kMeans } from "./k-means";
import { principalComponentAnalysis } from "./principal-component-analysis";
import { dbscan } from "./dbscan";

// Phase 4 — Deep learning
import { neuralNetworks } from "./neural-networks";
import { convolutionalNeuralNetworks } from "./convolutional-neural-networks";
import { transformers } from "./transformers";

// Phase 5 — Advanced topics
import { timeSeries } from "./time-series";
import { nlpFundamentals } from "./nlp-fundamentals";
import { recommenderSystems } from "./recommender-systems";

// Phase 6 — Capstone
import { capstoneProject } from "./capstone-project";

// ─────────────────────────────────────────────────────────────
//  THE ONE PLACE to register a subject.
// ─────────────────────────────────────────────────────────────
export const SUBJECTS: Subject[] = [
  // Phase 0 — Foundations
  statisticsProbability,
  linearAlgebra,
  calculusOptimization,
  dataWrangling,
  hypothesisTesting,
  // Phase 1 — Core supervised learning
  linearRegression,
  logisticRegression,
  kNearestNeighbours,
  supportVectorMachines,
  randomForests,
  gradientBoosting,
  // Phase 2 — Model evaluation & selection
  biasVarianceTradeoff,
  crossValidation,
  classificationMetrics,
  // Phase 3 — Unsupervised learning
  kMeans,
  principalComponentAnalysis,
  dbscan,
  // Phase 4 — Deep learning
  neuralNetworks,
  convolutionalNeuralNetworks,
  transformers,
  // Phase 5 — Advanced topics
  timeSeries,
  nlpFundamentals,
  recommenderSystems,
  // Phase 6 — Capstone
  capstoneProject,
];

// Lookup by slug, used by the dynamic route.
export const SUBJECTS_BY_SLUG: Record<string, Subject> = Object.fromEntries(
  SUBJECTS.map((s) => [s.slug, s])
);
