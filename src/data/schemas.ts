/**
 * Data Validation Schemas — Zod
 * Runtime type validation for all data JSON files.
 * Ensures data matches TypeScript interfaces before build.
 */
import { z } from 'zod';

// ── Agent Repository ──
export const RepoSchema = z.object({
  name: z.string().min(1),
  full_name: z.string().min(1),
  description: z.string().default(''),
  language: z.string().default('Unknown'),
  stars: z.number().int().min(0),
  forks: z.number().int().min(0),
  weeklyStars: z.number().int().min(0).default(0),
  updated: z.string().min(1),
  url: z.string().url(),
  owner: z.string().min(1),
});

export const RepoListSchema = z.object({
  description: z.string(),
  source: z.string(),
  generated_at: z.string(),
  repo_count: z.number().int().min(0),
  repos: z.array(RepoSchema),
});

export type Repo = z.infer<typeof RepoSchema>;

// ── Paper ──
export const PaperSchema = z.object({
  order: z.number().int().min(0).optional(),
  title: z.string().min(1, 'Paper title is required'),
  doi: z.string().nullable().default(null),
  year: z.number().int().min(1900).max(2100).default(2024),
  venue: z.string().default(''),
  authors: z.array(z.string()).default([]),
  citationCount: z.number().int().min(0).nullable().default(null),
  abstract: z.string().default(''),
  url: z.string().default(''),
});

export const PaperListSchema = z.object({
  description: z.string(),
  source: z.string(),
  generated_at: z.string(),
  paper_count: z.number().int().min(0),
  papers: z.array(PaperSchema),
});

export type Paper = z.infer<typeof PaperSchema>;

// ── GitHub Skill ──
export const GitHubSkillSchema = z.object({
  full_name: z.string().min(1),
  name: z.string().min(1),
  owner: z.string().min(1),
  description: z.string().default(''),
  language: z.string().nullable().default(null),
  stars: z.number().int().min(0),
  forks: z.number().int().min(0),
  weeklyStars: z.number().int().min(0).default(0),
  updated: z.string().min(1),
  url: z.string().url(),
  category: z.string().default('General'),
});

export const GitHubSkillListSchema = z.object({
  description: z.string(),
  source: z.string(),
  generated_at: z.string(),
  skill_count: z.number().int().min(0),
  skills: z.array(GitHubSkillSchema),
});

export type GitHubSkill = z.infer<typeof GitHubSkillSchema>;

// ── ClawHub Skill ──
export const ClawHubSkillSchema = z.object({
  name: z.string().optional(),
  slug: z.string().min(1),
  displayName: z.string().min(1),
  description: z.string().default(''),
  category: z.string().default('General'),
  downloads: z.number().int().min(0),
  stars: z.number().int().min(0).nullable().default(null),
  author: z.string().default('unknown'),
  url: z.string().url(),
});

export const ClawHubSkillListSchema = z.object({
  description: z.string(),
  source: z.string(),
  generated_at: z.string(),
  skill_count: z.number().int().min(0),
  skills: z.array(ClawHubSkillSchema),
});

export type ClawHubSkill = z.infer<typeof ClawHubSkillSchema>;
