'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, ArrowUp, AtSign, Share2, Camera, Globe2, Lock } from 'lucide-react';
import { siteConfig } from '@/config';

const companyLinks = [
  { label: 'About', href: '/about' },
  { label: 'Careers', href: '/careers' },
  { label: 'Contact', href: '/contact' },
  { label: 'Book Consultation', href: '/book-consultation' },
  { label: 'Get Estimate', href: '/estimate' },
];

const serviceLinks = [
  { label: 'AI Development', href: '/services/ai-development' },
  { label: 'AI Agents', href: '/services/ai-agents' },
  { label: 'Automation', href: '/services/ai-automation' },
  { label: 'CRM Development', href: '/services/crm-development' },
  { label: 'ERP Development', href: '/services/erp-development' },
  { label: 'Real Estate ERP', href: '/services/real-estate-erp' },
  { label: 'School ERP', href: '/services/school-erp' },
  { label: 'Web Development', href: '/services/web-development' },
  { label: 'E-commerce', href: '/services/ecommerce-development' },
];

const marketLinks = [
  { label: 'USA — AI & Software', href: '/usa' },
  { label: 'USA AI Development', href: '/usa/ai-development' },
  { label: 'UK — AI & Software', href: '/uk' },
  { label: 'UK CRM Development', href: '/uk/crm-development' },
  { label: 'UAE — Dubai & UAE', href: '/uae' },
  { label: 'Dubai Solutions', href: '/uae/dubai' },
  { label: 'Global Services', href: '/services' },
];

const resourceLinks = [
  { label: 'Blog / Insights', href: '/blog' },
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'Industries', href: '/industries' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Technology', href: '/technology' },
  { label: 'Resources', href: '/resources' },
  { label: 'Search', href: '/search' },
];

const legalLinks = [
  { label: 'Privacy', href: '/privacy-policy' },
  { label: 'Terms', href: '/terms-conditions' },
  { label: 'Cookie Policy', href: '/cookies-policy' },
  { label: 'Refund Policy', href: '/refund-policy' },
  { label: 'Disclaimer', href: '/disclaimer' },
  { label: 'Data Protection', href: '/data-protection' },
];

function SiteFooter() {
  return (
    <footer className="border-t border-[rgba(148,163,184,0.15)] bg-[#0B1220]" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 py-16 md:grid-cols-2 lg:grid-cols-6">
          <div className="space-y-4 lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 text-xl font-bold" aria-label="AIOpsMedia Home">
              <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-[#22D3EE] to-[#8B5CF6] shadow-lg shadow-[#22D3EE]/20">
                <Image src="/logo.png" alt="AIOpsMedia logo" width={36} height={36} className="h-full w-full object-contain" />
              </span>
              <span className="text-[#F8FAFC]">
                <span className="text-[#22D3EE]">AI</span>OpsMedia
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-[#94A3B8]">AI, Software & Automation for Modern Businesses. Built in India. Serving Businesses Globally.</p>
            <p className="text-xs leading-relaxed text-[#94A3B8]/80">
              {siteConfig.tagline}. AI-powered software, CRM/ERP and automation that reduces manual work and creates scalable digital operations.
            </p>
            <div className="pt-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#F8FAFC]">Contact</p>
              <ul className="mt-2 space-y-2">
                <li className="flex items-center gap-2 text-sm text-[#94A3B8]">
                  <Mail className="h-4 w-4 text-[#22D3EE]" />
                  <a href={`mailto:${siteConfig.email}`} className="hover:text-[#22D3EE]">{siteConfig.email}</a>
                </li>
                <li className="flex items-center gap-2 text-sm text-[#94A3B8]">
                  <Phone className="h-4 w-4 text-[#22D3EE]" />
                  <a href={`tel:${siteConfig.phone}`} className="hover:text-[#22D3EE]">{siteConfig.phone}</a>
                </li>
                <li className="flex items-start gap-2 text-sm text-[#94A3B8]">
                  <MapPin className="h-4 w-4 mt-0.5 text-[#22D3EE]" />
                  <span>{siteConfig.address} — Serving USA, UK, UAE remotely</span>
                </li>
              </ul>
            </div>
            <Link href="/login" className="inline-flex items-center gap-1.5 text-xs text-[#94A3B8] transition-colors hover:text-[#22D3EE]">
              <Lock className="h-3 w-3" /> Admin Login
            </Link>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#F8FAFC]">Company</h3>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[#94A3B8] transition-colors hover:text-[#22D3EE]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#F8FAFC]">Services</h3>
            <ul className="space-y-2.5">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[#94A3B8] transition-colors hover:text-[#22D3EE]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#F8FAFC]">Markets</h3>
            <ul className="space-y-2.5">
              {marketLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[#94A3B8] transition-colors hover:text-[#22D3EE]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#F8FAFC]">Resources</h3>
            <ul className="space-y-2.5">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[#94A3B8] transition-colors hover:text-[#22D3EE]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-[rgba(148,163,184,0.15)] py-6 sm:flex-row">
          <p className="text-xs text-[#94A3B8]">&copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved. Built in India. Serving Businesses Globally.</p>
          <nav aria-label="Legal links" className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {legalLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-xs text-[#94A3B8] transition-colors hover:text-[#22D3EE]">
                {link.label}
              </Link>
            ))}
          </nav>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="inline-flex items-center gap-1.5 text-xs text-[#94A3B8] transition-colors hover:text-[#22D3EE]"
            aria-label="Back to top"
          >
            Back to top <ArrowUp className="h-3 w-3" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export { SiteFooter };
