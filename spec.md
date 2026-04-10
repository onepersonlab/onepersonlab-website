# 任务：第一轮迭代 - 修复关键问题

## 背景

UX Architect 完成了设计审核，评分 7/10。需要修复以下高优先级问题。

## 高优先级任务（必须完成）

### 1. 论文数据真实化 🔴

**问题**: 当前论文数据是占位符（`xxxx.xxxxx`）

**解决方案**: 集成 Semantic Scholar API 获取真实论文数据

```typescript
// 使用 Semantic Scholar API
const API_URL = 'https://api.semanticscholar.org/graph/v1/paper/search';

// 搜索关键词
const queries = ['AI scientist', 'multi-agent research', 'autonomous scientific discovery'];

// 需要的字段
const fields = 'title,authors,abstract,url,publicationDate,venue,citationCount';
```

**实现要点**:
- 创建 `usePapers.ts` hook
- 支持加载状态和错误处理
- 论文数量：10-15 篇
- 搜索相关度高、引用数高的论文

### 2. Hero 文案优化 🔴

**当前问题**: 层次不够清晰，核心价值不够突出

**改进方案**:

```tsx
// Hero 结构优化
<h1 className="text-5xl md:text-7xl font-extrabold mb-6">OnePersonLab</h1>
<p className="text-2xl md:text-3xl text-blue-100 font-medium mb-4">
  每个人都可以成为科学家
</p>
<p className="text-lg md:text-xl text-blue-200 max-w-3xl mx-auto mb-8">
  通过多智能体协作系统，让单个研究者拥有整个实验室的能力
</p>
```

**要求**:
- 添加行动召唤按钮（CTA）
- 优化字体层次（主标题 → 副标题 → 描述 → CTA）
- 可选：添加背景装饰元素

### 3. 添加微动画 🟡

**需要添加的动画**:

```css
/* 卡片悬停提升效果 */
.card-hover-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.card-hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

/* 平滑滚动 */
html {
  scroll-behavior: smooth;
}

/* 页面入场动画 */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### 4. GitHub 仓库展示优化 🟡

**改进点**:
- 添加语言颜色标识（参考 GitHub 官方配色）
- 添加排序功能（按 Stars/Issues/更新日期）
- 优化移动端展示（小屏幕用卡片视图）

## 中优先级任务（时间允许则做）

### 5. 导航状态高亮

- 使用 IntersectionObserver 检测当前区块
- 高亮对应的导航项

### 6. 返回顶部按钮

- 滚动超过 500px 后显示
- 点击平滑滚动到顶部

## 交付物

1. 更新后的代码，推送到 GitHub
2. 简短的更新说明（改了什么）

## 验收标准

- 论文数据来自真实 API，无占位符
- Hero 文案层次清晰，有 CTA
- 卡片有悬停动画效果
- 本地预览正常

## 注意

- 你有 GitHub 读写权限
- Semantic Scholar API 无需 API Key
- 完成后推送到 GitHub，Actions 会自动部署
