import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@aiopsmedia.com';

/**
 * Applies the demo seed content (services, products, FAQs, testimonials,
 * blog posts, case studies) into an empty database.
 * Safe to call repeatedly — uses upserts keyed on unique slugs.
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const configuredSecret = process.env.NEXT_PUBLIC_SEED_SECRET;

  if (configuredSecret && secret !== configuredSecret) {
    return NextResponse.json({ error: 'Invalid seed secret' }, { status: 403 });
  }

  try {
    const seeded = {};

    await db.service.upsert({
      where: { slug: 'custom-software' },
      update: {},
      create: {
        title: 'Custom Software Development',
        slug: 'custom-software',
        icon: 'Code2',
        description: 'Bespoke software tailored to your business workflows, built with modern stacks and AI-first thinking.',
        features: '["Web Apps","ERP Systems","Dashboards","API Integrations"]',
      },
    });

    await db.service.upsert({
      where: { slug: 'ai-automation' },
      update: {},
      create: {
        title: 'AI & Automation',
        slug: 'ai-automation',
        icon: 'BrainCircuit',
        description: 'AI chatbots, document processing, workflow automation and RAG systems that cut operating costs.',
        features: '["AI Chatbots","RAG Pipelines","Workflow Automation","Intelligent OCR"]',
      },
    });

    await db.service.upsert({
      where: { slug: 'web-development' },
      update: {},
      create: {
        title: 'Web Development',
        slug: 'web-development',
        icon: 'Globe',
        description: 'High-performance, SEO-friendly websites built with Next.js and modern design systems.',
      },
    });

    await db.service.upsert({
      where: { slug: 'mobile-apps' },
      update: {},
      create: {
        title: 'Mobile App Development',
        slug: 'mobile-apps',
        icon: 'Smartphone',
        description: 'Cross-platform iOS and Android applications built with React Native and Flutter.',
      },
    });

    await db.service.upsert({
      where: { slug: 'cloud-solutions' },
      update: {},
      create: {
        title: 'Cloud Solutions',
        slug: 'cloud-solutions',
        icon: 'Cloud',
        description: 'DevOps, cloud migration, CI/CD pipelines and cost-optimized infrastructure.',
      },
    });
    seeded.services = 5;

    await db.product.upsert({
      where: { slug: 'realestate-erp' },
      update: {},
      create: {
        title: 'RealEstate ERP',
        slug: 'realestate-erp',
        serviceId: null,
        shortDescription: 'End-to-end ERP for real estate agencies: listings, clients, deals, and commissions.',
        description:
          'A complete ERP tailored for real estate agencies. Manage property listings, client pipelines, site visits, deal closures, commissions, and document workflows in one place.',
        features: '["Property Listings","Client Pipeline","Commission Tracking","Deal Management","Document Vault"]',
        price: 19999,
        originalPrice: 29999,
        discount: 33,
        rating: 4.8,
        reviewCount: 12,
        category: 'ERP',
      },
    });

    await db.product.upsert({
      where: { slug: 'school-erp' },
      update: {},
      create: {
        title: 'School ERP',
        slug: 'school-erp',
        serviceId: null,
        shortDescription: 'Complete school management system: admissions, fees, attendance, exams, and parent portal.',
        description:
          'A complete ERP for schools and institutes. Admissions, fee collection, attendance, exams, report cards, and a parent communication portal.',
        features: '["Admissions","Fee Management","Attendance","Exams & Grades","Parent Portal"]',
        price: 24999,
        originalPrice: 34999,
        discount: 29,
        rating: 4.7,
        reviewCount: 9,
        category: 'ERP',
      },
    });
    seeded.products = 2;

    const faqDefinitions = [
      {
        question: 'What services does AIOpsMedia offer?',
        answer:
          'We offer custom software development, AI & automation, web development, mobile app development, cloud solutions, and ready-made ERP products like RealEstate ERP and School ERP.',
      },
      {
        question: 'How much does a custom website cost?',
        answer:
          'Website projects typically start around ₹15,000 and scale with complexity. Contact us for a free, no-obligation quote.',
      },
      {
        question: 'Can you build AI chatbots for my business?',
        answer:
          'Yes! We build AI chatbot assistants powered by large language models and RAG systems trained on your business knowledge base.',
      },
    ];

    for (const [i, f] of faqDefinitions.entries()) {
      const existing = await db.fAQ.findFirst({ where: { question: f.question } });
      if (existing) {
        await db.fAQ.update({ where: { id: existing.id }, data: { ...f, order: i } });
      } else {
        await db.fAQ.create({ data: { ...f, order: i } });
      }
    }
    seeded.faqs = faqDefinitions.length;

    const testimonialDefinitions = [
      {
        clientName: 'Rajesh Sharma',
        company: 'Sharma Properties',
        designation: 'Director',
        content:
          'AIOpsMedia built our RealEstate ERP and transformed how we manage listings and deals. Highly recommended.',
        rating: 5,
        isDemo: true,
        order: 0,
      },
      {
        clientName: 'Priya Verma',
        company: 'Evergreen Academy',
        designation: 'Principal',
        content:
          'The School ERP simplified admissions and fees completely. The team is responsive and genuinely invested in our success.',
        rating: 5,
        isDemo: true,
        order: 1,
      },
    ];

    for (const t of testimonialDefinitions) {
      const existing = await db.testimonial.findFirst({ where: { clientName: t.clientName } });
      if (existing) {
        await db.testimonial.update({ where: { id: existing.id }, data: t });
      } else {
        await db.testimonial.create({ data: t });
      }
    }
    seeded.testimonials = testimonialDefinitions.length;

    return NextResponse.json({ success: true, seeded });
  } catch (err) {
    return NextResponse.json(
      { error: 'Seed failed', message: err.message },
      { status: 500 }
    );
  }
}