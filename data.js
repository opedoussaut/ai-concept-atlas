window.AI_CATEGORIES = [
  { id: "foundations", name: "Foundations", short: "Foundations", color: "#5de7ff" },
  { id: "architectures", name: "Model architectures", short: "Architectures", color: "#b58cff" },
  { id: "training", name: "Training & adaptation", short: "Training", color: "#6ea8ff" },
  { id: "retrieval", name: "Retrieval & knowledge", short: "Knowledge", color: "#62e4d2" },
  { id: "agents", name: "Agents & orchestration", short: "Agents", color: "#cf8cff" },
  { id: "inference", name: "Inference & optimization", short: "Inference", color: "#75b8ff" },
  { id: "multimodal", name: "Multimodal AI", short: "Multimodal", color: "#5de7e1" },
  { id: "safety", name: "Evaluation, safety & reliability", short: "Safety", color: "#6ce6af" }
];

window.AI_CONCEPTS = [
  {
    slug: "ai", acronym: "AI", name: "Artificial Intelligence", category: "foundations",
    summary: "The broad field of building systems that perform tasks associated with human intelligence.",
    why: "AI is the umbrella concept connecting perception, prediction, language, reasoning, planning, generation and action.",
    how: "AI systems combine data, algorithms, models, compute and feedback to map inputs to useful predictions, decisions or generated outputs.",
    example: "A maintenance assistant reads a fault description, retrieves the correct procedure and proposes the next diagnostic step.",
    tags: ["intelligence", "automation", "reasoning"], related: ["ml", "genai", "agent"],
    source: { label: "Computing Machinery and Intelligence — Turing, Mind (1950)", url: "https://doi.org/10.1093/mind/LIX.236.433" },
    mathIntensity: "low",
    mathNote: "Artificial intelligence is the umbrella term, not a technique. The mathematics lives in the specific methods gathered under it — every one of which has its own foundations."
  },
  {
    slug: "ml", acronym: "ML", name: "Machine Learning", category: "foundations",
    summary: "Methods that learn patterns from data instead of relying only on explicitly programmed rules.",
    why: "ML allows systems to improve predictions and decisions when the relationships in data are too complex to encode manually.",
    how: "A learning algorithm adjusts model parameters to reduce error on examples, then applies the learned pattern to new inputs.",
    example: "A model learns from historical sensor data to predict whether a component is likely to fail.",
    tags: ["learning", "data", "prediction"], related: ["ai", "dl", "supervised-learning"],
    source: { label: "Some Studies in Machine Learning Using the Game of Checkers — Samuel, IBM Journal of Research and Development (1959)", url: "https://doi.org/10.1147/rd.33.0210" },
    mathIntensity: "medium",
    mathFoundations: [
      { slug: "loss-functions", importance: "primary", note: "Machine learning is defined by having an objective to minimise; the loss is where the task is actually stated." },
      { slug: "gradient-descent", importance: "primary", note: "Learning from data means adjusting parameters to reduce that loss, step by step." },
      { slug: "probability-distributions", importance: "supporting", note: "Most methods model uncertainty explicitly rather than committing to a single answer." },
      { slug: "maximum-likelihood", importance: "supporting", note: "Fitting a model to data is, in most cases, maximum likelihood estimation under another name." }
    ]
  },
  {
    slug: "dl", acronym: "DL", name: "Deep Learning", category: "foundations",
    summary: "Machine learning based on neural networks with many processing layers.",
    why: "Deep learning powers most modern breakthroughs in language, vision, speech and generative AI.",
    how: "Multiple layers progressively transform raw input into increasingly abstract representations while training adjusts millions or billions of parameters.",
    example: "A vision model learns edges, shapes, parts and complete objects across successive layers.",
    tags: ["neural networks", "representation learning"], related: ["ml", "nn", "transformer"],
    source: { label: "Deep learning — LeCun, Bengio & Hinton, Nature (2015)", url: "https://doi.org/10.1038/nature14539" },
    mathIntensity: "high",
    mathFoundations: [
      { slug: "matrix-multiplication", importance: "primary", note: "A deep network is a stack of matrix multiplications separated by non-linearities." },
      { slug: "backpropagation", importance: "primary", note: "Depth is only trainable because one backward pass yields the gradient for every layer at once." },
      { slug: "gradients", importance: "primary", note: "Each of those millions of parameters is updated using its own partial derivative of the loss." },
      { slug: "gradient-descent", importance: "supporting", note: "The optimizer applies them repeatedly; nothing more exotic is happening." },
      { slug: "loss-functions", importance: "supporting", note: "What the network becomes is decided by the objective, not by the architecture alone." }
    ]
  },
  {
    slug: "nlp", acronym: "NLP", name: "Natural Language Processing", category: "foundations",
    summary: "AI techniques for understanding, generating and transforming human language.",
    why: "NLP enables search, translation, summarization, assistants, information extraction and conversational interfaces.",
    how: "Text is converted into tokens and numerical representations that a model processes to classify, retrieve or generate language.",
    example: "An assistant summarizes a technical report and extracts its decisions and action items.",
    tags: ["language", "text", "linguistics"], related: ["tokenization", "transformer", "llm"],
    source: { label: "Speech and Language Processing — Jurafsky & Martin, Stanford (3rd edition draft)", url: "https://web.stanford.edu/~jurafsky/slp3/" },
    mathIntensity: "medium",
    mathFoundations: [
      { slug: "vectors", importance: "primary", note: "Language becomes tractable only once tokens are represented as vectors." },
      { slug: "probability-distributions", importance: "primary", note: "Most language tasks are framed as a distribution over possible outputs." },
      { slug: "cosine-similarity", importance: "supporting", note: "Comparing meaning between pieces of text is a geometric operation in that space." }
    ]
  },
  {
    slug: "cv", acronym: "CV", name: "Computer Vision", category: "foundations",
    summary: "AI methods for interpreting images, video and other visual signals.",
    why: "Computer vision supports inspection, robotics, medical imaging, autonomous systems and visual search.",
    how: "Models learn spatial and semantic patterns to classify images, detect objects, segment regions or estimate motion and depth.",
    example: "A quality-control model detects surface defects on manufactured components.",
    tags: ["vision", "image", "video"], related: ["cnn", "vlm", "image-modality"],
    source: { label: "Computer Vision: Algorithms and Applications — Szeliski (2nd edition)", url: "https://szeliski.org/Book/" },
    mathIntensity: "medium",
    mathFoundations: [
      { slug: "matrix-multiplication", importance: "primary", note: "Convolution over an image is implemented as matrix multiplication over unfolded patches." },
      { slug: "vectors", importance: "supporting", note: "Pixels, patches and whole images all become vectors before a model reasons about them." },
      { slug: "latent-space", importance: "supporting", note: "What a vision model learns is a compressed representation in which visual similarity is geometric." }
    ]
  },
  {
    slug: "rl", acronym: "RL", name: "Reinforcement Learning", category: "foundations",
    summary: "Learning through interaction, where an agent seeks actions that maximize cumulative reward.",
    why: "RL is useful for sequential decisions, control, planning, robotics and preference optimization.",
    how: "The agent observes a state, chooses an action, receives feedback and updates its policy to improve long-term outcomes.",
    example: "A robot learns a manipulation policy by receiving higher reward for successful grasps.",
    tags: ["reward", "policy", "control"], related: ["agent", "ppo", "rlhf"],
    source: { label: "Reinforcement Learning: An Introduction — Sutton & Barto (2nd edition), MIT Press", url: "https://mitpress.mit.edu/9780262039246/reinforcement-learning/" },
    mathIntensity: "high",
    mathFoundations: [
      { slug: "markov-process", importance: "primary", note: "Reinforcement learning is defined on a Markov decision process: states, actions, transitions and rewards." },
      { slug: "expected-return", importance: "primary", note: "The policy is optimised to maximise discounted future reward, not immediate reward." },
      { slug: "probability-distributions", importance: "supporting", note: "A policy is a distribution over actions given a state." },
      { slug: "sampling", importance: "supporting", note: "Returns are estimated from sampled rollouts, which is why RL training is noisy and sample-hungry." },
      { slug: "gradient-descent", importance: "supporting", note: "Policy parameters are updated by gradient ascent on the estimated return." }
    ]
  },
  {
    slug: "genai", acronym: "GenAI", name: "Generative AI", category: "foundations",
    summary: "AI systems that create new content such as text, images, audio, video, code or designs.",
    why: "Generative AI turns learned patterns into reusable content, interfaces and workflows rather than only predictions.",
    how: "A generative model estimates the structure of its training data and samples or predicts new outputs conditioned on a prompt or context.",
    example: "A model generates a product concept image from a written design brief.",
    tags: ["generation", "content", "foundation model"], related: ["llm", "diffusion", "multimodal"],
    source: { label: "On the Opportunities and Risks of Foundation Models — Bommasani et al. (2021)", url: "https://arxiv.org/abs/2108.07258" },
    mathIntensity: "low",
    mathNote: "Generative AI names a capability rather than a method. The mathematics belongs to the architectures that deliver it: diffusion, transformers, autoencoders."
  },
  {
    slug: "supervised-learning", acronym: "SL", name: "Supervised Learning", category: "foundations",
    summary: "Learning from examples paired with known target labels or outputs.",
    why: "It is the standard approach when reliable labeled examples exist and a specific prediction task is defined.",
    how: "The model predicts an output, compares it with the correct answer and updates its parameters to reduce the difference.",
    example: "Training a classifier on images labeled as acceptable or defective.",
    tags: ["labels", "classification", "regression"], related: ["ml", "sft", "benchmark"],
    source: { label: "Supervised learning — scikit-learn user guide", url: "https://scikit-learn.org/stable/supervised_learning.html" },
    mathIntensity: "medium",
    mathFoundations: [
      { slug: "cross-entropy", importance: "primary", note: "Classification with known labels is trained by cross-entropy against the correct answer." },
      { slug: "loss-functions", importance: "primary", note: "The choice of loss is the choice of what counts as a mistake." },
      { slug: "gradient-descent", importance: "supporting", note: "Parameters are fitted by the same optimization loop as everything else." },
      { slug: "maximum-likelihood", importance: "supporting", note: "Minimising that loss is maximising the likelihood of the labelled data." }
    ]
  },
  {
    slug: "self-supervised-learning", acronym: "SSL", name: "Self-Supervised Learning", category: "foundations",
    summary: "Learning useful representations from data by creating training targets from the data itself.",
    why: "It reduces dependence on expensive human labels and enables pre-training at very large scale.",
    how: "The system predicts hidden, missing or transformed parts of an input from the remaining context.",
    example: "A language model predicts the next token; an image model predicts a hidden representation of an image region.",
    tags: ["pretraining", "representation", "unlabeled data"], related: ["pretraining", "jepa", "transformer", "next-token-prediction"],
    source: { label: "A Cookbook of Self-Supervised Learning — Balestriero et al. (2023)", url: "https://arxiv.org/abs/2304.12210" },
    mathIntensity: "high",
    mathFoundations: [
      { slug: "loss-functions", importance: "primary", note: "The whole method is the construction of a training target from the data itself, expressed as a loss." },
      { slug: "cosine-similarity", importance: "primary", note: "Contrastive objectives score a matching pair against non-matching alternatives by cosine similarity." },
      { slug: "cross-entropy", importance: "supporting", note: "Masked and next-token objectives are cross-entropy over the hidden element." },
      { slug: "dot-product", importance: "supporting", note: "The similarity score at the centre of a contrastive loss is a normalised dot product." },
      { slug: "vector-spaces", importance: "supporting", note: "The result is a representation space in which proximity means relatedness." }
    ]
  },
  {
    slug: "next-token-prediction", acronym: "Next-Token", name: "Next-Token Prediction", category: "foundations",
    summary: "The objective of predicting the next token in a sequence given everything that came before.",
    why: "It is the training objective behind most language models: a single, label-free task that turns any text corpus into supervision and produces broad capability as a side effect.",
    how: "The model turns its context into a score for every token in the vocabulary, converts those scores into a probability distribution, and is trained to raise the probability of the token that actually followed.",
    example: "Given \"the maintenance report was\", the model spreads probability over \"submitted\", \"incomplete\", \"reviewed\" and thousands of other continuations, then samples or selects one.",
    tags: ["autoregressive", "language modelling", "decoding", "objective"], related: ["llm", "self-supervised-learning", "tokenization"],
    source: { label: "Prediction and Entropy of Printed English — Claude Shannon, Bell System Technical Journal (1951)", url: "https://doi.org/10.1002/j.1538-7305.1951.tb01366.x" },
    math: {
      intro: "Predicting one token at a time factorises the probability of a whole sequence into a product of conditional probabilities.",
      formulas: [
        { label: "Autoregressive factorisation", expression: "P(x_1, …, x_T) = ∏_{t=1}^{T} P(x_t | x_1 … x_{t-1})", note: "The chain rule of probability. An intractable joint distribution over whole documents becomes a sequence of one-step predictions, each of which a single forward pass can produce." },
        { label: "From scores to probabilities", expression: "P(x_t = i | context) = exp(z_i) / Σ_j exp(z_j)", note: "The model emits one logit z per vocabulary entry; softmax turns them into a distribution. Temperature, top-k and top-p all reshape this step." },
        { label: "Training loss", expression: "L = − (1/T) Σ_{t=1}^{T} log P(x_t | x_1 … x_{t-1})", note: "Cross-entropy against the token that actually appeared — equivalently, maximum likelihood over the corpus. Perplexity is exp(L)." }
      ]
    },
    mathIntensity: "high",
    mathFoundations: [
      { slug: "conditional-probability", importance: "primary", note: "The model computes P(next token | everything before it); the chain rule of probability is what makes a whole document tractable one step at a time." },
      { slug: "logits", importance: "primary", note: "The output layer emits one raw score per vocabulary entry." },
      { slug: "softmax", importance: "primary", note: "Softmax converts those scores into the distribution the next token is drawn from." },
      { slug: "cross-entropy", importance: "primary", note: "Training minimises the negative log-probability assigned to the token that actually followed." },
      { slug: "maximum-likelihood", importance: "supporting", note: "That loss is maximum likelihood estimation over the corpus, written in log form." },
      { slug: "sampling", importance: "supporting", note: "Decoding — greedy, temperature, top-k, top-p — is a choice about how to sample from the resulting distribution." }
    ]
  },

  {
    slug: "nn", acronym: "NN", name: "Neural Network", category: "architectures",
    summary: "A parameterized model built from connected computational units arranged in layers.",
    why: "Neural networks can approximate highly complex relationships and learn representations directly from data.",
    how: "Each layer transforms its inputs using learned weights and nonlinear functions; backpropagation computes how to adjust the weights.",
    example: "A small network maps equipment measurements to a predicted remaining useful life.",
    tags: ["neurons", "layers", "backpropagation"], related: ["dl", "cnn", "activation-function", "residual-connection", "transformer"],
    source: { label: "Learning representations by back-propagating errors — Rumelhart, Hinton & Williams, Nature (1986)", url: "https://doi.org/10.1038/323533a0" },
    mathIntensity: "high",
    mathFoundations: [
      { slug: "matrix-multiplication", importance: "primary", note: "A layer is a matrix multiplication followed by a non-linearity; almost all the compute is here." },
      { slug: "gradients", importance: "primary", note: "Every parameter is updated using the gradient of the loss with respect to it." },
      { slug: "backpropagation", importance: "primary", note: "One backward pass produces all those gradients at once by the chain rule." },
      { slug: "loss-functions", importance: "supporting", note: "The loss defines what the network is actually being trained to do." },
      { slug: "gradient-descent", importance: "supporting", note: "The optimizer applies those gradients repeatedly until the loss stops falling." },
      { slug: "adam", importance: "supporting", note: "In practice the update is not plain gradient descent but Adam, which adapts the step size per parameter." }
    ]
  },
  {
    slug: "cnn", acronym: "CNN", name: "Convolutional Neural Network", category: "architectures",
    summary: "A neural architecture using learned filters to detect local spatial patterns.",
    why: "CNNs are efficient and effective for images, spatial signals and many industrial inspection tasks.",
    how: "Convolutional filters slide across the input, sharing weights and building progressively higher-level features.",
    example: "A CNN detects scratches and dents in camera images from a production line.",
    tags: ["convolution", "vision", "filters"], related: ["nn", "cv", "image-modality"],
    source: { label: "Gradient-based learning applied to document recognition — LeCun et al. (1998)", url: "https://doi.org/10.1109/5.726791" },
    mathIntensity: "medium",
    mathFoundations: [
      { slug: "matrix-multiplication", importance: "primary", note: "Convolution is implemented as a matrix multiplication over unfolded input patches." },
      { slug: "gradients", importance: "supporting", note: "Shared filter weights accumulate gradient contributions from every position they were applied to." },
      { slug: "backpropagation", importance: "supporting", note: "That weight sharing is what makes a convolutional layer parameter-efficient and still trainable end to end." }
    ],
    math: {
      intro: "A convolutional layer applies the same small filter everywhere, which is what makes it both parameter-efficient and translation-equivariant.",
      formulas: [
        {
          label: "Discrete 2-D convolution",
          expression: "y[i, j] = Σ_m Σ_n  x[i+m, j+n] · w[m, n] + b",
          note: "One filter w slides across the whole input. The same weights are reused at every position, so a 3 × 3 filter has nine parameters whether the image is 32 or 4096 pixels wide — and a pattern learned in one corner is recognised in every other."
        },
        {
          label: "Output size",
          expression: "H_out = ⌊(H_in + 2p − k) / s⌋ + 1",
          note: "k is the kernel size, p the padding, s the stride. This is the arithmetic behind almost every shape error in vision code, and behind the receptive field: stacking layers grows the region of input that one output value can see."
        }
      ]
    }
  },
  {
    slug: "rnn", acronym: "RNN", name: "Recurrent Neural Network", category: "architectures",
    summary: "A neural network that reuses a hidden state while processing a sequence.",
    why: "RNNs introduced a practical way to model ordered data such as text, audio and time series.",
    how: "At each step, the network combines the current input with a representation of previous steps.",
    example: "An RNN processes a sequence of sensor readings to forecast the next value.",
    tags: ["sequence", "recurrent", "time series"], related: ["lstm", "ssm", "transformer", "asr"],
    source: { label: "Finding Structure in Time — Elman, Cognitive Science (1990)", url: "https://doi.org/10.1207/s15516709cog1402_1" },
    mathIntensity: "medium",
    mathFoundations: [
      { slug: "dynamical-systems", importance: "primary", note: "A recurrent network is a learned dynamical system: a state carried forward by a fixed update rule." },
      { slug: "backpropagation", importance: "primary", note: "Training unrolls the recurrence and applies the chain rule back through every step." },
      { slug: "gradients", importance: "supporting", note: "That long chain of factors is exactly why gradients vanish or explode over sequence length." },
      { slug: "matrix-multiplication", importance: "supporting", note: "Each step applies the same weight matrices to the state and the new input." },
      { slug: "state-space-models", importance: "supporting", note: "A linear recurrence is a state-space model, which is how the idea was made parallel-trainable again." }
    ],
    math: {
      intro: "A recurrent network carries one hidden state forward and applies the same transformation at every step.",
      formulas: [
        {
          label: "Recurrent update",
          expression: "h_t = tanh( W_h h_{t−1} + W_x x_t + b )",
          note: "W_h and W_x are shared across all steps, so the network handles any sequence length with a fixed parameter count. Everything the model knows about the past has to fit in h_t."
        },
        {
          label: "Gradient through time",
          expression: "∂h_t / ∂h_0 = Π_{i=1}^{t}  W_hᵀ · diag( tanh′ )",
          note: "A product of t terms. If the factors are consistently below one the gradient vanishes; above one it explodes. This single expression is why plain RNNs fail on long sequences and why gated architectures exist."
        }
      ]
    }
  },
  {
    slug: "lstm", acronym: "LSTM", name: "Long Short-Term Memory", category: "architectures",
    summary: "A recurrent architecture with gates that control what information is stored, updated and forgotten.",
    why: "LSTMs mitigate the difficulty standard RNNs have in learning long-range dependencies.",
    how: "Input, output and forget gates regulate a persistent cell state as the sequence is processed.",
    example: "An LSTM uses a long sequence of operating conditions to predict energy consumption.",
    tags: ["gates", "memory", "sequence"], related: ["rnn", "ssm", "memory", "transformer"],
    source: { label: "Long Short-Term Memory — Hochreiter & Schmidhuber, Neural Computation (1997)", url: "https://doi.org/10.1162/neco.1997.9.8.1735" },
    mathIntensity: "medium",
    mathFoundations: [
      { slug: "dynamical-systems", importance: "primary", note: "The cell state is a state variable with a deliberately near-identity update, so information persists." },
      { slug: "gradients", importance: "primary", note: "Gates exist to keep the gradient from decaying across many steps — the problem they were designed to solve." },
      { slug: "backpropagation", importance: "supporting", note: "Training is still backpropagation through the unrolled sequence." },
      { slug: "matrix-multiplication", importance: "supporting", note: "Every gate is a linear transformation of the input and previous state." }
    ],
    math: {
      intro: "An LSTM adds a second state that is updated by addition rather than by a matrix, which is what lets information survive many steps.",
      formulas: [
        {
          label: "Gates",
          expression: "f_t = σ(W_f · [h_{t−1}, x_t])\ni_t = σ(W_i · [h_{t−1}, x_t])\no_t = σ(W_o · [h_{t−1}, x_t])",
          note: "Three sigmoids, each producing values in [0, 1] that act as soft switches: how much to forget, how much to write, how much to read out."
        },
        {
          label: "Cell and hidden state",
          expression: "c_t = f_t ⊙ c_{t−1} + i_t ⊙ tanh(W_c · [h_{t−1}, x_t])\nh_t = o_t ⊙ tanh(c_t)",
          note: "The cell update is a gated addition, so ∂c_t/∂c_{t−1} is f_t rather than a weight matrix. With the forget gate near one the gradient passes almost unchanged — that additive path, not the gates themselves, is what solves the vanishing gradient."
        }
      ]
    }
  },
  {
    slug: "transformer", acronym: "Transformer", name: "Transformer Architecture", category: "architectures",
    summary: "A sequence architecture centered on attention rather than recurrence.",
    why: "Transformers made large-scale parallel training practical and underpin most current language and multimodal foundation models.",
    how: "Self-attention lets each token weigh the relevance of other tokens, while feed-forward layers transform the resulting representations.",
    example: "A transformer connects a pronoun to the relevant noun even when they are far apart in a document.",
    tags: ["attention", "sequence", "foundation model"], related: ["attention", "residual-connection", "layer-normalization", "positional-encoding", "activation-function", "llm", "context-window", "kv-cache"],
    source: { label: "Attention Is All You Need — Vaswani et al. (2017)", url: "https://arxiv.org/abs/1706.03762" },
    math: {
      intro: "Scaled dot-product attention is the core operation. Queries are matched against keys to produce weights over values.",
      formulas: [
        { label: "Scaled dot-product attention", expression: "Attention(Q, K, V) = softmax( Q K^T / sqrt(d_k) ) V", note: "Q, K and V are the query, key and value matrices. d_k is the key dimension; dividing by sqrt(d_k) keeps the dot products from growing with dimension and saturating the softmax." },
        { label: "Multi-head attention", expression: "MultiHead(Q, K, V) = Concat(head_1, ..., head_h) W^O\n     head_i = Attention(Q W_i^Q, K W_i^K, V W_i^V)", note: "Each head projects into its own subspace, so the model can attend to several kinds of relationship at once." }
      ]
    },
    mathIntensity: "high",
    mathFoundations: [
      { slug: "matrix-multiplication", importance: "primary", note: "Attention and the feed-forward blocks are stacks of matrix multiplications; this is where nearly all the compute goes." },
      { slug: "softmax", importance: "primary", note: "Both the attention weights and the output token distribution are softmaxes." },
      { slug: "vector-spaces", importance: "supporting", note: "Each attention head reads and writes in its own subspace, which is how one layer captures several kinds of relationship." },
      { slug: "vector-norms", importance: "supporting", note: "Layer normalization rescales each representation by its own statistics to keep activations in a workable range." },
      { slug: "backpropagation", importance: "supporting", note: "Gradients travel back through every layer; residual connections exist to keep that path from vanishing." },
      { slug: "gradient-descent", importance: "supporting", note: "Training the stack is ordinary gradient descent, at very large scale." }
    ]
  },
  {
    slug: "attention", acronym: "Attention", name: "Attention Mechanism", category: "architectures",
    summary: "A mechanism that lets each position in a sequence weigh how relevant every other position is.",
    why: "Attention replaced fixed windows and recurrence as the way models handle context, letting distant elements influence each other directly and in parallel.",
    how: "Each position emits a query, a key and a value; every query is scored against every key, the scores become weights through a softmax, and the values are blended using those weights.",
    example: "Reading \"the valve failed because it was corroded\", attention links \"it\" back to \"the valve\" rather than to \"because\".",
    tags: ["self-attention", "query key value", "context", "weighting"], related: ["transformer", "positional-encoding", "linear-attention", "flash-attention", "gqa", "context-window", "kv-cache"],
    source: { label: "Neural Machine Translation by Jointly Learning to Align and Translate — Bahdanau, Cho & Bengio (2014)", url: "https://arxiv.org/abs/1409.0473" },
    math: {
      intro: "Attention is a weighted average of values, where the weights come from how well each query matches each key.",
      formulas: [
        { label: "Scaled dot-product attention", expression: "Attention(Q, K, V) = softmax( Q Kᵀ / √d_k ) V", note: "Q Kᵀ scores every query against every key with a dot product. Dividing by √d_k keeps those scores from growing with dimension and saturating the softmax. The softmax turns them into weights that sum to one, and V is averaged under those weights." },
        { label: "One position, written out", expression: "αᵢⱼ = exp(qᵢ · kⱼ / √d_k) / Σ_l exp(qᵢ · k_l / √d_k)\noutputᵢ = Σⱼ αᵢⱼ vⱼ", note: "αᵢⱼ is how much position i attends to position j. The whole mechanism is a dot product for relevance, a softmax for normalisation and a weighted sum for the result." },
        { label: "Cost in sequence length", expression: "Q Kᵀ ∈ ℝ^{n×n}   →   O(n² · d) time and O(n²) attention weights", note: "Every position is compared with every other, so cost grows with the square of the sequence length. This is the reason long context is expensive and why the KV cache exists." }
      ]
    },
    mathIntensity: "high",
    mathFoundations: [
      { slug: "dot-product", importance: "primary", note: "Every attention score is a dot product between a query and a key — one number for how relevant one position is to another." },
      { slug: "matrix-multiplication", importance: "primary", note: "Scoring all queries against all keys at once is a single matrix multiplication, Q Kᵀ." },
      { slug: "softmax", importance: "primary", note: "Softmax turns those raw scores into weights that sum to one, so the output is a weighted average of values." },
      { slug: "vector-spaces", importance: "supporting", note: "Queries, keys and values are projections into separate learned subspaces of the same representation." },
      { slug: "probability-distributions", importance: "supporting", note: "The attention weights for one position form a distribution over the whole sequence." },
      { slug: "basis-projection", importance: "supporting", note: "Queries, keys and values are three learned projections of one representation into separate bases." }
    ]
  },
  {
    slug: "activation-function", acronym: "Activation", name: "Activation Function", category: "architectures",
    summary: "A small nonlinear function applied to every value in a layer, without which a deep network would collapse into a single linear one.",
    why: "Stacking linear layers produces another linear layer, so depth would buy nothing. The nonlinearity between them is the entire reason a deep network can represent more than a matrix multiplication.",
    how: "It is applied element-wise after a linear projection. ReLU simply zeroes negative values; GELU and SiLU are smooth versions that keep a small gradient there. Gated variants such as SwiGLU split the projection in two and use one half to scale the other, letting the layer suppress its own output.",
    example: "Modern transformer feed-forward blocks use SwiGLU rather than ReLU, because the gate lets a layer decide how much of each feature to pass on rather than only whether to pass it.",
    tags: ["nonlinearity", "ReLU", "GELU", "SwiGLU", "gating"], related: ["nn", "transformer", "dl"],
    source: { label: "GLU Variants Improve Transformer — Shazeer (2020)", url: "https://arxiv.org/abs/2002.05202" },
    math: {
      intro: "An activation is chosen as much for the shape of its derivative as for the shape of itself, because that derivative is what multiplies into every gradient behind it.",
      formulas: [
        { label: "Three common activations", expression: "ReLU(x) = max(0, x)\n\nSiLU(x)  = x · σ(x),      σ(x) = 1 / (1 + e^{−x})\n\nGELU(x) = x · Φ(x),      Φ = standard normal CDF", note: "All three leave large positive values roughly untouched and shrink negative ones. ReLU discards them outright, which gives a derivative of exactly zero — a unit pushed there stops learning. SiLU and GELU keep a small negative tail, so the gradient never vanishes completely." },
        { label: "Gated linear unit (SwiGLU)", expression: "SwiGLU(x) = ( SiLU(x W₁) ⊙ (x W₂) ) W₃", note: "⊙ is element-wise multiplication. Two projections are computed instead of one: W₂ carries the content and W₁ produces a gate that scales it. The hidden width is usually cut to about two-thirds so the parameter count matches an ungated block." }
      ]
    },
    mathIntensity: "medium",
    mathFoundations: [
      { slug: "gradients", importance: "primary", note: "An activation is selected for its derivative — ReLU's flat zero on negatives is exactly why units can die and why smooth alternatives replaced it." },
      { slug: "backpropagation", importance: "primary", note: "The chain rule multiplies one activation derivative per layer, so a saturating choice makes gradients vanish through depth." },
      { slug: "numerical-stability", importance: "supporting", note: "Exponentials inside sigmoid and GELU need care in low precision, which is why fused kernels compute them in a wider format." },
      { slug: "matrix-multiplication", importance: "supporting", note: "The activation sits between two matrix multiplications; a gated variant needs a third projection, which is why hidden widths are trimmed to compensate." }
    ]
  },
  {
    slug: "layer-normalization", acronym: "LayerNorm", name: "Layer Normalization", category: "architectures",
    summary: "Rescaling each token's vector by its own statistics so activations stay in a workable range however deep the stack gets.",
    why: "Without it, the scale of activations drifts from layer to layer, gradients explode or vanish, and training becomes acutely sensitive to initialization and learning rate. It is one of the least glamorous and most load-bearing parts of a transformer.",
    how: "For each token independently, subtract the mean across features and divide by the standard deviation, then apply a learned scale and shift. RMSNorm drops the mean subtraction and divides by the root mean square instead — cheaper, and in practice just as effective, which is why most current language models use it. Placing the norm before each sublayer rather than after is what makes very deep stacks trainable without a learning-rate warm-up.",
    example: "A hundred-layer transformer trains stably with pre-norm RMSNorm, where the original post-norm design of the same depth would diverge in the first few thousand steps.",
    tags: ["LayerNorm", "RMSNorm", "pre-norm", "training stability"], related: ["transformer", "residual-connection", "nn"],
    source: { label: "Layer Normalization — Ba, Kiros & Hinton (2016)", url: "https://arxiv.org/abs/1607.06450" },
    math: {
      intro: "Both variants divide a vector by a measure of its own size. They differ only in whether the mean is removed first.",
      formulas: [
        { label: "Layer normalization", expression: "μ = (1/d) Σᵢ xᵢ\nσ² = (1/d) Σᵢ (xᵢ − μ)²\n\nLN(x) = γ ⊙ (x − μ) / √(σ² + ε)  +  β", note: "Statistics are taken across the d features of one token, not across the batch — which is why it behaves identically at batch size one and at batch size a thousand. γ and β are learned, so the layer can undo the normalization if that turns out to be useful." },
        { label: "RMS normalization", expression: "RMS(x) = √( (1/d) Σᵢ xᵢ² )\n\nRMSNorm(x) = γ ⊙ x / (RMS(x) + ε)", note: "No mean subtraction and no shift term. This is ‖x‖₂ divided by √d, so the operation is simply a rescaling to fixed length. ε keeps the denominator away from zero when a vector is near-empty." }
      ]
    },
    mathIntensity: "high",
    mathFoundations: [
      { slug: "vector-norms", importance: "primary", note: "RMSNorm divides by the L2 norm scaled by √d, so normalization is literally a projection onto a fixed-radius sphere." },
      { slug: "numerical-stability", importance: "primary", note: "The ε in the denominator exists solely to stop division by a near-zero norm; it is the difference between a stable model and a run full of NaNs." },
      { slug: "gradients", importance: "primary", note: "Normalizing reshapes the loss surface so gradient magnitude stops depending on the scale of the incoming activations." },
      { slug: "probability-distributions", importance: "supporting", note: "Mean and variance across features are the only statistics used — a deliberately crude summary that turns out to be enough." }
    ]
  },
  {
    slug: "residual-connection", acronym: "Residual", name: "Residual Connection", category: "architectures",
    summary: "Adding a layer's input to its output, so each layer learns a correction rather than a whole new representation.",
    why: "It is what makes very deep networks trainable at all. Gradients reach early layers through the addition rather than being attenuated by every layer in between, and a layer that has nothing useful to contribute can output near zero instead of having to reproduce its input.",
    how: "The block computes x + f(x) instead of f(x). That addition creates a direct path for both the signal going forward and the gradient coming back. The running sum down the stack is called the residual stream: every layer reads the accumulated state, computes something, and adds its result back in.",
    example: "In a transformer block, attention and the feed-forward network each add to the stream rather than replacing it — which is why individual layers can often be removed from a trained model and it still produces sensible output.",
    tags: ["skip connection", "residual stream", "depth", "identity path"], related: ["transformer", "layer-normalization", "nn", "interpretability"],
    source: { label: "Deep Residual Learning for Image Recognition — He et al. (2015)", url: "https://arxiv.org/abs/1512.03385" },
    math: {
      intro: "The whole argument is one derivative. Differentiating the skip path produces an additive one that nothing can shrink.",
      formulas: [
        { label: "Residual block and its gradient", expression: "y = x + f(x)\n\n∂y/∂x = I + ∂f/∂x", note: "The identity term is the point. Through L stacked layers a plain network multiplies L Jacobians together, and anything consistently below one collapses; a residual network multiplies terms of the form (I + ∂f/∂x), so a gradient path of strength one always survives to the bottom." }
      ]
    },
    mathIntensity: "medium",
    mathFoundations: [
      { slug: "backpropagation", importance: "primary", note: "The derivative of x + f(x) contains an identity term, so the chain rule always has an undiminished path back to earlier layers." },
      { slug: "gradients", importance: "primary", note: "Vanishing gradients through depth are the precise problem residual connections were introduced to solve." },
      { slug: "vector-spaces", importance: "supporting", note: "The residual stream is one shared space that every layer reads from and writes into, which is what makes interpretability work on it possible." }
    ]
  },
  {
    slug: "positional-encoding", acronym: "PE", name: "Positional Encoding", category: "architectures",
    summary: "The signal that tells a transformer where each token sits, since attention on its own treats a sequence as an unordered set.",
    why: "Attention is permutation-equivariant: shuffle the inputs and the outputs shuffle identically. Without position information \"the valve failed\" and \"failed the valve\" are the same input, so order has to be injected deliberately.",
    how: "The original transformer added fixed sinusoidal vectors to the embeddings, and later models learned absolute position embeddings instead. Current practice is rotary position embedding, which rotates each query and key by an angle proportional to its position. Because a dot product between two rotated vectors depends only on the difference of their angles, the resulting attention score depends on relative distance rather than absolute index.",
    example: "A model trained at 8k tokens can be extended to 128k by interpolating the rotation frequencies rather than retraining — an option that only exists because the encoding is relative.",
    tags: ["RoPE", "sinusoidal", "relative position", "context extension"], related: ["attention", "transformer", "context-window"],
    source: { label: "RoFormer: Enhanced Transformer with Rotary Position Embedding — Su et al. (2021)", url: "https://arxiv.org/abs/2104.09864" },
    math: {
      intro: "Rotary encoding works because rotation preserves inner products. Rotate both sides by their own position and only the gap between them survives.",
      formulas: [
        { label: "Rotation by position", expression: "R_m = ⎡ cos mθ   −sin mθ ⎤\n      ⎣ sin mθ    cos mθ ⎦\n\nq̃_m = R_m q_m,   k̃_n = R_n k_n", note: "The embedding is split into d/2 pairs of coordinates and each pair is rotated in its own plane, with θ decreasing across pairs so different pairs turn at different rates — fast ones resolve nearby tokens, slow ones carry long-range position." },
        { label: "Why the score becomes relative", expression: "q̃_m · k̃_n = (R_m q)ᵀ (R_n k) = qᵀ R_mᵀ R_n k = qᵀ R_{n−m} k", note: "R is orthogonal, so R_mᵀ R_n = R_{n−m}. The absolute positions cancel and only n − m remains: two tokens ten apart score the same whether they sit at positions 5 and 15 or 5005 and 5015." }
      ]
    },
    mathIntensity: "high",
    mathFoundations: [
      { slug: "dot-product", importance: "primary", note: "The entire relative-position property follows from rotation leaving dot products unchanged." },
      { slug: "basis-projection", importance: "primary", note: "The embedding is split into two-dimensional subspaces and each is rotated within its own plane at its own frequency." },
      { slug: "matrix-multiplication", importance: "supporting", note: "The rotation is a block-diagonal orthogonal matrix, applied in practice as a cheap pairwise shuffle rather than a full multiplication." },
      { slug: "vector-spaces", importance: "supporting", note: "Position becomes a geometric property of where a vector points, not an extra feature appended to it." }
    ]
  },
  {
    slug: "linear-attention", acronym: "Linear Attention", name: "Linear Attention Mechanism", category: "architectures",
    summary: "A family of attention variants that drop the softmax so cost grows linearly with sequence length instead of quadratically, at the price of exact recall.",
    why: "Standard attention compares every token with every other, so both compute and the KV cache grow with the length of the conversation. Linear attention keeps a fixed-size state instead, which is what makes very long contexts affordable to serve.",
    how: "Softmax applies its nonlinearity after the query-key product, coupling every query to every key. Linear attention applies a feature map to queries and keys separately, which makes the product re-associable: instead of computing (QKᵀ)V you compute Q(KᵀV), folding all keys and values into one fixed state matrix. Each new token writes into that state with an outer product. Later variants add a way to remove information as well as add it — the delta rule replaces what a key already held, and gating decays the state so old associations fade.",
    example: "Generating the hundred-thousandth token costs the same as the hundredth, because the model reads one fixed-size state rather than a cache that has grown to a hundred thousand entries.",
    tags: ["kernel attention", "fixed state", "long context", "delta rule", "gating"], related: ["attention", "kv-cache", "ssm", "memory-bandwidth-bound"],
    source: { label: "Transformers are RNNs: Fast Autoregressive Transformers with Linear Attention — Katharopoulos et al. (2020)", url: "https://arxiv.org/abs/2006.16236" },
    math: {
      intro: "One associativity move is the whole idea. Matrix multiplication lets the brackets shift, and the quadratic term disappears with them.",
      formulas: [
        { label: "Moving the brackets", expression: "softmax attention:  ( Q Kᵀ ) V     →  n × n intermediate,  O(n² d)\n\nlinear attention:   φ(Q) ( φ(K)ᵀ V )  →  d × d intermediate,  O(n d²)", note: "φ is a feature map applied separately to queries and keys — ELU + 1 in the original, so scores stay non-negative. Once the softmax no longer sits between them, the product can be re-associated. The n × n score matrix is never formed, and the intermediate depends on the model width, not the sequence length." },
        { label: "The recurrent form", expression: "Sₜ = Sₜ₋₁ + φ(kₜ) vₜᵀ\nzₜ = zₜ₋₁ + φ(kₜ)\n\noutputₜ = φ(qₜ)ᵀ Sₜ / ( φ(qₜ)ᵀ zₜ )", note: "Read left to right, this is a recurrent network with a matrix-valued state: each token adds one outer product and nothing is ever removed. That fixed d × d budget is the trade — once more associations are written than the state can separate, they begin to interfere, which is what the delta rule and gating variants were introduced to manage." }
      ]
    },
    mathIntensity: "high",
    mathFoundations: [
      { slug: "outer-product", importance: "primary", note: "Each token writes its key-value pair into the state as a single outer product — the state is a running sum of them." },
      { slug: "matrix-multiplication", importance: "primary", note: "The whole saving comes from matrix multiplication being associative, so the brackets can move off the n × n term." },
      { slug: "matrix-rank", importance: "primary", note: "A d × d state can hold only d independent directions; past that, associations interfere. This is the precise cost of dropping the softmax." },
      { slug: "state-space-models", importance: "supporting", note: "Written as a recurrence, a linear-attention layer is a state-space model with a matrix-valued state." },
      { slug: "dot-product", importance: "supporting", note: "Reading the state back is still a dot product between a query and what was stored at each key direction." }
    ]
  },
  {
    slug: "ssm", acronym: "SSM", name: "State Space Model", category: "architectures",
    summary: "A sequence architecture that carries a fixed-size state forward with a linear recurrence, giving constant cost and constant memory per token.",
    why: "It revives what recurrence was good at — bounded memory, no growing cache — while remaining trainable in parallel, which was the reason recurrent networks lost to transformers in the first place.",
    how: "A state vector is updated at each step by a linear rule and then read out. Because the update is linear, the whole sequence can be computed during training as a parallel scan rather than step by step. Selective variants such as Mamba make the update depend on the current input, so the model can choose what to keep and what to discard rather than decaying everything uniformly.",
    example: "Long-context models increasingly interleave state-space layers with a few full-attention layers — constant-cost memory for most of the stack, exact recall where the task genuinely needs it.",
    tags: ["Mamba", "selective state", "linear recurrence", "parallel scan", "hybrid"], related: ["rnn", "linear-attention", "transformer", "attention"],
    source: { label: "Mamba: Linear-Time Sequence Modeling with Selective State Spaces — Gu & Dao (2023)", url: "https://arxiv.org/abs/2312.00752" },
    mathIntensity: "high",
    mathFoundations: [
      { slug: "state-space-models", importance: "primary", note: "The architecture takes its name from the equation: a state updated as x′ = Ax + Bu and read out as y = Cx." },
      { slug: "dynamical-systems", importance: "primary", note: "The model is a learned system evolving in time; its behaviour over long sequences is a question about that system's stability." },
      { slug: "eigenvalues", importance: "primary", note: "The eigenvalues of the transition matrix set how quickly stored information decays — which is why they are parameterized to stay inside the unit disc." },
      { slug: "outer-product", importance: "supporting", note: "An input-dependent update writes into the state the same way linear attention does, as an outer product of an input-derived pair." },
      { slug: "matrix-multiplication", importance: "supporting", note: "Making the recurrence parallel means re-expressing it as a scan of matrix products rather than a sequential loop." }
    ]
  },
  {
    slug: "mla", acronym: "MLA", name: "Multi-Head Latent Attention", category: "architectures",
    summary: "An attention variant that caches one small compressed vector per token instead of full keys and values, reconstructing them implicitly at attention time.",
    why: "It attacks the same bottleneck as grouped-query attention — the KV cache, not the weights, is usually what limits how many conversations a server can hold at once — but by compressing rather than by sharing, which retains more of full multi-head attention's quality.",
    how: "Each token's keys and values are projected down to a low-dimensional latent vector, and only that vector is stored. The up-projection matrices are then folded into the query and output projections, so the full keys and values are never explicitly reconstructed and the saving is real rather than deferred.",
    example: "A model caches a few hundred numbers per token per layer instead of several thousand, so a long conversation stays resident in memory that would otherwise have to be evicted and recomputed.",
    tags: ["latent compression", "KV cache", "low rank", "serving"], related: ["attention", "kv-cache", "gqa", "moe"],
    source: { label: "DeepSeek-V2: A Strong, Economical, and Efficient Mixture-of-Experts Language Model — DeepSeek-AI (2024)", url: "https://arxiv.org/abs/2405.04434" },
    mathIntensity: "high",
    mathFoundations: [
      { slug: "low-rank-factorization", importance: "primary", note: "The key and value projections are factored through a narrow latent dimension — the same trick as LoRA, applied to the cache instead of the weights." },
      { slug: "matrix-rank", importance: "primary", note: "The latent width is the rank retained, and it is the single dial trading cache size against how much of the original attention survives." },
      { slug: "matrix-multiplication", importance: "primary", note: "Folding the up-projection into the query and output projections is just re-associating a product — which is what makes the compression free at inference." },
      { slug: "singular-value-decomposition", importance: "supporting", note: "It is the natural way to reason about which directions a low-rank projection should keep." },
      { slug: "basis-projection", importance: "supporting", note: "The latent vector is the token's keys and values expressed in a smaller learned basis." }
    ]
  },
  {
    slug: "llm", acronym: "LLM", name: "Large Language Model", category: "architectures",
    summary: "A high-capacity model trained on large text or multimodal corpora to process and generate language.",
    why: "LLMs provide broad reusable capabilities that can be adapted through prompting, retrieval, tools and fine-tuning.",
    how: "Most LLMs use transformers to predict tokens from context, then undergo additional adaptation for instruction following and safety.",
    example: "An LLM explains a technical standard, drafts code and calls a search tool when it needs current evidence.",
    tags: ["language model", "foundation model", "tokens"], related: ["transformer", "sft", "rag"],
    source: { label: "Language Models are Few-Shot Learners — Brown et al. (2020)", url: "https://arxiv.org/abs/2005.14165" },
    mathIntensity: "high",
    mathFoundations: [
      { slug: "conditional-probability", importance: "primary", note: "A language model computes the probability of the next token given everything before it." },
      { slug: "softmax", importance: "primary", note: "The output layer's scores become a distribution over the whole vocabulary at every step." },
      { slug: "cross-entropy", importance: "primary", note: "Training is cross-entropy against the token that actually followed, over trillions of positions." },
      { slug: "matrix-multiplication", importance: "supporting", note: "Nearly all of the compute, in training and inference, is matrix multiplication." },
      { slug: "sampling", importance: "supporting", note: "How the next token is drawn from the distribution is a separate, tunable decision." }
    ]
  },
  {
    slug: "slm", acronym: "SLM", name: "Small Language Model", category: "architectures",
    summary: "A language model designed with fewer parameters and lower compute or memory requirements than frontier-scale LLMs.",
    why: "SLMs can reduce latency, cost and energy use and may run on edge devices or private infrastructure.",
    how: "They use similar architectures to LLMs but rely on smaller capacity, efficient training, distillation or task specialization.",
    example: "A compact model runs locally on an industrial workstation to classify maintenance requests.",
    tags: ["efficient", "edge", "compact model"], related: ["llm", "distillation", "quantization"],
    source: { label: "Phi-3 Technical Report: A Highly Capable Language Model Locally on Your Phone — Abdin et al. (2024)", url: "https://arxiv.org/abs/2404.14219" },
    mathIntensity: "medium",
    mathFoundations: [
      { slug: "floating-point", importance: "primary", note: "Fitting a capable model into a small footprint is largely a question of how many bits each weight gets." },
      { slug: "cross-entropy", importance: "supporting", note: "The training objective is unchanged from its larger counterparts." },
      { slug: "kl-divergence", importance: "supporting", note: "Small models are often distilled from large ones by matching the teacher's distribution." }
    ]
  },
  {
    slug: "vlm", acronym: "VLM", name: "Vision-Language Model", category: "architectures",
    summary: "A model that jointly processes visual information and natural language.",
    why: "VLMs make images and video accessible through language-based questioning, search, reasoning and generation.",
    how: "Visual encoders and language components are aligned in a shared representation or connected through cross-attention.",
    example: "A VLM examines an equipment photo and answers which component appears damaged.",
    tags: ["vision", "language", "multimodal"], related: ["cv", "llm", "multimodal"],
    source: { label: "Learning Transferable Visual Models From Natural Language Supervision — Radford et al. (2021)", url: "https://arxiv.org/abs/2103.00020" },
    mathIntensity: "medium",
    mathFoundations: [
      { slug: "vector-spaces", importance: "primary", note: "Images and text are only comparable because both are projected into one shared space." },
      { slug: "cosine-similarity", importance: "primary", note: "Alignment between a picture and a caption is measured as an angle in that space." },
      { slug: "latent-space", importance: "supporting", note: "Each modality is first compressed into a learned representation before being aligned." }
    ]
  },
  {
    slug: "moe", acronym: "MoE", name: "Mixture of Experts", category: "architectures",
    summary: "An architecture that routes each input to a subset of specialized parameter blocks called experts.",
    why: "MoE can increase total model capacity without activating every parameter for every token.",
    how: "A learned router selects a small number of experts whose outputs are combined for the current input.",
    example: "Different experts become more useful for code, mathematics or natural-language patterns.",
    tags: ["routing", "experts", "sparse activation"], related: ["transformer", "mla", "llm", "throughput"],
    source: { label: "Outrageously Large Neural Networks: The Sparsely-Gated Mixture-of-Experts Layer — Shazeer et al. (2017)", url: "https://arxiv.org/abs/1701.06538" },
    mathIntensity: "high",
    mathFoundations: [
      { slug: "softmax", importance: "primary", note: "The router applies a softmax over expert scores to decide which experts handle each token." },
      { slug: "probability-distributions", importance: "primary", note: "Routing weights form a distribution; load-balancing terms are added to stop it collapsing onto a few experts." },
      { slug: "matrix-multiplication", importance: "supporting", note: "Each expert is an ordinary feed-forward block of matrix multiplications." },
      { slug: "gradient-descent", importance: "supporting", note: "Router and experts are trained jointly, which is what makes balanced routing genuinely hard." }
    ],
    math: {
      intro: "Every token is routed to a few experts out of many, so total capacity grows without the cost of using all of it.",
      formulas: [
        {
          label: "Top-k routing",
          expression: "g = softmax(W_r x),   E = TopK(g, k),   y = Σ_{i∈E} g_i · f_i(x)",
          note: "The router scores every expert, the top k are chosen, and their outputs are blended by those same scores. With 64 experts and k = 2, a token touches about 3% of the parameters — the reason a trillion-parameter model can be affordable to run."
        },
        {
          label: "Load-balancing loss",
          expression: "L_aux = N · Σ_i  f_i · P_i",
          note: "f_i is the fraction of tokens routed to expert i and P_i the mean gate probability for it. Left alone, routing collapses onto a handful of experts and the rest never train; this term is minimised when the load is even, and it is added to the main loss rather than replacing it."
        }
      ]
    }
  },
  {
    slug: "gan", acronym: "GAN", name: "Generative Adversarial Network", category: "architectures",
    summary: "A generative framework where a generator and discriminator improve through adversarial training.",
    why: "GANs established powerful methods for generating realistic images and learning data distributions.",
    how: "The generator creates samples while the discriminator tries to distinguish generated samples from real ones.",
    example: "A GAN creates synthetic images resembling a set of product textures.",
    tags: ["generator", "discriminator", "synthetic data"], related: ["genai", "vae", "diffusion"],
    source: { label: "Generative Adversarial Nets — Goodfellow et al. (2014)", url: "https://arxiv.org/abs/1406.2661" },
    mathIntensity: "high",
    mathFoundations: [
      { slug: "probability-distributions", importance: "primary", note: "The generator is trained until its output distribution is indistinguishable from the data distribution." },
      { slug: "loss-functions", importance: "primary", note: "The adversarial objective is a minimax game between two networks with opposing losses." },
      { slug: "sampling", importance: "supporting", note: "Generation is decoding a random latent draw." },
      { slug: "gradient-descent", importance: "supporting", note: "Both networks are updated by gradient steps against each other, which is why training can oscillate rather than converge." }
    ],
    math: {
      intro: "A GAN trains two networks against each other: one to produce samples, one to tell them from real data.",
      formulas: [
        {
          label: "Minimax objective",
          expression: "min_G max_D  E_x[ log D(x) ] + E_z[ log(1 − D(G(z))) ]",
          note: "D is rewarded for scoring real data high and generated data low; G is rewarded for the opposite. At the optimum D cannot do better than 0.5 everywhere, which is the formal statement of the generated distribution matching the real one."
        },
        {
          label: "Non-saturating generator loss",
          expression: "L_G = − E_z[ log D(G(z)) ]",
          note: "The minimax form gives G almost no gradient early on, when D rejects everything confidently. Flipping the sign rather than negating the original is what makes training start at all — a small change that is the difference between working and not."
        }
      ]
    }
  },
  {
    slug: "vae", acronym: "VAE", name: "Variational Autoencoder", category: "architectures",
    summary: "A probabilistic autoencoder that learns a structured latent distribution for generation and representation learning.",
    why: "VAEs offer a principled way to encode data into a continuous latent space and generate new samples.",
    how: "An encoder predicts a probability distribution in latent space; a decoder reconstructs data from sampled latent variables.",
    example: "Interpolating between two latent points produces gradual variations of a component shape.",
    tags: ["latent space", "encoder", "decoder"], related: ["gan", "diffusion", "embeddings"],
    source: { label: "Auto-Encoding Variational Bayes — Kingma & Welling (2013)", url: "https://arxiv.org/abs/1312.6114" },
    mathIntensity: "high",
    mathFoundations: [
      { slug: "probability-distributions", importance: "primary", note: "A VAE models the data as a distribution over a latent variable rather than a single encoding." },
      { slug: "kl-divergence", importance: "primary", note: "The regularisation term is a KL divergence pulling the learned latent distribution toward a simple prior." },
      { slug: "sampling", importance: "primary", note: "Generation draws a latent sample and decodes it." },
      { slug: "latent-space", importance: "supporting", note: "The structured latent space is the object of interest, not just an intermediate." },
      { slug: "loss-functions", importance: "supporting", note: "Training balances reconstruction quality against that KL term." }
    ],
    math: {
      intro: "A VAE cannot maximise the likelihood of its data directly, so it maximises a bound on it — and that bound splits cleanly into reconstruct well and stay close to the prior.",
      formulas: [
        {
          label: "Evidence lower bound",
          expression: "L = E_q[ log p(x | z) ] − D_KL( q(z | x) ‖ p(z) )",
          note: "The first term rewards decoding z back into x. The second penalises an encoder that strays from the prior p(z), usually a standard normal. The tension between them is the entire model: drop the KL term and you have an ordinary autoencoder that cannot generate."
        },
        {
          label: "Reparameterisation",
          expression: "z = μ(x) + σ(x) ⊙ ε,   ε ~ N(0, I)",
          note: "Sampling is not differentiable, so the randomness is moved into ε, which carries no parameters. Gradients now flow through μ and σ — without this trick the encoder could not be trained at all."
        }
      ]
    }
  },
  {
    slug: "diffusion", acronym: "Diffusion", name: "Diffusion Model", category: "architectures",
    summary: "A generative model that learns to reverse a gradual noising process.",
    why: "Diffusion models drive high-quality image generation and increasingly support audio, video and scientific generation.",
    how: "Training teaches the model to remove noise at different levels; generation starts from noise and iteratively denoises it.",
    example: "A text-conditioned diffusion model generates a product rendering from a design prompt.",
    tags: ["denoising", "image generation", "sampling"], related: ["genai", "vae", "image-modality"],
    source: { label: "Denoising Diffusion Probabilistic Models — Ho et al. (2020)", url: "https://arxiv.org/abs/2006.11239" },
    math: {
      intro: "A diffusion model learns to reverse a fixed noising process.",
      formulas: [
        { label: "Forward (noising) process", expression: "q(x_t | x_{t-1}) = N( x_t ; sqrt(1 - β_t) · x_{t-1} , β_t I )", note: "β_t is the variance schedule. Noise is added over T steps until the sample is approximately standard Gaussian." },
        { label: "Closed form at any step", expression: "x_t = sqrt(ā_t) · x_0 + sqrt(1 - ā_t) · ε,   ε ~ N(0, I)\n     ā_t = ∏_{s=1}^{t} (1 - β_s)", note: "Any noisy step can be sampled directly from the clean image, which is what makes training tractable." },
        { label: "Training objective", expression: "L = E_{x_0, ε, t} [ || ε - ε_θ(x_t, t) ||^2 ]", note: "The network ε_θ predicts the noise that was added; generation then walks that prediction backwards from pure noise." }
      ]
    },
    mathIntensity: "high",
    mathFoundations: [
      { slug: "probability-distributions", importance: "primary", note: "Training learns the distribution of the data; generation draws from it." },
      { slug: "sampling", importance: "primary", note: "Generation is a long chain of sampling steps that gradually turns noise into structure." },
      { slug: "loss-functions", importance: "primary", note: "The model is trained to predict the noise that was added, scored by squared error." },
      { slug: "gradients", importance: "supporting", note: "Score-based formulations make this explicit: the network estimates the gradient of the log-density." },
      { slug: "dynamical-systems", importance: "supporting", note: "The sampling loop is a discretization of a continuous process, which is how faster solvers were derived." }
    ]
  },
  {
    slug: "jepa", acronym: "JEPA", name: "Joint Embedding Predictive Architecture", category: "architectures",
    summary: "A predictive architecture that learns by forecasting representations rather than reconstructing every input detail.",
    why: "JEPA aims to learn abstract, semantic world representations useful for reasoning and planning.",
    how: "A context encoder predicts the latent representation of a target region or future state while avoiding direct pixel-level reconstruction.",
    example: "An image JEPA predicts the representation of a hidden image region from surrounding visual context.",
    tags: ["predictive representation", "world model", "self-supervised"], related: ["self-supervised-learning", "embeddings", "multimodal"],
    source: { label: "Self-Supervised Learning from Images with a Joint-Embedding Predictive Architecture — Assran et al. (2023)", url: "https://arxiv.org/abs/2301.08243" },
    mathIntensity: "high",
    mathFoundations: [
      { slug: "latent-space", importance: "primary", note: "JEPA's defining choice is to predict in latent space rather than reconstruct the input, so capacity is not spent on unpredictable detail." },
      { slug: "loss-functions", importance: "primary", note: "The objective is a prediction loss between the predicted representation and the actual one." },
      { slug: "vectors", importance: "supporting", note: "Context and target are both vectors; the prediction is vector-valued." },
      { slug: "cosine-similarity", importance: "supporting", note: "Agreement between predicted and target representations is measured geometrically." },
      { slug: "gradient-descent", importance: "supporting", note: "Training is standard gradient descent on that latent prediction loss." }
    ]
  },

  {
    slug: "world-model", acronym: "World Model", name: "World Model", category: "architectures",
    summary: "A learned internal model of how an environment evolves, used to predict what happens next.",
    why: "An agent that can simulate consequences internally can plan, evaluate options and learn from imagined rollouts instead of paying the cost of every experiment in the real world.",
    how: "The system encodes observations into a compact state, learns a transition function that predicts the next state from the current one and an action, and uses that function to roll the future forward.",
    example: "A robot learns how objects on a conveyor move, then rehearses a grasp internally before attempting it, discarding approaches that its model predicts will fail.",
    tags: ["planning", "simulation", "state transition", "model-based"], related: ["jepa", "rl", "agent"],
    source: { label: "World Models — Ha & Schmidhuber (2018)", url: "https://arxiv.org/abs/1803.10122" },
    mathIntensity: "high",
    mathFoundations: [
      { slug: "state-space-models", importance: "primary", note: "A world model is a state-space model in substance: carry a compact state forward, one transition at a time." },
      { slug: "dynamical-systems", importance: "primary", note: "What is being learned is a transition rule — the defining object of a dynamical system." },
      { slug: "markov-process", importance: "primary", note: "Prediction assumes the current state is sufficient; where it is not, the model is working with a partial observation." },
      { slug: "latent-space", importance: "supporting", note: "The state is a learned latent representation, not raw observation, which is what keeps rollouts cheap." },
      { slug: "loss-functions", importance: "supporting", note: "Training minimises the error between the predicted next state and the observed one." }
    ]
  },
  {
    slug: "pretraining", acronym: "Pre-training", name: "Pre-training", category: "training",
    summary: "The initial large-scale training phase used to learn broad reusable patterns before task-specific adaptation.",
    why: "Pre-training produces general-purpose representations and capabilities that reduce the data needed for downstream tasks.",
    how: "A model optimizes a self-supervised or supervised objective across a large and diverse dataset.",
    example: "A language model learns syntax, facts and coding patterns by predicting tokens across a large corpus.",
    tags: ["foundation model", "large-scale training"], related: ["self-supervised-learning", "fine-tuning", "sft"],
    source: { label: "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding — Devlin et al. (2018)", url: "https://arxiv.org/abs/1810.04805" },
    mathIntensity: "medium",
    mathFoundations: [
      { slug: "cross-entropy", importance: "primary", note: "The pretraining loss is cross-entropy on the next token, averaged over trillions of them." },
      { slug: "gradient-descent", importance: "primary", note: "Weights are learned by gradient descent over very large batches." },
      { slug: "maximum-likelihood", importance: "supporting", note: "That objective is maximum likelihood estimation over the corpus." },
      { slug: "floating-point", importance: "supporting", note: "Mixed precision is what makes training at this scale affordable at all." },
      { slug: "adam", importance: "supporting", note: "Every large training run reports an Adam learning rate; the optimizer is part of the recipe." }
    ]
  },
  {
    slug: "fine-tuning", acronym: "Fine-tuning", name: "Fine-Tuning", category: "training",
    summary: "Additional training that adapts a pre-trained model to a task, domain, style or behavior.",
    why: "Fine-tuning can make a general model more accurate and consistent for a defined use case.",
    how: "Training continues on a smaller targeted dataset, updating all parameters or a parameter-efficient subset.",
    example: "A general language model is fine-tuned on validated maintenance question-and-answer examples.",
    tags: ["adaptation", "domain", "task"], related: ["pretraining", "sft", "peft"],
    source: { label: "Universal Language Model Fine-tuning for Text Classification — Howard & Ruder (2018)", url: "https://arxiv.org/abs/1801.06146" },
    mathIntensity: "medium",
    mathFoundations: [
      { slug: "loss-functions", importance: "primary", note: "Adaptation is defined by the loss chosen for the target task." },
      { slug: "gradient-descent", importance: "primary", note: "The mechanism is the same optimization loop as pretraining, usually at a much lower learning rate." },
      { slug: "cross-entropy", importance: "supporting", note: "Supervised fine-tuning reuses the pretraining objective on curated data." },
      { slug: "regularization", importance: "supporting", note: "Adapting on a small dataset is where over-fitting bites hardest, so the penalty term matters more than in pretraining." }
    ]
  },
  {
    slug: "sft", acronym: "SFT", name: "Supervised Fine-Tuning", category: "training",
    summary: "Fine-tuning on curated input-output examples that demonstrate desired behavior.",
    why: "SFT is a central step in teaching a foundation model to follow instructions and produce task-appropriate answers.",
    how: "The model is trained to reproduce a target response given an instruction and context.",
    example: "The model learns to answer maintenance questions in an approved step-by-step format.",
    tags: ["instruction tuning", "labeled examples"], related: ["fine-tuning", "rlhf", "dpo"],
    source: { label: "Finetuned Language Models Are Zero-Shot Learners — Wei et al. (2021)", url: "https://arxiv.org/abs/2109.01652" },
    mathIntensity: "medium",
    mathFoundations: [
      { slug: "cross-entropy", importance: "primary", note: "SFT is cross-entropy training on curated instruction and response pairs." },
      { slug: "gradient-descent", importance: "primary", note: "Nothing about the optimizer changes; only the data does." },
      { slug: "maximum-likelihood", importance: "supporting", note: "The model is fitted to make the demonstrated responses maximally likely." }
    ]
  },
  {
    slug: "peft", acronym: "PEFT", name: "Parameter-Efficient Fine-Tuning", category: "training",
    summary: "A family of adaptation methods that train only a small fraction of a model's parameters.",
    why: "PEFT reduces memory, storage and compute requirements while preserving the original base model.",
    how: "Small trainable modules, prompts or low-rank updates are added while most base-model weights remain frozen.",
    example: "One shared base model supports several domain adapters without storing a full model copy for each domain.",
    tags: ["efficient adaptation", "adapter"], related: ["lora", "qlora", "fine-tuning"],
    source: { label: "Parameter-Efficient Transfer Learning for NLP — Houlsby et al. (2019)", url: "https://arxiv.org/abs/1902.00751" },
    mathIntensity: "medium",
    mathFoundations: [
      { slug: "low-rank-factorization", importance: "primary", note: "Most PEFT methods confine the update to a small factorized form instead of touching every weight." },
      { slug: "matrix-rank", importance: "primary", note: "The shared premise is that a full-rank update is unnecessary for adaptation." },
      { slug: "gradient-descent", importance: "supporting", note: "Only the small set of added parameters receives gradients, which is where the memory saving comes from." },
      { slug: "singular-value-decomposition", importance: "supporting", note: "Singular value decay measures how much redundancy a weight matrix holds, and so how little needs to be trained." }
    ]
  },
  {
    slug: "lora", acronym: "LoRA", name: "Low-Rank Adaptation", category: "training",
    summary: "A PEFT method that learns low-rank weight updates while keeping the original model weights frozen.",
    why: "LoRA makes model adaptation substantially more memory- and storage-efficient than full fine-tuning.",
    how: "Instead of changing a large weight matrix directly, LoRA represents its update as the product of two much smaller trainable matrices.",
    example: "A separate LoRA adapter specializes one base model for sustainability terminology.",
    tags: ["adapter", "low rank", "efficient fine-tuning"], related: ["peft", "qlora", "fine-tuning"],
    source: { label: "LoRA: Low-Rank Adaptation of Large Language Models — Hu et al. (2021)", url: "https://arxiv.org/abs/2106.09685" },
    math: {
      intro: "LoRA freezes the pre-trained weights and learns a low-rank update alongside them.",
      formulas: [
        { label: "Low-rank weight update", expression: "W' = W_0 + ΔW = W_0 + B A", note: "W_0 is frozen. B has shape d x r, A has shape r x k, and the rank r is far smaller than min(d, k), so only r(d + k) parameters are trained instead of d x k." },
        { label: "Forward pass with scaling", expression: "h = W_0 x + (α / r) · B A x", note: "α is a constant scaling factor. A is initialised randomly and B at zero, so ΔW starts at zero and training begins from the pre-trained model exactly." }
      ]
    },
    mathIntensity: "high",
    mathFoundations: [
      { slug: "matrix-rank", importance: "primary", note: "LoRA rests on the claim that the weight update needed to adapt a model has low intrinsic rank." },
      { slug: "low-rank-factorization", importance: "primary", note: "That update is stored as two thin matrices whose product has the original shape — under 1% of the parameters at rank 16." },
      { slug: "matrix-multiplication", importance: "primary", note: "Applying the adapter is the product B A, added to the frozen weight." },
      { slug: "outer-product", importance: "supporting", note: "At rank r the update B A is a sum of r outer products — r independent directions added to the frozen weight." },
      { slug: "matrices", importance: "supporting", note: "The frozen base weights and the trained adapter are both ordinary matrices." },
      { slug: "vector-spaces", importance: "supporting", note: "Choosing rank r confines the update to an r-dimensional subspace of all possible changes." },
      { slug: "gradient-descent", importance: "supporting", note: "Only B and A receive gradients; the optimizer is otherwise unchanged." },
      { slug: "singular-value-decomposition", importance: "supporting", note: "The best rank-r approximation of any matrix is its truncated SVD, which is what makes a small r defensible rather than arbitrary." }
    ]
  },
  {
    slug: "qlora", acronym: "QLoRA", name: "Quantized Low-Rank Adaptation", category: "training",
    summary: "A fine-tuning method that combines a quantized frozen base model with trainable LoRA adapters.",
    why: "QLoRA sharply reduces memory requirements, enabling adaptation of larger models on more accessible hardware.",
    how: "The base weights are stored in a low-bit representation while gradients update small LoRA matrices in higher precision.",
    example: "A large language model is adapted on a single high-memory GPU without loading all base weights in full precision.",
    tags: ["quantization", "LoRA", "memory efficiency"], related: ["lora", "quantization", "peft"],
    source: { label: "QLoRA: Efficient Finetuning of Quantized LLMs — Dettmers et al. (2023)", url: "https://arxiv.org/abs/2305.14314" },
    mathIntensity: "high",
    mathFoundations: [
      { slug: "low-rank-factorization", importance: "primary", note: "QLoRA keeps LoRA's factorized update exactly as it is." },
      { slug: "floating-point", importance: "primary", note: "The base model is held at 4-bit precision, which is what lets a large model fit on a single accelerator." },
      { slug: "rounding-error", importance: "primary", note: "Each quantized weight snaps to the nearest representable value; that error budget decides whether quality survives." },
      { slug: "matrix-rank", importance: "supporting", note: "The low-rank assumption behind LoRA still applies to the adapter." },
      { slug: "numerical-stability", importance: "supporting", note: "Adapters are trained at higher precision on top of the quantized base so gradients stay well-behaved." }
    ]
  },
  {
    slug: "contrastive-learning", acronym: "Contrastive", name: "Contrastive Learning", category: "training",
    summary: "Training a model to place matching pairs close together in representation space and everything else far apart.",
    why: "It produces useful representations without labels, and it is how text and images are brought into a single shared space — the basis of modern retrieval and multimodal models.",
    how: "Each example is paired with a genuine match and a batch of non-matches; the loss rewards a high similarity score for the true pair relative to all the others.",
    example: "A model trained on image–caption pairs learns to place a photo of a turbine and the words \"wind turbine\" at nearly the same point, so either can retrieve the other.",
    tags: ["representation learning", "embeddings", "CLIP", "similarity"], related: ["self-supervised-learning", "embeddings", "vlm"],
    source: { label: "A Simple Framework for Contrastive Learning of Visual Representations — Chen et al. (2020)", url: "https://arxiv.org/abs/2002.05709" },
    mathIntensity: "high",
    mathFoundations: [
      { slug: "cosine-similarity", importance: "primary", note: "The score being pushed up for the true pair and down for the rest is a cosine similarity." },
      { slug: "dot-product", importance: "primary", note: "That similarity is a normalised dot product; the raw agreement is computed first." },
      { slug: "loss-functions", importance: "primary", note: "The contrastive loss has no fixed target — it only requires the match to outrank the alternatives." },
      { slug: "softmax", importance: "supporting", note: "Scores across the batch are turned into a distribution, with a temperature setting how sharply." },
      { slug: "vector-spaces", importance: "supporting", note: "The result is a shared space where proximity means relatedness, across modalities if trained that way." }
    ],
    math: {
      intro: "The model is never told what an example is, only which other example it belongs with.",
      formulas: [
        {
          label: "InfoNCE loss",
          expression: "L = − log  exp(sim(a, b⁺) / τ) / Σ_j exp(sim(a, b_j) / τ)",
          note: "Read the fraction as a softmax over the batch: the true pair must outscore every other candidate. There is no target value anywhere — only an ordering."
        },
        {
          label: "Similarity and temperature",
          expression: "sim(a, b) = aᵀb / (‖a‖ ‖b‖)",
          note: "Cosine similarity, so length carries no meaning. τ sets how sharply the loss separates: small τ punishes near-misses hard and is what forces fine distinctions rather than coarse clustering."
        }
      ]
    }
  },
  {
    slug: "rlhf", acronym: "RLHF", name: "Reinforcement Learning from Human Feedback", category: "training",
    summary: "A family of methods that use human preferences to shape model behavior through reward modeling and reinforcement learning.",
    why: "RLHF can align model outputs with qualities that are difficult to express as a simple automatic loss function.",
    how: "Humans compare outputs, a reward model learns those preferences and an RL algorithm optimizes the model against the learned reward.",
    example: "Reviewers rank two assistant answers, helping the system learn which is more useful and safer.",
    tags: ["human preferences", "reward model", "alignment"], related: ["ppo", "dpo", "alignment"],
    source: { label: "Training language models to follow instructions with human feedback — Ouyang et al. (2022)", url: "https://arxiv.org/abs/2203.02155" },
    mathIntensity: "high",
    mathFoundations: [
      { slug: "expected-return", importance: "primary", note: "The objective is the same expected-reward maximisation as any reinforcement learning problem." },
      { slug: "probability-distributions", importance: "primary", note: "A reward model turns pairwise human comparisons into a distribution over which response is preferred." },
      { slug: "kl-divergence", importance: "primary", note: "A KL penalty against the original model keeps preference training from destroying base capability." },
      { slug: "loss-functions", importance: "supporting", note: "The reward model is fitted with a preference loss over ranked pairs." },
      { slug: "gradient-descent", importance: "supporting", note: "Both the reward model and the policy are trained by gradient methods." }
    ],
    math: {
      intro: "Human comparisons are turned into a reward function, and the model is then optimised against it without being allowed to drift away from what it already knew.",
      formulas: [
        {
          label: "Preference model",
          expression: "P(b ≻ a) = σ( r(b) − r(a) )",
          note: "The Bradley–Terry model: only the difference in reward matters, so r is learned up to an additive constant. Fitting it to ranked pairs is ordinary logistic regression."
        },
        {
          label: "KL-penalised objective",
          expression: "max_π  E[ r(x) ] − β · D_KL( π ‖ π_ref )",
          note: "Maximising the learned reward alone reliably destroys the model — it finds whatever the reward model overrates. The KL term against the pre-RLHF reference is what keeps it fluent, and β is the dial between obedience and capability."
        }
      ]
    }
  },
  {
    slug: "dpo", acronym: "DPO", name: "Direct Preference Optimization", category: "training",
    summary: "A preference-learning method that directly optimizes a language model from preferred and rejected responses.",
    why: "DPO simplifies preference alignment by avoiding an explicit reward-model-plus-RL training loop.",
    how: "The objective increases the relative likelihood of preferred responses compared with rejected responses while staying near a reference model.",
    example: "The model learns from pairs where reviewers selected the clearer technical explanation.",
    tags: ["preference optimization", "alignment"], related: ["rlhf", "sft", "alignment"],
    source: { label: "Direct Preference Optimization — Rafailov et al. (2023)", url: "https://arxiv.org/abs/2305.18290" },
    math: {
      intro: "DPO optimises a preference objective directly on the policy, with no separate reward model and no reinforcement-learning loop.",
      formulas: [
        { label: "Direct preference optimization loss", expression: "L_DPO = - E_{(x, y_w, y_l)} [ log σ( β · log( π_θ(y_w|x) / π_ref(y_w|x) )\n                                  - β · log( π_θ(y_l|x) / π_ref(y_l|x) ) ) ]", note: "y_w is the preferred response and y_l the rejected one. π_ref is the frozen reference model, σ the logistic function, and β controls how far the policy may drift from the reference." }
      ]
    },
    mathIntensity: "high",
    mathFoundations: [
      { slug: "probability-distributions", importance: "primary", note: "Preferences are modelled as a distribution over which of two responses a human would choose." },
      { slug: "kl-divergence", importance: "primary", note: "DPO is derived from a KL-constrained objective; that constraint is exactly what yields its closed form." },
      { slug: "loss-functions", importance: "primary", note: "The result is a single classification-style loss on preference pairs, with no separate reward model." },
      { slug: "maximum-likelihood", importance: "supporting", note: "Fitting that loss is maximum likelihood over the observed preferences." }
    ]
  },
  {
    slug: "ppo", acronym: "PPO", name: "Proximal Policy Optimization", category: "training",
    summary: "A reinforcement-learning algorithm that constrains policy updates to improve training stability.",
    why: "PPO became widely used in robotics, control and RLHF because it balances implementation simplicity and reliable performance.",
    how: "A clipped objective discourages updates that move the new policy too far from the previous policy in one step.",
    example: "An RLHF pipeline uses PPO to optimize a language model against a learned reward model.",
    tags: ["policy gradient", "reinforcement learning"], related: ["rl", "rlhf", "dpo"],
    source: { label: "Proximal Policy Optimization Algorithms — Schulman et al. (2017)", url: "https://arxiv.org/abs/1707.06347" },
    mathIntensity: "high",
    mathFoundations: [
      { slug: "expected-return", importance: "primary", note: "PPO maximises expected return like any policy-gradient method." },
      { slug: "kl-divergence", importance: "primary", note: "The clipped objective bounds how far the updated policy may move from the previous one." },
      { slug: "probability-distributions", importance: "supporting", note: "The ratio being clipped is between the new and old probabilities of the same action." },
      { slug: "gradient-descent", importance: "supporting", note: "Updates are ordinary gradient steps on that clipped surrogate objective." }
    ],
    math: {
      intro: "PPO improves a policy while refusing to let any single update move it far from the one that collected the data.",
      formulas: [
        {
          label: "Probability ratio",
          expression: "r(θ) = π_θ(a | s) / π_old(a | s)",
          note: "How much more likely the updated policy makes the action that was actually taken. A ratio of 1 means nothing has changed."
        },
        {
          label: "Clipped surrogate objective",
          expression: "L = E[ min( r(θ) · A ,  clip(r(θ), 1−ε, 1+ε) · A ) ]",
          note: "A is the advantage — how much better the action turned out than expected. The min against a clipped copy is the whole method: once the ratio leaves [1−ε, 1+ε] the gradient goes flat, so a single step cannot be rewarded for moving further. ε is typically 0.2."
        }
      ]
    }
  },
  {
    slug: "distillation", acronym: "Distillation", name: "Knowledge Distillation", category: "training",
    summary: "Training a smaller student model to reproduce useful behavior from a larger teacher model.",
    why: "Distillation can preserve much of a larger model's performance while reducing inference cost and latency.",
    how: "The student learns from the teacher's output probabilities, generated examples or intermediate representations.",
    example: "A compact edge model is trained on explanations generated by a larger cloud model.",
    tags: ["teacher", "student", "compression"], related: ["slm", "quantization", "pruning"],
    source: { label: "Distilling the Knowledge in a Neural Network — Hinton, Vinyals & Dean (2015)", url: "https://arxiv.org/abs/1503.02531" },
    mathIntensity: "high",
    mathFoundations: [
      { slug: "kl-divergence", importance: "primary", note: "The student is trained to match the teacher's whole distribution, measured by KL divergence." },
      { slug: "softmax", importance: "primary", note: "A raised temperature softens the teacher's softmax so the ranking among wrong answers still carries signal." },
      { slug: "cross-entropy", importance: "primary", note: "The soft-target loss is cross-entropy against a full distribution rather than a single label." },
      { slug: "probability-distributions", importance: "supporting", note: "What transfers is the shape of the teacher's belief, not only its top answer." }
    ],
    math: {
      intro: "The student learns from the teacher's whole distribution, not just the answer it happened to pick.",
      formulas: [
        {
          label: "Softened distribution",
          expression: "p_i = exp(z_i / T) / Σ_j exp(z_j / T)",
          note: "Dividing logits by a temperature T above 1 flattens the softmax. At T = 1 a confident teacher says almost nothing beyond its top answer; at T = 4 the relative ranking of the wrong answers becomes visible, and that ranking is the extra signal being transferred."
        },
        {
          label: "Distillation loss",
          expression: "L = α · T² · D_KL( p_teacher ‖ p_student ) + (1 − α) · H( y, p_student )",
          note: "A weighted sum of matching the teacher and matching the true label. The T² factor restores the gradient magnitude, which softening otherwise scales down by roughly 1/T² — without it the soft term quietly stops contributing as T rises."
        }
      ]
    }
  },

  {
    slug: "rag", acronym: "RAG", name: "Retrieval-Augmented Generation", category: "retrieval",
    summary: "A pattern that retrieves external information and supplies it to a generative model at request time.",
    why: "RAG can provide current, private or domain-specific evidence without embedding all knowledge in model weights.",
    how: "The system searches a knowledge source, selects relevant passages and places them in the model's context before generation.",
    example: "An assistant retrieves the latest maintenance manual section before answering a technician's question.",
    tags: ["retrieval", "grounding", "knowledge"], related: ["embeddings", "vector-db", "grounding"],
    source: { label: "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks — Lewis et al. (2020)", url: "https://arxiv.org/abs/2005.11401" },
    mathIntensity: "medium",
    mathNote: "Mathematics governs the retrieval step. Chunking, ranking policy and prompt assembly — where most RAG quality is won or lost — remain engineering decisions.",
    mathFoundations: [
      { slug: "cosine-similarity", importance: "primary", note: "Passages are ranked by cosine similarity between the query embedding and the stored ones." },
      { slug: "nearest-neighbour-search", importance: "primary", note: "Finding those passages across millions of vectors quickly is an approximate nearest-neighbour problem." },
      { slug: "vectors", importance: "supporting", note: "Both the query and every indexed chunk are represented as vectors." },
      { slug: "conditional-probability", importance: "supporting", note: "Retrieval changes what the model conditions on; the generation step itself is unchanged." }
    ]
  },
  {
    slug: "graphrag", acronym: "GraphRAG", name: "Graph-based Retrieval-Augmented Generation", category: "retrieval",
    summary: "RAG enhanced with graph-structured entities, relationships, communities or summaries.",
    why: "GraphRAG can answer questions that require connecting evidence distributed across many documents and entities.",
    how: "Information is extracted into a graph, organized into connected structures and retrieved at local or global levels for generation.",
    example: "A system connects a component, its suppliers, failure modes and maintenance actions across multiple reports.",
    tags: ["graph", "retrieval", "entities"], related: ["rag", "knowledge-graph", "semantic-search"],
    source: { label: "Microsoft Research GraphRAG project", url: "https://www.microsoft.com/en-us/research/project/graphrag/" },
    mathIntensity: "medium",
    mathFoundations: [
      { slug: "graph-theory", importance: "primary", note: "Context is gathered by traversing edges between entities, not only by ranking isolated passages." },
      { slug: "cosine-similarity", importance: "primary", note: "Entry points into the graph are still found by embedding similarity." },
      { slug: "nearest-neighbour-search", importance: "supporting", note: "The initial candidate set comes from a vector index before any traversal begins." },
      { slug: "conditional-probability", importance: "supporting", note: "The assembled subgraph becomes the context the model conditions on." }
    ]
  },
  {
    slug: "embeddings", acronym: "Embeddings", name: "Vector Embeddings", category: "retrieval",
    summary: "Dense numerical representations that place semantically related items near one another in a vector space.",
    why: "Embeddings enable semantic search, clustering, recommendation, retrieval and cross-modal alignment.",
    how: "An encoder maps text, images or other inputs to fixed-length vectors learned to preserve useful similarity relationships.",
    example: "Queries about overheating retrieve documents discussing thermal excursions even without exact keyword matches.",
    tags: ["vectors", "semantic similarity", "representation"], related: ["vector-db", "semantic-search", "rag"],
    source: { label: "Efficient Estimation of Word Representations in Vector Space — Mikolov et al. (2013)", url: "https://arxiv.org/abs/1301.3781" },
    math: {
      intro: "Embeddings place items in a vector space where geometric closeness stands in for semantic similarity.",
      formulas: [
        { label: "Cosine similarity", expression: "cos(u, v) = ( u · v ) / ( ||u|| · ||v|| )", note: "Ranges from -1 to 1. Because it ignores magnitude and compares direction only, it is the usual choice for comparing text embeddings." },
        { label: "Euclidean distance", expression: "d(u, v) = sqrt( Σ_i (u_i - v_i)^2 )", note: "On L2-normalised vectors, Euclidean distance and cosine similarity rank results identically: d^2 = 2(1 - cos)." }
      ]
    },
    mathIntensity: "high",
    mathFoundations: [
      { slug: "vectors", importance: "primary", note: "An embedding is a vector — a fixed-length list of numbers standing in for a piece of content." },
      { slug: "vector-spaces", importance: "primary", note: "Embeddings mean something only because they share a space in which direction and distance are comparable." },
      { slug: "dot-product", importance: "primary", note: "The raw agreement between two embeddings is a dot product." },
      { slug: "cosine-similarity", importance: "primary", note: "Normalising that agreement by length is what lets a short query match a long passage." },
      { slug: "latent-space", importance: "supporting", note: "The embedding space is a learned latent space: its axes are invented by training, not designed." },
      { slug: "vector-norms", importance: "supporting", note: "Length carries magnitude rather than meaning, which is why embeddings are usually normalised before comparison." },
      { slug: "basis-projection", importance: "supporting", note: "An embedding is a set of coordinates against learned directions; comparing them is projection arithmetic." }
    ]
  },
  {
    slug: "vector-db", acronym: "Vector DB", name: "Vector Database", category: "retrieval",
    summary: "A data system optimized to store embeddings and search for nearby vectors.",
    why: "Vector databases make semantic retrieval practical across large collections and support metadata filtering and indexing.",
    how: "Approximate nearest-neighbor indexes rapidly identify vectors most similar to a query embedding.",
    example: "Millions of document chunks are indexed so an assistant can retrieve the closest passages in milliseconds.",
    tags: ["database", "nearest neighbor", "index"], related: ["embeddings", "rag", "semantic-search"],
    source: { label: "Billion-scale similarity search with GPUs — Johnson, Douze & Jegou (2017)", url: "https://arxiv.org/abs/1702.08734" },
    mathIntensity: "medium",
    mathFoundations: [
      { slug: "nearest-neighbour-search", importance: "primary", note: "A vector database is an approximate nearest-neighbour index with storage, filtering and updates built around it." },
      { slug: "cosine-similarity", importance: "primary", note: "The similarity measure the index is built for is what defines a neighbour." },
      { slug: "vector-norms", importance: "supporting", note: "Vectors are typically normalised on write so dot product and cosine similarity agree." }
    ]
  },
  {
    slug: "knowledge-graph", acronym: "KG", name: "Knowledge Graph", category: "retrieval",
    summary: "A structured representation of entities, concepts and explicit relationships.",
    why: "Knowledge graphs make relationships queryable, explainable and reusable across applications.",
    how: "Facts are represented as nodes and edges, often enriched with schemas, identifiers, provenance and constraints.",
    example: "A graph links a motor to its manufacturer, material, compatible gearbox, failure modes and service instructions.",
    tags: ["entities", "relationships", "ontology"], related: ["graphrag", "grounding", "api"],
    source: { label: "Knowledge Graphs — Hogan et al., ACM Computing Surveys (2021)", url: "https://arxiv.org/abs/2003.02320" },
    mathIntensity: "medium",
    mathFoundations: [
      { slug: "graph-theory", importance: "primary", note: "A knowledge graph is exactly a graph: entities are nodes, relations are edges." },
      { slug: "matrices", importance: "supporting", note: "Written as an adjacency matrix, multi-hop questions become matrix products." },
      { slug: "vectors", importance: "supporting", note: "Graph embeddings place nodes in a vector space so that structural similarity becomes geometric." }
    ]
  },
  {
    slug: "semantic-search", acronym: "Semantic Search", name: "Semantic Search", category: "retrieval",
    summary: "Search based on meaning and intent rather than only exact keyword overlap.",
    why: "It improves discovery when users and documents use different vocabulary for the same concept.",
    how: "A query and candidate content are encoded into representations whose similarity is used for ranking.",
    example: "Searching for “reduce power draw” also finds material about energy-efficiency optimization.",
    tags: ["search", "meaning", "ranking"], related: ["embeddings", "vector-db", "rag"],
    source: { label: "Dense Passage Retrieval for Open-Domain Question Answering — Karpukhin et al. (2020)", url: "https://arxiv.org/abs/2004.04906" },
    mathIntensity: "medium",
    mathFoundations: [
      { slug: "cosine-similarity", importance: "primary", note: "Ranking is by cosine similarity in embedding space rather than by term overlap." },
      { slug: "nearest-neighbour-search", importance: "primary", note: "Returning the top matches across a large corpus is a nearest-neighbour query." },
      { slug: "vectors", importance: "supporting", note: "Query and documents are compared as vectors, so the wording need not match." }
    ]
  },
  {
    slug: "grounding", acronym: "Grounding", name: "Grounding", category: "retrieval",
    summary: "Connecting a model's output to specified evidence, data, tools or an external environment.",
    why: "Grounding improves relevance and traceability and can reduce unsupported claims.",
    how: "The application supplies authoritative context or verifies claims against external sources during generation.",
    example: "A response cites the exact policy section retrieved from a controlled document repository.",
    tags: ["evidence", "factuality", "provenance"], related: ["rag", "hallucination", "tool-use"],
    source: { label: "Measuring Attribution in Natural Language Generation Models — Rashkin et al. (2021)", url: "https://arxiv.org/abs/2112.12870" },
    mathIntensity: "low",
    mathNote: "Grounding is a sourcing and verification discipline. The retrieval it depends on is mathematical; attributing a claim to evidence is not."
  },

  {
    slug: "prompt-engineering", acronym: "Prompt Engineering", name: "Prompt Engineering", category: "agents",
    summary: "Designing instructions and context so a model performs a task reliably.",
    why: "Prompt structure strongly influences output quality, constraints, format and tool behavior.",
    how: "The prompt defines the role, task, evidence, constraints, examples and expected output structure.",
    example: "A prompt requires an assistant to separate facts, assumptions, sources and recommended actions.",
    tags: ["instructions", "context", "few-shot"], related: ["cot", "context-window", "agent"],
    source: { label: "Prompt engineering overview — Anthropic documentation", url: "https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview" },
    mathIntensity: "low",
    mathNote: "Prompting changes what the model conditions on. That conditioning is probabilistic, but the practice itself is empirical and linguistic rather than mathematical."
  },
  {
    slug: "cot", acronym: "CoT", name: "Chain of Thought", category: "agents",
    summary: "Intermediate reasoning steps used by a model or reasoning system to reach an answer.",
    why: "Structured reasoning can improve performance on multi-step problems, although internal reasoning is not itself a guarantee of correctness.",
    how: "The system decomposes a problem into intermediate inferences, checks or tool calls before producing the final answer.",
    example: "A planning agent identifies dependencies, evaluates constraints and then selects an execution order.",
    tags: ["reasoning", "decomposition", "planning"], related: ["prompt-engineering", "agent", "evals"],
    source: { label: "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models — Wei et al. (2022)", url: "https://arxiv.org/abs/2201.11903" },
    mathIntensity: "low",
    mathNote: "Chain of thought is a prompting and decoding pattern. It lengthens the conditioning context and spends more tokens on a problem; it introduces no new mathematical object."
  },
  {
    slug: "function-calling", acronym: "Function Calling", name: "Function Calling", category: "agents",
    summary: "A structured mechanism for a model to select a function and produce validated arguments for it.",
    why: "Function calling turns language-model intent into controlled application actions.",
    how: "Available functions are described with schemas; the model chooses one and returns arguments that the host application validates and executes.",
    example: "An assistant calls a calendar function with a start time, duration and attendee list.",
    tags: ["structured output", "tools", "schema"], related: ["tool-use", "api", "mcp"],
    source: { label: "Tool use overview — Anthropic documentation", url: "https://docs.claude.com/en/docs/agents-and-tools/tool-use/overview" },
    mathIntensity: "low",
    mathNote: "Function calling is a structured-output and schema-validation problem. The model's choice of function is still a draw from a distribution, but the mechanism itself adds no mathematics."
  },
  {
    slug: "tool-use", acronym: "Tool Use", name: "Tool Use", category: "agents",
    summary: "The ability of an AI system to invoke external capabilities such as search, code execution, databases or business applications.",
    why: "Tools let models act on current data, perform exact computation and execute controlled operations beyond text generation.",
    how: "The model selects an available tool, supplies parameters, receives a result and incorporates it into the next step.",
    example: "An agent retrieves live inventory before recommending a replacement component.",
    tags: ["actions", "connectors", "external systems"], related: ["function-calling", "agent", "mcp"],
    source: { label: "Toolformer: Language Models Can Teach Themselves to Use Tools — Schick et al. (2023)", url: "https://arxiv.org/abs/2302.04761" },
    mathIntensity: "low",
    mathNote: "Tool use is orchestration: deciding when to call something external and how to feed the result back. The mathematics lives in the tools and in the model doing the deciding."
  },
  {
    slug: "agent", acronym: "Agent", name: "AI Agent", category: "agents",
    summary: "A goal-directed AI system that can plan, use tools, observe results and continue across multiple steps.",
    why: "Agents move AI from isolated answers toward workflows that interact with software, data and environments.",
    how: "An agent repeatedly evaluates state, selects an action, calls a tool or model and updates its plan until a stopping condition is reached.",
    example: "An engineering agent gathers requirements, searches standards, generates alternatives and requests human approval before publishing.",
    tags: ["planning", "actions", "workflow"], related: ["tool-use", "memory", "multi-agent"],
    source: { label: "ReAct: Synergizing Reasoning and Acting in Language Models — Yao et al. (2022)", url: "https://arxiv.org/abs/2210.03629" },
    mathIntensity: "medium",
    mathNote: "Most agent frameworks are software and orchestration rather than new mathematics. What mathematics there is sits in the model proposing actions and in the retrieval and tools it calls.",
    mathFoundations: [
      { slug: "graph-theory", importance: "primary", note: "A plan is a directed graph of steps and dependencies; execution is a traversal of it, and a cycle in it is a bug." },
      { slug: "expected-return", importance: "supporting", note: "Choosing among possible actions can be framed as maximising expected value, though most deployed agents use heuristics instead." },
      { slug: "probability-distributions", importance: "supporting", note: "The underlying model's choice of next step is still a sample from a distribution, which is why agents are not reproducible by default." }
    ]
  },
  {
    slug: "multi-agent", acronym: "MAS", name: "Multi-Agent System", category: "agents",
    summary: "A system in which multiple agents cooperate, coordinate or specialize around a shared objective.",
    why: "Multiple agents can separate responsibilities, perspectives, permissions and validation roles.",
    how: "An orchestrator or protocol routes tasks, context and results among specialized agents and resolves dependencies or conflicts.",
    example: "Separate agents handle requirements, simulation, cost analysis and compliance before a governance agent consolidates the result.",
    tags: ["orchestration", "specialization", "coordination"], related: ["agent", "mcp", "guardrails"],
    source: { label: "AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation — Wu et al. (2023)", url: "https://arxiv.org/abs/2308.08155" },
    mathIntensity: "low",
    mathNote: "Coordination between agents is protocol and systems design. Game theory can describe some multi-agent settings formally, but deployed systems are overwhelmingly software orchestration."
  },
  {
    slug: "mcp", acronym: "MCP", name: "Model Context Protocol", category: "agents",
    summary: "An open protocol for connecting AI applications to external tools, resources and reusable prompts through a standard interface.",
    why: "MCP reduces custom integration work and makes context and tool connectivity more portable across clients and servers.",
    how: "MCP clients connect to servers that expose capabilities such as tools and resources using a defined protocol and message model.",
    example: "One MCP server exposes approved engineering documents to several compatible AI assistants.",
    tags: ["protocol", "tools", "connectivity"], related: ["tool-use", "api", "agent"],
    source: { label: "Model Context Protocol — official documentation", url: "https://modelcontextprotocol.io/docs/getting-started/intro" },
    mathIntensity: "low",
    mathNote: "MCP has no intrinsic mathematical foundation. It is a software architecture and interoperability protocol: it defines how a model connects to tools, data and context, not how a model learns or infers. Mathematics becomes relevant in the models, retrieval systems and tools connected through it."
  },
  {
    slug: "api", acronym: "API", name: "Application Programming Interface", category: "agents",
    summary: "A defined interface through which software systems request data or operations from one another.",
    why: "APIs are the basic integration layer behind most AI tools, data services and enterprise workflows.",
    how: "A client sends a structured request to an endpoint or library function and receives a defined response.",
    example: "An agent queries a lifecycle-assessment service through an API and receives impact indicators as JSON.",
    tags: ["integration", "software", "endpoint"], related: ["function-calling", "mcp", "tool-use"],
    source: { label: "OpenAPI Specification — official specification", url: "https://spec.openapis.org/oas/latest.html" },
    mathIntensity: "low",
    mathNote: "An API is an interface contract. Whatever mathematics exists sits behind it, in what the endpoint actually computes."
  },
  {
    slug: "context-window", acronym: "Context Window", name: "Context Window", category: "agents",
    summary: "The amount of tokenized information a model can process in one request or active sequence.",
    why: "The context window determines how much conversation, evidence, code or retrieved content can be considered at once.",
    how: "Input tokens and generated tokens consume a finite sequence budget defined by the model and serving system.",
    example: "A long technical dossier may need chunking or retrieval because it exceeds the model's context window.",
    tags: ["tokens", "attention", "sequence length"], related: ["tokenization", "kv-cache", "positional-encoding", "linear-attention", "rag"],
    source: { label: "Lost in the Middle: How Language Models Use Long Contexts — Liu et al. (2023)", url: "https://arxiv.org/abs/2307.03172" },
    mathIntensity: "low",
    mathNote: "The context window is an architectural and memory limit. Its cost is governed by attention's quadratic scaling in sequence length, but the window itself is a constraint rather than a computation."
  },
  {
    slug: "memory", acronym: "Memory", name: "Agent Memory", category: "agents",
    summary: "Mechanisms that preserve useful information across steps, sessions or tasks beyond the immediate prompt.",
    why: "Memory helps agents maintain continuity, preferences, plans and accumulated evidence.",
    how: "Systems store selected facts, summaries, events or embeddings and retrieve them when relevant to a later task.",
    example: "An agent remembers an approved design constraint and applies it during later optimization work.",
    tags: ["state", "persistence", "retrieval"], related: ["agent", "vector-db", "context-window"],
    source: { label: "MemGPT: Towards LLMs as Operating Systems — Packer et al. (2023)", url: "https://arxiv.org/abs/2310.08560" },
    mathIntensity: "low",
    mathNote: "Agent memory is a storage and retrieval design. Where it is implemented with embeddings, the mathematics is that of retrieval."
  },

  {
    slug: "tokenization", acronym: "Tokenization", name: "Tokenization", category: "inference",
    summary: "Converting text or other inputs into discrete units a model can process.",
    why: "Tokenization affects sequence length, cost, multilingual behavior and how text maps to model inputs.",
    how: "A tokenizer segments text into words, subwords, characters or byte-level pieces and assigns each an integer identifier.",
    example: "A technical compound may be represented by several subword tokens rather than one whole word.",
    tags: ["tokens", "vocabulary", "text processing"], related: ["bpe", "context-window", "llm"],
    source: { label: "SentencePiece: A simple and language independent subword tokenizer — Kudo & Richardson (2018)", url: "https://arxiv.org/abs/1808.06226" },
    mathIntensity: "low",
    mathNote: "Tokenization is a string-processing procedure. It decides what the units of a sequence are; the mathematics begins once those units become vectors."
  },
  {
    slug: "bpe", acronym: "BPE", name: "Byte Pair Encoding", category: "inference",
    summary: "A subword tokenization method that iteratively merges frequent adjacent symbol pairs.",
    why: "BPE balances manageable vocabulary size with the ability to represent rare or previously unseen words.",
    how: "Training starts from small units and repeatedly creates a new token for the most frequent pair.",
    example: "A rare technical word is represented by a sequence of familiar subword pieces.",
    tags: ["subword", "vocabulary", "tokenizer"], related: ["tokenization", "llm", "context-window"],
    source: { label: "Neural Machine Translation of Rare Words with Subword Units — Sennrich et al. (2015)", url: "https://arxiv.org/abs/1508.07909" },
    mathIntensity: "low",
    mathNote: "Byte-pair encoding is a greedy merge algorithm driven by frequency counts — combinatorial rather than mathematical in any deeper sense."
  },
  {
    slug: "kv-cache", acronym: "KV Cache", name: "Key-Value Cache", category: "inference",
    summary: "Stored attention keys and values from previously processed tokens during autoregressive generation.",
    why: "KV caching avoids recomputing the entire preceding sequence for every newly generated token.",
    how: "Each transformer layer retains the key and value tensors for prior tokens and appends new entries as generation proceeds.",
    example: "A chat response generates faster after the prompt has been processed because prior attention states are cached.",
    tags: ["attention", "inference memory", "generation"], related: ["transformer", "prefill-and-decode", "memory-bandwidth-bound", "gqa", "mla", "latency", "context-window"],
    source: { label: "Efficiently Scaling Transformer Inference — Pope et al. (2022)", url: "https://arxiv.org/abs/2211.05102" },
    mathIntensity: "low",
    mathNote: "The KV cache is a systems optimization: keys and values already computed are stored rather than recomputed. It changes cost, not results."
  },
  {
    slug: "prefill-and-decode", acronym: "Prefill/Decode", name: "Prefill and Decode Phases", category: "inference",
    summary: "The two phases of generation — reading the prompt all at once, then producing tokens one at a time — which behave so differently they are effectively two separate workloads.",
    why: "Almost every inference metric and optimization only makes sense once the two are separated. Time to first token is a prefill problem and tokens per second is a decode problem, and they are improved by opposite means.",
    how: "Prefill processes the whole prompt in a single parallel pass and saturates the arithmetic units, so it is compute-bound. Decode then emits one token per step; each step does very little arithmetic but must read the entire set of weights and the whole KV cache from memory, so it is bound by memory bandwidth. Batching therefore helps decode enormously and prefill barely at all, because batching amortizes one weight read across many requests.",
    example: "A long document with a one-line answer is dominated by prefill; a short prompt with a long answer is dominated by decode — and only the second gets faster when you raise the batch size.",
    tags: ["time to first token", "generation", "serving", "chunked prefill"], related: ["kv-cache", "memory-bandwidth-bound", "latency", "throughput", "batching"],
    source: { label: "Taming Throughput-Latency Tradeoff in LLM Inference with Sarathi-Serve — Agrawal et al., OSDI (2024)", url: "https://arxiv.org/abs/2403.02310" },
    mathIntensity: "low",
    mathNote: "The split is a systems distinction rather than a mathematical one — the same attention arithmetic runs in both phases. What changes is the shape of the work, and therefore which hardware limit binds first."
  },
  {
    slug: "memory-bandwidth-bound", acronym: "Bandwidth-Bound", name: "Memory-Bandwidth Bound", category: "inference",
    summary: "The condition where a computation waits on moving data rather than on arithmetic — the state most language-model inference is actually in.",
    why: "It explains most of modern inference engineering at once. Quantization, KV-cache compression, attention kernels, grouped-query attention and speculative decoding are all attempts to move fewer bytes, not to perform less arithmetic.",
    how: "Compare arithmetic intensity — operations performed per byte read — against the accelerator's own ratio of peak arithmetic to peak memory bandwidth. Below that break-even point the memory system is the limit and the arithmetic units sit idle waiting. Generating one token for one request reads every weight in the model to perform a handful of operations per byte, which is far below any modern accelerator's threshold.",
    example: "Halving weight precision from sixteen to eight bits roughly doubles decode speed although the arithmetic is unchanged — there are simply half as many bytes to fetch.",
    tags: ["roofline", "arithmetic intensity", "HBM", "compute bound"], related: ["prefill-and-decode", "quantization", "kv-cache", "throughput", "batching"],
    source: { label: "Roofline: An Insightful Visual Performance Model for Multicore Architectures — Williams, Waterman & Patterson, Communications of the ACM (2009)", url: "https://doi.org/10.1145/1498765.1498785" },
    mathIntensity: "low",
    mathNote: "This is a hardware performance model rather than a piece of mathematics: a ratio of operations to bytes moved, compared against a ratio the machine fixes. It governs how long a computation takes and never what it returns."
  },
  {
    slug: "flash-attention", acronym: "FlashAttention", name: "IO-Aware Exact Attention", category: "inference",
    summary: "An implementation of ordinary attention that never writes the full score matrix to memory, making it far faster while returning exactly the same result.",
    why: "Attention is limited by memory traffic rather than arithmetic. The n × n score matrix is written out to high-bandwidth memory and read back, and that movement — not the multiplications — dominates the cost.",
    how: "Queries, keys and values are split into blocks small enough to fit in the GPU's on-chip memory, and attention is computed a block at a time. A running maximum and a running sum let the softmax be rescaled as each new block arrives, so the correct normalization is reached without the whole row ever existing at once. The result is bit-comparable to standard attention: this is an exact method, not an approximation.",
    example: "Training at a 16k context becomes practical on unchanged hardware, because peak memory now grows with sequence length rather than with its square.",
    tags: ["kernel", "tiling", "SRAM", "online softmax", "exact"], related: ["attention", "memory-bandwidth-bound", "throughput", "kv-cache"],
    source: { label: "FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness — Dao et al. (2022)", url: "https://arxiv.org/abs/2205.14135" },
    math: {
      intro: "The method rests on one identity: a softmax computed over two blocks can be corrected into the softmax over their union, using only the running maximum and running sum.",
      formulas: [
        { label: "Rescaling a partial softmax", expression: "m_new = max(m_old, m_block)\n\nℓ_new = e^{m_old − m_new} ℓ_old  +  e^{m_block − m_new} ℓ_block\n\nO_new = e^{m_old − m_new} O_old  +  e^{m_block − m_new} O_block", note: "m is the running row maximum, ℓ the running sum of exponentials and O the running weighted output. Each new block rescales what came before by a single factor, so the final result equals the softmax over the whole row. Subtracting the maximum before exponentiating is also what keeps the exponentials from overflowing." }
      ]
    },
    mathIntensity: "medium",
    mathFoundations: [
      { slug: "softmax", importance: "primary", note: "The online rescaling identity that lets a softmax be accumulated block by block is the mathematical core of the method." },
      { slug: "numerical-stability", importance: "primary", note: "Tracking a running maximum and subtracting it before exponentiating is what keeps the intermediate values representable." },
      { slug: "matrix-multiplication", importance: "supporting", note: "Blocks are sized to the shapes the tensor cores multiply efficiently, which is why the tile dimensions are what they are." }
    ]
  },
  {
    slug: "gqa", acronym: "GQA", name: "Grouped-Query Attention", category: "inference",
    summary: "An attention variant in which several query heads share one set of keys and values, shrinking the KV cache with little loss of quality.",
    why: "The KV cache, rather than the weights, is usually what caps how many conversations a server can hold concurrently. Sharing keys and values across heads divides that cache by the sharing factor.",
    how: "Standard multi-head attention gives every head its own keys and values. Multi-query attention takes the opposite extreme with one shared set for all heads — fast, but measurably worse. Grouped-query sits between the two: heads are divided into groups, each group sharing a single key-value pair. An existing multi-head checkpoint can be converted by mean-pooling the heads within each group and fine-tuning briefly.",
    example: "A model with thirty-two query heads and eight key-value groups carries a quarter of the KV cache, so roughly four times as many concurrent requests fit in the same memory.",
    tags: ["MQA", "KV cache", "head sharing", "serving"], related: ["attention", "kv-cache", "mla", "throughput"],
    source: { label: "GQA: Training Generalized Multi-Query Transformer Models from Multi-Head Checkpoints — Ainslie et al. (2023)", url: "https://arxiv.org/abs/2305.13245" },
    mathIntensity: "medium",
    mathFoundations: [
      { slug: "matrix-multiplication", importance: "primary", note: "One key-value pair is multiplied against several query heads, which raises arithmetic intensity — more work performed per byte fetched." },
      { slug: "vector-spaces", importance: "supporting", note: "Heads in a group are forced to read from one shared key-value subspace rather than each having its own." },
      { slug: "dot-product", importance: "supporting", note: "The scoring is unchanged; only how many distinct key sets those dot products run against is reduced." }
    ]
  },
  {
    slug: "speculative-decoding", acronym: "Speculative", name: "Speculative Decoding", category: "inference",
    summary: "Drafting several tokens with a small fast model and having the large model check them all in one pass, keeping those it agrees with.",
    why: "Because decode is bound by memory bandwidth, verifying several tokens costs almost exactly what generating one costs. The speed-up comes from doing more arithmetic per byte read, not from doing less work.",
    how: "A small draft model proposes a handful of tokens. The large model scores all of them in a single forward pass. An accept-reject rule then keeps the longest prefix consistent with the large model's own distribution and resamples at the first disagreement. The tokens that come out are distributed exactly as if the large model had generated them alone — this is a lossless speed-up, not an approximation.",
    example: "A one-billion-parameter draft model paired with a seventy-billion-parameter target commonly gives two to three times the tokens per second, with output quality unchanged by construction.",
    tags: ["draft model", "verification", "rejection sampling", "lossless"], related: ["memory-bandwidth-bound", "prefill-and-decode", "latency", "distillation"],
    source: { label: "Fast Inference from Transformers via Speculative Decoding — Leviathan, Kalman & Matias, ICML (2023)", url: "https://arxiv.org/abs/2211.17192" },
    math: {
      intro: "The correctness argument is rejection sampling. The acceptance rule and the resampling rule together reproduce the target distribution exactly.",
      formulas: [
        { label: "Accept, or resample the residual", expression: "accept x ~ q(x)  with probability  min(1, p(x) / q(x))\n\non rejection, draw from  p′(x) = norm( max(0, p(x) − q(x)) )", note: "p is the large model's distribution and q the draft's. A token the draft over-proposes is accepted only in proportion to how much the target actually wanted it; the probability mass that survives rejection is exactly the shortfall p − q, so resampling from its normalized positive part restores p. The closer q is to p, the more tokens are accepted." }
      ]
    },
    mathIntensity: "high",
    mathFoundations: [
      { slug: "sampling", importance: "primary", note: "The accept-reject step is textbook rejection sampling, which is why the method is exact rather than approximate." },
      { slug: "probability-distributions", importance: "primary", note: "Acceptance compares the target and draft distributions token by token; the expected speed-up is a function of how far apart they are." },
      { slug: "conditional-probability", importance: "supporting", note: "Every proposed token is conditioned on the ones before it, so a single rejection invalidates the whole remaining draft." },
      { slug: "kl-divergence", importance: "supporting", note: "How closely the draft matches the target — and so how many tokens survive — is what distilling the draft from the target is optimizing." }
    ]
  },
  {
    slug: "quantization", acronym: "Quantization", name: "Model Quantization", category: "inference",
    summary: "Representing model weights or activations with lower numerical precision.",
    why: "Quantization reduces memory use, bandwidth and often inference cost, though accuracy can degrade if applied poorly.",
    how: "High-precision values are mapped to a smaller set of low-bit numerical levels, sometimes with scaling factors and calibration.",
    example: "A model stored in 4-bit form requires far less GPU memory than the same model in 16-bit form.",
    tags: ["low precision", "compression", "memory"], related: ["qlora", "distillation", "memory-bandwidth-bound", "latency"],
    source: { label: "Quantization and Training of Neural Networks for Efficient Integer-Arithmetic-Only Inference — Jacob et al. (2017)", url: "https://arxiv.org/abs/1712.05877" },
    math: {
      intro: "Affine (asymmetric) quantization maps a floating-point range onto a small integer range.",
      formulas: [
        { label: "Quantize", expression: "q = clamp( round( x / s ) + z , q_min , q_max )", note: "s is the scale and z the zero-point, chosen so that the observed range of x maps onto [q_min, q_max]. For int8, that range is -128 to 127." },
        { label: "Dequantize", expression: "x̂ = s · (q - z)", note: "The reconstruction error |x - x̂| is bounded by s/2, so a narrower range per tensor, per channel or per group means less error." },
        { label: "Scale and zero-point", expression: "s = (x_max - x_min) / (q_max - q_min)\n     z = round(q_min - x_min / s)", note: "Outliers widen the range and cost precision for every other value, which is why outlier-aware schemes matter at LLM scale." }
      ]
    },
    mathIntensity: "high",
    mathFoundations: [
      { slug: "floating-point", importance: "primary", note: "Quantization is a choice about how many bits each weight gets — fp16, int8 or 4-bit." },
      { slug: "rounding-error", importance: "primary", note: "Every value snaps to the nearest representable one, with error bounded by half the step size." },
      { slug: "numerical-stability", importance: "primary", note: "Those errors compound across layers, so a scheme that looks fine on one matrix can still ruin a full stack." },
      { slug: "vector-norms", importance: "supporting", note: "Scale factors are set from the magnitudes present in each block, which is why a single outlier weight is so damaging." }
    ]
  },
  {
    slug: "pruning", acronym: "Pruning", name: "Model Pruning", category: "inference",
    summary: "Removing model weights, connections, channels or components judged to be less important.",
    why: "Pruning can reduce model size and compute, especially when hardware and software exploit the resulting sparsity.",
    how: "An importance criterion identifies parameters to remove, followed by optional retraining to recover performance.",
    example: "Low-impact attention heads are removed and the model is fine-tuned again.",
    tags: ["sparsity", "compression", "efficiency"], related: ["distillation", "quantization", "throughput"],
    source: { label: "Learning both Weights and Connections for Efficient Neural Networks — Han et al. (2015)", url: "https://arxiv.org/abs/1506.02626" },
    mathIntensity: "medium",
    mathFoundations: [
      { slug: "vector-norms", importance: "primary", note: "Magnitude pruning removes the weights with the smallest norm, on the assumption that they contribute least." },
      { slug: "matrix-rank", importance: "supporting", note: "Structured pruning removes whole rows or channels, lowering the effective rank of a layer." },
      { slug: "numerical-stability", importance: "supporting", note: "Aggressive pruning can amplify error along the paths that remain." },
      { slug: "regularization", importance: "primary", note: "Magnitude pruning is regularization carried to its conclusion: penalise small weights, then delete them." },
      { slug: "eigenvalues", importance: "supporting", note: "Structured pruning uses spectral criteria to decide which channels carry little of the transformation." },
      { slug: "singular-value-decomposition", importance: "supporting", note: "Truncating the SVD of a trained layer is the principled version of removing what a matrix barely uses." }
    ]
  },
  {
    slug: "batching", acronym: "Batching", name: "Inference Batching", category: "inference",
    summary: "Processing multiple inputs together to use compute resources more efficiently.",
    why: "Batching can significantly improve throughput, although larger batches may increase waiting time for individual requests.",
    how: "Requests are grouped so matrix operations run across several sequences in parallel; dynamic batching forms groups continuously.",
    example: "An inference server combines several incoming prompts into one GPU execution batch.",
    tags: ["serving", "parallelism", "GPU utilization"], related: ["throughput", "latency", "prefill-and-decode", "kv-cache"],
    source: { label: "Orca: A Distributed Serving System for Transformer-Based Generative Models — Yu et al., OSDI (2022)", url: "https://www.usenix.org/conference/osdi22/presentation/yu" },
    mathIntensity: "low",
    mathNote: "Batching is a scheduling and throughput decision. It changes how work is grouped on the accelerator, not what is computed."
  },
  {
    slug: "latency", acronym: "Latency", name: "Inference Latency", category: "inference",
    summary: "The elapsed time between a request and a relevant response milestone.",
    why: "Latency determines responsiveness for interactive assistants, robots and real-time applications.",
    how: "It is influenced by model size, hardware, input length, batching, network overhead and generation length.",
    example: "Time to first token measures how quickly a user sees the beginning of a generated response.",
    tags: ["response time", "TTFT", "performance"], related: ["throughput", "batching", "prefill-and-decode", "speculative-decoding", "quantization"],
    source: { label: "MLPerf Inference Benchmark — Reddi et al. (2019)", url: "https://arxiv.org/abs/1911.02549" },
    mathIntensity: "low",
    mathNote: "Latency is a systems measurement, shaped by model size, sequence length and hardware rather than by any mathematics of its own."
  },
  {
    slug: "throughput", acronym: "Throughput", name: "Inference Throughput", category: "inference",
    summary: "The amount of inference work completed per unit of time, often measured in requests or tokens per second.",
    why: "Throughput is central to serving cost, capacity planning and user concurrency.",
    how: "It improves through parallelism, batching, optimized kernels, efficient memory access and appropriate model architecture.",
    example: "A serving stack increases tokens per second while keeping response latency within a target range.",
    tags: ["tokens per second", "capacity", "serving"], related: ["latency", "batching", "flash-attention", "moe"],
    source: { label: "Efficient Memory Management for Large Language Model Serving with PagedAttention — Kwon et al. (2023)", url: "https://arxiv.org/abs/2309.06180" },
    mathIntensity: "low",
    mathNote: "Throughput is a systems measurement of served volume, governed by batching, memory bandwidth and scheduling."
  },

  {
    slug: "multimodal", acronym: "Multimodal AI", name: "Multimodal Artificial Intelligence", category: "multimodal",
    summary: "AI that processes or generates more than one modality, such as text, images, audio, video or sensor data.",
    why: "Real-world understanding often requires combining signals that carry complementary information.",
    how: "Modality-specific encoders and decoders are aligned or connected through shared representations and cross-attention.",
    example: "A system combines a technician's spoken question, a machine image and live telemetry to propose a diagnosis.",
    tags: ["modalities", "fusion", "cross-modal"], related: ["vlm", "asr", "tts"],
    source: { label: "Flamingo: a Visual Language Model for Few-Shot Learning — Alayrac et al. (2022)", url: "https://arxiv.org/abs/2204.14198" },
    mathIntensity: "medium",
    mathFoundations: [
      { slug: "vector-spaces", importance: "primary", note: "Handling several modalities at once means giving them a common space to live in." },
      { slug: "latent-space", importance: "primary", note: "Each input type is encoded into a representation that discards its surface form." },
      { slug: "cosine-similarity", importance: "supporting", note: "Cross-modal retrieval — find the image for this sentence — is a nearest-direction query." }
    ]
  },
  {
    slug: "ocr", acronym: "OCR", name: "Optical Character Recognition", category: "multimodal",
    summary: "Technology that detects and converts text in images or scanned documents into machine-readable characters.",
    why: "OCR unlocks information embedded in drawings, labels, forms, legacy scans and photographs.",
    how: "The system locates text regions, recognizes character sequences and may reconstruct layout and reading order.",
    example: "OCR extracts part numbers and warning labels from an equipment photograph.",
    tags: ["document AI", "image to text", "recognition"], related: ["cv", "image-modality", "nlp"],
    source: { label: "Tesseract OCR — official documentation", url: "https://tesseract-ocr.github.io/" },
    mathIntensity: "medium",
    mathFoundations: [
      { slug: "probability-distributions", importance: "primary", note: "Character recognition outputs a distribution over possible characters at each position." },
      { slug: "cross-entropy", importance: "supporting", note: "Training scores the model against the transcribed ground truth." },
      { slug: "matrix-multiplication", importance: "supporting", note: "The visual encoder underneath is the same stack of linear operations as any vision model." }
    ]
  },
  {
    slug: "asr", acronym: "ASR", name: "Automatic Speech Recognition", category: "multimodal",
    summary: "Converting spoken audio into text or structured linguistic units.",
    why: "ASR enables voice interfaces, transcription, accessibility and analysis of spoken interactions.",
    how: "Audio features are mapped to tokens or characters using acoustic and language modeling, often in an end-to-end neural system.",
    example: "A field technician dictates an inspection report that is transcribed automatically.",
    tags: ["speech to text", "audio", "transcription"], related: ["audio-modality", "tts", "nlp"],
    source: { label: "Robust Speech Recognition via Large-Scale Weak Supervision — Radford et al. (2022)", url: "https://arxiv.org/abs/2212.04356" },
    mathIntensity: "medium",
    mathFoundations: [
      { slug: "probability-distributions", importance: "primary", note: "Speech recognition produces a distribution over token sequences, not a single certain transcript." },
      { slug: "conditional-probability", importance: "supporting", note: "Each output token is conditioned on the audio and on what has been transcribed so far." },
      { slug: "sampling", importance: "supporting", note: "Decoding strategy — greedy or beam — decides which path through that distribution is returned." }
    ]
  },
  {
    slug: "tts", acronym: "TTS", name: "Text-to-Speech", category: "multimodal",
    summary: "Generating spoken audio from written text.",
    why: "TTS supports accessible interfaces, voice assistants, narration and hands-free industrial workflows.",
    how: "A model predicts acoustic representations from text and a vocoder converts them into an audio waveform.",
    example: "An assistant reads a maintenance instruction aloud while the technician works.",
    tags: ["speech synthesis", "voice", "audio"], related: ["asr", "audio-modality", "multimodal"],
    source: { label: "WaveNet: A Generative Model for Raw Audio — van den Oord et al. (2016)", url: "https://arxiv.org/abs/1609.03499" },
    mathIntensity: "medium",
    mathFoundations: [
      { slug: "probability-distributions", importance: "primary", note: "Speech synthesis models the distribution of plausible audio for a given text." },
      { slug: "sampling", importance: "primary", note: "Generation draws from it, which is why the same sentence can be spoken more than one way." },
      { slug: "loss-functions", importance: "supporting", note: "Training minimises the distance between generated and reference audio representations." }
    ]
  },
  {
    slug: "text-modality", acronym: "Text", name: "Text Modality", category: "multimodal",
    summary: "Written language represented as characters, tokens, documents or structured text.",
    why: "Text remains the primary interface for instructions, documentation, code and knowledge-intensive AI.",
    how: "Text is tokenized and encoded into numerical representations for language models and retrieval systems.",
    example: "A model processes requirements, emails, manuals and source code in one workflow.",
    tags: ["language", "documents", "tokens"], related: ["nlp", "tokenization", "llm"],
    source: { label: "A Neural Probabilistic Language Model — Bengio et al., JMLR (2003)", url: "https://www.jmlr.org/papers/v3/bengio03a.html" },
    mathIntensity: "low",
    mathNote: "A modality is a data format, not a method. Text becomes mathematical at tokenization and embedding, which are separate concepts."
  },
  {
    slug: "image-modality", acronym: "Image", name: "Image Modality", category: "multimodal",
    summary: "Two-dimensional visual information represented as pixels, patches, regions or learned features.",
    why: "Images capture shape, appearance, spatial context and visual evidence that text may not contain.",
    how: "Vision encoders transform pixels or patches into feature representations used for classification, generation or reasoning.",
    example: "A model inspects a thermal image to identify an overheated rack component.",
    tags: ["pixels", "vision", "visual data"], related: ["cv", "cnn", "vlm"],
    source: { label: "An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale — Dosovitskiy et al. (2020)", url: "https://arxiv.org/abs/2010.11929" },
    mathIntensity: "low",
    mathNote: "A modality is a data format, not a method. An image becomes mathematical once it is a tensor of pixel values fed to a vision encoder."
  },
  {
    slug: "audio-modality", acronym: "Audio", name: "Audio Modality", category: "multimodal",
    summary: "Sound represented as waveforms, frequency features, tokens or learned acoustic representations.",
    why: "Audio carries speech, environmental signals, machine acoustics and temporal patterns.",
    how: "Models process sampled waveforms or spectrogram-like features to recognize, classify or generate sound.",
    example: "An acoustic model detects an abnormal bearing noise before visible failure.",
    tags: ["sound", "waveform", "speech"], related: ["asr", "tts", "multimodal"],
    source: { label: "wav2vec 2.0: A Framework for Self-Supervised Learning of Speech Representations — Baevski et al. (2020)", url: "https://arxiv.org/abs/2006.11477" },
    mathIntensity: "low",
    mathNote: "A modality is a data format, not a method. Audio becomes mathematical at the point it is turned into a waveform or spectrogram representation."
  },
  {
    slug: "video-modality", acronym: "Video", name: "Video Modality", category: "multimodal",
    summary: "Time-ordered visual frames, often combined with audio, motion and event structure.",
    why: "Video contains temporal dynamics essential for activity recognition, robotics and world modeling.",
    how: "Models encode spatial information within frames and temporal relationships across frames.",
    example: "A video model learns the sequence of actions in an assembly procedure.",
    tags: ["temporal", "motion", "frames"], related: ["cv", "jepa", "multimodal"],
    source: { label: "ViViT: A Video Vision Transformer — Arnab et al. (2021)", url: "https://arxiv.org/abs/2103.15691" },
    mathIntensity: "low",
    mathNote: "A modality is a data format, not a method. Video adds a time axis to the image case; the mathematics belongs to the encoders that consume it."
  },

  {
    slug: "evals", acronym: "Evals", name: "AI Evaluations", category: "safety",
    summary: "Systematic tests that measure model or application behavior against defined criteria.",
    why: "Evals turn quality, reliability and safety goals into observable evidence that can guide improvement.",
    how: "A dataset, task harness and grader produce repeatable metrics or judgments, often across several failure modes.",
    example: "An evaluation checks whether a RAG assistant cites the correct source and refuses unsupported conclusions.",
    tags: ["testing", "graders", "quality"], related: ["benchmark", "hallucination", "guardrails"],
    source: { label: "Holistic Evaluation of Language Models — Liang et al. (2022)", url: "https://arxiv.org/abs/2211.09110" },
    mathIntensity: "medium",
    mathNote: "The mathematics here is ordinary statistics, and it is routinely ignored: small differences between models are frequently within sampling error.",
    mathFoundations: [
      { slug: "sampling", importance: "primary", note: "A benchmark score is a Monte Carlo estimate computed from a finite sample of prompts." },
      { slug: "probability-distributions", importance: "primary", note: "Any reported accuracy has a confidence interval, and it narrows only as 1/√N." },
      { slug: "entropy", importance: "supporting", note: "Perplexity, still the standard language modelling metric, is an entropy measurement in disguise." }
    ]
  },
  {
    slug: "benchmark", acronym: "Benchmark", name: "AI Benchmark", category: "safety",
    summary: "A standardized task or suite used to compare systems under defined conditions.",
    why: "Benchmarks provide a common reference point, but their results may not predict performance in a specific deployment.",
    how: "Models are evaluated on the same datasets, prompts, metrics and scoring rules.",
    example: "Two models are compared on coding tasks, then separately tested on the company's real engineering workflow.",
    tags: ["comparison", "metrics", "test set"], related: ["evals", "latency", "alignment"],
    source: { label: "Measuring Massive Multitask Language Understanding — Hendrycks et al. (2020)", url: "https://arxiv.org/abs/2009.03300" },
    mathIntensity: "medium",
    mathFoundations: [
      { slug: "sampling", importance: "primary", note: "A benchmark is a sample of tasks; the score is an estimate, not a measurement." },
      { slug: "probability-distributions", importance: "supporting", note: "Comparing two models means comparing two estimates, each with its own error." }
    ]
  },
  {
    slug: "hallucination", acronym: "Hallucination", name: "Model Hallucination", category: "safety",
    summary: "A fluent output that is unsupported, fabricated or inconsistent with the available evidence.",
    why: "Hallucinations can create serious reliability problems when users interpret confident language as verified fact.",
    how: "They can arise from uncertain model predictions, missing context, conflicting data, weak retrieval or incentives that reward plausible completion.",
    example: "An assistant invents a maintenance interval that does not appear in the official manual.",
    tags: ["factuality", "unsupported claim", "error"], related: ["grounding", "rag", "evals"],
    source: { label: "Survey of Hallucination in Natural Language Generation — Ji et al. (2022)", url: "https://arxiv.org/abs/2202.03629" },
    mathIntensity: "medium",
    mathFoundations: [
      { slug: "conditional-probability", importance: "primary", note: "The model produces the most probable continuation given its context, which is not the same thing as the true one." },
      { slug: "maximum-likelihood", importance: "primary", note: "Training rewards fitting the distribution of the text, not being correct about the world — the gap between those is where hallucination lives." },
      { slug: "sampling", importance: "supporting", note: "Higher sampling temperature widens the range of continuations and with it the chance of an unsupported one." },
      { slug: "probability-distributions", importance: "supporting", note: "A confident false answer is a sharply peaked distribution on the wrong token." }
    ]
  },
  {
    slug: "alignment", acronym: "Alignment", name: "AI Alignment", category: "safety",
    summary: "The effort to make AI behavior consistent with intended goals, constraints and human values.",
    why: "A capable system is useful only when its objectives and actions remain compatible with the needs of users and society.",
    how: "Alignment uses data curation, instruction tuning, preference learning, oversight, constraints, evaluations and governance.",
    example: "A system prioritizes safety procedures over a user's request to bypass an approval step.",
    tags: ["objectives", "human preferences", "governance"], related: ["rlhf", "dpo", "guardrails"],
    source: { label: "Constitutional AI: Harmlessness from AI Feedback — Bai et al. (2022)", url: "https://arxiv.org/abs/2212.08073" },
    mathIntensity: "medium",
    mathFoundations: [
      { slug: "kl-divergence", importance: "primary", note: "Preference training is constrained by a KL penalty so improving behaviour does not destroy capability." },
      { slug: "expected-return", importance: "primary", note: "Alignment methods maximise a learned reward, so the quantity being optimised is an expected return." },
      { slug: "probability-distributions", importance: "supporting", note: "Human preferences are modelled as a distribution over which response is better." },
      { slug: "loss-functions", importance: "supporting", note: "What a system is aligned *to* is whatever the objective actually encodes — which is the hard part." }
    ]
  },
  {
    slug: "interpretability", acronym: "Interpretability", name: "Model Interpretability", category: "safety",
    summary: "Methods for understanding how a model represents information or arrives at outputs.",
    why: "Interpretability can help diagnose failures, reveal shortcuts and support scientific or governance analysis.",
    how: "Techniques inspect activations, features, gradients, attention patterns, causal interventions or simplified surrogate models.",
    example: "An analysis tests which image regions most influenced a defect classification.",
    tags: ["explanation", "mechanistic analysis", "transparency"], related: ["evals", "residual-connection", "alignment", "hallucination"],
    source: { label: "A Mathematical Framework for Transformer Circuits — Elhage et al. (2021)", url: "https://transformer-circuits.pub/2021/framework/index.html" },
    mathIntensity: "medium",
    mathFoundations: [
      { slug: "gradients", importance: "primary", note: "Attribution methods ask how the output changes with respect to each input, which is a gradient." },
      { slug: "matrices", importance: "primary", note: "Weights and activations are matrices; interpreting a model means inspecting their structure." },
      { slug: "eigenvalues", importance: "supporting", note: "Spectral analysis of activation covariance finds the directions a model actually uses." },
      { slug: "vector-spaces", importance: "supporting", note: "Feature directions are only meaningful because representations live in a consistent space." }
    ]
  },
  {
    slug: "guardrails", acronym: "Guardrails", name: "AI Guardrails", category: "safety",
    summary: "Technical and procedural controls that constrain inputs, outputs, tools or actions.",
    why: "Guardrails reduce risk by enforcing boundaries that should not depend solely on model judgment.",
    how: "Controls can include validation, permissions, policy checks, filters, sandboxing, approval gates and audit logs.",
    example: "An agent may draft a supplier order but cannot submit it without human approval and budget validation.",
    tags: ["controls", "permissions", "policy"], related: ["alignment", "agent", "multi-agent"],
    source: { label: "AI Risk Management Framework (AI RMF 1.0) — NIST", url: "https://www.nist.gov/itl/ai-risk-management-framework" },
    mathIntensity: "low",
    mathNote: "Guardrails are policy, validation and permission controls. Their value comes precisely from not depending on model judgement, so they are deliberately not statistical."
  }
];
