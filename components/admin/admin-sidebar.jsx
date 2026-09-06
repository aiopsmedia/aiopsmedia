'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { getInitials } from '@/lib/utils';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  Users,
  Building2,
  FolderKanban,
  ClipboardList,
  FileText,
  FileSpreadsheet,
  Receipt,
  Wallet,
  PiggyBank,
  Calendar,
  CalendarOff,
  UserCircle2,
  PenLine,
  Layers,
  Package,
  Star,
  HelpCircle,
  Settings,
  Shield,
  ChevronDown,
  ChevronLeft,
  X,
  Sparkles,
  PieChart,
  Bell,
  ScrollText,
  Image as ImageIcon,
  BarChart3,
  MessagesSquare,
  Menu,
} from 'lucide-react';

const NAV_SECTIONS = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    match: '/admin',
  },
  {
    label: 'CRM',
    children: [
      { label: 'Leads', href: '/admin/leads', icon: Users },
      { label: 'Clients', href: '/admin/clients', icon: Building2 },
      { label: 'Forms', href: '/admin/forms', icon: ClipboardList },
      { label: 'Messages', href: '/admin/messages', icon: MessagesSquare },
    ],
  },
  {
    label: 'Projects',
    children: [
      { label: 'Projects', href: '/admin/projects', icon: FolderKanban },
      { label: 'Tasks', href: '/admin/tasks', icon: ClipboardList },
    ],
  },
  {
    label: 'HR',
    children: [
      { label: 'Employees', href: '/admin/employees', icon: UserCircle2 },
      { label: 'Attendance', href: '/admin/attendance', icon: Calendar },
      { label: 'Leave', href: '/admin/leaves', icon: CalendarOff },
      { label: 'Salary', href: '/admin/salary', icon: Receipt },
    ],
  },
  {
    label: 'Finance',
    children: [
      { label: 'Overview', href: '/admin/finance', icon: Wallet },
      { label: 'Revenue', href: '/admin/revenue', icon: PiggyBank },
      { label: 'Expenses', href: '/admin/expenses', icon: Receipt },
      { label: 'Budgets', href: '/admin/budgets', icon: PieChart },
      { label: 'Invoices', href: '/admin/invoices', icon: FileText },
      { label: 'Payments', href: '/admin/payments', icon: Wallet },
    ],
  },
  {
    label: 'Sales',
    children: [
      { label: 'Quotations', href: '/admin/quotations', icon: FileSpreadsheet },
    ],
  },
  {
    label: 'CMS',
    children: [
      { label: 'Pages', href: '/admin/cms', icon: Files },
      { label: 'Services', href: '/admin/cms/services', icon: Layers },
      { label: 'Products', href: '/admin/cms/products', icon: Package },
      { label: 'Blog', href: '/admin/cms/blog', icon: PenLine },
      { label: 'Testimonials', href: '/admin/cms/testimonials', icon: Star },
      { label: 'FAQs', href: '/admin/cms/faqs', icon: HelpCircle },
      { label: 'Navigation', href: '/admin/cms/navigation', icon: Menu },
      { label: 'Settings', href: '/admin/cms/settings', icon: Settings },
    ],
  },
  {
    label: 'Media',
    href: '/admin/media',
    icon: ImageIcon,
    match: '/admin/media',
  },
  {
    label: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
    match: '/admin/analytics',
  },
  {
    label: 'Notifications',
    href: '/admin/notifications',
    icon: Bell,
    match: '/admin/notifications',
  },
  {
    label: 'Audit Logs',
    href: '/admin/audit',
    icon: ScrollText,
    match: '/admin/audit',
  },
];

function Files({ className }) {
  return <LayoutDashboard className={className} />;
}

