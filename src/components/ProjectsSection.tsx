import { useState, useEffect } from 'react';

interface Project {
  name: string;
  description: string;
  url: string;
  image?: string;
  status: 'live' | 'beta' | 'development';
}

const DEMO_PROJECTS: Project[] = [
  {
    name: 'OnePersonLab Dashboard',
    description: 'Central hub for managing research workflows, tracking progress, and visualizing output metrics.',
    url: 'https://dashboard.onepersonlab.io',
    status: 'live',
  },
  {
    name: 'Paper Organizer',
    description: 'Automatically organize and categorize your research papers with AI-powered tagging and search.',
    url: 'https://papers.onepersonlab.io',
    status: 'live',
  },
  {
    name: 'Citation Network',
    description: 'Explore citation relationships between papers with interactive graph visualization.',
    url: 'https://citations.onepersonlab.io',
    status: 'beta',
  },
  {
    name: 'Research Notebook',
    description: 'Collaborative research notebook with real-time syncing and version control.',
    url: 'https://notebook.onepersonlab.io',
    status: 'development',
  },
];

const STATUS_CONFIG = {
  live: { label: 'Live', color: 'bg-mint-400 text-navy-900' },
  beta: { label: 'Beta', color: 'bg-yellow-400/80 text-navy-900' },
  development: { label: 'Dev', color: 'bg-white/20 text-white' },
};

export function ProjectsSection() {
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

    const section = document.getElementById('projects');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      id="projects" 
      className="min-h-screen py-24 px-6 bg-navy-900 relative"
      aria-labelledby="projects-heading"
    >
      {/* Decorative background */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(0,229,160,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(0,229,160,0.05) 0%, transparent 30%)`
        }}
        aria-hidden="true"
      />
      
      {/* Section header */}
      <div 
        className={`max-w-6xl mx-auto mb-16 text-center relative z-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <h2 
          id="projects-heading"
          className="text-3xl md:text-4xl font-bold text-white mb-4"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Live{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-mint-400 to-mint-500">
            Projects
          </span>
        </h2>
        <p 
          className="text-white/60 max-w-2xl mx-auto"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Tools and platforms for the solo researcher community
        </p>
      </div>

      {/* Projects grid */}
      <div 
        className={`max-w-6xl mx-auto relative z-10 grid gap-8 md:grid-cols-2 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        {DEMO_PROJECTS.map((project, index) => (
          <article 
            key={project.name}
            className="group bg-navy-800/70 border border-white/10 rounded-xl overflow-hidden hover:border-mint-400/50 transition-all duration-300"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            {/* Project preview placeholder */}
            <div 
              className="h-48 bg-gradient-to-br from-navy-700 to-navy-900 relative overflow-hidden"
              aria-hidden="true"
            >
              {/* Decorative grid */}
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                  backgroundSize: '30px 30px'
                }}
              />
              
              {/* Centered project icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-2xl bg-mint-400/20 border border-mint-400/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg 
                    className="w-12 h-12 text-mint-400" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
              </div>
              
              {/* Status badge */}
              <div className="absolute top-4 right-4">
                <span 
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${STATUS_CONFIG[project.status].color}`}
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {STATUS_CONFIG[project.status].label}
                </span>
              </div>
            </div>
            
            {/* Project info */}
            <div className="p-6">
              <h3 
                className="text-xl font-semibold text-white mb-2 group-hover:text-mint-400 transition-colors"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                <a 
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {project.name}
                </a>
              </h3>
              
              <p 
                className="text-white/70 mb-4"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {project.description}
              </p>
              
              {/* Link */}
              <div className="flex items-center justify-between">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-mint-400 hover:text-mint-500 transition-colors"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  <span className="text-sm">{project.url.replace('https://', '')}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                
                {/* Arrow */}
                <span 
                  className="text-mint-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-hidden="true"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
      
      {/* Coming soon banner */}
      <div 
        className={`max-w-6xl mx-auto relative z-10 mt-12 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="bg-navy-800/50 border border-white/10 rounded-xl p-8 text-center">
          <h3 
            className="text-xl font-semibold text-white mb-2"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            More Projects Coming Soon
          </h3>
          <p 
            className="text-white/60 mb-6"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            We're actively building new tools for the solo research community. Stay tuned!
          </p>
          <a
            href="https://github.com/onepersonlab"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-mint-400 hover:text-mint-500 transition-colors"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <span>Follow development on GitHub</span>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}