import { Subject } from "./types";

export const dbscan: Subject = {
  slug: "dbscan",
  title: "DBSCAN",
  icon: "dbscan",
  phase: 3,
  blurb:
    "Density-Based Spatial Clustering of Applications with Noise. Unlike K-Means, DBSCAN finds clusters of any shape, requires no K upfront, and explicitly labels outliers as noise.",
  sources: [
    "Ester, Kriegel, Sander & Xu — A Density-Based Algorithm for Discovering Clusters (KDD, 1996)",
    "Schubert, Sander, Ester, Kriegel & Xu — DBSCAN Revisited, Revisited (TODS, 2017)",
    "Géron, A. — Hands-On Machine Learning, 3rd ed., Ch. 9",
    "Hastie, Tibshirani & Friedman — ESL, 2nd ed., Ch. 14",
  ],

  theory: [
    {
      badge: "Intuition · Page 1",
      title: "Clusters Are Dense Regions",
      blocks: [
        {
          kind: "para",
          html: "K-Means defines a cluster as \"everything closest to a centroid.\" This works when clusters are convex blobs of roughly equal size — but real data rarely cooperates. In satellite imagery, city centres and suburban sprawl don't form spheres. In biology, cell populations wind through high-dimensional space in long, curved filaments. A fundamentally different definition of \"cluster\" is needed.",
        },
        {
          kind: "para",
          html: "DBSCAN's definition is geometric and intuitive: a cluster is a region where points are <em>dense</em>, separated from other dense regions by sparser space. Dense means: every core point has at least <em>minPts</em> neighbours within distance <em>ε</em> (epsilon). Points too far from any core point — in the sparse gaps — are labelled <em>noise</em>, or outliers.",
        },
        {
          kind: "callout",
          tone: "purple",
          title: "Two parameters replace K",
          html: "<strong>ε (eps)</strong> — the neighbourhood radius. Points within ε of each other are \"neighbours.\"<br/><strong>minPts</strong> — the minimum number of neighbours for a point to be a <em>core point</em>. Together they define what \"dense\" means for your data.",
        },
        {
          kind: "table",
          headers: ["Point type", "Definition", "Role"],
          rows: [
            ["Core point", "Has ≥ minPts neighbours within ε", "Seeds a cluster; can recruit neighbours"],
            ["Border point", "Within ε of a core point, but has < minPts own neighbours", "Belongs to the cluster but doesn't expand it"],
            ["Noise point", "Not within ε of any core point", "Labelled −1; not part of any cluster"],
          ],
        },
        {
          kind: "callout",
          tone: "teal",
          title: "No K, no centroids",
          html: "DBSCAN determines the number of clusters automatically from the data. Two arbitrarily shaped dense regions separated by sparse space become two clusters, regardless of their geometry.",
        },
      ],
    },
    {
      badge: "Algorithm · Page 2",
      title: "The Expansion Algorithm",
      blocks: [
        {
          kind: "para",
          html: "DBSCAN visits each unvisited point in turn. If the point has fewer than <em>minPts</em> neighbours within ε, it is temporarily labelled noise. If it has enough neighbours, a new cluster is started and expanded.",
        },
        {
          kind: "callout",
          tone: "teal",
          title: "Cluster expansion",
          html: "Starting from a core point, add all its ε-neighbours to the cluster. For each newly added neighbour that is itself a core point, add its neighbours too. Repeat until no more points can be added. The set of all reachable points forms one cluster.",
        },
        {
          kind: "para",
          html: "The key concept is <em>density-reachability</em>: point B is density-reachable from core point A if there is a chain of core points A → P₁ → P₂ → … → B where each step is within ε. A cluster is the complete set of mutually density-connected points.",
        },
        {
          kind: "heading",
          text: "Complexity",
        },
        {
          kind: "para",
          html: "Naïve DBSCAN: \\(O(n^2)\\) — each point queries all others. With a spatial index (k-d tree or ball tree), this reduces to \\(O(n \\log n)\\) for low dimensions. Scikit-learn uses a ball tree by default. For very high dimensions (>20), spatial indices lose their advantage and the brute-force metric is sometimes preferable.",
        },
        {
          kind: "callout",
          tone: "amber",
          title: "Border point ambiguity",
          html: "A border point within ε of two different clusters can legally belong to either — assignment depends on which core point is visited first. This is usually harmless in practice, but it makes DBSCAN non-deterministic in the strict sense (results are stable if you fix the visit order, which scikit-learn does).",
        },
      ],
    },
    {
      badge: "Parameters · Page 3",
      title: "Setting ε and minPts",
      blocks: [
        {
          kind: "para",
          html: "Choosing ε and minPts is the main practical challenge. Good defaults and systematic heuristics exist.",
        },
        {
          kind: "heading",
          text: "minPts: a rule of thumb",
        },
        {
          kind: "para",
          html: "A widely cited rule: set minPts ≥ dimensionality + 1, or minPts ≥ 2 × d where d is the number of features. For 2-D data, minPts = 4 is a common starting point. Larger minPts → smaller, tighter core regions → more noise points.",
        },
        {
          kind: "heading",
          text: "ε: the k-distance plot",
        },
        {
          kind: "para",
          html: "For each point, compute the distance to its <em>k</em>-th nearest neighbour (where k = minPts − 1). Sort these distances in descending order and plot them. A sharp \"elbow\" in the plot marks a natural separation between dense and sparse regions — the ε value at the elbow is your target.",
        },
        {
          kind: "callout",
          tone: "teal",
          title: "Practical workflow",
          html: "1. Standardise features (DBSCAN uses distance — scale matters).<br/>2. Set minPts = max(4, 2 × n_features).<br/>3. Plot the k-distance graph, pick ε at the elbow.<br/>4. Run DBSCAN; inspect the noise fraction (0–10% is healthy; >30% suggests ε is too small).",
        },
        {
          kind: "callout",
          tone: "red",
          title: "Variable density",
          html: "The biggest weakness of standard DBSCAN: a single (ε, minPts) pair cannot handle clusters of very different densities. One dense cluster requires a small ε; another sparse cluster needs a large ε. HDBSCAN (Hierarchical DBSCAN) solves this by running DBSCAN across all ε values and extracting the most stable clusters.",
        },
      ],
    },
    {
      badge: "Comparison · Page 4",
      title: "DBSCAN vs K-Means — Choosing the Right Tool",
      blocks: [
        {
          kind: "table",
          headers: ["Property", "K-Means", "DBSCAN"],
          rows: [
            ["Number of clusters", "Must specify K upfront", "Discovered automatically"],
            ["Cluster shape", "Convex (spherical) only", "Arbitrary — crescents, rings, blobs"],
            ["Outliers", "Assigned to nearest centroid", "Explicitly labelled as noise (−1)"],
            ["Density variation", "Handles well", "Struggles (use HDBSCAN instead)"],
            ["Scalability", "Very fast — O(nKd) per iter", "Moderate — O(n log n) with index"],
            ["Interpretability", "Centroids are easy to inspect", "No centroid concept"],
            ["Initialisation", "Random (run multiple times)", "Deterministic given visit order"],
          ],
        },
        {
          kind: "callout",
          tone: "purple",
          title: "When to pick DBSCAN",
          html: "Use DBSCAN when: (a) you don't know K; (b) clusters are non-convex; (c) outlier detection matters; (d) you believe the data has genuine noise points. Use K-Means when: (a) clusters are roughly spherical; (b) you need fast, scalable clustering; (c) you need centroid-based summaries.",
        },
        {
          kind: "heading",
          text: "Other density-based algorithms",
        },
        {
          kind: "table",
          headers: ["Algorithm", "Key advantage over DBSCAN"],
          rows: [
            ["HDBSCAN", "Handles variable-density clusters; more robust parameter choice"],
            ["OPTICS", "Produces a reachability plot — visualises full cluster hierarchy"],
            ["Mean Shift", "No ε needed; finds modes of a kernel density estimate"],
          ],
        },
      ],
    },
    {
      badge: "Applications · Page 5",
      title: "Real-World Uses of DBSCAN",
      blocks: [
        {
          kind: "para",
          html: "DBSCAN's noise-detection and arbitrary-shape properties make it uniquely suited to several problem classes that K-Means cannot handle well.",
        },
        {
          kind: "heading",
          text: "Geospatial analysis",
        },
        {
          kind: "para",
          html: "Given GPS coordinates of taxi pickups, social media check-ins, or seismic events, DBSCAN finds natural geographic hotspots — dense city centres, venue clusters — without imposing a predetermined number or shape of regions. Points in remote areas are correctly flagged as noise rather than forced into the nearest cluster.",
        },
        {
          kind: "heading",
          text: "Anomaly detection",
        },
        {
          kind: "para",
          html: "In fraud detection, network intrusion, or manufacturing quality control, normal behaviour forms dense regions in feature space; anomalies are isolated points with no dense neighbourhood. DBSCAN's noise label directly identifies these outliers, making it a natural semi-supervised anomaly detector.",
        },
        {
          kind: "heading",
          text: "Image segmentation",
        },
        {
          kind: "para",
          html: "Treating pixel colours (or colour + position) as points, DBSCAN segments an image into coherent regions without knowing how many regions exist. Skin lesion boundaries, cell nuclei in microscopy, and road markings in satellite images all benefit from shape-agnostic clustering.",
        },
        {
          kind: "callout",
          tone: "teal",
          title: "DBSCAN + PCA",
          html: "For high-dimensional data (many features), apply PCA first to reduce to 2–10 dimensions. DBSCAN's neighbourhood radius ε becomes meaningful again, spatial indices recover efficiency, and the result is easier to visualise.",
        },
      ],
    },
  ],

  quiz: [
    {
      id: "db-q1",
      question: "A point has 2 neighbours within ε, but minPts = 5. What type of point is it?",
      options: [
        "Core point — it has at least one neighbour",
        "Border point only if it is within ε of a core point; otherwise noise",
        "Always a noise point because it has fewer than minPts neighbours",
        "Its type depends on the number of clusters found",
      ],
      correctIndex: 1,
      explanation:
        "With fewer than minPts neighbours, the point cannot be a core point. Whether it is a border point or noise depends on whether it falls within ε of some other core point. If it does, it gets assigned to that core point's cluster; otherwise it is labelled noise (−1).",
    },
    {
      id: "db-q2",
      question: "You want to cluster crescent-shaped regions in 2-D data. Which algorithm is better suited?",
      options: [
        "K-Means with K=2, because crescents can be approximated by two centroids",
        "DBSCAN, because it finds clusters of arbitrary shape based on density",
        "PCA, because it can reduce the data to the natural crescent directions",
        "K-Means with many restarts will eventually find the crescents",
      ],
      correctIndex: 1,
      explanation:
        "K-Means assigns every point to the nearest centroid, creating Voronoi cells with straight-line boundaries. Crescents are non-convex and cannot be separated this way. DBSCAN finds clusters as connected dense regions regardless of shape, so it correctly identifies both crescents.",
    },
    {
      id: "db-q3",
      question: "What does increasing ε (keeping minPts fixed) do to a DBSCAN result?",
      options: [
        "Creates more, smaller clusters with more noise points",
        "Creates fewer, larger clusters by merging previously separate dense regions",
        "Has no effect — only minPts determines cluster boundaries",
        "Increases the number of core points but leaves cluster count unchanged",
      ],
      correctIndex: 1,
      explanation:
        "Larger ε expands each point's neighbourhood. Points that were previously out of reach become neighbours, turning some noise and border points into core points, and merging clusters that were separated by small gaps. At the extreme, all points merge into one cluster.",
    },
    {
      id: "db-q4",
      question: "How should you determine a good value for ε when applying DBSCAN?",
      options: [
        "Set ε to the mean distance between all pairs of points in the dataset",
        "Plot the sorted k-nearest-neighbour distances and pick ε at the elbow of the curve",
        "Run DBSCAN for many ε values and pick the one with lowest inertia",
        "ε = 1 / minPts is always the correct formula",
      ],
      correctIndex: 1,
      explanation:
        "The k-distance plot (sort each point's distance to its k-th nearest neighbour in descending order) shows a sharp bend between the dense region and the sparse region. Setting ε at the elbow captures the dense clusters while excluding the sparse noise region.",
    },
    {
      id: "db-q5",
      question: "DBSCAN returns cluster label −1 for many points. What is the most useful interpretation?",
      options: [
        "The algorithm failed to converge and should be re-run",
        "Those points were assigned to cluster 0 which is labeled −1 by convention",
        "Those points are noise: they lie in sparse regions not belonging to any dense cluster",
        "ε is too large — reduce it so more points get positive labels",
      ],
      correctIndex: 2,
      explanation:
        "Label −1 is DBSCAN's explicit noise label. It means the point has fewer than minPts neighbours within ε and does not fall within ε of any core point — it is genuinely isolated. A high noise fraction usually means ε is too small (tighten or enlarge ε), but some noise is expected and often meaningful (real outliers).",
    },
  ],

  exercises: [
    {
      id: "db-ex1",
      title: "DBSCAN on Non-Convex Data",
      intro: "Compare K-Means and DBSCAN on a dataset where K-Means fails.",
      parts: [
        {
          id: "db-ex1a",
          label: "a",
          prompt:
            "Generate two interlocking half-circles using `make_moons(n_samples=200, noise=0.07, random_state=42)`. Run KMeans(n_clusters=2) and DBSCAN(eps=0.3, min_samples=5) on the standardised data. Print the number of unique labels (excluding noise) found by each, one per line.",
          starterCode:
            "from sklearn.datasets import make_moons\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.cluster import KMeans, DBSCAN\nimport numpy as np\n\nX, _ = make_moons(n_samples=200, noise=0.07, random_state=42)\nX = StandardScaler().fit_transform(X)\n\nkm_labels = KMeans(n_clusters=2, random_state=42, n_init=10).fit_predict(X)\ndb_labels = DBSCAN(eps=0.3, min_samples=5).fit_predict(X)\n\nprint(len(set(km_labels)))\nprint(len(set(db_labels) - {-1}))",
          expectedStdout: "2\n2",
          hints: [
            "Both find 2 clusters — but for K-Means they will be wrong (cut across the moons), while DBSCAN correctly traces the shapes.",
            "Use `set(db_labels) - {-1}` to exclude the noise label.",
          ],
          solution:
            "from sklearn.datasets import make_moons\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.cluster import KMeans, DBSCAN\nimport numpy as np\n\nX, _ = make_moons(n_samples=200, noise=0.07, random_state=42)\nX = StandardScaler().fit_transform(X)\n\nkm_labels = KMeans(n_clusters=2, random_state=42, n_init=10).fit_predict(X)\ndb_labels = DBSCAN(eps=0.3, min_samples=5).fit_predict(X)\n\nprint(len(set(km_labels)))\nprint(len(set(db_labels) - {-1}))",
        },
        {
          id: "db-ex1b",
          label: "b",
          prompt:
            "Using the same moons data (standardised), compare cluster quality. Print the adjusted Rand index for K-Means and for DBSCAN (against the true labels), each rounded to 3 dp, one per line.",
          starterCode:
            "from sklearn.datasets import make_moons\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.cluster import KMeans, DBSCAN\nfrom sklearn.metrics import adjusted_rand_score\n\nX, y = make_moons(n_samples=200, noise=0.07, random_state=42)\nX = StandardScaler().fit_transform(X)\n\nkm_labels = KMeans(n_clusters=2, random_state=42, n_init=10).fit_predict(X)\ndb_labels = DBSCAN(eps=0.3, min_samples=5).fit_predict(X)\n\nprint(round(adjusted_rand_score(y, km_labels), 3))\nprint(round(adjusted_rand_score(y, db_labels), 3))",
          expectedStdout: "0.491\n0.982",
          hints: [
            "`adjusted_rand_score(true, predicted)` measures agreement between two label sets; 1.0 = perfect, 0 = random.",
            "DBSCAN noise points (label −1) are included in ARI — they will reduce the score slightly but DBSCAN still wins by a large margin.",
          ],
          solution:
            "from sklearn.datasets import make_moons\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.cluster import KMeans, DBSCAN\nfrom sklearn.metrics import adjusted_rand_score\n\nX, y = make_moons(n_samples=200, noise=0.07, random_state=42)\nX = StandardScaler().fit_transform(X)\n\nkm_labels = KMeans(n_clusters=2, random_state=42, n_init=10).fit_predict(X)\ndb_labels = DBSCAN(eps=0.3, min_samples=5).fit_predict(X)\n\nprint(round(adjusted_rand_score(y, km_labels), 3))\nprint(round(adjusted_rand_score(y, db_labels), 3))",
        },
      ],
    },
    {
      id: "db-ex2",
      title: "Outlier Detection with DBSCAN",
      intro: "Use DBSCAN's noise label to detect anomalies injected into a normal distribution.",
      parts: [
        {
          id: "db-ex2a",
          label: "a",
          prompt:
            "Generate 200 inlier points from N(0,1) in 2-D, then append 10 outlier points drawn from Uniform(−6, 6) (seed=42). Run DBSCAN(eps=0.5, min_samples=5). Print how many points get label −1.",
          starterCode:
            "import numpy as np\nfrom sklearn.cluster import DBSCAN\nfrom sklearn.preprocessing import StandardScaler\n\nrng = np.random.default_rng(42)\ninliers = rng.normal(0, 1, (200, 2))\noutliers = rng.uniform(-6, 6, (10, 2))\nX = np.vstack([inliers, outliers])\nX = StandardScaler().fit_transform(X)\n\nlabels = DBSCAN(eps=0.5, min_samples=5).fit_predict(X)\nprint((labels == -1).sum())",
          expectedStdout: "14",
          hints: [
            "DBSCAN may also flag some borderline inlier points as noise — that's OK, a small false-positive rate is expected.",
          ],
          solution:
            "import numpy as np\nfrom sklearn.cluster import DBSCAN\nfrom sklearn.preprocessing import StandardScaler\n\nrng = np.random.default_rng(42)\ninliers = rng.normal(0, 1, (200, 2))\noutliers = rng.uniform(-6, 6, (10, 2))\nX = np.vstack([inliers, outliers])\nX = StandardScaler().fit_transform(X)\n\nlabels = DBSCAN(eps=0.5, min_samples=5).fit_predict(X)\nprint((labels == -1).sum())",
        },
      ],
    },
  ],

  cheatsheet: [
    {
      heading: "Core Concepts",
      items: [
        {
          term: "Core point",
          note: "Has ≥ minPts neighbours within ε — seeds and expands clusters",
        },
        {
          term: "Border point",
          note: "Within ε of a core point but has < minPts own neighbours",
        },
        {
          term: "Noise point",
          note: "Not within ε of any core point — labelled −1 in sklearn",
        },
        {
          term: "Density-reachability",
          note: "B is reachable from A if there is a chain of core points A → … → B within ε",
        },
      ],
    },
    {
      heading: "Parameters",
      items: [
        {
          term: "eps (ε)",
          note: "Neighbourhood radius. Use k-distance plot to find the elbow.",
        },
        {
          term: "min_samples (minPts)",
          note: "Minimum neighbours for a core point. Rule: max(4, 2 × n_features).",
        },
        {
          term: "metric",
          note: "Distance metric — default 'euclidean'. Always standardise features first.",
        },
        {
          term: "algorithm",
          note: "'ball_tree' or 'kd_tree' for fast neighbour search; 'brute' for high-D.",
        },
      ],
    },
    {
      heading: "vs K-Means",
      items: [
        {
          term: "No K required",
          note: "DBSCAN discovers the number of clusters automatically",
        },
        {
          term: "Arbitrary shapes",
          note: "Finds crescents, rings, filaments — not just spheres",
        },
        {
          term: "Explicit noise",
          note: "Outliers get label −1 instead of being forced into the nearest cluster",
        },
        {
          term: "Weakness",
          note: "Single (ε, minPts) cannot handle clusters of very different densities → use HDBSCAN",
        },
      ],
    },
    {
      heading: "sklearn Quick-Start",
      items: [
        {
          term: "Fit + predict",
          note: "DBSCAN(eps=0.5, min_samples=5).fit_predict(X_scaled)",
        },
        {
          term: "Number of clusters",
          note: "len(set(labels) - {-1})",
        },
        {
          term: "Noise count",
          note: "(labels == -1).sum()",
        },
        {
          term: "Quality metric",
          note: "silhouette_score(X, labels[labels != -1]) — exclude noise first",
        },
      ],
    },
  ],
};
