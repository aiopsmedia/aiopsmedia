import { LegalPage, getLegalMetadata } from '@/components/public/legal-page';

export const generateMetadata = async () => getLegalMetadata('data-protection');

export default async function DataProtectionPage() {
  return <LegalPage slug="data-protection" />;
}
