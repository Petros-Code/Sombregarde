function openModal() {
  document.getElementById("modalOverlay").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  document.getElementById("modalOverlay").classList.remove("open");
  document.body.style.overflow = "";
}

function closeModalOnOverlay(e) {
  if (e.target === document.getElementById("modalOverlay")) {
    closeModal();
  }
}

function copyCommand(el, text) {
  navigator.clipboard.writeText(text).then(() => {
    const original = el.textContent;
    el.textContent = "✓ Copié !";
    el.classList.add("copied");
    setTimeout(() => {
      el.textContent = original;
      el.classList.remove("copied");
    }, 1800);
  });
}

// Tabs "Nos Outils"
document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tools-tab");
  const images = document.querySelectorAll(".tools-image");
  const lightbox = document.getElementById("imageLightbox");
  const lightboxImg = document.getElementById("imageLightboxImg");

  if (!tabs.length || !images.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.getAttribute("data-tab");
      if (!target) return;

      // Onglets
      tabs.forEach((t) => t.classList.remove("is-active"));
      tab.classList.add("is-active");

      // Images
      images.forEach((img) => {
        img.classList.toggle(
          "is-active",
          img.getAttribute("data-tab-content") === target
        );
      });
    });
  });

  // Liste des images pour la navigation dans le lightbox
  const imagesList = Array.from(images);
  let lightboxCurrentIndex = 0;

  function showLightboxImage(index) {
    const i = ((index % imagesList.length) + imagesList.length) % imagesList.length;
    lightboxCurrentIndex = i;
    const img = imagesList[i];
    if (lightboxImg && img) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || "";
      lightboxImg.dataset.index = String(i);
    }
  }

  function lightboxPrev() {
    showLightboxImage(lightboxCurrentIndex - 1);
  }

  function lightboxNext() {
    showLightboxImage(lightboxCurrentIndex + 1);
  }

  // Click sur les screenshots pour agrandir
  images.forEach((img, index) => {
    img.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!lightbox || !lightboxImg) return;
      lightboxCurrentIndex = index;
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || "";
      lightboxImg.dataset.index = String(index);
      lightbox.classList.add("open");
      document.body.style.overflow = "hidden";
    });
  });

  // Flèches prev/next (empêcher la fermeture au clic sur les flèches)
  const btnPrev = document.getElementById("lightboxPrev");
  const btnNext = document.getElementById("lightboxNext");
  if (btnPrev) btnPrev.addEventListener("click", (e) => { e.stopPropagation(); lightboxPrev(); });
  if (btnNext) btnNext.addEventListener("click", (e) => { e.stopPropagation(); lightboxNext(); });

  // Fermeture du lightbox au clic sur l'overlay ou l'image
  if (lightbox) {
    lightbox.addEventListener("click", () => {
      closeImageLightbox();
    });
  }
});

function closeImageLightbox() {
  const lightbox = document.getElementById("imageLightbox");
  if (!lightbox) return;
  lightbox.classList.remove("open");
  document.body.style.overflow = "";
}

// Gestion globale des touches (Échap, flèches dans le lightbox)
document.addEventListener("keydown", (e) => {
  const lightbox = document.getElementById("imageLightbox");
  const isLightboxOpen = lightbox && lightbox.classList.contains("open");

  if (e.key === "Escape") {
    if (isLightboxOpen) {
      closeImageLightbox();
      return;
    }
    closeModal();
    return;
  }

  if (isLightboxOpen && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
    e.preventDefault();
    const imagesList = document.querySelectorAll(".tools-image");
    let idx = parseInt(document.getElementById("imageLightboxImg")?.dataset?.index ?? "0", 10);
    if (e.key === "ArrowLeft") idx = (idx - 1 + imagesList.length) % imagesList.length;
    else idx = (idx + 1) % imagesList.length;
    const img = imagesList[idx];
    if (img && document.getElementById("imageLightboxImg")) {
      document.getElementById("imageLightboxImg").src = img.src;
      document.getElementById("imageLightboxImg").alt = img.alt || "";
      document.getElementById("imageLightboxImg").dataset.index = String(idx);
    }
  }
});

