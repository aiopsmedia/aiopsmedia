import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Star, CheckCircle, ArrowRight, MessageSquare } from 'lucide-react';
import { db } from '@/lib/db';
import { formatCurrency } from '@/lib/utils';
import { generateMetadata as baseGenerateMetadata, generateProductSchema } from '@/lib/seo';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const fallbackProducts = {
  'realestate-erp': {
    title: 'RealEstate ERP',
    slug: 'realestate-erp',
    shortDescription: 'Complete ERP solution for real estate businesses.',
    description: 'Our RealEstate ERP is a comprehensive platform designed specifically for property developers, brokers, and real estate agencies. It handles everything from lead management and property listings to billing and client communication in one unified system.',
    price: 9999,
    originalPrice: 49999,
    discount: 80,
    rating: 4.8,
    reviewCount: 24,
    image: null,
    images: '[]',
    features: '["Property Management & Listings","Lead Tracking & Scoring","Automated Billing & Invoicing","Client Portal & Communication","Document Management","Analytics Dashboard","WhatsApp Integration","Mobile App Access"]',
    specifications: '{"Platform":"Cloud-based (SaaS)","Users":"Unlimited","Storage":"10 GB included","Support":"Email & WhatsApp","Updates":"Free for 1 year","Deployment":"Instant (same day)"}',
    category: 'Real Estate',
    seoTitle: 'RealEstate ERP — Property Management Software',
    seoDescription: 'Complete ERP for real estate businesses. Manage properties, leads, billing, and clients in one platform.',
    faqs: [
      { id: 'f1', question: 'Is there a free trial?', answer: 'Yes, we offer a 14-day free trial with full access to all features. No credit card required.', order: 0 },
      { id: 'f2', question: 'Can I import my existing data?', answer: 'Absolutely. We provide free data migration from spreadsheets, other software, or any standard format.', order: 1 },
      { id: 'f3', question: 'Do you offer training?', answer: 'Yes, we provide onboarding training via video calls, documentation, and ongoing support.', order: 2 },
    ],
  },
  'school-erp': {
    title: 'School ERP',
    slug: 'school-erp',
    shortDescription: 'All-in-one school management system.',
    description: 'Our School ERP simplifies school administration by digitizing attendance, fee collection, exam management, timetable scheduling, and parent-teacher communication. Built for schools of all sizes.',
    price: 7999,
    originalPrice: 39999,
    discount: 80,
    rating: 4.7,
    reviewCount: 18,
    image: null,
    images: '[]',
    features: '["Student Admission & Management","Attendance Tracking","Fee Collection & Receipts","Exam & Results Management","Timetable Scheduling","Parent Portal & SMS/WhatsApp","Library Management","Transport Management"]',
    specifications: '{"Platform":"Cloud-based (SaaS)","Students":"Up to 500 (expandable)","Staff Users":"Unlimited","Support":"Email & Phone","Updates":"Free for 1 year","Deployment":"Instant (same day)"}',
    category: 'Education',
    seoTitle: 'School ERP — School Management Software',
    seoDescription: 'All-in-one school management system. Attendance, fees, exams, timetable, and parent communication.',
    faqs: [
      { id: 'f1', question: 'Can parents access the system?', answer: 'Yes, parents get a dedicated portal for attendance, fee payments, results, and teacher communication.', order: 0 },
      { id: 'f2', question: 'Is the system mobile-friendly?', answer: 'Yes, the entire system is responsive and works on phones, tablets, and desktops.', order: 1 },
    ],
  },
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug) || fallbackProducts[slug];
  if (!product) return baseGenerateMetadata({ title: 'Product Not Found', url: `/products/${slug}` });

  return baseGenerateMetadata({
    title: product.seoTitle || product.title,
    description: product.seoDescription || product.shortDescription,
    url: `/products/${slug}`,
    type: 'website',
  });
}

async function getProduct(slug) {
  try {
    return await db.product.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        slug: true,
        shortDescription: true,
        description: true,
        price: true,
        originalPrice: true,
        discount: true,
        rating: true,
        reviewCount: true,
        image: true,
        images: true,
        screenshots: true,
        features: true,
        specifications: true,
        category: true,
        ctaText: true,
        ctaLink: true,
        seoTitle: true,
        seoDescription: true,
        service: { select: { title: true, slug: true } },
        faqs: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
          select: { id: true, question: true, answer: true },
        },
      },
    });
  } catch {
    return null;
  }
}

