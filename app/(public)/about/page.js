import Link from 'next/link';
import Image from 'next/image';
import {
  Target, Eye, Heart, Users, Award, Rocket, Shield, Lightbulb, ArrowRight,
  Building2, GraduationCap, HeartPulse, Globe, CheckCircle,
} from 'lucide-react';
import { db } from '@/lib/db';
import { siteConfig } from '@/config';
import { generateMetadata as baseGenerateMetadata, generateOrganizationSchema, generateLocalBusinessSchema } from '@/lib/seo';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Button } from '@/components/ui/button';
import { CtaSection } from '@/components/public/cta-section';

export const metadata = baseGenerateMetadata({
  title: 'About Us',
  description:
    'Learn about AIOpsMedia — our story, mission, vision, and the team behind AI-powered digital solutions for businesses across India.',
  url: '/about',
});

async function getTeam() {
  try {
    return await db.employee.findMany({
      where: { employmentStatus: 'ACTIVE' },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        designation: true,
        department: true,
        profileImage: true,
      },
    });
  } catch {
    return [];
  }
}

const fallbackTeam = [
  { id: '1', name: 'Debendra Nath Karmakar', designation: 'Founder & CEO', department: 'MANAGEMENT', profileImage: null },
  { id: '2', name: 'Technical Team', designation: 'Engineering', department: 'DEVELOPMENT', profileImage: null },
];

const values = [
  { icon: Lightbulb, title: 'Innovation First', description: 'We stay at the forefront of AI and technology to bring cutting-edge solutions to every project.' },
  { icon: Heart, title: 'Client-Centric', description: 'Your success is our success. We build lasting partnerships through transparency and results.' },
  { icon: Shield, title: 'Quality & Security', description: 'Enterprise-grade quality and security practices are embedded in every solution we deliver.' },
  { icon: Rocket, title: 'Agile Delivery', description: 'Rapid iteration, transparent communication, and on-time delivery using modern methodologies.' },
  { icon: Users, title: 'Collaborative Spirit', description: 'We work as an extension of your team, combining our expertise with your domain knowledge.' },
  { icon: Award, title: 'Excellence', description: 'We hold ourselves to the highest standards in code quality, design, and client experience.' },
];

const timeline = [
  { year: '2024', title: 'Founded', description: 'AIOpsMedia was founded in Kishanganj, Bihar with a mission to democratize AI for every business.' },
  { year: '2024', title: 'First Products', description: 'Launched RealEstate ERP and School ERP — our first industry-specific solutions.' },
  { year: '2025', title: 'Growing Team', description: 'Expanded the team across development, design, and AI/automation departments.' },
  { year: '2026', title: 'Building Forward', description: 'Focused on AI, software and automation for businesses worldwide — built in India, serving clients remotely. We avoid unverified project/client counts until audited.' },
];

