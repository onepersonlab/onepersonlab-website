export interface Paper {
  title: string;
  authors: string[] | Array<{ name: string }>;
  abstract: string;
  url: string;
  publishedDate?: string;
  publicationDate?: string;
  venue?: string;
  citationCount?: number;
}

interface PaperCardProps {
  paper: Paper;
}

function PaperCard({ paper }: PaperCardProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '暂无日期';
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // 处理作者格式（可能是字符串数组或对象数组）
  const getAuthors = () => {
    if (!paper.authors || paper.authors.length === 0) return [];
    
    if (typeof paper.authors[0] === 'string') {
      return paper.authors as string[];
    }
    
    return (paper.authors as Array<{ name: string }>).map(a => a.name);
  };

  const authors = getAuthors();
  const pubDate = paper.publicationDate || paper.publishedDate;

  return (
    <article 
      className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 card-hover-lift border border-gray-100"
      aria-labelledby={`paper-${paper.title}`}
    >
      <h3 
        id={`paper-${paper.title}`}
        className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2"
      >
        {paper.title}
      </h3>
      
      {authors.length > 0 && (
        <p className="text-sm text-gray-600 mb-3">
          {authors.slice(0, 3).join(', ')}
          {authors.length > 3 && ` 等`}
        </p>
      )}
      
      {paper.venue && (
        <p className="text-xs text-blue-600 font-medium mb-3">
          {paper.venue}
        </p>
      )}
      
      {paper.citationCount !== undefined && (
        <p className="text-xs text-neutral-500 mb-3">
          引用：{paper.citationCount.toLocaleString()}
        </p>
      )}
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {paper.abstract || '暂无摘要'}
      </p>
      
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {formatDate(pubDate)}
        </span>
        <a
          href={paper.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium"
          aria-label={`阅读论文：${paper.title}`}
        >
          阅读全文
          <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </article>
  );
}

interface PaperListProps {
  papers: Paper[];
  isLoading?: boolean;
}

export function PaperList({ papers, isLoading = false }: PaperListProps) {
  return (
    <section className="py-20 bg-gray-50" aria-labelledby="papers-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 
          id="papers-heading"
          className="text-3xl font-bold text-center text-gray-900 mb-12"
        >
          相关论文
        </h2>

        {isLoading ? (
          <div className="text-center py-12" role="status">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">加载中...</p>
          </div>
        ) : papers.length === 0 ? (
          <div className="text-center py-12" role="status">
            <p className="text-gray-500">暂无论文数据</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {papers.map((paper, index) => (
              <PaperCard key={`${paper.title}-${index}`} paper={paper} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
