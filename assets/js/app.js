
const fileList = document.getElementById('file-list');
const emptyState = document.getElementById('empty-state');
const errorState = document.getElementById('error-state');
const themeRoot = document.getElementById('theme-root');
const themeToggle = document.getElementById('theme-toggle');

document.getElementById('current-year').textContent = new Date().getFullYear();

// Theme Management
const THEME_KEY = 'theme-preference';

function getStoredTheme() {
    return localStorage.getItem(THEME_KEY) || 'light';
}

function setTheme(theme) {
    localStorage.setItem(THEME_KEY, theme);
    themeRoot.className = theme;
}

function toggleTheme() {
    const current = getStoredTheme();
    const newTheme = current === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

// Initialize theme
setTheme(getStoredTheme());
themeToggle.addEventListener('click', toggleTheme);

/**
 * Render repositories as directory items
 */
function renderRepositories(repositories) {
    fileList.replaceChildren();

    if (repositories.length === 0) {
        emptyState.hidden = false;
        errorState.hidden = true;
        return;
    }

    emptyState.hidden = true;
    errorState.hidden = true;

    const fragment = document.createDocumentFragment();

    repositories.forEach(repo => {
        const item = document.createElement('div');
        item.className = 'file-item';

        const link = document.createElement('a');
        link.href = `${repo.name}/`;
        link.rel = 'noopener noreferrer';

        const icon = document.createElement('div');
        icon.className = 'file-icon';
        icon.textContent = '📁';

        const name = document.createElement('div');
        name.className = 'file-name';
        name.textContent = repo.name;

        const sha = document.createElement('div');
        sha.className = 'file-sha';
        sha.textContent = '—';

        link.appendChild(icon);
        link.appendChild(name);
        link.appendChild(sha);
        item.appendChild(link);
        fragment.appendChild(item);
    });

    fileList.appendChild(fragment);
}

/**
 * Load repositories from repositories.json
 */
async function loadRepositories() {
    try {
        const response = await fetch('./repositories.json?t=' + Date.now(), {
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error('Unable to load repository index');
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error('Invalid repository index');
        }

        // Sort by name
        const sorted = data.sort((a, b) =>
            (a.name || '').localeCompare(b.name || '')
        );

        renderRepositories(sorted);

    } catch (error) {
        console.error(error);
        fileList.replaceChildren();
        emptyState.hidden = true;
        errorState.hidden = false;
    }
}

// Load repositories on page load
loadRepositories();
