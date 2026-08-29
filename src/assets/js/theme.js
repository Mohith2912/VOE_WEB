// VOE Website — Dark theme only
// The site is permanently dark; this file is kept for forward compatibility.

/**
 * Always applies the dark theme class to <html>.
 * Called once at app startup from main.jsx.
 */
function initTheme() {
  document.documentElement.classList.add('theme-dark');
}

/**
 * No-op kept for import compatibility with Navbar.jsx.
 * The site no longer supports theme switching.
 */
function applyTheme() {}

export { initTheme, applyTheme };
