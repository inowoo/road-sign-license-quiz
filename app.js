(function () {
  "use strict";

  const STORAGE_KEY = "roadSignQuizProgressV1";
  const signs = window.SIGN_DATA;

  const elements = {
    quizView: document.getElementById("quiz-view"),
    catalogView: document.getElementById("catalog-view"),
    navButtons: Array.from(document.querySelectorAll("[data-view]")),
    modeInputs: Array.from(document.querySelectorAll('input[name="quiz-mode"]')),
    questionNumber: document.getElementById("question-number"),
    correctCount: document.getElementById("correct-count"),
    streakCount: document.getElementById("streak-count"),
    masteryRate: document.getElementById("mastery-rate"),
    questionPrompt: document.getElementById("question-prompt"),
    questionVisual: document.getElementById("question-visual"),
    questionDetail: document.getElementById("question-detail"),
    questionHistory: document.getElementById("question-history"),
    hintButton: document.getElementById("hint-button"),
    hintPanel: document.getElementById("hint-panel"),
    answerOptions: document.getElementById("answer-options"),
    feedback: document.getElementById("feedback"),
    nextButton: document.getElementById("next-button"),
    resetButton: document.getElementById("reset-button"),
    resetDialog: document.getElementById("reset-dialog"),
    confirmReset: document.getElementById("confirm-reset"),
    catalogGrid: document.getElementById("catalog-grid"),
    catalogSearch: document.getElementById("catalog-search"),
    catalogCount: document.getElementById("catalog-count"),
    catalogEmpty: document.getElementById("catalog-empty"),
    filterButtons: Array.from(document.querySelectorAll("[data-category]"))
  };

  let progress = loadProgress();
  let currentSign = null;
  let currentOptions = [];
  let lastSignId = null;
  let questionNumber = 1;
  let answered = false;
  let hintUsed = false;
  let activeCategory = "all";

  function defaultProgress() {
    return {
      answered: 0,
      correct: 0,
      streak: 0,
      bestStreak: 0,
      stats: {}
    };
  }

  function loadProgress() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!stored || typeof stored !== "object") {
        return defaultProgress();
      }

      return {
        answered: Number.isFinite(stored.answered) ? stored.answered : 0,
        correct: Number.isFinite(stored.correct) ? stored.correct : 0,
        streak: Number.isFinite(stored.streak) ? stored.streak : 0,
        bestStreak: Number.isFinite(stored.bestStreak) ? stored.bestStreak : 0,
        stats: stored.stats && typeof stored.stats === "object" ? stored.stats : {}
      };
    } catch (error) {
      return defaultProgress();
    }
  }

  function saveProgress() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      // The quiz remains usable when browser storage is unavailable.
    }
  }

  function getSignStat(signId) {
    const stored = progress.stats[signId] || {};
    const correct = Number.isFinite(stored.correct) ? stored.correct : 0;
    const wrong = Number.isFinite(stored.wrong) ? stored.wrong : 0;
    return {
      correct,
      wrong,
      attempts: Number.isFinite(stored.attempts) ? Math.max(stored.attempts, correct + wrong) : correct + wrong,
      hinted: Number.isFinite(stored.hinted) ? stored.hinted : 0,
      review: Number.isFinite(stored.review) ? stored.review : 0,
      lastAnsweredAt: Number.isFinite(stored.lastAnsweredAt) ? stored.lastAnsweredAt : null
    };
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function getMode() {
    const checked = elements.modeInputs.find((input) => input.checked);
    return checked ? checked.value : "sign-to-meaning";
  }

  function shuffle(items) {
    const result = items.slice();
    for (let index = result.length - 1; index > 0; index -= 1) {
      const target = Math.floor(Math.random() * (index + 1));
      [result[index], result[target]] = [result[target], result[index]];
    }
    return result;
  }

  function selectWeightedSign() {
    const candidates = signs.filter((sign) => sign.id !== lastSignId);
    const weighted = candidates.map((sign) => {
      const stat = getSignStat(sign.id);
      return {
        sign,
        weight: 1 + stat.review * 5 + (stat.attempts === 0 ? 2 : 0)
      };
    });
    const total = weighted.reduce((sum, item) => sum + item.weight, 0);
    let pointer = Math.random() * total;

    for (const item of weighted) {
      pointer -= item.weight;
      if (pointer <= 0) {
        return item.sign;
      }
    }
    return weighted[weighted.length - 1].sign;
  }

  function buildOptions(answer) {
    const distractors = shuffle(signs.filter((sign) => sign.id !== answer.id)).slice(0, 3);
    return shuffle([answer, ...distractors]);
  }

  function updateStats() {
    const mastered = signs.filter((sign) => {
      const stat = getSignStat(sign.id);
      return stat.correct >= 2 && stat.review === 0;
    }).length;

    elements.questionNumber.textContent = "第" + questionNumber + "問";
    elements.correctCount.textContent = String(progress.correct);
    elements.streakCount.textContent = String(progress.streak);
    elements.masteryRate.textContent = Math.round((mastered / signs.length) * 100) + "%";
  }

  function renderQuestionHistory() {
    const stat = getSignStat(currentSign.id);
    if (stat.attempts === 0) {
      elements.questionHistory.hidden = true;
      elements.questionHistory.innerHTML = "";
      return;
    }

    const accuracy = Math.round((stat.correct / stat.attempts) * 100);
    elements.questionHistory.innerHTML =
      '<span class="history-label">この標識の過去成績</span>' +
      '<div class="history-values">' +
        '<span>出題 <strong>' + stat.attempts + '回</strong></span>' +
        '<span>正解 <strong>' + stat.correct + '回</strong></span>' +
        '<span>正解率 <strong>' + accuracy + '%</strong></span>' +
      '</div>';
    elements.questionHistory.hidden = false;
  }

  function renderQuestion() {
    const mode = getMode();
    answered = false;
    hintUsed = false;
    currentSign = selectWeightedSign();
    currentOptions = buildOptions(currentSign);
    lastSignId = currentSign.id;

    elements.feedback.hidden = true;
    elements.feedback.classList.remove("is-wrong", "is-hinted");
    elements.feedback.innerHTML = "";
    elements.nextButton.hidden = true;
    elements.answerOptions.innerHTML = "";
    elements.answerOptions.classList.toggle("is-visual", mode === "meaning-to-sign");
    elements.hintPanel.hidden = true;
    elements.hintPanel.innerHTML = "";
    elements.hintButton.hidden = false;
    elements.hintButton.disabled = false;
    elements.hintButton.textContent = "ヒントを見る";

    if (mode === "sign-to-meaning") {
      elements.questionPrompt.textContent = "この標識の意味は？";
      elements.questionVisual.innerHTML = window.createSignMarkup(currentSign, "large");
      elements.questionDetail.textContent = "";
    } else {
      elements.questionPrompt.textContent = "この意味を示す標識は？";
      elements.questionVisual.innerHTML = "";
      elements.questionDetail.textContent = currentSign.meaning;
    }

    renderQuestionHistory();

    const labels = ["A", "B", "C", "D"];
    currentOptions.forEach((option, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "answer-button" + (mode === "meaning-to-sign" ? " visual-answer" : "");
      button.dataset.signId = option.id;

      if (mode === "sign-to-meaning") {
        button.innerHTML = '<span class="answer-index">' + labels[index] + "</span><span>" + option.meaning + "</span>";
      } else {
        button.setAttribute("aria-label", labels[index] + "の標識を選ぶ");
        button.innerHTML = '<span class="answer-index">' + labels[index] + "</span>" +
          window.createSignMarkup(option, "small", true);
      }

      button.addEventListener("click", () => answerQuestion(option.id));
      elements.answerOptions.appendChild(button);
    });

    updateStats();
  }

  function showHint() {
    if (answered || hintUsed) {
      return;
    }
    hintUsed = true;
    elements.hintPanel.innerHTML = "<strong>ヒント</strong><span>" + escapeHtml(currentSign.hint) + "</span>";
    elements.hintPanel.hidden = false;
    elements.hintButton.disabled = true;
    elements.hintButton.textContent = "ヒント表示中";
  }

  function buildFeedback(isCorrect) {
    const result = isCorrect
      ? (hintUsed ? "正解です（ヒント使用）" : "正解です")
      : "不正解です。正しい答え：" + currentSign.name;
    const confusion = currentSign.confusion
      ? '<section class="confusion-note"><h4>似た標識との違い</h4><p>' + escapeHtml(currentSign.confusion) + "</p></section>"
      : "";

    return '<div class="feedback-result"><strong>' + escapeHtml(result) + "</strong></div>" +
      '<div class="feedback-details">' +
        '<p class="feedback-meta">' + escapeHtml(currentSign.category) + " / " + escapeHtml(currentSign.number) + "</p>" +
        "<h3>" + escapeHtml(currentSign.name) + "</h3>" +
        '<p class="feedback-meaning">' + escapeHtml(currentSign.meaning) + "。</p>" +
        '<section><h4>覚えるポイント</h4><p>' + escapeHtml(currentSign.explanation) + "</p></section>" +
        '<section><h4>詳しく</h4><p>' + escapeHtml(currentSign.detail) + "</p></section>" +
        confusion +
      "</div>";
  }

  function answerQuestion(selectedId) {
    if (answered) {
      return;
    }
    answered = true;
    const isCorrect = selectedId === currentSign.id;
    const stat = getSignStat(currentSign.id);

    progress.answered += 1;
    stat.attempts += 1;
    if (hintUsed) {
      stat.hinted += 1;
    }
    if (isCorrect) {
      progress.correct += 1;
      progress.streak += 1;
      progress.bestStreak = Math.max(progress.bestStreak, progress.streak);
      stat.correct += 1;
      stat.review = hintUsed ? stat.review + 1 : Math.max(0, stat.review - 1);
    } else {
      progress.streak = 0;
      stat.wrong += 1;
      stat.review += 2;
    }
    stat.lastAnsweredAt = Date.now();
    progress.stats[currentSign.id] = stat;
    saveProgress();

    const buttons = Array.from(elements.answerOptions.querySelectorAll(".answer-button"));
    buttons.forEach((button) => {
      button.disabled = true;
      if (button.dataset.signId === currentSign.id) {
        button.classList.add("is-correct");
      } else if (button.dataset.signId === selectedId) {
        button.classList.add("is-wrong");
      }
    });

    if (!isCorrect) {
      elements.feedback.classList.add("is-wrong");
    } else if (hintUsed) {
      elements.feedback.classList.add("is-hinted");
    }
    elements.feedback.innerHTML = buildFeedback(isCorrect);

    elements.feedback.hidden = false;
    elements.hintButton.hidden = true;
    elements.nextButton.hidden = false;
    elements.nextButton.focus({ preventScroll: true });
    renderQuestionHistory();
    updateStats();
  }

  function nextQuestion() {
    questionNumber += 1;
    renderQuestion();
    elements.questionPrompt.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function setView(view) {
    const showCatalog = view === "catalog";
    elements.quizView.hidden = showCatalog;
    elements.catalogView.hidden = !showCatalog;
    elements.quizView.classList.toggle("is-active", !showCatalog);
    elements.catalogView.classList.toggle("is-active", showCatalog);

    elements.navButtons.forEach((button) => {
      const active = button.dataset.view === view;
      button.classList.toggle("is-active", active);
      if (active) {
        button.setAttribute("aria-current", "page");
      } else {
        button.removeAttribute("aria-current");
      }
    });

    if (window.location.hash !== "#" + view) {
      history.replaceState(null, "", "#" + view);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderCatalog() {
    const query = elements.catalogSearch.value.trim().toLocaleLowerCase("ja");
    const filtered = signs.filter((sign) => {
      const categoryMatch = activeCategory === "all" || sign.category === activeCategory;
      const text = [sign.name, sign.meaning, sign.explanation, sign.detail, sign.confusion, sign.number]
        .join(" ").toLocaleLowerCase("ja");
      return categoryMatch && (!query || text.includes(query));
    });

    elements.catalogCount.textContent = String(filtered.length);
    elements.catalogEmpty.hidden = filtered.length !== 0;
    elements.catalogGrid.innerHTML = filtered.map((sign) => (
      '<article class="catalog-card">' +
        '<div class="catalog-sign">' + window.createSignMarkup(sign, "medium") + "</div>" +
        '<div class="catalog-copy">' +
          '<p class="catalog-meta">' + sign.category + " / " + sign.number + "</p>" +
          "<h2>" + sign.name + "</h2>" +
          "<p>" + sign.meaning + "。</p>" +
        "</div>" +
      "</article>"
    )).join("");
  }

  function resetLearning() {
    progress = defaultProgress();
    questionNumber = 1;
    lastSignId = null;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      // Nothing else is required when storage is unavailable.
    }
    renderQuestion();
  }

  elements.nextButton.addEventListener("click", nextQuestion);
  elements.hintButton.addEventListener("click", showHint);
  elements.modeInputs.forEach((input) => {
    input.addEventListener("change", () => {
      lastSignId = null;
      renderQuestion();
    });
  });

  elements.navButtons.forEach((button) => {
    button.addEventListener("click", () => setView(button.dataset.view));
  });

  elements.resetButton.addEventListener("click", () => {
    if (typeof elements.resetDialog.showModal === "function") {
      elements.resetDialog.showModal();
    } else if (window.confirm("学習履歴をリセットしますか？")) {
      resetLearning();
    }
  });

  elements.confirmReset.addEventListener("click", resetLearning);
  elements.catalogSearch.addEventListener("input", renderCatalog);
  elements.filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.category;
      elements.filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
      renderCatalog();
    });
  });

  document.addEventListener("keydown", (event) => {
    if (!elements.quizView.hidden && !answered && /^[1-4]$/.test(event.key)) {
      const option = currentOptions[Number(event.key) - 1];
      if (option) {
        answerQuestion(option.id);
      }
    } else if (!elements.quizView.hidden && answered && event.key === "Enter") {
      nextQuestion();
    }
  });

  window.addEventListener("hashchange", () => {
    setView(window.location.hash === "#catalog" ? "catalog" : "quiz");
  });

  renderQuestion();
  renderCatalog();
  setView(window.location.hash === "#catalog" ? "catalog" : "quiz");

  window.__roadSignQuiz = {
    storageKey: STORAGE_KEY,
    getProgress: () => JSON.parse(JSON.stringify(progress)),
    getCurrentSign: () => currentSign,
    showHint,
    nextQuestion
  };
})();
