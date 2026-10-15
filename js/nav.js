(() => {
  const menu = $("#navLinks");
  const toggle = $("#menuToggle");
  const toTop = $("#toTop");

  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });
  menu.addEventListener("click", e => {
    if (e.target.tagName === "A") { menu.classList.remove("open"); toggle.setAttribute("aria-expanded", false); }
  });

  const links = $$("a", menu);
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  $$("main section[id]").forEach(section => observer.observe(section));

  addEventListener("scroll", () => { toTop.hidden = scrollY < 500; });
  toTop.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));
})();
