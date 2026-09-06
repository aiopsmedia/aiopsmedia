import { existsSync, readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Auth.js needs ONE stable AUTH_SECRET shared by every bundle in the process
 * (App-routes AND the proxy). If the env var is missing, fall back to the
 * build-time generated file so login works on hosts (e.g. Hostinger) where
 * env vars were never configured. The file is created by
 * scripts/generate-auth-secret.mjs and is gitignored.
 */
const PLACEHOLDER_SECRET = 'generate-with-npx-auth-secret';
function ensureAuthSecret() {
  const raw = process.env.AUTH_SECRET || '';
  if (raw.trim() && raw.trim() !== PLACEHOLDER_SECRET) return;
  try {
    const file = join(__dirname, 'lib', 'generated', 'auth-secret.cjs');
    if (existsSync(file)) {
      const m = /AUTH_SECRET:\s*'([0-9a-f]{32,})'/.exec(readFileSync(file, 'utf8'));
      if (m) process.env.AUTH_SECRET = m[1];
    }
  } catch {
    // ignore; lib/auth falls back to a per-process random secret
  }
}
ensureAuthSecret();

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // HTML pages: never cache so a redeploy never serves stale HTML
        // (stale HTML points to old chunks/server-action IDs -> ChunkLoadError,
        // UnrecognizedActionError, broken login form).
        source:
          '/((?!_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|ico|webp|avif|txt|xml|css|js|mjs|woff2?|ttf|eot|map|json|wasm|mp4|webm|pdf)$).*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'private, no-cache, no-store, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
