import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, CheckCircle, Star, ChevronRight } from 'lucide-react';
import { db } from '@/lib/db';
import { generateMetadata as baseGenerateMetadata, generateServiceSchema } from '@/lib/seo';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Button } from '@/components/ui/button';
import { CtaSection } from '@/components/public/cta-section';

const fallbackServices = {
  'ai-automation': {
    title: 'AI & Automation',
    slug: 'ai-automation',
    icon: 'Brain',
    description: 'Leverage machine learning, NLP, and intelligent automation to streamline your business processes.',
    longDescription: 'Our AI & Automation services help businesses harness the power of artificial intelligence to automate repetitive tasks, gain predictive insights, and make data-driven decisions. We design and implement custom AI solutions tailored to your specific industry and business needs.',
    features: JSON.stringify(['Machine Learning Models', 'Natural Language Processing', 'Predictive Analytics', 'Process Automation', 'Chatbots & Virtual Assistants', 'Computer Vision']),
    benefits: JSON.stringify(['40% reduction in manual tasks', 'Real-time data-driven decisions', 'Scalable AI infrastructure', 'Competitive advantage through AI']),
    process: JSON.stringify(['Discovery & Data Assessment', 'AI Strategy & Architecture', 'Model Development & Training', 'Integration & Deployment']),
    products: [],
  },
  'custom-software': {
    title: 'Custom Software Development',
    slug: 'custom-software',
    icon: 'Code2',
    description: 'Tailored software solutions built to solve your unique business challenges and scale with growth.',
    longDescription: 'We build custom software from the ground up, designed specifically for your workflows, users, and growth plans. From ERP systems to internal tools, our solutions are built to last and scale.',
    features: JSON.stringify(['Full-Stack Development', 'API Design & Integration', 'Database Architecture', 'Microservices', 'DevOps & CI/CD', 'Quality Assurance']),
    benefits: JSON.stringify(['Solutions tailored to your exact needs', 'Full ownership of codebase', 'Scalable architecture', 'Long-term cost savings']),
    process: JSON.stringify(['Requirements Gathering', 'System Design', 'Iterative Development', 'Testing & Deployment']),
    products: [],
  },
  'web-development': {
    title: 'Web Development',
    slug: 'web-development',
    icon: 'Globe',
    description: 'Modern, responsive web applications built with cutting-edge technologies for optimal performance.',
    longDescription: 'From corporate websites to complex web applications, we build fast, secure, and beautiful web experiences using modern frameworks and best practices.',
    features: JSON.stringify(['React / Next.js Development', 'Progressive Web Apps', 'E-commerce Solutions', 'CMS Integration', 'Performance Optimization', 'SEO-Friendly Architecture']),
    benefits: JSON.stringify(['Lightning-fast load times', 'Mobile-first responsive design', 'Search engine optimized', 'Accessible to all users']),
    process: JSON.stringify(['UX/UI Design', 'Frontend Development', 'Backend Integration', 'Launch & Optimization']),
    products: [],
  },
  'mobile-apps': {
    title: 'Mobile App Development',
    slug: 'mobile-apps',
    icon: 'Smartphone',
    description: 'Native and cross-platform mobile applications that deliver exceptional user experiences.',
    longDescription: 'We create beautiful, high-performance mobile apps for iOS and Android using React Native and Flutter, ensuring a consistent experience across all devices.',
    features: JSON.stringify(['iOS & Android Development', 'React Native / Flutter', 'Push Notifications', 'Offline Support', 'App Store Optimization', 'Analytics Integration']),
    benefits: JSON.stringify(['Reach customers on any device', 'Consistent cross-platform experience', 'Fast time-to-market', 'Reduced development costs']),
    process: JSON.stringify(['Wireframing & Prototyping', 'UI/UX Design', 'Cross-Platform Development', 'Testing & App Store Launch']),
    products: [],
  },
  'cloud-solutions': {
    title: 'Cloud Solutions',
    slug: 'cloud-solutions',
    icon: 'Cloud',
    description: 'Scalable cloud infrastructure, migration, and management for reliable and cost-efficient operations.',
    longDescription: 'We help businesses migrate to, optimize, and manage cloud infrastructure on AWS, GCP, and Azure. Our solutions ensure reliability, security, and cost efficiency.',
    features: JSON.stringify(['Cloud Migration', 'AWS / GCP / Azure', 'Kubernetes & Docker', 'Infrastructure as Code', 'Cost Optimization', 'Monitoring & Alerting']),
    benefits: JSON.stringify(['99.9% uptime guarantee', '40-60% infrastructure cost reduction', 'Automatic scaling', 'Enhanced security posture']),
    process: JSON.stringify(['Infrastructure Audit', 'Migration Planning', 'Cloud Migration', 'Optimization & Monitoring']),
    products: [],
  },
  'cybersecurity': {
    title: 'Cybersecurity',
    slug: 'cybersecurity',
    icon: 'Shield',
    description: 'Protect your digital assets with comprehensive security assessments, monitoring, and compliance solutions.',
    longDescription: 'Our cybersecurity services protect your business from threats with thorough assessments, robust security architecture, continuous monitoring, and compliance management.',
    features: JSON.stringify(['Security Assessments', 'Penetration Testing', 'SOC & Monitoring', 'Compliance Management', 'Incident Response', 'Security Training']),
    benefits: JSON.stringify(['Proactive threat detection', 'Regulatory compliance', 'Reduced security incidents', 'Peace of mind']),
    process: JSON.stringify(['Security Assessment', 'Strategy & Architecture', 'Implementation', 'Continuous Monitoring']),
    products: [],
  },
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return baseGenerateMetadata({ title: 'Service Not Found', url: `/services/${slug}` });

  return baseGenerateMetadata({
    title: service.seoTitle || service.title,
    description: service.seoDescription || service.description,
    url: `/services/${slug}`,
  });
}

