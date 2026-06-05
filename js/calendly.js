/**
 * Apply Calendly URL from js/config.js before widget auto-initializes.
 */
(function () {
  const embed = document.getElementById('calendly-embed');
  if (!embed) return;

  const url = (window.ADEX369_CONFIG && window.ADEX369_CONFIG.calendlyUrl) || embed.dataset.url;
  if (url) embed.setAttribute('data-url', url);
})();
