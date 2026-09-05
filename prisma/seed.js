/**
 * AIOpsMedia Database Seed Script
 *
 * Creates the initial admin user, roles, and demo content.
 *
 * Usage:
 *   npx prisma db seed
 *
 * The admin user is created from ADMIN_EMAIL / ADMIN_PASSWORD env variables
 * (never commit real credentials). If not set, a local-only dev admin is
 * created that MUST be changed in production.
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting AIOpsMedia database seed...\n");

  // ---- Admin user ----
  const adminEmail = process.env.ADMIN_EMAIL || "admin@aiopsmedia.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@12345";

  if (!process.env.ADMIN_PASSWORD) {
    console.log(
      "⚠️  ADMIN_PASSWORD not set — using default dev password. " +
        "Set ADMIN_PASSWORD env var in production and change after login."
    );
  }

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  let userId;
  if (existingAdmin) {
    console.log(`✓ Admin user exists: ${adminEmail}`);
    userId = existingAdmin.id;
  } else {
    const hashed = await bcrypt.hash(adminPassword, 12);
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        name: "AIOpsMedia Admin",
        password: hashed,
        role: "SUPER_ADMIN",
        isActive: true,
      },
    });
    userId = admin.id;
    console.log(`✓ Created admin user: ${adminEmail} (role: SUPER_ADMIN)`);
  }

  // ---- Sample Services ----
  const services = [
    {
      title: "CRM Solutions",
      slug: "crm-solutions",
      icon: "Users",
      description:
        "Custom CRM systems designed around your sales process to track leads, manage customers, and close deals faster.",
      longDescription:
        "We build tailor-made CRM platforms that unify your leads, customers, sales pipeline, and support into a single system. Automate follow-ups, track every interaction, and give your team a clear view of what to do next.",
      features: JSON.stringify([
        "Lead & contact management",
        "Sales pipeline & deal tracking",
        "Automated follow-up reminders",
        "Custom fields & workflows",
        "Reporting & analytics dashboard",
      ]),
      ctaText: "Get a Free Consultation",
      order: 1,
    },
    {
      title: "ERP Systems",
      slug: "erp-systems",
      icon: "Boxes",
      description:
        "Industry-specific ERP solutions that connect your operations, finance, inventory, and reporting into one system.",
      longDescription:
        "From real estate to education, our ERP systems digitize and automate your core business operations — invoicing, inventory, admissions, fees, HR, and analytics — so you can run your business with total clarity.",
      features: JSON.stringify([
        "Finance & invoicing automation",
        "Inventory & asset tracking",
        "HR & payroll modules",
        "Role-based access control",
        "Real-time business reports",
      ]),
      ctaText: "Get a Free Consultation",
      order: 2,
    },
    {
      title: "Website Development",
      slug: "website-development",
      icon: "Globe",
      description:
        "Fast, secure, and SEO-ready websites built to convert visitors into customers.",
      longDescription:
        "We build premium, conversion-focused websites using modern technology. Fully responsive, blazing fast, and optimized for search engines so your business gets found and trusted online.",
      features: JSON.stringify([
        "Responsive & mobile-first design",
        "SEO-optimized structure",
        "CMS to manage your own content",
        "Performance & Core Web Vitals",
        "Analytics & lead capture",
      ]),
      ctaText: "Start a Project",
      order: 3,
    },
    {
      title: "Social Media Management",
      slug: "social-media-management",
      icon: "Share2",
      description:
        "Consistent, on-brand social content and management so you build an audience that converts.",
      longDescription:
        "We plan, create, and manage your social media presence with a content strategy designed for reach, engagement, and lead generation — on LinkedIn, Instagram, and Facebook.",
      features: JSON.stringify([
        "Content calendar & strategy",
        "Design & copywriting",
        "Scheduling & publishing",
        "Community engagement",
        "Performance reporting",
      ]),
      ctaText: "Get Started",
      order: 4,
    },
    {
      title: "Meta Ads Setup",
      slug: "meta-ads-setup",
      icon: "Target",
      description:
        "High-performing Meta ad campaigns set up to reach your ideal customers at a cost you control.",
      longDescription:
        "We set up and manage Meta (Facebook & Instagram) advertising campaigns — from pixel setup and audience targeting to creative and budget optimization — focused on measurable results.",
      features: JSON.stringify([
        "Pixel & conversion tracking setup",
        "Audience research & targeting",
        "Ad creative & copy",
        "Budget & bid optimization",
        "Monthly performance reports",
      ]),
      ctaText: "Get Started",
      order: 5,
    },
    {
      title: "AI Agents",
      slug: "ai-agents",
      icon: "Bot",
      description:
        "Custom AI agents that handle customer queries, support, and repetitive tasks 24/7.",
      longDescription:
        "We build AI agents trained on your business data that answer customer questions, qualify leads, and automate support around the clock — freeing your team for high-value work.",
      features: JSON.stringify([
        "Trained on your business knowledge",
        "24/7 customer support automation",
        "Lead qualification & routing",
        "Human handoff when needed",
        "Integrates with your existing tools",
      ]),
      ctaText: "Get a Free Consultation",
      order: 6,
    },
    {
      title: "AI Automation",
      slug: "ai-automation",
      icon: "Zap",
      description:
        "Automate repetitive workflows with AI so your team focuses on what matters.",
      longDescription:
        "We map your manual processes and build AI-powered automations that route leads, update records, send follow-ups, generate reports, and more — reducing errors and saving hours every day.",
      features: JSON.stringify([
        "Workflow mapping & strategy",
        "Lead routing & follow-up automation",
        "Document & report generation",
        "Third-party integrations",
        "Ongoing monitoring & support",
      ]),
      ctaText: "Get Started",
      order: 7,
    },
    {
      title: "Custom Software Development",
      slug: "custom-software-development",
      icon: "Code2",
      description:
        "Bespoke software built around your exact business requirements and workflows.",
      longDescription:
        "When off-the-shelf software doesn't fit, we design and build custom applications — portals, internal tools, and platforms — engineered to scale securely with your business.",
      features: JSON.stringify([
        "Requirements & architecture",
        "Custom web applications",
        "Client & employee portals",
        "API & integration development",
        "Secure, scalable engineering",
      ]),
      ctaText: "Start a Project",
      order: 8,
    },
    {
      title: "Business Automation",
      slug: "business-automation",
      icon: "Workflow",
      description:
        "End-to-end automation of your business processes from lead to invoice and beyond.",
      longDescription:
        "We connect your sales, delivery, and finance processes into automated workflows — lead captured, followed up, quoted, delivered, invoiced, and paid with minimal manual effort.",
      features: JSON.stringify([
        "Lead-to-invoice automation",
        "Process & workflow design",
        "System integrations",
        "Dashboard & analytics",
        "Scaling support & training",
      ]),
      ctaText: "Get Started",
      order: 9,
    },
  ];

  for (const s of services) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: s,
      create: s,
    });
  }
  console.log(`✓ Seeded ${services.length} services`);

  // ---- Products ----
  const products = [
    {
      title: "RealEstate ERP",
      slug: "realestate-erp",
      shortDescription:
        "Complete ERP for real estate and property businesses — projects, inventory, sales, and finance in one system.",
      description:
        "RealEstate ERP helps property developers and brokers manage projects, units, leads, buyers, payments, and documents from a single dashboard. Track bookings, payment schedules, and inventory with full financial control.",
      price: 9999,
      originalPrice: 49999,
      discount: 80,
      rating: 4.9,
      reviewCount: 30,
      category: "ERP",
      features: JSON.stringify([
        "Project & unit management",
        "Lead & buyer tracking",
        "Booking & payment schedules",
        "Inventory & availability",
        "Financial reports & GST invoicing",
        "Customer & agent portals",
      ]),
      isFeatured: true,
      order: 1,
    },
    {
      title: "School ERP",
      slug: "school-erp",
      shortDescription:
        "All-in-one school management software — admissions, fees, attendance, and communication.",
      description:
        "School ERP digitizes admissions, fee collection, attendance, timetables, exams, and parent communication. Give your staff, teachers, students, and parents the right access with a secure, role-based system.",
      price: 7999,
      originalPrice: 39999,
      discount: 80,
      rating: 4.8,
      reviewCount: 25,
      category: "ERP",
      features: JSON.stringify([
        "Admissions & student records",
        "Fee management & receipts",
        "Attendance & timetables",
        "Exam & report cards",
        "Parent & teacher portals",
        "Notifications & communication",
      ]),
      isFeatured: true,
      order: 2,
    },
  ];

  for (const p of products) {
    const existing = await prisma.product.findUnique({ where: { slug: p.slug } });
    if (existing) {
      await prisma.product.update({ where: { slug: p.slug }, data: p });
    } else {
      await prisma.product.create({ data: p });
    }
  }
  console.log(`✓ Seeded ${products.length} products`);

  // ---- Sample FAQs (not demo — generic business info) ----
  const faqs = [
    {
      question: "How quickly can you start my project?",
      answer:
        "After a free consultation to understand your requirements, most projects begin within 1 week. We share a clear timeline and milestones upfront.",
      isActive: true,
      order: 1,
    },
    {
      question: "Do you provide support after the project is delivered?",
      answer:
        "Yes. Every project includes post-launch support, and we offer ongoing maintenance and automation plans to keep your systems running smoothly.",
      isActive: true,
      order: 2,
    },
    {
      question: "Can you automate our existing manual processes?",
      answer:
        "Absolutely. We analyze your current workflows and build AI-powered automations that save your team hours every day — from lead follow-up to invoicing.",
      isActive: true,
      order: 3,
    },
    {
      question: "What does a typical project cost?",
      answer:
        "Costs depend on scope. We provide transparent, fixed quotes after understanding your requirements — no hidden charges. You'll always know the price before we begin.",
      isActive: true,
      order: 4,
    },
    {
      question: "Which industries do you serve?",
      answer:
        "We serve real estate, education, healthcare, retail, services, and more. Our systems are customized to each industry's specific workflows.",
      isActive: true,
      order: 5,
    },
  ];

  for (const f of faqs) {
    const existing = await prisma.fAQ.findFirst({
      where: { question: f.question },
    });
    if (existing) {
      await prisma.fAQ.update({ where: { id: existing.id }, data: f });
    } else {
      await prisma.fAQ.create({ data: f });
    }
  }
  console.log(`✓ Seeded ${faqs.length} FAQs`);

  // ---- Site Settings (defaults) ----
  const settings = [
    { key: "company_name", value: "AIOpsMedia", group: "global", type: "text" },
    { key: "company_tagline", value: "Democratizing AI for Every Business", group: "global", type: "text" },
    { key: "company_email", value: "info@aiopsmedia.com", group: "global", type: "text" },
    { key: "company_phone", value: "+91 6203818011", group: "global", type: "text" },
    { key: "company_address", value: "Kishanganj, Bihar, India", group: "global", type: "text" },
    { key: "company_hours", value: "Monday – Saturday, 9:00 AM – 7:00 PM", group: "global", type: "text" },
    { key: "whatsapp_number", value: "916203818011", group: "global", type: "text" },
    { key: "hero_heading", value: "Build Smarter. Automate Faster. Grow with AI.", group: "homepage", type: "text" },
    { key: "hero_subheading", value: "AIOpsMedia helps businesses build intelligent software, automate operations, manage customers and accelerate digital growth.", group: "homepage", type: "text" },
    { key: "hero_cta_primary", value: "Start a Project", group: "homepage", type: "text" },
    { key: "hero_cta_secondary", value: "Explore Services", group: "homepage", type: "text" },
    { key: "seo_title", value: "AIOpsMedia — AI Automation, CRM & ERP Development", group: "seo", type: "text" },
    { key: "seo_description", value: "AIOpsMedia helps businesses build intelligent software, automate operations, manage customers and accelerate digital growth. CRM, ERP, AI Agents & automation.", group: "seo", type: "text" },
    { key: "invoice_prefix", value: "INV", group: "documents", type: "text" },
    { key: "quotation_prefix", value: "QTN", group: "documents", type: "text" },
    { key: "tax_rate", value: "18", group: "finance", type: "text" },
  ];

  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: s,
      create: s,
    });
  }
  console.log(`✓ Seeded ${settings.length} site settings`);

  // ---- Blog categories ----
  const categories = [
    { name: "AI Automation", slug: "ai-automation", description: "Articles about AI agents and business automation." },
    { name: "CRM", slug: "crm", description: "Customer relationship management insights." },
    { name: "ERP", slug: "erp", description: "Enterprise resource planning guidance." },
    { name: "Web Development", slug: "web-development", description: "Website development best practices." },
    { name: "Digital Marketing", slug: "digital-marketing", description: "Marketing, SEO and lead generation." },
    { name: "Business Growth", slug: "business-growth", description: "Strategy, sales and operations." },
  ];

  for (const c of categories) {
    await prisma.blogCategory.upsert({
      where: { slug: c.slug },
      update: c,
      create: c,
    });
  }
  console.log(`✓ Seeded ${categories.length} blog categories`);

  // ---- Navigation ----
  const navLinks = [
    { location: "header", label: "Home", url: "/", order: 1 },
    { location: "header", label: "Services", url: "/services", order: 2 },
    { location: "header", label: "Products", url: "/products", order: 3 },
    { location: "header", label: "About", url: "/about", order: 4 },
    { location: "header", label: "Blog", url: "/blog", order: 5 },
    { location: "header", label: "Contact", url: "/contact", order: 6 },
  ];

  for (const n of navLinks) {
    const existing = await prisma.navigation.findFirst({
      where: { location: n.location, label: n.label },
    });
    if (existing) {
      await prisma.navigation.update({ where: { id: existing.id }, data: n });
    } else {
      await prisma.navigation.create({ data: n });
    }
  }
  console.log(`✓ Seeded ${navLinks.length} navigation links`);

  console.log("\n✅ Seed complete!");
  console.log(`\nAdmin login: ${adminEmail}`);
  console.log("⚠️  Change the password immediately after first login.");
}

main()
  .catch((e) => {
    console.error("\n❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
