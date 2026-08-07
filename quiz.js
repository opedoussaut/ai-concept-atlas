/**
 * The Dojo — a one-shot quiz over the atlas, graded as a judo belt.
 *
 * WHY QUESTIONS ARE GENERATED, NOT WRITTEN. The atlas already states, in
 * machine-readable form, what every concept is called, which domain it sits
 * in, what it relates to, which mathematics it rests on and how. A written
 * question bank would restate all of that in a second place and start rotting
 * the moment a concept changed — the same failure the reverse mathematics
 * index (`usedByMath`) and the French overlay are both designed to avoid.
 * Generating from the data means the quiz cannot contradict the atlas, is
 * bilingual for free because the data it reads is already localized, and
 * grows by itself when a concept is added.
 *
 * NOTHING IS STORED. No score, no progress, no registration, no localStorage.
 * A run lives in memory and dies with the page, which is the honest reading of
 * the footer's promise and the reason there is no leaderboard to game.
 *
 * DISTRACTORS ARE THE WHOLE DIFFICULTY. A wrong option that is *also* right
 * makes a question unanswerable, and one that is obviously absurd makes it
 * free. Every generator below therefore excludes the true answer set — not
 * just the answer — and draws its distractors from the same population as the
 * answer, so a domain question offers four domains and a mathematics question
 * offers four pieces of mathematics.
 */
