import Link from 'next/link';
import { Star, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const defaultProducts = [
  {
    id: 'realestate-erp',
    name: 'RealEstate ERP',
    description:
      'Complete ERP solution for real estate businesses — property management, lead tracking, billing, and client portal in one platform.',
    price: 9999,
    originalPrice: 49999,
    discount: 80,
    rating: 4.8,
    reviews: 24,
    image: null,
    href: '/products/realestate-erp',
    demoHref: '/contact?product=realestate-erp',
    features: ['Property Management', 'Lead Tracking', 'Billing & Invoicing', 'Client Portal'],
  },
  {
    id: 'school-erp',
    name: 'School ERP',
    description:
      'All-in-one school management system — admissions, attendance, fees, exams, timetable, and parent communication.',
    price: 7999,
    originalPrice: 39999,
    discount: 80,
    rating: 4.7,
    reviews: 18,
    image: null,
    href: '/products/school-erp',
    demoHref: '/contact?product=school-erp',
    features: ['Student Management', 'Fee Collection', 'Exam & Results', 'Parent Portal'],
  },
];

function formatPrice(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function StarRating({ rating }) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.3;
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            'h-3.5 w-3.5',
            i < full ? 'fill-amber-400 text-amber-400' : hasHalf && i === full ? 'fill-amber-400/50 text-amber-400' : 'text-[#94A3B8]/30'
          )}
        />
      ))}
    </div>
  );
}

function ProductsSection({ products }) {
  const items = products && products.length > 0 ? products : defaultProducts;

  return (
    <section className="bg-[#0B1220] py-20 sm:py-28" id="products" aria-labelledby="products-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="products-heading" className="text-3xl font-bold text-[#F8FAFC] sm:text-4xl">
            ERP{' '}
            <span className="bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] bg-clip-text text-transparent">Products</span>
          </h2>
          <p className="mt-4 text-[#94A3B8]">
            Ready-to-deploy enterprise resource planning solutions tailored for specific industries.
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {items.map((product) => (
            <div
              key={product.id || product.name}
              className="group relative overflow-hidden rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#050816] transition-all duration-300 hover:border-[#22D3EE]/30 hover:shadow-lg hover:shadow-[#22D3EE]/5"
            >
              <div className="relative h-48 bg-gradient-to-br from-[#22D3EE]/10 to-[#8B5CF6]/10">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span className="text-4xl font-bold text-[#22D3EE]/20">{product.name.charAt(0)}</span>
                  </div>
                )}
                <Badge className="absolute top-4 right-4" variant="success">
                  {product.discount || Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </Badge>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl font-bold text-[#F8FAFC]">{product.name}</h3>
                  <div className="flex items-center gap-1.5">
                    <StarRating rating={product.rating || 4.5} />
                    <span className="text-xs text-[#94A3B8]">({product.reviews || 0})</span>
                  </div>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-[#94A3B8]">{product.description}</p>

                {product.features && (
                  <ul className="mt-4 grid grid-cols-2 gap-1.5">
                    {product.features.map((f) => (
                      <li key={f} className="flex items-center gap-1.5 text-xs text-[#94A3B8]">
                        <span className="h-1 w-1 shrink-0 rounded-full bg-[#22D3EE]" />
                        {f}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-5 flex items-baseline gap-3">
                  <span className="text-2xl font-bold text-[#22D3EE]">{formatPrice(product.price)}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-[#94A3B8] line-through">{formatPrice(product.originalPrice)}</span>
                  )}
                </div>

                <div className="mt-5 flex gap-3">
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link href={product.href || '#'}>
                      <ExternalLink className="h-3.5 w-3.5" /> View Details
                    </Link>
                  </Button>
                  <Button asChild size="sm" className="flex-1">
                    <Link href={product.demoHref || '/contact'}>Request Demo</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export { ProductsSection };
