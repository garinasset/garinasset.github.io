import assert from 'node:assert/strict';
import test from 'node:test';
import { discoverRepositories } from './build-index.mjs';

function repo(name, overrides = {}) {
    return { name, private: false, has_pages: true, owner: { login: 'garinasset' }, ...overrides };
}

function response(data) {
    return { ok: true, json: async () => data };
}

test('includes only owned public Pages repositories, excludes the homepage, and sorts names', async () => {
    const result = await discoverRepositories(async () => response([
        repo('zeta'), repo('alpha'), repo('GarinAsset.github.io'),
        repo('private', { private: true }), repo('no-pages', { has_pages: false }),
        repo('other-owner', { owner: { login: 'someone-else' } })
    ]), '');
    assert.deepEqual(result, [{ name: 'alpha' }, { name: 'zeta' }]);
});

test('fetches every page and authenticates requests', async () => {
    const requests = [];
    const result = await discoverRepositories(async (url, options) => {
        requests.push({ url, options });
        return response(requests.length === 1
            ? Array.from({ length: 100 }, (_, i) => repo(`project-${i}`))
            : [repo('last-project')]);
    }, 'test-token');
    assert.equal(result.length, 101);
    assert.equal(requests.length, 2);
    assert.match(requests[1].url, /page=2$/);
    assert.equal(requests[0].options.headers.Authorization, 'Bearer test-token');
});

test('does not return a partial index when a later page fails', async () => {
    let page = 0;
    await assert.rejects(discoverRepositories(async () => {
        page++;
        return page === 1
            ? response(Array.from({ length: 100 }, (_, i) => repo(`project-${i}`)))
            : { ok: false, status: 403 };
    }, ''), /page 2: HTTP 403/);
});

test('rejects malformed API data', async () => {
    for (const data of [{ message: 'API error' }, [null], [{ name: 'missing-flags' }]]) {
        await assert.rejects(discoverRepositories(async () => response(data), ''), /Invalid GitHub/);
    }
});

test('allows an empty successful index', async () => {
    assert.deepEqual(await discoverRepositories(async () => response([]), ''), []);
});
