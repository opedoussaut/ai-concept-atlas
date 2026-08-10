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
    summary: "Le champ général consistant à construire des systèmes qui accomplissent des tâches associées à l’intelligence humaine.",
    why: "L’IA est le concept générique qui relie perception, prédiction, langage, raisonnement, planification, génération et action.",
    how: "Les systèmes d’IA combinent données, algorithmes, modèles, puissance de calcul et retours d’expérience pour transformer des entrées en prédictions, décisions ou contenus utiles.",
    example: "Un assistant de maintenance lit une description de panne, retrouve la procédure adéquate et propose l’étape de diagnostic suivante.",
    mathNote: "L’intelligence artificielle est un terme générique, non une technique. Les mathématiques vivent dans les méthodes précises qu’elle rassemble — chacune ayant ses propres fondements."
  },
  ml: {
    name: "Apprentissage automatique",
    summary: "Des méthodes qui apprennent des régularités à partir de données plutôt que de s’appuyer uniquement sur des règles programmées explicitement.",
    why: "L’apprentissage automatique permet à un système d’améliorer ses prédictions et ses décisions lorsque les relations présentes dans les données sont trop complexes pour être codées à la main.",
    how: "Un algorithme d’apprentissage ajuste les paramètres du modèle pour réduire l’erreur sur des exemples, puis applique la régularité apprise à de nouvelles entrées.",
    example: "Un modèle apprend à partir de l’historique des capteurs à prédire si un composant risque de tomber en panne.",
    foundations: {
      "loss-functions": "L’apprentissage automatique se définit par le fait d’avoir un objectif à minimiser ; la perte est l’endroit où la tâche est réellement énoncée.",
      "gradient-descent": "Apprendre à partir de données, c’est ajuster les paramètres pour réduire cette perte, pas à pas.",
      "probability-distributions": "La plupart des méthodes modélisent explicitement l’incertitude plutôt que de s’engager sur une réponse unique.",
      "maximum-likelihood": "Ajuster un modèle à des données est, le plus souvent, une estimation par maximum de vraisemblance sous un autre nom."
    }
  },
  dl: {
    name: "Apprentissage profond",
    summary: "L’apprentissage automatique fondé sur des réseaux de neurones comportant de nombreuses couches de traitement.",
    why: "L’apprentissage profond est à l’origine de la plupart des avancées récentes en langage, vision, parole et IA générative.",
    how: "Des couches successives transforment progressivement l’entrée brute en représentations de plus en plus abstraites, tandis que l’entraînement ajuste des millions ou des milliards de paramètres.",
    example: "Un modèle de vision apprend les contours, puis les formes, puis les parties, puis les objets complets au fil des couches.",
    foundations: {
      "matrix-multiplication": "Un réseau profond est une pile de multiplications matricielles séparées par des non-linéarités.",
      "backpropagation": "La profondeur n’est entraînable que parce qu’une seule passe arrière donne le gradient de toutes les couches d’un coup.",
      "gradients": "Chacun de ces millions de paramètres est mis à jour à l’aide de sa propre dérivée partielle de la perte.",
      "gradient-descent": "L’optimiseur les applique répétitivement ; rien de plus exotique ne se produit.",
      "loss-functions": "Ce que devient le réseau est décidé par l’objectif, non par la seule architecture."
    }
  },
  nlp: {
    name: "Traitement automatique du langage naturel",
    summary: "Les techniques d’IA permettant de comprendre, de générer et de transformer le langage humain.",
    why: "Le TALN rend possibles la recherche, la traduction, le résumé, les assistants, l’extraction d’information et les interfaces conversationnelles.",
    how: "Le texte est converti en tokens puis en représentations numériques qu’un modèle traite pour classer, retrouver ou générer du langage.",
    example: "Un assistant résume un rapport technique et en extrait les décisions et les actions à mener.",
    foundations: {
      "vectors": "Le langage ne devient traitable qu’une fois les tokens représentés par des vecteurs.",
      "probability-distributions": "La plupart des tâches de langage se formulent comme une distribution sur les sorties possibles.",
      "cosine-similarity": "Comparer le sens entre deux fragments de texte est une opération géométrique dans cet espace."
    }
  },
  cv: {
    name: "Vision par ordinateur",
    summary: "Les méthodes d’IA permettant d’interpréter des images, des vidéos et d’autres signaux visuels.",
    why: "La vision par ordinateur soutient l’inspection, la robotique, l’imagerie médicale, les systèmes autonomes et la recherche visuelle.",
    how: "Les modèles apprennent des régularités spatiales et sémantiques pour classer des images, détecter des objets, segmenter des régions ou estimer le mouvement et la profondeur.",
    example: "Un modèle de contrôle qualité détecte les défauts de surface sur des pièces fabriquées.",
    foundations: {
      "matrix-multiplication": "La convolution sur une image s’implémente comme une multiplication matricielle sur des patches dépliés.",
      "vectors": "Pixels, patches et images entières deviennent tous des vecteurs avant qu’un modèle ne raisonne dessus.",
      "latent-space": "Ce qu’apprend un modèle de vision est une représentation compressée où la similarité visuelle devient géométrique."
    }
  },
  rl: {
    name: "Apprentissage par renforcement",
    summary: "Un apprentissage par interaction, où un agent cherche les actions qui maximisent la récompense cumulée.",
    why: "L’apprentissage par renforcement est utile pour les décisions séquentielles, le contrôle, la planification, la robotique et l’optimisation de préférences.",
    how: "L’agent observe un état, choisit une action, reçoit un retour et met à jour sa politique pour améliorer les résultats à long terme.",
    example: "Un robot apprend une politique de manipulation en recevant une récompense plus élevée pour les saisies réussies.",
    foundations: {
      "markov-process": "L’apprentissage par renforcement se définit sur un processus de décision markovien : états, actions, transitions et récompenses.",
      "expected-return": "La politique est optimisée pour maximiser la récompense future actualisée, non la récompense immédiate.",
      "probability-distributions": "Une politique est une distribution sur les actions étant donné un état.",
      "sampling": "Les retours sont estimés à partir de trajectoires échantillonnées, d’où le caractère bruité et gourmand en échantillons de l’entraînement.",
      "gradient-descent": "Les paramètres de la politique sont mis à jour par montée de gradient sur le retour estimé."
    }
  },
  genai: {
    name: "IA générative",
    summary: "Des systèmes d’IA qui créent du contenu nouveau : texte, images, audio, vidéo, code ou designs.",
    why: "L’IA générative transforme les régularités apprises en contenus, interfaces et flux de travail réutilisables, et non plus seulement en prédictions.",
    how: "Un modèle génératif estime la structure de ses données d’entraînement, puis échantillonne ou prédit de nouvelles sorties conditionnées par un prompt ou un contexte.",
    example: "Un modèle génère l’image d’un concept produit à partir d’un brief de design rédigé.",
    mathNote: "L’IA générative nomme une capacité plutôt qu’une méthode. Les mathématiques appartiennent aux architectures qui la réalisent : diffusion, transformers, auto-encodeurs."
  },
  "supervised-learning": {
    name: "Apprentissage supervisé",
    summary: "Un apprentissage à partir d’exemples associés à des étiquettes ou des sorties cibles connues.",
    why: "C’est l’approche standard lorsqu’on dispose d’exemples étiquetés fiables et qu’une tâche de prédiction précise est définie.",
    how: "Le modèle prédit une sortie, la compare à la bonne réponse et met à jour ses paramètres pour réduire l’écart.",
    example: "Entraîner un classifieur sur des images étiquetées comme conformes ou défectueuses.",
    foundations: {
      "cross-entropy": "La classification avec étiquettes connues s’entraîne par entropie croisée contre la bonne réponse.",
      "loss-functions": "Le choix de la perte est le choix de ce qui compte comme une erreur.",
      "gradient-descent": "Les paramètres sont ajustés par la même boucle d’optimisation que tout le reste.",
      "maximum-likelihood": "Minimiser cette perte revient à maximiser la vraisemblance des données étiquetées."
    }
  },
  "self-supervised-learning": {
    name: "Apprentissage auto-supervisé",
    summary: "L’apprentissage de représentations utiles en construisant les cibles d’entraînement à partir des données elles-mêmes.",
    why: "Il réduit la dépendance à des étiquettes humaines coûteuses et rend possible un pré-entraînement à très grande échelle.",
    how: "Le système prédit les parties masquées, manquantes ou transformées d’une entrée à partir du contexte restant.",
    example: "Un modèle de langage prédit le token suivant ; un modèle d’image prédit la représentation masquée d’une région.",
    foundations: {
      "loss-functions": "Toute la méthode consiste à construire une cible d’entraînement à partir des données elles-mêmes, exprimée comme une perte.",
      "cosine-similarity": "Les objectifs contrastifs évaluent une paire correspondante contre des alternatives non correspondantes par similarité cosinus.",
      "cross-entropy": "Les objectifs de masquage et de token suivant sont des entropies croisées sur l’élément caché.",
      "dot-product": "Le score de similarité au cœur d’une perte contrastive est un produit scalaire normalisé.",
      "vector-spaces": "Le résultat est un espace de représentation où la proximité signifie la parenté."
    }
  },
  "next-token-prediction": {
    name: "Prédiction du token suivant",
    summary: "L’objectif consistant à prédire le token suivant d’une séquence à partir de tout ce qui précède.",
    why: "C’est l’objectif d’entraînement de la plupart des modèles de langage : une tâche unique et sans étiquette, qui transforme n’importe quel corpus en supervision et fait émerger des capacités larges comme effet secondaire.",
    how: "Le modèle transforme son contexte en un score pour chaque token du vocabulaire, convertit ces scores en distribution de probabilité, et est entraîné à augmenter la probabilité du token qui a réellement suivi.",
    example: "Après « le rapport de maintenance a été », le modèle répartit la probabilité entre « transmis », « incomplet », « relu » et des milliers d’autres suites, puis en échantillonne ou en sélectionne une.",
    foundations: {
      "conditional-probability": "Le modèle calcule P(token suivant | tout ce qui précède) ; la règle de chaînage des probabilités est ce qui rend un document entier traitable un pas à la fois.",
      "logits": "La couche de sortie émet un score brut par entrée du vocabulaire.",
      "softmax": "Le softmax convertit ces scores en la distribution dont le token suivant est tiré.",
      "cross-entropy": "L’entraînement minimise la log-probabilité négative attribuée au token qui a réellement suivi.",
      "maximum-likelihood": "Cette perte est une estimation par maximum de vraisemblance sur le corpus, écrite sous forme logarithmique.",
      "sampling": "Le décodage — glouton, à température, top-k, top-p — est un choix sur la façon d’échantillonner dans la distribution obtenue."
    }
  },

  /* Model architectures ------------------------------------------------ */
  nn: {
    name: "Réseau de neurones",
    summary: "Un modèle paramétré construit à partir d’unités de calcul connectées et organisées en couches.",
    why: "Les réseaux de neurones peuvent approcher des relations très complexes et apprendre des représentations directement à partir des données.",
    how: "Chaque couche transforme ses entrées à l’aide de poids appris et de fonctions non linéaires ; la rétropropagation calcule comment ajuster ces poids.",
    example: "Un petit réseau relie les mesures d’un équipement à une durée de vie résiduelle prédite.",
    foundations: {
      "matrix-multiplication": "Une couche est une multiplication matricielle suivie d’une non-linéarité ; presque tout le calcul est là.",
      "gradients": "Chaque paramètre est mis à jour à l’aide du gradient de la perte par rapport à lui.",
      "backpropagation": "Une seule passe arrière produit tous ces gradients d’un coup, par la règle de dérivation en chaîne.",
      "loss-functions": "La perte définit ce que le réseau est réellement entraîné à faire.",
      "gradient-descent": "L’optimiseur applique ces gradients jusqu’à ce que la perte cesse de baisser.",
      "adam": "En pratique la mise à jour n’est pas une descente de gradient simple mais Adam, qui adapte le pas par paramètre."
    }
  },
  cnn: {
    name: "Réseau de neurones convolutif",
    summary: "Une architecture neuronale qui utilise des filtres appris pour détecter des motifs spatiaux locaux.",
    why: "Les réseaux convolutifs sont efficaces et performants sur les images, les signaux spatiaux et de nombreuses tâches d’inspection industrielle.",
    how: "Des filtres de convolution glissent sur l’entrée en partageant leurs poids et construisent des caractéristiques de niveau croissant.",
    example: "Un CNN détecte rayures et bosses sur les images caméra d’une ligne de production.",
    foundations: {
      "matrix-multiplication": "La convolution s’implémente comme une multiplication matricielle sur des patches d’entrée dépliés.",
      "gradients": "Les poids de filtre partagés accumulent les contributions de gradient de toutes les positions où ils ont été appliqués.",
      "backpropagation": "Ce partage de poids est ce qui rend une couche convolutive économe en paramètres tout en restant entraînable de bout en bout."
    }
  },
  rnn: {
    name: "Réseau de neurones récurrent",
    summary: "Un réseau de neurones qui réutilise un état caché au fil du traitement d’une séquence.",
    why: "Les réseaux récurrents ont introduit une façon praticable de modéliser des données ordonnées : texte, audio, séries temporelles.",
    how: "À chaque étape, le réseau combine l’entrée courante avec une représentation des étapes précédentes.",
    example: "Un RNN traite une suite de relevés de capteurs pour prévoir la valeur suivante.",
    foundations: {
      "dynamical-systems": "Un réseau récurrent est un système dynamique appris : un état propagé par une règle de mise à jour fixe.",
      "backpropagation": "L’entraînement déroule la récurrence et applique la règle de chaînage à rebours sur chaque pas.",
      "gradients": "Cette longue chaîne de facteurs est exactement la raison pour laquelle les gradients s’évanouissent ou explosent avec la longueur de séquence.",
      "matrix-multiplication": "Chaque pas applique les mêmes matrices de poids à l’état et à la nouvelle entrée.",
      "state-space-models": "Une récurrence linéaire est un modèle à espace d’états, ce qui a permis de rendre l’idée de nouveau entraînable en parallèle."
    }
  },
  lstm: {
    name: "Mémoire à long et court terme",
    summary: "Une architecture récurrente dotée de portes qui contrôlent ce qui est stocké, mis à jour et oublié.",
    why: "Les LSTM atténuent la difficulté qu’ont les RNN standards à apprendre des dépendances à longue portée.",
    how: "Des portes d’entrée, de sortie et d’oubli régulent un état de cellule persistant au fil du traitement de la séquence.",
    example: "Un LSTM exploite une longue série de conditions d’exploitation pour prédire la consommation d’énergie.",
    foundations: {
      "dynamical-systems": "L’état de cellule est une variable d’état dont la mise à jour est volontairement proche de l’identité, si bien que l’information persiste.",
      "gradients": "Les portes existent pour empêcher le gradient de décroître sur de nombreux pas — le problème même qu’elles ont été conçues pour résoudre.",
      "backpropagation": "L’entraînement reste une rétropropagation dans la séquence déroulée.",
      "matrix-multiplication": "Chaque porte est une transformation linéaire de l’entrée et de l’état précédent."
    }
  },
  transformer: {
    name: "Architecture Transformer",
    summary: "Une architecture de séquence centrée sur l’attention plutôt que sur la récurrence.",
    why: "Les transformers ont rendu praticable l’entraînement parallèle à grande échelle et sous-tendent la plupart des modèles de fondation actuels, en langage comme en multimodal.",
    how: "L’auto-attention permet à chaque token de pondérer la pertinence des autres, tandis que les couches feed-forward transforment les représentations obtenues.",
    example: "Un transformer rattache un pronom au nom concerné même lorsqu’ils sont éloignés dans un document.",
    foundations: {
      "matrix-multiplication": "L’attention et les blocs feed-forward sont des piles de multiplications matricielles ; c’est là que part la quasi-totalité du calcul.",
      "softmax": "Les poids d’attention comme la distribution du token de sortie sont des softmax.",
      "vector-spaces": "Chaque tête d’attention lit et écrit dans son propre sous-espace, ce qui permet à une couche de capter plusieurs types de relation.",
      "vector-norms": "La normalisation de couche remet chaque représentation à l’échelle selon ses propres statistiques pour garder les activations exploitables.",
      "backpropagation": "Les gradients remontent à travers chaque couche ; les connexions résiduelles existent pour empêcher ce chemin de s’évanouir.",
      "gradient-descent": "Entraîner la pile est une descente de gradient ordinaire, à très grande échelle."
    }
  },
  attention: {
    name: "Mécanisme d’attention",
    summary: "Un mécanisme qui permet à chaque position d’une séquence de pondérer la pertinence de toutes les autres.",
    why: "L’attention a remplacé les fenêtres fixes et la récurrence comme façon de traiter le contexte : des éléments distants peuvent s’influencer directement et en parallèle.",
    how: "Chaque position émet une requête, une clé et une valeur ; chaque requête est confrontée à chaque clé, les scores deviennent des poids par un softmax, et les valeurs sont mélangées selon ces poids.",
    example: "À la lecture de « la vanne a lâché parce qu’elle était corrodée », l’attention relie « elle » à « la vanne » et non à « parce que ».",
    foundations: {
      "dot-product": "Tout score d’attention est un produit scalaire entre une requête et une clé — un seul nombre disant la pertinence d’une position pour une autre.",
      "matrix-multiplication": "Confronter toutes les requêtes à toutes les clés d’un coup est une unique multiplication matricielle, Q Kᵀ.",
      "softmax": "Le softmax transforme ces scores bruts en poids de somme un, si bien que la sortie est une moyenne pondérée des valeurs.",
      "vector-spaces": "Requêtes, clés et valeurs sont des projections dans des sous-espaces appris distincts d’une même représentation.",
      "probability-distributions": "Les poids d’attention d’une position forment une distribution sur toute la séquence.",
      "basis-projection": "Requêtes, clés et valeurs sont trois projections apprises d’une même représentation dans des bases distinctes."
    }
  },
  "activation-function": {
    name: "Fonction d’activation",
    summary: "Une petite fonction non linéaire appliquée à chaque valeur d’une couche, sans laquelle un réseau profond s’effondrerait en un unique réseau linéaire.",
    why: "Empiler des couches linéaires ne produit qu’une autre couche linéaire : la profondeur n’apporterait rien. La non-linéarité intercalée est toute la raison pour laquelle un réseau profond peut représenter davantage qu’une multiplication matricielle.",
    how: "Elle s’applique terme à terme après une projection linéaire. ReLU annule simplement les valeurs négatives ; GELU et SiLU en sont des versions lisses qui y conservent un léger gradient. Les variantes à porte comme SwiGLU coupent la projection en deux et utilisent une moitié pour moduler l’autre, ce qui permet à la couche d’atténuer sa propre sortie.",
    example: "Les blocs feed-forward des transformers modernes utilisent SwiGLU plutôt que ReLU, parce que la porte laisse une couche décider quelle proportion de chaque caractéristique transmettre, et non seulement si elle doit la transmettre.",
    foundations: {
      "gradients": "Une activation est choisie pour sa dérivée — le zéro plat de ReLU sur les négatifs explique exactement pourquoi des unités meurent et pourquoi des alternatives lisses l’ont remplacée.",
      "backpropagation": "La règle de chaînage multiplie une dérivée d’activation par couche : un choix saturant fait donc s’évanouir les gradients avec la profondeur.",
      "numerical-stability": "Les exponentielles de la sigmoïde et de GELU demandent des précautions en basse précision, d’où des noyaux fusionnés qui les calculent dans un format plus large.",
      "matrix-multiplication": "L’activation s’intercale entre deux multiplications matricielles ; une variante à porte exige une troisième projection, ce qui explique que les largeurs cachées soient rognées en compensation."
    }
  },
  "layer-normalization": {
    name: "Normalisation de couche",
    summary: "Le réajustement du vecteur de chaque token selon ses propres statistiques, pour que les activations restent dans une plage exploitable quelle que soit la profondeur de la pile.",
    why: "Sans elle, l’échelle des activations dérive de couche en couche, les gradients explosent ou s’évanouissent, et l’entraînement devient extrêmement sensible à l’initialisation et au taux d’apprentissage. C’est l’un des éléments les moins spectaculaires et les plus porteurs d’un transformer.",
    how: "Pour chaque token indépendamment, on soustrait la moyenne sur les caractéristiques et on divise par l’écart-type, puis on applique une échelle et un décalage appris. RMSNorm abandonne la soustraction de la moyenne et divise par la moyenne quadratique — moins coûteux et, en pratique, tout aussi efficace, d’où son adoption par la plupart des modèles actuels. Placer la normalisation avant chaque sous-couche plutôt qu’après est ce qui rend les piles très profondes entraînables sans échauffement du taux d’apprentissage.",
    example: "Un transformer de cent couches s’entraîne de façon stable en pré-normalisation RMSNorm, là où la conception post-normalisation d’origine, à profondeur égale, divergerait dans les premiers milliers de pas.",
    foundations: {
      "vector-norms": "RMSNorm divise par la norme L2 mise à l’échelle par √d : la normalisation est donc littéralement une projection sur une sphère de rayon fixe.",
      "numerical-stability": "L’ε du dénominateur n’existe que pour empêcher une division par une norme quasi nulle ; c’est la différence entre un modèle stable et un entraînement plein de NaN.",
      "gradients": "Normaliser remodèle la surface de perte de sorte que la magnitude du gradient cesse de dépendre de l’échelle des activations entrantes.",
      "probability-distributions": "Moyenne et variance sur les caractéristiques sont les seules statistiques utilisées — un résumé volontairement grossier qui se révèle suffisant."
    }
  },
  "residual-connection": {
    name: "Connexion résiduelle",
    summary: "L’ajout de l’entrée d’une couche à sa sortie, si bien que chaque couche apprend une correction plutôt qu’une représentation entièrement nouvelle.",
    why: "C’est ce qui rend les réseaux très profonds entraînables tout court. Les gradients atteignent les premières couches par l’addition au lieu d’être atténués par chaque couche intermédiaire, et une couche qui n’a rien d’utile à apporter peut produire une sortie proche de zéro au lieu de devoir reproduire son entrée.",
    how: "Le bloc calcule x + f(x) au lieu de f(x). Cette addition crée un chemin direct pour le signal à l’aller comme pour le gradient au retour. La somme courante le long de la pile s’appelle le flux résiduel : chaque couche lit l’état accumulé, calcule quelque chose, et y réinjecte son résultat.",
    example: "Dans un bloc de transformer, l’attention et le réseau feed-forward ajoutent au flux au lieu de le remplacer — d’où le fait que des couches isolées puissent souvent être retirées d’un modèle entraîné sans qu’il cesse de produire des sorties sensées.",
    foundations: {
      "backpropagation": "La dérivée de x + f(x) contient un terme identité : la règle de chaînage dispose donc toujours d’un chemin non atténué vers les couches antérieures.",
      "gradients": "L’évanouissement du gradient avec la profondeur est précisément le problème que les connexions résiduelles ont été introduites pour résoudre.",
      "vector-spaces": "Le flux résiduel est un espace partagé unique où chaque couche lit et écrit, ce qui rend possible le travail d’interprétabilité qui s’y appuie."
    }
  },
  "positional-encoding": {
    name: "Encodage positionnel",
    summary: "Le signal qui indique au transformer où se situe chaque token, l’attention seule traitant une séquence comme un ensemble non ordonné.",
    why: "L’attention est équivariante par permutation : mélangez les entrées et les sorties se mélangent à l’identique. Sans information de position, « la vanne a lâché » et « a lâché la vanne » sont la même entrée : l’ordre doit donc être injecté délibérément.",
    how: "Le transformer d’origine ajoutait des vecteurs sinusoïdaux fixes aux embeddings, et les modèles suivants ont plutôt appris des embeddings de position absolue. La pratique actuelle est l’embedding rotatif, qui fait tourner chaque requête et chaque clé d’un angle proportionnel à sa position. Comme le produit scalaire de deux vecteurs ainsi tournés ne dépend que de la différence de leurs angles, le score d’attention obtenu dépend de la distance relative plutôt que de l’indice absolu.",
    example: "Un modèle entraîné sur 8 k tokens peut être étendu à 128 k en interpolant les fréquences de rotation plutôt qu’en le réentraînant — une possibilité qui n’existe que parce que l’encodage est relatif.",
    foundations: {
      "dot-product": "Toute la propriété de position relative découle du fait qu’une rotation laisse les produits scalaires inchangés.",
      "basis-projection": "L’embedding est découpé en sous-espaces de dimension deux, chacun tourné dans son propre plan à sa propre fréquence.",
      "matrix-multiplication": "La rotation est une matrice orthogonale diagonale par blocs, appliquée en pratique comme un simple échange par paires plutôt qu’une multiplication complète.",
      "vector-spaces": "La position devient une propriété géométrique de la direction d’un vecteur, non une caractéristique ajoutée à côté."
    }
  },
  "linear-attention": {
    name: "Mécanisme d’attention linéaire",
    summary: "Une famille de variantes de l’attention qui abandonnent le softmax : le coût croît linéairement avec la longueur de séquence au lieu de quadratiquement, au prix du rappel exact.",
    why: "L’attention standard compare chaque token à tous les autres : le calcul comme le cache KV croissent avec la longueur de la conversation. L’attention linéaire entretient à la place un état de taille fixe, ce qui rend les très longs contextes abordables à servir.",
    how: "Le softmax applique sa non-linéarité après le produit requête-clé, ce qui couple chaque requête à chaque clé. L’attention linéaire applique une transformation de caractéristiques séparément aux requêtes et aux clés, ce qui rend le produit réassociable : au lieu de calculer (QKᵀ)V on calcule Q(KᵀV), en repliant toutes les clés et valeurs dans une unique matrice d’état de taille fixe. Chaque nouveau token y écrit par un produit extérieur. Les variantes ultérieures ajoutent un moyen de retirer de l’information autant que d’en ajouter — la règle delta remplace ce qu’une clé contenait déjà, et un mécanisme de porte fait décroître l’état pour que les associations anciennes s’effacent.",
    example: "Générer le cent-millième token coûte autant que le centième, parce que le modèle lit un état de taille fixe et non un cache devenu grand de cent mille entrées.",
    foundations: {
      "outer-product": "Chaque token inscrit sa paire clé-valeur dans l’état par un unique produit extérieur — l’état est leur somme courante.",
      "matrix-multiplication": "Toute l’économie vient de l’associativité de la multiplication matricielle, qui permet de déplacer les parenthèses hors du terme en n × n.",
      "matrix-rank": "Un état d × d ne peut porter que d directions indépendantes ; au-delà, les associations interfèrent. C’est le coût exact de l’abandon du softmax.",
      "state-space-models": "Écrite comme une récurrence, une couche d’attention linéaire est un modèle à espace d’états dont l’état est une matrice.",
      "dot-product": "Relire l’état reste un produit scalaire entre une requête et ce qui a été stocké dans chaque direction de clé."
    }
  },
  ssm: {
    name: "Modèle à espace d’états",
    summary: "Une architecture de séquence qui propage un état de taille fixe par une récurrence linéaire, offrant un coût et une mémoire constants par token.",
    why: "Elle fait revivre ce que la récurrence réussissait — mémoire bornée, pas de cache qui enfle — tout en restant entraînable en parallèle, ce qui était précisément la raison pour laquelle les réseaux récurrents avaient perdu face aux transformers.",
    how: "Un vecteur d’état est mis à jour à chaque pas par une règle linéaire, puis relu. Comme la mise à jour est linéaire, toute la séquence peut être calculée à l’entraînement par un balayage parallèle plutôt que pas à pas. Les variantes sélectives comme Mamba font dépendre la mise à jour de l’entrée courante, si bien que le modèle choisit ce qu’il conserve et ce qu’il écarte au lieu de tout faire décroître uniformément.",
    example: "Les modèles à long contexte alternent de plus en plus des couches à espace d’états avec quelques couches d’attention complète — mémoire à coût constant pour l’essentiel de la pile, rappel exact là où la tâche l’exige vraiment.",
    foundations: {
      "state-space-models": "L’architecture tire son nom de l’équation : un état mis à jour par x′ = Ax + Bu et relu par y = Cx.",
      "dynamical-systems": "Le modèle est un système appris évoluant dans le temps ; son comportement sur de longues séquences est une question de stabilité de ce système.",
      "eigenvalues": "Les valeurs propres de la matrice de transition fixent la vitesse à laquelle l’information stockée décroît — d’où leur paramétrage pour rester dans le disque unité.",
      "outer-product": "Une mise à jour dépendant de l’entrée écrit dans l’état de la même façon que l’attention linéaire, par un produit extérieur d’une paire dérivée de l’entrée.",
      "matrix-multiplication": "Rendre la récurrence parallèle revient à la réexprimer comme un balayage de produits matriciels plutôt qu’une boucle séquentielle."
    }
  },
  mla: {
    name: "Attention latente multi-têtes",
    summary: "Une variante de l’attention qui met en cache un petit vecteur compressé par token au lieu des clés et valeurs complètes, en les reconstruisant implicitement au moment de l’attention.",
    why: "Elle s’attaque au même goulot d’étranglement que l’attention à requêtes groupées — c’est le cache KV, et non les poids, qui limite en général le nombre de conversations qu’un serveur peut tenir simultanément — mais par compression plutôt que par partage, ce qui préserve davantage la qualité de l’attention multi-têtes complète.",
    how: "Les clés et valeurs de chaque token sont projetées vers un vecteur latent de faible dimension, et seul ce vecteur est stocké. Les matrices de reprojection sont ensuite absorbées dans les projections de requête et de sortie, si bien que les clés et valeurs complètes ne sont jamais reconstruites explicitement et que l’économie est réelle et non différée.",
    example: "Un modèle met en cache quelques centaines de nombres par token et par couche au lieu de plusieurs milliers, si bien qu’une longue conversation reste en mémoire là où il faudrait sinon l’évincer puis la recalculer.",
    foundations: {
      "low-rank-factorization": "Les projections de clés et de valeurs passent par une dimension latente étroite — la même astuce que LoRA, appliquée au cache plutôt qu’aux poids.",
      "matrix-rank": "La largeur latente est le rang conservé, et c’est l’unique curseur arbitrant entre taille du cache et part de l’attention d’origine préservée.",
      "matrix-multiplication": "Absorber la reprojection dans les projections de requête et de sortie n’est qu’une réassociation de produit — ce qui rend la compression gratuite à l’inférence.",
      "singular-value-decomposition": "C’est la façon naturelle de raisonner sur les directions qu’une projection de rang faible doit conserver.",
      "basis-projection": "Le vecteur latent est l’expression des clés et valeurs du token dans une base apprise plus petite."
    }
  },
  llm: {
    name: "Grand modèle de langage",
    summary: "Un modèle de grande capacité entraîné sur de vastes corpus textuels ou multimodaux pour traiter et générer du langage.",
    why: "Les LLM offrent des capacités larges et réutilisables, adaptables par les prompts, la recherche d’information, les outils et le fine-tuning.",
    how: "La plupart des LLM utilisent des transformers pour prédire des tokens à partir du contexte, puis passent par une adaptation supplémentaire pour le suivi d’instructions et la sûreté.",
    example: "Un LLM explique une norme technique, rédige du code et appelle un outil de recherche lorsqu’il lui faut des éléments à jour.",
    foundations: {
      "conditional-probability": "Un modèle de langage calcule la probabilité du token suivant sachant tout ce qui précède.",
      "softmax": "Les scores de la couche de sortie deviennent une distribution sur tout le vocabulaire, à chaque étape.",
      "cross-entropy": "L’entraînement est une entropie croisée contre le token qui a réellement suivi, sur des milliers de milliards de positions.",
      "matrix-multiplication": "La quasi-totalité du calcul, à l’entraînement comme à l’inférence, est de la multiplication matricielle.",
      "sampling": "La façon dont le token suivant est tiré de la distribution est une décision distincte et réglable."
    }
  },
  slm: {
    name: "Petit modèle de langage",
    summary: "Un modèle de langage conçu avec moins de paramètres et des besoins en calcul ou en mémoire inférieurs à ceux des LLM de pointe.",
    why: "Les petits modèles réduisent la latence, le coût et la consommation d’énergie, et peuvent tourner sur des équipements en périphérie ou une infrastructure privée.",
    how: "Ils reprennent des architectures proches de celles des LLM mais s’appuient sur une capacité réduite, un entraînement efficace, la distillation ou la spécialisation sur une tâche.",
    example: "Un modèle compact tourne localement sur un poste industriel pour classer les demandes de maintenance.",
    foundations: {
      "floating-point": "Faire tenir un modèle performant dans une faible empreinte est surtout une question du nombre de bits accordé à chaque poids.",
      "cross-entropy": "L’objectif d’entraînement est inchangé par rapport à ses homologues plus grands.",
      "kl-divergence": "Les petits modèles sont souvent distillés depuis de grands en épousant la distribution de l’enseignant."
    }
  },
  vlm: {
    name: "Modèle vision-langage",
    summary: "Un modèle qui traite conjointement l’information visuelle et le langage naturel.",
    why: "Les modèles vision-langage rendent images et vidéos accessibles par le questionnement, la recherche, le raisonnement et la génération en langage naturel.",
    how: "Des encodeurs visuels et des composants de langage sont alignés dans une représentation partagée ou reliés par attention croisée.",
    example: "Un VLM examine la photo d’un équipement et répond quel composant paraît endommagé.",
    foundations: {
      "vector-spaces": "Images et texte ne sont comparables que parce que tous deux sont projetés dans un même espace partagé.",
      "cosine-similarity": "L’alignement entre une image et une légende se mesure comme un angle dans cet espace.",
      "latent-space": "Chaque modalité est d’abord compressée en une représentation apprise avant d’être alignée."
    }
  },
  moe: {
    name: "Mélange d’experts",
    summary: "Une architecture qui achemine chaque entrée vers un sous-ensemble de blocs de paramètres spécialisés appelés experts.",
    why: "Le mélange d’experts augmente la capacité totale du modèle sans activer tous les paramètres pour chaque token.",
    how: "Un routeur appris sélectionne un petit nombre d’experts dont les sorties sont combinées pour l’entrée courante.",
    example: "Des experts différents deviennent plus utiles pour le code, les mathématiques ou les régularités du langage naturel.",
    foundations: {
      "softmax": "Le routeur applique un softmax aux scores des experts pour décider lesquels traitent chaque token.",
      "probability-distributions": "Les poids de routage forment une distribution ; des termes d’équilibrage de charge sont ajoutés pour l’empêcher de se replier sur quelques experts.",
      "matrix-multiplication": "Chaque expert est un bloc feed-forward ordinaire de multiplications matricielles.",
      "gradient-descent": "Routeur et experts sont entraînés conjointement, ce qui rend l’équilibrage du routage réellement difficile."
    }
  },
  gan: {
    name: "Réseau antagoniste génératif",
    summary: "Un cadre génératif où un générateur et un discriminateur progressent par entraînement antagoniste.",
    why: "Les GAN ont établi des méthodes puissantes pour générer des images réalistes et apprendre des distributions de données.",
    how: "Le générateur produit des échantillons pendant que le discriminateur tente de distinguer les échantillons générés des vrais.",
    example: "Un GAN crée des images synthétiques ressemblant à un ensemble de textures produit.",
    foundations: {
      "probability-distributions": "Le générateur est entraîné jusqu’à ce que sa distribution de sortie soit indiscernable de celle des données.",
      "loss-functions": "L’objectif antagoniste est un jeu minimax entre deux réseaux aux pertes opposées.",
      "sampling": "La génération consiste à décoder un tirage latent aléatoire.",
      "gradient-descent": "Les deux réseaux sont mis à jour par pas de gradient l’un contre l’autre, d’où un entraînement qui peut osciller au lieu de converger."
    }
  },
  vae: {
    name: "Auto-encodeur variationnel",
    summary: "Un auto-encodeur probabiliste qui apprend une distribution latente structurée, utile pour la génération et l’apprentissage de représentations.",
    why: "Les auto-encodeurs variationnels offrent une manière rigoureuse d’encoder des données dans un espace latent continu et d’en générer de nouvelles.",
    how: "Un encodeur prédit une distribution de probabilité dans l’espace latent ; un décodeur reconstruit les données à partir de variables latentes échantillonnées.",
    example: "Interpoler entre deux points latents produit des variations progressives de la forme d’un composant.",
    foundations: {
      "probability-distributions": "Un VAE modélise les données comme une distribution sur une variable latente plutôt que comme un encodage unique.",
      "kl-divergence": "Le terme de régularisation est une divergence KL qui tire la distribution latente apprise vers un a priori simple.",
      "sampling": "La génération tire un échantillon latent et le décode.",
      "latent-space": "L’espace latent structuré est l’objet d’intérêt, non un simple intermédiaire.",
      "loss-functions": "L’entraînement arbitre entre qualité de reconstruction et ce terme KL."
    }
  },
  diffusion: {
    name: "Modèle de diffusion",
    summary: "Un modèle génératif qui apprend à inverser un processus de bruitage progressif.",
    why: "Les modèles de diffusion portent la génération d’images de haute qualité et gagnent l’audio, la vidéo et la génération scientifique.",
    how: "L’entraînement apprend au modèle à retirer du bruit à différents niveaux ; la génération part du bruit et le débruite itérativement.",
    example: "Un modèle de diffusion conditionné par du texte génère le rendu d’un produit à partir d’un prompt de design.",
    foundations: {
      "probability-distributions": "L’entraînement apprend la distribution des données ; la génération y puise.",
      "sampling": "La génération est une longue chaîne d’étapes d’échantillonnage qui transforme peu à peu du bruit en structure.",
      "loss-functions": "Le modèle est entraîné à prédire le bruit ajouté, évalué par erreur quadratique.",
      "gradients": "Les formulations par score le disent explicitement : le réseau estime le gradient de la log-densité.",
      "dynamical-systems": "La boucle d’échantillonnage est la discrétisation d’un processus continu, ce qui a permis de dériver des solveurs plus rapides."
    }
  },
  jepa: {
    name: "Architecture prédictive à plongement conjoint",
    summary: "Une architecture prédictive qui apprend en anticipant des représentations plutôt qu’en reconstruisant chaque détail de l’entrée.",
    why: "JEPA vise à apprendre des représentations du monde abstraites et sémantiques, utiles au raisonnement et à la planification.",
    how: "Un encodeur de contexte prédit la représentation latente d’une région cible ou d’un état futur, en évitant toute reconstruction directe au niveau du pixel.",
    example: "Un JEPA sur images prédit la représentation d’une région masquée à partir du contexte visuel environnant.",
    foundations: {
      "latent-space": "Le choix qui définit JEPA est de prédire dans l’espace latent plutôt que de reconstruire l’entrée, si bien que la capacité n’est pas dépensée sur du détail imprévisible.",
      "loss-functions": "L’objectif est une perte de prédiction entre la représentation prédite et la représentation réelle.",
      "vectors": "Contexte et cible sont tous deux des vecteurs ; la prédiction est vectorielle.",
      "cosine-similarity": "L’accord entre représentation prédite et représentation cible se mesure géométriquement.",
      "gradient-descent": "L’entraînement est une descente de gradient standard sur cette perte de prédiction latente."
    }
  },
  "world-model": {
    name: "Modèle du monde",
    summary: "Un modèle interne appris de l’évolution d’un environnement, utilisé pour prédire ce qui va se passer ensuite.",
    why: "Un agent capable de simuler les conséquences en interne peut planifier, évaluer des options et apprendre de déroulés imaginés, au lieu de payer le coût de chaque expérience dans le monde réel.",
    how: "Le système encode les observations en un état compact, apprend une fonction de transition qui prédit l’état suivant à partir de l’état courant et d’une action, et utilise cette fonction pour dérouler l’avenir.",
    example: "Un robot apprend comment les objets se déplacent sur un convoyeur, puis répète une saisie en interne avant de la tenter, en écartant les approches que son modèle prédit vouées à l’échec.",
    foundations: {
      "state-space-models": "Un modèle du monde est en substance un modèle à espace d’états : propager un état compact, une transition à la fois.",
      "dynamical-systems": "Ce que l’on apprend est une règle de transition — l’objet qui définit un système dynamique.",
      "markov-process": "La prédiction suppose que l’état courant suffit ; là où ce n’est pas le cas, le modèle travaille sur une observation partielle.",
      "latent-space": "L’état est une représentation latente apprise, non l’observation brute, ce qui garde les déroulés peu coûteux.",
      "loss-functions": "L’entraînement minimise l’écart entre l’état suivant prédit et l’état observé."
    }
  },

  /* Training & adaptation ---------------------------------------------- */
  pretraining: {
    name: "Pré-entraînement",
    summary: "La phase d’entraînement initiale à grande échelle, qui apprend des régularités larges et réutilisables avant toute adaptation à une tâche.",
    why: "Le pré-entraînement produit des représentations et des capacités générales qui réduisent la quantité de données nécessaire aux tâches en aval.",
    how: "Un modèle optimise un objectif auto-supervisé ou supervisé sur un jeu de données vaste et varié.",
    example: "Un modèle de langage apprend la syntaxe, des faits et des motifs de code en prédisant des tokens sur un large corpus.",
    foundations: {
      "cross-entropy": "La perte de pré-entraînement est une entropie croisée sur le token suivant, moyennée sur des milliers de milliards d’occurrences.",
      "gradient-descent": "Les poids sont appris par descente de gradient sur de très grands lots.",
      "maximum-likelihood": "Cet objectif est une estimation par maximum de vraisemblance sur le corpus.",
      "floating-point": "La précision mixte est ce qui rend l’entraînement à cette échelle simplement abordable.",
      "adam": "Tout grand entraînement annonce un taux d’apprentissage Adam ; l’optimiseur fait partie de la recette."
    }
  },
  "fine-tuning": {
    name: "Fine-tuning",
    summary: "Un entraînement supplémentaire qui adapte un modèle pré-entraîné à une tâche, un domaine, un style ou un comportement.",
    why: "Le fine-tuning rend un modèle généraliste plus exact et plus régulier sur un cas d’usage défini.",
    how: "L’entraînement se poursuit sur un jeu de données ciblé et plus petit, en mettant à jour tous les paramètres ou un sous-ensemble économe.",
    example: "Un modèle de langage généraliste est affiné sur des paires question-réponse de maintenance validées.",
    foundations: {
      "loss-functions": "L’adaptation se définit par la perte choisie pour la tâche visée.",
      "gradient-descent": "Le mécanisme est la même boucle d’optimisation que le pré-entraînement, en général à un taux bien plus faible.",
      "cross-entropy": "Le fine-tuning supervisé réutilise l’objectif de pré-entraînement sur des données sélectionnées.",
      "regularization": "Adapter sur un petit jeu de données est là où le surapprentissage mord le plus, si bien que le terme de pénalité compte davantage qu’au pré-entraînement."
    }
  },
  sft: {
    name: "Fine-tuning supervisé",
    summary: "Un fine-tuning sur des exemples entrée-sortie sélectionnés qui démontrent le comportement attendu.",
    why: "Le fine-tuning supervisé est l’étape centrale qui apprend à un modèle de fondation à suivre des instructions et à produire des réponses adaptées à la tâche.",
    how: "Le modèle est entraîné à reproduire une réponse cible à partir d’une instruction et d’un contexte.",
    example: "Le modèle apprend à répondre aux questions de maintenance dans un format pas-à-pas approuvé.",
    foundations: {
      "cross-entropy": "Le SFT est un entraînement par entropie croisée sur des paires instruction-réponse sélectionnées.",
      "gradient-descent": "Rien ne change du côté de l’optimiseur ; seules les données changent.",
      "maximum-likelihood": "Le modèle est ajusté pour rendre les réponses démontrées maximalement probables."
    }
  },
  peft: {
    name: "Fine-tuning économe en paramètres",
    summary: "Une famille de méthodes d’adaptation qui n’entraînent qu’une petite fraction des paramètres d’un modèle.",
    why: "Le fine-tuning économe en paramètres réduit les besoins en mémoire, en stockage et en calcul tout en préservant le modèle de base d’origine.",
    how: "De petits modules entraînables, des prompts ou des mises à jour de rang faible sont ajoutés tandis que l’essentiel des poids de base reste gelé.",
    example: "Un même modèle de base partagé porte plusieurs adaptateurs métier sans stocker une copie complète du modèle pour chaque domaine.",
    foundations: {
      "low-rank-factorization": "La plupart des méthodes PEFT confinent la mise à jour à une petite forme factorisée au lieu de toucher chaque poids.",
      "matrix-rank": "La prémisse commune est qu’une mise à jour de rang plein est inutile pour l’adaptation.",
      "gradient-descent": "Seul le petit ensemble de paramètres ajoutés reçoit des gradients, d’où vient l’économie de mémoire.",
      "singular-value-decomposition": "La décroissance des valeurs singulières mesure la redondance d’une matrice de poids, et donc le peu qu’il faut entraîner."
    }
  },
  lora: {
    name: "Adaptation de rang faible",
    summary: "Une méthode PEFT qui apprend des mises à jour de poids de rang faible tout en gardant gelés les poids du modèle d’origine.",
    why: "LoRA rend l’adaptation d’un modèle bien plus économe en mémoire et en stockage qu’un fine-tuning complet.",
    how: "Plutôt que de modifier directement une grande matrice de poids, LoRA représente sa mise à jour comme le produit de deux matrices entraînables bien plus petites.",
    example: "Un adaptateur LoRA distinct spécialise un modèle de base sur le vocabulaire de la durabilité.",
    foundations: {
      "matrix-rank": "LoRA repose sur l’affirmation que la mise à jour de poids nécessaire à l’adaptation est de rang intrinsèque faible.",
      "low-rank-factorization": "Cette mise à jour est stockée comme deux matrices fines dont le produit a la forme d’origine — moins de 1 % des paramètres au rang 16.",
      "matrix-multiplication": "Appliquer l’adaptateur, c’est le produit B A, ajouté au poids gelé.",
      "outer-product": "Au rang r, la mise à jour B A est une somme de r produits extérieurs — r directions indépendantes ajoutées au poids gelé.",
      "matrices": "Les poids de base gelés et l’adaptateur entraîné sont l’un comme l’autre des matrices ordinaires.",
      "vector-spaces": "Choisir le rang r confine la mise à jour à un sous-espace de dimension r parmi tous les changements possibles.",
      "gradient-descent": "Seuls B et A reçoivent des gradients ; l’optimiseur est par ailleurs inchangé.",
      "singular-value-decomposition": "La meilleure approximation de rang r d’une matrice est sa SVD tronquée, ce qui rend un petit r défendable plutôt qu’arbitraire."
    }
  },
  qlora: {
    name: "Adaptation de rang faible quantifiée",
    summary: "Une méthode de fine-tuning qui associe un modèle de base gelé et quantifié à des adaptateurs LoRA entraînables.",
    why: "QLoRA réduit fortement les besoins en mémoire et permet d’adapter de plus grands modèles sur du matériel plus accessible.",
    how: "Les poids de base sont stockés dans une représentation à faible nombre de bits tandis que les gradients mettent à jour de petites matrices LoRA en précision supérieure.",
    example: "Un grand modèle de langage est adapté sur un seul GPU à grande mémoire, sans charger tous les poids de base en pleine précision.",
    foundations: {
      "low-rank-factorization": "QLoRA conserve exactement la mise à jour factorisée de LoRA.",
      "floating-point": "Le modèle de base est tenu en précision 4 bits, ce qui permet à un grand modèle de tenir sur un seul accélérateur.",
      "rounding-error": "Chaque poids quantifié se cale sur la valeur représentable la plus proche ; ce budget d’erreur décide si la qualité survit.",
      "matrix-rank": "L’hypothèse de rang faible derrière LoRA s’applique toujours à l’adaptateur.",
      "numerical-stability": "Les adaptateurs sont entraînés en précision supérieure par-dessus la base quantifiée pour que les gradients restent sages."
    }
  },
  "contrastive-learning": {
    name: "Apprentissage contrastif",
    summary: "Entraîner un modèle à rapprocher les paires correspondantes dans l’espace de représentation et à en éloigner tout le reste.",
    why: "Il produit des représentations utiles sans étiquettes, et c’est ainsi que texte et images sont amenés dans un même espace partagé — le fondement de la recherche d’information moderne et des modèles multimodaux.",
    how: "Chaque exemple est apparié à une correspondance authentique et à un lot de non-correspondances ; la perte récompense un score de similarité élevé pour la vraie paire par rapport à toutes les autres.",
    example: "Un modèle entraîné sur des paires image-légende apprend à placer la photo d’une turbine et les mots « éolienne » quasiment au même endroit, si bien que l’une retrouve l’autre.",
    foundations: {
      "cosine-similarity": "Le score que l’on pousse vers le haut pour la vraie paire et vers le bas pour les autres est une similarité cosinus.",
      "dot-product": "Cette similarité est un produit scalaire normalisé ; l’accord brut est calculé d’abord.",
      "loss-functions": "La perte contrastive n’a pas de cible fixe — elle exige seulement que la correspondance devance les alternatives.",
      "softmax": "Les scores du lot sont convertis en distribution, une température réglant la netteté.",
      "vector-spaces": "Le résultat est un espace partagé où la proximité signifie la parenté, entre modalités si l’entraînement le prévoit."
    }
  },
  rlhf: {
    name: "Apprentissage par renforcement à partir de retours humains",
    summary: "Une famille de méthodes qui utilisent les préférences humaines pour façonner le comportement d’un modèle, via un modèle de récompense et l’apprentissage par renforcement.",
    why: "Le RLHF aligne les sorties d’un modèle sur des qualités difficiles à formuler comme une simple fonction de perte automatique.",
    how: "Des humains comparent des sorties, un modèle de récompense apprend ces préférences et un algorithme de renforcement optimise le modèle contre la récompense apprise.",
    example: "Des relecteurs classent deux réponses d’assistant, ce qui aide le système à apprendre laquelle est la plus utile et la plus sûre.",
    foundations: {
      "expected-return": "L’objectif est la même maximisation de récompense espérée que pour tout problème d’apprentissage par renforcement.",
      "probability-distributions": "Un modèle de récompense convertit des comparaisons humaines par paires en une distribution sur la réponse préférée.",
      "kl-divergence": "Une pénalité KL contre le modèle d’origine empêche l’entraînement sur préférences de détruire la capacité de base.",
      "loss-functions": "Le modèle de récompense est ajusté par une perte de préférence sur des paires classées.",
      "gradient-descent": "Le modèle de récompense comme la politique sont entraînés par des méthodes de gradient."
    }
  },
  dpo: {
    name: "Optimisation directe des préférences",
    summary: "Une méthode d’apprentissage par préférences qui optimise directement un modèle de langage à partir de réponses préférées et rejetées.",
    why: "L’optimisation directe des préférences simplifie l’alignement en évitant la boucle explicite modèle de récompense plus apprentissage par renforcement.",
    how: "L’objectif augmente la vraisemblance relative des réponses préférées par rapport aux réponses rejetées, tout en restant proche d’un modèle de référence.",
    example: "Le modèle apprend à partir de paires où des relecteurs ont retenu l’explication technique la plus claire.",
    foundations: {
      "probability-distributions": "Les préférences sont modélisées comme une distribution sur celle des deux réponses qu’un humain choisirait.",
      "kl-divergence": "DPO se dérive d’un objectif contraint par une KL ; cette contrainte est exactement ce qui donne sa forme close.",
      "loss-functions": "Il en résulte une unique perte de type classification sur des paires de préférence, sans modèle de récompense séparé.",
      "maximum-likelihood": "Ajuster cette perte revient à un maximum de vraisemblance sur les préférences observées."
    }
  },
  ppo: {
    name: "Optimisation de politique proximale",
    summary: "Un algorithme d’apprentissage par renforcement qui contraint les mises à jour de la politique afin de stabiliser l’entraînement.",
    why: "PPO s’est largement imposé en robotique, en contrôle et en RLHF parce qu’il concilie simplicité de mise en œuvre et performance fiable.",
    how: "Un objectif écrêté décourage les mises à jour qui éloigneraient trop la nouvelle politique de la précédente en un seul pas.",
    example: "Une chaîne RLHF utilise PPO pour optimiser un modèle de langage contre un modèle de récompense appris.",
    foundations: {
      "expected-return": "PPO maximise le retour espéré comme toute méthode de gradient de politique.",
      "kl-divergence": "L’objectif écrêté borne l’écart entre la politique mise à jour et la précédente.",
      "probability-distributions": "Le rapport que l’on écrête est celui des probabilités nouvelle et ancienne de la même action.",
      "gradient-descent": "Les mises à jour sont des pas de gradient ordinaires sur cet objectif de substitution écrêté."
    }
  },
  distillation: {
    name: "Distillation de connaissances",
    summary: "Entraîner un petit modèle élève à reproduire le comportement utile d’un grand modèle enseignant.",
    why: "La distillation conserve une bonne part de la performance d’un grand modèle tout en réduisant le coût d’inférence et la latence.",
    how: "L’élève apprend à partir des probabilités de sortie de l’enseignant, d’exemples qu’il génère ou de ses représentations intermédiaires.",
    example: "Un modèle compact embarqué est entraîné sur des explications produites par un modèle plus grand dans le cloud.",
    foundations: {
      "kl-divergence": "L’élève est entraîné à épouser toute la distribution de l’enseignant, mesurée par divergence KL.",
      "softmax": "Une température relevée adoucit le softmax de l’enseignant pour que le classement entre mauvaises réponses porte encore du signal.",
      "cross-entropy": "La perte sur cibles douces est une entropie croisée contre une distribution complète plutôt qu’une étiquette unique.",
      "probability-distributions": "Ce qui se transfère est la forme de la croyance de l’enseignant, non seulement sa meilleure réponse."
    }
  },

  /* Retrieval & knowledge ---------------------------------------------- */
  rag: {
    name: "Génération augmentée par recherche",
    summary: "Un schéma qui va chercher de l’information externe et la fournit à un modèle génératif au moment de la requête.",
    why: "Le RAG apporte des éléments actuels, privés ou spécifiques à un métier sans avoir à inscrire toute la connaissance dans les poids du modèle.",
    how: "Le système interroge une source de connaissance, sélectionne les passages pertinents et les place dans le contexte du modèle avant la génération.",
    example: "Un assistant retrouve la dernière version d’une section du manuel de maintenance avant de répondre à la question d’un technicien.",
    foundations: {
      "cosine-similarity": "Les passages sont classés par similarité cosinus entre l’embedding de la requête et ceux stockés.",
      "nearest-neighbour-search": "Trouver rapidement ces passages parmi des millions de vecteurs est un problème de plus proches voisins approchés.",
      "vectors": "La requête comme chaque fragment indexé sont représentés par des vecteurs.",
      "conditional-probability": "La recherche change ce sur quoi le modèle se conditionne ; l’étape de génération elle-même est inchangée."
    },
    mathNote: "Les mathématiques gouvernent l’étape de recherche. Le découpage, la politique de classement et l’assemblage du prompt — là où se joue l’essentiel de la qualité d’un RAG — restent des décisions d’ingénierie."
  },
  graphrag: {
    name: "Génération augmentée par recherche sur graphe",
    summary: "Le RAG enrichi d’entités, de relations, de communautés ou de résumés structurés en graphe.",
    why: "GraphRAG répond à des questions qui exigent de relier des éléments dispersés dans de nombreux documents et entités.",
    how: "L’information est extraite dans un graphe, organisée en structures connectées, puis retrouvée à un niveau local ou global pour la génération.",
    example: "Un système relie un composant, ses fournisseurs, ses modes de défaillance et les actions de maintenance à travers plusieurs rapports.",
    foundations: {
      "graph-theory": "Le contexte est rassemblé en parcourant des arêtes entre entités, non par le seul classement de passages isolés.",
      "cosine-similarity": "Les points d’entrée dans le graphe restent trouvés par similarité d’embeddings.",
      "nearest-neighbour-search": "L’ensemble initial de candidats vient d’un index vectoriel avant tout parcours.",
      "conditional-probability": "Le sous-graphe assemblé devient le contexte sur lequel le modèle se conditionne."
    }
  },
  embeddings: {
    name: "Embeddings vectoriels",
    summary: "Des représentations numériques denses qui placent les éléments sémantiquement proches les uns près des autres dans un espace vectoriel.",
    why: "Les embeddings rendent possibles la recherche sémantique, le regroupement, la recommandation, la recherche d’information et l’alignement entre modalités.",
    how: "Un encodeur transforme du texte, des images ou d’autres entrées en vecteurs de longueur fixe, appris pour préserver des relations de similarité utiles.",
    example: "Des requêtes portant sur la surchauffe retrouvent des documents traitant d’excursions thermiques, même sans correspondance exacte de mots-clés.",
    foundations: {
      "vectors": "Un embedding est un vecteur — une liste de nombres de longueur fixe tenant lieu d’un contenu.",
      "vector-spaces": "Les embeddings n’ont de sens que parce qu’ils partagent un espace où direction et distance sont comparables.",
      "dot-product": "L’accord brut entre deux embeddings est un produit scalaire.",
      "cosine-similarity": "Normaliser cet accord par les longueurs est ce qui permet à une requête courte de correspondre à un long passage.",
      "latent-space": "L’espace d’embeddings est un espace latent appris : ses axes sont inventés par l’entraînement, non conçus.",
      "vector-norms": "La longueur porte la magnitude plutôt que le sens, d’où la normalisation habituelle des embeddings avant comparaison.",
      "basis-projection": "Un embedding est un jeu de coordonnées sur des directions apprises ; les comparer relève de l’arithmétique de projection."
    }
  },
  "vector-db": {
    name: "Base de données vectorielle",
    summary: "Un système de données optimisé pour stocker des embeddings et rechercher les vecteurs voisins.",
    why: "Les bases vectorielles rendent la recherche sémantique praticable sur de grandes collections et prennent en charge le filtrage par métadonnées et l’indexation.",
    how: "Des index de plus proches voisins approchés identifient rapidement les vecteurs les plus proches de l’embedding d’une requête.",
    example: "Des millions de fragments de documents sont indexés pour qu’un assistant retrouve les passages les plus proches en quelques millisecondes.",
    foundations: {
      "nearest-neighbour-search": "Une base vectorielle est un index de plus proches voisins approchés autour duquel on a bâti stockage, filtrage et mises à jour.",
      "cosine-similarity": "La mesure de similarité pour laquelle l’index est construit est ce qui définit un voisin.",
      "vector-norms": "Les vecteurs sont en général normalisés à l’écriture pour que produit scalaire et similarité cosinus coïncident."
    }
  },
  "knowledge-graph": {
    name: "Graphe de connaissances",
    summary: "Une représentation structurée d’entités, de concepts et de relations explicites.",
    why: "Les graphes de connaissances rendent les relations interrogeables, explicables et réutilisables d’une application à l’autre.",
    how: "Les faits sont représentés par des nœuds et des arêtes, souvent enrichis de schémas, d’identifiants, de provenance et de contraintes.",
    example: "Un graphe relie un moteur à son fabricant, son matériau, un réducteur compatible, ses modes de défaillance et ses consignes d’entretien.",
    foundations: {
      "graph-theory": "Un graphe de connaissances est exactement un graphe : les entités sont des nœuds, les relations des arêtes.",
      "matrices": "Écrites comme matrice d’adjacence, les questions à plusieurs sauts deviennent des produits matriciels.",
      "vectors": "Les embeddings de graphe placent les nœuds dans un espace vectoriel pour que la similarité structurelle devienne géométrique."
    }
  },
  "semantic-search": {
    name: "Recherche sémantique",
    summary: "Une recherche fondée sur le sens et l’intention plutôt que sur la seule correspondance exacte de mots-clés.",
    why: "Elle améliore la découverte lorsque les utilisateurs et les documents emploient un vocabulaire différent pour la même notion.",
    how: "La requête et les contenus candidats sont encodés en représentations dont la similarité sert au classement.",
    example: "Chercher « réduire la consommation électrique » remonte aussi des contenus sur l’optimisation de l’efficacité énergétique.",
    foundations: {
      "cosine-similarity": "Le classement se fait par similarité cosinus dans l’espace d’embeddings plutôt que par recouvrement de termes.",
      "nearest-neighbour-search": "Renvoyer les meilleures correspondances sur un grand corpus est une requête de plus proches voisins.",
      "vectors": "Requête et documents sont comparés comme des vecteurs : la formulation n’a pas à coïncider."
    }
  },
  grounding: {
    name: "Ancrage factuel",
    summary: "Le rattachement de la sortie d’un modèle à des preuves, des données, des outils ou un environnement externe déterminés.",
    why: "L’ancrage améliore la pertinence et la traçabilité et réduit les affirmations non étayées.",
    how: "L’application fournit un contexte faisant autorité ou vérifie les affirmations auprès de sources externes pendant la génération.",
    example: "Une réponse cite la section exacte de la politique, extraite d’un référentiel documentaire maîtrisé.",
    mathNote: "L’ancrage est une discipline de sourcing et de vérification. La recherche d’information dont il dépend est mathématique ; rattacher une affirmation à une preuve ne l’est pas."
  },

  /* Agents & orchestration --------------------------------------------- */
  "prompt-engineering": {
    name: "Ingénierie de prompts",
    summary: "La conception d’instructions et de contexte pour qu’un modèle accomplisse une tâche de façon fiable.",
    why: "La structure du prompt influence fortement la qualité des sorties, les contraintes, le format et le comportement des outils.",
    how: "Le prompt définit le rôle, la tâche, les éléments de preuve, les contraintes, les exemples et la structure de sortie attendue.",
    example: "Un prompt impose à un assistant de séparer faits, hypothèses, sources et actions recommandées.",
    mathNote: "Le prompt change ce sur quoi le modèle se conditionne. Ce conditionnement est probabiliste, mais la pratique elle-même est empirique et linguistique plutôt que mathématique."
  },
  cot: {
    name: "Chaîne de pensée",
    summary: "Les étapes de raisonnement intermédiaires qu’un modèle ou un système de raisonnement suit pour parvenir à une réponse.",
    why: "Un raisonnement structuré améliore les performances sur les problèmes en plusieurs étapes, même si un raisonnement interne ne garantit pas en soi la justesse.",
    how: "Le système décompose un problème en inférences intermédiaires, vérifications ou appels d’outils avant de produire la réponse finale.",
    example: "Un agent de planification identifie les dépendances, évalue les contraintes puis choisit un ordre d’exécution.",
    mathNote: "La chaîne de pensée est un motif de prompt et de décodage. Elle allonge le contexte de conditionnement et dépense plus de tokens sur un problème ; elle n’introduit aucun objet mathématique nouveau."
  },
  "function-calling": {
    name: "Appel de fonctions",
    summary: "Un mécanisme structuré permettant à un modèle de choisir une fonction et d’en produire les arguments validés.",
    why: "L’appel de fonctions convertit l’intention d’un modèle de langage en actions applicatives contrôlées.",
    how: "Les fonctions disponibles sont décrites par des schémas ; le modèle en choisit une et renvoie des arguments que l’application hôte valide puis exécute.",
    example: "Un assistant appelle une fonction d’agenda avec une heure de début, une durée et une liste de participants.",
    mathNote: "L’appel de fonctions est un problème de sortie structurée et de validation de schéma. Le choix de fonction par le modèle reste un tirage dans une distribution, mais le mécanisme lui-même n’ajoute pas de mathématiques."
  },
  "tool-use": {
    name: "Utilisation d’outils",
    summary: "La capacité d’un système d’IA à invoquer des ressources externes : recherche, exécution de code, bases de données ou applications métier.",
    why: "Les outils permettent à un modèle d’agir sur des données à jour, d’effectuer des calculs exacts et d’exécuter des opérations contrôlées au-delà de la génération de texte.",
    how: "Le modèle choisit un outil disponible, fournit des paramètres, reçoit un résultat et l’intègre à l’étape suivante.",
    example: "Un agent consulte le stock en temps réel avant de recommander un composant de remplacement.",
    mathNote: "L’utilisation d’outils relève de l’orchestration : décider quand appeler quelque chose d’externe et comment réinjecter le résultat. Les mathématiques vivent dans les outils et dans le modèle qui décide."
  },
  agent: {
    name: "Agent d’IA",
    summary: "Un système d’IA orienté vers un but, capable de planifier, d’utiliser des outils, d’observer les résultats et de poursuivre sur plusieurs étapes.",
    why: "Les agents font passer l’IA de réponses isolées à des flux de travail qui interagissent avec des logiciels, des données et des environnements.",
    how: "Un agent évalue l’état de façon répétée, choisit une action, appelle un outil ou un modèle et met à jour son plan jusqu’à une condition d’arrêt.",
    example: "Un agent d’ingénierie recueille les exigences, consulte les normes, génère des variantes et sollicite une validation humaine avant publication.",
    foundations: {
      "graph-theory": "Un plan est un graphe orienté d’étapes et de dépendances ; l’exécution en est un parcours, et un cycle y est un bug.",
      "expected-return": "Choisir parmi les actions possibles peut se formuler comme la maximisation d’une valeur espérée, même si la plupart des agents déployés s’en remettent à des heuristiques.",
      "probability-distributions": "Le choix de l’étape suivante par le modèle sous-jacent reste un tirage dans une distribution, d’où le fait que les agents ne soient pas reproductibles par défaut."
    },
    mathNote: "La plupart des cadres d’agents relèvent du logiciel et de l’orchestration plutôt que de mathématiques nouvelles. Ce qu’il y a de mathématique se trouve dans le modèle qui propose les actions et dans la recherche d’information et les outils qu’il appelle."
  },
  "multi-agent": {
    name: "Système multi-agents",
    summary: "Un système dans lequel plusieurs agents coopèrent, se coordonnent ou se spécialisent autour d’un objectif commun.",
    why: "Plusieurs agents permettent de séparer responsabilités, points de vue, permissions et rôles de validation.",
    how: "Un orchestrateur ou un protocole achemine tâches, contexte et résultats entre agents spécialisés et arbitre dépendances et conflits.",
    example: "Des agents distincts traitent les exigences, la simulation, l’analyse de coût et la conformité avant qu’un agent de gouvernance ne consolide le résultat.",
    mathNote: "La coordination entre agents relève du protocole et de la conception de systèmes. La théorie des jeux décrit formellement certaines situations multi-agents, mais les systèmes déployés sont massivement de l’orchestration logicielle."
  },
  mcp: {
    name: "Model Context Protocol",
    summary: "Un protocole ouvert qui connecte les applications d’IA à des outils, des ressources et des prompts réutilisables via une interface standard.",
    why: "MCP réduit le travail d’intégration sur mesure et rend le contexte et la connexion aux outils plus portables d’un client et d’un serveur à l’autre.",
    how: "Des clients MCP se connectent à des serveurs qui exposent des capacités — outils, ressources — au moyen d’un protocole et d’un modèle de messages définis.",
    example: "Un serveur MCP expose les documents d’ingénierie approuvés à plusieurs assistants d’IA compatibles.",
    mathNote: "MCP n’a pas de fondement mathématique intrinsèque. C’est une architecture logicielle et un protocole d’interopérabilité : il définit comment un modèle se connecte aux outils, aux données et au contexte, non comment un modèle apprend ou infère. Les mathématiques deviennent pertinentes dans les modèles, les systèmes de recherche et les outils reliés à travers lui."
  },
  api: {
    name: "Interface de programmation applicative",
    summary: "Une interface définie par laquelle des systèmes logiciels se demandent mutuellement des données ou des opérations.",
    why: "Les API constituent la couche d’intégration de base derrière la plupart des outils d’IA, des services de données et des flux de travail en entreprise.",
    how: "Un client envoie une requête structurée à un point d’accès ou à une fonction de bibliothèque et reçoit une réponse définie.",
    example: "Un agent interroge un service d’analyse de cycle de vie via une API et reçoit des indicateurs d’impact en JSON.",
    mathNote: "Une API est un contrat d’interface. Les mathématiques éventuelles se tiennent derrière, dans ce que le point d’accès calcule réellement."
  },
  "context-window": {
    name: "Fenêtre de contexte",
    summary: "La quantité d’information tokenisée qu’un modèle peut traiter dans une requête ou une séquence active.",
    why: "La fenêtre de contexte détermine la quantité de conversation, de preuves, de code ou de contenu retrouvé qui peut être prise en compte d’un seul tenant.",
    how: "Les tokens d’entrée et les tokens générés consomment un budget de séquence fini, fixé par le modèle et le système de service.",
    example: "Un long dossier technique peut nécessiter un découpage ou une recherche d’information parce qu’il dépasse la fenêtre de contexte du modèle.",
    mathNote: "La fenêtre de contexte est une limite d’architecture et de mémoire. Son coût est gouverné par la croissance quadratique de l’attention avec la longueur de séquence, mais la fenêtre elle-même est une contrainte, non un calcul."
  },
  memory: {
    name: "Mémoire d’agent",
    summary: "Les mécanismes qui conservent l’information utile d’une étape, d’une session ou d’une tâche à l’autre, au-delà du prompt immédiat.",
    why: "La mémoire aide les agents à conserver continuité, préférences, plans et éléments accumulés.",
    how: "Les systèmes stockent des faits, résumés, événements ou embeddings sélectionnés et les retrouvent lorsqu’ils sont pertinents pour une tâche ultérieure.",
    example: "Un agent retient une contrainte de conception approuvée et l’applique lors d’un travail d’optimisation ultérieur.",
    mathNote: "La mémoire d’agent est une conception de stockage et de récupération. Lorsqu’elle s’appuie sur des embeddings, les mathématiques sont celles de la recherche d’information."
  },

  /* Inference & optimization ------------------------------------------- */
  tokenization: {
    name: "Tokenisation",
    summary: "La conversion d’un texte ou d’autres entrées en unités discrètes qu’un modèle peut traiter.",
    why: "La tokenisation influe sur la longueur des séquences, le coût, le comportement multilingue et la façon dont le texte se traduit en entrées du modèle.",
    how: "Un tokeniseur segmente le texte en mots, sous-mots, caractères ou fragments d’octets et attribue à chacun un identifiant entier.",
    example: "Un composé technique est souvent représenté par plusieurs tokens de sous-mots plutôt que par un mot entier.",
    mathNote: "La tokenisation est une procédure de traitement de chaînes. Elle décide quelles sont les unités d’une séquence ; les mathématiques commencent une fois ces unités devenues des vecteurs."
  },
  bpe: {
    name: "Codage par paires d’octets",
    summary: "Une méthode de tokenisation en sous-mots qui fusionne itérativement les paires de symboles adjacents les plus fréquentes.",
    why: "Le BPE concilie une taille de vocabulaire gérable et la capacité à représenter des mots rares ou jamais rencontrés.",
    how: "L’entraînement part de petites unités et crée à chaque itération un nouveau token pour la paire la plus fréquente.",
    example: "Un mot technique rare est représenté par une suite de fragments de sous-mots familiers.",
    mathNote: "Le codage par paires d’octets est un algorithme glouton de fusion piloté par des comptages de fréquence — combinatoire plutôt que mathématique en un sens plus profond."
  },
  "kv-cache": {
    name: "Cache clés-valeurs",
    summary: "Les clés et valeurs d’attention conservées pour les tokens déjà traités lors d’une génération autorégressive.",
    why: "Le cache KV évite de recalculer toute la séquence précédente à chaque nouveau token généré.",
    how: "Chaque couche de transformer conserve les tenseurs de clés et de valeurs des tokens antérieurs et y ajoute les nouvelles entrées au fil de la génération.",
    example: "Une réponse de conversation se génère plus vite une fois le prompt traité, parce que les états d’attention antérieurs sont en cache.",
    mathNote: "Le cache KV est une optimisation système : les clés et valeurs déjà calculées sont conservées plutôt que recalculées. Il change le coût, pas les résultats."
  },
  "prefill-and-decode": {
    name: "Phases de prefill et de decode",
    summary: "Les deux phases de la génération — lire le prompt d’un seul coup, puis produire les tokens un par un — dont les comportements diffèrent au point d’en faire deux charges de travail distinctes.",
    why: "Presque toutes les métriques et optimisations d’inférence n’ont de sens qu’une fois les deux phases séparées. Le temps jusqu’au premier token est un problème de prefill, les tokens par seconde un problème de decode, et on les améliore par des moyens opposés.",
    how: "Le prefill traite tout le prompt en une seule passe parallèle et sature les unités de calcul : il est donc limité par le calcul. Le decode émet ensuite un token par pas ; chaque pas effectue très peu d’arithmétique mais doit lire depuis la mémoire l’intégralité des poids et tout le cache KV : il est donc limité par la bande passante mémoire. Le traitement par lots aide donc énormément le decode et presque pas le prefill, puisqu’il amortit une lecture des poids sur de nombreuses requêtes.",
    example: "Un long document appelant une réponse d’une ligne est dominé par le prefill ; un prompt court appelant une longue réponse est dominé par le decode — et seul le second accélère quand on augmente la taille du lot.",
    mathNote: "La séparation est une distinction système et non mathématique — la même arithmétique d’attention s’exécute dans les deux phases. Ce qui change est la forme du travail, et donc la limite matérielle qui mord la première."
  },
  "memory-bandwidth-bound": {
    name: "Limité par la bande passante mémoire",
    summary: "La situation où un calcul attend le déplacement des données plutôt que l’arithmétique — l’état réel de la plupart des inférences de modèles de langage.",
    why: "Cela explique d’un coup l’essentiel de l’ingénierie d’inférence moderne. Quantification, compression du cache KV, noyaux d’attention, attention à requêtes groupées et décodage spéculatif sont autant de tentatives de déplacer moins d’octets, non d’effectuer moins de calculs.",
    how: "On compare l’intensité arithmétique — opérations effectuées par octet lu — au rapport propre à l’accélérateur entre calcul crête et bande passante mémoire crête. En deçà de ce point d’équilibre, c’est le système mémoire qui limite et les unités de calcul attendent, inactives. Générer un token pour une requête lit tous les poids du modèle pour n’effectuer qu’une poignée d’opérations par octet, très en dessous du seuil de n’importe quel accélérateur moderne.",
    example: "Diviser par deux la précision des poids, de seize à huit bits, double à peu près la vitesse de decode alors que l’arithmétique est inchangée — il y a simplement deux fois moins d’octets à aller chercher.",
    mathNote: "C’est un modèle de performance matérielle plutôt qu’un objet mathématique : un rapport entre opérations et octets déplacés, comparé à un rapport que la machine fixe. Il gouverne la durée d’un calcul et jamais ce qu’il renvoie."
  },
  "flash-attention": {
    name: "Attention exacte optimisée pour les entrées-sorties",
    summary: "Une implémentation de l’attention ordinaire qui n’écrit jamais la matrice de scores complète en mémoire : bien plus rapide, pour un résultat exactement identique.",
    why: "L’attention est limitée par le trafic mémoire, non par l’arithmétique. La matrice de scores n × n est écrite en mémoire haute bande passante puis relue, et c’est ce déplacement — non les multiplications — qui domine le coût.",
    how: "Requêtes, clés et valeurs sont découpées en blocs assez petits pour tenir dans la mémoire embarquée du GPU, et l’attention est calculée bloc par bloc. Un maximum courant et une somme courante permettent de remettre le softmax à l’échelle à l’arrivée de chaque nouveau bloc, si bien que la normalisation correcte est atteinte sans que la ligne entière n’existe jamais d’un seul tenant. Le résultat est comparable au bit près à l’attention standard : c’est une méthode exacte, pas une approximation.",
    example: "L’entraînement à 16 k de contexte devient praticable sur du matériel inchangé, parce que le pic de mémoire croît désormais avec la longueur de séquence et non avec son carré.",
    foundations: {
      "softmax": "L’identité de remise à l’échelle en ligne, qui permet d’accumuler un softmax bloc par bloc, est le cœur mathématique de la méthode.",
      "numerical-stability": "Suivre un maximum courant et le soustraire avant d’exponentier est ce qui garde les valeurs intermédiaires représentables.",
      "matrix-multiplication": "Les blocs sont dimensionnés aux formes que les tensor cores multiplient efficacement, ce qui explique le choix des tailles de tuile."
    }
  },
  gqa: {
    name: "Attention à requêtes groupées",
    summary: "Une variante de l’attention où plusieurs têtes de requête partagent un même jeu de clés et de valeurs, réduisant le cache KV avec une perte de qualité minime.",
    why: "C’est le cache KV, et non les poids, qui plafonne en général le nombre de conversations qu’un serveur peut tenir simultanément. Partager clés et valeurs entre têtes divise ce cache par le facteur de partage.",
    how: "L’attention multi-têtes standard donne à chaque tête ses propres clés et valeurs. L’attention à requête unique adopte l’extrême inverse, un seul jeu partagé par toutes les têtes — rapide, mais nettement moins bon. L’attention à requêtes groupées se situe entre les deux : les têtes sont réparties en groupes, chaque groupe partageant une même paire clé-valeur. Un modèle multi-têtes existant se convertit en moyennant les têtes de chaque groupe puis en l’affinant brièvement.",
    example: "Un modèle à trente-deux têtes de requête et huit groupes clé-valeur porte un quart du cache KV : environ quatre fois plus de requêtes simultanées tiennent dans la même mémoire.",
    foundations: {
      "matrix-multiplication": "Une même paire clé-valeur est multipliée contre plusieurs têtes de requête, ce qui élève l’intensité arithmétique — plus de travail par octet lu.",
      "vector-spaces": "Les têtes d’un groupe sont contraintes de lire dans un même sous-espace clé-valeur partagé au lieu d’avoir chacune le sien.",
      "dot-product": "L’évaluation est inchangée ; seul diminue le nombre de jeux de clés distincts contre lesquels ces produits scalaires s’exécutent."
    }
  },
  "speculative-decoding": {
    name: "Décodage spéculatif",
    summary: "Ébaucher plusieurs tokens avec un petit modèle rapide et les faire vérifier tous en une passe par le grand modèle, qui conserve ceux qu’il valide.",
    why: "Comme le decode est limité par la bande passante mémoire, vérifier plusieurs tokens coûte presque exactement ce que coûte en générer un. Le gain vient d’un plus grand nombre d’opérations par octet lu, non d’un travail moindre.",
    how: "Un petit modèle brouillon propose une poignée de tokens. Le grand modèle les évalue tous en une seule passe avant. Une règle d’acceptation-rejet conserve alors le plus long préfixe compatible avec la distribution du grand modèle et rééchantillonne au premier désaccord. Les tokens obtenus suivent exactement la distribution qu’aurait produite le grand modèle seul — c’est une accélération sans perte, pas une approximation.",
    example: "Un modèle brouillon d’un milliard de paramètres associé à une cible de soixante-dix milliards donne couramment deux à trois fois plus de tokens par seconde, à qualité de sortie inchangée par construction.",
    foundations: {
      "sampling": "L’étape d’acceptation-rejet est un échantillonnage par rejet de manuel, ce qui rend la méthode exacte plutôt qu’approchée.",
      "probability-distributions": "L’acceptation compare les distributions cible et brouillon token par token ; l’accélération attendue est fonction de leur écart.",
      "conditional-probability": "Chaque token proposé est conditionné par les précédents : un seul rejet invalide donc tout le reste du brouillon.",
      "kl-divergence": "La proximité entre brouillon et cible — et donc le nombre de tokens qui survivent — est précisément ce qu’optimise la distillation du brouillon depuis la cible."
    }
  },
  quantization: {
    name: "Quantification de modèle",
    summary: "La représentation des poids ou des activations d’un modèle avec une précision numérique réduite.",
    why: "La quantification réduit l’usage mémoire, la bande passante et souvent le coût d’inférence, même si l’exactitude peut se dégrader lorsqu’elle est mal appliquée.",
    how: "Des valeurs en haute précision sont ramenées à un ensemble plus restreint de niveaux numériques à faible nombre de bits, parfois avec des facteurs d’échelle et une calibration.",
    example: "Un modèle stocké en 4 bits demande bien moins de mémoire GPU que le même modèle en 16 bits.",
    foundations: {
      "floating-point": "La quantification est un choix du nombre de bits accordé à chaque poids — fp16, int8 ou 4 bits.",
      "rounding-error": "Chaque valeur se cale sur la plus proche représentable, avec une erreur bornée par un demi-pas.",
      "numerical-stability": "Ces erreurs se composent d’une couche à l’autre : un schéma correct sur une matrice peut malgré tout ruiner une pile entière.",
      "vector-norms": "Les facteurs d’échelle sont fixés d’après les magnitudes présentes dans chaque bloc, ce qui explique le caractère si dommageable d’un seul poids aberrant."
    }
  },
  pruning: {
    name: "Élagage de modèle",
    summary: "La suppression des poids, connexions, canaux ou composants d’un modèle jugés les moins importants.",
    why: "L’élagage réduit la taille du modèle et le calcul, surtout lorsque matériel et logiciel savent exploiter le caractère creux qui en résulte.",
    how: "Un critère d’importance désigne les paramètres à retirer, suivi d’un réentraînement facultatif pour récupérer la performance.",
    example: "Des têtes d’attention à faible impact sont supprimées, puis le modèle est affiné de nouveau.",
    foundations: {
      "vector-norms": "L’élagage par magnitude retire les poids de plus petite norme, en supposant qu’ils contribuent le moins.",
      "matrix-rank": "L’élagage structuré retire des lignes ou des canaux entiers, abaissant le rang effectif d’une couche.",
      "numerical-stability": "Un élagage agressif peut amplifier l’erreur le long des chemins restants.",
      "regularization": "L’élagage par magnitude est la régularisation poussée à sa conclusion : pénaliser les petits poids, puis les supprimer.",
      "eigenvalues": "L’élagage structuré s’appuie sur des critères spectraux pour décider quels canaux portent peu de la transformation.",
      "singular-value-decomposition": "Tronquer la SVD d’une couche entraînée est la version rigoureuse du retrait de ce qu’une matrice n’utilise guère."
    }
  },
  batching: {
    name: "Traitement par lots à l’inférence",
    summary: "Le traitement simultané de plusieurs entrées afin d’exploiter plus efficacement les ressources de calcul.",
    why: "Le traitement par lots améliore nettement le débit, même si des lots plus grands peuvent allonger l’attente d’une requête individuelle.",
    how: "Les requêtes sont regroupées pour que les opérations matricielles s’exécutent en parallèle sur plusieurs séquences ; le traitement dynamique forme des lots en continu.",
    example: "Un serveur d’inférence réunit plusieurs prompts entrants dans un même lot d’exécution GPU.",
    mathNote: "Le traitement par lots est une décision d’ordonnancement et de débit. Il change la façon dont le travail est regroupé sur l’accélérateur, non ce qui est calculé."
  },
  latency: {
    name: "Latence d’inférence",
    summary: "Le temps écoulé entre une requête et une étape significative de la réponse.",
    why: "La latence détermine la réactivité des assistants interactifs, des robots et des applications temps réel.",
    how: "Elle dépend de la taille du modèle, du matériel, de la longueur d’entrée, du traitement par lots, de la surcharge réseau et de la longueur de la génération.",
    example: "Le temps jusqu’au premier token mesure la rapidité avec laquelle l’utilisateur voit le début d’une réponse.",
    mathNote: "La latence est une mesure système, façonnée par la taille du modèle, la longueur de séquence et le matériel plutôt que par des mathématiques propres."
  },
  throughput: {
    name: "Débit d’inférence",
    summary: "La quantité de travail d’inférence accomplie par unité de temps, souvent mesurée en requêtes ou en tokens par seconde.",
    why: "Le débit est central pour le coût de service, le dimensionnement des capacités et le nombre d’utilisateurs simultanés.",
    how: "Il s’améliore par le parallélisme, le traitement par lots, des noyaux optimisés, des accès mémoire efficaces et une architecture de modèle appropriée.",
    example: "Une pile de service augmente les tokens par seconde tout en maintenant la latence de réponse dans une plage cible.",
    mathNote: "Le débit est une mesure système du volume servi, gouvernée par le traitement par lots, la bande passante mémoire et l’ordonnancement."
  },

  /* Multimodal AI ------------------------------------------------------ */
  multimodal: {
    name: "Intelligence artificielle multimodale",
    summary: "Une IA qui traite ou génère plusieurs modalités : texte, images, audio, vidéo ou données de capteurs.",
    why: "La compréhension du monde réel demande souvent de combiner des signaux porteurs d’informations complémentaires.",
    how: "Des encodeurs et décodeurs propres à chaque modalité sont alignés ou reliés par des représentations partagées et de l’attention croisée.",
    example: "Un système combine la question orale d’un technicien, l’image d’une machine et la télémétrie en direct pour proposer un diagnostic.",
    foundations: {
      "vector-spaces": "Traiter plusieurs modalités à la fois suppose de leur donner un espace commun où exister.",
      "latent-space": "Chaque type d’entrée est encodé en une représentation qui abandonne sa forme de surface.",
      "cosine-similarity": "La recherche entre modalités — trouver l’image de cette phrase — est une requête de direction la plus proche."
    }
  },
  ocr: {
    name: "Reconnaissance optique de caractères",
    summary: "La technologie qui détecte le texte présent dans des images ou des documents numérisés et le convertit en caractères lisibles par une machine.",
    why: "L’OCR libère l’information enfermée dans les plans, les étiquettes, les formulaires, les numérisations anciennes et les photographies.",
    how: "Le système localise les zones de texte, reconnaît les suites de caractères et peut reconstruire la mise en page et l’ordre de lecture.",
    example: "L’OCR extrait les références de pièces et les étiquettes d’avertissement de la photo d’un équipement.",
    foundations: {
      "probability-distributions": "La reconnaissance de caractères produit une distribution sur les caractères possibles à chaque position.",
      "cross-entropy": "L’entraînement évalue le modèle contre la transcription de référence.",
      "matrix-multiplication": "L’encodeur visuel sous-jacent est la même pile d’opérations linéaires que tout modèle de vision."
    }
  },
  asr: {
    name: "Reconnaissance automatique de la parole",
    summary: "La conversion d’un audio parlé en texte ou en unités linguistiques structurées.",
    why: "La reconnaissance de la parole rend possibles les interfaces vocales, la transcription, l’accessibilité et l’analyse des échanges oraux.",
    how: "Les caractéristiques audio sont converties en tokens ou en caractères par modélisation acoustique et linguistique, souvent dans un système neuronal de bout en bout.",
    example: "Un technicien de terrain dicte un rapport d’inspection qui est transcrit automatiquement.",
    foundations: {
      "probability-distributions": "La reconnaissance de la parole produit une distribution sur des suites de tokens, non une transcription unique et certaine.",
      "conditional-probability": "Chaque token de sortie est conditionné par l’audio et par ce qui a déjà été transcrit.",
      "sampling": "La stratégie de décodage — gloutonne ou par faisceau — décide quel chemin dans cette distribution est renvoyé."
    }
  },
  tts: {
    name: "Synthèse vocale",
    summary: "La génération d’un audio parlé à partir d’un texte écrit.",
    why: "La synthèse vocale soutient les interfaces accessibles, les assistants vocaux, la narration et les flux industriels mains libres.",
    how: "Un modèle prédit des représentations acoustiques à partir du texte et un vocodeur les convertit en forme d’onde audio.",
    example: "Un assistant lit une consigne de maintenance à voix haute pendant que le technicien travaille.",
    foundations: {
      "probability-distributions": "La synthèse vocale modélise la distribution des audios plausibles pour un texte donné.",
      "sampling": "La génération y puise, ce qui explique qu’une même phrase puisse être dite de plusieurs façons.",
      "loss-functions": "L’entraînement minimise la distance entre les représentations audio générée et de référence."
    }
  },
  "text-modality": {
    name: "Modalité texte",
    summary: "Le langage écrit représenté sous forme de caractères, de tokens, de documents ou de texte structuré.",
    why: "Le texte reste l’interface principale des instructions, de la documentation, du code et de toute IA à forte intensité de connaissance.",
    how: "Le texte est tokenisé puis encodé en représentations numériques pour les modèles de langage et les systèmes de recherche d’information.",
    example: "Un modèle traite exigences, courriels, manuels et code source dans un même flux de travail.",
    mathNote: "Une modalité est un format de données, non une méthode. Le texte devient mathématique à la tokenisation et à l’embedding, qui sont des concepts distincts."
  },
  "image-modality": {
    name: "Modalité image",
    summary: "L’information visuelle bidimensionnelle représentée par des pixels, des patches, des régions ou des caractéristiques apprises.",
    why: "Les images capturent forme, apparence, contexte spatial et preuves visuelles que le texte ne contient pas toujours.",
    how: "Des encodeurs visuels transforment pixels ou patches en représentations utilisées pour la classification, la génération ou le raisonnement.",
    example: "Un modèle inspecte une image thermique pour repérer un composant de baie en surchauffe.",
    mathNote: "Une modalité est un format de données, non une méthode. Une image devient mathématique dès qu’elle est un tenseur de valeurs de pixels fourni à un encodeur visuel."
  },
  "audio-modality": {
    name: "Modalité audio",
    summary: "Le son représenté sous forme de formes d’onde, de caractéristiques fréquentielles, de tokens ou de représentations acoustiques apprises.",
    why: "L’audio porte la parole, les signaux d’ambiance, l’acoustique des machines et des motifs temporels.",
    how: "Les modèles traitent des formes d’onde échantillonnées ou des caractéristiques de type spectrogramme pour reconnaître, classer ou générer du son.",
    example: "Un modèle acoustique détecte un bruit de roulement anormal avant toute défaillance visible.",
    mathNote: "Une modalité est un format de données, non une méthode. L’audio devient mathématique au moment où il est converti en forme d’onde ou en représentation spectrale."
  },
  "video-modality": {
    name: "Modalité vidéo",
    summary: "Des images visuelles ordonnées dans le temps, souvent combinées à l’audio, au mouvement et à une structure d’événements.",
    why: "La vidéo contient la dynamique temporelle indispensable à la reconnaissance d’activités, à la robotique et à la modélisation du monde.",
    how: "Les modèles encodent l’information spatiale à l’intérieur des images et les relations temporelles entre elles.",
    example: "Un modèle vidéo apprend la séquence des gestes d’une procédure d’assemblage.",
    mathNote: "Une modalité est un format de données, non une méthode. La vidéo ajoute un axe temporel au cas de l’image ; les mathématiques appartiennent aux encodeurs qui la consomment."
  },

  /* Evaluation, safety & reliability ------------------------------------ */
  evals: {
    name: "Évaluations d’IA",
    summary: "Des tests systématiques qui mesurent le comportement d’un modèle ou d’une application au regard de critères définis.",
    why: "Les évaluations transforment des objectifs de qualité, de fiabilité et de sûreté en éléments observables sur lesquels s’appuyer pour progresser.",
    how: "Un jeu de données, un harnais de tâches et un correcteur produisent des mesures ou des jugements reproductibles, souvent sur plusieurs modes de défaillance.",
    example: "Une évaluation vérifie qu’un assistant RAG cite la bonne source et refuse les conclusions non étayées.",
    foundations: {
      "sampling": "Un score de benchmark est une estimation de Monte-Carlo calculée sur un échantillon fini de prompts.",
      "probability-distributions": "Toute exactitude annoncée a un intervalle de confiance, et il ne se resserre qu’en 1/√N.",
      "entropy": "La perplexité, toujours la métrique standard de la modélisation du langage, est une mesure d’entropie déguisée."
    },
    mathNote: "Les mathématiques en jeu sont de la statistique ordinaire, et elle est régulièrement ignorée : de petits écarts entre modèles tombent souvent dans l’erreur d’échantillonnage."
  },
  benchmark: {
    name: "Banc d’essai standardisé",
    summary: "Une tâche ou une suite normalisée servant à comparer des systèmes dans des conditions définies.",
    why: "Les bancs d’essai offrent un point de référence commun, mais leurs résultats ne prédisent pas nécessairement la performance dans un déploiement donné.",
    how: "Les modèles sont évalués sur les mêmes jeux de données, prompts, métriques et règles de notation.",
    example: "Deux modèles sont comparés sur des tâches de code, puis testés séparément sur le flux d’ingénierie réel de l’entreprise.",
    foundations: {
      "sampling": "Un banc d’essai est un échantillon de tâches ; le score est une estimation, non une mesure.",
      "probability-distributions": "Comparer deux modèles revient à comparer deux estimations, chacune avec sa propre erreur."
    }
  },
  hallucination: {
    name: "Hallucination de modèle",
    summary: "Une sortie fluide mais non étayée, inventée ou incohérente avec les preuves disponibles.",
    why: "Les hallucinations créent de sérieux problèmes de fiabilité lorsque les utilisateurs prennent un langage assuré pour un fait vérifié.",
    how: "Elles naissent de prédictions incertaines, d’un contexte manquant, de données contradictoires, d’une recherche d’information défaillante ou d’incitations qui récompensent une complétion plausible.",
    example: "Un assistant invente un intervalle de maintenance qui ne figure pas dans le manuel officiel.",
    foundations: {
      "conditional-probability": "Le modèle produit la suite la plus probable étant donné son contexte, ce qui n’est pas la même chose que la vraie.",
      "maximum-likelihood": "L’entraînement récompense l’ajustement à la distribution du texte, non la justesse sur le monde — et l’écart entre les deux est le lieu de l’hallucination.",
      "sampling": "Une température d’échantillonnage plus élevée élargit l’éventail des suites et avec lui le risque d’une suite non étayée.",
      "probability-distributions": "Une réponse fausse et assurée est une distribution très piquée sur le mauvais token."
    }
  },
  alignment: {
    name: "Alignement de l’IA",
    summary: "L’effort visant à rendre le comportement d’une IA conforme aux objectifs, aux contraintes et aux valeurs humaines visés.",
    why: "Un système performant n’est utile que si ses objectifs et ses actions restent compatibles avec les besoins des utilisateurs et de la société.",
    how: "L’alignement s’appuie sur la curation des données, l’ajustement aux instructions, l’apprentissage par préférences, la supervision, des contraintes, des évaluations et de la gouvernance.",
    example: "Un système fait primer les procédures de sûreté sur la demande d’un utilisateur de contourner une étape de validation.",
    foundations: {
      "kl-divergence": "L’entraînement sur préférences est contraint par une pénalité KL, pour qu’améliorer le comportement ne détruise pas la capacité.",
      "expected-return": "Les méthodes d’alignement maximisent une récompense apprise : la quantité optimisée est donc un retour espéré.",
      "probability-distributions": "Les préférences humaines sont modélisées comme une distribution sur la meilleure réponse.",
      "loss-functions": "Ce à quoi un système est aligné est ce que l’objectif encode réellement — et c’est là toute la difficulté."
    }
  },
  interpretability: {
    name: "Interprétabilité des modèles",
    summary: "Les méthodes permettant de comprendre comment un modèle représente l’information ou parvient à ses sorties.",
    why: "L’interprétabilité aide à diagnostiquer les défaillances, à révéler les raccourcis appris et à soutenir l’analyse scientifique ou la gouvernance.",
    how: "Les techniques examinent activations, caractéristiques, gradients, motifs d’attention, interventions causales ou modèles de substitution simplifiés.",
    example: "Une analyse teste quelles régions d’une image ont le plus pesé sur une classification de défaut.",
    foundations: {
      "gradients": "Les méthodes d’attribution demandent comment la sortie varie par rapport à chaque entrée : c’est un gradient.",
      "matrices": "Poids et activations sont des matrices ; interpréter un modèle, c’est en examiner la structure.",
      "eigenvalues": "L’analyse spectrale de la covariance des activations trouve les directions qu’un modèle utilise réellement.",
      "vector-spaces": "Les directions de caractéristiques n’ont de sens que parce que les représentations vivent dans un espace cohérent."
    }
  },
  guardrails: {
    name: "Garde-fous de l’IA",
    summary: "Les contrôles techniques et procéduraux qui encadrent les entrées, les sorties, les outils ou les actions.",
    why: "Les garde-fous réduisent le risque en imposant des limites qui ne doivent pas reposer sur le seul jugement du modèle.",
    how: "Les contrôles peuvent inclure validation, permissions, vérifications de politique, filtres, bac à sable, points d’approbation et journaux d’audit.",
    example: "Un agent peut rédiger une commande fournisseur mais ne peut pas la soumettre sans validation humaine et contrôle budgétaire.",
    mathNote: "Les garde-fous sont des contrôles de politique, de validation et de permissions. Leur valeur vient précisément de ne pas dépendre du jugement du modèle : ils sont délibérément non statistiques."
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
