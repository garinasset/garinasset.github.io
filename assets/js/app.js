const fileList = document.getElementById('file-list');
const loadingState = document.getElementById('loading-state');
const emptyState = document.getElementById('empty-state');
const errorState = document.getElementById('error-state');
const themeRoot = document.getElementById('theme-root');
const themeToggle = document.getElementById('theme-toggle');
const THEME_KEY = 'theme-preference';
const HOME_REPOSITORY = 'garinasset.github.io';
const REPOSITORY_NAME = /^(?!\.{1,2}$)[a-zA-Z0-9._-]+$/;

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

function renderRepositories(repositories) {
    const fragment = document.createDocumentFragment();

    for (const repo of repositories) {
        const item = document.createElement('li');
        const link = document.createElement('a');
        link.className = 'file-link';
        link.href = `https://downloads.garinasset.com/${encodeURIComponent(repo.name)}/`;

        const icon = document.createElement('i');
        icon.className = 'fa-solid fa-folder file-icon';
        icon.setAttribute('aria-hidden', 'true');

        const name = document.createElement('span');
        name.className = 'col-name';
        name.textContent = repo.name;
        name.title = repo.name;

        const size = document.createElement('span');
        size.className = 'col-size';
        size.textContent = '\u2014';

        const sha = document.createElement('span');
        sha.className = 'col-sha';
        sha.textContent = '\u2014';

        link.append(icon, name, size, sha);
        item.append(link);
        fragment.append(item);
    }

    fileList.replaceChildren(fragment);
    emptyState.hidden = repositories.length !== 0;
}

async function loadRepositories() {
    try {
        const response = await fetch('./repositories.json', { cache: 'no-store' });
        if (!response.ok) {
            throw new Error(`Unable to load repository index: HTTP ${response.status}`);
        }

        const data = await response.json();
        if (!Array.isArray(data) || data.some(repo =>
            !repo || typeof repo.name !== 'string' || !REPOSITORY_NAME.test(repo.name)
        )) {
            throw new Error('Invalid repository index');
        }

        const repositories = data
            .filter(repo => repo.name.toLowerCase() !== HOME_REPOSITORY)
            .sort((a, b) => a.name.localeCompare(b.name, 'en'));
        renderRepositories(repositories);
        errorState.hidden = true;
    } catch (error) {
        console.error('Unable to load repository directory:', error);
        fileList.replaceChildren();
        emptyState.hidden = true;
        errorState.hidden = false;
    } finally {
        loadingState.hidden = true;
    }
}

loadRepositories();
