(() => {
  const canvas = $("#space");
  const ctx = canvas.getContext("2d");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let w, h, stars = [], mx = 0, my = 0;

  function resize() {
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
    stars = Array.from({ length: Math.round(w * h / 7000) }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      z: Math.random() * .9 + .1, t: Math.random() * 6.28
    }));
  }

  function frame() {
    ctx.clearRect(0, 0, w, h);
    for (const s of stars) {
      if (!reduce) { s.x -= .12 * s.z; s.t += .03; if (s.x < 0) s.x = w; }
      ctx.globalAlpha = .35 + .65 * Math.abs(Math.sin(s.t));
      ctx.fillStyle = s.z > .8 ? "#9fe9ff" : "#ffffff";
      ctx.beginPath();
      ctx.arc(s.x - mx * 30 * s.z, s.y - my * 30 * s.z, s.z * 1.5, 0, 6.283);
      ctx.fill();
    }
    requestAnimationFrame(frame);
  }

  addEventListener("resize", resize);
  addEventListener("mousemove", e => { mx = e.clientX / w - .5; my = e.clientY / h - .5; });
  resize();
  frame();
})();
