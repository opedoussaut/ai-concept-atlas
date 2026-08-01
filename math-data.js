/**
 * AI Concept Atlas — the mathematics layer.
 *
 * Publishes two globals consumed by app.js:
 *   window.MATH_CATEGORIES  the seven branches of mathematics used here
 *   window.MATH_CONCEPTS    the mathematical concepts themselves
 *
 * Mathematics is a *cross-cutting layer*, not a ninth AI domain. The link
 * between an AI concept and the mathematics it uses is declared once, on the
 * AI concept, in `mathFoundations` (see data.js). The reverse direction —
 * "which AI concepts use this mathematics" — is derived at runtime so the two
 * can never disagree.
 *
 * Concept shape (all fields required except `legend`, `prerequisites`,
 * `worked` and `source`):
 *
 *   slug          URL-safe kebab-case, unique, permanent. Routed at #math/<slug>.
 *   symbol        Short display token, the mathematical counterpart of `acronym`.
 *   name          Full name of the concept.
 *   category      Must equal an id in window.MATH_CATEGORIES.
 *   difficulty    "introductory" | "intermediate" | "advanced"
 *   relation      How an AI concept relates to this mathematics, used to label
 *                 graph edges. The verb belongs to the mathematical object, not
 *                 to each link: a dot product is always something a technique
 *                 *computes with*, a vector space is always the *setting* it
 *                 presupposes. One value here beats 141 editorial judgements on
 *                 the links. A single link may still override it with its own
 *                 `relation` when the general rule genuinely does not hold.
 *                   USES           an operation the technique performs
 *                   DEPENDS_ON     a structure or property it presupposes
 *                   MEASURED_WITH  a quantity it scores or compares with
 *                   OPTIMIZED_BY   an objective, or the machinery that fits it
 *                   APPROXIMATES   finite-precision representation and its error
 *   summary       One sentence. Shown on the card.
 *   intuition     Plain-language explanation. No symbols required to follow it.
 *   equation      Plain text, \n for line breaks. Never a substitute for `intuition`.
 *   equationNote  What the equation is saying, in words.
 *   legend        [{ symbol, meaning }] — one entry per symbol used above.
 *   worked        A small numerical example, plain text.
 *   whyInAI       Array of short statements. Rendered as a list.
 *   related       Slugs of other mathematics concepts. Must resolve.
 *   prerequisites Slugs of mathematics concepts worth reading first. Must resolve.
 *   tags          Search keywords.
 *   source        Primary reference, HTTPS only.
 */

window.MATH_CATEGORIES = [
  { id: "linear-algebra", name: "Linear algebra & geometry", short: "Linear algebra", color: "#ffc978" },
  { id: "probability", name: "Probability & statistics", short: "Probability", color: "#ff9e7d" },
  { id: "information", name: "Information theory", short: "Information", color: "#ffe08c" },
  { id: "optimization", name: "Calculus & optimization", short: "Optimization", color: "#f2a65a" },
  { id: "numerical", name: "Numerical mathematics", short: "Numerics", color: "#d9b382" },
  { id: "discrete", name: "Graphs & discrete mathematics", short: "Graphs", color: "#e8cf9a" },
  { id: "dynamics", name: "Dynamical systems & control", short: "Dynamics", color: "#f5bb6d" }
];

