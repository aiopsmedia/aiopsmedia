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
  const [openDropdown, setOpenDropdown] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
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
          : 'bg-[#050816]/80 backdrop-blur-md border-b border-transparent'
      )}
      role="banner"
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold" aria-label="AIOpsMedia Home">
          <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-[#22D3EE] to-[#8B5CF6] shadow-lg shadow-[#22D3EE]/20">
            <Image src="/logo.png" alt="AIOpsMedia logo" width={36} height={36} className="h-full w-full object-contain" />
          </span>
          <span className="hidden text-[#F8FAFC] sm:inline">
            <span className="text-[#22D3EE]">AI</span>OpsMedia
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            const hasChildren = link.children && link.children.length > 0;
            return (
              <div key={link.label} className="relative group">
                <Link
                  href={link.href}
                  onMouseEnter={() => hasChildren && setOpenDropdown(link.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                  className={cn(
                    'inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive ? 'text-[#22D3EE] bg-[#22D3EE]/10' : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#111827]'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                  {hasChildren && <ChevronDown className="h-3 w-3 opacity-60 group-hover:rotate-180 transition-transform" />}
                </Link>
                {hasChildren && (
                  <div
                    className={cn(
                      'absolute left-0 top-full pt-2 transition-all',
                      openDropdown === link.label ? 'opacity-100 visible' : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible'
                    )}
                    onMouseEnter={() => setOpenDropdown(link.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <div className="min-w-[220px] rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#0B1220] p-2 shadow-2xl">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block rounded-lg px-3 py-2 text-sm text-[#94A3B8] hover:bg-[#111827] hover:text-[#F8FAFC]"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <Button asChild variant="outline" size="sm">
            <Link href="/estimate">Get a Project Estimate</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/book-consultation">Book a Free Consultation</Link>
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
        <div className="fixed inset-0 top-16 z-40 overflow-auto bg-[#050816]/98 backdrop-blur-xl lg:hidden">
          <div className="flex flex-col gap-1 p-4">
            {NAV_LINKS.map((link) => {
              const hasChildren = link.children && link.children.length > 0;
              const expanded = openDropdown === link.label;
              return (
                <div key={link.label} className="rounded-lg">
                  <div className="flex items-center">
                    <Link
                      href={link.href}
                      className="flex-1 rounded-lg px-4 py-3 text-base font-medium text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#111827]"
                    >
                      {link.label}
                    </Link>
                    {hasChildren && (
                      <button
                        onClick={() => setOpenDropdown(expanded ? null : link.label)}
                        className="p-3 text-[#94A3B8]"
                        aria-expanded={expanded}
                      >
                        <ChevronDown className={cn('h-4 w-4 transition-transform', expanded && 'rotate-180')} />
                      </button>
                    )}
                  </div>
                  {hasChildren && expanded && (
                    <div className="ml-4 border-l border-[rgba(148,163,184,0.15)] pl-4 pb-2 space-y-1">
                      {link.children.map((child) => (
                        <Link key={child.href} href={child.href} className="block rounded-lg px-3 py-2 text-sm text-[#94A3B8] hover:text-[#22D3EE]">
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <div className="mt-4 space-y-2 border-t border-[rgba(148,163,184,0.15)] pt-4">
              <Button asChild className="w-full" size="lg">
                <Link href="/book-consultation">Book a Free Consultation</Link>
              </Button>
              <Button asChild variant="outline" className="w-full" size="lg">
                <Link href="/estimate">Get a Project Estimate</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export { SiteHeader };
