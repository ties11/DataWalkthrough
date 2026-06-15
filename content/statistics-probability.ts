import { Subject } from "./types";

export const statisticsProbability: Subject = {
  slug: "statistics-probability",
  title: "Statistics & Probability",
  icon: "statistics",
  phase: 0,
  blurb:
    "The language of uncertainty. Distributions, expectation, variance, and Bayes' theorem — the bedrock every model and every inference is built on.",
  sources: [
    "Wasserman, L. — All of Statistics, Ch. 1–3",
    "Blitzstein & Hwang — Introduction to Probability, 2nd ed.",
    "James, Witten, Hastie & Tibshirani — ISLR, Ch. 2",
    "Downey, A. — Think Stats, 2nd ed.",
  ],

  theory: [
    {
      badge: "Intuition · Page 1",
      title: "Reasoning Under Uncertainty",
      blocks: [
        {
          kind: "para",
          html: "Almost nothing in the real world is certain. Will this customer churn? Is this email spam? What will sales be next quarter? Statistics and probability are the mathematics of answering such questions <em>when you cannot know for sure</em> — of quantifying what you believe, how confident you are, and how new evidence should change your mind.",
        },
        {
          kind: "para",
          html: "Probability runs the machine forwards: given a known process (a fair die), what outcomes should we expect? Statistics runs it backwards: given observed outcomes (these die rolls), what can we infer about the process? Machine learning lives almost entirely in this second, inverse direction — learning the hidden process from the data it produced.",
        },
        {
          kind: "callout",
          tone: "purple",
          title: "Why this comes first",
          html: "Every model you will meet outputs uncertain predictions, is trained by minimising an expected error, and is evaluated by comparing distributions. Loss functions are expectations. Regularisation is a prior. Cross-validation estimates a sampling distribution. Without this foundation, later methods are recipes you follow blindly; with it, they are obvious consequences.",
        },
      ],
    },
    {
      badge: "Foundations · Page 2",
      title: "Describing Data: Centre & Spread",
      blocks: [
        {
          kind: "para",
          html: "Before modelling anything, we summarise. Two questions dominate: where is the data centred, and how spread out is it?",
        },
        {
          kind: "heading",
          text: "Measures of centre",
        },
        {
          kind: "para",
          html: "The <em>mean</em> is the arithmetic average — the balance point of the data. The <em>median</em> is the middle value when sorted, robust to outliers in a way the mean is not. The <em>mode</em> is the most frequent value. A single billionaire walking into a room sends the mean income soaring while the median barely moves — which is exactly why median income is the honest statistic for describing a population.",
        },
        {
          kind: "equation",
          label: "Sample mean",
          tex: "\\bar{x} = \\frac{1}{n}\\sum_{i=1}^{n} x_i",
        },
        {
          kind: "heading",
          text: "Measures of spread",
        },
        {
          kind: "para",
          html: "The <em>variance</em> is the average squared distance from the mean; the <em>standard deviation</em> is its square root, returning the spread to the original units. Squaring (rather than taking absolute values) is the same choice least squares makes — it penalises large deviations and yields clean mathematics.",
        },
        {
          kind: "equation",
          label: "Variance and standard deviation",
          tex: "\\sigma^2 = \\frac{1}{n}\\sum_{i=1}^{n}(x_i - \\bar{x})^2, \\quad \\sigma = \\sqrt{\\sigma^2}",
        },
        {
          kind: "callout",
          tone: "amber",
          title: "n versus n−1",
          html: "When estimating the variance of a population from a <em>sample</em>, we divide by \\(n-1\\), not \\(n\\). This is Bessel's correction: using the sample mean (rather than the true mean) slightly underestimates spread, and dividing by the smaller \\(n-1\\) compensates. NumPy defaults to \\(n\\); pandas defaults to \\(n-1\\) — a classic source of off-by-a-little bugs.",
        },
      ],
    },
    {
      badge: "Foundations · Page 3",
      title: "Probability Distributions",
      blocks: [
        {
          kind: "para",
          html: "A <em>distribution</em> describes how probability is spread across possible outcomes. A handful of named distributions appear again and again because they model recurring real-world situations.",
        },
        {
          kind: "table",
          headers: ["Distribution", "Models", "Example"],
          rows: [
            ["Bernoulli", "A single yes/no trial", "One coin flip; did the user click?"],
            ["Binomial", "Number of successes in n trials", "Clicks out of 100 impressions"],
            ["Normal (Gaussian)", "Sums of many small effects", "Heights, measurement error, test scores"],
            ["Poisson", "Counts of rare events in an interval", "Emails per hour; defects per batch"],
            ["Uniform", "All outcomes equally likely", "A fair die; random initialisation"],
          ],
        },
        {
          kind: "heading",
          text: "The normal distribution and the CLT",
        },
        {
          kind: "para",
          html: "The normal distribution — the bell curve — is central because of the <em>Central Limit Theorem</em>: the sum (or average) of many independent random variables tends toward a normal distribution, regardless of the original distribution's shape. This is why measurement errors, sample means, and countless natural quantities are approximately normal, and why it underpins most statistical inference.",
        },
        {
          kind: "equation",
          label: "Normal probability density",
          tex: "f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}}\\,e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}",
        },
        {
          kind: "callout",
          tone: "teal",
          title: "The 68–95–99.7 rule",
          html: "For a normal distribution, about 68% of values fall within one standard deviation of the mean, 95% within two, and 99.7% within three. This rule of thumb lets you sanity-check data and spot outliers at a glance.",
        },
      ],
    },
    {
      badge: "Inference · Page 4",
      title: "Conditional Probability & Bayes",
      blocks: [
        {
          kind: "para",
          html: "Most real questions are <em>conditional</em>: not \"what is the probability of disease?\" but \"what is the probability of disease <em>given</em> a positive test?\" Conditional probability, written \\(P(A \\mid B)\\), is the probability of A once we know B has occurred.",
        },
        {
          kind: "equation",
          label: "Conditional probability",
          tex: "P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}",
        },
        {
          kind: "heading",
          text: "Bayes' theorem",
        },
        {
          kind: "para",
          html: "Bayes' theorem reverses a conditional probability — turning \\(P(\\text{test} \\mid \\text{disease})\\), which a lab measures, into \\(P(\\text{disease} \\mid \\text{test})\\), which a patient actually cares about.",
        },
        {
          kind: "equation",
          label: "Bayes' theorem",
          tex: "P(A \\mid B) = \\frac{P(B \\mid A)\\,P(A)}{P(B)}",
        },
        {
          kind: "callout",
          tone: "red",
          title: "The base-rate trap",
          html: "A test that is 99% accurate for a disease affecting 1 in 100 people still produces mostly false positives. Because the disease is rare, the few true positives are swamped by false positives drawn from the huge healthy majority. Bayes' theorem makes this precise — and ignoring the base rate is one of the most common and costly errors in reasoning, from medicine to machine learning.",
        },
        {
          kind: "para",
          html: "Bayesian thinking — updating a <em>prior</em> belief with evidence to form a <em>posterior</em> — is not just a formula but an entire school of statistics, and the foundation of Naive Bayes classifiers, Bayesian networks, and probabilistic machine learning.",
        },
      ],
    },
    {
      badge: "Application · Page 5",
      title: "From Probability to Models",
      blocks: [
        {
          kind: "para",
          html: "These foundations are not abstract — they are the direct ancestors of machine learning machinery. Recognising the connection turns later models from mysteries into applications of what you already know.",
        },
        {
          kind: "table",
          headers: ["Statistical concept", "Reappears in ML as"],
          rows: [
            ["Expectation / mean", "The expected loss a model minimises"],
            ["Variance", "Model instability; the bias–variance tradeoff"],
            ["Normal distribution", "The assumption behind least-squares regression"],
            ["Bayes' theorem", "Naive Bayes; Bayesian inference; priors as regularisation"],
            ["Sampling distribution", "Why we use train/test splits and cross-validation"],
            ["Maximum likelihood", "How most models are actually fit"],
          ],
        },
        {
          kind: "callout",
          tone: "teal",
          title: "Maximum likelihood, briefly",
          html: "A unifying idea worth previewing: <em>maximum likelihood estimation</em> chooses the model parameters that make the observed data most probable. Least-squares regression, logistic regression, and many others are all maximum likelihood under different distributional assumptions. Much of machine learning is one principle wearing different clothes.",
        },
        {
          kind: "callout",
          tone: "amber",
          title: "What to carry forward",
          html: "You do not need to memorise every distribution. Carry these: data has centre and spread; the normal distribution is everywhere because of the CLT; probability becomes conditional the moment you have evidence; and Bayes' theorem is how evidence updates belief. Everything later builds on these four ideas.",
        },
      ],
    },
  ],

  quiz: [
    {
      id: "sp-q1",
      question:
        "A dataset of incomes has one billionaire among ordinary earners. Which measure of centre best describes a typical income?",
      options: [
        "The interquartile range — it captures the middle 50% of earners most precisely",
        "The mean — using all values is always more accurate than ignoring any of them",
        "The median, because it is robust to the extreme outlier",
        "The trimmed mean — removing the top and bottom 5% of values before averaging"
      ],
      correctIndex: 2,
      explanation:
        "The mean is dragged upward by the billionaire; the median (the middle value) barely moves and represents a typical income honestly. This is why median income is the standard reported statistic.",
    },
    {
      id: "sp-q2",
      question: "Why is the normal distribution so ubiquitous in nature and statistics?",
      options: [
        "It is the maximum-entropy distribution — nature always chooses the most uncertain distribution consistent with a given mean and variance",
        "It is the only distribution whose mean, median, and mode coincide, making it mathematically unique",
        "Because of the Central Limit Theorem: sums of many independent effects tend toward normal",
        "Most real-world measurements are bounded between 0 and 1, which forces them into a bell curve shape"
      ],
      correctIndex: 2,
      explanation:
        "The CLT says averages and sums of many independent random variables converge to a normal distribution regardless of the original shape. This is why measurement errors and sample means are approximately normal.",
    },
    {
      id: "sp-q3",
      question:
        "A disease affects 1% of people. A test is 99% accurate. You test positive. Roughly how worried should you be?",
      options: [
        "Very worried — the test is 99% accurate, so the chance of a false positive is only 1%",
        "Certain to have it — a 99% accurate test on a positive result means 99% posterior probability",
        "Mildly worried — since the disease is rare, positive tests are always false positives",
        "The probability is actually moderate, because most positives come from the healthy 99%"
      ],
      correctIndex: 3,
      explanation:
        "This is the base-rate trap. Because the disease is rare, false positives from the large healthy majority swamp the true positives. Bayes' theorem shows the actual probability is far below 99%.",
    },
    {
      id: "sp-q4",
      question:
        "What does standard deviation measure that variance does not convey as directly?",
      options: [
        "The minimum distance between any two distinct values in the dataset",
        "The asymmetry of the distribution — how far the mean lies from the median",
        "The probability of observing a value more than two units away from the mean",
        "Spread expressed in the original units of the data"
      ],
      correctIndex: 3,
      explanation:
        "Variance is in squared units (e.g. dollars²), which is hard to interpret. Taking the square root gives the standard deviation, returning spread to the original units (dollars) — directly comparable to the mean.",
    },
    {
      id: "sp-q5",
      question:
        "In machine learning, what statistical idea does a model's loss function most directly represent?",
      options: [
        "The likelihood of the training labels under a uniform prior, which is maximised rather than minimised",
        "An expectation (expected error) that the model minimises",
        "The variance of the residuals, which measures how spread out the model's mistakes are",
        "The entropy of the target distribution, which bounds the minimum achievable loss",
      ],
      correctIndex: 1,
      explanation:
        "A loss function is an expected error over the data — an expectation. Training minimises this expectation. Recognising loss as an expectation connects optimisation directly to probability theory.",
    },
  ],

  exercises: [
    {
      id: "sp-ex1",
      title: "Compute Statistics and Apply Bayes",
      intro:
        "Work with summary statistics and Bayes' theorem using NumPy, step by step.",
      parts: [
        {
          id: "sp-ex1-a",
          label: "a",
          prompt:
            "Given data = [2, 4, 4, 4, 5, 5, 7, 9], compute and print its mean using numpy. (Expected: 5.0)",
          starterCode:
            "import numpy as np\ndata = [2, 4, 4, 4, 5, 5, 7, 9]\n\n# YOUR CODE HERE\n",
          expectedStdout: "5.0",
          hints: ["np.mean(data) returns the average.", "print(np.mean(data))"],
          solution:
            "import numpy as np\ndata = [2, 4, 4, 4, 5, 5, 7, 9]\nprint(np.mean(data))",
        },
        {
          id: "sp-ex1-b",
          label: "b",
          prompt:
            "Print the standard deviation of the same data, rounded to 2 decimals. (Expected: 2.0)",
          starterCode:
            "# YOUR CODE HERE\n",
          expectedStdout: "2.0",
          hints: [
            "np.std(data) computes the standard deviation.",
            "print(round(float(np.std(data)), 2))",
          ],
          solution: "print(round(float(np.std(data)), 2))",
        },
        {
          id: "sp-ex1-c",
          label: "c",
          prompt:
            "Apply Bayes' theorem: disease prevalence 1% (0.01), test sensitivity 99% (0.99), specificity 95% (0.95). Compute P(disease | positive test) and print it rounded to 3 decimals. (Expected: 0.167)",
          starterCode:
            "p_disease = 0.01\nsensitivity = 0.99   # P(positive | disease)\nspecificity = 0.95   # P(negative | no disease)\n\n# YOUR CODE HERE\n",
          expectedStdout: "0.167",
          hints: [
            "P(positive) = sensitivity*p_disease + (1-specificity)*(1-p_disease)",
            "posterior = sensitivity*p_disease / p_positive",
            "print(round(posterior, 3))",
          ],
          solution:
            "p_disease = 0.01\nsensitivity = 0.99\nspecificity = 0.95\np_positive = sensitivity*p_disease + (1-specificity)*(1-p_disease)\nposterior = sensitivity*p_disease / p_positive\nprint(round(posterior, 3))",
        },
      ],
    },
  ],

  cheatsheet: [
    {
      heading: "Centre & Spread",
      items: [
        { term: "Mean", note: "Arithmetic average; the balance point. Sensitive to outliers.", formula: "\\bar{x} = \\tfrac{1}{n}\\sum x_i" },
        { term: "Median", note: "Middle value when sorted. Robust to outliers." },
        { term: "Variance", note: "Average squared distance from the mean.", formula: "\\sigma^2 = \\tfrac{1}{n}\\sum (x_i-\\bar{x})^2" },
        { term: "Std deviation", note: "Square root of variance; spread in original units." },
        { term: "n vs n−1", note: "Sample variance divides by n−1 (Bessel). NumPy uses n, pandas uses n−1." },
      ],
    },
    {
      heading: "Distributions",
      items: [
        { term: "Bernoulli / Binomial", note: "One trial / count of successes in n trials." },
        { term: "Normal", note: "Bell curve; sums of many small effects.", formula: "f(x)=\\tfrac{1}{\\sigma\\sqrt{2\\pi}}e^{-(x-\\mu)^2/2\\sigma^2}" },
        { term: "Poisson", note: "Counts of rare events per interval." },
        { term: "CLT", note: "Averages of many independent variables → normal." },
        { term: "68–95–99.7", note: "Fraction of normal data within 1, 2, 3 std devs." },
      ],
    },
    {
      heading: "Conditional & Bayes",
      items: [
        { term: "Conditional", note: "Probability of A given B is known.", formula: "P(A\\mid B)=\\tfrac{P(A\\cap B)}{P(B)}" },
        { term: "Bayes' theorem", note: "Reverses a conditional; updates belief with evidence.", formula: "P(A\\mid B)=\\tfrac{P(B\\mid A)P(A)}{P(B)}" },
        { term: "Prior / Posterior", note: "Belief before / after seeing evidence." },
        { term: "Base-rate trap", note: "Rare conditions make even accurate tests mostly false positives." },
      ],
    },
    {
      heading: "Bridge to ML",
      items: [
        { term: "Loss = expectation", note: "Models minimise an expected error." },
        { term: "Variance", note: "Model instability; the bias–variance tradeoff." },
        { term: "Maximum likelihood", note: "Choose parameters that make data most probable; fits most models." },
        { term: "Sampling distribution", note: "Why train/test splits and cross-validation work." },
      ],
    },
  ],
};