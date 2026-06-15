import { Subject } from "./types";

export const calculusOptimization: Subject = {
  slug: "calculus-optimization",
  title: "Calculus & Optimization",
  icon: "calculus",
  phase: 0,
  blurb:
    "How models learn. Derivatives, gradients, and gradient descent — the machinery that turns 'minimise the error' from a wish into an algorithm.",
  sources: [
    "Deisenroth, Faisal & Ong — Mathematics for Machine Learning, Ch. 5–7",
    "Boyd & Vandenberghe — Convex Optimization, Ch. 1, 9",
    "Goodfellow, Bengio & Courville — Deep Learning, Ch. 4",
    "Nocedal & Wright — Numerical Optimization (reference)",
  ],

  theory: [
    {
      badge: "Intuition · Page 1",
      title: "Learning Is Just Minimisation",
      blocks: [
        {
          kind: "para",
          html: "Strip away the jargon and almost every machine learning model does one thing: it adjusts its internal numbers to make its predictions as close to the truth as possible. \"As close as possible\" means minimising an error. And minimising a function — finding its lowest point — is the central problem of calculus and optimisation.",
        },
        {
          kind: "para",
          html: "Picture the model's error as a landscape: hills where the model predicts badly, valleys where it predicts well. Training is the act of walking downhill to the lowest valley. The question is: standing on this landscape, blindfolded, which way is down? Calculus answers that question precisely, and gradient descent turns the answer into an algorithm.",
        },
        {
          kind: "callout",
          tone: "purple",
          title: "Why this comes first",
          html: "Linear regression, logistic regression, neural networks, and gradient-boosted trees are all trained by minimising a loss function. Backpropagation — the algorithm behind all of deep learning — is just the chain rule from calculus applied at scale. Understanding derivatives and gradients is understanding how learning happens.",
        },
      ],
    },
    {
      badge: "Foundations · Page 2",
      title: "The Derivative: Slope and Direction",
      blocks: [
        {
          kind: "para",
          html: "The <em>derivative</em> of a function at a point is its slope there — how fast the output changes as you nudge the input. A positive derivative means the function is rising; negative means falling; zero means you are at a flat point, possibly a minimum or maximum.",
        },
        {
          kind: "equation",
          label: "The derivative as a limit",
          tex: "f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}",
        },
        {
          kind: "para",
          html: "This is the key insight for learning: the derivative tells you which way to move to change the output. If you want to <em>decrease</em> the error, move in the direction <em>opposite</em> the derivative — downhill. The steeper the slope, the bigger the step you can safely take.",
        },
        {
          kind: "heading",
          text: "The chain rule",
        },
        {
          kind: "para",
          html: "Real models are functions of functions of functions — a neural network is dozens of layers nested inside each other. The <em>chain rule</em> tells us how to differentiate such compositions: multiply the derivatives of each layer together.",
        },
        {
          kind: "equation",
          label: "The chain rule",
          tex: "\\frac{d}{dx}f(g(x)) = f'(g(x)) \\cdot g'(x)",
        },
        {
          kind: "callout",
          tone: "amber",
          title: "Why the chain rule is everything",
          html: "Backpropagation — the algorithm that trains every neural network — is nothing more than the chain rule applied systematically backwards through the network's layers. When people say deep learning is \"just calculus,\" this is what they mean. Master the chain rule and backprop becomes obvious rather than mysterious.",
        },
      ],
    },
    {
      badge: "Foundations · Page 3",
      title: "Gradients: Calculus in Many Dimensions",
      blocks: [
        {
          kind: "para",
          html: "A model has not one parameter but thousands or billions. The derivative generalises to many dimensions as the <em>gradient</em>: a vector holding the partial derivative with respect to each parameter — the slope along every axis at once.",
        },
        {
          kind: "equation",
          label: "The gradient",
          tex: "\\nabla f = \\left[\\frac{\\partial f}{\\partial x_1}, \\frac{\\partial f}{\\partial x_2}, \\dots, \\frac{\\partial f}{\\partial x_n}\\right]",
        },
        {
          kind: "para",
          html: "The gradient points in the direction of <em>steepest ascent</em> — the fastest way uphill. To minimise error, we go the opposite way: <em>steepest descent</em>. This single geometric fact is the foundation of how nearly every model is trained.",
        },
        {
          kind: "callout",
          tone: "teal",
          title: "A partial derivative, intuitively",
          html: "A <em>partial derivative</em> asks: if I nudge just this one parameter and freeze all the others, how does the error change? Computing one per parameter and stacking them gives the gradient. It tells you, for every knob in the model simultaneously, which way to turn it to reduce error.",
        },
      ],
    },
    {
      badge: "Algorithm · Page 4",
      title: "Gradient Descent",
      blocks: [
        {
          kind: "para",
          html: "Gradient descent is the algorithm that puts it all together. Start with random parameters. Compute the gradient of the loss. Take a small step in the opposite direction. Repeat until you reach a valley. That is the entire training loop of most of machine learning.",
        },
        {
          kind: "equation",
          label: "The gradient descent update",
          tex: "\\theta \\leftarrow \\theta - \\eta\\,\\nabla L(\\theta)",
        },
        {
          kind: "para",
          html: "Here \\(\\theta\\) are the parameters, \\(\\nabla L\\) is the gradient of the loss, and \\(\\eta\\) (eta) is the <em>learning rate</em> — the step size. The learning rate is the most important and most temperamental setting in the algorithm.",
        },
        {
          kind: "callout",
          tone: "red",
          title: "The learning rate dilemma",
          html: "Too large, and you leap over the valley and bounce around or diverge to infinity. Too small, and training crawls, taking forever to converge or stalling on a plateau. Tuning the learning rate is one of the first things you learn to do in practice — and adaptive methods like Adam exist largely to make this less painful.",
        },
        {
          kind: "heading",
          text: "Variants you will meet",
        },
        {
          kind: "table",
          headers: ["Variant", "How it computes the gradient", "Trade-off"],
          rows: [
            ["Batch GD", "Over the entire dataset each step", "Stable but slow on big data"],
            ["Stochastic GD", "One random sample per step", "Fast, noisy, can escape shallow valleys"],
            ["Mini-batch GD", "A small batch (32–512) per step", "The practical default; balances both"],
            ["Adam", "Adaptive per-parameter step sizes", "Robust default for deep learning"],
          ],
        },
      ],
    },
    {
      badge: "Application · Page 5",
      title: "Convexity & the Shape of Learning",
      blocks: [
        {
          kind: "para",
          html: "Whether gradient descent finds the <em>best</em> answer depends on the shape of the loss landscape.",
        },
        {
          kind: "para",
          html: "A <em>convex</em> function is bowl-shaped: it has a single global minimum, and gradient descent is guaranteed to find it from any starting point. Linear and logistic regression have convex losses — there is one right answer and the algorithm will reach it.",
        },
        {
          kind: "callout",
          tone: "amber",
          title: "Non-convexity and deep learning",
          html: "Neural networks have <em>non-convex</em> losses — landscapes riddled with many local minima, saddle points, and plateaus. There is no guarantee of finding the global minimum. Remarkably, this turns out not to matter much in practice: for large networks, most local minima are nearly as good as the global one, and the failure mode is more often a saddle point or a bad learning rate than a poor minimum.",
        },
        {
          kind: "table",
          headers: ["Concept", "Where it appears in ML"],
          rows: [
            ["Derivative / gradient", "The signal that tells every model how to improve"],
            ["Chain rule", "Backpropagation through neural network layers"],
            ["Gradient descent", "The training loop of nearly every model"],
            ["Learning rate", "The key hyperparameter you tune first"],
            ["Convexity", "Why linear models have one solution and nets do not"],
          ],
        },
        {
          kind: "callout",
          tone: "teal",
          title: "What to carry forward",
          html: "Learning is minimising a loss. The derivative says which way is downhill; the gradient does this for all parameters at once. Gradient descent steps downhill repeatedly, governed by the learning rate. The chain rule makes this work through deep compositions — that is backpropagation. Everything in training is a variation on this.",
        },
      ],
    },
  ],

  quiz: [
    {
      id: "co-q1",
      question: "What does the derivative of a function at a point tell you?",
      options: [
        "The value of the function there",
        "The slope — how fast the output changes, and thus which way is uphill or downhill",
        "The number of minima the function has",
        "Whether the function is positive",
      ],
      correctIndex: 1,
      explanation:
        "The derivative is the slope. Its sign tells you whether the function rises or falls, and to reduce a value you move opposite the derivative — downhill. This is the core of gradient descent.",
    },
    {
      id: "co-q2",
      question: "Backpropagation in neural networks is fundamentally an application of what?",
      options: [
        "Matrix inversion",
        "The chain rule, applied backwards through the network's layers",
        "Bayes' theorem",
        "The Central Limit Theorem",
      ],
      correctIndex: 1,
      explanation:
        "A network is a composition of many functions. Backpropagation computes the gradient by applying the chain rule systematically from output to input — multiplying layer derivatives together.",
    },
    {
      id: "co-q3",
      question: "What does the gradient of a loss function point toward?",
      options: [
        "The global minimum directly",
        "The direction of steepest ascent — so we step opposite it to minimise",
        "The largest parameter",
        "A random direction",
      ],
      correctIndex: 1,
      explanation:
        "The gradient points uphill (steepest ascent). To minimise loss, gradient descent steps in the opposite direction. This single fact drives the training of most models.",
    },
    {
      id: "co-q4",
      question: "What happens if the learning rate is set too high?",
      options: [
        "Training becomes very slow but always succeeds",
        "Steps overshoot the minimum; training may bounce around or diverge",
        "The model uses less memory",
        "The gradient becomes zero",
      ],
      correctIndex: 1,
      explanation:
        "Too large a learning rate causes steps that leap past the valley, leading to oscillation or divergence to infinity. Too small crawls. Tuning it is among the first practical skills you develop.",
    },
    {
      id: "co-q5",
      question:
        "Why is the non-convex loss of a neural network usually not a fatal problem in practice?",
      options: [
        "Neural networks are actually convex",
        "For large networks, most local minima are nearly as good as the global minimum",
        "Gradient descent always finds the global minimum anyway",
        "Non-convex functions have no minima",
      ],
      correctIndex: 1,
      explanation:
        "Although non-convex losses have many local minima, empirically most are nearly as good as the global one for large networks. The more common obstacles are saddle points and poor learning rates, not bad minima.",
    },
  ],

  exercises: [
    {
      id: "co-ex1",
      title: "Derivatives and Gradient Descent by Hand",
      intro:
        "Compute a numerical derivative, then implement gradient descent from scratch — step by step.",
      parts: [
        {
          id: "co-ex1-a",
          label: "a",
          prompt:
            "Numerically estimate the derivative of f(x) = x² at x = 3 using the central difference (f(x+h) - f(x-h)) / (2h) with h = 1e-6. Print the result rounded to the nearest integer. (Expected: 6)",
          starterCode:
            "f = lambda x: x**2\nh = 1e-6\n\n# YOUR CODE HERE\n",
          expectedStdout: "6",
          hints: [
            "Central difference: (f(3+h) - f(3-h)) / (2*h)",
            "The true derivative of x² is 2x, so at x=3 it should be 6.",
            "print(round((f(3+h) - f(3-h)) / (2*h)))",
          ],
          solution:
            "f = lambda x: x**2\nh = 1e-6\nprint(round((f(3+h) - f(3-h)) / (2*h)))",
        },
        {
          id: "co-ex1-b",
          label: "b",
          prompt:
            "Minimise (x - 4)² with gradient descent. The gradient is 2*(x - 4). Start at x = 0, learning rate 0.1, run 100 iterations, then print x rounded to 2 decimals. (Expected: 4.0)",
          starterCode:
            "x = 0.0\nlr = 0.1\n\n# YOUR CODE HERE\n",
          expectedStdout: "4.0",
          hints: [
            "The gradient of (x-4)² is 2*(x-4).",
            "Each step: x = x - lr * 2*(x - 4)",
            "After the loop: print(round(x, 2)) — it converges to the minimum at 4.",
          ],
          solution:
            "x = 0.0\nlr = 0.1\nfor _ in range(100):\n    x = x - lr * 2*(x - 4)\nprint(round(x, 2))",
        },
      ],
    },
  ],

  cheatsheet: [
    {
      heading: "Derivatives",
      items: [
        { term: "Derivative", note: "Slope of a function; rate of change.", formula: "f'(x)=\\lim_{h\\to0}\\tfrac{f(x+h)-f(x)}{h}" },
        { term: "Sign meaning", note: "Positive → rising, negative → falling, zero → flat point." },
        { term: "Chain rule", note: "Differentiate compositions by multiplying derivatives.", formula: "\\tfrac{d}{dx}f(g(x))=f'(g(x))g'(x)" },
        { term: "Backprop", note: "The chain rule applied backwards through network layers." },
      ],
    },
    {
      heading: "Gradients",
      items: [
        { term: "Gradient", note: "Vector of partial derivatives; slope along every axis.", formula: "\\nabla f=[\\partial f/\\partial x_1,\\dots]" },
        { term: "Partial derivative", note: "Change in output from nudging one parameter, others fixed." },
        { term: "Steepest ascent", note: "The gradient points uphill; step opposite to minimise." },
      ],
    },
    {
      heading: "Gradient Descent",
      items: [
        { term: "Update rule", note: "Step downhill by the gradient scaled by learning rate.", formula: "\\theta \\leftarrow \\theta - \\eta\\nabla L" },
        { term: "Learning rate η", note: "Step size. Too big diverges; too small crawls." },
        { term: "Batch / SGD / Mini-batch", note: "Gradient over all / one / a small batch of samples." },
        { term: "Adam", note: "Adaptive per-parameter step sizes; robust default." },
      ],
    },
    {
      heading: "Landscape",
      items: [
        { term: "Convex", note: "Bowl-shaped; one global minimum (linear/logistic regression)." },
        { term: "Non-convex", note: "Many local minima/saddles (neural networks)." },
        { term: "Saddle point", note: "Flat in some directions, sloped in others; a common stall." },
        { term: "In practice", note: "Most local minima of big nets are nearly as good as global." },
      ],
    },
  ],
};