import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { generateMetadata as baseGenerateMetadata } from '@/lib/seo';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import EmbeddedForm from '@/components/public/embedded-form';
import { ClipboardList } from 'lucide-react';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const form = await db.form.findUnique({
    where: { slug },
    select: { name: true, description: true },
  });
  if (!form || !form.name) return { title: 'Form not found' };
  return baseGenerateMetadata({
    title: form.name,
    description: form.description || `Complete the ${form.name} form.`,
    url: `/forms/${slug}`,
  });
}

export const dynamic = 'force-dynamic';

export default async function FormPage({ params }) {
  const { slug } = await params;

  const form = await db.form.findUnique({ where: { slug } });

  if (!form) notFound();
  if (!form.isActive) {
    return (
      <section className="bg-[#050816] pt-28 pb-20 sm:pt-36 sm:pb-28">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-[rgba(148,163,184,0.15)] bg-[#0B1220] p-8 text-center">
            <ClipboardList className="mx-auto h-10 w-10 text-[#94A3B8]" />
            <h1 className="mt-4 text-xl font-bold text-[#F8FAFC]">This form is closed</h1>
            <p className="mt-2 text-sm text-[#94A3B8]">This form is not currently accepting submissions.</p>
          </div>
        </div>
      </section>
    );
  }

  const fields =
    typeof form.fields === 'string' ? JSON.parse(form.fields) : Array.isArray(form.fields) ? form.fields : [];
  const serialized = { ...form, fields };

  return (
    <section className="bg-[#050816] pt-28 pb-20 sm:pt-36 sm:pb-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: form.name },
            ]}
          />
        </div>

        <div className="mb-10 text-center">
          <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-xl bg-[#22D3EE]/10">
            <ClipboardList className="h-7 w-7 text-[#22D3EE]" />
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#F8FAFC] sm:text-4xl">
            {form.name}
          </h1>
          {form.description && (
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-[#94A3B8]">
              {form.description}
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-[rgba(148,163,184,0.15)] bg-white/[0.03] p-6 sm:p-10">
          <EmbeddedForm form={serialized} />
        </div>
      </div>
    </section>
  );
}