window.ATLAS_QUIZ = (() => {
  "use strict";

  /* ================================================================= */
  /* Belts                                                              */
  /*                                                                    */
  /* The kyu ladder, then black. `gated` belts need the 100-question    */
  /* run: without that, a lucky streak on ten questions would award a   */
  /* brown belt, and the top of the ladder would mean nothing.          */
  /* ================================================================= */

  /**
   * `kyu` counts DOWN as you improve, which is genuinely how it works: a
   * beginner is 6th kyu and the grade immediately below black is 1st kyu.
   * Getting this backwards is the most common mistake in belt systems built
   * by people who have not trained, so it is written out explicitly rather
   * than derived from the array index.
   *
   * `obi` is the belt itself — 帯 — and the kanji is the colour plus 帯.
   */
  const BELTS = [
    { id: "white",  min: 0,  kyu: 6, kanji: "白帯", romaji: "Shiro-obi",  colour: "#eceff1", ink: "#11202f", gated: false },
    { id: "yellow", min: 40, kyu: 5, kanji: "黄帯", romaji: "Ki-obi",     colour: "#f4d03f", ink: "#11202f", gated: false },
    { id: "orange", min: 55, kyu: 4, kanji: "橙帯", romaji: "Daidai-obi", colour: "#e8873a", ink: "#11202f", gated: false },
    { id: "green",  min: 68, kyu: 3, kanji: "緑帯", romaji: "Midori-obi", colour: "#2fa96b", ink: "#04140c", gated: false },
    { id: "blue",   min: 78, kyu: 2, kanji: "青帯", romaji: "Ao-obi",     colour: "#2e86de", ink: "#04121f", gated: false },
    { id: "brown",  min: 86, kyu: 1, kanji: "茶帯", romaji: "Cha-obi",    colour: "#7b4b2a", ink: "#f6ece5", gated: true  },
    { id: "black",  min: 94, kyu: 0, kanji: "黒帯", romaji: "Kuro-obi",   colour: "#15181c", ink: "#f2f5f8", gated: true  }
  ];

  const FULL_LENGTH = 100;
  const LENGTHS = [10, 25, 50, 100];

  /**
   * The ten dan grades. 1–5 wear black, 6–8 the red-and-white kōhaku obi,
   * 9–10 red.
   *
   * `dropped` is how many questions you may get WRONG and still hold the
   * grade, not a percentage. That is not a stylistic choice — over 25
   * questions a percentage can only land on multiples of four, which left
   * Hachidan at 93% unreachable: 92 gave Nanadan and the next attainable
   * score, 96, was already Kudan. An unearnable grade is invisible in play
   * and would never have been reported.
   *
   * Ten mistake counts for ten grades is exact by construction, and it is
   * how a grading is actually spoken about — you dropped three.
   */
  const DANS = [
    { rank: 1,  dropped: 9, name: "Shodan",   kanji: "初段",   style: "black" },
    { rank: 2,  dropped: 8, name: "Nidan",    kanji: "二段",   style: "black" },
    { rank: 3,  dropped: 7, name: "Sandan",   kanji: "三段",   style: "black" },
    { rank: 4,  dropped: 6, name: "Yondan",   kanji: "四段",   style: "black" },
    { rank: 5,  dropped: 5, name: "Godan",    kanji: "五段",   style: "black" },
    { rank: 6,  dropped: 4, name: "Rokudan",  kanji: "六段",   style: "kohaku" },
    { rank: 7,  dropped: 3, name: "Nanadan",  kanji: "七段",   style: "kohaku" },
    { rank: 8,  dropped: 2, name: "Hachidan", kanji: "八段",   style: "kohaku" },
    { rank: 9,  dropped: 1, name: "Kudan",    kanji: "九段",   style: "red" },
    { rank: 10, dropped: 0, name: "Judan",    kanji: "十段",   style: "red" }
  ];

  /* Shodan is 初段, "first dan", not 一段 — the first rank has its own word.
     A generated "1st dan" label would be wrong in a way a judoka would spot
     immediately, which is the whole reason the kanji is stored per grade
     rather than composed from the number. */

  const DAN_LENGTH = 25;

  /** Highest belt earned at this score, respecting the length gate. */
  function beltFor(percent, total) {
    let earned = BELTS[0];
    for (const belt of BELTS) {
      if (percent >= belt.min && (!belt.gated || total >= FULL_LENGTH)) earned = belt;
    }
    return earned;
  }

  /**
   * The dan grade for a number of wrong answers, or null.
   *
   * A failed challenge is not a demotion — the black belt already earned
   * stands, and you may try again. Ten or more dropped means no dan.
   */
  function danFor(wrong) {
    let earned = null;
    for (const dan of DANS) if (wrong <= dan.dropped) earned = dan;
    return earned;
  }

  /* ================================================================= */
  /* Randomness                                                         */
  /* ================================================================= */

  const shuffle = (list) => {
    const copy = list.slice();
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  const sample = (list) => list[Math.floor(Math.random() * list.length)];

  /** n items from `list`, skipping anything whose key is in `taken`. */
  function distractors(list, n, keyOf, taken) {
    const pool = list.filter((item) => !taken.has(keyOf(item)));
    return shuffle(pool).slice(0, n);
  }

  /* ================================================================= */
  /* Question generators                                                */
  /*                                                                    */
  /* Each returns a question or null when the data cannot support one   */
  /* (a concept with no relations, a branch with too few members). A    */
  /* null is not an error: the caller simply draws again.               */
  /* ================================================================= */

  function build(data, t) {
    const { concepts, categories, mathConcepts, mathCategories, usedByMath,
            categoryOf, mathCategoryOf, relationLabel } = data;

    const withRelated = concepts.filter((c) => (c.related ?? []).length);
    const withFoundations = concepts.filter((c) => (c.mathFoundations ?? []).length);
    const withPrereqs = mathConcepts.filter((m) => (m.prerequisites ?? []).length);
    const bySlug = new Map(concepts.map((c) => [c.slug, c]));
    const mathBySlug = new Map(mathConcepts.map((m) => [m.slug, m]));

    /** Four options, shuffled, with the index of the correct one. */
    const options = (answer, wrong) => {
      const all = shuffle([answer, ...wrong]);
      return { options: all, answer: all.indexOf(answer) };
    };

    const GENERATORS = [
      /* --- Acronym ⇄ name -------------------------------------------- */
      { hard: false, make: () => {
        const c = sample(concepts);
        const wrong = distractors(concepts, 3, (x) => x.slug, new Set([c.slug]));
        if (wrong.length < 3) return null;
        return { subject: c.slug, prompt: t("qAcronym", { token: c.acronym }),
                 ...options(c.name, wrong.map((x) => x.name)) };
      }},

      { hard: false, make: () => {
        const c = sample(concepts);
        const wrong = distractors(concepts, 3, (x) => x.acronym, new Set([c.acronym]));
        if (wrong.length < 3) return null;
        return { subject: c.slug, prompt: t("qName", { name: c.name }),
                 ...options(c.acronym, wrong.map((x) => x.acronym)) };
      }},

      /* --- Summary → concept ----------------------------------------- */
      { hard: false, make: () => {
        const c = sample(concepts);
        const wrong = distractors(concepts, 3, (x) => x.slug, new Set([c.slug]));
        if (wrong.length < 3) return null;
        return { subject: c.slug, prompt: t("qSummary", { summary: c.summary }),
                 ...options(c.name, wrong.map((x) => x.name)) };
      }},

      /* --- Concept → domain ------------------------------------------ */
      { hard: false, make: () => {
        const c = sample(concepts);
        const home = categoryOf(c);
        const wrong = distractors(categories, 3, (x) => x.id, new Set([home.id]));
        if (wrong.length < 3) return null;
        return { subject: c.slug, prompt: t("qDomain", { name: c.name }),
                 ...options(home.name, wrong.map((x) => x.name)) };
      }},

      /* --- Odd one out, by domain ------------------------------------ */
      { hard: false, make: () => {
        const home = sample(categories);
        const inside = concepts.filter((c) => c.category === home.id);
        const outside = concepts.filter((c) => c.category !== home.id);
        if (inside.length < 3 || !outside.length) return null;
        const odd = sample(outside);
        return { subject: `domain:${home.id}`, prompt: t("qOddOne", { domain: home.name }),
                 ...options(odd.name, shuffle(inside).slice(0, 3).map((c) => c.name)) };
      }},

      /* --- Symbol ⇄ mathematics -------------------------------------- */
      { hard: false, make: () => {
        const m = sample(mathConcepts);
        const wrong = distractors(mathConcepts, 3, (x) => x.slug, new Set([m.slug]));
        if (wrong.length < 3) return null;
        return { subject: `math:${m.slug}`, prompt: t("qSymbol", { symbol: m.symbol }),
                 ...options(m.name, wrong.map((x) => x.name)) };
      }},

      { hard: false, make: () => {
        const m = sample(mathConcepts);
        const wrong = distractors(mathConcepts, 3, (x) => x.symbol, new Set([m.symbol]));
        if (wrong.length < 3) return null;
        return { subject: `math:${m.slug}`, prompt: t("qMathName", { name: m.name }),
                 ...options(m.symbol, wrong.map((x) => x.symbol)) };
      }},

      /* --- Mathematics → branch -------------------------------------- */
      { hard: false, make: () => {
        const m = sample(mathConcepts);
        const branch = mathCategoryOf(m);
        const wrong = distractors(mathCategories, 3, (x) => x.id, new Set([branch.id]));
        if (wrong.length < 3) return null;
        return { subject: `math:${m.slug}`, prompt: t("qBranch", { name: m.name }),
                 ...options(branch.name, wrong.map((x) => x.name)) };
      }},

      /* --- Mathematics summary → concept ------------------------------ */
      { hard: false, make: () => {
        const m = sample(mathConcepts);
        const wrong = distractors(mathConcepts, 3, (x) => x.slug, new Set([m.slug]));
        if (wrong.length < 3) return null;
        return { subject: `math:${m.slug}`, prompt: t("qMathSummary", { summary: m.summary }),
                 ...options(m.name, wrong.map((x) => x.name)) };
      }},

      /* --- Related concepts (hard) ------------------------------------
         The excluded set is every relation the concept declares, not just
         the one being asked about — otherwise a second genuine neighbour
         could appear as a distractor and the question would have two
         correct answers. */
      { hard: true, hardest: true, make: () => {
        if (!withRelated.length) return null;
        const c = sample(withRelated);
        const related = (c.related ?? []).map((s) => bySlug.get(s)).filter(Boolean);
        if (!related.length) return null;
        const answer = sample(related);
        const taken = new Set([c.slug, ...(c.related ?? [])]);
        const wrong = distractors(concepts, 3, (x) => x.slug, taken);
        if (wrong.length < 3) return null;
        return { subject: c.slug, prompt: t("qRelated", { name: c.name }),
                 ...options(answer.name, wrong.map((x) => x.name)) };
      }},

      /* --- Mathematical foundations (hard) ---------------------------- */
      { hard: true, hardest: true, make: () => {
        if (!withFoundations.length) return null;
        const c = sample(withFoundations);
        const links = (c.mathFoundations ?? []).map((l) => mathBySlug.get(l.slug)).filter(Boolean);
        if (!links.length) return null;
        const answer = sample(links);
        const taken = new Set((c.mathFoundations ?? []).map((l) => l.slug));
        const wrong = distractors(mathConcepts, 3, (x) => x.slug, taken);
        if (wrong.length < 3) return null;
        return { subject: c.slug, prompt: t("qFoundation", { name: c.name }),
                 ...options(answer.name, wrong.map((x) => x.name)) };
      }},

      /* --- Which AI concept rests on this mathematics (hard) ---------- */
      { hard: true, hardest: true, make: () => {
        const m = sample(mathConcepts);
        const users = (usedByMath.get(m.slug) ?? []).filter((u) => u.importance === "primary");
        if (!users.length) return null;
        const answer = sample(users).concept;
        const taken = new Set((usedByMath.get(m.slug) ?? []).map((u) => u.concept.slug));
        const wrong = distractors(concepts, 3, (x) => x.slug, taken);
        if (wrong.length < 3) return null;
        return { subject: `math:${m.slug}`, prompt: t("qUsedBy", { name: m.name }),
                 ...options(answer.name, wrong.map((x) => x.name)) };
      }},

      /* --- Prerequisites (hard) --------------------------------------- */
      { hard: true, hardest: true, make: () => {
        if (!withPrereqs.length) return null;
        const m = sample(withPrereqs);
        const prereqs = (m.prerequisites ?? []).map((s) => mathBySlug.get(s)).filter(Boolean);
        if (!prereqs.length) return null;
        const answer = sample(prereqs);
        const taken = new Set([m.slug, ...(m.prerequisites ?? []), ...(m.related ?? [])]);
        const wrong = distractors(mathConcepts, 3, (x) => x.slug, taken);
        if (wrong.length < 3) return null;
        return { subject: `math:${m.slug}`, prompt: t("qPrereq", { name: m.name }),
                 ...options(answer.name, wrong.map((x) => x.name)) };
      }},

      /* --- Relation verb (hard) ---------------------------------------
         The atlas stores the verb on the mathematics concept, so the answer
         is well defined; distractors are other verbs actually in use. */
      { hard: true, hardest: true, make: () => {
        if (!withFoundations.length) return null;
        const c = sample(withFoundations);
        const link = sample(c.mathFoundations ?? []);
        const m = mathBySlug.get(link?.slug);
        if (!m) return null;
        const verb = link.relation ?? m.relation;
        const others = [...new Set(mathConcepts.map((x) => x.relation))].filter((v) => v !== verb);
        if (others.length < 3) return null;
        return { subject: c.slug, prompt: t("qRelation", { concept: c.name, math: m.name }),
                 ...options(relationLabel(verb), shuffle(others).slice(0, 3).map(relationLabel)) };
      }},

      /* --- Mathematical intensity (hard, but only three options) ------ */
      { hard: true, hardest: false, make: () => {
        const scored = concepts.filter((c) => c.mathIntensity);
        if (!scored.length) return null;
        const c = sample(scored);
        const levels = ["high", "medium", "low"];
        const wrong = levels.filter((l) => l !== c.mathIntensity);
        if (wrong.length < 2) return null;
        // Only three levels exist, so this question has three options by
        // nature. Padding it to four would mean inventing a level.
        const all = shuffle([c.mathIntensity, ...wrong]).map((l) => t(`intensity${l[0].toUpperCase()}${l.slice(1)}`));
        return { subject: c.slug, prompt: t("qIntensity", { name: c.name }),
                 options: all,
                 answer: all.indexOf(t(`intensity${c.mathIntensity[0].toUpperCase()}${c.mathIntensity.slice(1)}`)) };
      }},

      /* --- Difficulty of a mathematics page (hard) -------------------- */
      { hard: true, hardest: true, make: () => {
        const level = sample(["introductory", "intermediate", "advanced"]);
        const inside = mathConcepts.filter((m) => m.difficulty === level);
        const outside = mathConcepts.filter((m) => m.difficulty !== level);
        if (!inside.length || outside.length < 3) return null;
        const answer = sample(inside);
        return { subject: `level:${level}`, prompt: t("qDifficulty", { level: t(`difficulty${level[0].toUpperCase()}${level.slice(1)}`) }),
                 ...options(answer.name, shuffle(outside).slice(0, 3).map((m) => m.name)) };
      }}
    ];

    /**
     * Draw `count` distinct questions.
     *
     * Two things are being balanced here, and getting either wrong is visible
     * to the player.
     *
     * NO SUBJECT IS ASKED ABOUT TWICE. Deduplicating identical questions is
     * not enough: being asked what LoRA stands for and then which domain LoRA
     * belongs to reads as repetition even though the two questions share no
     * text at all. Every generator declares the concept its question is about,
     * and a run refuses a subject it has already used. With 125 concepts plus
     * the domain and difficulty subjects there is room for a hundred distinct
     * ones, so even the longest run never revisits a topic.
     *
     * DEDUPLICATION is also on the prompt *and* the options together, not the
     * prompt alone. Some generators have very few possible prompts — there
     * are only eight domains, so "which of these does not belong to X" can
     * phrase itself eight ways — and deduplicating on the prompt alone threw
     * away every one of those after the first, starving a pool that is
     * otherwise four figures deep. Two questions that differ in their options
     * are genuinely different questions.
     *
     * A PER-TYPE CAP stops one generator dominating. Drawing uniformly from
     * sixteen generators sounds fair, but the cheap ones never run out of
     * material while the narrow ones do, so an uncapped run drifts toward
     * acronym questions. No single type may exceed a quarter of a run, which
     * is what makes a hundred questions feel varied rather than long.
     *
     * The attempt ceiling stops an unusual data set from spinning forever.
     * Falling a few short is better than hanging, and the grade is a
     * percentage, so a short run still scores correctly.
     */
    function draw(count, { hardOnly = false, hardestOnly = false } = {}) {
      const pool = hardestOnly ? GENERATORS.filter((g) => g.hardest)
        : hardOnly ? GENERATORS.filter((g) => g.hard)
        : GENERATORS;
      const perType = Math.max(2, Math.ceil(count / 4));
      const used = new Map();
      const seen = new Set();
      const subjects = new Set();
      const out = [];
      let attempts = 0;
      const ceiling = count * 80;

      while (out.length < count && attempts < ceiling) {
        attempts += 1;
        const index = Math.floor(Math.random() * pool.length);
        // Relax the cap once attempts run long, so a narrow data set degrades
        // into a valid short quiz rather than an empty one.
        const relaxed = attempts > ceiling * 0.6;
        if (!relaxed && (used.get(index) ?? 0) >= perType) continue;

        const question = pool[index].make();
        if (!question) continue;
        // A generator that produced duplicate options would make the question
        // ambiguous or trivially guessable; drop it rather than show it.
        if (new Set(question.options).size !== question.options.length) continue;

        const key = `${question.prompt} ${question.options.slice().sort().join("|")}`;
        if (seen.has(key)) continue;

        // Relaxing the subject rule is a last resort and only once the attempt
        // budget is nearly spent: a run that repeats a topic still beats one
        // that comes up short of the length the reader actually chose.
        if (!relaxed && question.subject && subjects.has(question.subject)) continue;

        seen.add(key);
        if (question.subject) subjects.add(question.subject);
        used.set(index, (used.get(index) ?? 0) + 1);
        out.push(question);
      }
      return shuffle(out);
    }

    return { draw };
  }

  return { BELTS, DANS, LENGTHS, FULL_LENGTH, DAN_LENGTH, beltFor, danFor, build, shuffle };
})();
