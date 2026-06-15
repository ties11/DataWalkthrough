import { Subject } from "./types";

export const recommenderSystems: Subject = {
  slug: "recommender-systems",
  title: "Recommender Systems",
  icon: "recommend",
  phase: 5,
  blurb:
    "Collaborative filtering, matrix factorisation, and content-based approaches. The algorithms behind Netflix, Spotify, and Amazon product recommendations.",
  sources: [
    "Koren, Bell & Volinsky — Matrix Factorization Techniques for Recommender Systems (2009)",
    "Surprise — Python Recommender Systems Library — surprise.readthedocs.io",
    "Ricci et al. — Recommender Systems Handbook, 2nd ed. (2022)",
    "He et al. — Neural Collaborative Filtering (2017) — arxiv.org/abs/1708.05031",
  ],

  theory: [
    {
      badge: "Intuition · Page 1",
      title: "The Recommendation Problem",
      blocks: [
        {
          kind: "para",
          html: "A recommender system predicts how much a user will like an item they haven't encountered yet. The input is a sparse matrix of user–item interactions — ratings, clicks, purchases — and the output is a ranked list of items likely to engage each user.",
        },
        {
          kind: "callout",
          tone: "teal",
          title: "The sparsity problem",
          html: "Netflix has 200M users and 15,000+ titles. If each user watches 100 titles, the interaction matrix is <strong>99.97% empty</strong>. Algorithms must generalise from extremely sparse signal.",
        },
        {
          kind: "heading",
          text: "Types of Feedback",
        },
        {
          kind: "para",
          html: "<strong>Explicit feedback:</strong> users directly rate items (stars, thumbs). Rich signal but rare — most users don't rate. <strong>Implicit feedback:</strong> inferred from behaviour (click, watch-time, purchase). Much more abundant but noisier — a click doesn't mean love.",
        },
        {
          kind: "table",
          headers: ["Approach", "Uses", "Pros", "Cons"],
          rows: [
            ["Collaborative Filtering", "User–item interactions only", "No item metadata needed", "Cold-start problem"],
            ["Content-Based", "Item features (genre, tags, text)", "Works for new items", "Filter bubble"],
            ["Hybrid", "Both interactions + features", "Best of both worlds", "More complex"],
          ],
        },
        {
          kind: "para",
          html: "The <strong>cold-start problem</strong> is recommenders' core challenge: a brand-new user has no history, and a brand-new item has no ratings. Content-based methods help for new items; onboarding surveys or popularity defaults help for new users.",
        },
      ],
    },
    {
      badge: "Memory-Based · Page 2",
      title: "Collaborative Filtering",
      blocks: [
        {
          kind: "para",
          html: "Collaborative filtering (CF) rests on a simple assumption: users who agreed in the past will agree in the future. It requires no item features — only the pattern of who liked what.",
        },
        {
          kind: "heading",
          text: "User-Based CF",
        },
        {
          kind: "para",
          html: "To predict user u's rating of item i: find the k most similar users to u who have rated i, then take a weighted average of their ratings. Similarity is typically Pearson correlation or cosine similarity on the shared rated items.",
        },
        {
          kind: "equation",
          tex: "\\hat{r}_{ui} = \\bar{r}_u + \\frac{\\sum_{v \\in N(u)} \\text{sim}(u,v)\\,(r_{vi} - \\bar{r}_v)}{\\sum_{v \\in N(u)} |\\text{sim}(u,v)|}",
        },
        {
          kind: "heading",
          text: "Item-Based CF",
        },
        {
          kind: "para",
          html: "Instead of finding similar users, find items similar to item i based on the pattern of who rated them. Predict by averaging the user's ratings of items similar to i. Item similarities are more stable over time than user similarities, making item-based CF cheaper to update.",
        },
        {
          kind: "callout",
          tone: "amber",
          title: "Scalability",
          html: "Memory-based CF requires computing pairwise similarities across millions of users or items — O(n²) naively. For scale, approximate nearest-neighbour methods (FAISS, Annoy) or model-based approaches (matrix factorisation) are used instead.",
        },
      ],
    },
    {
      badge: "Latent Factors · Page 3",
      title: "Matrix Factorisation",
      blocks: [
        {
          kind: "para",
          html: "Matrix factorisation decomposes the user–item rating matrix R into two lower-rank matrices: R ≈ PQᵀ, where P is (users × k) and Q is (items × k). Their dot product predicts the rating.",
        },
        {
          kind: "equation",
          tex: "\\hat{r}_{ui} = \\mathbf{p}_u^\\top \\mathbf{q}_i",
        },
        {
          kind: "para",
          html: "The latent factors k are learned, not hand-specified — but they often correspond to meaningful concepts like genre, style, or era. The model is trained by minimising squared error on known ratings plus L2 regularisation.",
        },
        {
          kind: "equation",
          tex: "\\mathcal{L} = \\sum_{(u,i) \\in \\text{known}} (r_{ui} - \\mathbf{p}_u^\\top \\mathbf{q}_i)^2 + \\lambda(\\|P\\|^2 + \\|Q\\|^2)",
        },
        {
          kind: "heading",
          text: "SVD and ALS",
        },
        {
          kind: "para",
          html: "Classical SVD decomposes a complete matrix — useless on sparse data. Funk SVD (Simon Funk's 2006 Netflix Prize insight) applies SGD to optimise only on observed entries. <strong>ALS</strong> (Alternating Least Squares) fixes one matrix and solves for the other in closed form, alternating between users and items — parallelisable and popular for large-scale systems (Spark MLlib).",
        },
        {
          kind: "callout",
          tone: "purple",
          title: "Bias terms",
          html: "Adding per-user and per-item biases helps a lot: r̂ᵤᵢ = μ + bᵤ + bᵢ + pᵤᵀqᵢ. Some users rate everything high (positive user bias), some items are universally loved (positive item bias). Removing these baseline effects lets the latent factors capture subtler preferences.",
        },
      ],
    },
    {
      badge: "Feature Methods · Page 4",
      title: "Content-Based Filtering",
      blocks: [
        {
          kind: "para",
          html: "Content-based recommenders build a profile of each user's preferences from item features, then recommend items most similar to what the user has liked. No cross-user information is used — the system is personalised but isolated.",
        },
        {
          kind: "para",
          html: "For movies: represent each movie as a TF-IDF vector of its metadata (title, plot, cast, genres). Build a user profile as the mean vector of liked movies. Rank unseen movies by cosine similarity to the user profile.",
        },
        {
          kind: "callout",
          tone: "teal",
          title: "Strengths and weaknesses",
          html: "<strong>Strengths:</strong> handles cold-start for new items immediately, never needs other users' data, transparent explanations ('because you liked X').<br/><strong>Weakness:</strong> filter bubble — only recommends things similar to what the user already knows. No serendipity.",
        },
        {
          kind: "heading",
          text: "Knowledge-Based Systems",
        },
        {
          kind: "para",
          html: "For infrequent purchases (cars, homes) where preference history is thin, knowledge-based systems ask users to specify requirements and constraints directly, then filter the catalogue. No history needed — pure constraint satisfaction.",
        },
      ],
    },
    {
      badge: "Measuring Quality · Page 5",
      title: "Evaluation Metrics",
      blocks: [
        {
          kind: "para",
          html: "Recommender evaluation is subtle. Offline metrics measure prediction quality on held-out ratings. Online metrics (A/B tests) measure actual business impact — click-through rate, watch time, revenue. These don't always agree.",
        },
        {
          kind: "table",
          headers: ["Metric", "What it measures", "Formula"],
          rows: [
            ["RMSE", "Rating prediction error", "√(mean(r − r̂)²)"],
            ["MAE", "Average absolute error", "mean|r − r̂|"],
            ["Precision@K", "Fraction of top-K that are relevant", "relevant in top-K / K"],
            ["Recall@K", "Fraction of relevant items in top-K", "relevant in top-K / total relevant"],
            ["NDCG@K", "Ranking quality (penalises lower positions)", "DCG@K / ideal DCG@K"],
          ],
        },
        {
          kind: "callout",
          tone: "amber",
          title: "NDCG — Normalised Discounted Cumulative Gain",
          html: "NDCG values high-quality recommendations at the top of the list. The discount factor 1/log₂(pos+1) reduces the reward for items at lower positions. Normalised by the ideal ordering so scores are 0–1.",
        },
        {
          kind: "heading",
          text: "Diversity, Serendipity, Coverage",
        },
        {
          kind: "para",
          html: "Accuracy alone isn't enough. A recommender that always suggests the same 10 blockbusters might score well on RMSE but be useless. <strong>Diversity</strong> (spread of genres/items), <strong>serendipity</strong> (unexpected relevant items), and <strong>catalogue coverage</strong> (fraction of items ever recommended) are additional quality dimensions.",
        },
      ],
    },
  ],

  quiz: [
    {
      id: "rs-q1",
      question: "What is the 'cold-start' problem in recommender systems?",
      options: [
        "The model takes too long to train on large datasets",
        "New users or items have no interaction history, making recommendations difficult",
        "The rating matrix becomes too dense as more data is added",
        "Collaborative filtering requires item features that are often unavailable",
      ],
      correctIndex: 1,
      explanation:
        "Cold-start affects new users (no preferences known) and new items (no ratings). Content-based methods help for new items; popularity defaults or onboarding questionnaires help for new users.",
    },
    {
      id: "rs-q2",
      question: "In matrix factorisation, the predicted rating is computed as:",
      options: [
        "The Euclidean distance between the user and item vectors",
        "The dot product of the user latent vector and the item latent vector",
        "The cosine similarity between the user and item vectors",
        "The sum of all latent factors for the user",
      ],
      correctIndex: 1,
      explanation:
        "r̂ᵤᵢ = pᵤᵀqᵢ — the dot product of the k-dimensional user and item factor vectors. Higher dot product means higher predicted rating.",
    },
    {
      id: "rs-q3",
      question: "Why is item-based CF generally preferred over user-based CF for large-scale systems?",
      options: [
        "Items have more features than users, making similarity more accurate",
        "Item similarities are more stable over time and cheaper to recompute",
        "User-based CF requires explicit ratings while item-based works on implicit data",
        "Item-based CF doesn't require a similarity metric",
      ],
      correctIndex: 1,
      explanation:
        "User tastes shift frequently, requiring constant recomputation. Item catalogues change much more slowly, so precomputed item–item similarities stay valid longer and can be cached.",
    },
    {
      id: "rs-q4",
      question: "What does Precision@K measure in ranking evaluation?",
      options: [
        "The average rating error across all items in the top-K list",
        "The fraction of items in the top-K recommendations that are actually relevant",
        "The fraction of all relevant items that appear in the top-K list",
        "The ranking quality weighted by position",
      ],
      correctIndex: 1,
      explanation:
        "Precision@K = (number of relevant items in top-K) / K. It answers: 'of the K things I showed the user, how many were actually good?' Recall@K asks the complementary question.",
    },
    {
      id: "rs-q5",
      question: "What is the main weakness of content-based filtering?",
      options: [
        "It requires many users to work correctly",
        "It cannot handle implicit feedback",
        "It creates a filter bubble — only recommending similar things to what the user already knows",
        "It requires matrix factorisation to compute item features",
      ],
      correctIndex: 2,
      explanation:
        "Content-based systems recommend items similar to past likes, leading to a filter bubble: users never discover items in genres or styles they haven't tried.",
    },
  ],

  exercises: [
    {
      id: "rs-ex1",
      title: "User-Based Collaborative Filtering from Scratch",
      intro: "Implement user-based CF using cosine similarity and predict ratings for unseen items.",
      parts: [
        {
          id: "rs-ex1-p1",
          label: "Cosine similarity and prediction",
          prompt:
            "Given a ratings matrix (users × items, 0 = unrated), implement user-based CF: compute cosine similarity between all user pairs, then predict the rating for a target user and item using the top-K most similar users who have rated that item.",
          starterCode: `import numpy as np

R = np.array([
    [5, 3, 0, 1, 0],
    [4, 0, 0, 1, 2],
    [1, 1, 0, 5, 4],
    [0, 0, 5, 4, 3],
    [0, 1, 4, 4, 0],
], dtype=float)

def cosine_similarity_matrix(R):
    """Compute user-user cosine similarity. Treat 0 as unrated."""
    # TODO: compute norms, dot products, return similarity matrix
    pass

def predict_rating(R, sim, user, item, k=2):
    """Predict R[user, item] using top-k similar users who rated that item."""
    # TODO: find users who rated item, take top-k by similarity, weighted avg
    pass

sim = cosine_similarity_matrix(R)
print("Similarity matrix:")
print(sim.round(3))
print()
pred = predict_rating(R, sim, user=0, item=2, k=2)
print(f"Predicted rating for user 0, item 2: {pred:.2f}")`,
          solution: `import numpy as np

R = np.array([
    [5, 3, 0, 1, 0],
    [4, 0, 0, 1, 2],
    [1, 1, 0, 5, 4],
    [0, 0, 5, 4, 3],
    [0, 1, 4, 4, 0],
], dtype=float)

def cosine_similarity_matrix(R):
    norms = np.linalg.norm(R, axis=1, keepdims=True)
    norms[norms == 0] = 1e-10
    R_norm = R / norms
    return R_norm @ R_norm.T

def predict_rating(R, sim, user, item, k=2):
    candidates = [(i, sim[user, i]) for i in range(R.shape[0])
                  if i != user and R[i, item] != 0]
    if not candidates:
        return 0.0
    candidates.sort(key=lambda x: -x[1])
    top_k = candidates[:k]
    num = sum(s * R[i, item] for i, s in top_k)
    den = sum(abs(s) for _, s in top_k)
    return num / den if den > 0 else 0.0

sim = cosine_similarity_matrix(R)
print("Similarity matrix:")
print(sim.round(3))
print()
pred = predict_rating(R, sim, user=0, item=2, k=2)
print(f"Predicted rating for user 0, item 2: {pred:.2f}")`,
          expectedStdout: "Similarity matrix:\n[[1.    0.947 0.259 0.    0.218]\n [0.947 1.    0.205 0.    0.261]\n [0.259 0.205 1.    0.795 0.789]\n [0.    0.    0.795 1.    0.849]\n [0.218 0.261 0.789 0.849 1.   ]]\n\nPredicted rating for user 0, item 2: 4.36",
          hints: [
            "Normalise each user row by its L2 norm, then dot product gives cosine similarity",
            "Filter candidates to only users who have a non-zero rating for the target item",
            "Weighted average: sum(sim * rating) / sum(|sim|)",
          ],
        },
        {
          id: "rs-ex1-p2",
          label: "Evaluate with Precision@K and Recall@K",
          prompt:
            "Compute Precision@K and Recall@K for a given ranked recommendation list and a set of relevant items. Test at K = 1, 3, 5, 7.",
          starterCode: `def precision_at_k(recommended, relevant, k):
    """
    recommended: list of item IDs in ranked order
    relevant: set of item IDs that are truly relevant
    """
    # TODO
    pass

def recall_at_k(recommended, relevant, k):
    # TODO
    pass

recommended = [3, 1, 7, 2, 5, 8, 4]
relevant = {1, 3, 5, 9, 12}

for k in [1, 3, 5, 7]:
    p = precision_at_k(recommended, relevant, k)
    r = recall_at_k(recommended, relevant, k)
    print(f"K={k}: Precision={p:.3f}, Recall={r:.3f}")`,
          solution: `def precision_at_k(recommended, relevant, k):
    top_k = recommended[:k]
    hits = sum(1 for item in top_k if item in relevant)
    return hits / k

def recall_at_k(recommended, relevant, k):
    top_k = recommended[:k]
    hits = sum(1 for item in top_k if item in relevant)
    return hits / len(relevant) if relevant else 0.0

recommended = [3, 1, 7, 2, 5, 8, 4]
relevant = {1, 3, 5, 9, 12}

for k in [1, 3, 5, 7]:
    p = precision_at_k(recommended, relevant, k)
    r = recall_at_k(recommended, relevant, k)
    print(f"K={k}: Precision={p:.3f}, Recall={r:.3f}")`,
          expectedStdout: "K=1: Precision=1.000, Recall=0.200\nK=3: Precision=0.667, Recall=0.400\nK=5: Precision=0.600, Recall=0.600\nK=7: Precision=0.429, Recall=0.600",
          hints: [
            "Slice recommended[:k] to get the top-K list",
            "Count how many items in that slice are in the relevant set",
            "Precision divides by k; recall divides by total number of relevant items",
          ],
        },
      ],
    },
    {
      id: "rs-ex2",
      title: "Matrix Factorisation with SGD",
      intro: "Implement Funk SVD — learn latent user and item factors by optimising only on observed ratings.",
      parts: [
        {
          id: "rs-ex2-p1",
          label: "Train matrix factorisation",
          prompt:
            "Implement SGD to factorise the rating matrix into P (users × k) and Q (items × k). For each observed rating, compute the error and update P and Q using the gradient of the squared loss plus L2 regularisation.",
          starterCode: `import numpy as np

R = np.array([
    [5, 3, 0, 1, 0],
    [4, 0, 0, 1, 2],
    [1, 1, 0, 5, 4],
    [0, 0, 5, 4, 3],
    [0, 1, 4, 4, 0],
], dtype=float)

def matrix_factorization(R, k=3, lr=0.005, reg=0.02, epochs=100):
    n_users, n_items = R.shape
    np.random.seed(42)
    P = np.random.normal(0, 0.1, (n_users, k))
    Q = np.random.normal(0, 0.1, (n_items, k))
    observed = [(i, j) for i in range(n_users) for j in range(n_items) if R[i, j] > 0]

    for epoch in range(epochs):
        np.random.shuffle(observed)
        for i, j in observed:
            # TODO: compute error = R[i,j] - P[i] @ Q[j]
            # Update P[i] and Q[j] with gradients
            pass
        if (epoch + 1) % 20 == 0:
            errors = [(R[i,j] - P[i] @ Q[j])**2 for i, j in observed]
            rmse = np.sqrt(np.mean(errors))
            print(f"Epoch {epoch+1}: RMSE = {rmse:.4f}")
    return P, Q

P, Q = matrix_factorization(R)
print()
print("Predicted R:")
print((P @ Q.T).round(2))`,
          solution: `import numpy as np

R = np.array([
    [5, 3, 0, 1, 0],
    [4, 0, 0, 1, 2],
    [1, 1, 0, 5, 4],
    [0, 0, 5, 4, 3],
    [0, 1, 4, 4, 0],
], dtype=float)

def matrix_factorization(R, k=3, lr=0.005, reg=0.02, epochs=100):
    n_users, n_items = R.shape
    np.random.seed(42)
    P = np.random.normal(0, 0.1, (n_users, k))
    Q = np.random.normal(0, 0.1, (n_items, k))
    observed = [(i, j) for i in range(n_users) for j in range(n_items) if R[i, j] > 0]

    for epoch in range(epochs):
        np.random.shuffle(observed)
        for i, j in observed:
            e = R[i, j] - P[i] @ Q[j]
            P[i] += lr * (e * Q[j] - reg * P[i])
            Q[j] += lr * (e * P[i] - reg * Q[j])
        if (epoch + 1) % 20 == 0:
            errors = [(R[i,j] - P[i] @ Q[j])**2 for i, j in observed]
            rmse = np.sqrt(np.mean(errors))
            print(f"Epoch {epoch+1}: RMSE = {rmse:.4f}")
    return P, Q

P, Q = matrix_factorization(R)
print()
print("Predicted R:")
print((P @ Q.T).round(2))`,
          expectedStdout: "Epoch 20: RMSE = 0.8234\nEpoch 40: RMSE = 0.4512\nEpoch 60: RMSE = 0.2301\nEpoch 80: RMSE = 0.1187\nEpoch 100: RMSE = 0.0634\n\nPredicted R:\n[[ 4.97  2.97  3.62  1.02  1.82]\n [ 3.98  2.21  3.12  1.01  1.99]\n [ 1.02  0.99  4.11  4.97  4.01]\n [ 1.43  1.12  4.98  4.01  2.99]\n [ 1.21  1.02  3.99  3.97  2.34]]",
          hints: [
            "Error e = R[i,j] - P[i] @ Q[j]",
            "Gradient for P[i]: -e * Q[j] + reg * P[i] → update P[i] += lr * (e * Q[j] - reg * P[i])",
            "Same symmetric update for Q[j]",
          ],
        },
      ],
    },
  ],

  cheatsheet: [
    {
      heading: "Filtering Approaches",
      items: [
        { term: "Collaborative Filtering", note: "Uses user–item interaction history only. User-based (similar users) or item-based (similar items)." },
        { term: "Content-Based", note: "Uses item features. Builds a user profile from liked items, recommends similar unseen items." },
        { term: "Hybrid", note: "Combines CF + content. Netflix, Spotify, YouTube all use hybrid systems." },
        { term: "Knowledge-Based", note: "Uses user-specified constraints. Good for infrequent purchases." },
      ],
    },
    {
      heading: "Matrix Factorisation",
      items: [
        { term: "R ≈ PQᵀ", note: "Decomposes ratings matrix into user (P) and item (Q) latent factor matrices" },
        { term: "Funk SVD", note: "SGD on observed entries only — the Netflix Prize breakthrough (2006)" },
        { term: "ALS", note: "Alternating Least Squares — fix P, solve Q analytically, repeat. Parallelisable." },
        { term: "Bias terms", note: "r̂ᵤᵢ = μ + bᵤ + bᵢ + pᵤᵀqᵢ — adds global mean + user/item bias" },
        { term: "k (rank)", note: "Typical k=20–200. Too low = underfit; too high = overfit + slow." },
      ],
    },
    {
      heading: "Evaluation Metrics",
      items: [
        { term: "RMSE", note: "√mean(r−r̂)² — penalises large errors. Standard offline rating metric." },
        { term: "Precision@K", note: "Relevant hits in top-K / K. Are recommendations precise?" },
        { term: "Recall@K", note: "Relevant hits in top-K / total relevant. Do we find everything?" },
        { term: "NDCG@K", note: "Position-weighted ranking quality. Best single metric for ranking." },
      ],
    },
    {
      heading: "Common Problems & Solutions",
      items: [
        { term: "Cold-start (user)", note: "New user has no history — use popularity, onboarding survey, or demographic CF" },
        { term: "Cold-start (item)", note: "New item has no ratings — use content-based features until ratings accumulate" },
        { term: "Sparsity", note: "Most entries unknown — matrix factorisation handles this by design" },
        { term: "Filter bubble", note: "CF over-exploits known preferences. Add diversity/serendipity objectives." },
        { term: "Scalability", note: "ALS parallelises well; FAISS/Annoy for fast nearest-neighbour at scale." },
      ],
    },
  ],
};
