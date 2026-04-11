import topPapersData from './top-6-papers-update.json';
import allPapersData from './all-papers-update.json';
import developerPapersData from './developer-papers-update.json';

export interface Paper {
  order?: number;
  title: string;
  doi: string | null;
  year: number;
  venue: string;
  authors: string[];
  citationCount: number | null;
  abstract: string;
  url: string;
}

export function getTopPapers(): Paper[] {
  return topPapersData.papers.map((p: any) => ({
    order: p.order,
    title: p.title,
    doi: p.doi,
    year: p.year,
    venue: p.venue,
    authors: p.authors || [],
    citationCount: p.citationCount,
    abstract: p.abstract || '',
    url: p.url
  }));
}

export function getAllPapers(): Paper[] {
  return allPapersData.papers.map((p: any) => ({
    title: p.title,
    doi: p.doi,
    year: p.year,
    venue: p.venue,
    authors: p.authors || [],
    citationCount: p.citationCount,
    abstract: p.abstract || '',
    url: p.url
  }));
}

export function getDeveloperPapers(): Paper[] {
  return developerPapersData.papers.map((p: any) => ({
    title: p.title,
    doi: p.doi,
    year: p.year,
    venue: p.venue,
    authors: p.authors || [],
    citationCount: p.citationCount,
    abstract: p.abstract || '',
    url: p.url
  }));
}

export function getPaperMeta(): { top_count: number; all_count: number; developer_count: number; generated_at: string } {
  return {
    top_count: topPapersData.paper_count,
    all_count: allPapersData.paper_count,
    developer_count: developerPapersData.paper_count,
    generated_at: topPapersData.generated_at
  };
}