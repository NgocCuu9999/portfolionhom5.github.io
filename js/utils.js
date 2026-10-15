const $  = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function placeholder(label) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5ee7ff"/><stop offset="1" stop-color="#a78bfa"/></linearGradient></defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <text x="50%" y="50%" fill="#0a0c1c" font-family="Arial" font-size="30" font-weight="700" text-anchor="middle" dominant-baseline="middle">${label}</text></svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

document.addEventListener("error", e => {
  const img = e.target;
  if (img.tagName === "IMG" && !img.dataset.fallback) {
    img.dataset.fallback = "1";
    if (img.classList.contains("member-photo") || img.classList.contains("avatar")) {
      const nameParts = (img.alt || "").replace(/^Ảnh đại diện của\s*/i, "").trim().split(/\s+/);
      const shortName = nameParts[nameParts.length - 1] || "A";
      img.src = avatar(shortName);
    } else {
      img.src = placeholder(img.dataset.label || img.alt || "Ảnh");
    }
  }
}, true);

const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function avatar(name) {
  const letter = (name || "?").trim().charAt(0).toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5ee7ff"/><stop offset="1" stop-color="#a78bfa"/></linearGradient></defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <text x="50%" y="52%" fill="#0a0c1c" font-family="Arial" font-size="130" font-weight="700" text-anchor="middle" dominant-baseline="middle">${esc(letter)}</text></svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

function readImage(file, max = 360) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const k = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = img.width * k;
        canvas.height = img.height * k;
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", .85));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
