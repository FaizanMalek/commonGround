/**
 * CommonGround — shared theme + locale controls (all pages)
 */
(function () {
  const THEME_KEY = 'commonground-theme';
  const LOCALE_KEY = 'commonground-locale';

  function getTheme() {
    try {
      return localStorage.getItem(THEME_KEY) || localStorage.getItem('cg-theme') || 'light';
    } catch {
      return 'light';
    }
  }

  function setTheme(theme) {
    const value = theme === 'dark' ? 'dark' : 'light';
    try {
      localStorage.setItem(THEME_KEY, value);
    } catch { /* ignore */ }
    document.documentElement.setAttribute('data-theme', value === 'dark' ? 'dark' : 'light');
    updateThemeButton();
    window.dispatchEvent(new CustomEvent('cg-theme-change', { detail: { theme: value } }));
  }

  function toggleTheme() {
    setTheme(getTheme() === 'dark' ? 'light' : 'dark');
  }

  function updateThemeButton() {
    const btn = document.getElementById('cg-theme-btn');
    if (!btn) return;
    const dark = getTheme() === 'dark';
    btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    btn.title = dark ? 'Light mode' : 'Dark mode';
  }

  function updateLocaleButton() {
    const btn = document.getElementById('cg-locale-btn');
    if (!btn || !window.i18n) return;
    const loc = window.i18n.getLocale();
    btn.textContent = loc === 'fr' ? 'EN' : 'FR';
    btn.title = loc === 'fr' ? 'Switch to English' : 'Passer en français';
    btn.setAttribute('aria-label', btn.title);
  }

  function toggleLocale() {
    if (!window.i18n) return;
    const next = window.i18n.getLocale() === 'fr' ? 'en' : 'fr';
    window.i18n.setLocale(next);
    try {
      localStorage.setItem(LOCALE_KEY, next);
    } catch { /* ignore */ }
    window.i18n.apply();
    updateLocaleButton();
    window.dispatchEvent(new CustomEvent('cg-locale-change', { detail: { locale: next } }));
  }

  function bindElement(id, handler) {
    const el = document.getElementById(id);
    if (el && !el.dataset.cgBound) {
      el.dataset.cgBound = '1';
      el.addEventListener('click', handler);
    }
  }

  function bindLegacyControls() {
    bindElement('locale-toggle-btn', function (e) {
      e.preventDefault();
      toggleLocale();
    });
    const legacyTheme = document.getElementById('dark-mode-btn');
    if (legacyTheme && !legacyTheme.dataset.cgBound) {
      legacyTheme.dataset.cgBound = '1';
      legacyTheme.addEventListener('click', function (e) {
        e.preventDefault();
        toggleTheme();
      });
      legacyTheme.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleTheme();
        }
      });
    }
  }

  function bindControls() {
    bindElement('cg-theme-btn', toggleTheme);
    bindElement('cg-locale-btn', toggleLocale);
    bindLegacyControls();
  }

  function syncLocaleFromStorage() {
    if (!window.i18n) return;
    try {
      const stored =
        localStorage.getItem(LOCALE_KEY) ||
        localStorage.getItem('cg-locale');
      if (stored === 'fr' || stored === 'en') {
        window.i18n.setLocale(stored);
      }
    } catch { /* ignore */ }
    window.i18n.apply();
    updateLocaleButton();
  }

  function init() {
    setTheme(getTheme());
    bindControls();
    syncLocaleFromStorage();
  }

  function prefsToolbarHtml() {
    return (
      '<div class="cg-prefs" role="group" aria-label="Display preferences">' +
      '<button type="button" class="cg-pref-btn" id="cg-locale-btn" title="Language">EN</button>' +
      '<button type="button" class="cg-pref-btn cg-theme-btn" id="cg-theme-btn" title="Toggle theme" aria-label="Toggle theme">' +
      '<span class="cg-icon-moon" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg></span>' +
      '<span class="cg-icon-sun" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg></span>' +
      '</button></div>'
    );
  }

  window.CGPrefs = {
    init: init,
    toggleTheme: toggleTheme,
    toggleLocale: toggleLocale,
    getTheme: getTheme,
    toolbarHtml: prefsToolbarHtml,
    updateLocaleButton: updateLocaleButton,
  };

  function tryAutoInit() {
    if (
      document.getElementById('cg-locale-btn') ||
      document.getElementById('locale-toggle-btn') ||
      document.getElementById('dark-mode-btn')
    ) {
      init();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryAutoInit);
  } else {
    tryAutoInit();
  }
})();
