(() => {
  const form = $("#contactForm");
  if (!form) return;

  const rules = {
    cName:    v => v.trim().length < 2 ? "Vui lòng nhập họ tên (ít nhất 2 ký tự)." : "",
    cEmail:   v => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "Email chưa đúng định dạng." : "",
    cMessage: v => v.trim().length < 10 ? "Nội dung cần ít nhất 10 ký tự." : ""
  };

  function check(field) {
    const message = rules[field.id](field.value);
    field.classList.toggle("invalid", Boolean(message));
    field.parentElement.querySelector(".error").textContent = message;
    return !message;
  }

  const fields = Object.keys(rules).map(id => document.getElementById(id));
  fields.forEach(field => field.addEventListener("input", () => check(field)));

  form.addEventListener("submit", e => {
    e.preventDefault();
    const ok = fields.map(check).every(Boolean);
    $("#formOk").hidden = !ok;
    if (ok) form.reset();
  });
})();
