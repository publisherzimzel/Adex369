/**
 * ADEX369 — Centered page loader: spinning rings around static logo emblem
 */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const MIN_VISIBLE_MS = 1500;
  const startedAt = Date.now();

  document.documentElement.classList.add('is-loading');

  const loader = document.createElement('div');
  loader.className = 'page-loader';
  loader.id = 'page-loader';
  loader.setAttribute('role', 'status');
  loader.setAttribute('aria-live', 'polite');
  loader.setAttribute('aria-label', 'Loading ADEX369');

  loader.innerHTML = `
    <div class="page-loader__backdrop" aria-hidden="true"></div>
    <div class="page-loader__content">
      <div class="loader-mark" aria-hidden="true">
        <svg class="loader-rings" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <linearGradient id="loader-teal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#5eead4"/>
              <stop offset="100%" stop-color="#26c6b2"/>
            </linearGradient>
            <linearGradient id="loader-gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#f5d061"/>
              <stop offset="100%" stop-color="#c9a43c"/>
            </linearGradient>
          </defs>
          <g class="loader-ring loader-ring--outer">
            <circle cx="100" cy="100" r="94" fill="none" stroke="url(#loader-gold)" stroke-width="6" stroke-linecap="round" stroke-dasharray="400 175"/>
          </g>
          <g class="loader-ring loader-ring--mid">
            <circle cx="100" cy="100" r="86" fill="none" stroke="url(#loader-teal)" stroke-width="5" stroke-linecap="round" stroke-dasharray="360 155"/>
          </g>
          <g class="loader-ring loader-ring--inner">
            <circle cx="100" cy="100" r="78" fill="none" stroke="url(#loader-gold)" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="320 135"/>
          </g>
        </svg>
        <img class="loader-emblem" src="assets/logo.png?v=8" alt="" width="200" height="200" decoding="sync">
      </div>
    </div>
  `;

  document.body.insertBefore(loader, document.body.firstChild);

  function dismissLoader() {
    const wait = Math.max(0, MIN_VISIBLE_MS - (Date.now() - startedAt));

    window.setTimeout(() => {
      loader.classList.add('is-exiting');
      document.documentElement.classList.remove('is-loading');

      const remove = () => loader.remove();
      loader.addEventListener('transitionend', remove, { once: true });
      window.setTimeout(remove, 700);
    }, wait);
  }

  if (document.readyState === 'complete') {
    dismissLoader();
  } else {
    window.addEventListener('load', dismissLoader, { once: true });
  }
})();
