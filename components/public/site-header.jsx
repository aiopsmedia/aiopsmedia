'use client';

import { useState, useEffect, useRef } from 'react';
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
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const menuRef = useRef(null);
  const pathname = usePathname();

  // scroll blur
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // close mobile on route change
  useEffect(() => {
    setMobileOpen(false);
    setMobileExpanded(null);
  }, [pathname]);

  // lock body scroll when mobile open + handle ESC
  useEffect(() => {
    if (mobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      const onKey = (e) => {
        if (e.key === 'Escape') setMobileOpen(false);
      };
      document.addEventListener('keydown', onKey);
      return () => {
        document.body.style.overflow = prev;
        document.removeEventListener('keydown', onKey);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileOpen]);

  // click outside to close mobile
  useEffect(() => {
    if (!mobileOpen) return;
    function onClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        const header = document.querySelector('header');
        if (header && header.contains(e.target)) return;
        // backdrop click handled separately
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
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
            <Image src="/logo.png" alt="AIOpsMedia logo" width={36} height={36} className="h-full w-full object-contain" priority />
          </span>
          <span className="hidden text-[#F8FAFC] sm:inline">
            <span className="text-[#22D3EE]">AI</span>OpsMedia
          </span>
        </Link>

        {/* Desktop nav - CSS only dropdown, no JS state needed for hover */}
        <div className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && link.href !== '#' && pathname.startsWith(link.href));
            const hasChildren = link.children && link.children.length > 0;
            if (hasChildren) {
              const isHashParent = link.href === '#';
              if (isHashParent) {
                return (
                  <div key={link.label} className="relative group">
                    <button
                      type="button"
                      className={cn(
                        'inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                        isActive ? 'text-[#22D3EE] bg-[#22D3EE]/10' : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#111827]'
                      )}
                      aria-haspopup="true"
                    >
                      {link.label}
                      <ChevronDown className="h-3 w-3 opacity-60 transition-transform group-hover:rotate-180" />
                    </button>
                    <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200">
                      <div className="min-w-[220px] rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#0B1220] p-2 shadow-2xl">
                        {link.children.map((child) => (
                          <Link key={child.href} href={child.href} className="block rounded-lg px-3 py-2 text-sm text-[#94A3B8] hover:bg-[#111827] hover:text-[#F8FAFC]">{child.label}</Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }
              return (
                <div key={link.label} className="relative group">
                  <Link
                    href={link.href}
                    className={cn(
                      'inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive ? 'text-[#22D3EE] bg-[#22D3EE]/10' : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#111827]'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {link.label}
                    <ChevronDown className="h-3 w-3 opacity-60 transition-transform group-hover:rotate-180" />
                  </Link>
                  <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200">
                    <div className="min-w-[220px] rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#0B1220] p-2 shadow-2xl">
                      {link.children.map((child) => (
                        <Link key={child.href} href={child.href} className="block rounded-lg px-3 py-2 text-sm text-[#94A3B8] hover:bg-[#111827] hover:text-[#F8FAFC]">{child.label}</Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive ? 'text-[#22D3EE] bg-[#22D3EE]/10' : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#111827]'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                {link.label}
              </Link>
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
          type="button"
          className="rounded-lg p-2 text-[#94A3B8] transition-colors hover:bg-[#111827] hover:text-[#F8FAFC] lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          {/* backdrop */}
          <button
            aria-label="Close menu backdrop"
            className="fixed inset-0 top-16 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
            tabIndex={-1}
          />
          <div
            id="mobile-menu"
            ref={menuRef}
            className="fixed right-0 top-16 z-50 h-[calc(100dvh-4rem)] w-[86%] max-w-[360px] overflow-y-auto border-l border-[rgba(148,163,184,0.15)] bg-[#050816] shadow-2xl lg:hidden animate-in slide-in-from-right duration-300"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col gap-1 p-4 pb-8">
              {NAV_LINKS.map((link) => {
                const hasChildren = link.children && link.children.length > 0;
                const expanded = mobileExpanded === link.label;
                const isActive = pathname === link.href || (link.href !== '#' && pathname.startsWith(link.href));
                if (hasChildren) {
                  return (
                    <div key={link.label} className="rounded-lg border border-transparent">
                      <div className="flex items-center gap-1">
                        <Link
                          href={link.href.startsWith('#') ? (link.children?.[0]?.href || '/services') : link.href}
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            'flex-1 rounded-lg px-4 py-3 text-base font-medium transition-colors',
                            isActive ? 'text-[#22D3EE] bg-[#22D3EE]/10' : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#111827]'
                          )}
                        >
                          {link.label}
                        </Link>
                        <button
                          type="button"
                          onClick={() => setMobileExpanded(expanded ? null : link.label)}
                          className="flex h-10 w-10 items-center justify-center rounded-lg text-[#94A3B8] hover:bg-[#111827] hover:text-[#F8FAFC]"
                          aria-expanded={expanded}
                          aria-label={`${expanded ? 'Collapse' : 'Expand'} ${link.label}`}
                        >
                          <ChevronDown className={cn('h-4 w-4 transition-transform', expanded && 'rotate-180')} />
                        </button>
                      </div>
                      {expanded && (
                        <div className="ml-2 mt-1 border-l border-[rgba(148,163,184,0.15)] pl-4 pb-2 space-y-1">
                          {link.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={() => setMobileOpen(false)}
                              className="block rounded-lg px-3 py-2.5 text-sm text-[#94A3B8] hover:text-[#22D3EE] hover:bg-[#111827]"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'rounded-lg px-4 py-3 text-base font-medium transition-colors',
                      isActive ? 'text-[#22D3EE] bg-[#22D3EE]/10' : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#111827]'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="mt-4 space-y-3 border-t border-[rgba(148,163,184,0.15)] pt-4">
                <Button asChild className="w-full" size="lg">
                  <Link href="/book-consultation" onClick={() => setMobileOpen(false)}>Book a Free Consultation</Link>
                </Button>
                <Button asChild variant="outline" className="w-full" size="lg">
                  <Link href="/estimate" onClick={() => setMobileOpen(false)}>Get a Project Estimate</Link>
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}

export { SiteHeader };
