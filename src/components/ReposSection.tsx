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
  avatar: string;
}

// Multi-agent AI research repositories
const AGENT_REPOS: Repo[] = [
  {
    name: 'AutoGen',
    full_name: 'microsoft/autogen',
    description: 'Enable Next-Gen LLM Applications via Multi-Agent Conversation Framework',
    language: 'Python',
    stars: 42000,
    forks: 5200,
    weeklyStars: 320,
    updated: '2 days ago',
    url: 'https://github.com/microsoft/autogen',
    owner: 'microsoft',
    avatar: 'https://github.com/microsoft.png',
  },
  {
    name: 'CrewAI',
    full_name: 'joaomdmoura/crewAI',
    description: 'Framework for orchestrating role-playing, autonomous AI agents',
    language: 'Python',
    stars: 28000,
    forks: 3800,
    weeklyStars: 580,
    updated: '1 day ago',
    url: 'https://github.com/joaomdmoura/crewAI',
    owner: 'joaomdmoura',
    avatar: 'https://github.com/joaomdmoura.png',
  },
  {
    name: 'LangGraph',
    full_name: 'langchain-ai/langgraph',
    description: 'Build cyclic, persistent LLM applications with LangChain',
    language: 'Python',
    stars: 15000,
    forks: 2400,
    weeklyStars: 420,
    updated: '3 days ago',
    url: 'https://github.com/langchain-ai/langgraph',
    owner: 'langchain-ai',
    avatar: 'https://github.com/langchain-ai.png',
  },
  {
    name: 'MetaGPT',
    full_name: 'geekan/MetaGPT',
    description: 'Multi-Agent Framework for Software Development',
    language: 'Python',
    stars: 45000,
    forks: 5500,
    weeklyStars: 150,
    updated: '5 days ago',
    url: 'https://github.com/geekan/MetaGPT',
    owner: 'geekan',
    avatar: 'https://github.com/geekan.png',
  },
  {
    name: 'AutoGPT',
    full_name: 'Significant-Gravitas/AutoGPT',
    description: 'An experimental open-source attempt to make GPT-4 fully autonomous',
    language: 'Python',
    stars: 168000,
    forks: 42000,
    weeklyStars: 85,
    updated: '1 week ago',
    url: 'https://github.com/Significant-Gravitas/AutoGPT',
    owner: 'Significant-Gravitas',
    avatar: 'https://github.com/Significant-Gravitas.png',
  },
  {
    name: 'Swarm',
    full_name: 'openai/swarm',
    description: 'Educational framework exploring ergonomic, lightweight multi-agent orchestration',
    language: 'Python',
    stars: 16000,
    forks: 2100,
    weeklyStars: 120,
    updated: '2 weeks ago',
    url: 'https://github.com/openai/swarm',
    owner: 'openai',
    avatar: 'https://github.com/openai.png',
  },
  {
    name: 'AgentScope',
    full_name: 'alibaba/AgentScope',
    description: 'Start building LLM-empowered multi-agent applications',
    language: 'Python',
    stars: 5200,
    forks: 480,
    weeklyStars: 85,
    updated: '3 days ago',
    url: 'https://github.com/alibaba/AgentScope',
    owner: 'alibaba',
    avatar: 'https://github.com/alibaba.png',
  },
  {
    name: 'HiClaw',
    full_name: 'onepersonlab/HiClaw',
    description: 'Open-source multi-agent orchestration platform with Manager-Workers architecture',
    language: 'TypeScript',
    stars: 128,
    forks: 24,
    weeklyStars: 45,
    updated: '1 day ago',
    url: 'https://github.com/onepersonlab/HiClaw',
    owner: 'onepersonlab',
    avatar: 'https://github.com/onepersonlab.png',
  },
  {
    name: 'OpenClaw',
    full_name: 'onepersonlab/OpenClaw',
    description: 'AI agent runtime with Matrix communication and skill system',
    language: 'TypeScript',
    stars: 89,
    forks: 12,
    weeklyStars: 38,
    updated: '2 days ago',
    url: 'https://github.com/onepersonlab/OpenClaw',
    owner: 'onepersonlab',
    avatar: 'https://github.com/onepersonlab.png',
  },
  {
    name: 'AutoResearchClaw',
    full_name: 'onepersonlab/AutoResearchClaw',
    description: 'Multi-agent system for automated scientific research workflows',
    language: 'Python',
    stars: 156,
    forks: 28,
    weeklyStars: 52,
    updated: '4 days ago',
    url: 'https://github.com/onepersonlab/AutoResearchClaw',
    owner: 'onepersonlab',
    avatar: 'https://github.com/onepersonlab.png',
  },
  {
    name: 'Pantheon',
    full_name: 'cadslab/Pantheon',
    description: 'Automated research tool for AI research project ranking and discovery',
    language: 'JavaScript',
    stars: 320,
    forks: 45,
    weeklyStars: 120,
    updated: '1 week ago',
    url: 'https://github.com/cadslab/Pantheon',
    owner: 'cadslab',
    avatar: 'https://github.com/cadslab.png',
  },
  {
    name: 'AgentGPT',
    full_name: 'reworkd/AgentGPT',
    description: 'AI agents that run directly in your browser',
    language: 'TypeScript',
    stars: 32000,
    forks: 4500,
    weeklyStars: 65,
    updated: '2 weeks ago',
    url: 'https://github.com/reworkd/AgentGPT',
    owner: 'reworkd',
    avatar: 'https://github.com/reworkd.png',
  },
  {
    name: 'GPT-Researcher',
    full_name: 'assafelovic/gpt-researcher',
    description: 'AI agent that automates online research',
    language: 'Python',
    stars: 14000,
    forks: 1800,
    weeklyStars: 280,
    updated: '3 days ago',
    url: 'https://github.com/assafelovic/gpt-researcher',
    owner: 'assafelovic',
    avatar: 'https://github.com/assafelovic.png',
  },
  {
    name: 'BabyAGI',
    full_name: 'yoheinakajima/babyagi',
    description: 'An AI-powered task management system',
    language: 'Python',
    stars: 21000,
    forks: 3200,
    weeklyStars: 45,
    updated: '3 weeks ago',
    url: 'https://github.com/yoheinakajima/babyagi',
    owner: 'yoheinakajima',
    avatar: 'https://github.com/yoheinakajima.png',
  },
  {
    name: ' Camel',
    full_name: 'camel-ai/camel',
    description: 'Communicative Agents for Large Language Model Society',
    language: 'Python',
    stars: 6500,
    forks: 850,
    weeklyStars: 95,
    updated: '4 days ago',
    url: 'https://github.com/camel-ai/camel',
    owner: 'camel-ai',
    avatar: 'https://github.com/camel-ai.png',
  },
];

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  Python: '#3572A5',
  JavaScript: '#f1e05a',
  Rust: '#dea584',
  Go: '#00ADD8',
  Java: '#b07219',
};

