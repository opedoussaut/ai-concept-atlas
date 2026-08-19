/**
 * The Workshop — where to go and actually do this.
 *
 * WHY THIS SECTION IS BUILT DIFFERENTLY FROM EVERYTHING ELSE. The rest of the
 * atlas is chosen to outlast the moment: slugs are permanent URLs, `ssm` exists
 * rather than `mamba` because named frontier models date within a year, and all
 * 125 references are papers and DOIs precisely because a DOI is permanent. A
 * directory of tools is the opposite kind of content. Sites die, get acquired,
 * rebrand, or quietly stop being what they were. A dead link here costs more
 * than a missing one, because it makes a reader doubt the other 125.
 *
 * So this file is ORGANISED BY QUESTION, NOT BY TOOL. "Where do I compare
 * models on cost and latency?" stays valid for years; llm-stats.com is today's
 * answer to it. When an entry dies the question survives with a gap in it,
 * rather than the structure breaking. Same reasoning that produced `ssm`.
 *
 * THREE RULES that keep it honest:
 *
 *   1. `checked` is a real date and is shown to the reader. An entry that looks
 *      old should look old.
 *   2. No rankings, no scores, no "best of". Those need maintaining and go
 *      stale silently; a description of what a thing IS does not.
 *   3. `related` points back into the atlas. That is what makes this part of
 *      the atlas rather than a bookmark list — every entry is a door back to
 *      the concepts it exercises, and the validator fails on a slug that does
 *      not resolve.
 *
 * Every URL here was fetched and returned 200 on the date in `checked`.
 * `tools/validate.mjs --links` re-checks them and, unlike the paper references,
 * FAILS rather than warns: publishers block bots, tool sites generally do not,
 * so a non-200 here is real news.
 *
 * Deliberately ~38 entries, not 200. The hero map's rule applies: show fewer
 * things brightly. A long list reads as unfiltered.
 */
window.TOOL_CATEGORIES = [
  { id: "choose",   name: "Choose a model",   short: "Choose",   color: "#5de7ff" },
  { id: "run",      name: "Find and run one", short: "Run",      color: "#6ea8ff" },
  { id: "connect",  name: "Connect things",   short: "Connect",  color: "#b58cff" },
  { id: "build",    name: "Build with it",    short: "Build",    color: "#6ce6af" },
  { id: "evaluate", name: "Evaluate honestly", short: "Evaluate", color: "#ffc978" },
  { id: "follow",   name: "Follow the field", short: "Follow",   color: "#ff9e7d" }
];

