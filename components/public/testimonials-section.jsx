'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

const defaultTestimonials = [
  {
    id: 1,
    quote:
      'AIOpsMedia transformed our operations with their AI-driven automation. We saw a 40% reduction in manual tasks within the first quarter.',
    name: 'Rahul Sharma',
    company: 'TechVista Solutions',
    role: 'CTO',
    rating: 5,
  },
  {
    id: 2,
    quote:
      'Their custom ERP solution streamlined our entire school administration. From admissions to parent communication — everything is seamless now.',
    name: 'Priya Patel',
    company: 'Sunrise International School',
    role: 'Director',
    rating: 5,
  },
  {
    id: 3,
    quote:
      'Professional team with deep technical expertise. They delivered our mobile app on time and within budget. Highly recommended!',
    name: 'Amit Kumar',
    company: 'GreenLeaf Properties',
    role: 'Founder',
    rating: 5,
  },
  {
    id: 4,
    quote:
      'Working with AIOpsMedia was a game-changer. Their AI solutions helped us predict customer behavior and increase conversions by 35%.',
    name: 'Neha Gupta',
    company: 'ShopSmart Retail',
    role: 'Marketing Head',
    rating: 5,
  },
];

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={cn('h-4 w-4', i < rating ? 'fill-amber-400 text-amber-400' : 'text-[#94A3B8]/30')}
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialsSection({ testimonials }) {
  const items = testimonials && testimonials.length > 0 ? testimonials : defaultTestimonials;
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % items.length);
  }, [items.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + items.length) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [paused, next]);

  return (
    <section
      className="bg-[#050816] py-20 sm:py-28"
      aria-labelledby="testimonials-heading"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="testimonials-heading" className="text-3xl font-bold text-[#F8FAFC] sm:text-4xl">
            What Our{' '}
            <span className="bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] bg-clip-text text-transparent">Clients Say</span>
          </h2>
          <p className="mt-4 text-[#94A3B8]">
            Real feedback from businesses that have transformed with our solutions.
          </p>
        </div>

        <div className="relative mt-14 mx-auto max-w-3xl">
          <div className="relative rounded-2xl border border-[rgba(148,163,184,0.15)] bg-[#0B1220] p-8 sm:p-10">
            <Quote className="absolute top-6 right-8 h-10 w-10 text-[#22D3EE]/10" aria-hidden="true" />

            <div aria-live="polite" aria-atomic="true">
              <StarRating rating={items[current].rating || 5} />

              <blockquote className="mt-5 text-lg leading-relaxed text-[#F8FAFC] sm:text-xl">
                &ldquo;{items[current].quote}&rdquo;
              </blockquote>

              <div className="mt-6 flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#22D3EE] to-[#8B5CF6] text-sm font-bold text-[#050816]">
                  {items[current].name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#F8FAFC]">{items[current].name}</p>
                  <p className="text-xs text-[#94A3B8]">
                    {items[current].role}, {items[current].company}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              onClick={prev}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(148,163,184,0.15)] text-[#94A3B8] transition-colors hover:border-[#22D3EE]/30 hover:text-[#22D3EE]"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex gap-2" role="tablist" aria-label="Testimonial navigation">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={cn(
                    'h-2 rounded-full transition-all duration-300',
                    i === current ? 'w-6 bg-[#22D3EE]' : 'w-2 bg-[rgba(148,163,184,0.3)] hover:bg-[rgba(148,163,184,0.5)]'
                  )}
                  role="tab"
                  aria-selected={i === current}
                  aria-label={`Testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(148,163,184,0.15)] text-[#94A3B8] transition-colors hover:border-[#22D3EE]/30 hover:text-[#22D3EE]"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export { TestimonialsSection };
