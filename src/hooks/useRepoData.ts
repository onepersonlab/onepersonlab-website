import { useState, useEffect, useCallback } from 'react';
import type { RepoData } from '../components/RepoShowcase/RepoShowcase';

interface UseRepoDataResult {
  repos: RepoData[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  lastUpdated: Date | null;
}

const CACHE_KEY = 'github_repos_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 分钟缓存

interface CachedData {
  repos: RepoData[];
  timestamp: number;
}

export function useRepoData(orgName: string): UseRepoDataResult {
  const [repos, setRepos] = useState<RepoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchRepos = useCallback(async (forceRefresh = false) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 检查缓存
      if (!forceRefresh && typeof localStorage !== 'undefined') {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { repos: cachedRepos, timestamp }: CachedData = JSON.parse(cached);
          const isExpired = Date.now() - timestamp > CACHE_DURATION;
          
          if (!isExpired && cachedRepos.length > 0) {
            setRepos(cachedRepos);
            setLastUpdated(new Date(timestamp));
            setIsLoading(false);
            return;
          }
        }
      }

      // 添加重试逻辑
      let lastError: Error | null = null;
      const maxRetries = 3;
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          const response = await fetch(
            `https://api.github.com/orgs/${orgName}/repos?sort=updated&per_page=100`,
            {
              headers: {
                'Accept': 'application/vnd.github.v3+json',
              },
            }
          );
          
          // 处理速率限制
          if (response.status === 403) {
            const resetTime = response.headers.get('X-RateLimit-Reset');
            if (resetTime) {
              const resetDate = new Date(parseInt(resetTime) * 1000);
              throw new Error(`GitHub API 速率限制，请在 ${resetDate.toLocaleTimeString()} 后重试`);
            }
            throw new Error('GitHub API 速率限制');
          }
          
          if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
          }
          
          const data = await response.json();
          setRepos(data);
          setLastUpdated(new Date());
          
          // 缓存数据
          if (typeof localStorage !== 'undefined') {
            const cacheData: CachedData = {
              repos: data,
              timestamp: Date.now(),
            };
            localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
          }
          
          break;
        } catch (err) {
          lastError = err instanceof Error ? err : new Error('Unknown error');
          
          // 如果是最后一次重试，抛出错误
          if (attempt === maxRetries) {
            throw lastError;
          }
          
          // 等待后重试（指数退避）
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [orgName]);

  useEffect(() => {
    fetchRepos();
  }, [fetchRepos]);

  return {
    repos,
    isLoading,
    error,
    refresh: () => fetchRepos(true),
    lastUpdated,
  };
}
