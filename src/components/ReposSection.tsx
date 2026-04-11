import { useState, useEffect } from 'react';

interface Repo {
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  updated: string;
  url: string;
}

// Static demo data - can be replaced with live GitHub API
const DEMO_REPOS: Repo[] = [
  {
    name: 'onepersonlab-core',
    description: 'Core framework for solo research workflows',
    language: 'TypeScript',
    stars: 128,
    forks: 24,
    updated: '2 days ago',
    url: 'https://github.com/onepersonlab/onepersonlab-core',
  },
  {
    name: 'paper-sync',
    description: 'Sync and organize your academic papers',
    language: 'Python',
    stars: 89,
    forks: 12,
    updated: '1 week ago',
    url: 'https://github.com/onepersonlab/paper-sync',
  },
  {
    name: 'research-notebook',
    description: 'Interactive Jupyter-based research notebook',
    language: 'TypeScript',
    stars: 67,
    forks: 8,
    updated: '3 days ago',
    url: 'https://github.com/onepersonlab/research-notebook',
  },
  {
    name: 'cite-graph',
    description: 'Visualize citation networks for any paper',
    language: 'JavaScript',
    stars: 45,
    forks: 6,
    updated: '2 weeks ago',
    url: 'https://github.com/onepersonlab/cite-graph',
  },
];

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  Python: '#3572A5',
  JavaScript: '#f1e05a',
  Rust: '#dea584',
  Go: '#00ADD8',
};

export function ReposSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [repos] = useState<Repo[]>(DEMO_REPOS);

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

  return (
    <section 
      id="repos" 
      className="min-h-screen py-24 px-6 bg-navy-900 relative"
      aria-labelledby="repos-heading"
    >
      {/* Section header */}
      <div 
        className={`max-w-6xl mx-auto mb-16 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <h2 
          id="repos-heading"
          className="text-3xl md:text-4xl font-bold text-white mb-4"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Open Source{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-mint-400 to-mint-500">
            Projects
          </span>
        </h2>
        <p 
          className="text-white/60 max-w-2xl mx-auto"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Tools and frameworks built for independent researchers
        </p>
      </div>

      {/* Repositories table */}
      <div 
        className={`max-w-6xl mx-auto transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="overflow-x-auto rounded-xl border border-white/10 bg-navy-800/50 backdrop-blur-sm">
          <table className="w-full" role="grid" aria-label="GitHub repositories">
            <thead>
              <tr className="border-b border-white/10">
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
              {repos.map((repo, index) => (
                <tr 
                  key={repo.name}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors last:border-b-0"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <td className="px-6 py-4">
                    <a 
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex flex-col"
                    >
                      <span 
                        className="text-mint-400 font-medium group-hover:text-mint-500 transition-colors"
                        style={{ fontFamily: 'var(--font-mono)' }}
                      >
                        {repo.name}
                      </span>
                      <span 
                        className="text-sm text-white/50 mt-1 line-clamp-1 max-w-xs"
                        style={{ fontFamily: 'var(--font-body)' }}
                      >
                        {repo.description}
                      </span>
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
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                        <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
                      </svg>
                      <span 
                        className="text-sm"
                        style={{ fontFamily: 'var(--font-mono)' }}
                      >
                        {repo.stars}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center hidden sm:table-cell">
                    <div className="flex items-center justify-center gap-1 text-white/70">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                        <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75v-.878a2.25 2.25 0 111.5 0v.878a2.25 2.25 0 01-2.25 2.25h-1.5v1.128a2.251 2.251 0 11-1.5 0V8.5h-1.5A2.25 2.25 0 013 6.25v-.878a2.25 2.25 0 111.5 0zM5 3.25a.75.75 0 10-1.5 0 .75.75 0 001.5 0zm6.75.75a.75.75 0 100-1.5.75.75 0 000 1.5z" />
                      </svg>
                      <span 
                        className="text-sm"
                        style={{ fontFamily: 'var(--font-mono)' }}
                      >
                        {repo.forks}
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
        
        {/* View all button */}
        <div className="mt-8 text-center">
          <a
            href="https://github.com/onepersonlab"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 border border-mint-400/50 text-mint-400 hover:bg-mint-400/10 rounded-lg transition-all duration-300"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            <span>View All on GitHub</span>
          </a>
        </div>
      </div>
    </section>
  );
}