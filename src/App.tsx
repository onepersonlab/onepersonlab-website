import { VisionSection } from './components/Vision/VisionSection';
import { RepoShowcase } from './components/RepoShowcase/RepoShowcase';
import { PaperList } from './components/PaperList/PaperList';
import { ProjectLinks } from './components/ProjectLinks/ProjectLinks';
import { useRepoData } from './hooks/useRepoData';
import type { Paper, ProjectLink } from './types';

// 示例论文数据（后续可通过 API 获取）
const samplePapers: Paper[] = [
  {
    title: 'AI Scientists: Towards Fully Autonomous Knowledge Discovery',
    authors: ['Xin Liu', 'Cheng Tang', 'et al.'],
    abstract: 'We propose a framework for autonomous scientific discovery using multi-agent AI systems...',
    url: 'https://arxiv.org/abs/xxxx.xxxxx',
    publishedDate: '2024-01-15',
    venue: 'arXiv preprint',
  },
  {
    title: 'Collaborative Agents for Research Automation',
    authors: ['Jane Smith', 'John Doe'],
    abstract: 'This paper presents a multi-agent architecture for automating literature review and hypothesis generation...',
    url: 'https://arxiv.org/abs/xxxx.xxxxx',
    publishedDate: '2024-02-20',
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
  const { repos, isLoading, error } = useRepoData('onepersonlab');

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="主导航">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <a href="/" className="text-2xl font-bold text-blue-600">
                OnePersonLab
              </a>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#vision" className="text-gray-600 hover:text-gray-900">愿景</a>
              <a href="#repos" className="text-gray-600 hover:text-gray-900">仓库</a>
              <a href="#papers" className="text-gray-600 hover:text-gray-900">论文</a>
              <a href="#projects" className="text-gray-600 hover:text-gray-900">项目</a>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            OnePersonLab
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            每个人都可以成为科学家，每个科学家都是一个团队
          </p>
        </div>
      </section>

      {/* Vision Section */}
      <div id="vision">
        <VisionSection />
      </div>

      {/* GitHub Repos Section */}
      <div id="repos">
        {error ? (
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <p className="text-red-600">加载仓库数据失败：{error}</p>
            </div>
          </section>
        ) : (
          <RepoShowcase repos={repos} isLoading={isLoading} />
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

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2026 OnePersonLab. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a 
                href="https://github.com/onepersonlab" 
                className="text-gray-400 hover:text-white"
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