async function getService(slug) {
  try {
    return await db.service.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        slug: true,
        icon: true,
        image: true,
        description: true,
        longDescription: true,
        features: true,
        benefits: true,
        process: true,
        pricing: true,
        ctaText: true,
        ctaLink: true,
        seoTitle: true,
        seoDescription: true,
        products: {
          where: { isActive: true },
          select: {
            id: true,
            title: true,
            slug: true,
            shortDescription: true,
            price: true,
            originalPrice: true,
            rating: true,
            image: true,
          },
        },
      },
    });
  } catch {
    return null;
  }
}

export default async function ServiceDetailPage({ params }) {
  const { slug } = await params;
  const service = (await getService(slug)) || fallbackServices[slug];

  if (!service) notFound();

  const features = service.features ? JSON.parse(service.features) : [];
  const benefits = service.benefits ? JSON.parse(service.benefits) : [];
  const processSteps = service.process ? JSON.parse(service.process) : [];
  const relatedProducts = service.products || [];

  const schema = generateServiceSchema(service);

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}

      <section className="relative overflow-hidden bg-[#050816] pt-28 pb-16 sm:pt-36">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -top-40 -right-40 h-[400px] w-[400px] rounded-full bg-[#22D3EE]/10 blur-[128px]" />
          <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-[#8B5CF6]/10 blur-[128px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Services', href: '/services' },
              { label: service.title },
            ]}
          />

          <div className="mt-8 max-w-3xl">
            <h1 className="text-4xl font-extrabold tracking-tight text-[#F8FAFC] sm:text-5xl">
              {service.title}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-[#94A3B8]">
              {service.description}
            </p>
            <div className="mt-8 flex gap-4">
              <Button asChild size="lg">
                <Link href={service.ctaLink || '/contact'}>
                  {service.ctaText || 'Get a Free Consultation'} <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact?type=call">Schedule a Call</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {service.longDescription && (
        <section className="bg-[#0B1220] py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold text-[#F8FAFC] sm:text-3xl">Overview</h2>
              <p className="mt-4 text-[#94A3B8] leading-relaxed">{service.longDescription}</p>
            </div>
          </div>
        </section>
      )}

      {features.length > 0 && (
        <section className="bg-[#050816] py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold text-[#F8FAFC] sm:text-3xl">What We Offer</h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3 rounded-lg border border-[rgba(148,163,184,0.15)] bg-[#0B1220] p-4">
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#22D3EE]" />
                    <span className="text-sm text-[#F8FAFC]">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {benefits.length > 0 && (
        <section className="bg-[#0B1220] py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold text-[#F8FAFC] sm:text-3xl">Key Benefits</h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-start gap-3">
                    <Star className="mt-0.5 h-5 w-5 shrink-0 text-[#8B5CF6]" />
                    <span className="text-[#94A3B8]">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {processSteps.length > 0 && (
        <section className="bg-[#050816] py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold text-[#F8FAFC] sm:text-3xl">Our Process</h2>
              <div className="mt-8 space-y-6">
                {processSteps.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#22D3EE] to-[#8B5CF6] text-sm font-bold text-[#050816]">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#F8FAFC]">{step}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {relatedProducts.length > 0 && (
        <section className="bg-[#0B1220] py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[#F8FAFC] sm:text-3xl">Related Products</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#050816] p-6 transition-all duration-300 hover:border-[#22D3EE]/30"
                >
                  <h3 className="text-lg font-semibold text-[#F8FAFC] group-hover:text-[#22D3EE]">{product.title}</h3>
                  <p className="mt-2 text-sm text-[#94A3B8] line-clamp-2">{product.shortDescription || ''}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#22D3EE]">
                    View Details <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaSection />
    </>
  );
}
