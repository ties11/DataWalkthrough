import { Subject } from "./types";

export const neuralNetworks: Subject = {
  slug: "neural-networks",
  title: "Neural Networks",
  icon: "neural",
  phase: 4,
  blurb:
    "The architecture behind deep learning. A neural network stacks simple building blocks — neurons — into layers that collectively learn arbitrary functions from data. Master the forward pass, backpropagation, and what makes training work.",
  sources: [
    "Goodfellow, Bengio & Courville — Deep Learning (2016), Ch. 6–8",
    "Géron, A. — Hands-On Machine Learning, 3rd ed., Ch. 10–11",
    "Nielsen, M. — Neural Networks and Deep Learning (2015), online at neuralnetworksanddeeplearning.com",
    "Rumelhart, Hinton & Williams — Learning representations by back-propagating errors (Nature, 1986)",
    "Glorot & Bengio — Understanding the Difficulty of Training Deep Feedforward Neural Networks (2010)",
  ],

  // ═══════════════════════════════════════════════════════════
  //  THEORY
  // ═══════════════════════════════════════════════════════════
  theory: [
    // ── PAGE 1 — Intuition ──────────────────────────────────
    {
      badge: "Intuition · Page 1",
      title: "From One Neuron to a Network",
      blocks: [
        {
          kind: "para",
          html: "Every algorithm you have studied so far — logistic regression, SVMs, random forests — applies a fixed mathematical form to the data. A neural network is different: it learns the form itself. By composing many simple, adjustable computations, it can approximate virtually any function from inputs to outputs, given enough data and compute.",
        },
        {
          kind: "para",
          html: "The building block is a single <em>neuron</em> (or unit). A neuron computes a weighted sum of its inputs, adds a bias, and passes the result through a non-linear <em>activation function</em>. This is just logistic regression — but connect thousands of neurons in layers, each feeding the next, and you get a model that can learn features it was never told to look for.",
        },
        {
          kind: "callout",
          tone: "purple",
          title: "Universal approximation theorem",
          html: "A feedforward network with a single hidden layer and enough neurons can approximate <em>any continuous function</em> on a compact domain to arbitrary accuracy. This is why neural networks are so powerful — but it is also why they need regularisation. A model that can approximate anything can also memorise noise.",
        },
        {
          kind: "heading",
          text: "Anatomy of a network",
        },
        {
          kind: "table",
          headers: ["Layer type", "Role"],
          rows: [
            ["Input layer", "One node per feature — passes data in unchanged"],
            ["Hidden layer(s)", "Transform the representation; stacking = 'deep' learning"],
            ["Output layer", "One node per class (classification) or one node (regression)"],
          ],
        },
        {
          kind: "callout",
          tone: "teal",
          title: "Depth vs width",
          html: "Wider networks have more neurons per layer; deeper networks have more layers. In practice, depth matters more — deep networks learn hierarchical features (edges → shapes → objects in vision; words → phrases → meaning in NLP) that shallow wide networks cannot represent as compactly.",
        },
      ],
    },

    // ── PAGE 2 — Forward pass ───────────────────────────────
    {
      badge: "Forward Pass · Page 2",
      title: "Computing a Prediction",
      blocks: [
        {
          kind: "para",
          html: "The <em>forward pass</em> is the computation that turns an input into a prediction. For a network with one hidden layer it proceeds in two steps.",
        },
        {
          kind: "heading",
          text: "Step 1 — hidden layer",
        },
        {
          kind: "equation",
          label: "Hidden layer pre-activation and activation",
          tex: "\\mathbf{h} = g(\\mathbf{W}^{(1)} \\mathbf{x} + \\mathbf{b}^{(1)})",
        },
        {
          kind: "para",
          html: "\\(\\mathbf{W}^{(1)}\\) is the weight matrix (one row per hidden neuron), \\(\\mathbf{b}^{(1)}\\) the bias vector, and \\(g\\) the activation function applied element-wise. The result \\(\\mathbf{h}\\) is the <em>hidden representation</em> — a re-encoding of the input that the next layer reads.",
        },
        {
          kind: "heading",
          text: "Step 2 — output layer",
        },
        {
          kind: "equation",
          label: "Output (logits → probabilities for classification)",
          tex: "\\hat{\\mathbf{y}} = \\text{softmax}(\\mathbf{W}^{(2)} \\mathbf{h} + \\mathbf{b}^{(2)})",
        },
        {
          kind: "heading",
          text: "Activation functions",
        },
        {
          kind: "table",
          headers: ["Function", "Formula", "When to use"],
          rows: [
            ["ReLU", "max(0, z)", "Default for hidden layers — fast, avoids vanishing gradient"],
            ["Sigmoid", "1/(1+e^{−z})", "Output layer for binary classification"],
            ["Softmax", "e^{zᵢ}/Σe^{zⱼ}", "Output layer for multi-class classification"],
            ["Tanh", "(e^z−e^{−z})/(e^z+e^{−z})", "Sometimes better than sigmoid for hidden layers"],
            ["Leaky ReLU", "max(0.01z, z)", "Fixes 'dying ReLU' problem for negative inputs"],
          ],
        },
        {
          kind: "callout",
          tone: "amber",
          title: "Why non-linearity?",
          html: "Without activation functions, stacking layers is pointless — a product of linear transformations is still linear. The activation function at each layer breaks linearity, allowing the network to learn curved decision boundaries and complex feature hierarchies.",
        },
      ],
    },

    // ── PAGE 3 — Backpropagation ────────────────────────────
    {
      badge: "Training · Page 3",
      title: "Backpropagation and Gradient Descent",
      blocks: [
        {
          kind: "para",
          html: "A network with random weights predicts poorly. Training is the process of adjusting those weights to minimise a loss function — the gap between predictions and targets. The key question is: how does each weight affect the loss? <em>Backpropagation</em> computes this efficiently.",
        },
        {
          kind: "heading",
          text: "The loss function",
        },
        {
          kind: "para",
          html: "For classification, the standard choice is <em>cross-entropy loss</em>. For regression, <em>mean squared error</em>. Both are chosen because they are differentiable everywhere the network is differentiable — a requirement for gradient-based optimisation.",
        },
        {
          kind: "equation",
          label: "Cross-entropy loss (multi-class)",
          tex: "\\mathcal{L} = -\\sum_{c=1}^{C} y_c \\log \\hat{y}_c",
        },
        {
          kind: "heading",
          text: "Backpropagation — the chain rule at scale",
        },
        {
          kind: "para",
          html: "Backpropagation is just the chain rule of calculus applied systematically through the computational graph. Start at the output layer: compute how the loss changes with respect to the output. Then propagate <em>backwards</em>, layer by layer, computing how the loss changes with respect to each weight using the chain rule. The gradient tells every weight which direction to move to reduce the loss.",
        },
        {
          kind: "callout",
          tone: "teal",
          title: "Gradient descent update",
          html: "Move every parameter opposite to its gradient, scaled by the learning rate \\(\\eta\\): <br/><code>w ← w − η · ∂L/∂w</code><br/>Too large an \\(\\eta\\) causes divergence; too small means slow convergence. Modern optimisers (Adam, RMSProp) adapt \\(\\eta\\) per parameter automatically.",
        },
        {
          kind: "heading",
          text: "Mini-batch stochastic gradient descent",
        },
        {
          kind: "para",
          html: "Computing the gradient over the full dataset per step is expensive. <em>Mini-batch SGD</em> computes the gradient on a small random subset (batch size 32–512 is typical) and updates immediately. This is noisier but much faster, and the noise itself acts as a form of regularisation.",
        },
        {
          kind: "callout",
          tone: "purple",
          title: "One training epoch",
          html: "One pass through the entire training set — processing it in mini-batches — is called an <em>epoch</em>. Training typically runs for tens to hundreds of epochs, with the validation loss monitored to decide when to stop.",
        },
      ],
    },

    // ── PAGE 4 — Making training work ───────────────────────
    {
      badge: "Practical · Page 4",
      title: "Making Training Work",
      blocks: [
        {
          kind: "para",
          html: "A naive neural network often fails to train well. Several techniques — developed through decades of empirical research — make deep learning tractable.",
        },
        {
          kind: "heading",
          text: "Weight initialisation",
        },
        {
          kind: "para",
          html: "Initialise weights to zero and every neuron in a layer learns the same thing (symmetry). Initialise too large and activations explode; too small and gradients vanish. <em>Glorot (Xavier) initialisation</em> sets weights from a distribution scaled by the number of inputs and outputs, keeping gradients stable. Most frameworks use this or He initialisation (for ReLU) by default.",
        },
        {
          kind: "heading",
          text: "Batch normalisation",
        },
        {
          kind: "para",
          html: "After each linear layer, normalise the activations to zero mean and unit variance (over the mini-batch), then scale and shift with learned parameters \\(\\gamma\\) and \\(\\beta\\). Batch norm stabilises training, allows higher learning rates, and acts as a regulariser. It is now near-universal in deep networks.",
        },
        {
          kind: "heading",
          text: "Regularisation",
        },
        {
          kind: "table",
          headers: ["Technique", "What it does"],
          rows: [
            ["Dropout", "Randomly zeros a fraction of neurons during training — prevents co-adaptation"],
            ["L2 weight decay", "Penalises large weights — equivalent to a Gaussian prior on weights"],
            ["Early stopping", "Stop training when validation loss starts to rise"],
            ["Data augmentation", "Artificially increase training set diversity (images: flip, crop, rotate)"],
          ],
        },
        {
          kind: "callout",
          tone: "amber",
          title: "The vanishing gradient problem",
          html: "In very deep networks, gradients from the output layer shrink as they are multiplied by small numbers at each layer, becoming essentially zero by the time they reach early layers. Sigmoid and tanh activations saturate (derivative ≈ 0 for large inputs), making this worse. ReLU activations and residual connections (skip connections) largely solve this.",
        },
      ],
    },

    // ── PAGE 5 — Architecture choices ──────────────────────
    {
      badge: "Architecture · Page 5",
      title: "Beyond the MLP: Choosing an Architecture",
      blocks: [
        {
          kind: "para",
          html: "The fully connected (multilayer perceptron / MLP) architecture you have been studying is the foundation, but different data types call for different inductive biases — structural assumptions baked into the architecture.",
        },
        {
          kind: "table",
          headers: ["Data type", "Architecture", "Key idea"],
          rows: [
            ["Tabular / structured", "MLP (dense layers)", "No strong assumption about feature relationships"],
            ["Images", "Convolutional Neural Network (CNN)", "Local patterns + translation invariance"],
            ["Sequences (text, time series)", "Recurrent (RNN/LSTM) or Transformer", "Order matters; model temporal dependencies"],
            ["Graphs (molecules, social nets)", "Graph Neural Network (GNN)", "Message-passing over edges"],
          ],
        },
        {
          kind: "callout",
          tone: "teal",
          title: "Transfer learning",
          html: "Training a deep network from scratch requires huge datasets and compute. Transfer learning starts from a model pre-trained on a large dataset (e.g. ImageNet for vision, Wikipedia for text) and fine-tunes it on your smaller task. This is now the standard approach for any vision or NLP problem.",
        },
        {
          kind: "heading",
          text: "Practical starting point",
        },
        {
          kind: "para",
          html: "For tabular data: start with a gradient boosting model (often better for structured data). For images: use a pre-trained CNN backbone. For text: use a pre-trained transformer (BERT, GPT). Build from scratch only if you have a novel architecture reason and sufficient data.",
        },
        {
          kind: "callout",
          tone: "purple",
          title: "MLPs still matter",
          html: "Even in the era of transformers, MLPs appear everywhere as sub-components. The feed-forward sub-layers inside a transformer are dense MLPs. Understanding the MLP is the foundation for understanding everything else in deep learning.",
        },
      ],
    },
  ],

  // ═══════════════════════════════════════════════════════════
  //  QUIZ
  // ═══════════════════════════════════════════════════════════
  quiz: [
    {
      id: "nn-q1",
      question:
        "Why is a non-linear activation function essential in a neural network?",
      options: [
        "Without it, stacking multiple linear layers is equivalent to a single linear transformation",
        "It normalises each layer's output so the inputs to subsequent layers have zero mean",
        "It prevents gradients from becoming negative, which would cause weights to shrink during training",
        "It enables the network to share weights across spatial positions, reducing the parameter count"
      ],
      correctIndex: 0,
      explanation:
        "A composition of linear transformations is itself a linear transformation. Without activation functions, no matter how many layers you stack, the network can only learn linear functions. Non-linear activations like ReLU break this, allowing each layer to learn non-linear features.",
    },
    {
      id: "nn-q2",
      question:
        "Backpropagation computes gradients by applying the chain rule of calculus through the computational graph. In which direction does it propagate?",
      options: [
        "Alternating forward and backward passes until the gradient norm falls below a threshold",
        "From the input layer toward the output, mirroring the direction of the forward pass",
        "Starting from the middle hidden layers outward toward both the input and output simultaneously",
        "From the output (loss) backward toward the input layer"
      ],
      correctIndex: 3,
      explanation:
        "Backpropagation propagates the gradient of the loss backward — from the output layer, where the loss is computed, back through each hidden layer to the input. At each step it applies the chain rule to compute how each parameter contributed to the loss.",
    },
    {
      id: "nn-q3",
      question:
        "The vanishing gradient problem makes it difficult to train very deep networks. Which two innovations most directly address it?",
      options: [
        "ReLU activations and residual (skip) connections",
        "Larger batch sizes and adaptive learning rates — they reduce gradient noise and improve the signal-to-noise ratio",
        "Dropout and L2 regularisation — they prevent weights from growing, keeping gradients stable",
        "Batch normalisation and weight decay — they normalise activations to maintain a healthy gradient scale"
      ],
      correctIndex: 0,
      explanation:
        "ReLU has a constant gradient of 1 for positive inputs (unlike sigmoid/tanh which saturate), preventing gradient shrinkage. Residual connections add a shortcut from the input of a block directly to its output, providing a gradient highway that bypasses the layers and avoids multiplicative shrinkage across many layers.",
    },
    {
      id: "nn-q4",
      question:
        "You train a 10-layer neural network for 200 epochs and find it achieves 99% training accuracy but only 65% validation accuracy. What is the most likely diagnosis and fix?",
      options: [
        "A vanishing gradient — the 10-layer depth is causing gradients to die before reaching the input layers",
        "Overfitting — add regularisation (dropout, weight decay) or get more training data",
        "A data imbalance issue — the validation set likely has a different class distribution than the training set",
        "Underfitting caused by an insufficient number of layers — add more hidden layers to increase capacity"
      ],
      correctIndex: 1,
      explanation:
        "A large gap between training and validation accuracy is the hallmark of overfitting — the network has memorised the training data including its noise. Solutions include dropout, L2 weight decay, early stopping, data augmentation, or reducing model capacity.",
    },
    {
      id: "nn-q5",
      question:
        "Which output activation and loss function should you use for a 10-class image classification problem?",
      options: [
        "Tanh output + hinge loss, which encourages a large margin between the correct and incorrect class scores",
        "Softmax output + cross-entropy loss",
        "Sigmoid output + binary cross-entropy loss applied independently to each output neuron",
        "ReLU output + mean squared error loss to penalise large prediction errors"
      ],
      correctIndex: 1,
      explanation:
        "Softmax converts raw output scores (logits) into a valid probability distribution over classes (sums to 1, all positive). Cross-entropy loss measures how well the predicted distribution matches the true one-hot label. Together, they are the standard combination for multi-class classification.",
    },
  ],

  // ═══════════════════════════════════════════════════════════
  //  EXERCISES
  // ═══════════════════════════════════════════════════════════
  exercises: [
    {
      id: "nn-ex1",
      title: "Build and Train an MLP with scikit-learn",
      intro: "Use MLPClassifier to classify handwritten digits, experimenting with architecture and regularisation.",
      parts: [
        {
          id: "nn-ex1a",
          label: "a",
          prompt:
            "Load the digits dataset, split 80/20, and standardise. Fit a shallow MLP with one hidden layer of 64 neurons, relu activation, and max_iter=500. Print test accuracy rounded to 3 dp.",
          starterCode:
            "from sklearn.datasets import load_digits\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.neural_network import MLPClassifier\n\ndigits = load_digits()\nX_train, X_test, y_train, y_test = train_test_split(\n    digits.data, digits.target, test_size=0.2, random_state=42\n)\n\nscaler = StandardScaler()\nX_train = scaler.fit_transform(X_train)\nX_test = scaler.transform(X_test)\n\nmlp = MLPClassifier(hidden_layer_sizes=(64,), activation='relu', max_iter=500, random_state=42)\nmlp.fit(X_train, y_train)\nprint(round(mlp.score(X_test, y_test), 3))",
          expectedStdout: "0.981",
          hints: [
            "`hidden_layer_sizes=(64,)` creates a single hidden layer with 64 neurons.",
            "Always scale inputs before training a neural network.",
          ],
          solution:
            "from sklearn.datasets import load_digits\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.neural_network import MLPClassifier\n\ndigits = load_digits()\nX_train, X_test, y_train, y_test = train_test_split(\n    digits.data, digits.target, test_size=0.2, random_state=42\n)\n\nscaler = StandardScaler()\nX_train = scaler.fit_transform(X_train)\nX_test = scaler.transform(X_test)\n\nmlp = MLPClassifier(hidden_layer_sizes=(64,), activation='relu', max_iter=500, random_state=42)\nmlp.fit(X_train, y_train)\nprint(round(mlp.score(X_test, y_test), 3))",
        },
        {
          id: "nn-ex1b",
          label: "b",
          prompt:
            "Add a second hidden layer (128, 64 neurons) and L2 regularisation (alpha=0.01). Print test accuracy rounded to 3 dp. Then print 'Deeper:' followed by the value.",
          starterCode:
            "from sklearn.datasets import load_digits\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.neural_network import MLPClassifier\n\ndigits = load_digits()\nX_train, X_test, y_train, y_test = train_test_split(\n    digits.data, digits.target, test_size=0.2, random_state=42\n)\nscaler = StandardScaler()\nX_train = scaler.fit_transform(X_train)\nX_test = scaler.transform(X_test)\n\nmlp2 = MLPClassifier(\n    hidden_layer_sizes=(128, 64),\n    activation='relu',\n    alpha=0.01,\n    max_iter=500,\n    random_state=42\n)\nmlp2.fit(X_train, y_train)\nprint('Deeper:', round(mlp2.score(X_test, y_test), 3))",
          expectedStdout: "Deeper: 0.983",
          hints: [
            "`hidden_layer_sizes=(128, 64)` creates two hidden layers.",
            "`alpha` is the L2 regularisation coefficient in scikit-learn's MLPClassifier.",
          ],
          solution:
            "from sklearn.datasets import load_digits\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.neural_network import MLPClassifier\n\ndigits = load_digits()\nX_train, X_test, y_train, y_test = train_test_split(\n    digits.data, digits.target, test_size=0.2, random_state=42\n)\nscaler = StandardScaler()\nX_train = scaler.fit_transform(X_train)\nX_test = scaler.transform(X_test)\n\nmlp2 = MLPClassifier(\n    hidden_layer_sizes=(128, 64),\n    activation='relu',\n    alpha=0.01,\n    max_iter=500,\n    random_state=42\n)\nmlp2.fit(X_train, y_train)\nprint('Deeper:', round(mlp2.score(X_test, y_test), 3))",
        },
      ],
    },
    {
      id: "nn-ex2",
      title: "Manual Forward Pass",
      intro: "Implement the forward pass for a tiny two-layer network to cement the mechanics.",
      parts: [
        {
          id: "nn-ex2a",
          label: "a",
          prompt:
            "Implement `relu(z)` and `softmax(z)` functions, then compute the forward pass for input x=[1.0, -0.5], W1 (2×3), b1 (3,), W2 (3×2), b2 (2,) with given weights. Print the softmax output rounded to 4 dp.",
          starterCode:
            "import numpy as np\n\ndef relu(z):\n    return np.maximum(0, z)\n\ndef softmax(z):\n    e = np.exp(z - np.max(z))  # numerical stability\n    return e / e.sum()\n\nx = np.array([1.0, -0.5])\nW1 = np.array([[0.5, -0.2, 0.1], [0.3, 0.8, -0.4]])\nb1 = np.array([0.1, -0.1, 0.2])\nW2 = np.array([[0.6, -0.3], [0.2, 0.5], [-0.1, 0.4]])\nb2 = np.array([0.0, 0.1])\n\nh = relu(W1.T @ x + b1)\ny_hat = softmax(W2.T @ h + b2)\nprint(np.round(y_hat, 4))",
          expectedStdout: "[0.4281 0.5719]",
          hints: [
            "The hidden layer: h = relu(W1.T @ x + b1)  [shape: (3,)]",
            "The output: W2 has shape (3, 2), so W2.T @ h gives shape (2,). Add b2 then apply softmax.",
          ],
          solution:
            "import numpy as np\n\ndef relu(z):\n    return np.maximum(0, z)\n\ndef softmax(z):\n    e = np.exp(z - np.max(z))\n    return e / e.sum()\n\nx = np.array([1.0, -0.5])\nW1 = np.array([[0.5, -0.2, 0.1], [0.3, 0.8, -0.4]])\nb1 = np.array([0.1, -0.1, 0.2])\nW2 = np.array([[0.6, -0.3], [0.2, 0.5], [-0.1, 0.4]])\nb2 = np.array([0.0, 0.1])\n\nh = relu(W1.T @ x + b1)\ny_hat = softmax(W2.T @ h + b2)\nprint(np.round(y_hat, 4))",
        },
      ],
    },
  ],

  // ═══════════════════════════════════════════════════════════
  //  CHEAT SHEET
  // ═══════════════════════════════════════════════════════════
  cheatsheet: [
    {
      heading: "Architecture",
      items: [
        {
          term: "Neuron",
          note: "Computes z = Wx + b, outputs g(z) where g is the activation function",
          formula: "\\hat{y} = g(\\mathbf{W}\\mathbf{x} + \\mathbf{b})",
        },
        {
          term: "Hidden layers",
          note: "Intermediate layers that learn representations; 'deep' = more than one",
        },
        {
          term: "Depth vs width",
          note: "More layers → hierarchical features; more neurons/layer → richer representations",
        },
      ],
    },
    {
      heading: "Activation Functions",
      items: [
        {
          term: "ReLU",
          note: "max(0, z) — default for hidden layers; fast, sparse, avoids vanishing gradient",
          formula: "\\text{ReLU}(z) = \\max(0, z)",
        },
        {
          term: "Sigmoid",
          note: "1/(1+e^{−z}) — binary classification output; saturates for large |z|",
        },
        {
          term: "Softmax",
          note: "Multi-class output; converts logits to probabilities summing to 1",
          formula: "\\hat{y}_c = \\frac{e^{z_c}}{\\sum_j e^{z_j}}",
        },
        {
          term: "Tanh",
          note: "Output in (−1, 1) — can outperform sigmoid for hidden layers",
        },
      ],
    },
    {
      heading: "Training",
      items: [
        {
          term: "Loss (classification)",
          note: "Cross-entropy: −Σ yc log ŷc",
          formula: "\\mathcal{L} = -\\sum_c y_c \\log \\hat{y}_c",
        },
        {
          term: "Backpropagation",
          note: "Chain rule applied backward through layers to compute ∂L/∂w for every weight",
        },
        {
          term: "Gradient descent",
          note: "w ← w − η · ∂L/∂w; learning rate η controls step size",
        },
        {
          term: "Adam optimiser",
          note: "Adaptive per-parameter learning rates — default choice; lr ≈ 1e-3",
        },
      ],
    },
    {
      heading: "Regularisation",
      items: [
        {
          term: "Dropout",
          note: "Zero random neurons (rate 0.2–0.5) during training; all active at test time",
        },
        {
          term: "L2 weight decay",
          note: "Add λ||w||² to loss; penalises large weights; sklearn param: alpha",
        },
        {
          term: "Batch normalisation",
          note: "Normalise activations per mini-batch; stabilises training, acts as regulariser",
        },
        {
          term: "Early stopping",
          note: "Stop when validation loss stops improving; saves the best checkpoint",
        },
      ],
    },
  ],
};
