import { Building2, GraduationCap, HeartPulse, ShoppingBag, Factory, Banknote, Truck, Landmark } from 'lucide-react';

const defaultIndustries = [
  { icon: Building2, name: 'Real Estate', description: 'Property management, lead automation, and client portals' },
  { icon: GraduationCap, name: 'Education', description: 'School ERP, LMS, student management, and parent apps' },
  { icon: HeartPulse, name: 'Healthcare', description: 'Patient management, telemedicine, and health records' },
  { icon: ShoppingBag, name: 'Retail & E-Commerce', description: 'Inventory, POS, customer analytics, and online stores' },
  { icon: Banknote, name: 'Finance', description: 'Banking automation, fintech apps, and compliance tools' },
  { icon: Truck, name: 'Logistics', description: 'Fleet management, supply chain, and route optimization' },
  { icon: Factory, name: 'Manufacturing', description: 'Production planning, IoT integration, and quality control' },
  { icon: Landmark, name: 'Government', description: 'Digital governance, citizen services, and e-governance' },
];

function IndustriesSection({ industries }) {
  const items = industries && industries.length > 0 ? industries : defaultIndustries;

  return (
    <section className="bg-[#050816] py-20 sm:py-28" aria-labelledby="industries-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="industries-heading" className="text-3xl font-bold text-[#F8FAFC] sm:text-4xl">
            Industries{' '}
            <span className="bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] bg-clip-text text-transparent">We Serve</span>
          </h2>
          <p className="mt-4 text-[#94A3B8]">
            Tailored technology solutions for diverse industries and business verticals.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((industry) => {
            const Icon = industry.icon;
            return (
              <div
                key={industry.name}
                className="group rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#0B1220] p-5 text-center transition-all duration-300 hover:border-[#22D3EE]/20 hover:shadow-lg hover:shadow-[#22D3EE]/5"
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-[#22D3EE]/10 transition-colors group-hover:bg-[#22D3EE]/15">
                  <Icon className="h-6 w-6 text-[#22D3EE]" />
                </div>
                <h3 className="text-sm font-semibold text-[#F8FAFC]">{industry.name}</h3>
                <p className="mt-1 text-xs leading-relaxed text-[#94A3B8]">{industry.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export { IndustriesSection };
