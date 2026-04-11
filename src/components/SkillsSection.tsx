import { useState, useEffect } from 'react';

interface Skill {
  name: string;
  description: string;
  source: string;
  url: string;
  category: string;
  stars: number;
  language: string;
}

const RESEARCH_SKILLS: Skill[] = [
  {
    name: 'frontend-design',
    description: 'Create distinctive, production-grade frontend interfaces with bold aesthetics',
    source: 'GitHub',
    url: 'https://github.com/anthropics/claude-code/tree/main/plugins/frontend-design',
    category: 'UI Design',
    stars: 5000,
    language: 'Markdown'
  },
  {
    name: 'literature-review',
    description: 'Search academic papers via Semantic Scholar, OpenAlex, Crossref, PubMed APIs',
    source: 'OpenClaw',
    url: 'https://docs.openclaw.ai',
    category: 'Research',
    stars: 200,
    language: 'TypeScript'
  },
  {
    name: 'tavily-search',
    description: 'Web search via Tavily API for fast research and source discovery',
    source: 'OpenClaw',
    url: 'https://docs.openclaw.ai',
    category: 'Search',
    stars: 200,
    language: 'TypeScript'
  },
  {
    name: 'agent-browser',
    description: 'Headless browser automation with accessibility tree snapshots',
    source: 'OpenClaw',
    url: 'https://docs.openclaw.ai',
    category: 'Automation',
    stars: 200,
    language: 'TypeScript'
  },
  {
    name: 'skill-vetter',
    description: 'Security vetting protocol for AI agent skill installation',
    source: 'OpenClaw',
    url: 'https://docs.openclaw.ai',
    category: 'Security',
    stars: 200,
    language: 'TypeScript'
  },
  {
    name: 'ai-humanizer',
    description: 'Detect and remove AI-generated text patterns, humanize writing',
    source: 'OpenClaw',
    url: 'https://docs.openclaw.ai',
    category: 'Writing',
    stars: 200,
    language: 'TypeScript'
  },
  {
    name: 'write-a-prd',
    description: 'Create Product Requirements Documents through interactive interview',
    source: 'GitHub',
    url: 'https://github.com/mattpocock/skills',
    category: 'Planning',
    stars: 1500,
    language: 'Markdown'
  },
  {
    name: 'design-an-interface',
    description: 'Generate multiple interface design variations with parallel subagents',
    source: 'GitHub',
    url: 'https://github.com/mattpocock/skills',
    category: 'UI Design',
    stars: 1500,
    language: 'Markdown'
  },
  {
    name: 'ToolUniverse',
    description: '1000+ tools for AI scientist systems via MCP integration',
    source: 'GitHub',
    url: 'https://github.com/mims-harvard/ToolUniverse',
    category: 'Tools',
    stars: 1240,
    language: 'Python'
  },
  {
    name: 'agency-agents',
    description: '144 professional Agent templates across 12 departments',
    source: 'GitHub',
    url: 'https://github.com/msitarzewski/agency-agents',
    category: 'Templates',
    stars: 800,
    language: 'Markdown'
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  'UI Design': 'from-purple-400 to-purple-500',
  'Research': 'from-blue-400 to-blue-500',
  'Search': 'from-green-400 to-green-500',
  'Automation': 'from-yellow-400 to-yellow-500',
  'Security': 'from-red-400 to-red-500',
  'Writing': 'from-pink-400 to-pink-500',
  'Planning': 'from-indigo-400 to-indigo-500',
  'Tools': 'from-cyan-400 to-cyan-500',
  'Templates': 'from-orange-400 to-orange-500',
};

export function SkillsSection() {
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

    const section = document.getElementById('skills');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      id="skills" 
      className="min-h-screen py-24 px-6 bg-navy-800 relative"
      aria-labelledby="skills-heading"
    >
      <div className={`max-w-6xl mx-auto mb-12 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <h2 id="skills-heading" className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          Research{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-mint-400 to-mint-500">Skills</span>
        </h2>
        <p className="text-white/60 max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-body)' }}>
          Agent skills and templates for scientific research from ClawHub and GitHub
        </p>
        <p className="text-white/40 text-sm mt-2" style={{ fontFamily: 'var(--font-body)' }}>
          {RESEARCH_SKILLS.length} skills available
        </p>
      </div>

      <div className={`max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {RESEARCH_SKILLS.map((skill) => (
          <a
            key={skill.name}
            href={skill.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-xl border border-white/10 bg-navy-900/50 backdrop-blur-sm hover:border-mint-400/50 hover:bg-navy-900/70 transition-all duration-300"
          >
            {/* Category indicator */}
            <div 
              className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${CATEGORY_COLORS[skill.category] || 'from-gray-400 to-gray-500'}`}
            />
            
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span 
                    className={`px-2 py-1 rounded text-xs font-medium bg-gradient-to-r ${CATEGORY_COLORS[skill.category] || 'from-gray-400 to-gray-500'} text-white`}
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {skill.category}
                  </span>
                  <span className="text-xs text-white/40" style={{ fontFamily: 'var(--font-body)' }}>
                    {skill.source}
                  </span>
                </div>
              </div>
              
              {/* Skill name */}
              <h3 
                className="text-lg font-semibold text-mint-400 group-hover:text-mint-500 transition-colors mb-2"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {skill.name}
              </h3>
              
              {/* Description */}
              <p 
                className="text-sm text-white/50 mb-4 line-clamp-2"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {skill.description}
              </p>
              
              {/* Footer */}
              <div className="flex items-center justify-between text-xs text-white/30">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-mint-400/50" />
                  <span style={{ fontFamily: 'var(--font-mono)' }}>{skill.language}</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
                  </svg>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>{skill.stars >= 1000 ? `${(skill.stars / 1000).toFixed(1)}k` : skill.stars}</span>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Link to ClawHub */}
      <div className={`max-w-6xl mx-auto mt-12 text-center transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <a
          href="https://clawhub.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 border border-mint-400/50 text-mint-400 hover:bg-mint-400/10 rounded-lg transition-all duration-300"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          <span>Explore more skills on ClawHub</span>
        </a>
      </div>
    </section>
  );
}