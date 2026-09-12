import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export function checkConfiguration(root: string): string[] {
  const issues: string[] = [];
  for (const file of [
    '.gitignore',
    'pnpm-workspace.yaml',
    'package.json',
    'tsconfig.base.json',
    '.ai/manifest.json',
    '.ai/project.json',
    '.husky/pre-commit',
    '.github/workflows/auterix-verify.yml',
  ]) {
    if (!existsSync(resolve(root, file))) {
      issues.push(`Missing required configuration file: ${file}`);
    }
  }

  const manifest = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));
  if (!manifest || typeof manifest !== 'object') {
    issues.push('package.json must contain a valid JSON object.');
  }

  return issues;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const issues = checkConfiguration(process.cwd());
  for (const issue of issues) console.error(issue);
  if (issues.length) process.exitCode = 1;
  else console.log('Monorepo configuration verified.');
}
