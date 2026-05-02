/* ============================================================
   MAISON DORÉE — MAIN JS
   Navbar, scroll, IntersectionObserver, parallax
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Navbar ---------- */

  const navbar       = document.getElementById('navbar');
  const hamburger    = document.querySelector('.nav__hamburger');
  const navMenu      = document.querySelector('.nav__menu');
  const navLinks     = document.querySelectorAll('.nav__link');
  const SCROLL_THRESHOLD = 80;

  function onScroll() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveLink();
    applyHeroParallax();
  }

  /* Mobile menu */
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', function () {
      const isOpen = navMenu.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    /* Close menu when a nav link is clicked */
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    /* Close on outside click */
    document.addEventListener('click', function (e) {
      if (navMenu.classList.contains('open') &&
          !navMenu.contains(e.target) &&
          !hamburger.contains(e.target)) {
        navMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ---------- Active nav link via IntersectionObserver ---------- */

  const SECTION_IDS = ['hero', 'about', 'menu', 'gallery', 'reservation', 'contact'];
  let currentSection = 'hero';

  const sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          currentSection = entry.target.id;
          updateActiveLink();
        }
      });
    },
    { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
  );

  SECTION_IDS.forEach(function (id) {
    const el = document.getElementById(id);
    if (el) sectionObserver.observe(el);
  });

  function updateActiveLink() {
    navLinks.forEach(function (link) {
      const href = link.getAttribute('href');
      if (href === '#' + currentSection) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  /* ---------- Scroll reveal via IntersectionObserver ---------- */

  const revealEls = document.querySelectorAll(
    '.scroll-reveal, .scroll-reveal--left, .scroll-reveal--right, .scroll-reveal--scale'
  );

  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '-60px 0px -60px 0px', threshold: 0.05 }
  );

  revealEls.forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ---------- Hero parallax ---------- */

  const heroBg = document.querySelector('.hero__bg');

  function applyHeroParallax() {
    if (!heroBg) return;
    const scrollY = window.scrollY;
    const heroHeight = document.getElementById('hero').offsetHeight;
    if (scrollY <= heroHeight) {
      heroBg.style.transform = 'translateY(' + (scrollY * 0.3) + 'px)';
    }
  }

  /* ---------- Smooth scroll for anchor links ---------- */

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = navbar ? navbar.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ---------- Set minimum date for booking form ---------- */

  const dateInput = document.getElementById('booking-date');
  if (dateInput) {
    const today = new Date();
    const yyyy  = today.getFullYear();
    const mm    = String(today.getMonth() + 1).padStart(2, '0');
    const dd    = String(today.getDate()).padStart(2, '0');
    dateInput.min = yyyy + '-' + mm + '-' + dd;
  }

  /* ---------- Populate time slots ---------- */

  const timeSelect = document.getElementById('booking-time');
  if (timeSelect && typeof RESTAURANT !== 'undefined') {
    RESTAURANT.timeSlots.forEach(function (slot) {
      const option = document.createElement('option');
      option.value = slot;
      option.textContent = slot;
      timeSelect.appendChild(option);
    });
  }

  /* ---------- Populate opening hours in contact section ---------- */

  const hoursTable = document.getElementById('hours-table');
  if (hoursTable && typeof RESTAURANT !== 'undefined') {
    RESTAURANT.hours.forEach(function (item) {
      const tr = document.createElement('tr');
      tr.innerHTML =
        '<td class="day">' + item.day + '</td>' +
        '<td class="time' + (item.closed ? ' closed' : '') + '">' + item.time + '</td>';
      hoursTable.appendChild(tr);
    });
  }

  /* ---------- WhatsApp floating button ---------- */

  const waFloat = document.getElementById('whatsapp-float');
  if (waFloat && typeof RESTAURANT !== 'undefined') {
    const msg = encodeURIComponent(
      "Hello! I'd like to make a reservation at " + RESTAURANT.name + '. Could you help me with availability?'
    );
    waFloat.href = 'https://wa.me/' + RESTAURANT.whatsappNumber + '?text=' + msg;
  }

  /* ---------- Events ---------- */

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  /* Initial call */
  onScroll();
  updateActiveLink();

  /* Navbar load animation */
  if (navbar) navbar.classList.add('nav-loaded');

})();
