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
    tags: ["intelligence", "automation", "reasoning"], related: ["ml", "genai", "agent"]
  },
  {
    slug: "ml", acronym: "ML", name: "Machine Learning", category: "foundations",
    summary: "Methods that learn patterns from data instead of relying only on explicitly programmed rules.",
    why: "ML allows systems to improve predictions and decisions when the relationships in data are too complex to encode manually.",
    how: "A learning algorithm adjusts model parameters to reduce error on examples, then applies the learned pattern to new inputs.",
    example: "A model learns from historical sensor data to predict whether a component is likely to fail.",
    tags: ["learning", "data", "prediction"], related: ["ai", "dl", "supervised-learning"]
  },
  {
    slug: "dl", acronym: "DL", name: "Deep Learning", category: "foundations",
    summary: "Machine learning based on neural networks with many processing layers.",
    why: "Deep learning powers most modern breakthroughs in language, vision, speech and generative AI.",
    how: "Multiple layers progressively transform raw input into increasingly abstract representations while training adjusts millions or billions of parameters.",
    example: "A vision model learns edges, shapes, parts and complete objects across successive layers.",
    tags: ["neural networks", "representation learning"], related: ["ml", "nn", "transformer"]
  },
  {
    slug: "nlp", acronym: "NLP", name: "Natural Language Processing", category: "foundations",
    summary: "AI techniques for understanding, generating and transforming human language.",
    why: "NLP enables search, translation, summarization, assistants, information extraction and conversational interfaces.",
    how: "Text is converted into tokens and numerical representations that a model processes to classify, retrieve or generate language.",
    example: "An assistant summarizes a technical report and extracts its decisions and action items.",
    tags: ["language", "text", "linguistics"], related: ["tokenization", "transformer", "llm"]
  },
  {
    slug: "cv", acronym: "CV", name: "Computer Vision", category: "foundations",
    summary: "AI methods for interpreting images, video and other visual signals.",
    why: "Computer vision supports inspection, robotics, medical imaging, autonomous systems and visual search.",
    how: "Models learn spatial and semantic patterns to classify images, detect objects, segment regions or estimate motion and depth.",
    example: "A quality-control model detects surface defects on manufactured components.",
    tags: ["vision", "image", "video"], related: ["cnn", "vlm", "image-modality"]
  },
  {
    slug: "rl", acronym: "RL", name: "Reinforcement Learning", category: "foundations",
    summary: "Learning through interaction, where an agent seeks actions that maximize cumulative reward.",
    why: "RL is useful for sequential decisions, control, planning, robotics and preference optimization.",
    how: "The agent observes a state, chooses an action, receives feedback and updates its policy to improve long-term outcomes.",
    example: "A robot learns a manipulation policy by receiving higher reward for successful grasps.",
    tags: ["reward", "policy", "control"], related: ["agent", "ppo", "rlhf"]
  },
  {
    slug: "genai", acronym: "GenAI", name: "Generative AI", category: "foundations",
    summary: "AI systems that create new content such as text, images, audio, video, code or designs.",
    why: "Generative AI turns learned patterns into reusable content, interfaces and workflows rather than only predictions.",
    how: "A generative model estimates the structure of its training data and samples or predicts new outputs conditioned on a prompt or context.",
    example: "A model generates a product concept image from a written design brief.",
    tags: ["generation", "content", "foundation model"], related: ["llm", "diffusion", "multimodal"]
  },
  {
    slug: "supervised-learning", acronym: "SL", name: "Supervised Learning", category: "foundations",
    summary: "Learning from examples paired with known target labels or outputs.",
    why: "It is the standard approach when reliable labeled examples exist and a specific prediction task is defined.",
    how: "The model predicts an output, compares it with the correct answer and updates its parameters to reduce the difference.",
    example: "Training a classifier on images labeled as acceptable or defective.",
    tags: ["labels", "classification", "regression"], related: ["ml", "sft", "benchmark"]
  },
  {
    slug: "self-supervised-learning", acronym: "SSL", name: "Self-Supervised Learning", category: "foundations",
    summary: "Learning useful representations from data by creating training targets from the data itself.",
    why: "It reduces dependence on expensive human labels and enables pre-training at very large scale.",
    how: "The system predicts hidden, missing or transformed parts of an input from the remaining context.",
    example: "A language model predicts the next token; an image model predicts a hidden representation of an image region.",
    tags: ["pretraining", "representation", "unlabeled data"], related: ["pretraining", "jepa", "transformer"]
  },

  {
    slug: "nn", acronym: "NN", name: "Neural Network", category: "architectures",
    summary: "A parameterized model built from connected computational units arranged in layers.",
    why: "Neural networks can approximate highly complex relationships and learn representations directly from data.",
    how: "Each layer transforms its inputs using learned weights and nonlinear functions; backpropagation computes how to adjust the weights.",
    example: "A small network maps equipment measurements to a predicted remaining useful life.",
    tags: ["neurons", "layers", "backpropagation"], related: ["dl", "cnn", "transformer"]
  },
  {
    slug: "cnn", acronym: "CNN", name: "Convolutional Neural Network", category: "architectures",
    summary: "A neural architecture using learned filters to detect local spatial patterns.",
    why: "CNNs are efficient and effective for images, spatial signals and many industrial inspection tasks.",
    how: "Convolutional filters slide across the input, sharing weights and building progressively higher-level features.",
    example: "A CNN detects scratches and dents in camera images from a production line.",
    tags: ["convolution", "vision", "filters"], related: ["nn", "cv", "image-modality"]
  },
  {
    slug: "rnn", acronym: "RNN", name: "Recurrent Neural Network", category: "architectures",
    summary: "A neural network that reuses a hidden state while processing a sequence.",
    why: "RNNs introduced a practical way to model ordered data such as text, audio and time series.",
    how: "At each step, the network combines the current input with a representation of previous steps.",
    example: "An RNN processes a sequence of sensor readings to forecast the next value.",
    tags: ["sequence", "recurrent", "time series"], related: ["lstm", "transformer", "asr"]
  },
  {
    slug: "lstm", acronym: "LSTM", name: "Long Short-Term Memory", category: "architectures",
    summary: "A recurrent architecture with gates that control what information is stored, updated and forgotten.",
    why: "LSTMs mitigate the difficulty standard RNNs have in learning long-range dependencies.",
    how: "Input, output and forget gates regulate a persistent cell state as the sequence is processed.",
    example: "An LSTM uses a long sequence of operating conditions to predict energy consumption.",
    tags: ["gates", "memory", "sequence"], related: ["rnn", "memory", "transformer"]
  },
  {
    slug: "transformer", acronym: "Transformer", name: "Transformer Architecture", category: "architectures",
    summary: "A sequence architecture centered on attention rather than recurrence.",
    why: "Transformers made large-scale parallel training practical and underpin most current language and multimodal foundation models.",
    how: "Self-attention lets each token weigh the relevance of other tokens, while feed-forward layers transform the resulting representations.",
    example: "A transformer connects a pronoun to the relevant noun even when they are far apart in a document.",
    tags: ["attention", "sequence", "foundation model"], related: ["llm", "context-window", "kv-cache"],
    source: { label: "Attention Is All You Need — Vaswani et al. (2017)", url: "https://arxiv.org/abs/1706.03762" }
  },
  {
    slug: "llm", acronym: "LLM", name: "Large Language Model", category: "architectures",
    summary: "A high-capacity model trained on large text or multimodal corpora to process and generate language.",
    why: "LLMs provide broad reusable capabilities that can be adapted through prompting, retrieval, tools and fine-tuning.",
    how: "Most LLMs use transformers to predict tokens from context, then undergo additional adaptation for instruction following and safety.",
    example: "An LLM explains a technical standard, drafts code and calls a search tool when it needs current evidence.",
    tags: ["language model", "foundation model", "tokens"], related: ["transformer", "sft", "rag"]
  },
  {
    slug: "slm", acronym: "SLM", name: "Small Language Model", category: "architectures",
    summary: "A language model designed with fewer parameters and lower compute or memory requirements than frontier-scale LLMs.",
    why: "SLMs can reduce latency, cost and energy use and may run on edge devices or private infrastructure.",
    how: "They use similar architectures to LLMs but rely on smaller capacity, efficient training, distillation or task specialization.",
    example: "A compact model runs locally on an industrial workstation to classify maintenance requests.",
    tags: ["efficient", "edge", "compact model"], related: ["llm", "distillation", "quantization"]
  },
  {
    slug: "vlm", acronym: "VLM", name: "Vision-Language Model", category: "architectures",
    summary: "A model that jointly processes visual information and natural language.",
    why: "VLMs make images and video accessible through language-based questioning, search, reasoning and generation.",
    how: "Visual encoders and language components are aligned in a shared representation or connected through cross-attention.",
    example: "A VLM examines an equipment photo and answers which component appears damaged.",
    tags: ["vision", "language", "multimodal"], related: ["cv", "llm", "multimodal"]
  },
  {
    slug: "moe", acronym: "MoE", name: "Mixture of Experts", category: "architectures",
    summary: "An architecture that routes each input to a subset of specialized parameter blocks called experts.",
    why: "MoE can increase total model capacity without activating every parameter for every token.",
    how: "A learned router selects a small number of experts whose outputs are combined for the current input.",
    example: "Different experts become more useful for code, mathematics or natural-language patterns.",
    tags: ["routing", "experts", "sparse activation"], related: ["transformer", "llm", "throughput"],
    source: { label: "Switch Transformers — Fedus, Zoph & Shazeer (2021)", url: "https://arxiv.org/abs/2101.03961" }
  },
  {
    slug: "gan", acronym: "GAN", name: "Generative Adversarial Network", category: "architectures",
    summary: "A generative framework where a generator and discriminator improve through adversarial training.",
    why: "GANs established powerful methods for generating realistic images and learning data distributions.",
    how: "The generator creates samples while the discriminator tries to distinguish generated samples from real ones.",
    example: "A GAN creates synthetic images resembling a set of product textures.",
    tags: ["generator", "discriminator", "synthetic data"], related: ["genai", "vae", "diffusion"],
    source: { label: "Generative Adversarial Nets — Goodfellow et al. (2014)", url: "https://arxiv.org/abs/1406.2661" }
  },
  {
    slug: "vae", acronym: "VAE", name: "Variational Autoencoder", category: "architectures",
    summary: "A probabilistic autoencoder that learns a structured latent distribution for generation and representation learning.",
    why: "VAEs offer a principled way to encode data into a continuous latent space and generate new samples.",
    how: "An encoder predicts a probability distribution in latent space; a decoder reconstructs data from sampled latent variables.",
    example: "Interpolating between two latent points produces gradual variations of a component shape.",
    tags: ["latent space", "encoder", "decoder"], related: ["gan", "diffusion", "embeddings"],
    source: { label: "Auto-Encoding Variational Bayes — Kingma & Welling (2013)", url: "https://arxiv.org/abs/1312.6114" }
  },
  {
    slug: "diffusion", acronym: "Diffusion", name: "Diffusion Model", category: "architectures",
    summary: "A generative model that learns to reverse a gradual noising process.",
    why: "Diffusion models drive high-quality image generation and increasingly support audio, video and scientific generation.",
    how: "Training teaches the model to remove noise at different levels; generation starts from noise and iteratively denoises it.",
    example: "A text-conditioned diffusion model generates a product rendering from a design prompt.",
    tags: ["denoising", "image generation", "sampling"], related: ["genai", "vae", "image-modality"],
    source: { label: "Denoising Diffusion Probabilistic Models — Ho et al. (2020)", url: "https://arxiv.org/abs/2006.11239" }
  },
  {
    slug: "jepa", acronym: "JEPA", name: "Joint Embedding Predictive Architecture", category: "architectures",
    summary: "A predictive architecture that learns by forecasting representations rather than reconstructing every input detail.",
    why: "JEPA aims to learn abstract, semantic world representations useful for reasoning and planning.",
    how: "A context encoder predicts the latent representation of a target region or future state while avoiding direct pixel-level reconstruction.",
    example: "An image JEPA predicts the representation of a hidden image region from surrounding visual context.",
    tags: ["predictive representation", "world model", "self-supervised"], related: ["self-supervised-learning", "embeddings", "multimodal"],
    source: { label: "Self-Supervised Learning from Images with a Joint-Embedding Predictive Architecture — Assran et al. (2023)", url: "https://arxiv.org/abs/2301.08243" }
  },

  {
    slug: "pretraining", acronym: "Pre-training", name: "Pre-training", category: "training",
    summary: "The initial large-scale training phase used to learn broad reusable patterns before task-specific adaptation.",
    why: "Pre-training produces general-purpose representations and capabilities that reduce the data needed for downstream tasks.",
    how: "A model optimizes a self-supervised or supervised objective across a large and diverse dataset.",
    example: "A language model learns syntax, facts and coding patterns by predicting tokens across a large corpus.",
    tags: ["foundation model", "large-scale training"], related: ["self-supervised-learning", "fine-tuning", "sft"]
  },
  {
    slug: "fine-tuning", acronym: "Fine-tuning", name: "Fine-Tuning", category: "training",
    summary: "Additional training that adapts a pre-trained model to a task, domain, style or behavior.",
    why: "Fine-tuning can make a general model more accurate and consistent for a defined use case.",
    how: "Training continues on a smaller targeted dataset, updating all parameters or a parameter-efficient subset.",
    example: "A general language model is fine-tuned on validated maintenance question-and-answer examples.",
    tags: ["adaptation", "domain", "task"], related: ["pretraining", "sft", "peft"]
  },
  {
    slug: "sft", acronym: "SFT", name: "Supervised Fine-Tuning", category: "training",
    summary: "Fine-tuning on curated input-output examples that demonstrate desired behavior.",
    why: "SFT is a central step in teaching a foundation model to follow instructions and produce task-appropriate answers.",
    how: "The model is trained to reproduce a target response given an instruction and context.",
    example: "The model learns to answer maintenance questions in an approved step-by-step format.",
    tags: ["instruction tuning", "labeled examples"], related: ["fine-tuning", "rlhf", "dpo"]
  },
  {
    slug: "peft", acronym: "PEFT", name: "Parameter-Efficient Fine-Tuning", category: "training",
    summary: "A family of adaptation methods that train only a small fraction of a model's parameters.",
    why: "PEFT reduces memory, storage and compute requirements while preserving the original base model.",
    how: "Small trainable modules, prompts or low-rank updates are added while most base-model weights remain frozen.",
    example: "One shared base model supports several domain adapters without storing a full model copy for each domain.",
    tags: ["efficient adaptation", "adapter"], related: ["lora", "qlora", "fine-tuning"]
  },
  {
    slug: "lora", acronym: "LoRA", name: "Low-Rank Adaptation", category: "training",
    summary: "A PEFT method that learns low-rank weight updates while keeping the original model weights frozen.",
    why: "LoRA makes model adaptation substantially more memory- and storage-efficient than full fine-tuning.",
    how: "Instead of changing a large weight matrix directly, LoRA represents its update as the product of two much smaller trainable matrices.",
    example: "A separate LoRA adapter specializes one base model for sustainability terminology.",
    tags: ["adapter", "low rank", "efficient fine-tuning"], related: ["peft", "qlora", "fine-tuning"],
    source: { label: "LoRA: Low-Rank Adaptation of Large Language Models — Hu et al. (2021)", url: "https://arxiv.org/abs/2106.09685" }
  },
  {
    slug: "qlora", acronym: "QLoRA", name: "Quantized Low-Rank Adaptation", category: "training",
    summary: "A fine-tuning method that combines a quantized frozen base model with trainable LoRA adapters.",
    why: "QLoRA sharply reduces memory requirements, enabling adaptation of larger models on more accessible hardware.",
    how: "The base weights are stored in a low-bit representation while gradients update small LoRA matrices in higher precision.",
    example: "A large language model is adapted on a single high-memory GPU without loading all base weights in full precision.",
    tags: ["quantization", "LoRA", "memory efficiency"], related: ["lora", "quantization", "peft"],
    source: { label: "QLoRA: Efficient Finetuning of Quantized LLMs — Dettmers et al. (2023)", url: "https://arxiv.org/abs/2305.14314" }
  },
  {
    slug: "rlhf", acronym: "RLHF", name: "Reinforcement Learning from Human Feedback", category: "training",
    summary: "A family of methods that use human preferences to shape model behavior through reward modeling and reinforcement learning.",
    why: "RLHF can align model outputs with qualities that are difficult to express as a simple automatic loss function.",
    how: "Humans compare outputs, a reward model learns those preferences and an RL algorithm optimizes the model against the learned reward.",
    example: "Reviewers rank two assistant answers, helping the system learn which is more useful and safer.",
    tags: ["human preferences", "reward model", "alignment"], related: ["ppo", "dpo", "alignment"],
    source: { label: "Training language models to follow instructions with human feedback — Ouyang et al. (2022)", url: "https://arxiv.org/abs/2203.02155" }
  },
  {
    slug: "dpo", acronym: "DPO", name: "Direct Preference Optimization", category: "training",
    summary: "A preference-learning method that directly optimizes a language model from preferred and rejected responses.",
    why: "DPO simplifies preference alignment by avoiding an explicit reward-model-plus-RL training loop.",
    how: "The objective increases the relative likelihood of preferred responses compared with rejected responses while staying near a reference model.",
    example: "The model learns from pairs where reviewers selected the clearer technical explanation.",
    tags: ["preference optimization", "alignment"], related: ["rlhf", "sft", "alignment"],
    source: { label: "Direct Preference Optimization — Rafailov et al. (2023)", url: "https://arxiv.org/abs/2305.18290" }
  },
  {
    slug: "ppo", acronym: "PPO", name: "Proximal Policy Optimization", category: "training",
    summary: "A reinforcement-learning algorithm that constrains policy updates to improve training stability.",
    why: "PPO became widely used in robotics, control and RLHF because it balances implementation simplicity and reliable performance.",
    how: "A clipped objective discourages updates that move the new policy too far from the previous policy in one step.",
    example: "An RLHF pipeline uses PPO to optimize a language model against a learned reward model.",
    tags: ["policy gradient", "reinforcement learning"], related: ["rl", "rlhf", "dpo"],
    source: { label: "Proximal Policy Optimization Algorithms — Schulman et al. (2017)", url: "https://arxiv.org/abs/1707.06347" }
  },
  {
    slug: "distillation", acronym: "Distillation", name: "Knowledge Distillation", category: "training",
    summary: "Training a smaller student model to reproduce useful behavior from a larger teacher model.",
    why: "Distillation can preserve much of a larger model's performance while reducing inference cost and latency.",
    how: "The student learns from the teacher's output probabilities, generated examples or intermediate representations.",
    example: "A compact edge model is trained on explanations generated by a larger cloud model.",
    tags: ["teacher", "student", "compression"], related: ["slm", "quantization", "pruning"]
  },

  {
    slug: "rag", acronym: "RAG", name: "Retrieval-Augmented Generation", category: "retrieval",
    summary: "A pattern that retrieves external information and supplies it to a generative model at request time.",
    why: "RAG can provide current, private or domain-specific evidence without embedding all knowledge in model weights.",
    how: "The system searches a knowledge source, selects relevant passages and places them in the model's context before generation.",
    example: "An assistant retrieves the latest maintenance manual section before answering a technician's question.",
    tags: ["retrieval", "grounding", "knowledge"], related: ["embeddings", "vector-db", "grounding"],
    source: { label: "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks — Lewis et al. (2020)", url: "https://arxiv.org/abs/2005.11401" }
  },
  {
    slug: "graphrag", acronym: "GraphRAG", name: "Graph-based Retrieval-Augmented Generation", category: "retrieval",
    summary: "RAG enhanced with graph-structured entities, relationships, communities or summaries.",
    why: "GraphRAG can answer questions that require connecting evidence distributed across many documents and entities.",
    how: "Information is extracted into a graph, organized into connected structures and retrieved at local or global levels for generation.",
    example: "A system connects a component, its suppliers, failure modes and maintenance actions across multiple reports.",
    tags: ["graph", "retrieval", "entities"], related: ["rag", "knowledge-graph", "semantic-search"],
    source: { label: "Microsoft Research GraphRAG project", url: "https://www.microsoft.com/en-us/research/project/graphrag/" }
  },
  {
    slug: "embeddings", acronym: "Embeddings", name: "Vector Embeddings", category: "retrieval",
    summary: "Dense numerical representations that place semantically related items near one another in a vector space.",
    why: "Embeddings enable semantic search, clustering, recommendation, retrieval and cross-modal alignment.",
    how: "An encoder maps text, images or other inputs to fixed-length vectors learned to preserve useful similarity relationships.",
    example: "Queries about overheating retrieve documents discussing thermal excursions even without exact keyword matches.",
    tags: ["vectors", "semantic similarity", "representation"], related: ["vector-db", "semantic-search", "rag"]
  },
  {
    slug: "vector-db", acronym: "Vector DB", name: "Vector Database", category: "retrieval",
    summary: "A data system optimized to store embeddings and search for nearby vectors.",
    why: "Vector databases make semantic retrieval practical across large collections and support metadata filtering and indexing.",
    how: "Approximate nearest-neighbor indexes rapidly identify vectors most similar to a query embedding.",
    example: "Millions of document chunks are indexed so an assistant can retrieve the closest passages in milliseconds.",
    tags: ["database", "nearest neighbor", "index"], related: ["embeddings", "rag", "semantic-search"]
  },
  {
    slug: "knowledge-graph", acronym: "KG", name: "Knowledge Graph", category: "retrieval",
    summary: "A structured representation of entities, concepts and explicit relationships.",
    why: "Knowledge graphs make relationships queryable, explainable and reusable across applications.",
    how: "Facts are represented as nodes and edges, often enriched with schemas, identifiers, provenance and constraints.",
    example: "A graph links a motor to its manufacturer, material, compatible gearbox, failure modes and service instructions.",
    tags: ["entities", "relationships", "ontology"], related: ["graphrag", "grounding", "api"]
  },
  {
    slug: "semantic-search", acronym: "Semantic Search", name: "Semantic Search", category: "retrieval",
    summary: "Search based on meaning and intent rather than only exact keyword overlap.",
    why: "It improves discovery when users and documents use different vocabulary for the same concept.",
    how: "A query and candidate content are encoded into representations whose similarity is used for ranking.",
    example: "Searching for “reduce power draw” also finds material about energy-efficiency optimization.",
    tags: ["search", "meaning", "ranking"], related: ["embeddings", "vector-db", "rag"]
  },
  {
    slug: "grounding", acronym: "Grounding", name: "Grounding", category: "retrieval",
    summary: "Connecting a model's output to specified evidence, data, tools or an external environment.",
    why: "Grounding improves relevance and traceability and can reduce unsupported claims.",
    how: "The application supplies authoritative context or verifies claims against external sources during generation.",
    example: "A response cites the exact policy section retrieved from a controlled document repository.",
    tags: ["evidence", "factuality", "provenance"], related: ["rag", "hallucination", "tool-use"]
  },

  {
    slug: "prompt-engineering", acronym: "Prompt Engineering", name: "Prompt Engineering", category: "agents",
    summary: "Designing instructions and context so a model performs a task reliably.",
    why: "Prompt structure strongly influences output quality, constraints, format and tool behavior.",
    how: "The prompt defines the role, task, evidence, constraints, examples and expected output structure.",
    example: "A prompt requires an assistant to separate facts, assumptions, sources and recommended actions.",
    tags: ["instructions", "context", "few-shot"], related: ["cot", "context-window", "agent"]
  },
  {
    slug: "cot", acronym: "CoT", name: "Chain of Thought", category: "agents",
    summary: "Intermediate reasoning steps used by a model or reasoning system to reach an answer.",
    why: "Structured reasoning can improve performance on multi-step problems, although internal reasoning is not itself a guarantee of correctness.",
    how: "The system decomposes a problem into intermediate inferences, checks or tool calls before producing the final answer.",
    example: "A planning agent identifies dependencies, evaluates constraints and then selects an execution order.",
    tags: ["reasoning", "decomposition", "planning"], related: ["prompt-engineering", "agent", "evals"]
  },
  {
    slug: "function-calling", acronym: "Function Calling", name: "Function Calling", category: "agents",
    summary: "A structured mechanism for a model to select a function and produce validated arguments for it.",
    why: "Function calling turns language-model intent into controlled application actions.",
    how: "Available functions are described with schemas; the model chooses one and returns arguments that the host application validates and executes.",
    example: "An assistant calls a calendar function with a start time, duration and attendee list.",
    tags: ["structured output", "tools", "schema"], related: ["tool-use", "api", "mcp"]
  },
  {
    slug: "tool-use", acronym: "Tool Use", name: "Tool Use", category: "agents",
    summary: "The ability of an AI system to invoke external capabilities such as search, code execution, databases or business applications.",
    why: "Tools let models act on current data, perform exact computation and execute controlled operations beyond text generation.",
    how: "The model selects an available tool, supplies parameters, receives a result and incorporates it into the next step.",
    example: "An agent retrieves live inventory before recommending a replacement component.",
    tags: ["actions", "connectors", "external systems"], related: ["function-calling", "agent", "mcp"]
  },
  {
    slug: "agent", acronym: "Agent", name: "AI Agent", category: "agents",
    summary: "A goal-directed AI system that can plan, use tools, observe results and continue across multiple steps.",
    why: "Agents move AI from isolated answers toward workflows that interact with software, data and environments.",
    how: "An agent repeatedly evaluates state, selects an action, calls a tool or model and updates its plan until a stopping condition is reached.",
    example: "An engineering agent gathers requirements, searches standards, generates alternatives and requests human approval before publishing.",
    tags: ["planning", "actions", "workflow"], related: ["tool-use", "memory", "multi-agent"]
  },
  {
    slug: "multi-agent", acronym: "MAS", name: "Multi-Agent System", category: "agents",
    summary: "A system in which multiple agents cooperate, coordinate or specialize around a shared objective.",
    why: "Multiple agents can separate responsibilities, perspectives, permissions and validation roles.",
    how: "An orchestrator or protocol routes tasks, context and results among specialized agents and resolves dependencies or conflicts.",
    example: "Separate agents handle requirements, simulation, cost analysis and compliance before a governance agent consolidates the result.",
    tags: ["orchestration", "specialization", "coordination"], related: ["agent", "mcp", "guardrails"]
  },
  {
    slug: "mcp", acronym: "MCP", name: "Model Context Protocol", category: "agents",
    summary: "An open protocol for connecting AI applications to external tools, resources and reusable prompts through a standard interface.",
    why: "MCP reduces custom integration work and makes context and tool connectivity more portable across clients and servers.",
    how: "MCP clients connect to servers that expose capabilities such as tools and resources using a defined protocol and message model.",
    example: "One MCP server exposes approved engineering documents to several compatible AI assistants.",
    tags: ["protocol", "tools", "connectivity"], related: ["tool-use", "api", "agent"],
    source: { label: "Model Context Protocol — official documentation", url: "https://modelcontextprotocol.io/introduction" }
  },
  {
    slug: "api", acronym: "API", name: "Application Programming Interface", category: "agents",
    summary: "A defined interface through which software systems request data or operations from one another.",
    why: "APIs are the basic integration layer behind most AI tools, data services and enterprise workflows.",
    how: "A client sends a structured request to an endpoint or library function and receives a defined response.",
    example: "An agent queries a lifecycle-assessment service through an API and receives impact indicators as JSON.",
    tags: ["integration", "software", "endpoint"], related: ["function-calling", "mcp", "tool-use"]
  },
  {
    slug: "context-window", acronym: "Context Window", name: "Context Window", category: "agents",
    summary: "The amount of tokenized information a model can process in one request or active sequence.",
    why: "The context window determines how much conversation, evidence, code or retrieved content can be considered at once.",
    how: "Input tokens and generated tokens consume a finite sequence budget defined by the model and serving system.",
    example: "A long technical dossier may need chunking or retrieval because it exceeds the model's context window.",
    tags: ["tokens", "attention", "sequence length"], related: ["tokenization", "kv-cache", "rag"]
  },
  {
    slug: "memory", acronym: "Memory", name: "Agent Memory", category: "agents",
    summary: "Mechanisms that preserve useful information across steps, sessions or tasks beyond the immediate prompt.",
    why: "Memory helps agents maintain continuity, preferences, plans and accumulated evidence.",
    how: "Systems store selected facts, summaries, events or embeddings and retrieve them when relevant to a later task.",
    example: "An agent remembers an approved design constraint and applies it during later optimization work.",
    tags: ["state", "persistence", "retrieval"], related: ["agent", "vector-db", "context-window"]
  },

  {
    slug: "tokenization", acronym: "Tokenization", name: "Tokenization", category: "inference",
    summary: "Converting text or other inputs into discrete units a model can process.",
    why: "Tokenization affects sequence length, cost, multilingual behavior and how text maps to model inputs.",
    how: "A tokenizer segments text into words, subwords, characters or byte-level pieces and assigns each an integer identifier.",
    example: "A technical compound may be represented by several subword tokens rather than one whole word.",
    tags: ["tokens", "vocabulary", "text processing"], related: ["bpe", "context-window", "llm"]
  },
  {
    slug: "bpe", acronym: "BPE", name: "Byte Pair Encoding", category: "inference",
    summary: "A subword tokenization method that iteratively merges frequent adjacent symbol pairs.",
    why: "BPE balances manageable vocabulary size with the ability to represent rare or previously unseen words.",
    how: "Training starts from small units and repeatedly creates a new token for the most frequent pair.",
    example: "A rare technical word is represented by a sequence of familiar subword pieces.",
    tags: ["subword", "vocabulary", "tokenizer"], related: ["tokenization", "llm", "context-window"],
    source: { label: "Neural Machine Translation of Rare Words with Subword Units — Sennrich et al. (2015)", url: "https://arxiv.org/abs/1508.07909" }
  },
  {
    slug: "kv-cache", acronym: "KV Cache", name: "Key-Value Cache", category: "inference",
    summary: "Stored attention keys and values from previously processed tokens during autoregressive generation.",
    why: "KV caching avoids recomputing the entire preceding sequence for every newly generated token.",
    how: "Each transformer layer retains the key and value tensors for prior tokens and appends new entries as generation proceeds.",
    example: "A chat response generates faster after the prompt has been processed because prior attention states are cached.",
    tags: ["attention", "inference memory", "generation"], related: ["transformer", "latency", "context-window"]
  },
  {
    slug: "quantization", acronym: "Quantization", name: "Model Quantization", category: "inference",
    summary: "Representing model weights or activations with lower numerical precision.",
    why: "Quantization reduces memory use, bandwidth and often inference cost, though accuracy can degrade if applied poorly.",
    how: "High-precision values are mapped to a smaller set of low-bit numerical levels, sometimes with scaling factors and calibration.",
    example: "A model stored in 4-bit form requires far less GPU memory than the same model in 16-bit form.",
    tags: ["low precision", "compression", "memory"], related: ["qlora", "distillation", "latency"]
  },
  {
    slug: "pruning", acronym: "Pruning", name: "Model Pruning", category: "inference",
    summary: "Removing model weights, connections, channels or components judged to be less important.",
    why: "Pruning can reduce model size and compute, especially when hardware and software exploit the resulting sparsity.",
    how: "An importance criterion identifies parameters to remove, followed by optional retraining to recover performance.",
    example: "Low-impact attention heads are removed and the model is fine-tuned again.",
    tags: ["sparsity", "compression", "efficiency"], related: ["distillation", "quantization", "throughput"]
  },
  {
    slug: "batching", acronym: "Batching", name: "Inference Batching", category: "inference",
    summary: "Processing multiple inputs together to use compute resources more efficiently.",
    why: "Batching can significantly improve throughput, although larger batches may increase waiting time for individual requests.",
    how: "Requests are grouped so matrix operations run across several sequences in parallel; dynamic batching forms groups continuously.",
    example: "An inference server combines several incoming prompts into one GPU execution batch.",
    tags: ["serving", "parallelism", "GPU utilization"], related: ["throughput", "latency", "kv-cache"]
  },
  {
    slug: "latency", acronym: "Latency", name: "Inference Latency", category: "inference",
    summary: "The elapsed time between a request and a relevant response milestone.",
    why: "Latency determines responsiveness for interactive assistants, robots and real-time applications.",
    how: "It is influenced by model size, hardware, input length, batching, network overhead and generation length.",
    example: "Time to first token measures how quickly a user sees the beginning of a generated response.",
    tags: ["response time", "TTFT", "performance"], related: ["throughput", "batching", "quantization"]
  },
  {
    slug: "throughput", acronym: "Throughput", name: "Inference Throughput", category: "inference",
    summary: "The amount of inference work completed per unit of time, often measured in requests or tokens per second.",
    why: "Throughput is central to serving cost, capacity planning and user concurrency.",
    how: "It improves through parallelism, batching, optimized kernels, efficient memory access and appropriate model architecture.",
    example: "A serving stack increases tokens per second while keeping response latency within a target range.",
    tags: ["tokens per second", "capacity", "serving"], related: ["latency", "batching", "moe"]
  },

  {
    slug: "multimodal", acronym: "Multimodal AI", name: "Multimodal Artificial Intelligence", category: "multimodal",
    summary: "AI that processes or generates more than one modality, such as text, images, audio, video or sensor data.",
    why: "Real-world understanding often requires combining signals that carry complementary information.",
    how: "Modality-specific encoders and decoders are aligned or connected through shared representations and cross-attention.",
    example: "A system combines a technician's spoken question, a machine image and live telemetry to propose a diagnosis.",
    tags: ["modalities", "fusion", "cross-modal"], related: ["vlm", "asr", "tts"]
  },
  {
    slug: "ocr", acronym: "OCR", name: "Optical Character Recognition", category: "multimodal",
    summary: "Technology that detects and converts text in images or scanned documents into machine-readable characters.",
    why: "OCR unlocks information embedded in drawings, labels, forms, legacy scans and photographs.",
    how: "The system locates text regions, recognizes character sequences and may reconstruct layout and reading order.",
    example: "OCR extracts part numbers and warning labels from an equipment photograph.",
    tags: ["document AI", "image to text", "recognition"], related: ["cv", "image-modality", "nlp"]
  },
  {
    slug: "asr", acronym: "ASR", name: "Automatic Speech Recognition", category: "multimodal",
    summary: "Converting spoken audio into text or structured linguistic units.",
    why: "ASR enables voice interfaces, transcription, accessibility and analysis of spoken interactions.",
    how: "Audio features are mapped to tokens or characters using acoustic and language modeling, often in an end-to-end neural system.",
    example: "A field technician dictates an inspection report that is transcribed automatically.",
    tags: ["speech to text", "audio", "transcription"], related: ["audio-modality", "tts", "nlp"]
  },
  {
    slug: "tts", acronym: "TTS", name: "Text-to-Speech", category: "multimodal",
    summary: "Generating spoken audio from written text.",
    why: "TTS supports accessible interfaces, voice assistants, narration and hands-free industrial workflows.",
    how: "A model predicts acoustic representations from text and a vocoder converts them into an audio waveform.",
    example: "An assistant reads a maintenance instruction aloud while the technician works.",
    tags: ["speech synthesis", "voice", "audio"], related: ["asr", "audio-modality", "multimodal"]
  },
  {
    slug: "text-modality", acronym: "Text", name: "Text Modality", category: "multimodal",
    summary: "Written language represented as characters, tokens, documents or structured text.",
    why: "Text remains the primary interface for instructions, documentation, code and knowledge-intensive AI.",
    how: "Text is tokenized and encoded into numerical representations for language models and retrieval systems.",
    example: "A model processes requirements, emails, manuals and source code in one workflow.",
    tags: ["language", "documents", "tokens"], related: ["nlp", "tokenization", "llm"]
  },
  {
    slug: "image-modality", acronym: "Image", name: "Image Modality", category: "multimodal",
    summary: "Two-dimensional visual information represented as pixels, patches, regions or learned features.",
    why: "Images capture shape, appearance, spatial context and visual evidence that text may not contain.",
    how: "Vision encoders transform pixels or patches into feature representations used for classification, generation or reasoning.",
    example: "A model inspects a thermal image to identify an overheated rack component.",
    tags: ["pixels", "vision", "visual data"], related: ["cv", "cnn", "vlm"]
  },
  {
    slug: "audio-modality", acronym: "Audio", name: "Audio Modality", category: "multimodal",
    summary: "Sound represented as waveforms, frequency features, tokens or learned acoustic representations.",
    why: "Audio carries speech, environmental signals, machine acoustics and temporal patterns.",
    how: "Models process sampled waveforms or spectrogram-like features to recognize, classify or generate sound.",
    example: "An acoustic model detects an abnormal bearing noise before visible failure.",
    tags: ["sound", "waveform", "speech"], related: ["asr", "tts", "multimodal"]
  },
  {
    slug: "video-modality", acronym: "Video", name: "Video Modality", category: "multimodal",
    summary: "Time-ordered visual frames, often combined with audio, motion and event structure.",
    why: "Video contains temporal dynamics essential for activity recognition, robotics and world modeling.",
    how: "Models encode spatial information within frames and temporal relationships across frames.",
    example: "A video model learns the sequence of actions in an assembly procedure.",
    tags: ["temporal", "motion", "frames"], related: ["cv", "jepa", "multimodal"]
  },

  {
    slug: "evals", acronym: "Evals", name: "AI Evaluations", category: "safety",
    summary: "Systematic tests that measure model or application behavior against defined criteria.",
    why: "Evals turn quality, reliability and safety goals into observable evidence that can guide improvement.",
    how: "A dataset, task harness and grader produce repeatable metrics or judgments, often across several failure modes.",
    example: "An evaluation checks whether a RAG assistant cites the correct source and refuses unsupported conclusions.",
    tags: ["testing", "graders", "quality"], related: ["benchmark", "hallucination", "guardrails"]
  },
  {
    slug: "benchmark", acronym: "Benchmark", name: "AI Benchmark", category: "safety",
    summary: "A standardized task or suite used to compare systems under defined conditions.",
    why: "Benchmarks provide a common reference point, but their results may not predict performance in a specific deployment.",
    how: "Models are evaluated on the same datasets, prompts, metrics and scoring rules.",
    example: "Two models are compared on coding tasks, then separately tested on the company's real engineering workflow.",
    tags: ["comparison", "metrics", "test set"], related: ["evals", "latency", "alignment"]
  },
  {
    slug: "hallucination", acronym: "Hallucination", name: "Model Hallucination", category: "safety",
    summary: "A fluent output that is unsupported, fabricated or inconsistent with the available evidence.",
    why: "Hallucinations can create serious reliability problems when users interpret confident language as verified fact.",
    how: "They can arise from uncertain model predictions, missing context, conflicting data, weak retrieval or incentives that reward plausible completion.",
    example: "An assistant invents a maintenance interval that does not appear in the official manual.",
    tags: ["factuality", "unsupported claim", "error"], related: ["grounding", "rag", "evals"]
  },
  {
    slug: "alignment", acronym: "Alignment", name: "AI Alignment", category: "safety",
    summary: "The effort to make AI behavior consistent with intended goals, constraints and human values.",
    why: "A capable system is useful only when its objectives and actions remain compatible with the needs of users and society.",
    how: "Alignment uses data curation, instruction tuning, preference learning, oversight, constraints, evaluations and governance.",
    example: "A system prioritizes safety procedures over a user's request to bypass an approval step.",
    tags: ["objectives", "human preferences", "governance"], related: ["rlhf", "dpo", "guardrails"]
  },
  {
    slug: "interpretability", acronym: "Interpretability", name: "Model Interpretability", category: "safety",
    summary: "Methods for understanding how a model represents information or arrives at outputs.",
    why: "Interpretability can help diagnose failures, reveal shortcuts and support scientific or governance analysis.",
    how: "Techniques inspect activations, features, gradients, attention patterns, causal interventions or simplified surrogate models.",
    example: "An analysis tests which image regions most influenced a defect classification.",
    tags: ["explanation", "mechanistic analysis", "transparency"], related: ["evals", "alignment", "hallucination"]
  },
  {
    slug: "guardrails", acronym: "Guardrails", name: "AI Guardrails", category: "safety",
    summary: "Technical and procedural controls that constrain inputs, outputs, tools or actions.",
    why: "Guardrails reduce risk by enforcing boundaries that should not depend solely on model judgment.",
    how: "Controls can include validation, permissions, policy checks, filters, sandboxing, approval gates and audit logs.",
    example: "An agent may draft a supplier order but cannot submit it without human approval and budget validation.",
    tags: ["controls", "permissions", "policy"], related: ["alignment", "agent", "multi-agent"]
  }
];
