import { useState, useEffect } from 'react';

interface Repo {
  name: string;
  full_name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  weeklyStars: number;
  updated: string;
  url: string;
  owner: string;
}

// Real multi-agent / AI research repositories from Pantheon statistics
// Data source: https://github.com/cadslab/Pantheon
const AGENT_REPOS: Repo[] = [
  {
    name: 'autoresearch',
    full_name: 'karpathy/autoresearch',
    description: 'Automated research framework by Andrej Karpathy',
    language: 'Python',
    stars: 69949,
    forks: 10188,
    weeklyStars: 1200,
    updated: '2 days ago',
    url: 'https://github.com/karpathy/autoresearch',
    owner: 'karpathy',
  },
  {
    name: 'storm',
    full_name: 'stanford-oval/storm',
    description: 'STORM: A language model-powered knowledge curation system',
    language: 'Python',
    stars: 28066,
    forks: 2555,
    weeklyStars: 580,
    updated: '1 day ago',
    url: 'https://github.com/stanford-oval/storm',
    owner: 'stanford-oval',
  },
  {
    name: 'DeepResearch',
    full_name: 'Alibaba-NLP/DeepResearch',
    description: 'DeepResearch: Automated scientific research with LLM agents',
    language: 'Python',
    stars: 18631,
    forks: 1437,
    weeklyStars: 420,
    updated: '3 days ago',
    url: 'https://github.com/Alibaba-NLP/DeepResearch',
    owner: 'Alibaba-NLP',
  },
  {
    name: 'scientific-agent-skills',
    full_name: 'K-Dense-AI/scientific-agent-skills',
    description: 'Comprehensive skills for scientific AI agents',
    language: 'Python',
    stars: 18016,
    forks: 1987,
    weeklyStars: 380,
    updated: '1 day ago',
    url: 'https://github.com/K-Dense-AI/scientific-agent-skills',
    owner: 'K-Dense-AI',
  },
  {
    name: 'awesome-ai-research-writing',
    full_name: 'Leey21/awesome-ai-research-writing',
    description: 'Curated list of AI tools for research and writing',
    language: 'Unknown',
    stars: 16769,
    forks: 1344,
    weeklyStars: 320,
    updated: '2 weeks ago',
    url: 'https://github.com/Leey21/awesome-ai-research-writing',
    owner: 'Leey21',
  },
  {
    name: 'DeepTutor',
    full_name: 'HKUDS/DeepTutor',
    description: 'AI-powered intelligent tutoring system',
    language: 'Python',
    stars: 15736,
    forks: 2074,
    weeklyStars: 290,
    updated: '1 day ago',
    url: 'https://github.com/HKUDS/DeepTutor',
    owner: 'HKUDS',
  },
  {
    name: 'AI-Scientist',
    full_name: 'SakanaAI/AI-Scientist',
    description: 'The AI Scientist: Automated scientific research system',
    language: 'Python',
    stars: 13161,
    forks: 1881,
    weeklyStars: 250,
    updated: '1 week ago',
    url: 'https://github.com/SakanaAI/AI-Scientist',
    owner: 'SakanaAI',
  },
  {
    name: 'AutoResearchClaw',
    full_name: 'aiming-lab/AutoResearchClaw',
    description: 'Automated research agent framework for scientific discovery',
    language: 'Python',
    stars: 10895,
    forks: 1243,
    weeklyStars: 220,
    updated: '1 day ago',
    url: 'https://github.com/aiming-lab/AutoResearchClaw',
    owner: 'aiming-lab',
  },
  {
    name: 'local-deep-researcher',
    full_name: 'langchain-ai/local-deep-researcher',
    description: 'Local deep research agent powered by LangChain',
    language: 'Python',
    stars: 9015,
    forks: 949,
    weeklyStars: 180,
    updated: '3 days ago',
    url: 'https://github.com/langchain-ai/local-deep-researcher',
    owner: 'langchain-ai',
  },
  {
    name: 'AI-Research-SKILLs',
    full_name: 'Orchestra-Research/AI-Research-SKILLs',
    description: 'Skills library for AI research agents',
    language: 'TeX',
    stars: 6537,
    forks: 510,
    weeklyStars: 150,
    updated: '2 days ago',
    url: 'https://github.com/Orchestra-Research/AI-Research-SKILLs',
    owner: 'Orchestra-Research',
  },
  {
    name: 'Auto-claude-code-research',
    full_name: 'wanshuiyin/Auto-claude-code-research-in-sleep',
    description: 'Automated Claude-based research while you sleep',
    language: 'Python',
    stars: 6099,
    forks: 552,
    weeklyStars: 140,
    updated: '1 day ago',
    url: 'https://github.com/wanshuiyin/Auto-claude-code-research-in-sleep',
    owner: 'wanshuiyin',
  },
  {
    name: 'AgentLaboratory',
    full_name: 'SamuelSchmidgall/AgentLaboratory',
    description: 'Laboratory environment for AI agent experiments',
    language: 'Python',
    stars: 5488,
    forks: 772,
    weeklyStars: 120,
    updated: '5 days ago',
    url: 'https://github.com/SamuelSchmidgall/AgentLaboratory',
    owner: 'SamuelSchmidgall',
  },
  {
    name: 'AI-Scientist-v2',
    full_name: 'SakanaAI/AI-Scientist-v2',
    description: 'Next generation AI Scientist system',
    language: 'Python',
    stars: 5377,
    forks: 748,
    weeklyStars: 110,
    updated: '4 days ago',
    url: 'https://github.com/SakanaAI/AI-Scientist-v2',
    owner: 'SakanaAI',
  },
  {
    name: 'AI-Researcher',
    full_name: 'HKUDS/AI-Researcher',
    description: 'AI-powered research assistant framework',
    language: 'Python',
    stars: 5095,
    forks: 634,
    weeklyStars: 95,
    updated: '1 week ago',
    url: 'https://github.com/HKUDS/AI-Researcher',
    owner: 'HKUDS',
  },
  {
    name: 'feynman',
    full_name: 'getcompanion-ai/feynman',
    description: 'AI-powered physics research companion',
    language: 'TypeScript',
    stars: 4090,
    forks: 500,
    weeklyStars: 85,
    updated: '3 days ago',
    url: 'https://github.com/getcompanion-ai/feynman',
    owner: 'getcompanion-ai',
  },
  {
    name: 'MetaClaw',
    full_name: 'aiming-lab/MetaClaw',
    description: 'Meta-learning framework for research agents',
    language: 'Python',
    stars: 3395,
    forks: 396,
    weeklyStars: 78,
    updated: '2 days ago',
    url: 'https://github.com/aiming-lab/MetaClaw',
    owner: 'aiming-lab',
  },
  {
    name: 'claude-scholar',
    full_name: 'Galaxy-Dawn/claude-scholar',
    description: 'Claude-powered academic research assistant',
    language: 'Python',
    stars: 3090,
    forks: 275,
    weeklyStars: 72,
    updated: '1 week ago',
    url: 'https://github.com/Galaxy-Dawn/claude-scholar',
    owner: 'Galaxy-Dawn',
  },
  {
    name: 'Biomni',
    full_name: 'snap-stanford/Biomni',
    description: 'Biomedical research agent framework',
    language: 'Python',
    stars: 2943,
    forks: 536,
    weeklyStars: 62,
    updated: '3 days ago',
    url: 'https://github.com/snap-stanford/Biomni',
    owner: 'snap-stanford',
  },
  {
    name: 'EvoScientist',
    full_name: 'EvoScientist/EvoScientist',
    description: 'Evolutionary AI scientist for automated discovery',
    language: 'Python',
    stars: 2775,
    forks: 148,
    weeklyStars: 58,
    updated: '1 day ago',
    url: 'https://github.com/EvoScientist/EvoScientist',
    owner: 'EvoScientist',
  },
  {
    name: 'Research-Claw',
    full_name: 'wentorai/Research-Claw',
    description: 'Research automation framework',
    language: 'TypeScript',
    stars: 632,
    forks: 84,
    weeklyStars: 28,
    updated: '1 day ago',
    url: 'https://github.com/wentorai/Research-Claw',
    owner: 'wentorai',
  },
  {
    name: 'LabClaw',
    full_name: 'wu-yc/LabClaw',
    description: 'Laboratory automation agent',
    language: 'Unknown',
    stars: 947,
    forks: 140,
    weeklyStars: 22,
    updated: '3 days ago',
    url: 'https://github.com/wu-yc/LabClaw',
    owner: 'wu-yc',
  },
  {
    name: 'dr-claw',
    full_name: 'OpenLAIR/dr-claw',
    description: 'Doctor Claw: AI research agent for medicine',
    language: 'JavaScript',
    stars: 840,
    forks: 88,
    weeklyStars: 18,
    updated: '1 day ago',
    url: 'https://github.com/OpenLAIR/dr-claw',
    owner: 'OpenLAIR',
  },
  {
    name: 'ClawBio',
    full_name: 'ClawBio/ClawBio',
    description: 'Bioinformatics research automation',
    language: 'HTML',
    stars: 683,
    forks: 125,
    weeklyStars: 14,
    updated: '1 day ago',
    url: 'https://github.com/ClawBio/ClawBio',
    owner: 'ClawBio',
  },
  {
    name: 'EurekaClaw',
    full_name: 'EurekaClaw/EurekaClaw',
    description: 'Eureka discovery agent for scientific breakthroughs',
    language: 'Python',
    stars: 664,
    forks: 67,
    weeklyStars: 15,
    updated: '2 days ago',
    url: 'https://github.com/EurekaClaw/EurekaClaw',
    owner: 'EurekaClaw',
  },
  {
    name: 'OpenResearcher',
    full_name: 'TIGER-AI-Lab/OpenResearcher',
    description: 'Open-source automated researcher',
    language: 'Python',
    stars: 640,
    forks: 69,
    weeklyStars: 13,
    updated: '2 days ago',
    url: 'https://github.com/TIGER-AI-Lab/OpenResearcher',
    owner: 'TIGER-AI-Lab',
  },
  {
    name: 'ScienceClaw',
    full_name: 'beita6969/ScienceClaw',
    description: 'General science research automation framework',
    language: 'TypeScript',
    stars: 571,
    forks: 57,
    weeklyStars: 12,
    updated: '1 week ago',
    url: 'https://github.com/beita6969/ScienceClaw',
    owner: 'beita6969',
  },
  {
    name: 'BioClaw',
    full_name: 'Runchuan-BU/BioClaw',
    description: 'Biology research automation agent',
    language: 'TypeScript',
    stars: 325,
    forks: 41,
    weeklyStars: 8,
    updated: '3 days ago',
    url: 'https://github.com/Runchuan-BU/BioClaw',
    owner: 'Runchuan-BU',
  },
  {
    name: 'OmicsClaw',
    full_name: 'TianGzlab/OmicsClaw',
    description: 'Omics data analysis automation agent',
    language: 'Python',
    stars: 115,
    forks: 23,
    weeklyStars: 5,
    updated: '1 day ago',
    url: 'https://github.com/TianGzlab/OmicsClaw',
    owner: 'TianGzlab',
  },
  {
    name: 'MagiClaw',
    full_name: 'sjtu-sai-agents/MagiClaw',
    description: 'Magical research automation framework',
    language: 'Python',
    stars: 110,
    forks: 3,
    weeklyStars: 4,
    updated: '1 week ago',
    url: 'https://github.com/sjtu-sai-agents/MagiClaw',
    owner: 'sjtu-sai-agents',
  },
];

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  Python: '#3572A5',
  JavaScript: '#f1e05a',
  Rust: '#dea584',
  Go: '#00ADD8',
  Java: '#b07219',
  TeX: '#3D6117',
  HTML: '#e34c26',
  Unknown: '#8b949e',
};

