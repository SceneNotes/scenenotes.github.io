(() => {
  const photos = window.SCENENOTES_PHOTOS || [];
  const categoryNames = { plant: "植物", animal: "動物", object: "モノ", landscape: "風景" };
  const categoryButtons = [...document.querySelectorAll(".filter")];
  const yearSelect = document.querySelector("#year-filter");
  const grid = document.querySelector("#photo-grid");
  const count = document.querySelector("#result-count");
  const emptyState = document.querySelector("#empty-state");
  const lightbox = document.querySelector("#lightbox");
  const lightboxImage = document.querySelector("#lightbox-image");
  const info = document.querySelector("#photo-info");
  const summary = info.querySelector("summary");
  let category = "all";
  let shown = photos;
  let activeIndex = 0;
  let previousFocus = null;
  let renderTimer;
  let touchStart = null;

  const years = [...new Set(photos.map(photo => photo.year).filter(Boolean))].sort((a, b) => Number(b) - Number(a));
  for (const year of years) {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = `${year}年`;
    yearSelect.append(option);
  }
  if (photos.length) {
    document.querySelector(".hero__image").src = photos[0].src;
  }
  document.querySelector("#hero-range").textContent =
    `SCENES / ${photos.length ? "001" : "000"}—${String(photos.length).padStart(3, "0")}`;

  function cardFor(photo, index) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "photo-card";
    button.setAttribute("aria-label", `${photo.title}の写真を拡大`);

    const wrap = document.createElement("span");
    wrap.className = "photo-card__image";
    const image = document.createElement("img");
    image.src = photo.src;
    image.alt = photo.alt;
    image.loading = "lazy";
    wrap.append(image);

    const caption = document.createElement("span");
    caption.className = "photo-card__caption";
    const title = document.createElement("strong");
    title.textContent = photo.title;
    const meta = document.createElement("span");
    meta.textContent = [categoryNames[photo.category] || photo.category, photo.year].filter(Boolean).join(" · ");
    caption.append(title, meta);

    button.append(wrap, caption);
    button.addEventListener("click", () => openLightbox(index, button));
    return button;
  }

  function render() {
    shown = photos.filter(photo =>
      (category === "all" || photo.category === category) &&
      (yearSelect.value === "all" || photo.year === yearSelect.value)
    );
    grid.replaceChildren(...shown.map(cardFor));
    count.textContent = `${shown.length} / ${photos.length} PHOTOS · SAMPLE`;
    emptyState.hidden = shown.length !== 0;
    grid.classList.remove("is-changing");
  }

  function queueRender() {
    grid.classList.add("is-changing");
    clearTimeout(renderTimer);
    renderTimer = setTimeout(render, 180);
  }

  categoryButtons.forEach(button => button.addEventListener("click", () => {
    category = button.dataset.category;
    categoryButtons.forEach(item => {
      const selected = item === button;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    queueRender();
  }));
  yearSelect.addEventListener("change", queueRender);
  document.querySelector("#reset-filters").addEventListener("click", () => {
    categoryButtons[0].click();
    yearSelect.value = "all";
    queueRender();
  });

  function showPhoto(index) {
    if (!shown.length) return;
    activeIndex = (index + shown.length) % shown.length;
    const photo = shown[activeIndex];
    lightboxImage.src = photo.src;
    lightboxImage.alt = photo.alt;
    document.querySelector("#lightbox-title").textContent = photo.title;
    document.querySelector("#lightbox-category").textContent =
      [categoryNames[photo.category] || photo.category, "デモ用サンプル"].join(" · ");
    document.querySelector("#lightbox-counter").textContent =
      `${String(activeIndex + 1).padStart(2, "0")} / ${String(shown.length).padStart(2, "0")}`;
    for (const field of ["year", "camera", "lens"]) {
      const value = photo[field];
      document.querySelector(`#photo-${field}`).textContent = field === "year" && value ? `${value}年` : value || "";
      document.querySelector(`[data-field="${field}"]`).hidden = !value;
    }
    info.hidden = !photo.year && !photo.camera && !photo.lens;
    document.querySelector(".lightbox__content").scrollTop = 0;
  }

  function openLightbox(index, trigger) {
    previousFocus = trigger;
    info.open = false;
    showPhoto(index);
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    document.querySelector("#lightbox-close").focus();
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImage.removeAttribute("src");
    document.body.style.overflow = "";
    previousFocus?.focus();
  }

  document.querySelector("#lightbox-close").addEventListener("click", closeLightbox);
  document.querySelector("#lightbox-prev").addEventListener("click", () => showPhoto(activeIndex - 1));
  document.querySelector("#lightbox-next").addEventListener("click", () => showPhoto(activeIndex + 1));
  lightbox.addEventListener("click", event => {
    if (event.target === lightbox) closeLightbox();
  });
  info.addEventListener("toggle", () => {
    summary.textContent = info.open ? "撮影情報を閉じる" : "撮影情報を表示";
  });
  document.addEventListener("keydown", event => {
    if (!lightbox.classList.contains("is-open")) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") showPhoto(activeIndex - 1);
    if (event.key === "ArrowRight") showPhoto(activeIndex + 1);
    if (event.key === "Tab") {
      const controls = [...lightbox.querySelectorAll("button, summary")].filter(node => !node.closest("[hidden]"));
      const first = controls[0], last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  lightbox.addEventListener("touchstart", event => {
    touchStart = { x: event.changedTouches[0].screenX, y: event.changedTouches[0].screenY };
  }, { passive: true });
  lightbox.addEventListener("touchend", event => {
    if (!touchStart) return;
    const dx = event.changedTouches[0].screenX - touchStart.x;
    const dy = event.changedTouches[0].screenY - touchStart.y;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.3) showPhoto(activeIndex + (dx < 0 ? 1 : -1));
    touchStart = null;
  }, { passive: true });

  render();
})();
