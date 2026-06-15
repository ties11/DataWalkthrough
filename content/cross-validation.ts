import { Subject } from "./types";

export const crossValidation: Subject = {
  slug: "cross-validation",
  title: "Cross-Validation",
  icon: "folds",
  phase: 2,
  blurb:
    "How to trust a number. A single train/test split is one noisy opinion; cross-validation rotates the test set through the data for an honest, stable estimate of how a model will really perform.",
  sources: [
    "James, Witten, Hastie & Tibshirani — ISLR, 2nd ed., Ch. 5",
    "Hastie, Tibshirani & Friedman — ESL, 2nd ed., Ch. 7",
    "Géron, A. — Hands-On Machine Learning, 3rd ed., Ch. 2",
    "Kohavi, R. — A Study of Cross-Validation and Bootstrap (1995)",
  ],

  theory: [
    {
      badge: "Intuition · Page 1",
      title: "One Split Is One Opinion",
      blocks: [
        {
          kind: "para",
          html: "You train a model, test it on a held-out 20%, and get 91% accuracy. How much should you trust that number? Less than you might think. That 91% depends entirely on <em>which</em> rows happened to land in the test set. A different random split could give 87% or 94%. A single train/test split is one noisy opinion drawn from a lottery.",
        },
        {
          kind: "para",
          html: "Cross-validation replaces that single opinion with a panel. Instead of testing once, it tests many times on different slices of the data, then averages. The result is a far more stable and honest estimate of how the model will perform on data it has never seen — which is the only performance that actually matters.",
        },
        {
          kind: "callout",
          tone: "purple",
          title: "Why this matters",
          html: "Every model decision — which algorithm, which features, which hyperparameters — should be made by comparing honest performance estimates. Cross-validation is the tool that makes those estimates trustworthy. Get this wrong and you will confidently ship models that looked great on your lucky split and disappoint in production.",
        },
      ],
    },
    {
      badge: "Foundations · Page 2",
      title: "k-Fold Cross-Validation",
      blocks: [
        {
          kind: "para",
          html: "The standard recipe is <em>k-fold</em> cross-validation. Split the data into \\(k\\) equal parts (folds). Train on \\(k-1\\) of them, test on the one left out, and record the score. Repeat \\(k\\) times so every fold serves as the test set exactly once. Average the \\(k\\) scores.",
        },
        {
          kind: "equation",
          label: "Cross-validated score",
          tex: "\\text{CV score} = \\frac{1}{k}\\sum_{i=1}^{k} \\text{score}_i",
        },
        {
          kind: "para",
          html: "The beauty is that every data point is used for both training and testing — just never at the same time. With \\(k = 5\\), each point is tested once and trained on four times. You extract the maximum information from limited data while never letting a model see its own test answers.",
        },
        {
          kind: "callout",
          tone: "teal",
          title: "Choosing k",
          html: "\\(k = 5\\) or \\(k = 10\\) are the usual choices, balancing reliability against compute. Larger \\(k\\) means more training runs (slower) but a lower-bias estimate. The extreme, \\(k = n\\), is <em>leave-one-out</em> cross-validation: each point is its own test set. It is nearly unbiased but expensive and high-variance, so it is reserved for very small datasets.",
        },
      ],
    },
    {
      badge: "Mechanics · Page 3",
      title: "Stratification & Data Structure",
      blocks: [
        {
          kind: "para",
          html: "Plain random folds can betray you when the data has structure. Two cases come up constantly.",
        },
        {
          kind: "heading",
          text: "Imbalanced classes",
        },
        {
          kind: "para",
          html: "If only 5% of your samples are the positive class, a random fold might by chance contain almost none of them, making that fold's score meaningless. <em>Stratified</em> k-fold fixes this by ensuring each fold preserves the overall class proportions. For classification, stratified folds should be your default — scikit-learn's <code>cross_val_score</code> does this automatically for classifiers.",
        },
        {
          kind: "heading",
          text: "Grouped and time-series data",
        },
        {
          kind: "callout",
          tone: "red",
          title: "When random splitting leaks",
          html: "If your data has groups (multiple rows per patient, say), random folds can put the same patient in both train and test, leaking information and inflating scores. Use <em>group</em> k-fold to keep each group wholly on one side. For <em>time series</em>, never shuffle: you must train on the past and test on the future, or you leak tomorrow's information into today's model. Use time-series split instead.",
        },
      ],
    },
    {
      badge: "Practice · Page 4",
      title: "Cross-Validation for Model Selection",
      blocks: [
        {
          kind: "para",
          html: "Cross-validation's biggest role is not just estimating performance but <em>choosing</em> between options — models, features, hyperparameters. You cross-validate each candidate and pick the best average score.",
        },
        {
          kind: "callout",
          tone: "amber",
          title: "The danger of choosing on the test set",
          html: "Here is a subtle trap. If you use cross-validation to tune many hyperparameters, the winning configuration is partly fit to the quirks of your folds — so its CV score is slightly optimistic. The clean solution is a <em>held-out test set</em> touched only once at the very end, or <em>nested cross-validation</em>: an inner loop tunes, an outer loop honestly evaluates. The rule: the data you select on cannot also be the data you report on.",
        },
        {
          kind: "para",
          html: "This is why a typical workflow has three data roles: a <em>training</em> set to fit, a <em>validation</em> mechanism (cross-validation) to tune, and a <em>test</em> set to report final, untouched performance.",
        },
      ],
    },
    {
      badge: "Application · Page 5",
      title: "Putting It Together",
      blocks: [
        {
          kind: "table",
          headers: ["Variant", "Use when"],
          rows: [
            ["k-Fold", "The general default for plenty of data"],
            ["Stratified k-Fold", "Classification, especially imbalanced classes"],
            ["Leave-One-Out", "Very small datasets"],
            ["Group k-Fold", "Repeated measurements per subject/group"],
            ["Time-Series Split", "Temporal data — train past, test future"],
          ],
        },
        {
          kind: "callout",
          tone: "teal",
          title: "The practical payoff",
          html: "Cross-validation turns \"my model got 91%\" into \"my model gets 90% ± 2% across folds.\" That second statement is something you can actually act on: you know both the expected performance and how much it wobbles. The spread across folds is itself diagnostic — a large spread warns that your model is unstable or your dataset is small.",
        },
        {
          kind: "callout",
          tone: "amber",
          title: "What to carry forward",
          html: "Never trust a single split. Use k-fold (k = 5 or 10) to average over rotating test sets for an honest estimate. Stratify for classification, respect groups and time order to avoid leakage, and keep a final test set you select on never. Report the mean and the spread, not one lucky number.",
        },
      ],
    },
  ],

  quiz: [
    {
      id: "cv-q1",
      question: "Why is a single train/test split an unreliable measure of model performance?",
      options: [
        "The split can only be used once, which means the model can never be re-trained after evaluation",
        "The score depends on which rows randomly land in the test set, so it is noisy",
        "A single split prevents the model from seeing all classes, making recall undefined",
        "Using more training data reduces generalisation, so any fixed split wastes data"
      ],
      correctIndex: 1,
      explanation:
        "A single split's score is a lottery — it depends entirely on which rows happen to be held out. A different random split could give a noticeably different number. Cross-validation averages over many splits for stability.",
    },
    {
      id: "cv-q2",
      question: "In 5-fold cross-validation, how many times is each data point used for testing?",
      options: [
        "It depends on the class balance and whether stratification is used",
        "Five times — every data point appears in every fold's test set",
        "Exactly once",
        "Zero or one times, depending on whether it falls in the held-out fold by chance"
      ],
      correctIndex: 2,
      explanation:
        "The data is split into 5 folds; each fold serves as the test set exactly once while the other four train. So every point is tested once and trained on four times.",
    },
    {
      id: "cv-q3",
      question: "What problem does stratified k-fold cross-validation solve?",
      options: [
        "It preserves class proportions in each fold, crucial for imbalanced data",
        "It groups correlated observations together to prevent information leaking between folds",
        "It sorts folds chronologically so temporal models are never tested on past data",
        "It ensures each fold has an equal number of training samples, reducing variance across folds"
      ],
      correctIndex: 0,
      explanation:
        "Stratified folds keep the overall class balance in every fold. Without it, a random fold of imbalanced data might contain almost none of the minority class, making its score meaningless.",
    },
    {
      id: "cv-q4",
      question: "Why must you never shuffle time-series data before cross-validation?",
      options: [
        "Shuffling invalidates the stationarity assumption, causing feature scaling to fail",
        "Shuffling destroys autocorrelation structure, causing the model to underfit temporal patterns",
        "Shuffled time series cannot be split into equal-sized folds due to irregular spacing",
        "It would let the model train on future data and test on past — leaking information"
      ],
      correctIndex: 3,
      explanation:
        "Shuffling time series puts future points into training and past points into testing, leaking tomorrow's information into today's model. You must train on the past and test on the future using a time-series split.",
    },
    {
      id: "cv-q5",
      question: "Why keep a final test set separate even when using cross-validation to tune?",
      options: [
        "Cross-validation cannot use the full dataset, so a test set provides the remaining samples for training",
        "The test set is needed to compute precision and recall, which cross_val_score does not report",
        "Because the configuration chosen by CV is slightly optimistic; an untouched test set gives honest final performance",
        "Keeping a test set allows you to run more hyperparameter trials without increasing compute time",
      ],
      correctIndex: 2,
      explanation:
        "Tuning on CV folds fits the choice partly to their quirks, making the winning CV score optimistic. A test set touched only once (or nested CV) gives an honest final estimate. You can't select on the data you report on.",
    },
    {
      id: "cv-q6",
      question: "What is leave-one-out cross-validation (LOOCV)?",
      options: [
        "A variant of cross-validation that drops one feature column at a time to assess its importance",
        "A strategy that trains on a single sample to compute the worst-case generalisation error",
        "A method that permanently removes the most poorly performing fold from the final score average",
        "k-fold where k equals the number of samples — each point is its own test set"
      ],
      correctIndex: 3,
      explanation:
        "LOOCV sets k = n: each single data point is tested while all others train. It is nearly unbiased but expensive and high-variance, so it is mostly used on very small datasets.",
    },
    {
      id: "cv-q7",
      question: "What does a large spread of scores across folds tell you?",
      options: [
        "The learning rate is too high, causing different loss values in each fold's training run",
        "The model generalises very well — consistent performance across different data subsets",
        "The folds are overlapping, violating the assumption that each test set is independent",
        "The model is unstable or the dataset is small — performance is uncertain"
      ],
      correctIndex: 3,
      explanation:
        "A wide spread across folds signals instability — the model's performance depends heavily on the exact training data, often because the dataset is small. The spread is a useful diagnostic, not just noise.",
    },
    {
      id: "cv-q8",
      question: "When should you use group k-fold cross-validation?",
      options: [
        "Whenever the dataset contains categorical features that need to be balanced across folds",
        "Whenever the dataset exceeds 10,000 rows, to make training in each fold faster",
        "When the target variable has more than two classes, requiring multi-label fold assignment",
        "When there are multiple correlated rows per subject/group that must not be split across train and test"
      ],
      correctIndex: 3,
      explanation:
        "Group k-fold keeps all rows from one group (e.g. one patient's multiple records) on the same side of the split. Otherwise the same group appears in train and test, leaking information and inflating scores.",
    },
    {
      id: "cv-q9",
      question: "How does increasing k (number of folds) generally affect the estimate?",
      options: [
        "Lower variance and lower bias — always strictly better than a smaller k",
        "The bias increases because each fold has less training data, making the model underfit more",
        "Higher bias because the model trains on a smaller fraction of the data in each fold",
        "Lower bias but more compute and often higher variance"
      ],
      correctIndex: 3,
      explanation:
        "Larger k means each training set is bigger (closer to using all data), lowering bias, but requires more training runs and the estimates can have higher variance. k = 5 or 10 balances these well.",
    },
    {
      id: "cv-q10",
      question: "What is the ideal way to report cross-validated performance?",
      options: [
        "The score on the final fold only, because earlier folds were used for hyperparameter tuning",
        "The mean score together with its spread (e.g. 90% ± 2%)",
        "The median fold score, because it is more robust to outlier folds than the mean",
        "The single best fold's score, because it represents the model's ceiling performance on unseen data"
      ],
      correctIndex: 1,
      explanation:
        "Reporting the mean and spread (e.g. standard deviation across folds) conveys both expected performance and how much it varies — far more actionable than a single number.",
    },
  ],

  exercises: [
    {
      id: "cv-ex1",
      title: "Cross-Validate a Classifier",
      intro:
        "Use k-fold cross-validation to get an honest performance estimate, step by step.",
      parts: [
        {
          id: "cv-ex1-a",
          label: "a",
          prompt:
            "Load the iris dataset with load_iris(return_X_y=True) and print the shape of X. (Expected: (150, 4))",
          starterCode:
            "from sklearn.datasets import load_iris\n\nX, y = load_iris(return_X_y=True)\n# YOUR CODE HERE\n",
          expectedStdout: "(150, 4)",
          hints: ["Use X.shape.", "print(X.shape)"],
          solution:
            "from sklearn.datasets import load_iris\nX, y = load_iris(return_X_y=True)\nprint(X.shape)",
        },
        {
          id: "cv-ex1-b",
          label: "b",
          prompt:
            "Run 5-fold cross-validation with cross_val_score on LogisticRegression(max_iter=1000, random_state=42). Print how many scores you get back. (Expected: 5)",
          starterCode:
            "from sklearn.model_selection import cross_val_score\nfrom sklearn.linear_model import LogisticRegression\n\n# YOUR CODE HERE\n",
          expectedStdout: "5",
          hints: [
            "clf = LogisticRegression(max_iter=1000, random_state=42)",
            "scores = cross_val_score(clf, X, y, cv=5)",
            "print(len(scores))",
          ],
          solution:
            "from sklearn.model_selection import cross_val_score\nfrom sklearn.linear_model import LogisticRegression\nclf = LogisticRegression(max_iter=1000, random_state=42)\nscores = cross_val_score(clf, X, y, cv=5)\nprint(len(scores))",
        },
        {
          id: "cv-ex1-c",
          label: "c",
          prompt:
            "Print the mean of the 5 cross-validation scores, rounded to 2 decimals. (Expected: 0.97)",
          starterCode:
            "# YOUR CODE HERE\n",
          expectedStdout: "0.97",
          hints: [
            "scores is a NumPy array; use scores.mean().",
            "print(round(scores.mean(), 2))",
          ],
          solution: "print(round(scores.mean(), 2))",
        },
      ],
    },
  ],

  cheatsheet: [
    {
      heading: "The Idea",
      items: [
        { term: "Problem", note: "A single split is one noisy, lucky-or-unlucky opinion." },
        { term: "Solution", note: "Rotate the test set through the data; average the scores." },
        { term: "CV score", note: "Mean of the per-fold scores.", formula: "\\tfrac{1}{k}\\sum \\text{score}_i" },
        { term: "Report", note: "Mean ± spread, never a single number." },
      ],
    },
    {
      heading: "k-Fold",
      items: [
        { term: "Recipe", note: "Split into k folds; each is the test set once." },
        { term: "k = 5 or 10", note: "The usual balance of reliability vs compute." },
        { term: "Leave-one-out", note: "k = n; nearly unbiased, expensive, small data only." },
        { term: "Larger k", note: "Lower bias, more runs, can raise variance." },
      ],
    },
    {
      heading: "Respecting Structure",
      items: [
        { term: "Stratified", note: "Preserve class balance per fold; default for classification." },
        { term: "Group k-fold", note: "Keep each subject's rows on one side." },
        { term: "Time-series split", note: "Train past, test future; never shuffle." },
        { term: "Leakage", note: "Wrong splitting lets info cross from test to train." },
      ],
    },
    {
      heading: "Model Selection",
      items: [
        { term: "Tuning", note: "CV each candidate; pick the best average." },
        { term: "Optimism", note: "The chosen config's CV score is slightly inflated." },
        { term: "Final test set", note: "Touch once at the end for honest performance." },
        { term: "Nested CV", note: "Inner loop tunes, outer loop evaluates honestly." },
      ],
    },
  ],
};