type SortMode = 'stars' | 'weekly';

export function ReposSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>('stars');
  const [expanded, setExpanded] = useState(false);
  const [repos, setRepos] = useState<Repo[]>([]);

  useEffect(() => {
    const sorted = [...AGENT_REPOS].sort((a, b) => {
      if (sortMode === 'stars') {
        return b.stars - a.stars;
      } else {
        return b.weeklyStars - a.weeklyStars;
      }
    });
    setRepos(sorted);
  }, [sortMode]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('repos');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const displayRepos = expanded ? repos : repos.slice(0, 10);

  return (
    <section 
      id="repos" 
      className="min-h-screen py-24 px-6 bg-navy-900 relative"
      aria-labelledby="repos-heading"
    >
      <div 
        className={`max-w-6xl mx-auto mb-12 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <h2 
          id="repos-heading"
          className="text-3xl md:text-4xl font-bold text-white mb-4"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          AI Research{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-mint-400 to-mint-500">
            Repositories
          </span>
        </h2>
        <p 
          className="text-white/60 max-w-2xl mx-auto"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Multi-agent systems and automated research tools for scientific discovery
        </p>
        <p 
          className="text-white/40 text-sm mt-2"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Data source: <a href="https://github.com/cadslab/Pantheon" target="_blank" rel="noopener noreferrer" className="text-mint-400 hover:underline">Pantheon</a> • {AGENT_REPOS.length} repositories
        </p>
      </div>

      <div 
        className={`max-w-6xl mx-auto mb-8 flex justify-center gap-4 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <button
          onClick={() => setSortMode('stars')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
            sortMode === 'stars'
              ? 'bg-mint-400 text-navy-900'
              : 'border border-white/20 text-white/70 hover:border-mint-400/50 hover:text-mint-400'
          }`}
          style={{ fontFamily: 'var(--font-body)' }}
          aria-pressed={sortMode === 'stars'}
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
            </svg>
            Total Stars
          </span>
        </button>
        <button
          onClick={() => setSortMode('weekly')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
            sortMode === 'weekly'
              ? 'bg-mint-400 text-navy-900'
              : 'border border-white/20 text-white/70 hover:border-mint-400/50 hover:text-mint-400'
          }`}
          style={{ fontFamily: 'var(--font-body)' }}
          aria-pressed={sortMode === 'weekly'}
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Weekly Stars
          </span>
        </button>
      </div>

      <div 
        className={`max-w-6xl mx-auto transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="overflow-x-auto rounded-xl border border-white/10 bg-navy-800/50 backdrop-blur-sm">
          <table className="w-full" role="grid">
            <thead>
              <tr className="border-b border-white/10">
                <th scope="col" className="text-left px-6 py-4 text-sm font-semibold text-white/80">#</th>
                <th scope="col" className="text-left px-6 py-4 text-sm font-semibold text-white/80">Repository</th>
                <th scope="col" className="text-left px-6 py-4 text-sm font-semibold text-white/80 hidden md:table-cell">Language</th>
                <th scope="col" className="text-center px-6 py-4 text-sm font-semibold text-white/80">Stars</th>
                <th scope="col" className="text-center px-6 py-4 text-sm font-semibold text-white/80 hidden sm:table-cell">Weekly ⬆️</th>
                <th scope="col" className="text-center px-6 py-4 text-sm font-semibold text-white/80 hidden lg:table-cell">Forks</th>
                <th scope="col" className="text-right px-6 py-4 text-sm font-semibold text-white/80 hidden lg:table-cell">Updated</th>
              </tr>
            </thead>
            <tbody>
              {displayRepos.map((repo, index) => (
                <tr key={repo.full_name} className="border-b border-white/5 hover:bg-white/5 transition-colors last:border-b-0">
                  <td className="px-6 py-4">
                    <span className="text-mint-400 font-bold text-lg" style={{ fontFamily: 'var(--font-mono)' }}>{index + 1}</span>
                  </td>
                  <td className="px-6 py-4">
                    <a href={repo.url} target="_blank" rel="noopener noreferrer" className="group inline-flex flex-col">
                      <span className="text-mint-400 font-medium group-hover:text-mint-500 transition-colors" style={{ fontFamily: 'var(--font-mono)' }}>{repo.full_name}</span>
                      <span className="text-sm text-white/50 mt-1 line-clamp-2 max-w-md" style={{ fontFamily: 'var(--font-body)' }}>{repo.description}</span>
                    </a>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: LANGUAGE_COLORS[repo.language] || '#8b949e' }} />
                      <span className="text-sm text-white/70" style={{ fontFamily: 'var(--font-body)' }}>{repo.language}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-white/70">
                      <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
                      </svg>
                      <span className="text-sm font-medium" style={{ fontFamily: 'var(--font-mono)' }}>{repo.stars >= 1000 ? `${(repo.stars / 1000).toFixed(1)}k` : repo.stars}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center hidden sm:table-cell">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-mint-400/20 text-mint-400" style={{ fontFamily: 'var(--font-mono)' }}>+{repo.weeklyStars}</span>
                  </td>
                  <td className="px-6 py-4 text-center hidden lg:table-cell">
                    <div className="flex items-center justify-center gap-1 text-white/70">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75v-.878a2.25 2.25 0 111.5 0v.878a2.25 2.25 0 01-2.25 2.25h-1.5v1.128a2.251 2.251 0 11-1.5 0V8.5h-1.5A2.25 2.25 0 013 6.25v-.878a2.25 2.25 0 111.5 0zM5 3.25a.75.75 0 10-1.5 0 .75.75 0 001.5 0zm6.75.75a.75.75 0 100-1.5.75.75 0 000 1.5z" />
                      </svg>
                      <span className="text-sm" style={{ fontFamily: 'var(--font-mono)' }}>{repo.forks >= 1000 ? `${(repo.forks / 1000).toFixed(1)}k` : repo.forks}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right hidden lg:table-cell">
                    <span className="text-sm text-white/50" style={{ fontFamily: 'var(--font-body)' }}>{repo.updated}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-8 text-center">
          <button
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center gap-2 px-6 py-3 border border-mint-400/50 text-mint-400 hover:bg-mint-400/10 rounded-lg transition-all duration-300"
            style={{ fontFamily: 'var(--font-body)' }}
            aria-expanded={expanded}
          >
            <svg className={`w-5 h-5 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            <span>{expanded ? 'Show Top 10' : `Show All (${repos.length})`}</span>
          </button>
        </div>
      </div>
    </section>
  );
}