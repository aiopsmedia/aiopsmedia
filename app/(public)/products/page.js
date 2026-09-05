import Link from 'next/link';
import { Star, ExternalLink } from 'lucide-react';
import { db } from '@/lib/db';
import { formatCurrency } from '@/lib/utils';
import { generateMetadata as baseGenerateMetadata } from '@/lib/seo';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const metadata = baseGenerateMetadata({
  title: 'ERP Products',
  description:
    'Explore AIOpsMedia ERP products — RealEstate ERP, School ERP, and industry-specific solutions for streamlined business management.',
  url: '/products',
});

async function getProducts() {
  try {
    return await db.product.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        title: true,
        slug: true,
        shortDescription: true,
        price: true,
        originalPrice: true,
        discount: true,
        rating: true,
        reviewCount: true,
        image: true,
        features: true,
        category: true,
      },
    });
  } catch {
    return [];
  }
}

const fallbackProducts = [
  {
    id: 'realestate-erp',
    title: 'RealEstate ERP',
    slug: 'realestate-erp',
    shortDescription: 'Complete ERP solution for real estate businesses — property management, lead tracking, billing, and client portal.',
    price: 9999,
    originalPrice: 49999,
    discount: 80,
    rating: 4.8,
    reviewCount: 24,
    image: null,
    features: '["Property Management","Lead Tracking","Billing & Invoicing","Client Portal"]',
    category: 'Real Estate',
  },
  {
    id: 'school-erp',
    title: 'School ERP',
    slug: 'school-erp',
    shortDescription: 'All-in-one school management system — admissions, attendance, fees, exams, timetable, and parent communication.',
    price: 7999,
    originalPrice: 39999,
    discount: 80,
    rating: 4.7,
    reviewCount: 18,
    image: null,
    features: '["Student Management","Fee Collection","Exam & Results","Parent Portal"]',
    category: 'Education',
  },
];

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
              ? 'h-3.5 w-3.5 fill-amber-400 text-amber-400'
              : hasHalf && i === full
                ? 'h-3.5 w-3.5 fill-amber-400/50 text-amber-400'
                : 'h-3.5 w-3.5 text-[#94A3B8]/30'
          }
        />
      ))}
    </div>
  );
}

export default async function ProductsPage() {
  const dbProducts = await getProducts();
  const products = dbProducts.length > 0 ? dbProducts : fallbackProducts;

  return (
    <section className="bg-[#050816] pt-28 pb-20 sm:pt-36 sm:pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Products' },
            ]}
          />
        </div>

        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-[#F8FAFC] sm:text-5xl">
            ERP{' '}
            <span className="bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] bg-clip-text text-transparent">
              Products
            </span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-[#94A3B8]">
            Ready-to-deploy enterprise resource planning solutions tailored for specific industries.
            Built with modern tech, designed for real-world workflows.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {products.map((product) => {
            const price = product.price ? Number(product.price) : null;
            const originalPrice = product.originalPrice ? Number(product.originalPrice) : null;
            const rating = product.rating ? Number(product.rating) : 4.5;
            const features = product.features ? JSON.parse(product.features) : [];
            const discount = product.discount || (originalPrice && price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0);

            return (
              <div
                key={product.id}
                className="group relative overflow-hidden rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#0B1220] transition-all duration-300 hover:border-[#22D3EE]/30 hover:shadow-lg hover:shadow-[#22D3EE]/5"
              >
                <div className="relative h-52 bg-gradient-to-br from-[#22D3EE]/10 to-[#8B5CF6]/10">
                  {product.image ? (
                    <img src={product.image} alt={product.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="text-5xl font-bold text-[#22D3EE]/20">{product.title.charAt(0)}</span>
                    </div>
                  )}
                  {discount > 0 && (
                    <Badge className="absolute top-4 right-4" variant="success">
                      {discount}% OFF
                    </Badge>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Badge className="mb-2" variant="outline">{product.category || 'ERP'}</Badge>
                      <h2 className="text-xl font-bold text-[#F8FAFC]">{product.title}</h2>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <StarRating rating={rating} />
                      <span className="text-xs text-[#94A3B8]">({product.reviewCount || 0})</span>
                    </div>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-[#94A3B8]">{product.shortDescription}</p>

                  {features.length > 0 && (
                    <ul className="mt-4 grid grid-cols-2 gap-1.5">
                      {features.map((f) => (
                        <li key={f} className="flex items-center gap-1.5 text-xs text-[#94A3B8]">
                          <span className="h-1 w-1 shrink-0 rounded-full bg-[#22D3EE]" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-5 flex items-baseline gap-3">
                    {price !== null && (
                      <span className="text-2xl font-bold text-[#22D3EE]">{formatCurrency(price)}</span>
                    )}
                    {originalPrice !== null && (
                      <span className="text-sm text-[#94A3B8] line-through">{formatCurrency(originalPrice)}</span>
                    )}
                  </div>

                  <div className="mt-5 flex gap-3">
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <Link href={`/products/${product.slug}`}>
                        <ExternalLink className="h-3.5 w-3.5" /> View Details
                      </Link>
                    </Button>
                    <Button asChild size="sm" className="flex-1">
                      <Link href={`/contact?product=${product.slug}`}>Request Demo</Link>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
