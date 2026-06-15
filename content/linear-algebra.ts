import { Subject } from "./types";

export const linearAlgebra: Subject = {
  slug: "linear-algebra",
  title: "Linear Algebra",
  icon: "matrix",
  phase: 0,
  blurb:
    "The language every model speaks. Vectors, matrices, dot products, and eigenvalues — the operations that turn data into computation and computation into prediction.",
  sources: [
    "Strang, G. — Introduction to Linear Algebra, 5th ed.",
    "Deisenroth, Faisal & Ong — Mathematics for Machine Learning, Ch. 2–4",
    "Hastie, Tibshirani & Friedman — ESL, Appendix",
    "3Blue1Brown — Essence of Linear Algebra (visual companion)",
  ],

  theory: [
    {
      badge: "Intuition · Page 1",
      title: "Why Data Lives in Vectors",
      blocks: [
        {
          kind: "para",
          html: "Every dataset is secretly a grid of numbers. A spreadsheet of customers, each with an age, income, and tenure, is a table — and a table is a <em>matrix</em>. Each customer is a row, a <em>vector</em> of three numbers, a single point in three-dimensional space. Linear algebra is the mathematics of these grids: how to combine them, transform them, and extract structure from them.",
        },
        {
          kind: "para",
          html: "This is not a convenient analogy — it is how computation actually happens. When a neural network makes a prediction, it multiplies matrices. When you reduce a thousand features to ten, you are projecting vectors. When a recommendation system finds similar users, it measures angles between vectors. Linear algebra is the engine under nearly every model.",
        },
        {
          kind: "callout",
          tone: "purple",
          title: "Why this comes first",
          html: "Speed and scale in machine learning come from expressing operations as matrix arithmetic, which modern hardware (GPUs) executes massively in parallel. A model written as loops is slow; the same model written as matrix multiplications is thousands of times faster. Understanding linear algebra is understanding how models actually run.",
        },
      ],
    },
    {
      badge: "Foundations · Page 2",
      title: "Vectors and Their Operations",
      blocks: [
        {
          kind: "para",
          html: "A <em>vector</em> is an ordered list of numbers — but also a point in space, and an arrow from the origin to that point. Both views matter: the list is how we store it, the arrow is how we reason about it.",
        },
        {
          kind: "heading",
          text: "The dot product",
        },
        {
          kind: "para",
          html: "The single most important operation is the <em>dot product</em>: multiply corresponding entries and sum them. It collapses two vectors into one number that measures how much they point in the same direction.",
        },
        {
          kind: "equation",
          label: "Dot product",
          tex: "\\mathbf{a} \\cdot \\mathbf{b} = \\sum_{i=1}^{n} a_i b_i = a_1 b_1 + a_2 b_2 + \\dots + a_n b_n",
        },
        {
          kind: "para",
          html: "The dot product also equals \\(\\|\\mathbf{a}\\|\\,\\|\\mathbf{b}\\|\\cos\\theta\\), linking it to the <em>angle</em> between the vectors. When the dot product is zero, the vectors are perpendicular (orthogonal); when large and positive, they point the same way. This is why <em>cosine similarity</em> — the cornerstone of search and recommendation — is just a normalised dot product.",
        },
        {
          kind: "heading",
          text: "Length (norm)",
        },
        {
          kind: "para",
          html: "A vector's <em>norm</em> is its length — the square root of its dot product with itself. The L2 norm (Euclidean distance) measures straight-line length; the L1 norm sums absolute values. These reappear directly as the L2 and L1 penalties in ridge and lasso regression.",
        },
        {
          kind: "equation",
          label: "L2 norm (Euclidean length)",
          tex: "\\|\\mathbf{a}\\| = \\sqrt{\\mathbf{a} \\cdot \\mathbf{a}} = \\sqrt{\\sum_{i=1}^{n} a_i^2}",
        },
      ],
    },
    {
      badge: "Foundations · Page 3",
      title: "Matrices as Transformations",
      blocks: [
        {
          kind: "para",
          html: "A <em>matrix</em> is a grid of numbers, but its deeper meaning is as a <em>transformation</em>: a function that takes a vector and returns a new vector — rotating, stretching, or projecting it. Multiplying a matrix by a vector applies that transformation.",
        },
        {
          kind: "heading",
          text: "Matrix multiplication",
        },
        {
          kind: "para",
          html: "Matrix multiplication is built entirely from dot products: each entry of the result is the dot product of a row from the first matrix with a column from the second. The inner dimensions must match — an \\(m\\times n\\) matrix times an \\(n\\times p\\) matrix gives an \\(m\\times p\\) result.",
        },
        {
          kind: "equation",
          label: "Matrix product (entry form)",
          tex: "(AB)_{ij} = \\sum_{k} A_{ik} B_{kj}",
        },
        {
          kind: "callout",
          tone: "amber",
          title: "Order matters",
          html: "Unlike ordinary multiplication, \\(AB \\neq BA\\) in general — matrix multiplication is not commutative. Applying a rotation then a stretch is different from a stretch then a rotation. Dimension mismatches are also the single most common bug in ML code; always track the shapes.",
        },
        {
          kind: "heading",
          text: "Special matrices",
        },
        {
          kind: "para",
          html: "The <em>identity matrix</em> \\(I\\) leaves vectors unchanged (the number 1 of matrices). The <em>transpose</em> \\(A^\\top\\) flips rows and columns. The <em>inverse</em> \\(A^{-1}\\) undoes a transformation — and appears directly in the normal equation that solves linear regression: \\((X^\\top X)^{-1}X^\\top y\\).",
        },
      ],
    },
    {
      badge: "Structure · Page 4",
      title: "Eigenvalues & Dimensionality",
      blocks: [
        {
          kind: "para",
          html: "Some directions are special to a matrix: when the transformation is applied, vectors pointing in those directions are only stretched or shrunk, never rotated. These are the <em>eigenvectors</em>, and the factor by which each is scaled is its <em>eigenvalue</em>.",
        },
        {
          kind: "equation",
          label: "The eigenvalue equation",
          tex: "A\\mathbf{v} = \\lambda \\mathbf{v}",
        },
        {
          kind: "para",
          html: "Eigenvectors reveal a matrix's intrinsic structure — its natural axes. This is not abstract: <em>Principal Component Analysis</em>, the standard method for reducing high-dimensional data, finds the eigenvectors of the data's covariance matrix. The eigenvector with the largest eigenvalue is the direction of greatest variance — the most informative axis in the data.",
        },
        {
          kind: "callout",
          tone: "teal",
          title: "Why this powers dimensionality reduction",
          html: "Real datasets often have hundreds of features but only a few directions of genuine variation. Eigenvectors find those directions, letting you compress a 500-feature dataset into 10 components that capture most of the information — faster models, less noise, and data you can actually visualise.",
        },
        {
          kind: "callout",
          tone: "red",
          title: "When matrices misbehave",
          html: "A matrix with an eigenvalue of zero is <em>singular</em> — it collapses space and cannot be inverted. In regression this happens with perfectly correlated features (multicollinearity), which is why such features break the normal equation. Near-zero eigenvalues cause numerical instability even when inversion technically succeeds.",
        },
      ],
    },
    {
      badge: "Application · Page 5",
      title: "Linear Algebra in Every Model",
      blocks: [
        {
          kind: "para",
          html: "These operations are not background mathematics — they are literally what models compute. Here is where each piece resurfaces.",
        },
        {
          kind: "table",
          headers: ["Operation", "Appears in"],
          rows: [
            ["Dot product", "Every neuron; cosine similarity; linear predictions"],
            ["Matrix multiplication", "Neural network forward passes; batch prediction"],
            ["Matrix inverse", "The normal equation solving linear regression"],
            ["Eigenvectors", "PCA and dimensionality reduction"],
            ["Norms (L1, L2)", "Lasso and ridge regularisation penalties"],
            ["Transpose", "Reshaping data; the Gram matrix XᵀX"],
          ],
        },
        {
          kind: "callout",
          tone: "teal",
          title: "Vectorisation: the practical payoff",
          html: "Writing operations as matrix arithmetic instead of explicit loops — <em>vectorisation</em> — is the difference between code that runs in seconds and code that runs in hours. NumPy, PyTorch, and TensorFlow are all built around this. Thinking in vectors and matrices is not just mathematically elegant; it is how you write fast code.",
        },
        {
          kind: "callout",
          tone: "amber",
          title: "What to carry forward",
          html: "Data is vectors and matrices. The dot product measures alignment and is the atom of all the rest. Matrices transform space. Eigenvectors find a matrix's natural axes and power dimensionality reduction. Track your shapes, and prefer matrix operations to loops.",
        },
      ],
    },
  ],

  quiz: [
    {
      id: "la-q1",
      question: "What does the dot product of two vectors measure?",
      options: [
        "The number of elements they share",
        "How much the two vectors point in the same direction (related to the angle between them)",
        "The longer of the two vectors",
        "Whether the vectors are equal",
      ],
      correctIndex: 1,
      explanation:
        "The dot product equals |a||b|cosθ, so it measures alignment. Zero means perpendicular; large positive means same direction. This is the basis of cosine similarity used in search and recommendation.",
    },
    {
      id: "la-q2",
      question: "Why is matrix multiplication central to machine learning performance?",
      options: [
        "It is the only operation computers can do",
        "Expressing models as matrix operations lets hardware (GPUs) run them massively in parallel",
        "It avoids using any memory",
        "It removes the need for data",
      ],
      correctIndex: 1,
      explanation:
        "Vectorising computation as matrix multiplication lets GPUs execute it in parallel, making models thousands of times faster than equivalent loop-based code. This is why deep learning runs on GPUs.",
    },
    {
      id: "la-q3",
      question: "What is special about a matrix's eigenvectors?",
      options: [
        "They are always the rows of the matrix",
        "When the matrix transformation is applied, they are only scaled (by the eigenvalue), not rotated",
        "They always have length one and point up",
        "They are the largest numbers in the matrix",
      ],
      correctIndex: 1,
      explanation:
        "An eigenvector v satisfies Av = λv: the transformation only stretches or shrinks it by the eigenvalue λ. Eigenvectors reveal a matrix's natural axes — exactly what PCA exploits.",
    },
    {
      id: "la-q4",
      question:
        "In regression, why do perfectly correlated features break the normal equation (XᵀX)⁻¹Xᵀy?",
      options: [
        "They make the dataset too large",
        "They make XᵀX singular (an eigenvalue of zero), so it cannot be inverted",
        "They change the units of the target",
        "They make the dot product negative",
      ],
      correctIndex: 1,
      explanation:
        "Collinear features make XᵀX singular — it has a zero eigenvalue and collapses space, so no inverse exists. Near-collinearity causes numerical instability even when inversion nominally succeeds.",
    },
    {
      id: "la-q5",
      question: "What does 'vectorisation' mean in practice?",
      options: [
        "Converting text into vectors",
        "Replacing explicit loops with matrix/array operations for speed",
        "Drawing vectors as arrows",
        "Adding more features to the data",
      ],
      correctIndex: 1,
      explanation:
        "Vectorisation expresses computation as array/matrix operations rather than Python loops. Libraries like NumPy execute these in optimised low-level code, turning hours of computation into seconds.",
    },
  ],

  exercises: [
    {
      id: "la-ex1",
      title: "Vector and Matrix Operations with NumPy",
      intro:
        "Practise the core operations — dot products, matrix multiplication, and the determinant — step by step.",
      parts: [
        {
          id: "la-ex1-a",
          label: "a",
          prompt:
            "Given a = [1, 2, 3] and b = [4, 5, 6] as numpy arrays, compute and print their dot product as an integer. (Expected: 32)",
          starterCode:
            "import numpy as np\na = np.array([1, 2, 3])\nb = np.array([4, 5, 6])\n\n# YOUR CODE HERE\n",
          expectedStdout: "32",
          hints: ["np.dot(a, b) multiplies corresponding entries and sums.", "print(int(np.dot(a, b)))"],
          solution:
            "import numpy as np\na = np.array([1, 2, 3])\nb = np.array([4, 5, 6])\nprint(int(np.dot(a, b)))",
        },
        {
          id: "la-ex1-b",
          label: "b",
          prompt:
            "Create matrix A = [[1, 2], [3, 4]]. Multiply A by itself (A @ A) and print the shape of the result. (Expected: (2, 2))",
          starterCode:
            "A = np.array([[1, 2], [3, 4]])\n\n# YOUR CODE HERE\n",
          expectedStdout: "(2, 2)",
          hints: ["The @ operator performs matrix multiplication.", "print((A @ A).shape)"],
          solution: "A = np.array([[1, 2], [3, 4]])\nprint((A @ A).shape)",
        },
        {
          id: "la-ex1-c",
          label: "c",
          prompt:
            "Compute the determinant of A = [[1, 2], [3, 4]] and print it rounded to 1 decimal. (Expected: -2.0)",
          starterCode:
            "# YOUR CODE HERE\n",
          expectedStdout: "-2.0",
          hints: [
            "np.linalg.det(A) computes the determinant.",
            "print(round(float(np.linalg.det(A)), 1))",
          ],
          solution: "print(round(float(np.linalg.det(A)), 1))",
        },
      ],
    },
  ],

  cheatsheet: [
    {
      heading: "Vectors",
      items: [
        { term: "Vector", note: "Ordered list of numbers; a point/arrow in space." },
        { term: "Dot product", note: "Sum of products of entries; measures alignment.", formula: "\\mathbf{a}\\cdot\\mathbf{b}=\\sum a_i b_i" },
        { term: "Angle link", note: "a·b = ‖a‖‖b‖cosθ. Zero → perpendicular." },
        { term: "Cosine similarity", note: "Normalised dot product; the basis of search/recommendation." },
        { term: "L2 norm", note: "Euclidean length of a vector.", formula: "\\|\\mathbf{a}\\|=\\sqrt{\\sum a_i^2}" },
      ],
    },
    {
      heading: "Matrices",
      items: [
        { term: "Matrix", note: "Grid of numbers; a transformation of space." },
        { term: "Multiplication", note: "Each entry is a row·column dot product.", formula: "(AB)_{ij}=\\sum_k A_{ik}B_{kj}" },
        { term: "Not commutative", note: "AB ≠ BA in general; order matters." },
        { term: "Identity / Transpose", note: "I leaves vectors unchanged; Aᵀ flips rows/cols." },
        { term: "Inverse", note: "Undoes a transformation; appears in the normal equation." },
      ],
    },
    {
      heading: "Structure",
      items: [
        { term: "Eigenvector", note: "Direction only scaled, not rotated, by the matrix.", formula: "A\\mathbf{v}=\\lambda\\mathbf{v}" },
        { term: "Eigenvalue", note: "The scaling factor λ for its eigenvector." },
        { term: "PCA link", note: "Eigenvectors of the covariance matrix = principal components." },
        { term: "Singular matrix", note: "Zero eigenvalue; cannot be inverted (collinearity)." },
      ],
    },
    {
      heading: "In ML",
      items: [
        { term: "Forward pass", note: "Neural nets multiply matrices layer by layer." },
        { term: "Normal equation", note: "Regression solution uses a matrix inverse." },
        { term: "L1 / L2 norms", note: "Lasso and ridge regularisation penalties." },
        { term: "Vectorisation", note: "Replace loops with matrix ops for huge speedups." },
      ],
    },
  ],
};