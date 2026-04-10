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

interface RepoTableProps {
  repos: RepoData[];
  isLoading?: boolean;
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
        className="w-full px-4 py-3 pl-12 rounded-xl border border-gray-300 
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                   focus:outline-none transition-all duration-200"
      />
      <svg 
        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
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
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <a 
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
        >
          {repo.name}
        </a>
        {repo.description && (
          <p className="text-sm text-gray-500 mt-1">{repo.description}</p>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {repo.language && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {repo.language}
          </span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <div className="flex items-center justify-center gap-1 text-gray-600">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span>{repo.stargazers_count.toLocaleString()}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          repo.open_issues_count > 0 
            ? 'bg-yellow-100 text-yellow-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          {repo.open_issues_count}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
        {formatDate(repo.updated_at)}
      </td>
    </tr>
  );
}

export function RepoShowcase({ repos, isLoading = false }: RepoTableProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRepos = useMemo(() => {
    if (!searchQuery.trim()) return repos;
    const query = searchQuery.toLowerCase();
    return repos.filter(
      (repo) =>
        repo.name.toLowerCase().includes(query) ||
        repo.description?.toLowerCase().includes(query) ||
        repo.language?.toLowerCase().includes(query)
    );
  }, [repos, searchQuery]);

  return (
    <section className="py-20 bg-white" aria-labelledby="repos-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 
          id="repos-heading"
          className="text-4xl font-bold text-center text-gray-900 mb-12"
        >
          GitHub 仓库
        </h2>
        
        <SearchBar 
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="搜索仓库名称、描述或语言..."
        />

        {isLoading ? (
          <div className="text-center py-12" role="status">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">加载中...</p>
          </div>
        ) : filteredRepos.length === 0 ? (
          <div className="text-center py-12" role="status">
            <p className="text-gray-500">暂无仓库数据</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    仓库
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    语言
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stars
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Issues
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    最近更新
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRepos.map((repo) => (
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
