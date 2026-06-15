import { Subject } from "./types";

export const logisticRegression: Subject = {
  slug: "logistic-regression",
  title: "Logistic Regression",
  icon: "sigmoid",
  phase: 1,
  blurb:
    "Linear regression's classifying cousin. Bends a straight-line score through the sigmoid to output calibrated probabilities — the workhorse baseline for every classification problem.",
  sources: [
    "James, Witten, Hastie & Tibshirani — ISLR, 2nd ed., Ch. 4",
    "Hastie, Tibshirani & Friedman — ESL, 2nd ed., Ch. 4",
    "Géron, A. — Hands-On Machine Learning, 3rd ed., Ch. 4",
    "Bishop, C. — Pattern Recognition and Machine Learning, Ch. 4",
  ],

  theory: [
    {
      badge: "Intuition · Page 1",
      title: "From a Line to a Probability",
      blocks: [
        {
          kind: "para",
          html: "Linear regression predicts a number that runs from minus infinity to plus infinity. But many of the most important questions are yes/no: will this customer churn, is this tumour malignant, will this email bounce? For those we need an output bounded between 0 and 1 — a <em>probability</em> — not an unbounded score.",
        },
        {
          kind: "para",
          html: "Logistic regression solves this with a clever two-step move. First it computes a familiar linear score, exactly like linear regression: a weighted sum of the features. Then it squashes that score through an S-shaped function — the <em>sigmoid</em> — that maps any real number onto the interval (0, 1). The result is a genuine probability you can threshold into a decision.",
        },
        {
          kind: "callout",
          tone: "purple",
          title: "Why it matters",
          html: "Despite the name, logistic regression is a <em>classification</em> algorithm, and it is the single most important baseline in all of applied machine learning. It is fast, interpretable, outputs calibrated probabilities, and rarely overfits. Before reaching for anything fancier, practitioners fit a logistic regression — and surprisingly often, it is hard to beat.",
        },
      ],
    },
    {
      badge: "Foundations · Page 2",
      title: "The Sigmoid Function",
      blocks: [
        {
          kind: "para",
          html: "The heart of the model is the sigmoid (or logistic) function. It takes the linear score \\(z\\) and bends it into a probability.",
        },
        {
          kind: "equation",
          label: "The sigmoid function",
          tex: "\\sigma(z) = \\frac{1}{1 + e^{-z}}, \\qquad z = \\beta_0 + \\beta_1 x_1 + \\dots + \\beta_p x_p",
        },
        {
          kind: "para",
          html: "Its shape is the key. When \\(z\\) is large and positive, \\(e^{-z}\\) shrinks toward zero and \\(\\sigma(z)\\) approaches 1. When \\(z\\) is large and negative, the denominator explodes and \\(\\sigma(z)\\) approaches 0. At \\(z = 0\\), the output is exactly 0.5 — the point of maximum uncertainty, sitting on the decision boundary.",
        },
        {
          kind: "callout",
          tone: "teal",
          title: "Odds and log-odds",
          html: "The linear score \\(z\\) has a precise meaning: it is the <em>log-odds</em> of the positive class. Exponentiate it and you get the odds (e.g. 3-to-1). This is why a logistic coefficient is interpreted as \"a one-unit increase in this feature multiplies the odds by \\(e^{\\beta}\\)\" — the model is linear in log-odds even though it is curved in probability.",
        },
        {
          kind: "para",
          html: "The decision boundary itself — where the predicted probability crosses 0.5 — is linear, just like in linear regression. Logistic regression draws a straight line (or flat plane) through feature space; the sigmoid only governs how confidence ramps up as you move away from that boundary.",
        },
      ],
    },
    {
      badge: "Mechanics · Page 3",
      title: "How It Learns: Cross-Entropy",
      blocks: [
        {
          kind: "para",
          html: "Linear regression minimises squared error. Logistic regression cannot — squared error against a sigmoid produces a bumpy, non-convex surface full of bad local minima. Instead it minimises a loss tailored to probabilities: <em>log loss</em>, also called <em>cross-entropy</em>.",
        },
        {
          kind: "equation",
          label: "Binary cross-entropy (log loss)",
          tex: "L = -\\frac{1}{n}\\sum_{i=1}^{n}\\big[y_i \\log \\hat{p}_i + (1-y_i)\\log(1-\\hat{p}_i)\\big]",
        },
        {
          kind: "para",
          html: "The intuition is a system of rewards and penalties. When the true label is 1, the loss is \\(-\\log \\hat{p}\\): predict a probability near 1 and the penalty is tiny; predict near 0 and the penalty rockets toward infinity. Confident wrong answers are punished savagely, which pushes the model toward honest, well-calibrated probabilities.",
        },
        {
          kind: "callout",
          tone: "amber",
          title: "A convex landscape",
          html: "Crucially, cross-entropy is <em>convex</em> for logistic regression — one global minimum, no traps. Gradient descent is guaranteed to find the best fit from any starting point. This is the same convexity you met in the optimisation chapter, and it is why logistic regression trains reliably and quickly even on large datasets.",
        },
      ],
    },
    {
      badge: "Practice · Page 4",
      title: "Regularisation & Multiclass",
      blocks: [
        {
          kind: "para",
          html: "Two practical extensions turn the textbook model into the everyday tool.",
        },
        {
          kind: "heading",
          text: "Regularisation",
        },
        {
          kind: "para",
          html: "Left unchecked, logistic regression can grow huge coefficients to fit noise, especially with many features. <em>Regularisation</em> adds a penalty on coefficient size — L2 (ridge) shrinks them smoothly, L1 (lasso) drives some to exactly zero, performing feature selection. In scikit-learn this is controlled by the parameter <code>C</code>, which is the <em>inverse</em> of regularisation strength: small <code>C</code> means strong regularisation.",
        },
        {
          kind: "callout",
          tone: "red",
          title: "The C parameter trips everyone up",
          html: "Because <code>C</code> is inverted, intuition runs backwards: a <em>smaller</em> <code>C</code> means <em>more</em> regularisation and a simpler model, while a large <code>C</code> lets the model fit the training data more aggressively. Mixing this up is one of the most common tuning mistakes beginners make.",
        },
        {
          kind: "heading",
          text: "More than two classes",
        },
        {
          kind: "para",
          html: "For multiclass problems, logistic regression generalises in two ways: <em>one-vs-rest</em> trains a separate binary classifier per class, while <em>softmax</em> (multinomial) regression extends the sigmoid into a function that outputs a full probability distribution across all classes at once. Softmax is the very same output layer used at the end of most neural network classifiers — another preview of what is coming.",
        },
      ],
    },
    {
      badge: "Application · Page 5",
      title: "Strengths, Limits & When to Use It",
      blocks: [
        {
          kind: "para",
          html: "Logistic regression endures because its trade-offs are excellent for a huge range of real problems.",
        },
        {
          kind: "table",
          headers: ["Strengths", "Limitations"],
          rows: [
            ["Fast to train, even on big data", "Only learns linear decision boundaries"],
            ["Outputs calibrated probabilities", "Underfits complex, non-linear patterns"],
            ["Highly interpretable coefficients", "Sensitive to correlated features"],
            ["Rarely overfits with regularisation", "Needs feature engineering for interactions"],
          ],
        },
        {
          kind: "callout",
          tone: "teal",
          title: "Where it shines",
          html: "Credit scoring, medical risk models, churn prediction, click-through-rate estimation, and any setting where you must <em>explain</em> the decision (regulators love interpretable coefficients). It is the default first model for tabular classification — establish its score, then justify any more complex model by how much it beats this baseline.",
        },
        {
          kind: "callout",
          tone: "amber",
          title: "What to carry forward",
          html: "Logistic regression is linear regression passed through a sigmoid to produce probabilities, trained by minimising convex cross-entropy. The boundary is linear; coefficients are log-odds. Regularise with <code>C</code> (smaller = stronger), and reach for softmax when classes exceed two. It is the baseline every other classifier must justify itself against.",
        },
      ],
    },
  ],

  quiz: [
    {
      id: "lr-q1",
      question: "Despite its name, what kind of algorithm is logistic regression?",
      options: [
        "A classification algorithm that outputs probabilities",
        "A regression algorithm that predicts a continuous target bounded between 0 and 1",
        "A semi-supervised algorithm that combines regression on labelled data with clustering on unlabelled data",
        "A regression algorithm that transforms the target with a log function before fitting"
      ],
      correctIndex: 0,
      explanation:
        "Logistic regression is a classification algorithm. It computes a linear score then passes it through the sigmoid to output a probability between 0 and 1, which is thresholded into a class decision.",
    },
    {
      id: "lr-q2",
      question: "What does the sigmoid function do to the linear score z?",
      options: [
        "Normalises z by the sum of all class scores to produce a valid probability distribution",
        "Clips the score to [−1, 1] so the model cannot output extreme predictions",
        "Applies the natural logarithm to convert the score into a log-odds representation",
        "Maps any real number onto the interval (0, 1) as a probability"
      ],
      correctIndex: 3,
      explanation:
        "The sigmoid σ(z) = 1/(1+e^−z) squashes any real-valued score into (0, 1). Large positive z → near 1, large negative z → near 0, and z = 0 → exactly 0.5 (the decision boundary).",
    },
    {
      id: "lr-q3",
      question: "Why does logistic regression use cross-entropy loss instead of squared error?",
      options: [
        "Squared error against a sigmoid is non-convex; cross-entropy is convex with one global minimum",
        "Cross-entropy is faster to compute because it avoids the squaring operation on each residual",
        "Squared error requires the labels to be continuous, whereas cross-entropy handles binary labels",
        "Cross-entropy produces sparser gradients, which speeds up convergence for high-dimensional features"
      ],
      correctIndex: 0,
      explanation:
        "Squared error against the sigmoid produces a non-convex surface with bad local minima. Cross-entropy is convex for logistic regression, so gradient descent reliably finds the single global optimum.",
    },
    {
      id: "lr-q4",
      question: "In scikit-learn, what does a SMALLER value of the parameter C do?",
      options: [
        "Applies stronger regularisation, producing a simpler model",
        "Reduces the learning rate so that gradient descent takes smaller steps",
        "Limits the maximum number of iterations before the solver declares convergence",
        "Applies weaker regularisation, allowing the model to fit the training data harder"
      ],
      correctIndex: 0,
      explanation:
        "C is the inverse of regularisation strength. A smaller C means stronger regularisation and a simpler model; a larger C lets the model fit more aggressively. This inversion is a common source of confusion.",
    },
    {
      id: "lr-q5",
      question: "How should you interpret a logistic regression coefficient β for a feature?",
      options: [
        "β is the feature's standardised importance, directly comparable to coefficients from other features",
        "β represents the partial derivative of accuracy with respect to that feature across the training set",
        "A one-unit increase multiplies the odds of the positive class by e^β",
        "A one-unit increase in the feature adds β directly to the predicted probability of the positive class"
      ],
      correctIndex: 2,
      explanation:
        "The linear score is the log-odds, so a coefficient acts multiplicatively on the odds: a one-unit increase multiplies the odds by e^β. The model is linear in log-odds, even though it curves in probability.",
    },
  ],

  exercises: [
    {
      id: "lr-ex1",
      title: "Train a Logistic Regression Classifier",
      intro:
        "Build a logistic regression model on the breast cancer dataset, step by step.",
      parts: [
        {
          id: "lr-ex1-a",
          label: "a",
          prompt:
            "Load the breast cancer dataset with load_breast_cancer(return_X_y=True) and print the shape of X. (Expected: (569, 30))",
          starterCode:
            "from sklearn.datasets import load_breast_cancer\n\nX, y = load_breast_cancer(return_X_y=True)\n# YOUR CODE HERE\n",
          expectedStdout: "(569, 30)",
          hints: ["X is a NumPy array; use X.shape.", "print(X.shape)"],
          solution:
            "from sklearn.datasets import load_breast_cancer\nX, y = load_breast_cancer(return_X_y=True)\nprint(X.shape)",
        },
        {
          id: "lr-ex1-b",
          label: "b",
          prompt:
            "Split into train and test sets with test_size=0.2 and random_state=42. Print the number of training and test samples, space-separated. (Expected: 455 114)",
          starterCode:
            "from sklearn.model_selection import train_test_split\n\n# YOUR CODE HERE\n",
          expectedStdout: "455 114",
          hints: [
            "train_test_split(X, y, test_size=0.2, random_state=42)",
            "print(len(X_train), len(X_test))",
          ],
          solution:
            "from sklearn.model_selection import train_test_split\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\nprint(len(X_train), len(X_test))",
        },
        {
          id: "lr-ex1-c",
          label: "c",
          prompt:
            "Train LogisticRegression(max_iter=5000, random_state=42) on the training set, predict on the test set, and print the accuracy rounded to 2 decimals. (Expected: 0.96)",
          starterCode:
            "from sklearn.linear_model import LogisticRegression\nfrom sklearn.metrics import accuracy_score\n\n# YOUR CODE HERE\n",
          expectedStdout: "0.96",
          hints: [
            "clf = LogisticRegression(max_iter=5000, random_state=42); clf.fit(X_train, y_train)",
            "preds = clf.predict(X_test)",
            "print(round(accuracy_score(y_test, preds), 2))",
          ],
          solution:
            "from sklearn.linear_model import LogisticRegression\nfrom sklearn.metrics import accuracy_score\nclf = LogisticRegression(max_iter=5000, random_state=42)\nclf.fit(X_train, y_train)\npreds = clf.predict(X_test)\nprint(round(accuracy_score(y_test, preds), 2))",
        },
      ],
    },
  ],

  cheatsheet: [
    {
      heading: "The Model",
      items: [
        { term: "Purpose", note: "Classification — outputs a probability, not a raw number." },
        { term: "Linear score", note: "Weighted sum of features, like linear regression.", formula: "z=\\beta_0+\\sum\\beta_i x_i" },
        { term: "Sigmoid", note: "Squashes z into (0, 1).", formula: "\\sigma(z)=\\tfrac{1}{1+e^{-z}}" },
        { term: "Decision boundary", note: "Linear; where p = 0.5 (z = 0)." },
      ],
    },
    {
      heading: "Interpretation",
      items: [
        { term: "Log-odds", note: "The linear score z is the log-odds of the positive class." },
        { term: "Odds ratio", note: "A one-unit feature increase multiplies odds by e^β." },
        { term: "Probability", note: "Curved in probability, linear in log-odds." },
      ],
    },
    {
      heading: "Training",
      items: [
        { term: "Cross-entropy", note: "Log loss; penalises confident wrong answers.", formula: "L=-\\tfrac{1}{n}\\sum[y\\log\\hat{p}+(1-y)\\log(1-\\hat{p})]" },
        { term: "Convex", note: "One global minimum; gradient descent always converges." },
        { term: "Regularisation C", note: "Inverse strength: smaller C = stronger = simpler." },
        { term: "L1 / L2", note: "L1 zeros coefficients (selection); L2 shrinks smoothly." },
      ],
    },
    {
      heading: "In Practice",
      items: [
        { term: "Multiclass", note: "One-vs-rest, or softmax for a full distribution." },
        { term: "Softmax link", note: "Same output layer used by neural net classifiers." },
        { term: "Strengths", note: "Fast, interpretable, calibrated, rarely overfits." },
        { term: "Limits", note: "Only linear boundaries; underfits complex patterns." },
      ],
    },
  ],
};