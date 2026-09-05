import { LegalPage, getLegalMetadata } from '@/components/public/legal-page';

export const generateMetadata = async () => getLegalMetadata('privacy-policy');

export default async function PrivacyPolicyPage() {
  return <LegalPage slug="privacy-policy" />;
}
