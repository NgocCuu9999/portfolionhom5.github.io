(() => {
  const cards = $$(".project");

  $$(".filter-btn").forEach(button => button.addEventListener("click", () => {
    $$(".filter-btn").forEach(b => b.classList.toggle("active", b === button));
    const type = button.dataset.filter;
    cards.forEach(card => { card.hidden = type !== "all" && card.dataset.category !== type; });
  }));

  const modal = $("#projectModal");
  if (modal) {
    cards.forEach(card => {
      const openBtn = $(".open-modal", card);
      if (openBtn) {
        openBtn.addEventListener("click", () => {
          const img = $("img", card);
          if (img && $("#modalImg")) {
            $("#modalImg").src = img.src;
            $("#modalImg").alt = img.alt;
          }
          const title = $("h3", card);
          if (title && $("#modalTitle")) $("#modalTitle").textContent = title.textContent;
          const desc = $(".project-desc", card);
          if (desc && $("#modalDesc")) $("#modalDesc").textContent = desc.textContent;
          const tags = $(".tags", card);
          if (tags && $("#modalTags")) $("#modalTags").innerHTML = tags.innerHTML;
          const link = $(".link", card) || $(".btn", card);
          if (link && $("#modalLink")) $("#modalLink").href = link.href;
          modal.showModal();
        });
      }
    });

    const closeBtn = $("#modalClose");
    if (closeBtn) closeBtn.addEventListener("click", () => modal.close());
    modal.addEventListener("click", e => { if (e.target === modal) modal.close(); });
  }
})();
