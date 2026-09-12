import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import prompts from 'prompts';
import pc from 'picocolors';
import ora from 'ora';

const ECOSYSTEMS = [
  { title: 'Next.js 15 (App Router)', value: 'nextjs' },
  { title: 'React (Vite)', value: 'react' },
  { title: 'Vue.js 3 / Nuxt', value: 'vue' },
  { title: 'Svelte 5 / SvelteKit', value: 'svelte' },
  { title: 'Angular 18+ (Signals)', value: 'angular' },
  { title: 'SolidJS', value: 'solid' },
  { title: 'Astro', value: 'astro' },
  { title: 'Laravel Blade', value: 'blade' },
  { title: 'React Native / Expo', value: 'react-native' },
  { title: 'Flutter (Dart)', value: 'flutter' },
];

async function run(): Promise<void> {
  console.log(pc.bold(pc.cyan('\n  ▲ create-exhuma — Universal Project Starter Wizard\n')));

  const args = process.argv.slice(2);
  let projectName = args[0];

  if (!projectName) {
    const res = await prompts({
      type: 'text',
      name: 'projectName',
      message: 'Project name:',
      initial: 'my-exhuma-app',
    });
    projectName = res.projectName;
  }

  if (!projectName) {
    console.log(pc.yellow('  Initialization cancelled.\n'));
    return;
  }

  const targetPath = resolve(process.cwd(), projectName);
  if (existsSync(targetPath)) {
    const { overwrite } = await prompts({
      type: 'confirm',
      name: 'overwrite',
      message: `Directory ${pc.yellow(projectName)} already exists. Continue?`,
      initial: false,
    });
    if (!overwrite) {
      console.log(pc.yellow('  Cancelled.\n'));
      return;
    }
  }

  const { ecosystem } = await prompts({
    type: 'select',
    name: 'ecosystem',
    message: 'Select your ecosystem:',
    choices: ECOSYSTEMS,
    initial: 0,
  });

  if (!ecosystem) {
    console.log(pc.yellow('  Cancelled.\n'));
    return;
  }

  const spinner = ora(`Scaffolding Exhuma project in ${pc.bold(projectName)}...`).start();

  mkdirSync(targetPath, { recursive: true });

  // Generate exhuma.json
  const config = {
    $schema: 'https://exhuma.dev/schema.json',
    flavor: ecosystem,
    path: ecosystem === 'flutter' ? 'lib/widgets' : 'components/ui',
    typescript: true,
    tailwind: true,
  };
  writeFileSync(resolve(targetPath, 'exhuma.json'), JSON.stringify(config, null, 2) + '\n');

  // Generate basic README
  const readme = `# ${projectName}\n\nBuilt with [Exhuma](https://exhuma.dev) — Universal Component Platform.\n\n## Getting Started\n\n\`\`\`bash\nnpx exhuma add stacking-cards\nnpx exhuma add horizontal-scroller\n\`\`\`\n`;
  writeFileSync(resolve(targetPath, 'README.md'), readme);

  spinner.succeed(pc.green(`Project created at ${pc.bold(projectName)}`));

  console.log(pc.dim('\n  Next steps:'));
  console.log(`  cd ${pc.cyan(projectName)}`);
  console.log(`  ${pc.cyan('npx exhuma add --all')} to install all components`);
  console.log(`  ${pc.cyan('npx exhuma list')} to view available components\n`);
}

run().catch((err) => {
  console.error(pc.red(`Error: ${err.message}`));
  process.exit(1);
});
