import { Subject } from "./types";

export const timeSeries: Subject = {
  slug: "time-series",
  title: "Time Series Analysis",
  icon: "timeseries",
  phase: 5,
  blurb:
    "When the order of observations matters. Learn to decompose trends and seasonality, model autocorrelation with ARIMA, evaluate forecasts honestly, and know when to reach for machine learning instead.",
  sources: [
    "Hyndman & Athanasopoulos — Forecasting: Principles and Practice, 3rd ed. (2021), free at otexts.com/fpp3",
    "Box, Jenkins, Reinsel & Ljung — Time Series Analysis: Forecasting and Control, 5th ed.",
    "Hamilton, J.D. — Time Series Analysis (1994)",
    "Géron, A. — Hands-On Machine Learning, 3rd ed., Ch. 15",
  ],

  theory: [
    {
      badge: "Intuition · Page 1",
      title: "What Makes Time Series Different",
      blocks: [
        {
          kind: "para",
          html: "In standard supervised learning, the rows of your dataset are assumed to be <em>independent</em>: shuffling them changes nothing. Time series data violates this fundamentally. Yesterday's temperature predicts today's; last quarter's revenue influences next quarter's. The order of observations is the data.",
        },
        {
          kind: "para",
          html: "This dependence over time — called <em>autocorrelation</em> — is both the challenge and the signal. It violates the i.i.d. assumptions of most machine learning algorithms. But it also means that the past contains information about the future, which is exactly what forecasting exploits.",
        },
        {
          kind: "callout",
          tone: "purple",
          title: "Three things in a time series",
          html: "<strong>Trend</strong> — a long-run upward or downward movement.<br/><strong>Seasonality</strong> — a regular, repeating pattern tied to a calendar period (daily, weekly, yearly).<br/><strong>Residuals / noise</strong> — what remains after removing trend and seasonality.",
        },
        {
          kind: "heading",
          text: "Classical decomposition",
        },
        {
          kind: "para",
          html: "The additive decomposition model writes the observed series as the sum of its components: \\(y_t = T_t + S_t + R_t\\). When the seasonal amplitude grows with the level, a multiplicative model is better: \\(y_t = T_t \\times S_t \\times R_t\\). statsmodels' <code>seasonal_decompose</code> performs this split automatically.",
        },
        {
          kind: "callout",
          tone: "amber",
          title: "Why you cannot use a random 80/20 split",
          html: "Splitting randomly leaks future information into the training set. Time series splits must respect time order: train on early data, test on later data. Use <code>TimeSeriesSplit</code> in scikit-learn for cross-validation.",
        },
      ],
    },
    {
      badge: "Foundations · Page 2",
      title: "Stationarity and Autocorrelation",
      blocks: [
        {
          kind: "para",
          html: "Most classical time series models require <em>stationarity</em>: the statistical properties of the series (mean, variance, autocorrelation structure) do not change over time. Stock prices are non-stationary (they trend). Daily returns are roughly stationary.",
        },
        {
          kind: "heading",
          text: "Testing for stationarity",
        },
        {
          kind: "para",
          html: "The Augmented Dickey-Fuller (ADF) test checks for a unit root — the statistical signature of a non-stationary series. A small p-value (< 0.05) rejects the null of non-stationarity: the series is stationary. A large p-value means you need to difference.",
        },
        {
          kind: "heading",
          text: "Differencing",
        },
        {
          kind: "para",
          html: "Taking the first difference \\(\\nabla y_t = y_t - y_{t-1}\\) removes a linear trend, often achieving stationarity. Seasonal differencing \\(\\nabla_m y_t = y_t - y_{t-m}\\) removes periodicity of period \\(m\\). Most series need at most two rounds of differencing.",
        },
        {
          kind: "heading",
          text: "ACF and PACF",
        },
        {
          kind: "para",
          html: "The <em>Autocorrelation Function</em> (ACF) plots the correlation of \\(y_t\\) with \\(y_{t-k}\\) for each lag \\(k\\). The <em>Partial ACF</em> (PACF) plots the correlation after removing the effects of intermediate lags. Together, ACF and PACF plots reveal the memory structure of a series and are the traditional guide for ARIMA order selection.",
        },
        {
          kind: "equation",
          label: "Autocorrelation at lag k",
          tex: "\\rho_k = \\frac{\\text{Cov}(y_t,\\, y_{t-k})}{\\text{Var}(y_t)}",
        },
      ],
    },
    {
      badge: "Models · Page 3",
      title: "ARIMA: Autoregression + Integration + Moving Average",
      blocks: [
        {
          kind: "para",
          html: "ARIMA is the classical workhorse of time series forecasting. It captures three kinds of structure in a stationary series, identified by three integers (p, d, q).",
        },
        {
          kind: "table",
          headers: ["Component", "Notation", "What it models"],
          rows: [
            ["Autoregression (AR)", "AR(p)", "Current value as a linear function of the past p values"],
            ["Integration", "I(d)", "d rounds of differencing to achieve stationarity"],
            ["Moving average (MA)", "MA(q)", "Current value as a function of the past q forecast errors"],
          ],
        },
        {
          kind: "equation",
          label: "AR(p) process",
          tex: "y_t = c + \\phi_1 y_{t-1} + \\dots + \\phi_p y_{t-p} + \\varepsilon_t",
        },
        {
          kind: "equation",
          label: "MA(q) process",
          tex: "y_t = \\mu + \\varepsilon_t + \\theta_1 \\varepsilon_{t-1} + \\dots + \\theta_q \\varepsilon_{t-q}",
        },
        {
          kind: "heading",
          text: "SARIMA for seasonal data",
        },
        {
          kind: "para",
          html: "SARIMA(p, d, q)(P, D, Q, m) adds seasonal AR and MA terms of period m. An annual-seasonal model might be SARIMA(1,1,1)(1,1,1,12) for monthly data: one AR and MA term, once differenced, with matching seasonal terms at lag 12.",
        },
        {
          kind: "callout",
          tone: "teal",
          title: "Auto-ARIMA",
          html: "Selecting p, d, q manually via ACF/PACF plots is tedious. The <code>pmdarima</code> library's <code>auto_arima()</code> searches the parameter space using the AIC criterion automatically — a practical starting point for any series.",
        },
      ],
    },
    {
      badge: "Evaluation · Page 4",
      title: "Forecasting Evaluation and Benchmarks",
      blocks: [
        {
          kind: "para",
          html: "A forecast model is only useful if it beats simpler alternatives. Always compare against naïve benchmarks before declaring a model successful.",
        },
        {
          kind: "heading",
          text: "Evaluation metrics",
        },
        {
          kind: "table",
          headers: ["Metric", "Formula", "Notes"],
          rows: [
            ["MAE", "mean |yₜ − ŷₜ|", "Interpretable in original units; robust to outliers"],
            ["RMSE", "√mean (yₜ − ŷₜ)²", "Penalises large errors more; sensitive to outliers"],
            ["MAPE", "mean |yₜ − ŷₜ|/|yₜ| × 100%", "Scale-independent; undefined when yₜ = 0"],
            ["sMAPE", "mean 2|yₜ−ŷₜ|/(|yₜ|+|ŷₜ|) × 100%", "Symmetric, bounded; used in M-competitions"],
          ],
        },
        {
          kind: "heading",
          text: "Naïve benchmarks",
        },
        {
          kind: "callout",
          tone: "amber",
          title: "Always beat the naïve forecast first",
          html: "<strong>Naïve</strong>: ŷ_{t+1} = y_t (last observation).<br/><strong>Seasonal naïve</strong>: ŷ_{t+1} = y_{t−m+1} (same season last period).<br/><strong>Drift</strong>: extrapolate the trend from first to last observation.<br/><strong>Mean</strong>: ŷ = ȳ (historical mean). If your model can't beat these, it's not learning anything useful.",
        },
        {
          kind: "heading",
          text: "Walk-forward validation",
        },
        {
          kind: "para",
          html: "Instead of a single train/test split, walk-forward validation simulates real deployment: train on data up to time T, forecast T+1, extend the training window by one, forecast T+2, and so on. This gives a distribution of errors across many forecasting origins, which is far more reliable than a single split.",
        },
      ],
    },
    {
      badge: "Modern Methods · Page 5",
      title: "ML and Deep Learning for Forecasting",
      blocks: [
        {
          kind: "para",
          html: "Classical ARIMA and exponential smoothing work well for single series with clear structure. Modern approaches — tree models, RNNs, and transformer-based architectures — shine when you have many related series, external covariates, or complex non-linear patterns.",
        },
        {
          kind: "heading",
          text: "Feature engineering for ML",
        },
        {
          kind: "para",
          html: "Standard ML models (gradient boosting, random forests) can forecast time series by treating it as a supervised problem: create lag features (\\(y_{t-1}, y_{t-2}, \\ldots\\)), rolling statistics (rolling mean, rolling std), and calendar features (month, day of week, holiday flags). The model then predicts \\(y_t\\) from these features.",
        },
        {
          kind: "callout",
          tone: "teal",
          title: "Prophet (Meta)",
          html: "<code>prophet</code> (pip install prophet) decomposes a series into trend + seasonality + holiday effects using an additive model with Bayesian regularisation. It is designed for analysts, not ML engineers: no stationarity checks, automatic seasonality detection, and human-readable changepoints. Excellent for business time series with holidays and irregular patterns.",
        },
        {
          kind: "table",
          headers: ["Approach", "Best for"],
          rows: [
            ["ARIMA / SARIMA", "Single series, short horizon, linear structure"],
            ["Exponential smoothing (ETS)", "Single series, strong trend/seasonality, fast fitting"],
            ["XGBoost / LightGBM + lags", "Many series, rich covariates, tabular structure"],
            ["LSTM / GRU", "Long-memory dependencies, non-linear patterns"],
            ["Temporal Fusion Transformer", "Many related series, mixed-frequency covariates, long horizons"],
            ["Prophet", "Business series with holidays and irregular changepoints"],
          ],
        },
        {
          kind: "callout",
          tone: "purple",
          title: "The M-competitions",
          html: "The Makridakis Forecasting Competitions (M1–M6) have benchmarked forecasting methods on thousands of real series since 1982. A recurring finding: simple methods (exponential smoothing, ARIMA) are hard to beat on short horizons. Ensembles of diverse methods consistently outperform any single approach.",
        },
      ],
    },
  ],

  quiz: [
    {
      id: "ts-q1",
      question:
        "You have monthly sales data from 2015–2023 and want to evaluate a forecasting model. Which validation approach is correct?",
      options: [
        "Evaluate on in-sample residuals for all years because time series are too short for a separate test set",
        "Train on 2015–2021 data, test on 2022–2023 data, preserving time order",
        "Randomly split 80% training / 20% test across all months — random sampling ensures unbiased estimates",
        "Use stratified 5-fold cross-validation, stratifying by year to ensure each fold covers the full date range"
      ],
      correctIndex: 1,
      explanation:
        "Time series must be split chronologically. A random split allows the model to be trained on future data and tested on the past — information leakage that produces optimistically biased error estimates. The training set must strictly precede the test set in time.",
    },
    {
      id: "ts-q2",
      question:
        "The ACF of a time series shows a slow, linear decay across many lags. What does this indicate?",
      options: [
        "The series has strong seasonality — the period of the pattern equals the lag at which the ACF peaks",
        "The series has a pure moving-average structure and can be fitted with ARIMA(0, 0, q) directly",
        "The series is non-stationary — likely a random walk or trending series",
        "The series is stationary — the slowly decaying ACF confirms that correlations fade over time"
      ],
      correctIndex: 2,
      explanation:
        "A slow, persistent decay in the ACF is the signature of a non-stationary (unit-root) series, such as a random walk or a trend. Stationary series have ACFs that decay quickly to zero. The fix is to difference the series (I component of ARIMA) before fitting.",
    },
    {
      id: "ts-q3",
      question: "What does the 'd' parameter in ARIMA(p, d, q) control?",
      options: [
        "The lag window size for the autoregressive component — how many past observations feed into the model",
        "The periodic seasonal frequency — for monthly data this is set to d = 12",
        "The decay rate of the moving-average component, controlling how quickly past errors lose influence",
        "The number of differencing operations applied to make the series stationary"
      ],
      correctIndex: 3,
      explanation:
        "In ARIMA(p, d, q): p = AR order (how many past values), d = Integration (how many times the series is differenced to achieve stationarity), q = MA order (how many past errors). A series with a linear trend typically needs d = 1; a series with a quadratic trend might need d = 2.",
    },
    {
      id: "ts-q4",
      question:
        "Mean Absolute Percentage Error (MAPE) has a well-known practical limitation. What is it?",
      options: [
        "It is undefined (division by zero) when actual values are zero, and is asymmetric — underforecasts are penalised more",
        "It requires the forecast horizon to be fixed in advance, making it unsuitable for rolling forecasts",
        "MAPE double-counts errors for seasonal series because it averages across all periods equally",
        "MAPE is scale-dependent — a 10-unit error on a series with small values dominates the average"
      ],
      correctIndex: 0,
      explanation:
        "MAPE = mean |actual − forecast| / |actual|. When the actual value is zero, division by zero is undefined. Additionally, MAPE is asymmetric: a 50% underforecast (predicting 50 when actual is 100) gives MAPE = 50%, but a 50% overforecast (predicting 150 when actual is 100) also gives 50%. Symmetric MAPE (sMAPE) corrects the latter issue.",
    },
    {
      id: "ts-q5",
      question:
        "Which approach is most appropriate for forecasting 500 different retail store-product combinations simultaneously, using promotional spend as a known future covariate?",
      options: [
        "A tree-based model (e.g. LightGBM) with lag features, rolling statistics, and the covariate as an input column",
        "Apply SARIMA with external regressors (SARIMAX) to each series separately, since SARIMA always outperforms ML on seasonal retail data",
        "Average all 500 series into one aggregate series, forecast it, and allocate the forecast down proportionally",
        "Fit a separate ARIMA model to each of the 500 series, then aggregate the forecasts for reporting"
      ],
      correctIndex: 0,
      explanation:
        "Fitting 500 separate ARIMA models is expensive and ignores information shared across series. Tree-based models (LightGBM, XGBoost) with lag features and covariates handle hundreds of series efficiently in a single model, exploit cross-series patterns, and naturally incorporate external variables like promotional spend.",
    },
  ],

  exercises: [
    {
      id: "ts-ex1",
      title: "Stationarity and ARIMA Fitting",
      intro: "Test for stationarity, difference a series, and fit a simple ARIMA model.",
      parts: [
        {
          id: "ts-ex1a",
          label: "a",
          prompt:
            "Generate a random walk of 200 steps (cumulative sum of N(0,1) noise, seed=42). Run the Augmented Dickey-Fuller test. Print the p-value rounded to 4 dp and whether the series is stationary (p < 0.05).",
          starterCode:
            "import numpy as np\nfrom statsmodels.tsa.stattools import adfuller\n\nrng = np.random.default_rng(42)\nrw = np.cumsum(rng.normal(0, 1, 200))\n\nresult = adfuller(rw)\npval = round(result[1], 4)\nprint(pval)\nprint('Stationary' if pval < 0.05 else 'Non-stationary')",
          expectedStdout: "0.5621\nNon-stationary",
          hints: [
            "`adfuller(series)` returns (adf_stat, p_value, lags, nobs, critical_values, ...).",
            "A random walk is the canonical non-stationary process — the test should confirm this.",
          ],
          solution:
            "import numpy as np\nfrom statsmodels.tsa.stattools import adfuller\n\nrng = np.random.default_rng(42)\nrw = np.cumsum(rng.normal(0, 1, 200))\n\nresult = adfuller(rw)\npval = round(result[1], 4)\nprint(pval)\nprint('Stationary' if pval < 0.05 else 'Non-stationary')",
        },
        {
          id: "ts-ex1b",
          label: "b",
          prompt:
            "Difference the random walk once (y_t - y_{t-1}). Run ADF again. Print the new p-value rounded to 4 dp and the stationarity verdict.",
          starterCode:
            "import numpy as np\nfrom statsmodels.tsa.stattools import adfuller\n\nrng = np.random.default_rng(42)\nrw = np.cumsum(rng.normal(0, 1, 200))\ndiff = np.diff(rw)  # first difference\n\nresult = adfuller(diff)\npval = round(result[1], 4)\nprint(pval)\nprint('Stationary' if pval < 0.05 else 'Non-stationary')",
          expectedStdout: "0.0001\nStationary",
          hints: [
            "`np.diff(series)` computes the first difference: diff[i] = series[i+1] - series[i].",
            "The first difference of a random walk is just white noise — stationary by definition.",
          ],
          solution:
            "import numpy as np\nfrom statsmodels.tsa.stattools import adfuller\n\nrng = np.random.default_rng(42)\nrw = np.cumsum(rng.normal(0, 1, 200))\ndiff = np.diff(rw)\n\nresult = adfuller(diff)\npval = round(result[1], 4)\nprint(pval)\nprint('Stationary' if pval < 0.05 else 'Non-stationary')",
        },
        {
          id: "ts-ex1c",
          label: "c",
          prompt:
            "Fit ARIMA(1,1,0) to the original random walk using statsmodels. Print the AR coefficient (phi_1) rounded to 4 dp.",
          starterCode:
            "import numpy as np\nfrom statsmodels.tsa.arima.model import ARIMA\n\nrng = np.random.default_rng(42)\nrw = np.cumsum(rng.normal(0, 1, 200))\n\nmodel = ARIMA(rw, order=(1, 1, 0))\nfit = model.fit()\nprint(round(fit.params['ar.L1'], 4))",
          expectedStdout: "-0.0561",
          hints: [
            "`fit.params` is a Series; 'ar.L1' is the AR(1) coefficient.",
            "For a pure random walk, the AR coefficient should be near 0 — confirming no predictable structure beyond integration.",
          ],
          solution:
            "import numpy as np\nfrom statsmodels.tsa.arima.model import ARIMA\n\nrng = np.random.default_rng(42)\nrw = np.cumsum(rng.normal(0, 1, 200))\n\nmodel = ARIMA(rw, order=(1, 1, 0))\nfit = model.fit()\nprint(round(fit.params['ar.L1'], 4))",
        },
      ],
    },
    {
      id: "ts-ex2",
      title: "Lag Features for ML Forecasting",
      intro: "Build a gradient boosting forecaster using lag features on a synthetic AR series.",
      parts: [
        {
          id: "ts-ex2a",
          label: "a",
          prompt:
            "Generate an AR(2) series of 300 points with phi1=0.6, phi2=0.3, noise N(0,0.5), seed=42. Create lag features (lag 1 and lag 2) as columns in a DataFrame and print the shape of the feature matrix (after dropping NaN rows).",
          starterCode:
            "import numpy as np\nimport pandas as pd\n\nrng = np.random.default_rng(42)\ny = np.zeros(300)\ny[0] = rng.normal()\ny[1] = rng.normal()\nfor t in range(2, 300):\n    y[t] = 0.6 * y[t-1] + 0.3 * y[t-2] + rng.normal(0, 0.5)\n\ndf = pd.DataFrame({'y': y})\ndf['lag1'] = df['y'].shift(1)\ndf['lag2'] = df['y'].shift(2)\ndf = df.dropna()\nprint(df[['lag1', 'lag2']].shape)",
          expectedStdout: "(298, 2)",
          hints: [
            "`df['y'].shift(1)` creates a lag-1 column — the previous row's value.",
            "After shifting by 2, the first 2 rows will have NaN — drop them.",
          ],
          solution:
            "import numpy as np\nimport pandas as pd\n\nrng = np.random.default_rng(42)\ny = np.zeros(300)\ny[0] = rng.normal()\ny[1] = rng.normal()\nfor t in range(2, 300):\n    y[t] = 0.6 * y[t-1] + 0.3 * y[t-2] + rng.normal(0, 0.5)\n\ndf = pd.DataFrame({'y': y})\ndf['lag1'] = df['y'].shift(1)\ndf['lag2'] = df['y'].shift(2)\ndf = df.dropna()\nprint(df[['lag1', 'lag2']].shape)",
        },
      ],
    },
  ],

  cheatsheet: [
    {
      heading: "Decomposition",
      items: [
        {
          term: "Trend (T)",
          note: "Long-run direction — upward, downward, or flat",
        },
        {
          term: "Seasonality (S)",
          note: "Regular, calendar-driven pattern (weekly, monthly, yearly)",
        },
        {
          term: "Residuals (R)",
          note: "Unexplained variation after removing trend and seasonality",
        },
        {
          term: "Additive model",
          note: "y = T + S + R — use when seasonal amplitude is constant",
          formula: "y_t = T_t + S_t + R_t",
        },
      ],
    },
    {
      heading: "Stationarity",
      items: [
        {
          term: "Stationary",
          note: "Constant mean, variance, and autocorrelation structure over time",
        },
        {
          term: "ADF test",
          note: "p < 0.05 → stationary; p ≥ 0.05 → difference the series",
        },
        {
          term: "First difference",
          note: "∇yₜ = yₜ − yₜ₋₁ — removes linear trend",
          formula: "\\nabla y_t = y_t - y_{t-1}",
        },
        {
          term: "Seasonal difference",
          note: "∇ₘyₜ = yₜ − yₜ₋ₘ — removes period-m seasonality",
        },
      ],
    },
    {
      heading: "ARIMA(p, d, q)",
      items: [
        {
          term: "p — AR order",
          note: "Number of lagged values: yₜ depends on yₜ₋₁, …, yₜ₋ₚ",
        },
        {
          term: "d — Integration",
          note: "Differencing rounds: d=1 for random walk / linear trend",
        },
        {
          term: "q — MA order",
          note: "Number of lagged errors: yₜ depends on εₜ₋₁, …, εₜ₋q",
        },
        {
          term: "auto_arima",
          note: "pmdarima.auto_arima() selects (p,d,q) by minimising AIC",
        },
      ],
    },
    {
      heading: "Evaluation",
      items: [
        {
          term: "MAE",
          note: "mean |yₜ − ŷₜ| — interpretable, robust",
        },
        {
          term: "RMSE",
          note: "√mean (yₜ − ŷₜ)² — penalises large errors more",
        },
        {
          term: "Walk-forward validation",
          note: "Roll training window forward one step at a time for honest error estimates",
        },
        {
          term: "Naïve benchmark",
          note: "ŷₜ₊₁ = yₜ — always beat this before claiming model success",
        },
      ],
    },
  ],
};
