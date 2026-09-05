import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-[#050816] px-4">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 h-[300px] w-[300px] rounded-full bg-[#22D3EE]/10 blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 h-[300px] w-[300px] rounded-full bg-[#8B5CF6]/10 blur-[128px]" />
      </div>

      <div className="relative text-center">
        <div className="mb-6 text-[120px] font-extrabold leading-none tracking-tight sm:text-[160px]">
          <span className="bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] bg-clip-text text-transparent opacity-20">
            404
          </span>
        </div>

        <h1 className="text-3xl font-bold text-[#F8FAFC] sm:text-4xl">Page Not Found</h1>
        <p className="mx-auto mt-4 max-w-md text-[#94A3B8]">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/">
              <Home className="h-4 w-4" />
              Go Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/contact">
              Contact Support
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
