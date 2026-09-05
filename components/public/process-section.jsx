import { Search, Target, Code2, Rocket } from 'lucide-react';

const defaultSteps = [
  {
    icon: Search,
    number: '01',
    title: 'Discovery',
    description: 'We analyze your business needs, challenges, and goals to define the project scope and requirements.',
  },
  {
    icon: Target,
    number: '02',
    title: 'Strategy',
    description: 'Our team crafts a detailed technical roadmap, architecture plan, and project timeline for your approval.',
  },
  {
    icon: Code2,
    number: '03',
    title: 'Development',
    description: 'Agile development with regular demos, transparent communication, and iterative progress updates.',
  },
  {
    icon: Rocket,
    number: '04',
    title: 'Launch',
    description: 'Thorough testing, deployment, team training, and ongoing support to ensure a smooth go-live.',
  },
];

function ProcessSection({ steps }) {
  const items = steps && steps.length > 0 ? steps : defaultSteps;

  return (
    <section className="bg-[#0B1220] py-20 sm:py-28" aria-labelledby="process-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="process-heading" className="text-3xl font-bold text-[#F8FAFC] sm:text-4xl">
            How We{' '}
            <span className="bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] bg-clip-text text-transparent">Work</span>
          </h2>
          <p className="mt-4 text-[#94A3B8]">
            A proven four-step process that turns your vision into reality.
          </p>
        </div>

        <div className="relative mt-14">
          <div className="hidden lg:block absolute top-12 left-0 right-0 h-px bg-gradient-to-r from-[#22D3EE]/30 via-[#8B5CF6]/30 to-[#22D3EE]/30" aria-hidden="true" />

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="relative text-center">
                  <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center">
                    <div className="absolute inset-0 rounded-full border border-[rgba(148,163,184,0.15)] bg-[#050816]" />
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#22D3EE]/15 to-[#8B5CF6]/15">
                      <Icon className="h-7 w-7 text-[#22D3EE]" />
                    </div>
                    <span
                      className="absolute -top-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] text-xs font-bold text-[#050816]"
                      aria-hidden="true"
                    >
                      {step.number}
                    </span>
                  </div>

                  {index < items.length - 1 && (
                    <div
                      className="absolute top-12 left-[calc(50%+48px)] right-[calc(-50%+48px)] h-px bg-gradient-to-r from-[#22D3EE]/30 via-[#8B5CF6]/30 to-[#22D3EE]/30 lg:block hidden"
                      aria-hidden="true"
                    />
                  )}

                  <h3 className="text-lg font-semibold text-[#F8FAFC]">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#94A3B8]">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export { ProcessSection };
