// Research Agent Repositories
import researchData from '../data/Research-agent-list-update.json';
import generalData from '../data/General-agent-list-update.json';

export interface Repo {
  name: string;
  full_name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  weeklyStars: number;
  updated: string;
  url: string;
  owner: string;
}

export type AgentType = 'research' | 'general';

export const RESEARCH_REPOS: Repo[] = researchData.repos as Repo[];
export const GENERAL_REPOS: Repo[] = generalData.repos as Repo[];

export const REPO_DATA_META = {
  research: {
    description: researchData.description,
    source: researchData.source,
    generated_at: researchData.generated_at,
    repo_count: researchData.repo_count,
    subtitle: 'Agent systems and automated research tools for scientific discovery',
  },
  general: {
    description: generalData.description,
    source: generalData.source,
    generated_at: generalData.generated_at,
    repo_count: generalData.repo_count,
    subtitle: 'Agent systems and automated tools for general purposes',
  },
};

export function getRepos(type: AgentType): Repo[] {
  return type === 'research' ? RESEARCH_REPOS : GENERAL_REPOS;
}

export function getMeta(type: AgentType) {
  return REPO_DATA_META[type];
}