import { Subject } from "./types";

export const convolutionalNeuralNetworks: Subject = {
  slug: "convolutional-neural-networks",
  title: "Convolutional Neural Networks",
  icon: "cnn",
  phase: 4,
  blurb:
    "The architecture that made deep learning work for images. CNNs exploit local structure and translation invariance to learn visual features — from edges and textures up to faces and objects — with far fewer parameters than a dense network.",
  sources: [
    "LeCun, Bottou, Bengio & Haffner — Gradient-Based Learning Applied to Document Recognition (1998)",
    "Krizhevsky, Sutskever & Hinton — ImageNet Classification with Deep CNNs (AlexNet, NeurIPS 2012)",
    "Goodfellow, Bengio & Courville — Deep Learning, Ch. 9",
    "Géron, A. — Hands-On Machine Learning, 3rd ed., Ch. 14",
    "He, Zhang, Ren & Sun — Deep Residual Learning for Image Recognition (ResNet, CVPR 2016)",
  ],

  theory: [
    {
      badge: "Intuition · Page 1",
      title: "Why Dense Networks Fail on Images",
      blocks: [
        {
          kind: "para",
          html: "A 256×256 colour image has 196,608 input values. A single hidden layer with 1,000 neurons would require nearly 200 million parameters — just for the first layer. Training this would require enormous amounts of data and compute, and the network would have to re-learn that a cat looks the same whether it is in the top-left or the bottom-right corner.",
        },
        {
          kind: "para",
          html: "Images have three properties that a smarter architecture should exploit: <em>local structure</em> (pixels close together are related — edges, corners), <em>translation invariance</em> (a feature is useful wherever it appears in the image), and <em>compositionality</em> (small features combine to form larger ones — pixels → edges → shapes → objects).",
        },
        {
          kind: "callout",
          tone: "purple",
          title: "The CNN answer",
          html: "Replace the dense matrix multiplication with a <em>convolution</em>: slide a small learnable filter (e.g. 3×3 pixels) over the entire image, computing the dot product at each position. The same filter is reused at every location — <em>weight sharing</em> — which enforces translation invariance and reduces parameters dramatically.",
        },
        {
          kind: "heading",
          text: "The hierarchy of features",
        },
        {
          kind: "para",
          html: "Stacking convolutional layers produces a feature hierarchy. The first layer learns edge detectors; the second combines edges into corners and curves; deeper layers assemble these into eyes, wheels, or letters. This mirrors the structure of the visual cortex discovered in 1960s neuroscience experiments by Hubel and Wiesel.",
        },
        {
          kind: "callout",
          tone: "teal",
          title: "Impact",
          html: "In 2012, AlexNet — an 8-layer CNN — reduced the ImageNet top-5 error rate from 26% to 15%, a leap no one thought possible. It sparked the modern deep learning revolution.",
        },
      ],
    },
    {
      badge: "Architecture · Page 2",
      title: "The Convolutional Layer",
      blocks: [
        {
          kind: "para",
          html: "A convolutional layer has three components: the <em>filter</em> (also called kernel), the <em>feature map</em> (the output), and the <em>activation function</em> applied element-wise.",
        },
        {
          kind: "heading",
          text: "How a filter works",
        },
        {
          kind: "para",
          html: "A filter is a small grid of learned weights — say 3×3. It slides across the input image in steps (the <em>stride</em>). At each position, every weight is multiplied by the overlapping input pixel, the products are summed, and a bias is added. This produces one output value. Sliding across the whole image produces a <em>feature map</em> that highlights wherever the pattern the filter detects appears.",
        },
        {
          kind: "equation",
          label: "2-D convolution at position (i, j)",
          tex: "(\\mathbf{I} * \\mathbf{K})_{ij} = \\sum_{u}\\sum_{v} \\mathbf{I}_{i+u,\\, j+v} \\cdot \\mathbf{K}_{u,v}",
        },
        {
          kind: "heading",
          text: "Multiple filters",
        },
        {
          kind: "para",
          html: "A single filter detects one pattern. Real convolutional layers use many filters in parallel — e.g. 64 filters each of size 3×3. Each produces its own feature map; these are stacked into a 3-D output tensor with dimensions (height × width × depth) where depth = number of filters. Deeper layers apply filters to this 3-D input.",
        },
        {
          kind: "table",
          headers: ["Term", "Meaning"],
          rows: [
            ["Kernel / filter size", "Spatial size of the filter, e.g. 3×3 or 5×5"],
            ["Stride", "How many pixels the filter moves per step (stride 2 halves the output size)"],
            ["Padding", "'same' adds zeros so output has same spatial size; 'valid' shrinks it"],
            ["Depth / channels", "Number of filters = depth of the output feature map"],
          ],
        },
      ],
    },
    {
      badge: "Architecture · Page 3",
      title: "Pooling, Stacking, and the Full Architecture",
      blocks: [
        {
          kind: "para",
          html: "A CNN is typically a sequence of convolutional blocks followed by a fully connected classifier head.",
        },
        {
          kind: "heading",
          text: "Pooling layers",
        },
        {
          kind: "para",
          html: "<em>Max pooling</em> is the most common downsampling operation. It divides the feature map into non-overlapping windows (e.g. 2×2) and takes the maximum value in each. This halves the spatial dimensions, reduces computation, and makes the representation more robust to small translations.",
        },
        {
          kind: "callout",
          tone: "amber",
          title: "Max pooling vs stride",
          html: "Modern architectures often replace max pooling with strided convolutions (stride = 2), which downsample while still learning. Pooling remains common for its explicit translation invariance guarantee.",
        },
        {
          kind: "heading",
          text: "A typical CNN block",
        },
        {
          kind: "callout",
          tone: "teal",
          title: "Conv → BatchNorm → ReLU → Pool",
          html: "This four-step pattern repeats N times (each block increasing filter depth and decreasing spatial size). After the last convolutional block, a <em>Global Average Pooling</em> (or flatten) collapses spatial dimensions, feeding a dense classification head (fully connected layers → softmax).",
        },
        {
          kind: "heading",
          text: "Receptive field",
        },
        {
          kind: "para",
          html: "Each neuron in a deep layer indirectly \"sees\" a region of the original image — its <em>receptive field</em>. After stacking many 3×3 conv layers, neurons in deep layers have receptive fields covering most of the image, allowing them to respond to large, complex patterns.",
        },
        {
          kind: "heading",
          text: "Parameter count",
        },
        {
          kind: "para",
          html: "A 3×3 conv layer with 64 input channels and 128 output filters has 3 × 3 × 64 × 128 + 128 = 73,856 parameters — tiny compared to an equivalent dense layer (input_size × 128). Weight sharing across spatial positions is what makes this feasible.",
        },
      ],
    },
    {
      badge: "Training · Page 4",
      title: "Transfer Learning and Fine-Tuning",
      blocks: [
        {
          kind: "para",
          html: "Training a deep CNN from scratch requires millions of labelled images and days of GPU compute. For most practical tasks, this is unnecessary: <em>transfer learning</em> reuses a model pre-trained on a large dataset (ImageNet — 14 million images, 1,000 classes) and adapts it to your task.",
        },
        {
          kind: "heading",
          text: "Why it works",
        },
        {
          kind: "para",
          html: "The early layers of a CNN trained on ImageNet learn generic features — edges, textures, colour blobs — that are useful for almost any visual task. Only the later layers encode task-specific concepts. Replacing just the classifier head and retraining on your data leverages these generic features without the data or compute cost.",
        },
        {
          kind: "table",
          headers: ["Strategy", "When to use", "What to train"],
          rows: [
            ["Feature extraction", "Very small dataset (<1 K images)", "Only the new classifier head; freeze all conv layers"],
            ["Fine-tuning (partial)", "Medium dataset (1 K–100 K images)", "Unfreeze and retrain the last 1–2 conv blocks + head"],
            ["Full fine-tuning", "Large dataset (>100 K images)", "Unfreeze all layers; use a small learning rate"],
            ["Train from scratch", "Very large dataset + novel domain", "Everything — but expensive"],
          ],
        },
        {
          kind: "callout",
          tone: "teal",
          title: "Landmark architectures",
          html: "<strong>VGG16/19</strong> — simple, deep stacks of 3×3 convs (2014).<br/><strong>ResNet</strong> — residual connections enable 50–152 layers without vanishing gradients (2015).<br/><strong>EfficientNet</strong> — compound scaling of depth/width/resolution (2019); excellent accuracy/compute trade-off.<br/>All are available pre-trained in <code>torchvision.models</code> and <code>tf.keras.applications</code>.",
        },
      ],
    },
    {
      badge: "Beyond Image Classification · Page 5",
      title: "Object Detection, Segmentation, and Augmentation",
      blocks: [
        {
          kind: "para",
          html: "The convolutional backbone transfers to more complex vision tasks beyond image-level classification.",
        },
        {
          kind: "table",
          headers: ["Task", "Input → Output", "Key architecture"],
          rows: [
            ["Classification", "Image → class label", "CNN + softmax head"],
            ["Object detection", "Image → boxes + class per object", "YOLO, Faster R-CNN"],
            ["Semantic segmentation", "Image → class per pixel", "U-Net, DeepLab"],
            ["Instance segmentation", "Image → mask per object instance", "Mask R-CNN"],
            ["Image generation", "Noise → realistic image", "GANs, Diffusion models (U-Net backbone)"],
          ],
        },
        {
          kind: "heading",
          text: "Data augmentation",
        },
        {
          kind: "para",
          html: "CNNs improve dramatically with more training data. When real data is scarce, <em>data augmentation</em> artificially expands the dataset: randomly flip, rotate, crop, adjust brightness/contrast, or add noise to each training image. The model sees a different version each epoch, forcing genuine generalisation rather than memorisation.",
        },
        {
          kind: "callout",
          tone: "purple",
          title: "Transformers are taking over vision too",
          html: "Vision Transformers (ViT, 2020) split images into patches and process them with the transformer attention mechanism — no convolutions at all. At large scale (millions of images), ViTs match or beat CNNs. However, for small-to-medium datasets, CNNs (especially EfficientNet) still often perform better and are much more efficient to train.",
        },
      ],
    },
  ],

  quiz: [
    {
      id: "cnn-q1",
      question:
        "What is the key difference between a convolutional layer and a fully connected (dense) layer?",
      options: [
        "A convolutional layer connects each neuron only to a local patch of the input and applies batch normalisation automatically",
        "A convolutional layer requires the input to be flattened into a vector, while a dense layer accepts 2-D spatial inputs directly",
        "A convolutional layer is applied only after pooling; dense layers are used on the raw pixel values",
        "A convolutional layer uses the same filter weights at every spatial position (weight sharing), while a dense layer has independent weights for every input-output pair"
      ],
      correctIndex: 3,
      explanation:
        "Weight sharing is the defining property of convolution: the same filter slides over the entire input, using the same weights at every location. This enforces translation invariance (a feature is detected wherever it appears) and reduces parameters dramatically compared to a dense layer where every input is connected to every output by a unique weight.",
    },
    {
      id: "cnn-q2",
      question:
        "A max pooling layer with a 2×2 window and stride 2 is applied to a 32×32 feature map. What is the output spatial size?",
      options: [
        "16×16",
        "30×30",
        "32×32",
        "8×8"
      ],
      correctIndex: 0,
      explanation:
        "Max pooling with a 2×2 window and stride 2 takes the maximum of each non-overlapping 2×2 block. With no padding, a 32×32 input produces a 16×16 output — exactly half the height and width in each dimension.",
    },
    {
      id: "cnn-q3",
      question:
        "Why do early layers of a CNN tend to learn edge detectors, while later layers learn complex shapes?",
      options: [
        "Early layers are randomly initialised and have not yet been trained, so they default to detecting simple low-level statistics",
        "Deeper layers use larger kernel sizes, so they physically see more of the image in one pass",
        "Pooling layers inserted between conv blocks explicitly convert edge maps into semantic shape representations",
        "Each layer's receptive field covers a larger region of the input; later layers combine many local features into higher-level concepts"
      ],
      correctIndex: 3,
      explanation:
        "The receptive field of a neuron grows with depth: a neuron in layer 3 indirectly covers a larger patch of the original image than a neuron in layer 1. Layer 1 neurons see tiny 3×3 patches and learn local patterns like edges; layer 3 neurons see combinations of those edges forming shapes; deeper layers see whole object parts or objects.",
    },
    {
      id: "cnn-q4",
      question:
        "You have 500 labelled medical images and want to use a CNN for classification. What is the most sensible approach?",
      options: [
        "Use a pre-trained CNN (e.g. EfficientNet-B0) and replace only the classifier head; fine-tune with a small learning rate",
        "Train a full ResNet-50 from scratch — 500 images is sufficient because medical images have simpler features than natural photos",
        "Train a large transformer-based ViT model from scratch, since transformers require less data than CNNs",
        "Apply only traditional image processing (SIFT, HOG) because deep learning requires at least 50,000 images to outperform classical methods"
      ],
      correctIndex: 0,
      explanation:
        "With only 500 images, training from scratch will overfit catastrophically. Transfer learning from a pre-trained CNN (trained on ImageNet) provides generic visual features that transfer well to medical images. You replace the final classification head and fine-tune with a small learning rate — this approach works well with only a few hundred examples.",
    },
    {
      id: "cnn-q5",
      question:
        "Which of the following best describes what data augmentation achieves during CNN training?",
      options: [
        "It upsamples the minority class by copying its images, which corrects class imbalance",
        "It retrieves additional labelled examples from online image databases to expand the training set with real data",
        "It compresses the feature maps to reduce memory usage during the forward pass",
        "It applies random but label-preserving transformations so the model sees different versions of each image per epoch, improving generalisation"
      ],
      correctIndex: 3,
      explanation:
        "Data augmentation (random flips, crops, colour jitter, rotations) creates varied views of each training image without changing its label. The model never sees exactly the same input twice, which forces it to learn invariant features rather than memorising pixel patterns. It is one of the most effective regularisation techniques for vision tasks.",
    },
  ],

  exercises: [
    {
      id: "cnn-ex1",
      title: "Manual Convolution",
      intro: "Understand convolution by implementing a single filter pass on a toy image.",
      parts: [
        {
          id: "cnn-ex1a",
          label: "a",
          prompt:
            "Apply a 3×3 horizontal-edge-detecting filter (top row = +1, middle = 0, bottom = −1) to a 5×5 grayscale image using valid padding (no padding). Print the resulting 3×3 feature map.",
          starterCode:
            "import numpy as np\n\nimage = np.array([\n    [10, 10, 10, 10, 10],\n    [10, 10, 10, 10, 10],\n    [ 0,  0,  0,  0,  0],\n    [ 0,  0,  0,  0,  0],\n    [ 0,  0,  0,  0,  0],\n], dtype=float)\n\nkernel = np.array([\n    [ 1,  1,  1],\n    [ 0,  0,  0],\n    [-1, -1, -1],\n], dtype=float)\n\nH, W = image.shape\nKH, KW = kernel.shape\nout = np.zeros((H - KH + 1, W - KW + 1))\n\nfor i in range(out.shape[0]):\n    for j in range(out.shape[1]):\n        out[i, j] = np.sum(image[i:i+KH, j:j+KW] * kernel)\n\nprint(out.astype(int))",
          expectedStdout: "[[20 20 20]\n [30 30 30]\n [ 0  0  0]]",
          hints: [
            "At each (i, j) position, extract the KH×KW patch, multiply element-wise with the kernel, and sum.",
          ],
          solution:
            "import numpy as np\n\nimage = np.array([\n    [10, 10, 10, 10, 10],\n    [10, 10, 10, 10, 10],\n    [ 0,  0,  0,  0,  0],\n    [ 0,  0,  0,  0,  0],\n    [ 0,  0,  0,  0,  0],\n], dtype=float)\n\nkernel = np.array([\n    [ 1,  1,  1],\n    [ 0,  0,  0],\n    [-1, -1, -1],\n], dtype=float)\n\nH, W = image.shape\nKH, KW = kernel.shape\nout = np.zeros((H - KH + 1, W - KW + 1))\n\nfor i in range(out.shape[0]):\n    for j in range(out.shape[1]):\n        out[i, j] = np.sum(image[i:i+KH, j:j+KW] * kernel)\n\nprint(out.astype(int))",
        },
        {
          id: "cnn-ex1b",
          label: "b",
          prompt:
            "Using scikit-learn's MLPClassifier as a baseline and comparing it with a simple CNN: load MNIST (via sklearn's fetch_openml). Take the first 5000 samples, scale to [0,1]. Train a shallow MLP (100 hidden, max_iter=20) and print test accuracy rounded to 3 dp.",
          starterCode:
            "from sklearn.datasets import fetch_openml\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.neural_network import MLPClassifier\nfrom sklearn.preprocessing import MinMaxScaler\n\nX, y = fetch_openml('mnist_784', version=1, return_X_y=True, as_frame=False, parser='auto')\nX, y = X[:5000], y[:5000]\nX = MinMaxScaler().fit_transform(X)\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\n\nmlp = MLPClassifier(hidden_layer_sizes=(100,), max_iter=20, random_state=42)\nmlp.fit(X_train, y_train)\nprint(round(mlp.score(X_test, y_test), 3))",
          expectedStdout: "0.948",
          hints: [
            "This is the MLP baseline — a CNN on the same data typically hits 0.98+ by explicitly exploiting spatial structure.",
          ],
          solution:
            "from sklearn.datasets import fetch_openml\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.neural_network import MLPClassifier\nfrom sklearn.preprocessing import MinMaxScaler\n\nX, y = fetch_openml('mnist_784', version=1, return_X_y=True, as_frame=False, parser='auto')\nX, y = X[:5000], y[:5000]\nX = MinMaxScaler().fit_transform(X)\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\n\nmlp = MLPClassifier(hidden_layer_sizes=(100,), max_iter=20, random_state=42)\nmlp.fit(X_train, y_train)\nprint(round(mlp.score(X_test, y_test), 3))",
        },
      ],
    },
  ],

  cheatsheet: [
    {
      heading: "Core Layers",
      items: [
        {
          term: "Conv2D(filters, kernel_size, padding='same')",
          note: "Slides filters over input; output depth = filters; 'same' preserves spatial size",
        },
        {
          term: "BatchNormalization()",
          note: "Normalise activations per mini-batch; apply after Conv, before activation",
        },
        {
          term: "ReLU / Activation('relu')",
          note: "Standard non-linearity for hidden conv layers",
        },
        {
          term: "MaxPooling2D(pool_size=2)",
          note: "Halves spatial dimensions; takes max in each 2×2 window",
        },
        {
          term: "GlobalAveragePooling2D()",
          note: "Collapses (H × W × C) → (C) before the dense classifier head",
        },
      ],
    },
    {
      heading: "Key Concepts",
      items: [
        {
          term: "Weight sharing",
          note: "Same filter used at every position — enforces translation invariance, reduces params",
        },
        {
          term: "Receptive field",
          note: "Region of the original input a neuron can 'see'; grows with depth",
        },
        {
          term: "Stride",
          note: "Steps between filter positions; stride 2 halves spatial size",
        },
        {
          term: "Depth / channels",
          note: "Number of filters = depth of the output tensor",
        },
      ],
    },
    {
      heading: "Transfer Learning Workflow",
      items: [
        {
          term: "1. Load pre-trained backbone",
          note: "e.g. EfficientNetB0(weights='imagenet', include_top=False)",
        },
        {
          term: "2. Freeze backbone layers",
          note: "base_model.trainable = False — preserve ImageNet features",
        },
        {
          term: "3. Add classification head",
          note: "GlobalAveragePooling2D → Dense(256, relu) → Dense(n_classes, softmax)",
        },
        {
          term: "4. Fine-tune (optional)",
          note: "Unfreeze last N blocks, train with lr ≈ 1e-5",
        },
      ],
    },
    {
      heading: "Benchmark Architectures",
      items: [
        {
          term: "VGG16/19",
          note: "Deep stacks of 3×3 convs; simple but large (~138M params)",
        },
        {
          term: "ResNet-50",
          note: "Residual connections solve vanishing gradient; 50 layers, 25M params",
        },
        {
          term: "EfficientNet-B0",
          note: "Best accuracy/compute ratio for most practical tasks; 5.3M params",
        },
        {
          term: "ViT (Vision Transformer)",
          note: "Patch-based transformer; better than CNN at very large scale (>10M images)",
        },
      ],
    },
  ],
};
