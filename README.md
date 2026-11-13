
# downloads.garinasset.com

A modern directory browser for publicly available repositories with GitHub Pages enabled.

## Features

- 📁 DirectoryLister-style interface for browsing repositories
- 🌙 Light/Dark theme toggle with localStorage persistence
- 🔄 Automatic GitHub repository discovery
- 📊 Displays only public repositories with GitHub Pages enabled
- ⚡ Responsive design (mobile, tablet, desktop)
- 🤖 Scheduled auto-sync every 6 hours
- ✨ Clean, minimal UI with no search/download features

## Project Structure

```
.
├── .github/
│   └── workflows/
│       ├── deploy.yml                 # Main deployment workflow
│       └── sync-repositories.yml      # 6-hour auto-sync workflow
├── assets/
│   ├── css/
│   │   └── style.css                  # Light/Dark theme styling
│   └── js/
│       └── app.js                     # Theme toggle & repo loading
├── index.html                         # DirectoryLister-style UI
├── repositories.json                  # Auto-generated repo list
└── README.md                          # This file
```

## How It Works

### Automatic Discovery

The workflows scan your GitHub account (`garinasset`) and identify all public repositories with GitHub Pages enabled.

### Repository Display

Each repository is displayed as a directory entry:
- **Icon**: 📁 (folder icon)
- **Name**: Repository name
- **SHA-256**: — (empty, as directories have no hash)
- **Link**: Points to `downloads.garinasset.com/{repository-name}`

### Data File

The `repositories.json` file is auto-generated and contains:

```json
[
  {
    "name": "repository-name",
    "url": "https://github.com/garinasset/repository-name",
    "description": "Repository description"
  }
]
```

## Configuration

### GitHub Pages Setup

1. Go to **Settings → Pages**
2. Set **Source** to "Deploy from a branch"
3. Select branch: `main`, folder: `/ (root)`
4. Configure custom domain: `downloads.garinasset.com`

### Workflows

**Deploy Workflow** (`deploy.yml`):
- Triggers on push to `main`
- Generates `repositories.json` via GitHub API
- Deploys to GitHub Pages
- Manual trigger available

**Sync Workflow** (`sync-repositories.yml`):
- Runs every 6 hours (cron: `0 */6 * * *`)
- Scans for new/changed repositories
- Auto-commits updates to `repositories.json`
- Manual trigger available

## UI Features

### Header
- **Logo**: "downloads.garinasset.com"
- **Theme Toggle**: Light/Dark mode button (💡)
- **Breadcrumb**: Shows "Home" (currently at root level)

### Directory Table
- **Columns**: Name | SHA-256
- **Rows**: Directory entries with folder icons
- **Styling**: Hover effects, responsive layout

### Theme System

Themes are stored in `localStorage`:
- Key: `theme-preference`
- Values: `'light'` or `'dark'`
- Default: `'light'`
- Toggle: Click the 💡 icon in the header

## Development

### Manual Repository Sync

Trigger via GitHub Actions:
1. Go to your repository on GitHub
2. **Actions** → **Sync Repositories** → **Run workflow**

### Testing Locally

```bash
# View current repositories
cat repositories.json

# Test styling
open index.html  # in your browser
```

## API Limitations

- Uses GitHub's public API (unauthenticated)
- Rate limit: 60 requests/hour for unauthenticated requests
- Pagination: Handles up to 100 repositories per page automatically
- Scans: Only public repositories with `has_pages: true`

## License

MIT

---

**Custom Domain**: downloads.garinasset.com
**Built with**: Vanilla HTML/CSS/JavaScript
**Data Source**: GitHub API
**Theme Inspiration**: DirectoryLister

