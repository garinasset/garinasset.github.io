# downloads.garinasset.com

A static homepage listing public GitHub Pages projects owned by `garinasset`.
The homepage repository `garinasset.github.io` is excluded. Repository contents
are not crawled. Every directory links to
`https://downloads.garinasset.com/{repository-name}/`.

## Interface

- Directory tree logo, centered domain title, and centered Home navigation.
- Directory Lister-inspired light/dark colors, vertical lightbulb toggle,
  borderless directory rows, and centered footer with four icon links.
- Name, Size, and SHA-256 columns; directories show an em dash for Size and SHA-256.
- All three columns remain visible on mobile, with compact spacing and text.
- Theme preference persists in localStorage; switching still works if storage is blocked.
- Fonts load from Google Fonts; icons load from the pinned Font Awesome CDN stylesheet.
- The footer says "Inspired by Directory Lister" because this site uses GitHub Pages,
  not the Directory Lister application. GitHub links to `garinasset`; the other
  footer links retain the reference project's community destinations.

## Deployment and discovery

In **Settings > Pages**, choose **GitHub Actions** as the source and set the custom
domain to `downloads.garinasset.com`. Keep the existing `downloads` deployment
environment permitted to deploy from `main`.

The single [deployment workflow](.github/workflows/deploy.yml) runs on pushes to
`main`, every six hours, and manually via **Actions > Deploy Website > Run workflow**.
It tests the scanner, builds a fresh repository index, and uploads only the built
site. It does not commit generated data or require contents-write permission.

[The scanner](.github/scripts/build-index.mjs) paginates the GitHub repository API,
checks ownership, public visibility, and `has_pages`, and excludes the homepage.
Actions uses its built-in GitHub token. API or validation failures stop deployment
instead of publishing an incomplete index.

Project Pages must be configured to serve at the requested custom-domain path.
This homepage creates links only; it does not deploy or proxy the project websites.

## Local preview

```sh
node .github/scripts/build-index.mjs
python3 -m http.server 8080 --bind 127.0.0.1
```

Open <http://127.0.0.1:8080/> rather than opening the HTML as a file, so the browser
can fetch the JSON index. Directory links intentionally target the real domain.
The checked-in JSON is a local preview snapshot; deployment always regenerates it.

## Tests

```sh
node --test .github/scripts/build-index.test.mjs
node --check assets/js/app.js
```
