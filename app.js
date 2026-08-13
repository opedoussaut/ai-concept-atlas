(() => {
  /* ================================================================= */
  /* Language                                                           */
  /*                                                                    */
  /* i18n.js reads ?lang off the URL and folds the French overlay into  */
  /* the data ONCE, here, before anything indexes or renders it. Every  */
  /* line below this point therefore reads an object that is already in */
  /* the right language and never asks which language it is in. The     */
  /* only exceptions are the handful of places that must say "this bit  */
  /* is still English" — they call i18n.isEnglish(item, field).         */
  /*                                                                    */
  /* Language is a property of the URL, so changing it is an ordinary   */
  /* navigation and the page reloads. There is no live re-render path.  */
  /* ================================================================= */

  const i18n = window.ATLAS_I18N;
  const t = i18n.t;

  /* Translate the static markup first. app.js runs at the end of <body>, so
     the document is parsed; doing it here means nothing below ever reads a
     placeholder, label or heading that is still in the wrong language. */
  i18n.applyStatic();

  const concepts = i18n.localize(
    window.AI_CONCEPTS ?? [], window.AI_CONCEPTS_FR,
    // `foundations` is not listed: it is nested, so localize() handles it by shape.
    ["name", "summary", "why", "how", "example", "mathNote"]
  );
  const categories = i18n.localize(
    (window.AI_CATEGORIES ?? []).map((item) => ({ ...item, slug: item.id })),
    window.AI_CATEGORIES_FR, ["name", "short"]
  );
  const conceptBySlug = new Map(concepts.map((item) => [item.slug, item]));
  const categoryById = new Map(categories.map((item) => [item.id, item]));
  const FALLBACK_CATEGORY = { id: "all", name: "—", short: "—", color: "#5de7ff" };
  const MAX_SUGGESTIONS = 7;
  const BASE_TITLE = t("baseTitle");

  /* ----------------------------------------------------------------- */
  /* Mathematics layer                                                   */
  /*                                                                     */
  /* Mathematics is a cross-cutting layer over the eight AI domains, not */
  /* a ninth domain. The AI → mathematics direction is declared once, on */
  /* the AI concept, in `mathFoundations`. The mathematics → AI direction */
  /* is derived below rather than stored, so the two can never disagree. */
  /* ----------------------------------------------------------------- */

  const mathConcepts = i18n.localize(
    window.MATH_CONCEPTS ?? [], window.MATH_CONCEPTS_FR,
    // `whyInAI` and `legend` are not listed: an array and a keyed map, both
    // handled by shape in localize() rather than as plain strings.
    ["name", "summary", "intuition", "equationNote", "worked"]
  );
  const mathCategories = i18n.localize(
    (window.MATH_CATEGORIES ?? []).map((item) => ({ ...item, slug: item.id })),
    window.MATH_CATEGORIES_FR, ["name", "short"]
  );
  const mathBySlug = new Map(mathConcepts.map((item) => [item.slug, item]));
  const mathCategoryById = new Map(mathCategories.map((item) => [item.id, item]));
  const FALLBACK_MATH_CATEGORY = {
    id: "all", name: t("graphLegendMath"), short: t("graphLegendMath"), color: "#ffc978"
  };

  const INTENSITY_LABEL = {
    high: t("intensityHigh"), medium: t("intensityMedium"), low: t("intensityLow")
  };
  const DIFFICULTY_LABEL = {
    introductory: t("difficultyIntroductory"),
    intermediate: t("difficultyIntermediate"),
    advanced: t("difficultyAdvanced")
  };

  /** mathSlug → [{ concept, importance, note }], the reverse of mathFoundations. */
  const usedByMath = new Map(mathConcepts.map((item) => [item.slug, []]));
  let mathLinkCount = 0;
  for (const concept of concepts) {
    for (const link of concept.mathFoundations ?? []) {
      const bucket = usedByMath.get(link.slug);
      if (!bucket) continue; // The validator fails the build on a broken link.
      bucket.push({ concept, importance: link.importance ?? "supporting", note: link.note ?? "" });
      mathLinkCount += 1;
    }
  }

  const state = {
    category: "all",
    query: "",
    view: "bands",
    current: null,
    learning: null,
    math: null,
    mathIndex: false,
    mathOrigin: null,
    mathCategory: "all",
    mathDifficulty: "all",
    graphLayer: "both",
    graphFocus: null,
    activeSuggestion: -1,
    lastTrigger: null
  };

  const $ = (id) => document.getElementById(id);
  const atlasView = $("atlasView");
  const learnView = $("learnView");
  const bands = $("domainBands");
  const bandsPanel = $("bandsPanel");
  const graphPanel = $("graphPanel");
  const graphSvg = $("conceptGraph");
  const graphLegend = $("graphLegend");
  const filters = $("filters");
  const searchInput = $("searchInput");
  const searchResults = $("searchResults");
  const resultStatus = $("resultStatus");
  const dialog = $("conceptDialog");
  const toast = $("toast");
  const tabs = [$("tabBands"), $("tabGraph")];
  const mathIndexView = $("mathIndexView");
  const mathView = $("mathView");
  const quizView = $("quizView");
  const quizStage = $("quizStage");
  const mathBranches = $("mathBranches");
  const mathFilters = $("mathFilters");
  const mathDifficultyFilters = $("mathDifficultyFilters");
  const mathSearchInput = $("mathSearchInput");
  const mathStatus = $("mathStatus");
  const graphLayers = $("graphLayers");
  const graphFocusSelect = $("graphFocus");

  $("conceptCount").textContent = String(concepts.length);
  $("categoryCount").textContent = String(categories.length);
  $("mathCount").textContent = String(mathConcepts.length);
  $("mathBranchCount").textContent = String(mathCategories.length);
  $("mathLinkCount").textContent = String(mathLinkCount);

  /** The four top-level panels are mutually exclusive; this is the only switch. */
  const VIEWS = {
    atlas: atlasView, learn: learnView, mathIndex: mathIndexView, math: mathView, quiz: quizView
  };
  function showView(name) {
    for (const key of Object.keys(VIEWS)) VIEWS[key].hidden = key !== name;
    // The Dojo schedules its grading ceremony on a timer. Walking out during
    // that pause used to leave the timer to fire and write an award into a
    // panel the reader had already left — harmless to look at, but it graded a
    // run that was abandoned. showView is the one authoritative switch, so it
    // is the right place to cancel.
    if (name !== "quiz") window.clearTimeout(renderQuizResult.timer);
  }

  const categoryOf = (concept) => categoryById.get(concept.category) ?? FALLBACK_CATEGORY;
  const mathCategoryOf = (item) => mathCategoryById.get(item.category) ?? FALLBACK_MATH_CATEGORY;

  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  })[char]);

  /**
   * Flag a section heading whose body is still English.
   *
   * Idempotent, and a no-op in English — an English page has nothing to mark,
   * so the chip cannot leak into the default language. The chip is appended to
   * the heading rather than wrapped around the prose so it survives the
   * `textContent =` assignments the renderers use for the body.
   */
  function markLanguage(headingId, item, field) {
    const heading = $(headingId);
    if (!heading) return;
    const existing = heading.querySelector(".lang-chip");
    if (!i18n.isEnglish(item, field)) { existing?.remove(); return; }
    if (existing) return;
    const chip = document.createElement("span");
    chip.className = "lang-chip";
    chip.lang = i18n.defaultLang;
    chip.textContent = t("englishChip");
    chip.title = t("englishChipTitle");
    heading.appendChild(chip);
  }

  /** Body text that may still be English needs its own `lang` for screen readers. */
  function setProse(elementId, item, field) {
    const node = $(elementId);
    if (!node) return;
    node.textContent = item[field] || "";
    if (i18n.isEnglish(item, field)) node.setAttribute("lang", i18n.defaultLang);
    else node.removeAttribute("lang");
  }

  const hostOf = (url) => { try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return ""; } };

  /* ================================================================= */
  /* Search index                                                       */
  /* ================================================================= */

  // Fold accents, collapse punctuation and hyphens to spaces so that
  // "retrieval augmented", "Retrieval-Augmented" and "RETRIEVALAUGMENTED"
  // all reach the same normalized form.
  const normalize = (value) => String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

  /**
   * The concept's name in the OTHER language.
   *
   * Search is bilingual on purpose. A French reader who has only ever seen
   * "Retrieval-Augmented Generation" in a paper must still find it on the
   * French site, and an English reader who types "apprentissage profond" should
   * land on Deep Learning. Both names go into the index in both modes; only the
   * displayed one changes. Costs one extra string per concept and removes the
   * single most likely way for a reader to conclude the atlas does not have
   * something it plainly does.
   */
  const otherName = (item, overlay) =>
    i18n.isDefault ? (overlay?.[item.slug]?.name ?? "") : (item._enName ?? "");

  const searchIndex = new Map(concepts.map((concept) => {
    const category = categoryOf(concept);
    const alt = otherName(concept, window.AI_CONCEPTS_FR);
    return [concept.slug, {
      acronym: normalize(concept.acronym),
      name: normalize(concept.name),
      alt: normalize(alt),
      slug: normalize(concept.slug),
      tags: normalize((concept.tags ?? []).join(" ")),
      summary: normalize(concept.summary),
      category: normalize(`${category.name} ${category.short ?? ""}`),
      prose: normalize(`${concept.summary} ${concept.why} ${concept.how} ${concept.example ?? ""}`),
      compact: normalize(`${concept.acronym} ${concept.name} ${alt} ${concept.slug}`).replace(/ /g, "")
    }];
  }));

  /* The other language's name scores just under the displayed one at every
     tier, so a bilingual match never outranks a match in the language the
     reader is actually looking at. */
  function scoreToken(entry, token) {
    if (entry.acronym === token) return 120;
    if (entry.name === token || entry.slug === token) return 110;
    if (entry.alt && entry.alt === token) return 105;
    if (entry.acronym.startsWith(token)) return 90;
    if (entry.name.startsWith(token)) return 80;
    if (entry.alt && entry.alt.startsWith(token)) return 75;
    if (entry.compact.startsWith(token)) return 70;
    if (new RegExp(`\\b${token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`).test(entry.name)) return 60;
    if (entry.alt && new RegExp(`\\b${token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`).test(entry.alt)) return 55;
    if (entry.tags.includes(token)) return 45;
    if (entry.category.includes(token)) return 35;
    if (entry.summary.includes(token)) return 30;
    if (entry.compact.includes(token)) return 25;
    if (entry.prose.includes(token)) return 12;
    return 0;
  }

  /* Sort ties by name in the reader's own language: a plain localeCompare()
     with no locale orders "Élagage" after "Zéro" in some engines. */
  const collator = new Intl.Collator(i18n.lang, { sensitivity: "base", numeric: true });

  /** All tokens must match (AND semantics); results are ranked by total score. */
  function search(rawQuery) {
    const tokens = normalize(rawQuery).split(" ").filter(Boolean);
    if (!tokens.length) return concepts.slice();

    const scored = [];
    for (const concept of concepts) {
      const entry = searchIndex.get(concept.slug);
      let total = 0;
      let matchedAll = true;
      for (const token of tokens) {
        const score = scoreToken(entry, token);
        if (!score) { matchedAll = false; break; }
        total += score;
      }
      if (matchedAll) scored.push({ concept, score: total });
    }

    return scored
      .sort((a, b) => b.score - a.score || collator.compare(a.concept.name, b.concept.name))
      .map((item) => item.concept);
  }

  function getVisibleConcepts() {
    const ranked = search(state.query);
    return state.category === "all"
      ? ranked
      : ranked.filter((concept) => concept.category === state.category);
  }

  /**
   * The mathematics index uses the same entry shape and the same scorer, so a
   * query ranks both layers on one scale. `symbol` stands in for `acronym`, and
   * the words "mathematics", "maths" and "math" are folded into the category
   * field so that typing any of them surfaces the whole layer.
   */
  const mathSearchIndex = new Map(mathConcepts.map((item) => {
    const category = mathCategoryOf(item);
    const alt = otherName(item, window.MATH_CONCEPTS_FR);
    return [item.slug, {
      acronym: normalize(item.symbol),
      name: normalize(item.name),
      alt: normalize(alt),
      slug: normalize(item.slug),
      tags: normalize((item.tags ?? []).join(" ")),
      summary: normalize(item.summary),
      category: normalize(`${category.name} ${category.short ?? ""} mathematics maths math mathematiques maths`),
      prose: normalize(`${item.summary} ${item.intuition} ${(item.whyInAI ?? []).join(" ")}`),
      compact: normalize(`${item.symbol} ${item.name} ${alt} ${item.slug}`).replace(/ /g, "")
    }];
  }));

  function rank(items, indexMap, tokens, kind, into) {
    for (const item of items) {
      const entry = indexMap.get(item.slug);
      let total = 0;
      for (const token of tokens) {
        const score = scoreToken(entry, token);
        if (!score) { total = 0; break; }
        total += score;
      }
      if (total) into.push({ item, kind, score: total });
    }
  }

  function searchMath(rawQuery) {
    const tokens = normalize(rawQuery).split(" ").filter(Boolean);
    if (!tokens.length) return mathConcepts.slice();
    const scored = [];
    rank(mathConcepts, mathSearchIndex, tokens, "math", scored);
    return scored
      .sort((a, b) => b.score - a.score || collator.compare(a.item.name, b.item.name))
      .map((entry) => entry.item);
  }

  /** Both layers, one ranking. Each result carries the kind it came from. */
  function searchEverything(rawQuery) {
    const tokens = normalize(rawQuery).split(" ").filter(Boolean);
    if (!tokens.length) return [];
    const scored = [];
    rank(concepts, searchIndex, tokens, "concept", scored);
    rank(mathConcepts, mathSearchIndex, tokens, "math", scored);
    return scored
      .sort((a, b) => b.score - a.score || collator.compare(a.item.name, b.item.name))
      .map((entry) => ({ kind: entry.kind, item: entry.item }));
  }

  /* ================================================================= */
  /* Relationship graph — two node types, typed edges                   */
  /*                                                                     */
  /* One node list spans both layers. Mathematics node ids are prefixed  */
  /* "math:" so the two namespaces can never collide. Edges carry a      */
  /* relation verb and a layer, which is what the styling and the focus  */
  /* view read; nothing about the relationships is invented here, they   */
  /* come from `related`, `prerequisites` and `mathFoundations`.         */
  /* ================================================================= */

  const GRAPH = { width: 1000, height: 680 };
  const MATH_ID = (slug) => `math:${slug}`;

  const RELATION_LABEL = {
    USES: t("relUSES"),
    DEPENDS_ON: t("relDEPENDS_ON"),
    MEASURED_WITH: t("relMEASURED_WITH"),
    OPTIMIZED_BY: t("relOPTIMIZED_BY"),
    APPROXIMATES: t("relAPPROXIMATES"),
    GENERALIZES: t("relGENERALIZES"),
    RELATED_TO: t("relRELATED_TO")
  };

  const graphNodeList = [
    ...concepts.map((item) => ({
      id: item.slug, kind: "concept", item,
      token: item.acronym, group: item.category, anchor: `concept:${item.category}`
    })),
    ...mathConcepts.map((item) => ({
      id: MATH_ID(item.slug), kind: "math", item,
      token: item.symbol, group: item.category, anchor: `math:${item.category}`
    }))
  ];
  const graphNodeById = new Map(graphNodeList.map((node) => [node.id, node]));

  /**
   * Undirected and deduplicated. `weight` drives spring strength and stroke
   * weight: a prerequisite or a core mathematical foundation is a stronger tie
   * than a "related" cross-reference. Prerequisites are collected before plain
   * relations so the stronger verb wins a duplicated pair.
   */
  const graphEdgeList = (() => {
    const seen = new Set();
    const list = [];
    const add = (source, target, relation, weight, layer) => {
      if (source === target) return;
      const key = [source, target].sort().join("|");
      if (seen.has(key)) return;
      seen.add(key);
      list.push({ source, target, relation, weight, layer });
    };

    for (const item of mathConcepts) {
      for (const slug of item.prerequisites ?? []) {
        if (mathBySlug.has(slug)) add(MATH_ID(item.slug), MATH_ID(slug), "DEPENDS_ON", 2, "math");
      }
    }
    for (const item of mathConcepts) {
      for (const slug of item.related ?? []) {
        if (mathBySlug.has(slug)) add(MATH_ID(item.slug), MATH_ID(slug), "RELATED_TO", 1, "math");
      }
    }
    for (const concept of concepts) {
      for (const link of concept.mathFoundations ?? []) {
        const target = mathBySlug.get(link.slug);
        if (!target) continue;
        add(concept.slug, MATH_ID(link.slug),
          link.relation ?? target.relation ?? "USES",
          link.importance === "primary" ? 2 : 1,
          link.importance === "primary" ? "bridge" : "bridge-soft");
      }
      for (const slug of concept.related ?? []) {
        if (conceptBySlug.has(slug)) add(concept.slug, slug, "RELATED_TO", 1, "ai");
      }
    }
    return list;
  })();

  const graphDegree = new Map(graphNodeList.map((node) => [node.id, 0]));
  const graphNeighbours = new Map(graphNodeList.map((node) => [node.id, new Set()]));
  for (const edge of graphEdgeList) {
    graphDegree.set(edge.source, graphDegree.get(edge.source) + 1);
    graphDegree.set(edge.target, graphDegree.get(edge.target) + 1);
    graphNeighbours.get(edge.source).add(edge.target);
    graphNeighbours.get(edge.target).add(edge.source);
  }

  /** Direct mathematical dependencies of one AI concept, in declared order. */
  function mathDependenciesOf(concept) {
    return (concept.mathFoundations ?? [])
      .map((link) => ({ link, item: mathBySlug.get(link.slug) }))
      .filter((entry) => entry.item);
  }

  /**
   * Anchor rings. In the combined view the eight AI domains sit on an outer
   * ring and the seven mathematics branches on an inner one, so the picture
   * reads as "the mathematics underneath, the techniques around it". Viewing
   * one layer alone gives that layer the whole ring.
   */
  function anchorsFor(mode) {
    const anchors = new Map();
    const cx = GRAPH.width / 2;
    const cy = GRAPH.height / 2;

    if (mode !== "math") {
      const rx = mode === "both" ? 330 : 250;
      const ry = mode === "both" ? 252 : 190;
      categories.forEach((category, index) => {
        const spoke = index / categories.length * Math.PI * 2;
        anchors.set(`concept:${category.id}`, { x: cx + Math.cos(spoke) * rx, y: cy + Math.sin(spoke) * ry });
      });
    }
    if (mode !== "ai") {
      const rx = mode === "both" ? 122 : 250;
      const ry = mode === "both" ? 94 : 190;
      mathCategories.forEach((category, index) => {
        // Offset half a step so inner nodes do not sit directly under an outer spoke.
        const spoke = index / mathCategories.length * Math.PI * 2 + Math.PI / mathCategories.length;
        anchors.set(`math:${category.id}`, { x: cx + Math.cos(spoke) * rx, y: cy + Math.sin(spoke) * ry });
      });
    }
    return anchors;
  }

  /**
   * Deterministic force-directed layout: repulsion between every pair,
   * springs along declared relationships, mild gravity toward each group's
   * anchor so the clusters stay legible. Runs once per layer mode.
   */
  function computeGraphLayout(source, edges, anchors) {
    const nodes = source.map((entry, index) => {
      const anchor = anchors.get(entry.anchor);
      const jitter = ((index * 2654435761) % 1000) / 1000;
      const spoke = jitter * Math.PI * 2;
      return {
        slug: entry.id,
        anchor: entry.anchor,
        x: (anchor?.x ?? GRAPH.width / 2) + Math.cos(spoke) * 60,
        y: (anchor?.y ?? GRAPH.height / 2) + Math.sin(spoke) * 60,
        vx: 0,
        vy: 0
      };
    });
    const nodeBySlug = new Map(nodes.map((node) => [node.slug, node]));

    const REPULSION = 5200;
    const SPRING = 0.010;
    const REST = 78;
    const DOMAIN_PULL = 0.0016;
    const CENTER_PULL = 0.0009;
    const DAMPING = 0.86;

    for (let step = 0; step < 420; step += 1) {
      for (let i = 0; i < nodes.length; i += 1) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j += 1) {
          const b = nodes[j];
          let dx = a.x - b.x;
          let dy = a.y - b.y;
          let distanceSq = dx * dx + dy * dy;
          if (distanceSq < 1) { dx = (i - j) || 1; dy = 1; distanceSq = 2; }
          const distance = Math.sqrt(distanceSq);
          const force = REPULSION / distanceSq;
          const fx = (dx / distance) * force;
          const fy = (dy / distance) * force;
          a.vx += fx; a.vy += fy;
          b.vx -= fx; b.vy -= fy;
        }
      }

      for (const edge of edges) {
        const a = nodeBySlug.get(edge.source);
        const b = nodeBySlug.get(edge.target);
        if (!a || !b) continue;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;
        // A prerequisite or a core foundation pulls harder than a cross-reference.
        const force = (distance - REST) * SPRING * (edge.weight ?? 1);
        const fx = (dx / distance) * force;
        const fy = (dy / distance) * force;
        a.vx += fx; a.vy += fy;
        b.vx -= fx; b.vy -= fy;
      }

      for (const node of nodes) {
        const anchor = anchors.get(node.anchor);
        if (anchor) {
          node.vx += (anchor.x - node.x) * DOMAIN_PULL;
          node.vy += (anchor.y - node.y) * DOMAIN_PULL;
        }
        node.vx += (GRAPH.width / 2 - node.x) * CENTER_PULL;
        node.vy += (GRAPH.height / 2 - node.y) * CENTER_PULL;

        node.vx *= DAMPING;
        node.vy *= DAMPING;
        node.x += Math.max(-14, Math.min(14, node.vx));
        node.y += Math.max(-14, Math.min(14, node.vy));
      }
    }

    // Fit the result into the viewBox. A force layout has no meaningful aspect
    // ratio, so each axis is scaled to fill the canvas — bounded so the picture
    // is never visibly stretched — and the result is centred.
    const marginX = 58;
    const marginY = 40;
    const xs = nodes.map((node) => node.x);
    const ys = nodes.map((node) => node.y);
    const minX = Math.min(...xs); const maxX = Math.max(...xs);
    const minY = Math.min(...ys); const maxY = Math.max(...ys);
    const rawX = (GRAPH.width - marginX * 2) / Math.max(maxX - minX, 1);
    const rawY = (GRAPH.height - marginY * 2) / Math.max(maxY - minY, 1);
    const smaller = Math.min(rawX, rawY);
    const MAX_STRETCH = 1.3;
    const scaleX = Math.min(rawX, smaller * MAX_STRETCH);
    const scaleY = Math.min(rawY, smaller * MAX_STRETCH);
    const offsetX = (GRAPH.width - (maxX - minX) * scaleX) / 2;
    const offsetY = (GRAPH.height - (maxY - minY) * scaleY) / 2;
    for (const node of nodes) {
      node.x = offsetX + (node.x - minX) * scaleX;
      node.y = offsetY + (node.y - minY) * scaleY;
    }

    return nodeBySlug;
  }

  /**
   * Labels are far wider than the dots beneath them, so they collide long
   * before the nodes do. After rendering, measure each one and keep the
   * best-connected labels; any that would overlap one already kept is demoted
   * and reappears on hover or keyboard focus, so nothing becomes unreachable.
   * Measurement needs a real layout engine, so this is a no-op elsewhere.
   */
  function deconflictLabels(positions) {
    const groups = [...graphSvg.querySelectorAll(".graph-node")];
    if (!groups.length || typeof groups[0].querySelector(".graph-label")?.getBBox !== "function") return;

    groups.sort((a, b) =>
      (graphDegree.get(b.dataset.id) ?? 0) - (graphDegree.get(a.dataset.id) ?? 0));

    const PADDING = 2;
    const placed = [];
    for (const group of groups) {
      const label = group.querySelector(".graph-label");
      let box;
      try { box = label.getBBox(); } catch { return; }
      if (!box.width) { label.classList.remove("crowded"); continue; }

      const node = positions.get(group.dataset.id);
      if (!node) continue;
      const rect = {
        x1: node.x + box.x - PADDING, x2: node.x + box.x + box.width + PADDING,
        y1: node.y + box.y - PADDING, y2: node.y + box.y + box.height + PADDING
      };
      const collides = placed.some((other) =>
        rect.x1 < other.x2 && rect.x2 > other.x1 && rect.y1 < other.y2 && rect.y2 > other.y1);
      label.classList.toggle("crowded", collides);
      if (!collides) placed.push(rect);
    }
  }

  /** One cached layout per layer mode, simulated lazily on first view. */
  const graphLayouts = new Map();
  function layoutFor(mode) {
    if (graphLayouts.has(mode)) return graphLayouts.get(mode);
    const source = graphNodeList.filter((node) =>
      mode === "both" || (mode === "ai" ? node.kind === "concept" : node.kind === "math"));
    const ids = new Set(source.map((node) => node.id));
    const edges = graphEdgeList.filter((edge) => ids.has(edge.source) && ids.has(edge.target));
    const layout = computeGraphLayout(source, edges, anchorsFor(mode));
    graphLayouts.set(mode, layout);
    return layout;
  }

  const colourOfNode = (node) =>
    (node.kind === "math" ? mathCategoryOf(node.item) : categoryOf(node.item)).color;
  const groupNameOfNode = (node) =>
    (node.kind === "math" ? mathCategoryOf(node.item) : categoryOf(node.item)).name;

  function radiusOf(id, degree) {
    return 6.5 + Math.min(degree ?? graphDegree.get(id) ?? 0, 9) * 0.95;
  }

  /** Mathematics nodes are diamonds so the two layers are told apart by shape. */
  function nodeShape(node, r) {
    return node.kind === "math"
      ? `<path class="graph-dot" d="M0 ${-r} L ${r} 0 L 0 ${r} L ${-r} 0 Z" style="fill:${escapeHtml(colourOfNode(node))}" />`
      : `<circle class="graph-dot" r="${r.toFixed(1)}" style="fill:${escapeHtml(colourOfNode(node))}" />`;
  }

  // Written out rather than interpolated so the class names are greppable —
  // and so the validator can confirm every one of them has a styling rule.
  const NODE_CLASS = { concept: "graph-concept", math: "graph-math" };
  const EDGE_CLASS = {
    ai: "edge-ai", math: "edge-math", bridge: "edge-bridge", "bridge-soft": "edge-bridge-soft"
  };

  function nodeMarkup(node, position, { dim = false, r = null, degree = null, label = null } = {}) {
    const size = r ?? radiusOf(node.id, degree);
    const kindWord = node.kind === "math" ? t("graphLegendMath") : t("graphLegendAI");
    const connections = degree ?? graphDegree.get(node.id) ?? 0;
    return `<g class="graph-node ${NODE_CLASS[node.kind]}${dim ? " dim" : ""}"
      data-id="${escapeHtml(node.id)}" data-kind="${escapeHtml(node.kind)}"
      data-slug="${escapeHtml(node.item.slug)}"
      transform="translate(${position.x.toFixed(1)} ${position.y.toFixed(1)})"
      role="button" tabindex="${dim ? -1 : 0}"
      aria-label="${escapeHtml(`${node.token}, ${node.item.name}. ${kindWord}, ${groupNameOfNode(node)}. ${connections} connections.`)}">
      <circle class="graph-halo" r="${(size + 6).toFixed(1)}" />
      ${nodeShape(node, size)}
      <text class="graph-label" y="${(size + 12).toFixed(1)}">${escapeHtml(label ?? node.token)}</text>
    </g>`;
  }

  function edgeMarkup(edge, a, b, { dim = false, label = false } = {}) {
    const classes = ["graph-edge", EDGE_CLASS[edge.layer] ?? "edge-ai"];
    if (dim) classes.push("dim");
    const line = `<line class="${classes.join(" ")}"
      x1="${a.x.toFixed(1)}" y1="${a.y.toFixed(1)}" x2="${b.x.toFixed(1)}" y2="${b.y.toFixed(1)}"
      data-a="${escapeHtml(edge.source)}" data-b="${escapeHtml(edge.target)}"
      data-relation="${escapeHtml(edge.relation)}" />`;
    if (!label) return line;
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    return `${line}<text class="edge-label" x="${mx.toFixed(1)}" y="${(my - 5).toFixed(1)}">${escapeHtml(RELATION_LABEL[edge.relation] ?? edge.relation)}</text>`;
  }

  /**
   * Focus view: one AI concept at the centre with its *direct* mathematical
   * dependencies around it. Laid out radially rather than simulated — with a
   * handful of edges the relation verbs finally fit, which is the one place
   * they are readable.
   */
  function renderFocusGraph(concept) {
    const centre = graphNodeById.get(concept.slug);
    const dependencies = mathDependenciesOf(concept);

    if (!centre || !dependencies.length) {
      graphSvg.innerHTML = "";
      graphLegend.innerHTML =
        `<p class="graph-empty">${escapeHtml(t("graphNoFoundations", { name: concept.name }))} ${escapeHtml(concept.mathNote ?? "")}</p>`;
      resultStatus.textContent = t("graphNoFoundationsStatus", { name: concept.name });
      return;
    }

    const cx = GRAPH.width / 2;
    const cy = GRAPH.height / 2;
    const radius = Math.min(232, 116 + dependencies.length * 17);
    const positions = new Map([[centre.id, { x: cx, y: cy }]]);

    const spokes = dependencies.map((entry, index) => {
      const angle = (index / dependencies.length) * Math.PI * 2 - Math.PI / 2;
      const node = graphNodeById.get(MATH_ID(entry.item.slug));
      const position = {
        x: cx + Math.cos(angle) * radius * 1.28,
        y: cy + Math.sin(angle) * radius * 0.86
      };
      positions.set(node.id, position);
      return { node, position, entry };
    });

    const edges = spokes.map(({ node, position, entry }) => edgeMarkup({
      source: centre.id,
      target: node.id,
      relation: entry.link.relation ?? entry.item.relation ?? "USES",
      layer: entry.link.importance === "primary" ? "bridge" : "bridge-soft"
    }, positions.get(centre.id), position, { label: true })).join("");

    const nodes = [
      nodeMarkup(centre, positions.get(centre.id), { r: 15, degree: dependencies.length }),
      ...spokes.map(({ node, position, entry }) =>
        nodeMarkup(node, position, { r: entry.link.importance === "primary" ? 11 : 8, degree: 1, label: node.item.name }))
    ].join("");

    graphSvg.innerHTML = `<g class="graph-edges">${edges}</g><g class="graph-nodes focus-nodes">${nodes}</g>`;

    const core = dependencies.filter((entry) => entry.link.importance === "primary").length;
    graphLegend.innerHTML = `<p class="graph-empty">
      <strong>${escapeHtml(concept.acronym)}</strong> — ${dependencies.length} direct mathematical dependenc${dependencies.length === 1 ? "y" : "ies"},
      ${core} core. Larger diamonds are core mathematics.
    </p>`;
    resultStatus.textContent =
      `${concept.name}: ${dependencies.length} direct mathematical dependencies, ${core} core.`;
  }

  function renderGraph() {
    if (state.graphFocus) {
      const concept = conceptBySlug.get(state.graphFocus);
      if (concept) { renderFocusGraph(concept); return; }
      state.graphFocus = null;
    }

    const mode = state.graphLayer;
    const positions = layoutFor(mode);
    const inMode = graphNodeList.filter((node) => positions.has(node.id));

    // The domain filter and the search box still drive the AI layer only;
    // mathematics nodes dim when none of the concepts using them are visible.
    const visibleConcepts = new Set(getVisibleConcepts().map((concept) => concept.slug));
    const isVisible = (node) => node.kind === "concept"
      ? visibleConcepts.has(node.id)
      : (usedByMath.get(node.item.slug) ?? []).some((entry) => visibleConcepts.has(entry.concept.slug));
    const visible = new Set(inMode.filter(isVisible).map((node) => node.id));

    const edges = graphEdgeList
      .filter((edge) => positions.has(edge.source) && positions.has(edge.target))
      .map((edge) => edgeMarkup(edge, positions.get(edge.source), positions.get(edge.target),
        { dim: !visible.has(edge.source) || !visible.has(edge.target) }))
      .join("");

    const nodes = inMode
      .map((node) => nodeMarkup(node, positions.get(node.id), { dim: !visible.has(node.id) }))
      .join("");

    graphSvg.innerHTML = `<g class="graph-edges">${edges}</g><g class="graph-nodes">${nodes}</g>`;
    deconflictLabels(positions);
    renderGraphLegend(mode, inMode);
  }

  function renderGraphLegend(mode, inMode) {
    const shapes = `<span class="legend-shape"><span class="legend-dot legend-circle"></span>${escapeHtml(t("graphLegendAI"))}</span>
      <span class="legend-shape"><span class="legend-dot legend-diamond"></span>${escapeHtml(t("graphLegendMath"))}</span>`;

    const domains = mode === "math" ? "" : categories.map((category) => {
      const count = concepts.filter((concept) => concept.category === category.id).length;
      const active = state.category === category.id;
      return `<button class="legend-chip${active ? " active" : ""}" type="button" data-category="${escapeHtml(category.id)}" aria-pressed="${active}">
        <span class="legend-dot" style="background:${escapeHtml(category.color)}"></span>
        ${escapeHtml(category.name)} <em>${count}</em>
      </button>`;
    }).join("");

    const branches = mode === "ai" ? "" : mathCategories.map((category) => {
      const count = mathConcepts.filter((item) => item.category === category.id).length;
      return `<span class="legend-chip legend-static">
        <span class="legend-dot legend-diamond" style="background:${escapeHtml(category.color)}"></span>
        ${escapeHtml(category.short ?? category.name)} <em>${count}</em>
      </span>`;
    }).join("");

    graphLegend.innerHTML = `<div class="legend-shapes">${shapes}<span class="legend-count">${escapeHtml(t("graphNodeCount", { n: inMode.length }))}</span></div>${domains}${branches}`;
  }

  /* Graph controls: layer toggle + single-concept focus ---------------- */

  const GRAPH_LAYERS = [
    ["both", "graphLayerBoth"],
    ["ai", "graphLayerAI"],
    ["math", "graphLayerMath"]
  ];

  function renderGraphControls() {
    graphLayers.innerHTML = GRAPH_LAYERS.map(([id, labelKey]) => {
      const label = t(labelKey);
      const active = !state.graphFocus && state.graphLayer === id;
      return `<button class="filter-button${active ? " active" : ""}" type="button"
        data-graph-layer="${escapeHtml(id)}" aria-pressed="${active}">${escapeHtml(label)}</button>`;
    }).join("");

    // Only concepts that actually declare foundations can be focused.
    if (!graphFocusSelect.options.length) {
      const groups = categories.map((category) => {
        const items = concepts.filter((concept) =>
          concept.category === category.id && mathDependenciesOf(concept).length);
        if (!items.length) return "";
        return `<optgroup label="${escapeHtml(category.name)}">${items.map((concept) =>
          `<option value="${escapeHtml(concept.slug)}">${escapeHtml(concept.name)}</option>`).join("")}</optgroup>`;
      }).join("");
      graphFocusSelect.innerHTML = `<option value="">${escapeHtml(t("graphWholeAtlas"))}</option>${groups}`;
    }
    graphFocusSelect.value = state.graphFocus ?? "";
  }

  function setGraphLayer(layer) {
    state.graphLayer = layer;
    state.graphFocus = null;
    renderGraphControls();
    renderGraph();
  }

  function setGraphFocus(slug) {
    state.graphFocus = slug || null;
    renderGraphControls();
    renderGraph();
  }

  function highlightGraphNode(id) {
    const neighbours = id ? graphNeighbours.get(id) : null;
    graphSvg.querySelectorAll(".graph-node").forEach((node) => {
      const isFocus = id != null && node.dataset.id === id;
      const isNeighbour = neighbours ? neighbours.has(node.dataset.id) : false;
      node.classList.toggle("focus", isFocus);
      node.classList.toggle("neighbour", isNeighbour);
      node.classList.toggle("faded", id != null && !isFocus && !isNeighbour);
    });
    graphSvg.querySelectorAll(".graph-edge").forEach((edge) => {
      const touches = id != null && (edge.dataset.a === id || edge.dataset.b === id);
      edge.classList.toggle("active", touches);
      edge.classList.toggle("faded", id != null && !touches);
    });
  }

  /* ================================================================= */
  /* Domain bands                                                       */
  /* ================================================================= */

  function conceptCard(concept) {
    const category = categoryOf(concept);
    return `<button class="concept-card" type="button" data-slug="${escapeHtml(concept.slug)}" style="--card-accent:${escapeHtml(category.color)}">
      <span class="arrow" aria-hidden="true">↗</span>
      <p class="acronym">${escapeHtml(concept.acronym)}</p>
      <h4>${escapeHtml(concept.name)}</h4>
      <p>${escapeHtml(concept.summary)}</p>
    </button>`;
  }

  function renderBands() {
    const visible = getVisibleConcepts();
    const bySlug = new Set(visible.map((concept) => concept.slug));

    const sections = categories.map((category) => {
      const items = concepts.filter((concept) => concept.category === category.id && bySlug.has(concept.slug));
      if (!items.length) return "";
      return `<section class="domain-band" style="--band-accent:${escapeHtml(category.color)}" aria-labelledby="band-${escapeHtml(category.id)}">
        <div class="band-heading">
          <h3 id="band-${escapeHtml(category.id)}">${escapeHtml(category.name)}</h3>
          <span class="band-count">${escapeHtml(t("bandCount", { n: items.length }))}</span>
          <button class="band-filter" type="button" data-category="${escapeHtml(category.id)}"
                  aria-pressed="${state.category === category.id}">
            ${escapeHtml(state.category === category.id ? t("bandShowAll") : t("bandFocus"))}
          </button>
        </div>
        <div class="concept-grid">${items.map(conceptCard).join("")}</div>
      </section>`;
    }).join("");

    bands.innerHTML = sections || `<div class="empty-state"><h3>${escapeHtml(t("emptyTitle"))}</h3><p>${escapeHtml(t("emptyBody"))}</p></div>`;
    return visible;
  }

  function renderAtlas() {
    const visible = renderBands();
    if (state.view === "graph") renderGraph();

    const domain = state.category === "all"
      ? t("allDomains")
      : (categoryById.get(state.category)?.name ?? state.category);
    resultStatus.textContent = visible.length
      ? t("resultCount", { n: visible.length, domain })
      : t("resultNone", { domain });
  }

  function renderFilters() {
    const items = [{ id: "all", short: t("filterAll") }, ...categories];
    filters.innerHTML = items.map((category) => {
      const active = state.category === category.id;
      const accent = category.color ? ` style="--chip-accent:${escapeHtml(category.color)}"` : "";
      return `<button class="filter-button${active ? " active" : ""}" data-category="${escapeHtml(category.id)}" type="button" aria-pressed="${active}"${accent}>
        ${escapeHtml(category.short || category.name)}
      </button>`;
    }).join("");
  }

  function setCategory(category) {
    state.category = state.category === category && category !== "all" ? "all" : category;
    renderFilters();
    renderAtlas();
  }

  function setView(view) {
    state.view = view;
    tabs.forEach((tab) => {
      const selected = tab.dataset.view === view;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      tab.classList.toggle("active", selected);
    });
    bandsPanel.hidden = view !== "bands";
    graphPanel.hidden = view !== "graph";
    if (view === "graph") renderGraph();
  }

  /* ================================================================= */
  /* Search suggestions                                                 */
  /* ================================================================= */

  function setSuggestionsOpen(open) {
    searchResults.hidden = !open;
    searchInput.setAttribute("aria-expanded", String(open));
    if (!open) {
      state.activeSuggestion = -1;
      searchInput.removeAttribute("aria-activedescendant");
    }
  }

  function highlightSuggestion(index) {
    const options = [...searchResults.querySelectorAll(".search-result")];
    if (!options.length) return;
    state.activeSuggestion = (index + options.length) % options.length;
    options.forEach((option, position) => {
      const active = position === state.activeSuggestion;
      option.classList.toggle("is-active", active);
      option.setAttribute("aria-selected", String(active));
      if (active) {
        searchInput.setAttribute("aria-activedescendant", option.id);
        option.scrollIntoView({ block: "nearest" });
      }
    });
  }

  function renderSearchResults() {
    state.query = searchInput.value.trim();
    renderAtlas();

    if (!state.query) {
      searchResults.innerHTML = "";
      setSuggestionsOpen(false);
      return;
    }

    // Suggestions span both layers; the atlas below still shows AI concepts only.
    const matches = searchEverything(state.query).slice(0, MAX_SUGGESTIONS);
    searchResults.innerHTML = matches.length
      ? matches.map(({ kind, item }, index) => {
          const isMath = kind === "math";
          const category = isMath ? mathCategoryOf(item) : categoryOf(item);
          const token = isMath ? item.symbol : item.acronym;
          return `<button class="search-result" type="button" role="option" tabindex="-1"
            aria-selected="false" id="suggestion-${index}"
            data-kind="${escapeHtml(kind)}" data-slug="${escapeHtml(item.slug)}">
            <b class="${isMath ? "is-math" : ""}">${escapeHtml(token)}</b>
            <span>
              ${escapeHtml(item.name)}
              <small class="result-kind">${escapeHtml(isMath ? t("resultKindMath") : t("resultKindAI"))} · ${escapeHtml(category.name)}</small>
              <small>${escapeHtml(item.summary)}</small>
            </span>
          </button>`;
        }).join("")
      : `<p class="empty-state" style="padding:24px">${escapeHtml(t("noConceptFound"))}</p>`;

    state.activeSuggestion = -1;
    searchInput.removeAttribute("aria-activedescendant");
    setSuggestionsOpen(true);
  }

  /** A suggestion routes to whichever layer it came from. */
  function openSuggestion(option) {
    setSuggestionsOpen(false);
    if (option.dataset.kind === "math") openMath(option.dataset.slug);
    else openConcept(option.dataset.slug);
  }

  /* ================================================================= */
  /* Shared renderers                                                   */
  /* ================================================================= */

  function renderReference(anchor, labelEl, hostEl, concept) {
    if (!concept.source) return false;
    anchor.href = concept.source.url;
    labelEl.textContent = concept.source.label;
    hostEl.textContent = hostOf(concept.source.url);
    return true;
  }

  function renderRelated(container, concept, onNavigate) {
    const related = (concept.related ?? []).map((slug) => conceptBySlug.get(slug)).filter(Boolean);
    container.innerHTML = related.length
      ? related.map((item) => `<button type="button" data-slug="${escapeHtml(item.slug)}">${escapeHtml(item.acronym || item.name)}</button>`).join("")
      : `<p class="related-empty">${escapeHtml(t("noRelated"))}</p>`;
    container.onclick = (event) => {
      const button = event.target.closest("button[data-slug]");
      if (button) onNavigate(button.dataset.slug);
    };
  }

  /**
   * Optional `math` block on a concept:
   *   math: { intro: "…", formulas: [{ expression: "…", label: "…", note: "…" }] }
   * Rendered as plain typeset text — no maths library, no external request.
   */
  function renderMath(container, concept) {
    const math = concept.math;
    if (!math || !(math.formulas ?? []).length) {
      container.innerHTML =
        `<p class="math-pending">${escapeHtml(t(concept.source ? "mathPendingWithSource" : "mathPending"))}</p>`;
      return;
    }
    const intro = math.intro ? `<p class="math-intro">${escapeHtml(math.intro)}</p>` : "";
    const blocks = math.formulas.map((formula) => `<figure class="formula">
        ${formula.label ? `<figcaption>${escapeHtml(formula.label)}</figcaption>` : ""}
        <pre><code>${escapeHtml(formula.expression)}</code></pre>
        ${formula.note ? `<p class="formula-note">${escapeHtml(formula.note)}</p>` : ""}
      </figure>`).join("");
    container.innerHTML = intro + blocks;
  }

  /* ================================================================= */
  /* Mathematical foundations — shared by the dialog and concept page   */
  /* ================================================================= */

  function intensityBadge(level) {
    const known = INTENSITY_LABEL[level];
    const filled = { high: 3, medium: 2, low: 1 }[level] ?? 0;
    const bars = [1, 2, 3]
      .map((step) => `<i class="${step <= filled ? "on" : ""}"></i>`).join("");
    return `<p class="intensity-badge intensity-${escapeHtml(level ?? "none")}">
      <span class="intensity-bars" aria-hidden="true">${bars}</span>
      ${escapeHtml(t("intensityLabel"))} <b>${escapeHtml(known ?? t("intensityUnmapped"))}</b>
    </p>`;
  }

  function mathChip(item, note) {
    const category = mathCategoryOf(item);
    return `<button class="math-chip" type="button" data-math="${escapeHtml(item.slug)}"
      style="--card-accent:${escapeHtml(category.color)}"
      aria-label="${escapeHtml(t("mathChipAria", { name: item.name, branch: category.name }))}">
      <span class="math-chip-symbol" aria-hidden="true">${escapeHtml(item.symbol)}</span>
      <span class="math-chip-name">${escapeHtml(item.name)}</span>
      ${note ? "" : `<small>${escapeHtml(category.short ?? category.name)}</small>`}
    </button>`;
  }

  /**
   * `mathIntensity` + `mathFoundations` on an AI concept. `compact` is the
   * dialog treatment (chips only); the full form adds the per-link explanation.
   * A concept with no intrinsic mathematics says so rather than showing nothing.
   */
  function renderFoundations(container, concept, { compact = false } = {}) {
    container.onclick = null;

    if (!concept.mathIntensity) {
      container.innerHTML =
        `<p class="math-pending">${escapeHtml(t("foundationsUnmapped"))}</p>`;
      return;
    }

    const links = (concept.mathFoundations ?? [])
      .map((link) => ({ ...link, item: mathBySlug.get(link.slug) }))
      .filter((link) => link.item);

    const groups = [["primary", t("foundationsCore")], ["supporting", t("foundationsSupporting")]]
      .map(([importance, heading]) => {
        const items = links.filter((link) => link.importance === importance);
        if (!items.length) return "";
        const body = compact
          ? `<div class="math-chips">${items.map((link) => mathChip(link.item)).join("")}</div>`
          : `<ul class="foundation-list">${items.map((link) => `<li>
              ${mathChip(link.item, true)}
              ${link.note ? `<p>${escapeHtml(link.note)}</p>` : ""}
            </li>`).join("")}</ul>`;
        return `<div class="foundation-group"><h4>${heading}</h4>${body}</div>`;
      }).join("");

    const none = links.length
      ? ""
      : `<p class="foundation-none">${escapeHtml(t("foundationsNone"))}</p>`;
    const note = concept.mathNote
      ? `<p class="foundation-note">${escapeHtml(concept.mathNote)}</p>`
      : "";
    const more = compact
      ? ""
      : `<p class="foundation-more"><a href="#mathematics">${escapeHtml(t("foundationsBrowse"))}</a></p>`;

    // Two independent sources of English here — the per-link notes and the
    // concept's own mathNote — so the chip goes up if either is untranslated.
    const englishHere = new Set();
    if (i18n.isEnglish(concept, "foundations") || i18n.isEnglish(concept, "mathNote")) {
      englishHere.add("notes");
    }
    markLanguage(compact ? "dialogFoundationsTitle" : "learnFoundationsTitle",
      { _en: englishHere }, "notes");

    container.innerHTML = intensityBadge(concept.mathIntensity) + none + note + groups + more;
    container.onclick = (event) => {
      const button = event.target.closest("button[data-math]");
      // Pass the concept along so the mathematics page can offer a way back.
      if (button) openMath(button.dataset.math, true, concept.slug);
    };
  }

  /* ================================================================= */
  /* Concept dialog                                                     */
  /* ================================================================= */

  function openConcept(slug, updateHash = true) {
    const concept = conceptBySlug.get(slug);
    if (!concept) return;

    if (!dialog.open) state.lastTrigger = document.activeElement;
    state.current = concept;

    const category = categoryOf(concept);
    $("dialogCategory").textContent = category.name;
    $("dialogAcronym").textContent = concept.acronym;
    $("dialogName").textContent = concept.name;
    setProse("dialogSummary", concept, "summary");
    setProse("dialogWhy", concept, "why");
    setProse("dialogHow", concept, "how");
    setProse("dialogExample", concept, "example");
    $("exampleSection").hidden = !concept.example;
    markLanguage("dialogWhyTitle", concept, "why");
    markLanguage("dialogHowTitle", concept, "how");
    markLanguage("dialogExampleTitle", concept, "example");

    $("sourceSection").hidden = !renderReference(
      $("dialogSource"), $("dialogSourceLabel"), $("dialogSourceHost"), concept
    );

    renderFoundations($("dialogFoundations"), concept, { compact: true });
    renderRelated($("relatedLinks"), concept, (next) => openConcept(next));
    $("openLearn").setAttribute("href", `#learn/${concept.slug}`);

    document.title = t("conceptTitle", { acronym: concept.acronym, name: concept.name });

    if (!dialog.open) dialog.showModal();
    dialog.querySelector(".dialog-body")?.scrollTo({ top: 0 });
    if (updateHash && location.hash !== `#concept/${slug}`) {
      history.pushState({ concept: slug }, "", `#concept/${slug}`);
    }
  }

  function closeConcept(updateHash = true) {
    state.current = null;
    if (dialog.open) dialog.close();
    if (!state.learning && !state.math && !state.mathIndex) document.title = BASE_TITLE;
    if (updateHash && location.hash.startsWith("#concept/")) {
      history.pushState({}, "", location.pathname + location.search);
    }
    if (state.lastTrigger?.isConnected) state.lastTrigger.focus();
    else searchInput.focus({ preventScroll: true });
    state.lastTrigger = null;
  }

  /* ================================================================= */
  /* Full concept page (#learn/<slug>)                                  */
  /* ================================================================= */

  function openLearn(slug, updateHash = true) {
    const concept = conceptBySlug.get(slug);
    if (!concept) return;
    if (dialog.open) dialog.close();
    state.current = concept;
    state.learning = concept;
    state.math = null;
    state.mathIndex = false;
    state.mathOrigin = null;

    const category = categoryOf(concept);
    learnView.style.setProperty("--card-accent", category.color);
    $("learnDomain").textContent = category.name;
    $("learnAcronym").textContent = concept.acronym;
    $("learnName").textContent = concept.name;
    setProse("learnSummary", concept, "summary");
    setProse("learnWhy", concept, "why");
    setProse("learnHow", concept, "how");
    setProse("learnExample", concept, "example");
    $("learnExampleSection").hidden = !concept.example;
    markLanguage("learnWhyTitle", concept, "why");
    markLanguage("learnHowTitle", concept, "how");
    markLanguage("learnExampleTitle", concept, "example");

    $("learnSourceSection").hidden = !renderReference(
      $("learnSource"), $("learnSourceLabel"), $("learnSourceHost"), concept
    );
    renderFoundations($("learnFoundations"), concept);
    renderMath($("learnMath"), concept);
    renderRelated($("learnRelated"), concept, (next) => openLearn(next));

    showView("learn");
    document.title = t("conceptTitle", { acronym: concept.acronym, name: concept.name });
    window.scrollTo({ top: 0, behavior: "auto" });
    $("learnName").setAttribute("tabindex", "-1");
    $("learnName").focus({ preventScroll: true });

    if (updateHash && location.hash !== `#learn/${slug}`) {
      history.pushState({ learn: slug }, "", `#learn/${slug}`);
    }
  }

  /* ================================================================= */
  /* Mathematics overview (#mathematics)                                */
  /* ================================================================= */

  function difficultyChip(level) {
    return `<span class="difficulty-chip difficulty-${escapeHtml(level)}">${escapeHtml(DIFFICULTY_LABEL[level] ?? level)}</span>`;
  }

  function mathCard(item) {
    const category = mathCategoryOf(item);
    const uses = usedByMath.get(item.slug)?.length ?? 0;
    return `<button class="concept-card math-card" type="button" data-math="${escapeHtml(item.slug)}"
      style="--card-accent:${escapeHtml(category.color)}">
      <span class="arrow" aria-hidden="true">↗</span>
      <p class="acronym">${escapeHtml(item.symbol)}</p>
      <h4>${escapeHtml(item.name)}</h4>
      <p>${escapeHtml(item.summary)}</p>
      <span class="card-meta">
        ${difficultyChip(item.difficulty)}
        <span>${escapeHtml(t("usesCount", { n: uses }))}</span>
      </span>
    </button>`;
  }

  function getVisibleMath() {
    return searchMath(mathSearchInput.value.trim()).filter((item) =>
      (state.mathCategory === "all" || item.category === state.mathCategory) &&
      (state.mathDifficulty === "all" || item.difficulty === state.mathDifficulty));
  }

  function renderMathFilters() {
    const branches = [{ id: "all", short: t("mathAllBranches") }, ...mathCategories];
    mathFilters.innerHTML = branches.map((category) => {
      const active = state.mathCategory === category.id;
      const accent = category.color ? ` style="--chip-accent:${escapeHtml(category.color)}"` : "";
      return `<button class="filter-button${active ? " active" : ""}" type="button"
        data-math-category="${escapeHtml(category.id)}" aria-pressed="${active}"${accent}>
        ${escapeHtml(category.short || category.name)}
      </button>`;
    }).join("");

    const levels = [["all", t("mathAnyLevel")], ...Object.entries(DIFFICULTY_LABEL)];
    mathDifficultyFilters.innerHTML = levels.map(([id, label]) => {
      const active = state.mathDifficulty === id;
      return `<button class="filter-button${active ? " active" : ""}" type="button"
        data-math-difficulty="${escapeHtml(id)}" aria-pressed="${active}">${escapeHtml(label)}</button>`;
    }).join("");
  }

  function renderMathIndex() {
    const visible = getVisibleMath();
    const bySlug = new Set(visible.map((item) => item.slug));

    mathBranches.innerHTML = mathCategories.map((category) => {
      const items = mathConcepts.filter((item) => item.category === category.id && bySlug.has(item.slug));
      if (!items.length) return "";
      return `<section class="domain-band" style="--band-accent:${escapeHtml(category.color)}"
        aria-labelledby="branch-${escapeHtml(category.id)}">
        <div class="band-heading">
          <h3 id="branch-${escapeHtml(category.id)}">${escapeHtml(category.name)}</h3>
          <span class="band-count">${escapeHtml(t("bandCount", { n: items.length }))}</span>
          <button class="band-filter" type="button" data-math-category="${escapeHtml(category.id)}"
                  aria-pressed="${state.mathCategory === category.id}">
            ${escapeHtml(state.mathCategory === category.id ? t("mathShowAllBranches") : t("bandFocus"))}
          </button>
        </div>
        <div class="concept-grid">${items.map(mathCard).join("")}</div>
      </section>`;
    }).join("") || `<div class="empty-state"><h3>${escapeHtml(t("emptyTitle"))}</h3><p>${escapeHtml(t("mathEmptyBody"))}</p></div>`;

    mathStatus.textContent = visible.length
      ? t("mathResultCount", { n: visible.length })
      : t("mathResultNone");
  }

  function openMathIndex(updateHash = true) {
    if (dialog.open) dialog.close();
    state.learning = null;
    state.math = null;
    state.mathIndex = true;
    state.mathOrigin = null;

    renderMathFilters();
    renderMathIndex();
    showView("mathIndex");
    document.title = t("mathIndexTitleDoc");
    window.scrollTo({ top: 0, behavior: "auto" });
    $("mathIndexTitle").setAttribute("tabindex", "-1");
    $("mathIndexTitle").focus({ preventScroll: true });

    if (updateHash && location.hash !== "#mathematics") {
      history.pushState({ mathIndex: true }, "", "#mathematics");
    }
  }

  /* ================================================================= */
  /* Mathematics concept page (#math/<slug>)                            */
  /* ================================================================= */

  function renderMathLinks(container, slugs, emptyMessage) {
    const items = (slugs ?? []).map((slug) => mathBySlug.get(slug)).filter(Boolean);
    container.innerHTML = items.length
      ? items.map((item) => `<button type="button" data-math="${escapeHtml(item.slug)}">${escapeHtml(item.name)}</button>`).join("")
      : `<p class="related-empty">${escapeHtml(emptyMessage)}</p>`;
    container.onclick = (event) => {
      const button = event.target.closest("button[data-math]");
      if (button) openMath(button.dataset.math);
    };
  }

  /** The reverse direction: every AI concept that declared this mathematics. */
  function renderUsedBy(container, item) {
    const users = usedByMath.get(item.slug) ?? [];
    if (!users.length) {
      container.innerHTML = `<p class="math-pending">${escapeHtml(t("usedByNone"))}</p>`;
      container.onclick = null;
      return;
    }

    const groups = [["primary", t("usedByCore")], ["supporting", t("usedBySupporting")]].map(([importance, heading]) => {
      const rows = users.filter((entry) => entry.importance === importance);
      if (!rows.length) return "";
      return `<div class="foundation-group"><h4>${heading}</h4>
        <ul class="foundation-list">${rows.map((entry) => {
          const category = categoryOf(entry.concept);
          return `<li>
            <button class="math-chip" type="button" data-slug="${escapeHtml(entry.concept.slug)}"
              style="--card-accent:${escapeHtml(category.color)}"
              aria-label="${escapeHtml(t("conceptChipAria", { name: entry.concept.name, domain: category.name }))}">
              <span class="math-chip-symbol" aria-hidden="true">${escapeHtml(entry.concept.acronym)}</span>
              <span class="math-chip-name">${escapeHtml(entry.concept.name)}</span>
            </button>
            ${entry.note ? `<p>${escapeHtml(entry.note)}</p>` : ""}
          </li>`;
        }).join("")}</ul>
      </div>`;
    }).join("");

    container.innerHTML = groups;
    container.onclick = (event) => {
      const button = event.target.closest("button[data-slug]");
      if (button) openLearn(button.dataset.slug);
    };
  }

  /**
   * `origin` is the AI concept this excursion started from, used for the return
   * breadcrumb. An explicit origin wins; hopping between mathematics pages keeps
   * the thread, so LoRA → matrix rank → low-rank factorization still offers
   * "Back to LoRA"; arriving any other way (a deep link, the overview, a graph
   * node) has no origin and falls back to the mathematics index.
   */
  function openMath(slug, updateHash = true, origin = undefined) {
    const item = mathBySlug.get(slug);
    if (!item) return;
    if (dialog.open) dialog.close();

    const wasInMath = Boolean(state.math);
    if (origin !== undefined) state.mathOrigin = origin;
    else if (!wasInMath) state.mathOrigin = null;

    state.learning = null;
    state.mathIndex = false;
    state.math = item;

    const back = state.mathOrigin ? conceptBySlug.get(state.mathOrigin) : null;
    $("mathBack").textContent = back ? t("mathBackTo", { acronym: back.acronym }) : t("mathBackAll");
    $("mathBack").setAttribute("href", back ? `#learn/${back.slug}` : "#mathematics");
    $("mathBackAll").hidden = !back;

    const category = mathCategoryOf(item);
    mathView.style.setProperty("--card-accent", category.color);
    $("mathBranch").textContent = category.name;
    $("mathDifficultyChip").textContent = DIFFICULTY_LABEL[item.difficulty] ?? item.difficulty;
    $("mathDifficultyChip").className = `difficulty-chip difficulty-${item.difficulty}`;
    $("mathSymbol").textContent = item.symbol;
    $("mathName").textContent = item.name;
    setProse("mathSummary", item, "summary");
    setProse("mathIntuition", item, "intuition");
    markLanguage("mathIntuitionTitle", item, "intuition");
    markLanguage("mathWorkedTitle", item, "worked");
    markLanguage("mathEquationTitle", item, "equationNote");
    markLanguage("mathWhyTitle", item, "whyInAI");
    markLanguage("mathLegendTitle", item, "legend");

    $("mathEquationSection").hidden = !item.equation;
    if (item.equation) {
      $("mathEquation").innerHTML = `<figure class="formula">
        <pre><code>${escapeHtml(item.equation)}</code></pre>
        ${item.equationNote ? `<p class="formula-note">${escapeHtml(item.equationNote)}</p>` : ""}
      </figure>`;
    }

    const legend = item.legend ?? [];
    $("mathLegendSection").hidden = !legend.length;
    $("mathLegend").innerHTML = legend.map((entry) => `
      <dt><code>${escapeHtml(entry.symbol)}</code></dt>
      <dd>${escapeHtml(entry.meaning)}</dd>`).join("");

    $("mathWorkedSection").hidden = !item.worked;
    if (item.worked) {
      $("mathWorked").innerHTML = `<figure class="formula"><pre><code>${escapeHtml(item.worked)}</code></pre></figure>`;
    }

    $("mathWhy").innerHTML = (item.whyInAI ?? [])
      .map((line) => `<li>${escapeHtml(line)}</li>`).join("");

    renderUsedBy($("mathUsedBy"), item);
    renderMathLinks($("mathRelated"), item.related, t("noRelatedMath"));
    $("mathPrereqSection").hidden = !(item.prerequisites ?? []).length;
    renderMathLinks($("mathPrereq"), item.prerequisites, t("noPrerequisites"));

    $("mathSourceSection").hidden = !renderReference(
      $("mathSource"), $("mathSourceLabel"), $("mathSourceHost"), item
    );

    showView("math");
    document.title = t("mathTitle", { name: item.name });
    window.scrollTo({ top: 0, behavior: "auto" });
    $("mathName").setAttribute("tabindex", "-1");
    $("mathName").focus({ preventScroll: true });

    if (updateHash && location.hash !== `#math/${slug}`) {
      history.pushState({ math: slug }, "", `#math/${slug}`);
    }
  }

  /* ================================================================= */
  /* Routing                                                            */
  /* ================================================================= */


  /* ================================================================= */
  /* The Dojo (#quiz, #quiz/dan)                                        */
  /*                                                                    */
  /* A run lives entirely in this closure and dies with the page. There */
  /* is no storage, no account and no leaderboard — which is both the   */
  /* footer's promise kept and the reason the score cannot be gamed.    */
  /* ================================================================= */

  const quizEngine = window.ATLAS_QUIZ.build({
    concepts, categories, mathConcepts, mathCategories, usedByMath,
    categoryOf, mathCategoryOf,
    relationLabel: (verb) => RELATION_LABEL[verb] ?? verb
  }, t);

  const quiz = {
    stage: "menu",   // menu | rei | playing | result | danIntro
    questions: [],
    index: 0,
    correct: 0,
    streak: 0,       // consecutive correct, for the judo calls
    best: 0,
    chosen: null,
    call: "",
    pending: null,   // the run chosen at the bow, started on rei
    dan: false,
    unlockedDan: false
  };

  const beltName = (belt) => t(`belt${belt.id[0].toUpperCase()}${belt.id.slice(1)}`);

  /**
   * English ordinals are irregular at one, two AND three — 1st, 2nd, 3rd, then
   * 4th onwards. Special-casing only the first produced "2ᵗʰ kyū" and "3ʳᵈ"
   * written as "3ᵗʰ", which is the kind of mistake that makes a carefully
   * researched belt table look careless. French is regular after 1ᵉʳ, so its
   * second and third forms simply repeat the generic one — the table carries
   * both rather than the code guessing which languages need the exception.
   */
  const ordinal = (n, prefix) => {
    if (n === 1) return t(`${prefix}First`);
    if (n === 2) return t(`${prefix}Second`);
    if (n === 3) return t(`${prefix}Third`);
    return t(prefix === "dojoKyu" ? "dojoKyu" : "dojoDanRank", { n });
  };
  const kyuLabel = (belt) => (belt.kyu === 0 ? "" : ordinal(belt.kyu, "dojoKyu"));
  const danLabel = (dan) => ordinal(dan.rank, "dojoDan");

  /**
   * The belt itself, drawn rather than described.
   *
   * A kōhaku (6th–8th dan) obi is red and white in alternating panels and a
   * 9th–10th is solid red, so the dan styles are not a colour swap. Dan grades
   * add one stripe per rank at the tip, which is how a real obi is marked.
   */
  function beltArt(colour, ink, stripes = 0, style = "plain", extraClass = "") {
    const panels = style === "kohaku"
      ? [0, 1, 2, 3, 4, 5].map((i) =>
          `<rect x="${10 + i * 46.7}" y="34" width="46.7" height="26" fill="${i % 2 ? "#f4f6f8" : "#c0392b"}" />`).join("")
      : `<rect x="10" y="34" width="280" height="26" rx="3" fill="${escapeHtml(colour)}" />`;

    const marks = Array.from({ length: stripes }, (_, i) =>
      `<rect x="${248 - i * 11}" y="38" width="6" height="18" rx="1" fill="${escapeHtml(ink)}" opacity=".9" />`).join("");

    return `<svg class="belt-art ${extraClass}" viewBox="0 0 300 110" role="img" aria-hidden="true">
      ${panels}${marks}
      <rect x="118" y="24" width="64" height="46" rx="6" fill="${style === "kohaku" ? "#c0392b" : escapeHtml(colour)}" />
      <rect x="118" y="24" width="64" height="46" rx="6" fill="none" stroke="rgba(0,0,0,.28)" />
      <path d="M132 70 L124 100 L146 92 Z" fill="${style === "kohaku" ? "#f4f6f8" : escapeHtml(colour)}" stroke="rgba(0,0,0,.2)" />
      <path d="M168 70 L176 100 L154 92 Z" fill="${style === "kohaku" ? "#c0392b" : escapeHtml(colour)}" stroke="rgba(0,0,0,.2)" />
    </svg>`;
  }

  /** The rack on the atlas invitation. Rendered from the same belt table. */
  function renderInviteRack() {
    const rack = $("dojoInviteRack");
    if (!rack) return;
    rack.innerHTML = window.ATLAS_QUIZ.BELTS.map((belt) =>
      `<i class="${belt.gated ? "is-locked" : ""}" style="background:${escapeHtml(belt.colour)}"></i>`).join("");
  }

  /**
   * A belt hanging on the rack — the same knotted object as the award belt,
   * drawn small. A colour chip would have been simpler, but the wall and the
   * ceremony should obviously show the same thing.
   */
  function beltHang(colour, style = "plain") {
    const band = style === "kohaku"
      ? [0, 1, 2, 3].map((i) =>
          `<rect x="${2 + i * 21}" y="9" width="21" height="9" fill="${i % 2 ? "#f4f6f8" : "#c0392b"}" />`).join("")
      : `<rect x="2" y="9" width="84" height="9" rx="1.5" fill="${escapeHtml(colour)}" />`;
    return `<svg class="belt-hang" viewBox="0 0 88 30" aria-hidden="true">
      ${band}
      <rect x="34" y="5" width="20" height="16" rx="2" fill="${style === "kohaku" ? "#c0392b" : escapeHtml(colour)}"
            stroke="rgba(0,0,0,.3)" stroke-width=".6" />
      <path d="M39 21 L36 29 L43 26 Z" fill="${escapeHtml(colour)}" stroke="rgba(0,0,0,.22)" stroke-width=".5" />
      <path d="M49 21 L52 29 L45 26 Z" fill="${escapeHtml(colour)}" stroke="rgba(0,0,0,.22)" stroke-width=".5" />
    </svg>`;
  }

  /* The wall of belts, shown before you start. Seeing brown and black hanging
     out of reach is the argument for the long run, so they are dimmed rather
     than hidden. */
  function beltWall(currentId) {
    const rows = window.ATLAS_QUIZ.BELTS.map((belt) => {
      const rank = belt.kyu === 0 ? t("quizDanBeltBlack") : kyuLabel(belt);
      return `<li class="belt-row${belt.id === currentId ? " is-current" : ""}${belt.gated ? " is-gated" : ""}">
        ${beltHang(belt.colour)}
        <span class="belt-kanji" lang="ja">${escapeHtml(belt.kanji)}</span>
        <span class="belt-names">
          <strong lang="ja-Latn">${escapeHtml(belt.romaji)}</strong>
          <small>${escapeHtml(beltName(belt))} · ${escapeHtml(rank)}</small>
        </span>
      </li>`;
    }).join("");
    /* The row no longer states a threshold at all, by request. The wall is
       something to look at before a run rather than a specification, and the
       gate that actually matters — brown and black needing the long run — is
       already said above the length picker. */
    return `<section class="belt-wall" aria-labelledby="beltWallTitle">
      <h2 id="beltWallTitle">
        <span class="jp-mark" lang="ja" aria-hidden="true">帯</span>
        ${escapeHtml(t("dojoBeltWallTitle"))}
      </h2>
      <ol>${rows}</ol>
      <p class="quiz-note">${escapeHtml(t("dojoBeltWallNote"))}</p>
    </section>`;
  }

  /* 暖簾 — the split curtain hung at a dojo entrance. Purely decorative, so it
     is aria-hidden; it is the one thing that makes the panel read as a doorway
     rather than a page. */
  const noren = () => `<div class="dojo-noren" aria-hidden="true">
    <span></span><span></span><span></span><span></span><span></span>
  </div>`;

  function renderQuizMenu() {
    quiz.stage = "menu";
    const lengths = window.ATLAS_QUIZ.LENGTHS.map((n) => `
      <button class="quiz-length" type="button" data-quiz-length="${n}">
        <strong>${n}</strong>
        <span>${escapeHtml(t("quizQuestions", { n }))}</span>
      </button>`).join("");

    quizStage.innerHTML = `
      ${noren()}
      <p class="dojo-shomen" lang="ja" aria-hidden="true">${escapeHtml(t("dojoShomen"))}</p>
      <header class="quiz-header">
        <p class="eyebrow">${escapeHtml(t("quizEyebrow"))}</p>
        <h1 id="quizTitle" tabindex="-1">${escapeHtml(t("quizTitle"))}</h1>
        <p class="learn-summary">${escapeHtml(t("quizIntro"))}</p>
      </header>
      <h2 class="quiz-subhead">${escapeHtml(t("quizPickLength"))}</h2>
      <div class="quiz-lengths">${lengths}</div>
      <p class="quiz-note">${escapeHtml(t("quizLengthNote"))}</p>
      ${beltWall(null)}`;
    $("quizTitle").focus({ preventScroll: true });
  }

  /**
   * Rei — the bow.
   *
   * A deliberate pause between choosing and starting. It is also the honest
   * place to say that there is one run and nothing is recorded, at the last
   * moment where that still matters to the reader.
   */
  function renderRei(count, dan) {
    quiz.stage = "rei";
    quiz.pending = { count, dan };
    quizStage.innerHTML = `
      <div class="dojo-rei">
        <p class="rei-kanji" lang="ja" aria-hidden="true">${escapeHtml(t("dojoReiTitle"))}</p>
        <h1 id="quizTitle" tabindex="-1">${escapeHtml(t("dojoReiRomaji"))}</h1>
        <p>${escapeHtml(t("dojoReiBody"))}</p>
        <p class="rei-count">${escapeHtml(t("quizQuestions", { n: count }))}</p>
        <button class="primary-button" type="button" data-quiz-rei>${escapeHtml(t("dojoReiGo"))}</button>
      </div>`;
    $("quizTitle").focus({ preventScroll: true });
  }

  function startQuiz(count, { dan = false } = {}) {
    quiz.questions = quizEngine.draw(count, { hardOnly: dan, hardestOnly: dan });
    quiz.index = 0;
    quiz.correct = 0;
    quiz.streak = 0;
    quiz.best = 0;
    quiz.chosen = null;
    quiz.dan = dan;
    quiz.call = t("dojoHajime");
    quiz.stage = "playing";
    renderQuestion();
  }

  /** Speak something once. Setting the same text twice would say nothing. */
  function announce(message) {
    const node = $("quizAnnounce");
    if (!node) return;
    node.textContent = node.textContent === message ? `${message} ` : message;
  }

  function renderQuestion() {
    const question = quiz.questions[quiz.index];
    if (!question) return renderQuizResult();

    const total = quiz.questions.length;
    const answered = quiz.chosen !== null;
    const pct = Math.round((quiz.index / total) * 100);

    const options = question.options.map((option, i) => {
      const isAnswer = i === question.answer;
      const isChosen = i === quiz.chosen;
      const state = !answered ? "" : isAnswer ? " is-correct" : isChosen ? " is-wrong" : " is-muted";
      return `<button class="quiz-option${state}" type="button" data-quiz-option="${i}"
        ${answered ? "disabled" : ""}><kbd>${i + 1}</kbd><span>${escapeHtml(option)}</span></button>`;
    }).join("");

    const verdict = !answered ? "" : `
      <p class="quiz-verdict ${quiz.chosen === question.answer ? "good" : "bad"}">
        <strong>${escapeHtml(quiz.chosen === question.answer ? t("quizCorrect") : t("quizWrong"))}</strong>
        ${quiz.chosen === question.answer ? "" :
          escapeHtml(t("quizAnswerWas", { answer: question.options[question.answer] }))}
      </p>`;

    /* The grade you are currently on track for. Shown against the questions
       ANSWERED so far, not the whole run — a percentage of a run you have not
       taken yet would read as a prediction, and would sit at white until the
       very end. It makes the grade something you feel moving. */
    const seen = quiz.index + (answered ? 1 : 0);
    const running = seen ? Math.round((quiz.correct / seen) * 100) : 0;
    const onTrack = window.ATLAS_QUIZ.beltFor(running, total);

    const last = quiz.index === total - 1;
    quizStage.innerHTML = `
      <div class="quiz-bar" role="progressbar" aria-valuenow="${quiz.index}" aria-valuemin="0" aria-valuemax="${total}">
        <span style="width:${pct}%"></span>
      </div>
      <div class="quiz-meta">
        <span>${escapeHtml(t("quizProgress", { n: quiz.index + 1, total }))}</span>
        <span class="dojo-call" lang="ja">${escapeHtml(quiz.call ?? "")}</span>
        <span class="dojo-track">
          <i class="belt-swatch" style="background:${escapeHtml(onTrack.colour)}"></i>
          ${escapeHtml(t("dojoOnTrack", { belt: beltName(onTrack) }))}
        </span>
      </div>
      <p class="quiz-prompt" id="quizPrompt" tabindex="-1">${escapeHtml(question.prompt).replace(/\n/g, "<br>")}</p>
      <div class="quiz-options">${options}</div>
      ${verdict}
      <div class="quiz-actions">
        ${answered ? `<button class="primary-button" type="button" data-quiz-next>
          ${escapeHtml(last ? t("quizFinish") : t("quizNext"))}</button>` : ""}
        <p class="quiz-note">${escapeHtml(t("quizKeyHint"))}</p>
      </div>`;
    $("quizPrompt").focus({ preventScroll: true });
  }

  function answerQuestion(choice) {
    if (quiz.stage !== "playing" || quiz.chosen !== null) return;
    const question = quiz.questions[quiz.index];
    if (!question || choice < 0 || choice >= question.options.length) return;
    quiz.chosen = choice;

    const right = choice === question.answer;
    announce(right
      ? t("quizCorrect")
      : `${t("quizWrong")} ${t("quizAnswerWas", { answer: question.options[question.answer] })}`);

    if (choice === question.answer) {
      quiz.correct += 1;
      quiz.streak += 1;
      quiz.best = Math.max(quiz.best, quiz.streak);
      /* Judo scores waza-ari for a near-perfect throw and ippon for a decisive
         one. Three in a row earns the first, five the second — a call rather
         than a points system, so it flavours the run without becoming a second
         score competing with the belt. */
      quiz.call = quiz.streak >= 5 ? t("dojoIppon")
        : quiz.streak >= 3 ? t("dojoWazaAri")
        : t("dojoStreak", { n: quiz.streak });
    } else {
      quiz.streak = 0;
      quiz.call = "";
    }
    renderQuestion();
  }

  function advanceQuestion() {
    if (quiz.stage !== "playing" || quiz.chosen === null) return;
    quiz.chosen = null;
    quiz.index += 1;
    if (quiz.index >= quiz.questions.length) renderQuizResult();
    else renderQuestion();
  }

  /**
   * Sore made — that is all.
   *
   * The belt is tied on rather than simply appearing. Under
   * prefers-reduced-motion the ceremony is skipped outright and the grade is
   * shown immediately: a reader who has asked for less movement has not asked
   * to wait longer for the same information.
   */
  function renderQuizResult() {
    quiz.stage = "result";
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return renderAward();

    quizStage.innerHTML = `
      <div class="dojo-ceremony" aria-hidden="true">
        <p class="rei-kanji" lang="ja" aria-hidden="true">${escapeHtml(t("dojoSoreMade"))}</p>
        <p class="quiz-note">${escapeHtml(t("dojoTie"))}</p>
      </div>`;
    window.clearTimeout(renderQuizResult.timer);
    renderQuizResult.timer = window.setTimeout(renderAward, 1250);
  }

  function renderAward() {
    const total = quiz.questions.length;
    const percent = total ? Math.round((quiz.correct / total) * 100) : 0;
    const streakNote = quiz.best >= 3
      ? `<p class="quiz-note">${escapeHtml(t("dojoStreak", { n: quiz.best }))}</p>` : "";

    if (quiz.dan) {
      const wrong = total - quiz.correct;
      const dan = window.ATLAS_QUIZ.danFor(wrong);
      const style = dan?.style ?? "plain";
      const colour = style === "red" ? "#c0392b" : "#15181c";
      const beltWord = dan
        ? t(style === "red" ? "quizDanBeltRed" : style === "kohaku" ? "quizDanBeltKohaku" : "quizDanBeltBlack")
        : t("quizDanBeltBlack");
      quizStage.innerHTML = `
        <header class="quiz-header result-header">
          <p class="eyebrow">${escapeHtml(t("quizDanTitle"))}</p>
          <h1 id="quizTitle" tabindex="-1">${escapeHtml(t("quizResultTitle", { correct: quiz.correct, total }))}</h1>
          <p class="quiz-percent">${escapeHtml(t("quizResultPercent", { n: percent }))}</p>
        </header>
        ${beltArt(colour, "#f2f5f8", dan?.rank ?? 0, style, "is-tied")}
        ${dan ? `<p class="award-kanji" lang="ja">${escapeHtml(dan.kanji)}</p>` : ""}
        <p class="quiz-award">${escapeHtml(dan
          ? `${dan.name} — ${danLabel(dan)}`
          : t("quizDanNone", { n: wrong }))}</p>
        <p class="award-sub">${escapeHtml(t("quizDanDropped", { n: wrong }))}</p>
        <p class="quiz-note">${escapeHtml(beltWord)}</p>
        ${streakNote}
        <p class="quiz-note dojo-seal">${escapeHtml(t("dojoAwardedIn"))}</p>
        <div class="quiz-actions">
          <button class="primary-button" type="button" data-quiz-start-dan>${escapeHtml(t("quizAgain"))}</button>
          <a class="ghost-button" href="#">${escapeHtml(t("quizBackToAtlas"))}</a>
        </div>`;
      $("quizTitle").focus({ preventScroll: true });
      return;
    }

    const belt = window.ATLAS_QUIZ.beltFor(percent, total);
    const uncapped = window.ATLAS_QUIZ.BELTS.filter((b) => percent >= b.min).pop();
    const gated = uncapped && uncapped.id !== belt.id;
    if (belt.id === "black") quiz.unlockedDan = true;
    const rank = belt.kyu === 0 ? t("quizDanBeltBlack") : kyuLabel(belt);

    announce(`${t("quizResultTitle", { correct: quiz.correct, total })} ${t("quizBeltAwarded", { belt: beltName(belt) })}`);
    quizStage.innerHTML = `
      <header class="quiz-header result-header">
        <h1 id="quizTitle" tabindex="-1">${escapeHtml(t("quizResultTitle", { correct: quiz.correct, total }))}</h1>
        <p class="quiz-percent">${escapeHtml(t("quizResultPercent", { n: percent }))}</p>
      </header>
      ${beltArt(belt.colour, belt.ink, 0, "plain", "is-tied")}
      <p class="award-kanji" lang="ja">${escapeHtml(belt.kanji)}</p>
      <p class="quiz-award">${escapeHtml(belt.romaji)}</p>
      <p class="award-sub">${escapeHtml(t("quizBeltAwarded", { belt: beltName(belt) }))} · ${escapeHtml(rank)}</p>
      ${percent === 100 ? `<p class="quiz-note">${escapeHtml(t("quizPerfect"))}</p>` : ""}
      ${streakNote}
      ${gated ? `<p class="quiz-note">${escapeHtml(t("quizGatedNote", { belt: beltName(belt) }))}</p>` : ""}
      <p class="quiz-note dojo-seal">${escapeHtml(t("dojoAwardedIn"))}</p>
      ${quiz.unlockedDan ? `<div class="dan-door">
        <p>${escapeHtml(t("quizDanUnlocked"))}</p>
        <a class="primary-button" href="#quiz/dan">${escapeHtml(t("quizDanEnter"))}</a>
      </div>` : ""}
      <div class="quiz-actions">
        <button class="primary-button" type="button" data-quiz-restart>${escapeHtml(t("quizAgain"))}</button>
        <a class="ghost-button" href="#">${escapeHtml(t("quizBackToAtlas"))}</a>
      </div>`;
    $("quizTitle").focus({ preventScroll: true });
  }

  function renderDanIntro() {
    quiz.stage = "danIntro";
    const grades = window.ATLAS_QUIZ.DANS.map((dan) => `
      <li class="dan-row dan-${dan.style}">
        ${beltHang(dan.style === "red" ? "#c0392b" : "#15181c", dan.style)}
        <span class="belt-kanji" lang="ja">${escapeHtml(dan.kanji)}</span>
        <span class="belt-names"><strong lang="ja-Latn">${escapeHtml(dan.name)}</strong><small>${escapeHtml(danLabel(dan))} · ${escapeHtml(t("quizDanAllows", { n: dan.dropped }))}</small></span>
      </li>`).join("");

    quizStage.innerHTML = `
      ${noren()}
      <p class="dojo-shomen" lang="ja" aria-hidden="true">${escapeHtml(t("dojoShomen"))}</p>
      <header class="quiz-header dan-header">
        <p class="eyebrow">${escapeHtml(t("quizDanEyebrow"))}</p>
        <h1 id="quizTitle" tabindex="-1">${escapeHtml(t("quizDanTitle"))}</h1>
        <p class="learn-summary">${escapeHtml(t("quizDanIntro"))}</p>
      </header>
      ${beltArt("#15181c", "#f2f5f8", 0, "plain")}
      <h2 class="dan-ladder-title"><span class="jp-mark" lang="ja" aria-hidden="true">段位</span></h2>
      <ol class="dan-ladder">${grades}</ol>
      <div class="quiz-actions">
        <button class="primary-button" type="button" data-quiz-start-dan>${escapeHtml(t("quizDanStart"))}</button>
      </div>`;
    $("quizTitle").focus({ preventScroll: true });
  }

  function openQuiz(updateHash = true, { dan = false } = {}) {
    if (dialog.open) dialog.close();
    state.learning = null;
    state.math = null;
    state.mathIndex = false;
    state.mathOrigin = null;

    if (dan) renderDanIntro();
    else if (quiz.stage === "playing") renderQuestion();
    else renderQuizMenu();

    showView("quiz");
    document.title = dan ? t("quizDanTitle") : t("quizTitle");
    window.scrollTo({ top: 0, behavior: "auto" });

    const target = dan ? "#quiz/dan" : "#quiz";
    if (updateHash && location.hash !== target) history.pushState({ quiz: true }, "", target);
  }

  quizStage.addEventListener("click", (event) => {
    const length = event.target.closest("[data-quiz-length]");
    if (length) return renderRei(Number(length.dataset.quizLength), false);
    if (event.target.closest("[data-quiz-rei]")) {
      const pending = quiz.pending ?? { count: window.ATLAS_QUIZ.LENGTHS[0], dan: false };
      return startQuiz(pending.count, { dan: pending.dan });
    }
    if (event.target.closest("[data-quiz-option]")) {
      return answerQuestion(Number(event.target.closest("[data-quiz-option]").dataset.quizOption));
    }
    if (event.target.closest("[data-quiz-next]")) return advanceQuestion();
    if (event.target.closest("[data-quiz-restart]")) return renderQuizMenu();
    if (event.target.closest("[data-quiz-start-dan]")) return renderRei(window.ATLAS_QUIZ.DAN_LENGTH, true);
  });

  /* Number keys answer, Enter advances — the whole game is playable without
     a mouse, like everything else in the atlas. */
  document.addEventListener("keydown", (event) => {
    if (quizView.hidden) return;
    if (quiz.stage !== "playing" && quiz.stage !== "rei") return;
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    const active = document.activeElement;
    if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA")) return;

    if (event.key === "Enter" && quiz.stage === "rei") {
      event.preventDefault();
      const pending = quiz.pending ?? { count: window.ATLAS_QUIZ.LENGTHS[0], dan: false };
      return startQuiz(pending.count, { dan: pending.dan });
    }
    if (event.key >= "1" && event.key <= "4") {
      event.preventDefault();
      answerQuestion(Number(event.key) - 1);
    } else if (event.key === "Enter" && quiz.chosen !== null) {
      event.preventDefault();
      advanceQuestion();
    }
  });

  /**
   * Idempotent and fully authoritative: given a hash it decides which of the
   * five panels is showing. `#learn` and `#math` win over `#concept`, so a
   * page and the dialog can never be open at once.
   */
  function handleRoute() {
    // First, not last: handleRoute() has an early return per route, and an
    // exception in any of the open* calls below must not be able to strand the
    // language links pointing at a page the reader has already left. The hash
    // is already current here — popstate and hashchange both fire after the
    // address bar updates.
    syncLanguageLinks();

    const hash = decodeURIComponent(location.hash);
    if (hash === "#quiz/dan") { openQuiz(false, { dan: true }); return; }
    if (hash === "#quiz") { openQuiz(false); return; }

    const math = hash.match(/^#math\/(.+)$/);
    const learn = hash.match(/^#learn\/(.+)$/);
    const concept = hash.match(/^#concept\/(.+)$/);

    if (math && mathBySlug.has(math[1])) { openMath(math[1], false); return; }
    if (hash === "#mathematics") { openMathIndex(false); return; }
    if (learn && conceptBySlug.has(learn[1])) { openLearn(learn[1], false); return; }

    state.learning = null;
    state.math = null;
    state.mathIndex = false;
    state.mathOrigin = null;
    showView("atlas");
    document.title = BASE_TITLE;

    if (concept && conceptBySlug.has(concept[1])) openConcept(concept[1], false);
    else if (dialog.open) closeConcept(false);
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(showToast.timeout);
    showToast.timeout = window.setTimeout(() => toast.classList.remove("show"), 2200);
  }

  /**
   * Copy a link, including when the atlas is opened straight off disk.
   *
   * navigator.clipboard needs a secure context. That is satisfied on the
   * published site, but not by a local copy opened as file:// — and a desktop
   * shortcut can point at either. So fall back to a hidden textarea and
   * execCommand("copy"), which is deprecated but is the only thing that works
   * there, and is exactly the case it still exists for.
   */
  async function copyLink(url, label) {
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(url);
        showToast(t("toastCopied", { label }));
        return;
      } catch { /* fall through to the file:// path */ }
    }

    const field = document.createElement("textarea");
    field.value = url;
    field.setAttribute("readonly", "");
    field.style.cssText = "position:fixed;top:-1000px;opacity:0";
    document.body.appendChild(field);
    try {
      field.select();
      field.setSelectionRange(0, field.value.length);
      if (document.execCommand("copy")) {
        showToast(t("toastCopied", { label }));
        return;
      }
    } catch { /* fall through */ }
    finally {
      field.remove();
    }

    showToast(t("toastCopyManually", { url }));
  }

  /* Everything before the hash, whatever the scheme. Not origin + pathname:
     for a file:// document location.origin is the literal string "null", so
     that produced "null/E:/…/index.html#concept/qlora" — a link that looks
     right and goes nowhere. The published site is unaffected, but a local copy
     is a real way to read this atlas and its links should work too. */
  const absolute = (hash) => location.href.split("#")[0] + hash;

  /* ================================================================= */
  /* Events                                                             */
  /* ================================================================= */

  filters.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-category]");
    if (button) setCategory(button.dataset.category);
  });

  graphLegend.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-category]");
    if (button) setCategory(button.dataset.category);
  });

  bands.addEventListener("click", (event) => {
    const filter = event.target.closest(".band-filter");
    if (filter) { setCategory(filter.dataset.category); return; }
    const card = event.target.closest(".concept-card");
    if (card) openConcept(card.dataset.slug);
  });

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => setView(tab.dataset.view));
    tab.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      event.preventDefault();
      const next = tabs[(tabs.indexOf(tab) + (event.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
      setView(next.dataset.view);
      next.focus();
    });
  });

  /** A node opens whichever layer it belongs to. */
  function openGraphNode(node) {
    if (node.dataset.kind === "math") openMath(node.dataset.slug);
    else openConcept(node.dataset.slug);
  }

  graphLayers.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-graph-layer]");
    if (button) setGraphLayer(button.dataset.graphLayer);
  });

  graphFocusSelect.addEventListener("change", () => setGraphFocus(graphFocusSelect.value));

  graphSvg.addEventListener("click", (event) => {
    const node = event.target.closest(".graph-node");
    if (node && !node.classList.contains("dim")) openGraphNode(node);
  });
  graphSvg.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const node = event.target.closest(".graph-node");
    if (!node || node.classList.contains("dim")) return;
    event.preventDefault();
    openGraphNode(node);
  });
  graphSvg.addEventListener("pointerover", (event) => {
    const node = event.target.closest(".graph-node");
    highlightGraphNode(node && !node.classList.contains("dim") ? node.dataset.id : null);
  });
  graphSvg.addEventListener("pointerleave", () => highlightGraphNode(null));
  graphSvg.addEventListener("focusin", (event) => {
    const node = event.target.closest(".graph-node");
    if (node) highlightGraphNode(node.dataset.id);
  });
  graphSvg.addEventListener("focusout", () => highlightGraphNode(null));

  searchResults.addEventListener("click", (event) => {
    const option = event.target.closest(".search-result");
    if (option) openSuggestion(option);
  });

  /* Mathematics overview: branch filters, difficulty filters, cards, search. */
  function setMathCategory(id) {
    state.mathCategory = state.mathCategory === id && id !== "all" ? "all" : id;
    renderMathFilters();
    renderMathIndex();
  }

  mathIndexView.addEventListener("click", (event) => {
    const branch = event.target.closest("button[data-math-category]");
    if (branch) { setMathCategory(branch.dataset.mathCategory); return; }

    const level = event.target.closest("button[data-math-difficulty]");
    if (level) {
      state.mathDifficulty = level.dataset.mathDifficulty;
      renderMathFilters();
      renderMathIndex();
      return;
    }

    const card = event.target.closest(".math-card");
    if (card) openMath(card.dataset.math);
  });

  mathSearchInput.addEventListener("input", renderMathIndex);
  mathSearchInput.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !mathSearchInput.value) return;
    mathSearchInput.value = "";
    renderMathIndex();
  });

  searchInput.addEventListener("input", renderSearchResults);
  searchInput.addEventListener("keydown", (event) => {
    const options = searchResults.hidden ? [] : [...searchResults.querySelectorAll(".search-result")];
    if (event.key === "ArrowDown" && options.length) {
      event.preventDefault();
      highlightSuggestion(state.activeSuggestion + 1);
    } else if (event.key === "ArrowUp" && options.length) {
      event.preventDefault();
      highlightSuggestion(state.activeSuggestion - 1);
    } else if (event.key === "Enter") {
      const target = options[state.activeSuggestion] ?? options[0];
      if (target) {
        event.preventDefault();
        openSuggestion(target);
      }
    } else if (event.key === "Escape") {
      if (!searchResults.hidden) setSuggestionsOpen(false);
      else { searchInput.value = ""; renderSearchResults(); }
    }
  });

  searchInput.addEventListener("focus", () => {
    if (searchInput.value.trim() && searchResults.innerHTML) setSuggestionsOpen(true);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "/" || event.ctrlKey || event.metaKey || event.altKey) return;
    const active = document.activeElement;
    const typing = active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA" || active.isContentEditable);
    if (typing || dialog.open || state.learning || state.math) return;
    event.preventDefault();
    // On the mathematics overview the slash key belongs to that page's own field.
    const field = state.mathIndex ? mathSearchInput : searchInput;
    field.focus();
    field.select();
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".search-shell") && !event.target.closest(".search-results")) setSuggestionsOpen(false);
  });

  $("closeDialog").addEventListener("click", () => closeConcept());
  dialog.addEventListener("click", (event) => { if (event.target === dialog) closeConcept(); });
  dialog.addEventListener("cancel", (event) => { event.preventDefault(); closeConcept(); });

  $("randomButton").addEventListener("click", () => {
    if (!concepts.length) return;
    const pool = concepts.filter((concept) => concept.slug !== state.current?.slug);
    const concept = pool[Math.floor(Math.random() * pool.length)] ?? concepts[0];
    openConcept(concept.slug);
  });

  $("nextConcept").addEventListener("click", () => {
    if (!concepts.length) return;
    const index = concepts.findIndex((item) => item.slug === state.current?.slug);
    openConcept(concepts[(index + 1) % concepts.length].slug);
  });

  $("copyLink").addEventListener("click", () => {
    copyLink(state.current ? absolute(`#concept/${state.current.slug}`) : location.href, t("labelConceptLink"));
  });

  $("learnCopy").addEventListener("click", () => {
    copyLink(state.learning ? absolute(`#learn/${state.learning.slug}`) : location.href, t("labelPageLink"));
  });

  $("mathCopy").addEventListener("click", () => {
    copyLink(state.math ? absolute(`#math/${state.math.slug}`) : location.href, t("labelPageLink"));
  });

  window.addEventListener("popstate", handleRoute);
  window.addEventListener("hashchange", handleRoute);

  /**
   * Keep the language links pointing at the CURRENT page.
   *
   * Switching language must land the reader on the same concept, not back at
   * the top of the atlas — so the hash has to be copied across, and it changes
   * as they navigate. handleRoute() is the one place that always runs on a
   * route change, which makes it the right hook.
   */
  function syncLanguageLinks() {
    for (const link of document.querySelectorAll("[data-lang-link]")) {
      const target = link.dataset.langLink;
      link.setAttribute("href", i18n.hrefFor(target, location.hash));
      link.setAttribute("aria-current", target === i18n.lang ? "true" : "false");
    }
  }

  renderInviteRack();
  renderFilters();
  renderMathFilters();
  renderMathIndex();
  renderGraphControls();
  setView("bands");
  renderAtlas();
  handleRoute();
})();
