import { requireAuth } from '@/lib/auth/session';
import { db } from '@/lib/db';
import FormsManager from '@/components/admin/forms-manager';

export const metadata = {
  title: 'Forms - AIOpsMedia Admin',
};

export const dynamic = 'force-dynamic';

export default async function FormsPage() {
  await requireAuth();

  const forms = await db.form.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { submissions: true } } },
  });

  const serialized = forms.map((form) => ({
    ...form,
    fields: typeof form.fields === 'string' ? JSON.parse(form.fields) : form.fields,
  }));

  return <FormsManager initialForms={serialized} />;
}