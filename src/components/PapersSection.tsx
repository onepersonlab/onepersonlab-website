import { useState, useEffect } from 'react';

interface Paper {
  title: string;
  authors: string;
  venue: string;
  year: number;
  abstract: string;
  url: string;
  citations: number;
  tags: string[];
}

const DEMO_PAPERS: Paper[] = [
  {
    title: 'Scaling Laws for Solo Research: A Quantitative Analysis',
    authors: 'OnePersonLab',
    venue: 'arXiv preprint',
    year: 2026,
    abstract: 'We present a comprehensive analysis of research output scaling in single-researcher environments, demonstrating that productivity follows a power law distribution with key leverage points.',
    url: 'https://arxiv.org/abs/2401.00001',
    citations: 42,
    tags: ['Research Methods', 'Productivity'],
  },
  {
    title: 'Knowledge Graph Construction from Scientific Literature',
    authors: 'OnePersonLab, Academic Partners',
    venue: 'NAACL 2025',
    year: 2025,
    abstract: 'A novel approach to automatically constructing domain-specific knowledge graphs from scientific papers using transformer-based entity extraction and relation modeling.',
    url: 'https://aclanthology.org/2025.naacl-main.001',
    citations: 89,
    tags: ['NLP', 'Knowledge Graphs'],
  },
  {
    title: 'The One-Person Lab Paradigm: Tools and Methodologies',
    authors: 'OnePersonLab',
    venue: 'Nature Methods',
    year: 2024,
    abstract: 'An overview of the emerging paradigm of single-researcher laboratories, including tooling recommendations, workflow optimizations, and case studies from successful independent researchers.',
    url: 'https://doi.org/10.1038/s41592-024-00001-x',
    citations: 156,
    tags: ['Methodology', 'Tools'],
  },
];

export function PapersSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('papers');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      id="papers" 
      className="min-h-screen py-24 px-6 bg-gradient-to-b from-navy-900 via-navy-800 to-navy-900 relative"
      aria-labelledby="papers-heading"
    >
      {/* Decorative elements */}
      <div 
        className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-mint-400/30 to-transparent"
        aria-hidden="true"
      />
      
      {/* Section header */}
      <div 
        className={`max-w-6xl mx-auto mb-16 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <h2 
          id="papers-heading"
          className="text-3xl md:text-4xl font-bold text-white mb-4"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Published{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-mint-400 to-mint-500">
            Papers
          </span>
        </h2>
        <p 
          className="text-white/60 max-w-2xl mx-auto"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Peer-reviewed research advancing the science of solo research
        </p>
      </div>

      {/* Papers grid */}
      <div 
        className={`max-w-6xl mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-3 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        {DEMO_PAPERS.map((paper, index) => (
          <article 
            key={paper.title}
            className="group relative bg-navy-800/50 border border-white/10 rounded-xl p-6 hover:border-mint-400/50 hover:bg-navy-800/80 transition-all duration-300"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {paper.tags.map((tag) => (
                <span 
                  key={tag}
                  className="px-2 py-1 text-xs font-medium bg-mint-400/10 text-mint-400 rounded-full"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {tag}
                </span>
              ))}
            </div>
            
            {/* Title */}
            <h3 
              className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-mint-400 transition-colors"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              <a 
                href={paper.url}
                target="_blank"
                rel="noopener noreferrer"
                className="after:absolute after:inset-0"
              >
                {paper.title}
              </a>
            </h3>
            
            {/* Meta info */}
            <p 
              className="text-sm text-white/50 mb-3"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {paper.venue} • {paper.year}
            </p>
            
            {/* Abstract */}
            <p 
              className="text-sm text-white/70 line-clamp-3 mb-4"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {paper.abstract}
            </p>
            
            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="flex items-center gap-1 text-white/60">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span 
                  className="text-sm"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {paper.citations} citations
                </span>
              </div>
              
              <span 
                className="text-mint-400 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-hidden="true"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </div>
          </article>
        ))}
      </div>
      
      {/* View all button */}
      <div 
        className={`mt-12 text-center transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <a
          href="https://scholar.google.com/citations?user=example"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 border border-mint-400/50 text-mint-400 hover:bg-mint-400/10 rounded-lg transition-all duration-300"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          </svg>
          <span>View All Publications</span>
        </a>
      </div>
    </section>
  );
}