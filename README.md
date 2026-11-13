
# 嘉林资产 Repository Directory

Automatic public GitHub repository directory.

## Features

- Automatically discovers public repositories owned by garinasset.
- Generates a JSON repository index.
- Displays repository names as hyperlinks.
- Supports repository search.
- Daily automatic synchronization.
- Manual synchronization through GitHub Actions.
- No repository content crawling.

## Project Structure

```text
.
├── .github/
│   └── workflows/
│       └── update-repositories.yml
├── assets/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── app.js
├── index.html
├── repositories.json
└── README.md
```

## GitHub Pages

Open:

Settings → Pages

Configure:

- Source: Deploy from a branch
- Branch: main
- Folder: / (root)

## Automatic Synchronization

GitHub Actions automatically updates the repository index every day.

You can also trigger it manually:

Actions → Update Repository Directory → Run workflow

## Repository Scope

Only public repositories owned by `garinasset` are included.

Repository README files and internal directories are never accessed.

## License

MIT
