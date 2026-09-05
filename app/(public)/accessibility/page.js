import { LegalPage, getLegalMetadata } from '@/components/public/legal-page';

export const generateMetadata = async () => getLegalMetadata('accessibility');

export default async function AccessibilityPage() {
  return <LegalPage slug="accessibility" />;
}
