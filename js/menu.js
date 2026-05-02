/* ============================================================
   MAISON DORÉE — MENU JS
   Tab switching + card rendering from data.js
   ============================================================ */

(function () {
  'use strict';

  const tabs     = document.querySelectorAll('.menu__tab');
  const grid     = document.getElementById('menu-grid');
  let   activeCategory = 'starters';

  if (!grid || !tabs.length) return;

  /* ---------- Build a single menu card ---------- */

  function buildCard(item, index) {
    const card = document.createElement('article');
    card.className = 'menu-card card-enter';
    card.style.animationDelay = (index * 0.06) + 's';

    const badgeHtml = item.isSpecial
      ? '<span class="menu-card__badge menu-card__badge--special">Chef\'s Recommendation</span>'
      : '';

    const categoryLabel = item.category.charAt(0).toUpperCase() + item.category.slice(1, -1);

    const tagsHtml = item.tags && item.tags.length
      ? item.tags.map(function (t) {
          return '<span class="menu-card__tag">' + escHtml(t) + '</span>';
        }).join('')
      : '';

    card.innerHTML =
      '<div class="menu-card__img-wrap">' +
        '<img class="menu-card__img" src="' + escHtml(item.image) + '" alt="' + escHtml(item.name) + '" loading="lazy">' +
        '<span class="menu-card__badge">' + escHtml(categoryLabel) + '</span>' +
        badgeHtml +
      '</div>' +
      '<div class="menu-card__body">' +
        '<h3 class="menu-card__name">' + escHtml(item.name) + '</h3>' +
        '<p class="menu-card__desc">' + escHtml(item.description) + '</p>' +
        '<div class="menu-card__footer">' +
          '<span class="menu-card__price">$' + item.price + '</span>' +
          '<div class="menu-card__tags">' + tagsHtml + '</div>' +
        '</div>' +
      '</div>';

    return card;
  }

  /* ---------- Render cards for a category ---------- */

  function renderCards(category) {
    grid.innerHTML = '';

    const items = MENU_ITEMS.filter(function (item) {
      return item.category === category;
    });

    items.forEach(function (item, index) {
      grid.appendChild(buildCard(item, index));
    });
  }

  /* ---------- Tab switching ---------- */

  function switchTab(category) {
    activeCategory = category;

    tabs.forEach(function (tab) {
      tab.classList.toggle('active', tab.dataset.category === category);
    });

    /* Fade out, swap, fade in */
    grid.style.opacity = '0';
    grid.style.transform = 'translateY(8px)';
    grid.style.transition = 'opacity 0.2s ease, transform 0.2s ease';

    setTimeout(function () {
      renderCards(category);
      grid.style.opacity = '1';
      grid.style.transform = 'translateY(0)';
    }, 200);
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      if (tab.dataset.category !== activeCategory) {
        switchTab(tab.dataset.category);
      }
    });
  });

  /* ---------- Helpers ---------- */

  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* ---------- Init ---------- */

  renderCards(activeCategory);

})();
