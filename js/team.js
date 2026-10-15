(() => {
  const MAX = 3;
  const KEY = "portfolio_friends";

  const DEFAULT_FRIENDS = [];

  const list = $("#friendList");
  if (!list) return;
  const form = $("#friendForm");
  const addModal = $("#addFriendModal");
  const viewModal = $("#friendModal");
  const fields = { name: $("#fName"), role: $("#fRole"), bio: $("#fBio"), link: $("#fLink") };
  let friends = load();
  let photo = "";

  function load() {
    try {
      const data = JSON.parse(localStorage.getItem(KEY));
      if (Array.isArray(data)) return data.slice(0, MAX);
    } catch (e) {}
    return [...DEFAULT_FRIENDS];
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(friends)); }
    catch (e) { alert("Bộ nhớ trình duyệt đã đầy, hãy dùng ảnh nhỏ hơn."); }
  }

  function render() {
    const cards = friends.map(f => `
      <article class="card member">
        <button class="member-main" type="button" data-open="${f.id}">
          <img class="member-photo" src="${esc(f.photo || avatar(f.name))}" alt="${esc(f.name)}">
          <h3>${esc(f.name)}</h3>
          <p>${esc(f.role || "Thành viên nhóm")}</p>
        </button>
        <button class="member-remove" type="button" data-del="${f.id}" aria-label="Xóa ${esc(f.name)}">×</button>
      </article>`);

    const slots = Array.from({ length: MAX - friends.length }, () => `
      <article class="card member slot">
        <button class="member-main slot-btn" type="button" data-add="1">
          <span class="plus">+</span><span>Thêm bạn</span>
        </button>
      </article>`);

    list.innerHTML = cards.concat(slots).join("");
    $("#teamCount").textContent = `Đã thêm ${friends.length}/${MAX} bạn`;
  }

  function cleanLink(text) {
    const link = text.trim();
    if (!link) return "";
    const full = /^https?:\/\//i.test(link) ? link : "https://" + link;
    try { new URL(full); return full; } catch (e) { return null; }
  }

  function showError(field, message) {
    field.classList.toggle("invalid", Boolean(message));
    const error = field.parentElement.querySelector(".error");
    if (error) error.textContent = message;
  }

  function openAdd() {
    form.reset();
    photo = "";
    $("#friendPreview").src = avatar("?");
    Object.values(fields).forEach(f => showError(f, ""));
    addModal.showModal();
  }

  $("#teamGrid").addEventListener("click", e => {
    const open = e.target.closest("[data-open]");
    const del = e.target.closest("[data-del]");
    if (e.target.closest("[data-add]")) return openAdd();

    if (open) {
      const f = friends.find(x => x.id === +open.dataset.open);
      $("#fvPhoto").src = f.photo || avatar(f.name);
      $("#fvPhoto").alt = f.name;
      $("#fvName").textContent = f.name;
      $("#fvRole").textContent = f.role || "Thành viên nhóm";
      $("#fvBio").textContent = f.bio || "Chưa có giới thiệu.";
      $("#fvLink").hidden = !f.link;
      if (f.link) $("#fvLink").href = f.link;
      viewModal.showModal();
    }

    if (del && confirm("Xóa bạn này khỏi nhóm?")) {
      friends = friends.filter(x => x.id !== +del.dataset.del);
      save();
      render();
    }
  });

  $("#friendFile").addEventListener("change", async e => {
    if (!e.target.files[0]) return;
    photo = await readImage(e.target.files[0]);
    $("#friendPreview").src = photo;
  });

  form.addEventListener("submit", e => {
    e.preventDefault();
    const name = fields.name.value.trim();
    const link = cleanLink(fields.link.value);

    showError(fields.name, name.length < 2 ? "Vui lòng nhập họ tên (ít nhất 2 ký tự)." : "");
    showError(fields.link, link === null ? "Đường link chưa đúng định dạng." : "");
    if (name.length < 2 || link === null || friends.length >= MAX) return;

    friends.push({ id: Date.now(), name, role: fields.role.value.trim(), bio: fields.bio.value.trim(), link, photo });
    save();
    render();
    addModal.close();
  });

  [addModal, viewModal].forEach(modal => {
    modal.addEventListener("click", e => {
      if (e.target === modal || e.target.closest("[data-close]")) modal.close();
    });
  });

  render();
})();
