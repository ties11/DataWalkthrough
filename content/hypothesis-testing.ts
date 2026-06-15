import { Subject } from "./types";

export const hypothesisTesting: Subject = {
  slug: "hypothesis-testing",
  title: "Hypothesis Testing & Inference",
  icon: "flask",
  phase: 0,
  blurb:
    "How to tell signal from noise. p-values, confidence intervals, and the tests that decide whether an effect is real or just luck.",
  sources: [
    "Wasserman, L. — All of Statistics, Ch. 10–11",
    "James, Witten, Hastie & Tibshirani — ISLR, Ch. 3, 13",
    "Wasserstein & Lazar — The ASA Statement on p-Values (2016)",
    "Reinhart, A. — Statistics Done Wrong",
  ],

  theory: [
    {
      badge: "Intuition · Page 1",
      title: "Is the Effect Real, or Just Luck?",
      blocks: [
        {
          kind: "para",
          html: "You change a website's button from blue to green and conversions rise by 2%. Did the colour cause it, or would you have seen a 2% wobble anyway from random variation? This is the fundamental question of inference: distinguishing a <em>real effect</em> from the noise that any finite sample produces by chance.",
        },
        {
          kind: "para",
          html: "Hypothesis testing is the formal framework for answering it. It does not tell you what is true — it tells you whether your data is surprising enough, under the assumption of \"no effect,\" to justify abandoning that assumption. This indirect logic confuses many people, so it is worth getting precisely right.",
        },
        {
          kind: "callout",
          tone: "purple",
          title: "Why this matters for ML",
          html: "Every A/B test, every \"model A beats model B\" claim, and every reported improvement rests on inference. Without it, you will chase noise — deploying changes that did nothing, or trusting accuracy gains that were random. Inference is the discipline that keeps data science honest.",
        },
      ],
    },
    {
      badge: "Foundations · Page 2",
      title: "The Logic of a Hypothesis Test",
      blocks: [
        {
          kind: "para",
          html: "A hypothesis test sets up a courtroom. The defendant is the <em>null hypothesis</em> \\(H_0\\) — the assumption of no effect, no difference, nothing interesting happening. It is presumed true until the evidence is strong enough to reject it.",
        },
        {
          kind: "heading",
          text: "The two hypotheses",
        },
        {
          kind: "para",
          html: "The <em>null hypothesis</em> \\(H_0\\) states there is no effect (the button colour makes no difference). The <em>alternative hypothesis</em> \\(H_1\\) states there is one. We never \"prove\" the alternative; we either reject the null or fail to reject it — much as a court returns \"guilty\" or \"not guilty,\" never \"innocent.\"",
        },
        {
          kind: "heading",
          text: "The p-value",
        },
        {
          kind: "para",
          html: "The <em>p-value</em> is the probability of seeing data at least as extreme as yours <em>if the null hypothesis were true</em>. A small p-value means your data would be very surprising under \"no effect\" — so surprising that you reject the null. The conventional threshold is 0.05.",
        },
        {
          kind: "callout",
          tone: "red",
          title: "What a p-value is NOT",
          html: "A p-value is <em>not</em> the probability that the null hypothesis is true. It is not the probability your result was due to chance. It is not the size or importance of an effect. It is only: the probability of data this extreme, assuming no effect. Misreading p-values is the single most common error in applied statistics — even among trained researchers.",
        },
      ],
    },
    {
      badge: "Errors · Page 3",
      title: "Two Ways to Be Wrong",
      blocks: [
        {
          kind: "para",
          html: "Because we are reasoning under uncertainty, we will sometimes be wrong. There are exactly two ways, and they trade off against each other.",
        },
        {
          kind: "table",
          headers: ["", "Effect is real", "No effect"],
          rows: [
            ["We reject H₀", "✓ Correct", "Type I error (false positive)"],
            ["We keep H₀", "Type II error (false negative)", "✓ Correct"],
          ],
        },
        {
          kind: "para",
          html: "A <em>Type I error</em> is crying wolf — declaring an effect that is not there. A <em>Type II error</em> is missing a real effect. The significance threshold \\(\\alpha\\) (usually 0.05) is precisely the Type I error rate you are willing to accept: a 5% chance of a false positive.",
        },
        {
          kind: "callout",
          tone: "amber",
          title: "Statistical power",
          html: "<em>Power</em> is the probability of correctly detecting a real effect — one minus the Type II error rate. Power rises with larger sample sizes and bigger true effects. Underpowered studies (too few samples) miss real effects and, perversely, the ones that do reach significance tend to exaggerate the effect size. Sample size planning is about buying enough power.",
        },
        {
          kind: "para",
          html: "Lowering \\(\\alpha\\) to avoid false positives makes false negatives more likely, and vice versa — you cannot minimise both at once with a fixed sample. The only way to reduce both errors together is to collect more data.",
        },
      ],
    },
    {
      badge: "Tools · Page 4",
      title: "Confidence Intervals & Common Tests",
      blocks: [
        {
          kind: "para",
          html: "A p-value gives a yes/no verdict; a <em>confidence interval</em> gives a range, which is often more useful. A 95% confidence interval is a range computed so that, across many repeated samples, 95% of such intervals would contain the true value.",
        },
        {
          kind: "callout",
          tone: "teal",
          title: "Interval beats point",
          html: "\"Conversions rose 2%\" is a point estimate that hides its own uncertainty. \"Conversions rose 2%, 95% CI [0.5%, 3.5%]\" tells you the effect is probably positive but could be small. \"...95% CI [−1%, 5%]\" tells you it might be nothing at all. The interval conveys both the estimate and your confidence in it — always prefer it to a bare number.",
        },
        {
          kind: "heading",
          text: "Tests you will actually use",
        },
        {
          kind: "table",
          headers: ["Test", "Question it answers"],
          rows: [
            ["t-test", "Do two groups have different means?"],
            ["Chi-squared test", "Are two categorical variables associated?"],
            ["ANOVA", "Do three or more groups differ in mean?"],
            ["Correlation test", "Are two numeric variables related?"],
            ["A/B test", "Does version B outperform version A?"],
          ],
        },
        {
          kind: "para",
          html: "The <em>t-test</em> is the everyday workhorse — comparing whether two groups (control vs treatment) have genuinely different averages. Most A/B tests are t-tests or their proportion-based cousins under the hood.",
        },
      ],
    },
    {
      badge: "Pitfalls · Page 5",
      title: "How Inference Goes Wrong",
      blocks: [
        {
          kind: "para",
          html: "Hypothesis testing is powerful but easy to abuse. The most damaging errors in data science are not in the models but in the inference — and they are common precisely because the tools are easy to run and easy to misread.",
        },
        {
          kind: "callout",
          tone: "red",
          title: "p-hacking and multiple comparisons",
          html: "Test 20 hypotheses at \\(\\alpha = 0.05\\) and, by chance alone, about one will appear \"significant\" even if nothing is real. <em>p-hacking</em> — trying many analyses and reporting only the ones that hit 0.05 — manufactures false discoveries. The fix is correction (Bonferroni, false discovery rate) and, above all, deciding your hypothesis <em>before</em> looking at the data.",
        },
        {
          kind: "table",
          headers: ["Pitfall", "Why it misleads"],
          rows: [
            ["Significance ≠ importance", "A tiny, useless effect can be significant with enough data"],
            ["Peeking / early stopping", "Checking results repeatedly inflates false positives"],
            ["Correlation ≠ causation", "A test of association says nothing about cause"],
            ["Ignoring effect size", "p-values alone hide whether an effect matters practically"],
          ],
        },
        {
          kind: "callout",
          tone: "amber",
          title: "What to carry forward",
          html: "The null hypothesis is \"no effect\"; a small p-value means data this extreme would be surprising if it were true — nothing more. Watch both error types and the power that trades between them. Prefer confidence intervals to bare p-values, and effect sizes to significance. Decide your test before seeing the data, and correct for multiple comparisons. Significance is not importance, and association is not causation.",
        },
      ],
    },
  ],

  quiz: [
    {
      id: "ht-q1",
      question: "What does a p-value of 0.03 actually mean?",
      options: [
        "There is a 3% chance the null hypothesis is true",
        "If the null hypothesis were true, there is a 3% chance of seeing data at least this extreme",
        "The effect is 3% in size",
        "There is a 97% chance the result is important",
      ],
      correctIndex: 1,
      explanation:
        "A p-value is the probability of data at least this extreme assuming the null is true. It is NOT the probability the null is true, nor the effect size, nor the importance of the result.",
    },
    {
      id: "ht-q2",
      question: "What is a Type I error?",
      options: [
        "Missing a real effect (false negative)",
        "Declaring an effect that is not actually there (false positive)",
        "Using the wrong test",
        "Collecting too much data",
      ],
      correctIndex: 1,
      explanation:
        "A Type I error is a false positive — rejecting the null when it is actually true. The significance level α (e.g. 0.05) is exactly the Type I error rate you accept. A Type II error is the false negative.",
    },
    {
      id: "ht-q3",
      question: "Why is a 95% confidence interval often more useful than a bare p-value?",
      options: [
        "It is always narrower",
        "It conveys both the estimated effect and the uncertainty around it as a range",
        "It removes the need for a sample",
        "It proves causation",
      ],
      correctIndex: 1,
      explanation:
        "A confidence interval gives a plausible range for the true value, showing both the estimate and how uncertain it is. '[0.5%, 3.5%]' vs '[−1%, 5%]' tell very different stories that a single p-value hides.",
    },
    {
      id: "ht-q4",
      question:
        "You test 20 independent hypotheses at α = 0.05 with no real effects. Roughly how many will appear 'significant'?",
      options: [
        "Zero, because nothing is real",
        "About one, purely by chance — the multiple comparisons problem",
        "All twenty",
        "Exactly ten",
      ],
      correctIndex: 1,
      explanation:
        "At α = 0.05, each test has a 5% false-positive chance. Across 20 tests, about one will hit significance by luck alone. This is why p-hacking manufactures false discoveries and why corrections exist.",
    },
    {
      id: "ht-q5",
      question: "A result is highly statistically significant (p < 0.001). What can you conclude?",
      options: [
        "The effect is large and important",
        "The data is very unlikely under the null, but the effect could still be tiny and unimportant",
        "The null hypothesis is definitely false",
        "The result will replicate for certain",
      ],
      correctIndex: 1,
      explanation:
        "Significance only says the data is surprising under the null. With a large sample, even a trivially small effect can be highly significant. Always check the effect size — significance is not importance.",
    },
  ],

  exercises: [
    {
      id: "ht-ex1",
      title: "Run a t-test and Compute a Z-score",
      intro:
        "Use scipy to run a hypothesis test, then compute a test statistic by hand — step by step.",
      parts: [
        {
          id: "ht-ex1-a",
          label: "a",
          prompt:
            "Given sample = [5.1,4.9,5.2,5.0,4.8,5.3,5.1,4.95], run a one-sample t-test against a population mean of 5.0 using scipy.stats.ttest_1samp. Print whether the p-value is greater than 0.05 (i.e. print the boolean p > 0.05). (Expected: True)",
          starterCode:
            "from scipy import stats\nsample = [5.1,4.9,5.2,5.0,4.8,5.3,5.1,4.95]\n\n# t, p = stats.ttest_1samp(sample, 5.0)\n# print(p > 0.05)\n",
          expectedStdout: "True",
          hints: [
            "stats.ttest_1samp(sample, 5.0) returns the t-statistic and p-value.",
            "Unpack: t, p = stats.ttest_1samp(...)",
            "print(p > 0.05) — the sample mean is close to 5.0, so we fail to reject the null.",
          ],
          solution:
            "from scipy import stats\nsample = [5.1,4.9,5.2,5.0,4.8,5.3,5.1,4.95]\nt, p = stats.ttest_1samp(sample, 5.0)\nprint(p > 0.05)",
        },
        {
          id: "ht-ex1-b",
          label: "b",
          prompt:
            "Compute a z-score by hand: sample mean 5.2, population mean 5.0, population std 0.4, sample size n = 16. The formula is (mean - pop_mean) / (std / sqrt(n)). Print it rounded to 1 decimal. (Expected: 2.0)",
          starterCode:
            "import numpy as np\nmean = 5.2\npop_mean = 5.0\nstd = 0.4\nn = 16\n\n# z = (mean - pop_mean) / (std / sqrt(n)); print round(z, 1)\n",
          expectedStdout: "2.0",
          hints: [
            "The standard error is std / np.sqrt(n).",
            "z = (mean - pop_mean) / (std / np.sqrt(n))",
            "print(round(z, 1))",
          ],
          solution:
            "import numpy as np\nmean = 5.2\npop_mean = 5.0\nstd = 0.4\nn = 16\nz = (mean - pop_mean) / (std / np.sqrt(n))\nprint(round(z, 1))",
        },
      ],
    },
  ],

  cheatsheet: [
    {
      heading: "The Framework",
      items: [
        { term: "Null hypothesis H₀", note: "The assumption of no effect; presumed true." },
        { term: "Alternative H₁", note: "There is an effect. We reject H₀ or fail to — never 'prove' H₁." },
        { term: "p-value", note: "P(data this extreme | H₀ true). NOT P(H₀ true)." },
        { term: "α (significance)", note: "Threshold for rejecting H₀, usually 0.05." },
      ],
    },
    {
      heading: "Errors & Power",
      items: [
        { term: "Type I error", note: "False positive — claim an effect that isn't real. Rate = α." },
        { term: "Type II error", note: "False negative — miss a real effect." },
        { term: "Power", note: "P(detect a real effect) = 1 − Type II rate. Rises with sample size." },
        { term: "Trade-off", note: "Lowering α raises Type II; more data reduces both." },
      ],
    },
    {
      heading: "Tools",
      items: [
        { term: "Confidence interval", note: "Range that would contain the true value 95% of the time." },
        { term: "t-test", note: "Do two group means differ? The everyday workhorse." },
        { term: "Chi-squared", note: "Are two categorical variables associated?" },
        { term: "ANOVA", note: "Do 3+ groups differ in mean?" },
        { term: "z-score", note: "Standardised distance from the mean.", formula: "z=\\tfrac{\\bar{x}-\\mu}{\\sigma/\\sqrt{n}}" },
      ],
    },
    {
      heading: "Pitfalls",
      items: [
        { term: "Significance ≠ importance", note: "Big samples make trivial effects significant." },
        { term: "p-hacking", note: "Testing many things, reporting only hits, fabricates discoveries." },
        { term: "Multiple comparisons", note: "20 tests at 0.05 → ~1 false positive. Correct for it." },
        { term: "Correlation ≠ causation", note: "Association tests say nothing about cause." },
      ],
    },
  ],
};
