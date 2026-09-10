import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',

  async redirects() {
    return [
      { source: '/products', destination: '/services', permanent: true },
      { source: '/products/:path*', destination: '/services/:path*', permanent: false },
      { source: '/terms', destination: '/terms-conditions', permanent: true },
      { source: '/cookie-policy', destination: '/cookies-policy', permanent: true },
      { source: '/data-processing', destination: '/data-protection', permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source:
          '/((?!_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|ico|webp|avif|txt|xml|css|js|mjs|woff2?|ttf|eot|map|json|wasm|mp4|webm|pdf)$).*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'private, no-cache, no-store, max-age=0, must-revalidate',
          },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
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
