import { SiteHeader } from '@/components/public/site-header';
import { SiteFooter } from '@/components/public/site-footer';
import AiChatbot from '@/components/public/ai-chatbot';
import CookieConsent from '@/components/public/cookie-consent';
import { generateOrganizationSchema, generateLocalBusinessSchema } from '@/lib/seo';

const schemas = [generateOrganizationSchema(), generateLocalBusinessSchema()];

export default function PublicLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#050816]">
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <AiChatbot />
      <CookieConsent />
    </div>
  );
}
