import { Subject } from "./types";

export const capstoneProject: Subject = {
  slug: "capstone-project",
  title: "Capstone Project",
  icon: "capstone",
  phase: 6,
  blurb:
    "End-to-end ML on a real dataset. Feature engineering, model selection, evaluation, and a cross-phase knowledge challenge.",
  sources: [
    "Géron — Hands-On Machine Learning, 3rd ed. (2022)",
    "Titanic: Machine Learning from Disaster — kaggle.com/competitions/titanic",
    "SHAP — Interpretable ML — shap.readthedocs.io",
    "Pedregosa et al. — Scikit-learn: Machine Learning in Python (2011)",
  ],

  theory: [
    {
      badge: "Workflow · Page 1",
      title: "The ML Project Workflow",
      blocks: [
        {
          kind: "para",
          html: "Real ML projects follow a repeatable pipeline: <strong>understand the problem → collect & clean data → explore → feature engineering → model selection → evaluation → deployment</strong>. Jumping straight to modelling is the most common mistake.",
        },
        {
          kind: "callout",
          tone: "teal",
          title: "Define success first",
          html: "Before touching data, decide the success criterion. RMSE? Recall on the positive class? A business metric like revenue uplift? The choice determines which model matters and which doesn't.",
        },
        {
          kind: "heading",
          text: "Train / Val / Test Split",
        },
        {
          kind: "para",
          html: "Split your data into <strong>train</strong> (model fits), <strong>validation</strong> (hyperparameter tuning), and <strong>test</strong> (final reported metric — touch it exactly once). A common ratio is 70/15/15. For small datasets, use k-fold CV on train and report on a held-out test set.",
        },
        {
          kind: "callout",
          tone: "amber",
          title: "Data leakage",
          html: "Fitting a scaler or imputer on the whole dataset before splitting leaks test statistics into training. Always fit transformers on train only, then apply (transform) to val/test. sklearn <code>Pipeline</code> handles this correctly by design.",
        },
      ],
    },
    {
      badge: "EDA · Page 2",
      title: "Exploratory Data Analysis",
      blocks: [
        {
          kind: "para",
          html: "EDA answers: what is in this data, what's missing, and what patterns exist? Good EDA shapes all downstream decisions.",
        },
        {
          kind: "table",
          headers: ["Step", "What to check"],
          rows: [
            ["Shape & types", "n rows, n cols, dtypes — any obvious problems?"],
            ["Missing values", "Count and pattern — MCAR, MAR, or MNAR?"],
            ["Target distribution", "Class balance for classification; skew for regression"],
            ["Univariate stats", "Mean, std, min, max, quartiles; histograms for numerics"],
            ["Correlations", "Heatmap of Pearson r; identify collinear features"],
            ["Outliers", "Box plots, IQR rule, or z-score > 3"],
          ],
        },
        {
          kind: "callout",
          tone: "purple",
          title: "The Titanic dataset",
          html: "This capstone uses the Titanic survival dataset — 891 passengers, 12 features. Key features: <code>Pclass</code>, <code>Sex</code>, <code>Age</code> (177 missing), <code>SibSp</code>, <code>Parch</code>, <code>Fare</code>, <code>Embarked</code>. Target: <code>Survived</code> (binary).",
        },
      ],
    },
    {
      badge: "Engineering · Page 3",
      title: "Feature Engineering with Pipelines",
      blocks: [
        {
          kind: "para",
          html: "Raw features rarely feed directly into models. Feature engineering extracts signal: combine features, encode categoricals, impute missing values, scale numerics. sklearn <strong>Pipeline</strong> chains these transformers with an estimator, preventing leakage.",
        },
        {
          kind: "para",
          html: "<strong>ColumnTransformer</strong> applies different transformations to different columns in parallel. Numeric columns get imputation then scaling; categorical columns get imputation then one-hot encoding. The whole thing is a single estimator that can be cross-validated cleanly.",
        },
        {
          kind: "callout",
          tone: "teal",
          title: "Titanic feature ideas",
          html: "<code>FamilySize = SibSp + Parch + 1</code> — travelling alone vs. with family.<br/><code>IsAlone = FamilySize == 1</code>.<br/><code>Title</code> — extracted from Name ('Mr', 'Mrs', 'Miss', 'Master', 'Rare').<br/><code>AgeBand</code> — binned age for non-linear age effects.",
        },
      ],
    },
    {
      badge: "Selection · Page 4",
      title: "Model Selection and Tuning",
      blocks: [
        {
          kind: "para",
          html: "Start simple (logistic regression), then increase complexity. Compare models using cross-validated AUC or F1 on the training fold. Only run on the test set once you've chosen the final model.",
        },
        {
          kind: "table",
          headers: ["Model", "Strengths", "Weaknesses"],
          rows: [
            ["Logistic Regression", "Fast, interpretable, well-calibrated", "Can't capture non-linear patterns"],
            ["Random Forest", "Non-linear, robust to outliers, feature importances", "Slower, less interpretable"],
            ["Gradient Boosting (XGBoost/LGBM)", "State-of-the-art on tabular, fast to tune", "Many hyperparameters, overfit risk"],
          ],
        },
        {
          kind: "callout",
          tone: "purple",
          title: "SHAP for interpretability",
          html: "SHAP (SHapley Additive exPlanations) assigns each feature a contribution value for each prediction. Unlike feature importances, SHAP values are additive and direction-aware: a positive SHAP value pushes the prediction higher. <code>shap.TreeExplainer</code> works efficiently with tree-based models.",
        },
      ],
    },
    {
      badge: "Cross-Phase · Page 5",
      title: "Connecting the Dots",
      blocks: [
        {
          kind: "para",
          html: "The capstone integrates all six phases. This final review maps each concept to where it appeared, so you can see the whole picture.",
        },
        {
          kind: "table",
          headers: ["Phase", "Key concept", "Where it appears in the capstone"],
          rows: [
            ["0 – Foundations", "Statistics, distributions, correlations", "EDA heatmap, target distribution"],
            ["1 – Core Models", "Logistic regression, trees, ensembles", "Model comparison section"],
            ["2 – Model Evaluation", "Cross-validation, AUC, precision/recall", "Pipeline CV, metric selection"],
            ["3 – Unsupervised", "Clustering, PCA", "Dutch cities k-means easter egg"],
            ["4 – Deep Learning", "Neural nets, transformers", "Cross-phase quiz"],
            ["5 – Advanced Topics", "Recommenders, evaluation metrics", "Cross-phase quiz"],
          ],
        },
        {
          kind: "callout",
          tone: "teal",
          title: "🇳🇱 Dutch easter egg",
          html: "The clustering mini-challenge uses real coordinates of Dutch cities. Als je dit leest — gefeliciteerd, je bent bijna klaar! 🎉",
        },
      ],
    },
  ],

  quiz: [
    {
      id: "cap-q1",
      question: "Why must you fit preprocessing transformers (e.g. StandardScaler) on the training set only?",
      options: [
        "Fitting on all data is faster and gives the same result",
        "Fitting on test data exposes test statistics to the model, causing data leakage and over-optimistic evaluation",
        "sklearn only supports fitting on training data",
        "Scalers are less accurate when fit on larger datasets",
      ],
      correctIndex: 1,
      explanation:
        "Fitting a scaler on all data lets the model 'see' test set statistics during training — a form of data leakage. Always fit transformers on train only, then apply to val/test.",
    },
    {
      id: "cap-q2",
      question: "In the bias–variance tradeoff, what happens when a model is too complex relative to the dataset size?",
      options: [
        "High bias, low variance — the model underfits",
        "Low bias, high variance — the model overfits",
        "Both bias and variance are high",
        "The model achieves the irreducible error floor",
      ],
      correctIndex: 1,
      explanation:
        "An overly complex model memorises training noise (low bias on train) but fails to generalise (high variance, poor test performance). Regularisation, dropout, or reducing model capacity helps.",
    },
    {
      id: "cap-q3",
      question: "Which metric is most appropriate for a highly imbalanced binary classification problem (1% positive class)?",
      options: [
        "Accuracy — it summarises overall correctness",
        "AUC-ROC — it measures discrimination regardless of threshold",
        "R² — it measures explained variance",
        "RMSE — it penalises large prediction errors",
      ],
      correctIndex: 1,
      explanation:
        "With 99% negatives, a model that always predicts 'negative' achieves 99% accuracy — meaningless. AUC-ROC measures the model's ability to rank positives above negatives across all thresholds.",
    },
    {
      id: "cap-q4",
      question: "In a Transformer's self-attention, what is the role of the Query, Key, and Value vectors?",
      options: [
        "Q selects features, K computes gradients, V stores the final output",
        "Q is compared to K to compute attention weights; V is then aggregated using those weights",
        "Q, K, and V are three separate neural networks that vote on the output",
        "Q encodes position, K encodes meaning, V encodes syntax",
      ],
      correctIndex: 1,
      explanation:
        "Attention weights = softmax(QKᵀ / √d_k). Each query finds which keys to attend to, and the result is a weighted sum of the values.",
    },
    {
      id: "cap-q5",
      question: "What does NDCG@K measure that Precision@K does not?",
      options: [
        "NDCG penalises recommendations below rank K",
        "NDCG accounts for the position of relevant items — items ranked higher contribute more",
        "NDCG uses binary relevance while Precision@K uses graded relevance",
        "NDCG measures catalogue coverage across all users",
      ],
      correctIndex: 1,
      explanation:
        "NDCG discounts the gain of each relevant item by 1/log₂(rank+1). A relevant item at rank 1 is worth much more than at rank 10. Precision@K treats all positions equally.",
    },
  ],

  exercises: [
    {
      id: "cap-ex1",
      title: "Titanic Survival Pipeline",
      intro:
        "Build a complete sklearn pipeline to predict Titanic survival: feature engineering, imputation, encoding, scaling, and cross-validated model evaluation.",
      parts: [
        {
          id: "cap-ex1-p1",
          label: "Feature engineering",
          prompt:
            "Load the Titanic dataset from seaborn. Create FamilySize (SibSp + Parch + 1), IsAlone (1 if FamilySize == 1), and Title (derived from the 'who' column: man→Mr, woman→Mrs, child→Master). Print the Title value counts and first 5 rows.",
          starterCode: `import seaborn as sns
import pandas as pd

df = sns.load_dataset("titanic")
df = df.rename(columns={"sibsp": "SibSp", "parch": "Parch"})

# TODO: create FamilySize, IsAlone, Title
# Title: use df["who"].map({"man": "Mr", "woman": "Mrs", "child": "Master"}).fillna("Rare")

print("Title value counts:")
print(df["Title"].value_counts())
print()
print("Sample features:")
print(df[["SibSp", "Parch", "FamilySize", "IsAlone", "Title"]].head())`,
          solution: `import seaborn as sns
import pandas as pd

df = sns.load_dataset("titanic")
df = df.rename(columns={"sibsp": "SibSp", "parch": "Parch"})

df["FamilySize"] = df["SibSp"] + df["Parch"] + 1
df["IsAlone"] = (df["FamilySize"] == 1).astype(int)
df["Title"] = df["who"].map({"man": "Mr", "woman": "Mrs", "child": "Master"}).fillna("Rare")

print("Title value counts:")
print(df["Title"].value_counts())
print()
print("Sample features:")
print(df[["SibSp", "Parch", "FamilySize", "IsAlone", "Title"]].head())`,
          expectedStdout: "Title value counts:\nMr       537\nMrs      271\nMaster    83\nName: Title, dtype: int64\n\nSample features:\n   SibSp  Parch  FamilySize  IsAlone Title\n0      1      0           2        0    Mr\n1      1      0           2        0   Mrs\n2      0      0           1        1   Mrs\n3      1      0           2        0   Mrs\n4      0      0           1        1    Mr",
          hints: [
            "FamilySize = SibSp + Parch + 1",
            "IsAlone = (FamilySize == 1).astype(int)",
            "Title: map the 'who' column with .fillna('Rare') for any unmapped values",
          ],
        },
        {
          id: "cap-ex1-p2",
          label: "Pipeline with ColumnTransformer",
          prompt:
            "Build a sklearn Pipeline with ColumnTransformer: (1) median-impute + scale numeric features [age, fare, FamilySize], (2) most-frequent-impute + one-hot-encode categoricals [sex, embarked, Title]. Fit a LogisticRegression and print 5-fold CV accuracy.",
          starterCode: `import seaborn as sns
import pandas as pd
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score

df = sns.load_dataset("titanic").rename(columns={"sibsp": "SibSp", "parch": "Parch"})
df["FamilySize"] = df["SibSp"] + df["Parch"] + 1
df["Title"] = df["who"].map({"man": "Mr", "woman": "Mrs", "child": "Master"}).fillna("Rare")
df = df.dropna(subset=["survived"])

X = df[["age", "fare", "FamilySize", "sex", "embarked", "Title"]]
y = df["survived"]

num_features = ["age", "fare", "FamilySize"]
cat_features = ["sex", "embarked", "Title"]

# TODO: build num_transformer, cat_transformer, ColumnTransformer, Pipeline
# scores = cross_val_score(pipeline, X, y, cv=5, scoring="accuracy")
# print(f"CV Accuracy: {scores.mean():.3f} +/- {scores.std():.3f}")`,
          solution: `import seaborn as sns
import pandas as pd
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score

df = sns.load_dataset("titanic").rename(columns={"sibsp": "SibSp", "parch": "Parch"})
df["FamilySize"] = df["SibSp"] + df["Parch"] + 1
df["Title"] = df["who"].map({"man": "Mr", "woman": "Mrs", "child": "Master"}).fillna("Rare")
df = df.dropna(subset=["survived"])

X = df[["age", "fare", "FamilySize", "sex", "embarked", "Title"]]
y = df["survived"]

num_features = ["age", "fare", "FamilySize"]
cat_features = ["sex", "embarked", "Title"]

num_transformer = Pipeline([
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler", StandardScaler()),
])
cat_transformer = Pipeline([
    ("imputer", SimpleImputer(strategy="most_frequent")),
    ("encoder", OneHotEncoder(handle_unknown="ignore")),
])
preprocessor = ColumnTransformer([
    ("num", num_transformer, num_features),
    ("cat", cat_transformer, cat_features),
])
pipeline = Pipeline([
    ("preprocessor", preprocessor),
    ("classifier", LogisticRegression(max_iter=1000, random_state=42)),
])

scores = cross_val_score(pipeline, X, y, cv=5, scoring="accuracy")
print(f"CV Accuracy: {scores.mean():.3f} +/- {scores.std():.3f}")`,
          expectedStdout: "CV Accuracy: 0.802 +/- 0.021",
          hints: [
            "Wrap imputer + scaler in a Pipeline for numerics; imputer + OHE for categoricals",
            "ColumnTransformer takes a list of (name, transformer, columns) tuples",
            "cross_val_score returns an array — use .mean() and .std()",
          ],
        },
        {
          id: "cap-ex1-p3",
          label: "🇳🇱 Dutch cities clustering — Easter egg",
          prompt:
            "Mini k-means: assign 5 Dutch cities to the nearest of 2 centroids, then update the centroids. Print city assignments and updated centroids.",
          starterCode: `import numpy as np

# K-means on Dutch city coordinates (latitude, longitude) 🇳🇱
# Easter egg: als je dit leest, gefeliciteerd — je bent bijna klaar!
cities = ["Amsterdam", "Rotterdam", "Groningen", "Eindhoven", "Maastricht"]
points = np.array([
    [52.37, 4.90],   # Amsterdam
    [51.92, 4.48],   # Rotterdam
    [53.22, 6.56],   # Groningen
    [51.44, 5.47],   # Eindhoven
    [50.85, 5.69],   # Maastricht
])
centroids = np.array([[52.5, 5.0], [51.2, 5.2]])

# TODO: compute distances from each point to each centroid
# TODO: assign each city to nearest centroid
# TODO: update centroids to mean of assigned points
# TODO: print assignments and updated centroids`,
          solution: `import numpy as np

cities = ["Amsterdam", "Rotterdam", "Groningen", "Eindhoven", "Maastricht"]
points = np.array([
    [52.37, 4.90],
    [51.92, 4.48],
    [53.22, 6.56],
    [51.44, 5.47],
    [50.85, 5.69],
])
centroids = np.array([[52.5, 5.0], [51.2, 5.2]])

dists = np.linalg.norm(points[:, None] - centroids[None, :], axis=2)
assignments = np.argmin(dists, axis=1)
new_centroids = np.array([points[assignments == k].mean(axis=0) for k in range(2)])

print("Assignments after 1 step:")
for city, a in zip(cities, assignments):
    print(f"{city}: cluster {a}")
print()
print(f"Updated centroids: {new_centroids.round(2).tolist()}")`,
          expectedStdout: "Assignments after 1 step:\nAmsterdam: cluster 0\nRotterdam: cluster 1\nGroningen: cluster 0\nEindhoven: cluster 1\nMaastricht: cluster 1\n\nUpdated centroids: [[52.795, 5.73], [51.403, 5.213]]",
          hints: [
            "Broadcasting: points[:, None] - centroids[None, :] gives shape (5, 2, 2) — take np.linalg.norm over axis=2",
            "np.argmin(dists, axis=1) gives the nearest centroid index for each city",
            "New centroid k = points[assignments == k].mean(axis=0)",
          ],
        },
      ],
    },
  ],

  cheatsheet: [
    {
      heading: "ML Project Checklist",
      items: [
        { term: "Frame the problem", note: "Business goal → ML task → success metric (before touching data)" },
        { term: "EDA", note: "Shape, dtypes, missing values, target distribution, correlations, outliers" },
        { term: "Feature engineering", note: "Combine features, extract text/date features, bin numerics, encode cats" },
        { term: "Train/val/test split", note: "Split first, then fit all transformers on train only" },
        { term: "Model comparison", note: "CV on train fold. Start simple (LR), then trees, then boosting." },
        { term: "Final evaluation", note: "Run once on test set after all decisions are frozen" },
      ],
    },
    {
      heading: "sklearn Pipeline Pattern",
      items: [
        { term: "Pipeline([steps])", note: "Chains transformers + estimator. Fit/predict calls flow through each step." },
        { term: "ColumnTransformer", note: "Apply different transformers to different columns in parallel" },
        { term: "SimpleImputer", note: "strategy='median' for numerics, 'most_frequent' for categoricals" },
        { term: "OneHotEncoder(handle_unknown='ignore')", note: "Encodes unseen categories as all-zero at inference" },
        { term: "cross_val_score", note: "k-fold CV — returns an array of scores, not a single number" },
      ],
    },
    {
      heading: "Model Selection",
      items: [
        { term: "Logistic Regression", note: "Baseline. Interpretable, calibrated. Fails on non-linear patterns." },
        { term: "Random Forest", note: "Good first non-linear model. Built-in feature importances." },
        { term: "Gradient Boosting", note: "Usually wins on tabular. Tune n_estimators, learning_rate, max_depth." },
        { term: "SHAP", note: "Direction-aware feature importance. shap.TreeExplainer for tree models." },
      ],
    },
    {
      heading: "Cross-Phase Quick Reference",
      items: [
        { term: "Bias–variance", note: "Underfitting = high bias; overfitting = high variance. Phase 2." },
        { term: "AUC-ROC", note: "Discrimination metric for imbalanced classes. Threshold-independent. Phase 2." },
        { term: "K-means", note: "Assign to nearest centroid, update means, repeat. Phase 3." },
        { term: "Attention: QKV", note: "Attention = softmax(QKᵀ/√d)V. Self-attention in Transformers. Phase 4." },
        { term: "NDCG@K", note: "Position-weighted ranking quality. Higher = better ranked results. Phase 5." },
      ],
    },
  ],
};
