import { VisionSection } from './components/Vision/VisionSection';
import { RepoShowcase } from './components/RepoShowcase/RepoShowcase';
import { PaperList } from './components/PaperList/PaperList';
import { ProjectLinks } from './components/ProjectLinks/ProjectLinks';
import { ThemeToggle } from './components/ThemeToggle/ThemeToggle';
import { useRepoData } from './hooks/useRepoData';
import type { Paper, ProjectLink } from './types';

// 示例论文数据（后续可通过 API 获取）
const samplePapers: Paper[] = [
  {
    title: 'AI Scientists: Towards Fully Autonomous Knowledge Discovery',
    authors: ['Xin Liu', 'Cheng Tang', 'Jiayi Geng', 'et al.'],
    abstract: 'We propose a framework for autonomous scientific discovery using multi-agent AI systems. Our approach enables researchers to conduct literature review, hypothesis generation, and experimental design with AI collaboration.',
    url: 'https://arxiv.org/abs/2401.12345',
    publishedDate: '2024-01-15',
    venue: 'arXiv preprint',
  },
  {
    title: 'Collaborative Agents for Research Automation: A Multi-Agent Approach',
    authors: ['Jane Smith', 'John Doe', 'Alice Chen'],
    abstract: 'This paper presents a multi-agent architecture for automating literature review and hypothesis generation. We demonstrate how collaborative AI agents can accelerate the research process while maintaining scientific rigor.',
    url: 'https://arxiv.org/abs/2402.67890',
    publishedDate: '2024-02-20',
    venue: 'arXiv preprint',
  },
  {
    title: 'Language Models as Scientific Agents: Opportunities and Challenges',
    authors: ['Michael Zhang', 'Sarah Johnson'],
    abstract: 'We explore the potential and limitations of using large language models as autonomous agents in scientific research. Our analysis covers current capabilities, ethical considerations, and future directions.',
    url: 'https://arxiv.org/abs/2403.11111',
    publishedDate: '2024-03-10',
    venue: 'arXiv preprint',
  },
];

// 示例项目数据
const sampleProjects: ProjectLink[] = [
  {
    name: 'AI Scientist',
    description: '自动化科学研究的多智能体系统',
    url: 'https://github.com/onepersonlab/ai-scientist',
    tags: ['AI', 'Research'],
  },
  {
    name: 'Paper Reviewer',
    description: '智能论文评审助手',
    url: 'https://github.com/onepersonlab/paper-reviewer',
    tags: ['NLP', 'Review'],
  },
];

function App() {
  const { repos, isLoading, error, refresh, lastUpdated } = useRepoData('onepersonlab');

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900 theme-transition">
      {/* 跳过导航链接 - 无障碍增强 */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
                   bg-brand-primary text-white px-4 py-2 rounded-lg z-50
                   focus:ring-2 focus:ring-brand-primary focus:outline-none"
      >
        跳转到主要内容
      </a>

      {/* Header */}
      <header className="bg-white dark:bg-neutral-900 shadow-sm sticky top-0 z-50 theme-transition">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="主导航">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <a href="/" className="text-2xl font-bold text-brand-primary">
                OnePersonLab
              </a>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center space-x-8">
                <a href="#vision" className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">愿景</a>
                <a href="#repos" className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">仓库</a>
                <a href="#papers" className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">论文</a>
                <a href="#projects" className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">项目</a>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-primary to-brand-secondary text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            OnePersonLab
          </h1>
          <p className="text-2xl md:text-3xl font-medium mb-4">
            每个人都可以成为科学家
          </p>
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto">
            通过多智能体协作，让单个研究者拥有整个实验室的能力
          </p>
        </div>
      </section>

      {/* Main Content - 跳过导航链接目标 */}
      <main id="main-content">
        {/* Vision Section */}
        <div id="vision">
          <VisionSection />
        </div>

      {/* GitHub Repos Section */}
      <div id="repos">
        {error ? (
          <section className="py-20 bg-white dark:bg-neutral-900">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <p className="text-error">加载仓库数据失败：{error}</p>
            </div>
          </section>
        ) : (
          <RepoShowcase 
            repos={repos} 
            isLoading={isLoading} 
            onRefresh={refresh}
            lastUpdated={lastUpdated}
          />
        )}
      </div>

      {/* Papers Section */}
      <div id="papers">
        <PaperList papers={samplePapers} />
      </div>

      {/* Projects Section */}
      <div id="projects">
        <ProjectLinks projects={sampleProjects} />
      </div>
      </main>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-neutral-400 text-sm">
              © 2026 OnePersonLab. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a 
                href="https://github.com/onepersonlab" 
                className="text-neutral-400 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
