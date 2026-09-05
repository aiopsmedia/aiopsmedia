import { requireAuth } from '@/lib/auth/session';
import { db } from '@/lib/db';
import FaqsManager from '@/components/admin/faqs-manager';

export const metadata = {
  title: 'FAQs - AIOpsMedia Admin',
};

export default async function FaqsPage() {
  await requireAuth();

  const faqs = await db.fAQ.findMany({
    orderBy: { order: 'asc' },
  });

  return <FaqsManager initialFaqs={faqs} />;
}
