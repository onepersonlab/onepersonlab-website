import { useState, useEffect, useCallback } from 'react';
import type { RepoData } from '../RepoShowcase/RepoShowcase';

interface UseRepoDataResult {
  repos: RepoData[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useRepoData(orgName: string): UseRepoDataResult {
  const [repos, setRepos] = useState<RepoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRepos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://api.github.com/orgs/${orgName}/repos?sort=updated&per_page=100`
      );
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }
      
      const data = await response.json();
      setRepos(data);
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
    refresh: fetchRepos,
  };
}
