/**
 * Language layer — English and French.
 *
 * Three rules hold this together, and breaking any one of them is how a
 * bilingual static site rots:
 *
 * 1. THE URL IS THE ONLY SOURCE OF TRUTH. `?lang=fr` selects French; anything
 *    else is English. Nothing is read from navigator.language and nothing is
 *    written to storage. A link someone shares therefore renders identically
 *    for every reader, which is the entire point of an atlas built around
 *    shareable deep links — and it keeps the footer's "no cookies" promise
 *    literally true rather than nearly true.
 *
 * 2. TRANSLATIONS ARE AN OVERLAY, NEVER A COPY. `data-fr.js` holds only the
 *    fields that differ, keyed by the same permanent slug. There is no second
 *    array of concepts to keep in step, so French cannot silently disagree
 *    with English about how many concepts exist or which ones relate to which.
 *    The same asymmetry the mathematics layer already uses (§2 of CLAUDE.md).
 *
 * 3. LOCALIZATION HAPPENS ONCE, AT BOOT. `localize()` folds the overlay into
 *    the data before app.js builds a single index, so every downstream reader
 *    — search, cards, dialog, pages, graph — sees one already-correct object
 *    and needs no language check of its own. Switching language is a normal
 *    navigation that reloads the page, so there is no live re-render path to
 *    get wrong.
 *
 * Missing French is not an error. `localize()` leaves the English in place and
 * records the field in `_en`, which the renderers use to mark a section as
 * still English. That is what makes a phased translation shippable: the site
 * is never half-broken, only partly translated, and it says which parts.
 */
