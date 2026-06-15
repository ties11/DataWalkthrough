import { Subject } from "./types";

export const classificationMetrics: Subject = {
  slug: "classification-metrics",
  title: "Classification Metrics",
  icon: "gauge",
  phase: 2,
  blurb:
    "Why accuracy lies. Precision, recall, F1, and ROC-AUC reveal what a single accuracy number hides — essential when one class is rare or one mistake costs far more than another.",
  sources: [
    "James, Witten, Hastie & Tibshirani — ISLR, 2nd ed., Ch. 4",
    "Hastie, Tibshirani & Friedman — ESL, 2nd ed., Ch. 9",
    "Géron, A. — Hands-On Machine Learning, 3rd ed., Ch. 3",
    "Davis & Goadrich — The Relationship Between Precision-Recall and ROC Curves (2006)",
  ],

  theory: [
    {
      badge: "Intuition · Page 1",
      title: "When 99% Accuracy Is Terrible",
      blocks: [
        {
          kind: "para",
          html: "A model that screens for a disease affecting 1 in 100 people can score 99% accuracy by doing something useless: predicting \"healthy\" for everyone. It would be right 99% of the time and catch exactly zero sick patients. Accuracy — the fraction of correct predictions — is the metric everyone reaches for first, and it is dangerously misleading the moment your classes are imbalanced.",
        },
        {
          kind: "para",
          html: "The deeper problem is that accuracy treats all mistakes as equal. But missing a cancer diagnosis is not the same as a false alarm; approving a fraudulent transaction is not the same as flagging a legitimate one. Real classification problems need metrics that distinguish <em>which kind</em> of error a model makes, and weigh them according to what actually matters.",
        },
        {
          kind: "callout",
          tone: "purple",
          title: "Why this matters",
          html: "Choosing the wrong metric means optimising for the wrong thing. A fraud model tuned for accuracy will ignore fraud; a medical screen tuned for accuracy will miss patients. The metric you pick silently defines what \"good\" means — so picking it well is one of the highest-leverage decisions in any project.",
        },
      ],
    },
    {
      badge: "Foundations · Page 2",
      title: "The Confusion Matrix",
      blocks: [
        {
          kind: "para",
          html: "Every classification metric is built from four numbers, laid out in the <em>confusion matrix</em> — a 2×2 table comparing what the model predicted against what was true.",
        },
        {
          kind: "table",
          headers: ["", "Predicted Positive", "Predicted Negative"],
          rows: [
            ["Actually Positive", "True Positive (TP)", "False Negative (FN)"],
            ["Actually Negative", "False Positive (FP)", "True Negative (TN)"],
          ],
        },
        {
          kind: "para",
          html: "A <em>false positive</em> is a false alarm — predicting positive when it is not (a healthy patient flagged sick). A <em>false negative</em> is a miss — predicting negative when it is actually positive (a sick patient cleared). These two errors have very different consequences depending on the problem, and the whole point of good metrics is to track them separately.",
        },
        {
          kind: "callout",
          tone: "teal",
          title: "Read the matrix first",
          html: "Before computing any metric, look at the raw confusion matrix. It instantly shows where a model fails — is it missing positives, or crying wolf? Many modelling mistakes are obvious in the matrix and invisible in a single summary number.",
        },
      ],
    },
    {
      badge: "Mechanics · Page 3",
      title: "Precision, Recall & F1",
      blocks: [
        {
          kind: "para",
          html: "Two metrics carve up the errors, each answering a different question.",
        },
        {
          kind: "equation",
          label: "Precision — of those flagged positive, how many really are?",
          tex: "\\text{Precision} = \\frac{TP}{TP + FP}",
        },
        {
          kind: "equation",
          label: "Recall — of all real positives, how many did we catch?",
          tex: "\\text{Recall} = \\frac{TP}{TP + FN}",
        },
        {
          kind: "para",
          html: "<em>Precision</em> asks: when the model says positive, how often is it right? High precision means few false alarms. <em>Recall</em> (also called sensitivity) asks: of all the actual positives, how many did the model find? High recall means few misses. They pull against each other — flag more aggressively and you catch more (higher recall) but raise false alarms (lower precision).",
        },
        {
          kind: "callout",
          tone: "amber",
          title: "Which one matters more?",
          html: "It depends entirely on the cost of each error. <em>Cancer screening:</em> recall is paramount — missing a sick patient (false negative) is catastrophic, a false alarm merely means more tests. <em>Spam filtering:</em> precision matters more — losing a real email to the spam folder (false positive) is worse than letting some spam through. The metric follows the consequences.",
        },
        {
          kind: "equation",
          label: "F1 — the harmonic mean balancing both",
          tex: "F_1 = 2 \\cdot \\frac{\\text{Precision} \\cdot \\text{Recall}}{\\text{Precision} + \\text{Recall}}",
        },
        {
          kind: "para",
          html: "When you need a single number balancing both, the <em>F1 score</em> takes their harmonic mean — which punishes imbalance, so you cannot game it by maxing one and ignoring the other. It is the standard summary metric for imbalanced classification.",
        },
      ],
    },
    {
      badge: "Tools · Page 4",
      title: "Thresholds & the ROC Curve",
      blocks: [
        {
          kind: "para",
          html: "Most classifiers do not output a hard yes/no — they output a <em>probability</em>, which becomes a decision only after applying a <em>threshold</em> (default 0.5). Slide that threshold and you trade precision against recall. This means a single model contains a whole family of precision/recall behaviours.",
        },
        {
          kind: "para",
          html: "The <em>ROC curve</em> visualises this. It plots the true positive rate (recall) against the false positive rate as the threshold sweeps from 0 to 1. A model that perfectly separates the classes hugs the top-left corner; a model that guesses randomly traces the diagonal.",
        },
        {
          kind: "equation",
          label: "AUC — area under the ROC curve",
          tex: "\\text{AUC} \\in [0, 1], \\quad 0.5 = \\text{random}, \\quad 1.0 = \\text{perfect}",
        },
        {
          kind: "callout",
          tone: "teal",
          title: "What AUC really means",
          html: "The <em>area under the ROC curve</em> (AUC) summarises performance across <em>all</em> thresholds in one number. It has an elegant interpretation: the probability that the model ranks a random positive example higher than a random negative one. AUC = 0.5 is coin-flipping; AUC = 1.0 is perfect ranking. Because it is threshold-independent, it measures a model's intrinsic ranking ability, separate from where you set the cutoff.",
        },
        {
          kind: "callout",
          tone: "red",
          title: "ROC vs Precision-Recall curves",
          html: "On heavily imbalanced data, ROC-AUC can look reassuringly high even for a weak model, because the huge number of true negatives flatters the false-positive rate. For rare-positive problems (fraud, disease), the <em>precision-recall curve</em> and its area are often more honest, focusing on the minority class you actually care about.",
        },
      ],
    },
    {
      badge: "Application · Page 5",
      title: "Choosing the Right Metric",
      blocks: [
        {
          kind: "table",
          headers: ["Situation", "Prioritise"],
          rows: [
            ["Balanced classes, equal error costs", "Accuracy is fine"],
            ["Imbalanced classes", "F1, precision/recall, PR-AUC"],
            ["Missing a positive is costly (disease)", "Recall"],
            ["False alarms are costly (spam)", "Precision"],
            ["Need threshold-independent ranking", "ROC-AUC"],
            ["Rare positives specifically", "Precision-recall curve"],
          ],
        },
        {
          kind: "callout",
          tone: "amber",
          title: "What to carry forward",
          html: "Accuracy hides which errors a model makes and lies on imbalanced data. Build everything from the confusion matrix. Precision = how trustworthy are positive predictions; recall = how many positives did you catch; F1 balances them. Probabilities + a threshold trade one for the other; ROC-AUC measures ranking across all thresholds, but use precision-recall for rare classes. Always choose the metric that matches the real cost of each error.",
        },
      ],
    },
  ],

  quiz: [
    {
      id: "cm-q1",
      question: "Why can a model with 99% accuracy be useless?",
      options: [
        "Accuracy is computed on the training set, so it does not reflect test performance",
        "A model scoring 99% has almost certainly memorised the training data and will not generalise",
        "Accuracy counts true negatives but not true positives, so it overcounts correct predictions",
        "On imbalanced data it can score high by always predicting the majority class, catching none of the rare class"
      ],
      correctIndex: 3,
      explanation:
        "If 99% of samples are negative, always predicting 'negative' scores 99% accuracy while catching zero positives. Accuracy is misleading on imbalanced data because it ignores which class the errors fall on.",
    },
    {
      id: "cm-q2",
      question: "What does precision measure?",
      options: [
        "Of all predicted positives, how many are actually positive",
        "The threshold-independent ranking ability of the model across all operating points",
        "Of all actual positives in the dataset, how many the model successfully identified",
        "The fraction of all predictions — both positive and negative — that are correct"
      ],
      correctIndex: 0,
      explanation:
        "Precision = TP / (TP + FP): when the model predicts positive, how often is it right? High precision means few false alarms. It is distinct from recall, which measures coverage of actual positives.",
    },
    {
      id: "cm-q3",
      question: "What does recall measure?",
      options: [
        "The probability that a randomly chosen positive ranks above a randomly chosen negative",
        "The ratio of correctly classified samples to the total number of predictions made",
        "Of all predicted positives, how many are actually positive (avoiding false alarms)",
        "Of all actual positives, how many the model caught"
      ],
      correctIndex: 3,
      explanation:
        "Recall = TP / (TP + FN): of all the real positives, how many did the model find? High recall means few misses. It trades against precision as you change the decision threshold.",
    },
    {
      id: "cm-q4",
      question: "For cancer screening, which metric should usually be prioritised?",
      options: [
        "F1 score — it always provides the right balance between catching cases and avoiding alarms",
        "Precision — false alarms result in costly unnecessary treatments, which must be minimised",
        "AUC-ROC — it is the standard metric whenever classes are rare",
        "Recall — missing a sick patient (false negative) is catastrophic"
      ],
      correctIndex: 3,
      explanation:
        "In screening, a false negative (missing a sick patient) is far costlier than a false positive (an extra test). Recall, which minimises misses, is therefore prioritised.",
    },
    {
      id: "cm-q5",
      question: "What is a false positive?",
      options: [
        "A case where the model predicts the correct label but with low confidence",
        "Predicting positive when the truth is negative (a false alarm)",
        "A positive sample that the model correctly identifies with high precision",
        "Predicting negative when the truth is positive — the model misses a real case"
      ],
      correctIndex: 1,
      explanation:
        "A false positive is a false alarm: the model predicts positive but the truth is negative (e.g. flagging a healthy patient as sick). A false negative is the opposite — a miss.",
    },
    {
      id: "cm-q6",
      question: "Why is the F1 score the harmonic mean of precision and recall rather than the arithmetic mean?",
      options: [
        "The harmonic mean punishes imbalance, so you can't game it by maxing one and ignoring the other",
        "The harmonic mean is bounded between 0 and 100, making it easier to interpret as a percentage",
        "The arithmetic mean gives too much weight to precision, which is typically larger than recall",
        "The harmonic mean can be computed without knowing the number of true negatives"
      ],
      correctIndex: 0,
      explanation:
        "The harmonic mean is low if either precision or recall is low, so F1 rewards models that do well on both. The arithmetic mean could be fooled by an extreme value in one of them.",
    },
    {
      id: "cm-q7",
      question: "What does ROC-AUC of 0.5 indicate?",
      options: [
        "The model's precision and recall are equal at every possible decision threshold",
        "A model no better than random guessing",
        "The model is perfect — it correctly classifies exactly half the examples from each class",
        "The model outputs constant probabilities of 0.5 for all inputs"
      ],
      correctIndex: 1,
      explanation:
        "AUC = 0.5 means the model ranks positives and negatives no better than a coin flip (the ROC curve lies on the diagonal). AUC = 1.0 is perfect ranking; higher is better.",
    },
    {
      id: "cm-q8",
      question: "What is the probabilistic interpretation of AUC?",
      options: [
        "The probability the model ranks a random positive higher than a random negative",
        "The proportion of positive-class predictions that are correct at threshold 0.5",
        "The fraction of the total probability mass assigned correctly to positive examples",
        "The expected accuracy of the model when the decision threshold is chosen optimally"
      ],
      correctIndex: 0,
      explanation:
        "AUC equals the probability that a randomly chosen positive example receives a higher score than a randomly chosen negative one — a measure of ranking ability independent of any specific threshold.",
    },
    {
      id: "cm-q9",
      question: "How does changing the decision threshold affect precision and recall?",
      options: [
        "Raising the threshold flags more positives: recall rises while precision usually falls",
        "The threshold only affects the ROC curve, not precision or recall directly",
        "Both precision and recall increase together as the threshold is lowered toward zero",
        "Lowering the threshold flags more positives: recall rises, precision usually falls",
      ],
      correctIndex: 3,
      explanation:
        "A lower threshold predicts positive more readily, catching more true positives (higher recall) but also more false ones (lower precision). The threshold is the dial that trades one against the other.",
    },
    {
      id: "cm-q10",
      question: "On heavily imbalanced data with rare positives, which is often more honest than ROC-AUC?",
      options: [
        "Macro-averaged F1 score computed across all decision thresholds simultaneously",
        "Accuracy weighted by class frequency, which adjusts for the imbalance in the denominator",
        "Cross-entropy loss, which naturally penalises overconfident predictions on rare classes",
        "The precision-recall curve and its area"
      ],
      correctIndex: 3,
      explanation:
        "ROC-AUC can look high on imbalanced data because abundant true negatives flatter the false-positive rate. The precision-recall curve focuses on the minority class, giving a more honest picture for rare positives.",
    },
  ],

  exercises: [
    {
      id: "cm-ex1",
      title: "Compute Precision, Recall, and AUC",
      intro:
        "Evaluate a classifier with the metrics that matter, step by step.",
      parts: [
        {
          id: "cm-ex1-a",
          label: "a",
          prompt:
            "Load breast cancer, split (test_size=0.2, random_state=42), train LogisticRegression(max_iter=5000, random_state=42), and print the precision of test predictions rounded to 2 decimals. (Expected: 0.95)",
          starterCode:
            "from sklearn.datasets import load_breast_cancer\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.metrics import precision_score\n\nX, y = load_breast_cancer(return_X_y=True)\n# YOUR CODE HERE\n",
          expectedStdout: "0.95",
          hints: [
            "X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)",
            "clf = LogisticRegression(max_iter=5000, random_state=42).fit(X_train, y_train)",
            "print(round(precision_score(y_test, clf.predict(X_test)), 2))",
          ],
          solution:
            "from sklearn.datasets import load_breast_cancer\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.metrics import precision_score\nX, y = load_breast_cancer(return_X_y=True)\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\nclf = LogisticRegression(max_iter=5000, random_state=42).fit(X_train, y_train)\nprint(round(precision_score(y_test, clf.predict(X_test)), 2))",
        },
        {
          id: "cm-ex1-b",
          label: "b",
          prompt:
            "Print the recall of the same predictions, rounded to 2 decimals. (Expected: 0.99)",
          starterCode:
            "from sklearn.metrics import recall_score\n\n# YOUR CODE HERE\n",
          expectedStdout: "0.99",
          hints: [
            "recall_score(y_test, clf.predict(X_test))",
            "print(round(recall_score(y_test, clf.predict(X_test)), 2))",
          ],
          solution:
            "from sklearn.metrics import recall_score\nprint(round(recall_score(y_test, clf.predict(X_test)), 2))",
        },
        {
          id: "cm-ex1-c",
          label: "c",
          prompt:
            "Print the ROC-AUC using the model's positive-class probabilities (predict_proba[:, 1]), rounded to 2 decimals. (Expected: 1.0)",
          starterCode:
            "from sklearn.metrics import roc_auc_score\n\n# YOUR CODE HERE\n",
          expectedStdout: "1.0",
          hints: [
            "proba = clf.predict_proba(X_test)[:, 1]",
            "roc_auc_score(y_test, proba)",
            "print(round(roc_auc_score(y_test, proba), 2))",
          ],
          solution:
            "from sklearn.metrics import roc_auc_score\nproba = clf.predict_proba(X_test)[:, 1]\nprint(round(roc_auc_score(y_test, proba), 2))",
        },
      ],
    },
  ],

  cheatsheet: [
    {
      heading: "The Problem",
      items: [
        { term: "Accuracy trap", note: "Always-majority scores high on imbalanced data, catches nothing." },
        { term: "Errors differ", note: "A miss and a false alarm have different costs." },
        { term: "Metric = goal", note: "The metric you pick defines what 'good' means." },
      ],
    },
    {
      heading: "Confusion Matrix",
      items: [
        { term: "TP / TN", note: "Correct positive / negative predictions." },
        { term: "False positive", note: "False alarm — predicted positive, actually negative." },
        { term: "False negative", note: "Miss — predicted negative, actually positive." },
        { term: "Read it first", note: "Shows where the model fails at a glance." },
      ],
    },
    {
      heading: "Core Metrics",
      items: [
        { term: "Precision", note: "Of predicted positives, how many right.", formula: "\\tfrac{TP}{TP+FP}" },
        { term: "Recall", note: "Of actual positives, how many caught.", formula: "\\tfrac{TP}{TP+FN}" },
        { term: "F1", note: "Harmonic mean; balances both.", formula: "2\\tfrac{P\\cdot R}{P+R}" },
        { term: "Trade-off", note: "Recall ↑ via spam example; precision matters there." },
      ],
    },
    {
      heading: "Thresholds & ROC",
      items: [
        { term: "Threshold", note: "Probability cutoff; slides precision vs recall." },
        { term: "ROC curve", note: "TPR vs FPR across all thresholds." },
        { term: "AUC", note: "P(rank random + above random −). 0.5 random, 1 perfect." },
        { term: "PR curve", note: "More honest than ROC for rare positives." },
      ],
    },
  ],
};