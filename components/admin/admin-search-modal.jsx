'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';

export default function AdminSearchModal({ onClose }) {
  const router = useRouter();
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState({ leads: [], projects: [], employees: [], clients: [], services: [], blog: [] });
  const [loading, setLoading] = React.useState(false);
  const inputRef = React.useRef(null);
  const [activeIndex, setActiveIndex] = React.useState(-1);

  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  React.useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  React.useEffect(() => {
    const timer = setTimeout(async () => {
      if (!query.trim()) {
        setResults({ leads: [], projects: [], employees: [], clients: [], services: [], blog: [] });
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch {
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const grouped = [
    { key: 'leads', label: 'Leads', items: results.leads, href: () => `/admin/leads` },
    { key: 'projects', label: 'Projects', items: results.projects, href: (item) => `/admin/projects/${item.id}` },
    { key: 'employees', label: 'Employees', items: results.employees, href: () => `/admin/employees` },
    { key: 'clients', label: 'Clients', items: results.clients, href: () => `/admin/clients` },
    { key: 'services', label: 'Services', items: results.services, href: () => `/admin/cms/services` },
    { key: 'blog', label: 'Blog', items: results.blog, href: () => `/admin/cms/blog` },
  ].filter((g) => g.items.length > 0);

  const flatItems = [];
  grouped.forEach((g) => {
    g.items.forEach((item) => flatItems.push({ ...item, group: g }));
  });

  const navigate = (item) => {
    router.push(item.group.href(item));
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % Math.max(flatItems.length, 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + Math.max(flatItems.length, 1)) % Math.max(flatItems.length, 1));
    } else if (e.key === 'Enter' && activeIndex >= 0 && flatItems[activeIndex]) {
      navigate(flatItems[activeIndex]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-24 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-2xl overflow-hidden rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#0B1220] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-[rgba(148,163,184,0.15)] px-4 py-3">
          <Search className="h-4 w-4 text-[#94A3B8]" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search leads, projects, employees, services, blog..."
            className="flex-1 bg-transparent text-sm text-[#F8FAFC] placeholder:text-[#94A3B8]/50 focus:outline-none"
          />
          <kbd className="rounded border border-[rgba(148,163,184,0.15)] bg-[#111827] px-1.5 py-0.5 text-xs text-[#94A3B8]">ESC</kbd>
        </div>
        <div className="max-h-[50vh] overflow-y-auto p-2">
          {loading && query && (
            <p className="px-3 py-4 text-center text-sm text-[#94A3B8]">Searching...</p>
          )}
          {!loading && query && grouped.length === 0 && (
            <p className="px-3 py-4 text-center text-sm text-[#94A3B8]">
              No results found for &quot;{query}&quot;
            </p>
          )}
          {!query && (
            <div className="px-3 py-4">
              <p className="text-center text-sm text-[#94A3B8]">
                Type to search across your workspace
              </p>
            </div>
          )}
          {!loading && grouped.map((group) => (
            <div key={group.key} className="mb-2">
              <p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
                {group.label}
              </p>
              {group.items.map((item) => {
                const flatIdx = flatItems.findIndex((f) => f.id === item.id && f.group.key === group.key);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => navigate({ ...item, group })}
                    onMouseEnter={() => setActiveIndex(flatIdx)}
                    className={cn(
                      'flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors',
                      activeIndex === flatIdx ? 'bg-[#111827] text-[#22D3EE]' : 'text-[#F8FAFC]'
                    )}
                  >
                    <span className="truncate">{item.name || item.title || item.companyName}</span>
                    {item.email && <span className="ml-2 truncate text-xs text-[#94A3B8]">{item.email}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