window.ATLAS_I18N = (() => {
  "use strict";

  const SUPPORTED = ["en", "fr"];
  const DEFAULT_LANG = "en";

  /** Read the language off the URL. Unknown or absent values mean English. */
  function readLang() {
    try {
      const value = new URLSearchParams(location.search).get("lang");
      return SUPPORTED.includes(value) ? value : DEFAULT_LANG;
    } catch {
      return DEFAULT_LANG;
    }
  }

  const lang = readLang();

  /* ================================================================= */
  /* Plural rules                                                       */
  /*                                                                    */
  /* Not the same in the two languages, and the difference is visible on */
  /* an empty search: English writes "0 concepts", French writes         */
  /* "0 concept" — CLDR puts zero in the `one` category for French.      */
  /* ================================================================= */

  const PLURAL = {
    en: (n) => (n === 1 ? 0 : 1),
    fr: (n) => (n <= 1 ? 0 : 1)
  };

  /* ================================================================= */
  /* UI strings                                                         */
  /*                                                                    */
  /* Every string the reader can see that is not concept content. Both  */
  /* tables must carry exactly the same keys; the validator fails the    */
  /* build if they drift apart, because a missing key is a visible hole. */
  /*                                                                    */
  /* `{name}` placeholders are filled by t(); `key|other` pairs are      */
  /* plural forms selected by the rules above.                           */
  /* ================================================================= */

  const STRINGS = {
    en: {
      /* Document ------------------------------------------------------ */
      htmlLang: "en",
      baseTitle: "AI Concept Atlas — From LoRA to MCP",
      metaDescription:
        "An interactive, visual atlas of essential AI concepts—from LoRA and QLoRA to RAG, agents, MCP, multimodal AI, inference, evaluation and safety.",
      conceptTitle: "{acronym} — {name} | AI Concept Atlas",
      mathTitle: "{name} — Mathematics | AI Concept Atlas",
      mathIndexTitleDoc: "Mathematics Behind AI | AI Concept Atlas",

      /* Header and navigation ----------------------------------------- */
      skipLink: "Skip to the atlas",
      brandAria: "AI Concept Atlas home",
      brandName: "Concept Atlas",
      brandTagline: "From LoRA to MCP",
      navAria: "Primary navigation",
      navRandom: "Surprise me",
      navMath: "Mathematics",
      navAbout: "About",
      navGithub: "View on GitHub",
      langAria: "Language",
      langEnglish: "English",
      langFrench: "Français",
      langSwitchToFrench: "Read this page in French",
      langSwitchToEnglish: "Read this page in English",

      /* Hero ---------------------------------------------------------- */
      heroEyebrow: "Interactive AI knowledge map",
      heroTitle: "Understand the language of modern AI.",
      heroIntro:
        "Explore the foundations, architectures, training methods, retrieval systems, agents, optimization techniques, multimodal capabilities and safety practices shaping today’s AI systems.",
      searchLabel: "Search concepts",
      searchPlaceholder: "Search LoRA, MCP, RAG, Transformer…",
      searchHint:
        "Press the slash key to focus this field. Use the arrow keys to move through suggestions and Enter to open a concept.",
      searchSuggestionsAria: "Search suggestions",
      heroStatsAria: "Atlas statistics",
      statConcepts: "concepts",
      statDomains: "domains",
      statDeepLinks: "Shareable deep links",
      heroImageAlt:
        "Concept map of 87 AI terms grouped into eight domains — foundations, model architectures, training and adaptation, retrieval and knowledge, agents and orchestration, inference and optimization, multimodal AI, and evaluation, safety and reliability — arranged around a central hub encircled by the seven branches of mathematics they rest on: linear algebra, probability, information theory, optimization, numerics, graphs and dynamics.",

      /* Atlas section ------------------------------------------------- */
      atlasEyebrow: "Explore by domain",
      atlasTitle: "The AI landscape, one concept at a time",
      viewToggleAria: "Atlas view",
      tabDomains: "Domains",
      tabGraph: "Graph",
      filtersAria: "Filter concepts by domain",
      filterAll: "All",
      bandFocus: "Focus",
      bandShowAll: "Show all domains",
      bandCount: "{n} concept|{n} concepts",
      resultCount: "{n} concept shown in {domain}.|{n} concepts shown in {domain}.",
      resultNone: "No concepts match the current search in {domain}.",
      allDomains: "all domains",
      emptyTitle: "No matching concept",
      emptyBody: "Try another acronym, full name, keyword or domain.",
      noConceptFound: "No concept found.",
      resultKindAI: "AI concept",
      resultKindMath: "Mathematics",

      /* Graph --------------------------------------------------------- */
      graphHint:
        "Circles are AI concepts, diamonds are mathematics. Every line is a relationship declared in the atlas data, and node size reflects how many things connect to it. Select a node to open it, or press Tab to step through them. Focus a single concept to see only the mathematics it depends on directly, with each relationship named.",
      graphAria: "Relationship graph of AI concepts and the mathematics they use",
      graphLayersAria: "Graph layers",
      graphFocusLabel: "Focus",
      graphWholeAtlas: "Whole atlas",
      graphLayerBoth: "Both layers",
      graphLayerAI: "AI only",
      graphLayerMath: "Mathematics only",
      graphLegendAI: "AI concept",
      graphLegendMath: "Mathematics",
      graphNodeCount: "{n} node|{n} nodes",
      graphNoFoundations: "{name} declares no mathematical foundations.",
      graphNoFoundationsStatus: "{name} has no mapped mathematical dependencies.",
      graphFocusStatus: "{name}: {n} direct mathematical dependencies, {core} core.",

      /* Relationship verbs on graph edges ------------------------------ */
      relUSES: "uses",
      relDEPENDS_ON: "depends on",
      relMEASURED_WITH: "measured with",
      relOPTIMIZED_BY: "optimized by",
      relAPPROXIMATES: "approximates",
      relGENERALIZES: "generalizes",
      relRELATED_TO: "related to",

      /* About --------------------------------------------------------- */
      aboutEyebrow: "Why this atlas exists",
      aboutTitle: "A practical map for navigating AI conversations.",
      aboutBody1:
        "AI terminology evolves quickly and concepts are often discussed in isolation. This atlas connects each term to the larger system: what it means, why it matters, how it works and which concepts sit around it.",
      aboutBody2:
        "Each concept has its own shareable URL. Open a concept, copy the link and use it in a presentation, learning session, technical discussion or LinkedIn post.",
      noscript:
        "This atlas renders its concept cards with JavaScript. Enable JavaScript to search, filter and open concepts. The full concept data set remains readable in",
      noscriptLink: "data.js",
      noscriptTail: "on GitHub.",

      /* Concept dialog and page ---------------------------------------- */
      breadcrumbAria: "Breadcrumb",
      backToAtlas: "← Back to the atlas",
      sectionWhy: "Why it matters",
      sectionHow: "How it works",
      sectionExample: "Concrete example",
      sectionFoundations: "Mathematical foundations",
      sectionFormulation: "Mathematical formulation",
      sectionReference: "Primary reference",
      sectionRelated: "Related concepts",
      sectionShare: "Share",
      learnAsideAria: "References and related concepts",
      dialogClose: "Close concept details",
      openFullPage: "Open the full page",
      copyConceptLink: "Copy concept link",
      copyPageLink: "Copy page link",
      nextConcept: "Next concept",
      noRelated: "No related concepts recorded yet.",
      labelConceptLink: "Concept link",
      labelPageLink: "Page link",
      toastCopied: "{label} copied",
      toastCopyManually: "Copy this link: {url}",

      /* Mathematical foundations block --------------------------------- */
      intensityLabel: "Mathematical intensity:",
      intensityHigh: "High",
      intensityMedium: "Medium",
      intensityLow: "Low",
      intensityUnmapped: "not mapped",
      foundationsUnmapped: "The mathematical foundations of this concept have not been mapped yet.",
      foundationsNone: "Core mathematical foundation: none.",
      foundationsCore: "Core mathematics",
      foundationsSupporting: "Supporting mathematics",
      foundationsBrowse: "Browse the whole mathematics layer →",
      mathPending: "A worked mathematical treatment of this concept has not been written yet.",
      mathPendingWithSource:
        "A worked mathematical treatment of this concept has not been written yet. The primary reference alongside carries the full derivation.",
      mathChipAria: "{name}. {branch}. Open the mathematics page.",

      /* Mathematics overview and pages --------------------------------- */
      mathLayerBadge: "Cross-cutting layer",
      mathIndexEyebrow: "A supporting layer, not a ninth domain",
      mathIndexTitle: "Mathematics Behind AI",
      mathIndexIntro:
        "Modern AI rests on a surprisingly small set of recurring mathematical ideas: vectors, matrices, probability distributions, optimization, information theory, graph theory and numerical approximation. This section connects each idea to the techniques that use it. The aim is not to reproduce a textbook, but to make the mathematics behind modern AI intuitive, navigable and tied to concrete technology.",
      mathSearchLabel: "Search mathematical concepts",
      mathSearchPlaceholder: "Search softmax, matrix rank, entropy…",
      mathStatsAria: "Mathematics layer statistics",
      statMathConcepts: "mathematical concepts",
      statBranches: "branches",
      statMathLinks: "links to AI concepts",
      mathFiltersAria: "Filter by branch of mathematics",
      mathDifficultyAria: "Filter by difficulty",
      mathAllBranches: "All branches",
      mathAnyLevel: "Any level",
      mathShowAllBranches: "Show all branches",
      mathResultCount: "{n} mathematical concept shown.|{n} mathematical concepts shown.",
      mathResultNone: "No mathematical concepts match the current filters.",
      mathEmptyBody: "Try another name, symbol, keyword or branch.",
      mathBackAll: "← All mathematics",
      mathBackAllPlain: "All mathematics",
      mathBackTo: "← Back to {acronym}",
      sectionIntuition: "Intuitive explanation",
      sectionEquation: "Essential equation",
      sectionLegend: "What each symbol means",
      sectionWorked: "Worked example",
      sectionWhyInAI: "Why it matters in AI",
      sectionUsedBy: "AI concepts using it",
      sectionPrerequisites: "Prerequisites",
      sectionRelatedMath: "Related mathematics",
      mathAsideAria: "References and related mathematics",
      usedByNone: "No AI concept in the atlas has been mapped to this mathematics yet.",
      usedByCore: "Core to",
      usedBySupporting: "Supporting",
      conceptChipAria: "{name}. {domain}. Open the concept page.",
      noRelatedMath: "No related mathematics recorded yet.",
      noPrerequisites: "None — this is a starting point.",
      usesCount: "{n} AI concept|{n} AI concepts",
      difficultyIntroductory: "Introductory",
      difficultyIntermediate: "Intermediate",
      difficultyAdvanced: "Advanced",

      /* Untranslated-content marker ------------------------------------ */
      englishChip: "EN",
      englishChipTitle: "This section has not been translated yet and is shown in English.",


      /* Quiz — The Dojo ----------------------------------------------- */
      navQuiz: "Dojo",
      quizTitle: "The Dojo",
      quizEyebrow: "Test what the atlas taught you",
      quizIntro: "One run, no second chances, nothing saved. Answer as many as you can and earn your belt. Nothing is stored — no score, no account, no cookie — so the only record of how you did is the one you keep yourself.",
      quizPickLength: "How many questions?",
      quizLengthNote: "Brown and black belts are only awarded on the hundred-question run.",
      quizStart: "Begin",
      quizQuestions: "{n} question|{n} questions",
      quizProgress: "Question {n} of {total}",
      quizScore: "Score: {n}",
      quizCorrect: "Correct",
      quizWrong: "Not quite",
      quizAnswerWas: "The answer was {answer}.",
      quizNext: "Next question",
      quizFinish: "See my belt",
      quizAbandon: "Leave the dojo",
      quizKeyHint: "Press 1–4 to answer, Enter to continue.",
      quizResultTitle: "You scored {correct} out of {total}",
      quizResultPercent: "{n}%",
      quizBeltAwarded: "{belt} belt",
      quizAgain: "Try again",
      quizBackToAtlas: "Back to the atlas",
      quizGatedNote: "Brown and black belts need the hundred-question run. You reached {belt}.",
      quizPerfect: "A perfect run.",


      /* Dojo — entry panel on the atlas ------------------------------- */
      dojoInviteEyebrow: "道場 · The Dojo",
      dojoInviteTitle: "Think you know the atlas?",
      dojoInviteBody: "One run, no second chances, nothing saved. Answer well and you leave with a belt — but brown and black are only tied on the hundred-question run, and beyond them the ten dan wait.",
      dojoInviteCta: "Enter the dojo",
      dojoInviteBelts: "Seven belts, ten dan",

      /* Dojo — room and ritual ---------------------------------------- */
      dojoShomen: "道場",
      dojoBeltWallTitle: "The belts",
      dojoBeltWallNote: "Grades below black count downwards: a beginner is 6ᵗʰ kyū, and 1ˢᵗ kyū is the last step before the black belt.",
      dojoKyu: "{n}ᵗʰ kyū",
      dojoKyuFirst: "1ˢᵗ kyū",
      dojoKyuSecond: "2ⁿᵈ kyū",
      dojoKyuThird: "3ʳᵈ kyū",
      dojoDanRank: "{n}ᵗʰ dan",
      dojoDanFirst: "1ˢᵗ dan",
      dojoDanSecond: "2ⁿᵈ dan",
      dojoDanThird: "3ʳᵈ dan",
      dojoLocked: "Hundred-question run only",
      dojoReiTitle: "礼",
      dojoReiRomaji: "Rei",
      dojoReiBody: "Bow in. Nothing here is recorded, and there is no way back once you begin — you have one run.",
      dojoReiGo: "Rei — begin",
      dojoHajime: "始め · Hajime",
      dojoSoreMade: "それまで · Sore made",
      dojoIppon: "一本 · Ippon",
      dojoWazaAri: "技あり · Waza-ari",
      dojoStreak: "{n} in a row",
      dojoOnTrack: "On track: {belt}",
      dojoCurrentNone: "No grade yet",
      dojoTie: "Tying your belt…",
      dojoAwardedIn: "Awarded in the dojo of the atlas",
      /* Belt names ------------------------------------------------------ */
      beltWhite: "White",
      beltYellow: "Yellow",
      beltOrange: "Orange",
      beltGreen: "Green",
      beltBlue: "Blue",
      beltBrown: "Brown",
      beltBlack: "Black",

      /* Dan challenge --------------------------------------------------- */
      quizDanUnlocked: "You have earned your black belt. The dojo has one more door.",
      quizDanEnter: "Enter the Dan challenge",
      quizDanTitle: "Dan Challenge",
      quizDanEyebrow: "Black belt only",
      quizDanIntro: "Twenty-five questions, the hardest the atlas can ask — relations, foundations, prerequisites and the verbs that join them. Your grade is how few you drop: nine mistakes earns Shodan, a flawless run earns Judan. Ten or more and no dan is awarded.",
      quizDanStart: "Begin the challenge",
      quizDanAwarded: "{rank} dan — {name}",
      quizDanNone: "No dan awarded — ten dropped is the limit, and you dropped {n}. Your black belt stands.",
      quizDanDropped: "Dropped none of 25|Dropped {n} of 25",
      quizDanAllows: "may drop {n}|may drop {n}",
      quizDanBeltBlack: "Black belt",
      quizDanBeltKohaku: "Red-and-white belt",
      quizDanBeltRed: "Red belt",

      /* Question prompts ------------------------------------------------ */
      qAcronym: "What does {token} stand for?",
      qName: "Which token is used for “{name}”?",
      qSummary: "Which concept does this describe?\n\n“{summary}”",
      qDomain: "Which domain does {name} belong to?",
      qOddOne: "Which of these does NOT belong to {domain}?",
      qSymbol: "Which mathematical concept does {symbol} denote?",
      qMathName: "Which symbol denotes {name}?",
      qBranch: "Which branch of mathematics does {name} belong to?",
      qMathSummary: "Which mathematical concept does this describe?\n\n“{summary}”",
      qRelated: "Which concept does {name} declare a relationship with?",
      qFoundation: "Which mathematics does {name} rest on?",
      qUsedBy: "Which concept has {name} as a core mathematical foundation?",
      qPrereq: "Which is a prerequisite of {name}?",
      qRelation: "How does {concept} relate to {math}?",
      qIntensity: "What is the mathematical intensity of {name}?",
      qDifficulty: "Which of these is an {level}-level mathematical concept?",

      /* Footer --------------------------------------------------------- */
      footerName: "AI Concept Atlas",
      footerNote: "Built as an open educational resource. No cookies, no analytics, no tracking."
    },

    fr: {
      /* Document ------------------------------------------------------ */
      htmlLang: "fr",
      baseTitle: "AI Concept Atlas — De LoRA à MCP",
      metaDescription:
        "Un atlas visuel et interactif des concepts essentiels de l’IA — de LoRA et QLoRA au RAG, aux agents, à MCP, à l’IA multimodale, à l’inférence, à l’évaluation et à la sûreté.",
      conceptTitle: "{acronym} — {name} | AI Concept Atlas",
      mathTitle: "{name} — Mathématiques | AI Concept Atlas",
      mathIndexTitleDoc: "Les mathématiques derrière l’IA | AI Concept Atlas",

      /* Header and navigation ----------------------------------------- */
      skipLink: "Aller à l’atlas",
      brandAria: "Accueil de l’AI Concept Atlas",
      brandName: "Atlas des concepts",
      brandTagline: "De LoRA à MCP",
      navAria: "Navigation principale",
      navRandom: "Au hasard",
      navMath: "Mathématiques",
      navAbout: "À propos",
      navGithub: "Voir sur GitHub",
      langAria: "Langue",
      langEnglish: "English",
      langFrench: "Français",
      langSwitchToFrench: "Lire cette page en français",
      langSwitchToEnglish: "Lire cette page en anglais",

      /* Hero ---------------------------------------------------------- */
      heroEyebrow: "Carte interactive des savoirs de l’IA",
      heroTitle: "Comprendre le langage de l’IA moderne.",
      heroIntro:
        "Explorez les fondements, les architectures, les méthodes d’entraînement, les systèmes de recherche d’information, les agents, les techniques d’optimisation, les capacités multimodales et les pratiques de sûreté qui façonnent les systèmes d’IA d’aujourd’hui.",
      searchLabel: "Rechercher un concept",
      searchPlaceholder: "Rechercher LoRA, MCP, RAG, Transformer…",
      searchHint:
        "Appuyez sur la touche barre oblique pour placer le curseur dans ce champ. Utilisez les flèches pour parcourir les suggestions et Entrée pour ouvrir un concept.",
      searchSuggestionsAria: "Suggestions de recherche",
      heroStatsAria: "Statistiques de l’atlas",
      statConcepts: "concepts",
      statDomains: "domaines",
      statDeepLinks: "Liens profonds partageables",
      heroImageAlt:
        "Carte conceptuelle de 87 termes d’IA regroupés en huit domaines — fondements, architectures de modèles, entraînement et adaptation, recherche d’information et connaissance, agents et orchestration, inférence et optimisation, IA multimodale, et évaluation, sûreté et fiabilité — disposés autour d’un noyau central encerclé par les sept branches des mathématiques sur lesquelles ils reposent : algèbre linéaire, probabilités, théorie de l’information, optimisation, analyse numérique, graphes et systèmes dynamiques.",

      /* Atlas section ------------------------------------------------- */
      atlasEyebrow: "Explorer par domaine",
      atlasTitle: "Le paysage de l’IA, un concept à la fois",
      viewToggleAria: "Vue de l’atlas",
      tabDomains: "Domaines",
      tabGraph: "Graphe",
      filtersAria: "Filtrer les concepts par domaine",
      filterAll: "Tous",
      bandFocus: "Isoler",
      bandShowAll: "Voir tous les domaines",
      bandCount: "{n} concept|{n} concepts",
      resultCount: "{n} concept affiché dans {domain}.|{n} concepts affichés dans {domain}.",
      resultNone: "Aucun concept ne correspond à la recherche dans {domain}.",
      allDomains: "tous les domaines",
      emptyTitle: "Aucun concept correspondant",
      emptyBody: "Essayez un autre acronyme, un nom complet, un mot-clé ou un domaine.",
      noConceptFound: "Aucun concept trouvé.",
      resultKindAI: "Concept d’IA",
      resultKindMath: "Mathématiques",

      /* Graph --------------------------------------------------------- */
      graphHint:
        "Les cercles sont des concepts d’IA, les losanges des mathématiques. Chaque trait est une relation déclarée dans les données de l’atlas, et la taille d’un nœud reflète le nombre de liens qui y aboutissent. Sélectionnez un nœud pour l’ouvrir, ou appuyez sur Tab pour les parcourir. Isolez un concept pour ne voir que les mathématiques dont il dépend directement, chaque relation étant nommée.",
      graphAria: "Graphe des relations entre les concepts d’IA et les mathématiques qu’ils utilisent",
      graphLayersAria: "Couches du graphe",
      graphFocusLabel: "Isoler",
      graphWholeAtlas: "Tout l’atlas",
      graphLayerBoth: "Les deux couches",
      graphLayerAI: "IA seulement",
      graphLayerMath: "Mathématiques seulement",
      graphLegendAI: "Concept d’IA",
      graphLegendMath: "Mathématiques",
      graphNodeCount: "{n} nœud|{n} nœuds",
      graphNoFoundations: "{name} ne déclare aucun fondement mathématique.",
      graphNoFoundationsStatus: "{name} n’a aucune dépendance mathématique renseignée.",
      graphFocusStatus: "{name} : {n} dépendances mathématiques directes, dont {core} essentielles.",

      /* Relationship verbs on graph edges ------------------------------ */
      relUSES: "utilise",
      relDEPENDS_ON: "dépend de",
      relMEASURED_WITH: "se mesure avec",
      relOPTIMIZED_BY: "optimisé par",
      relAPPROXIMATES: "approxime",
      relGENERALIZES: "généralise",
      relRELATED_TO: "lié à",

      /* About --------------------------------------------------------- */
      aboutEyebrow: "Pourquoi cet atlas existe",
      aboutTitle: "Une carte pratique pour s’orienter dans les conversations sur l’IA.",
      aboutBody1:
        "Le vocabulaire de l’IA évolue vite et les concepts sont souvent abordés isolément. Cet atlas relie chaque terme à l’ensemble du système : ce qu’il signifie, pourquoi il compte, comment il fonctionne et quels concepts l’entourent.",
      aboutBody2:
        "Chaque concept possède son propre lien partageable. Ouvrez un concept, copiez le lien et utilisez-le dans une présentation, une session de formation, une discussion technique ou un billet LinkedIn.",
      noscript:
        "Cet atlas affiche ses fiches de concepts en JavaScript. Activez JavaScript pour rechercher, filtrer et ouvrir des concepts. L’ensemble des données reste lisible dans",
      noscriptLink: "data.js",
      noscriptTail: "sur GitHub.",

      /* Concept dialog and page ---------------------------------------- */
      breadcrumbAria: "Fil d’Ariane",
      backToAtlas: "← Retour à l’atlas",
      sectionWhy: "Pourquoi c’est important",
      sectionHow: "Comment ça fonctionne",
      sectionExample: "Exemple concret",
      sectionFoundations: "Fondements mathématiques",
      sectionFormulation: "Formulation mathématique",
      sectionReference: "Référence principale",
      sectionRelated: "Concepts liés",
      sectionShare: "Partager",
      learnAsideAria: "Références et concepts liés",
      dialogClose: "Fermer le détail du concept",
      openFullPage: "Ouvrir la page complète",
      copyConceptLink: "Copier le lien du concept",
      copyPageLink: "Copier le lien de la page",
      nextConcept: "Concept suivant",
      noRelated: "Aucun concept lié n’a encore été renseigné.",
      labelConceptLink: "Lien du concept",
      labelPageLink: "Lien de la page",
      toastCopied: "{label} copié",
      toastCopyManually: "Copiez ce lien : {url}",

      /* Mathematical foundations block --------------------------------- */
      intensityLabel: "Intensité mathématique :",
      intensityHigh: "Élevée",
      intensityMedium: "Moyenne",
      intensityLow: "Faible",
      intensityUnmapped: "non renseignée",
      foundationsUnmapped: "Les fondements mathématiques de ce concept n’ont pas encore été cartographiés.",
      foundationsNone: "Fondement mathématique essentiel : aucun.",
      foundationsCore: "Mathématiques essentielles",
      foundationsSupporting: "Mathématiques de soutien",
      foundationsBrowse: "Parcourir toute la couche mathématique →",
      mathPending: "Le traitement mathématique détaillé de ce concept n’a pas encore été rédigé.",
      mathPendingWithSource:
        "Le traitement mathématique détaillé de ce concept n’a pas encore été rédigé. La référence principale ci-contre en donne la dérivation complète.",
      mathChipAria: "{name}. {branch}. Ouvrir la page de mathématiques.",

      /* Mathematics overview and pages --------------------------------- */
      mathLayerBadge: "Couche transversale",
      mathIndexEyebrow: "Une couche de soutien, pas un neuvième domaine",
      mathIndexTitle: "Les mathématiques derrière l’IA",
      mathIndexIntro:
        "L’IA moderne repose sur un ensemble étonnamment restreint d’idées mathématiques récurrentes : vecteurs, matrices, distributions de probabilité, optimisation, théorie de l’information, théorie des graphes et approximation numérique. Cette section relie chaque idée aux techniques qui l’utilisent. L’objectif n’est pas de reproduire un manuel, mais de rendre les mathématiques de l’IA moderne intuitives, navigables et rattachées à des technologies concrètes.",
      mathSearchLabel: "Rechercher un concept mathématique",
      mathSearchPlaceholder: "Rechercher softmax, rang d’une matrice, entropie…",
      mathStatsAria: "Statistiques de la couche mathématique",
      statMathConcepts: "concepts mathématiques",
      statBranches: "branches",
      statMathLinks: "liens vers des concepts d’IA",
      mathFiltersAria: "Filtrer par branche des mathématiques",
      mathDifficultyAria: "Filtrer par niveau",
      mathAllBranches: "Toutes les branches",
      mathAnyLevel: "Tous les niveaux",
      mathShowAllBranches: "Voir toutes les branches",
      mathResultCount: "{n} concept mathématique affiché.|{n} concepts mathématiques affichés.",
      mathResultNone: "Aucun concept mathématique ne correspond aux filtres actuels.",
      mathEmptyBody: "Essayez un autre nom, symbole, mot-clé ou branche.",
      mathBackAll: "← Toutes les mathématiques",
      mathBackAllPlain: "Toutes les mathématiques",
      mathBackTo: "← Retour à {acronym}",
      sectionIntuition: "Explication intuitive",
      sectionEquation: "Équation essentielle",
      sectionLegend: "Ce que signifie chaque symbole",
      sectionWorked: "Exemple chiffré",
      sectionWhyInAI: "Pourquoi c’est important en IA",
      sectionUsedBy: "Concepts d’IA qui l’utilisent",
      sectionPrerequisites: "Prérequis",
      sectionRelatedMath: "Mathématiques liées",
      mathAsideAria: "Références et mathématiques liées",
      usedByNone: "Aucun concept d’IA de l’atlas n’est encore rattaché à cette notion mathématique.",
      usedByCore: "Essentiel pour",
      usedBySupporting: "En soutien de",
      conceptChipAria: "{name}. {domain}. Ouvrir la page du concept.",
      noRelatedMath: "Aucune mathématique liée n’a encore été renseignée.",
      noPrerequisites: "Aucun — c’est un point de départ.",
      usesCount: "{n} concept d’IA|{n} concepts d’IA",
      difficultyIntroductory: "Introductif",
      difficultyIntermediate: "Intermédiaire",
      difficultyAdvanced: "Avancé",

      /* Untranslated-content marker ------------------------------------ */
      englishChip: "EN",
      englishChipTitle: "Cette section n’est pas encore traduite et s’affiche en anglais.",


      /* Quiz — The Dojo ----------------------------------------------- */
      navQuiz: "Dojo",
      quizTitle: "Le Dojo",
      quizEyebrow: "Vérifiez ce que l’atlas vous a appris",
      quizIntro: "Une seule tentative, aucune seconde chance, rien d’enregistré. Répondez au mieux et gagnez votre ceinture. Rien n’est conservé — ni score, ni compte, ni cookie — si bien que la seule trace de votre résultat est celle que vous gardez vous-même.",
      quizPickLength: "Combien de questions ?",
      quizLengthNote: "Les ceintures marron et noire ne s’obtiennent que sur la série de cent questions.",
      quizStart: "Commencer",
      quizQuestions: "{n} question|{n} questions",
      quizProgress: "Question {n} sur {total}",
      quizScore: "Score : {n}",
      quizCorrect: "Correct",
      quizWrong: "Presque",
      quizAnswerWas: "La réponse était {answer}.",
      quizNext: "Question suivante",
      quizFinish: "Voir ma ceinture",
      quizAbandon: "Quitter le dojo",
      quizKeyHint: "Appuyez sur 1 à 4 pour répondre, Entrée pour continuer.",
      quizResultTitle: "Vous obtenez {correct} sur {total}",
      quizResultPercent: "{n} %",
      quizBeltAwarded: "Ceinture {belt}",
      quizAgain: "Réessayer",
      quizBackToAtlas: "Retour à l’atlas",
      quizGatedNote: "Les ceintures marron et noire exigent la série de cent questions. Vous atteignez {belt}.",
      quizPerfect: "Un parcours parfait.",


      /* Dojo — entry panel on the atlas ------------------------------- */
      dojoInviteEyebrow: "道場 · Le Dojo",
      dojoInviteTitle: "Vous pensez connaître l’atlas ?",
      dojoInviteBody: "Une seule tentative, aucune seconde chance, rien d’enregistré. Répondez bien et vous repartez ceinturé — mais la marron et la noire ne se nouent que sur la série de cent questions, et au-delà les dix dans attendent.",
      dojoInviteCta: "Entrer dans le dojo",
      dojoInviteBelts: "Sept ceintures, dix dans",

      /* Dojo — room and ritual ---------------------------------------- */
      dojoShomen: "道場",
      dojoBeltWallTitle: "Les ceintures",
      dojoBeltWallNote: "Les grades sous la noire se comptent à rebours : un débutant est 6ᵉ kyū, et le 1ᵉʳ kyū est la dernière marche avant la ceinture noire.",
      dojoKyu: "{n}ᵉ kyū",
      dojoKyuFirst: "1ᵉʳ kyū",
      dojoKyuSecond: "2ᵉ kyū",
      dojoKyuThird: "3ᵉ kyū",
      dojoDanRank: "{n}ᵉ dan",
      dojoDanFirst: "1ᵉʳ dan",
      dojoDanSecond: "2ᵉ dan",
      dojoDanThird: "3ᵉ dan",
      dojoLocked: "Série de cent questions uniquement",
      dojoReiTitle: "礼",
      dojoReiRomaji: "Rei",
      dojoReiBody: "Saluez. Rien ici n’est enregistré, et il n’y a pas de retour en arrière une fois commencé — vous avez une seule tentative.",
      dojoReiGo: "Rei — commencer",
      dojoHajime: "始め · Hajime",
      dojoSoreMade: "それまで · Sore made",
      dojoIppon: "一本 · Ippon",
      dojoWazaAri: "技あり · Waza-ari",
      dojoStreak: "{n} d’affilée",
      dojoOnTrack: "En passe d’obtenir : {belt}",
      dojoCurrentNone: "Pas encore de grade",
      dojoTie: "On noue votre ceinture…",
      dojoAwardedIn: "Décerné dans le dojo de l’atlas",
      /* Belt names ------------------------------------------------------ */
      beltWhite: "blanche",
      beltYellow: "jaune",
      beltOrange: "orange",
      beltGreen: "verte",
      beltBlue: "bleue",
      beltBrown: "marron",
      beltBlack: "noire",

      /* Dan challenge --------------------------------------------------- */
      quizDanUnlocked: "Vous avez gagné votre ceinture noire. Le dojo a encore une porte.",
      quizDanEnter: "Entrer dans le défi Dan",
      quizDanTitle: "Défi Dan",
      quizDanEyebrow: "Ceinture noire uniquement",
      quizDanIntro: "Vingt-cinq questions, les plus difficiles que l’atlas puisse poser — relations, fondements, prérequis et les verbes qui les relient. Votre grade dépend du nombre de fautes : neuf fautes valent le Shodan, un parcours sans faute le Judan. Dix fautes ou plus et aucun dan n’est attribué.",
      quizDanStart: "Commencer le défi",
      quizDanAwarded: "{rank}e dan — {name}",
      quizDanNone: "Aucun dan attribué — la limite est de dix fautes, vous en avez {n}. Votre ceinture noire demeure.",
      quizDanDropped: "Aucune faute sur 25|{n} fautes sur 25",
      quizDanAllows: "{n} faute tolérée|{n} fautes tolérées",
      quizDanBeltBlack: "Ceinture noire",
      quizDanBeltKohaku: "Ceinture rouge et blanche",
      quizDanBeltRed: "Ceinture rouge",

      /* Question prompts ------------------------------------------------ */
      qAcronym: "Que signifie {token} ?",
      qName: "Quel token désigne « {name} » ?",
      qSummary: "Quel concept est ici décrit ?\n\n« {summary} »",
      qDomain: "À quel domaine appartient {name} ?",
      qOddOne: "Lequel de ces concepts n’appartient PAS à {domain} ?",
      qSymbol: "Quel concept mathématique {symbol} désigne-t-il ?",
      qMathName: "Quel symbole désigne {name} ?",
      qBranch: "À quelle branche des mathématiques appartient {name} ?",
      qMathSummary: "Quel concept mathématique est ici décrit ?\n\n« {summary} »",
      qRelated: "Avec quel concept {name} déclare-t-il une relation ?",
      qFoundation: "Sur quelles mathématiques {name} repose-t-il ?",
      qUsedBy: "Quel concept a {name} pour fondement mathématique essentiel ?",
      qPrereq: "Lequel est un prérequis de {name} ?",
      qRelation: "Quelle relation {concept} entretient-il avec {math} ?",
      qIntensity: "Quelle est l’intensité mathématique de {name} ?",
      qDifficulty: "Lequel de ces concepts mathématiques est de niveau {level} ?",

      /* Footer --------------------------------------------------------- */
      footerName: "AI Concept Atlas",
      footerNote:
        "Ressource éducative ouverte. Aucun cookie, aucune mesure d’audience, aucun traçage."
    }
  };

  const table = STRINGS[lang] ?? STRINGS[DEFAULT_LANG];
  const fallback = STRINGS[DEFAULT_LANG];

  /**
   * Look up a string, filling `{placeholders}` from `vars`.
   *
   * Pass `vars.n` and the value may carry a `singular|plural` pair, selected by
   * the language's own rule. A key with no entry falls back to English rather
   * than rendering the key name at the reader.
   */
  function t(key, vars) {
    let value = table[key] ?? fallback[key];
    if (value === undefined) return "";
    if (value.includes("|")) {
      const forms = value.split("|");
      const index = (PLURAL[lang] ?? PLURAL.en)(Number(vars?.n ?? 0));
      value = forms[index] ?? forms[0];
    }
    if (!vars) return value;
    return value.replace(/\{(\w+)\}/g, (match, name) =>
      Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : match);
  }

  /* ================================================================= */
  /* Content localization                                               */
  /* ================================================================= */

  /**
   * Fold a `slug → { field: translation }` overlay into a data array.
   *
   * Returns new objects — the source arrays are never mutated, so `data.js`
   * stays the single English record and a bug here cannot corrupt it. Each
   * result carries a non-enumerable-ish `_en` Set naming the fields that fell
   * back to English, which is what the renderers use to mark a section.
   */
  const isEmpty = (value) =>
    value === undefined || value === null || value === "" ||
    (Array.isArray(value) && value.length === 0);

  function localize(items, overlay, fields) {
    if (lang === DEFAULT_LANG) return items;
    const map = overlay ?? {};
    return items.map((item) => {
      const patch = map[item.slug ?? item.id];
      const copy = { ...item };
      const untranslated = new Set();
      for (const field of fields) {
        const value = patch?.[field];
        if (isEmpty(value)) {
          if (!isEmpty(item[field])) untranslated.add(field);
        } else {
          copy[field] = value;
        }
      }

      /* ---- Fields that are not plain strings ----------------------------
         Three shapes need their own handling, and each is keyed rather than
         positional wherever a key exists, so reordering the English can never
         silently pair a French sentence with the wrong entry.

         whyInAI  — a positional array. Position is the only identity a bare
                    list has, so the overlay must match it exactly in length;
                    a mismatch is ignored and reported, never half-applied.
         legend   — keyed by the symbol it explains, which is never translated
                    and therefore makes a stable key.
         mathFoundations[].note — keyed by the mathematics slug it points at.
                    The notes live on the AI concept but surface on both page
                    types, so translating them here fixes both at once. */

      if (Array.isArray(item.whyInAI) && item.whyInAI.length) {
        const list = patch?.whyInAI;
        if (Array.isArray(list) && list.length === item.whyInAI.length && list.every(Boolean)) {
          copy.whyInAI = list;
          untranslated.delete("whyInAI");
        } else {
          untranslated.add("whyInAI");
        }
      }

      if (Array.isArray(item.legend) && item.legend.length) {
        const bySymbol = patch?.legend;
        const missing = item.legend.some((row) => !bySymbol?.[row.symbol]);
        if (bySymbol && !missing) {
          copy.legend = item.legend.map((row) => ({ ...row, meaning: bySymbol[row.symbol] }));
          untranslated.delete("legend");
        } else if (missing || !bySymbol) {
          untranslated.add("legend");
        }
      }

      if (Array.isArray(item.mathFoundations) && item.mathFoundations.length) {
        const notes = patch?.foundations;
        const withNotes = item.mathFoundations.filter((link) => link.note);
        const missing = withNotes.some((link) => !notes?.[link.slug]);
        if (notes && !missing) {
          copy.mathFoundations = item.mathFoundations.map((link) =>
            notes[link.slug] ? { ...link, note: notes[link.slug] } : link);
          untranslated.delete("foundations");
        } else if (withNotes.length) {
          untranslated.add("foundations");
        }
      }

      copy._en = untranslated;
      copy._enName = item.name;
      return copy;
    });
  }

  /** True when this field is showing English inside a French page. */
  const isEnglish = (item, field) => lang !== DEFAULT_LANG && Boolean(item?._en?.has(field));

  /* ================================================================= */
  /* Static markup                                                      */
  /* ================================================================= */

  /**
   * Translate everything index.html marked up, in one pass at boot.
   *
   *   data-i18n="key"            → textContent
   *   data-i18n-attr="attr:key"  → setAttribute, semicolon-separated for several
   *
   * Elements with no marker are left alone, so adding markup to the page never
   * silently blanks it out.
   */
  function applyStatic(root = document) {
    for (const node of root.querySelectorAll("[data-i18n]")) {
      const value = t(node.dataset.i18n);
      if (value) node.textContent = value;
    }
    for (const node of root.querySelectorAll("[data-i18n-attr]")) {
      for (const pair of node.dataset.i18nAttr.split(";")) {
        const [attr, key] = pair.split(":").map((part) => part.trim());
        if (!attr || !key) continue;
        const value = t(key);
        if (value) node.setAttribute(attr, value);
      }
    }
    document.documentElement.setAttribute("lang", t("htmlLang"));
  }

  /* ================================================================= */
  /* Language links                                                     */
  /* ================================================================= */

  /**
   * The same page in another language: current path, the target `lang`, and
   * the hash untouched. Built from `location.href` rather than `location.origin`
   * for the same reason `absolute()` in app.js is — on a file:// document
   * `origin` is the literal string "null".
   */
  function hrefFor(target, hash = location.hash) {
    const base = location.href.split("#")[0].split("?")[0];
    const query = target === DEFAULT_LANG ? "" : `?lang=${encodeURIComponent(target)}`;
    return `${base}${query}${hash || ""}`;
  }

  return {
    lang,
    isDefault: lang === DEFAULT_LANG,
    supported: SUPPORTED.slice(),
    defaultLang: DEFAULT_LANG,
    strings: STRINGS,
    t,
    localize,
    isEnglish,
    applyStatic,
    hrefFor
  };
})();
