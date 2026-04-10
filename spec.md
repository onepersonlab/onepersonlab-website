# 任务：第二轮迭代 - 视觉细节优化

## 用户反馈

用户对第一轮迭代不满意：
- 图标太大
- 字体不好看

## 重点改进任务

### 1. 图标大小优化 🔴 高优先级

**问题**: 图标过大，影响页面美观

**改进方案**:

检查所有图标使用位置：
- ThemeToggle 中的图标
- Hero CTA 按钮中的箭头图标
- PaperList 中的链接图标
- RepoShowcase 中的排序图标

**建议尺寸**:
- 导航按钮图标：`w-5 h-5` (20px)
- 普通按钮图标：`w-4 h-4` (16px)
- 链接图标：`w-4 h-4` (16px)
- 小型指示图标：`w-3 h-3` (12px)

**代码示例**:
```tsx
// ThemeToggle - 当前可能过大
<button className="...">
  <svg className="w-5 h-5" ...>  // 改为 w-5 h-5 或更小
</button>

// CTA 按钮
<a className="...">
  探索工具
  <svg className="w-4 h-4 ml-2" ...>  // 改为 w-4 h-4
</a>
```

### 2. 字体优化 🔴 高优先级

**问题**: 字体不好看，需要更好的排版

**改进方案**:

#### A. 使用更现代的字体

推荐使用 Inter 字体（现代、清晰、适合科技感网站）：

```css
/* 在 index.css 或 design-system.css 中添加 */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* 标题使用更重的字重 */
h1, h2, h3 {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
}
```

#### B. 优化字号和行高

```css
/* 更舒适的正文行高 */
body {
  line-height: 1.6;  /* 从 1.5 提升到 1.6 */
}

/* Hero 标题优化 */
.hero-title {
  font-size: 3.5rem;  /* 56px - 比原来的 72px 更合适 */
  font-weight: 800;
  letter-spacing: -0.02em;  /* 紧凑一点 */
}

/* 副标题优化 */
.hero-subtitle {
  font-size: 1.75rem;  /* 28px */
  font-weight: 600;
}
```

#### C. 优化字重层次

```css
/* 字重系统 */
--font-weight-regular: 400;    /* 正文 */
--font-weight-medium: 500;     /* 次标题、导航 */
--font-weight-semibold: 600;   /* 卡片标题 */
--font-weight-bold: 700;       /* 区块标题 */
--font-weight-extrabold: 800;  /* Hero 标题 */
```

### 3. 整体视觉协调 🟡 中优先级

**改进点**:
- 检查所有元素的视觉比例
- 确保间距一致（基于 4px 或 8px 网格）
- 优化按钮大小和内边距
- 确保图标和文字的比例协调

### 4. 参考 UX Architect 建议

回顾设计审核报告中的建议：
- 视觉层次优化
- 配色渐变对比度
- 字体排版系统

## 交付物

1. 更新后的代码
2. 推送到 GitHub
3. 简短说明改了什么

## 验收标准

- 图标大小合理（不超过按钮/文字大小）
- 使用 Inter 或其他现代字体
- 字重层次清晰
- 整体视觉协调

## 注意

- 你有 GitHub 读写权限
- 完成后推送到 GitHub，Actions 会自动部署
- 可以用 browser 技能查看效果对比
