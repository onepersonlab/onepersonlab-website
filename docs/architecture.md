# OnePersonLab Website Architecture

## 技术栈

- **框架**: React 19 + TypeScript
- **构建工具**: Vite 8
- **样式**: Tailwind CSS 4
- **部署**: GitHub Pages / Vercel / Netlify

## 项目结构

```
onepersonlab-website/
├── public/              # 静态资源
│   └── images/          # 图片资源
├── src/
│   ├── components/      # 可复用组件
│   │   ├── Vision/      # 展望部分组件
│   │   ├── RepoShowcase/ # GitHub 仓库展示
│   │   ├── PaperList/   # 论文列表
│   │   └── ProjectLinks/ # 相关项目链接
│   ├── pages/           # 页面组件
│   │   └── Home.tsx     # 首页
│   ├── hooks/           # 自定义 Hooks
│   │   └── useRepoData.ts # GitHub API Hook
│   ├── types/           # TypeScript 类型定义
│   │   └── index.ts
│   ├── App.tsx          # 根组件
│   ├── main.tsx         # 入口文件
│   └── index.css        # 全局样式
├── docs/                # 文档
│   └── architecture.md  # 本文件
└── package.json
```

## 页面架构

### 首页 (Home)

```
┌─────────────────────────────────────────┐
│           Header / Navigation           │
├─────────────────────────────────────────┤
│                                         │
│            Hero Section                 │
│      "OnePersonLab" 标题 + Slogan       │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│           Vision Section                │
│  - 每个人都可以成为科学家               │
│  - 每个科学家都是一个 group             │
│  - 多智能体系统是研究者的合作伙伴       │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│        GitHub Repos Showcase            │
│  - 搜索/过滤工具                        │
│  - 表格展示：star, issues, 更新日期等   │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│           Related Papers                │
│  - ArXiv API / Literature-review 集成   │
│  - 论文卡片展示                         │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│        Related Projects                 │
│  - 项目链接 + 简介                      │
│                                         │
├─────────────────────────────────────────┤
│              Footer                     │
└─────────────────────────────────────────┘
```

## 组件设计

### VisionSection

展示 OnePersonLab 的核心理念。

```tsx
interface VisionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}
```

### RepoShowcase

展示 GitHub 仓库数据。

```tsx
interface RepoData {
  name: string;
  description: string;
  stargazers_count: number;
  open_issues_count: number;
  updated_at: string;
  html_url: string;
}

interface RepoTableProps {
  repos: RepoData[];
  onSearch: (query: string) => void;
}
```

### PaperList

展示相关论文。

```tsx
interface Paper {
  title: string;
  authors: string[];
  abstract: string;
  url: string;
  publishedDate: string;
}
```

## 数据流

1. **GitHub 数据**: 通过 GitHub REST API v3 获取
   - Endpoint: `https://api.github.com/orgs/onepersonlab/repos`
   - 使用自定义 Hook `useRepoData` 管理状态

2. **论文数据**: 通过 ArXiv API 或 Semantic Scholar API
   - 使用 literature-review 技能集成

3. **状态管理**: React Context + useReducer（初期不需要 Redux）

## 性能优化策略

- **代码分割**: 按路由/组件懒加载
- **图片优化**: WebP 格式，响应式图片
- **缓存**: React Query 缓存 API 数据
- **Core Web Vitals**:
  - LCP < 2.5s：优化首屏渲染
  - FID < 100ms：减少 JavaScript 执行时间
  - CLS < 0.1：预留图片/广告位

## 可访问性 (a11y)

- 语义化 HTML 标签
- ARIA labels for interactive elements
- 键盘导航支持
- 颜色对比度符合 WCAG 2.1 AA

## 后续扩展

- 添加博客/新闻部分
- 多语言支持 (i18n)
- 暗色模式
- 分析集成 (Google Analytics / Plausible)
