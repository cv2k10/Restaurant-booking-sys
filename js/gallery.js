/* ============================================================
   MAISON DORÉE — GALLERY JS
   Grid rendering + lightbox with keyboard navigation
   ============================================================ */

(function () {
  'use strict';

  const galleryGrid = document.getElementById('gallery-grid');
  const lightbox    = document.getElementById('lightbox');
  const lbImg       = document.getElementById('lightbox-img');
  const lbClose     = document.getElementById('lightbox-close');
  const lbPrev      = document.getElementById('lightbox-prev');
  const lbNext      = document.getElementById('lightbox-next');
  const lbCounter   = document.getElementById('lightbox-counter');

  if (!galleryGrid || !lightbox) return;

  let currentIndex = 0;

  /* ---------- Build gallery grid ---------- */

  function buildGalleryItem(img, index) {
    const item = document.createElement('div');
    item.className = 'gallery-item scroll-reveal' + (img.tall ? ' gallery-item--tall' : '');
    item.style.transitionDelay = (index * 0.07) + 's';
    item.setAttribute('data-index', index);
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');
    item.setAttribute('aria-label', 'View image: ' + img.alt);

    item.innerHTML =
      '<img class="gallery-item__img" src="' + escHtml(img.src) + '" alt="' + escHtml(img.alt) + '" loading="lazy">' +
      '<div class="gallery-item__overlay">' +
        '<div class="gallery-item__icon">' +
          '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
            '<path d="M15 3h6m0 0v6m0-6l-7 7M9 21H3m0 0v-6m0 6l7-7" stroke-linecap="round" stroke-linejoin="round"/>' +
          '</svg>' +
        '</div>' +
      '</div>';

    item.addEventListener('click', function () {
      openLightbox(index);
    });

    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(index);
      }
    });

    return item;
  }

  GALLERY_IMAGES.forEach(function (img, index) {
    galleryGrid.appendChild(buildGalleryItem(img, index));
  });

  /* Re-observe newly added scroll-reveal elements */
  if (window.revealObserver) {
    galleryGrid.querySelectorAll('.scroll-reveal').forEach(function (el) {
      window.revealObserver.observe(el);
    });
  } else {
    /* Fallback: reveal all after short delay if observer isn't available */
    setTimeout(function () {
      galleryGrid.querySelectorAll('.scroll-reveal').forEach(function (el) {
        el.classList.add('visible');
      });
    }, 200);
  }

  /* ---------- Lightbox ---------- */

  function openLightbox(index) {
    currentIndex = index;
    showImage(currentIndex);
    lightbox.classList.remove('hidden');
    lightbox.classList.add('lightbox-open');
    document.body.style.overflow = 'hidden';
    if (lbClose) lbClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.add('hidden');
    lightbox.classList.remove('lightbox-open');
    document.body.style.overflow = '';
  }

  function showImage(index) {
    const img = GALLERY_IMAGES[index];
    if (!img || !lbImg) return;
    lbImg.src    = img.src;
    lbImg.alt    = img.alt;
    lbImg.classList.remove('lightbox-img-enter');
    /* Force reflow */
    void lbImg.offsetWidth;
    lbImg.classList.add('lightbox-img-enter');
    if (lbCounter) {
      lbCounter.textContent = (index + 1) + ' / ' + GALLERY_IMAGES.length;
    }
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length;
    showImage(currentIndex);
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % GALLERY_IMAGES.length;
    showImage(currentIndex);
  }

  /* Controls */
  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lbPrev)  lbPrev.addEventListener('click', prevImage);
  if (lbNext)  lbNext.addEventListener('click', nextImage);

  /* Close on backdrop click */
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  /* Keyboard navigation */
  document.addEventListener('keydown', function (e) {
    if (lightbox.classList.contains('hidden')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   prevImage();
    if (e.key === 'ArrowRight')  nextImage();
  });

  /* Touch swipe support */
  let touchStartX = 0;

  lightbox.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  lightbox.addEventListener('touchend', function (e) {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextImage();
      else          prevImage();
    }
  }, { passive: true });

  /* ---------- Helpers ---------- */

  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

})();
