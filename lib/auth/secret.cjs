// Shared, stable AUTH_SECRET resolution.
//
// WHY THIS EXISTS:
// Auth.js (NextAuth v5) signs/encrypts the JWT session cookie with AUTH_SECRET.
// If the secret is missing, the previous code fell back to a *per-process random*
// secret. On hosts like Hostinger where the .env / env vars are not always
// present, every restart produced a NEW secret, so existing cookies could not be
// decrypted ("no matching decryption secret") and users were stuck in a login loop.
//
// This module guarantees the SAME secret is used by every bundle in the process
// (next.config.mjs at boot AND lib/auth) and that the secret PERSISTS across
// restarts by writing it to a generated file. It is used by both:
//   - next.config.mjs  (boot-time, ESM -> uses createRequire)
//   - lib/auth/index.js (NextAuth config)
//
// Resolution order:
//   1. process.env.AUTH_SECRET or process.env.NEXTAUTH_SECRET (recommended)
//   2. lib/generated/auth-secret.cjs  (persisted in the project, gitignored)
//   3. os.tmpdir()/aiopsmedia-auth-secret.cjs (persists across app restarts)
//   4. A fresh random secret (last resort — sessions won't survive restarts)
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');

const PLACEHOLDER = 'generate-with-npx-auth-secret';
const MIN_LENGTH = 32;
const FILE_REGEX = /AUTH_SECRET:\s*'([0-9a-fA-F]{32,})'/;

function isValidSecret(value) {
  return (
    typeof value === 'string' &&
    value.trim().length >= MIN_LENGTH &&
    value.trim() !== PLACEHOLDER
  );
}

function readSecretFile(file) {
  try {
    if (!fs.existsSync(file)) return null;
    const m = FILE_REGEX.exec(fs.readFileSync(file, 'utf8'));
    const secret = m ? m[1] : null;
    return secret && isValidSecret(secret) ? secret.trim() : null;
  } catch {
    return null;
  }
}

function writeSecretFile(file, secret) {
  try {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, `module.exports = { AUTH_SECRET: '${secret}' };\n`, 'utf8');
    return true;
  } catch {
    return false;
  }
}

function resolveAuthSecret() {
  for (const name of ['AUTH_SECRET', 'NEXTAUTH_SECRET']) {
    const value = process.env[name];
    if (isValidSecret(value)) return value.trim();
  }

  const projectFile = path.join(__dirname, '..', 'generated', 'auth-secret.cjs');
  const tmpFile = path.join(os.tmpdir(), 'aiopsmedia-auth-secret.cjs');

  const existing = readSecretFile(projectFile) || readSecretFile(tmpFile);
  if (existing) return existing;

  const secret = crypto.randomBytes(32).toString('hex');
  const wroteProject = writeSecretFile(projectFile, secret);
  const wroteTmp = writeSecretFile(tmpFile, secret);

  const persisted = readSecretFile(projectFile) || readSecretFile(tmpFile);
  if (persisted) return persisted;

  if (!wroteProject && !wroteTmp) {
    console.warn(
      '[auth] CRITICAL: AUTH_SECRET is not configured and the filesystem is ' +
        'read-only, so sessions will NOT survive restarts. Set AUTH_SECRET as an ' +
        'environment variable (e.g. in the Hostinger environment config).'
    );
  }
  return secret;
}

module.exports = { resolveAuthSecret, isValidSecret };