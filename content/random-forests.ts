import { Subject } from "./types";

// ─────────────────────────────────────────────────────────────
//  RANDOM FORESTS — the template subject.
//  To create a new subject, copy this file, rename it, and
//  rewrite the content. The structure stays identical.
// ─────────────────────────────────────────────────────────────

export const randomForests: Subject = {
  slug: "random-forests",
  title: "Random Forests",
  icon: "tree",
  phase: 1,
  blurb:
    "An ensemble of decision trees that trades interpretability for accuracy and robustness. The workhorse of tabular machine learning.",
  sources: [
    "James, Witten, Hastie & Tibshirani — An Introduction to Statistical Learning (ISLR), 2nd ed., Ch. 8",
    "Hastie, Tibshirani & Friedman — The Elements of Statistical Learning (ESL), 2nd ed., Ch. 15",
    "Breiman, L. (2001) — Random Forests. Machine Learning 45(1)",
    "Breiman, L. (2001) — Statistical Modeling: The Two Cultures. Statistical Science 16(3)",
    "Géron, A. — Hands-On Machine Learning, 3rd ed., Ch. 7",
  ],

  // ═══════════════════════════════════════════════════════════
  //  THEORY
  // ═══════════════════════════════════════════════════════════
  theory: [
    // ── PAGE 1 — Intuition ──────────────────────────────────
    {
      badge: "Intuition · Page 1",
      title: "The Wisdom of a Crowd of Trees",
      blocks: [
        {
          kind: "para",
          html: "Imagine you face a hard yes/no decision and you ask one knowledgeable friend. They might be right, but they also have blind spots and quirks of judgement. Now imagine you ask a few hundred friends, each of whom looked at the problem slightly differently, and you go with the majority vote. As long as each friend is right more often than chance, and their mistakes are not all the same mistake, the crowd's vote is dramatically more reliable than any single friend. This is the entire idea behind a <em>random forest</em>.",
        },
        {
          kind: "para",
          html: "The individual friend is a <em>decision tree</em>: a model that asks a sequence of yes/no questions about the data (\"is petal length &lt; 2.5cm?\") and follows the branches down to a prediction. A single tree is easy to understand but unstable — change the training data a little and the tree can change a lot. A random forest builds hundreds of such trees, each on a slightly different slice of the data, and averages them. The result is far more accurate and far more stable than any one tree.",
        },
        {
          kind: "callout",
          tone: "purple",
          title: "The Two Cultures (Breiman, 2001)",
          html: "Leo Breiman drew a line between two ways of doing statistics. The <em>data modeling</em> culture assumes the data come from a known stochastic model (a linear regression, say) and tries to estimate its parameters. The <em>algorithmic modeling</em> culture treats the true mechanism as unknown and unknowable, and simply seeks an algorithm that predicts well. Random forests are a flagship of the second culture: they make almost no assumptions about the shape of the relationship, and they win on accuracy by giving up the clean, interpretable equation.",
        },
        {
          kind: "heading",
          text: "Why not just use one big tree?",
        },
        {
          kind: "para",
          html: "A single deep tree will happily memorise its training data — it can keep splitting until every leaf holds one observation, achieving zero training error and miserable test error. This is <em>overfitting</em>: the model has learned the noise, not the signal. You can prune the tree to fight this, but then you lose accuracy. Random forests resolve the dilemma differently: instead of one carefully-pruned tree, grow many unpruned, overfit trees on different data and average away their individual errors.",
        },
        {
          kind: "callout",
          tone: "teal",
          title: "Where you'll meet them",
          html: "Random forests are a default first choice for <em>structured / tabular</em> data — spreadsheets of numbers and categories. Credit scoring, churn prediction, medical risk models, fraud detection, ecology, genomics. For images, audio and text, neural networks dominate; for tabular data, forests and gradient-boosted trees are still extremely hard to beat.",
        },
      ],
    },

    // ── PAGE 2 — The single tree ────────────────────────────
    {
      badge: "Foundations · Page 2",
      title: "The Building Block: a Decision Tree",
      blocks: [
        {
          kind: "para",
          html: "You cannot understand a forest without first understanding a single tree. A decision tree partitions the feature space into rectangular regions, and predicts a constant within each region — the mean of the training responses (regression) or the majority class (classification).",
        },
        {
          kind: "heading",
          text: "How a split is chosen: regression",
        },
        {
          kind: "para",
          html: "The tree is grown by <em>recursive binary splitting</em>. At each step it considers every feature and every possible cut-point, and picks the one split that most reduces the prediction error. For regression, error is the Residual Sum of Squares — the total squared distance between observations and their region's mean:",
        },
        {
          kind: "equation",
          label: "Residual Sum of Squares",
          tex: "RSS = \\sum_{j=1}^{J} \\sum_{i \\in R_j} \\left(y_i - \\hat{y}_{R_j}\\right)^2",
        },
        {
          kind: "para",
          html: "Here \\(R_j\\) is the \\(j\\)-th region (a leaf of the tree) and \\(\\hat{y}_{R_j}\\) is the mean response of the training points that fall in it. The algorithm is <em>greedy</em>: it takes the best split available right now, without looking ahead, because searching all possible trees is computationally impossible.",
        },
        {
          kind: "heading",
          text: "How a split is chosen: classification",
        },
        {
          kind: "para",
          html: "For classification we cannot use RSS, so we measure the <em>impurity</em> of a region — how mixed its classes are. A region containing only one class is pure (impurity 0); a 50/50 mix is maximally impure. The two standard measures are the Gini index and cross-entropy:",
        },
        {
          kind: "equation",
          label: "Gini index for a region",
          tex: "G = \\sum_{k=1}^{K} \\hat{p}_{k}(1 - \\hat{p}_{k})",
        },
        {
          kind: "para",
          html: "where \\(\\hat{p}_{k}\\) is the proportion of class \\(k\\) in the region. The tree chooses splits that minimise the (weighted) impurity of the resulting children. Gini and entropy almost always produce very similar trees; Gini is marginally cheaper to compute and is scikit-learn's default.",
        },
        {
          kind: "callout",
          tone: "amber",
          title: "The strength and the weakness",
          html: "A single tree is wonderfully interpretable — you can literally read the decision path. But it is a <em>high-variance</em> model: small changes in the training set can flip early splits and reshape the whole tree. High variance is precisely the disease that averaging cures, which is why trees are the perfect raw material for an ensemble.",
        },
      ],
    },

    // ── PAGE 3 — Bagging ────────────────────────────────────
    {
      badge: "Mechanism · Page 3",
      title: "Bagging: Averaging Away the Variance",
      blocks: [
        {
          kind: "para",
          html: "The first ingredient of a random forest is <em>bagging</em> — bootstrap aggregating. The logic is a basic fact of statistics: averaging reduces variance. If you have \\(B\\) independent observations each with variance \\(\\sigma^2\\), the variance of their mean is \\(\\sigma^2 / B\\). Average more things, get a more stable result.",
        },
        {
          kind: "para",
          html: "But we only have one training set, not \\(B\\) of them. Bagging manufactures diversity using the <em>bootstrap</em>: to build each tree, draw a random sample of size \\(n\\) <em>with replacement</em> from the \\(n\\) training rows. Each bootstrap sample omits roughly a third of the original rows and duplicates others, so every tree sees a slightly different dataset and grows differently.",
        },
        {
          kind: "equation",
          label: "Bagged prediction (regression)",
          tex: "\\hat{f}_{\\text{bag}}(x) = \\frac{1}{B}\\sum_{b=1}^{B} \\hat{f}^{*b}(x)",
        },
        {
          kind: "para",
          html: "For classification we take a majority vote across the \\(B\\) trees instead of an average. Crucially, we grow each tree <em>deep and unpruned</em>: deliberately overfit, low-bias, high-variance individual trees, then let averaging knock the variance down.",
        },
        {
          kind: "callout",
          tone: "teal",
          title: "A free validation set: Out-of-Bag error",
          html: "Because each bootstrap sample leaves out about a third of the rows, every observation is \"out-of-bag\" for roughly a third of the trees. We can predict each row using only the trees that never saw it, and average the error over all rows. This <em>OOB error</em> is an almost-free, nearly-unbiased estimate of test error — no separate validation split required. It is one of the most elegant features of the whole method.",
        },
      ],
    },

    // ── PAGE 4 — The random twist ───────────────────────────
    {
      badge: "Mechanism · Page 4",
      title: "The Random Twist: Decorrelating the Trees",
      blocks: [
        {
          kind: "para",
          html: "Bagging alone is not quite a random forest. There is a subtle problem. If one feature is very strongly predictive, then almost every bagged tree will choose it for its first split. The trees end up looking alike — they are <em>correlated</em> — and correlated trees do not average well.",
        },
        {
          kind: "para",
          html: "ESL makes this precise. The variance of the average of \\(B\\) identically distributed (but correlated) trees, each with variance \\(\\sigma^2\\) and pairwise correlation \\(\\rho\\), is:",
        },
        {
          kind: "equation",
          label: "Variance of correlated average (ESL)",
          tex: "\\rho\\,\\sigma^2 + \\frac{1-\\rho}{B}\\,\\sigma^2",
        },
        {
          kind: "para",
          html: "Look at what happens as \\(B \\to \\infty\\): the second term vanishes, but the first term, \\(\\rho\\sigma^2\\), does not. Adding more trees cannot push variance below \\(\\rho\\sigma^2\\). The only way to drive variance lower is to <em>reduce the correlation</em> \\(\\rho\\) between trees.",
        },
        {
          kind: "callout",
          tone: "purple",
          title: "Breiman's idea (2001)",
          html: "At <em>each split</em>, instead of considering all \\(p\\) features, consider only a random subset of \\(m\\) of them. A strong predictor is now absent from many splits, giving other features a chance to shine. The trees become genuinely different from one another — \\(\\rho\\) drops — and the ensemble average becomes more accurate. That single modification turns bagging into a random forest.",
        },
        {
          kind: "heading",
          text: "Choosing m",
        },
        {
          kind: "table",
          headers: ["Task", "Common default for m", "Effect"],
          rows: [
            ["Classification", "m ≈ √p", "Strong decorrelation; the standard starting point"],
            ["Regression", "m ≈ p/3", "Trees need a few more features to predict well"],
            ["m = p", "(all features)", "Reduces to ordinary bagging — trees re-correlate"],
          ],
        },
        {
          kind: "para",
          html: "Smaller \\(m\\) means more decorrelation but weaker individual trees; larger \\(m\\) means stronger trees but more correlation. The defaults above are robust, and \\(m\\) is the one tuning knob most worth adjusting with cross-validation.",
        },
      ],
    },

    // ── PAGE 5 — Strengths, weaknesses, importance ──────────
    {
      badge: "Trade-offs · Page 5",
      title: "Benefits, Drawbacks & Interpretation",
      blocks: [
        {
          kind: "para",
          html: "No model is free of cost. The accuracy and robustness of a random forest are bought with computation and opacity. Knowing exactly what you gain and lose is what separates someone who <em>uses</em> the method from someone who merely calls the function.",
        },
        {
          kind: "table",
          headers: ["Benefits", "Drawbacks"],
          rows: [
            ["Strong accuracy out-of-the-box, little tuning needed", "A forest of hundreds of trees is a black box — no readable rule"],
            ["Robust to outliers and irrelevant features", "Memory- and compute-heavy at training and prediction time"],
            ["Handles mixed numeric/categorical data, no scaling needed", "Large trained model; slow for low-latency serving"],
            ["Built-in OOB error estimate, no separate validation split", "Can be outperformed by gradient boosting on clean tabular data"],
            ["Captures non-linearities and interactions automatically", "Extrapolates poorly — cannot predict outside the training range"],
          ],
        },
        {
          kind: "heading",
          text: "Getting interpretability back: feature importance",
        },
        {
          kind: "para",
          html: "We lost the readable decision path, but we can still ask which features mattered. <em>Impurity-based importance</em> totals how much each feature reduced impurity across all splits in all trees. It is fast but biased toward high-cardinality features. <em>Permutation importance</em> is more trustworthy: shuffle one feature's values and measure how much OOB accuracy drops — a feature the model relies on will cause a large drop when scrambled.",
        },
        {
          kind: "callout",
          tone: "red",
          title: "The extrapolation trap",
          html: "Because a tree predicts the mean of a leaf, a forest can never output a value larger or smaller than what it saw in training. Forecasting a time series with a rising trend, or any target that moves outside the historical range, is a classic misuse. For genuine extrapolation, reach for a model with a functional form — linear or spline regression — not a forest.",
        },
        {
          kind: "callout",
          tone: "teal",
          title: "When to choose it",
          html: "Reach for a random forest when you have tabular data, want a strong baseline fast, and value robustness over a tidy explanation. Reach elsewhere when you need extrapolation, a transparent rule a regulator can read, millisecond inference, or the last few points of accuracy that gradient boosting (XGBoost, LightGBM) often provides.",
        },
      ],
    },
  ],

  // ═══════════════════════════════════════════════════════════
  //  QUIZ — theory check
  // ═══════════════════════════════════════════════════════════
  quiz: [
    {
      id: "rf-q1",
      question:
        "Why does a random forest grow each individual tree deep and unpruned, instead of carefully pruning it?",
      options: [
        "Pruning is computationally infeasible when growing hundreds of trees simultaneously in parallel",
        "Without pruning each tree overfits equally, which cancels out when the predictions are averaged",
        "Pruned trees lose the ability to use the bootstrap sample, preventing accurate OOB error estimation",
        "Deep trees have low bias; averaging across many of them removes the resulting high variance"
      ],
      correctIndex: 3,
      explanation:
        "Each tree is deliberately low-bias / high-variance. A single such tree overfits, but averaging many of them cancels the variance while keeping the low bias. Pruning would raise bias — the wrong trade for an ensemble.",
    },
    {
      id: "rf-q2",
      question:
        "From the ESL variance formula ρσ² + (1−ρ)/B · σ², what limits how much accuracy you gain by adding more trees?",
      options: [
        "The correlation ρ between trees, since ρσ² does not shrink as B grows",
        "Nothing — adding more trees always reduces variance toward zero regardless of ρ",
        "The individual tree bias σ², which increases as B grows because the bootstrap samples overlap more",
        "The number of features p — when p is small there are not enough split options to create diverse trees"
      ],
      correctIndex: 0,
      explanation:
        "As B → ∞ the second term vanishes but ρσ² remains. Adding trees cannot push variance below ρσ². This is exactly why random forests decorrelate trees by restricting features per split.",
    },
    {
      id: "rf-q3",
      question:
        "What is the key difference between plain bagging and a random forest?",
      options: [
        "Random forests consider only a random subset of m features at each split",
        "Plain bagging uses bootstrap resampling of rows; random forests resample rows and columns jointly",
        "Bagging trains trees sequentially so each corrects the last, while random forests train in parallel",
        "Random forests grow deeper trees than bagging, which uses a fixed maximum depth for interpretability"
      ],
      correctIndex: 0,
      explanation:
        "Both use bootstrap resampling. The defining addition of the random forest is restricting each split to a random subset of m features, which decorrelates the trees and lowers ρ.",
    },
    {
      id: "rf-q4",
      question: "What does the out-of-bag (OOB) error estimate provide?",
      options: [
        "A nearly-unbiased test-error estimate using, for each row, only the trees that did not train on it",
        "The average training error across all trees, weighted by each tree's depth",
        "The fraction of trees that agree on the majority class for each training example",
        "A regularisation penalty that penalises forests for having too many trees relative to the dataset size"
      ],
      correctIndex: 0,
      explanation:
        "Each bootstrap sample omits ~1/3 of rows. Predicting each row with only the trees that never saw it yields a free, nearly-unbiased estimate of generalisation error — no separate validation set needed.",
    },
    {
      id: "rf-q5",
      question:
        "Which task is a random forest LEAST suited to, by design?",
      options: [
        "Predicting a target that lies outside the range seen in training (extrapolation)",
        "Capturing non-linear interactions among features without explicit feature engineering",
        "Classifying tabular data with a mixture of numeric, ordinal, and nominal features",
        "Generating a strong baseline model quickly with minimal hyperparameter tuning"
      ],
      correctIndex: 0,
      explanation:
        "A forest predicts the mean of a leaf, so it can never output a value beyond the training range. Extrapolation is a structural limitation — use a model with a functional form instead.",
    },
  ],

  // ═══════════════════════════════════════════════════════════
  //  CODING EXERCISES — multi-part, each step checked in context
  // ═══════════════════════════════════════════════════════════
  exercises: [
    {
      id: "rf-ex1",
      title: "Build a Random Forest on Iris",
      intro:
        "Build and evaluate a random forest on the classic Iris dataset, one step at a time. Each part adds to the last.",
      parts: [
        {
          id: "rf-ex1-a",
          label: "a",
          prompt:
            "Load the Iris dataset with sklearn's load_iris(return_X_y=True) into X and y, then print X.shape. (Expected: (150, 4))",
          starterCode:
            "from sklearn.datasets import load_iris\n\n# YOUR CODE HERE\n",
          expectedStdout: "(150, 4)",
          hints: [
            "load_iris(return_X_y=True) returns two things: the feature matrix X and the labels y.",
            "X, y = load_iris(return_X_y=True), then print(X.shape).",
          ],
          solution:
            "from sklearn.datasets import load_iris\nX, y = load_iris(return_X_y=True)\nprint(X.shape)",
        },
        {
          id: "rf-ex1-b",
          label: "b",
          prompt:
            "Split the data 80/20 with train_test_split (random_state=42). Print the number of training and test rows, separated by a space. (Expected: 120 30)",
          starterCode:
            "from sklearn.model_selection import train_test_split\n\n# YOUR CODE HERE\n",
          expectedStdout: "120 30",
          hints: [
            "train_test_split(X, y, test_size=0.2, random_state=42) returns four arrays.",
            "print(len(X_train), len(X_test)) — two values, printed with a space between them.",
          ],
          solution:
            "from sklearn.model_selection import train_test_split\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\nprint(len(X_train), len(X_test))",
        },
        {
          id: "rf-ex1-c",
          label: "c",
          prompt:
            "Create a RandomForestClassifier with 100 trees (random_state=42) and fit it on the training data. Print 'trained:' followed by clf.n_estimators. (Expected: trained: 100)",
          starterCode:
            "from sklearn.ensemble import RandomForestClassifier\n\n# YOUR CODE HERE\n",
          expectedStdout: "trained: 100",
          hints: [
            "clf = RandomForestClassifier(n_estimators=100, random_state=42)",
            "clf.fit(X_train, y_train), then print('trained:', clf.n_estimators).",
          ],
          solution:
            "from sklearn.ensemble import RandomForestClassifier\nclf = RandomForestClassifier(n_estimators=100, random_state=42)\nclf.fit(X_train, y_train)\nprint('trained:', clf.n_estimators)",
        },
        {
          id: "rf-ex1-d",
          label: "d",
          prompt:
            "Predict on the test set and print the accuracy rounded to 2 decimals, in the form 'Accuracy: 1.00'. (Expected: Accuracy: 1.00)",
          starterCode:
            "from sklearn.metrics import accuracy_score\n\n# YOUR CODE HERE\n",
          expectedStdout: "Accuracy: 1.00",
          hints: [
            "Use clf.predict(X_test) to get predictions.",
            "acc = accuracy_score(y_test, clf.predict(X_test))",
            'print(f"Accuracy: {acc:.2f}")',
          ],
          solution:
            'from sklearn.metrics import accuracy_score\nacc = accuracy_score(y_test, clf.predict(X_test))\nprint(f"Accuracy: {acc:.2f}")',
        },
      ],
    },
  ],

  // ═══════════════════════════════════════════════════════════
  //  CHEAT SHEET — quick reference recap
  // ═══════════════════════════════════════════════════════════
  cheatsheet: [
    {
      heading: "Core Idea",
      items: [
        { term: "Random forest", note: "An ensemble of many decision trees, averaged (regression) or majority-voted (classification)." },
        { term: "Two cultures", note: "Algorithmic modelling — predict well without assuming the data's true mechanism (Breiman, 2001)." },
        { term: "Why ensembles", note: "Averaging many low-bias, high-variance trees cancels their variance while keeping low bias." },
      ],
    },
    {
      heading: "The Single Tree",
      items: [
        { term: "Recursive binary splitting", note: "Greedily pick the feature + cut-point that most reduces error at each node." },
        { term: "RSS", note: "Regression split criterion: total squared distance from each region's mean.", formula: "\\sum_{j}\\sum_{i \\in R_j}(y_i - \\hat{y}_{R_j})^2" },
        { term: "Gini / entropy", note: "Classification impurity; minimise the weighted impurity of child nodes.", formula: "G = \\sum_{k} \\hat{p}_k(1-\\hat{p}_k)" },
        { term: "High variance", note: "A single tree is unstable — small data changes reshape it. This is what averaging fixes." },
      ],
    },
    {
      heading: "Forest Mechanics",
      items: [
        { term: "Bagging", note: "Bootstrap aggregating — average trees trained on resampled data.", formula: "\\hat{f}_{bag}(x) = \\tfrac{1}{B}\\sum_{b=1}^{B}\\hat{f}^{*b}(x)" },        { term: "Bootstrap sample", note: "Size-n draw with replacement; omits ~1/3 of rows (the out-of-bag rows)." },
        { term: "OOB error", note: "Free, nearly-unbiased test estimate using, per row, only the trees that didn't see it." },
        { term: "Feature subsampling", note: "Consider only m random features per split — the defining 'random' twist." },
        { term: "m (mtry)", note: "≈√p for classification, ≈p/3 for regression. The main tuning knob." },
        { term: "Decorrelation", note: "Restricting features lowers tree correlation ρ — the floor on variance.", formula: "\\rho\\sigma^2 + \\tfrac{1-\\rho}{B}\\sigma^2" },      ],
    },
    {
      heading: "Using It Well",
      items: [
        { term: "Feature importance", note: "Impurity-based (fast, biased) or permutation (shuffle a feature, measure OOB drop)." },
        { term: "Strengths", note: "Strong default accuracy, robust, no scaling, handles mixed data, built-in validation." },
        { term: "Drawbacks", note: "Opaque, compute/memory-heavy, slow inference, beaten by boosting on clean tabular data." },
        { term: "Extrapolation trap", note: "Predicts leaf means — can never output values beyond the training range." },
        { term: "When to choose", note: "Tabular data, fast strong baseline, robustness over interpretability." },
      ],
    },
  ],
};