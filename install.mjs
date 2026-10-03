#!/usr/bin/env node
// Installs the wolf workflow toolchain for Claude Code at user level. Safe to re-run.
// Usage: node install.mjs [--dry-run]
import { spawnSync } from 'node:child_process';
import { cpSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const DRY = process.argv.includes('--dry-run');
const WIN = process.platform === 'win32';

const MARKETPLACES = [
  'anthropics/claude-plugins-official',
  'DietrichGebert/ponytail',
  'pbakaus/impeccable',
  'nextlevelbuilder/ui-ux-pro-max-skill',
];

const PLUGINS = [
  'superpowers@claude-plugins-official',
  'ponytail@ponytail',
  'impeccable@impeccable',
  'ui-ux-pro-max@ui-ux-pro-max-skill',
];

const SKILLS = [
  ['bmad-code-org/BMAD-METHOD', [
    'bmad', 'bmad-forge-idea', 'bmad-product-brief', 'bmad-prd', 'bmad-ux',
    'bmad-architecture', 'bmad-spec', 'bmad-advanced-elicitation',
    'bmod-method', 'bmod-core-tools',
  ]],
  ['LottieFiles/motion-design-skill', ['motion-design']],
];

// Windows needs cmd /c to launch npm shims as stdio MCP servers.
const stdio = (...cmd) => (WIN ? ['cmd', '/c', ...cmd] : cmd);
const MCPS = [
  { name: 'refero', args: ['--transport', 'http', 'refero', 'https://api.refero.design/mcp'] },
  { name: 'shadcn', args: ['shadcn', '--', ...stdio('npx', 'shadcn@latest', 'mcp')] },
  { name: 'task-master-ai', args: ['task-master-ai', '-e', 'TASK_MASTER_TOOLS=core', '--', ...stdio('task-master-ai')] },
];

const failures = [];

function run(cmd, { allowFail = false, quiet = false } = {}) {
  console.log(`$ ${cmd}`);
  if (DRY) return true;
  // All commands are built from the constants above; shell is needed for .cmd shims on Windows.
  const r = spawnSync(cmd, { shell: true, stdio: quiet ? 'ignore' : 'inherit' });
  if (r.status !== 0 && !allowFail) failures.push(cmd);
  return r.status === 0;
}

const has = (bin) => spawnSync(WIN ? `where ${bin}` : `command -v ${bin}`, { shell: true, stdio: 'ignore' }).status === 0;

console.log('\n== Prerequisites');
const missing = ['claude', 'npm', 'npx', 'git'].filter((b) => !has(b));
if (missing.length) {
  console.error(`Missing required tools: ${missing.join(', ')}. Install them and re-run.`);
  process.exit(1);
}
if (!has('uv')) console.warn('! uv not found. BMAD skills run their helper scripts with uv: https://docs.astral.sh/uv/');

console.log('\n== Plugin marketplaces');
// Already-added marketplaces exit non-zero; that's fine.
for (const m of MARKETPLACES) run(`claude plugin marketplace add ${m}`, { allowFail: true });

console.log('\n== Plugins');
for (const p of PLUGINS) run(`claude plugin install ${p} --scope user`);

console.log('\n== Skills');
for (const [repo, names] of SKILLS) {
  run(`npx -y skills add ${repo} -g -a claude-code -y --skill ${names.join(' ')}`);
}

console.log('\n== CLIs');
run('npm install -g task-master-ai openwiki');
run('openwiki integrations install claude');

console.log('\n== MCP servers');
for (const { name, args } of MCPS) {
  if (!DRY && run(`claude mcp get ${name}`, { allowFail: true, quiet: true })) {
    console.log(`  ${name} already configured, skipping`);
    continue;
  }
  run(`claude mcp add --scope user ${args.join(' ')}`);
}

console.log('\n== /wolf skill');
const src = join(dirname(fileURLToPath(import.meta.url)), 'skills', 'wolf');
const dest = join(homedir(), '.claude', 'skills', 'wolf');
console.log(`copy ${src} -> ${dest}`);
if (!DRY) cpSync(src, dest, { recursive: true, force: true });

if (failures.length) {
  console.error(`\n${failures.length} step(s) failed:\n  ${failures.join('\n  ')}`);
  process.exit(1);
}
console.log('\nDone. Restart Claude Code, then try: /wolf <describe the work>');
