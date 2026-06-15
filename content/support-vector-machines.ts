import { Subject } from "./types";

export const supportVectorMachines: Subject = {
  slug: "support-vector-machines",
  title: "Support Vector Machines",
  icon: "margin",
  phase: 1,
  blurb:
    "The geometry of the widest street. Finds the boundary with the largest margin between classes, and uses the kernel trick to draw curved boundaries in disguise — elegant, powerful, and a lesson in why scaling matters.",
  sources: [
    "Hastie, Tibshirani & Friedman — ESL, 2nd ed., Ch. 12",
    "James, Witten, Hastie & Tibshirani — ISLR, 2nd ed., Ch. 9",
    "Cortes & Vapnik — Support-Vector Networks (1995)",
    "Géron, A. — Hands-On Machine Learning, 3rd ed., Ch. 5",
  ],

  theory: [
    {
      badge: "Intuition · Page 1",
      title: "The Widest Possible Street",
      blocks: [
        {
          kind: "para",
          html: "Picture two classes of points you want to separate with a line. Many lines would do it — but they are not equally good. A line that grazes right past the points of one class is fragile: a slightly new point could fall on the wrong side. A <em>Support Vector Machine</em> asks for the most robust line of all — the one that sits in the middle of the widest empty corridor between the classes.",
        },
        {
          kind: "para",
          html: "Think of it as paving the widest possible street between the two groups. The centre line of that street is the decision boundary; the width of the street is the <em>margin</em>. By maximising the margin, the SVM leaves the largest possible buffer on both sides, which tends to generalise well to unseen data.",
        },
        {
          kind: "callout",
          tone: "purple",
          title: "Why learn it",
          html: "SVMs introduce a different and beautiful principle — <em>margin maximisation</em> — and the famous <em>kernel trick</em>, a piece of mathematical sleight-of-hand that lets a fundamentally linear method carve out complex curved boundaries. They were the dominant classifier before deep learning and remain excellent on small-to-medium datasets with many features.",
        },
      ],
    },
    {
      badge: "Foundations · Page 2",
      title: "Margins and Support Vectors",
      blocks: [
        {
          kind: "para",
          html: "The <em>margin</em> is the distance from the decision boundary to the nearest data points on either side. The SVM positions the boundary to make this margin as large as possible — the defining optimisation of the method.",
        },
        {
          kind: "heading",
          text: "The support vectors",
        },
        {
          kind: "para",
          html: "Here is the elegant part: only the points right on the edge of the street — the closest ones — actually determine where the boundary goes. These critical points are the <em>support vectors</em>. Every other point, however far inside its class, could be moved or deleted without changing the boundary at all. The entire model is defined by a handful of borderline cases.",
        },
        {
          kind: "callout",
          tone: "teal",
          title: "Why this is powerful",
          html: "Because only support vectors matter, the model is compact and memory-efficient — it can ignore the bulk of the training data once trained. It also means SVMs are relatively robust to outliers that sit comfortably within their class, since those points have no influence on the boundary.",
        },
        {
          kind: "heading",
          text: "Soft margins",
        },
        {
          kind: "para",
          html: "Real data is rarely perfectly separable, so SVMs use a <em>soft margin</em> that permits some points to sit inside the street or even on the wrong side, paying a penalty for each. The parameter \\(C\\) controls the trade-off: how much to penalise these violations versus how wide to keep the margin.",
        },
      ],
    },
    {
      badge: "Mechanics · Page 3",
      title: "The Kernel Trick",
      blocks: [
        {
          kind: "para",
          html: "A straight line cannot separate classes arranged in circles or spirals. The SVM's celebrated solution is the <em>kernel trick</em> — arguably the most elegant idea in classical machine learning.",
        },
        {
          kind: "para",
          html: "The idea: project the data into a much higher-dimensional space where a straight boundary <em>can</em> separate the classes, then find the maximum-margin plane there. Mapped back to the original space, that flat boundary becomes a curve. Data that is hopelessly tangled in two dimensions often becomes cleanly separable in higher ones.",
        },
        {
          kind: "callout",
          tone: "amber",
          title: "Why it's a 'trick'",
          html: "The genius is that you never actually compute the high-dimensional coordinates — which could be infinite-dimensional. A <em>kernel function</em> computes the dot products in that space directly from the original points, as if you had gone there and come back. You reap all the benefit of the vast space at the cost of a simple function evaluation. That shortcut is the trick.",
        },
        {
          kind: "table",
          headers: ["Kernel", "Boundary it draws", "Use when"],
          rows: [
            ["Linear", "Straight line / flat plane", "Data is roughly linearly separable"],
            ["Polynomial", "Curved, polynomial shapes", "Moderate non-linearity"],
            ["RBF (Gaussian)", "Flexible, localised blobs", "The versatile default"],
          ],
        },
        {
          kind: "para",
          html: "The <em>RBF kernel</em> is the usual go-to, governed by a parameter \\(\\gamma\\) that sets how far the influence of each point reaches — small \\(\\gamma\\) gives smooth boundaries, large \\(\\gamma\\) gives wiggly ones that can overfit.",
        },
      ],
    },
    {
      badge: "Practice · Page 4",
      title: "Tuning and the Scaling Imperative",
      blocks: [
        {
          kind: "para",
          html: "Two parameters dominate an RBF SVM, and one preprocessing step is non-negotiable.",
        },
        {
          kind: "table",
          headers: ["Parameter", "Controls", "Effect"],
          rows: [
            ["C", "Penalty for margin violations", "High C: narrow margin, fits hard, risks overfit"],
            ["gamma (γ)", "Reach of each point's influence", "High γ: wiggly, local; low γ: smooth, global"],
          ],
        },
        {
          kind: "para",
          html: "<em>C</em> and \\(\\gamma\\) interact, and tuning them together (via grid search and cross-validation) is the core of getting an SVM to perform. High values of either push toward a complex boundary that can overfit; low values toward a simpler, smoother one.",
        },
        {
          kind: "callout",
          tone: "red",
          title: "Always scale your features",
          html: "Like k-NN, SVMs are <em>distance- and dot-product-based</em>, so features on larger scales dominate the boundary. Failing to standardise features is the most common SVM mistake and can wreck accuracy silently — you will see this dramatically in the exercise, where scaling the wine data lifts accuracy from mediocre to perfect. Standardise first, every time.",
        },
      ],
    },
    {
      badge: "Application · Page 5",
      title: "Strengths, Limits & Legacy",
      blocks: [
        {
          kind: "table",
          headers: ["Strengths", "Limitations"],
          rows: [
            ["Effective in high-dimensional spaces", "Slow to train on very large datasets"],
            ["Memory-efficient (only support vectors)", "Sensitive to C and γ; needs tuning"],
            ["Kernel trick handles non-linearity elegantly", "No native probability output"],
            ["Robust with a clear margin", "Requires careful feature scaling"],
          ],
        },
        {
          kind: "callout",
          tone: "teal",
          title: "Where SVMs shine",
          html: "Small-to-medium datasets with many features and a clear margin: text classification (where features vastly outnumber samples), bioinformatics and gene expression, image classification on modest data, and any problem where the number of features exceeds the number of examples. In that high-dimension, low-sample regime, SVMs often beat everything else.",
        },
        {
          kind: "para",
          html: "On very large datasets, training cost (between quadratic and cubic in the number of samples) makes SVMs impractical, and gradient boosting or neural networks usually win. But on the right problem, an SVM is hard to beat — and the margin-maximisation principle echoes through modern methods.",
        },
        {
          kind: "callout",
          tone: "amber",
          title: "What to carry forward",
          html: "SVMs find the maximum-margin boundary — the widest street between classes — defined only by the support vectors on its edges. The soft margin (parameter \\(C\\)) tolerates messy data; the kernel trick (often RBF, parameter \\(\\gamma\\)) draws curved boundaries without ever visiting the high-dimensional space. Always scale features. Best when features are many and samples are few.",
        },
      ],
    },
  ],

  quiz: [
    {
      id: "sv-q1",
      question: "What does a Support Vector Machine optimise for?",
      options: [
        "The line that passes through the most points",
        "The boundary with the largest margin — the widest gap between the classes",
        "The shortest possible decision boundary",
        "The boundary that uses every data point equally",
      ],
      correctIndex: 1,
      explanation:
        "An SVM finds the maximum-margin boundary: the one sitting in the middle of the widest empty corridor between classes. The large buffer on both sides tends to generalise well to new data.",
    },
    {
      id: "sv-q2",
      question: "What are the support vectors?",
      options: [
        "All the points in the training set",
        "The points closest to the boundary, which alone determine where it sits",
        "The points farthest from the boundary",
        "A random subset chosen for speed",
      ],
      correctIndex: 1,
      explanation:
        "Support vectors are the borderline points on the edge of the margin. Only they determine the boundary — every other point could be moved or removed without changing it, making the model compact.",
    },
    {
      id: "sv-q3",
      question: "What is the essence of the kernel trick?",
      options: [
        "It deletes irrelevant features",
        "It computes dot products in a high-dimensional space directly, without ever computing the coordinates there",
        "It speeds up training by sampling data",
        "It converts the SVM into a decision tree",
      ],
      correctIndex: 1,
      explanation:
        "The kernel trick uses a kernel function to compute dot products in a high- (even infinite-) dimensional space directly from the original points, gaining the power of that space without the cost of visiting it.",
    },
    {
      id: "sv-q4",
      question: "Why must features be scaled before training an SVM?",
      options: [
        "To reduce the number of support vectors",
        "Because SVMs rely on distances and dot products, so larger-scale features dominate the boundary",
        "Scaling is optional for SVMs",
        "To enable probability outputs",
      ],
      correctIndex: 1,
      explanation:
        "SVMs are distance- and dot-product-based, so unscaled large-range features dominate. Standardising is essential — in the exercise, scaling the wine data lifts accuracy from 0.81 to 1.0.",
    },
    {
      id: "sv-q5",
      question: "In which situation do SVMs tend to excel?",
      options: [
        "Very large datasets with millions of rows",
        "Small-to-medium datasets where features outnumber samples and there is a clear margin",
        "Problems requiring calibrated probabilities",
        "Streaming data that changes every second",
      ],
      correctIndex: 1,
      explanation:
        "SVMs shine in high-dimension, low-sample regimes (e.g. text, gene expression) with a clear margin. On very large datasets their training cost (quadratic to cubic in samples) makes them impractical.",
    },
  ],

  exercises: [
    {
      id: "sv-ex1",
      title: "SVMs and the Power of Scaling",
      intro:
        "Train an SVM on the wine dataset and witness firsthand why feature scaling matters — step by step.",
      parts: [
        {
          id: "sv-ex1-a",
          label: "a",
          prompt:
            "Load the wine dataset with load_wine(return_X_y=True), split with test_size=0.2 and random_state=42, and print the number of training and test samples space-separated. (Expected: 142 36)",
          starterCode:
            "from sklearn.datasets import load_wine\nfrom sklearn.model_selection import train_test_split\n\nX, y = load_wine(return_X_y=True)\n# split and print len(X_train), len(X_test)\n",
          expectedStdout: "142 36",
          hints: [
            "train_test_split(X, y, test_size=0.2, random_state=42)",
            "print(len(X_train), len(X_test))",
          ],
          solution:
            "from sklearn.datasets import load_wine\nfrom sklearn.model_selection import train_test_split\nX, y = load_wine(return_X_y=True)\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\nprint(len(X_train), len(X_test))",
        },
        {
          id: "sv-ex1-b",
          label: "b",
          prompt:
            "Train SVC(kernel='rbf', random_state=42) on the UNSCALED data, predict, and print the accuracy rounded to 2 decimals. Note how mediocre it is. (Expected: 0.81)",
          starterCode:
            "from sklearn.svm import SVC\nfrom sklearn.metrics import accuracy_score\n\n# fit on UNSCALED X_train, predict, print round(accuracy, 2)\n",
          expectedStdout: "0.81",
          hints: [
            "svm = SVC(kernel='rbf', random_state=42); svm.fit(X_train, y_train)",
            "preds = svm.predict(X_test)",
            "print(round(accuracy_score(y_test, preds), 2))",
          ],
          solution:
            "from sklearn.svm import SVC\nfrom sklearn.metrics import accuracy_score\nsvm = SVC(kernel='rbf', random_state=42)\nsvm.fit(X_train, y_train)\npreds = svm.predict(X_test)\nprint(round(accuracy_score(y_test, preds), 2))",
        },
        {
          id: "sv-ex1-c",
          label: "c",
          prompt:
            "Now standardise with StandardScaler (fit on train, transform both), retrain the same SVC on the SCALED data, and print the new accuracy rounded to 2 decimals. Watch it jump. (Expected: 1.0)",
          starterCode:
            "from sklearn.preprocessing import StandardScaler\n\n# scaler = StandardScaler(); fit_transform train, transform test\n# train SVC on scaled data, predict, print round(accuracy, 2)\n",
          expectedStdout: "1.0",
          hints: [
            "scaler = StandardScaler(); X_train_s = scaler.fit_transform(X_train); X_test_s = scaler.transform(X_test)",
            "svm2 = SVC(kernel='rbf', random_state=42); svm2.fit(X_train_s, y_train)",
            "print(round(accuracy_score(y_test, svm2.predict(X_test_s)), 2))",
          ],
          solution:
            "from sklearn.preprocessing import StandardScaler\nscaler = StandardScaler()\nX_train_s = scaler.fit_transform(X_train)\nX_test_s = scaler.transform(X_test)\nsvm2 = SVC(kernel='rbf', random_state=42)\nsvm2.fit(X_train_s, y_train)\nprint(round(accuracy_score(y_test, svm2.predict(X_test_s)), 2))",
        },
      ],
    },
  ],

  cheatsheet: [
    {
      heading: "The Idea",
      items: [
        { term: "Principle", note: "Maximise the margin — the widest street between classes." },
        { term: "Margin", note: "Distance from boundary to nearest points; maximised." },
        { term: "Support vectors", note: "The edge points that alone define the boundary." },
        { term: "Compact", note: "Only support vectors are kept; memory-efficient." },
      ],
    },
    {
      heading: "Soft Margin",
      items: [
        { term: "Why", note: "Real data isn't perfectly separable; allow some violations." },
        { term: "C parameter", note: "Penalty for violations. High C: narrow margin, risks overfit." },
        { term: "Robustness", note: "Outliers inside their class don't move the boundary." },
      ],
    },
    {
      heading: "Kernel Trick",
      items: [
        { term: "Idea", note: "Separate in high dimensions; boundary curves back in original." },
        { term: "The trick", note: "Kernel computes high-dim dot products without the coordinates." },
        { term: "RBF (default)", note: "Flexible blobs; γ sets reach (high = wiggly)." },
        { term: "Linear / Poly", note: "Straight / polynomial-curved boundaries." },
      ],
    },
    {
      heading: "Practice",
      items: [
        { term: "Scale features", note: "Essential — distance-based; large ranges dominate." },
        { term: "Tune C & γ", note: "Grid search + cross-validation; they interact." },
        { term: "Best for", note: "Many features, few samples, clear margin (e.g. text)." },
        { term: "Limits", note: "Slow on large data; no native probabilities." },
      ],
    },
  ],
};