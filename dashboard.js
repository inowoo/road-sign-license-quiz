(function () {
  "use strict";

  const QUIZ_STORAGE_KEY = "roadSignQuizProgressV1";
  const signs = window.SIGN_DATA || [];

  if (window.location.hash === "#quiz" || window.location.hash === "#catalog") {
    window.location.replace("quiz.html" + window.location.hash);
    return;
  }

  function readProgress() {
    try {
      const value = JSON.parse(localStorage.getItem(QUIZ_STORAGE_KEY));
      return value && typeof value === "object" ? value : {};
    } catch (error) {
      return {};
    }
  }

  function setText(id, value) {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = String(value);
    }
  }

  function isToday(timestamp) {
    if (!Number.isFinite(timestamp)) {
      return false;
    }
    const date = new Date(timestamp);
    const today = new Date();
    return date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() && date.getDate() === today.getDate();
  }

  const progress = readProgress();
  const stats = progress.stats && typeof progress.stats === "object" ? progress.stats : {};
  const answered = Number.isFinite(progress.answered) ? progress.answered : 0;
  const correct = Number.isFinite(progress.correct) ? progress.correct : 0;
  const bestCombo = Number.isFinite(progress.bestStreak) ? progress.bestStreak : 0;
  const hinted = Object.values(stats).reduce((sum, stat) => sum + (Number.isFinite(stat.hinted) ? stat.hinted : 0), 0);
  const totalXp = correct * 20 + Math.max(0, answered - correct) * 5 + hinted * 2;
  const levelSize = 250;
  const level = Math.floor(totalXp / levelSize) + 1;
  const levelXp = totalXp % levelSize;
  const mastered = signs.filter((sign) => {
    const stat = stats[sign.id];
    return stat && stat.correct >= 2 && (stat.review || 0) === 0;
  }).length;
  const mastery = signs.length ? Math.round((mastered / signs.length) * 100) : 0;
  const rankNames = ["ルーキー", "ビギナー", "セーフティドライバー", "ロードナビゲーター", "ドライブマスター"];
  const rank = rankNames[Math.min(rankNames.length - 1, Math.floor((level - 1) / 3))];
  const todayCount = Object.values(stats).filter((stat) => isToday(stat.lastAnsweredAt)).length;

  setText("rank-name", rank);
  setText("level-number", level);
  setText("xp-current", levelXp);
  setText("xp-next", levelSize);
  setText("total-xp", totalXp + " XP");
  setText("best-combo", bestCombo);
  setText("total-answered", answered);
  setText("sign-mastery", mastery + "%");
  setText("mission-count", Math.min(todayCount, 5) + " / 5");
  document.getElementById("xp-progress").style.width = Math.round((levelXp / levelSize) * 100) + "%";
  document.getElementById("mission-progress").style.width = Math.min(100, (todayCount / 5) * 100) + "%";

  const weakSigns = signs.map((sign) => {
    const stat = stats[sign.id] || {};
    const attempts = (stat.correct || 0) + (stat.wrong || 0);
    const accuracy = attempts ? Math.round(((stat.correct || 0) / attempts) * 100) : null;
    return { sign, attempts, accuracy, priority: (stat.review || 0) * 4 + (stat.wrong || 0) };
  }).filter((item) => item.priority > 0).sort((a, b) => b.priority - a.priority).slice(0, 3);

  const weakList = document.getElementById("weak-list");
  if (weakSigns.length === 0) {
    weakList.innerHTML = '<p class="empty-review">まだ苦手データはありません。標識クイズを解くと、復習候補がここに並びます。</p>';
  } else {
    weakList.innerHTML = weakSigns.map((item) =>
      '<article class="weak-item">' +
        '<img src="assets/signs/' + item.sign.id + '.png" alt="' + item.sign.name + '">' +
        '<div><strong>' + item.sign.name + '</strong><span>出題 ' + item.attempts + '回 / 正解率 ' + item.accuracy + '%</span></div>' +
        '<a href="quiz.html">復習</a>' +
      '</article>'
    ).join("");
  }
})();
