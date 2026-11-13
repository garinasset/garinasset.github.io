import { writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const OWNER = 'garinasset';
const HOME_REPOSITORY = `${OWNER}.github.io`;

export async function discoverRepositories(request = fetch, token = process.env.GH_TOKEN) {
    const repositories = [];
    const headers = {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'garinasset-pages-directory'
    };
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    for (let page = 1; ; page++) {
        const response = await request(
            `https://api.github.com/users/${OWNER}/repos?type=owner&per_page=100&page=${page}`,
            { headers, signal: AbortSignal.timeout(30000) }
        );
        if (!response.ok) {
            throw new Error(`Repository discovery failed on page ${page}: HTTP ${response.status}`);
        }
        const data = await response.json();
        if (!Array.isArray(data) || data.some(repo =>
            !repo || typeof repo.name !== 'string' ||
            typeof repo.private !== 'boolean' || typeof repo.has_pages !== 'boolean' ||
            typeof repo.owner?.login !== 'string'
        )) {
            throw new Error(`Invalid GitHub repository response on page ${page}`);
        }

        for (const repo of data) {
            if (!repo.private && repo.has_pages &&
                repo.owner.login.toLowerCase() === OWNER &&
                repo.name.toLowerCase() !== HOME_REPOSITORY) {
                repositories.push({ name: repo.name });
            }
        }
        if (data.length < 100) {
            return repositories.sort((a, b) => a.name.localeCompare(b.name, 'en'));
        }
    }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    try {
        const repositories = await discoverRepositories();
        await writeFile(process.argv[2] || 'repositories.json', `${JSON.stringify(repositories, null, 2)}\n`);
        console.log(`Indexed ${repositories.length} public Pages repositories (excluding ${HOME_REPOSITORY}).`);
    } catch (error) {
        console.error('Unable to generate repository index:', error);
        process.exitCode = 1;
    }
}
