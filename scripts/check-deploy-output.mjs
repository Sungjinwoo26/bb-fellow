import { readdir, rm } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';

// The Cloudflare Vite plugin can copy local development secrets into its
// generated Worker directory. Never modify the source .dev.vars file.
const output = resolve('dist');
if (process.argv.includes('--clean')) {
  await rm(join(output, 'find_my_routine', '.dev.vars'), { force: true });
}
async function inspect(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Deployment output contains a symbolic link: ${relative(output, path)}`);
    if (entry.isDirectory()) await inspect(path);
    else if (/^(\.dev\.vars|\.env)(\.|$)/i.test(entry.name)) {
      throw new Error(`Secret-like file in deployment output: ${relative(output, path)}`);
    }
  }
}
await inspect(output);
console.log('Deployment output checked: no .dev.vars or .env files found.');