export default function AdminSidebar({ user, collapsed = false }) {
  const pathname = usePathname();
  const [openSections, setOpenSections] = React.useState({});
  const [isOpen, setIsOpen] = React.useState(false);
  const [collapsedState, setCollapsedState] = React.useState(false);

  const effectiveCollapsed = collapsed || collapsedState;

  React.useEffect(() => {
    const active = NAV_SECTIONS.find((section) => {
      if (section.match) return pathname === section.match || pathname.startsWith(section.match + '/');
      return section.children?.some((child) => pathname === child.href || pathname.startsWith(child.href + '/'));
    });
    if (active) {
      setOpenSections((prev) => ({
        ...prev,
        [active.label]: true,
      }));
    }
  }, [pathname]);

  const isLinkActive = (href) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname === href || pathname.startsWith(href + '/');
  };

  const isSectionActive = (section) => {
    if (section.match) return isLinkActive(section.match);
    return section.children?.some((child) => isLinkActive(child.href));
  };

  const toggleSection = (label) => {
    setOpenSections((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const navContent = (
    <nav className="flex-1 overflow-y-auto px-3 py-4">
      <div className="space-y-1">
        {NAV_SECTIONS.map((section) => {
          const active = isSectionActive(section);

          if (section.children) {
            return (
              <div key={section.label} className="mb-1">
                <button
                  type="button"
                  onClick={() => toggleSection(section.label)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    active
                      ? 'bg-[#22D3EE]/10 text-[#22D3EE]'
                      : 'text-[#94A3B8] hover:bg-[#111827] hover:text-[#F8FAFC]'
                  )}
                >
                  <span className="truncate">{section.label}</span>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 shrink-0 text-[#94A3B8] transition-transform duration-200',
                      openSections[section.label] && 'rotate-180',
                      effectiveCollapsed && 'hidden'
                    )}
                  />
                </button>
                {openSections[section.label] && (
                  <div className="mt-1 space-y-0.5 pl-3">
                    {section.children.map((child) => {
                      const Icon = child.icon;
                      const childActive = isLinkActive(child.href);
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
                            childActive
                              ? 'bg-[#22D3EE]/10 text-[#22D3EE]'
                              : 'text-[#94A3B8] hover:bg-[#111827] hover:text-[#F8FAFC]'
                          )}
                        >
                          {Icon && <Icon className="h-4 w-4 shrink-0" />}
                          <span className="truncate">{child.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          const Icon = section.icon;
          return (
            <Link
              key={section.href}
              href={section.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-[#22D3EE]/10 text-[#22D3EE]'
                  : 'text-[#94A3B8] hover:bg-[#111827] hover:text-[#F8FAFC]'
              )}
            >
              {Icon && <Icon className="h-4 w-4 shrink-0" />}
              <span className="truncate">{section.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );

  const header = (
    <div className="flex items-center gap-2 border-b border-[rgba(148,163,184,0.15)] px-5 py-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#22D3EE] to-[#8B5CF6]">
        <Sparkles className="h-5 w-5 text-[#050816]" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold text-[#F8FAFC]">AIOpsMedia</p>
        <p className="text-xs text-[#94A3B8]">Admin Panel</p>
      </div>
      <button
        type="button"
        onClick={() => setCollapsedState((prev) => !prev)}
        className="hidden rounded-lg p-1.5 text-[#94A3B8] transition-colors hover:bg-[#111827] hover:text-[#F8FAFC] lg:block"
        aria-label="Toggle sidebar"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
    </div>
  );

  const footer = (
    <div className="border-t border-[rgba(148,163,184,0.15)] p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#22D3EE]/20 to-[#8B5CF6]/20 text-sm font-semibold text-[#22D3EE]">
          {getInitials(user?.name || user?.email || 'Admin')}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-[#F8FAFC]">{user?.name || 'Admin'}</p>
          <p className="truncate text-xs text-[#94A3B8]">{user?.email}</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden lg:flex h-screen sticky top-0 flex-col bg-[#050816] border-r border-[rgba(148,163,184,0.15)] transition-all duration-300',
          effectiveCollapsed ? 'w-16' : 'w-64'
        )}
      >
        {header}
        {navContent}
        {footer}
      </aside>

      {/* Mobile slide-out drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col bg-[#050816] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[rgba(148,163,184,0.15)] px-5 py-4">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#22D3EE] to-[#8B5CF6]">
                  <Sparkles className="h-5 w-5 text-[#050816]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#F8FAFC]">AIOpsMedia</p>
                  <p className="text-xs text-[#94A3B8]">Admin Panel</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-[#94A3B8] hover:bg-[#111827] hover:text-[#F8FAFC]"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {navContent}
            {footer}
          </aside>
        </div>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-40 rounded-lg bg-[#0B1220] border border-[rgba(148,163,184,0.15)] p-2.5 text-[#94A3B8] shadow-lg lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>
    </>
  );
}
