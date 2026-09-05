'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { getInitials, formatEnumValue } from '@/lib/utils';
import { logout } from '@/actions/auth';
import { toast } from 'sonner';
import AdminSearchModal from '@/components/admin/admin-search-modal';
import {
  Search,
  Bell,
  ChevronDown,
  UserCircle2,
  Settings,
  LogOut,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { ROLE_LABELS } from '@/config/constants';

const ROUTE_LABELS = {
  '': 'Dashboard',
  leads: 'Leads',
  clients: 'Clients',
  messages: 'Messages',
  projects: 'Projects',
  tasks: 'Tasks',
  employees: 'Employees',
  attendance: 'Attendance',
  leaves: 'Leave',
  salary: 'Salary',
  finance: 'Finance',
  revenue: 'Revenue',
  expenses: 'Expenses',
  budgets: 'Budgets',
  invoices: 'Invoices',
  payments: 'Payments',
  quotations: 'Quotations',
  cms: 'CMS',
  services: 'Services',
  products: 'Products',
  blog: 'Blog',
  testimonials: 'Testimonials',
  faqs: 'FAQs',
  navigation: 'Navigation',
  settings: 'Settings',
  media: 'Media',
  analytics: 'Analytics',
  notifications: 'Notifications',
  audit: 'Audit Logs',
};

export default function AdminHeader({ user, notifications }) {
  const pathname = usePathname();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = React.useState(false);

  const segments = pathname.replace('/admin', '').split('/').filter(Boolean);

  const breadcrumbItems = [
    { label: 'Admin', href: '/admin' },
    ...segments.map((seg, i) => ({
      label: ROUTE_LABELS[seg] || formatEnumValue(seg.replace(/-/g, '_')),
      href: i === segments.length - 1 ? undefined : `/admin/${segments.slice(0, i + 1).join('/')}`,
    })),
  ];

  const unreadCount = notifications?.length || 0;

  React.useEffect(() => {
    const handleKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
      router.refresh();
    } catch (err) {
      toast.error('Failed to log out');
    }
  };

  return (
    <>
      <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-[rgba(148,163,184,0.15)] bg-[#050816]/80 px-4 backdrop-blur-xl lg:px-8">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="flex items-center gap-2 lg:hidden">
            <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-[#22D3EE] to-[#8B5CF6]">
              <Image src="/logo.png" alt="AIOpsMedia logo" width={32} height={32} className="h-full w-full object-contain" />
            </span>
            <span className="text-sm font-bold text-[#F8FAFC]">AIOpsMedia</span>
          </Link>
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="hidden items-center gap-2 rounded-lg border border-[rgba(148,163,184,0.15)] bg-[#0B1220] px-3 py-2 text-sm text-[#94A3B8] transition-colors hover:border-[#22D3EE]/30 md:flex"
          >
            <Search className="h-4 w-4" />
            <span>Search...</span>
            <kbd className="ml-4 rounded border border-[rgba(148,163,184,0.15)] bg-[#111827] px-1.5 py-0.5 text-xs text-[#94A3B8]">
              Ctrl K
            </kbd>
          </button>
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="rounded-lg border border-[rgba(148,163,184,0.15)] bg-[#0B1220] p-2 text-[#94A3B8] transition-colors hover:border-[#22D3EE]/30 md:hidden"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>

          <Link
            href="/admin/notifications"
            className="relative rounded-lg border border-[rgba(148,163,184,0.15)] bg-[#0B1220] p-2 text-[#94A3B8] transition-colors hover:border-[#22D3EE]/30 hover:text-[#F8FAFC]"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#22D3EE] px-1 text-[10px] font-bold text-[#050816]">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 rounded-lg border border-[rgba(148,163,184,0.15)] bg-[#0B1220] p-1.5 transition-colors hover:border-[#22D3EE]/30"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#22D3EE]/20 to-[#8B5CF6]/20 text-xs font-semibold text-[#22D3EE]">
                  {getInitials(user?.name || user?.email || 'Admin')}
                </span>
                <span className="hidden text-sm font-medium text-[#F8FAFC] sm:block">
                  {user?.name || 'Admin'}
                </span>
                <ChevronDown className="hidden h-4 w-4 text-[#94A3B8] sm:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <p className="text-sm font-medium text-[#F8FAFC]">{user?.name || 'Admin'}</p>
                <p className="text-xs text-[#94A3B8]">{user?.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuLabel>
                <Badge variant="outline" className="mt-1">
                  {ROLE_LABELS[user?.role] || user?.role}
                </Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/admin/profile" className="gap-2">
                  <UserCircle2 className="h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/cms/settings" className="gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="gap-2 text-red-400 focus:text-red-400">
                <LogOut className="h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      {searchOpen && (
        <AdminSearchModal onClose={() => setSearchOpen(false)} />
      )}
    </>
  );
}
