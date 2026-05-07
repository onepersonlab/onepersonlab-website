#!/usr/bin/env node
/**
 * Data Validation Script
 * Validates all JSON data files against Zod schemas before build.
 * Run: npx tsx scripts/validate-data.ts
 *
 * Exit code 0 = all valid, 1 = validation errors found
 */
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import {
  RepoListSchema,
  PaperListSchema,
  GitHubSkillListSchema,
  ClawHubSkillListSchema,
} from '../src/data/schemas.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'src', 'data');

const VALIDATIONS: Array<{
  file: string;
  schema: { safeParse: (d: unknown) => { success: boolean; error?: { issues: Array<{ path: (string | number)[]; message: string }> } } };
  label: string;
}> = [
  { file: 'Research-agent-list-update.json', schema: RepoListSchema, label: 'Research Agent Repos' },
  { file: 'General-agent-list-update.json',  schema: RepoListSchema, label: 'General Agent Repos' },
  { file: 'top-6-papers-update.json',        schema: PaperListSchema, label: 'Top 6 Papers' },
  { file: 'all-papers-update.json',          schema: PaperListSchema, label: 'All Papers' },
  { file: 'developer-papers-update.json',    schema: PaperListSchema, label: 'Developer Papers' },
  { file: 'github-skills-update.json',       schema: GitHubSkillListSchema, label: 'GitHub Skills' },
  { file: 'clawhub-skills-update.json',      schema: ClawHubSkillListSchema, label: 'ClawHub Skills' },
];

let totalErrors = 0;
let filesChecked = 0;
let filesSkipped = 0;

console.log('🔍 Validating data files...\n');

for (const { file, schema, label } of VALIDATIONS) {
  const filePath = join(DATA_DIR, file);

  if (!existsSync(filePath)) {
    console.log(`⚠️  SKIP: ${label} — file not found: ${file}`);
    filesSkipped++;
    continue;
  }

  try {
    const raw = readFileSync(filePath, 'utf-8');
    const data = JSON.parse(raw);
    const result = schema.safeParse(data);

    if (result.success) {
      // Show item counts
      const count = data.repos?.length ?? data.papers?.length ?? data.skills?.length ?? 0;
      console.log(`✅ ${label} (${count} items)`);
      filesChecked++;
    } else {
      const issues = result.error.issues;
      console.log(`❌ ${label} — ${issues.length} validation error(s):`);
      for (const issue of issues.slice(0, 10)) {
        const path = issue.path.join('.');
        console.log(`   [${path || 'root'}] ${issue.message}`);
      }
      if (issues.length > 10) {
        console.log(`   ... and ${issues.length - 10} more errors`);
      }
      totalErrors += issues.length;
    }
  } catch (err) {
    console.log(`❌ ${label} — JSON parse error: ${(err as Error).message}`);
    totalErrors++;
  }
}

console.log('');
console.log(`📊 Summary: ${filesChecked} passed, ${filesSkipped} skipped, ${totalErrors} error(s)`);

if (totalErrors > 0) {
  console.log('\n❌ VALIDATION FAILED — fix data files before building');
  process.exit(1);
} else {
  console.log('✅ All data files valid');
  process.exit(0);
}
