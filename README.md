# OnePersonLab-Agents Website

## 🌐 Official Documentation Site

Built with [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/).

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pip install mkdocs-material
```

### 2. Local Development

```bash
cd website
mkdocs serve
```

Visit: http://127.0.0.1:8000

### 3. Build for Production

```bash
mkdocs build
```

Output: `site/` directory

### 4. Deploy to GitHub Pages

```bash
mkdocs gh-deploy
```

---

## 📁 Structure

```
website/
├── docs/
│   ├── index.md              # Homepage
│   ├── agents/               # Agent documentation
│   │   ├── overview.md
│   │   └── biology.md
│   ├── skills/               # Skills system
│   │   └── universal.md
│   ├── protocols/            # Protocols
│   │   ├── index.md
│   │   └── skills.md
│   └── examples/             # Use cases
│       ├── index.md
│       ├── single-discipline.md
│       ├── cross-discipline.md
│       └── matbench.md
├── mkdocs.yml                # Configuration
├── requirements.txt          # Dependencies
└── README.md                 # This file
```

---

## 🎨 Customization

### Change Theme Colors

Edit `mkdocs.yml`:

```yaml
theme:
  palette:
    - primary: indigo  # Change to: blue, green, red, etc.
```

### Add Custom CSS

Create `docs/assets/stylesheets/extra.css` and reference in `mkdocs.yml`.

---

## 📝 Adding Content

1. Create new `.md` file in `docs/`
2. Add to navigation in `mkdocs.yml`
3. Run `mkdocs serve` to preview
4. Commit and push

---

## 🔗 Links

- **Main Repository**: https://github.com/onepersonlab/onepersonlab-agents
- **Material for MkDocs**: https://squidfunk.github.io/mkdocs-material/
- **MkDocs Documentation**: https://www.mkdocs.org/

---

**License**: MIT
