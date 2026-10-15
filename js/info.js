(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  $$(".tab-btn").forEach(button => button.addEventListener("click", () => {
    $$(".tab-btn").forEach(b => {
      b.classList.toggle("active", b === button);
      b.setAttribute("aria-selected", b === button);
    });
    $$(".tab-panel").forEach(panel => { panel.hidden = panel.id !== button.dataset.tab; });
  }));

  const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add("in"); reveal.unobserve(entry.target); }
  }), { threshold: .15 });
  $$(".reveal").forEach(el => reveal.observe(el));

  $$(".filter-btn").forEach(btn => btn.addEventListener("click", () => {
    $$(".filter-btn").forEach(b => b.classList.toggle("active", b === btn));
    const cat = btn.dataset.filter;
    $$(".project").forEach(p => {
      p.hidden = cat !== "all" && p.dataset.category !== cat;
    });
  }));

  if (!reduce) $$(".project").forEach(card => {
    card.addEventListener("mousemove", e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      card.style.transform = `perspective(700px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
    });
    card.addEventListener("mouseleave", () => { card.style.transform = ""; });
  });

  function animateCounters() {
    $$(".stat-number").forEach(el => {
      const target = parseInt(el.dataset.count, 10);
      if (isNaN(target)) return;
      const duration = 1200;
      const start = performance.now();
      function update(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
    });
  }

  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .3 });

  const profileCard = $(".profile-card");
  if (profileCard) counterObserver.observe(profileCard);

  const toTop = $("#toTop");
  if (toTop) {
    addEventListener("scroll", () => { toTop.hidden = scrollY < 500; });
    toTop.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));
  }

  const form = $("#contactForm");
  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      let valid = true;
      const checks = [
        { el: "#cName", msg: "Vui lòng nhập họ tên." },
        { el: "#cEmail", msg: "Email không hợp lệ.", test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
        { el: "#cMessage", msg: "Vui lòng nhập nội dung." }
      ];
      checks.forEach(({ el, msg, test }) => {
        const input = $(el);
        const error = $("small.error", input.closest("label"));
        const val = input.value.trim();
        const ok = test ? test(val) : val.length > 0;
        input.classList.toggle("invalid", !ok);
        if (error) error.textContent = ok ? "" : msg;
        if (!ok) valid = false;
      });
      if (valid) {
        form.reset();
        const ok = $("#formOk");
        if (ok) ok.hidden = false;
      }
    });
  }

  const menu = $("#navLinks");
  if (menu) {
    const links = $$("a", menu);
    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$("main section[id]").forEach(section => navObserver.observe(section));

    const toggle = $("#menuToggle");
    if (toggle) {
      toggle.addEventListener("click", () => {
        const open = menu.classList.toggle("open");
        toggle.setAttribute("aria-expanded", open);
      });
      menu.addEventListener("click", e => {
        if (e.target.tagName === "A") {
          menu.classList.remove("open");
          toggle.setAttribute("aria-expanded", false);
        }
      });
    }
  }
})();
