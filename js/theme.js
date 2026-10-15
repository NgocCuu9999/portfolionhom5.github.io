(() => {
  const root = document.documentElement;
  const button = $("#themeToggle");

  function apply(theme) {
    root.dataset.theme = theme;
    button.textContent = theme === "dark" ? "☾" : "☀";
    try { localStorage.setItem("theme", theme); } catch (e) {}
  }

  let saved = "dark";
  try { saved = localStorage.getItem("theme") || "dark"; } catch (e) {}
  apply(saved);

  button.addEventListener("click", () => apply(root.dataset.theme === "dark" ? "light" : "dark"));
})();
