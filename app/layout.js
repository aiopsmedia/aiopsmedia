import { Geist, Geist_Mono } from 'next/font/google';
import { siteConfig } from '@/config';
import { ToastProvider } from '@/components/ui/toast-provider';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: 'AIOpsMedia democratizes AI for every business. We build AI-powered tools, automations, and digital solutions.',
  keywords: ['AI solutions', 'artificial intelligence', 'automation', 'machine learning', 'AIOpsMedia', 'digital transformation'],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: 'AIOpsMedia democratizes AI for every business.',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: 'AIOpsMedia democratizes AI for every business.',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#050816' },
    { media: '(prefers-color-scheme: light)', color: '#050816' },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          dangerouslySetInnerHTML={{
            __html: `(()=>{try{const k='chunk-reload-at';function canReload(){try{const t=sessionStorage.getItem(k);const n=Date.now();if(t&&n-parseInt(t,10)<10000)return false;sessionStorage.setItem(k,String(n));return true}catch{return true}}function hit(){if(canReload())location.reload();}function h(e){const m=(e&&e.message)||'';if(/ChunkLoadError|Failed to load chunk|Loading (JS )?chunk/i.test(m))hit();}function u(e){const m=(e&&e.reason&&e.reason.message)||'';if(/UnrecognizedActionError|was not found on the server/i.test(m))hit();}window.addEventListener('error',h);window.addEventListener('unhandledrejection',u);}catch{}})()`,
          }}
        />
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
