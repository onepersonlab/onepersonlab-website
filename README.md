# OnePersonLab Website

[English](#english) | [中文](#中文)

---

<a name="english"></a>
## English

### 🚀 OnePersonLab - AI Agent Ecosystem Dashboard

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

<a name="中文"></a>
## 中文

### 🚀 OnePersonLab - AI 智能体生态仪表板

OnePersonLab 是一个展示 AI 智能体生态的仪表板网站，包括：

- **#agents** - AI 智能体仓库（研究类 + 通用类）
- **#papers** - 多智能体学术论文
- **#skills** - 智能体技能（GitHub + ClawHub）

### 功能特性

- 📊 实时 GitHub 统计（Stars、Forks、日变化）
- 📚 学术论文集成 Semantic Scholar
- 🛠️ 技能市场集成（ClawHub）
- 🎨 现代设计风格（Tailwind CSS v4）
- 📱 响应式布局

### 技术栈

| 组件 | 技术 |
|------|------|
| 框架 | React 19 |
| 构建工具 | Vite |
| 样式 | Tailwind CSS v4.2 |
| 语言 | TypeScript |
| 部署 | GitHub Pages |

### 配色方案

| 颜色 | Hex | 用途 |
|------|-----|------|
| 深海军蓝 | `#0A1628` | 背景 |
| 电光薄荷 | `#00E5A0` | 强调色 |
| 柔银灰 | `#E8EDF2` | 文字 |
| 暖琥珀 | `#F5A623` | 高亮 |

### 数据来源

- **GitHub API** - 仓库统计
- **Semantic Scholar API** - 论文元数据
- **OpenAlex API** - 论文备用源
- **Crossref API** - DOI 解析
- **ClawHub API** - 技能市场

### 自动更新

- **每天凌晨 5:00（北京时间）** - 更新仓库统计
- **每天凌晨 5:30（北京时间）** - 审核数据完整性
- **自动部署** 到 GitHub Pages

### 脚本命令

```bash
# 更新仓库统计
./scripts/update-repo-stats.sh

# 审核数据完整性
./scripts/audit-data-completeness.sh --all --deploy

# 更新论文统计
./scripts/update-papers-stats.sh

# 更新 ClawHub 技能
./scripts/update-clawhub-skills.sh
```

### 开发指南

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 生产构建
npm run build

# 预览构建
npm run preview
```

### 部署说明

网站部署到 GitHub Pages：
- **网址**: https://onepersonlab.com
- **分支**: `gh-pages`
- **自动部署**: 每次数据更新后自动部署

### 相关项目

- [HiClaw](https://github.com/agentscope-ai/HiClaw) - 多智能体运行平台
- [OpenClaw](https://github.com/openclaw/openclaw) - 智能体运行框架
- [ClawHub](https://clawhub.ai) - 技能市场

---

## License

MIT License

## Author

**OnePersonLab Team**

---

*Built with ❤️ for the AI Agent community*