import { Subject } from "./types";

export const nlpFundamentals: Subject = {
  slug: "nlp-fundamentals",
  title: "NLP Fundamentals",
  icon: "nlp",
  phase: 5,
  blurb:
    "Turn raw text into numbers a model can learn from. Understand tokenisation, TF-IDF, word embeddings, and the transformer attention mechanism — the foundations of everything from sentiment analysis to large language models.",
  sources: [
    "Jurafsky & Martin — Speech and Language Processing, 3rd ed. draft (2024), free at web.stanford.edu/~jurafsky/slp3",
    "Goldberg, Y. — Neural Network Methods for Natural Language Processing (2017)",
    "Mikolov et al. — Distributed Representations of Words and Phrases (Word2Vec, 2013)",
    "Vaswani et al. — Attention Is All You Need (Transformer, NeurIPS 2017)",
    "Devlin et al. — BERT: Pre-training of Deep Bidirectional Transformers (2019)",
  ],

  theory: [
    {
      badge: "Intuition · Page 1",
      title: "The Text-to-Numbers Problem",
      blocks: [
        {
          kind: "para",
          html: "Every machine learning algorithm operates on numbers. Text is not numbers. The central challenge of NLP is designing representations of language that preserve meaning while being numerically tractable. A good representation should make synonyms close together, capture context, and scale to the enormous vocabulary of natural language.",
        },
        {
          kind: "para",
          html: "The field has gone through three major representation paradigms. In the <em>bag-of-words era</em>, documents were vectors of word counts — simple but blind to word order and meaning. In the <em>embedding era</em>, words became dense vectors in a learned geometric space where similar words cluster together. In the <em>transformer era</em>, a word's representation depends dynamically on context — the same word has different embeddings in different sentences.",
        },
        {
          kind: "callout",
          tone: "purple",
          title: "Core NLP tasks",
          html: "<strong>Classification</strong> — sentiment analysis, topic labelling, spam detection.<br/><strong>Sequence labelling</strong> — named entity recognition, part-of-speech tagging.<br/><strong>Generation</strong> — translation, summarisation, question answering, text completion.<br/>All of these build on the same foundational representations.",
        },
        {
          kind: "heading",
          text: "The NLP pipeline",
        },
        {
          kind: "table",
          headers: ["Step", "What happens"],
          rows: [
            ["Tokenisation", "Split text into tokens (words, subwords, or characters)"],
            ["Normalisation", "Lowercase, remove punctuation, handle contractions"],
            ["Stemming / Lemmatisation", "Reduce words to base form (running → run)"],
            ["Representation", "Convert tokens to numbers (bag-of-words, TF-IDF, embeddings)"],
            ["Model", "Feed numeric representation to an ML or DL model"],
          ],
        },
      ],
    },
    {
      badge: "Representations · Page 2",
      title: "Bag-of-Words and TF-IDF",
      blocks: [
        {
          kind: "para",
          html: "The simplest document representation: create a vocabulary of all unique words; represent each document as a vector of word counts. This is the <em>bag-of-words</em> (BoW) model. It is interpretable and effective for many classification tasks, but treats \"dog bites man\" and \"man bites dog\" identically.",
        },
        {
          kind: "heading",
          text: "The problem with raw counts",
        },
        {
          kind: "para",
          html: "Common words like \"the\", \"is\", and \"a\" appear in almost every document and dominate count vectors. They carry no discriminative information. <em>TF-IDF</em> (Term Frequency × Inverse Document Frequency) downweights these ubiquitous words and upweights rare, distinctive ones.",
        },
        {
          kind: "equation",
          label: "TF-IDF weight",
          tex: "\\text{TF-IDF}(t, d) = \\underbrace{\\frac{\\text{count}(t, d)}{\\text{total tokens in } d}}_{\\text{TF}} \\times \\underbrace{\\log\\frac{N}{\\text{docs containing } t}}_{\\text{IDF}}",
        },
        {
          kind: "para",
          html: "A word appearing in 1 of 1,000 documents gets an IDF of \\(\\log(1000)\\approx 6.9\\). A word appearing in all 1,000 documents gets IDF = 0 — it is completely suppressed. TF-IDF is still widely used for retrieval, keyword extraction, and as a baseline for text classification.",
        },
        {
          kind: "callout",
          tone: "teal",
          title: "n-grams",
          html: "Extending BoW to capture word order: an <em>n-gram</em> is a contiguous sequence of n tokens. Bigrams (n=2) capture phrases like \"New York\" and \"not good\". Scikit-learn's <code>TfidfVectorizer(ngram_range=(1,2))</code> includes both unigrams and bigrams.",
        },
        {
          kind: "callout",
          tone: "amber",
          title: "Sparse representations",
          html: "A vocabulary of 50,000 words → a 50,000-dimensional sparse vector per document. Most entries are zero. Use sparse matrix formats (<code>scipy.sparse</code>) to store these efficiently.",
        },
      ],
    },
    {
      badge: "Embeddings · Page 3",
      title: "Word Embeddings: Meaning in Geometry",
      blocks: [
        {
          kind: "para",
          html: "Word embeddings map each word to a dense vector in, typically, 50–300 dimensions. The crucial property: <em>similar words end up close together</em>. King and queen cluster near monarchy-related words; dog and cat cluster near animals. This geometry captures semantic relationships that TF-IDF cannot.",
        },
        {
          kind: "heading",
          text: "Word2Vec",
        },
        {
          kind: "para",
          html: "Word2Vec (Mikolov et al., 2013) learns embeddings by training a shallow neural network on a self-supervised task: predict a word from its context (CBOW) or predict context words given a word (Skip-gram). The prediction task is never the goal — the embedding weights are. After training on billions of words, the vectors encode surprising regularities:",
        },
        {
          kind: "equation",
          label: "Word analogy via vector arithmetic",
          tex: "\\vec{\\text{king}} - \\vec{\\text{man}} + \\vec{\\text{woman}} \\approx \\vec{\\text{queen}}",
        },
        {
          kind: "callout",
          tone: "teal",
          title: "GloVe and FastText",
          html: "<strong>GloVe</strong> (Stanford) — learns from global word co-occurrence statistics across the whole corpus. Often competitive with Word2Vec.<br/><strong>FastText</strong> (Meta) — represents words as sums of character n-gram embeddings, so it handles rare words and morphological variants (e.g. \"unhappy\" ≈ \"happy\" − \"un\").",
        },
        {
          kind: "heading",
          text: "Document embeddings from word embeddings",
        },
        {
          kind: "para",
          html: "The simplest approach: average the word embeddings of all tokens in a document. This loses word order but is surprisingly effective for classification. Better: use the [CLS] token from a transformer (see next page).",
        },
      ],
    },
    {
      badge: "Transformers · Page 4",
      title: "Attention and the Transformer",
      blocks: [
        {
          kind: "para",
          html: "All the representation methods so far treat each word independently or with limited context windows. The <em>transformer</em> (Vaswani et al., 2017) uses <em>attention</em> to let every word attend to every other word in the sequence simultaneously — enabling rich, context-dependent representations.",
        },
        {
          kind: "heading",
          text: "Self-attention",
        },
        {
          kind: "para",
          html: "For each word, the attention mechanism computes how much it should \"attend to\" every other word. The result is a weighted combination of all words' representations — weighted by relevance. In the sentence \"The bank by the river,\" \"bank\" attends strongly to \"river\"; in \"The bank approved the loan,\" it attends to \"loan.\" The same word, different context, different representation.",
        },
        {
          kind: "equation",
          label: "Scaled dot-product attention",
          tex: "\\text{Attention}(Q, K, V) = \\text{softmax}\\!\\left(\\frac{QK^\\top}{\\sqrt{d_k}}\\right)V",
        },
        {
          kind: "heading",
          text: "BERT: bidirectional pre-training",
        },
        {
          kind: "para",
          html: "BERT (Devlin et al., 2019) pre-trains a deep transformer on two tasks: masked language modelling (predict randomly masked words) and next-sentence prediction. Trained on the entirety of Wikipedia and BookCorpus, BERT's representations transfer to virtually every NLP downstream task via fine-tuning with a small labelled dataset.",
        },
        {
          kind: "callout",
          tone: "purple",
          title: "GPT vs BERT",
          html: "<strong>BERT</strong> — bidirectional; reads the whole sentence; best for understanding tasks (classification, NER, QA).<br/><strong>GPT</strong> — left-to-right (autoregressive); predicts next token; best for generation (translation, summarisation, chat).<br/>Both are transformers; they differ in pre-training objective and directionality.",
        },
      ],
    },
    {
      badge: "Practical NLP · Page 5",
      title: "From Text to Predictions: A Practical Guide",
      blocks: [
        {
          kind: "para",
          html: "Modern NLP has two regimes: <em>classical</em> (TF-IDF + ML classifier) and <em>transformer-based</em> (fine-tune a pre-trained model). The right choice depends on your dataset size, compute budget, and task complexity.",
        },
        {
          kind: "table",
          headers: ["Approach", "Dataset size", "Compute", "Accuracy potential"],
          rows: [
            ["TF-IDF + Logistic Regression", "Any", "CPU, seconds", "Strong baseline, often 80–90% of BERT"],
            ["TF-IDF + LightGBM", "Any", "CPU, minutes", "Slightly above LR, especially for long docs"],
            ["Pre-trained embeddings + pooling", "> 1K", "CPU/GPU, minutes", "Better semantic capture"],
            ["Fine-tune BERT / RoBERTa (last layers)", "1K–10K", "GPU, minutes–hours", "Near SOTA on most tasks"],
            ["Full fine-tune or LoRA", "> 10K", "GPU hours–days", "Best; needed for domain shift"],
          ],
        },
        {
          kind: "callout",
          tone: "teal",
          title: "Hugging Face ecosystem",
          html: "<code>transformers</code> (pip install transformers) provides 100,000+ pre-trained models with a consistent API. <code>pipeline('sentiment-analysis')</code> gives you a working classifier in 3 lines. <code>AutoModel.from_pretrained('bert-base-uncased')</code> loads weights for custom fine-tuning. The <code>datasets</code> library provides ready-to-use NLP benchmarks (GLUE, SuperGLUE, SQuAD).",
        },
        {
          kind: "heading",
          text: "Common pitfalls",
        },
        {
          kind: "table",
          headers: ["Pitfall", "Fix"],
          rows: [
            ["Tokeniser mismatch", "Always use the same tokeniser as the pre-trained model"],
            ["Max token length", "BERT max = 512 tokens; truncate or use sliding windows for long docs"],
            ["Class imbalance in text", "Oversample minority class or use class_weight='balanced'"],
            ["Evaluation on cleaned data only", "Test on raw, noisy text to estimate real-world performance"],
          ],
        },
      ],
    },
  ],

  quiz: [
    {
      id: "nlp-q1",
      question:
        "In the TF-IDF formula, what happens to the score of a word that appears in every document in the corpus?",
      options: [
        "It gets the highest possible score because it is universally relevant",
        "Its IDF term becomes log(N/N) = 0, so TF-IDF = 0 regardless of term frequency",
        "Its score is capped at 1.0 by the normalisation step",
        "It depends on TF — if it appears many times in one document, the score remains high",
      ],
      correctIndex: 1,
      explanation:
        "IDF = log(N / df), where df is the number of documents containing the word. If df = N (all documents), IDF = log(1) = 0. Multiplying by any TF gives 0. This is intentional — a word in every document carries no discriminative power, so TF-IDF suppresses it completely.",
    },
    {
      id: "nlp-q2",
      question:
        "Word2Vec learns embeddings by training on which self-supervised task?",
      options: [
        "Classifying sentiment labels from a large annotated corpus",
        "Predicting words from their surrounding context (or vice versa) in unlabelled text",
        "Translating sentences between two languages",
        "Generating summaries of paragraphs using human feedback",
      ],
      correctIndex: 1,
      explanation:
        "Word2Vec uses a self-supervised auxiliary task — either predict a word given its context (CBOW) or predict context words given a word (Skip-gram) — on large amounts of unlabelled text. The task itself is discarded; the learned weight matrix (embedding) is the valuable output.",
    },
    {
      id: "nlp-q3",
      question:
        "In transformer self-attention, what allows the model to produce different representations of the word 'bank' in 'river bank' vs 'bank loan'?",
      options: [
        "A separate lookup table for each word sense",
        "Each token attends to all other tokens, so 'bank' receives different context signals from 'river' vs 'loan'",
        "The positional encoding encodes word meaning based on sentence position",
        "Dropout randomly selects which embedding dimension represents word sense",
      ],
      correctIndex: 1,
      explanation:
        "Self-attention computes a weighted combination of all token representations, where the weights depend on how relevant each token is to the current one. 'Bank' in 'river bank' attends strongly to 'river', pulling in aquatic context. In 'bank loan', it attends to 'loan', pulling in financial context. The same token, different context → different representation.",
    },
    {
      id: "nlp-q4",
      question:
        "You have 800 labelled customer reviews for sentiment classification. Which approach is most likely to achieve the best accuracy?",
      options: [
        "TF-IDF + Logistic Regression — any deep learning approach will overfit with so few examples",
        "Train Word2Vec from scratch on the 800 reviews",
        "Fine-tune the last 1–2 layers of a pre-trained BERT model on your 800 labelled examples",
        "Build a character-level LSTM from scratch; character models generalise better",
      ],
      correctIndex: 2,
      explanation:
        "800 examples is too few to train any neural network from scratch without catastrophic overfitting. Transfer learning from BERT — which has already seen billions of words and learned rich language representations — requires only fine-tuning a small classification head. This typically outperforms TF-IDF + LR at this data size.",
    },
    {
      id: "nlp-q5",
      question:
        "What is the key difference between BERT and GPT in terms of architecture and intended use?",
      options: [
        "BERT uses CNNs; GPT uses RNNs",
        "BERT reads text bidirectionally (full context), making it better for understanding; GPT reads left-to-right, making it better for generation",
        "GPT is encoder-only; BERT is decoder-only",
        "BERT is open-source; GPT is proprietary and cannot be fine-tuned",
      ],
      correctIndex: 1,
      explanation:
        "Both BERT and GPT are transformer-based. BERT uses a bidirectional encoder: each token can attend to all tokens both to the left and right — ideal for understanding tasks where the full sentence is available. GPT uses a left-to-right (causal) decoder: each token can only attend to previous tokens — ideal for generation tasks where you produce text one token at a time.",
    },
  ],

  exercises: [
    {
      id: "nlp-ex1",
      title: "Text Classification with TF-IDF",
      intro: "Build a sentiment classifier using TF-IDF and Logistic Regression on the IMDb movie reviews dataset.",
      parts: [
        {
          id: "nlp-ex1a",
          label: "a",
          prompt:
            "Load the 20 Newsgroups dataset (categories: 'rec.sport.hockey', 'sci.space', 'talk.politics.guns'). Vectorise with TfidfVectorizer (max_features=5000). Print the feature matrix shape.",
          starterCode:
            "from sklearn.datasets import fetch_20newsgroups\nfrom sklearn.feature_extraction.text import TfidfVectorizer\n\ncats = ['rec.sport.hockey', 'sci.space', 'talk.politics.guns']\ntrain = fetch_20newsgroups(subset='train', categories=cats, remove=('headers', 'footers', 'quotes'))\n\nvec = TfidfVectorizer(max_features=5000)\n# YOUR CODE HERE\n",
          expectedStdout: "(1764, 5000)",
          hints: [
            "`fetch_20newsgroups` downloads and caches the dataset on first use.",
            "`remove=('headers', 'footers', 'quotes')` strips metadata that would make the task artificially easy.",
          ],
          solution:
            "from sklearn.datasets import fetch_20newsgroups\nfrom sklearn.feature_extraction.text import TfidfVectorizer\n\ncats = ['rec.sport.hockey', 'sci.space', 'talk.politics.guns']\ntrain = fetch_20newsgroups(subset='train', categories=cats, remove=('headers', 'footers', 'quotes'))\n\nvec = TfidfVectorizer(max_features=5000)\nX = vec.fit_transform(train.data)\nprint(X.shape)",
        },
        {
          id: "nlp-ex1b",
          label: "b",
          prompt:
            "Using the same 3-category newsgroups setup, train a Logistic Regression on the TF-IDF training vectors, evaluate on the test set, and print test accuracy rounded to 3 dp.",
          starterCode:
            "from sklearn.datasets import fetch_20newsgroups\nfrom sklearn.feature_extraction.text import TfidfVectorizer\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.pipeline import Pipeline\n\ncats = ['rec.sport.hockey', 'sci.space', 'talk.politics.guns']\ntrain = fetch_20newsgroups(subset='train', categories=cats, remove=('headers', 'footers', 'quotes'))\ntest  = fetch_20newsgroups(subset='test',  categories=cats, remove=('headers', 'footers', 'quotes'))\n\n# YOUR CODE HERE\n",
          expectedStdout: "0.879",
          hints: [
            "A Pipeline chains preprocessing and modelling — fit on train, score on test.",
            "TF-IDF + Logistic Regression is a surprisingly strong baseline — hard to beat without transformers.",
          ],
          solution:
            "from sklearn.datasets import fetch_20newsgroups\nfrom sklearn.feature_extraction.text import TfidfVectorizer\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.pipeline import Pipeline\n\ncats = ['rec.sport.hockey', 'sci.space', 'talk.politics.guns']\ntrain = fetch_20newsgroups(subset='train', categories=cats, remove=('headers', 'footers', 'quotes'))\ntest  = fetch_20newsgroups(subset='test',  categories=cats, remove=('headers', 'footers', 'quotes'))\n\npipe = Pipeline([\n    ('tfidf', TfidfVectorizer(max_features=5000)),\n    ('lr',   LogisticRegression(max_iter=1000, random_state=42)),\n])\npipe.fit(train.data, train.target)\nprint(round(pipe.score(test.data, test.target), 3))",
        },
      ],
    },
  ],

  cheatsheet: [
    {
      heading: "Text Preprocessing",
      items: [
        {
          term: "Tokenisation",
          note: "Split text into tokens: word-level, subword (BPE), or character-level",
        },
        {
          term: "Stopword removal",
          note: "Remove high-frequency, low-information words ('the', 'is') — less important with TF-IDF",
        },
        {
          term: "Lemmatisation",
          note: "Reduce to dictionary form: 'running' → 'run', 'better' → 'good'",
        },
        {
          term: "n-grams",
          note: "Include sequences of n tokens to capture phrases (ngram_range=(1,2) adds bigrams)",
        },
      ],
    },
    {
      heading: "Bag-of-Words & TF-IDF",
      items: [
        {
          term: "CountVectorizer",
          note: "Counts term frequency per document — simple, interpretable",
        },
        {
          term: "TfidfVectorizer",
          note: "Downweights common words; sparse matrix output",
          formula: "\\text{TF-IDF} = \\text{TF} \\times \\log\\frac{N}{\\text{df}}",
        },
        {
          term: "max_features",
          note: "Limit vocabulary size; 10K–50K is typical",
        },
        {
          term: "Output",
          note: "Sparse matrix (n_docs × vocab_size); store as scipy.sparse.csr_matrix",
        },
      ],
    },
    {
      heading: "Word Embeddings",
      items: [
        {
          term: "Word2Vec",
          note: "CBOW or Skip-gram; 50–300 dim; captures word analogies",
        },
        {
          term: "GloVe",
          note: "Global co-occurrence statistics; competitive with Word2Vec",
        },
        {
          term: "FastText",
          note: "Subword embeddings; handles OOV words and morphology",
        },
        {
          term: "Document embedding",
          note: "Average word embeddings, or use [CLS] token from BERT",
        },
      ],
    },
    {
      heading: "Transformer / BERT",
      items: [
        {
          term: "Self-attention",
          note: "Each token attends to all others; context-dependent representations",
          formula: "\\text{Attn}(Q,K,V) = \\text{softmax}\\!\\left(\\frac{QK^\\top}{\\sqrt{d_k}}\\right)V",
        },
        {
          term: "BERT fine-tuning",
          note: "Add classification head to [CLS] token; train with lr ≈ 2e-5, 3–5 epochs",
        },
        {
          term: "HuggingFace pipeline",
          note: "pipeline('text-classification') — 3-line inference on pre-trained models",
        },
        {
          term: "Max token length",
          note: "BERT: 512 tokens; GPT-2: 1024; truncate or chunk long documents",
        },
      ],
    },
  ],
};
