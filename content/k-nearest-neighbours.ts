import { Subject } from "./types";

export const kNearestNeighbours: Subject = {
  slug: "k-nearest-neighbours",
  title: "k-Nearest Neighbours",
  icon: "neighbors",
  phase: 1,
  blurb:
    "The simplest idea in machine learning: to classify a point, look at its closest neighbours and let them vote. No training, no equations — just distance, memory, and a lesson in why scaling matters.",
  sources: [
    "James, Witten, Hastie & Tibshirani — ISLR, 2nd ed., Ch. 2, 4",
    "Hastie, Tibshirani & Friedman — ESL, 2nd ed., Ch. 13",
    "Géron, A. — Hands-On Machine Learning, 3rd ed., Ch. 5",
    "Cover & Hart — Nearest Neighbor Pattern Classification (1967)",
  ],

  theory: [
    {
      badge: "Intuition · Page 1",
      title: "You Are the Company You Keep",
      blocks: [
        {
          kind: "para",
          html: "Here is the entire idea: to predict the label of a new point, find the handful of training points closest to it and let them vote. Classifying a fruit? Look at the most similar fruits you have seen and go with the majority. There is no model to fit, no parameters to learn, no equation to solve. The training data <em>is</em> the model.",
        },
        {
          kind: "para",
          html: "This makes k-Nearest Neighbours a <em>lazy</em> learner — it does no work at training time, simply memorising the data, and defers all computation to prediction time, when it measures distances and tallies votes. It is the conceptual opposite of logistic regression, which works hard up front to learn coefficients and then predicts instantly.",
        },
        {
          kind: "callout",
          tone: "purple",
          title: "Why learn it",
          html: "k-NN is the gentlest possible introduction to two ideas that run through all of machine learning: <em>similarity as distance</em>, and the <em>bias–variance tradeoff</em> made visible through a single, tunable knob. It also delivers a hard, memorable lesson about why feature scaling is not optional — one you will carry into every distance-based method that follows.",
        },
      ],
    },
    {
      badge: "Foundations · Page 2",
      title: "Distance Is Everything",
      blocks: [
        {
          kind: "para",
          html: "Since k-NN classifies by closeness, it needs a precise definition of \"close.\" The default is <em>Euclidean distance</em> — ordinary straight-line distance, the same norm you met in linear algebra.",
        },
        {
          kind: "equation",
          label: "Euclidean distance",
          tex: "d(\\mathbf{a}, \\mathbf{b}) = \\sqrt{\\sum_{i=1}^{p}(a_i - b_i)^2}",
        },
        {
          kind: "para",
          html: "Other distances suit other data: <em>Manhattan distance</em> (summed absolute differences) for grid-like or high-dimensional data, <em>cosine distance</em> for text and direction-based features. But Euclidean is the workhorse and the default you should assume unless told otherwise.",
        },
        {
          kind: "callout",
          tone: "red",
          title: "The scaling trap — k-NN's defining lesson",
          html: "Distance sums contributions from every feature, so a feature measured in large units dominates. Imagine income (range 0–100,000) and age (range 0–100) in the same dataset: the income difference utterly swamps the age difference, and k-NN effectively ignores age entirely. <em>You must standardise features</em> (rescale each to comparable ranges) before using k-NN. Forgetting this is the single most common — and most silent — k-NN mistake.",
        },
      ],
    },
    {
      badge: "Mechanics · Page 3",
      title: "Choosing k",
      blocks: [
        {
          kind: "para",
          html: "The one parameter you control is \\(k\\): how many neighbours vote. Its value is a direct dial on the bias–variance tradeoff, and watching its effect is the clearest illustration of that tradeoff you will find.",
        },
        {
          kind: "table",
          headers: ["k value", "Behaviour", "Risk"],
          rows: [
            ["k = 1", "Follows every single point exactly", "High variance — fits noise, jagged boundary"],
            ["Small k", "Flexible, local boundary", "Sensitive to outliers"],
            ["Large k", "Smooth, averaged boundary", "High bias — washes out real structure"],
            ["k = n", "Always predicts the majority class", "Ignores the input entirely"],
          ],
        },
        {
          kind: "para",
          html: "With \\(k = 1\\), every training point sits in its own little island and a single mislabeled example corrupts its whole neighbourhood — classic overfitting. Crank \\(k\\) too high and the vote averages over so many points that genuine local patterns vanish — underfitting. The sweet spot lives in between, found by cross-validation.",
        },
        {
          kind: "callout",
          tone: "amber",
          title: "Practical tips",
          html: "Use an <em>odd</em> \\(k\\) for two-class problems so votes cannot tie. A common starting point is \\(k = \\sqrt{n}\\), then tune around it. You can also weight votes by distance, so closer neighbours count more than far ones — often a small, free improvement.",
        },
      ],
    },
    {
      badge: "Limits · Page 4",
      title: "The Curse of Dimensionality",
      blocks: [
        {
          kind: "para",
          html: "k-NN is beautifully simple, but it has an Achilles' heel that becomes severe as the number of features grows — a phenomenon with the evocative name the <em>curse of dimensionality</em>.",
        },
        {
          kind: "para",
          html: "In high dimensions, something deeply counterintuitive happens: <em>everything becomes far from everything else</em>, and worse, all points end up at roughly the <em>same</em> distance from one another. The very notion of a \"nearest\" neighbour loses meaning when the nearest and farthest points are barely distinguishable. Distance-based methods like k-NN degrade badly as a result.",
        },
        {
          kind: "callout",
          tone: "teal",
          title: "Why distances collapse",
          html: "As you add dimensions, the volume of the space explodes exponentially, so your fixed number of training points becomes ever more sparse. To find \\(k\\) neighbours you must reach across an enormous, near-empty space — and those \"neighbours\" are no longer meaningfully similar. This is a key reason dimensionality reduction (like the PCA you met via eigenvectors) is often applied before k-NN.",
        },
        {
          kind: "para",
          html: "Prediction cost is the other practical limit. Because k-NN compares each query against every stored point, prediction is slow on large datasets — \\(O(n)\\) per query in the naive case. Specialised structures (KD-trees, ball trees) speed this up in low dimensions but themselves succumb to the curse as dimensions grow.",
        },
      ],
    },
    {
      badge: "Application · Page 5",
      title: "When to Reach for k-NN",
      blocks: [
        {
          kind: "table",
          headers: ["Strengths", "Limitations"],
          rows: [
            ["Dead simple; no training phase", "Slow prediction on large datasets"],
            ["Naturally handles multiclass", "Fails in high dimensions (the curse)"],
            ["No assumptions about data shape", "Requires careful feature scaling"],
            ["Boundary can be arbitrarily complex", "Sensitive to irrelevant features"],
          ],
        },
        {
          kind: "callout",
          tone: "teal",
          title: "Where it works well",
          html: "Low-dimensional problems with plenty of data and a meaningful notion of similarity: recommendation (\"users like you\"), simple image or handwriting recognition on small feature sets, anomaly detection, and as a quick, assumption-free baseline. It also underpins the intuition behind more advanced similarity methods.",
        },
        {
          kind: "callout",
          tone: "amber",
          title: "What to carry forward",
          html: "k-NN classifies by majority vote among the \\(k\\) closest points — lazy, simple, and powerful in low dimensions. Always scale your features first. Tune \\(k\\) to balance variance (small \\(k\\)) against bias (large \\(k\\)). And respect the curse of dimensionality: when features are many, distances stop meaning anything and k-NN breaks down.",
        },
      ],
    },
  ],

  quiz: [
    {
      id: "kn-q1",
      question: "Why is k-NN called a 'lazy' learner?",
      options: [
        "It often predicts the wrong class",
        "It does no work at training time, deferring all computation to prediction",
        "It only uses one feature",
        "It cannot handle large k",
      ],
      correctIndex: 1,
      explanation:
        "k-NN simply memorises the training data and does nothing until prediction time, when it computes distances and votes. This makes it 'lazy' — the opposite of models that learn parameters up front.",
    },
    {
      id: "kn-q2",
      question: "Why must features be scaled before applying k-NN?",
      options: [
        "To make the model train faster",
        "Because distance sums all features, so a large-range feature dominates and others are ignored",
        "To reduce the number of classes",
        "Scaling is not actually necessary for k-NN",
      ],
      correctIndex: 1,
      explanation:
        "Distance combines every feature, so one measured in large units (e.g. income 0–100,000) swamps one in small units (age 0–100). Without standardising, k-NN effectively ignores the small-range features.",
    },
    {
      id: "kn-q3",
      question: "What happens to the decision boundary as k increases?",
      options: [
        "It becomes jagged and fits noise",
        "It becomes smoother, with higher bias and lower variance",
        "It disappears entirely",
        "It always improves accuracy",
      ],
      correctIndex: 1,
      explanation:
        "Larger k averages over more neighbours, smoothing the boundary (higher bias, lower variance). Too large washes out real structure; too small (k=1) overfits noise. k is a direct dial on the bias–variance tradeoff.",
    },
    {
      id: "kn-q4",
      question: "What is the 'curse of dimensionality' for k-NN?",
      options: [
        "Too many classes confuse the vote",
        "In high dimensions all points become roughly equidistant, so 'nearest' loses meaning",
        "The algorithm runs out of memory",
        "k must equal the number of dimensions",
      ],
      correctIndex: 1,
      explanation:
        "As dimensions grow, space becomes vast and sparse, and distances between points converge — nearest and farthest become nearly indistinguishable. Distance-based methods like k-NN degrade badly as a result.",
    },
    {
      id: "kn-q5",
      question: "For a two-class problem, why choose an odd value of k?",
      options: [
        "Odd numbers train faster",
        "To prevent tied votes between the two classes",
        "Even k is mathematically invalid",
        "It reduces the curse of dimensionality",
      ],
      correctIndex: 1,
      explanation:
        "With two classes, an even k can split evenly and tie. An odd k guarantees a majority, so there is always a clear winner. A common starting point is k = √n, tuned by cross-validation.",
    },
  ],

  exercises: [
    {
      id: "kn-ex1",
      title: "Classify Irises with k-NN",
      intro:
        "Build a k-nearest-neighbours classifier on the iris dataset, step by step.",
      parts: [
        {
          id: "kn-ex1-a",
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
          id: "kn-ex1-b",
          label: "b",
          prompt:
            "Split into train/test with test_size=0.2, random_state=42. Print the number of training and test samples, space-separated. (Expected: 120 30)",
          starterCode:
            "from sklearn.model_selection import train_test_split\n\n# YOUR CODE HERE\n",
          expectedStdout: "120 30",
          hints: [
            "train_test_split(X, y, test_size=0.2, random_state=42)",
            "print(len(X_train), len(X_test))",
          ],
          solution:
            "from sklearn.model_selection import train_test_split\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\nprint(len(X_train), len(X_test))",
        },
        {
          id: "kn-ex1-c",
          label: "c",
          prompt:
            "Train KNeighborsClassifier(n_neighbors=5) on the training set, predict on the test set, and print the accuracy rounded to 2 decimals. (Expected: 1.0)",
          starterCode:
            "from sklearn.neighbors import KNeighborsClassifier\nfrom sklearn.metrics import accuracy_score\n\n# YOUR CODE HERE\n",
          expectedStdout: "1.0",
          hints: [
            "knn = KNeighborsClassifier(n_neighbors=5); knn.fit(X_train, y_train)",
            "preds = knn.predict(X_test)",
            "print(round(accuracy_score(y_test, preds), 2))",
          ],
          solution:
            "from sklearn.neighbors import KNeighborsClassifier\nfrom sklearn.metrics import accuracy_score\nknn = KNeighborsClassifier(n_neighbors=5)\nknn.fit(X_train, y_train)\npreds = knn.predict(X_test)\nprint(round(accuracy_score(y_test, preds), 2))",
        },
      ],
    },
  ],

  cheatsheet: [
    {
      heading: "The Idea",
      items: [
        { term: "Principle", note: "Classify by majority vote of the k closest training points." },
        { term: "Lazy learner", note: "No training; memorises data, computes at prediction time." },
        { term: "Non-parametric", note: "No assumptions about the data's shape." },
      ],
    },
    {
      heading: "Distance",
      items: [
        { term: "Euclidean", note: "Straight-line distance; the default.", formula: "d=\\sqrt{\\sum(a_i-b_i)^2}" },
        { term: "Manhattan", note: "Sum of absolute differences; good in high dimensions." },
        { term: "Cosine", note: "Angle-based; for text and direction features." },
        { term: "Scaling", note: "MUST standardise features first, or large ranges dominate." },
      ],
    },
    {
      heading: "Choosing k",
      items: [
        { term: "Small k", note: "Flexible, low bias, high variance; k=1 overfits noise." },
        { term: "Large k", note: "Smooth, high bias, low variance; washes out structure." },
        { term: "Odd k", note: "Use for 2 classes to avoid tied votes." },
        { term: "Start", note: "k ≈ √n, then tune by cross-validation." },
      ],
    },
    {
      heading: "Limits",
      items: [
        { term: "Curse of dim.", note: "High dimensions make all points equidistant; k-NN breaks." },
        { term: "Slow prediction", note: "Compares each query to all points — O(n) naive." },
        { term: "Irrelevant features", note: "Hurt distance; select or reduce features first." },
        { term: "Best for", note: "Low-dimensional data with a real notion of similarity." },
      ],
    },
  ],
};