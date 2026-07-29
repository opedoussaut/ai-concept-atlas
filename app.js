(() => {
  const concepts = window.AI_CONCEPTS ?? [];
  const categories = window.AI_CATEGORIES ?? [];
  const conceptBySlug = new Map(concepts.map((item) => [item.slug, item]));
  const categoryById = new Map(categories.map((item) => [item.id, item]));
  const FALLBACK_CATEGORY = { id: "all", name: "Uncategorized", short: "Other", color: "#5de7ff" };
  const MAX_SUGGESTIONS = 7;

  const state = { category: "all", query: "", current: null, activeSuggestion: -1, lastTrigger: null };

  const grid = document.getElementById("conceptGrid");
  const filters = document.getElementById("filters");
  const categoryRail = document.getElementById("categoryRail");
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");
  const resultStatus = document.getElementById("resultStatus");
  const dialog = document.getElementById("conceptDialog");
  const toast = document.getElementById("toast");

  document.getElementById("conceptCount").textContent = String(concepts.length);
  document.getElementById("categoryCount").textContent = String(categories.length);

  const categoryOf = (concept) => categoryById.get(concept.category) ?? FALLBACK_CATEGORY;

  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  })[char]);

  /* ----------------------------------------------------------------- */
  /* Search index                                                       */
  /* ----------------------------------------------------------------- */

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
      // Ranked fields: identifiers first, then prose.
      acronym: normalize(concept.acronym),
      name: normalize(concept.name),
      slug: normalize(concept.slug),
      tags: normalize((concept.tags ?? []).join(" ")),
      summary: normalize(concept.summary),
      category: normalize(`${category.name} ${category.short ?? ""}`),
      prose: normalize(`${concept.summary} ${concept.why} ${concept.how} ${concept.example ?? ""}`),
      // Compact form lets "chainofthought" or "vectordb" match too.
      compact: normalize(`${concept.acronym} ${concept.name} ${concept.slug}`).replace(/ /g, "")
    }];
  }));

  /**
   * Scores one concept against one search token.
   * Returns 0 when the token does not appear anywhere.
   */
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

  /**
   * All tokens must match (AND semantics); the result is ranked by total score.
   */
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

  /* ----------------------------------------------------------------- */
  /* Rendering                                                          */
  /* ----------------------------------------------------------------- */

  function renderFilters() {
    const items = [{ id: "all", short: "All" }, ...categories];
    filters.innerHTML = items.map((category) => {
      const active = state.category === category.id;
      return `<button class="filter-button${active ? " active" : ""}" data-category="${escapeHtml(category.id)}" type="button" aria-pressed="${active}">
        ${escapeHtml(category.short || category.name)}
      </button>`;
    }).join("");
  }

  function renderCategoryRail() {
    categoryRail.innerHTML = categories.map((category) => {
      const count = concepts.filter((concept) => concept.category === category.id).length;
      const active = state.category === category.id;
      return `<button class="category-link${active ? " active" : ""}" data-category="${escapeHtml(category.id)}" type="button" aria-pressed="${active}">
        ${escapeHtml(category.name)}
        <span>${count} concepts</span>
      </button>`;
    }).join("");
  }

  function setCategory(category) {
    state.category = state.category === category && category !== "all" ? "all" : category;
    renderFilters();
    renderCategoryRail();
    renderGrid();
  }

  function getVisibleConcepts() {
    const ranked = search(state.query);
    return state.category === "all"
      ? ranked
      : ranked.filter((concept) => concept.category === state.category);
  }

  function renderGrid() {
    const visible = getVisibleConcepts();
    const domain = state.category === "all" ? "all domains" : (categoryById.get(state.category)?.name ?? state.category);

    if (!visible.length) {
      grid.innerHTML = `<div class="empty-state"><h3>No matching concept</h3><p>Try another acronym, full name, keyword or domain.</p></div>`;
      resultStatus.textContent = `No concepts match the current search in ${domain}.`;
      return;
    }

    grid.innerHTML = visible.map((concept) => {
      const category = categoryOf(concept);
      return `<button class="concept-card" type="button" data-slug="${escapeHtml(concept.slug)}" style="--card-accent:${escapeHtml(category.color)}">
        <span class="arrow" aria-hidden="true">↗</span>
        <p class="acronym">${escapeHtml(concept.acronym)}</p>
        <h3>${escapeHtml(concept.name)}</h3>
        <p>${escapeHtml(concept.summary)}</p>
      </button>`;
    }).join("");

    resultStatus.textContent = `${visible.length} concept${visible.length === 1 ? "" : "s"} shown in ${domain}.`;
  }

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
    renderGrid();

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

  /* ----------------------------------------------------------------- */
  /* Concept dialog and routing                                         */
  /* ----------------------------------------------------------------- */

  function openConcept(slug, updateHash = true) {
    const concept = conceptBySlug.get(slug);
    if (!concept) return;

    if (!dialog.open) state.lastTrigger = document.activeElement;
    state.current = concept;

    const category = categoryOf(concept);
    document.getElementById("dialogCategory").textContent = category.name;
    document.getElementById("dialogAcronym").textContent = concept.acronym;
    document.getElementById("dialogName").textContent = concept.name;
    document.getElementById("dialogSummary").textContent = concept.summary;
    document.getElementById("dialogWhy").textContent = concept.why;
    document.getElementById("dialogHow").textContent = concept.how;
    document.getElementById("dialogExample").textContent = concept.example || "";
    document.getElementById("exampleSection").hidden = !concept.example;

    const sourceSection = document.getElementById("sourceSection");
    const sourceLink = document.getElementById("dialogSource");
    sourceSection.hidden = !concept.source;
    if (concept.source) {
      sourceLink.href = concept.source.url;
      sourceLink.textContent = concept.source.label;
    } else {
      sourceLink.removeAttribute("href");
      sourceLink.textContent = "";
    }

    const related = (concept.related ?? []).map((relatedSlug) => conceptBySlug.get(relatedSlug)).filter(Boolean);
    const relatedLinks = document.getElementById("relatedLinks");
    relatedLinks.innerHTML = related.length
      ? related.map((item) => `<button type="button" data-slug="${escapeHtml(item.slug)}">${escapeHtml(item.acronym || item.name)}</button>`).join("")
      : `<p class="related-empty">No related concepts recorded yet.</p>`;

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
    document.title = "AI Concept Atlas — From LoRA to MCP";
    if (updateHash && location.hash.startsWith("#concept/")) {
      history.pushState({}, "", location.pathname + location.search);
    }
    // Return focus to whatever opened the dialog so keyboard users do not
    // get dropped back at the top of the document.
    if (state.lastTrigger?.isConnected) state.lastTrigger.focus();
    else searchInput.focus({ preventScroll: true });
    state.lastTrigger = null;
  }

  function handleRoute() {
    const match = decodeURIComponent(location.hash).match(/^#concept\/(.+)$/);
    if (match && conceptBySlug.has(match[1])) openConcept(match[1], false);
    else if (dialog.open) closeConcept(false);
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(showToast.timeout);
    showToast.timeout = window.setTimeout(() => toast.classList.remove("show"), 2200);
  }

  /* ----------------------------------------------------------------- */
  /* Events (delegated where the markup is re-rendered)                 */
  /* ----------------------------------------------------------------- */

  filters.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-category]");
    if (button) setCategory(button.dataset.category);
  });

  categoryRail.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-category]");
    if (button) setCategory(button.dataset.category);
  });

  grid.addEventListener("click", (event) => {
    const card = event.target.closest(".concept-card");
    if (card) openConcept(card.dataset.slug);
  });

  searchResults.addEventListener("click", (event) => {
    const option = event.target.closest(".search-result");
    if (!option) return;
    setSuggestionsOpen(false);
    openConcept(option.dataset.slug);
  });

  document.getElementById("relatedLinks").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-slug]");
    if (button) openConcept(button.dataset.slug);
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
    // Never steal the key while the user is typing or reading a concept.
    const active = document.activeElement;
    const typing = active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA" || active.isContentEditable);
    if (typing || dialog.open) return;
    event.preventDefault();
    searchInput.focus();
    searchInput.select();
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".search-shell") && !event.target.closest(".search-results")) setSuggestionsOpen(false);
  });

  document.getElementById("closeDialog").addEventListener("click", () => closeConcept());
  dialog.addEventListener("click", (event) => { if (event.target === dialog) closeConcept(); });
  dialog.addEventListener("cancel", (event) => { event.preventDefault(); closeConcept(); });

  document.getElementById("randomButton").addEventListener("click", () => {
    if (!concepts.length) return;
    const pool = concepts.filter((concept) => concept.slug !== state.current?.slug);
    const concept = pool[Math.floor(Math.random() * pool.length)] ?? concepts[0];
    openConcept(concept.slug);
  });

  document.getElementById("nextConcept").addEventListener("click", () => {
    if (!concepts.length) return;
    const index = concepts.findIndex((item) => item.slug === state.current?.slug);
    openConcept(concepts[(index + 1) % concepts.length].slug);
  });

  document.getElementById("copyLink").addEventListener("click", async () => {
    const url = state.current
      ? `${location.origin}${location.pathname}#concept/${state.current.slug}`
      : location.href;
    try {
      await navigator.clipboard.writeText(url);
      showToast("Concept link copied");
    } catch {
      // Clipboard access requires a secure context; show the link instead.
      showToast(`Copy this link: ${url}`);
    }
  });

  window.addEventListener("popstate", handleRoute);
  window.addEventListener("hashchange", handleRoute);

  renderFilters();
  renderCategoryRail();
  renderGrid();
  handleRoute();
})();
