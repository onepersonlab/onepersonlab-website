import { useState, useMemo } from 'react';

export interface RepoData {
  name: string;
  description: string;
  stargazers_count: number;
  open_issues_count: number;
  updated_at: string;
  html_url: string;
  language?: string;
}

// GitHub 语言颜色映射
const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: 'bg-blue-500',
  JavaScript: 'bg-yellow-400',
  Python: 'bg-green-500',
  Rust: 'bg-orange-600',
  Go: 'bg-cyan-500',
  Java: 'bg-red-500',
  Cpp: 'bg-purple-500',
  'C++': 'bg-purple-500',
  C: 'bg-gray-500',
  HTML: 'bg-orange-400',
  CSS: 'bg-blue-400',
  Vue: 'bg-green-400',
  React: 'bg-cyan-400',
  Shell: 'bg-green-600',
  Jupyter: 'bg-orange-300',
  default: 'bg-gray-400',
};

function getLanguageColor(language?: string): string {
  if (!language) return LANGUAGE_COLORS.default;
  return LANGUAGE_COLORS[language] || LANGUAGE_COLORS.default;
}

interface RepoTableProps {
  repos: RepoData[];
  isLoading?: boolean;
  onRefresh?: () => void;
  lastUpdated?: Date | null;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function SearchBar({ 
  value, 
  onChange,
  placeholder = '搜索仓库...' 
}: { 
  value: string; 
  onChange: (query: string) => void;
  placeholder?: string;
}) {
  return (
    <div role="search" className="relative mb-6">
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="搜索仓库"
        className="w-full px-4 py-3 pl-12 rounded-xl border border-neutral-300 dark:border-neutral-600
                   bg-white dark:bg-neutral-800
                   text-neutral-900 dark:text-neutral-100
                   placeholder-neutral-400 dark:placeholder-neutral-500
                   focus:ring-2 focus:ring-brand-primary focus:border-brand-primary 
                   focus:outline-none transition-all duration-200 theme-transition"
      />
      <svg 
        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400"
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
        aria-hidden="true"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
        />
      </svg>
    </div>
  );
}

function RepoRow({ repo }: { repo: RepoData }) {
  return (
    <tr className="table-row-hover theme-transition">
      <td className="px-6 py-4 whitespace-nowrap">
        <a 
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-primary hover:text-brand-secondary font-medium hover:underline"
        >
          {repo.name}
        </a>
        {repo.description && (
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{repo.description}</p>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {repo.language && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium">
            <span className={`w-2 h-2 rounded-full ${getLanguageColor(repo.language)}`}></span>
            <span className="text-neutral-700 dark:text-neutral-300">{repo.language}</span>
          </span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <div className="flex items-center justify-center gap-1 text-neutral-600 dark:text-neutral-400">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span>{repo.stargazers_count.toLocaleString()}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          repo.open_issues_count > 0 
            ? 'bg-warning-light text-warning dark:bg-warning-light/20 dark:text-warning' 
            : 'bg-success-light text-success dark:bg-success-light/20 dark:text-success'
        }`}>
          {repo.open_issues_count}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-neutral-500 dark:text-neutral-400">
        {formatDate(repo.updated_at)}
      </td>
    </tr>
  );
}

export function RepoShowcase({ repos, isLoading = false, onRefresh, lastUpdated }: RepoTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'stars' | 'issues' | 'updated'>('stars');

  const filteredAndSortedRepos = useMemo(() => {
    let result = [...repos];
    
    // 先过滤
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (repo) =>
          repo.name.toLowerCase().includes(query) ||
          repo.description?.toLowerCase().includes(query) ||
          repo.language?.toLowerCase().includes(query)
      );
    }
    
    // 再排序
    result.sort((a, b) => {
      switch (sortBy) {
        case 'stars':
          return b.stargazers_count - a.stargazers_count;
        case 'issues':
          return b.open_issues_count - a.open_issues_count;
        case 'updated':
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        default:
          return 0;
      }
    });
    
    return result;
  }, [repos, searchQuery, sortBy]);

  const formatLastUpdated = (date: Date | null) => {
    if (!date) return '';
    return `更新于 ${date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <section className="py-20 bg-white dark:bg-neutral-900 theme-transition" aria-labelledby="repos-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h2 
            id="repos-heading"
            className="text-4xl font-bold text-neutral-900 dark:text-neutral-100"
          >
            GitHub 仓库
          </h2>
          <div className="flex flex-wrap items-center gap-4">
            {/* 排序选择器 */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-neutral-600 dark:text-neutral-400">排序:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'stars' | 'issues' | 'updated')}
                className="px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600
                           bg-white dark:bg-neutral-800
                           text-neutral-700 dark:text-neutral-300
                           text-sm focus:ring-2 focus:ring-brand-primary focus:outline-none"
              >
                <option value="stars">Stars ⭐</option>
                <option value="issues">Issues 🐛</option>
                <option value="updated">最近更新 📅</option>
              </select>
            </div>
            
            {lastUpdated && (
              <span className="text-sm text-neutral-500 dark:text-neutral-400">
                {formatLastUpdated(lastUpdated)}
              </span>
            )}
            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-lg
                           bg-brand-primary hover:bg-brand-secondary
                           disabled:opacity-50 disabled:cursor-not-allowed
                           text-white transition-colors duration-200
                           button-press
                           focus:outline-none focus:ring-2 focus:ring-brand-primary"
                aria-label="刷新仓库数据"
              >
                <svg 
                  className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                  />
                </svg>
                <span className="text-sm">刷新</span>
              </button>
            )}
          </div>
        </div>
        
        <SearchBar 
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="搜索仓库名称、描述或语言..."
        />

        {isLoading ? (
          <div className="text-center py-12" role="status">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto"></div>
            <p className="mt-4 text-neutral-600 dark:text-neutral-400">加载中...</p>
          </div>
        ) : filteredRepos.length === 0 ? (
          <div className="text-center py-12" role="status">
            <p className="text-neutral-500 dark:text-neutral-400">暂无仓库数据</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm">
            <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
              <thead className="bg-neutral-50 dark:bg-neutral-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    仓库
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    语言
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Stars
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Issues
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    最近更新
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-neutral-900 divide-y divide-neutral-200 dark:divide-neutral-700">
                {filteredAndSortedRepos.map((repo) => (
                  <RepoRow key={repo.name} repo={repo} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
