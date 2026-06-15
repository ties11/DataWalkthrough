import { Subject } from "./types";

export const kMeans: Subject = {
  slug: "k-means",
  title: "K-Means Clustering",
  icon: "cluster",
  phase: 3,
  blurb:
    "Group unlabelled data into natural clusters without any supervision. K-means is the workhorse of exploratory analysis: fast, interpretable, and the gateway to the world of unsupervised learning.",
  sources: [
    "Hastie, Tibshirani & Friedman — ESL, 2nd ed., Ch. 14",
    "Bishop, C.M. — Pattern Recognition and Machine Learning, Ch. 9",
    "Géron, A. — Hands-On Machine Learning, 3rd ed., Ch. 9",
    "Lloyd, S. — Least Squares Quantization in PCM (1982), IEEE Trans. Inf. Theory",
    "Arthur & Vassilvitskii — K-Means++: The Advantages of Careful Seeding (2007)",
  ],

  // ═══════════════════════════════════════════════════════════
  //  THEORY
  // ═══════════════════════════════════════════════════════════
  theory: [
    // ── PAGE 1 — Intuition ──────────────────────────────────
    {
      badge: "Intuition · Page 1",
      title: "Learning Without Labels",
      blocks: [
        {
          kind: "para",
          html: "Every algorithm you have met so far has been <em>supervised</em>: you hand it data and the correct answer for each row, and it learns the mapping. But labelled data is expensive, slow to collect, and sometimes impossible to obtain. A customer database, a collection of scientific measurements, or a library of images may arrive with no labels at all. What can you learn from structure alone?",
        },
        {
          kind: "para",
          html: "Clustering is the simplest and most natural answer. Instead of predicting a label, you ask: are there natural groups in this data — subsets of points that resemble each other more than they resemble points elsewhere? K-means is the most widely used clustering algorithm because it turns this vague question into a crisp optimisation target, and then solves it efficiently.",
        },
        {
          kind: "callout",
          tone: "purple",
          title: "The core idea in one sentence",
          html: "Partition the data into <em>K</em> groups such that each point belongs to the group whose centre it is closest to, and minimise the total within-group spread.",
        },
        {
          kind: "heading",
          text: "Where clustering is used",
        },
        {
          kind: "table",
          headers: ["Domain", "What is clustered", "Typical goal"],
          rows: [
            ["Marketing", "Customers by purchase behaviour", "Personalised campaigns"],
            ["Biology", "Gene expression profiles", "Discover cell types"],
            ["Computer vision", "Pixel colours", "Image segmentation / compression"],
            ["Anomaly detection", "System logs or transactions", "Identify the outlier cluster"],
            ["NLP", "Document embeddings", "Topic discovery"],
          ],
        },
        {
          kind: "callout",
          tone: "teal",
          title: "Unsupervised ≠ unsupported",
          html: "Clustering still requires choices — how many clusters? which distance metric? — and those choices require domain knowledge. The algorithm is unsupervised; the practitioner is not.",
        },
      ],
    },

    // ── PAGE 2 — The algorithm ──────────────────────────────
    {
      badge: "Algorithm · Page 2",
      title: "Assign, Update, Repeat",
      blocks: [
        {
          kind: "para",
          html: "K-means is an iterative two-step algorithm. You start with <em>K</em> centroids — one per intended cluster. Then you alternate between two steps until nothing changes.",
        },
        {
          kind: "callout",
          tone: "teal",
          title: "Step 1 — Assignment",
          html: "Assign every point to its <em>nearest</em> centroid. Nearness is measured by Euclidean distance (by default). Each centroid \"owns\" its Voronoi cell.",
        },
        {
          kind: "callout",
          tone: "purple",
          title: "Step 2 — Update",
          html: "Move each centroid to the <em>mean</em> of all points now assigned to it. That is why the algorithm is called <em>k</em>-<em>means</em>.",
        },
        {
          kind: "para",
          html: "These two steps are guaranteed to reduce (or maintain) the total within-cluster sum of squares at each iteration. Because the number of possible partitions is finite and each step improves the objective, the algorithm always converges — though not necessarily to the global minimum.",
        },
        {
          kind: "equation",
          label: "Objective — minimise within-cluster inertia",
          tex: "J = \\sum_{k=1}^{K} \\sum_{\\mathbf{x} \\in C_k} \\|\\mathbf{x} - \\boldsymbol{\\mu}_k\\|^2",
        },
        {
          kind: "heading",
          text: "Convergence, not optimality",
        },
        {
          kind: "para",
          html: "K-means converges to a <em>local</em> minimum, not the global one. Two runs with different random initialisations can produce very different clusterings. In practice you run the algorithm many times (typically 10–300) and keep the solution with the lowest \\(J\\). Scikit-learn's default is 10 runs.",
        },
        {
          kind: "callout",
          tone: "amber",
          title: "K-Means++ — smarter initialisation",
          html: "The standard workaround for bad starts: choose the first centroid at random, then each subsequent centroid with probability proportional to its squared distance from the nearest existing centroid. This spreads centroids out, dramatically reducing bad runs. Scikit-learn uses K-Means++ by default (<code>init='k-means++'</code>).",
        },
      ],
    },

    // ── PAGE 3 — Choosing K ─────────────────────────────────
    {
      badge: "Model Selection · Page 3",
      title: "How Many Clusters?",
      blocks: [
        {
          kind: "para",
          html: "K is a hyperparameter you must choose before fitting. There is no universally correct answer — the right K depends on the application. But several quantitative tools help narrow the field.",
        },
        {
          kind: "heading",
          text: "The elbow method",
        },
        {
          kind: "para",
          html: "Plot inertia \\(J\\) against \\(K\\). Inertia always decreases as \\(K\\) increases (at \\(K=n\\) every point is its own cluster and \\(J=0\\)). Look for an \"elbow\" — a point where the curve bends sharply, indicating diminishing returns from adding more clusters. It is a heuristic, not a formal test, and the elbow is sometimes invisible.",
        },
        {
          kind: "heading",
          text: "Silhouette score",
        },
        {
          kind: "para",
          html: "For each point \\(i\\), compute \\(a_i\\) (mean distance to other points in its own cluster) and \\(b_i\\) (mean distance to points in the nearest other cluster). The silhouette of point \\(i\\) is:",
        },
        {
          kind: "equation",
          label: "Silhouette coefficient",
          tex: "s_i = \\frac{b_i - a_i}{\\max(a_i, b_i)}, \\quad s_i \\in [-1, 1]",
        },
        {
          kind: "para",
          html: "A value near 1 means the point is well-placed; near 0 it sits on a border; negative it may belong to the wrong cluster. Average over all points and choose the K that maximises the mean silhouette score.",
        },
        {
          kind: "callout",
          tone: "teal",
          title: "Gap statistic",
          html: "Compares the observed inertia to what you would expect from a uniform random dataset. A more rigorous alternative to the elbow method, though computationally heavier. Implemented in R's <code>cluster</code> package; available in Python via <code>gap-stat</code>.",
        },
        {
          kind: "callout",
          tone: "amber",
          title: "Domain knowledge beats metrics",
          html: "If downstream users need exactly 5 segments for a marketing report, set K = 5. No metric will tell you something the business context already knows.",
        },
      ],
    },

    // ── PAGE 4 — Practical considerations ──────────────────
    {
      badge: "Practical · Page 4",
      title: "What K-Means Needs (and Doesn't Handle)",
      blocks: [
        {
          kind: "para",
          html: "K-means is powerful but makes strong implicit assumptions. Ignoring them leads to clusters that look convincing but are meaningless.",
        },
        {
          kind: "heading",
          text: "Feature scaling is mandatory",
        },
        {
          kind: "para",
          html: "Euclidean distance weights all dimensions equally. A feature measured in thousands (e.g. income) will dominate one measured in units (e.g. age). Always standardise features to zero mean and unit variance, or normalise to \\([0, 1]\\), before running K-means.",
        },
        {
          kind: "heading",
          text: "The assumptions K-means makes",
        },
        {
          kind: "table",
          headers: ["Assumption", "When it breaks"],
          rows: [
            ["Clusters are convex (roughly spherical)", "Ring-shaped or crescent clusters (use DBSCAN instead)"],
            ["Clusters are roughly equal in size", "One huge cluster and one tiny one (centroids get pulled)"],
            ["Clusters have similar variance", "One tight, one diffuse (use Gaussian Mixture Models instead)"],
            ["K is known in advance", "Always — must try multiple values"],
          ],
        },
        {
          kind: "callout",
          tone: "red",
          title: "Outliers",
          html: "K-means is sensitive to outliers: a single extreme point can drag a centroid far from the true cluster centre. Consider removing or capping outliers beforehand, or switching to K-medoids (which uses actual data points as cluster centres).",
        },
        {
          kind: "heading",
          text: "Complexity",
        },
        {
          kind: "para",
          html: "Each iteration costs \\(O(nKd)\\) where \\(n\\) is the number of points, \\(K\\) the number of clusters, and \\(d\\) the dimensionality. K-means is fast in practice and scales well — mini-batch K-means can handle millions of points by updating centroids on small random subsets.",
        },
      ],
    },

    // ── PAGE 5 — Reading the clusters ──────────────────────
    {
      badge: "Interpretation · Page 5",
      title: "Making Sense of What You Found",
      blocks: [
        {
          kind: "para",
          html: "Clustering is exploratory analysis: the output is a hypothesis about structure, not a ground truth. Once you have clusters, the real work is interpretation.",
        },
        {
          kind: "heading",
          text: "Inspect the centroids",
        },
        {
          kind: "para",
          html: "Each centroid is the mean of its cluster across all features. Comparing centroids across clusters tells you what distinguishes them. A marketing analyst might find: Cluster 0 has high purchase frequency and low basket size (loyal bargain shoppers); Cluster 1 has low frequency and high basket size (occasional premium buyers).",
        },
        {
          kind: "heading",
          text: "Visualise with PCA or t-SNE",
        },
        {
          kind: "para",
          html: "In high dimensions, project to 2D using PCA or t-SNE (covered in the next subject) and colour points by their cluster assignment. Overlapping blobs suggest the clusters are not well-separated; tight, distinct blobs suggest a clean partition.",
        },
        {
          kind: "callout",
          tone: "purple",
          title: "Validation against known labels",
          html: "If you happen to have ground-truth labels for some data, you can measure how well clusters align with them using the <em>adjusted Rand index</em> (ARI) or <em>normalised mutual information</em> (NMI) — without using the labels during training.",
        },
        {
          kind: "callout",
          tone: "teal",
          title: "K-means as a preprocessing step",
          html: "Cluster labels can be used as features for downstream supervised models, or to build separate models per segment. This approach — sometimes called <em>cluster-then-model</em> — can outperform a single global model when segments behave very differently.",
        },
      ],
    },
  ],

  // ═══════════════════════════════════════════════════════════
  //  QUIZ
  // ═══════════════════════════════════════════════════════════
  quiz: [
    {
      id: "km-q1",
      question:
        "Which of the following best describes the K-means objective function?",
      options: [
        "Maximise the distance between cluster centroids",
        "Minimise the total within-cluster sum of squared distances to centroids",
        "Minimise the number of clusters needed to explain the data",
        "Maximise the silhouette score across all points",
      ],
      correctIndex: 1,
      explanation:
        "K-means minimises inertia — the sum of squared distances from each point to its assigned centroid. Minimising this pulls each centroid to the mean of its cluster, which is why the update step replaces each centroid with the cluster mean.",
    },
    {
      id: "km-q2",
      question:
        "You run K-means twice on the same dataset with the same K but different random seeds and get different clusterings. What is the most likely explanation?",
      options: [
        "K-means is a stochastic algorithm that never converges",
        "K-means converged to different local minima due to different initialisations",
        "The data has no true clusters",
        "The algorithm made an arithmetic error",
      ],
      correctIndex: 1,
      explanation:
        "K-means is guaranteed to converge, but only to a local minimum of the objective. Different starting centroids can lead to different local minima, which is why practitioners run K-means many times and keep the best result.",
    },
    {
      id: "km-q3",
      question:
        "Why must you standardise features before applying K-means?",
      options: [
        "K-means cannot handle negative numbers",
        "The algorithm uses Euclidean distance, so features on larger scales dominate the assignment step",
        "Standardisation speeds up convergence by a factor of K",
        "K-means requires all features to have exactly unit variance",
      ],
      correctIndex: 1,
      explanation:
        "K-means uses Euclidean distance to assign points to centroids. A feature measured in thousands (e.g. salary) will contribute far more to the distance than one measured in single digits (e.g. age), causing the first feature to dominate the clustering. Standardising all features to comparable scales prevents this.",
    },
    {
      id: "km-q4",
      question:
        "A dataset contains two crescent-shaped clusters that interlock. Which statement about K-means is correct?",
      options: [
        "K-means will find the crescents perfectly with K=2",
        "K-means will fail because its Voronoi boundaries are linear half-spaces that cannot separate non-convex shapes",
        "K-means will fail because it requires K ≥ 3",
        "K-means will succeed if you standardise the features first",
      ],
      correctIndex: 1,
      explanation:
        "K-means partitions space using Voronoi cells — each region is closer to one centroid than any other. These boundaries are linear (straight lines in 2D), so K-means can only find convex clusters. Non-convex shapes like crescents require density-based methods such as DBSCAN.",
    },
    {
      id: "km-q5",
      question:
        "The silhouette score for a point is close to −1. What does this indicate?",
      options: [
        "The point is very well-matched to its cluster",
        "The point lies exactly on the boundary between two clusters",
        "The point may have been assigned to the wrong cluster",
        "The cluster containing this point has very high inertia",
      ],
      correctIndex: 2,
      explanation:
        "A silhouette score near −1 means the average distance to points in the nearest other cluster is much smaller than the average distance to points in the point's own cluster — suggesting the point actually fits the neighbouring cluster better. A negative silhouette is a red flag for misclassification.",
    },
  ],

  // ═══════════════════════════════════════════════════════════
  //  EXERCISES
  // ═══════════════════════════════════════════════════════════
  exercises: [
    {
      id: "km-ex1",
      title: "K-Means from Scratch",
      intro: "Implement the core K-means loop — assignment and update — then apply it to a toy dataset.",
      parts: [
        {
          id: "km-ex1a",
          label: "a",
          prompt:
            "Generate a dataset of 150 points drawn from three 2-D Gaussian blobs using `make_blobs`. Set `random_state=42`. Print the shape of `X`.",
          starterCode:
            "from sklearn.datasets import make_blobs\n\nX, y_true = make_blobs(n_samples=150, centers=3, random_state=42)\nprint(X.shape)",
          expectedStdout: "(150, 2)",
          hints: [
            "`make_blobs` returns (X, y) — X is the feature matrix, y the true cluster labels.",
          ],
          solution:
            "from sklearn.datasets import make_blobs\nX, y_true = make_blobs(n_samples=150, centers=3, random_state=42)\nprint(X.shape)",
        },
        {
          id: "km-ex1b",
          label: "b",
          prompt:
            "Write an `assign_clusters(X, centroids)` function that returns an array of cluster indices — for each row in X, the index of the nearest centroid. Use Euclidean distance.",
          starterCode:
            "import numpy as np\n\ndef assign_clusters(X, centroids):\n    # YOUR CODE HERE\n    pass\n\n# Quick test\nC = np.array([[0., 0.], [10., 10.]])\ntest_X = np.array([[1., 1.], [9., 9.], [0.5, 0.5]])\nprint(assign_clusters(test_X, C))",
          expectedStdout: "[0 1 0]",
          hints: [
            "Compute the distance from each point to each centroid. `np.linalg.norm(X[:, None] - centroids[None, :], axis=2)` gives an (n, K) matrix of distances.",
            "Use `np.argmin(distances, axis=1)` to get the index of the nearest centroid per point.",
          ],
          solution:
            "import numpy as np\n\ndef assign_clusters(X, centroids):\n    dists = np.linalg.norm(X[:, None] - centroids[None, :], axis=2)\n    return np.argmin(dists, axis=1)\n\nC = np.array([[0., 0.], [10., 10.]])\ntest_X = np.array([[1., 1.], [9., 9.], [0.5, 0.5]])\nprint(assign_clusters(test_X, C))",
        },
        {
          id: "km-ex1c",
          label: "c",
          prompt:
            "Run 20 iterations of K-means on `X` (from part a) with K=3. Initialise centroids by picking 3 random rows from X. Print the inertia (total within-cluster SSE) after the last iteration, rounded to 1 decimal place.",
          starterCode:
            "from sklearn.datasets import make_blobs\nimport numpy as np\n\nX, _ = make_blobs(n_samples=150, centers=3, random_state=42)\nnp.random.seed(0)\n\nK = 3\ncentroids = X[np.random.choice(len(X), K, replace=False)]\n\nfor _ in range(20):\n    labels = assign_clusters(X, centroids)\n    centroids = np.array([X[labels == k].mean(axis=0) for k in range(K)])\n\ninertia = sum(np.sum((X[labels == k] - centroids[k])**2) for k in range(K))\nprint(round(inertia, 1))",
          expectedStdout: "614.2",
          hints: [
            "Make sure `assign_clusters` is defined above (from part b).",
            "Inertia = for each cluster k, sum the squared distances of its members to the centroid.",
          ],
          solution:
            "from sklearn.datasets import make_blobs\nimport numpy as np\n\nX, _ = make_blobs(n_samples=150, centers=3, random_state=42)\nnp.random.seed(0)\n\nK = 3\ncentroids = X[np.random.choice(len(X), K, replace=False)]\n\ndef assign_clusters(X, centroids):\n    dists = np.linalg.norm(X[:, None] - centroids[None, :], axis=2)\n    return np.argmin(dists, axis=1)\n\nfor _ in range(20):\n    labels = assign_clusters(X, centroids)\n    centroids = np.array([X[labels == k].mean(axis=0) for k in range(K)])\n\ninertia = sum(np.sum((X[labels == k] - centroids[k])**2) for k in range(K))\nprint(round(inertia, 1))",
        },
      ],
    },
    {
      id: "km-ex2",
      title: "Choosing K with the Elbow and Silhouette",
      intro: "Use scikit-learn's KMeans to evaluate different values of K on a real dataset.",
      parts: [
        {
          id: "km-ex2a",
          label: "a",
          prompt:
            "Fit scikit-learn KMeans for K = 2 through 8 on the iris dataset (features only, no labels). Print the inertia for each K, one per line, rounded to 0 decimal places.",
          starterCode:
            "from sklearn.cluster import KMeans\nfrom sklearn.datasets import load_iris\nfrom sklearn.preprocessing import StandardScaler\n\niris = load_iris()\nX = StandardScaler().fit_transform(iris.data)\n\nfor k in range(2, 9):\n    km = KMeans(n_clusters=k, random_state=42, n_init=10)\n    km.fit(X)\n    print(round(km.inertia_, 0))",
          expectedStdout:
            "553.0\n382.0\n272.0\n216.0\n181.0\n155.0\n134.0",
          hints: [
            "Remember to standardise features before clustering.",
            "`km.inertia_` gives the within-cluster SSE after fitting.",
          ],
          solution:
            "from sklearn.cluster import KMeans\nfrom sklearn.datasets import load_iris\nfrom sklearn.preprocessing import StandardScaler\n\niris = load_iris()\nX = StandardScaler().fit_transform(iris.data)\n\nfor k in range(2, 9):\n    km = KMeans(n_clusters=k, random_state=42, n_init=10)\n    km.fit(X)\n    print(round(km.inertia_, 0))",
        },
        {
          id: "km-ex2b",
          label: "b",
          prompt:
            "Compute the average silhouette score for K = 2, 3, 4 on the same scaled iris data. Print K and score on each line like: 'K=2: 0.456'. Round scores to 3 decimal places.",
          starterCode:
            "from sklearn.cluster import KMeans\nfrom sklearn.datasets import load_iris\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.metrics import silhouette_score\n\niris = load_iris()\nX = StandardScaler().fit_transform(iris.data)\n\nfor k in [2, 3, 4]:\n    km = KMeans(n_clusters=k, random_state=42, n_init=10)\n    labels = km.fit_predict(X)\n    score = silhouette_score(X, labels)\n    print(f'K={k}: {round(score, 3)}')",
          expectedStdout: "K=2: 0.584\nK=3: 0.46\nK=4: 0.364",
          hints: [
            "`silhouette_score(X, labels)` from `sklearn.metrics` returns the mean silhouette across all points.",
            "The silhouette score can point to a different K than the elbow — both are heuristics.",
          ],
          solution:
            "from sklearn.cluster import KMeans\nfrom sklearn.datasets import load_iris\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.metrics import silhouette_score\n\niris = load_iris()\nX = StandardScaler().fit_transform(iris.data)\n\nfor k in [2, 3, 4]:\n    km = KMeans(n_clusters=k, random_state=42, n_init=10)\n    labels = km.fit_predict(X)\n    score = silhouette_score(X, labels)\n    print(f'K={k}: {round(score, 3)}')",
        },
      ],
    },
  ],

  // ═══════════════════════════════════════════════════════════
  //  CHEAT SHEET
  // ═══════════════════════════════════════════════════════════
  cheatsheet: [
    {
      heading: "The Algorithm",
      items: [
        {
          term: "Initialise",
          note: "Choose K centroids (random rows, or K-Means++ for better results)",
        },
        {
          term: "Assign",
          note: "Each point → nearest centroid (Euclidean distance by default)",
        },
        {
          term: "Update",
          note: "Move each centroid to the mean of its assigned points",
        },
        {
          term: "Repeat",
          note: "Iterate until labels stop changing (convergence guaranteed)",
        },
      ],
    },
    {
      heading: "Key Parameters (scikit-learn)",
      items: [
        {
          term: "n_clusters",
          note: "Number of clusters K — the most important hyperparameter",
        },
        {
          term: "init='k-means++'",
          note: "Smart initialisation that spreads starting centroids — default and recommended",
        },
        {
          term: "n_init=10",
          note: "How many independent runs to perform; best inertia is kept",
        },
        {
          term: "max_iter=300",
          note: "Maximum iterations per run",
        },
      ],
    },
    {
      heading: "Choosing K",
      items: [
        {
          term: "Elbow method",
          note: "Plot inertia vs K; look for the kink where gains flatten",
        },
        {
          term: "Silhouette score",
          note: "Mean (b−a)/max(a,b) across all points; higher is better; range −1 to 1",
          formula: "s = \\frac{b - a}{\\max(a, b)}",
        },
        {
          term: "Gap statistic",
          note: "Compares inertia to that of a random uniform dataset",
        },
        {
          term: "Domain knowledge",
          note: "Often the best guide — ask what K means operationally",
        },
      ],
    },
    {
      heading: "Assumptions & Limitations",
      items: [
        {
          term: "Convex clusters",
          note: "Cannot separate non-convex shapes (crescents, rings) — use DBSCAN",
        },
        {
          term: "Feature scaling",
          note: "Mandatory — large-scale features dominate Euclidean distance",
        },
        {
          term: "Outlier sensitivity",
          note: "Single outliers can pull centroids; consider removing or using K-medoids",
        },
        {
          term: "Local minima",
          note: "Run multiple times (n_init); never rely on a single run",
        },
      ],
    },
  ],
};
