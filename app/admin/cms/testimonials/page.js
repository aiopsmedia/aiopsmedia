import { requireAuth } from '@/lib/auth/session';
import { db } from '@/lib/db';
import TestimonialsManager from '@/components/admin/testimonials-manager';

export const metadata = {
  title: 'Testimonials - AIOpsMedia Admin',
};

export default async function TestimonialsPage() {
  await requireAuth();

  const testimonials = await db.testimonial.findMany({
    orderBy: { order: 'asc' },
  });

  return <TestimonialsManager initialTestimonials={testimonials} />;
}
