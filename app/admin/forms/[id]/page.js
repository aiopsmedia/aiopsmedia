import { requireAuth } from '@/lib/auth/session';
import { db } from '@/lib/db';
import FormSubmissions from '@/components/admin/form-submissions';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Form Submissions - AIOpsMedia Admin',
};

export const dynamic = 'force-dynamic';

export default async function FormDetailPage({ params }) {
  await requireAuth();

  const { id } = await params;

  const form = await db.form.findUnique({
    where: { id },
    include: {
      submissions: {
        orderBy: { createdAt: 'desc' },
        take: 500,
      },
    },
  });

  if (!form) notFound();

  const fields = typeof form.fields === 'string' ? JSON.parse(form.fields) : form.fields;
  const serialized = {
    ...form,
    fields,
    submissions: form.submissions.map((s) => ({
      ...s,
      data: typeof s.data === 'string' ? JSON.parse(s.data) : s.data,
    })),
  };

  return (
    <div className="space-y-6">
      <FormSubmissions form={serialized} />
    </div>
  );
}