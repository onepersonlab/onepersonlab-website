import { useState, useEffect } from 'react';
import { getRepos, getMeta } from '../data/repos';
import type { AgentType, Repo } from '../data/repos';

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  Python: '#3572A5',
  JavaScript: '#f1e05a',
  'Jupyter Notebook': '#DA5E41',
  TeX: '#3D6117',
  HTML: '#e34c26',
  Unknown: '#8b949e',
};

type SortMode = 'stars' | 'weekly';

export function ReposSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [agentType, setAgentType] = useState<AgentType>('research');
  const [sortMode, setSortMode] = useState<SortMode>('stars');
  const [expanded, setExpanded] = useState(false);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [meta, setMeta] = useState(getMeta('research'));

  useEffect(() => {
    const rawRepos = getRepos(agentType);
    const sorted = [...rawRepos].sort((a, b) => {
      if (sortMode === 'stars') {
        return b.stars - a.stars;
      } else {
        return b.weeklyStars - a.weeklyStars;
      }
    });
    setRepos(sorted);
    setMeta(getMeta(agentType));
    setExpanded(false);
  }, [agentType, sortMode]);

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

  // If updated is already a relative time string (contains 'ago'), use it directly
  // Otherwise parse as date
  const formatUpdated = (updatedStr: string) => {
    if (!updatedStr || updatedStr === 'unknown' || updatedStr === 'NaN months ago') return 'unknown';
    // Already relative time? Just use it
    if (updatedStr.includes('ago') || updatedStr.includes('just now')) return updatedStr;
    // Otherwise try to parse as date
    try {
      const date = new Date(updatedStr);
      if (isNaN(date.getTime())) return 'unknown';
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffHours < 1) return 'just now';
      if (diffHours < 24) return `${diffHours} hours ago`;
      if (diffDays === 1) return '1 day ago';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      return `${Math.floor(diffDays / 30)} months ago`;
    } catch {
      return 'unknown';
    }
  };

  return (
    <section 
      id="agents" 
      className="min-h-screen py-24 px-6 bg-navy-900 relative"
      aria-labelledby="repos-heading"
    >
      <div className={`max-w-6xl mx-auto mb-12 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <h2 id="repos-heading" className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          {agentType === 'research' ? 'Research' : 'General'}{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-mint-400 to-mint-500">Agent Repositories</span>
        </h2>
        <p className="text-white/60 max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-body)' }}>
          {meta.subtitle}
        </p>
        <p className="text-white/40 text-sm mt-2" style={{ fontFamily: 'var(--font-body)' }}>
          {meta.repo_count} repositories • Updated: {new Date(meta.generated_at).toLocaleDateString()}
        </p>
      </div>

      {/* Type toggle */}
      <div className={`max-w-6xl mx-auto mb-8 flex justify-center gap-4 transition-all duration-1000 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <button
          onClick={() => setAgentType('research')}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
            agentType === 'research'
              ? 'bg-mint-400 text-navy-900'
              : 'border border-white/20 text-white/70 hover:border-mint-400/50 hover:text-mint-400'
          }`}
          style={{ fontFamily: 'var(--font-body)' }}
          aria-pressed={agentType === 'research'}
        >
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 2.828l-.707.707m-.707-.707l-.707.707m12.728 0l-.707-.707m-.707.707l.707.707M12 21v-1m-6.364-1.636l.707-.707M12 12l2.5-2.5m0 5l-2.5-2.5" />
            </svg>
            Research
          </span>
        </button>
        <button
          onClick={() => setAgentType('general')}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
            agentType === 'general'
              ? 'bg-mint-400 text-navy-900'
              : 'border border-white/20 text-white/70 hover:border-mint-400/50 hover:text-mint-400'
          }`}
          style={{ fontFamily: 'var(--font-body)' }}
          aria-pressed={agentType === 'general'}
        >
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
            General
          </span>
        </button>
      </div>

      {/* Sort controls */}
      <div className={`max-w-6xl mx-auto mb-8 flex justify-center gap-4 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
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
            Daily
          </span>
        </button>
      </div>

      {/* Repositories table */}
      <div className={`max-w-6xl mx-auto transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="overflow-x-auto rounded-xl border border-white/10 bg-navy-800/50 backdrop-blur-sm">
          <table className="w-full" role="grid">
            <thead>
              <tr className="border-b border-white/10">
                <th scope="col" className="text-left px-6 py-4 text-sm font-semibold text-white/80">#</th>
                <th scope="col" className="text-left px-6 py-4 text-sm font-semibold text-white/80">Repository</th>
                <th scope="col" className="text-left px-6 py-4 text-sm font-semibold text-white/80 hidden md:table-cell">Language</th>
                <th scope="col" className="text-center px-6 py-4 text-sm font-semibold text-white/80">Stars</th>
                <th scope="col" className="text-center px-6 py-4 text-sm font-semibold text-white/80 hidden sm:table-cell">Daily</th>
                <th scope="col" className="text-center px-6 py-4 text-sm font-semibold text-white/80 hidden lg:table-cell">Forks</th>
                <th scope="col" className="text-right px-6 py-4 text-sm font-semibold text-white/80 hidden lg:table-cell">Updated</th>
              </tr>
            </thead>
            <tbody>
              {displayRepos.map((repo, index) => (
                <tr key={repo.full_name} className="border-b border-white/5 hover:bg-white/5 transition-colors last:border-b-0">
                  <td className="px-6 py-4"><span className="text-mint-400 font-bold text-lg" style={{ fontFamily: 'var(--font-mono)' }}>{index + 1}</span></td>
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
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${repo.weeklyStars > 0 ? 'bg-mint-400/20 text-mint-400' : 'bg-white/10 text-white/40'}`} style={{ fontFamily: 'var(--font-mono)' }}>
                      {repo.weeklyStars > 0 ? `+${repo.weeklyStars}` : '0'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center hidden lg:table-cell">
                    <div className="flex items-center justify-center gap-1 text-white/70">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75v-.878a2.25 2.25 0 111.5 0v.878a2.25 2.25 0 01-2.25 2.25h-1.5v1.128a2.251 2.251 0 11-1.5 0V8.5h-1.5A2.25 2.25 0 013 6.25v-.878a2.25 2.25 0 111.5 0zM5 3.25a.75.75 0 10-1.5 0 .75.75 0 001.5 0zm6.75.75a.75.75 0 100-1.5.75.75 0 000 1.5z" />
                      </svg>
                      <span className="text-sm" style={{ fontFamily: 'var(--font-mono)' }}>{repo.forks >= 1000 ? `${(repo.forks / 1000).toFixed(1)}k` : repo.forks}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right hidden lg:table-cell"><span className="text-sm text-white/50" style={{ fontFamily: 'var(--font-body)' }}>{formatUpdated(repo.updated)}</span></td>
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