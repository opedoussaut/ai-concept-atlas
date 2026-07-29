(() => {
  const concepts = window.AI_CONCEPTS;
  const categories = window.AI_CATEGORIES;
  const conceptBySlug = new Map(concepts.map((item) => [item.slug, item]));

  const state = { category: "all", query: "", current: null };
  const grid = document.getElementById("conceptGrid");
  const filters = document.getElementById("filters");
  const categoryRail = document.getElementById("categoryRail");
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");
  const dialog = document.getElementById("conceptDialog");
  const toast = document.getElementById("toast");

  document.getElementById("conceptCount").textContent = concepts.length;
  document.getElementById("categoryCount").textContent = categories.length;

  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  })[char]);

  function renderFilters() {
    const items = [{ id: "all", short: "All" }, ...categories];
    filters.innerHTML = items.map((category) => `
      <button class="filter-button ${state.category === category.id ? "active" : ""}" data-category="${category.id}" type="button">
        ${escapeHtml(category.short || category.name)}
      </button>`).join("");

    filters.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => setCategory(button.dataset.category));
    });
  }

  function renderCategoryRail() {
    categoryRail.innerHTML = categories.map((category) => {
      const count = concepts.filter((concept) => concept.category === category.id).length;
      return `<button class="category-link ${state.category === category.id ? "active" : ""}" data-category="${category.id}" type="button">
        ${escapeHtml(category.name)}
        <span>${count} concepts</span>
      </button>`;
    }).join("");
    categoryRail.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => setCategory(button.dataset.category));
    });
  }

  function setCategory(category) {
    state.category = category;
    renderFilters();
    renderCategoryRail();
    renderGrid();
  }

  function getVisibleConcepts() {
    const query = state.query.trim().toLowerCase();
    return concepts.filter((concept) => {
      const categoryMatch = state.category === "all" || concept.category === state.category;
      const haystack = `${concept.acronym} ${concept.name} ${concept.summary} ${concept.tags.join(" ")}`.toLowerCase();
      return categoryMatch && (!query || haystack.includes(query));
    });
  }

  function renderGrid() {
    const visible = getVisibleConcepts();
    if (!visible.length) {
      grid.innerHTML = `<div class="empty-state"><h3>No matching concept</h3><p>Try another acronym, full name or domain.</p></div>`;
      return;
    }
    grid.innerHTML = visible.map((concept) => {
      const category = categories.find((item) => item.id === concept.category);
      return `<button class="concept-card" type="button" data-slug="${concept.slug}" style="--card-accent:${category.color}">
        <span class="arrow" aria-hidden="true">↗</span>
        <p class="acronym">${escapeHtml(concept.acronym)}</p>
        <h3>${escapeHtml(concept.name)}</h3>
        <p>${escapeHtml(concept.summary)}</p>
      </button>`;
    }).join("");
    grid.querySelectorAll(".concept-card").forEach((card) => card.addEventListener("click", () => openConcept(card.dataset.slug)));
  }

  function renderSearchResults() {
    const query = searchInput.value.trim().toLowerCase();
    state.query = query;
    renderGrid();
    if (!query) {
      searchResults.hidden = true;
      searchResults.innerHTML = "";
      return;
    }
    const matches = concepts.filter((concept) => `${concept.acronym} ${concept.name} ${concept.summary} ${concept.tags.join(" ")}`.toLowerCase().includes(query)).slice(0, 7);
    searchResults.hidden = false;
    searchResults.innerHTML = matches.length ? matches.map((concept) => `<button class="search-result" type="button" data-slug="${concept.slug}">
      <b>${escapeHtml(concept.acronym)}</b>
      <span>${escapeHtml(concept.name)}<br><small>${escapeHtml(concept.summary)}</small></span>
    </button>`).join("") : `<div class="empty-state" style="padding:24px">No concept found.</div>`;
    searchResults.querySelectorAll("button").forEach((button) => button.addEventListener("click", () => {
      searchResults.hidden = true;
      openConcept(button.dataset.slug);
    }));
  }

  function openConcept(slug, updateHash = true) {
    const concept = conceptBySlug.get(slug);
    if (!concept) return;
    state.current = concept;
    const category = categories.find((item) => item.id === concept.category);
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
    }

    const related = concept.related.map((relatedSlug) => conceptBySlug.get(relatedSlug)).filter(Boolean);
    document.getElementById("relatedLinks").innerHTML = related.map((item) => `<button type="button" data-slug="${item.slug}">${escapeHtml(item.acronym || item.name)}</button>`).join("");
    document.getElementById("relatedLinks").querySelectorAll("button").forEach((button) => button.addEventListener("click", () => openConcept(button.dataset.slug)));

    if (!dialog.open) dialog.showModal();
    if (updateHash) history.pushState({ concept: slug }, "", `#concept/${slug}`);
  }

  function closeConcept(updateHash = true) {
    state.current = null;
    if (dialog.open) dialog.close();
    if (updateHash && location.hash.startsWith("#concept/")) history.pushState({}, "", location.pathname + location.search);
  }

  function handleHash() {
    const match = location.hash.match(/^#concept\/(.+)$/);
    if (match && conceptBySlug.has(match[1])) openConcept(match[1], false);
    else if (dialog.open) closeConcept(false);
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(showToast.timeout);
    showToast.timeout = window.setTimeout(() => toast.classList.remove("show"), 1800);
  }

  searchInput.addEventListener("input", renderSearchResults);
  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const first = searchResults.querySelector("button");
      if (first) first.click();
    }
    if (event.key === "Escape") {
      searchResults.hidden = true;
      searchInput.blur();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "/" && document.activeElement !== searchInput) {
      event.preventDefault();
      searchInput.focus();
    }
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".search-shell") && !event.target.closest(".search-results")) searchResults.hidden = true;
  });

  document.getElementById("closeDialog").addEventListener("click", () => closeConcept());
  dialog.addEventListener("click", (event) => { if (event.target === dialog) closeConcept(); });
  dialog.addEventListener("cancel", (event) => { event.preventDefault(); closeConcept(); });
  document.getElementById("randomButton").addEventListener("click", () => {
    const concept = concepts[Math.floor(Math.random() * concepts.length)];
    openConcept(concept.slug);
  });
  document.getElementById("nextConcept").addEventListener("click", () => {
    const index = concepts.findIndex((item) => item.slug === state.current?.slug);
    openConcept(concepts[(index + 1) % concepts.length].slug);
  });
  document.getElementById("copyLink").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      showToast("Concept link copied");
    } catch {
      showToast("Copy the URL from your browser");
    }
  });
  window.addEventListener("popstate", handleHash);

  renderFilters();
  renderCategoryRail();
  renderGrid();
  handleHash();
})();
