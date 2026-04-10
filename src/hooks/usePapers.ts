import { useState, useEffect, useCallback } from 'react';

export interface Paper {
  title: string;
  authors: Array<{ name: string }>;
  abstract: string;
  url: string;
  publicationDate: string;
  venue: string;
  citationCount?: number;
}

interface UsePapersResult {
  papers: Paper[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
  lastUpdated: Date | null;
}

const API_URL = 'https://api.semanticscholar.org/graph/v1/paper/search';
const QUERIES = [
  'AI scientist autonomous research',
  'multi-agent system scientific discovery',
  'collaborative agents research automation',
];

const FIELDS = 'title,authors,abstract,url,publicationDate,venue,citationCount';

function formatPaper(paper: any): Paper {
  return {
    title: paper.title || '无标题',
    authors: paper.authors || [],
    abstract: paper.abstract || '暂无摘要',
    url: paper.url || '',
    publicationDate: paper.publicationDate || '',
    venue: paper.venue || '',
    citationCount: paper.citationCount || 0,
  };
}

export function usePapers(): UsePapersResult {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchPapers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const allPapers: Paper[] = [];

      // 并行请求多个查询
      const promises = QUERIES.map(async (query) => {
        const url = `${API_URL}?query=${encodeURIComponent(query)}&fields=${FIELDS}&limit=5`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`API 请求失败：${response.status}`);
        }

        const data = await response.json();
        return data.data || [];
      });

      const results = await Promise.all(promises);
      
      // 合并并去重（按标题）
      results.forEach((papers) => {
        papers.forEach((paper: any) => {
          const formatted = formatPaper(paper);
          const exists = allPapers.some((p) => p.title === formatted.title);
          if (!exists) {
            allPapers.push(formatted);
          }
        });
      });

      // 按引用数排序
      allPapers.sort((a, b) => (b.citationCount || 0) - (a.citationCount || 0));

      setPapers(allPapers.slice(0, 12)); // 最多显示 12 篇
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPapers();
  }, [fetchPapers]);

  return {
    papers,
    isLoading,
    error,
    refresh: fetchPapers,
    lastUpdated,
  };
}
