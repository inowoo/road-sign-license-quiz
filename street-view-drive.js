(function () {
  "use strict";

  const DATA_URLS = {
    routes: "data/routes.json",
    checkpoints: "data/checkpoints.json",
    questions: "data/drive-questions.json"
  };
  const mapsApiKey = String(window.DRIVE_READY_CONFIG?.googleMapsApiKey || "").trim();

  const state = {
    route: null,
    checkpoints: [],
    questions: new Map(),
    checkpointIndex: -1,
    score: 0,
    combo: 0,
    answered: false,
    phase: "loading",
    timer: null
  };

  const elements = {
    routeName: document.getElementById("route-name"),
    routeDescription: document.getElementById("route-description"),
    score: document.getElementById("drive-score"),
    combo: document.getElementById("drive-combo"),
    rank: document.getElementById("drive-rank"),
    progressLabel: document.getElementById("progress-label"),
    progress: document.getElementById("course-progress"),
    status: document.getElementById("drive-status"),
    statusDot: document.getElementById("drive-status-dot"),
    streetViewFrame: document.getElementById("street-view-frame"),
    streetViewLoading: document.getElementById("street-view-loading"),
    sceneKicker: document.getElementById("scene-kicker"),
    sceneTitle: document.getElementById("scene-title"),
    sceneDescription: document.getElementById("scene-description"),
    currentLocation: document.getElementById("current-location"),
    action: document.getElementById("drive-action"),
    mapRoute: document.getElementById("map-route"),
    checkpointBadge: document.getElementById("checkpoint-badge"),
    checkpointList: document.getElementById("checkpoint-list"),
    questionIdle: document.getElementById("question-idle"),
    question: document.getElementById("drive-question"),
    questionType: document.getElementById("question-type"),
    questionPrompt: document.getElementById("drive-question-prompt"),
    options: document.getElementById("drive-options"),
    explanation: document.getElementById("drive-explanation")
  };

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function buildStreetViewUrl(location, heading) {
    const url = new URL("https://www.google.com/maps/embed/v1/streetview");
    url.searchParams.set("key", mapsApiKey);
    url.searchParams.set("location", location.lat + "," + location.lng);
    url.searchParams.set("heading", String(heading || 0));
    url.searchParams.set("pitch", "0");
    url.searchParams.set("fov", "80");
    url.searchParams.set("language", "ja");
    url.searchParams.set("region", "JP");
    url.searchParams.set("source", "outdoor");
    url.searchParams.set("auth_referrer_policy", "origin");
    return url.toString();
  }

  function showStreetView(location, heading, locationName) {
    if (!mapsApiKey) {
      elements.streetViewFrame.hidden = true;
      elements.streetViewLoading.hidden = false;
      elements.streetViewLoading.classList.add("is-setup-required");
      elements.streetViewLoading.innerHTML =
        "<strong>Google Street Viewの設定が必要です</strong>" +
        "<p>Maps Embed APIキーを設定すると、ここに実写パノラマが表示されます。</p>";
      return;
    }

    elements.streetViewLoading.classList.remove("is-setup-required");
    elements.streetViewLoading.innerHTML = "<strong>Google Street Viewを読込中</strong><p>実写パノラマを取得しています。</p>";
    elements.streetViewLoading.hidden = false;
    elements.streetViewFrame.hidden = false;
    elements.streetViewFrame.title = "Google Street View: " + locationName;
    elements.streetViewFrame.src = buildStreetViewUrl(location, heading);
  }

  async function loadJson(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to load " + url);
    }
    return response.json();
  }

  function updateScorebar() {
    const total = state.checkpoints.length || 1;
    const completed = state.phase === "complete"
      ? state.checkpoints.length
      : Math.max(0, state.checkpointIndex + (state.answered ? 1 : 0));
    elements.score.textContent = String(state.score);
    elements.combo.textContent = String(state.combo);
    elements.rank.textContent = state.score >= 330 ? "S" : state.score >= 250 ? "A" : state.score >= 150 ? "B" : "C";
    elements.progressLabel.textContent = completed + " / " + state.checkpoints.length;
    elements.progress.style.width = Math.min(100, (completed / total) * 100) + "%";
  }

  function renderRoute() {
    const route = state.route;
    elements.routeName.textContent = route.name;
    elements.routeDescription.textContent = route.description;
    elements.currentLocation.textContent = route.start.name;
    elements.progressLabel.textContent = "0 / " + state.checkpoints.length;

    elements.checkpointList.innerHTML = state.checkpoints.map((checkpoint) =>
      '<li data-checkpoint-id="' + escapeHtml(checkpoint.id) + '">' +
        '<span class="checkpoint-marker">' + checkpoint.order + "</span>" +
        '<div><strong>' + escapeHtml(checkpoint.name) + '</strong><span>' + escapeHtml(checkpoint.sceneLabel) + "</span></div>" +
      "</li>"
    ).join("");

    const mapStops = [route.start.name, ...state.checkpoints.map((checkpoint) => checkpoint.name)];
    elements.mapRoute.innerHTML = mapStops.map((name, index) =>
      '<div class="map-stop" data-map-index="' + index + '"><span></span><b>' + escapeHtml(name) + "</b></div>"
    ).join("");
  }

  function setPhase(phase) {
    state.phase = phase;
    elements.statusDot.className = "status-dot is-" + phase;
    if (phase === "ready") {
      elements.status.textContent = "出発前";
      elements.checkpointBadge.textContent = "READY";
      elements.action.textContent = "走行開始";
      elements.action.disabled = false;
    } else if (phase === "driving") {
      elements.status.textContent = "走行中";
      elements.checkpointBadge.textContent = "DRIVING";
      elements.action.textContent = "走行中...";
      elements.action.disabled = true;
    } else if (phase === "paused") {
      elements.status.textContent = "問題地点で停止";
      elements.checkpointBadge.textContent = "CHECKPOINT";
      elements.action.textContent = "回答してください";
      elements.action.disabled = true;
    } else if (phase === "review") {
      elements.status.textContent = "解説を確認中";
      elements.checkpointBadge.textContent = "REVIEW";
      elements.action.textContent = state.checkpointIndex === state.checkpoints.length - 1 ? "ゴールへ進む" : "走行を再開";
      elements.action.disabled = false;
    } else if (phase === "complete") {
      elements.status.textContent = "コース完了";
      elements.checkpointBadge.textContent = "FINISH";
      elements.action.textContent = "もう一度走る";
      elements.action.disabled = false;
    }
  }

  function highlightProgress() {
    document.querySelectorAll("[data-checkpoint-id]").forEach((item, index) => {
      item.classList.toggle("is-current", index === state.checkpointIndex);
      item.classList.toggle("is-complete", index < state.checkpointIndex || (index === state.checkpointIndex && state.answered));
    });
    document.querySelectorAll("[data-map-index]").forEach((item, index) => {
      item.classList.toggle("is-active", index <= state.checkpointIndex + 1);
    });
  }

  function startDriving() {
    setPhase("driving");
    elements.questionIdle.hidden = false;
    elements.question.hidden = true;
    elements.sceneKicker.textContent = "AUTO DRIVE";
    const nextCheckpoint = state.checkpoints[state.checkpointIndex + 1];
    elements.sceneTitle.textContent = nextCheckpoint ? nextCheckpoint.name + "へ走行中" : state.route.end.name + "へ走行中";
    elements.sceneDescription.textContent = "周囲の車、歩行者、自転車、標識を広く確認します。";
    window.clearTimeout(state.timer);
    state.timer = window.setTimeout(() => {
      if (nextCheckpoint) {
        arriveAtCheckpoint(state.checkpointIndex + 1);
      } else {
        finishRoute();
      }
    }, 900);
  }

  function arriveAtCheckpoint(index) {
    state.checkpointIndex = index;
    state.answered = false;
    const checkpoint = state.checkpoints[index];
    const question = state.questions.get(checkpoint.questionId);
    elements.currentLocation.textContent = checkpoint.name;
    showStreetView(checkpoint.location, checkpoint.heading, checkpoint.name);
    elements.sceneKicker.textContent = "CHECKPOINT " + checkpoint.order;
    elements.sceneTitle.textContent = checkpoint.sceneLabel;
    elements.sceneDescription.textContent = "安全な位置で停止しました。右の問題に回答してください。";
    elements.questionIdle.hidden = true;
    elements.question.hidden = false;
    elements.questionType.textContent = question.categoryLabel;
    elements.questionPrompt.textContent = question.prompt;
    elements.explanation.hidden = true;
    elements.explanation.innerHTML = "";
    elements.options.innerHTML = question.options.map((option, optionIndex) =>
      '<button type="button" data-option-id="' + escapeHtml(option.id) + '">' +
        '<span>' + String.fromCharCode(65 + optionIndex) + "</span>" + escapeHtml(option.text) +
      "</button>"
    ).join("");
    elements.options.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => answerQuestion(question, button.dataset.optionId));
    });
    setPhase("paused");
    highlightProgress();
    updateScorebar();
  }

  function answerQuestion(question, selectedOptionId) {
    if (state.answered) {
      return;
    }
    state.answered = true;
    const isCorrect = selectedOptionId === question.correctOptionId;
    if (isCorrect) {
      state.combo += 1;
      state.score += 100 + Math.min(50, (state.combo - 1) * 10);
    } else {
      state.combo = 0;
    }

    elements.options.querySelectorAll("button").forEach((button) => {
      button.disabled = true;
      if (button.dataset.optionId === question.correctOptionId) {
        button.classList.add("is-correct");
      } else if (button.dataset.optionId === selectedOptionId) {
        button.classList.add("is-wrong");
      }
    });
    elements.explanation.innerHTML =
      '<strong>' + (isCorrect ? "正解です" : "不正解です") + "</strong>" +
      "<p>" + escapeHtml(question.explanation) + "</p>" +
      '<ul>' + question.tips.map((tip) => "<li>" + escapeHtml(tip) + "</li>").join("") + "</ul>";
    elements.explanation.className = "drive-explanation" + (isCorrect ? "" : " is-wrong");
    elements.explanation.hidden = false;
    setPhase("review");
    highlightProgress();
    updateScorebar();
  }

  function finishRoute() {
    state.checkpointIndex = state.checkpoints.length;
    state.answered = true;
    elements.currentLocation.textContent = state.route.end.name;
    showStreetView(state.route.end, state.route.end.heading || 180, state.route.end.name);
    elements.sceneKicker.textContent = "COURSE COMPLETE";
    elements.sceneTitle.textContent = state.route.end.name + "に到着";
    elements.sceneDescription.textContent = "おつかれさまでした。解説を振り返り、次のドライブへ備えましょう。";
    elements.question.hidden = true;
    elements.questionIdle.hidden = false;
    elements.questionIdle.innerHTML = '<strong>コース完了</strong><p>スコア ' + state.score + "。安全な判断を3つ練習しました。</p>";
    setPhase("complete");
    highlightProgress();
    updateScorebar();
  }

  function resetRoute() {
    window.clearTimeout(state.timer);
    state.checkpointIndex = -1;
    state.score = 0;
    state.combo = 0;
    state.answered = false;
    elements.currentLocation.textContent = state.route.start.name;
    elements.sceneTitle.textContent = state.route.start.name + "からスタート";
    elements.sceneKicker.textContent = "STREET VIEW";
    elements.sceneDescription.textContent = "周囲の車、歩行者、自転車、標識を広く確認します。";
    showStreetView(state.route.start, state.route.start.heading || 180, state.route.start.name);
    elements.question.hidden = true;
    elements.questionIdle.hidden = false;
    elements.questionIdle.innerHTML = "<strong>安全確認をして出発</strong><p>チェックポイントに到着すると、場面に応じた問題が表示されます。</p>";
    setPhase("ready");
    highlightProgress();
    updateScorebar();
  }

  elements.action.addEventListener("click", () => {
    if (state.phase === "ready" || state.phase === "review") {
      startDriving();
    } else if (state.phase === "complete") {
      resetRoute();
    }
  });

  elements.streetViewFrame.addEventListener("load", () => {
    elements.streetViewLoading.hidden = true;
  });

  Promise.all([
    loadJson(DATA_URLS.routes),
    loadJson(DATA_URLS.checkpoints),
    loadJson(DATA_URLS.questions)
  ]).then(([routes, checkpoints, questions]) => {
    state.route = routes[0];
    state.checkpoints = checkpoints
      .filter((checkpoint) => checkpoint.routeId === state.route.id)
      .sort((a, b) => a.order - b.order);
    state.questions = new Map(questions.map((question) => [question.id, question]));
    renderRoute();
    resetRoute();
  }).catch(() => {
    elements.routeName.textContent = "コースデータを読み込めませんでした";
    elements.routeDescription.textContent = "ローカルサーバー経由でページを開いて、もう一度お試しください。";
    elements.action.disabled = true;
    elements.action.textContent = "データ読込エラー";
  });
})();
