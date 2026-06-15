import { Subject } from "./types";

export const gradientBoosting: Subject = {
  slug: "gradient-boosting",
  title: "Gradient Boosting",
  icon: "boosting",
  phase: 1,
  blurb:
    "The champion of tabular data. Builds an ensemble of small trees one at a time, each correcting the last one's mistakes — the algorithm behind XGBoost, LightGBM, and a thousand winning Kaggle solutions.",
  sources: [
    "Hastie, Tibshirani & Friedman — ESL, 2nd ed., Ch. 10",
    "Friedman, J. — Greedy Function Approximation: A Gradient Boosting Machine (2001)",
    "Chen & Guestrin — XGBoost: A Scalable Tree Boosting System (2016)",
    "Géron, A. — Hands-On Machine Learning, 3rd ed., Ch. 7",
  ],

  theory: [
    {
      badge: "Intuition · Page 1",
      title: "Learning From Your Mistakes",
      blocks: [
        {
          kind: "para",
          html: "Random forests build hundreds of deep trees independently and average them — wisdom of an independent crowd. Gradient boosting takes the opposite approach: it builds trees <em>sequentially</em>, and each new tree is trained specifically to fix the errors the current ensemble is still making. It is less a crowd and more an apprenticeship, where every learner studies exactly where its predecessor went wrong.",
        },
        {
          kind: "para",
          html: "The trees are deliberately <em>weak</em> — shallow stumps that individually barely outperform guessing. But adding hundreds of them, each nudging the prediction a little closer to the truth in the direction of the current error, compounds into one of the most accurate models available for structured, tabular data.",
        },
        {
          kind: "callout",
          tone: "purple",
          title: "Why it matters",
          html: "For tabular data — rows and columns of mixed numeric and categorical features — gradient boosting is, more often than not, the single best-performing algorithm. Its industrial implementations (XGBoost, LightGBM, CatBoost) dominate machine-learning competitions and power countless production systems in finance, search, and recommendation. If deep learning rules images and text, boosting rules the spreadsheet.",
        },
      ],
    },
    {
      badge: "Foundations · Page 2",
      title: "Boosting vs Bagging",
      blocks: [
        {
          kind: "para",
          html: "Both random forests and gradient boosting are <em>ensembles</em> of trees, but they combine them through opposite philosophies. Understanding the contrast is the fastest way to grasp boosting.",
        },
        {
          kind: "table",
          headers: ["", "Bagging (Random Forest)", "Boosting (Gradient Boosting)"],
          rows: [
            ["Trees built", "Independently, in parallel", "Sequentially, each fixing the last"],
            ["Tree depth", "Deep, full-grown", "Shallow, weak stumps"],
            ["Combines by", "Averaging / voting", "Additive sum of corrections"],
            ["Reduces mainly", "Variance", "Bias"],
            ["Overfitting risk", "Low and forgiving", "Higher — needs careful tuning"],
          ],
        },
        {
          kind: "para",
          html: "A random forest reduces <em>variance</em> by averaging many independent high-variance trees. Gradient boosting reduces <em>bias</em> by repeatedly adding corrections that chip away at the remaining error. This is why boosting often reaches higher accuracy — but also why it is easier to overfit and demands more careful tuning.",
        },
      ],
    },
    {
      badge: "Mechanics · Page 3",
      title: "Why It's Called 'Gradient'",
      blocks: [
        {
          kind: "para",
          html: "The name unites two ideas you have already met: <em>boosting</em> (sequential error-correction) and the <em>gradient</em> from the optimisation chapter. The insight that ties them together is elegant.",
        },
        {
          kind: "para",
          html: "Each new tree is fit not to the original target, but to the <em>negative gradient</em> of the loss function with respect to the current predictions — in the simplest case, the <em>residuals</em>, the gaps between predictions and truth. Fitting trees to residuals is literally performing gradient descent, but in the space of functions rather than the space of parameters. Each tree is one downhill step on the loss landscape.",
        },
        {
          kind: "equation",
          label: "Additive update with learning rate",
          tex: "F_{m}(x) = F_{m-1}(x) + \\eta\\, h_m(x)",
        },
        {
          kind: "para",
          html: "Here \\(F_{m-1}\\) is the current ensemble, \\(h_m\\) is the new tree fit to the residuals, and \\(\\eta\\) is the <em>learning rate</em> — the same step-size idea from gradient descent, controlling how big a correction each tree contributes.",
        },
        {
          kind: "callout",
          tone: "teal",
          title: "The residual insight",
          html: "Picture predicting house prices. Start by guessing the average for everyone. Compute each home's residual (actual minus guess). Fit a small tree to predict those residuals, add a fraction of it, and your predictions improve. Recompute residuals, fit another tree, repeat. Each tree mops up the error the previous ensemble left behind — boosting in one sentence.",
        },
      ],
    },
    {
      badge: "Practice · Page 4",
      title: "The Tuning Tradeoff",
      blocks: [
        {
          kind: "para",
          html: "Boosting's power comes with sensitivity: a few key hyperparameters interact, and getting them wrong means either underfitting or overfitting. Three matter most.",
        },
        {
          kind: "table",
          headers: ["Parameter", "Controls", "Effect"],
          rows: [
            ["n_estimators", "Number of trees", "More fits harder; too many overfit"],
            ["learning_rate", "Size of each tree's contribution", "Smaller is safer but needs more trees"],
            ["max_depth", "Complexity of each tree", "Deeper captures interactions, risks overfit"],
          ],
        },
        {
          kind: "callout",
          tone: "amber",
          title: "The learning-rate / n_estimators dance",
          html: "These two trade off directly. A <em>small</em> learning rate makes each tree cautious, so you need <em>more</em> trees to converge — but the result usually generalises better. The standard recipe: set a low learning rate (say 0.01–0.1), then use as many trees as needed, stopping early when validation error stops improving. Lowering the learning rate while raising the tree count is the most reliable way to boost accuracy.",
        },
        {
          kind: "callout",
          tone: "red",
          title: "Overfitting watch",
          html: "Unlike random forests, adding more trees to a boosting model does <em>not</em> eventually plateau safely — past the optimum, extra trees start fitting noise and test performance degrades. <em>Early stopping</em> — halting when a validation score stops improving — is essential, not optional.",
        },
      ],
    },
    {
      badge: "Application · Page 5",
      title: "XGBoost and the Modern Landscape",
      blocks: [
        {
          kind: "para",
          html: "Plain gradient boosting is the foundation; the algorithms you will actually use in practice are its highly optimised descendants.",
        },
        {
          kind: "table",
          headers: ["Library", "Known for"],
          rows: [
            ["XGBoost", "Regularisation, speed; the competition standard"],
            ["LightGBM", "Very fast on large data; leaf-wise growth"],
            ["CatBoost", "Handles categorical features automatically"],
            ["scikit-learn", "HistGradientBoosting; simple and solid"],
          ],
        },
        {
          kind: "para",
          html: "These add engineering refinements — regularisation, clever handling of missing values, parallelised tree construction, smarter splitting — but the core remains Friedman's gradient boosting. Learn the principle and every one of these tools becomes familiar.",
        },
        {
          kind: "callout",
          tone: "teal",
          title: "When to reach for it",
          html: "Almost any tabular prediction task where accuracy matters more than interpretability: credit risk, click-through prediction, ranking, demand forecasting, fraud detection. The usual workflow is logistic regression for a baseline, then gradient boosting to push accuracy as far as it will go.",
        },
        {
          kind: "callout",
          tone: "amber",
          title: "What to carry forward",
          html: "Gradient boosting builds shallow trees sequentially, each fit to the previous ensemble's residuals — gradient descent in function space. It reduces bias and reaches top-tier accuracy on tabular data, but overfits without care: use a small learning rate with many trees and early stopping. XGBoost, LightGBM, and CatBoost are its production-grade forms.",
        },
      ],
    },
  ],

  quiz: [
    {
      id: "gb-q1",
      question: "How does gradient boosting build its ensemble of trees?",
      options: [
        "A single large tree is iteratively pruned until the depth matches the number of boosting rounds",
        "Trees are built in parallel and combined via a weighted majority vote based on their accuracy",
        "Each tree is trained on a random bootstrap sample and the results are averaged to reduce variance",
        "Sequentially, each new tree correcting the errors of the current ensemble"
      ],
      correctIndex: 3,
      explanation:
        "Boosting builds trees one at a time, each trained to fix the residual errors left by the trees so far. This sequential error-correction contrasts with a random forest's independent, parallel trees.",
    },
    {
      id: "gb-q2",
      question: "What does each new tree in gradient boosting actually fit?",
      options: [
        "The cumulative average of all previous tree outputs, scaled by the learning rate",
        "The residuals — the negative gradient of the loss with respect to current predictions",
        "The original target labels, re-weighted so misclassified examples receive higher weight",
        "A random feature subset to encourage diversity and reduce correlation between trees"
      ],
      correctIndex: 1,
      explanation:
        "Each tree fits the negative gradient of the loss (the residuals in the simplest case). Fitting trees to residuals is gradient descent performed in function space — the source of the 'gradient' in the name.",
    },
    {
      id: "gb-q3",
      question: "Compared with a random forest, gradient boosting mainly reduces which error?",
      options: [
        "Irreducible error, by weighting training examples to remove the effect of label noise",
        "Both bias and variance simultaneously, since sequential building is strictly superior to parallel",
        "Bias, by sequentially adding corrections to the residual error",
        "Variance, by averaging independent trees — the same mechanism as a random forest"
      ],
      correctIndex: 2,
      explanation:
        "Random forests reduce variance by averaging high-variance trees; boosting reduces bias by repeatedly correcting remaining error. This is why boosting often reaches higher accuracy but overfits more easily.",
    },
    {
      id: "gb-q4",
      question: "How do learning rate and number of trees trade off in gradient boosting?",
      options: [
        "A smaller learning rate needs more trees but usually generalises better",
        "A larger learning rate is strictly better and always needs fewer trees to reach the same accuracy",
        "The two are independent — the optimal number of trees is always determined by cross-validation alone",
        "A larger learning rate needs more trees to counteract the instability introduced by large steps"
      ],
      correctIndex: 0,
      explanation:
        "A small learning rate makes each tree's contribution cautious, requiring more trees to converge, but typically generalising better. The standard recipe is low learning rate + many trees + early stopping.",
    },
    {
      id: "gb-q5",
      question: "Why is early stopping important for gradient boosting but less so for random forests?",
      options: [
        "Random forests apply regularisation internally via subsampling, which makes them immune to overfitting",
        "Adding too many boosting trees starts fitting noise and degrades test performance",
        "Early stopping is irrelevant for both — the number of trees is always a tunable hyperparameter",
        "Gradient boosting uses deeper trees than random forests, and deeper trees always require more careful stopping"
      ],
      correctIndex: 1,
      explanation:
        "Past the optimum, extra boosting trees fit noise and test error rises — performance does not plateau safely as it does for random forests. Early stopping on a validation score is therefore essential.",
    },
  ],

  exercises: [
    {
      id: "gb-ex1",
      title: "Train a Gradient Boosting Classifier",
      intro:
        "Build a gradient boosting model on the breast cancer dataset, step by step.",
      parts: [
        {
          id: "gb-ex1-a",
          label: "a",
          prompt:
            "Load the breast cancer dataset with load_breast_cancer(return_X_y=True), split with test_size=0.2 and random_state=42, and print the number of training and test samples space-separated. (Expected: 455 114)",
          starterCode:
            "from sklearn.datasets import load_breast_cancer\nfrom sklearn.model_selection import train_test_split\n\nX, y = load_breast_cancer(return_X_y=True)\n# YOUR CODE HERE\n",
          expectedStdout: "455 114",
          hints: [
            "train_test_split(X, y, test_size=0.2, random_state=42)",
            "print(len(X_train), len(X_test))",
          ],
          solution:
            "from sklearn.datasets import load_breast_cancer\nfrom sklearn.model_selection import train_test_split\nX, y = load_breast_cancer(return_X_y=True)\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\nprint(len(X_train), len(X_test))",
        },
        {
          id: "gb-ex1-b",
          label: "b",
          prompt:
            "Train GradientBoostingClassifier(n_estimators=100, random_state=42), predict on the test set, and print the accuracy rounded to 2 decimals. (Expected: 0.96)",
          starterCode:
            "from sklearn.ensemble import GradientBoostingClassifier\nfrom sklearn.metrics import accuracy_score\n\n# YOUR CODE HERE\n",
          expectedStdout: "0.96",
          hints: [
            "gb = GradientBoostingClassifier(n_estimators=100, random_state=42); gb.fit(X_train, y_train)",
            "preds = gb.predict(X_test)",
            "print(round(accuracy_score(y_test, preds), 2))",
          ],
          solution:
            "from sklearn.ensemble import GradientBoostingClassifier\nfrom sklearn.metrics import accuracy_score\ngb = GradientBoostingClassifier(n_estimators=100, random_state=42)\ngb.fit(X_train, y_train)\npreds = gb.predict(X_test)\nprint(round(accuracy_score(y_test, preds), 2))",
        },
        {
          id: "gb-ex1-c",
          label: "c",
          prompt:
            "Print the number of features the model saw, using gb.n_features_in_. (Expected: 30)",
          starterCode:
            "# YOUR CODE HERE\n",
          expectedStdout: "30",
          hints: [
            "Fitted scikit-learn models store the feature count in n_features_in_.",
            "print(gb.n_features_in_)",
          ],
          solution: "print(gb.n_features_in_)",
        },
      ],
    },
  ],

  cheatsheet: [
    {
      heading: "The Idea",
      items: [
        { term: "Principle", note: "Sequential trees, each fixing the previous ensemble's errors." },
        { term: "Weak learners", note: "Shallow stumps; powerful only in aggregate." },
        { term: "Reduces bias", note: "Corrections chip away at remaining error." },
        { term: "Best for", note: "Tabular data — often the top performer." },
      ],
    },
    {
      heading: "Boosting vs Bagging",
      items: [
        { term: "Bagging (RF)", note: "Independent deep trees, averaged; cuts variance." },
        { term: "Boosting (GB)", note: "Sequential weak trees, summed; cuts bias." },
        { term: "Overfit risk", note: "Forest forgiving; boosting needs careful tuning." },
      ],
    },
    {
      heading: "Why 'Gradient'",
      items: [
        { term: "Fits residuals", note: "Each tree targets the negative gradient of the loss." },
        { term: "Function-space GD", note: "Adding trees = gradient descent over functions." },
        { term: "Additive update", note: "Ensemble grows by a fraction of each new tree.", formula: "F_m=F_{m-1}+\\eta\\,h_m" },
      ],
    },
    {
      heading: "Tuning & Tools",
      items: [
        { term: "learning_rate", note: "Smaller = safer but needs more trees." },
        { term: "n_estimators", note: "More trees fit harder; too many overfit." },
        { term: "Early stopping", note: "Essential — extra trees eventually fit noise." },
        { term: "Libraries", note: "XGBoost, LightGBM, CatBoost — optimised forms." },
      ],
    },
  ],
};