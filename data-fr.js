/**
 * French overlay for the AI layer.
 *
 * An OVERLAY, not a translation of data.js. Only the fields that differ appear
 * here, keyed by the same permanent slug, so French can never disagree with
 * English about how many concepts exist, which domain one belongs to or which
 * concepts relate to which. There is exactly one structural record — data.js —
 * and this file changes what it says, never what it is.
 *
 * Any field left out falls back to English and is marked as such in the page.
 * That is deliberate: a partial translation must degrade honestly rather than
 * leave a hole. Today this file carries `name` and `summary` for all 87
 * concepts — everything visible on a card, in search and in the graph. The
 * four explanation layers (why / how / example) are still English.
 *
 * TERMINOLOGY. Established English terms stay in English, because that is how
 * French-speaking practitioners actually speak: embedding, fine-tuning, token,
 * prompt, transformer, softmax. What gets translated is ordinary prose. The
 * `acronym` field is never translated either, so the English token is always
 * visible on the card next to the French name — which is why a name here can be
 * fully French without the reader losing the term they will hear in a meeting.
 *
 * Adding a concept to data.js does not require adding it here; it will simply
 * read in English until someone does.
 */
window.AI_CONCEPTS_FR = {
  /* Foundations ------------------------------------------------------- */
  ai: {
    name: "Intelligence artificielle",
    summary: "Le champ général consistant à construire des systèmes qui accomplissent des tâches associées à l’intelligence humaine."
  },
  ml: {
    name: "Apprentissage automatique",
    summary: "Des méthodes qui apprennent des régularités à partir de données plutôt que de s’appuyer uniquement sur des règles programmées explicitement."
  },
  dl: {
    name: "Apprentissage profond",
    summary: "L’apprentissage automatique fondé sur des réseaux de neurones comportant de nombreuses couches de traitement."
  },
  nlp: {
    name: "Traitement automatique du langage naturel",
    summary: "Les techniques d’IA permettant de comprendre, de générer et de transformer le langage humain."
  },
  cv: {
    name: "Vision par ordinateur",
    summary: "Les méthodes d’IA permettant d’interpréter des images, des vidéos et d’autres signaux visuels."
  },
  rl: {
    name: "Apprentissage par renforcement",
    summary: "Un apprentissage par interaction, où un agent cherche les actions qui maximisent la récompense cumulée."
  },
  genai: {
    name: "IA générative",
    summary: "Des systèmes d’IA qui créent du contenu nouveau : texte, images, audio, vidéo, code ou designs."
  },
  "supervised-learning": {
    name: "Apprentissage supervisé",
    summary: "Un apprentissage à partir d’exemples associés à des étiquettes ou des sorties cibles connues."
  },
  "self-supervised-learning": {
    name: "Apprentissage auto-supervisé",
    summary: "L’apprentissage de représentations utiles en construisant les cibles d’entraînement à partir des données elles-mêmes."
  },
  "next-token-prediction": {
    name: "Prédiction du token suivant",
    summary: "L’objectif consistant à prédire le token suivant d’une séquence à partir de tout ce qui précède."
  },

  /* Model architectures ------------------------------------------------ */
  nn: {
    name: "Réseau de neurones",
    summary: "Un modèle paramétré construit à partir d’unités de calcul connectées et organisées en couches."
  },
  cnn: {
    name: "Réseau de neurones convolutif",
    summary: "Une architecture neuronale qui utilise des filtres appris pour détecter des motifs spatiaux locaux."
  },
  rnn: {
    name: "Réseau de neurones récurrent",
    summary: "Un réseau de neurones qui réutilise un état caché au fil du traitement d’une séquence."
  },
  lstm: {
    name: "Mémoire à long et court terme",
    summary: "Une architecture récurrente dotée de portes qui contrôlent ce qui est stocké, mis à jour et oublié."
  },
  transformer: {
    name: "Architecture Transformer",
    summary: "Une architecture de séquence centrée sur l’attention plutôt que sur la récurrence."
  },
  attention: {
    name: "Mécanisme d’attention",
    summary: "Un mécanisme qui permet à chaque position d’une séquence de pondérer la pertinence de toutes les autres."
  },
  "activation-function": {
    name: "Fonction d’activation",
    summary: "Une petite fonction non linéaire appliquée à chaque valeur d’une couche, sans laquelle un réseau profond s’effondrerait en un unique réseau linéaire."
  },
  "layer-normalization": {
    name: "Normalisation de couche",
    summary: "Le réajustement du vecteur de chaque token selon ses propres statistiques, pour que les activations restent dans une plage exploitable quelle que soit la profondeur de la pile."
  },
  "residual-connection": {
    name: "Connexion résiduelle",
    summary: "L’ajout de l’entrée d’une couche à sa sortie, si bien que chaque couche apprend une correction plutôt qu’une représentation entièrement nouvelle."
  },
  "positional-encoding": {
    name: "Encodage positionnel",
    summary: "Le signal qui indique au transformer où se situe chaque token, l’attention seule traitant une séquence comme un ensemble non ordonné."
  },
  "linear-attention": {
    name: "Mécanisme d’attention linéaire",
    summary: "Une famille de variantes de l’attention qui abandonnent le softmax : le coût croît linéairement avec la longueur de séquence au lieu de quadratiquement, au prix du rappel exact."
  },
  ssm: {
    name: "Modèle à espace d’états",
    summary: "Une architecture de séquence qui propage un état de taille fixe par une récurrence linéaire, offrant un coût et une mémoire constants par token."
  },
  mla: {
    name: "Attention latente multi-têtes",
    summary: "Une variante de l’attention qui met en cache un petit vecteur compressé par token au lieu des clés et valeurs complètes, en les reconstruisant implicitement au moment de l’attention."
  },
  llm: {
    name: "Grand modèle de langage",
    summary: "Un modèle de grande capacité entraîné sur de vastes corpus textuels ou multimodaux pour traiter et générer du langage."
  },
  slm: {
    name: "Petit modèle de langage",
    summary: "Un modèle de langage conçu avec moins de paramètres et des besoins en calcul ou en mémoire inférieurs à ceux des LLM de pointe."
  },
  vlm: {
    name: "Modèle vision-langage",
    summary: "Un modèle qui traite conjointement l’information visuelle et le langage naturel."
  },
  moe: {
    name: "Mélange d’experts",
    summary: "Une architecture qui achemine chaque entrée vers un sous-ensemble de blocs de paramètres spécialisés appelés experts."
  },
  gan: {
    name: "Réseau antagoniste génératif",
    summary: "Un cadre génératif où un générateur et un discriminateur progressent par entraînement antagoniste."
  },
  vae: {
    name: "Auto-encodeur variationnel",
    summary: "Un auto-encodeur probabiliste qui apprend une distribution latente structurée, utile pour la génération et l’apprentissage de représentations."
  },
  diffusion: {
    name: "Modèle de diffusion",
    summary: "Un modèle génératif qui apprend à inverser un processus de bruitage progressif."
  },
  jepa: {
    name: "Architecture prédictive à plongement conjoint",
    summary: "Une architecture prédictive qui apprend en anticipant des représentations plutôt qu’en reconstruisant chaque détail de l’entrée."
  },
  "world-model": {
    name: "Modèle du monde",
    summary: "Un modèle interne appris de l’évolution d’un environnement, utilisé pour prédire ce qui va se passer ensuite."
  },

  /* Training & adaptation ---------------------------------------------- */
  pretraining: {
    name: "Pré-entraînement",
    summary: "La phase d’entraînement initiale à grande échelle, qui apprend des régularités larges et réutilisables avant toute adaptation à une tâche."
  },
  "fine-tuning": {
    name: "Fine-tuning",
    summary: "Un entraînement supplémentaire qui adapte un modèle pré-entraîné à une tâche, un domaine, un style ou un comportement."
  },
  sft: {
    name: "Fine-tuning supervisé",
    summary: "Un fine-tuning sur des exemples entrée-sortie sélectionnés qui démontrent le comportement attendu."
  },
  peft: {
    name: "Fine-tuning économe en paramètres",
    summary: "Une famille de méthodes d’adaptation qui n’entraînent qu’une petite fraction des paramètres d’un modèle."
  },
  lora: {
    name: "Adaptation de rang faible",
    summary: "Une méthode PEFT qui apprend des mises à jour de poids de rang faible tout en gardant gelés les poids du modèle d’origine."
  },
  qlora: {
    name: "Adaptation de rang faible quantifiée",
    summary: "Une méthode de fine-tuning qui associe un modèle de base gelé et quantifié à des adaptateurs LoRA entraînables."
  },
  "contrastive-learning": {
    name: "Apprentissage contrastif",
    summary: "Entraîner un modèle à rapprocher les paires correspondantes dans l’espace de représentation et à en éloigner tout le reste."
  },
  rlhf: {
    name: "Apprentissage par renforcement à partir de retours humains",
    summary: "Une famille de méthodes qui utilisent les préférences humaines pour façonner le comportement d’un modèle, via un modèle de récompense et l’apprentissage par renforcement."
  },
  dpo: {
    name: "Optimisation directe des préférences",
    summary: "Une méthode d’apprentissage par préférences qui optimise directement un modèle de langage à partir de réponses préférées et rejetées."
  },
  ppo: {
    name: "Optimisation de politique proximale",
    summary: "Un algorithme d’apprentissage par renforcement qui contraint les mises à jour de la politique afin de stabiliser l’entraînement."
  },
  distillation: {
    name: "Distillation de connaissances",
    summary: "Entraîner un petit modèle élève à reproduire le comportement utile d’un grand modèle enseignant."
  },

  /* Retrieval & knowledge ---------------------------------------------- */
  rag: {
    name: "Génération augmentée par recherche",
    summary: "Un schéma qui va chercher de l’information externe et la fournit à un modèle génératif au moment de la requête."
  },
  graphrag: {
    name: "Génération augmentée par recherche sur graphe",
    summary: "Le RAG enrichi d’entités, de relations, de communautés ou de résumés structurés en graphe."
  },
  embeddings: {
    name: "Embeddings vectoriels",
    summary: "Des représentations numériques denses qui placent les éléments sémantiquement proches les uns près des autres dans un espace vectoriel."
  },
  "vector-db": {
    name: "Base de données vectorielle",
    summary: "Un système de données optimisé pour stocker des embeddings et rechercher les vecteurs voisins."
  },
  "knowledge-graph": {
    name: "Graphe de connaissances",
    summary: "Une représentation structurée d’entités, de concepts et de relations explicites."
  },
  "semantic-search": {
    name: "Recherche sémantique",
    summary: "Une recherche fondée sur le sens et l’intention plutôt que sur la seule correspondance exacte de mots-clés."
  },
  grounding: {
    name: "Ancrage factuel",
    summary: "Le rattachement de la sortie d’un modèle à des preuves, des données, des outils ou un environnement externe déterminés."
  },

  /* Agents & orchestration --------------------------------------------- */
  "prompt-engineering": {
    name: "Ingénierie de prompts",
    summary: "La conception d’instructions et de contexte pour qu’un modèle accomplisse une tâche de façon fiable."
  },
  cot: {
    name: "Chaîne de pensée",
    summary: "Les étapes de raisonnement intermédiaires qu’un modèle ou un système de raisonnement suit pour parvenir à une réponse."
  },
  "function-calling": {
    name: "Appel de fonctions",
    summary: "Un mécanisme structuré permettant à un modèle de choisir une fonction et d’en produire les arguments validés."
  },
  "tool-use": {
    name: "Utilisation d’outils",
    summary: "La capacité d’un système d’IA à invoquer des ressources externes : recherche, exécution de code, bases de données ou applications métier."
  },
  agent: {
    name: "Agent d’IA",
    summary: "Un système d’IA orienté vers un but, capable de planifier, d’utiliser des outils, d’observer les résultats et de poursuivre sur plusieurs étapes."
  },
  "multi-agent": {
    name: "Système multi-agents",
    summary: "Un système dans lequel plusieurs agents coopèrent, se coordonnent ou se spécialisent autour d’un objectif commun."
  },
  mcp: {
    name: "Model Context Protocol",
    summary: "Un protocole ouvert qui connecte les applications d’IA à des outils, des ressources et des prompts réutilisables via une interface standard."
  },
  api: {
    name: "Interface de programmation applicative",
    summary: "Une interface définie par laquelle des systèmes logiciels se demandent mutuellement des données ou des opérations."
  },
  "context-window": {
    name: "Fenêtre de contexte",
    summary: "La quantité d’information tokenisée qu’un modèle peut traiter dans une requête ou une séquence active."
  },
  memory: {
    name: "Mémoire d’agent",
    summary: "Les mécanismes qui conservent l’information utile d’une étape, d’une session ou d’une tâche à l’autre, au-delà du prompt immédiat."
  },

  /* Inference & optimization ------------------------------------------- */
  tokenization: {
    name: "Tokenisation",
    summary: "La conversion d’un texte ou d’autres entrées en unités discrètes qu’un modèle peut traiter."
  },
  bpe: {
    name: "Codage par paires d’octets",
    summary: "Une méthode de tokenisation en sous-mots qui fusionne itérativement les paires de symboles adjacents les plus fréquentes."
  },
  "kv-cache": {
    name: "Cache clés-valeurs",
    summary: "Les clés et valeurs d’attention conservées pour les tokens déjà traités lors d’une génération autorégressive."
  },
  "prefill-and-decode": {
    name: "Phases de prefill et de decode",
    summary: "Les deux phases de la génération — lire le prompt d’un seul coup, puis produire les tokens un par un — dont les comportements diffèrent au point d’en faire deux charges de travail distinctes."
  },
  "memory-bandwidth-bound": {
    name: "Limité par la bande passante mémoire",
    summary: "La situation où un calcul attend le déplacement des données plutôt que l’arithmétique — l’état réel de la plupart des inférences de modèles de langage."
  },
  "flash-attention": {
    name: "Attention exacte optimisée pour les entrées-sorties",
    summary: "Une implémentation de l’attention ordinaire qui n’écrit jamais la matrice de scores complète en mémoire : bien plus rapide, pour un résultat exactement identique."
  },
  gqa: {
    name: "Attention à requêtes groupées",
    summary: "Une variante de l’attention où plusieurs têtes de requête partagent un même jeu de clés et de valeurs, réduisant le cache KV avec une perte de qualité minime."
  },
  "speculative-decoding": {
    name: "Décodage spéculatif",
    summary: "Ébaucher plusieurs tokens avec un petit modèle rapide et les faire vérifier tous en une passe par le grand modèle, qui conserve ceux qu’il valide."
  },
  quantization: {
    name: "Quantification de modèle",
    summary: "La représentation des poids ou des activations d’un modèle avec une précision numérique réduite."
  },
  pruning: {
    name: "Élagage de modèle",
    summary: "La suppression des poids, connexions, canaux ou composants d’un modèle jugés les moins importants."
  },
  batching: {
    name: "Traitement par lots à l’inférence",
    summary: "Le traitement simultané de plusieurs entrées afin d’exploiter plus efficacement les ressources de calcul."
  },
  latency: {
    name: "Latence d’inférence",
    summary: "Le temps écoulé entre une requête et une étape significative de la réponse."
  },
  throughput: {
    name: "Débit d’inférence",
    summary: "La quantité de travail d’inférence accomplie par unité de temps, souvent mesurée en requêtes ou en tokens par seconde."
  },

  /* Multimodal AI ------------------------------------------------------ */
  multimodal: {
    name: "Intelligence artificielle multimodale",
    summary: "Une IA qui traite ou génère plusieurs modalités : texte, images, audio, vidéo ou données de capteurs."
  },
  ocr: {
    name: "Reconnaissance optique de caractères",
    summary: "La technologie qui détecte le texte présent dans des images ou des documents numérisés et le convertit en caractères lisibles par une machine."
  },
  asr: {
    name: "Reconnaissance automatique de la parole",
    summary: "La conversion d’un audio parlé en texte ou en unités linguistiques structurées."
  },
  tts: {
    name: "Synthèse vocale",
    summary: "La génération d’un audio parlé à partir d’un texte écrit."
  },
  "text-modality": {
    name: "Modalité texte",
    summary: "Le langage écrit représenté sous forme de caractères, de tokens, de documents ou de texte structuré."
  },
  "image-modality": {
    name: "Modalité image",
    summary: "L’information visuelle bidimensionnelle représentée par des pixels, des patches, des régions ou des caractéristiques apprises."
  },
  "audio-modality": {
    name: "Modalité audio",
    summary: "Le son représenté sous forme de formes d’onde, de caractéristiques fréquentielles, de tokens ou de représentations acoustiques apprises."
  },
  "video-modality": {
    name: "Modalité vidéo",
    summary: "Des images visuelles ordonnées dans le temps, souvent combinées à l’audio, au mouvement et à une structure d’événements."
  },

  /* Evaluation, safety & reliability ------------------------------------ */
  evals: {
    name: "Évaluations d’IA",
    summary: "Des tests systématiques qui mesurent le comportement d’un modèle ou d’une application au regard de critères définis."
  },
  benchmark: {
    name: "Banc d’essai standardisé",
    summary: "Une tâche ou une suite normalisée servant à comparer des systèmes dans des conditions définies."
  },
  hallucination: {
    name: "Hallucination de modèle",
    summary: "Une sortie fluide mais non étayée, inventée ou incohérente avec les preuves disponibles."
  },
  alignment: {
    name: "Alignement de l’IA",
    summary: "L’effort visant à rendre le comportement d’une IA conforme aux objectifs, aux contraintes et aux valeurs humaines visés."
  },
  interpretability: {
    name: "Interprétabilité des modèles",
    summary: "Les méthodes permettant de comprendre comment un modèle représente l’information ou parvient à ses sorties."
  },
  guardrails: {
    name: "Garde-fous de l’IA",
    summary: "Les contrôles techniques et procéduraux qui encadrent les entrées, les sorties, les outils ou les actions."
  }
};

/** The eight domains. `short` is what fits on a filter chip, so it stays terse. */
window.AI_CATEGORIES_FR = {
  foundations: { name: "Fondements", short: "Fondements" },
  architectures: { name: "Architectures de modèles", short: "Architectures" },
  training: { name: "Entraînement et adaptation", short: "Entraînement" },
  retrieval: { name: "Recherche et connaissance", short: "Connaissance" },
  agents: { name: "Agents et orchestration", short: "Agents" },
  inference: { name: "Inférence et optimisation", short: "Inférence" },
  multimodal: { name: "IA multimodale", short: "Multimodal" },
  safety: { name: "Évaluation, sûreté et fiabilité", short: "Sûreté" }
};
