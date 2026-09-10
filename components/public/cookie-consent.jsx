'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const CONSENT_KEY = 'cookie-consent-v1';
const GA_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || 'G-Z07LGLNQYM';

function loadGA(id) {
  if (!id || typeof document === 'undefined') return;
  if (document.querySelector(`script[src*="${id}"]`)) return;
  const s1 = document.createElement('script');
  s1.async = true;
  s1.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(s1);
  window.dataLayer = window.dataLayer || [];
  function gtag(){ window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', id, { anonymize_ip: true });
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);
  const [prefs, setPrefs] = useState({ analytics: false, marketing: false });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CONSENT_KEY);
      if (!raw) {
        setVisible(true);
        return;
      }
      const data = JSON.parse(raw);
      if (data.analytics) loadGA(GA_ID);
      // if already decided, no banner
    } catch {
      setVisible(true);
    }
  }, []);

  function save(consent) {
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify({ ...consent, date: new Date().toISOString() }));
    } catch {}
    if (consent.analytics) loadGA(GA_ID);
    setVisible(false);
    setManageOpen(false);
    // dispatch event for analytics gating
    try { window.dispatchEvent(new CustomEvent('cookie-consent', { detail: consent })); } catch {}
  }

  function handleAcceptAll() {
    save({ essential: true, analytics: true, marketing: true });
  }
  function handleReject() {
    save({ essential: true, analytics: false, marketing: false });
  }
  function handleSavePrefs() {
    save({ essential: true, analytics: prefs.analytics, marketing: prefs.marketing });
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] p-4 sm:p-6" role="dialog" aria-label="Cookie consent" aria-modal="true">
      <div className="mx-auto max-w-4xl rounded-2xl border border-[rgba(148,163,184,0.15)] bg-[#0B1220]/95 backdrop-blur-xl shadow-2xl shadow-black/40 p-6 sm:p-6">
        {!manageOpen ? (
          <>
            <h2 className="text-sm font-semibold text-[#F8FAFC]">We use cookies</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#94A3B8]">
              We use essential cookies to make our site work. With your consent, we also use analytics and marketing cookies to understand visits and improve performance. We never load optional cookies before you consent. Read our <Link href="/cookies-policy" className="text-[#22D3EE] underline underline-offset-4">Cookie Policy</Link> and <Link href="/privacy-policy" className="text-[#22D3EE] underline underline-offset-4">Privacy Policy</Link>.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button onClick={() => setManageOpen(true)} className="text-sm font-medium text-[#94A3B8] hover:text-[#F8FAFC] underline underline-offset-4">Manage Preferences</button>
              <div className="flex gap-3">
                <button onClick={handleReject} className="rounded-xl border border-[rgba(148,163,184,0.15)] px-5 py-2.5 text-sm font-medium text-[#F8FAFC] hover:bg-[#111827]">Reject Optional</button>
                <button onClick={handleAcceptAll} className="rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] px-6 py-2.5 text-sm font-semibold text-[#050816] shadow-lg shadow-[#22D3EE]/20 hover:brightness-110">Accept All</button>
              </div>
            </div>
            <p className="mt-3 text-xs text-[#94A3B8]/60">Essential always active. Analytics & Marketing only after consent. You can change this anytime in Cookie Policy.</p>
          </>
        ) : (
          <>
            <h2 className="text-sm font-semibold text-[#F8FAFC]">Manage cookie preferences</h2>
            <div className="mt-4 space-y-4">
              <div className="flex items-start justify-between gap-4 rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#050816] p-4">
                <div>
                  <p className="text-sm font-semibold text-[#F8FAFC]">Essential</p>
                  <p className="text-xs text-[#94A3B8]">Required for the site to function. Always active.</p>
                </div>
                <span className="text-xs font-medium text-emerald-400">Always On</span>
              </div>
              <label className="flex items-start justify-between gap-4 rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#050816] p-4 cursor-pointer">
                <div>
                  <p className="text-sm font-semibold text-[#F8FAFC]">Analytics</p>
                  <p className="text-xs text-[#94A3B8]">GA4 page views, conversion events (page_view, contact_form_submit). No fake events.</p>
                </div>
                <input type="checkbox" checked={prefs.analytics} onChange={(e) => setPrefs((p) => ({ ...p, analytics: e.target.checked }))} className="mt-1 h-4 w-4 accent-[#22D3EE]" />
              </label>
              <label className="flex items-start justify-between gap-4 rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#050816] p-4 cursor-pointer">
                <div>
                  <p className="text-sm font-semibold text-[#F8FAFC]">Marketing</p>
                  <p className="text-xs text-[#94A3B8]">Meta Pixel / Ads tracking if configured. Only after consent.</p>
                </div>
                <input type="checkbox" checked={prefs.marketing} onChange={(e) => setPrefs((p) => ({ ...p, marketing: e.target.checked }))} className="mt-1 h-4 w-4 accent-[#8B5CF6]" />
              </label>
            </div>
            <div className="mt-5 flex justify-between items-center">
              <button onClick={() => setManageOpen(false)} className="text-sm text-[#94A3B8] hover:text-[#F8FAFC] underline">Back</button>
              <div className="flex gap-3">
                <button onClick={handleReject} className="rounded-xl border border-[rgba(148,163,184,0.15)] px-5 py-2.5 text-sm font-medium text-[#F8FAFC]">Reject Optional</button>
                <button onClick={handleSavePrefs} className="rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] px-6 py-2.5 text-sm font-semibold text-[#050816]">Save Preferences</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
