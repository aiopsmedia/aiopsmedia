import Link from 'next/link';
import { ArrowRight, Code2, Brain, Globe, Smartphone, Cloud, Shield, Cpu, BarChart3, Database, Palette, Cog, Zap } from 'lucide-react';
import { db } from '@/lib/db';
import { generateMetadata as baseGenerateMetadata } from '@/lib/seo';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

export const metadata = baseGenerateMetadata({
  title: 'Our Services',
  description:
    'Explore AIOpsMedia services — AI & automation, custom software, web development, mobile apps, cloud solutions, cybersecurity, and ERP products.',
  url: '/services',
});

const iconMap = {
  Brain, Code2, Globe, Smartphone, Cloud, Shield, Cpu, BarChart3, Database, Palette, Cog, Zap,
};

async function getServices() {
  try {
    return await db.service.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        title: true,
        slug: true,
        icon: true,
        image: true,
        description: true,
        ctaText: true,
      },
    });
  } catch {
    return [];
  }
}

const fallbackServices = [
  { id: 'ai', title: 'AI & Automation', slug: 'ai-automation', icon: 'Brain', description: 'Leverage machine learning, NLP, and intelligent automation to streamline your business processes and unlock data-driven insights.' },
  { id: 'custom', title: 'Custom Software', slug: 'custom-software', icon: 'Code2', description: 'Tailored software solutions built to solve your unique business challenges and scale with your growth.' },
  { id: 'web', title: 'Web Development', slug: 'web-development', icon: 'Globe', description: 'Modern, responsive web applications built with cutting-edge technologies for optimal performance and user experience.' },
  { id: 'mobile', title: 'Mobile Apps', slug: 'mobile-apps', icon: 'Smartphone', description: 'Native and cross-platform mobile applications that deliver exceptional user experiences on iOS and Android.' },
  { id: 'cloud', title: 'Cloud Solutions', slug: 'cloud-solutions', icon: 'Cloud', description: 'Scalable cloud infrastructure, migration, and management for reliable and cost-efficient operations.' },
  { id: 'cyber', title: 'Cybersecurity', slug: 'cybersecurity', icon: 'Shield', description: 'Protect your digital assets with comprehensive security assessments, monitoring, and compliance solutions.' },
];

export default async function ServicesPage() {
  const dbServices = await getServices();
  const services = dbServices.length > 0 ? dbServices : fallbackServices;

  return (
    <section className="bg-[#050816] pt-28 pb-20 sm:pt-36 sm:pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Services' },
            ]}
          />
        </div>

        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-[#F8FAFC] sm:text-5xl">
            Our{' '}
            <span className="bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] bg-clip-text text-transparent">
              Services
            </span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-[#94A3B8]">
            End-to-end technology solutions designed to help your business innovate, automate, and grow.
            From AI-powered automation to custom software, we deliver results.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = iconMap[service.icon] || Code2;
            return (
              <Link
                key={service.id || service.slug}
                href={`/services/${service.slug}`}
                className="group relative flex flex-col rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#0B1220] p-8 transition-all duration-300 hover:border-[#22D3EE]/30 hover:shadow-lg hover:shadow-[#22D3EE]/5"
              >
                <div className="mb-5 inline-flex w-fit rounded-xl bg-[#22D3EE]/10 p-3">
                  <Icon className="h-7 w-7 text-[#22D3EE]" />
                </div>

                <h2 className="text-xl font-bold text-[#F8FAFC]">{service.title}</h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-[#94A3B8]">
                  {service.description}
                </p>

                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-[#22D3EE] transition-all group-hover:gap-3">
                  Learn More <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-20 rounded-2xl border border-[rgba(148,163,184,0.15)] bg-[#0B1220] p-8 sm:p-12 text-center">
          <h2 className="text-2xl font-bold text-[#F8FAFC] sm:text-3xl">
            Not Sure Which Service You Need?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[#94A3B8]">
            Our team will help you identify the right solutions for your business. Schedule a free consultation
            and let&apos;s discuss your goals.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] px-8 py-3 text-sm font-semibold text-[#050816] shadow-lg shadow-[#22D3EE]/20 transition-all hover:shadow-[#22D3EE]/40 hover:brightness-110"
          >
            Get a Free Consultation <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
