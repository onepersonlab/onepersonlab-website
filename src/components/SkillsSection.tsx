import { useState, useEffect } from 'react';
import { getGitHubSkills, getClawHubSkills } from '../data/skills';
import type { GitHubSkill, ClawHubSkill } from '../data/skills';

const CATEGORY_COLORS: Record<string, string> = {
  'Official Skills': 'bg-blue-500/20 text-blue-400',
  'Agent Templates': 'bg-purple-500/20 text-purple-400',
  'Medical Skills': 'bg-red-500/20 text-red-400',
  'Awesome List': 'bg-yellow-500/20 text-yellow-400',
  'Developer Skills': 'bg-green-500/20 text-green-400',
  'Bioinformatics': 'bg-cyan-500/20 text-cyan-400',
  'Research Skills': 'bg-indigo-500/20 text-indigo-400',
  'Writing Skills': 'bg-amber-500/20 text-amber-400',
  'Browser Automation': 'bg-orange-500/20 text-orange-400',
  'Research': 'bg-indigo-500/20 text-indigo-400',
  'Search': 'bg-pink-500/20 text-pink-400',
  'Security': 'bg-rose-500/20 text-rose-400',
  'Automation': 'bg-teal-500/20 text-teal-400',
  'Tools': 'bg-slate-500/20 text-slate-400',
  'Discovery': 'bg-violet-500/20 text-violet-400',
  'Multi-Agent': 'bg-emerald-500/20 text-emerald-400',
};

export function SkillsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [githubSkills, setGithubSkills] = useState<GitHubSkill[]>([]);
  const [clawhubSkills, setClawhubSkills] = useState<ClawHubSkill[]>([]);

  useEffect(() => {
    const github = getGitHubSkills();
    const sortedGithub = [...github].sort((a, b) => b.stars - a.stars);
    setGithubSkills(sortedGithub);

    const clawhub = getClawHubSkills();
    const sortedClawhub = [...clawhub].sort((a, b) => b.downloads - a.downloads);
    setClawhubSkills(sortedClawhub);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    const section = document.getElementById('skills');
    if (section) observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="skills" className="min-h-screen py-24 px-6 bg-navy-900 relative" aria-labelledby="skills-heading">
      <div className={`max-w-6xl mx-auto mb-12 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <h2 id="skills-heading" className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          Research <span className="text-transparent bg-clip-text bg-gradient-to-r from-mint-400 to-mint-500">Skills & Templates</span>
        </h2>
        <p className="text-white/60 max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-body)' }}>
          Agent skills and templates from GitHub and ClawHub registry
        </p>
      </div>

      {/* GitHub Skills Section */}
      <div className={`max-w-6xl mx-auto mb-16 transition-all duration-1000 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3" style={{ fontFamily: 'var(--font-display)' }}>
          <svg className="w-6 h-6 text-white/70" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
          </svg>
          GitHub Skills & Templates
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {githubSkills.map((skill) => (
            <article key={skill.full_name} className="group relative bg-navy-800/50 border border-white/10 rounded-xl p-5 hover:border-mint-400/50 transition-all duration-300">
              <div className="flex items-start justify-between mb-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${CATEGORY_COLORS[skill.category] || 'bg-white/10 text-white/70'}`} style={{ fontFamily: 'var(--font-body)' }}>
                  {skill.category}
                </span>
              </div>
              <a href={skill.url} target="_blank" rel="noopener noreferrer" className="block">
                <h4 className="text-white font-medium mb-2 group-hover:text-mint-400 transition-colors line-clamp-1" style={{ fontFamily: 'var(--font-display)' }}>
                  {skill.name}
                </h4>
                <p className="text-sm text-white/50 mb-3 line-clamp-2" style={{ fontFamily: 'var(--font-body)' }}>
                  {skill.description}
                </p>
                <div className="flex items-center gap-4 text-sm text-white/40">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
                    </svg>
                    {skill.stars >= 1000 ? `${(skill.stars / 1000).toFixed(1)}k` : skill.stars}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75v-.878a2.25 2.25 0 111.5 0v.878a2.25 2.25 0 01-2.25 2.25h-1.5v1.128a2.251 2.251 0 11-1.5 0V8.5h-1.5A2.25 2.25 0 013 6.25v-.878a2.25 2.25 0 111.5 0z" />
                    </svg>
                    {skill.forks >= 1000 ? `${(skill.forks / 1000).toFixed(1)}k` : skill.forks}
                  </span>
                </div>
              </a>
            </article>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className={`max-w-6xl mx-auto mb-16 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/20"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 py-2 bg-navy-900 text-white/50 text-sm rounded-lg" style={{ fontFamily: 'var(--font-body)' }}>
              ClawHub Registry
            </span>
          </div>
        </div>
      </div>

      {/* ClawHub Skills Section */}
      <div className={`max-w-6xl mx-auto transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3" style={{ fontFamily: 'var(--font-display)' }}>
          <svg className="w-6 h-6 text-mint-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          Hot Skills from ClawHub
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clawhubSkills.slice(0, 12).map((skill) => (
            <article key={skill.slug} className="group relative bg-mint-400/5 border border-mint-400/20 rounded-xl p-5 hover:border-mint-400/50 transition-all duration-300">
              <div className="flex items-start justify-between mb-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${CATEGORY_COLORS[skill.category] || 'bg-white/10 text-white/70'}`} style={{ fontFamily: 'var(--font-body)' }}>
                  {skill.category}
                </span>
              </div>
              <a href={skill.url} target="_blank" rel="noopener noreferrer" className="block">
                <h4 className="text-white font-medium mb-2 group-hover:text-mint-400 transition-colors line-clamp-1" style={{ fontFamily: 'var(--font-display)' }}>
                  {skill.displayName}
                </h4>
                <p className="text-sm text-white/50 mb-3 line-clamp-2" style={{ fontFamily: 'var(--font-body)' }}>
                  {skill.description}
                </p>
                <div className="flex items-center gap-4 text-sm text-white/40">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-mint-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    {skill.downloads >= 1000 ? `${(skill.downloads / 1000).toFixed(0)}k` : skill.downloads}
                  </span>
                  {skill.stars && (
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
                      </svg>
                      {skill.stars}
                    </span>
                  )}
                  <span className="text-white/30">by {skill.author}</span>
                </div>
              </a>
            </article>
          ))}
        </div>

        {/* View more button */}
        <div className="mt-8 text-center">
          <a href="https://clawhub.ai/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 border border-mint-400/50 text-mint-400 hover:bg-mint-400/10 rounded-lg transition-all duration-300" style={{ fontFamily: 'var(--font-body)' }}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View more in ClawHub
          </a>
        </div>
      </div>
    </section>
  );
}