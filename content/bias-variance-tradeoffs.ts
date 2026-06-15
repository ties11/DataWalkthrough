import { Subject } from "./types";

export const biasVarianceTradeoff: Subject = {
  slug: "bias-variance-tradeoff",
  title: "Bias–Variance Tradeoff",
  icon: "balance",
  phase: 2,
  blurb:
    "The central tension of all learning. Too simple a model misses the pattern; too complex a model memorises noise. Understanding this tradeoff is what turns guessing into engineering.",
  sources: [
    "Hastie, Tibshirani & Friedman — ESL, 2nd ed., Ch. 2, 7",
    "James, Witten, Hastie & Tibshirani — ISLR, 2nd ed., Ch. 2",
    "Geman, Bienenstock & Doursat — Neural Networks and the Bias/Variance Dilemma (1992)",
    "Domingos, P. — A Unified Bias-Variance Decomposition (2000)",
  ],

  theory: [
    {
      badge: "Intuition · Page 1",
      title: "Two Ways to Be Wrong",
      blocks: [
        {
          kind: "para",
          html: "Imagine teaching someone to recognise dogs. Show them too few examples and they form a crude rule — \"four legs and fur\" — that also flags cats and horses. That is <em>bias</em>: the rule is too simple to capture the truth. Now show them a thousand photos and they memorise every detail, including the grass in the background, and fail on a dog photographed indoors. That is <em>variance</em>: the rule clings to noise in the specific examples.",
        },
        {
          kind: "para",
          html: "Every model lives between these two failures. A model that is too simple <em>underfits</em> — high bias. A model that is too complex <em>overfits</em> — high variance. The art of machine learning is finding the sweet spot between them, and the bias–variance tradeoff is the framework that makes that search systematic rather than blind.",
        },
        {
          kind: "callout",
          tone: "purple",
          title: "Why this is the core idea",
          html: "Almost every technique you will learn — regularisation, cross-validation, ensembles, early stopping, dropout — is ultimately a tool for managing this one tradeoff. Once you see learning through the bias–variance lens, the whole field organises itself around a single question: is my model too simple or too complex, and what should I do about it?",
        },
      ],
    },
    {
      badge: "Foundations · Page 2",
      title: "Decomposing the Error",
      blocks: [
        {
          kind: "para",
          html: "The expected prediction error of a model can be split into three distinct pieces. This decomposition is the mathematical heart of the tradeoff.",
        },
        {
          kind: "equation",
          label: "Bias–variance decomposition",
          tex: "\\text{Error} = \\text{Bias}^2 + \\text{Variance} + \\text{Irreducible Error}",
        },
        {
          kind: "table",
          headers: ["Component", "What it is", "Caused by"],
          rows: [
            ["Bias²", "Error from wrong assumptions", "Model too simple for the truth"],
            ["Variance", "Error from sensitivity to the training set", "Model too complex, fits noise"],
            ["Irreducible", "Noise inherent in the data", "Cannot be removed by any model"],
          ],
        },
        {
          kind: "para",
          html: "<em>Bias</em> measures how far off your model is on average, even with unlimited data — it reflects wrong structural assumptions. <em>Variance</em> measures how much your model would change if you trained it on a different sample — it reflects over-sensitivity. The <em>irreducible error</em> is the noise floor: no model, however perfect, can predict the genuinely random part of the world.",
        },
      ],
    },
    {
      badge: "Mechanics · Page 3",
      title: "The Tradeoff in Action",
      blocks: [
        {
          kind: "para",
          html: "Why is it a <em>tradeoff</em>? Because the usual lever — model complexity — pushes bias and variance in opposite directions. Reduce one and you tend to raise the other.",
        },
        {
          kind: "para",
          html: "As you increase complexity (a deeper tree, more features, a higher-degree polynomial), bias falls — the model can represent richer patterns. But variance rises — the model has more freedom to chase the quirks of this particular training set. Total error follows a U-shape: it drops as you escape underfitting, bottoms out at the sweet spot, then climbs again as overfitting takes over.",
        },
        {
          kind: "callout",
          tone: "teal",
          title: "Reading the symptoms",
          html: "The tell-tale signs are in the gap between training and validation performance. <em>High bias (underfit):</em> both training and validation scores are poor, and close together — the model can't even fit what it has seen. <em>High variance (overfit):</em> training score is excellent but validation score is much worse — a large gap means the model memorised rather than generalised.",
        },
        {
          kind: "table",
          headers: ["Symptom", "Diagnosis", "Fix"],
          rows: [
            ["Poor on train AND test", "High bias / underfit", "More complexity, more features"],
            ["Great on train, poor on test", "High variance / overfit", "Regularise, simplify, more data"],
            ["Good on both, small gap", "Sweet spot", "Ship it"],
          ],
        },
      ],
    },
    {
      badge: "Practice · Page 4",
      title: "Tools for Each Side",
      blocks: [
        {
          kind: "para",
          html: "Once you have diagnosed which way your model leans, you have a clear menu of interventions.",
        },
        {
          kind: "heading",
          text: "To reduce variance (fight overfitting)",
        },
        {
          kind: "para",
          html: "Add <em>regularisation</em> (penalise complexity), gather <em>more training data</em> (the most reliable cure), <em>simplify</em> the model, use <em>ensembles</em> like bagging that average away variance, or apply <em>early stopping</em>. These all pull a too-flexible model back toward stability.",
        },
        {
          kind: "heading",
          text: "To reduce bias (fight underfitting)",
        },
        {
          kind: "para",
          html: "Increase model <em>complexity</em>, add or engineer better <em>features</em>, reduce regularisation, or switch to a more expressive model family. These give a too-rigid model the freedom it needs to capture the real pattern.",
        },
        {
          kind: "callout",
          tone: "amber",
          title: "More data helps variance, not bias",
          html: "A crucial asymmetry: collecting more data shrinks <em>variance</em> (the model sees more of the true distribution and stops chasing noise) but does almost nothing for <em>bias</em> (a fundamentally too-simple model stays too simple no matter how much data it sees). If your model underfits, more data is not the answer — more capacity is.",
        },
      ],
    },
    {
      badge: "Application · Page 5",
      title: "The Modern Picture",
      blocks: [
        {
          kind: "para",
          html: "The bias–variance tradeoff explains the behaviour of the models you have already met, and frames the ones still to come.",
        },
        {
          kind: "table",
          headers: ["Model", "Tends toward"],
          rows: [
            ["Linear / logistic regression", "Higher bias, lower variance"],
            ["Deep decision tree (unpruned)", "Lower bias, higher variance"],
            ["k-NN with small k", "Low bias, high variance"],
            ["Random forest", "Reduces variance via averaging"],
            ["Gradient boosting", "Reduces bias via sequential correction"],
          ],
        },
        {
          kind: "callout",
          tone: "red",
          title: "A modern wrinkle: double descent",
          html: "The classic U-shaped curve is not the whole story for very large models. Recent deep-learning research finds that past the point of perfectly fitting the training data, test error can <em>fall again</em> — a phenomenon called <em>double descent</em>. Enormous neural networks often generalise well despite having far more parameters than data points. The classic tradeoff still guides everyday practice, but the frontier is more subtle.",
        },
        {
          kind: "callout",
          tone: "amber",
          title: "What to carry forward",
          html: "Error = bias² + variance + noise. Too-simple models underfit (high bias); too-complex models overfit (high variance); complexity trades one for the other in a U-shaped curve. Diagnose by the train–validation gap, then act: regularise or simplify for variance, add capacity or features for bias. More data fixes variance, not bias.",
        },
      ],
    },
  ],

  quiz: [
    {
      id: "bv-q1",
      question: "A model performs poorly on both the training set and the test set. What is the likely diagnosis?",
      options: [
        "High variance (overfitting)",
        "High bias (underfitting) — the model is too simple",
        "The data is too clean",
        "There is nothing wrong",
      ],
      correctIndex: 1,
      explanation:
        "Poor performance on both, with a small gap between them, signals high bias: the model is too simple to capture the pattern even in data it has seen. The fix is more complexity or better features.",
    },
    {
      id: "bv-q2",
      question: "A model scores 99% on training data but only 70% on test data. What does this indicate?",
      options: [
        "High bias (underfitting)",
        "High variance (overfitting) — the model memorised noise",
        "Irreducible error is too high",
        "The model is perfectly tuned",
      ],
      correctIndex: 1,
      explanation:
        "A large gap between excellent training and poor test performance is the signature of high variance: the model memorised the training set's quirks rather than learning to generalise.",
    },
    {
      id: "bv-q3",
      question: "What are the three components of the bias–variance decomposition of error?",
      options: [
        "Training, validation, and test error",
        "Bias², variance, and irreducible error",
        "Mean, median, and mode",
        "Precision, recall, and accuracy",
      ],
      correctIndex: 1,
      explanation:
        "Expected error decomposes into bias² (wrong assumptions), variance (sensitivity to the training set), and irreducible error (inherent noise that no model can remove).",
    },
    {
      id: "bv-q4",
      question: "As you increase a model's complexity, what typically happens to bias and variance?",
      options: [
        "Both increase",
        "Bias decreases while variance increases",
        "Both decrease",
        "Bias increases while variance decreases",
      ],
      correctIndex: 1,
      explanation:
        "More complexity lets the model represent richer patterns (lower bias) but also chase training-set quirks (higher variance). Total error follows a U-shape, minimised at the sweet spot between them.",
    },
    {
      id: "bv-q5",
      question: "Your model is underfitting. Will collecting much more data fix it?",
      options: [
        "Yes, more data always fixes underfitting",
        "No — more data reduces variance, but bias (a too-simple model) needs more capacity",
        "Yes, but only if the data is shuffled",
        "It will make the bias worse",
      ],
      correctIndex: 1,
      explanation:
        "More data shrinks variance but does little for bias. A fundamentally too-simple model stays too simple no matter how much data it sees. Underfitting needs more complexity or better features, not more rows.",
    },
    {
      id: "bv-q6",
      question: "What is the irreducible error?",
      options: [
        "Error from a model that is too simple",
        "The inherent noise in the data that no model can ever remove",
        "Error caused by bugs in the code",
        "The gap between train and test scores",
      ],
      correctIndex: 1,
      explanation:
        "Irreducible error is the noise floor — the genuinely random part of the relationship that no model, however perfect, can predict. It sets a hard lower bound on achievable error.",
    },
    {
      id: "bv-q7",
      question: "Which technique primarily reduces variance?",
      options: [
        "Adding more features",
        "Regularisation (penalising complexity)",
        "Increasing model depth",
        "Reducing the amount of data",
      ],
      correctIndex: 1,
      explanation:
        "Regularisation penalises complexity, pulling a too-flexible model back toward stability and reducing variance. Adding features or depth increases complexity and tends to raise variance.",
    },
    {
      id: "bv-q8",
      question: "How does a random forest manage the bias–variance tradeoff?",
      options: [
        "It increases bias deliberately",
        "It averages many high-variance trees to reduce variance",
        "It removes the irreducible error",
        "It always increases variance",
      ],
      correctIndex: 1,
      explanation:
        "A random forest averages many independent, high-variance deep trees. Averaging cancels much of their individual variance while keeping their low bias — a direct application of the tradeoff.",
    },
    {
      id: "bv-q9",
      question: "k-Nearest Neighbours with k=1 sits where on the tradeoff?",
      options: [
        "High bias, low variance",
        "Low bias, high variance — it follows every point exactly",
        "Balanced",
        "It has no bias or variance",
      ],
      correctIndex: 1,
      explanation:
        "With k=1, the model follows every single training point, giving very low bias but very high variance — a single noisy point dictates its neighbourhood. Increasing k raises bias and lowers variance.",
    },
    {
      id: "bv-q10",
      question: "What is 'double descent'?",
      options: [
        "Training a model twice",
        "A modern finding that test error can fall again past the point of fitting training data perfectly, in very large models",
        "When both bias and variance descend to zero",
        "A type of gradient descent",
      ],
      correctIndex: 1,
      explanation:
        "Double descent is the observation that for very large models, after the classic U-shaped rise, test error can decrease again beyond the interpolation point. It complicates — but doesn't replace — the everyday tradeoff.",
    },
  ],

  exercises: [
    {
      id: "bv-ex1",
      title: "Witness Overfitting with Tree Depth",
      intro:
        "Compare a shallow (high-bias) and a deep (high-variance) decision tree to see the tradeoff directly.",
      parts: [
        {
          id: "bv-ex1-a",
          label: "a",
          prompt:
            "Load the breast cancer dataset and split with test_size=0.2, random_state=42. Print the number of training and test samples space-separated. (Expected: 455 114)",
          starterCode:
            "from sklearn.datasets import load_breast_cancer\nfrom sklearn.model_selection import train_test_split\n\nX, y = load_breast_cancer(return_X_y=True)\n# split and print\n",
          expectedStdout: "455 114",
          hints: [
            "train_test_split(X, y, test_size=0.2, random_state=42)",
            "print(len(X_train), len(X_test))",
          ],
          solution:
            "from sklearn.datasets import load_breast_cancer\nfrom sklearn.model_selection import train_test_split\nX, y = load_breast_cancer(return_X_y=True)\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\nprint(len(X_train), len(X_test))",
        },
        {
          id: "bv-ex1-b",
          label: "b",
          prompt:
            "Train a shallow tree DecisionTreeClassifier(max_depth=1, random_state=42) and print its TRAINING accuracy rounded to 2 decimals. This is the high-bias model. (Expected: 0.92)",
          starterCode:
            "from sklearn.tree import DecisionTreeClassifier\n\n# fit max_depth=1 on training data, print round(train accuracy, 2)\n",
          expectedStdout: "0.92",
          hints: [
            "shallow = DecisionTreeClassifier(max_depth=1, random_state=42); shallow.fit(X_train, y_train)",
            "shallow.score(X_train, y_train) gives training accuracy.",
            "print(round(shallow.score(X_train, y_train), 2))",
          ],
          solution:
            "from sklearn.tree import DecisionTreeClassifier\nshallow = DecisionTreeClassifier(max_depth=1, random_state=42)\nshallow.fit(X_train, y_train)\nprint(round(shallow.score(X_train, y_train), 2))",
        },
        {
          id: "bv-ex1-c",
          label: "c",
          prompt:
            "Train a deep tree DecisionTreeClassifier(max_depth=None, random_state=42) and print its TRAINING accuracy rounded to 2 decimals. Note how it memorises the training data perfectly — the high-variance extreme. (Expected: 1.0)",
          starterCode:
            "# fit max_depth=None on training data, print round(train accuracy, 2)\n",
          expectedStdout: "1.0",
          hints: [
            "deep = DecisionTreeClassifier(max_depth=None, random_state=42); deep.fit(X_train, y_train)",
            "A fully-grown tree fits training data perfectly.",
            "print(round(deep.score(X_train, y_train), 2))",
          ],
          solution:
            "deep = DecisionTreeClassifier(max_depth=None, random_state=42)\ndeep.fit(X_train, y_train)\nprint(round(deep.score(X_train, y_train), 2))",
        },
      ],
    },
  ],

  cheatsheet: [
    {
      heading: "The Decomposition",
      items: [
        { term: "Error", note: "Splits into three parts.", formula: "\\text{Bias}^2+\\text{Var}+\\text{Noise}" },
        { term: "Bias", note: "Error from wrong assumptions; model too simple." },
        { term: "Variance", note: "Sensitivity to the training set; model too complex." },
        { term: "Irreducible", note: "Inherent noise; no model can remove it." },
      ],
    },
    {
      heading: "The Two Failures",
      items: [
        { term: "Underfit", note: "High bias; poor on train AND test, small gap." },
        { term: "Overfit", note: "High variance; great on train, poor on test, big gap." },
        { term: "U-curve", note: "Complexity trades bias for variance; sweet spot in middle." },
        { term: "Diagnose", note: "Read the train–validation gap." },
      ],
    },
    {
      heading: "Fixes",
      items: [
        { term: "Cut variance", note: "Regularise, more data, simplify, ensemble, early stop." },
        { term: "Cut bias", note: "More complexity, better features, less regularisation." },
        { term: "Key asymmetry", note: "More data helps variance, NOT bias." },
      ],
    },
    {
      heading: "In Models",
      items: [
        { term: "Linear models", note: "Higher bias, lower variance." },
        { term: "Deep trees / k=1 NN", note: "Low bias, high variance." },
        { term: "Random forest", note: "Averages trees to cut variance." },
        { term: "Double descent", note: "Huge models: test error can fall again." },
      ],
    },
  ],
};