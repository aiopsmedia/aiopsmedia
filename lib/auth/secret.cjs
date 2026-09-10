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
// restarts by writing it to a generated file.
//
// Resolution order:
//   1. process.env.AUTH_SECRET (set in Hostinger env panel — RECOMMENDED)
//   2. <project-root>/lib/generated/auth-secret.cjs (persisted, committed or generated)
//   3. A fresh random secret (last resort — sessions won't survive restarts)
'use strict';

const crypto = require('crypto');
const fs = require('fs');
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

// Use process.cwd() — NOT __dirname — so the path is stable whether
// we're inside next.config.mjs (build time) or .next/server (runtime).
const PROJECT_ROOT = process.cwd();
const GENERATED_DIR = path.join(PROJECT_ROOT, 'lib', 'generated');

function resolveAuthSecret() {
  // 1. Environment variable (BEST — set in Hostinger panel)
  for (const name of ['AUTH_SECRET', 'NEXTAUTH_SECRET']) {
    const value = process.env[name];
    if (isValidSecret(value)) return value.trim();
  }

  // 2. Persisted file in project (survives restarts as long as deploy dir persists)
  const projectFile = path.join(GENERATED_DIR, 'auth-secret.cjs');
  const existing = readSecretFile(projectFile);
  if (existing) return existing;

  // 3. Generate and persist (first boot only — must be stable after this)
  const secret = crypto.randomBytes(32).toString('hex');
  writeSecretFile(projectFile, secret);

  const persisted = readSecretFile(projectFile);
  if (persisted) {
    console.warn(
      '[auth] Generated a new AUTH_SECRET and saved to ' + projectFile + '. ' +
      'Set AUTH_SECRET as an environment variable in your Hostinger panel to ' +
      'avoid this warning on fresh deploys.'
    );
    return persisted;
  }

  // 4. Last resort — won't survive restarts
  console.warn(
    '[auth] CRITICAL: AUTH_SECRET is not configured and the generated file ' +
    'could not be written. Sessions will NOT survive restarts. Set AUTH_SECRET ' +
    'as an environment variable in your Hostinger panel.'
  );
  return secret;
}

module.exports = { resolveAuthSecret, isValidSecret };