function StarRating({ rating }) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.3;
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={
            i < full
              ? 'h-4 w-4 fill-amber-400 text-amber-400'
              : hasHalf && i === full
                ? 'h-4 w-4 fill-amber-400/50 text-amber-400'
                : 'h-4 w-4 text-[#94A3B8]/30'
          }
        />
      ))}
    </div>
  );
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const product = (await getProduct(slug)) || fallbackProducts[slug];

  if (!product) notFound();

  const price = product.price ? Number(product.price) : null;
  const originalPrice = product.originalPrice ? Number(product.originalPrice) : null;
  const rating = product.rating ? Number(product.rating) : 4.5;
  const features = product.features ? JSON.parse(product.features) : [];
  const specifications = product.specifications ? JSON.parse(product.specifications) : {};
  const images = product.images ? JSON.parse(product.images) : [];
  const faqs = product.faqs || [];
  const discount = product.discount || (originalPrice && price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0);

  const schema = generateProductSchema({
    ...product,
    rating: rating,
    reviewCount: product.reviewCount || 0,
  });

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}

      <section className="bg-[#050816] pt-28 pb-16 sm:pt-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Products', href: '/products' },
              { label: product.title },
            ]}
          />

          <div className="mt-8 grid gap-10 lg:grid-cols-2">
            <div className="relative overflow-hidden rounded-2xl border border-[rgba(148,163,184,0.15)] bg-[#0B1220]">
              {product.image ? (
                <img src={product.image} alt={product.title} className="h-full w-full object-cover" />
              ) : images.length > 0 ? (
                <img src={images[0]} alt={product.title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-80 items-center justify-center bg-gradient-to-br from-[#22D3EE]/10 to-[#8B5CF6]/10">
                  <span className="text-7xl font-bold text-[#22D3EE]/20">{product.title.charAt(0)}</span>
                </div>
              )}
              {discount > 0 && (
                <Badge className="absolute top-4 right-4" variant="success">{discount}% OFF</Badge>
              )}
            </div>

            <div>
              {product.category && (
                <Badge className="mb-3" variant="outline">{product.category}</Badge>
              )}
              <h1 className="text-3xl font-extrabold text-[#F8FAFC] sm:text-4xl">{product.title}</h1>

              <div className="mt-3 flex items-center gap-3">
                <StarRating rating={rating} />
                <span className="text-sm text-[#94A3B8]">{rating.toFixed(1)} ({product.reviewCount || 0} reviews)</span>
              </div>

              <p className="mt-4 text-[#94A3B8] leading-relaxed">{product.shortDescription || product.description || ''}</p>

              <div className="mt-6 flex items-baseline gap-4">
                {price !== null && (
                  <span className="text-3xl font-bold text-[#22D3EE]">{formatCurrency(price)}</span>
                )}
                {originalPrice !== null && (
                  <>
                    <span className="text-lg text-[#94A3B8] line-through">{formatCurrency(originalPrice)}</span>
                    <Badge variant="success">Save {formatCurrency(originalPrice - price)}</Badge>
                  </>
                )}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="flex-1">
                  <Link href={product.ctaLink || `/contact?product=${product.slug}`}>
                    {product.ctaText || 'Request Demo'} <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="flex-1">
                  <Link href="/contact?type=call">
                    <MessageSquare className="h-4 w-4" /> Talk to Sales
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {product.description && (
        <section className="bg-[#0B1220] py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold text-[#F8FAFC]">About This Product</h2>
              <p className="mt-4 text-[#94A3B8] leading-relaxed">{product.description}</p>
            </div>
          </div>
        </section>
      )}

      {features.length > 0 && (
        <section className="bg-[#050816] py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold text-[#F8FAFC]">Features</h2>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {features.map((f) => (
                  <div key={f} className="flex items-center gap-3 rounded-lg border border-[rgba(148,163,184,0.15)] bg-[#0B1220] p-4">
                    <CheckCircle className="h-5 w-5 shrink-0 text-[#22D3EE]" />
                    <span className="text-sm text-[#F8FAFC]">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {Object.keys(specifications).length > 0 && (
        <section className="bg-[#0B1220] py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold text-[#F8FAFC]">Specifications</h2>
              <div className="mt-6 overflow-hidden rounded-xl border border-[rgba(148,163,184,0.15)]">
                {Object.entries(specifications).map(([key, value], i) => (
                  <div
                    key={key}
                    className={`flex justify-between px-5 py-3 text-sm ${i % 2 === 0 ? 'bg-[#050816]' : 'bg-[#0B1220]'}`}
                  >
                    <span className="font-medium text-[#F8FAFC]">{key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}</span>
                    <span className="text-[#94A3B8]">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {faqs.length > 0 && (
        <section className="bg-[#050816] py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[#F8FAFC]">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="mt-6">
              {faqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}

      <section className="bg-[#0B1220] py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[#F8FAFC] sm:text-3xl">
            Interested in {product.title}?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[#94A3B8]">
            Get in touch with our team for a personalized demo, pricing details, or to discuss your specific requirements.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href={`/contact?product=${product.slug}`}>
                {product.ctaText || 'Request a Demo'} <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact?type=call">Schedule a Call</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
