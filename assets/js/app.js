const themeRoot = document.getElementById('theme-root');
const themeToggle = document.getElementById('theme-toggle');
const THEME_KEY = 'theme-preference';

function applyTheme(theme) {
    themeRoot.classList.toggle('dark', theme === 'dark');
    themeRoot.classList.toggle('light', theme !== 'dark');
    themeToggle.setAttribute('aria-pressed', String(theme === 'dark'));
}

try {
    applyTheme(localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light');
} catch (error) {
    console.warn('Theme preference storage is unavailable:', error);
    applyTheme('light');
}

themeToggle.addEventListener('click', () => {
    const theme = themeRoot.classList.contains('dark') ? 'light' : 'dark';
    applyTheme(theme);
    try {
        localStorage.setItem(THEME_KEY, theme);
    } catch (error) {
        console.warn('Unable to save theme preference:', error);
    }
});
