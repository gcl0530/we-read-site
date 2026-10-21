/* WE_READ 展示站 — 主题切换 + 首屏防闪烁 */
(function () {
  "use strict";
  var KEY = "wr-site-theme";
  // 首屏防闪烁:读 localStorage / 系统偏好,立即设主题(放在 <head> 中同步执行)
  try {
    var saved = localStorage.getItem(KEY);
    var theme = saved === "dark" || saved === "light"
      ? saved
      : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "light");
  }
  document.addEventListener("DOMContentLoaded", function () {
    var btn = document.getElementById("theme-toggle");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var cur = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", cur);
      try { localStorage.setItem(KEY, cur); } catch (e) {}
    });
  });
})();

/* ---------- 数据成果站:从 data/data.json 渲染最新值 ---------- */
(function () {
  "use strict";
  function fmt(n) {
    return Number(n).toLocaleString("zh-CN");
  }
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  var TAG_COLOR = { "道法": "var(--accent)", "陪伴": "#b45309", "术器": "#2563eb", "OPC": "#7c3aed" };
  function tagHtml(tag) {
    var c = TAG_COLOR[tag] || "var(--ink-4)";
    return '<span class="nt-tag" style="color:' + c + ';border-color:' + c + '33">' + esc(tag) + "</span>";
  }
  function renderStats(stats) {
    var map = {
      articles: stats.articles, bizs: stats.bizs, annotated: stats.annotated,
      note_items: stats.note_items, archived: stats.archived
    };
    var els = document.querySelectorAll(".stat b[data-key]");
    for (var i = 0; i < els.length; i++) {
      var k = els[i].getAttribute("data-key");
      if (map[k] != null) els[i].textContent = fmt(map[k]);
    }
  }
  function renderPicks(picks) {
    var host = document.getElementById("picks-block");
    if (!host || !picks || !picks.length) return;
    var html = "";
    for (var w = 0; w < picks.length; w++) {
      var wk = picks[w];
      html += '<div class="nt-week"><div class="nt-week-head"><b>' + esc(wk.week_start) + " 周</b><span>自动精选 Top " +
        wk.picks.length + " · 按批注质量评分（金句 / 强逻辑 / 新认知含量）</span></div>";
      for (var i = 0; i < wk.picks.length; i++) {
        var a = wk.picks[i];
        var link = a.link ? ' href="' + esc(a.link) + '" target="_blank" rel="noopener"' : "";
        html += '<article class="nt-card pk-card">' +
          '<div class="pk-top"><b class="pk-rank">' + String(i + 1).padStart(2, "0") + "</b>" +
          '<div class="pk-main"><div class="nt-meta">' + esc(a.biz_name) + " · " + tagHtml(a.tag) + "</div>" +
          '<h4 class="nt-title"><a' + link + ">" + esc(a.title) + "</a></h4></div></div>";
        if (a.summary) {
          var sum = a.summary.length > 240 ? a.summary.slice(0, 240) + "…" : a.summary;
          html += '<p class="nt-summary">' + esc(sum) + "</p>";
        }
        if (a.notes && a.notes.length) {
          html += '<details class="pk-more"><summary>展开 ' + a.notes.length + " 条批注</summary><ul class=\"nt-list\">";
          for (var j = 0; j < a.notes.length; j++) {
            var n = a.notes[j];
            html += "<li>" + tagHtml(n.type) + '<span class="nt-text">' + esc(n.text) + "</span></li>";
          }
          html += "</ul></details>";
        }
        html += "</article>";
      }
      html += "</div>";
    }
    host.innerHTML = html;
    host.classList.add("rendered");
  }
  function renderHomePicks(picks) {
    var host = document.getElementById("home-picks");
    if (!host || !picks || !picks.length) return;
    var wk = picks[0];
    if (!wk || !wk.picks || !wk.picks.length) return;
    var html = '<p class="section-lead">' + esc(wk.week_start) + " 周自动精选 · 按批注质量评分取 Top 3 — <a href=\"data.html\">全部精选 →</a></p><div class=\"hp-grid\">";
    var top = Math.min(3, wk.picks.length);
    for (var i = 0; i < top; i++) {
      var a = wk.picks[i];
      var link = a.link ? ' href="' + esc(a.link) + '" target="_blank" rel="noopener"' : "";
      html += '<article class="hp-card"><div class="nt-meta">' + esc(a.biz_name) + " · " + tagHtml(a.tag) + "</div>" +
        "<h3><a" + link + ">" + esc(a.title) + "</a></h3>" +
        (a.summary ? "<p>" + esc(a.summary.slice(0, 120)) + (a.summary.length > 120 ? "…" : "") + "</p>" : "") +
        "</article>";
    }
    html += "</div>";
    host.innerHTML = html;
    host.classList.add("rendered");
  }
  function renderPrinciples(principles) {
    var host = document.getElementById("principles-block");
    if (!host || !principles || !principles.length) return;
    var html = "";
    for (var i = 0; i < principles.length; i++) {
      var p = principles[i];
      html += '<div class="p-card"><b class="p-num">' + String(i + 1).padStart(2, "0") + "</b>" +
        '<div class="p-body"><h4>' + esc(p.text) + "</h4>" +
        (p.note ? "<p>" + esc(p.note) + "</p>" : "") +
        (p.source ? '<span class="p-src">' + esc(p.source) + "</span>" : "") +
        "</div></div>";
    }
    host.innerHTML = html;
    host.classList.add("rendered");
  }
  function renderCap(cap) {
    var el = document.getElementById("sync-cap");
    if (el && cap) el.textContent = "（数据自动同步 · " + cap + "）";
  }
  document.addEventListener("DOMContentLoaded", function () {
    fetch("data/data.json", { cache: "no-store" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        if (!d) return;
        if (d.stats) renderStats(d.stats);
        if (d.weekly_picks) { renderPicks(d.weekly_picks); renderHomePicks(d.weekly_picks); }
        if (d.principles) renderPrinciples(d.principles);
        renderCap(d.generated_at);
      })
      .catch(function () { /* 静态内容兜底,静默 */ });
  });
})();
