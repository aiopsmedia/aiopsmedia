import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';
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

const GA_ID =
  process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || 'G-Z07LGLNQYM';

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
            __html: `(()=>{let r=false;function hit(){if(r)return;r=true;location.reload();}function h(e){if(!r){const m=(e&&e.message)||'';if(/ChunkLoadError|Failed to load chunk|Loading (JS )?chunk/i.test(m))hit();}}function u(e){if(!r){const m=(e&&e.reason&&e.reason.message)||'';if(/UnrecognizedActionError|was not found on the server/i.test(m))hit();}}window.addEventListener('error',h);window.addEventListener('unhandledrejection',u);})()`,
          }}
        />
        {children}
        <ToastProvider />
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="beforeInteractive" />
            <Script id="google-analytics" strategy="beforeInteractive">
              {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
