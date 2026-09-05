import { LegalPage, getLegalMetadata } from '@/components/public/legal-page';

export const generateMetadata = async () => getLegalMetadata('disclaimer');

export default async function DisclaimerPage() {
  return <LegalPage slug="disclaimer" />;
}
