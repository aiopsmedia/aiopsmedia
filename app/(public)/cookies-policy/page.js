import { LegalPage, getLegalMetadata } from '@/components/public/legal-page';

export const generateMetadata = async () => getLegalMetadata('cookies-policy');

export default async function CookiesPolicyPage() {
  return <LegalPage slug="cookies-policy" />;
}
