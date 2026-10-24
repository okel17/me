(function() {
  'use strict';

  var STORAGE_KEY = 'theme-preference';
  var mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  function getSavedPreference() {
    try {
      return localStorage.getItem(STORAGE_KEY) || 'system';
    } catch (e) {
      return 'system';
    }
  }

  function savePreference(preference) {
    try {
      localStorage.setItem(STORAGE_KEY, preference);
    } catch (e) {}
  }

  function applyTheme(preference) {
    var isDark = preference === 'dark' || (preference === 'system' && mediaQuery.matches);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    document.documentElement.setAttribute('data-theme', preference);
    updateButtons(preference);
  }

  function updateButtons(preference) {
    var buttons = document.querySelectorAll('.theme-btn');
    buttons.forEach(function(btn) {
      var isCurrent = btn.getAttribute('data-theme') === preference;
      btn.setAttribute('aria-pressed', isCurrent ? 'true' : 'false');
      if (isCurrent) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  function initTheme() {
    var currentPreference = getSavedPreference();
    applyTheme(currentPreference);

    var container = document.getElementById('theme-selector');
    if (container) {
      container.addEventListener('click', function(e) {
        var btn = e.target.closest('.theme-btn');
        if (!btn) return;
        var selectedTheme = btn.getAttribute('data-theme');
        if (selectedTheme) {
          savePreference(selectedTheme);
          applyTheme(selectedTheme);
        }
      });
    }

    // React to system color scheme changes if currently set to 'system'
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', function() {
        if (getSavedPreference() === 'system') {
          applyTheme('system');
        }
      });
    } else if (mediaQuery.addListener) {
      // Fallback for older browsers
      mediaQuery.addListener(function() {
        if (getSavedPreference() === 'system') {
          applyTheme('system');
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
  } else {
    initTheme();
  }
})();
