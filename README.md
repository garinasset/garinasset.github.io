# downloads.garinasset.com

A static homepage listing manually configured project directories.
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

## Directory configuration

Edit [repositories.json](repositories.json) to manage the displayed directories.
Currently it contains only:

```json
[
  {
    "name": "updns"
  }
]
```

Each entry's `name` is both the displayed directory name and the URL path.
Names may contain letters, numbers, dots, underscores, and hyphens, but cannot
be `.` or `..`. Entries are sorted by name; the homepage repository remains
excluded. There is no automatic repository scanning or GitHub API request.

## Deployment

In **Settings > Pages**, choose **GitHub Actions** as the source and set the custom
domain to `downloads.garinasset.com`. Keep the existing `Home` deployment
environment permitted to deploy from `main`.

The single [deployment workflow](.github/workflows/deploy.yml) runs on pushes to
`main` and manually via **Actions > Deploy Website > Run workflow**.
It copies the configured JSON unchanged alongside the website and uploads only
the built site. There is no scheduled synchronization or data generation.
The published root includes ICO, SVG, and PNG favicons, the Apple touch icon,
and the web manifest with both of its PNG icons. HTML declares their formats
and sizes; browsers choose the supported favicon without a prefetch hint.

Project Pages must be configured to serve at the requested custom-domain path.
This homepage creates links only; it does not deploy or proxy the project websites.

## Local preview

```sh
python3 -m http.server 8080 --bind 127.0.0.1
```

Open <http://127.0.0.1:8080/> rather than opening the HTML as a file, so the browser
can fetch the JSON index. Directory links intentionally target the real domain.
Local preview and deployment use the same checked-in JSON configuration.

## Tests

```sh
node --check assets/js/app.js
```
