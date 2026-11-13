
const directory = document.getElementById(
    "repository-directory"
);

const searchInput = document.getElementById(
    "repository-search"
);

const repositoryCount = document.getElementById(
    "repository-count"
);

const emptyState = document.getElementById(
    "empty-state"
);

const errorState = document.getElementById(
    "error-state"
);

document.getElementById("current-year").textContent =
    new Date().getFullYear();

let repositories = [];

/**
 * Validate repository URL.
 * Only allow links to github.com.
 */
function isValidRepositoryUrl(value) {
    try {
        const url = new URL(value);

        return (
            url.protocol === "https:" &&
            url.hostname === "github.com"
        );
    } catch {
        return false;
    }
}

/**
 * Render repository links.
 */
function renderRepositories(items) {

    directory.replaceChildren();

    emptyState.hidden = items.length !== 0;

    if (items.length === 0) {
        return;
    }

    const fragment = document.createDocumentFragment();

    items.forEach(repo => {

        if (
            !repo ||
            typeof repo.name !== "string" ||
            typeof repo.url !== "string" ||
            !isValidRepositoryUrl(repo.url)
        ) {
            return;
        }

        const link = document.createElement("a");

        link.className = "repository-card";
        link.href = repo.url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";

        const name = document.createElement("span");

        name.className = "repository-name";
        name.textContent = repo.name;

        const arrow = document.createElement("span");

        arrow.className = "repository-arrow";
        arrow.textContent = "↗";

        link.appendChild(name);
        link.appendChild(arrow);

        fragment.appendChild(link);
    });

    directory.appendChild(fragment);

    emptyState.hidden =
        directory.children.length !== 0;
}

/**
 * Search repositories.
 */
function searchRepositories() {

    const keyword = searchInput.value
        .trim()
        .toLowerCase();

    const filtered = repositories.filter(repo =>
        repo.name.toLowerCase().includes(keyword)
    );

    renderRepositories(filtered);
}

/**
 * Load repository index.
 */
async function loadRepositories() {

    try {

        const response = await fetch(
            "./repositories.json?t=" + Date.now(),
            {
                cache: "no-store"
            }
        );

        if (!response.ok) {
            throw new Error("Unable to load repository index");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error("Invalid repository index");
        }

        repositories = data
            .filter(repo =>
                repo &&
                typeof repo.name === "string" &&
                typeof repo.url === "string" &&
                isValidRepositoryUrl(repo.url)
            )
            .sort((a, b) =>
                a.name.localeCompare(b.name)
            );

        repositoryCount.textContent =
            repositories.length;

        errorState.hidden = true;

        searchRepositories();

    } catch (error) {

        console.error(error);

        directory.replaceChildren();

        repositoryCount.textContent = "--";

        emptyState.hidden = true;
        errorState.hidden = false;
    }
}

searchInput.addEventListener(
    "input",
    searchRepositories
);

loadRepositories();
