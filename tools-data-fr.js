/**
 * French overlay for the Workshop.
 *
 * Same contract as the other overlays: keyed by the entry's permanent id,
 * holding only the fields that differ. `name` and `url` are never translated —
 * Hugging Face is Hugging Face, and a URL has one form. What is translated is
 * `what` (the description) and `answers` (the question the entry addresses).
 *
 * Product names inside the prose stay as they are: LoRA, MCP, GGUF, Postgres.
 * The atlas's rule throughout is that established practitioner vocabulary is
 * left alone, and a tool's own name is the strongest case of that.
 */
window.ATLAS_TOOLS_FR = {
  /* Choisir un modèle ------------------------------------------------- */
  "llm-stats": {
    what: "Un classement indépendant de plusieurs centaines de modèles selon la capacité, la vitesse et le prix, à partir de benchmarks publics et de mesures d’API en direct.",
    answers: "Quel modèle m’offre la qualité dont j’ai besoin à un prix que je peux payer ?"
  },
  "artificial-analysis": {
    what: "Des mesures indépendantes de latence, de débit et de coût par tâche, à travers les modèles et les fournisseurs qui les servent.",
    answers: "Ce modèle est-il rapide en pratique, et le fournisseur que j’utilise change-t-il la donne ?"
  },
  lmarena: {
    what: "Des duels à l’aveugle soumis au vote du public, agrégés en un classement Elo.",
    answers: "Quel modèle les gens préfèrent-ils réellement quand ils n’en voient pas l’étiquette ?"
  },
  openrouter: {
    what: "Une API unique devant de nombreux fournisseurs, avec le prix et le débit de chaque modèle publiés côte à côte.",
    answers: "Puis-je essayer plusieurs modèles sans m’inscrire séparément chez chaque éditeur ?"
  },
  "open-llm-leaderboard": {
    what: "Des modèles à poids ouverts évalués sur une suite de benchmarks publique et figée, passés par le même harnais pour chaque entrée.",
    answers: "Comment les modèles ouverts se comparent-ils à armes égales ?"
  },

  /* Trouver et exécuter ----------------------------------------------- */
  "hugging-face": {
    what: "Le principal dépôt public de poids de modèles, de jeux de données et de démonstrations, avec les bibliothèques qui les chargent.",
    answers: "Où trouver les poids eux-mêmes, et de quoi les exécuter ?"
  },
  ollama: {
    what: "Un lanceur en ligne de commande et un serveur d’API local qui récupère un modèle quantifié et le sert en une seule étape.",
    answers: "Comment exécuter un modèle sur ma machine sans rien avoir à construire ?"
  },
  "lm-studio": {
    what: "Une application de bureau pour parcourir, télécharger et dialoguer avec des modèles locaux, sans passer par un terminal.",
    answers: "Puis-je essayer un modèle local sans toucher à la ligne de commande ?"
  },
  "llama-cpp": {
    what: "Le moteur d’inférence en C++ qui se trouve sous la plupart des exécutions locales, et l’origine du format quantifié GGUF.",
    answers: "Qu’est-ce qui fait réellement le travail quand un modèle tourne sur un portable ?"
  },
  vllm: {
    what: "Un moteur de service bâti autour de l’attention paginée et du traitement par lots continu, orienté débit sous charge concurrente.",
    answers: "Comment servir un modèle à de nombreux utilisateurs à la fois sans gaspiller la mémoire ?"
  },
  sglang: {
    what: "Un moteur de service qui met en cache les préfixes partagés entre requêtes, si bien qu’un prompt système répété n’est traité qu’une fois.",
    answers: "Mes requêtes partagent toutes un long préambule — puis-je cesser de le payer à chaque fois ?"
  },

  /* Relier les choses -------------------------------------------------- */
  "mcp-site": {
    what: "La documentation du protocole lui-même : ce qu’est MCP, comment un client et un serveur dialoguent, et comment construire l’un ou l’autre.",
    answers: "Qu’est-ce que MCP, et qu’aurais-je concrètement à implémenter ?"
  },
  "mcp-spec": {
    what: "La spécification normative et son schéma, versionnés par date, avec le raisonnement derrière chaque révision.",
    answers: "Qu’exige exactement le protocole, et qu’est-ce qui a changé dans cette version ?"
  },
  "mcp-registry": {
    what: "L’index officiel des serveurs MCP publics — en pratique, le catalogue de ce à quoi un modèle peut être relié.",
    answers: "Un serveur existe-t-il déjà pour le système que je veux connecter ?"
  },
  "mcp-claude-docs": {
    what: "La documentation éditeur pour relier des serveurs MCP à un assistant qui fonctionne, configuration et permissions comprises.",
    answers: "Comment relier un serveur à quelque chose que j’utilise vraiment au quotidien ?"
  },
  "a2a-spec": {
    what: "La spécification de la Linux Foundation permettant à des agents construits par des éditeurs différents de se découvrir, d’échanger des messages et de coordonner une tâche.",
    answers: "Comment un agent exploité par quelqu’un d’autre parlerait-il au mien ?"
  },
  tiktokenizer: {
    what: "Collez un texte et voyez exactement comment un modèle donné le découpe en tokens, et combien.",
    answers: "Pourquoi mon prompt coûte-t-il plus cher que prévu ?"
  },

  /* Construire --------------------------------------------------------- */
  langchain: {
    what: "Un cadre pour enchaîner appels de modèles, outils et recherche d’information dans une application, avec des adaptateurs pour la plupart des fournisseurs.",
    answers: "Comment relier un modèle à des outils et des données sans écrire moi-même chaque intégration ?"
  },
  llamaindex: {
    what: "Une boîte à outils centrée sur la moitié recherche : ingérer des documents, les découper, les indexer et les interroger.",
    answers: "Comment mettre mes propres documents devant un modèle de façon fiable ?"
  },
  dspy: {
    what: "Traite les prompts comme des paramètres à optimiser contre une métrique plutôt que comme des chaînes à ajuster à la main.",
    answers: "Puis-je cesser de deviner la formulation d’un prompt et l’optimiser à la place ?"
  },
  peft: {
    what: "L’implémentation de référence de LoRA, QLoRA et des méthodes d’adaptateurs voisines, intégrée à la bibliothèque Transformers.",
    answers: "Comment faire concrètement du fine-tuning sans grappe de calcul ?"
  },
  unsloth: {
    what: "Des noyaux écrits à la main qui réduisent la mémoire et le temps nécessaires à un fine-tuning LoRA, à résultat numérique identique.",
    answers: "Puis-je affiner un modèle plus grand sur le GPU dont je dispose ?"
  },
  pgvector: {
    what: "La recherche par similarité vectorielle comme extension Postgres, si bien que les embeddings vivent à côté du reste de vos données.",
    answers: "Ai-je besoin d’une base séparée rien que pour stocker des embeddings ?"
  },
  qdrant: {
    what: "Une base vectorielle dédiée, avec filtrage, stockage de charge utile et indexation par plus proches voisins approchés.",
    answers: "J’ai des dizaines de millions de vecteurs et il me faut une recherche filtrée dessus."
  },
  faiss: {
    what: "La bibliothèque de recherche par similarité sur laquelle la plupart des bases vectorielles sont bâties, ou à laquelle elles se comparent.",
    answers: "Que fait réellement l’index quand il trouve les plus proches voisins ?"
  },

  /* Évaluer honnêtement ------------------------------------------------ */
  "lm-eval-harness": {
    what: "Le harnais devenu standard de fait pour exécuter les benchmarks académiques, et le moteur derrière plusieurs classements publics.",
    answers: "Comment évaluer un modèle de la même façon que tout le monde prétend le faire ?"
  },
  helm: {
    what: "L’évaluation holistique de Stanford : de nombreux scénarios et de nombreuses métriques rapportés ensemble plutôt que réduits à un seul chiffre.",
    answers: "Que fait mal ce modèle, que masque un score global unique ?"
  },
  opencompass: {
    what: "Une plateforme d’évaluation large, avec une couverture solide en multilingue et en chinois.",
    answers: "Ce modèle tient-il la route hors de l’anglais ?"
  },
  inspect: {
    what: "Le cadre du UK AI Safety Institute pour écrire des évaluations, y compris agentiques et multi-tours.",
    answers: "Comment évaluer un comportement plutôt que des réponses ?"
  },
  ragas: {
    what: "Des métriques dédiées aux chaînes de recherche : le contexte retrouvé était-il pertinent, et la réponse est-elle restée dedans.",
    answers: "Mon système RAG échoue-t-il à la recherche ou à la génération ?"
  },
  neuronpedia: {
    what: "Un explorateur interactif des caractéristiques internes de modèles ouverts, avec les exemples qui activent chacune.",
    answers: "Que représente ce modèle en interne ?"
  },

  /* Suivre le domaine --------------------------------------------------- */
  "arxiv-cs-cl": {
    what: "Le flux de prépublications en calcul et langage, où paraît d’abord l’essentiel des travaux sur les modèles de langage.",
    answers: "Où la recherche est-elle réellement publiée en premier ?"
  },
  "hf-papers": {
    what: "Une sélection quotidienne d’articles récents, filtrée et commentée par des praticiens plutôt que classée par un algorithme.",
    answers: "Qu’est-il sorti cette semaine qui mérite mon temps ?"
  },
  "papers-with-code": {
    what: "Des articles associés à leur implémentation, et des tableaux de benchmarks montrant quel résultat vient de quelle méthode.",
    answers: "Existe-t-il du code qui fonctionne pour ce résultat ?"
  },
  "alignment-forum": {
    what: "Des discussions techniques de fond sur l’alignement et l’interprétabilité, souvent en amont de toute publication formelle.",
    answers: "De quoi les chercheurs en alignement débattent-ils en ce moment ?"
  },
  "nist-ai-rmf": {
    what: "Un cadre volontaire d’identification et de gestion du risque en IA, largement utilisé comme vocabulaire de gouvernance interne.",
    answers: "Comment structurer une analyse de risque que d’autres reconnaîtront ?"
  },
  "eu-ai-act": {
    what: "Un texte annoté et navigable du règlement, avec les obligations attachées à chaque niveau de risque.",
    answers: "Ce que je construis relève-t-il de ce texte, et à quoi cela m’oblige-t-il ?"
  },
  "owasp-genai": {
    what: "Le foyer communautaire du Top 10 pour les applications LLM, accompagné de recommandations sur la sécurité des agents, d’une taxonomie de red teaming et d’un glossaire tenu à jour.",
    answers: "Quels risques de sécurité me demandera-t-on par écrit, nommés comme tout le monde les nomme ?"
  }
};

/** The six questions the workshop is organised around. */
window.TOOL_CATEGORIES_FR = {
  choose:   { name: "Choisir un modèle",     short: "Choisir" },
  run:      { name: "Trouver et exécuter",   short: "Exécuter" },
  connect:  { name: "Relier les choses",     short: "Relier" },
  build:    { name: "Construire avec",       short: "Construire" },
  evaluate: { name: "Évaluer honnêtement",   short: "Évaluer" },
  follow:   { name: "Suivre le domaine",     short: "Suivre" }
};
