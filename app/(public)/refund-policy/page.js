import { LegalPage, getLegalMetadata } from '@/components/public/legal-page';

export const generateMetadata = async () => getLegalMetadata('refund-policy');

export default async function RefundPolicyPage() {
  return <LegalPage slug="refund-policy" />;
}
