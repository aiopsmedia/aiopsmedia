'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, ArrowUp, AtSign, Share2, Camera, Globe2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/config';

const quickLinks = [
  { label: 'Services', href: '/services' },
  { label: 'Products', href: '/products' },
  { label: 'Blog', href: '/blog' },
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'Contact', href: '/contact' },
];

const serviceLinks = [
  { label: 'Custom Software', href: '/services#custom-software' },
  { label: 'AI & Automation', href: '/services#ai-automation' },
  { label: 'Web Development', href: '/services#web-development' },
  { label: 'Mobile Apps', href: '/services#mobile-apps' },
  { label: 'Cloud Solutions', href: '/services#cloud-solutions' },
];

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms & Conditions', href: '/terms-conditions' },
  { label: 'Refund Policy', href: '/refund-policy' },
  { label: 'Cookies Policy', href: '/cookies-policy' },
  { label: 'Data Protection', href: '/data-protection' },
  { label: 'Disclaimer', href: '/disclaimer' },
  { label: 'Accessibility', href: '/accessibility' },
];

const socialLinks = [
  { icon: AtSign, href: siteConfig.social.linkedin, label: 'LinkedIn' },
  { icon: Share2, href: siteConfig.social.twitter, label: 'Twitter / X' },
  { icon: Camera, href: siteConfig.social.instagram, label: 'Instagram' },
  { icon: Globe2, href: siteConfig.social.facebook, label: 'Facebook' },
].filter((s) => s.href);

function SiteFooter() {
  return (
    <footer className="border-t border-[rgba(148,163,184,0.15)] bg-[#0B1220]" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 py-16 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 text-xl font-bold" aria-label="AIOpsMedia Home">
              <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-[#22D3EE] to-[#8B5CF6] shadow-lg shadow-[#22D3EE]/20">
                <Image
                  src="/logo.png"
                  alt="AIOpsMedia logo"
                  width={36}
                  height={36}
                  className="h-full w-full object-contain"
                />
              </span>
              <span className="text-[#F8FAFC]">
                <span className="text-[#22D3EE]">AI</span>OpsMedia
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-[#94A3B8]">
              {siteConfig.tagline}. Helping businesses build intelligent software, automate operations, and accelerate digital growth.
            </p>
            {socialLinks.length > 0 && (
              <div className="flex gap-3 pt-2">
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[rgba(148,163,184,0.15)] text-[#94A3B8] transition-colors hover:border-[#22D3EE]/30 hover:text-[#22D3EE]"
                    aria-label={label}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
            <Link href="/login" className="inline-flex items-center gap-1.5 text-xs text-[#94A3B8] transition-colors hover:text-[#22D3EE]">
              <Lock className="h-3 w-3" /> Admin Login
            </Link>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#F8FAFC]">Quick Links</h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
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
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#F8FAFC]">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#22D3EE]" />
                <a href={`mailto:${siteConfig.email}`} className="text-sm text-[#94A3B8] transition-colors hover:text-[#22D3EE]">
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#22D3EE]" />
                <a href={`tel:${siteConfig.phone}`} className="text-sm text-[#94A3B8] transition-colors hover:text-[#22D3EE]">
                  {siteConfig.phone}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#22D3EE]" />
                <span className="text-sm text-[#94A3B8]">{siteConfig.address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-[rgba(148,163,184,0.15)] py-6 sm:flex-row">
          <p className="text-xs text-[#94A3B8]">
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <nav aria-label="Legal links" className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-[#94A3B8] transition-colors hover:text-[#22D3EE]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
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
