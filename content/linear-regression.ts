import { Subject } from "./types";

// ─────────────────────────────────────────────────────────────
//  LINEAR REGRESSION — built from the random-forests template.
//  Same structure throughout; only the content differs.
// ─────────────────────────────────────────────────────────────

export const linearRegression: Subject = {
  slug: "linear-regression",
  title: "Linear Regression",
  icon: "regression",
  phase: 1,
  blurb:
    "The foundation of predictive modelling: fit a straight-line relationship between inputs and a continuous output. Simple, interpretable, and the lens through which every later model is understood.",
  sources: [
    "James, Witten, Hastie & Tibshirani — An Introduction to Statistical Learning (ISLR), 2nd ed., Ch. 3",
    "Hastie, Tibshirani & Friedman — The Elements of Statistical Learning (ESL), 2nd ed., Ch. 3",
    "Wasserman, L. — All of Statistics, Ch. 13",
    "Géron, A. — Hands-On Machine Learning, 3rd ed., Ch. 4",
  ],

  // ═══════════════════════════════════════════════════════════
  //  THEORY
  // ═══════════════════════════════════════════════════════════
  theory: [
    // ── PAGE 1 — Intuition ──────────────────────────────────
    {
      badge: "Intuition · Page 1",
      title: "Drawing the Best Line Through Data",
      blocks: [
        {
          kind: "para",
          html: "Suppose you have a scatter of points — house sizes against their prices, say — and you want to summarise the relationship with a single straight line. Eyeball it and you could draw a dozen plausible lines. Linear regression answers a precise question: of all possible lines, which one passes <em>closest</em> to the points, and in what exact sense of \"closest\"? That single idea — a best-fitting line defined by a clear error criterion — is the seed from which most of statistics and machine learning grows.",
        },
        {
          kind: "para",
          html: "The appeal is that the answer is not just a prediction tool but an <em>explanation</em>. The fitted line has a slope, and that slope has a plain-language meaning: \"each extra square metre adds roughly €3,000 to the price.\" Few models are this transparent, which is why regression remains the default starting point even in an age of deep learning.",
        },
        {
          kind: "callout",
          tone: "purple",
          title: "Why start here",
          html: "Linear regression introduces, in their simplest form, nearly every concept you will meet again: a <em>model</em> with parameters, a <em>loss function</em> that measures error, an <em>optimisation</em> that minimises it, and <em>assumptions</em> that determine when the result can be trusted. Master it and the rest of the field becomes variations on a familiar theme.",
        },
        {
          kind: "heading",
          text: "The form of the model",
        },
        {
          kind: "para",
          html: "With one predictor, the model is just the equation of a line — an intercept \\(\\beta_0\\) and a slope \\(\\beta_1\\). With many predictors it becomes a weighted sum, one coefficient per feature, plus an intercept. The coefficients are what we learn from data.",
        },
        {
          kind: "equation",
          label: "Simple & multiple linear regression",
          tex: "\\hat{y} = \\beta_0 + \\beta_1 x_1 + \\beta_2 x_2 + \\dots + \\beta_p x_p",
        },
        {
          kind: "callout",
          tone: "teal",
          title: "Where you'll meet it",
          html: "Economics (demand vs price), medicine (dose vs response), real estate, marketing mix modelling, and as a fast, interpretable baseline in almost any tabular prediction task. When someone reports \"controlling for X, Y increases by…\", a regression is usually underneath.",
        },
      ],
    },

    // ── PAGE 2 — The loss function ──────────────────────────
    {
      badge: "Foundations · Page 2",
      title: "Least Squares: Defining \"Best\"",
      blocks: [
        {
          kind: "para",
          html: "To find the best line we must define error. For each data point, the <em>residual</em> is the vertical gap between the observed value \\(y_i\\) and the line's prediction \\(\\hat{y}_i\\). Linear regression chooses the coefficients that minimise the sum of the <em>squared</em> residuals — the Residual Sum of Squares.",
        },
        {
          kind: "equation",
          label: "Residual Sum of Squares (the loss)",
          tex: "RSS = \\sum_{i=1}^{n}\\left(y_i - \\hat{y}_i\\right)^2",
        },
        {
          kind: "heading",
          text: "Why squared, not absolute?",
        },
        {
          kind: "para",
          html: "Squaring the residuals does two things. It makes positive and negative errors both count as positive, and it penalises large errors disproportionately — a point twice as far off contributes four times the loss. Squaring also makes the loss smooth and differentiable, which is what allows a clean closed-form solution and easy optimisation. The trade-off: squared loss is <em>sensitive to outliers</em>, since one extreme point can dominate the sum.",
        },
        {
          kind: "callout",
          tone: "amber",
          title: "A geometric picture",
          html: "Imagine a spring connecting each point to the line, pulling vertically. The energy stored in a spring is proportional to the square of its stretch. Least squares finds the line where the total spring energy is smallest — the line settles into the position of minimum tension.",
        },
        {
          kind: "para",
          html: "Minimising RSS is called <em>Ordinary Least Squares</em> (OLS). Remarkably, for linear models this minimisation has an exact algebraic solution — we do not need to search or iterate, as we will see next.",
        },
      ],
    },

    // ── PAGE 3 — Solving it ─────────────────────────────────
    {
      badge: "Mathematics · Page 3",
      title: "The Normal Equations",
      blocks: [
        {
          kind: "para",
          html: "Writing the data as a matrix \\(X\\) (one row per observation, one column per feature plus a column of ones for the intercept) and the targets as a vector \\(y\\), the entire model is \\(\\hat{y} = X\\beta\\). Minimising RSS with respect to \\(\\beta\\) — by setting the derivative to zero — yields a single elegant formula.",
        },
        {
          kind: "equation",
          label: "Closed-form OLS solution",
          tex: "\\hat{\\beta} = (X^\\top X)^{-1} X^\\top y",
        },
        {
          kind: "para",
          html: "This is the <em>normal equation</em>. It gives the exact best-fit coefficients in one step — no iteration, no learning rate, no convergence to worry about. This closed form is a luxury almost unique to linear models; most models you meet later have no such shortcut and must be fit by iterative optimisation.",
        },
        {
          kind: "callout",
          tone: "purple",
          title: "When the shortcut breaks down",
          html: "The formula requires inverting \\(X^\\top X\\). If two predictors are highly correlated (<em>multicollinearity</em>), or there are more features than observations, this matrix is singular or near-singular and the inverse blows up. In practice, libraries use numerically stable methods (QR or SVD decomposition) rather than literally inverting, and for very large datasets we fall back to gradient descent.",
        },
        {
          kind: "heading",
          text: "The gradient-descent alternative",
        },
        {
          kind: "para",
          html: "When the closed form is impractical, we minimise RSS iteratively: start with arbitrary coefficients and repeatedly nudge them downhill along the gradient of the loss. This is the same machinery that trains neural networks — linear regression is the simplest place to see it work.",
        },
        {
          kind: "equation",
          label: "Gradient-descent update",
          tex: "\\beta \\leftarrow \\beta - \\eta\\,\\frac{\\partial\\,RSS}{\\partial \\beta}",
        },
      ],
    },

    // ── PAGE 4 — Assumptions & evaluation ───────────────────
    {
      badge: "Inference · Page 4",
      title: "Assumptions & Goodness of Fit",
      blocks: [
        {
          kind: "para",
          html: "Linear regression will always return coefficients, but whether those coefficients mean anything depends on assumptions about the data. Knowing them is what separates a sound analysis from a misleading one.",
        },
        {
          kind: "table",
          headers: ["Assumption", "What it means", "If violated"],
          rows: [
            ["Linearity", "The true relationship is actually linear", "Biased, systematically wrong predictions"],
            ["Independence", "Observations don't influence each other", "Understated uncertainty (common in time series)"],
            ["Homoscedasticity", "Constant error variance across all x", "Inefficient estimates, wrong confidence intervals"],
            ["Normality of errors", "Residuals are roughly normal", "Affects p-values and intervals, not the fit itself"],
            ["No multicollinearity", "Predictors aren't redundant", "Unstable, uninterpretable coefficients"],
          ],
        },
        {
          kind: "heading",
          text: "How good is the fit? R²",
        },
        {
          kind: "para",
          html: "The coefficient of determination, \\(R^2\\), reports the fraction of the variance in the target that the model explains. It runs from 0 (no better than predicting the mean) to 1 (perfect fit).",
        },
        {
          kind: "equation",
          label: "Coefficient of determination",
          tex: "R^2 = 1 - \\frac{RSS}{TSS} = 1 - \\frac{\\sum (y_i - \\hat{y}_i)^2}{\\sum (y_i - \\bar{y})^2}",
        },
        {
          kind: "callout",
          tone: "red",
          title: "R² is not the whole story",
          html: "A high \\(R^2\\) does not mean the model is correct — it can be inflated by adding irrelevant predictors, and it says nothing about whether the assumptions hold. Always inspect <em>residual plots</em>: if residuals show a pattern (a curve, a fan shape), the model is mis-specified no matter how high \\(R^2\\) looks. Use <em>adjusted</em> \\(R^2\\) when comparing models with different numbers of predictors.",
        },
      ],
    },

    // ── PAGE 5 — Strengths, weaknesses, extensions ──────────
    {
      badge: "Trade-offs · Page 5",
      title: "Benefits, Drawbacks & Extensions",
      blocks: [
        {
          kind: "para",
          html: "Linear regression endures not because it is the most accurate model, but because it is the most <em>transparent</em>. Knowing its limits tells you exactly when to reach for something more powerful.",
        },
        {
          kind: "table",
          headers: ["Benefits", "Drawbacks"],
          rows: [
            ["Fully interpretable — each coefficient has a clear meaning", "Assumes a linear relationship; underfits curved data"],
            ["Fast to fit, even on large data; closed-form solution exists", "Sensitive to outliers because of squared loss"],
            ["Well-understood statistical inference (p-values, intervals)", "Struggles with many correlated predictors"],
            ["Strong, honest baseline for any regression task", "Cannot capture interactions unless you add them by hand"],
            ["Few hyperparameters; little can go wrong silently", "Easily outperformed by trees/boosting on complex data"],
          ],
        },
        {
          kind: "heading",
          text: "Common extensions",
        },
        {
          kind: "para",
          html: "When plain OLS falls short, a family of close relatives extends it without abandoning the linear framework: <em>polynomial regression</em> adds powers of the features to fit curves; <em>ridge</em> and <em>lasso</em> regression add a penalty on coefficient size to fight overfitting and multicollinearity (and lasso can zero out useless features entirely); and <em>logistic regression</em> adapts the same machinery to classification by predicting probabilities instead of values.",
        },
        {
          kind: "callout",
          tone: "teal",
          title: "When to choose it",
          html: "Reach for linear regression when interpretability matters, you need a fast baseline, the relationship is plausibly linear, or you must report statistical significance. Reach elsewhere when the relationship is clearly non-linear, predictors interact in complex ways, or raw predictive accuracy outweighs the need to explain the model.",
        },
      ],
    },
  ],

  // ═══════════════════════════════════════════════════════════
  //  QUIZ
  // ═══════════════════════════════════════════════════════════
  quiz: [
    {
      id: "lr-q1",
      question:
        "What quantity does Ordinary Least Squares minimise to find the best-fit line?",
      options: [
        "The sum of the absolute residuals",
        "The sum of the squared residuals (RSS)",
        "The number of points above the line",
        "The largest single residual",
      ],
      correctIndex: 1,
      explanation:
        "OLS minimises the Residual Sum of Squares — the sum of squared vertical gaps between observed values and predictions. Squaring penalises large errors more and makes the loss smooth and solvable in closed form.",
    },
    {
      id: "lr-q2",
      question: "Why does least squares square the residuals rather than take absolute values?",
      options: [
        "Squaring is the only way to make errors positive",
        "It makes the loss smooth/differentiable and penalises large errors more, enabling a closed-form solution",
        "Absolute values cannot be computed by a computer",
        "It makes the model robust to outliers",
      ],
      correctIndex: 1,
      explanation:
        "Squaring yields a smooth, differentiable loss with an exact algebraic minimum, and weights large errors heavily. The cost is sensitivity to outliers — the opposite of robust.",
    },
    {
      id: "lr-q3",
      question:
        "The normal equation β̂ = (XᵀX)⁻¹Xᵀy can fail to compute. What is a common cause?",
      options: [
        "The dataset has too few features",
        "Highly correlated predictors (multicollinearity) make XᵀX singular or near-singular",
        "The learning rate is set too high",
        "The target variable is continuous",
      ],
      correctIndex: 1,
      explanation:
        "When predictors are collinear (or there are more features than observations), XᵀX cannot be stably inverted. Libraries use QR/SVD decompositions, and for huge data we use gradient descent instead.",
    },
    {
      id: "lr-q4",
      question: "What does an R² of 0.45 tell you?",
      options: [
        "The model is 45% likely to be correct",
        "The model explains about 45% of the variance in the target",
        "45% of the residuals are zero",
        "The slope coefficient equals 0.45",
      ],
      correctIndex: 1,
      explanation:
        "R² is the fraction of the target's variance explained by the model. 0.45 means the model accounts for about 45% of the variation; the rest is unexplained. It does not by itself confirm the model is valid.",
    },
    {
      id: "lr-q5",
      question:
        "A regression has a high R² but its residual plot shows a clear U-shaped curve. What does this most likely indicate?",
      options: [
        "The model is excellent and ready to deploy",
        "The linearity assumption is violated — the true relationship is non-linear",
        "There are too few data points",
        "The target needs to be squared",
      ],
      correctIndex: 1,
      explanation:
        "A pattern in the residuals signals a mis-specified model. A U-shape means a linear fit is missing curvature — consider polynomial terms or a non-linear model, regardless of how high R² appears.",
    },
  ],

  // ═══════════════════════════════════════════════════════════
  //  CODING EXERCISES — multi-part
  // ═══════════════════════════════════════════════════════════
  exercises: [
    {
      id: "lr-ex1",
      title: "Fit a Linear Regression on the Diabetes Dataset",
      intro:
        "Use sklearn's built-in diabetes dataset to fit and evaluate a linear regression, one step at a time. Each part builds on the last.",
      parts: [
        {
          id: "lr-ex1-a",
          label: "a",
          prompt:
            "Load the diabetes dataset with load_diabetes(return_X_y=True) into X and y, then print X.shape. (Expected: (442, 10))",
          starterCode:
            "from sklearn.datasets import load_diabetes\n\n# YOUR CODE HERE\n",
          expectedStdout: "(442, 10)",
          hints: [
            "load_diabetes(return_X_y=True) returns the feature matrix X and the target y.",
            "X, y = load_diabetes(return_X_y=True), then print(X.shape).",
          ],
          solution:
            "from sklearn.datasets import load_diabetes\nX, y = load_diabetes(return_X_y=True)\nprint(X.shape)",
        },
        {
          id: "lr-ex1-b",
          label: "b",
          prompt:
            "Split the data 80/20 with train_test_split (random_state=42). Print the number of training and test rows separated by a space. (Expected: 353 89)",
          starterCode:
            "from sklearn.model_selection import train_test_split\n\n# YOUR CODE HERE\n",
          expectedStdout: "353 89",
          hints: [
            "train_test_split(X, y, test_size=0.2, random_state=42) returns four arrays.",
            "print(len(X_train), len(X_test)).",
          ],
          solution:
            "from sklearn.model_selection import train_test_split\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\nprint(len(X_train), len(X_test))",
        },
        {
          id: "lr-ex1-c",
          label: "c",
          prompt:
            "Create a LinearRegression model and fit it on the training data. Print the number of learned coefficients with print(model.coef_.shape[0]). (Expected: 10)",
          starterCode:
            "from sklearn.linear_model import LinearRegression\n\n# YOUR CODE HERE\n",
          expectedStdout: "10",
          hints: [
            "model = LinearRegression()",
            "model.fit(X_train, y_train), then print(model.coef_.shape[0]) — one coefficient per feature.",
          ],
          solution:
            "from sklearn.linear_model import LinearRegression\nmodel = LinearRegression()\nmodel.fit(X_train, y_train)\nprint(model.coef_.shape[0])",
        },
        {
          id: "lr-ex1-d",
          label: "d",
          prompt:
            "Predict on the test set and print the R² score rounded to 2 decimals, in the form 'R2: 0.45'. (Expected: R2: 0.45)",
          starterCode:
            "from sklearn.metrics import r2_score\n\n# YOUR CODE HERE\n",
          expectedStdout: "R2: 0.45",
          hints: [
            "Use model.predict(X_test) to get predictions.",
            "r2 = r2_score(y_test, model.predict(X_test))",
            'print(f"R2: {r2:.2f}")',
          ],
          solution:
            'from sklearn.metrics import r2_score\nr2 = r2_score(y_test, model.predict(X_test))\nprint(f"R2: {r2:.2f}")',
        },
      ],
    },
  ],

  // ═══════════════════════════════════════════════════════════
  //  CHEAT SHEET
  // ═══════════════════════════════════════════════════════════
  cheatsheet: [
    {
      heading: "Core Idea",
      items: [
        { term: "The model", note: "Predict a continuous target as a weighted sum of features plus an intercept.", formula: "\\hat{y} = \\beta_0 + \\sum_j \\beta_j x_j" },
        { term: "Coefficients", note: "Each βⱼ is the change in ŷ per unit change in xⱼ, holding others fixed." },
        { term: "Interpretability", note: "The slope has a plain-language meaning — regression explains, not just predicts." },
      ],
    },
    {
      heading: "Fitting",
      items: [
        { term: "Residual", note: "Vertical gap between an observation and the line's prediction." },
        { term: "RSS (the loss)", note: "Ordinary Least Squares minimises the sum of squared residuals.", formula: "\\sum_i (y_i - \\hat{y}_i)^2" },
        { term: "Why squared", note: "Smooth, differentiable, penalises big errors — but sensitive to outliers." },
        { term: "Normal equation", note: "Exact closed-form solution; no iteration needed.", formula: "\\hat{\\beta} = (X^\\top X)^{-1}X^\\top y" },
        { term: "Gradient descent", note: "Iterative fallback when the closed form is impractical (huge data)." },
      ],
    },
    {
      heading: "Assumptions",
      items: [
        { term: "Linearity", note: "The true relationship is actually a straight line / plane." },
        { term: "Independence", note: "Observations do not influence one another." },
        { term: "Homoscedasticity", note: "Error variance is constant across the range of x." },
        { term: "Normal errors", note: "Residuals roughly normal — affects p-values and intervals." },
        { term: "No multicollinearity", note: "Predictors not redundant, or coefficients become unstable." },
      ],
    },
    {
      heading: "Evaluation & Extensions",
      items: [
        { term: "R²", note: "Fraction of target variance explained, from 0 to 1.", formula: "1 - \\tfrac{RSS}{TSS}" },
        { term: "Residual plots", note: "A pattern means a mis-specified model — always check them." },
        { term: "Ridge / Lasso", note: "Penalise coefficient size to fight overfitting; lasso can zero features." },
        { term: "Polynomial", note: "Add powers of features to fit curves within the linear framework." },
        { term: "Logistic regression", note: "Same machinery adapted to predict probabilities for classification." },
      ],
    },
  ],
};