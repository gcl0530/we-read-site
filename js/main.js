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
  function renderNotes(notes) {
    var host = document.getElementById("notes-block");
    if (!host || !notes || !notes.length) return;
    var html = "";
    for (var w = 0; w < notes.length; w++) {
      var wk = notes[w];
      html += '<div class="nt-week"><div class="nt-week-head"><b>' + esc(wk.week_start) + "</b><span>" +
        wk.count + " 篇</span></div>";
      for (var i = 0; i < wk.items.length; i++) {
        var a = wk.items[i];
        html += '<article class="nt-card">' +
          '<div class="nt-meta">' + esc(a.biz_name) + " · " + tagHtml(a.tag) + "</div>" +
          '<h4 class="nt-title">' + esc(a.title) + "</h4>";
        if (a.summary) html += '<p class="nt-summary">' + esc(a.summary) + "</p>";
        if (a.notes && a.notes.length) {
          html += '<ul class="nt-list">';
          for (var j = 0; j < a.notes.length; j++) {
            var n = a.notes[j];
            html += "<li>" + tagHtml(n.type) + '<span class="nt-text">' + esc(n.text) + "</span></li>";
          }
          html += "</ul>";
        }
        html += "</article>";
      }
      html += "</div>";
    }
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
        if (d.recent_notes) renderNotes(d.recent_notes);
        if (d.principles) renderPrinciples(d.principles);
        renderCap(d.generated_at);
      })
      .catch(function () { /* 静态内容兜底,静默 */ });
  });
})();
