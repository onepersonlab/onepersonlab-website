# OnePersonLab Website

**[中文版本 (Chinese Version)](./README_CN.md)**

---

## 🚀 OnePersonLab - AI Agent Ecosystem Dashboard

OnePersonLab is a dashboard website showcasing the AI agent ecosystem, including:

- **#agents** - AI Agent Repositories (Research + General categories)
- **#papers** - Multi-agent Academic Papers
- **#skills** - Agent Skills (GitHub + ClawHub)

### Features

- 📊 Real-time GitHub stats (Stars, Forks, Daily changes)
- 📚 Academic papers with Semantic Scholar integration
- 🛠️ Skills marketplace integration (ClawHub)
- 🎨 Modern design with Tailwind CSS v4
- 📱 Responsive layout

### Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | React 19 |
| Build Tool | Vite |
| Styling | Tailwind CSS v4.2 |
| Language | TypeScript |
| Deployment | GitHub Pages |

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Deep Navy | `#0A1628` | Background |
| Electric Mint | `#00E5A0` | Accent |
| Soft Silver | `#E8EDF2` | Text |
| Warm Amber | `#F5A623` | Highlights |

### Data Sources

- **GitHub API** - Repository stats
- **Semantic Scholar API** - Paper metadata
- **OpenAlex API** - Paper backup source
- **Crossref API** - DOI resolution
- **ClawHub API** - Skills marketplace

### Automated Updates

- **Daily at 5:00 AM (CST)** - Update repository stats
- **Daily at 5:30 AM (CST)** - Audit data completeness
- **Auto-deploy** to GitHub Pages after updates

### Scripts

```bash
# Update repository stats
./scripts/update-repo-stats.sh

# Audit data completeness
./scripts/audit-data-completeness.sh --all --deploy

# Update papers stats
./scripts/update-papers-stats.sh

# Update ClawHub skills
./scripts/update-clawhub-skills.sh
```

### Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Preview build
npm run preview
```

### Deployment

The site is deployed to GitHub Pages:
- **URL**: https://onepersonlab.com
- **Branch**: `gh-pages`
- **Auto-deploy**: After each data update

### Related Projects

- [HiClaw](https://github.com/agentscope-ai/HiClaw) - Multi-agent runtime platform
- [OpenClaw](https://github.com/openclaw/openclaw) - Agent runtime framework
- [ClawHub](https://clawhub.ai) - Skills marketplace

---

## License

MIT License

## Author

**OnePersonLab Team**

---

*Built with ❤️ for the AI Agent community*