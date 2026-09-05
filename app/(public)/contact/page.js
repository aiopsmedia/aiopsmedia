import { siteConfig } from '@/config';
import { WHATSAPP_URL } from '@/config/constants';
import { generateMetadata as baseGenerateMetadata } from '@/lib/seo';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react';
import { ContactForm } from './contact-form';

export const metadata = baseGenerateMetadata({
  title: 'Contact Us',
  description:
    'Get in touch with AIOpsMedia. Contact us for AI solutions, custom software, ERP products, and digital transformation services.',
  url: '/contact',
});

export default async function ContactPage({ searchParams }) {
  const params = await searchParams;
  const preselectedService = params?.service || params?.product || '';

  const contactInfo = [
    { icon: Mail, label: 'Email', value: siteConfig.email, href: `mailto:${siteConfig.email}` },
    { icon: Phone, label: 'Phone', value: siteConfig.phone, href: `tel:${siteConfig.phone.replace(/\s/g, '')}` },
    { icon: MessageCircle, label: 'WhatsApp', value: 'Chat on WhatsApp', href: WHATSAPP_URL },
    { icon: MapPin, label: 'Address', value: siteConfig.address, href: null },
    { icon: Clock, label: 'Working Hours', value: siteConfig.workingHours, href: null },
  ];

  return (
    <section className="bg-[#050816] pt-28 pb-20 sm:pt-36 sm:pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Contact Us' },
            ]}
          />
        </div>

        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-[#F8FAFC] sm:text-5xl">
            Get in{' '}
            <span className="bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] bg-clip-text text-transparent">
              Touch
            </span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-[#94A3B8]">
            Have a project in mind? Need a custom solution? We&apos;d love to hear from you.
            Reach out and let&apos;s discuss how we can help your business grow.
          </p>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-[#F8FAFC]">Contact Information</h2>
            <p className="mt-2 text-sm text-[#94A3B8]">
              Reach out through any of these channels. We typically respond within 2 business hours.
            </p>

            <div className="mt-8 space-y-5">
              {contactInfo.map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#22D3EE]/10">
                    <item.icon className="h-5 w-5 text-[#22D3EE]" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-[#94A3B8]">{item.label}</p>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith('http') ? '_blank' : undefined}
                        rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="mt-0.5 text-sm text-[#F8FAFC] transition-colors hover:text-[#22D3EE]"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="mt-0.5 text-sm text-[#F8FAFC]">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#0B1220] p-6">
              <h3 className="text-sm font-semibold text-[#F8FAFC]">Quick Response Guarantee</h3>
              <p className="mt-2 text-xs leading-relaxed text-[#94A3B8]">
                We value your time. Expect a response within 2 business hours during working hours.
                For urgent inquiries, call us directly or message on WhatsApp.
              </p>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-[rgba(148,163,184,0.15)] bg-[#0B1220] p-6 sm:p-8">
              <h2 className="text-xl font-bold text-[#F8FAFC]">Send Us a Message</h2>
              <p className="mt-1 text-sm text-[#94A3B8]">
                Fill out the form below and we&apos;ll get back to you shortly.
              </p>
              <div className="mt-6">
                <ContactForm preselectedService={preselectedService} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
