'use client';

import { useState } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { APP_URL } from '@/config/constants';

export function ShareButtons({ url, title }) {
  const [copied, setCopied] = useState(false);
  const fullUrl = `${APP_URL}${url}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-[#F8FAFC]">Share:</span>

      <button
        onClick={copyLink}
        className="inline-flex items-center gap-1.5 rounded-lg border border-[rgba(148,163,184,0.15)] bg-[#0B1220] px-3 py-1.5 text-xs text-[#94A3B8] transition-colors hover:border-[#22D3EE]/30 hover:text-[#22D3EE]"
        aria-label="Copy link"
      >
        {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
        {copied ? 'Copied!' : 'Copy Link'}
      </button>

      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-lg border border-[rgba(148,163,184,0.15)] bg-[#0B1220] px-3 py-1.5 text-xs text-[#94A3B8] transition-colors hover:border-[#22D3EE]/30 hover:text-[#22D3EE]"
        aria-label="Share on LinkedIn"
      >
        LinkedIn <ExternalLink className="h-3 w-3" />
      </a>

      <a
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-lg border border-[rgba(148,163,184,0.15)] bg-[#0B1220] px-3 py-1.5 text-xs text-[#94A3B8] transition-colors hover:border-[#22D3EE]/30 hover:text-[#22D3EE]"
        aria-label="Share on X"
      >
        X <ExternalLink className="h-3 w-3" />
      </a>

      <a
        href={`https://wa.me/?text=${encodeURIComponent(`${title} ${fullUrl}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-lg border border-[rgba(148,163,184,0.15)] bg-[#0B1220] px-3 py-1.5 text-xs text-[#94A3B8] transition-colors hover:border-[#22D3EE]/30 hover:text-[#22D3EE]"
        aria-label="Share on WhatsApp"
      >
        WhatsApp <ExternalLink className="h-3 w-3" />
      </a>
    </div>
  );
}
