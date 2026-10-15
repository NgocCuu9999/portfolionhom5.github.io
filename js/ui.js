(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const roles = ["Sinh viên Công nghệ thông tin", "Web Developer", "Người yêu vũ trụ"];
  const typing = $("#typing");
  let role = 0, count = 0, deleting = false;

  function type() {
    const word = roles[role];
    typing.textContent = word.slice(0, count);
    if (!deleting && count === word.length) { deleting = true; return setTimeout(type, 1500); }
    if (deleting && count === 0) { deleting = false; role = (role + 1) % roles.length; }
    count += deleting ? -1 : 1;
    setTimeout(type, deleting ? 40 : 80);
  }
  if (reduce) typing.textContent = roles[0]; else type();

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

  if (!reduce) $$(".project").forEach(card => {
    card.addEventListener("mousemove", e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      card.style.transform = `perspective(700px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
    });
    card.addEventListener("mouseleave", () => { card.style.transform = ""; });
  });
})();
