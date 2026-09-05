import { LegalPage, getLegalMetadata } from '@/components/public/legal-page';

export const generateMetadata = async () => getLegalMetadata('terms-conditions');

export default async function TermsConditionsPage() {
  return <LegalPage slug="terms-conditions" />;
}