type SortMode = 'stars' | 'weekly';

export function ReposSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>('stars');
  const [expanded, setExpanded] = useState(false);
  const [repos, setRepos] = useState<Repo[]>([]);

  useEffect(() => {
    // Sort repositories
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
      {/* Section header */}
      <div 
        className={`max-w-6xl mx-auto mb-12 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <h2 
          id="repos-heading"
          className="text-3xl md:text-4xl font-bold text-white mb-4"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Multi-Agent{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-mint-400 to-mint-500">
            Repositories
          </span>
        </h2>
        <p 
          className="text-white/60 max-w-2xl mx-auto"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Discover AI agent frameworks and tools for scientific research
        </p>
      </div>

      {/* Sort controls */}
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
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
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
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Weekly Stars
          </span>
        </button>
      </div>

      {/* Repositories table */}
      <div 
        className={`max-w-6xl mx-auto transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="overflow-x-auto rounded-xl border border-white/10 bg-navy-800/50 backdrop-blur-sm">
          <table className="w-full" role="grid" aria-label="Multi-agent GitHub repositories">
            <thead>
              <tr className="border-b border-white/10">
                <th 
                  scope="col" 
                  className="text-left px-6 py-4 text-sm font-semibold text-white/80"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  #
                </th>
                <th 
                  scope="col" 
                  className="text-left px-6 py-4 text-sm font-semibold text-white/80"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Repository
                </th>
                <th 
                  scope="col" 
                  className="text-left px-6 py-4 text-sm font-semibold text-white/80 hidden md:table-cell"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Language
                </th>
                <th 
                  scope="col" 
                  className="text-center px-6 py-4 text-sm font-semibold text-white/80"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Stars
                </th>
                <th 
                  scope="col" 
                  className="text-center px-6 py-4 text-sm font-semibold text-white/80 hidden sm:table-cell"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Weekly ⬆️
                </th>
                <th 
                  scope="col" 
                  className="text-center px-6 py-4 text-sm font-semibold text-white/80 hidden lg:table-cell"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Forks
                </th>
                <th 
                  scope="col" 
                  className="text-right px-6 py-4 text-sm font-semibold text-white/80 hidden lg:table-cell"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Updated
                </th>
              </tr>
            </thead>
            <tbody>
              {displayRepos.map((repo, index) => (
                <tr 
                  key={repo.full_name}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors last:border-b-0"
                >
                  <td className="px-6 py-4">
                    <span 
                      className="text-mint-400 font-bold text-lg"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <a 
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-start gap-3"
                    >
                      <img 
                        src={repo.avatar}
                        alt={`${repo.owner} avatar`}
                        className="w-8 h-8 rounded-full hidden sm:block"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                      <div className="flex flex-col">
                        <span 
                          className="text-mint-400 font-medium group-hover:text-mint-500 transition-colors"
                          style={{ fontFamily: 'var(--font-mono)' }}
                        >
                          {repo.full_name}
                        </span>
                        <span 
                          className="text-sm text-white/50 mt-1 line-clamp-2 max-w-md"
                          style={{ fontFamily: 'var(--font-body)' }}
                        >
                          {repo.description}
                        </span>
                      </div>
                    </a>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <span 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: LANGUAGE_COLORS[repo.language] || '#8b949e' }}
                        aria-hidden="true"
                      />
                      <span 
                        className="text-sm text-white/70"
                        style={{ fontFamily: 'var(--font-body)' }}
                      >
                        {repo.language}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-white/70">
                      <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                        <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
                      </svg>
                      <span 
                        className="text-sm font-medium"
                        style={{ fontFamily: 'var(--font-mono)' }}
                      >
                        {repo.stars >= 1000 ? `${(repo.stars / 1000).toFixed(1)}k` : repo.stars}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center hidden sm:table-cell">
                    <span 
                      className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-mint-400/20 text-mint-400"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      +{repo.weeklyStars}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center hidden lg:table-cell">
                    <div className="flex items-center justify-center gap-1 text-white/70">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                        <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75v-.878a2.25 2.25 0 111.5 0v.878a2.25 2.25 0 01-2.25 2.25h-1.5v1.128a2.251 2.251 0 11-1.5 0V8.5h-1.5A2.25 2.25 0 013 6.25v-.878a2.25 2.25 0 111.5 0zM5 3.25a.75.75 0 10-1.5 0 .75.75 0 001.5 0zm6.75.75a.75.75 0 100-1.5.75.75 0 000 1.5z" />
                      </svg>
                      <span 
                        className="text-sm"
                        style={{ fontFamily: 'var(--font-mono)' }}
                      >
                        {repo.forks >= 1000 ? `${(repo.forks / 1000).toFixed(1)}k` : repo.forks}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right hidden lg:table-cell">
                    <span 
                      className="text-sm text-white/50"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      {repo.updated}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Expand/Collapse button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center gap-2 px-6 py-3 border border-mint-400/50 text-mint-400 hover:bg-mint-400/10 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-mint-400 focus:ring-offset-2 focus:ring-offset-navy-900"
            style={{ fontFamily: 'var(--font-body)' }}
            aria-expanded={expanded}
          >
            <svg 
              className={`w-5 h-5 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            <span>{expanded ? 'Show Top 10' : `Show All (${repos.length})`}</span>
          </button>
        </div>
      </div>
    </section>
  );
}