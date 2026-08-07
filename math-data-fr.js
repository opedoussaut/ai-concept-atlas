/**
 * French overlay for the mathematics layer.
 *
 * Same contract as data-fr.js: an overlay keyed by permanent slug, never a
 * parallel copy. `symbol` is never translated — ∇ and σ and rank(A) are the
 * same in every language, and the symbol chip sitting next to the French name
 * is what lets a reader match a page here to the notation in an English paper.
 *
 * Carries `name` and `summary` for all 38 concepts. `intuition`, `equationNote`,
 * `worked` and `whyInAI` are still English and are marked as such on the page.
 *
 * TERMINOLOGY. French mathematical vocabulary is settled and standard, so
 * unlike the AI layer this one translates properly: dot product is "produit
 * scalaire", not "dot product". The exceptions are names that are proper nouns
 * (Kullback–Leibler, Adam) and softmax, which has no French equivalent in use.
 */
window.MATH_CONCEPTS_FR = {
  /* Linear algebra & geometry ------------------------------------------ */
  vectors: {
    name: "Vecteurs",
    summary: "Une liste ordonnée de nombres représentant un point, une direction ou un ensemble de mesures."
  },
  matrices: {
    name: "Matrices",
    summary: "Un tableau rectangulaire de nombres qui stocke un ensemble de valeurs ou décrit une transformation linéaire."
  },
  "matrix-multiplication": {
    name: "Multiplication matricielle",
    summary: "La combinaison de deux matrices telle que chaque coefficient du résultat soit le produit scalaire d’une ligne et d’une colonne."
  },
  "dot-product": {
    name: "Produit scalaire",
    summary: "Multiplier deux vecteurs terme à terme et sommer les résultats, ce qui donne un seul nombre mesurant leur accord."
  },
  "outer-product": {
    name: "Produit extérieur",
    summary: "Multiplier un vecteur colonne par un vecteur ligne pour produire une matrice entière, chaque coefficient étant le produit d’une paire de nombres."
  },
  "vector-norms": {
    name: "Normes vectorielles",
    summary: "Une mesure de la longueur ou de la magnitude d’un vecteur."
  },
  "cosine-similarity": {
    name: "Similarité cosinus",
    summary: "Le produit scalaire de deux vecteurs divisé par leurs longueurs, donnant un score de similarité entre −1 et 1 qui ignore la magnitude."
  },
  "vector-spaces": {
    name: "Espaces vectoriels",
    summary: "Un ensemble de vecteurs stable par addition et par multiplication scalaire, offrant une géométrie cohérente où directions et distances ont un sens."
  },
  "matrix-rank": {
    name: "Rang d’une matrice",
    summary: "Le nombre de directions réellement indépendantes que contient une matrice — la quantité d’information unique qu’elle porte."
  },
  "low-rank-factorization": {
    name: "Factorisation de rang faible",
    summary: "Approcher une grande matrice par le produit de deux matrices bien plus fines, réduisant le nombre de paramètres sans changer la forme de la sortie."
  },
  "basis-projection": {
    name: "Base et projection",
    summary: "Choisir un ensemble de directions de référence, puis y projeter un vecteur pour en lire les composantes."
  },
  eigenvalues: {
    name: "Valeurs propres et vecteurs propres",
    summary: "Les directions qu’une matrice laisse inchangées en orientation, et les facteurs par lesquels elle les étire."
  },
  "singular-value-decomposition": {
    name: "Décomposition en valeurs singulières",
    summary: "Factoriser n’importe quelle matrice en une rotation, un ensemble d’étirements et une seconde rotation — et en lire directement le rang."
  },
  "latent-space": {
    name: "Espaces latents",
    summary: "Un système de coordonnées appris et compressé, où la position encode le sens plutôt que l’apparence brute."
  },

  /* Probability & statistics -------------------------------------------- */
  "probability-distributions": {
    name: "Distributions de probabilité",
    summary: "Une répartition de vraisemblance sur l’ensemble des issues possibles, dont la somme vaut un."
  },
  "conditional-probability": {
    name: "Probabilité conditionnelle",
    summary: "La probabilité d’un événement sachant qu’un autre s’est déjà produit."
  },
  logits: {
    name: "Logits",
    summary: "Les scores bruts et non normalisés que produit un modèle avant leur conversion en probabilités."
  },
  softmax: {
    name: "Softmax",
    summary: "Une fonction qui transforme n’importe quelle liste de scores en une distribution de probabilité de somme égale à un."
  },
  sampling: {
    name: "Échantillonnage",
    summary: "Tirer des issues concrètes dans une distribution de probabilité, et estimer des grandeurs à partir de ces tirages."
  },
  "maximum-likelihood": {
    name: "Estimation par maximum de vraisemblance",
    summary: "Choisir les paramètres qui rendent les données observées aussi probables que possible."
  },

  /* Information theory --------------------------------------------------- */
  entropy: {
    name: "Entropie",
    summary: "Une mesure de l’incertitude d’une distribution — la surprise moyenne d’une issue qui en est tirée."
  },
  "cross-entropy": {
    name: "Entropie croisée",
    summary: "La surprise moyenne des issues réelles évaluées sous la distribution prédite par le modèle — la fonction de perte standard à l’entraînement."
  },
  "kl-divergence": {
    name: "Divergence de Kullback–Leibler",
    summary: "Une mesure de l’écart entre deux distributions de probabilité, exprimée en surprise supplémentaire."
  },

  /* Calculus & optimization ---------------------------------------------- */
  gradients: {
    name: "Gradients",
    summary: "Le vecteur des dérivées partielles, pointant dans la direction de plus forte croissance d’une fonction."
  },
  "gradient-descent": {
    name: "Descente de gradient",
    summary: "Déplacer répétitivement les paramètres dans la direction qui réduit le plus la perte."
  },
  backpropagation: {
    name: "Rétropropagation",
    summary: "Appliquer la règle de dérivation en chaîne à rebours dans un réseau pour obtenir en une seule passe le gradient de la perte pour chaque paramètre."
  },
  "loss-functions": {
    name: "Fonctions de perte",
    summary: "Un nombre unique mesurant à quel point la sortie d’un modèle est fausse, et qui définit ce que l’entraînement optimise réellement."
  },
  adam: {
    name: "Optimisation Adam",
    summary: "Une variante de la descente de gradient qui donne à chaque paramètre son propre pas adaptatif, calculé à partir de l’historique de ses gradients."
  },
  regularization: {
    name: "Régularisation",
    summary: "Ajouter une pénalité ou une contrainte qui dissuade un modèle d’épouser trop exactement ses données d’entraînement."
  },

  /* Numerical mathematics ------------------------------------------------ */
  "floating-point": {
    name: "Précision en virgule flottante",
    summary: "La manière dont les ordinateurs représentent les nombres réels avec un nombre fini de bits, arbitrant entre étendue et exactitude."
  },
  "rounding-error": {
    name: "Erreur d’arrondi et d’approximation",
    summary: "L’écart introduit chaque fois qu’une valeur est ramenée au nombre représentable le plus proche."
  },
  "numerical-stability": {
    name: "Stabilité numérique",
    summary: "Le fait que de petites erreurs de représentation restent petites en traversant un calcul, ou qu’elles y soient amplifiées jusqu’à l’absurde."
  },

  /* Graphs & discrete mathematics ---------------------------------------- */
  "graph-theory": {
    name: "Théorie des graphes",
    summary: "L’étude des objets et des liens qui les unissent, sous forme de nœuds reliés par des arêtes."
  },
  "nearest-neighbour-search": {
    name: "Recherche des plus proches voisins",
    summary: "Trouver dans une collection les éléments les plus proches d’un point de requête selon une mesure de distance ou de similarité."
  },

  /* Dynamical systems & control ------------------------------------------ */
  "markov-process": {
    name: "Processus de Markov",
    summary: "Un modèle de système passant d’un état à l’autre, où l’état suivant ne dépend que de l’état courant."
  },
  "expected-return": {
    name: "Retour espéré",
    summary: "La somme actualisée des récompenses futures qu’un agent attend d’un état, et que l’apprentissage par renforcement maximise."
  },
  "state-space-models": {
    name: "Modèles à espace d’états",
    summary: "Un modèle de séquence qui propage un état caché par une mise à jour linéaire, un pas de temps à la fois."
  },
  "dynamical-systems": {
    name: "Systèmes dynamiques",
    summary: "Les mathématiques de l’évolution d’un état au cours du temps sous une règle fixe."
  }
};

/** The seven branches. `short` has to fit a filter chip. */
window.MATH_CATEGORIES_FR = {
  "linear-algebra": { name: "Algèbre linéaire et géométrie", short: "Algèbre linéaire" },
  probability: { name: "Probabilités et statistiques", short: "Probabilités" },
  information: { name: "Théorie de l’information", short: "Information" },
  optimization: { name: "Analyse et optimisation", short: "Optimisation" },
  numerical: { name: "Mathématiques numériques", short: "Numérique" },
  discrete: { name: "Graphes et mathématiques discrètes", short: "Graphes" },
  dynamics: { name: "Systèmes dynamiques et contrôle", short: "Dynamique" }
};
