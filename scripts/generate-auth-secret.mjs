import { randomBytes } from 'crypto';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dir = join(root, 'lib', 'generated');
const file = join(dir, 'auth-secret.cjs');

if (!existsSync(file)) {
  mkdirSync(dir, { recursive: true });
  const secret = randomBytes(32).toString('hex');
  writeFileSync(file, `module.exports = { AUTH_SECRET: '${secret}' };\n`);
  console.log('[generate-auth-secret] wrote ' + file);
} else {
  console.log('[generate-auth-secret] secret already exists, keeping it');
}