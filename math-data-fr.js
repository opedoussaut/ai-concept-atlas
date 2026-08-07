/**
 * French overlay for the mathematics layer.
 *
 * Same contract as data-fr.js: an overlay keyed by permanent slug, never a
 * parallel copy. `symbol` and `equation` are never translated — ∇ is ∇ and
 * rank(A) ≤ min(m, n) reads the same everywhere — and the symbol chip beside
 * the French name is what lets a reader match a page here to the notation in
 * an English paper.
 *
 * FIELD SHAPES. Three fields are not plain strings, and each is keyed rather
 * than positional wherever a key exists, so reordering the English can never
 * silently pair a French sentence with the wrong entry:
 *
 *   whyInAI  — a positional array. A bare list has no identity but its order,
 *              so the overlay must match the English length exactly; i18n.js
 *              ignores a mismatched list rather than applying half of it.
 *   legend   — an object keyed by the symbol being explained. The symbol is
 *              never translated, which is what makes it a stable key.
 *   worked   — prose around arithmetic. Translate the words, never the
 *              numbers, and keep the alignment of the ASCII layout intact.
 *
 * TERMINOLOGY. French mathematical vocabulary is settled and standard, so
 * unlike the AI layer this one translates properly: dot product is "produit
 * scalaire", not "dot product". The exceptions are proper nouns (Kullback–
 * Leibler, Adam, Eckart–Young), softmax, which has no French equivalent in
 * use, and the AI terms that stay English throughout the atlas — embedding,
 * fine-tuning, token, prompt.
 */
