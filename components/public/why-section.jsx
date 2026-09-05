import { Brain, Code2, Headphones, Lightbulb, Shield, Zap } from 'lucide-react';

const defaultBenefits = [
  {
    icon: Brain,
    title: 'AI-Powered Solutions',
    description: 'We integrate cutting-edge AI and machine learning to automate processes and unlock data-driven insights.',
  },
  {
    icon: Code2,
    title: 'Custom Development',
    description: 'Every solution is tailored to your specific business needs — no one-size-fits-all templates or shortcuts.',
  },
  {
    icon: Headphones,
    title: 'End-to-End Support',
    description: 'From initial consultation through development, launch, and ongoing maintenance — we are with you every step.',
  },
  {
    icon: Zap,
    title: 'Rapid Delivery',
    description: 'Agile methodology and experienced teams ensure fast turnaround without compromising quality or reliability.',
  },
  {
    icon: Shield,
    title: 'Security First',
    description: 'Enterprise-grade security practices built into every solution to protect your data and ensure compliance.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation Focus',
    description: 'We stay ahead of technology trends so you can leverage the latest tools for competitive advantage.',
  },
];

function WhySection({ benefits }) {
  const items = benefits && benefits.length > 0 ? benefits : defaultBenefits;

  return (
    <section className="bg-[#050816] py-20 sm:py-28" aria-labelledby="why-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="why-heading" className="text-3xl font-bold text-[#F8FAFC] sm:text-4xl">
            Why{' '}
            <span className="bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] bg-clip-text text-transparent">AIOpsMedia</span>
          </h2>
          <p className="mt-4 text-[#94A3B8]">
            We combine technical expertise with business understanding to deliver solutions that truly make a difference.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                className="rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#0B1220] p-6 transition-all duration-300 hover:border-[#22D3EE]/20"
              >
                <div className="mb-4 inline-flex rounded-lg bg-[#22D3EE]/10 p-2.5">
                  <Icon className="h-5 w-5 text-[#22D3EE]" />
                </div>
                <h3 className="text-lg font-semibold text-[#F8FAFC]">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#94A3B8]">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export { WhySection };
