'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NAV_LINKS } from '@/config/constants';
import { cn } from '@/lib/utils';

function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-[#050816]/95 backdrop-blur-xl border-b border-[rgba(148,163,184,0.15)] shadow-lg shadow-black/20'
          : 'bg-transparent'
      )}
      role="banner"
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold" aria-label="AIOpsMedia Home">
          <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-[#22D3EE] to-[#8B5CF6] shadow-lg shadow-[#22D3EE]/20">
            <Image
              src="/logo.png"
              alt="AIOpsMedia logo"
              width={36}
              height={36}
              className="h-full w-full object-contain"
            />
          </span>
          <span className="hidden text-[#F8FAFC] sm:inline">
            <span className="text-[#22D3EE]">AI</span>OpsMedia
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'text-[#22D3EE] bg-[#22D3EE]/10'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#111827]'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden lg:block">
          <Button asChild size="default">
            <Link href="/contact">Get Started</Link>
          </Button>
        </div>

        <button
          className="rounded-lg p-2 text-[#94A3B8] transition-colors hover:bg-[#111827] hover:text-[#F8FAFC] lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 top-16 z-40 bg-[#050816]/98 backdrop-blur-xl lg:hidden">
          <div className="flex flex-col gap-1 p-4">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'rounded-lg px-4 py-3 text-base font-medium transition-colors',
                    isActive
                      ? 'text-[#22D3EE] bg-[#22D3EE]/10'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#111827]'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="mt-4 border-t border-[rgba(148,163,184,0.15)] pt-4">
              <Button asChild className="w-full" size="lg">
                <Link href="/contact">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export { SiteHeader };
