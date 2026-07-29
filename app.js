(() => {
  const concepts = window.AI_CONCEPTS ?? [];
  const categories = window.AI_CATEGORIES ?? [];
  const conceptBySlug = new Map(concepts.map((item) => [item.slug, item]));
  const categoryById = new Map(categories.map((item) => [item.id, item]));
  const FALLBACK_CATEGORY = { id: "all", name: "Uncategorized", short: "Other", color: "#5de7ff" };
  const MAX_SUGGESTIONS = 7;
  const BASE_TITLE = "AI Concept Atlas — From LoRA to MCP";

  const state = {
    category: "all",
    query: "",
    view: "bands",
    current: null,
    learning: null,
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

  $("conceptCount").textContent = String(concepts.length);
  $("categoryCount").textContent = String(categories.length);

  const categoryOf = (concept) => categoryById.get(concept.category) ?? FALLBACK_CATEGORY;

  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  })[char]);

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

  const searchIndex = new Map(concepts.map((concept) => {
    const category = categoryOf(concept);
    return [concept.slug, {
      acronym: normalize(concept.acronym),
      name: normalize(concept.name),
      slug: normalize(concept.slug),
      tags: normalize((concept.tags ?? []).join(" ")),
      summary: normalize(concept.summary),
      category: normalize(`${category.name} ${category.short ?? ""}`),
      prose: normalize(`${concept.summary} ${concept.why} ${concept.how} ${concept.example ?? ""}`),
      compact: normalize(`${concept.acronym} ${concept.name} ${concept.slug}`).replace(/ /g, "")
    }];
  }));

  function scoreToken(entry, token) {
    if (entry.acronym === token) return 120;
    if (entry.name === token || entry.slug === token) return 110;
    if (entry.acronym.startsWith(token)) return 90;
    if (entry.name.startsWith(token)) return 80;
    if (entry.compact.startsWith(token)) return 70;
    if (new RegExp(`\\b${token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`).test(entry.name)) return 60;
    if (entry.tags.includes(token)) return 45;
    if (entry.category.includes(token)) return 35;
    if (entry.summary.includes(token)) return 30;
    if (entry.compact.includes(token)) return 25;
    if (entry.prose.includes(token)) return 12;
    return 0;
  }

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
      .sort((a, b) => b.score - a.score || a.concept.name.localeCompare(b.concept.name))
      .map((item) => item.concept);
  }

  function getVisibleConcepts() {
    const ranked = search(state.query);
    return state.category === "all"
      ? ranked
      : ranked.filter((concept) => concept.category === state.category);
  }

  /* ================================================================= */
  /* Relationship graph — small force-directed layout, computed once    */
  /* ================================================================= */

  const GRAPH = { width: 1000, height: 680 };

  const graphEdges = (() => {
    const seen = new Set();
    const list = [];
    for (const concept of concepts) {
      for (const other of concept.related ?? []) {
        if (!conceptBySlug.has(other) || other === concept.slug) continue;
        const key = [concept.slug, other].sort().join("|");
        if (seen.has(key)) continue;
        seen.add(key);
        list.push({ source: concept.slug, target: other });
      }
    }
    return list;
  })();

  const degreeBySlug = new Map(concepts.map((concept) => [concept.slug, 0]));
  for (const edge of graphEdges) {
    degreeBySlug.set(edge.source, degreeBySlug.get(edge.source) + 1);
    degreeBySlug.set(edge.target, degreeBySlug.get(edge.target) + 1);
  }

  const neighboursBySlug = new Map(concepts.map((concept) => [concept.slug, new Set()]));
  for (const edge of graphEdges) {
    neighboursBySlug.get(edge.source).add(edge.target);
    neighboursBySlug.get(edge.target).add(edge.source);
  }

  /**
   * Deterministic force-directed layout: repulsion between every pair,
   * springs along declared relationships, mild gravity toward each domain's
   * anchor so the clusters stay legible. Runs once, synchronously.
   */
  function computeGraphLayout() {
    const nodes = concepts.map((concept, index) => {
      const domainIndex = categories.findIndex((category) => category.id === concept.category);
      const spoke = (domainIndex < 0 ? 0 : domainIndex) / Math.max(categories.length, 1) * Math.PI * 2;
      const jitter = ((index * 2654435761) % 1000) / 1000;
      return {
        slug: concept.slug,
        category: concept.category,
        x: GRAPH.width / 2 + Math.cos(spoke) * (150 + jitter * 110),
        y: GRAPH.height / 2 + Math.sin(spoke) * (150 + jitter * 110),
        vx: 0,
        vy: 0
      };
    });
    const nodeBySlug = new Map(nodes.map((node) => [node.slug, node]));

    const anchors = new Map(categories.map((category, index) => {
      const spoke = index / categories.length * Math.PI * 2;
      return [category.id, {
        x: GRAPH.width / 2 + Math.cos(spoke) * 250,
        y: GRAPH.height / 2 + Math.sin(spoke) * 190
      }];
    }));

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

      for (const edge of graphEdges) {
        const a = nodeBySlug.get(edge.source);
        const b = nodeBySlug.get(edge.target);
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = (distance - REST) * SPRING;
        const fx = (dx / distance) * force;
        const fy = (dy / distance) * force;
        a.vx += fx; a.vy += fy;
        b.vx -= fx; b.vy -= fy;
      }

      for (const node of nodes) {
        const anchor = anchors.get(node.category);
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
  function deconflictLabels() {
    const groups = [...graphSvg.querySelectorAll(".graph-node")];
    if (!groups.length || typeof groups[0].querySelector(".graph-label")?.getBBox !== "function") return;

    groups.sort((a, b) =>
      (degreeBySlug.get(b.dataset.slug) ?? 0) - (degreeBySlug.get(a.dataset.slug) ?? 0));

    const PADDING = 2;
    const placed = [];
    for (const group of groups) {
      const label = group.querySelector(".graph-label");
      let box;
      try { box = label.getBBox(); } catch { return; }
      if (!box.width) { label.classList.remove("crowded"); continue; }

      const node = graphNodes.get(group.dataset.slug);
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

  let graphNodes = null;

  function radiusOf(slug) {
    return 6.5 + Math.min(degreeBySlug.get(slug) ?? 0, 9) * 0.95;
  }

  function renderGraph() {
    if (!graphNodes) graphNodes = computeGraphLayout();
    const visible = new Set(getVisibleConcepts().map((concept) => concept.slug));

    const edgeMarkup = graphEdges.map((edge) => {
      const a = graphNodes.get(edge.source);
      const b = graphNodes.get(edge.target);
      const dim = !visible.has(edge.source) || !visible.has(edge.target);
      return `<line class="graph-edge${dim ? " dim" : ""}" x1="${a.x.toFixed(1)}" y1="${a.y.toFixed(1)}" x2="${b.x.toFixed(1)}" y2="${b.y.toFixed(1)}" data-a="${escapeHtml(edge.source)}" data-b="${escapeHtml(edge.target)}" />`;
    }).join("");

    const nodeMarkup = concepts.map((concept) => {
      const node = graphNodes.get(concept.slug);
      const category = categoryOf(concept);
      const dim = !visible.has(concept.slug);
      const r = radiusOf(concept.slug);
      const degree = degreeBySlug.get(concept.slug) ?? 0;
      return `<g class="graph-node${dim ? " dim" : ""}" data-slug="${escapeHtml(concept.slug)}" transform="translate(${node.x.toFixed(1)} ${node.y.toFixed(1)})"
        role="button" tabindex="${dim ? -1 : 0}"
        aria-label="${escapeHtml(`${concept.acronym}, ${concept.name}. ${category.name}. ${degree} connections.`)}">
        <circle class="graph-halo" r="${(r + 6).toFixed(1)}" />
        <circle class="graph-dot" r="${r.toFixed(1)}" style="fill:${escapeHtml(category.color)}" />
        <text class="graph-label" y="${(r + 12).toFixed(1)}">${escapeHtml(concept.acronym)}</text>
      </g>`;
    }).join("");

    graphSvg.innerHTML =
      `<g class="graph-edges">${edgeMarkup}</g><g class="graph-nodes">${nodeMarkup}</g>`;
    deconflictLabels();

    graphLegend.innerHTML = categories.map((category) => {
      const count = concepts.filter((concept) => concept.category === category.id).length;
      const active = state.category === category.id;
      return `<button class="legend-chip${active ? " active" : ""}" type="button" data-category="${escapeHtml(category.id)}" aria-pressed="${active}">
        <span class="legend-dot" style="background:${escapeHtml(category.color)}"></span>
        ${escapeHtml(category.name)} <em>${count}</em>
      </button>`;
    }).join("");
  }

  function highlightGraphNode(slug) {
    const neighbours = slug ? neighboursBySlug.get(slug) : null;
    graphSvg.querySelectorAll(".graph-node").forEach((node) => {
      const isFocus = slug != null && node.dataset.slug === slug;
      const isNeighbour = neighbours ? neighbours.has(node.dataset.slug) : false;
      node.classList.toggle("focus", isFocus);
      node.classList.toggle("neighbour", isNeighbour);
      node.classList.toggle("faded", slug != null && !isFocus && !isNeighbour);
    });
    graphSvg.querySelectorAll(".graph-edge").forEach((edge) => {
      const touches = slug != null && (edge.dataset.a === slug || edge.dataset.b === slug);
      edge.classList.toggle("active", touches);
      edge.classList.toggle("faded", slug != null && !touches);
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
          <span class="band-count">${items.length} concept${items.length === 1 ? "" : "s"}</span>
          <button class="band-filter" type="button" data-category="${escapeHtml(category.id)}"
                  aria-pressed="${state.category === category.id}">
            ${state.category === category.id ? "Show all domains" : "Focus"}
          </button>
        </div>
        <div class="concept-grid">${items.map(conceptCard).join("")}</div>
      </section>`;
    }).join("");

    bands.innerHTML = sections || `<div class="empty-state"><h3>No matching concept</h3><p>Try another acronym, full name, keyword or domain.</p></div>`;
    return visible;
  }

  function renderAtlas() {
    const visible = renderBands();
    if (state.view === "graph") renderGraph();

    const domain = state.category === "all"
      ? "all domains"
      : (categoryById.get(state.category)?.name ?? state.category);
    resultStatus.textContent = visible.length
      ? `${visible.length} concept${visible.length === 1 ? "" : "s"} shown in ${domain}.`
      : `No concepts match the current search in ${domain}.`;
  }

  function renderFilters() {
    const items = [{ id: "all", short: "All" }, ...categories];
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

    const matches = search(state.query).slice(0, MAX_SUGGESTIONS);
    searchResults.innerHTML = matches.length
      ? matches.map((concept, index) => `<button class="search-result" type="button" role="option" tabindex="-1" aria-selected="false" id="suggestion-${index}" data-slug="${escapeHtml(concept.slug)}">
          <b>${escapeHtml(concept.acronym)}</b>
          <span>${escapeHtml(concept.name)}<br><small>${escapeHtml(concept.summary)}</small></span>
        </button>`).join("")
      : `<p class="empty-state" style="padding:24px">No concept found.</p>`;

    state.activeSuggestion = -1;
    searchInput.removeAttribute("aria-activedescendant");
    setSuggestionsOpen(true);
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
      : `<p class="related-empty">No related concepts recorded yet.</p>`;
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
      container.innerHTML = concept.source
        ? `<p class="math-pending">A worked mathematical treatment of this concept has not been written yet.
             The primary reference alongside carries the full derivation.</p>`
        : `<p class="math-pending">A worked mathematical treatment of this concept has not been written yet.</p>`;
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
    $("dialogSummary").textContent = concept.summary;
    $("dialogWhy").textContent = concept.why;
    $("dialogHow").textContent = concept.how;
    $("dialogExample").textContent = concept.example || "";
    $("exampleSection").hidden = !concept.example;

    $("sourceSection").hidden = !renderReference(
      $("dialogSource"), $("dialogSourceLabel"), $("dialogSourceHost"), concept
    );

    renderRelated($("relatedLinks"), concept, (next) => openConcept(next));
    $("openLearn").setAttribute("href", `#learn/${concept.slug}`);

    document.title = `${concept.acronym} — ${concept.name} | AI Concept Atlas`;

    if (!dialog.open) dialog.showModal();
    dialog.querySelector(".dialog-body")?.scrollTo({ top: 0 });
    if (updateHash && location.hash !== `#concept/${slug}`) {
      history.pushState({ concept: slug }, "", `#concept/${slug}`);
    }
  }

  function closeConcept(updateHash = true) {
    state.current = null;
    if (dialog.open) dialog.close();
    if (!state.learning) document.title = BASE_TITLE;
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

    const category = categoryOf(concept);
    learnView.style.setProperty("--card-accent", category.color);
    $("learnDomain").textContent = category.name;
    $("learnAcronym").textContent = concept.acronym;
    $("learnName").textContent = concept.name;
    $("learnSummary").textContent = concept.summary;
    $("learnWhy").textContent = concept.why;
    $("learnHow").textContent = concept.how;
    $("learnExample").textContent = concept.example || "";
    $("learnExampleSection").hidden = !concept.example;

    $("learnSourceSection").hidden = !renderReference(
      $("learnSource"), $("learnSourceLabel"), $("learnSourceHost"), concept
    );
    renderMath($("learnMath"), concept);
    renderRelated($("learnRelated"), concept, (next) => openLearn(next));

    atlasView.hidden = true;
    learnView.hidden = false;
    document.title = `${concept.acronym} — ${concept.name} | AI Concept Atlas`;
    window.scrollTo({ top: 0, behavior: "auto" });
    $("learnName").setAttribute("tabindex", "-1");
    $("learnName").focus({ preventScroll: true });

    if (updateHash && location.hash !== `#learn/${slug}`) {
      history.pushState({ learn: slug }, "", `#learn/${slug}`);
    }
  }

  function closeLearn() {
    if (!state.learning) return;
    state.learning = null;
    learnView.hidden = true;
    atlasView.hidden = false;
    document.title = BASE_TITLE;
  }

  /* ================================================================= */
  /* Routing                                                            */
  /* ================================================================= */

  function handleRoute() {
    const hash = decodeURIComponent(location.hash);
    const learn = hash.match(/^#learn\/(.+)$/);
    const concept = hash.match(/^#concept\/(.+)$/);

    if (learn && conceptBySlug.has(learn[1])) { openLearn(learn[1], false); return; }
    closeLearn();
    if (concept && conceptBySlug.has(concept[1])) openConcept(concept[1], false);
    else if (dialog.open) closeConcept(false);
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(showToast.timeout);
    showToast.timeout = window.setTimeout(() => toast.classList.remove("show"), 2200);
  }

  async function copyLink(url, label) {
    try {
      await navigator.clipboard.writeText(url);
      showToast(`${label} copied`);
    } catch {
      // The Clipboard API needs a secure context; show the link instead.
      showToast(`Copy this link: ${url}`);
    }
  }

  const absolute = (hash) => `${location.origin}${location.pathname}${hash}`;

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

  graphSvg.addEventListener("click", (event) => {
    const node = event.target.closest(".graph-node");
    if (node && !node.classList.contains("dim")) openConcept(node.dataset.slug);
  });
  graphSvg.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const node = event.target.closest(".graph-node");
    if (!node || node.classList.contains("dim")) return;
    event.preventDefault();
    openConcept(node.dataset.slug);
  });
  graphSvg.addEventListener("pointerover", (event) => {
    const node = event.target.closest(".graph-node");
    highlightGraphNode(node && !node.classList.contains("dim") ? node.dataset.slug : null);
  });
  graphSvg.addEventListener("pointerleave", () => highlightGraphNode(null));
  graphSvg.addEventListener("focusin", (event) => {
    const node = event.target.closest(".graph-node");
    if (node) highlightGraphNode(node.dataset.slug);
  });
  graphSvg.addEventListener("focusout", () => highlightGraphNode(null));

  searchResults.addEventListener("click", (event) => {
    const option = event.target.closest(".search-result");
    if (!option) return;
    setSuggestionsOpen(false);
    openConcept(option.dataset.slug);
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
        setSuggestionsOpen(false);
        openConcept(target.dataset.slug);
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
    if (typing || dialog.open || state.learning) return;
    event.preventDefault();
    searchInput.focus();
    searchInput.select();
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
    copyLink(state.current ? absolute(`#concept/${state.current.slug}`) : location.href, "Concept link");
  });

  $("learnCopy").addEventListener("click", () => {
    copyLink(state.learning ? absolute(`#learn/${state.learning.slug}`) : location.href, "Page link");
  });

  window.addEventListener("popstate", handleRoute);
  window.addEventListener("hashchange", handleRoute);

  renderFilters();
  setView("bands");
  renderAtlas();
  handleRoute();
})();
