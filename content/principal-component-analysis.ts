import { Subject } from "./types";

export const principalComponentAnalysis: Subject = {
  slug: "principal-component-analysis",
  title: "Principal Component Analysis",
  icon: "pca",
  phase: 3,
  blurb:
    "Compress high-dimensional data into its most informative directions. PCA finds the axes of maximum variance, letting you visualise, denoise, and speed up learning — all while losing as little information as possible.",
  sources: [
    "Hastie, Tibshirani & Friedman — ESL, 2nd ed., Ch. 14",
    "Bishop, C.M. — Pattern Recognition and Machine Learning, Ch. 12",
    "Géron, A. — Hands-On Machine Learning, 3rd ed., Ch. 8",
    "Jolliffe, I.T. — Principal Component Analysis, 2nd ed. (2002)",
    "Pearson, K. — On Lines and Planes of Closest Fit to Systems of Points in Space (1901)",
  ],

  // ═══════════════════════════════════════════════════════════
  //  THEORY
  // ═══════════════════════════════════════════════════════════
  theory: [
    // ── PAGE 1 — Intuition ──────────────────────────────────
    {
      badge: "Intuition · Page 1",
      title: "The Curse and the Cure",
      blocks: [
        {
          kind: "para",
          html: "Modern datasets are wide. A single medical scan might have hundreds of thousands of voxels; a text document might be represented by tens of thousands of word frequencies; a genomics experiment might measure the activity of 20,000 genes. Working directly with this many features creates problems collectively called the <em>curse of dimensionality</em>: distance measures lose meaning, visualisation is impossible, and models overfit badly.",
        },
        {
          kind: "para",
          html: "PCA is the most widely used tool for fighting this curse. The key insight is that most real datasets, despite living in a high-dimensional space, actually occupy a much lower-dimensional <em>subspace</em>. The pixels in an image of a face are not 100,000 independent numbers — they vary in highly correlated ways (lighting, expression, pose). PCA finds the directions along which the data actually varies, and discards the rest.",
        },
        {
          kind: "callout",
          tone: "purple",
          title: "The core idea",
          html: "Find a new coordinate system — a set of <em>principal components</em> — such that the first component points in the direction of maximum variance, the second in the direction of maximum remaining variance (perpendicular to the first), and so on. Then keep only the first few components.",
        },
        {
          kind: "heading",
          text: "What PCA gives you",
        },
        {
          kind: "table",
          headers: ["Use case", "What you do with PCA"],
          rows: [
            ["Visualisation", "Project to 2 or 3 PCs and scatter-plot"],
            ["Denoising", "Reconstruct from top PCs — noise lives in later ones"],
            ["Speed up ML", "Reduce features before training a slow model"],
            ["Remove multicollinearity", "PC scores are orthogonal by construction"],
            ["Compression", "Store PC coordinates instead of raw high-D data"],
          ],
        },
      ],
    },

    // ── PAGE 2 — The math ───────────────────────────────────
    {
      badge: "Mathematics · Page 2",
      title: "Variance, Covariance, and Eigenvectors",
      blocks: [
        {
          kind: "para",
          html: "Start by centring the data: subtract the column mean from every feature so the data cloud is centred at the origin. The spread of the centred data is captured by its <em>covariance matrix</em>.",
        },
        {
          kind: "equation",
          label: "Sample covariance matrix",
          tex: "\\mathbf{S} = \\frac{1}{n-1} \\mathbf{X}^\\top \\mathbf{X} \\quad (\\text{with } \\mathbf{X} \\text{ column-centred})",
        },
        {
          kind: "para",
          html: "The diagonal entries of \\(\\mathbf{S}\\) are the variances of each feature; off-diagonal entries are covariances between pairs. A large covariance means two features move together — precisely the kind of redundancy PCA exploits.",
        },
        {
          kind: "heading",
          text: "Eigendecomposition",
        },
        {
          kind: "para",
          html: "Decompose \\(\\mathbf{S}\\) into its eigenvalues and eigenvectors. The eigenvector with the largest eigenvalue is the first principal component — the direction of maximum variance. The eigenvalue itself equals the variance of the data projected onto that direction.",
        },
        {
          kind: "equation",
          label: "Eigendecomposition of the covariance matrix",
          tex: "\\mathbf{S} = \\mathbf{V} \\boldsymbol{\\Lambda} \\mathbf{V}^\\top, \\quad \\mathbf{V} = [\\mathbf{v}_1 \\mid \\mathbf{v}_2 \\mid \\dots \\mid \\mathbf{v}_p]",
        },
        {
          kind: "callout",
          tone: "teal",
          title: "SVD — the practical route",
          html: "In practice, PCA is computed via <em>Singular Value Decomposition</em> (SVD) of the centred data matrix \\(\\mathbf{X} = \\mathbf{U}\\boldsymbol{\\Sigma}\\mathbf{V}^\\top\\), which is numerically more stable than eigendecomposing \\(\\mathbf{S}\\) explicitly. Scikit-learn always uses SVD internally.",
        },
        {
          kind: "heading",
          text: "Projecting the data",
        },
        {
          kind: "para",
          html: "Stacking the top \\(k\\) eigenvectors as columns of a matrix \\(\\mathbf{V}_k\\), the compressed representation of a data point \\(\\mathbf{x}\\) is simply its coordinates in the new basis:",
        },
        {
          kind: "equation",
          label: "Projection to k dimensions",
          tex: "\\mathbf{z} = \\mathbf{V}_k^\\top \\mathbf{x} \\in \\mathbb{R}^k",
        },
      ],
    },

    // ── PAGE 3 — Explained variance ─────────────────────────
    {
      badge: "Model Selection · Page 3",
      title: "How Many Components to Keep?",
      blocks: [
        {
          kind: "para",
          html: "Every principal component captures some fraction of the total variance in the data. The eigenvalues, sorted in descending order, tell you this fraction.",
        },
        {
          kind: "equation",
          label: "Explained variance ratio of component j",
          tex: "\\text{EVR}_j = \\frac{\\lambda_j}{\\sum_{i=1}^{p} \\lambda_i}",
        },
        {
          kind: "heading",
          text: "Cumulative explained variance",
        },
        {
          kind: "para",
          html: "The <em>scree plot</em> shows eigenvalues (or explained variance ratios) against component number. You look for the \"elbow\" — the point where adding another component contributes little. Alternatively, set a threshold: keep enough components to explain 90%, 95%, or 99% of total variance, depending on how much information loss you can tolerate.",
        },
        {
          kind: "callout",
          tone: "teal",
          title: "Rule of thumb",
          html: "For exploratory visualisation, 2 or 3 components. For preprocessing before a supervised model, try a threshold (e.g. 95% variance) and cross-validate the final number. There is no universally correct answer.",
        },
        {
          kind: "callout",
          tone: "amber",
          title: "Reconstruction error",
          html: "An alternative: choose k to minimise the mean squared error between the original and the reconstructed data (project down, then project back up). Scikit-learn's <code>inverse_transform</code> makes this easy to compute.",
        },
        {
          kind: "heading",
          text: "Intrinsic dimensionality",
        },
        {
          kind: "para",
          html: "If the first two components explain 95% of variance, the data is effectively 2-dimensional even if it has 1000 features. This is not unusual — images, audio, and text all tend to live on low-dimensional manifolds in their raw feature spaces.",
        },
      ],
    },

    // ── PAGE 4 — Practical considerations ──────────────────
    {
      badge: "Practical · Page 4",
      title: "Before and After PCA",
      blocks: [
        {
          kind: "para",
          html: "PCA is simple to use but easy to apply incorrectly. These practical points prevent the most common mistakes.",
        },
        {
          kind: "heading",
          text: "Scale before you project",
        },
        {
          kind: "para",
          html: "PCA finds directions of maximum <em>variance</em>. A feature with large numeric values has large variance simply because of its units, not because it carries more information. Standardise all features to zero mean and unit variance before fitting PCA, unless you have a specific reason not to (e.g. all features already share the same units and scale).",
        },
        {
          kind: "callout",
          tone: "red",
          title: "Train-test leakage",
          html: "Fit PCA only on the training set. Use the same transformation (the same principal axes) to project the test set. Never fit PCA on the combined train+test data — that leaks test information into the model.",
        },
        {
          kind: "heading",
          text: "PCA is not always the right choice",
        },
        {
          kind: "table",
          headers: ["Situation", "Better approach"],
          rows: [
            ["Non-linear structure (Swiss roll, manifold)", "t-SNE, UMAP (for visualisation); kernel PCA"],
            ["Sparse, high-D data (text TF-IDF)", "Truncated SVD (LSA) — avoids centring dense matrix"],
            ["Need to keep features interpretable", "Lasso / feature selection — PC loadings are hard to explain"],
            ["Target correlation more important than variance", "Partial Least Squares (PLS)"],
          ],
        },
        {
          kind: "callout",
          tone: "purple",
          title: "Incremental PCA",
          html: "For datasets too large to fit in memory, scikit-learn's <code>IncrementalPCA</code> processes data in mini-batches, giving the same result as standard PCA without loading everything at once.",
        },
      ],
    },

    // ── PAGE 5 — Loading interpretation ─────────────────────
    {
      badge: "Interpretation · Page 5",
      title: "Reading the Principal Components",
      blocks: [
        {
          kind: "para",
          html: "Each principal component is a linear combination of the original features. The <em>loadings</em> — the coefficients in that linear combination — tell you which original features drive each component.",
        },
        {
          kind: "heading",
          text: "Loadings",
        },
        {
          kind: "para",
          html: "In scikit-learn, <code>pca.components_</code> is a matrix of shape \\((k, p)\\). The \\(i\\)-th row is the \\(i\\)-th principal component; each column entry is the loading of the corresponding feature. Large absolute loadings (positive or negative) indicate features that contribute strongly to a component.",
        },
        {
          kind: "callout",
          tone: "amber",
          title: "Example — face images",
          html: "Apply PCA to a dataset of face images. The first few components (called <em>eigenfaces</em>) capture overall brightness, left-right symmetry, and expression. You can reconstruct any face to within a few pixel values using just 50 eigenfaces from a space of 10,000 pixels — a 200× compression.",
        },
        {
          kind: "heading",
          text: "What PCA cannot tell you",
        },
        {
          kind: "para",
          html: "Principal components maximise variance, not interpretability or predictive power. The first PC might be entirely dominated by a confounding variable (e.g. overall brightness in a medical image). Always inspect loadings before drawing conclusions about what the components represent.",
        },
        {
          kind: "callout",
          tone: "teal",
          title: "PCA + clustering = powerful EDA",
          html: "Project data to 2–3 PCs, then run K-means in that reduced space. The scatter plot lets you see whether clusters are well-separated, whether there are outliers, and whether K is plausible — all at a glance. This combination is one of the most effective exploratory data analysis workflows.",
        },
      ],
    },
  ],

  // ═══════════════════════════════════════════════════════════
  //  QUIZ
  // ═══════════════════════════════════════════════════════════
  quiz: [
    {
      id: "pca-q1",
      question:
        "The first principal component is the direction that:",
      options: [
        "Minimises the cross-entropy between the projected distribution and a standard normal",
        "Minimises the pairwise Euclidean distances between all projected data points",
        "Points along the axis with the largest eigenvalue of the covariance matrix",
        "Maximises the correlation between the component scores and the original feature means"
      ],
      correctIndex: 2,
      explanation:
        "The first PC is the eigenvector of the covariance matrix corresponding to its largest eigenvalue. This direction has the property that projecting the data onto it captures maximum variance — equivalently, it minimises the mean squared reconstruction error from a single component.",
    },
    {
      id: "pca-q2",
      question:
        "Why must you standardise features before applying PCA in most situations?",
      options: [
        "Without standardisation, PCA produces more components than the number of original features",
        "Standardisation converts the covariance matrix into a correlation matrix, which is required for SVD to converge",
        "Features with larger numeric scale have larger variance and will dominate the components even if they carry no more information",
        "PCA's eigenvectors become non-orthogonal when the feature magnitudes differ, violating the orthogonality guarantee"
      ],
      correctIndex: 2,
      explanation:
        "PCA is sensitive to scale because it seeks directions of maximum variance. A feature measured in thousands will have large variance simply due to its units, causing it to dominate the first PC regardless of its actual information content. Standardising makes the variance comparison fair.",
    },
    {
      id: "pca-q3",
      question:
        "You fit PCA on a training set and want to apply it to a test set. Which procedure is correct?",
      options: [
        "Fit PCA jointly on train and test to ensure the components capture the full data distribution",
        "Use the components learned from the training set to transform the test set without refitting",
        "Fit a new PCA on the test set independently so the projection is aligned with test-set variance",
        "Subtract the test set's mean from each test point before projecting onto the training-set components"
      ],
      correctIndex: 1,
      explanation:
        "PCA must be fit only on training data. The learned components (eigenvectors) and the training mean/standard deviation are then applied to the test set unchanged. Fitting on the combined dataset or re-fitting on the test set causes data leakage.",
    },
    {
      id: "pca-q4",
      question:
        "A dataset has 100 features. After PCA, the first 5 components explain 93% of the total variance. What is the most useful interpretation of this finding?",
      options: [
        "The five retained components are orthogonal to the noise in the data, so prediction error will be exactly 7%",
        "A model trained on all 100 features will always be outperformed by one trained on only 5 PCA components",
        "The data is intrinsically 5-dimensional; most features are highly correlated",
        "The remaining 95 components carry no predictive signal and must be discarded before modelling"
      ],
      correctIndex: 2,
      explanation:
        "93% of variance in 5 components means the 100 raw features are highly correlated — the data lives near a 5-dimensional subspace. This is called low intrinsic dimensionality. It doesn't guarantee a supervised model will perform better (the remaining 7% might contain predictive signal), but it strongly motivates using fewer features for visualisation and exploration.",
    },
    {
      id: "pca-q5",
      question:
        "Which of the following tasks is PCA NOT well-suited for?",
      options: [
        "Classifying images while preserving individual pixel interpretability",
        "Decorrelating highly correlated predictors before feeding them into a linear regression",
        "Compressing a high-dimensional dataset to reduce memory usage during model training",
        "Reducing 50-dimensional data to 2D for scatter-plot visualisation of cluster structure"
      ],
      correctIndex: 0,
      explanation:
        "PCA projects data onto new axes that are linear combinations of all original features. The resulting components have no simple interpretation in terms of individual original features. If feature interpretability is critical (e.g. 'which original pixels matter?'), feature selection methods such as Lasso are more appropriate.",
    },
  ],

  // ═══════════════════════════════════════════════════════════
  //  EXERCISES
  // ═══════════════════════════════════════════════════════════
  exercises: [
    {
      id: "pca-ex1",
      title: "Dimensionality Reduction on the Digits Dataset",
      intro: "Apply PCA to the 64-dimensional digits dataset and inspect how much variance is captured.",
      parts: [
        {
          id: "pca-ex1a",
          label: "a",
          prompt:
            "Load the digits dataset. Standardise the features. Then fit PCA with no component limit (`n_components=None`). Print how many components equal the number of features.",
          starterCode:
            "from sklearn.datasets import load_digits\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.decomposition import PCA\n\ndigits = load_digits()\nX = StandardScaler().fit_transform(digits.data)\n\npca = PCA(n_components=None)\npca.fit(X)\nprint(len(pca.components_))",
          expectedStdout: "64",
          hints: [
            "`pca.components_` has one row per component, so `len(pca.components_)` gives the total number of components.",
          ],
          solution:
            "from sklearn.datasets import load_digits\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.decomposition import PCA\n\ndigits = load_digits()\nX = StandardScaler().fit_transform(digits.data)\n\npca = PCA(n_components=None)\npca.fit(X)\nprint(len(pca.components_))",
        },
        {
          id: "pca-ex1b",
          label: "b",
          prompt:
            "How many principal components are needed to explain at least 95% of the variance? Print the number.",
          starterCode:
            "import numpy as np\nfrom sklearn.datasets import load_digits\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.decomposition import PCA\n\ndigits = load_digits()\nX = StandardScaler().fit_transform(digits.data)\n\npca = PCA(n_components=None)\npca.fit(X)\n\ncumvar = np.cumsum(pca.explained_variance_ratio_)\nn_components = int(np.argmax(cumvar >= 0.95)) + 1\nprint(n_components)",
          expectedStdout: "29",
          hints: [
            "`pca.explained_variance_ratio_` is an array of fractions — one per component.",
            "`np.cumsum` gives the running total. `np.argmax(cumvar >= 0.95)` finds the first index where cumulative variance reaches 95%.",
          ],
          solution:
            "import numpy as np\nfrom sklearn.datasets import load_digits\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.decomposition import PCA\n\ndigits = load_digits()\nX = StandardScaler().fit_transform(digits.data)\n\npca = PCA(n_components=None)\npca.fit(X)\n\ncumvar = np.cumsum(pca.explained_variance_ratio_)\nn_components = int(np.argmax(cumvar >= 0.95)) + 1\nprint(n_components)",
        },
        {
          id: "pca-ex1c",
          label: "c",
          prompt:
            "Fit a Logistic Regression classifier on the original 64-D digits and on the 29-PC version. Print both test accuracies, rounded to 3 decimal places, one per line.",
          starterCode:
            "from sklearn.datasets import load_digits\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.decomposition import PCA\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.model_selection import train_test_split\n\ndigits = load_digits()\nX_raw = StandardScaler().fit_transform(digits.data)\ny = digits.target\n\nX_train, X_test, y_train, y_test = train_test_split(X_raw, y, test_size=0.2, random_state=42)\n\n# Full dimensions\nlr_full = LogisticRegression(max_iter=1000, random_state=42)\nlr_full.fit(X_train, y_train)\nprint(round(lr_full.score(X_test, y_test), 3))\n\n# PCA-reduced\npca = PCA(n_components=29)\nX_train_pca = pca.fit_transform(X_train)\nX_test_pca = pca.transform(X_test)\n\nlr_pca = LogisticRegression(max_iter=1000, random_state=42)\nlr_pca.fit(X_train_pca, y_train)\nprint(round(lr_pca.score(X_test_pca, y_test), 3))",
          expectedStdout: "0.972\n0.972",
          hints: [
            "Fit PCA only on `X_train`, then call `pca.transform(X_test)` for the test set.",
            "The accuracies may differ slightly — the PCA version often matches the full model despite using half the features.",
          ],
          solution:
            "from sklearn.datasets import load_digits\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.decomposition import PCA\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.model_selection import train_test_split\n\ndigits = load_digits()\nX_raw = StandardScaler().fit_transform(digits.data)\ny = digits.target\n\nX_train, X_test, y_train, y_test = train_test_split(X_raw, y, test_size=0.2, random_state=42)\n\nlr_full = LogisticRegression(max_iter=1000, random_state=42)\nlr_full.fit(X_train, y_train)\nprint(round(lr_full.score(X_test, y_test), 3))\n\npca = PCA(n_components=29)\nX_train_pca = pca.fit_transform(X_train)\nX_test_pca = pca.transform(X_test)\n\nlr_pca = LogisticRegression(max_iter=1000, random_state=42)\nlr_pca.fit(X_train_pca, y_train)\nprint(round(lr_pca.score(X_test_pca, y_test), 3))",
        },
      ],
    },
  ],

  // ═══════════════════════════════════════════════════════════
  //  CHEAT SHEET
  // ═══════════════════════════════════════════════════════════
  cheatsheet: [
    {
      heading: "Core Concepts",
      items: [
        {
          term: "Principal Component",
          note: "Eigenvector of the covariance matrix — a direction of maximum remaining variance",
        },
        {
          term: "Eigenvalue",
          note: "Amount of variance captured by the corresponding component",
          formula: "\\lambda_j = \\text{Var}(\\mathbf{X}\\mathbf{v}_j)",
        },
        {
          term: "Explained variance ratio",
          note: "Fraction of total variance in component j: λⱼ / Σλᵢ",
        },
        {
          term: "Loadings",
          note: "Coefficients of original features in a PC — in sklearn: pca.components_",
        },
      ],
    },
    {
      heading: "Workflow",
      items: [
        {
          term: "1. Centre & scale",
          note: "StandardScaler().fit_transform(X_train) — mandatory before PCA",
        },
        {
          term: "2. Fit PCA on train only",
          note: "pca.fit(X_train) — never on the full dataset",
        },
        {
          term: "3. Choose k",
          note: "Scree plot or cumulative explained variance ≥ 95%",
        },
        {
          term: "4. Transform",
          note: "pca.transform(X_train), pca.transform(X_test) — same axes for both",
        },
      ],
    },
    {
      heading: "Key sklearn API",
      items: [
        {
          term: "pca.explained_variance_ratio_",
          note: "Array of EVR per component; cumsum gives cumulative",
        },
        {
          term: "pca.components_",
          note: "Shape (k, p) — each row is a PC, columns are feature loadings",
        },
        {
          term: "pca.inverse_transform(Z)",
          note: "Project back to original space for reconstruction / denoising",
        },
        {
          term: "PCA(n_components=0.95)",
          note: "Pass a float to auto-select components for 95% variance",
        },
      ],
    },
    {
      heading: "Alternatives",
      items: [
        {
          term: "t-SNE / UMAP",
          note: "Non-linear 2–3D visualisation; not for downstream ML (no inverse transform)",
        },
        {
          term: "Kernel PCA",
          note: "Non-linear PCA via the kernel trick — handles manifold structure",
        },
        {
          term: "Truncated SVD",
          note: "PCA without centring — efficient for sparse data (text TF-IDF)",
        },
        {
          term: "Incremental PCA",
          note: "Mini-batch PCA for datasets too large to fit in memory",
        },
      ],
    },
  ],
};