export default async function AboutPage() {
  const dbTeam = await getTeam();
  const team = dbTeam.length > 0 ? dbTeam : fallbackTeam;

  const orgSchema = generateOrganizationSchema();
  const localSchema = generateLocalBusinessSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localSchema) }}
      />

      <section className="relative overflow-hidden bg-[#050816] pt-28 pb-20 sm:pt-36">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -top-40 -right-40 h-[400px] w-[400px] rounded-full bg-[#22D3EE]/10 blur-[128px]" />
          <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-[#8B5CF6]/10 blur-[128px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'About Us' },
            ]}
          />

          <div className="mt-8 max-w-3xl">
            <h1 className="text-4xl font-extrabold tracking-tight text-[#F8FAFC] sm:text-5xl">
              About{' '}
              <span className="bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] bg-clip-text text-transparent">
                AIOpsMedia
              </span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-[#94A3B8]">
              We&apos;re on a mission to democratize AI for every business. From startups to enterprises,
              we build intelligent software, automate operations, and drive digital growth.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#0B1220] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold text-[#F8FAFC]">Our Story</h2>
              <p className="mt-4 text-[#94A3B8] leading-relaxed">
                AIOpsMedia was born from a simple belief: every business, regardless of size or location,
                deserves access to world-class AI and technology solutions. Founded by {siteConfig.founder} in {siteConfig.address},
                we started as a small team with a big vision — to bridge the gap between cutting-edge technology
                and real business needs.
              </p>
              <p className="mt-4 text-[#94A3B8] leading-relaxed">
                Today, we&apos;ve grown into a full-service digital solutions company, serving clients across
                real estate, education, healthcare, retail, and more. Our portfolio includes custom software,
                ERP systems, AI-powered tools, and mobile applications — all built with a focus on
                measurable business outcomes.
              </p>

              <div className="mt-8 overflow-hidden rounded-xl border border-[rgba(148,163,184,0.15)] shadow-2xl shadow-[#22D3EE]/5">
                <Image
                  src="/about-image.png"
                  alt="AIOpsMedia team and technology"
                  width={1024}
                  height={768}
                  className="h-auto w-full object-cover"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Target, title: 'Mission', text: 'Democratize AI and technology for every business, enabling growth through intelligent solutions.' },
                { icon: Eye, title: 'Vision', text: 'To be the most trusted technology partner for businesses across India and beyond.' },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#050816] p-6">
                  <div className="mb-3 inline-flex rounded-lg bg-[#22D3EE]/10 p-2">
                    <item.icon className="h-5 w-5 text-[#22D3EE]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#F8FAFC]">{item.title}</h3>
                  <p className="mt-2 text-sm text-[#94A3B8]">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#050816] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-[#F8FAFC]">
            Our{' '}
            <span className="bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] bg-clip-text text-transparent">
              Values
            </span>
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v) => (
              <div key={v.title} className="rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#0B1220] p-6">
                <div className="mb-4 inline-flex rounded-lg bg-[#22D3EE]/10 p-2.5">
                  <v.icon className="h-5 w-5 text-[#22D3EE]" />
                </div>
                <h3 className="text-lg font-semibold text-[#F8FAFC]">{v.title}</h3>
                <p className="mt-2 text-sm text-[#94A3B8] leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0B1220] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-[#F8FAFC]">
            Our{' '}
            <span className="bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] bg-clip-text text-transparent">
              Journey
            </span>
          </h2>
          <div className="relative mt-12">
            <div className="absolute left-1/2 top-0 hidden h-full w-px bg-gradient-to-b from-[#22D3EE]/30 to-[#8B5CF6]/30 lg:block" aria-hidden="true" />
            <div className="space-y-10">
              {timeline.map((item, i) => (
                <div key={i} className={`relative flex flex-col items-center gap-4 lg:flex-row ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                  <div className={`flex-1 ${i % 2 === 0 ? 'lg:text-right' : 'lg:text-left'} text-center lg:text-inherit`}>
                    <span className="text-sm font-bold text-[#22D3EE]">{item.year}</span>
                    <h3 className="mt-1 text-lg font-bold text-[#F8FAFC]">{item.title}</h3>
                    <p className="mt-1 text-sm text-[#94A3B8]">{item.description}</p>
                  </div>
                  <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#22D3EE]/30 bg-[#050816]">
                    <div className="h-3 w-3 rounded-full bg-[#22D3EE]" />
                  </div>
                  <div className="flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#050816] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-[#F8FAFC]">
            Technology{' '}
            <span className="bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] bg-clip-text text-transparent">
              Capabilities
            </span>
          </h2>
          <div className="mx-auto mt-10 max-w-3xl">
            <p className="text-center text-xs text-[#94A3B8]/70">Only technologies we actually use — see <Link href="/technology" className="text-[#22D3EE]">Technology</Link>.</p>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {[
                'Next.js / React', 'Node.js / REST APIs', 'PostgreSQL / MongoDB',
                'Prisma ORM', 'Tailwind CSS', 'Vercel / Cloud',
                'LLM APIs (Groq)', 'Vector Search (pgvector)',
              ].map((tech) => (
                <div
                  key={tech}
                  className="flex items-center gap-2 rounded-lg border border-[rgba(148,163,184,0.15)] bg-[#0B1220] px-4 py-3 text-sm text-[#94A3B8] transition-colors hover:border-[#22D3EE]/20 hover:text-[#F8FAFC]"
                >
                  <CheckCircle className="h-3.5 w-3.5 text-[#22D3EE]" />
                  {tech}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0B1220] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-[#F8FAFC]">
            Meet Our{' '}
            <span className="bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] bg-clip-text text-transparent">
              Team
            </span>
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member) => (
              <div
                key={member.id}
                className="rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#050816] p-6 text-center transition-all duration-300 hover:border-[#22D3EE]/20"
              >
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#22D3EE] to-[#8B5CF6] text-2xl font-bold text-[#050816]">
                  {member.profileImage ? (
                    <img src={member.profileImage} alt={member.name} className="h-full w-full rounded-full object-cover" />
                  ) : (
                    member.name.split(' ').map((n) => n[0]).join('').slice(0, 2)
                  )}
                </div>
                <h3 className="text-lg font-bold text-[#F8FAFC]">{member.name}</h3>
                <p className="mt-1 text-sm text-[#94A3B8]">{member.designation}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