window.ATLAS_TOOLS = [
  /* ---------------------------------------------------------------- */
  /* Choose a model                                                     */
  /* ---------------------------------------------------------------- */
  {
    id: "llm-stats",
    name: "LLM Stats",
    url: "https://llm-stats.com",
    category: "choose",
    what: "Independent rankings of several hundred models by capability, speed and price, drawn from public benchmarks and live API measurements.",
    answers: "Which model gives me the quality I need at a price I can afford?",
    related: ["llm", "latency", "throughput", "benchmark"],
    checked: "2026-08-17"
  },
  {
    id: "artificial-analysis",
    name: "Artificial Analysis",
    url: "https://artificialanalysis.ai",
    category: "choose",
    what: "Independently measured latency, throughput and cost per task across models and the providers serving them.",
    answers: "How fast is this model in practice, and does the provider I use change that?",
    related: ["latency", "throughput", "batching", "memory-bandwidth-bound"],
    checked: "2026-08-17"
  },
  {
    id: "lmarena",
    name: "LMArena",
    url: "https://lmarena.ai",
    category: "choose",
    what: "Blind head-to-head comparisons voted on by the public, aggregated into an Elo rating.",
    answers: "Which model do people actually prefer when they cannot see the label?",
    related: ["benchmark", "evals", "rlhf"],
    checked: "2026-08-17"
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    url: "https://openrouter.ai",
    category: "choose",
    what: "A single API in front of many providers, with per-model pricing and throughput published side by side.",
    answers: "Can I try several models without signing up to each vendor separately?",
    related: ["api", "llm", "latency"],
    checked: "2026-08-17"
  },
  {
    id: "open-llm-leaderboard",
    name: "Open LLM Leaderboard",
    url: "https://huggingface.co/spaces/open-llm-leaderboard/open_llm_leaderboard",
    category: "choose",
    what: "Open-weight models scored on a fixed public benchmark suite, run through the same harness for every entry.",
    answers: "How do the open models compare on a level playing field?",
    related: ["benchmark", "evals", "slm"],
    checked: "2026-08-17"
  },

  /* ---------------------------------------------------------------- */
  /* Find and run one                                                   */
  /* ---------------------------------------------------------------- */
  {
    id: "hugging-face",
    name: "Hugging Face",
    url: "https://huggingface.co",
    category: "run",
    what: "The main public repository of open model weights, datasets and demos, with the libraries that load them.",
    answers: "Where do I find the actual weights, and something to run them with?",
    related: ["llm", "slm", "embeddings", "fine-tuning"],
    checked: "2026-08-17"
  },
  {
    id: "ollama",
    name: "Ollama",
    url: "https://ollama.com",
    category: "run",
    what: "A command-line runner and local API server that pulls a quantized model and serves it in one step.",
    answers: "How do I run a model on my own machine without building anything?",
    related: ["quantization", "slm", "kv-cache"],
    checked: "2026-08-17"
  },
  {
    id: "lm-studio",
    name: "LM Studio",
    url: "https://lmstudio.ai",
    category: "run",
    what: "A desktop application for browsing, downloading and chatting with local models, with no terminal involved.",
    answers: "Can I try a local model without touching a command line?",
    related: ["quantization", "slm", "context-window"],
    checked: "2026-08-17"
  },
  {
    id: "llama-cpp",
    name: "llama.cpp",
    url: "https://github.com/ggml-org/llama.cpp",
    category: "run",
    what: "The C++ inference engine underneath most local runtimes, and the origin of the GGUF quantized format.",
    answers: "What is actually doing the work when a model runs on a laptop?",
    related: ["quantization", "floating-point", "kv-cache", "memory-bandwidth-bound"],
    checked: "2026-08-17"
  },
  {
    id: "vllm",
    name: "vLLM",
    url: "https://docs.vllm.ai",
    category: "run",
    what: "A serving engine built around paged attention and continuous batching, aimed at throughput under concurrent load.",
    answers: "How do I serve one model to many users at once without wasting memory?",
    related: ["batching", "kv-cache", "throughput", "prefill-and-decode"],
    checked: "2026-08-17"
  },
  {
    id: "sglang",
    name: "SGLang",
    url: "https://github.com/sgl-project/sglang",
    category: "run",
    what: "A serving runtime that caches shared prefixes across requests, so a repeated system prompt is processed once.",
    answers: "My requests all share a long preamble — can I stop paying for it every time?",
    related: ["kv-cache", "prefill-and-decode", "throughput", "context-window"],
    checked: "2026-08-17"
  },

  /* ---------------------------------------------------------------- */
  /* Connect things                                                     */
  /* ---------------------------------------------------------------- */
  {
    id: "mcp-site",
    name: "Model Context Protocol",
    url: "https://modelcontextprotocol.io",
    category: "connect",
    what: "The protocol's own documentation: what MCP is, how a client and server talk, and how to build either.",
    answers: "What is MCP, and what would I actually implement?",
    related: ["mcp", "tool-use", "api"],
    checked: "2026-08-17"
  },
  {
    id: "mcp-spec",
    name: "MCP specification",
    url: "https://github.com/modelcontextprotocol/modelcontextprotocol",
    category: "connect",
    what: "The normative specification and schema, versioned by date, with the reasoning behind each revision.",
    answers: "What exactly does the protocol require, and what changed in this version?",
    related: ["mcp", "api", "function-calling"],
    checked: "2026-08-17"
  },
  {
    id: "mcp-registry",
    name: "MCP Registry",
    url: "https://registry.modelcontextprotocol.io",
    category: "connect",
    what: "The official index of publicly available MCP servers — effectively a catalogue of what a model can be connected to.",
    answers: "Does a server already exist for the system I want to connect?",
    related: ["mcp", "tool-use", "agent"],
    checked: "2026-08-17"
  },
  {
    id: "mcp-claude-docs",
    name: "MCP in practice",
    url: "https://docs.claude.com/en/docs/mcp",
    category: "connect",
    what: "Vendor documentation for connecting MCP servers to a working assistant, including configuration and permissions.",
    answers: "How do I connect a server to something I actually use day to day?",
    related: ["mcp", "tool-use", "guardrails"],
    checked: "2026-08-17"
  },
  {
    id: "a2a-spec",
    name: "A2A Protocol Specification",
    url: "https://a2a-protocol.org/latest/specification/",
    category: "connect",
    what: "The Linux Foundation specification for agents built by different vendors to discover one another, exchange messages and coordinate a task.",
    answers: "How would an agent somebody else operates talk to mine?",
    related: ["mcp", "multi-agent", "agent"],
    checked: "2026-08-19"
  },
  {
    id: "tiktokenizer",
    name: "Tiktokenizer",
    url: "https://tiktokenizer.vercel.app",
    category: "connect",
    what: "Paste text and see exactly how a given model splits it into tokens, and how many.",
    answers: "Why does my prompt cost more than I expected?",
    related: ["tokenization", "bpe", "context-window"],
    checked: "2026-08-17"
  },

  /* ---------------------------------------------------------------- */
  /* Build with it                                                      */
  /* ---------------------------------------------------------------- */
  {
    id: "langchain",
    name: "LangChain",
    url: "https://github.com/langchain-ai/langchain",
    category: "build",
    what: "A framework for chaining model calls, tools and retrieval into an application, with adapters for most providers.",
    answers: "How do I wire a model to tools and data without writing every integration myself?",
    related: ["agent", "tool-use", "rag", "memory"],
    checked: "2026-08-17"
  },
  {
    id: "llamaindex",
    name: "LlamaIndex",
    url: "https://github.com/run-llama/llama_index",
    category: "build",
    what: "A toolkit focused on the retrieval half: ingesting documents, chunking them, indexing and querying.",
    answers: "How do I get my own documents in front of a model reliably?",
    related: ["rag", "embeddings", "vector-db", "semantic-search"],
    checked: "2026-08-17"
  },
  {
    id: "dspy",
    name: "DSPy",
    url: "https://github.com/stanfordnlp/dspy",
    category: "build",
    what: "Treats prompts as parameters to be optimised against a metric rather than strings to be hand-tuned.",
    answers: "Can I stop guessing at prompt wording and optimise it instead?",
    related: ["prompt-engineering", "evals", "cot"],
    checked: "2026-08-17"
  },
  {
    id: "peft",
    name: "PEFT",
    url: "https://github.com/huggingface/peft",
    category: "build",
    what: "The reference implementation of LoRA, QLoRA and related adapter methods, integrated with the Transformers library.",
    answers: "How do I actually fine-tune without a cluster?",
    related: ["peft", "lora", "qlora", "fine-tuning"],
    checked: "2026-08-17"
  },
  {
    id: "unsloth",
    name: "Unsloth",
    url: "https://github.com/unslothai/unsloth",
    category: "build",
    what: "Hand-written kernels that cut the memory and time a LoRA fine-tune needs, at the same numerical result.",
    answers: "Can I fine-tune a larger model on the GPU I have?",
    related: ["lora", "qlora", "quantization", "fine-tuning"],
    checked: "2026-08-17"
  },
  {
    id: "pgvector",
    name: "pgvector",
    url: "https://github.com/pgvector/pgvector",
    category: "build",
    what: "Vector similarity search as a Postgres extension, so embeddings live beside the rest of your data.",
    answers: "Do I need a separate database just to store embeddings?",
    related: ["vector-db", "embeddings", "nearest-neighbour-search", "cosine-similarity"],
    checked: "2026-08-17"
  },
  {
    id: "qdrant",
    name: "Qdrant",
    url: "https://qdrant.tech",
    category: "build",
    what: "A purpose-built vector database with filtering, payload storage and approximate nearest-neighbour indexing.",
    answers: "I have tens of millions of vectors and need filtered search over them.",
    related: ["vector-db", "nearest-neighbour-search", "semantic-search", "rag"],
    checked: "2026-08-17"
  },
  {
    id: "faiss",
    name: "FAISS",
    url: "https://github.com/facebookresearch/faiss",
    category: "build",
    what: "The similarity-search library most vector databases are built on or benchmarked against.",
    answers: "What is the index actually doing when it finds nearest neighbours?",
    related: ["nearest-neighbour-search", "embeddings", "vector-db"],
    checked: "2026-08-17"
  },

  /* ---------------------------------------------------------------- */
  /* Evaluate honestly                                                  */
  /* ---------------------------------------------------------------- */
  {
    id: "lm-eval-harness",
    name: "LM Evaluation Harness",
    url: "https://github.com/EleutherAI/lm-evaluation-harness",
    category: "evaluate",
    what: "The de facto standard harness for running academic benchmarks, and the backend behind several public leaderboards.",
    answers: "How do I score a model the same way everyone else claims to?",
    related: ["evals", "benchmark", "llm"],
    checked: "2026-08-17"
  },
  {
    id: "helm",
    name: "HELM",
    url: "https://crfm.stanford.edu/helm/",
    category: "evaluate",
    what: "Stanford's holistic evaluation: many scenarios and many metrics reported together rather than collapsed to one number.",
    answers: "What does this model do badly that a single headline score hides?",
    related: ["evals", "benchmark", "alignment"],
    checked: "2026-08-17"
  },
  {
    id: "opencompass",
    name: "OpenCompass",
    url: "https://github.com/open-compass/opencompass",
    category: "evaluate",
    what: "A broad evaluation platform with strong multilingual and Chinese-language benchmark coverage.",
    answers: "Does this model hold up outside English?",
    related: ["evals", "benchmark", "nlp"],
    checked: "2026-08-17"
  },
  {
    id: "inspect",
    name: "Inspect",
    url: "https://inspect.aisi.org.uk",
    category: "evaluate",
    what: "The UK AI Safety Institute's framework for writing evaluations, including agentic and multi-turn ones.",
    answers: "How do I evaluate behaviour rather than answers?",
    related: ["evals", "agent", "alignment", "guardrails"],
    checked: "2026-08-17"
  },
  {
    id: "ragas",
    name: "Ragas",
    url: "https://docs.ragas.io",
    category: "evaluate",
    what: "Metrics aimed at retrieval pipelines: whether the retrieved context was relevant and whether the answer stayed inside it.",
    answers: "Is my RAG system failing at retrieval or at generation?",
    related: ["rag", "grounding", "hallucination", "evals"],
    checked: "2026-08-17"
  },
  {
    id: "neuronpedia",
    name: "Neuronpedia",
    url: "https://neuronpedia.org",
    category: "evaluate",
    what: "An interactive browser for the internal features of open models, with the activating examples for each.",
    answers: "What is this model representing internally?",
    related: ["interpretability", "embeddings", "latent-space"],
    checked: "2026-08-17"
  },

  /* ---------------------------------------------------------------- */
  /* Follow the field                                                   */
  /* ---------------------------------------------------------------- */
  {
    id: "arxiv-cs-cl",
    name: "arXiv cs.CL",
    url: "https://arxiv.org/list/cs.CL/recent",
    category: "follow",
    what: "The computation-and-language preprint feed, where most language-model work appears before anywhere else.",
    answers: "Where does the research actually get published first?",
    related: ["nlp", "llm", "transformer"],
    checked: "2026-08-17"
  },
  {
    id: "hf-papers",
    name: "Hugging Face Papers",
    url: "https://huggingface.co/papers",
    category: "follow",
    what: "A daily shortlist of recent papers, filtered and discussed by practitioners rather than ranked by an algorithm.",
    answers: "What came out this week that is worth my time?",
    related: ["llm", "benchmark", "evals"],
    checked: "2026-08-17"
  },
  {
    id: "papers-with-code",
    name: "Papers with Code",
    url: "https://paperswithcode.com",
    category: "follow",
    what: "Papers paired with their implementations, and benchmark tables showing which result came from which method.",
    answers: "Is there working code for this result?",
    related: ["benchmark", "evals"],
    checked: "2026-08-17"
  },
  {
    id: "alignment-forum",
    name: "Alignment Forum",
    url: "https://www.alignmentforum.org",
    category: "follow",
    what: "Long-form technical discussion of alignment and interpretability, much of it ahead of formal publication.",
    answers: "What are alignment researchers arguing about right now?",
    related: ["alignment", "interpretability", "rlhf"],
    checked: "2026-08-17"
  },
  {
    id: "nist-ai-rmf",
    name: "NIST AI Risk Management Framework",
    url: "https://www.nist.gov/itl/ai-risk-management-framework",
    category: "follow",
    what: "A voluntary framework for identifying and managing AI risk, widely used as the vocabulary for internal governance.",
    answers: "How do I structure a risk assessment somebody else will recognise?",
    related: ["guardrails", "alignment", "evals"],
    checked: "2026-08-17"
  },
  {
    id: "eu-ai-act",
    name: "EU AI Act",
    url: "https://artificialintelligenceact.eu",
    category: "follow",
    what: "An annotated, navigable text of the regulation, with the obligations that attach to each risk tier.",
    answers: "Does what I am building fall under this, and what does that oblige?",
    related: ["guardrails", "alignment", "evals"],
    checked: "2026-08-17"
  },
  {
    id: "owasp-genai",
    name: "OWASP GenAI Security Project",
    url: "https://genai.owasp.org/",
    category: "follow",
    what: "The community-governed home of the Top 10 for LLM Applications, with agentic-security guidance, a red-teaming taxonomy and a maintained glossary alongside it.",
    answers: "Which security risks will I be asked about in writing, named the way everyone else names them?",
    related: ["prompt-injection", "guardrails", "hallucination", "agent"],
    checked: "2026-08-19"
  }
];
