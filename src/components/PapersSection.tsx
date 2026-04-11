import { useState, useEffect } from 'react';
import { getTopPapers, getAllPapers } from '../data/papers';
import type { Paper } from '../data/papers';

type SortMode = 'year' | 'citations';

export function PapersSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>('year');
  const [expanded, setExpanded] = useState(false);
  const [topPapers, setTopPapers] = useState<Paper[]>([]);
  const [allPapers, setAllPapers] = useState<Paper[]>([]);

  useEffect(() => {
    const rawTop = getTopPapers();
    const sortedTop = [...rawTop].sort((a, b) => {
      if (sortMode === 'year') return b.year - a.year;
      return (b.citationCount || 0) - (a.citationCount || 0);
    });
    setTopPapers(sortedTop);

    const rawAll = getAllPapers();
    const sortedAll = [...rawAll].sort((a, b) => {
      if (sortMode === 'year') return b.year - a.year;
      return (b.citationCount || 0) - (a.citationCount || 0);
    });
    setAllPapers(sortedAll);
  }, [sortMode]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    const section = document.getElementById('papers');
    if (section) observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="papers" className="min-h-screen py-24 px-6 bg-navy-800 relative" aria-labelledby="papers-heading">
      <div className={`max-w-6xl mx-auto mb-12 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <h2 id="papers-heading" className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          Published <span className="text-transparent bg-clip-text bg-gradient-to-r from-mint-400 to-mint-500">Papers</span>
        </h2>
        <p className="text-white/60 max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-body)' }}>
          Research on multi-agent systems for scientific discovery and automation
        </p>
      </div>

      {/* Sort controls */}
      <div className={`max-w-6xl mx-auto mb-8 flex justify-center gap-4 transition-all duration-1000 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <button
          onClick={() => setSortMode('year')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
            sortMode === 'year'
              ? 'bg-mint-400 text-navy-900'
              : 'border border-white/20 text-white/70 hover:border-mint-400/50 hover:text-mint-400'
          }`}
          style={{ fontFamily: 'var(--font-body)' }}
          aria-pressed={sortMode === 'year'}
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Publication Date
          </span>
        </button>
        <button
          onClick={() => setSortMode('citations')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
            sortMode === 'citations'
              ? 'bg-mint-400 text-navy-900'
              : 'border border-white/20 text-white/70 hover:border-mint-400/50 hover:text-mint-400'
          }`}
          style={{ fontFamily: 'var(--font-body)' }}
          aria-pressed={sortMode === 'citations'}
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Citations
          </span>
        </button>
      </div>

      {/* Top 6 Papers */}
      <div className={`max-w-6xl mx-auto transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {topPapers.map((paper, index) => (
            <>
              {paper.isDeveloperPaper && (
                <div key="developer-note" className="md:col-span-2 bg-mint-400/10 border border-mint-400/30 rounded-xl p-4 mb-2 flex items-center gap-3">
                  <span className="text-2xl">😊</span>
                  <p className="text-white/70" style={{ fontFamily: 'var(--font-body)' }}>
                    This is <strong className="text-mint-400">our own paper</strong> — we're excited to share it with you! Feel free to read and explore.
                  </p>
                </div>
              )}
              <article key={paper.doi || paper.title} className="group relative bg-navy-900/50 border border-white/10 rounded-xl p-6 hover:border-mint-400/50 transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-mint-400 font-bold text-lg" style={{ fontFamily: 'var(--font-mono)' }}>#{index + 1}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white/50" style={{ fontFamily: 'var(--font-body)' }}>{paper.year}</span>
                    {paper.citationCount !== null && (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-mint-400/20 text-mint-400" style={{ fontFamily: 'var(--font-mono)' }}>
                        {paper.citationCount} citations
                      </span>
                    )}
                  </div>
                </div>
                <a href={paper.url} target="_blank" rel="noopener noreferrer" className="block">
                  <h3 className="text-white font-medium mb-3 group-hover:text-mint-400 transition-colors line-clamp-2" style={{ fontFamily: 'var(--font-display)' }}>
                    {paper.title}
                  </h3>
                  <p className="text-sm text-white/50 mb-3 line-clamp-3" style={{ fontFamily: 'var(--font-body)' }}>
                    {paper.abstract || 'No abstract available'}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-white/40">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span style={{ fontFamily: 'var(--font-body)' }}>{paper.venue}</span>
                  </div>
                  {paper.authors.length > 0 && (
                    <p className="text-xs text-white/30 mt-2 line-clamp-1" style={{ fontFamily: 'var(--font-body)' }}>
                      {paper.authors.slice(0, 3).join(', ')}{paper.authors.length > 3 ? ' et al.' : ''}
                    </p>
                  )}
                </a>
              </article>
            </>
          ))}
        </div>

        {/* Divider */}
        {expanded && (
          <div className="relative my-12">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 py-2 bg-navy-800 text-white/50 text-sm rounded-lg" style={{ fontFamily: 'var(--font-body)' }}>
                Additional Publications
              </span>
            </div>
          </div>
        )}

        {/* All Papers (when expanded) */}
        {expanded && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allPapers.map((paper, index) => (
              <article key={paper.doi || paper.title} className="group relative bg-navy-900/30 border border-white/10 rounded-xl p-6 hover:border-mint-400/50 transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-white/40 font-bold text-lg" style={{ fontFamily: 'var(--font-mono)' }}>#{index + 7}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white/50" style={{ fontFamily: 'var(--font-body)' }}>{paper.year}</span>
                    {paper.citationCount !== null && (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-white/10 text-white/70" style={{ fontFamily: 'var(--font-mono)' }}>
                        {paper.citationCount} citations
                      </span>
                    )}
                  </div>
                </div>
                <a href={paper.url} target="_blank" rel="noopener noreferrer" className="block">
                  <h3 className="text-white font-medium mb-3 group-hover:text-mint-400 transition-colors line-clamp-2" style={{ fontFamily: 'var(--font-display)' }}>
                    {paper.title}
                  </h3>
                  <p className="text-sm text-white/50 mb-3 line-clamp-3" style={{ fontFamily: 'var(--font-body)' }}>
                    {paper.abstract || 'No abstract available'}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-white/40">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span style={{ fontFamily: 'var(--font-body)' }}>{paper.venue}</span>
                  </div>
                  {paper.authors.length > 0 && (
                    <p className="text-xs text-white/30 mt-2 line-clamp-1" style={{ fontFamily: 'var(--font-body)' }}>
                      {paper.authors.slice(0, 3).join(', ')}{paper.authors.length > 3 ? ' et al.' : ''}
                    </p>
                  )}
                </a>
              </article>
            ))}
          </div>
        )}

        {/* Expand/Collapse button */}
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
            <span>{expanded ? 'Show Top 6 Only' : 'View All Publications'}</span>
          </button>
        </div>
      </div>
    </section>
  );
}