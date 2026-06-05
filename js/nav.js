/**
 * ADEX369 — Dual-state navigation (hero overlay → sticky → hide/show on scroll)
 * Vanilla JS equivalent of React scroll + IntersectionObserver patterns.
 */
(function () {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  const SCROLL_THRESHOLD = 90;
  const HIDE_OFFSET = 120;
  const heroEl = document.querySelector('#hero, .page-hero');
  const isHome = document.body.classList.contains('page-home');
  const navLinks = nav.querySelectorAll('.nav-links a[data-nav-section]');
  const sectionIds = isHome
    ? ['hero', 'services', 'about', 'contact']
    : [];

  let lastScrollY = window.scrollY;
  let scrollDirection = 'up';
  let ticking = false;

  if (heroEl) {
    nav.classList.add('nav--dual');
    document.body.classList.add('has-hero-nav');
    nav.classList.add('nav--hero');
  } else {
    nav.classList.add('nav--sticky', 'nav--scrolled');
    document.body.classList.add('nav-is-sticky');
  }

  function setNavState() {
    const y = window.scrollY;
    scrollDirection = y > lastScrollY ? 'down' : 'up';
    const scrolled = y >= SCROLL_THRESHOLD;

    if (heroEl) {
      nav.classList.toggle('nav--hero', !scrolled);
      nav.classList.toggle('nav--sticky', scrolled);
      document.body.classList.toggle('nav-is-sticky', scrolled);
    }

    nav.classList.toggle('nav--scrolled', scrolled || !heroEl);

    const mobileOpen = nav.querySelector('.nav-links.open');
    const shouldHide =
      scrolled &&
      scrollDirection === 'down' &&
      y > HIDE_OFFSET &&
      !mobileOpen;

    nav.classList.toggle('nav--hidden', shouldHide);

    document.documentElement.style.setProperty(
      '--nav-offset',
      scrolled || !heroEl ? 'var(--nav-bar-h-sticky)' : 'var(--nav-bar-h-hero)'
    );

    lastScrollY = y;
    ticking = false;
  }

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(setNavState);
        ticking = true;
      }
    },
    { passive: true }
  );
  setNavState();
  window.addEventListener('nav:recheck', setNavState);

  /* Page-based active link (non-home or fallback) */
  const path = window.location.pathname.split('/').pop() || 'index.html';
  const pageMap = {
    'index.html': 'home',
    'services.html': 'services',
    'about.html': 'about',
    'blog.html': 'blog',
    'contact.html': 'contact',
    'meeting.html': 'contact'
  };
  const currentPage = pageMap[path] || '';

  function setActiveLink(section) {
    nav.querySelectorAll('.nav-links a').forEach((a) => {
      a.classList.remove('active');
      if (a.dataset.navSection === section) a.classList.add('active');
    });
  }

  if (!isHome) {
    nav.querySelectorAll('.nav-links a').forEach((a) => {
      const href = a.getAttribute('href') || '';
      const file = href.split('#')[0];
      if (file === path || (path === '' && file === 'index.html') || (file && file.endsWith(path))) {
        a.classList.add('active');
      } else if (a.dataset.navSection === currentPage) {
        a.classList.add('active');
      }
    });
  }

  /* Homepage section spy via IntersectionObserver */
  if (isHome && sectionIds.length) {
    const sections = sectionIds
      .map((id) => document.getElementById(id === 'contact' ? 'contact-cta' : id))
      .filter(Boolean);

    const visible = new Map();

    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          const key = id === 'contact-cta' ? 'contact' : id;
          if (entry.isIntersecting) {
            visible.set(key, entry.intersectionRatio);
          } else {
            visible.delete(key);
          }
        });

        if (visible.size === 0) return;

        let best = null;
        let bestRatio = 0;
        visible.forEach((ratio, key) => {
          if (ratio >= bestRatio) {
            bestRatio = ratio;
            best = key;
          }
        });
        if (best) setActiveLink(best);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.1, 0.25, 0.5] }
    );

    sections.forEach((s) => spy.observe(s));

    if (window.scrollY < SCROLL_THRESHOLD) setActiveLink('hero');

    navLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        const section = link.dataset.navSection;
        const targetId = section === 'contact' ? 'contact-cta' : section;
        const target = document.getElementById(targetId);
        if (target && link.getAttribute('href').startsWith('#')) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
          setActiveLink(section);
        }
      });
    });
  }
})();