window.MATH_CONCEPTS = [
  /* ================================================================= */
  /* Linear algebra & geometry                                          */
  /* ================================================================= */
  {
    slug: "vectors", symbol: "v", name: "Vectors", category: "linear-algebra", difficulty: "introductory", relation: "DEPENDS_ON",
    summary: "An ordered list of numbers that represents a point, a direction or a set of measurements.",
    intuition: "A single number says how much of one thing. A vector says how much of several things at once, in a fixed order, so that position carries meaning. Everything a model touches is a bag of numbers arranged in a shape: a scalar has no axes, a vector has one, a matrix has two, a tensor has as many as you need.",
    equation: "v = [v₁, v₂, …, vₙ] ∈ ℝⁿ\n\nscalar → vector → matrix → tensor\n  ()      (n)      (m, n)    (b, m, n, …)",
    equationNote: "A vector of length n is a point in n-dimensional space. The notation ℝⁿ simply says: n real numbers, in order. Stacking vectors of the same length produces a matrix; stacking matrices produces a tensor.",
    legend: [
      { symbol: "vᵢ", meaning: "the i-th entry, a single real number" },
      { symbol: "n", meaning: "the dimension — how many numbers the vector holds" },
      { symbol: "ℝⁿ", meaning: "the set of all vectors with n real entries" }
    ],
    worked: "A three-dimensional vector:\n\n  v = [2, -1, 4]\n\nShape (3,): one axis, three entries.\nStack four such vectors and you have a matrix of shape (4, 3).\nProcess eight of those together and you have a tensor of shape (8, 4, 3).",
    whyInAI: [
      "Every input a model sees — a token, an image patch, an audio frame — becomes a vector before anything else happens.",
      "The dimension n is a design decision: it sets how much information a single representation can carry.",
      "Batching, the reason accelerators are fast, works only because vectors of equal length stack into regular matrices and tensors."
    ],
    related: ["matrices", "vector-spaces", "dot-product", "vector-norms"],
    prerequisites: [],
    tags: ["scalar", "tensor", "array", "dimension", "shape"],
    source: { label: "Deep Learning, chapter 2: Linear Algebra — Goodfellow, Bengio & Courville (MIT Press, 2016)", url: "https://www.deeplearningbook.org/contents/linear_algebra.html" }
  },
  {
    slug: "matrices", symbol: "A", name: "Matrices", category: "linear-algebra", difficulty: "introductory", relation: "DEPENDS_ON",
    summary: "A rectangular grid of numbers that stores a table of values or describes a linear transformation.",
    intuition: "A matrix can be read two ways, and both are useful. As a container it is a stack of vectors — a spreadsheet of numbers. As an action it is a machine: feed it a vector and it returns another vector, rotated, stretched or projected. Neural network weights are matrices in the second sense: each layer is a learned transformation of the representation flowing through it.",
    equation: "A ∈ ℝ^{m×n}\n\nA = ⎡ a₁₁  a₁₂ … a₁ₙ ⎤\n    ⎢ a₂₁  a₂₂ … a₂ₙ ⎥\n    ⎣ aₘ₁  aₘ₂ … aₘₙ ⎦",
    equationNote: "A matrix with m rows and n columns holds m × n numbers. Read as a transformation, it takes a vector of length n and produces a vector of length m.",
    legend: [
      { symbol: "m", meaning: "number of rows — the size of the output" },
      { symbol: "n", meaning: "number of columns — the size of the input" },
      { symbol: "aᵢⱼ", meaning: "the entry in row i, column j" }
    ],
    worked: "A 2 × 3 matrix:\n\n  A = ⎡ 1  0  2 ⎤\n      ⎣ 3  1  0 ⎦\n\nIt maps a 3-dimensional vector to a 2-dimensional one.\nA transformer layer with a 4096 × 4096 weight matrix holds\n16,777,216 numbers in a single such grid.",
    whyInAI: [
      "Model weights are stored as matrices; parameter count is literally the number of entries in them.",
      "A forward pass is a chain of matrix transformations applied to the input representation.",
      "Shape mismatches — the most common error in model code — are just matrices whose dimensions do not line up."
    ],
    related: ["vectors", "matrix-multiplication", "matrix-rank", "vector-spaces"],
    prerequisites: ["vectors"],
    tags: ["weights", "grid", "linear transformation", "parameters"],
    source: { label: "Linear Algebra (18.06) — Gilbert Strang, MIT OpenCourseWare", url: "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/" }
  },
  {
    slug: "matrix-multiplication", symbol: "AB", name: "Matrix Multiplication", category: "linear-algebra", difficulty: "introductory", relation: "USES",
    summary: "Combining two matrices so that each output entry is the dot product of a row and a column.",
    intuition: "Matrix multiplication applies one transformation after another. Every entry of the result answers a small question: how much does this row of A agree with that column of B? That is a dot product, so matrix multiplication is really a grid of dot products computed all at once — which is exactly the shape of work a GPU is built for.",
    equation: "A ∈ ℝ^{m×n},  B ∈ ℝ^{n×p}  →  AB ∈ ℝ^{m×p}\n\n(AB)ᵢⱼ = Σ_{k=1}^{n} Aᵢₖ · Bₖⱼ",
    equationNote: "The inner dimensions must match: A's columns and B's rows are both n. That shared n is summed away, leaving an m × p result. Cost grows as m · n · p, which is why model size and sequence length are so expensive.",
    legend: [
      { symbol: "Σ_{k=1}^{n}", meaning: "add up the n products as k runs from 1 to n" },
      { symbol: "Aᵢₖ", meaning: "entry in row i, column k of A" },
      { symbol: "m · n · p", meaning: "the multiply-accumulate count — the dominant cost of running a model" }
    ],
    worked: "  A = ⎡ 1  2 ⎤     B = ⎡ 5  6 ⎤\n      ⎣ 3  4 ⎦         ⎣ 7  8 ⎦\n\n(AB)₁₁ = 1×5 + 2×7 = 19\n(AB)₁₂ = 1×6 + 2×8 = 22\n(AB)₂₁ = 3×5 + 4×7 = 43\n(AB)₂₂ = 3×6 + 4×8 = 50\n\n  AB = ⎡ 19  22 ⎤\n       ⎣ 43  50 ⎦",
    whyInAI: [
      "It is the single most executed operation in training and inference; hardware and kernels are designed around it.",
      "Attention is three matrix multiplications and a softmax; a feed-forward layer is two more.",
      "Because cost scales with the product of all three dimensions, halving a hidden size roughly quarters the work."
    ],
    related: ["matrices", "dot-product", "low-rank-factorization"],
    prerequisites: ["matrices", "dot-product"],
    tags: ["matmul", "GEMM", "linear layer", "compute"],
    source: { label: "Matrix Computations, 4th edition — Golub & Van Loan (Johns Hopkins University Press, 2013)", url: "https://www.press.jhu.edu/books/title/10678/matrix-computations" }
  },
  {
    slug: "dot-product", symbol: "a · b", name: "Dot Product", category: "linear-algebra", difficulty: "introductory", relation: "USES",
    summary: "Multiplying two vectors entry by entry and adding the results, producing a single number that measures agreement.",
    intuition: "The dot product asks how much two vectors point the same way. Multiply matching entries and add. A large positive result means they agree; zero means they are unrelated — geometrically, at right angles; a negative result means they oppose each other. This one number is how a model scores relevance between anything and anything else.",
    equation: "a · b = Σ_{i=1}^{n} aᵢ bᵢ\n\na · b = ‖a‖ ‖b‖ cos θ",
    equationNote: "The two lines are the same quantity seen differently. The first is the arithmetic: pair up entries, multiply, sum. The second is the geometry: the result grows with the length of both vectors and with how closely aligned they are. Dividing the alignment out of the lengths gives cosine similarity.",
    legend: [
      { symbol: "aᵢ, bᵢ", meaning: "the i-th entry of each vector" },
      { symbol: "‖a‖", meaning: "the length of a" },
      { symbol: "θ", meaning: "the angle between the two vectors" }
    ],
    worked: "  a = [1, 2]\n  b = [3, 4]\n\n  a · b = 1×3 + 2×4 = 3 + 8 = 11\n\nA vector against itself gives its squared length:\n  a · a = 1×1 + 2×2 = 5,  so ‖a‖ = √5 ≈ 2.24\n\nTwo perpendicular vectors give zero:\n  [1, 0] · [0, 1] = 0",
    whyInAI: [
      "Attention scores every query against every key with a dot product — that number becomes how much one token attends to another.",
      "A single artificial neuron is a dot product of its inputs with its weights, plus a bias.",
      "Retrieval ranks candidates by dot product or its normalized form, cosine similarity."
    ],
    related: ["cosine-similarity", "vector-norms", "matrix-multiplication"],
    prerequisites: ["vectors"],
    tags: ["inner product", "scalar product", "similarity", "projection"],
    source: { label: "Mathematics for Machine Learning — Deisenroth, Faisal & Ong (Cambridge University Press, 2020)", url: "https://mml-book.github.io/" }
  },
  {
    slug: "vector-norms", symbol: "‖v‖", name: "Vector Norms", category: "linear-algebra", difficulty: "introductory", relation: "MEASURED_WITH",
    summary: "A measure of the length or magnitude of a vector.",
    intuition: "A norm answers the question how big is this vector, collapsing many numbers into one. The familiar answer is straight-line distance — the L2 norm, Pythagoras in n dimensions. A different answer, the L1 norm, just adds up the sizes of the entries. Which one you choose changes behaviour: L2 shrinks everything a little, L1 tends to push entries all the way to zero.",
    equation: "‖v‖₂ = √( Σᵢ vᵢ² )     (Euclidean / L2)\n\n‖v‖₁ = Σᵢ |vᵢ|          (Manhattan / L1)",
    equationNote: "The L2 norm squares each entry, so large entries dominate — this is why L2 penalties discourage extreme weights. The L1 norm treats every unit of magnitude equally, which is why it drives small entries to exactly zero and produces sparse results.",
    legend: [
      { symbol: "|vᵢ|", meaning: "the absolute value of an entry, ignoring sign" },
      { symbol: "‖v‖₂", meaning: "Euclidean length — the straight-line distance from the origin" },
      { symbol: "‖v‖₁", meaning: "the sum of the absolute entries" }
    ],
    worked: "  v = [3, 4]\n\n  ‖v‖₂ = √(3² + 4²) = √25 = 5\n  ‖v‖₁ = |3| + |4|  = 7\n\nNormalizing to unit length:\n  v / ‖v‖₂ = [0.6, 0.8],  and ‖[0.6, 0.8]‖₂ = 1",
    whyInAI: [
      "Normalization layers rescale representations by their norm so that activations stay in a workable range.",
      "Gradient clipping caps the norm of the gradient to stop a single large update from destabilizing training.",
      "Weight decay penalizes the L2 norm of the weights; magnitude pruning removes the entries with the smallest norm."
    ],
    related: ["dot-product", "cosine-similarity", "vectors"],
    prerequisites: ["vectors"],
    tags: ["length", "magnitude", "L1", "L2", "normalization", "regularization"],
    source: { label: "Numerical Linear Algebra — Trefethen & Bau (SIAM, 1997)", url: "https://doi.org/10.1137/1.9780898719574" }
  },
  {
    slug: "cosine-similarity", symbol: "cos θ", name: "Cosine Similarity", category: "linear-algebra", difficulty: "introductory", relation: "MEASURED_WITH",
    summary: "The dot product of two vectors divided by their lengths, giving a similarity score between −1 and 1 that ignores magnitude.",
    intuition: "Two documents about the same subject should count as similar whether one is a paragraph or a page. Cosine similarity achieves that by measuring only the angle between vectors and discarding their length. Pointing the same way scores 1, at right angles scores 0, pointing opposite scores −1.",
    equation: "cos θ = (a · b) / (‖a‖ ‖b‖)\n\n-1 ≤ cos θ ≤ 1",
    equationNote: "The numerator measures agreement and grows with both length and alignment; dividing by both lengths removes the magnitude, leaving pure direction. If vectors are already normalized to unit length, cosine similarity and the dot product are the same number.",
    legend: [
      { symbol: "a · b", meaning: "the dot product — raw agreement between the two vectors" },
      { symbol: "‖a‖ ‖b‖", meaning: "the product of the two lengths, which cancels magnitude out" },
      { symbol: "θ", meaning: "the angle between the vectors in their embedding space" }
    ],
    worked: "Identical direction:\n  a = [1, 2],  b = [2, 4]\n  a · b = 10,  ‖a‖ = √5,  ‖b‖ = √20\n  cos θ = 10 / (√5 · √20) = 10 / 10 = 1.0\n\nOrthogonal — unrelated:\n  a = [1, 0],  b = [0, 1]\n  cos θ = 0 / (1 · 1) = 0.0\n\nOpposing:\n  a = [1, 2],  b = [-1, -2]\n  cos θ = -5 / (√5 · √5) = -1.0",
    whyInAI: [
      "It is the default ranking score in semantic search and retrieval-augmented generation.",
      "It compares meaning rather than verbosity, so a short query can match a long passage.",
      "Vector databases index embeddings specifically to return the highest cosine matches quickly."
    ],
    related: ["dot-product", "vector-norms", "nearest-neighbour-search"],
    prerequisites: ["dot-product", "vector-norms"],
    tags: ["similarity", "angle", "ranking", "retrieval", "semantic"],
    source: { label: "A Vector Space Model for Automatic Indexing — Salton, Wong & Yang, Communications of the ACM (1975)", url: "https://doi.org/10.1145/361219.361220" }
  },
  {
    slug: "vector-spaces", symbol: "ℝⁿ", name: "Vector Spaces", category: "linear-algebra", difficulty: "intermediate", relation: "DEPENDS_ON",
    summary: "A set of vectors closed under addition and scaling, giving a consistent geometry in which directions and distances mean something.",
    intuition: "A vector space is a place where arithmetic on vectors always lands you somewhere still in the space. That guarantee is what lets a model treat meaning geometrically: it can add, average and interpolate representations and the results remain valid points to reason about. A basis is a minimal set of directions from which every point in the space can be built.",
    equation: "closure:  u, v ∈ V  ⟹  αu + βv ∈ V\n\nbasis:    v = Σᵢ cᵢ eᵢ    for a unique set of coefficients cᵢ\n\nsubspace: any subset of V that is itself closed",
    equationNote: "The first line is the whole definition: combining members of the space by scaling and adding never leaves it. The second says any point can be written as a recipe over a fixed set of basis directions. The third matters for adaptation methods, which confine an update to a small subspace.",
    legend: [
      { symbol: "V", meaning: "the vector space itself" },
      { symbol: "α, β", meaning: "scalars — any real numbers" },
      { symbol: "eᵢ", meaning: "the i-th basis direction" },
      { symbol: "cᵢ", meaning: "the coordinate of v along that direction" }
    ],
    worked: "In ℝ², the standard basis is:\n  e₁ = [1, 0],  e₂ = [0, 1]\n\nEvery point is a combination of the two:\n  [3, 5] = 3·e₁ + 5·e₂\n\nA subspace of ℝ² is any line through the origin, for example\nall multiples of [1, 2]. Adding or scaling within that line\nnever leaves it — which is exactly what a rank-1 update does\nto a weight matrix.",
    whyInAI: [
      "An embedding space is a vector space; distance and direction in it are the only things a retrieval system can act on.",
      "Because combinations stay inside the space, averaging embeddings or interpolating between them produces usable points.",
      "Parameter-efficient adaptation works by restricting updates to a low-dimensional subspace instead of the full space."
    ],
    related: ["vectors", "latent-space", "matrix-rank"],
    prerequisites: ["vectors"],
    tags: ["basis", "subspace", "span", "linear combination", "geometry"],
    source: { label: "Linear Algebra Done Right, 4th edition — Sheldon Axler (Springer, 2024)", url: "https://linear.axler.net/" }
  },
  {
    slug: "matrix-rank", symbol: "rank(A)", name: "Matrix Rank", category: "linear-algebra", difficulty: "intermediate", relation: "DEPENDS_ON",
    summary: "The number of genuinely independent directions a matrix contains — how much unique information it holds.",
    intuition: "A matrix can look large and still be repetitive. If every row is a rescaled copy of one row, the matrix has thousands of numbers but only one real direction in it. Rank counts the directions that are not redundant. Low rank means the matrix, however big, can be described by far fewer numbers than it appears to hold.",
    equation: "rank(A) = number of linearly independent rows\n        = number of linearly independent columns\n        ≤ min(m, n)\n\nfull rank:  rank(A) = min(m, n)\nlow rank:   rank(A) ≪ min(m, n)",
    equationNote: "Row rank always equals column rank — an unobvious fact that makes rank a single, well-defined property. It can never exceed the smaller dimension. The gap between the actual rank and that ceiling is exactly the redundancy a compression method can exploit.",
    legend: [
      { symbol: "linearly independent", meaning: "no row can be built by scaling and adding the others" },
      { symbol: "min(m, n)", meaning: "the smaller of the two dimensions — the maximum possible rank" },
      { symbol: "≪", meaning: "much smaller than" }
    ],
    worked: "  A = ⎡ 1  2  3 ⎤\n      ⎢ 2  4  6 ⎥\n      ⎣ 1  1  1 ⎦\n\nRow 2 is exactly 2 × row 1, so it adds nothing new.\nRows 1 and 3 are independent of each other.\n\n  rank(A) = 2,  not 3.\n\nNine numbers, but only two independent directions.",
    whyInAI: [
      "The central empirical claim behind LoRA is that the weight *update* needed to adapt a model has low intrinsic rank.",
      "If a matrix is low rank, storing two thin matrices instead of the full grid loses nothing and costs far less.",
      "Rank gives a principled way to talk about redundancy, which is the basis of most model compression."
    ],
    related: ["low-rank-factorization", "matrices", "vector-spaces"],
    prerequisites: ["matrices", "vector-spaces"],
    tags: ["independence", "redundancy", "degrees of freedom", "compression"],
    source: { label: "The Fundamental Theorem of Linear Algebra — Gilbert Strang, The American Mathematical Monthly (1993)", url: "https://doi.org/10.1080/00029890.1993.11990500" }
  },
  {
    slug: "low-rank-factorization", symbol: "BA", name: "Low-Rank Factorization", category: "linear-algebra", difficulty: "intermediate", relation: "USES",
    summary: "Approximating a large matrix as the product of two much thinner ones, cutting parameter count without changing the output shape.",
    intuition: "If a matrix only contains a few independent directions, you can rebuild it from two narrow matrices multiplied together — a tall one and a wide one. The product has the original shape, so nothing downstream notices, but the number of values you actually store and train collapses. This is the whole trick behind parameter-efficient fine-tuning.",
    equation: "ΔW ≈ B A\n\nB ∈ ℝ^{m×r},  A ∈ ℝ^{r×n},  r ≪ min(m, n)\n\nstored parameters:  m·r + r·n   instead of   m·n",
    equationNote: "The rank r is a dial. Small r means fewer parameters and a coarser approximation; larger r recovers more of the original matrix at more cost. Because BA has the same m × n shape as ΔW, the factorization is invisible to the rest of the network.",
    legend: [
      { symbol: "ΔW", meaning: "the change to a weight matrix that adaptation needs to learn" },
      { symbol: "r", meaning: "the chosen rank — the width of the bottleneck" },
      { symbol: "B, A", meaning: "the two thin factors that are actually trained" }
    ],
    worked: "A 4096 × 4096 weight matrix:\n\n  full:  4096 × 4096 = 16,777,216 parameters\n\nWith a rank r = 16 factorization:\n\n  B: 4096 × 16 =    65,536\n  A: 16 × 4096 =    65,536\n  total        =   131,072 parameters\n\n  131,072 / 16,777,216 = 0.0078  ≈ 0.78%\n\nUnder 1% of the original parameter count, and the product\nBA is still a 4096 × 4096 matrix.",
    whyInAI: [
      "LoRA trains only B and A while the original weights stay frozen, which is why adapters are megabytes rather than gigabytes.",
      "Many adapters can be swapped over one shared base model, since each is just a small pair of matrices.",
      "The same idea, applied by truncating a singular value decomposition, is a standard way to compress trained layers."
    ],
    related: ["matrix-rank", "matrix-multiplication", "matrices"],
    prerequisites: ["matrix-rank", "matrix-multiplication"],
    tags: ["factorization", "decomposition", "adapter", "compression", "SVD"],
    source: { label: "The Approximation of One Matrix by Another of Lower Rank — Eckart & Young, Psychometrika (1936)", url: "https://doi.org/10.1007/BF02288367" }
  },
  {
    slug: "basis-projection", symbol: "proj", name: "Basis and Projection", category: "linear-algebra", difficulty: "intermediate", relation: "USES",
    summary: "Choosing a set of reference directions, and casting a vector onto them to read off its components.",
    intuition: "A basis is a set of directions you agree to measure everything against; coordinates are just how far along each one you have travelled. Projection is the act of measuring: it drops a vector onto a direction and asks how much of it points that way. Nearly every learned layer in a model is a projection — it takes a representation and re-expresses it in directions the model found useful.",
    equation: "proj_u(v) = ((v · u) / (u · u)) u\n\nonto an orthonormal basis:\nv = Σᵢ (v · eᵢ) eᵢ",
    equationNote: "The scalar (v · u)/(u · u) is how much of v lies along u; multiplying it back by u gives the shadow of v on that direction. When the basis directions are orthonormal the arithmetic collapses: each coordinate is simply a dot product, which is why models overwhelmingly work in such bases.",
    legend: [
      { symbol: "v", meaning: "the vector being measured" },
      { symbol: "u", meaning: "the direction being measured against" },
      { symbol: "eᵢ", meaning: "the i-th orthonormal basis direction" },
      { symbol: "v · u", meaning: "the dot product — raw overlap between the two" }
    ],
    worked: "Project v = [3, 4] onto u = [1, 0]:\n\n  v · u = 3,  u · u = 1\n  proj = (3 / 1) · [1, 0] = [3, 0]\n\nThe shadow of v on the horizontal axis has length 3 —\nexactly its first coordinate, because [1, 0] is a basis\ndirection.\n\nAttention builds three such projections of the same input:\n\n  Q = X W_Q,   K = X W_K,   V = X W_V\n\nOne representation, read in three different bases.",
    whyInAI: [
      "Queries, keys and values are three learned projections of the same representation — the mechanism is projection before it is anything else.",
      "Every linear layer re-expresses its input in a new basis; what the network learns is which directions are worth measuring.",
      "Low-rank adaptation works by confining a weight update to a small basis, so only a handful of directions can change."
    ],
    related: ["vector-spaces", "dot-product", "low-rank-factorization"],
    prerequisites: ["vectors", "dot-product"],
    tags: ["basis", "projection", "coordinates", "orthonormal", "subspace"],
    source: { label: "Matrix Analysis and Applied Linear Algebra — Carl Meyer (SIAM, 2000)", url: "https://doi.org/10.1137/1.9780898719512" }
  },
  {
    slug: "eigenvalues", symbol: "λ", name: "Eigenvalues and Eigenvectors", category: "linear-algebra", difficulty: "advanced", relation: "DEPENDS_ON",
    summary: "The directions a matrix leaves pointing the same way, and the factors by which it stretches them.",
    intuition: "Most vectors get rotated when a matrix acts on them. A few special ones do not — they come out pointing exactly where they went in, only longer or shorter. Those are the eigenvectors, and the scaling factors are the eigenvalues. They expose what a transformation really does, stripped of the coordinate system you happened to write it in.",
    equation: "A v = λ v,   v ≠ 0\n\nfound by solving:  det(A − λI) = 0",
    equationNote: "The equation says: acting with A on v does nothing but rescale it. Large eigenvalues mark the directions a transformation amplifies; eigenvalues near zero mark directions it nearly destroys, which is precisely the redundancy that compression exploits.",
    legend: [
      { symbol: "λ", meaning: "the eigenvalue — the stretch factor" },
      { symbol: "v", meaning: "the eigenvector — a direction left unrotated" },
      { symbol: "I", meaning: "the identity matrix" },
      { symbol: "det", meaning: "determinant; setting it to zero finds the λ that admit a non-zero v" }
    ],
    worked: "  A = ⎡ 2  0 ⎤\n      ⎣ 0  3 ⎦\n\n  A · [1, 0] = [2, 0] = 2 · [1, 0]   → λ = 2\n  A · [0, 1] = [0, 3] = 3 · [0, 1]   → λ = 3\n\nThis matrix stretches horizontally by 2 and vertically\nby 3, and rotates nothing. Any other matrix does the same\nthing — just along axes that are not the ones you drew.",
    whyInAI: [
      "The eigenvalues of a transformation say which directions it amplifies, which is how repeated application either explodes or vanishes across layers.",
      "Spectral analysis of activation covariance is a standard interpretability tool for finding the directions a model actually uses.",
      "They are the machinery underneath the singular value decomposition, and so underneath every low-rank compression argument."
    ],
    related: ["singular-value-decomposition", "matrices", "matrix-rank"],
    prerequisites: ["matrices", "matrix-multiplication"],
    tags: ["spectrum", "eigendecomposition", "invariant direction", "stretch"],
    source: { label: "Numerical Methods for Large Eigenvalue Problems — Yousef Saad (SIAM, 2011)", url: "https://doi.org/10.1137/1.9781611970739" }
  },
  {
    slug: "singular-value-decomposition", symbol: "UΣVᵀ", name: "Singular Value Decomposition", category: "linear-algebra", difficulty: "advanced", relation: "APPROXIMATES",
    summary: "Factoring any matrix into a rotation, a set of stretches, and another rotation — and reading its rank straight off.",
    intuition: "Every matrix, whatever its shape, does the same three things in sequence: rotate, stretch along axes, rotate again. The SVD writes that down. The stretch factors, in descending order, say how much of the matrix's action lives in each direction. Keep the big ones and discard the small ones and you have the best possible approximation at that rank — which is the formal statement behind every low-rank method.",
    equation: "A = U Σ Vᵀ\n\nΣ = diag(σ₁ ≥ σ₂ ≥ … ≥ σᵣ > 0)\n\nbest rank-k approximation:\nA_k = Σ_{i=1}^{k} σᵢ uᵢ vᵢᵀ",
    equationNote: "U and V hold orthonormal directions; Σ holds the singular values, always non-negative and sorted. The number of non-zero singular values *is* the rank. Truncating after k terms gives the closest rank-k matrix there is — the Eckart–Young result that justifies low-rank factorization.",
    legend: [
      { symbol: "σᵢ", meaning: "the i-th singular value — how much the matrix stretches that direction" },
      { symbol: "U, V", meaning: "orthonormal bases for the output and input spaces" },
      { symbol: "Vᵀ", meaning: "the transpose of V" },
      { symbol: "A_k", meaning: "the rank-k truncation, the best approximation at that rank" }
    ],
    worked: "For a matrix with singular values:\n\n  σ = [12.0, 7.4, 0.9, 0.05, 0.01]\n\n  rank = 5 (all non-zero), but the first two carry\n\n  (12.0² + 7.4²) / Σσᵢ² = 199.8 / 200.6 = 99.6%\n\nof the total energy. Keeping k = 2 loses under half a\npercent while storing a fraction of the numbers.\n\nThat gap between the true rank and the *useful* rank is\nwhat every low-rank adapter is betting on.",
    whyInAI: [
      "It is the formal justification for low-rank adaptation: the best rank-r approximation is the truncated SVD, so choosing a small r is defensible rather than arbitrary.",
      "Truncating the SVD of a trained weight matrix is a standard, principled way to compress a layer after the fact.",
      "The decay of the singular values is a direct measurement of how much redundancy a matrix actually contains."
    ],
    related: ["low-rank-factorization", "matrix-rank", "eigenvalues"],
    prerequisites: ["eigenvalues", "matrix-rank"],
    tags: ["SVD", "decomposition", "singular values", "truncation", "compression"],
    source: { label: "Calculating the Singular Values and Pseudo-Inverse of a Matrix — Golub & Kahan, SIAM Journal on Numerical Analysis (1965)", url: "https://doi.org/10.1137/0702016" }
  },
  {
    slug: "latent-space", symbol: "z", name: "Latent Spaces", category: "linear-algebra", difficulty: "intermediate", relation: "DEPENDS_ON",
    summary: "A learned, compressed coordinate system in which position encodes meaning rather than raw appearance.",
    intuition: "Raw data is enormous and mostly redundant — neighbouring pixels are nearly identical, and most possible pixel grids are noise. A latent space is a much smaller set of coordinates the model invents for itself, where each direction corresponds to something that actually varies in the data. Working in that space is cheaper and, more importantly, closer to meaning.",
    equation: "z = f_θ(x),   z ∈ ℝ^d,   d ≪ dim(x)\n\nx̂ = g_φ(z)          (decode, if reconstruction is needed)\n\nprediction in latent space:  ẑ_target = h(z_context)",
    equationNote: "An encoder f compresses the input into z. Some architectures decode back to the input; predictive architectures such as JEPA deliberately do not, and instead predict the latent representation of a missing part directly — which avoids spending capacity on details that carry no meaning.",
    legend: [
      { symbol: "x", meaning: "the raw input — pixels, tokens, audio samples" },
      { symbol: "z", meaning: "the latent representation" },
      { symbol: "d", meaning: "the latent dimension, far smaller than the input size" },
      { symbol: "f_θ", meaning: "the encoder, with learned parameters θ" }
    ],
    worked: "A 224 × 224 RGB image:\n\n  raw:    224 × 224 × 3 = 150,528 numbers\n  latent: 768 numbers\n\n  compression ratio ≈ 196 ×\n\nThe 768 numbers keep what distinguishes images from one\nanother and discard what does not — which is why two photos\nof the same object land close together in latent space even\nthough almost none of their pixels match.",
    whyInAI: [
      "JEPA predicts in latent space precisely to avoid wasting capacity on unpredictable pixel-level detail.",
      "Latent diffusion runs the expensive denoising loop in a compressed space, which is what made high-resolution generation practical.",
      "Embeddings are latent representations put to work: the whole point is that distance in that space tracks meaning."
    ],
    related: ["vector-spaces", "vectors", "cosine-similarity"],
    prerequisites: ["vector-spaces"],
    tags: ["representation", "embedding space", "compression", "encoder", "manifold"],
    source: { label: "Representation Learning: A Review and New Perspectives — Bengio, Courville & Vincent (2012)", url: "https://arxiv.org/abs/1206.5538" }
  },

  /* ================================================================= */
  /* Probability & statistics                                           */
  /* ================================================================= */
  {
    slug: "probability-distributions", symbol: "p(x)", name: "Probability Distributions", category: "probability", difficulty: "introductory", relation: "DEPENDS_ON",
    summary: "An assignment of likelihood across every possible outcome, summing to one.",
    intuition: "A model rarely commits to a single answer. It spreads belief across the options: this token is likely, that one is possible, the rest are close to ruled out. A distribution is that spread written down. Two rules make it coherent — no negative belief, and the total is exactly one.",
    equation: "p(x) ≥ 0  for every x\n\nΣ_x p(x) = 1        (discrete)\n∫ p(x) dx = 1       (continuous)",
    equationNote: "The constraint that everything sums to one is what forces a trade-off: raising the probability of one outcome must lower others. That is why a model becoming confident about one token necessarily becomes less open to the alternatives.",
    legend: [
      { symbol: "p(x)", meaning: "the probability assigned to outcome x" },
      { symbol: "Σ_x", meaning: "sum over every possible outcome" },
      { symbol: "∫ … dx", meaning: "the continuous equivalent of that sum" }
    ],
    worked: "Three possible next tokens:\n\n  p(\"the\")  = 0.66\n  p(\"a\")    = 0.24\n  p(\"cat\")  = 0.10\n              ─────\n  total     = 1.00\n\nRaising p(\"the\") to 0.80 forces the other two down to a\ncombined 0.20 — belief is a fixed budget.",
    whyInAI: [
      "A language model's output is a probability distribution over the whole vocabulary at every step.",
      "Generative models are distribution estimators: they learn the shape of the data and then draw from it.",
      "Calibration — whether a stated 70% confidence is right about 70% of the time — is a question about this distribution."
    ],
    related: ["conditional-probability", "sampling", "entropy", "softmax"],
    prerequisites: [],
    tags: ["likelihood", "density", "uncertainty", "calibration"],
    source: { label: "Pattern Recognition and Machine Learning — Christopher Bishop (Springer, 2006)", url: "https://www.microsoft.com/en-us/research/publication/pattern-recognition-machine-learning/" }
  },
  {
    slug: "conditional-probability", symbol: "P(A|B)", name: "Conditional Probability", category: "probability", difficulty: "introductory", relation: "DEPENDS_ON",
    summary: "The probability of one event given that another is already known to have happened.",
    intuition: "Context changes the odds. The probability that the next word is Paris is low in general and high after the phrase the capital of France is. Conditional probability is the machinery for updating belief once you know something, and it is the entire operating principle of a language model: everything it produces is conditioned on what came before.",
    equation: "P(A | B) = P(A ∩ B) / P(B),   P(B) > 0\n\nchain rule:\nP(x₁, x₂, …, x_T) = Π_{t=1}^{T} P(x_t | x₁ … x_{t-1})",
    equationNote: "The first line restricts attention to the worlds where B happened and asks how often A also happened there. The chain rule is what makes sequence modelling tractable: an impossibly large joint probability over a whole document becomes a product of one-step-ahead predictions.",
    legend: [
      { symbol: "P(A | B)", meaning: "probability of A given B — read the bar as \"given\"" },
      { symbol: "P(A ∩ B)", meaning: "probability that both happen" },
      { symbol: "Π", meaning: "multiply the terms together" },
      { symbol: "x₁ … x_{t-1}", meaning: "all tokens before position t — the context" }
    ],
    worked: "Modelling the sentence \"the cat sat\":\n\n  P(\"the cat sat\")\n    = P(\"the\")\n    × P(\"cat\" | \"the\")\n    × P(\"sat\" | \"the cat\")\n\nEach factor is one forward pass. Retrieval changes the\nconditioning set rather than the model:\n\n  P(answer | question)         → unreliable\n  P(answer | question, source) → grounded",
    whyInAI: [
      "Next-token prediction is the direct computation of P(next token | context).",
      "The chain rule is why generation is sequential: each step conditions on everything already produced.",
      "Retrieval, prompting and grounding all work by changing what the model conditions on, not by changing the model."
    ],
    related: ["probability-distributions", "maximum-likelihood", "markov-process"],
    prerequisites: ["probability-distributions"],
    tags: ["bayes", "chain rule", "context", "conditioning", "given"],
    source: { label: "An Essay towards solving a Problem in the Doctrine of Chances — Bayes & Price, Philosophical Transactions (1763)", url: "https://doi.org/10.1098/rstl.1763.0053" }
  },
  {
    slug: "logits", symbol: "z", name: "Logits", category: "probability", difficulty: "introductory", relation: "USES",
    summary: "The raw, unnormalized scores a model produces before they are turned into probabilities.",
    intuition: "The last layer of a classifier or language model emits one number per option. These numbers are not probabilities — they can be negative, they do not sum to anything in particular. They are just scores, where higher means more preferred. Turning them into probabilities is a separate step, and keeping the two apart matters both numerically and because several controls act on the scores directly.",
    equation: "z = W h + b,   z ∈ ℝ^K\n\ntemperature:  z' = z / T\n\nlogit of a probability:  logit(p) = ln( p / (1 − p) )",
    equationNote: "Logits come from a plain linear layer over the final hidden state. Dividing by a temperature T before normalizing rescales the gaps between them: T below 1 exaggerates differences and sharpens the output, T above 1 flattens it. The third line is where the name comes from — the log-odds function that inverts the sigmoid.",
    legend: [
      { symbol: "h", meaning: "the model's final hidden representation" },
      { symbol: "W, b", meaning: "the weights and bias of the output layer" },
      { symbol: "K", meaning: "the number of options — vocabulary size for a language model" },
      { symbol: "T", meaning: "sampling temperature" }
    ],
    worked: "Three logits from a model head:\n\n  z = [2.0, 1.0, 0.1]\n\nAt temperature T = 0.5 the gaps double:\n\n  z' = [4.0, 2.0, 0.2]\n\nThe ordering never changes — temperature only affects how\nsharply the eventual probabilities separate.",
    whyInAI: [
      "Temperature, top-k and top-p all operate on logits, before any probability exists.",
      "Loss functions are computed from logits directly for numerical stability, never from probabilities that have already been rounded.",
      "A logit gap is a useful raw confidence signal for routing, abstention and evaluation."
    ],
    related: ["softmax", "probability-distributions", "numerical-stability"],
    prerequisites: [],
    tags: ["scores", "temperature", "output layer", "log-odds", "unnormalized"],
    source: { label: "Application of the Logistic Function to Bio-Assay — Joseph Berkson, Journal of the American Statistical Association (1944)", url: "https://doi.org/10.1080/01621459.1944.10500699" }
  },
  {
    slug: "softmax", symbol: "σ", name: "Softmax", category: "probability", difficulty: "introductory", relation: "USES",
    summary: "A function that turns any list of scores into a probability distribution that sums to one.",
    intuition: "Softmax is the standard translator from scores to probabilities. It exponentiates each score — which makes everything positive and amplifies differences — then divides by the total so the results sum to one. The exponential is why it is soft rather than a hard maximum: the winner takes most of the mass, but the runners-up keep a share proportional to how close they were.",
    equation: "softmax(z)ᵢ = exp(zᵢ) / Σ_{j=1}^{K} exp(z_j)\n\nwith temperature:\nsoftmax(z / T)ᵢ = exp(zᵢ/T) / Σ_j exp(z_j/T)",
    equationNote: "Exponentiating guarantees positive values; dividing by the sum guarantees they total one. Because exp grows fast, a score gap of 1 becomes a probability ratio of about 2.7 — the function is far more decisive than a plain proportional split would be.",
    legend: [
      { symbol: "zᵢ", meaning: "the i-th logit" },
      { symbol: "exp(zᵢ)", meaning: "e raised to that score — always positive" },
      { symbol: "Σ_j exp(z_j)", meaning: "the normalizing total across all K options" },
      { symbol: "T", meaning: "temperature; T → 0 approaches picking the maximum outright" }
    ],
    worked: "  z = [2.0, 1.0, 0.1]\n\n  exp(2.0) = 7.389\n  exp(1.0) = 2.718\n  exp(0.1) = 1.105\n  ────────────────\n  sum      = 11.212\n\n  softmax(z) = [7.389/11.212, 2.718/11.212, 1.105/11.212]\n             = [0.659, 0.242, 0.099]\n\n  0.659 + 0.242 + 0.099 = 1.000\n\nThe top score was twice the second; after softmax it holds\nnearly three times the probability.",
    whyInAI: [
      "Attention applies softmax to scaled dot-product scores, turning them into weights that sum to one across the sequence.",
      "Every next-token distribution is a softmax over vocabulary-sized logits.",
      "Mixture-of-experts routing uses softmax to decide how much each expert contributes to a token."
    ],
    related: ["logits", "probability-distributions", "cross-entropy", "numerical-stability"],
    prerequisites: ["logits"],
    tags: ["normalization", "attention weights", "temperature", "exponential"],
    source: { label: "Probabilistic Interpretation of Feedforward Classification Network Outputs — John Bridle, Neurocomputing (1990)", url: "https://doi.org/10.1007/978-3-642-76153-9_28" }
  },
  {
    slug: "sampling", symbol: "x ~ p", name: "Sampling", category: "probability", difficulty: "intermediate", relation: "USES",
    summary: "Drawing concrete outcomes from a probability distribution, and estimating quantities from those draws.",
    intuition: "A distribution describes what could happen; sampling is picking one. It is also how you compute things that are impossible to work out exactly: instead of summing over every possibility, draw a few hundred at random and average. That is why the same idea underlies both creative variation in generation and hard numerical estimates in reinforcement learning and evaluation.",
    equation: "x ~ p(x)\n\nMonte Carlo estimate:\nE_p[f(x)] ≈ (1/N) Σ_{i=1}^{N} f(xᵢ),   xᵢ ~ p\n\nerror shrinks as 1/√N",
    equationNote: "The tilde means drawn from. The estimate says: to average a function over a distribution you cannot enumerate, sample from it and take the mean. The 1/√N rate is the practical catch — quartering the error costs sixteen times the samples.",
    legend: [
      { symbol: "~", meaning: "\"is drawn from\"" },
      { symbol: "E_p[f(x)]", meaning: "the expected value of f under distribution p" },
      { symbol: "N", meaning: "the number of samples drawn" }
    ],
    worked: "Given softmax output [0.659, 0.242, 0.099]:\n\n  greedy decoding  → always option 1\n  sampling         → option 1 about 66% of the time,\n                      option 2 about 24%,\n                      option 3 about 10%\n\nEvaluating a model on 100 prompts is a Monte Carlo estimate\nof its true pass rate — with roughly a ±5 point margin.\nReaching ±1 point needs about 2,500 prompts.",
    whyInAI: [
      "Decoding strategy — greedy, temperature, top-k, top-p — is a choice about how to sample from the model's distribution.",
      "Diffusion generation is a long chain of sampling steps that gradually turns noise into structure.",
      "Reinforcement learning estimates returns from sampled rollouts, and benchmark scores are sampled estimates with real error bars."
    ],
    related: ["probability-distributions", "softmax", "expected-return"],
    prerequisites: ["probability-distributions"],
    tags: ["monte carlo", "decoding", "temperature", "top-k", "randomness", "estimation"],
    source: { label: "The Monte Carlo Method — Metropolis & Ulam, Journal of the American Statistical Association (1949)", url: "https://doi.org/10.1080/01621459.1949.10483310" }
  },
  {
    slug: "maximum-likelihood", symbol: "θ̂", name: "Maximum Likelihood Estimation", category: "probability", difficulty: "intermediate", relation: "OPTIMIZED_BY",
    summary: "Choosing the parameters that make the observed data as probable as possible.",
    intuition: "Given data and a model with adjustable settings, maximum likelihood picks the settings under which the data you actually saw would have been least surprising. Turning the product of probabilities into a sum of logarithms, and flipping the sign, converts this into a minimization — at which point it is literally the cross-entropy loss used to pretrain every language model.",
    equation: "θ̂ = argmax_θ Π_{i=1}^{N} p(xᵢ | θ)\n\n   = argmin_θ  − Σ_{i=1}^{N} log p(xᵢ | θ)",
    equationNote: "The two lines are the same problem. Products of many small probabilities underflow to zero in floating point, so the logarithm is taken — it turns the product into a sum and is monotonic, so the answer is unchanged. Negating turns the maximization into the minimization that gradient descent expects.",
    legend: [
      { symbol: "θ", meaning: "the model parameters being fitted" },
      { symbol: "θ̂", meaning: "the chosen estimate — the argmax" },
      { symbol: "argmax_θ", meaning: "the value of θ that makes the expression largest" },
      { symbol: "− Σ log p", meaning: "negative log-likelihood, which is the training loss" }
    ],
    worked: "A coin lands heads 7 times in 10 flips.\nFor a model with parameter θ = P(heads):\n\n  likelihood = θ⁷ (1 − θ)³\n\nMaximizing gives θ̂ = 7/10 = 0.7 — the observed frequency.\n\nPretraining is the same procedure at scale: adjust billions\nof parameters so the corpus that was actually written comes\nout as likely as possible.",
    whyInAI: [
      "Language model pretraining is maximum likelihood estimation over a corpus, nothing more exotic.",
      "It explains why cross-entropy is the default loss: it is the negative log-likelihood written out.",
      "It also explains a known failure mode — a model fits the distribution of its training text, including its errors and biases."
    ],
    related: ["cross-entropy", "conditional-probability", "loss-functions"],
    prerequisites: ["probability-distributions", "conditional-probability"],
    tags: ["MLE", "likelihood", "estimation", "fitting", "log-likelihood"],
    source: { label: "On the Mathematical Foundations of Theoretical Statistics — R. A. Fisher, Philosophical Transactions A (1922)", url: "https://doi.org/10.1098/rsta.1922.0009" }
  },

  /* ================================================================= */
  /* Information theory                                                 */
  /* ================================================================= */
  {
    slug: "entropy", symbol: "H", name: "Entropy", category: "information", difficulty: "intermediate", relation: "MEASURED_WITH",
    summary: "A measure of how uncertain a distribution is — the average surprise of an outcome drawn from it.",
    intuition: "If one outcome is nearly certain, learning what happened tells you almost nothing, and entropy is near zero. If every outcome is equally likely, the result is maximally informative, and entropy is at its highest. Measured in bits, entropy is the average number of yes-or-no questions needed to pin down an outcome.",
    equation: "H(p) = − Σ_x p(x) log p(x)\n\n0 ≤ H(p) ≤ log K",
    equationNote: "Each outcome contributes its probability times its surprise, −log p(x). Rare outcomes are very surprising but seldom occur; common ones occur often but say little. Entropy is the balance of the two. With logarithms base 2 the unit is bits; the maximum, log K, happens when all K outcomes are equally likely.",
    legend: [
      { symbol: "−log p(x)", meaning: "the surprise of outcome x — larger when x is unlikely" },
      { symbol: "K", meaning: "the number of possible outcomes" },
      { symbol: "H(p)", meaning: "the average surprise, in bits when log is base 2" }
    ],
    worked: "A fair coin:\n  H = −(0.5 log₂ 0.5 + 0.5 log₂ 0.5) = 1 bit\n\nA biased coin, 90/10:\n  H = −(0.9 log₂ 0.9 + 0.1 log₂ 0.1) ≈ 0.47 bits\n\nA certain outcome:\n  H = −(1 · log₂ 1) = 0 bits\n\nThe fair coin is the most uncertain and carries the most\ninformation per flip.",
    whyInAI: [
      "Perplexity, the standard language modelling metric, is the exponential of cross-entropy — an entropy measurement in disguise.",
      "A low-entropy output distribution means the model is confident; a high-entropy one means it is hedging across many options.",
      "Entropy bonuses are used in reinforcement learning to stop a policy collapsing onto one action too early."
    ],
    related: ["cross-entropy", "kl-divergence", "probability-distributions"],
    prerequisites: ["probability-distributions"],
    tags: ["uncertainty", "information", "bits", "surprise", "perplexity"],
    source: { label: "A Mathematical Theory of Communication — Claude Shannon, Bell System Technical Journal (1948)", url: "https://doi.org/10.1002/j.1538-7305.1948.tb01338.x" }
  },
  {
    slug: "cross-entropy", symbol: "H(p, q)", name: "Cross-Entropy", category: "information", difficulty: "intermediate", relation: "MEASURED_WITH",
    summary: "The average surprise of the true outcomes when scored under the model's predicted distribution — the standard training loss.",
    intuition: "Cross-entropy measures the cost of believing q when reality is p. If the model puts high probability on what actually happened, the surprise is small and the loss is low. If it confidently predicted something else, the loss is large. Because the correct answer is usually a single known token, the formula collapses to something very simple: the negative logarithm of the probability the model gave the right answer.",
    equation: "H(p, q) = − Σ_x p(x) log q(x)\n\none-hot target:\nL = − log q(correct)",
    equationNote: "The general form weights each outcome's surprise by how often it truly occurs. In supervised training the truth is a single known label, so every term but one is multiplied by zero — leaving only the model's log-probability on the correct answer. That is why the loss punishes confident mistakes far more harshly than uncertain ones.",
    legend: [
      { symbol: "p", meaning: "the true distribution — usually one-hot on the correct answer" },
      { symbol: "q", meaning: "the model's predicted distribution, typically a softmax output" },
      { symbol: "q(correct)", meaning: "the probability the model assigned to the right answer" }
    ],
    worked: "The model outputs [0.659, 0.242, 0.099]\nand option 1 is correct:\n\n  L = − ln(0.659) = 0.417\n\nIf option 3 had been correct instead:\n\n  L = − ln(0.099) = 2.313\n\nAnd for a confident mistake, q(correct) = 0.01:\n\n  L = − ln(0.01) = 4.605\n\nThe loss rises without bound as the model's probability on\nthe truth approaches zero.",
    whyInAI: [
      "It is the loss used to pretrain and fine-tune essentially every language model and classifier.",
      "It is exactly the negative log-likelihood, so minimizing it is maximum likelihood estimation.",
      "Knowledge distillation replaces the one-hot target with the teacher's full distribution, which is why the general form matters."
    ],
    related: ["entropy", "kl-divergence", "softmax", "maximum-likelihood"],
    prerequisites: ["entropy", "softmax"],
    tags: ["loss", "log loss", "training objective", "negative log-likelihood"],
    source: { label: "Elements of Information Theory, 2nd edition — Cover & Thomas (Wiley, 2006)", url: "https://doi.org/10.1002/047174882X" }
  },
  {
    slug: "kl-divergence", symbol: "D_KL", name: "Kullback–Leibler Divergence", category: "information", difficulty: "intermediate", relation: "MEASURED_WITH",
    summary: "A measure of how far one probability distribution is from another, in units of extra surprise.",
    intuition: "KL divergence answers: if I use distribution q when the truth is p, how much extra surprise does that cost me? It is zero only when the two match, and grows as they diverge. It is not a distance in the everyday sense — swapping p and q gives a different number — but it is the natural way to say two distributions disagree, and it is how models are kept from drifting too far during alignment.",
    equation: "D_KL(p ‖ q) = Σ_x p(x) log( p(x) / q(x) )\n\n            = H(p, q) − H(p)\n\nD_KL ≥ 0,  and  D_KL = 0  ⟺  p = q",
    equationNote: "The second line is the clearest reading: KL divergence is cross-entropy minus the entropy that was unavoidable anyway. What remains is purely the penalty for using the wrong distribution. It is asymmetric — D_KL(p‖q) ≠ D_KL(q‖p) — so which argument goes first is a modelling decision, not a detail.",
    legend: [
      { symbol: "p ‖ q", meaning: "divergence *of q from p*, with p treated as the reference" },
      { symbol: "H(p, q)", meaning: "cross-entropy of the pair" },
      { symbol: "H(p)", meaning: "the entropy of p — the irreducible part" },
      { symbol: "⟺", meaning: "if and only if" }
    ],
    worked: "  p = [0.9, 0.1]      the reference\n  q = [0.5, 0.5]      a flatter guess\n\n  D_KL(p ‖ q)\n    = 0.9 · ln(0.9/0.5) + 0.1 · ln(0.1/0.5)\n    = 0.9 · 0.5878 + 0.1 · (−1.6094)\n    = 0.529 − 0.161\n    = 0.368 nats\n\nReversing the arguments gives 0.351 — a different number,\nwhich is the asymmetry made concrete.",
    whyInAI: [
      "RLHF and PPO add a KL penalty against the original model, so preference training improves behaviour without destroying the base capabilities.",
      "Direct preference optimization is derived from a KL-constrained objective, which is where its closed form comes from.",
      "Distillation minimizes the KL divergence between student and teacher distributions; variational autoencoders use it to regularize the latent space."
    ],
    related: ["entropy", "cross-entropy", "probability-distributions"],
    prerequisites: ["entropy", "cross-entropy"],
    tags: ["relative entropy", "divergence", "regularization", "trust region", "drift"],
    source: { label: "On Information and Sufficiency — Kullback & Leibler, Annals of Mathematical Statistics (1951)", url: "https://doi.org/10.1214/aoms/1177729694" }
  },

  /* ================================================================= */
  /* Calculus & optimization                                            */
  /* ================================================================= */
  {
    slug: "gradients", symbol: "∇", name: "Gradients", category: "optimization", difficulty: "introductory", relation: "OPTIMIZED_BY",
    summary: "The vector of partial derivatives, pointing in the direction of steepest increase of a function.",
    intuition: "A derivative in one dimension tells you the slope: change the input a little, how much does the output move? With millions of inputs you get one slope per input, and collecting them into a vector gives the gradient. It points uphill. Training walks the other way — and the reason it works at all is that this single vector says how every parameter should change.",
    equation: "∇f(θ) = [ ∂f/∂θ₁, ∂f/∂θ₂, …, ∂f/∂θₙ ]\n\n∂f/∂θᵢ  =  how much f changes per unit change in θᵢ,\n           holding every other parameter fixed",
    equationNote: "Each partial derivative isolates one parameter and asks about its individual effect. Assembled into a vector, they give both a direction — steepest ascent — and a magnitude — how steep. A near-zero gradient means the parameter has little influence, which is what vanishing gradients describe.",
    legend: [
      { symbol: "∇", meaning: "\"nabla\" — the gradient operator" },
      { symbol: "∂f/∂θᵢ", meaning: "partial derivative of f with respect to the i-th parameter" },
      { symbol: "θ", meaning: "the full parameter vector" }
    ],
    worked: "  f(θ₁, θ₂) = θ₁² + 3θ₂\n\n  ∂f/∂θ₁ = 2θ₁\n  ∂f/∂θ₂ = 3\n\n  ∇f = [2θ₁, 3]\n\nAt the point (2, 1):\n\n  ∇f = [4, 3]\n\nSteepest increase is along [4, 3]; the second parameter has\na constant influence of 3 regardless of where you stand.",
    whyInAI: [
      "The gradient of the loss with respect to every parameter is the only signal training has about how to improve.",
      "Vanishing and exploding gradients — the reason residual connections and normalization exist — are statements about this vector's magnitude.",
      "Gradient magnitudes are also used diagnostically, for attribution and for detecting layers that have stopped learning."
    ],
    related: ["gradient-descent", "backpropagation", "loss-functions"],
    prerequisites: [],
    tags: ["derivative", "partial derivative", "slope", "nabla", "calculus"],
    source: { label: "Deep Learning, chapter 4: Numerical Computation — Goodfellow, Bengio & Courville (MIT Press, 2016)", url: "https://www.deeplearningbook.org/contents/numerical.html" }
  },
  {
    slug: "gradient-descent", symbol: "θ ← θ − η∇L", name: "Gradient Descent", category: "optimization", difficulty: "introductory", relation: "OPTIMIZED_BY",
    summary: "Repeatedly nudging parameters in the direction that most reduces the loss.",
    intuition: "Stand on a hillside in fog. You cannot see the valley, but you can feel which way is downhill. Take a small step that way and repeat. That is the entire training algorithm. The step size matters more than anything else: too small and you never arrive, too large and you bounce over the valley floor and diverge.",
    equation: "θ_{t+1} = θ_t − η ∇L(θ_t)\n\nstochastic version — one mini-batch at a time:\nθ_{t+1} = θ_t − η ∇L_batch(θ_t)",
    equationNote: "Subtracting the gradient moves against steepest ascent, so the loss goes down. Computing the gradient over the whole dataset is infeasible at scale, so the stochastic version uses a mini-batch: a noisier estimate of the same direction, but thousands of times cheaper. Optimizers such as Adam refine this by adapting η per parameter from the history of past gradients.",
    legend: [
      { symbol: "η", meaning: "the learning rate — how far to step" },
      { symbol: "∇L", meaning: "the gradient of the loss" },
      { symbol: "t", meaning: "the training step" },
      { symbol: "L_batch", meaning: "loss over a mini-batch rather than the full dataset" }
    ],
    worked: "  L(θ) = θ²,  so  ∇L = 2θ\n\nStarting at θ = 4 with learning rate η = 0.1:\n\n  step 1:  θ = 4    − 0.1 · 8    = 3.2\n  step 2:  θ = 3.2  − 0.1 · 6.4  = 2.56\n  step 3:  θ = 2.56 − 0.1 · 5.12 = 2.048\n\nSteady progress toward the minimum at θ = 0.\nWith η = 1.1 instead, the first step overshoots to −4.8 and\nthe values grow without bound — the loss diverges.",
    whyInAI: [
      "Every trained model — pretrained, fine-tuned or adapted — arrived at its weights through this loop.",
      "Learning rate schedules, warmup and Adam all exist to manage the one quantity this update is most sensitive to.",
      "LoRA changes nothing about the optimization; it only reduces which parameters the update is applied to."
    ],
    related: ["gradients", "loss-functions", "backpropagation"],
    prerequisites: ["gradients"],
    tags: ["SGD", "Adam", "learning rate", "optimizer", "training loop", "convergence"],
    source: { label: "Convex Optimization — Boyd & Vandenberghe (Cambridge University Press, 2004)", url: "https://web.stanford.edu/~boyd/cvxbook/" }
  },
  {
    slug: "backpropagation", symbol: "∂L/∂w", name: "Backpropagation", category: "optimization", difficulty: "intermediate", relation: "OPTIMIZED_BY",
    summary: "Applying the chain rule backwards through a network to get the gradient of the loss for every parameter in one pass.",
    intuition: "A network is a long composition of functions, and the loss sits at the end. To find how a weight in the first layer affected that loss you multiply together the sensitivities of every step in between — the chain rule. Backpropagation does this once, from the output backwards, reusing partial results instead of recomputing them, which is what makes training billions of parameters affordable at all.",
    equation: "chain rule:\n∂L/∂w = (∂L/∂a) · (∂a/∂z) · (∂z/∂w)\n\nfor a stack of layers:\n∂L/∂w⁽ˡ⁾ = δ⁽ˡ⁾ · (a⁽ˡ⁻¹⁾)ᵀ,   δ⁽ˡ⁾ = (W⁽ˡ⁺¹⁾)ᵀ δ⁽ˡ⁺¹⁾ ⊙ f′(z⁽ˡ⁾)",
    equationNote: "The first line is the whole idea: sensitivity travels backwards as a product of local sensitivities. The second is the same statement for a layered network — the error signal δ is passed back through the transposed weights, so one backward sweep produces every gradient. Cost is roughly twice a forward pass, not once per parameter.",
    legend: [
      { symbol: "L", meaning: "the loss at the output" },
      { symbol: "δ⁽ˡ⁾", meaning: "the error signal arriving at layer l" },
      { symbol: "⊙", meaning: "element-wise multiplication" },
      { symbol: "f′", meaning: "the derivative of the activation function" }
    ],
    worked: "A two-step chain:  L = a²,  a = 3z,  z = 2w\n\n  ∂L/∂a = 2a\n  ∂a/∂z = 3\n  ∂z/∂w = 2\n\n  ∂L/∂w = 2a · 3 · 2 = 12a\n\nAt w = 1:  z = 2, a = 6, so ∂L/∂w = 72.\n\nNotice each factor is local — computed from one step only —\nyet multiplying them gives the effect across the whole chain.",
    whyInAI: [
      "It is what makes deep networks trainable; without it, gradients would cost one forward pass per parameter.",
      "Vanishing and exploding gradients come directly from this product of terms shrinking or growing over many layers.",
      "Because gradients flow backwards through every layer, activations must be kept in memory — the main reason training needs far more memory than inference."
    ],
    related: ["gradients", "gradient-descent", "matrix-multiplication"],
    prerequisites: ["gradients"],
    tags: ["chain rule", "autograd", "backward pass", "error signal"],
    source: { label: "Learning representations by back-propagating errors — Rumelhart, Hinton & Williams, Nature (1986)", url: "https://doi.org/10.1038/323533a0" }
  },
  {
    slug: "loss-functions", symbol: "L", name: "Loss Functions", category: "optimization", difficulty: "introductory", relation: "OPTIMIZED_BY",
    summary: "A single number measuring how wrong a model's output is, defining what training actually optimizes.",
    intuition: "Training needs one number to push down. The loss function is where you state what wrong means for your problem — and that choice, more than the architecture, determines what the model learns to do. Predicting a quantity, choosing a category and pulling similar things together are three different definitions of wrong, and each has its own standard loss.",
    equation: "L = (1/N) Σᵢ ℓ( ŷᵢ, yᵢ )\n\nsquared error:   ℓ = (ŷ − y)²\ncross-entropy:   ℓ = − log q(correct)\ncontrastive:     ℓ = − log[ exp(sim(a,b⁺)/τ) / Σ exp(sim(a,b)/τ) ]",
    equationNote: "The outer form is always the same: score every example, take the mean. What changes is ℓ. Squared error suits continuous targets. Cross-entropy suits categorical ones. A contrastive loss has no fixed target at all — it only requires that a matching pair scores higher than the non-matching alternatives, which is how models learn representations without labels.",
    legend: [
      { symbol: "ŷ", meaning: "the model's prediction" },
      { symbol: "y", meaning: "the target" },
      { symbol: "b⁺", meaning: "the positive — the item that genuinely matches a" },
      { symbol: "τ", meaning: "a temperature controlling how sharply the contrast is scored" }
    ],
    worked: "Squared error on three predictions:\n\n  ŷ = [2.5, 0.0, 2.0]\n  y = [3.0, 0.0, 2.0]\n\n  ℓ = [0.25, 0.00, 0.00]\n  L = 0.25 / 3 = 0.083\n\nA contrastive batch with a matching pair at similarity 0.9\nand three non-matches near 0.1 gives a small loss; if the\nnon-matches score 0.9 too, the loss is large — the model is\npenalized for failing to *separate*, not for being inexact.",
    whyInAI: [
      "The loss is the operational definition of the task: change it and you change what the model becomes, whatever the architecture.",
      "JEPA's objective is a prediction loss in latent space, which is precisely why it learns semantics instead of pixel detail.",
      "Alignment methods work by adding terms — a preference term, a KL penalty — to the loss rather than by changing the model."
    ],
    related: ["cross-entropy", "gradient-descent", "maximum-likelihood"],
    prerequisites: [],
    tags: ["objective", "cost function", "MSE", "contrastive", "criterion"],
    source: { label: "The Elements of Statistical Learning, 2nd edition — Hastie, Tibshirani & Friedman (Springer, 2009)", url: "https://hastie.su.domains/ElemStatLearn/" }
  },

  {
    slug: "adam", symbol: "Adam", name: "Adam Optimization", category: "optimization", difficulty: "intermediate", relation: "OPTIMIZED_BY",
    summary: "A gradient descent variant that gives every parameter its own adaptive step size, from the running history of its gradients.",
    intuition: "Plain gradient descent uses one learning rate for millions of parameters, which is a bad compromise: some need bold steps, others tiny ones. Adam keeps two running averages per parameter — the recent direction and the recent size of its gradients — and divides one by the other. Parameters with consistently large gradients get damped; ones that barely move get amplified. It is the default optimizer for almost every model you will meet.",
    equation: "m_t = β₁ m_{t-1} + (1 − β₁) g_t          (momentum)\nv_t = β₂ v_{t-1} + (1 − β₂) g_t²         (scale)\n\nθ_{t+1} = θ_t − η · m̂_t / (√v̂_t + ε)",
    equationNote: "m tracks where the gradient has been pointing, smoothing out noise. v tracks how large it has been. Dividing by √v normalises the step, so the effective learning rate adapts per parameter. The hats denote a bias correction that matters only in the first few steps, when the averages start at zero.",
    legend: [
      { symbol: "g_t", meaning: "the gradient at step t" },
      { symbol: "β₁, β₂", meaning: "decay rates for the two averages, typically 0.9 and 0.999" },
      { symbol: "η", meaning: "the base learning rate" },
      { symbol: "ε", meaning: "a small constant, typically 1e-8, keeping the denominator away from zero" }
    ],
    worked: "One parameter with a steady gradient of 0.1:\n\n  m → 0.1,  v → 0.01,  √v → 0.1\n  step = η · 0.1 / 0.1 = η\n\nAnother with a steady gradient of 10:\n\n  m → 10,  v → 100,  √v → 10\n  step = η · 10 / 10 = η\n\nBoth move by the same amount despite gradients differing\na hundredfold. That scale-invariance is the whole point —\nand the reason Adam needs so little learning-rate tuning.",
    whyInAI: [
      "It is the default optimizer for transformer training; the reported learning rate for almost any modern model is an Adam learning rate.",
      "It stores two extra values per parameter, so the optimizer state costs roughly twice the model itself — a major part of why training needs far more memory than inference.",
      "Adaptive steps are what make training stable across layers whose gradients differ by orders of magnitude."
    ],
    related: ["gradient-descent", "gradients", "loss-functions"],
    prerequisites: ["gradient-descent"],
    tags: ["optimizer", "momentum", "adaptive learning rate", "AdamW"],
    source: { label: "Adam: A Method for Stochastic Optimization — Kingma & Ba (2014)", url: "https://arxiv.org/abs/1412.6980" }
  },
  {
    slug: "regularization", symbol: "λ‖θ‖", name: "Regularization", category: "optimization", difficulty: "intermediate", relation: "OPTIMIZED_BY",
    summary: "Adding a penalty or a constraint that discourages a model from fitting its training data too exactly.",
    intuition: "A model with enough capacity can memorise its training set perfectly and still be useless on anything new. Regularization deliberately makes the training objective harder to minimise, so the model has to prefer simpler explanations. The most common form just adds the size of the weights to the loss: fitting the data is rewarded, being large is punished, and the balance between them is a dial you set.",
    equation: "L_total = L_data + λ · R(θ)\n\nL2 (weight decay):  R(θ) = ‖θ‖₂²\nL1 (sparsity):      R(θ) = ‖θ‖₁\n\ndropout: zero each unit independently with probability p",
    equationNote: "λ sets how much the penalty matters: zero means no regularization, large means the model prefers small weights over fitting the data. L2 shrinks everything smoothly, L1 drives entries to exactly zero. Dropout is a different mechanism to the same end — it prevents any one unit from being relied on.",
    legend: [
      { symbol: "λ", meaning: "regularization strength — the trade-off dial" },
      { symbol: "R(θ)", meaning: "the penalty term, a function of the weights alone" },
      { symbol: "‖θ‖₂²", meaning: "the sum of squared weights" },
      { symbol: "p", meaning: "dropout probability" }
    ],
    worked: "Two weight vectors fitting the data equally well:\n\n  θ_A = [3.0, 0.1]   ‖θ‖₂² = 9.01\n  θ_B = [1.5, 1.5]   ‖θ‖₂² = 4.50\n\nWith λ = 0.1 the penalty costs 0.901 against 0.450, so the\nobjective prefers θ_B — the solution that spreads its\nreliance across both inputs rather than leaning on one.\n\nThat preference is the entire mechanism.",
    whyInAI: [
      "Weight decay is applied by default in essentially every large-model training run; it is part of what the optimizer means.",
      "Fine-tuning on a small dataset is where over-fitting bites hardest, which is why adapters and low-rank updates are themselves a form of capacity constraint.",
      "Magnitude pruning is regularization taken to its conclusion: penalise small weights, then remove them outright."
    ],
    related: ["loss-functions", "vector-norms", "gradient-descent"],
    prerequisites: ["loss-functions", "vector-norms"],
    tags: ["weight decay", "overfitting", "dropout", "penalty", "generalization"],
    source: { label: "Ridge Regression: Biased Estimation for Nonorthogonal Problems — Hoerl & Kennard, Technometrics (1970)", url: "https://doi.org/10.1080/00401706.1970.10488634" }
  },

  /* ================================================================= */
  /* Numerical mathematics                                              */
  /* ================================================================= */
  {
    slug: "floating-point", symbol: "fp16", name: "Floating-Point Precision", category: "numerical", difficulty: "intermediate", relation: "APPROXIMATES",
    summary: "How computers represent real numbers with a finite number of bits, trading range against accuracy.",
    intuition: "A computer cannot store most real numbers exactly. Floating point is the compromise: a few bits for the exponent, which sets the range, and the rest for the significand, which sets the accuracy. Choosing fewer bits makes every weight smaller in memory and every operation faster — the entire premise of quantization — at the cost of representing each value less precisely.",
    equation: "x = (−1)^s × 1.m × 2^{e − bias}\n\n  fp32:  1 sign,  8 exponent, 23 significand   → 4 bytes\n  fp16:  1 sign,  5 exponent, 10 significand   → 2 bytes\n  bf16:  1 sign,  8 exponent,  7 significand   → 2 bytes\n  int8:  8-bit integer with a scale factor      → 1 byte",
    equationNote: "The exponent bits decide how large and small a number can be; the significand bits decide how finely values can be distinguished within that range. bf16 keeps fp32's exponent and sacrifices precision instead — which is why it rarely overflows during training where fp16 does.",
    legend: [
      { symbol: "s", meaning: "sign bit" },
      { symbol: "m", meaning: "significand, or mantissa — the precision bits" },
      { symbol: "e", meaning: "exponent — the range bits" },
      { symbol: "bias", meaning: "a fixed offset letting the exponent represent negative powers" }
    ],
    worked: "Memory for a 7-billion-parameter model, weights only:\n\n  fp32:  7e9 × 4 bytes = 28 GB\n  fp16:  7e9 × 2 bytes = 14 GB\n  int8:  7e9 × 1 byte  =  7 GB\n  4-bit: 7e9 × 0.5     =  3.5 GB\n\nThat progression is the difference between a data-centre\naccelerator and a laptop. Nothing about the model changes —\nonly how precisely each weight is written down.",
    whyInAI: [
      "Quantization is precision reduction: the entire technique is a choice about how many bits each weight gets.",
      "Mixed-precision training stores master weights in fp32 while computing in fp16 or bf16, keeping speed without losing stability.",
      "QLoRA works by holding a 4-bit frozen base model in memory while training adapters at higher precision on top."
    ],
    related: ["rounding-error", "numerical-stability"],
    prerequisites: [],
    tags: ["fp16", "bf16", "int8", "precision", "bits", "memory", "IEEE 754"],
    source: { label: "IEEE Standard for Floating-Point Arithmetic (IEEE 754-2019)", url: "https://doi.org/10.1109/IEEESTD.2019.8766229" }
  },
  {
    slug: "rounding-error", symbol: "Δx", name: "Rounding and Approximation Error", category: "numerical", difficulty: "intermediate", relation: "APPROXIMATES",
    summary: "The gap introduced whenever a value is snapped to the nearest representable number.",
    intuition: "Reduce precision and every value must move to the nearest available slot. That movement is the error, and it is bounded by half the gap between slots. Whether it matters depends on the ratio of the error to the signal: for weights whose useful information sits well above the noise floor, quite coarse rounding turns out to be harmless — which is the empirical reason 4-bit models work.",
    equation: "x̂ = round(x / s) · s\n\n|x̂ − x| ≤ s / 2\n\nscale for a symmetric range:\ns = max|x| / (2^{b−1} − 1)",
    equationNote: "Dividing by the step size s, rounding, and multiplying back is the whole quantization operation. The error can never exceed half a step. The third line sets that step from the actual range of the values and the bit budget — which is why per-channel or per-block scales beat one global scale: they keep s small where the values are small.",
    legend: [
      { symbol: "s", meaning: "the quantization step — the gap between representable values" },
      { symbol: "b", meaning: "the number of bits available" },
      { symbol: "x̂", meaning: "the quantized value" },
      { symbol: "max|x|", meaning: "the largest magnitude in the block being quantized" }
    ],
    worked: "Quantizing with step s = 0.1:\n\n  x = 0.734  →  round(7.34) · 0.1 = 0.7\n  error = 0.034,  within the bound s/2 = 0.05\n\nNow with an outlier in the block:\n\n  values in [−0.5, 0.5] and one at 8.0\n  8-bit symmetric scale:  s = 8.0 / 127 = 0.063\n\nThe outlier has forced a coarse step on every small value.\nThis is exactly why outlier-aware and per-block schemes\nexist — one extreme weight otherwise degrades the rest.",
    whyInAI: [
      "It sets the accuracy budget for quantization: how much quality you give up for each bit you remove.",
      "It explains why a handful of outlier weights can wreck a naive quantization scheme while per-block scaling survives.",
      "Errors accumulate across layers, so what is negligible in one matrix multiplication may not be after eighty of them."
    ],
    related: ["floating-point", "numerical-stability"],
    prerequisites: ["floating-point"],
    tags: ["quantization error", "rounding", "approximation", "scale", "outliers"],
    source: { label: "What Every Computer Scientist Should Know About Floating-Point Arithmetic — David Goldberg, ACM Computing Surveys (1991)", url: "https://doi.org/10.1145/103162.103163" }
  },
  {
    slug: "numerical-stability", symbol: "κ", name: "Numerical Stability", category: "numerical", difficulty: "advanced", relation: "APPROXIMATES",
    summary: "Whether small representation errors stay small as they pass through a computation, or get amplified into nonsense.",
    intuition: "The same formula can be written several algebraically identical ways that behave completely differently in finite precision. A stable version keeps small errors small; an unstable one magnifies them until the result is meaningless — or until it overflows to infinity. Much of what looks like arbitrary implementation detail in model code is stability engineering.",
    equation: "stable softmax:\nsoftmax(z)ᵢ = exp(zᵢ − max z) / Σ_j exp(z_j − max z)\n\nlog-sum-exp:\nlog Σ exp(z_j) = max z + log Σ exp(z_j − max z)\n\nnormalization epsilon:\nx̂ = (x − μ) / √(σ² + ε)",
    equationNote: "Subtracting the maximum leaves softmax mathematically unchanged — the constant cancels top and bottom — but the largest exponent becomes exp(0) = 1, so nothing can overflow. Log-sum-exp applies the same trick where the logarithm is needed directly. The ε in normalization prevents division by a variance that has rounded to zero.",
    legend: [
      { symbol: "max z", meaning: "the largest logit, subtracted to keep exponents in range" },
      { symbol: "ε", meaning: "a small constant, typically 1e-5, guarding the denominator" },
      { symbol: "σ²", meaning: "the variance of the activations being normalized" },
      { symbol: "κ", meaning: "condition number — how much a computation amplifies input error" }
    ],
    worked: "Naive softmax on large logits:\n\n  z = [1000, 999, 998]\n  exp(1000) overflows fp32  →  inf / inf  →  NaN\n\nWith the maximum subtracted:\n\n  z − max z = [0, −1, −2]\n  exp → [1.000, 0.368, 0.135],  sum = 1.503\n  softmax    = [0.665, 0.245, 0.090]\n\nSame mathematics, entirely different outcome in floating\npoint. Every production softmax is written the second way.",
    whyInAI: [
      "Loss is computed from logits rather than probabilities specifically to avoid taking the logarithm of a rounded-to-zero number.",
      "Layer normalization's epsilon, gradient clipping and loss scaling in mixed precision are all stability measures, not tuning knobs.",
      "Aggressive quantization stresses stability hardest — a scheme that is fine in isolation may produce NaNs once composed across many layers."
    ],
    related: ["floating-point", "rounding-error", "softmax"],
    prerequisites: ["floating-point"],
    tags: ["overflow", "underflow", "NaN", "log-sum-exp", "epsilon", "conditioning"],
    source: { label: "Accuracy and Stability of Numerical Algorithms, 2nd edition — Nicholas Higham (SIAM, 2002)", url: "https://doi.org/10.1137/1.9780898718027" }
  },

  /* ================================================================= */
  /* Graphs & discrete mathematics                                      */
  /* ================================================================= */
  {
    slug: "graph-theory", symbol: "G = (V, E)", name: "Graph Theory", category: "discrete", difficulty: "introductory", relation: "DEPENDS_ON",
    summary: "The study of objects and the connections between them, as nodes joined by edges.",
    intuition: "Whenever what matters is not the things themselves but how they relate, you have a graph. Entities become nodes, relationships become edges, and questions about structure — what is connected to what, what is central, what is the shortest route — become computable. Once written as an adjacency matrix, a graph is also just linear algebra.",
    equation: "G = (V, E),   E ⊆ V × V\n\nadjacency matrix:  Aᵢⱼ = 1 if (i, j) ∈ E, else 0\n\ndegree of node i:  dᵢ = Σⱼ Aᵢⱼ\npaths of length k:  (A^k)ᵢⱼ",
    equationNote: "The last line is the bridge between the two views: raising the adjacency matrix to the power k counts the walks of length k between every pair of nodes. Multi-hop reasoning over a knowledge graph is, formally, matrix multiplication.",
    legend: [
      { symbol: "V", meaning: "the set of nodes — entities, concepts, documents" },
      { symbol: "E", meaning: "the set of edges — the relationships" },
      { symbol: "A", meaning: "the adjacency matrix encoding which pairs are connected" },
      { symbol: "dᵢ", meaning: "degree — how many edges touch node i" }
    ],
    worked: "Three nodes: 1—2, 2—3\n\n  A = ⎡ 0  1  0 ⎤\n      ⎢ 1  0  1 ⎥\n      ⎣ 0  1  0 ⎦\n\n  degrees: d₁ = 1, d₂ = 2, d₃ = 1\n\nNode 2 is the hub. Squaring A gives (A²)₁₃ = 1: exactly one\ntwo-hop path from 1 to 3, through 2 — the kind of connection\na plain text search would never surface.",
    whyInAI: [
      "A knowledge graph is this structure applied to entities and relations, giving retrieval something a flat document index cannot express.",
      "GraphRAG traverses edges to gather connected context, so an answer can rest on a chain of facts rather than one passage.",
      "Agent plans, tool dependencies and RAG pipelines are all directed graphs, which is why cycle detection and topological order matter in practice."
    ],
    related: ["nearest-neighbour-search", "matrices"],
    prerequisites: [],
    tags: ["nodes", "edges", "adjacency", "traversal", "network", "DAG"],
    source: { label: "Graph Theory, 5th edition — Reinhard Diestel (Springer GTM 173, 2017)", url: "https://link.springer.com/book/10.1007/978-3-662-53622-3" }
  },
  {
    slug: "nearest-neighbour-search", symbol: "k-NN", name: "Nearest-Neighbour Search", category: "discrete", difficulty: "intermediate", relation: "USES",
    summary: "Finding the items in a collection closest to a query point under some distance or similarity measure.",
    intuition: "Once meaning is a position in space, retrieval becomes geometry: embed the query, then find the stored vectors nearest to it. Checking every vector is exact but too slow at scale, so real systems build an index — often a navigable graph — and accept returning almost the right answers in exchange for millisecond latency. That trade is called approximate nearest-neighbour search.",
    equation: "exact top-k:\n  N_k(q) = the k items x ∈ D maximizing sim(q, x)\n\ncost:  exact O(N·d)   vs   approximate ≈ O(log N · d)\n\nrecall@k = |returned ∩ true top-k| / k",
    equationNote: "Exact search compares the query against all N stored vectors, each of dimension d — linear in corpus size and hopeless past a few million. Approximate methods navigate a graph or partition of the space instead. Recall@k measures what that speed cost you: the fraction of the genuine top-k that came back.",
    legend: [
      { symbol: "q", meaning: "the query vector" },
      { symbol: "D", meaning: "the stored collection of vectors" },
      { symbol: "N, d", meaning: "number of vectors and their dimension" },
      { symbol: "recall@k", meaning: "retrieval quality — 1.0 means the approximation missed nothing" }
    ],
    worked: "Query q = [1, 0]; three candidates:\n\n  x₁ = [0.9, 0.1]   cos = 0.994\n  x₂ = [0.0, 1.0]   cos = 0.000\n  x₃ = [-1.0, 0.0]  cos = -1.000\n\n  top-1 → x₁\n\nAt 10 million vectors of dimension 768, exact search means\n7.68 billion multiply-adds per query. An HNSW index answers\nin milliseconds at roughly 95–99% recall — the accuracy you\ntrade for a system that can actually serve traffic.",
    whyInAI: [
      "This is the retrieval step in RAG: the quality of everything downstream is capped by what these neighbours contain.",
      "A vector database is essentially a nearest-neighbour index with storage, filtering and updates built around it.",
      "Recall, latency and memory are a three-way trade — the tuning that decides whether a RAG system feels accurate or fast."
    ],
    related: ["cosine-similarity", "graph-theory", "vector-norms"],
    prerequisites: ["cosine-similarity"],
    tags: ["ANN", "k-NN", "HNSW", "index", "recall", "retrieval", "vector search"],
    source: { label: "Efficient and robust approximate nearest neighbor search using Hierarchical Navigable Small World graphs — Malkov & Yashunin (2016)", url: "https://arxiv.org/abs/1603.09320" }
  },

  /* ================================================================= */
  /* Dynamical systems & control                                        */
  /* ================================================================= */
  {
    slug: "markov-process", symbol: "P(s′|s,a)", name: "Markov Processes", category: "dynamics", difficulty: "intermediate", relation: "DEPENDS_ON",
    summary: "A model of a system that moves between states, where the next state depends only on the current one.",
    intuition: "The Markov property is a simplifying assumption with enormous payoff: the present state contains everything relevant about the past. You need not carry history, only where you are now. Add actions and rewards and you have a Markov decision process — the standard formalism for any agent making a sequence of decisions.",
    equation: "Markov property:\nP(s_{t+1} | s_t, s_{t-1}, …, s₀) = P(s_{t+1} | s_t)\n\nMarkov decision process:\n(S, A, P, R, γ)   with   P(s′ | s, a)   and   R(s, a)",
    equationNote: "The first line is the assumption itself: conditioning on the whole history gives the same answer as conditioning on the latest state alone. The tuple below adds the pieces needed for decision-making — states, actions, transition probabilities, rewards and a discount factor.",
    legend: [
      { symbol: "s_t", meaning: "the state at time t" },
      { symbol: "a", meaning: "an action taken by the agent" },
      { symbol: "P(s′ | s, a)", meaning: "probability of landing in s′ after taking a in s" },
      { symbol: "γ", meaning: "discount factor, weighting near rewards above distant ones" }
    ],
    worked: "Two states, Working and Broken:\n\n        →W     →B\n  W:   0.9    0.1\n  B:   0.3    0.7\n\nFrom Working, the chance of still working in two steps:\n\n  0.9 × 0.9 + 0.1 × 0.3 = 0.81 + 0.03 = 0.84\n\nNothing about how the machine reached Working enters the\ncalculation — that is the Markov property doing its work.",
    whyInAI: [
      "Reinforcement learning is defined on Markov decision processes; policies, value functions and returns all presuppose this structure.",
      "RLHF and PPO inherit the formalism, treating generation as a sequence of decisions with a reward at the end.",
      "It also names a real limitation: when the true state is only partially observed, the Markov assumption is an approximation, and agent memory exists to patch it."
    ],
    related: ["expected-return", "conditional-probability", "dynamical-systems"],
    prerequisites: ["conditional-probability"],
    tags: ["MDP", "state", "transition", "memoryless", "policy", "decision process"],
    source: { label: "Markov Decision Processes: Discrete Stochastic Dynamic Programming — Martin Puterman (Wiley, 1994)", url: "https://doi.org/10.1002/9780470316887" }
  },
  {
    slug: "expected-return", symbol: "G_t", name: "Expected Return", category: "dynamics", difficulty: "intermediate", relation: "OPTIMIZED_BY",
    summary: "The discounted sum of future rewards an agent expects from a state, which is what reinforcement learning maximizes.",
    intuition: "An agent should not chase the next reward but the total it can accumulate. Expected return adds up everything still to come, discounting distant rewards because they are less certain and less urgent. The discount factor is the agent's patience dial, and it is the reason a system will accept a poor immediate step for a better outcome later.",
    equation: "G_t = r_{t+1} + γ r_{t+2} + γ² r_{t+3} + …\n    = Σ_{k=0}^{∞} γ^k r_{t+k+1}\n\nvalue function:  V^π(s) = E_π[ G_t | s_t = s ]\n\nBellman:  V^π(s) = E[ r + γ V^π(s′) ]",
    equationNote: "γ between 0 and 1 makes the infinite sum converge and sets the horizon: γ = 0.9 effectively looks about ten steps ahead, γ = 0.99 about a hundred. The Bellman equation is the recursive restatement that makes it computable — the value of a state is the immediate reward plus the discounted value of wherever you land next.",
    legend: [
      { symbol: "r_t", meaning: "reward received at time t" },
      { symbol: "γ", meaning: "discount factor between 0 and 1" },
      { symbol: "V^π(s)", meaning: "expected return from state s when following policy π" },
      { symbol: "E_π", meaning: "expectation over the trajectories the policy produces" }
    ],
    worked: "Rewards of 0, 0, then 1, with γ = 0.9:\n\n  G = 0 + 0.9×0 + 0.81×1 = 0.81\n\nThe same reward arriving immediately would be worth 1.0.\nWith γ = 0.5 the delayed reward is worth only 0.25 — a much\nmore short-sighted agent.\n\nIn RLHF the reward arrives once, at the end of a generated\nresponse, so the entire sequence is credited from a single\nterminal signal.",
    whyInAI: [
      "It is the objective in reinforcement learning: a policy is good exactly insofar as it produces high expected return.",
      "RLHF replaces a hand-written reward with a model trained on human preferences, but the quantity being maximized is unchanged.",
      "Because the return is an expectation, it must be estimated from sampled rollouts — which is why RL training is noisy and sample-hungry."
    ],
    related: ["markov-process", "sampling", "probability-distributions"],
    prerequisites: ["markov-process"],
    tags: ["reward", "discount", "value function", "Bellman", "credit assignment"],
    source: { label: "A Markovian Decision Process — Richard Bellman, Journal of Mathematics and Mechanics (1957)", url: "https://doi.org/10.1512/iumj.1957.6.56038" }
  },
  {
    slug: "state-space-models", symbol: "x′ = Ax + Bu", name: "State-Space Models", category: "dynamics", difficulty: "advanced", relation: "DEPENDS_ON",
    summary: "A sequence model that carries a hidden state forward with a linear update, one step at a time.",
    intuition: "Instead of letting every position look at every other position, a state-space model keeps a running summary — the state — and updates it as each new input arrives. Cost grows with sequence length rather than its square. The reason this became practical is that a linear recurrence can be unrolled into a convolution and evaluated in parallel during training, then run step by step at inference. You get the training speed of a transformer with the inference cost of a recurrent network.",
    equation: "x_{t+1} = A x_t + B u_t\ny_t     = C x_t + D u_t\n\nunrolled as a convolution:\ny = u * K,   K = (CB, CAB, CA²B, …)",
    equationNote: "A decides what the state remembers and how fast it forgets; B how new input enters; C how the state is read out. Because the recurrence is linear, the whole sequence can be computed as one convolution with the kernel K — that is what makes training parallel rather than sequential.",
    legend: [
      { symbol: "x_t", meaning: "the hidden state at step t — the running summary" },
      { symbol: "u_t", meaning: "the input at step t" },
      { symbol: "A, B, C, D", meaning: "learned matrices governing memory, input, readout and pass-through" },
      { symbol: "K", meaning: "the convolution kernel the recurrence unrolls into" }
    ],
    worked: "A one-dimensional state with A = 0.9, B = 1, C = 1:\n\n  x₁ = 0.9·0 + 1 = 1.00\n  x₂ = 0.9·1 + 0 = 0.90\n  x₃ = 0.9·0.9   = 0.81\n\nA single input at step 1 still contributes 0.81 three steps\nlater — the state remembers, decaying geometrically.\n\nSetting A = 0.5 instead gives 0.25 by step 3: a shorter\nmemory. What the model learns in A is how long to hold on.",
    whyInAI: [
      "It is the architecture behind recent long-context sequence models, offering linear rather than quadratic scaling in sequence length.",
      "It gives a precise account of what a recurrent hidden state is, and why gradients through it vanish or explode.",
      "A world model is a state-space model in substance: predict the next state from the current state and the action taken."
    ],
    related: ["dynamical-systems", "markov-process", "matrix-multiplication"],
    prerequisites: ["dynamical-systems", "matrices"],
    tags: ["SSM", "Mamba", "S4", "recurrence", "hidden state", "long context"],
    source: { label: "Efficiently Modeling Long Sequences with Structured State Spaces — Gu, Goel & Ré (2021)", url: "https://arxiv.org/abs/2111.00396" }
  },
  {
    slug: "dynamical-systems", symbol: "ẋ = f(x)", name: "Dynamical Systems", category: "dynamics", difficulty: "advanced", relation: "DEPENDS_ON",
    summary: "The mathematics of how a state evolves over time under a fixed rule.",
    intuition: "A dynamical system is a state plus a rule for updating it. The rule is fixed; the behaviour it produces can be anything from settling to a resting point to never repeating at all. This is the language for describing systems that unfold over time, which is what a world model must learn and what a sequence model implicitly is.",
    equation: "continuous:  dx/dt = f(x, u, t)\n\ndiscrete:    x_{t+1} = f(x_t, u_t)\n\nlinear state-space model:\n  x_{t+1} = A x_t + B u_t\n  y_t     = C x_t + D u_t",
    equationNote: "The first two lines say the same thing in continuous and stepwise time: the next state is a function of the current state and any input. The state-space form is the linear special case — and the structure behind recent sequence architectures, where A, B, C are learned and the recurrence can be evaluated in parallel.",
    legend: [
      { symbol: "x", meaning: "the state — everything needed to determine what happens next" },
      { symbol: "u", meaning: "the input or control applied at each step" },
      { symbol: "f", meaning: "the transition rule" },
      { symbol: "A, B, C, D", meaning: "the matrices of a linear state-space model" }
    ],
    worked: "A one-dimensional discrete system:\n\n  x_{t+1} = 0.5 x_t + u_t\n\nStarting at x₀ = 8 with no input:\n\n  8 → 4 → 2 → 1 → 0.5 → …\n\nIt decays toward 0 — a stable system, because the multiplier\nis below 1. Set it to 1.5 and the same rule diverges. Whether\na learned recurrence remembers or forgets is this property.",
    whyInAI: [
      "A world model is a learned dynamical system: given a state and an action, predict the next state.",
      "State-space sequence models are literally the linear form above, with matrices learned rather than specified.",
      "Diffusion sampling can be written as the discretization of a continuous process, which is how faster solvers were derived."
    ],
    related: ["markov-process", "latent-space"],
    prerequisites: [],
    tags: ["state space", "evolution", "stability", "recurrence", "world model", "SSM"],
    source: { label: "Nonlinear Dynamics and Chaos, 2nd edition — Steven Strogatz (CRC Press, 2015)", url: "https://doi.org/10.1201/9780429492563" }
  }
];
