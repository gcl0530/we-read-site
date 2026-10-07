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
