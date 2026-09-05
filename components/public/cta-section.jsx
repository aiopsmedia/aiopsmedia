import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-[#050816] py-20 sm:py-28" aria-labelledby="cta-heading">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-r from-[#22D3EE]/5 via-transparent to-[#8B5CF6]/5" />
        <div className="absolute -top-20 left-1/2 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-[#22D3EE]/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2
          id="cta-heading"
          className="text-3xl font-bold text-[#F8FAFC] sm:text-4xl lg:text-5xl"
        >
          Ready to{' '}
          <span className="bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] bg-clip-text text-transparent">
            Transform
          </span>{' '}
          Your Business?
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-[#94A3B8]">
          Let&apos;s discuss how AIOpsMedia can help you automate, scale, and grow.
          Schedule a free consultation with our team today.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/contact">
              Start a Project
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/contact?type=call">
              <Phone className="h-4 w-4" />
              Schedule a Call
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export { CtaSection };
