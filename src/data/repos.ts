// AI Agent Research Repositories
// Data loaded from AI-agent-list-update.json
// Use script: scripts/update-repo-stats.sh to refresh data

import repoData from '../data/AI-agent-list-update.json';

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

export const AGENT_REPOS: Repo[] = repoData.repos as Repo[];

// Metadata
export const REPO_DATA_META = {
  description: repoData.description,
  source: repoData.source,
  generated_at: repoData.generated_at,
  repo_count: repoData.repo_count,
};