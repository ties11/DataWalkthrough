import { Subject } from "./types";

export const transformers: Subject = {
  slug: "transformers",
  title: "Transformers & Attention",
  icon: "transformer",
  phase: 4,
  blurb:
    "The architecture behind GPT, BERT, and modern AI. Attention mechanisms, encoder–decoder design, positional encoding, and fine-tuning with LoRA.",
  sources: [
    "Vaswani et al. — Attention Is All You Need (2017) — arxiv.org/abs/1706.03762",
    "Alammar, J. — The Illustrated Transformer — jalammar.github.io/illustrated-transformer",
    "Hugging Face — Transformers Documentation — huggingface.co/docs/transformers",
    "Hu et al. — LoRA: Low-Rank Adaptation of Large Language Models (2021)",
  ],

  theory: [
    {
      badge: "Intuition · Page 1",
      title: "The Attention Mechanism",
      blocks: [
        {
          kind: "para",
          html: "Before transformers, sequence models like RNNs had to compress an entire sentence into a single fixed-size vector before generating output. For long sequences, early context was lost by the time the decoder needed it. Attention was invented to solve this.",
        },
        {
          kind: "para",
          html: "The core idea: when producing each output token, let the model look back at <em>every</em> input token simultaneously and decide how much to weight each one. This produces a context vector that is a weighted average of all inputs — and the weights are learned, not fixed.",
        },
        {
          kind: "callout",
          tone: "teal",
          title: "Scaled Dot-Product Attention",
          html: "Given queries <strong>Q</strong>, keys <strong>K</strong>, and values <strong>V</strong>, attention output = softmax(<strong>QK</strong>ᵀ / √d<sub>k</sub>) · <strong>V</strong>. The scale factor √d<sub>k</sub> prevents dot products from growing too large and pushing softmax into saturation.",
        },
        {
          kind: "heading",
          text: "Queries, Keys, and Values",
        },
        {
          kind: "para",
          html: "Think of attention like a search engine. The <em>query</em> is what you're looking for; the <em>keys</em> are labels on each memory slot; the <em>values</em> are the content. Dot product similarity between the query and each key determines how much of each value to retrieve.",
        },
        {
          kind: "equation",
          tex: "\\text{Attention}(Q, K, V) = \\text{softmax}\\!\\left(\\frac{QK^\\top}{\\sqrt{d_k}}\\right)V",
        },
        {
          kind: "para",
          html: "Q, K, and V are all linear projections of the same input (in self-attention) or of encoder/decoder inputs (in cross-attention). The projection matrices are learned end-to-end during training.",
        },
      ],
    },
    {
      badge: "Architecture · Page 2",
      title: "Multi-Head Attention",
      blocks: [
        {
          kind: "para",
          html: "A single attention head asks one type of question: which positions are most relevant for this query? <strong>Multi-head attention</strong> runs <em>h</em> independent attention heads in parallel, each with its own Q, K, V projections, then concatenates and re-projects the outputs.",
        },
        {
          kind: "equation",
          tex: "\\text{MultiHead}(Q,K,V) = \\text{Concat}(\\text{head}_1,\\ldots,\\text{head}_h)W^O",
        },
        {
          kind: "callout",
          tone: "purple",
          title: "Why multiple heads?",
          html: "Different heads learn to attend to different patterns: one might capture syntactic dependencies, another coreference, another semantic similarity. More heads = richer representational power within the same layer.",
        },
        {
          kind: "heading",
          text: "Positional Encoding",
        },
        {
          kind: "para",
          html: "Attention is permutation-invariant — it doesn't know the order of tokens. Positional encodings inject position information by adding a fixed or learned vector to each token embedding before the first layer.",
        },
        {
          kind: "para",
          html: "The original paper used sinusoidal encodings of varying frequencies. More recent models (like RoPE used in LLaMA) use rotary positional embeddings applied <em>inside</em> the attention computation, which generalise better to sequences longer than those seen during training.",
        },
        {
          kind: "equation",
          tex: "PE(\\text{pos}, 2i) = \\sin\\!\\left(\\frac{\\text{pos}}{10000^{2i/d_{\\text{model}}}}\\right)",
        },
      ],
    },
    {
      badge: "Structure · Page 3",
      title: "Encoder–Decoder Architecture",
      blocks: [
        {
          kind: "para",
          html: "The original transformer has two stacks. The <strong>encoder</strong> processes the full input sequence bidirectionally, producing a rich representation of each token in context. The <strong>decoder</strong> generates output tokens auto-regressively, attending to both its own past outputs and the encoder's output.",
        },
        {
          kind: "callout",
          tone: "amber",
          title: "Three types of attention in the transformer",
          html: "<strong>1. Encoder self-attention:</strong> every input token attends to every other input token.<br/><strong>2. Masked decoder self-attention:</strong> each output token can only attend to positions before it (causal masking).<br/><strong>3. Cross-attention:</strong> each decoder position attends to the full encoder output.",
        },
        {
          kind: "heading",
          text: "Feed-Forward Sub-Layer",
        },
        {
          kind: "para",
          html: "After each attention sub-layer, there is a position-wise feed-forward network: two linear transforms with a ReLU (or GELU) in between. This applies the same MLP to each position independently and is where most of the model's 'memory' of factual knowledge is thought to live.",
        },
        {
          kind: "heading",
          text: "Layer Norm and Residuals",
        },
        {
          kind: "para",
          html: "Each sub-layer is wrapped in a <em>residual connection</em> (output = sublayer(x) + x) followed by layer normalisation. This allows gradients to flow directly through deep stacks and stabilises training. Pre-LN (norm before the sub-layer) is now more common than the original Post-LN.",
        },
      ],
    },
    {
      badge: "Pre-training · Page 4",
      title: "BERT vs GPT: Pre-training Paradigms",
      blocks: [
        {
          kind: "para",
          html: "The transformer architecture is shared, but the pre-training objective determines whether a model is suited for <em>understanding</em> or <em>generation</em>.",
        },
        {
          kind: "table",
          headers: ["", "BERT (encoder-only)", "GPT (decoder-only)"],
          rows: [
            ["Objective", "Masked LM — predict hidden tokens", "Causal LM — predict next token"],
            ["Attention", "Bidirectional — sees full context", "Causal — left-to-right only"],
            ["Best for", "Classification, NER, QA, embeddings", "Text generation, chat, code"],
            ["Examples", "BERT, RoBERTa, DistilBERT", "GPT-2/3/4, LLaMA, Mistral, Claude"],
          ],
        },
        {
          kind: "callout",
          tone: "teal",
          title: "Encoder–Decoder models",
          html: "T5 and BART keep both stacks. They pre-train on tasks like text denoising and excel at seq-to-seq tasks: translation, summarisation, question answering with long contexts.",
        },
        {
          kind: "para",
          html: "Modern trend: decoder-only models at scale have overtaken encoder-only models on most NLU benchmarks. GPT-4 and Claude can do classification via prompting as well as fine-tuned BERT, while also being capable generalists.",
        },
      ],
    },
    {
      badge: "Adaptation · Page 5",
      title: "Fine-Tuning, RLHF, and LoRA",
      blocks: [
        {
          kind: "para",
          html: "A pre-trained transformer is a powerful general language model. Fine-tuning adapts it to a specific task by continuing training on a smaller labelled dataset. Full fine-tuning updates all weights — expensive for large models.",
        },
        {
          kind: "heading",
          text: "LoRA: Low-Rank Adaptation",
        },
        {
          kind: "para",
          html: "LoRA adds small trainable rank-decomposition matrices alongside the frozen pre-trained weights. Instead of updating a d×d weight matrix W, it trains two matrices A (d×r) and B (r×d) where r ≪ d. The update ΔW = BA is applied at inference — reducing trainable parameters by 10–1000× with minimal quality loss.",
        },
        {
          kind: "equation",
          tex: "W' = W_0 + \\frac{\\alpha}{r} \\cdot B A",
        },
        {
          kind: "callout",
          tone: "purple",
          title: "RLHF: Reinforcement Learning from Human Feedback",
          html: "After supervised fine-tuning, a reward model is trained on human preference rankings of outputs. The language model is then fine-tuned with PPO (a RL algorithm) to maximise this reward. This is how ChatGPT and Claude learn to be helpful and safe.",
        },
        {
          kind: "heading",
          text: "Practical Fine-Tuning Choices",
        },
        {
          kind: "para",
          html: "<strong>Full fine-tuning:</strong> best quality, highest VRAM. <strong>LoRA/QLoRA:</strong> best efficiency-quality tradeoff, runs on a single consumer GPU. <strong>Prompt tuning:</strong> adds soft prompt tokens, no weight change at all. <strong>Feature extraction:</strong> freeze all weights, add a classification head — fast but limited.",
        },
      ],
    },
  ],

  quiz: [
    {
      id: "t-q1",
      question: "What does the scale factor √dₖ do in scaled dot-product attention?",
      options: [
        "It projects each key to unit length, ensuring cosine similarity rather than dot-product similarity",
        "It prevents dot products from growing large and saturating the softmax",
        "It reduces the embedding dimension of Q and K to save memory during the attention computation",
        "It equalises the learning rates for the Q, K, and V projection matrices",
      ],
      correctIndex: 1,
      explanation:
        "With high-dimensional keys, dot products grow large, pushing softmax into regions with tiny gradients. Dividing by √dₖ keeps the magnitudes stable.",
    },
    {
      id: "t-q2",
      question: "What is the key difference between BERT and GPT attention?",
      options: [
        "BERT uses cross-attention between sentence pairs; GPT uses self-attention only within a single sequence",
        "GPT uses multi-head attention while BERT uses a simpler single-head attention mechanism",
        "BERT is bidirectional; GPT is causal (left-to-right only)",
        "BERT masks attention using relative position biases; GPT uses fixed sinusoidal absolute encodings"
      ],
      correctIndex: 2,
      explanation:
        "BERT can attend to all tokens in both directions (ideal for understanding), while GPT uses causal masking so each position only sees previous tokens (required for autoregressive generation).",
    },
    {
      id: "t-q3",
      question: "In LoRA, what does the rank r control?",
      options: [
        "The fraction of layers that receive trainable adapters — lower r skips more layers",
        "The number of attention heads that are unfrozen and fine-tuned during adaptation",
        "The magnitude of the adapter updates relative to the frozen base model weights",
        "The number of trainable parameters — lower r means fewer parameters"
      ],
      correctIndex: 3,
      explanation:
        "LoRA decomposes the weight update into two matrices of size d×r and r×d. Smaller r means fewer trainable parameters and lower VRAM, at the cost of some representational capacity.",
    },
    {
      id: "t-q4",
      question: "Why are positional encodings needed in the transformer?",
      options: [
        "They replace the need for a feed-forward sublayer, reducing the total parameter count by half",
        "They are added to the key vectors to enable each query to directly compare its position to others",
        "They encode the frequency of each token in the training corpus, improving rare-word representations",
        "Because attention is permutation-invariant and doesn't encode token order"
      ],
      correctIndex: 3,
      explanation:
        "Self-attention treats the input as a set, not a sequence. Without positional encodings, the model has no way to distinguish 'the cat sat on the mat' from any permutation of those tokens.",
    },
    {
      id: "t-q5",
      question: "What does cross-attention in the decoder attend to?",
      options: [
        "A fixed-size memory of the k most relevant encoder tokens, selected by a learned gating mechanism",
        "The decoder's own past generated tokens, applying a causal mask to prevent attending to future positions",
        "Only the final encoder hidden state, which is used as a context vector for all decoder positions",
        "The full encoder output — every input position can be attended to"
      ],
      correctIndex: 3,
      explanation:
        "Cross-attention lets each decoder position query the entire encoder output. This is how the decoder 'reads' the input to guide generation, with no masking on the encoder side.",
    },
  ],

  exercises: [
    {
      id: "t-ex1",
      title: "Implement Scaled Dot-Product Attention",
      intro: "Build attention from scratch in NumPy to understand exactly what the equations are doing.",
      parts: [
        {
          id: "t-ex1-p1",
          label: "Attention forward pass",
          prompt:
            "Implement `scaled_dot_product_attention(Q, K, V)` using NumPy. Q, K, V are 2D arrays of shape (seq_len, d_k). Return a tuple of (output, weights) where output is (seq_len, d_k) and weights is (seq_len, seq_len).",
          starterCode: `import numpy as np

def scaled_dot_product_attention(Q, K, V):
    # Q, K, V: (seq_len, d_k)
    d_k = Q.shape[-1]
    # TODO: compute scores, scale, softmax, weighted sum
    pass

# Test
np.random.seed(42)
seq_len, d_k = 4, 8
Q = np.random.randn(seq_len, d_k)
K = np.random.randn(seq_len, d_k)
V = np.random.randn(seq_len, d_k)

output, weights = scaled_dot_product_attention(Q, K, V)
print("Output shape:", output.shape)
print("Weights shape:", weights.shape)
print("Weights row sum (should be 1):", weights[0].sum().round(6))`,
          solution: `import numpy as np

def scaled_dot_product_attention(Q, K, V):
    d_k = Q.shape[-1]
    scores = Q @ K.T / np.sqrt(d_k)
    scores -= scores.max(axis=-1, keepdims=True)
    weights = np.exp(scores)
    weights /= weights.sum(axis=-1, keepdims=True)
    output = weights @ V
    return output, weights

np.random.seed(42)
seq_len, d_k = 4, 8
Q = np.random.randn(seq_len, d_k)
K = np.random.randn(seq_len, d_k)
V = np.random.randn(seq_len, d_k)

output, weights = scaled_dot_product_attention(Q, K, V)
print("Output shape:", output.shape)
print("Weights shape:", weights.shape)
print("Weights row sum (should be 1):", weights[0].sum().round(6))`,
          expectedStdout: "Output shape: (4, 8)\nWeights shape: (4, 4)\nWeights row sum (should be 1): 1.0",
          hints: [
            "Compute QKᵀ first, then divide by √d_k",
            "For numerically stable softmax, subtract the row max before exp()",
            "Divide exp(scores) by row sums to get probabilities",
          ],
        },
        {
          id: "t-ex1-p2",
          label: "Causal masking",
          prompt:
            "Add causal masking so that position i can only attend to positions ≤ i. Apply a mask of -1e9 to the upper triangle before the softmax. This is what GPT-style decoders use.",
          starterCode: `import numpy as np

def causal_attention(Q, K, V):
    d_k = Q.shape[-1]
    seq_len = Q.shape[0]
    scores = Q @ K.T / np.sqrt(d_k)
    # TODO: create causal mask — upper triangle should be -1e9
    pass

np.random.seed(0)
seq_len, d_k = 5, 4
Q = np.random.randn(seq_len, d_k)
K = np.random.randn(seq_len, d_k)
V = np.random.randn(seq_len, d_k)

output, weights = causal_attention(Q, K, V)
print("Weights (upper triangle should be ~0):")
print(weights.round(3))`,
          solution: `import numpy as np

def causal_attention(Q, K, V):
    d_k = Q.shape[-1]
    seq_len = Q.shape[0]
    scores = Q @ K.T / np.sqrt(d_k)
    mask = np.triu(np.ones((seq_len, seq_len)), k=1)
    scores = scores - mask * 1e9
    scores -= scores.max(axis=-1, keepdims=True)
    weights = np.exp(scores)
    weights /= weights.sum(axis=-1, keepdims=True)
    output = weights @ V
    return output, weights

np.random.seed(0)
seq_len, d_k = 5, 4
Q = np.random.randn(seq_len, d_k)
K = np.random.randn(seq_len, d_k)
V = np.random.randn(seq_len, d_k)

output, weights = causal_attention(Q, K, V)
print("Weights (upper triangle should be ~0):")
print(weights.round(3))`,
          expectedStdout: "Weights (upper triangle should be ~0):\n[[1.    0.    0.    0.    0.   ]\n [0.459 0.541 0.    0.    0.   ]\n [0.305 0.418 0.277 0.    0.   ]\n [0.281 0.294 0.218 0.207 0.   ]\n [0.256 0.165 0.204 0.184 0.191]]",
          hints: [
            "np.triu(ones, k=1) gives the upper triangle excluding the diagonal",
            "Subtract mask * 1e9 from scores before softmax",
            "After masking, exp(-1e9) ≈ 0 so those positions get zero weight",
          ],
        },
      ],
    },
    {
      id: "t-ex2",
      title: "Positional Encoding",
      intro: "Implement sinusoidal positional encodings from the original transformer paper and visualise the patterns.",
      parts: [
        {
          id: "t-ex2-p1",
          label: "Sinusoidal encoding",
          prompt:
            "Implement `sinusoidal_encoding(seq_len, d_model)` that returns a (seq_len, d_model) matrix of positional encodings using the formula from 'Attention Is All You Need'. Even indices use sin, odd indices use cos.",
          starterCode: `import numpy as np

def sinusoidal_encoding(seq_len, d_model):
    # PE(pos, 2i)   = sin(pos / 10000^(2i/d_model))
    # PE(pos, 2i+1) = cos(pos / 10000^(2i/d_model))
    pe = np.zeros((seq_len, d_model))
    # TODO: fill pe
    return pe

PE = sinusoidal_encoding(seq_len=10, d_model=8)
print("Shape:", PE.shape)
print("First 3 positions, first 4 dims:")
print(PE[:3, :4].round(4))
print("Values stay in [-1, 1]:", PE.min().round(3), "to", PE.max().round(3))`,
          solution: `import numpy as np

def sinusoidal_encoding(seq_len, d_model):
    pe = np.zeros((seq_len, d_model))
    pos = np.arange(seq_len)[:, np.newaxis]          # (seq_len, 1)
    i   = np.arange(0, d_model, 2)[np.newaxis, :]   # (1, d_model/2)
    div = np.power(10000.0, i / d_model)
    pe[:, 0::2] = np.sin(pos / div)
    pe[:, 1::2] = np.cos(pos / div)
    return pe

PE = sinusoidal_encoding(seq_len=10, d_model=8)
print("Shape:", PE.shape)
print("First 3 positions, first 4 dims:")
print(PE[:3, :4].round(4))
print("Values stay in [-1, 1]:", PE.min().round(3), "to", PE.max().round(3))`,
          expectedStdout: "Shape: (10, 8)\nFirst 3 positions, first 4 dims:\n[[ 0.      1.      0.      1.    ]\n [ 0.8415  0.5403  0.0998  0.995 ]\n [ 0.9093 -0.4161  0.1987  0.9801]]\nValues stay in [-1, 1]: -1.0 to 1.0",
          hints: [
            "Create a position column vector (seq_len, 1) and dimension row vector (1, d_model/2)",
            "Divider = 10000^(2i/d_model) — broadcast multiply pos/divider",
            "Even columns (0, 2, 4...) get sin; odd columns (1, 3, 5...) get cos",
          ],
        },
      ],
    },
  ],

  cheatsheet: [
    {
      heading: "Attention Formulas",
      items: [
        { term: "Scaled Dot-Product", note: "softmax(QKᵀ/√dₖ)·V — core of all transformer attention" },
        { term: "Multi-Head Attention", note: "Concat(head₁…headₕ)W^O — h parallel heads with separate projections" },
        { term: "Causal mask", note: "Upper-triangular −∞ mask applied before softmax to block future positions" },
        { term: "dₖ", note: "Key dimension; scale factor √dₖ prevents gradient vanishing in softmax" },
      ],
    },
    {
      heading: "Architecture Variants",
      items: [
        { term: "Encoder-only (BERT)", note: "Bidirectional self-attention; pre-trains with masked language modelling" },
        { term: "Decoder-only (GPT)", note: "Causal self-attention; pre-trains with next-token prediction" },
        { term: "Encoder–Decoder (T5)", note: "Encoder + cross-attention decoder; best for seq-to-seq tasks" },
        { term: "Positional encoding", note: "Sinusoidal (original), learned, or RoPE (rotary) — injects token order" },
      ],
    },
    {
      heading: "Fine-Tuning Methods",
      items: [
        { term: "Full fine-tuning", note: "Update all weights — best quality, highest VRAM" },
        { term: "LoRA", note: "Train low-rank matrices ΔW = BA; reduces params by 10–1000×" },
        { term: "QLoRA", note: "LoRA + 4-bit quantised base model — LLM fine-tuning on a single GPU" },
        { term: "RLHF", note: "SFT → reward model → PPO; makes models helpful and safe" },
        { term: "Prompt tuning", note: "Learn soft prompt embeddings; no weight changes at all" },
      ],
    },
    {
      heading: "Key Numbers",
      items: [
        { term: "BERT-base", note: "12 layers, 12 heads, d_model=768, 110M parameters" },
        { term: "GPT-3", note: "96 layers, 96 heads, d_model=12288, 175B parameters" },
        { term: "Typical LoRA rank", note: "r=8 or r=16 — balances quality vs efficiency" },
        { term: "Context length", note: "O(n²) attention complexity — longer = quadratically more compute" },
      ],
    },
  ],
};
