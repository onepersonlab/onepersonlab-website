import { VisionSection } from './components/Vision/VisionSection';
import { RepoShowcase } from './components/RepoShowcase/RepoShowcase';
import { PaperList } from './components/PaperList/PaperList';
import { ProjectLinks } from './components/ProjectLinks/ProjectLinks';
import { ThemeToggle } from './components/ThemeToggle/ThemeToggle';
import { useRepoData } from './hooks/useRepoData';
import { usePapers } from './hooks/usePapers';
import type { ProjectLink } from './types';

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
  const { papers, isLoading: papersLoading, error: papersError } = usePapers();

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
      <section className="bg-gradient-to-br from-brand-primary to-brand-accent text-white py-24 relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="hero-title mb-6 animate-fade-in">
            OnePersonLab
          </h1>
          <p className="hero-subtitle text-blue-100 mb-4 animate-fade-in">
            每个人都可以成为科学家
          </p>
          <p className="text-base md:text-lg text-blue-200 max-w-3xl mx-auto mb-8 animate-fade-in">
            通过多智能体协作系统，让单个研究者拥有整个实验室的能力
          </p>
          
          {/* CTA 按钮 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <a 
              href="#repos"
              className="inline-flex items-center justify-center px-6 py-2.5 
                         bg-white text-brand-primary font-semibold rounded-lg
                         hover:bg-blue-50 transition-all duration-200
                         button-press
                         focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-primary"
            >
              探索工具
              <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </a>
            <a 
              href="https://github.com/onepersonlab"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-2.5 
                         bg-transparent border-2 border-white text-white font-semibold rounded-lg
                         hover:bg-white/10 transition-all duration-200
                         button-press
                         focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-primary"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
          </div>
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
        <PaperList papers={papers} isLoading={papersLoading} />
        {papersError && (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <p className="text-center text-error">加载论文数据失败：{papersError}</p>
          </div>
        )}
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
