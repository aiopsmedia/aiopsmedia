import Link from 'next/link';
import { ArrowRight, Code2, Brain, Globe, Smartphone, Cloud, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

const defaultServices = [
  {
    icon: Brain,
    title: 'AI & Automation',
    description: 'Leverage machine learning, NLP, and intelligent automation to streamline your business processes.',
    href: '/services#ai-automation',
  },
  {
    icon: Code2,
    title: 'Custom Software',
    description: 'Tailored software solutions built to solve your unique business challenges and scale with growth.',
    href: '/services#custom-software',
  },
  {
    icon: Globe,
    title: 'Web Development',
    description: 'Modern, responsive web applications built with cutting-edge technologies for optimal performance.',
    href: '/services#web-development',
  },
  {
    icon: Smartphone,
    title: 'Mobile Apps',
    description: 'Native and cross-platform mobile applications that deliver exceptional user experiences.',
    href: '/services#mobile-apps',
  },
  {
    icon: Cloud,
    title: 'Cloud Solutions',
    description: 'Scalable cloud infrastructure, migration, and management for reliable and cost-efficient operations.',
    href: '/services#cloud-solutions',
  },
  {
    icon: Shield,
    title: 'Cybersecurity',
    description: 'Protect your digital assets with comprehensive security assessments, monitoring, and compliance solutions.',
    href: '/services#cybersecurity',
  },
];

function ServicesSection({ services }) {
  const items = services && services.length > 0 ? services : defaultServices;

  return (
    <section className="bg-[#050816] py-20 sm:py-28" id="services" aria-labelledby="services-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="services-heading" className="text-3xl font-bold text-[#F8FAFC] sm:text-4xl">
            Our{' '}
            <span className="bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] bg-clip-text text-transparent">Services</span>
          </h2>
          <p className="mt-4 text-[#94A3B8]">
            End-to-end technology solutions designed to help your business innovate, automate, and grow.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((service) => {
            const Icon = service.icon || Code2;
            return (
              <Link
                key={service.title}
                href={service.href}
                className="group relative rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#0B1220] p-6 transition-all duration-300 hover:border-[#22D3EE]/30 hover:shadow-lg hover:shadow-[#22D3EE]/5"
              >
                <div className="mb-4 inline-flex rounded-lg bg-[#22D3EE]/10 p-2.5">
                  <Icon className="h-6 w-6 text-[#22D3EE]" />
                </div>
                <h3 className="text-lg font-semibold text-[#F8FAFC]">{service.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#94A3B8]">{service.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#22D3EE] transition-all group-hover:gap-2">
                  Learn More <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export { ServicesSection };
