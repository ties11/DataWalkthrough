import { Subject } from "./types";

export const dataWrangling: Subject = {
  slug: "data-wrangling",
  title: "Data Wrangling",
  icon: "funnel",
  phase: 0,
  blurb:
    "The unglamorous 80% of real work. Loading, cleaning, transforming, and reshaping messy data into the tidy tables every model demands.",
  sources: [
    "McKinney, W. — Python for Data Analysis, 3rd ed.",
    "Wickham, H. — Tidy Data (Journal of Statistical Software, 2014)",
    "Géron, A. — Hands-On Machine Learning, Ch. 2",
    "VanderPlas, J. — Python Data Science Handbook, Ch. 3",
  ],

  theory: [
    {
      badge: "Intuition · Page 1",
      title: "The Work Nobody Mentions",
      blocks: [
        {
          kind: "para",
          html: "There is a widely repeated figure in data science: practitioners spend roughly 80% of their time finding, cleaning, and preparing data, and only 20% building models. Courses invert this ratio, lavishing attention on algorithms and glossing over the messy reality. Yet the cleaning is where projects succeed or fail.",
        },
        {
          kind: "para",
          html: "Real data is filthy. Columns have missing values, dates in five formats, prices stored as text with currency symbols, duplicate rows, typos in categories, and outliers from sensor glitches. A model fed this directly will either crash or — worse — quietly learn nonsense. <em>Data wrangling</em> is the craft of turning raw mess into the clean, structured input that models require.",
        },
        {
          kind: "callout",
          tone: "purple",
          title: "Garbage in, garbage out",
          html: "The most sophisticated model cannot rescue bad data. A modest model on clean, well-prepared data beats a powerful model on dirty data almost every time. This is why the field increasingly talks about <em>data-centric</em> rather than model-centric machine learning — improving the data often yields bigger gains than improving the algorithm.",
        },
      ],
    },
    {
      badge: "Foundations · Page 2",
      title: "Tidy Data",
      blocks: [
        {
          kind: "para",
          html: "Before cleaning, it helps to know what clean looks like. Hadley Wickham's concept of <em>tidy data</em> gives a precise target: a standard shape that makes data easy to model and visualise.",
        },
        {
          kind: "heading",
          text: "The three rules of tidy data",
        },
        {
          kind: "para",
          html: "In a tidy dataset: each <em>variable</em> forms a column, each <em>observation</em> forms a row, and each type of <em>observational unit</em> forms a table. It sounds obvious, but real spreadsheets routinely violate it — cramming multiple variables into one column, spreading one variable across many columns, or mixing units in a single table.",
        },
        {
          kind: "callout",
          tone: "teal",
          title: "Long vs wide format",
          html: "The same data can be <em>wide</em> (one row per subject, many columns for different measurements) or <em>long</em> (one row per measurement, with columns naming the variable and its value). Tidy data is usually long. Reshaping between the two — <code>melt</code> to go long, <code>pivot</code> to go wide — is a constant wrangling task, and pandas provides direct functions for both.",
        },
        {
          kind: "para",
          html: "The payoff of tidiness is that every downstream tool — scikit-learn, plotting libraries, statistical tests — expects this shape. Get the data tidy once, and everything afterwards is smoother.",
        },
      ],
    },
    {
      badge: "Core Tasks · Page 3",
      title: "Missing Data",
      blocks: [
        {
          kind: "para",
          html: "Almost every real dataset has gaps — a survey respondent skipped a question, a sensor dropped a reading, a field was never recorded. How you handle missing values can quietly determine whether your model is trustworthy.",
        },
        {
          kind: "heading",
          text: "The three strategies",
        },
        {
          kind: "table",
          headers: ["Strategy", "What it does", "When to use it"],
          rows: [
            ["Drop", "Remove rows or columns with missing values", "When gaps are few and random"],
            ["Impute", "Fill gaps with mean, median, or a model's guess", "When you cannot afford to lose data"],
            ["Flag", "Add an indicator column marking what was missing", "When missingness itself is informative"],
          ],
        },
        {
          kind: "callout",
          tone: "amber",
          title: "Missingness can be a signal",
          html: "Why a value is missing often matters. If high earners skip the income question more often, dropping those rows biases your data. Sometimes the fact that a value is missing predicts the outcome — a blank \"date of last purchase\" might mean the customer never purchased. Before deleting or filling, ask <em>why</em> the data is missing.",
        },
        {
          kind: "para",
          html: "The safest default for numeric data is often <em>median imputation</em> (robust to outliers), paired with a <em>missingness flag</em> so the model can still use the information that a value was absent.",
        },
      ],
    },
    {
      badge: "Core Tasks · Page 4",
      title: "Cleaning, Transforming & Aggregating",
      blocks: [
        {
          kind: "para",
          html: "Beyond missing values, wrangling is a toolkit of recurring operations. The pandas library (in Python) and dplyr (in R) provide a vocabulary for them.",
        },
        {
          kind: "heading",
          text: "The essential operations",
        },
        {
          kind: "table",
          headers: ["Operation", "Purpose"],
          rows: [
            ["Filter", "Keep rows meeting a condition"],
            ["Select", "Keep or drop columns"],
            ["Mutate / assign", "Create new columns from existing ones"],
            ["Group by + aggregate", "Summarise within categories (mean per group, etc.)"],
            ["Join / merge", "Combine tables on a shared key"],
            ["Sort", "Order rows by one or more columns"],
          ],
        },
        {
          kind: "heading",
          text: "Type and outlier issues",
        },
        {
          kind: "para",
          html: "Data often arrives with the wrong types — numbers stored as text, dates as strings — which silently break calculations. Converting types correctly is a first step. <em>Outliers</em> need judgement: a value of 999 for age is clearly an error to remove, but an unusually high transaction might be genuine and important. Cleaning is never purely mechanical; it requires understanding what the data means.",
        },
        {
          kind: "callout",
          tone: "teal",
          title: "Group-by is the workhorse",
          html: "The <em>split–apply–combine</em> pattern — group rows by a category, apply a calculation to each group, combine the results — answers a huge share of analytical questions. \"Average revenue per region,\" \"churn rate per plan,\" \"max temperature per month\" are all one group-by away. It is among the most-used operations in all of data work.",
        },
      ],
    },
    {
      badge: "Application · Page 5",
      title: "From Clean Data to Features",
      blocks: [
        {
          kind: "para",
          html: "Wrangling does not end at clean data — it flows directly into <em>feature engineering</em>, the craft of shaping inputs that help a model learn. The line between the two is blurry, and both live in the same pandas/dplyr workflow.",
        },
        {
          kind: "table",
          headers: ["Preparation step", "Why models need it"],
          rows: [
            ["Encoding categories", "Models need numbers, not text labels"],
            ["Scaling / normalising", "Many models are sensitive to feature magnitude"],
            ["Handling dates", "Extract day, month, weekday as usable features"],
            ["Binning", "Group continuous values into meaningful ranges"],
            ["Deduplication", "Duplicate rows distort training and metrics"],
          ],
        },
        {
          kind: "callout",
          tone: "red",
          title: "The leakage trap",
          html: "A subtle, serious danger: computing cleaning statistics (like the mean for imputation, or the scale for normalisation) on the <em>whole</em> dataset before splitting into train and test sets. This leaks information from the test set into training, inflating your accuracy and lying to you about real-world performance. Always fit cleaning transforms on the training data only, then apply them to the test data.",
        },
        {
          kind: "callout",
          tone: "amber",
          title: "What to carry forward",
          html: "Most of the work is cleaning, and clean data beats clever models. Aim for tidy data: one variable per column, one observation per row. Handle missing values deliberately, asking why they are missing. Master group-by and joins. And never let test-set information leak into your cleaning.",
        },
      ],
    },
  ],

  quiz: [
    {
      id: "dw-q1",
      question: "Why is data wrangling so emphasised in real-world data science?",
      options: [
        "Regulators require documented cleaning steps before any ML model can be deployed",
        "It requires the most statistical expertise, making it the highest-leverage skill to develop",
        "Automated feature engineering tools cannot handle raw data, so wrangling must always be manual",
        "Practitioners spend roughly 80% of their time on it, and clean data beats clever models"
      ],
      correctIndex: 3,
      explanation:
        "Cleaning and preparing data consumes most of a practitioner's time, and the quality of the data usually matters more than the sophistication of the model — garbage in, garbage out.",
    },
    {
      id: "dw-q2",
      question: "Which describes tidy data?",
      options: [
        "Each variable a column, each observation a row, each unit type a table",
        "Data stored in wide format with one row per subject and one column per time point",
        "Data that has been normalised to zero mean and unit variance across all features",
        "Data where all missing values have been imputed and all outliers have been removed"
      ],
      correctIndex: 0,
      explanation:
        "Wickham's tidy data has one variable per column, one observation per row, and one observational unit type per table. This standard shape is what downstream tools expect.",
    },
    {
      id: "dw-q3",
      question: "Before dropping rows with missing income, what should you consider?",
      options: [
        "Whether the missing values follow a Gaussian distribution, which determines the best imputation method",
        "Whether the remaining rows after dropping exceed the minimum sample size for the chosen model",
        "Whether the median imputation strategy is supported by the pandas version in use",
        "Why the data is missing; if high earners skip the question, dropping biases the data"
      ],
      correctIndex: 3,
      explanation:
        "Missingness is often informative. If certain groups are more likely to have missing values, dropping those rows biases your dataset. Ask why data is missing before deleting or imputing.",
    },
    {
      id: "dw-q4",
      question: "What does the split–apply–combine (group-by) pattern accomplish?",
      options: [
        "It decomposes a nested JSON column into separate flat columns for each key",
        "It merges two DataFrames by finding rows with matching keys in a shared column",
        "It partitions a DataFrame into train, validation, and test sets for cross-validated modelling",
        "It groups rows by category, applies a calculation per group, and combines the results"
      ],
      correctIndex: 3,
      explanation:
        "Group-by answers questions like 'average revenue per region' by splitting data into groups, computing a summary for each, and recombining. It is one of the most-used operations in data work.",
    },
    {
      id: "dw-q5",
      question:
        "Why must you compute imputation/scaling statistics on the training set only, not the whole dataset?",
      options: [
        "The test set must remain unscaled so the model can generate predictions on the original feature scale",
        "Using the whole dataset leaks test-set information into training, inflating measured accuracy",
        "Imputation statistics computed on training data are more accurate than those from the full dataset",
        "Computing statistics over all data causes numerical overflow for large datasets in pandas"
      ],
      correctIndex: 1,
      explanation:
        "Fitting cleaning transforms on all data before splitting leaks test information into training (data leakage), giving falsely high accuracy. Always fit on train, then apply to test.",
    },
  ],

  exercises: [
    {
      id: "dw-ex1",
      title: "Clean and Aggregate with pandas",
      intro:
        "Handle missing values and summarise grouped data using pandas, step by step.",
      parts: [
        {
          id: "dw-ex1-a",
          label: "a",
          prompt:
            "Create a DataFrame df = pd.DataFrame({'a':[1,2,None,4],'b':[10,None,30,40]}). Print the total number of missing values across the whole frame as an integer. (Expected: 2)",
          starterCode:
            "import pandas as pd\ndf = pd.DataFrame({'a':[1,2,None,4],'b':[10,None,30,40]})\n\n# YOUR CODE HERE\n",
          expectedStdout: "2",
          hints: [
            "df.isna() marks missing values as True.",
            ".sum().sum() totals them across all columns.",
            "print(int(df.isna().sum().sum()))",
          ],
          solution:
            "import pandas as pd\ndf = pd.DataFrame({'a':[1,2,None,4],'b':[10,None,30,40]})\nprint(int(df.isna().sum().sum()))",
        },
        {
          id: "dw-ex1-b",
          label: "b",
          prompt:
            "Fill all missing values with 0, then print the total sum of every value in the filled frame, rounded to 1 decimal. (Expected: 87.0)",
          starterCode:
            "# YOUR CODE HERE\n",
          expectedStdout: "87.0",
          hints: [
            "df.fillna(0) replaces missing values with 0.",
            "filled.values.sum() totals every cell.",
            "print(round(float(filled.values.sum()), 1))",
          ],
          solution:
            "filled = df.fillna(0)\nprint(round(float(filled.values.sum()), 1))",
        },
        {
          id: "dw-ex1-c",
          label: "c",
          prompt:
            "Given g = pd.DataFrame({'g':['x','x','y'],'v':[1,3,10]}), group by 'g', take the mean of 'v', and print the mean for group 'y' rounded to 1 decimal. (Expected: 10.0)",
          starterCode:
            "g = pd.DataFrame({'g':['x','x','y'],'v':[1,3,10]})\n\n# YOUR CODE HERE\n",
          expectedStdout: "10.0",
          hints: [
            "g.groupby('g')['v'].mean() gives the mean of v per group.",
            "Index the result with ['y'] for group y.",
            "print(round(float(grouped['y']), 1))",
          ],
          solution:
            "g = pd.DataFrame({'g':['x','x','y'],'v':[1,3,10]})\ngrouped = g.groupby('g')['v'].mean()\nprint(round(float(grouped['y']), 1))",
        },
      ],
    },
  ],

  cheatsheet: [
    {
      heading: "Mindset",
      items: [
        { term: "80/20 rule", note: "Most time goes to finding and cleaning data, not modelling." },
        { term: "Garbage in, garbage out", note: "Clean data beats clever models." },
        { term: "Data-centric", note: "Improving data often beats improving the algorithm." },
      ],
    },
    {
      heading: "Tidy Data",
      items: [
        { term: "Variable → column", note: "Each variable forms one column." },
        { term: "Observation → row", note: "Each observation forms one row." },
        { term: "Unit → table", note: "Each observational unit type gets its own table." },
        { term: "Long vs wide", note: "melt → long, pivot → wide. Tidy is usually long." },
      ],
    },
    {
      heading: "Missing Data",
      items: [
        { term: "Drop", note: "Remove rows/columns; safe when gaps are few and random." },
        { term: "Impute", note: "Fill with mean/median/model; median is robust." },
        { term: "Flag", note: "Add an indicator — missingness can be informative." },
        { term: "Ask why", note: "Biased missingness biases the dataset if dropped." },
      ],
    },
    {
      heading: "Core Operations",
      items: [
        { term: "Filter / Select", note: "Keep rows by condition / keep-drop columns." },
        { term: "Mutate", note: "Create new columns from existing ones." },
        { term: "Group-by", note: "Split–apply–combine: summarise within categories." },
        { term: "Join / Merge", note: "Combine tables on a shared key." },
        { term: "Leakage trap", note: "Fit cleaning stats on train only, then apply to test." },
      ],
    },
  ],
};