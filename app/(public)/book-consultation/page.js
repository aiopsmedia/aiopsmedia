import { generateMetadata as baseGenerateMetadata } from '@/lib/seo';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import ConsultationForm from './consultation-form';

export const metadata = baseGenerateMetadata({
  title: 'Book a Free Consultation | AiOpsMedia',
  description: 'Request a 15–30 minute discovery call. We will review your workflows and propose the right technology approach.',
  url: '/book-consultation',
});

export default function BookConsultationPage() {
  return (
    <section className="bg-[#050816] pt-28 pb-20 sm:pt-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Book Consultation' }]} />
        <div className="mt-8 max-w-3xl">
          <h1 className="text-4xl font-extrabold text-[#F8FAFC] sm:text-5xl">Book a Free Consultation</h1>
          <p className="mt-4 text-lg text-[#94A3B8]">15–30 minute discovery call. We do not use a fake calendar — we collect your preferred date/time and confirm manually. No urgency tricks.</p>
        </div>
        <div className="mt-10 max-w-3xl rounded-2xl border border-[rgba(148,163,184,0.15)] bg-[#0B1220] p-6 sm:p-8">
          <ConsultationForm />
        </div>
        <p className="mt-4 max-w-3xl text-xs text-[#94A3B8]/70">Prefer email? <a href="/contact" className="text-[#22D3EE]">Contact us</a> or <a href="/estimate" className="text-[#22D3EE]">get an estimate</a>.</p>
      </div>
    </section>
  );
}
