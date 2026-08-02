(() => {
  const STORAGE_KEY = 'inspace-theme';
  const THEMES = new Set(['fantasy', 'scifi']);

  let currentTheme = null;

  function isTheme(value) {
    return THEMES.has(value);
  }

  function readStoredTheme() {
    try {
      const value = window.localStorage.getItem(STORAGE_KEY);
      return isTheme(value) ? value : null;
    } catch {
      return null;
    }
  }

  function getDefaultTheme() {
    const value = document.documentElement.dataset.defaultTheme || 'fantasy';
    return isTheme(value) ? value : 'fantasy';
  }

  function updateToggleButtons() {
    const nextTheme = currentTheme === 'fantasy' ? 'scifi' : 'fantasy';
    const nextLabel = nextTheme === 'scifi' ? 'Sci-Fi' : 'Fantasy';

    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
      button.dataset.nextTheme = nextTheme;
      button.setAttribute('aria-label', `Zum ${nextLabel}-Theme wechseln`);
      button.setAttribute('title', `Zum ${nextLabel}-Theme wechseln`);
      button.setAttribute('aria-pressed', 'false');
      button.classList.toggle('is-scifi', currentTheme === 'scifi');
    });
  }

  function setTheme(theme) {
    currentTheme = theme;
    document.documentElement.dataset.theme = theme;
    updateToggleButtons();
  }

  function persistTheme(theme) {
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Falls LocalStorage blockiert ist, bleibt der Wechsel nur für diese Sitzung aktiv.
    }
  }

  function toggleTheme() {
    const nextTheme = currentTheme === 'fantasy' ? 'scifi' : 'fantasy';
    persistTheme(nextTheme);
    setTheme(nextTheme);
  }

  function bootTheme() {
    const storedTheme = readStoredTheme();
    const theme = storedTheme || getDefaultTheme();
    setTheme(theme);
  }

  bootTheme();

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
      button.addEventListener('click', toggleTheme);
    });

    setTheme(currentTheme || getDefaultTheme());
  });
})();
