import githubSkillsData from './github-skills-update.json';
import clawhubSkillsData from './clawhub-skills-update.json';

export interface GitHubSkill {
  full_name: string;
  name: string;
  owner: string;
  description: string;
  language: string | null;
  stars: number;
  forks: number;
  weeklyStars: number;
  updated: string;
  url: string;
  category: string;
}

export interface ClawHubSkill {
  name: string;
  slug: string;
  displayName: string;
  description: string;
  category: string;
  downloads: number;
  stars: number | null;
  author: string;
  url: string;
}

export function getGitHubSkills(): GitHubSkill[] {
  return githubSkillsData.skills.map((s: any) => ({
    full_name: s.full_name,
    name: s.name,
    owner: s.owner,
    description: s.description,
    language: s.language,
    stars: s.stars,
    forks: s.forks,
    weeklyStars: s.weeklyStars,
    updated: s.updated,
    url: s.url,
    category: s.category
  }));
}

export function getClawHubSkills(): ClawHubSkill[] {
  return clawhubSkillsData.skills.map((s: any) => ({
    name: s.name || s.displayName || s.slug,
    slug: s.slug,
    displayName: s.displayName || s.name || s.slug,
    description: s.description,
    category: s.category,
    downloads: s.downloads,
    stars: s.stars,
    author: s.author,
    url: s.url
  }));
}

export function getSkillsMeta(): { github_count: number; clawhub_count: number; generated_at: string } {
  return {
    github_count: githubSkillsData.skill_count,
    clawhub_count: clawhubSkillsData.skill_count,
    generated_at: githubSkillsData.generated_at
  };
}