window.MATH_CONCEPTS_FR = {
  /* ================================================================= */
  /* Linear algebra & geometry                                          */
  /* ================================================================= */

  vectors: {
    name: "Vecteurs",
    summary: "Une liste ordonnée de nombres représentant un point, une direction ou un ensemble de mesures.",
    intuition: "Un nombre seul dit quelle quantité d’une seule chose. Un vecteur dit quelle quantité de plusieurs choses à la fois, dans un ordre fixe, de sorte que la position porte du sens. Tout ce qu’un modèle manipule est un paquet de nombres arrangé selon une forme : un scalaire n’a aucun axe, un vecteur en a un, une matrice deux, un tenseur autant qu’il en faut.",
    equationNote: "Un vecteur de longueur n est un point de l’espace à n dimensions. La notation ℝⁿ dit simplement : n nombres réels, dans l’ordre. Empiler des vecteurs de même longueur produit une matrice ; empiler des matrices produit un tenseur.",
    legend: {
      "vᵢ": "la i-ème composante, un unique nombre réel",
      "n": "la dimension — combien de nombres le vecteur contient",
      "ℝⁿ": "l’ensemble de tous les vecteurs à n composantes réelles"
    },
    worked: "Un vecteur en dimension trois :\n\n  v = [2, -1, 4]\n\nForme (3,) : un axe, trois composantes.\nEmpilez quatre vecteurs de ce type et vous avez une matrice de forme (4, 3).\nTraitez-en huit ensemble et vous avez un tenseur de forme (8, 4, 3).",
    whyInAI: [
      "Toute entrée que voit un modèle — un token, un patch d’image, une trame audio — devient un vecteur avant que quoi que ce soit d’autre ne se produise.",
      "La dimension n est une décision de conception : elle fixe la quantité d’information qu’une seule représentation peut porter.",
      "Le traitement par lots, la raison pour laquelle les accélérateurs sont rapides, ne fonctionne que parce que des vecteurs de même longueur s’empilent en matrices et en tenseurs réguliers."
    ]
  },

  matrices: {
    name: "Matrices",
    summary: "Un tableau rectangulaire de nombres qui stocke un ensemble de valeurs ou décrit une transformation linéaire.",
    intuition: "Une matrice se lit de deux façons, toutes deux utiles. Comme contenant, c’est une pile de vecteurs — un tableur de nombres. Comme action, c’est une machine : donnez-lui un vecteur et elle en renvoie un autre, tourné, étiré ou projeté. Les poids d’un réseau de neurones sont des matrices au second sens : chaque couche est une transformation apprise de la représentation qui la traverse.",
    equationNote: "Une matrice à m lignes et n colonnes contient m × n nombres. Lue comme une transformation, elle prend un vecteur de longueur n et produit un vecteur de longueur m.",
    legend: {
      "m": "nombre de lignes — la taille de la sortie",
      "n": "nombre de colonnes — la taille de l’entrée",
      "aᵢⱼ": "le coefficient à la ligne i, colonne j"
    },
    worked: "Une matrice 2 × 3 :\n\n  A = ⎡ 1  0  2 ⎤\n      ⎣ 3  1  0 ⎦\n\nElle envoie un vecteur de dimension 3 sur un vecteur de dimension 2.\nUne couche de transformer avec une matrice de poids 4096 × 4096 contient\n16 777 216 nombres dans un seul tableau de ce type.",
    whyInAI: [
      "Les poids d’un modèle sont stockés sous forme de matrices ; le nombre de paramètres est littéralement le nombre de coefficients qu’elles contiennent.",
      "Une passe avant est une chaîne de transformations matricielles appliquées à la représentation d’entrée.",
      "Les erreurs de forme — les plus fréquentes dans le code de modèles — ne sont que des matrices dont les dimensions ne s’accordent pas."
    ]
  },

  "matrix-multiplication": {
    name: "Multiplication matricielle",
    summary: "La combinaison de deux matrices telle que chaque coefficient du résultat soit le produit scalaire d’une ligne et d’une colonne.",
    intuition: "La multiplication matricielle applique une transformation après l’autre. Chaque coefficient du résultat répond à une petite question : dans quelle mesure cette ligne de A s’accorde-t-elle avec cette colonne de B ? C’est un produit scalaire : la multiplication matricielle est donc en réalité une grille de produits scalaires calculés d’un coup — exactement la forme de travail pour laquelle un GPU est construit.",
    equationNote: "Les dimensions internes doivent coïncider : les colonnes de A et les lignes de B valent toutes deux n. Ce n commun est sommé puis disparaît, laissant un résultat m × p. Le coût croît en m · n · p, ce qui explique que la taille du modèle et la longueur de séquence coûtent si cher.",
    legend: {
      "Σ_{k=1}^{n}": "additionner les n produits lorsque k parcourt 1 à n",
      "Aᵢₖ": "coefficient à la ligne i, colonne k de A",
      "m · n · p": "le nombre de multiplications-accumulations — le coût dominant de l’exécution d’un modèle"
    },
    worked: "  A = ⎡ 1  2 ⎤     B = ⎡ 5  6 ⎤\n      ⎣ 3  4 ⎦         ⎣ 7  8 ⎦\n\n(AB)₁₁ = 1×5 + 2×7 = 19\n(AB)₁₂ = 1×6 + 2×8 = 22\n(AB)₂₁ = 3×5 + 4×7 = 43\n(AB)₂₂ = 3×6 + 4×8 = 50\n\n  AB = ⎡ 19  22 ⎤\n       ⎣ 43  50 ⎦",
    whyInAI: [
      "C’est l’opération la plus exécutée à l’entraînement comme à l’inférence ; le matériel et les noyaux de calcul sont conçus autour d’elle.",
      "L’attention, ce sont trois multiplications matricielles et un softmax ; une couche feed-forward en ajoute deux.",
      "Comme le coût croît avec le produit des trois dimensions, diviser par deux une taille cachée divise le travail par environ quatre."
    ]
  },

  "dot-product": {
    name: "Produit scalaire",
    summary: "Multiplier deux vecteurs terme à terme et sommer les résultats, ce qui donne un seul nombre mesurant leur accord.",
    intuition: "Le produit scalaire demande dans quelle mesure deux vecteurs pointent dans la même direction. On multiplie les composantes correspondantes et on additionne. Un grand résultat positif signifie qu’ils s’accordent ; zéro qu’ils sont sans rapport — géométriquement, à angle droit ; un résultat négatif qu’ils s’opposent. Ce seul nombre est la façon dont un modèle évalue la pertinence entre n’importe quoi et n’importe quoi d’autre.",
    equationNote: "Les deux lignes sont la même quantité vue autrement. La première est l’arithmétique : apparier les composantes, multiplier, sommer. La seconde est la géométrie : le résultat croît avec la longueur des deux vecteurs et avec leur degré d’alignement. Diviser l’alignement par les longueurs donne la similarité cosinus.",
    legend: {
      "aᵢ, bᵢ": "la i-ème composante de chaque vecteur",
      "‖a‖": "la longueur de a",
      "θ": "l’angle entre les deux vecteurs"
    },
    worked: "  a = [1, 2]\n  b = [3, 4]\n\n  a · b = 1×3 + 2×4 = 3 + 8 = 11\n\nUn vecteur contre lui-même donne le carré de sa longueur :\n  a · a = 1×1 + 2×2 = 5,  donc ‖a‖ = √5 ≈ 2,24\n\nDeux vecteurs perpendiculaires donnent zéro :\n  [1, 0] · [0, 1] = 0",
    whyInAI: [
      "L’attention évalue chaque requête contre chaque clé par un produit scalaire — ce nombre devient le degré d’attention d’un token envers un autre.",
      "Un neurone artificiel isolé est un produit scalaire de ses entrées avec ses poids, plus un biais.",
      "La recherche d’information classe les candidats par produit scalaire ou par sa forme normalisée, la similarité cosinus."
    ]
  },

  "outer-product": {
    name: "Produit extérieur",
    summary: "Multiplier un vecteur colonne par un vecteur ligne pour produire une matrice entière, chaque coefficient étant le produit d’une paire de nombres.",
    intuition: "Le produit scalaire prend deux vecteurs et renvoie un nombre. Le produit extérieur prend les mêmes deux vecteurs et renvoie une matrice entière — il va dans l’autre sens. Chaque coefficient du résultat est une composante du premier vecteur multipliée par une composante du second : la matrice enregistre donc tous les appariements d’un coup. Le résultat est toujours de rang un : il est construit à partir d’une seule direction, et aucune quantité de lui ne pourra jamais décrire plus que cette direction. C’est ainsi qu’un modèle inscrit une association en mémoire — appariez une clé et une valeur, et le produit extérieur est la page sur laquelle vous la rangez.",
    equationNote: "Observez les formes : aᵀb est un seul nombre, tandis que a bᵀ est une matrice m × n. C’est la transposition qui fait tout le travail. Comme chaque ligne du résultat est une copie mise à l’échelle de bᵀ, la matrice n’a qu’une seule direction indépendante — son rang vaut un. Additionner de nombreux produits extérieurs, c’est ainsi qu’une matrice générale se construit, et qu’une mémoire de taille fixe accumule de nombreuses associations dans le même espace.",
    legend: {
      "a bᵀ": "vecteur colonne fois vecteur ligne — le produit extérieur",
      "aᵀb": "ligne fois colonne — le produit scalaire, un seul nombre",
      "rank = 1": "le résultat n’engendre qu’une seule direction, quelle que soit sa taille"
    },
    worked: "  a = [1, 2]      b = [3, 4, 5]\n\n  a bᵀ = ⎡ 1×3  1×4  1×5 ⎤ = ⎡ 3   4   5 ⎤\n         ⎣ 2×3  2×4  2×5 ⎦   ⎣ 6   8  10 ⎦\n\nLa seconde ligne vaut exactement le double de la première : le rang est 1.\n\nRelire la mémoire avec la clé restitue une valeur mise à l’échelle :\n  a·a = 5,  donc aᵀ(a bᵀ) = 5 · bᵀ = [15, 20, 25]\n\nNormalisez d’abord a à la longueur unité et la valeur revient exactement.",
    whyInAI: [
      "Une association clé-valeur s’inscrit dans une mémoire de taille fixe sous la forme d’un unique produit extérieur, k vᵀ — c’est la règle de mise à jour derrière l’attention linéaire et ses successeurs.",
      "L’adaptation de rang faible ajoute une somme de produits extérieurs à une matrice de poids gelée, ce qui explique que LoRA ait besoin de si peu de paramètres.",
      "Les gradients d’une couche linéaire sont des produits extérieurs de l’entrée par le signal d’erreur, ce qui explique qu’un seul exemple puisse mettre à jour tous les poids d’un coup."
    ]
  },

  "vector-norms": {
    name: "Normes vectorielles",
    summary: "Une mesure de la longueur ou de la magnitude d’un vecteur.",
    intuition: "Une norme répond à la question quelle est la taille de ce vecteur, en résumant de nombreux nombres en un seul. La réponse familière est la distance en ligne droite — la norme L2, Pythagore en n dimensions. Une autre réponse, la norme L1, additionne simplement les tailles des composantes. Le choix change le comportement : L2 réduit un peu tout, L1 tend à pousser des composantes jusqu’à zéro.",
    equationNote: "La norme L2 élève chaque composante au carré : les grandes composantes dominent — c’est pourquoi les pénalités L2 découragent les poids extrêmes. La norme L1 traite chaque unité de magnitude également, ce qui explique qu’elle ramène les petites composantes exactement à zéro et produise des résultats creux.",
    legend: {
      "|vᵢ|": "la valeur absolue d’une composante, sans tenir compte du signe",
      "‖v‖₂": "longueur euclidienne — la distance en ligne droite depuis l’origine",
      "‖v‖₁": "la somme des valeurs absolues des composantes"
    },
    worked: "  v = [3, 4]\n\n  ‖v‖₂ = √(3² + 4²) = √25 = 5\n  ‖v‖₁ = |3| + |4|  = 7\n\nNormalisation à la longueur unité :\n  v / ‖v‖₂ = [0,6, 0,8],  et ‖[0,6, 0,8]‖₂ = 1",
    whyInAI: [
      "Les couches de normalisation remettent les représentations à l’échelle par leur norme, pour que les activations restent dans une plage exploitable.",
      "L’écrêtage du gradient plafonne la norme du gradient afin qu’une seule grande mise à jour ne déstabilise pas l’entraînement.",
      "La régularisation par décroissance des poids pénalise la norme L2 des poids ; l’élagage par magnitude supprime les composantes de plus petite norme."
    ]
  },

  "cosine-similarity": {
    name: "Similarité cosinus",
    summary: "Le produit scalaire de deux vecteurs divisé par leurs longueurs, donnant un score de similarité entre −1 et 1 qui ignore la magnitude.",
    intuition: "Deux documents traitant du même sujet devraient être jugés semblables, que l’un fasse un paragraphe et l’autre une page. La similarité cosinus y parvient en ne mesurant que l’angle entre les vecteurs et en écartant leur longueur. Pointer dans la même direction donne 1, être à angle droit donne 0, pointer à l’opposé donne −1.",
    equationNote: "Le numérateur mesure l’accord et croît à la fois avec la longueur et avec l’alignement ; diviser par les deux longueurs retire la magnitude et ne laisse que la direction. Si les vecteurs sont déjà normalisés à la longueur unité, similarité cosinus et produit scalaire sont le même nombre.",
    legend: {
      "a · b": "le produit scalaire — l’accord brut entre les deux vecteurs",
      "‖a‖ ‖b‖": "le produit des deux longueurs, qui annule la magnitude",
      "θ": "l’angle entre les vecteurs dans leur espace d’embedding"
    },
    worked: "Direction identique :\n  a = [1, 2],  b = [2, 4]\n  a · b = 10,  ‖a‖ = √5,  ‖b‖ = √20\n  cos θ = 10 / (√5 · √20) = 10 / 10 = 1,0\n\nOrthogonaux — sans rapport :\n  a = [1, 0],  b = [0, 1]\n  cos θ = 0 / (1 · 1) = 0,0\n\nOpposés :\n  a = [1, 2],  b = [-1, -2]\n  cos θ = -5 / (√5 · √5) = -1,0",
    whyInAI: [
      "C’est le score de classement par défaut en recherche sémantique et en génération augmentée par recherche.",
      "Elle compare le sens plutôt que la longueur, si bien qu’une requête courte peut correspondre à un long passage.",
      "Les bases de données vectorielles indexent les embeddings précisément pour renvoyer vite les meilleures correspondances cosinus."
    ]
  },

  "vector-spaces": {
    name: "Espaces vectoriels",
    summary: "Un ensemble de vecteurs stable par addition et par multiplication scalaire, offrant une géométrie cohérente où directions et distances ont un sens.",
    intuition: "Un espace vectoriel est un lieu où l’arithmétique sur les vecteurs vous laisse toujours quelque part encore dans l’espace. Cette garantie est ce qui permet à un modèle de traiter le sens géométriquement : il peut additionner, moyenner et interpoler des représentations, et les résultats restent des points valides sur lesquels raisonner. Une base est un ensemble minimal de directions à partir desquelles tout point de l’espace peut être construit.",
    equationNote: "La première ligne est toute la définition : combiner des éléments de l’espace par mise à l’échelle et addition n’en sort jamais. La deuxième dit que tout point s’écrit comme une recette sur un jeu fixe de directions de base. La troisième importe pour les méthodes d’adaptation, qui confinent une mise à jour à un petit sous-espace.",
    legend: {
      "V": "l’espace vectoriel lui-même",
      "α, β": "des scalaires — des nombres réels quelconques",
      "eᵢ": "la i-ème direction de base",
      "cᵢ": "la coordonnée de v selon cette direction"
    },
    worked: "Dans ℝ², la base canonique est :\n  e₁ = [1, 0],  e₂ = [0, 1]\n\nTout point est une combinaison des deux :\n  [3, 5] = 3·e₁ + 5·e₂\n\nUn sous-espace de ℝ² est n’importe quelle droite passant par l’origine,\npar exemple tous les multiples de [1, 2]. Additionner ou mettre à\nl’échelle à l’intérieur de cette droite n’en sort jamais — exactement\nce que fait une mise à jour de rang 1 sur une matrice de poids.",
    whyInAI: [
      "Un espace d’embeddings est un espace vectoriel ; distance et direction y sont les seules choses sur lesquelles un système de recherche puisse agir.",
      "Comme les combinaisons restent dans l’espace, moyenner des embeddings ou interpoler entre eux produit des points exploitables.",
      "L’adaptation économe en paramètres fonctionne en restreignant les mises à jour à un sous-espace de faible dimension plutôt qu’à l’espace entier."
    ]
  },

  "matrix-rank": {
    name: "Rang d’une matrice",
    summary: "Le nombre de directions réellement indépendantes que contient une matrice — la quantité d’information unique qu’elle porte.",
    intuition: "Une matrice peut sembler grande et rester répétitive. Si chaque ligne est une copie mise à l’échelle d’une même ligne, la matrice contient des milliers de nombres mais une seule direction réelle. Le rang compte les directions qui ne sont pas redondantes. Un rang faible signifie que la matrice, si grande soit-elle, peut être décrite par bien moins de nombres qu’elle ne paraît en contenir.",
    equationNote: "Le rang des lignes est toujours égal au rang des colonnes — un fait peu évident qui fait du rang une propriété unique et bien définie. Il ne peut jamais dépasser la plus petite des deux dimensions. L’écart entre le rang réel et ce plafond est exactement la redondance qu’une méthode de compression peut exploiter.",
    legend: {
      "linearly independent": "aucune ligne ne peut être construite en combinant les autres par mise à l’échelle et addition",
      "min(m, n)": "la plus petite des deux dimensions — le rang maximal possible",
      "≪": "très inférieur à"
    },
    worked: "  A = ⎡ 1  2  3 ⎤\n      ⎢ 2  4  6 ⎥\n      ⎣ 1  1  1 ⎦\n\nLa ligne 2 vaut exactement 2 × la ligne 1 : elle n’apporte rien de neuf.\nLes lignes 1 et 3 sont indépendantes l’une de l’autre.\n\n  rank(A) = 2,  et non 3.\n\nNeuf nombres, mais seulement deux directions indépendantes.",
    whyInAI: [
      "L’affirmation empirique centrale derrière LoRA est que la *mise à jour* de poids nécessaire pour adapter un modèle est de rang intrinsèque faible.",
      "Si une matrice est de rang faible, stocker deux matrices fines au lieu de la grille complète ne perd rien et coûte bien moins.",
      "Le rang donne une manière rigoureuse de parler de redondance, ce qui est le fondement de la plupart des techniques de compression de modèles."
    ]
  },

  "low-rank-factorization": {
    name: "Factorisation de rang faible",
    summary: "Approcher une grande matrice par le produit de deux matrices bien plus fines, réduisant le nombre de paramètres sans changer la forme de la sortie.",
    intuition: "Si une matrice ne contient que quelques directions indépendantes, vous pouvez la reconstruire à partir de deux matrices étroites multipliées entre elles — une haute et une large. Le produit a la forme d’origine, si bien que rien en aval ne s’en aperçoit, mais le nombre de valeurs réellement stockées et entraînées s’effondre. C’est là toute l’astuce du fine-tuning économe en paramètres.",
    equationNote: "Le rang r est un curseur. Un petit r signifie moins de paramètres et une approximation plus grossière ; un r plus grand restitue davantage de la matrice d’origine, à un coût supérieur. Comme BA a la même forme m × n que ΔW, la factorisation est invisible pour le reste du réseau.",
    legend: {
      "ΔW": "la modification de la matrice de poids que l’adaptation doit apprendre",
      "r": "le rang choisi — la largeur du goulot d’étranglement",
      "B, A": "les deux facteurs fins réellement entraînés"
    },
    worked: "Une matrice de poids 4096 × 4096 :\n\n  complète :  4096 × 4096 = 16 777 216 paramètres\n\nAvec une factorisation de rang r = 16 :\n\n  B : 4096 × 16 =    65 536\n  A : 16 × 4096 =    65 536\n  total         =   131 072 paramètres\n\n  131 072 / 16 777 216 = 0,0078  ≈ 0,78 %\n\nMoins de 1 % du nombre de paramètres d’origine, et le produit\nBA reste une matrice 4096 × 4096.",
    whyInAI: [
      "LoRA n’entraîne que B et A pendant que les poids d’origine restent gelés, ce qui explique que les adaptateurs pèsent des mégaoctets et non des gigaoctets.",
      "De nombreux adaptateurs peuvent être permutés sur un même modèle de base partagé, puisque chacun n’est qu’une petite paire de matrices.",
      "La même idée, appliquée en tronquant une décomposition en valeurs singulières, est une manière standard de compresser des couches déjà entraînées."
    ]
  },

  "basis-projection": {
    name: "Base et projection",
    summary: "Choisir un ensemble de directions de référence, puis y projeter un vecteur pour en lire les composantes.",
    intuition: "Une base est un ensemble de directions par rapport auxquelles on convient de tout mesurer ; les coordonnées ne sont que la distance parcourue le long de chacune. La projection est l’acte de mesurer : elle rabat un vecteur sur une direction et demande quelle part de lui pointe dans ce sens. Presque toute couche apprise d’un modèle est une projection — elle prend une représentation et la réexprime dans les directions que le modèle a jugées utiles.",
    equationNote: "Le scalaire (v · u)/(u · u) est la part de v qui se trouve le long de u ; le remultiplier par u donne l’ombre de v sur cette direction. Lorsque les directions de base sont orthonormées, l’arithmétique s’effondre : chaque coordonnée est simplement un produit scalaire, ce qui explique que les modèles travaillent massivement dans de telles bases.",
    legend: {
      "v": "le vecteur que l’on mesure",
      "u": "la direction par rapport à laquelle on mesure",
      "eᵢ": "la i-ème direction de base orthonormée",
      "v · u": "le produit scalaire — le recouvrement brut entre les deux"
    },
    worked: "Projeter v = [3, 4] sur u = [1, 0] :\n\n  v · u = 3,  u · u = 1\n  proj = (3 / 1) · [1, 0] = [3, 0]\n\nL’ombre de v sur l’axe horizontal a pour longueur 3 —\nexactement sa première coordonnée, parce que [1, 0] est une\ndirection de base.\n\nL’attention construit trois projections de ce type d’une même entrée :\n\n  Q = X W_Q,   K = X W_K,   V = X W_V\n\nUne seule représentation, lue dans trois bases différentes.",
    whyInAI: [
      "Les requêtes, les clés et les valeurs sont trois projections apprises d’une même représentation — le mécanisme est une projection avant d’être quoi que ce soit d’autre.",
      "Chaque couche linéaire réexprime son entrée dans une nouvelle base ; ce que le réseau apprend, ce sont les directions qui valent la peine d’être mesurées.",
      "L’adaptation de rang faible fonctionne en confinant une mise à jour de poids à une petite base, si bien que seule une poignée de directions peut changer."
    ]
  },

  eigenvalues: {
    name: "Valeurs propres et vecteurs propres",
    summary: "Les directions qu’une matrice laisse inchangées en orientation, et les facteurs par lesquels elle les étire.",
    intuition: "La plupart des vecteurs sont tournés lorsqu’une matrice agit sur eux. Quelques-uns, particuliers, ne le sont pas — ils ressortent en pointant exactement là où ils sont entrés, seulement plus longs ou plus courts. Ce sont les vecteurs propres, et les facteurs d’échelle sont les valeurs propres. Ils révèlent ce qu’une transformation fait réellement, dépouillée du système de coordonnées dans lequel vous l’avez écrite.",
    equationNote: "L’équation dit : agir avec A sur v ne fait rien d’autre que le remettre à l’échelle. Les grandes valeurs propres marquent les directions qu’une transformation amplifie ; les valeurs propres proches de zéro marquent celles qu’elle détruit presque, ce qui est précisément la redondance qu’exploite la compression.",
    legend: {
      "λ": "la valeur propre — le facteur d’étirement",
      "v": "le vecteur propre — une direction laissée sans rotation",
      "I": "la matrice identité",
      "det": "le déterminant ; l’annuler permet de trouver les λ qui admettent un v non nul"
    },
    worked: "  A = ⎡ 2  0 ⎤\n      ⎣ 0  3 ⎦\n\n  A · [1, 0] = [2, 0] = 2 · [1, 0]   → λ = 2\n  A · [0, 1] = [0, 3] = 3 · [0, 1]   → λ = 3\n\nCette matrice étire horizontalement d’un facteur 2 et verticalement\nd’un facteur 3, et ne tourne rien. Toute autre matrice fait la même\nchose — simplement selon des axes autres que ceux que vous avez tracés.",
    whyInAI: [
      "Les valeurs propres d’une transformation disent quelles directions elle amplifie, ce qui explique qu’une application répétée explose ou s’évanouisse au fil des couches.",
      "L’analyse spectrale de la covariance des activations est un outil d’interprétabilité standard pour trouver les directions qu’un modèle utilise réellement.",
      "Elles sont la machinerie sous la décomposition en valeurs singulières, et donc sous tout argument de compression de rang faible."
    ]
  },

  "singular-value-decomposition": {
    name: "Décomposition en valeurs singulières",
    summary: "Factoriser n’importe quelle matrice en une rotation, un ensemble d’étirements et une seconde rotation — et en lire directement le rang.",
    intuition: "Toute matrice, quelle que soit sa forme, fait les mêmes trois choses à la suite : tourner, étirer selon des axes, tourner de nouveau. La SVD écrit cela noir sur blanc. Les facteurs d’étirement, par ordre décroissant, disent quelle part de l’action de la matrice vit dans chaque direction. Gardez les grands, écartez les petits, et vous obtenez la meilleure approximation possible à ce rang — c’est l’énoncé formel derrière toute méthode de rang faible.",
    equationNote: "U et V contiennent des directions orthonormées ; Σ contient les valeurs singulières, toujours positives ou nulles et triées. Le nombre de valeurs singulières non nulles *est* le rang. Tronquer après k termes donne la matrice de rang k la plus proche qui existe — le résultat d’Eckart–Young qui justifie la factorisation de rang faible.",
    legend: {
      "σᵢ": "la i-ème valeur singulière — l’ampleur de l’étirement de cette direction",
      "U, V": "bases orthonormées des espaces de sortie et d’entrée",
      "Vᵀ": "la transposée de V",
      "A_k": "la troncature de rang k, la meilleure approximation à ce rang"
    },
    worked: "Pour une matrice dont les valeurs singulières sont :\n\n  σ = [12,0, 7,4, 0,9, 0,05, 0,01]\n\n  rang = 5 (toutes non nulles), mais les deux premières portent\n\n  (12,0² + 7,4²) / Σσᵢ² = 199,8 / 200,6 = 99,6 %\n\nde l’énergie totale. Garder k = 2 perd moins d’un demi-pour-cent\ntout en ne stockant qu’une fraction des nombres.\n\nCet écart entre le rang vrai et le rang *utile* est ce sur quoi\nparie tout adaptateur de rang faible.",
    whyInAI: [
      "C’est la justification formelle de l’adaptation de rang faible : la meilleure approximation de rang r est la SVD tronquée, si bien que choisir un petit r est défendable plutôt qu’arbitraire.",
      "Tronquer la SVD d’une matrice de poids entraînée est une manière standard et fondée de compresser une couche a posteriori.",
      "La décroissance des valeurs singulières est une mesure directe de la redondance que contient réellement une matrice."
    ]
  },

  "latent-space": {
    name: "Espaces latents",
    summary: "Un système de coordonnées appris et compressé, où la position encode le sens plutôt que l’apparence brute.",
    intuition: "Les données brutes sont énormes et pour l’essentiel redondantes — des pixels voisins sont presque identiques, et la plupart des grilles de pixels possibles ne sont que du bruit. Un espace latent est un ensemble de coordonnées bien plus petit que le modèle invente pour lui-même, où chaque direction correspond à quelque chose qui varie réellement dans les données. Travailler dans cet espace coûte moins cher et, surtout, se tient plus près du sens.",
    equationNote: "Un encodeur f comprime l’entrée en z. Certaines architectures décodent ensuite vers l’entrée ; les architectures prédictives comme JEPA s’en abstiennent délibérément et prédisent directement la représentation latente d’une partie manquante — ce qui évite de dépenser de la capacité sur des détails dénués de sens.",
    legend: {
      "x": "l’entrée brute — pixels, tokens, échantillons audio",
      "z": "la représentation latente",
      "d": "la dimension latente, bien plus petite que la taille de l’entrée",
      "f_θ": "l’encodeur, de paramètres appris θ"
    },
    worked: "Une image RVB de 224 × 224 :\n\n  brute :   224 × 224 × 3 = 150 528 nombres\n  latente : 768 nombres\n\n  taux de compression ≈ 196 ×\n\nLes 768 nombres conservent ce qui distingue les images les unes\ndes autres et écartent le reste — ce qui explique que deux photos\ndu même objet se retrouvent proches dans l’espace latent alors que\npresque aucun de leurs pixels ne coïncide.",
    whyInAI: [
      "JEPA prédit dans l’espace latent précisément pour éviter de gaspiller de la capacité sur des détails imprévisibles au niveau du pixel.",
      "La diffusion latente exécute la coûteuse boucle de débruitage dans un espace compressé, ce qui a rendu praticable la génération en haute résolution.",
      "Les embeddings sont des représentations latentes mises au travail : tout l’intérêt est que la distance dans cet espace suive le sens."
    ]
  },

  /* ================================================================= */
  /* Probability & statistics                                           */
  /* ================================================================= */

  "probability-distributions": {
    name: "Distributions de probabilité",
    summary: "Une répartition de vraisemblance sur l’ensemble des issues possibles, dont la somme vaut un.",
    intuition: "Un modèle s’engage rarement sur une réponse unique. Il répartit sa croyance sur les options : ce token est probable, celui-là est possible, les autres sont presque exclus. Une distribution est cette répartition mise par écrit. Deux règles la rendent cohérente — aucune croyance négative, et un total qui vaut exactement un.",
    equationNote: "La contrainte que le total vaille un est ce qui impose un arbitrage : augmenter la probabilité d’une issue doit en abaisser d’autres. C’est pourquoi un modèle qui devient sûr d’un token devient nécessairement moins ouvert aux alternatives.",
    legend: {
      "p(x)": "la probabilité attribuée à l’issue x",
      "Σ_x": "somme sur toutes les issues possibles",
      "∫ … dx": "l’équivalent continu de cette somme"
    },
    worked: "Trois tokens suivants possibles :\n\n  p(\"the\")  = 0,66\n  p(\"a\")    = 0,24\n  p(\"cat\")  = 0,10\n              ─────\n  total     = 1,00\n\nPorter p(\"the\") à 0,80 force les deux autres à descendre à\n0,20 au total — la croyance est un budget fixe.",
    whyInAI: [
      "La sortie d’un modèle de langage est une distribution de probabilité sur tout le vocabulaire, à chaque étape.",
      "Les modèles génératifs sont des estimateurs de distribution : ils apprennent la forme des données puis y puisent.",
      "La calibration — savoir si une confiance annoncée de 70 % est juste environ 70 % du temps — est une question portant sur cette distribution."
    ]
  },

  "conditional-probability": {
    name: "Probabilité conditionnelle",
    summary: "La probabilité d’un événement sachant qu’un autre s’est déjà produit.",
    intuition: "Le contexte change les chances. La probabilité que le mot suivant soit Paris est faible en général et élevée après la phrase la capitale de la France est. La probabilité conditionnelle est la machinerie qui met à jour une croyance une fois que l’on sait quelque chose, et c’est tout le principe de fonctionnement d’un modèle de langage : tout ce qu’il produit est conditionné par ce qui précède.",
    equationNote: "La première ligne restreint l’attention aux mondes où B s’est produit et demande à quelle fréquence A s’y est produit aussi. La règle de chaînage est ce qui rend la modélisation de séquences traitable : une probabilité jointe impossible à calculer sur tout un document devient un produit de prédictions à un pas.",
    legend: {
      "P(A | B)": "probabilité de A sachant B — la barre se lit « sachant »",
      "P(A ∩ B)": "probabilité que les deux se produisent",
      "Π": "multiplier les termes entre eux",
      "x₁ … x_{t-1}": "tous les tokens avant la position t — le contexte"
    },
    worked: "Modélisation de la phrase « the cat sat » :\n\n  P(\"the cat sat\")\n    = P(\"the\")\n    × P(\"cat\" | \"the\")\n    × P(\"sat\" | \"the cat\")\n\nChaque facteur est une passe avant. La recherche d’information\nchange l’ensemble de conditionnement plutôt que le modèle :\n\n  P(réponse | question)          → peu fiable\n  P(réponse | question, source)  → ancrée",
    whyInAI: [
      "La prédiction du token suivant est le calcul direct de P(token suivant | contexte).",
      "La règle de chaînage explique que la génération soit séquentielle : chaque étape se conditionne sur tout ce qui a déjà été produit.",
      "La recherche d’information, les prompts et l’ancrage fonctionnent tous en changeant ce sur quoi le modèle se conditionne, non en changeant le modèle."
    ]
  },

  logits: {
    name: "Logits",
    summary: "Les scores bruts et non normalisés que produit un modèle avant leur conversion en probabilités.",
    intuition: "La dernière couche d’un classifieur ou d’un modèle de langage émet un nombre par option. Ces nombres ne sont pas des probabilités — ils peuvent être négatifs, et leur somme ne vaut rien de particulier. Ce ne sont que des scores, où plus grand signifie préféré. Les transformer en probabilités est une étape distincte, et bien séparer les deux importe à la fois numériquement et parce que plusieurs réglages agissent directement sur les scores.",
    equationNote: "Les logits proviennent d’une simple couche linéaire appliquée à l’état caché final. Diviser par une température T avant de normaliser met à l’échelle les écarts entre eux : un T inférieur à 1 exagère les différences et rend la sortie plus tranchée, un T supérieur à 1 l’aplatit. La troisième ligne est l’origine du nom — la fonction log-odds qui inverse la sigmoïde.",
    legend: {
      "h": "la représentation cachée finale du modèle",
      "W, b": "les poids et le biais de la couche de sortie",
      "K": "le nombre d’options — la taille du vocabulaire pour un modèle de langage",
      "T": "la température d’échantillonnage"
    },
    worked: "Trois logits issus d’une tête de modèle :\n\n  z = [2,0, 1,0, 0,1]\n\nÀ une température T = 0,5 les écarts doublent :\n\n  z' = [4,0, 2,0, 0,2]\n\nL’ordre ne change jamais — la température n’affecte que la\nnetteté avec laquelle les probabilités finales se séparent.",
    whyInAI: [
      "La température, le top-k et le top-p opèrent tous sur les logits, avant qu’aucune probabilité n’existe.",
      "Les fonctions de perte se calculent directement à partir des logits pour la stabilité numérique, jamais à partir de probabilités déjà arrondies.",
      "Un écart entre logits est un signal de confiance brut utile pour l’aiguillage, l’abstention et l’évaluation."
    ]
  },

  softmax: {
    name: "Softmax",
    summary: "Une fonction qui transforme n’importe quelle liste de scores en une distribution de probabilité de somme égale à un.",
    intuition: "Le softmax est le traducteur standard des scores vers les probabilités. Il applique l’exponentielle à chaque score — ce qui rend tout positif et amplifie les différences — puis divise par le total pour que les résultats somment à un. L’exponentielle explique qu’il soit doux plutôt qu’un maximum brutal : le gagnant emporte l’essentiel de la masse, mais les suivants gardent une part proportionnelle à leur proximité.",
    equationNote: "Appliquer l’exponentielle garantit des valeurs positives ; diviser par la somme garantit un total de un. Comme exp croît vite, un écart de score de 1 devient un rapport de probabilités d’environ 2,7 — la fonction est bien plus tranchée qu’un simple partage proportionnel.",
    legend: {
      "zᵢ": "le i-ème logit",
      "exp(zᵢ)": "e élevé à ce score — toujours positif",
      "Σ_j exp(z_j)": "le total normalisateur sur les K options",
      "T": "la température ; T → 0 revient à choisir directement le maximum"
    },
    worked: "  z = [2,0, 1,0, 0,1]\n\n  exp(2,0) = 7,389\n  exp(1,0) = 2,718\n  exp(0,1) = 1,105\n  ────────────────\n  somme    = 11,212\n\n  softmax(z) = [7,389/11,212, 2,718/11,212, 1,105/11,212]\n             = [0,659, 0,242, 0,099]\n\n  0,659 + 0,242 + 0,099 = 1,000\n\nLe meilleur score valait le double du deuxième ; après softmax\nil détient près du triple de la probabilité.",
    whyInAI: [
      "L’attention applique un softmax aux scores de produit scalaire mis à l’échelle, les transformant en poids dont la somme vaut un sur la séquence.",
      "Toute distribution du token suivant est un softmax sur des logits de la taille du vocabulaire.",
      "L’aiguillage d’un mélange d’experts utilise un softmax pour décider de la contribution de chaque expert à un token."
    ]
  },

  sampling: {
    name: "Échantillonnage",
    summary: "Tirer des issues concrètes dans une distribution de probabilité, et estimer des grandeurs à partir de ces tirages.",
    intuition: "Une distribution décrit ce qui pourrait arriver ; l’échantillonnage en choisit une réalisation. C’est aussi la manière de calculer ce qu’il est impossible d’établir exactement : plutôt que de sommer sur toutes les possibilités, on en tire quelques centaines au hasard et on fait la moyenne. C’est pourquoi la même idée sous-tend à la fois la variation créative en génération et des estimations numériques rigoureuses en apprentissage par renforcement et en évaluation.",
    equationNote: "Le tilde signifie tiré de. L’estimateur dit : pour moyenner une fonction sur une distribution que l’on ne peut énumérer, on y échantillonne et on prend la moyenne. Le taux en 1/√N est la contrainte pratique — diviser l’erreur par quatre coûte seize fois plus d’échantillons.",
    legend: {
      "~": "« est tiré de »",
      "E_p[f(x)]": "l’espérance de f sous la distribution p",
      "N": "le nombre d’échantillons tirés"
    },
    worked: "Étant donné la sortie softmax [0,659, 0,242, 0,099] :\n\n  décodage glouton → toujours l’option 1\n  échantillonnage  → option 1 environ 66 % du temps,\n                      option 2 environ 24 %,\n                      option 3 environ 10 %\n\nÉvaluer un modèle sur 100 prompts est une estimation de Monte-Carlo\nde son taux de réussite réel — avec une marge d’environ ±5 points.\nAtteindre ±1 point demande environ 2 500 prompts.",
    whyInAI: [
      "La stratégie de décodage — gloutonne, à température, top-k, top-p — est un choix sur la façon d’échantillonner dans la distribution du modèle.",
      "La génération par diffusion est une longue chaîne d’étapes d’échantillonnage qui transforme peu à peu du bruit en structure.",
      "L’apprentissage par renforcement estime les retours à partir de trajectoires échantillonnées, et les scores de benchmark sont des estimations échantillonnées assorties de véritables marges d’erreur."
    ]
  },

  "maximum-likelihood": {
    name: "Estimation par maximum de vraisemblance",
    summary: "Choisir les paramètres qui rendent les données observées aussi probables que possible.",
    intuition: "Étant donné des données et un modèle à réglages ajustables, le maximum de vraisemblance choisit les réglages sous lesquels les données réellement observées auraient été les moins surprenantes. Transformer le produit de probabilités en somme de logarithmes, puis changer le signe, convertit cela en une minimisation — et l’on obtient alors littéralement la perte d’entropie croisée utilisée pour pré-entraîner tous les modèles de langage.",
    equationNote: "Les deux lignes posent le même problème. Les produits de nombreuses petites probabilités deviennent nuls par soupassement en virgule flottante : on prend donc le logarithme — il transforme le produit en somme et il est monotone, donc la réponse est inchangée. La négation transforme la maximisation en la minimisation qu’attend la descente de gradient.",
    legend: {
      "θ": "les paramètres du modèle que l’on ajuste",
      "θ̂": "l’estimation retenue — l’argmax",
      "argmax_θ": "la valeur de θ qui rend l’expression maximale",
      "− Σ log p": "la log-vraisemblance négative, qui est la perte d’entraînement"
    },
    worked: "Une pièce tombe sur face 7 fois sur 10 lancers.\nPour un modèle de paramètre θ = P(face) :\n\n  vraisemblance = θ⁷ (1 − θ)³\n\nLa maximiser donne θ̂ = 7/10 = 0,7 — la fréquence observée.\n\nLe pré-entraînement est la même procédure à grande échelle :\najuster des milliards de paramètres pour que le corpus réellement\nécrit ressorte aussi probable que possible.",
    whyInAI: [
      "Le pré-entraînement d’un modèle de langage est une estimation par maximum de vraisemblance sur un corpus, rien de plus exotique.",
      "Cela explique que l’entropie croisée soit la perte par défaut : c’est la log-vraisemblance négative écrite en toutes lettres.",
      "Cela explique aussi un mode de défaillance connu : un modèle épouse la distribution de son texte d’entraînement, erreurs et biais compris."
    ]
  },

  /* ================================================================= */
  /* Information theory                                                 */
  /* ================================================================= */

  entropy: {
    name: "Entropie",
    summary: "Une mesure de l’incertitude d’une distribution — la surprise moyenne d’une issue qui en est tirée.",
    intuition: "Si une issue est quasi certaine, apprendre ce qui s’est produit ne vous apprend presque rien, et l’entropie est proche de zéro. Si toutes les issues sont également probables, le résultat est maximalement informatif, et l’entropie est à son plus haut. Mesurée en bits, l’entropie est le nombre moyen de questions par oui ou non nécessaires pour déterminer une issue.",
    equationNote: "Chaque issue contribue à hauteur de sa probabilité multipliée par sa surprise, −log p(x). Les issues rares sont très surprenantes mais surviennent peu ; les fréquentes surviennent souvent mais disent peu. L’entropie est l’équilibre des deux. Avec des logarithmes en base 2 l’unité est le bit ; le maximum, log K, est atteint quand les K issues sont équiprobables.",
    legend: {
      "−log p(x)": "la surprise de l’issue x — d’autant plus grande que x est improbable",
      "K": "le nombre d’issues possibles",
      "H(p)": "la surprise moyenne, en bits lorsque le log est en base 2"
    },
    worked: "Une pièce équilibrée :\n  H = −(0,5 log₂ 0,5 + 0,5 log₂ 0,5) = 1 bit\n\nUne pièce biaisée, 90/10 :\n  H = −(0,9 log₂ 0,9 + 0,1 log₂ 0,1) ≈ 0,47 bit\n\nUne issue certaine :\n  H = −(1 · log₂ 1) = 0 bit\n\nLa pièce équilibrée est la plus incertaine et porte le plus\nd’information par lancer.",
    whyInAI: [
      "La perplexité, métrique standard de la modélisation du langage, est l’exponentielle de l’entropie croisée — une mesure d’entropie déguisée.",
      "Une distribution de sortie à faible entropie signifie que le modèle est sûr de lui ; une entropie élevée signifie qu’il hésite entre de nombreuses options.",
      "Des bonus d’entropie sont utilisés en apprentissage par renforcement pour éviter qu’une politique ne se replie trop tôt sur une seule action."
    ]
  },

  "cross-entropy": {
    name: "Entropie croisée",
    summary: "La surprise moyenne des issues réelles évaluées sous la distribution prédite par le modèle — la fonction de perte standard à l’entraînement.",
    intuition: "L’entropie croisée mesure le coût de croire q quand la réalité est p. Si le modèle attribue une probabilité élevée à ce qui s’est réellement produit, la surprise est faible et la perte est basse. S’il a prédit avec assurance autre chose, la perte est grande. Comme la bonne réponse est en général un unique token connu, la formule se réduit à quelque chose de très simple : le logarithme négatif de la probabilité que le modèle a donnée à la bonne réponse.",
    equationNote: "La forme générale pondère la surprise de chaque issue par sa fréquence réelle. En apprentissage supervisé la vérité est une unique étiquette connue : tous les termes sauf un sont donc multipliés par zéro — ne laissant que la log-probabilité du modèle sur la bonne réponse. C’est pourquoi la perte sanctionne bien plus durement les erreurs commises avec assurance que les hésitations.",
    legend: {
      "p": "la distribution vraie — en général one-hot sur la bonne réponse",
      "q": "la distribution prédite par le modèle, typiquement une sortie de softmax",
      "q(correct)": "la probabilité que le modèle a attribuée à la bonne réponse"
    },
    worked: "Le modèle produit [0,659, 0,242, 0,099]\net l’option 1 est correcte :\n\n  L = − ln(0,659) = 0,417\n\nSi l’option 3 avait été correcte à la place :\n\n  L = − ln(0,099) = 2,313\n\nEt pour une erreur commise avec assurance, q(correct) = 0,01 :\n\n  L = − ln(0,01) = 4,605\n\nLa perte croît sans borne à mesure que la probabilité que le\nmodèle accorde à la vérité tend vers zéro.",
    whyInAI: [
      "C’est la perte utilisée pour pré-entraîner et affiner à peu près tous les modèles de langage et classifieurs.",
      "C’est exactement la log-vraisemblance négative : la minimiser revient à faire de l’estimation par maximum de vraisemblance.",
      "La distillation de connaissances remplace la cible one-hot par la distribution complète de l’enseignant, ce qui explique l’importance de la forme générale."
    ]
  },

  "kl-divergence": {
    name: "Divergence de Kullback–Leibler",
    summary: "Une mesure de l’écart entre deux distributions de probabilité, exprimée en surprise supplémentaire.",
    intuition: "La divergence KL répond à la question : si j’utilise la distribution q alors que la vérité est p, quel surcroît de surprise cela me coûte-t-il ? Elle est nulle uniquement lorsque les deux coïncident, et croît à mesure qu’elles divergent. Ce n’est pas une distance au sens courant — échanger p et q donne un autre nombre — mais c’est la façon naturelle de dire que deux distributions sont en désaccord, et c’est ainsi que l’on empêche les modèles de trop dériver pendant l’alignement.",
    equationNote: "La deuxième ligne est la lecture la plus claire : la divergence KL est l’entropie croisée moins l’entropie de toute façon inévitable. Ce qui reste est purement la pénalité pour avoir utilisé la mauvaise distribution. Elle est asymétrique — D_KL(p‖q) ≠ D_KL(q‖p) — donc l’ordre des arguments est une décision de modélisation, non un détail.",
    legend: {
      "p ‖ q": "divergence *de q par rapport à p*, p servant de référence",
      "H(p, q)": "l’entropie croisée du couple",
      "H(p)": "l’entropie de p — la part irréductible",
      "⟺": "si et seulement si"
    },
    worked: "  p = [0,9, 0,1]      la référence\n  q = [0,5, 0,5]      une estimation plus plate\n\n  D_KL(p ‖ q)\n    = 0,9 · ln(0,9/0,5) + 0,1 · ln(0,1/0,5)\n    = 0,9 · 0,5878 + 0,1 · (−1,6094)\n    = 0,529 − 0,161\n    = 0,368 nats\n\nInverser les arguments donne 0,351 — un nombre différent,\nce qui rend l’asymétrie concrète.",
    whyInAI: [
      "Le RLHF et PPO ajoutent une pénalité KL par rapport au modèle d’origine, pour que l’entraînement sur préférences améliore le comportement sans détruire les capacités de base.",
      "L’optimisation directe des préférences se dérive d’un objectif contraint par une KL, d’où vient sa forme close.",
      "La distillation minimise la divergence KL entre les distributions de l’élève et de l’enseignant ; les auto-encodeurs variationnels s’en servent pour régulariser l’espace latent."
    ]
  },

  /* ================================================================= */
  /* Calculus & optimization                                            */
  /* ================================================================= */

  gradients: {
    name: "Gradients",
    summary: "Le vecteur des dérivées partielles, pointant dans la direction de plus forte croissance d’une fonction.",
    intuition: "Une dérivée en dimension un donne la pente : si l’on change un peu l’entrée, de combien bouge la sortie ? Avec des millions d’entrées on obtient une pente par entrée, et les rassembler en un vecteur donne le gradient. Il pointe vers le haut. L’entraînement marche dans l’autre sens — et s’il fonctionne, c’est parce que ce seul vecteur dit comment chaque paramètre doit changer.",
    equationNote: "Chaque dérivée partielle isole un paramètre et interroge son effet individuel. Assemblées en vecteur, elles donnent à la fois une direction — la plus forte montée — et une magnitude — la raideur. Un gradient proche de zéro signifie que le paramètre a peu d’influence : c’est exactement ce que décrit l’évanouissement du gradient.",
    legend: {
      "∇": "« nabla » — l’opérateur gradient",
      "∂f/∂θᵢ": "dérivée partielle de f par rapport au i-ème paramètre",
      "θ": "le vecteur complet des paramètres"
    },
    worked: "  f(θ₁, θ₂) = θ₁² + 3θ₂\n\n  ∂f/∂θ₁ = 2θ₁\n  ∂f/∂θ₂ = 3\n\n  ∇f = [2θ₁, 3]\n\nAu point (2, 1) :\n\n  ∇f = [4, 3]\n\nLa plus forte croissance suit [4, 3] ; le second paramètre a une\ninfluence constante de 3, où que l’on se trouve.",
    whyInAI: [
      "Le gradient de la perte par rapport à chaque paramètre est le seul signal dont dispose l’entraînement pour savoir comment s’améliorer.",
      "L’évanouissement et l’explosion du gradient — la raison d’être des connexions résiduelles et de la normalisation — sont des affirmations sur la magnitude de ce vecteur.",
      "Les magnitudes de gradient servent aussi au diagnostic, pour l’attribution et pour repérer les couches qui ont cessé d’apprendre."
    ]
  },

  "gradient-descent": {
    name: "Descente de gradient",
    summary: "Déplacer répétitivement les paramètres dans la direction qui réduit le plus la perte.",
    intuition: "Tenez-vous sur un flanc de colline dans le brouillard. Vous ne voyez pas la vallée, mais vous sentez de quel côté ça descend. Faites un petit pas dans ce sens et recommencez. C’est tout l’algorithme d’entraînement. La taille du pas compte plus que tout : trop petite et vous n’arrivez jamais, trop grande et vous rebondissez par-dessus le fond de la vallée et divergez.",
    equationNote: "Soustraire le gradient déplace à l’opposé de la plus forte montée : la perte baisse. Calculer le gradient sur tout le jeu de données est irréalisable à grande échelle, la version stochastique utilise donc un mini-lot : une estimation plus bruitée de la même direction, mais des milliers de fois moins chère. Des optimiseurs comme Adam raffinent cela en adaptant η par paramètre à partir de l’historique des gradients.",
    legend: {
      "η": "le taux d’apprentissage — l’ampleur du pas",
      "∇L": "le gradient de la perte",
      "t": "l’étape d’entraînement",
      "L_batch": "la perte sur un mini-lot plutôt que sur tout le jeu de données"
    },
    worked: "  L(θ) = θ²,  donc  ∇L = 2θ\n\nEn partant de θ = 4 avec un taux d’apprentissage η = 0,1 :\n\n  étape 1 :  θ = 4    − 0,1 · 8    = 3,2\n  étape 2 :  θ = 3,2  − 0,1 · 6,4  = 2,56\n  étape 3 :  θ = 2,56 − 0,1 · 5,12 = 2,048\n\nProgression régulière vers le minimum en θ = 0.\nAvec η = 1,1 au contraire, le premier pas dépasse jusqu’à −4,8 et\nles valeurs croissent sans borne — la perte diverge.",
    whyInAI: [
      "Tout modèle entraîné — pré-entraîné, affiné ou adapté — est arrivé à ses poids par cette boucle.",
      "Les plannings de taux d’apprentissage, l’échauffement et Adam existent tous pour gérer la quantité à laquelle cette mise à jour est la plus sensible.",
      "LoRA ne change rien à l’optimisation ; il réduit seulement l’ensemble des paramètres auxquels la mise à jour s’applique."
    ]
  },

  backpropagation: {
    name: "Rétropropagation",
    summary: "Appliquer la règle de dérivation en chaîne à rebours dans un réseau pour obtenir en une seule passe le gradient de la perte pour chaque paramètre.",
    intuition: "Un réseau est une longue composition de fonctions, et la perte se trouve au bout. Pour savoir comment un poids de la première couche a affecté cette perte, on multiplie entre elles les sensibilités de chaque étape intermédiaire — la règle de dérivation en chaîne. La rétropropagation fait cela une fois, depuis la sortie vers l’arrière, en réutilisant les résultats partiels au lieu de les recalculer : c’est ce qui rend seulement abordable l’entraînement de milliards de paramètres.",
    equationNote: "La première ligne est toute l’idée : la sensibilité voyage vers l’arrière comme un produit de sensibilités locales. La seconde est le même énoncé pour un réseau en couches — le signal d’erreur δ est renvoyé à travers les poids transposés, si bien qu’un seul balayage arrière produit tous les gradients. Le coût vaut environ deux fois une passe avant, et non une passe par paramètre.",
    legend: {
      "L": "la perte à la sortie",
      "δ⁽ˡ⁾": "le signal d’erreur arrivant à la couche l",
      "⊙": "multiplication terme à terme",
      "f′": "la dérivée de la fonction d’activation"
    },
    worked: "Une chaîne à deux étapes :  L = a²,  a = 3z,  z = 2w\n\n  ∂L/∂a = 2a\n  ∂a/∂z = 3\n  ∂z/∂w = 2\n\n  ∂L/∂w = 2a · 3 · 2 = 12a\n\nEn w = 1 :  z = 2, a = 6, donc ∂L/∂w = 72.\n\nRemarquez que chaque facteur est local — calculé à partir d’une seule\nétape — et que pourtant leur produit donne l’effet sur toute la chaîne.",
    whyInAI: [
      "C’est ce qui rend les réseaux profonds entraînables ; sans elle, les gradients coûteraient une passe avant par paramètre.",
      "L’évanouissement et l’explosion du gradient découlent directement de ce produit de termes qui rétrécit ou grossit au fil des couches.",
      "Comme les gradients remontent à travers chaque couche, les activations doivent être conservées en mémoire — la principale raison pour laquelle l’entraînement demande bien plus de mémoire que l’inférence."
    ]
  },

  "loss-functions": {
    name: "Fonctions de perte",
    summary: "Un nombre unique mesurant à quel point la sortie d’un modèle est fausse, et qui définit ce que l’entraînement optimise réellement.",
    intuition: "L’entraînement a besoin d’un seul nombre à faire baisser. La fonction de perte est l’endroit où l’on énonce ce que se tromper veut dire pour son problème — et ce choix, plus que l’architecture, détermine ce que le modèle apprend à faire. Prédire une quantité, choisir une catégorie et rapprocher des choses semblables sont trois définitions différentes de l’erreur, et chacune a sa perte standard.",
    equationNote: "La forme extérieure est toujours la même : évaluer chaque exemple, prendre la moyenne. Ce qui change est ℓ. L’erreur quadratique convient aux cibles continues. L’entropie croisée aux cibles catégorielles. Une perte contrastive n’a aucune cible fixe : elle exige seulement qu’une paire correspondante score plus haut que les alternatives — c’est ainsi que des modèles apprennent des représentations sans étiquettes.",
    legend: {
      "ŷ": "la prédiction du modèle",
      "y": "la cible",
      "b⁺": "le positif — l’élément qui correspond réellement à a",
      "τ": "une température réglant la netteté du contraste"
    },
    worked: "Erreur quadratique sur trois prédictions :\n\n  ŷ = [2,5, 0,0, 2,0]\n  y = [3,0, 0,0, 2,0]\n\n  ℓ = [0,25, 0,00, 0,00]\n  L = 0,25 / 3 = 0,083\n\nUn lot contrastif avec une paire correspondante à une similarité de 0,9\net trois non-correspondances autour de 0,1 donne une perte faible ; si les\nnon-correspondances scorent 0,9 elles aussi, la perte est grande — le modèle\nest pénalisé pour ne pas avoir *séparé*, non pour son imprécision.",
    whyInAI: [
      "La perte est la définition opérationnelle de la tâche : changez-la et vous changez ce que devient le modèle, quelle que soit l’architecture.",
      "L’objectif de JEPA est une perte de prédiction dans l’espace latent, ce qui explique précisément qu’il apprenne de la sémantique plutôt que du détail de pixel.",
      "Les méthodes d’alignement fonctionnent en ajoutant des termes — un terme de préférence, une pénalité KL — à la perte plutôt qu’en changeant le modèle."
    ]
  },

  adam: {
    name: "Optimisation Adam",
    summary: "Une variante de la descente de gradient qui donne à chaque paramètre son propre pas adaptatif, calculé à partir de l’historique de ses gradients.",
    intuition: "La descente de gradient ordinaire applique un seul taux d’apprentissage à des millions de paramètres, ce qui est un mauvais compromis : certains ont besoin de pas audacieux, d’autres de pas minuscules. Adam entretient deux moyennes glissantes par paramètre — la direction récente et la taille récente de ses gradients — et divise l’une par l’autre. Les paramètres aux gradients constamment grands sont amortis ; ceux qui bougent à peine sont amplifiés. C’est l’optimiseur par défaut de presque tous les modèles que vous rencontrerez.",
    equationNote: "m suit la direction qu’a prise le gradient, en lissant le bruit. v suit son amplitude. Diviser par √v normalise le pas, si bien que le taux d’apprentissage effectif s’adapte par paramètre. Les chapeaux désignent une correction de biais qui ne compte que dans les premiers pas, quand les moyennes partent de zéro.",
    legend: {
      "g_t": "le gradient à l’étape t",
      "β₁, β₂": "les taux de décroissance des deux moyennes, typiquement 0,9 et 0,999",
      "η": "le taux d’apprentissage de base",
      "ε": "une petite constante, typiquement 1e-8, qui éloigne le dénominateur de zéro"
    },
    worked: "Un paramètre au gradient constant de 0,1 :\n\n  m → 0,1,  v → 0,01,  √v → 0,1\n  pas = η · 0,1 / 0,1 = η\n\nUn autre au gradient constant de 10 :\n\n  m → 10,  v → 100,  √v → 10\n  pas = η · 10 / 10 = η\n\nTous deux avancent d’autant, malgré des gradients différant d’un\nfacteur cent. Cette invariance d’échelle est tout l’intérêt —\net la raison pour laquelle Adam demande si peu de réglage du taux.",
    whyInAI: [
      "C’est l’optimiseur par défaut pour l’entraînement des transformers ; le taux d’apprentissage annoncé pour presque tout modèle moderne est un taux Adam.",
      "Il stocke deux valeurs supplémentaires par paramètre, si bien que l’état de l’optimiseur coûte environ deux fois le modèle lui-même — une raison majeure pour laquelle l’entraînement demande bien plus de mémoire que l’inférence.",
      "Les pas adaptatifs sont ce qui rend l’entraînement stable entre des couches dont les gradients diffèrent de plusieurs ordres de grandeur."
    ]
  },

  regularization: {
    name: "Régularisation",
    summary: "Ajouter une pénalité ou une contrainte qui dissuade un modèle d’épouser trop exactement ses données d’entraînement.",
    intuition: "Un modèle doté d’assez de capacité peut mémoriser parfaitement son jeu d’entraînement et rester inutile sur tout le reste. La régularisation rend délibérément l’objectif plus difficile à minimiser, de sorte que le modèle doive préférer les explications simples. La forme la plus courante ajoute simplement la taille des poids à la perte : bien ajuster les données est récompensé, être grand est puni, et l’équilibre entre les deux est un curseur que l’on règle.",
    equationNote: "λ fixe le poids de la pénalité : zéro signifie aucune régularisation, une grande valeur signifie que le modèle préfère de petits poids à un bon ajustement. L2 réduit tout de façon lisse, L1 ramène des composantes exactement à zéro. Le dropout est un mécanisme différent visant la même fin — il empêche de dépendre d’une unité en particulier.",
    legend: {
      "λ": "l’intensité de régularisation — le curseur d’arbitrage",
      "R(θ)": "le terme de pénalité, fonction des seuls poids",
      "‖θ‖₂²": "la somme des carrés des poids",
      "p": "la probabilité de dropout"
    },
    worked: "Deux vecteurs de poids ajustant les données aussi bien l’un que l’autre :\n\n  θ_A = [3,0, 0,1]   ‖θ‖₂² = 9,01\n  θ_B = [1,5, 1,5]   ‖θ‖₂² = 4,50\n\nAvec λ = 0,1 la pénalité coûte 0,901 contre 0,450 : l’objectif\npréfère donc θ_B — la solution qui répartit sa dépendance entre\nles deux entrées au lieu de s’appuyer sur une seule.\n\nCette préférence est tout le mécanisme.",
    whyInAI: [
      "La décroissance des poids est appliquée par défaut dans à peu près tout entraînement de grand modèle ; elle fait partie de ce que l’optimiseur signifie.",
      "Le fine-tuning sur un petit jeu de données est là où le surapprentissage mord le plus fort, ce qui explique que les adaptateurs et les mises à jour de rang faible soient eux-mêmes une contrainte de capacité.",
      "L’élagage par magnitude est la régularisation poussée à sa conclusion : pénaliser les petits poids, puis les supprimer purement et simplement."
    ]
  },

  /* ================================================================= */
  /* Numerical mathematics                                              */
  /* ================================================================= */

  "floating-point": {
    name: "Précision en virgule flottante",
    summary: "La manière dont les ordinateurs représentent les nombres réels avec un nombre fini de bits, arbitrant entre étendue et exactitude.",
    intuition: "Un ordinateur ne peut pas stocker exactement la plupart des nombres réels. La virgule flottante est le compromis : quelques bits pour l’exposant, qui fixe l’étendue, et le reste pour la mantisse, qui fixe l’exactitude. Choisir moins de bits rend chaque poids plus léger en mémoire et chaque opération plus rapide — toute la prémisse de la quantification — au prix d’une représentation moins précise de chaque valeur.",
    equationNote: "Les bits d’exposant décident de la taille maximale et minimale d’un nombre ; les bits de mantisse décident de la finesse avec laquelle on distingue les valeurs dans cette étendue. Le bf16 conserve l’exposant du fp32 et sacrifie la précision à la place — ce qui explique qu’il déborde rarement à l’entraînement là où le fp16 déborde.",
    legend: {
      "s": "bit de signe",
      "m": "la mantisse — les bits de précision",
      "e": "l’exposant — les bits d’étendue",
      "bias": "un décalage fixe permettant à l’exposant de représenter des puissances négatives"
    },
    worked: "Mémoire pour un modèle de 7 milliards de paramètres, poids seuls :\n\n  fp32 :  7e9 × 4 octets = 28 Go\n  fp16 :  7e9 × 2 octets = 14 Go\n  int8 :  7e9 × 1 octet  =  7 Go\n  4 bits : 7e9 × 0,5     =  3,5 Go\n\nCette progression est la différence entre un accélérateur de centre\nde données et un ordinateur portable. Rien du modèle ne change —\nseulement la précision avec laquelle chaque poids est écrit.",
    whyInAI: [
      "La quantification est une réduction de précision : toute la technique est un choix du nombre de bits accordé à chaque poids.",
      "L’entraînement en précision mixte conserve des poids maîtres en fp32 tout en calculant en fp16 ou bf16, gardant la vitesse sans perdre la stabilité.",
      "QLoRA fonctionne en gardant en mémoire un modèle de base gelé en 4 bits tout en entraînant par-dessus des adaptateurs en précision supérieure."
    ]
  },

  "rounding-error": {
    name: "Erreur d’arrondi et d’approximation",
    summary: "L’écart introduit chaque fois qu’une valeur est ramenée au nombre représentable le plus proche.",
    intuition: "Réduisez la précision et chaque valeur doit se déplacer vers l’emplacement disponible le plus proche. Ce déplacement est l’erreur, et il est borné par la moitié de l’écart entre emplacements. Que cela compte ou non dépend du rapport de l’erreur au signal : pour des poids dont l’information utile se situe bien au-dessus du plancher de bruit, un arrondi assez grossier se révèle inoffensif — c’est la raison empirique pour laquelle les modèles en 4 bits fonctionnent.",
    equationNote: "Diviser par le pas s, arrondir, puis remultiplier constitue toute l’opération de quantification. L’erreur ne peut jamais dépasser un demi-pas. La troisième ligne fixe ce pas à partir de l’étendue réelle des valeurs et du budget de bits — ce qui explique que des échelles par canal ou par bloc battent une échelle globale unique : elles gardent s petit là où les valeurs sont petites.",
    legend: {
      "s": "le pas de quantification — l’écart entre valeurs représentables",
      "b": "le nombre de bits disponibles",
      "x̂": "la valeur quantifiée",
      "max|x|": "la plus grande magnitude du bloc quantifié"
    },
    worked: "Quantification avec un pas s = 0,1 :\n\n  x = 0,734  →  round(7,34) · 0,1 = 0,7\n  erreur = 0,034,  dans la borne s/2 = 0,05\n\nÀ présent avec une valeur aberrante dans le bloc :\n\n  valeurs dans [−0,5, 0,5] et une à 8,0\n  échelle symétrique 8 bits :  s = 8,0 / 127 = 0,063\n\nLa valeur aberrante a imposé un pas grossier à toutes les petites\nvaleurs. C’est exactement pourquoi les schémas par bloc et ceux qui\ntiennent compte des valeurs aberrantes existent — un seul poids\nextrême dégraderait sinon tout le reste.",
    whyInAI: [
      "Elle fixe le budget d’exactitude de la quantification : combien de qualité on abandonne pour chaque bit retiré.",
      "Elle explique pourquoi une poignée de poids aberrants peut ruiner un schéma de quantification naïf, là où une mise à l’échelle par bloc y survit.",
      "Les erreurs s’accumulent au fil des couches : ce qui est négligeable dans une multiplication matricielle peut ne plus l’être après quatre-vingts."
    ]
  },

  "numerical-stability": {
    name: "Stabilité numérique",
    summary: "Le fait que de petites erreurs de représentation restent petites en traversant un calcul, ou qu’elles y soient amplifiées jusqu’à l’absurde.",
    intuition: "Une même formule peut s’écrire de plusieurs façons algébriquement identiques qui se comportent de manière complètement différente en précision finie. Une version stable garde les petites erreurs petites ; une version instable les amplifie jusqu’à rendre le résultat dénué de sens — ou jusqu’au débordement vers l’infini. Beaucoup de ce qui ressemble à des détails d’implémentation arbitraires dans le code des modèles relève en réalité de l’ingénierie de la stabilité.",
    equationNote: "Soustraire le maximum laisse le softmax mathématiquement inchangé — la constante s’annule en haut et en bas — mais le plus grand exposant devient exp(0) = 1, si bien que rien ne peut déborder. Le log-sum-exp applique la même astuce là où le logarithme est directement nécessaire. L’ε de la normalisation empêche de diviser par une variance arrondie à zéro.",
    legend: {
      "max z": "le plus grand logit, soustrait pour garder les exposants dans la plage",
      "ε": "une petite constante, typiquement 1e-5, protégeant le dénominateur",
      "σ²": "la variance des activations que l’on normalise",
      "κ": "le conditionnement — l’ampleur avec laquelle un calcul amplifie l’erreur d’entrée"
    },
    worked: "Softmax naïf sur de grands logits :\n\n  z = [1000, 999, 998]\n  exp(1000) déborde en fp32  →  inf / inf  →  NaN\n\nAvec le maximum soustrait :\n\n  z − max z = [0, −1, −2]\n  exp → [1,000, 0,368, 0,135],  somme = 1,503\n  softmax    = [0,665, 0,245, 0,090]\n\nMêmes mathématiques, résultat radicalement différent en virgule\nflottante. Tout softmax en production s’écrit de la seconde façon.",
    whyInAI: [
      "La perte est calculée à partir des logits plutôt que des probabilités précisément pour éviter de prendre le logarithme d’un nombre arrondi à zéro.",
      "L’epsilon de la normalisation de couche, l’écrêtage du gradient et la mise à l’échelle de la perte en précision mixte sont tous des mesures de stabilité, non des boutons de réglage.",
      "Une quantification agressive met la stabilité à rude épreuve — un schéma correct isolément peut produire des NaN une fois composé sur de nombreuses couches."
    ]
  },

  /* ================================================================= */
  /* Graphs & discrete mathematics                                      */
  /* ================================================================= */

  "graph-theory": {
    name: "Théorie des graphes",
    summary: "L’étude des objets et des liens qui les unissent, sous forme de nœuds reliés par des arêtes.",
    intuition: "Dès lors que ce qui compte n’est pas les choses elles-mêmes mais la façon dont elles se relient, vous avez un graphe. Les entités deviennent des nœuds, les relations des arêtes, et les questions de structure — qu’est-ce qui est relié à quoi, qu’est-ce qui est central, quel est le plus court chemin — deviennent calculables. Une fois écrit comme matrice d’adjacence, un graphe n’est d’ailleurs que de l’algèbre linéaire.",
    equationNote: "La dernière ligne fait le pont entre les deux points de vue : élever la matrice d’adjacence à la puissance k compte les chemins de longueur k entre chaque paire de nœuds. Le raisonnement multi-sauts sur un graphe de connaissances est, formellement, une multiplication matricielle.",
    legend: {
      "V": "l’ensemble des nœuds — entités, concepts, documents",
      "E": "l’ensemble des arêtes — les relations",
      "A": "la matrice d’adjacence, qui encode les paires reliées",
      "dᵢ": "le degré — combien d’arêtes touchent le nœud i"
    },
    worked: "Trois nœuds : 1—2, 2—3\n\n  A = ⎡ 0  1  0 ⎤\n      ⎢ 1  0  1 ⎥\n      ⎣ 0  1  0 ⎦\n\n  degrés : d₁ = 1, d₂ = 2, d₃ = 1\n\nLe nœud 2 est le pivot. Élever A au carré donne (A²)₁₃ = 1 :\nexactement un chemin à deux sauts de 1 vers 3, en passant par 2 —\nle genre de lien qu’une simple recherche textuelle ne ferait jamais\nremonter.",
    whyInAI: [
      "Un graphe de connaissances est cette structure appliquée aux entités et aux relations, offrant à la recherche ce qu’un index de documents à plat ne peut exprimer.",
      "GraphRAG parcourt les arêtes pour rassembler du contexte relié, si bien qu’une réponse peut reposer sur une chaîne de faits plutôt que sur un seul passage.",
      "Les plans d’agents, les dépendances entre outils et les pipelines RAG sont tous des graphes orientés, ce qui explique que la détection de cycles et le tri topologique comptent en pratique."
    ]
  },

  "nearest-neighbour-search": {
    name: "Recherche des plus proches voisins",
    summary: "Trouver dans une collection les éléments les plus proches d’un point de requête selon une mesure de distance ou de similarité.",
    intuition: "Dès lors que le sens est une position dans l’espace, la recherche devient de la géométrie : on plonge la requête, puis on cherche les vecteurs stockés les plus proches. Passer en revue tous les vecteurs est exact mais trop lent à grande échelle : les systèmes réels construisent donc un index — souvent un graphe navigable — et acceptent de renvoyer des réponses presque justes en échange d’une latence de l’ordre de la milliseconde. Cet arbitrage s’appelle la recherche approchée des plus proches voisins.",
    equationNote: "La recherche exacte compare la requête aux N vecteurs stockés, chacun de dimension d — linéaire en taille de corpus et sans espoir au-delà de quelques millions. Les méthodes approchées naviguent plutôt dans un graphe ou une partition de l’espace. Le rappel@k mesure ce que cette vitesse a coûté : la fraction des vrais k premiers effectivement revenus.",
    legend: {
      "q": "le vecteur de requête",
      "D": "la collection de vecteurs stockés",
      "N, d": "le nombre de vecteurs et leur dimension",
      "recall@k": "la qualité de la recherche — 1,0 signifie que l’approximation n’a rien manqué"
    },
    worked: "Requête q = [1, 0] ; trois candidats :\n\n  x₁ = [0,9, 0,1]   cos = 0,994\n  x₂ = [0,0, 1,0]   cos = 0,000\n  x₃ = [-1,0, 0,0]  cos = -1,000\n\n  top-1 → x₁\n\nSur 10 millions de vecteurs de dimension 768, la recherche exacte\nreprésente 7,68 milliards de multiplications-additions par requête.\nUn index HNSW répond en quelques millisecondes avec environ 95 à 99 %\nde rappel — l’exactitude que l’on échange contre un système capable\nde servir du trafic réel.",
    whyInAI: [
      "C’est l’étape de recherche du RAG : la qualité de tout ce qui suit est plafonnée par ce que contiennent ces voisins.",
      "Une base de données vectorielle est essentiellement un index de plus proches voisins autour duquel on a bâti stockage, filtrage et mises à jour.",
      "Rappel, latence et mémoire forment un arbitrage à trois — le réglage qui décide si un système RAG paraît exact ou rapide."
    ]
  },

  /* ================================================================= */
  /* Dynamical systems & control                                        */
  /* ================================================================= */

  "markov-process": {
    name: "Processus de Markov",
    summary: "Un modèle de système passant d’un état à l’autre, où l’état suivant ne dépend que de l’état courant.",
    intuition: "La propriété de Markov est une hypothèse simplificatrice au rendement énorme : l’état présent contient tout ce qui compte du passé. Nul besoin de porter l’historique, seulement de savoir où l’on est. Ajoutez des actions et des récompenses et vous obtenez un processus de décision markovien — le formalisme standard pour tout agent prenant une suite de décisions.",
    equationNote: "La première ligne est l’hypothèse elle-même : se conditionner sur tout l’historique donne la même réponse que se conditionner sur le seul état le plus récent. Le tuple en dessous ajoute les éléments nécessaires à la décision — états, actions, probabilités de transition, récompenses et facteur d’actualisation.",
    legend: {
      "s_t": "l’état à l’instant t",
      "a": "une action prise par l’agent",
      "P(s′ | s, a)": "probabilité d’atterrir en s′ après avoir pris a en s",
      "γ": "le facteur d’actualisation, qui privilégie les récompenses proches sur les lointaines"
    },
    worked: "Deux états, En marche et En panne :\n\n        →M     →P\n  M :  0,9    0,1\n  P :  0,3    0,7\n\nDepuis En marche, la chance d’être encore en marche dans deux étapes :\n\n  0,9 × 0,9 + 0,1 × 0,3 = 0,81 + 0,03 = 0,84\n\nRien de la façon dont la machine est arrivée en marche n’entre dans\nle calcul — c’est la propriété de Markov à l’œuvre.",
    whyInAI: [
      "L’apprentissage par renforcement se définit sur des processus de décision markoviens ; politiques, fonctions de valeur et retours présupposent tous cette structure.",
      "Le RLHF et PPO héritent du formalisme, traitant la génération comme une suite de décisions assortie d’une récompense finale.",
      "Cela nomme aussi une limite réelle : lorsque le véritable état n’est qu’en partie observé, l’hypothèse de Markov est une approximation, et la mémoire d’agent existe pour y remédier."
    ]
  },

  "expected-return": {
    name: "Retour espéré",
    summary: "La somme actualisée des récompenses futures qu’un agent attend d’un état, et que l’apprentissage par renforcement maximise.",
    intuition: "Un agent ne devrait pas courir après la prochaine récompense mais après le total qu’il peut accumuler. Le retour espéré additionne tout ce qui reste à venir, en actualisant les récompenses lointaines parce qu’elles sont moins certaines et moins urgentes. Le facteur d’actualisation est le curseur de patience de l’agent, et c’est la raison pour laquelle un système acceptera une étape immédiate médiocre en vue d’un meilleur résultat plus tard.",
    equationNote: "γ compris entre 0 et 1 fait converger la somme infinie et fixe l’horizon : γ = 0,9 regarde en pratique une dizaine d’étapes en avant, γ = 0,99 une centaine. L’équation de Bellman est la reformulation récursive qui rend le calcul possible — la valeur d’un état est la récompense immédiate plus la valeur actualisée de là où l’on atterrit ensuite.",
    legend: {
      "r_t": "la récompense reçue à l’instant t",
      "γ": "le facteur d’actualisation, entre 0 et 1",
      "V^π(s)": "le retour espéré depuis l’état s en suivant la politique π",
      "E_π": "l’espérance sur les trajectoires que produit la politique"
    },
    worked: "Des récompenses de 0, 0, puis 1, avec γ = 0,9 :\n\n  G = 0 + 0,9×0 + 0,81×1 = 0,81\n\nLa même récompense arrivant immédiatement vaudrait 1,0.\nAvec γ = 0,5 la récompense différée ne vaut plus que 0,25 — un agent\nbien plus myope.\n\nEn RLHF la récompense arrive une seule fois, à la fin d’une réponse\ngénérée : toute la séquence est donc créditée à partir d’un unique\nsignal terminal.",
    whyInAI: [
      "C’est l’objectif de l’apprentissage par renforcement : une politique est bonne exactement dans la mesure où elle produit un retour espéré élevé.",
      "Le RLHF remplace une récompense écrite à la main par un modèle entraîné sur des préférences humaines, mais la quantité maximisée reste la même.",
      "Comme le retour est une espérance, il doit être estimé à partir de trajectoires échantillonnées — d’où le caractère bruité et gourmand en échantillons de l’entraînement par renforcement."
    ]
  },

  "state-space-models": {
    name: "Modèles à espace d’états",
    summary: "Un modèle de séquence qui propage un état caché par une mise à jour linéaire, un pas de temps à la fois.",
    intuition: "Au lieu de laisser chaque position regarder toutes les autres, un modèle à espace d’états entretient un résumé glissant — l’état — et le met à jour à mesure que chaque nouvelle entrée arrive. Le coût croît avec la longueur de séquence plutôt qu’avec son carré. Ce qui a rendu cela praticable, c’est qu’une récurrence linéaire peut être déroulée en convolution et évaluée en parallèle à l’entraînement, puis exécutée pas à pas à l’inférence. On obtient la vitesse d’entraînement d’un transformer avec le coût d’inférence d’un réseau récurrent.",
    equationNote: "A décide de ce que l’état retient et de la vitesse à laquelle il oublie ; B de la façon dont l’entrée nouvelle y pénètre ; C de la façon dont l’état est relu. Comme la récurrence est linéaire, toute la séquence peut être calculée comme une seule convolution de noyau K — c’est ce qui rend l’entraînement parallèle plutôt que séquentiel.",
    legend: {
      "x_t": "l’état caché à l’étape t — le résumé glissant",
      "u_t": "l’entrée à l’étape t",
      "A, B, C, D": "les matrices apprises régissant mémoire, entrée, relecture et passage direct",
      "K": "le noyau de convolution en lequel la récurrence se déroule"
    },
    worked: "Un état unidimensionnel avec A = 0,9, B = 1, C = 1 :\n\n  x₁ = 0,9·0 + 1 = 1,00\n  x₂ = 0,9·1 + 0 = 0,90\n  x₃ = 0,9·0,9   = 0,81\n\nUne entrée unique à l’étape 1 contribue encore pour 0,81 trois étapes\nplus tard — l’état se souvient, en décroissant géométriquement.\n\nFixer A = 0,5 donne au contraire 0,25 dès l’étape 3 : une mémoire\nplus courte. Ce que le modèle apprend dans A, c’est la durée de\nrétention.",
    whyInAI: [
      "C’est l’architecture derrière les modèles de séquence à long contexte récents, offrant une croissance linéaire plutôt que quadratique en longueur de séquence.",
      "Elle donne une description précise de ce qu’est un état caché récurrent, et de la raison pour laquelle les gradients qui le traversent s’évanouissent ou explosent.",
      "Un modèle du monde est en substance un modèle à espace d’états : prédire l’état suivant à partir de l’état courant et de l’action entreprise."
    ]
  },

  "dynamical-systems": {
    name: "Systèmes dynamiques",
    summary: "Les mathématiques de l’évolution d’un état au cours du temps sous une règle fixe.",
    intuition: "Un système dynamique est un état accompagné d’une règle de mise à jour. La règle est fixe ; le comportement qu’elle engendre peut aller de la convergence vers un point de repos à l’absence totale de répétition. C’est le langage qui décrit les systèmes se déployant dans le temps, ce qu’un modèle du monde doit apprendre et ce qu’un modèle de séquence est implicitement.",
    equationNote: "Les deux premières lignes disent la même chose en temps continu et en temps discret : l’état suivant est fonction de l’état courant et d’une éventuelle entrée. La forme à espace d’états en est le cas particulier linéaire — et la structure derrière les architectures de séquence récentes, où A, B, C sont apprises et où la récurrence peut être évaluée en parallèle.",
    legend: {
      "x": "l’état — tout ce qu’il faut pour déterminer la suite",
      "u": "l’entrée ou la commande appliquée à chaque étape",
      "f": "la règle de transition",
      "A, B, C, D": "les matrices d’un modèle linéaire à espace d’états"
    },
    worked: "Un système discret unidimensionnel :\n\n  x_{t+1} = 0,5 x_t + u_t\n\nEn partant de x₀ = 8 sans aucune entrée :\n\n  8 → 4 → 2 → 1 → 0,5 → …\n\nIl décroît vers 0 — un système stable, parce que le multiplicateur\nest inférieur à 1. Portez-le à 1,5 et la même règle diverge. Qu’une\nrécurrence apprise se souvienne ou oublie, c’est cette propriété.",
    whyInAI: [
      "Un modèle du monde est un système dynamique appris : étant donné un état et une action, prédire l’état suivant.",
      "Les modèles de séquence à espace d’états sont littéralement la forme linéaire ci-dessus, avec des matrices apprises plutôt que spécifiées.",
      "L’échantillonnage par diffusion peut s’écrire comme la discrétisation d’un processus continu, ce qui a permis de dériver des solveurs plus rapides."
    ]
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
