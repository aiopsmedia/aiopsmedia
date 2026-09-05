import Link from 'next/link';
import { requireAuth } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { SquareText, Layers, Package, PenLine, Star, HelpCircle, Menu, Settings, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'CMS - AIOpsMedia Admin',
};

const QUICK_LINKS = [
  { label: 'Pages', href: '/admin/cms', icon: SquareText, desc: 'Manage public pages' },
  { label: 'Services', href: '/admin/cms/services', icon: Layers, desc: 'Services and offerings' },
  { label: 'Products', href: '/admin/cms/products', icon: Package, desc: 'Product catalog' },
  { label: 'Blog', href: '/admin/cms/blog', icon: PenLine, desc: 'Articles and posts' },
  { label: 'Testimonials', href: '/admin/cms/testimonials', icon: Star, desc: 'Customer reviews' },
  { label: 'FAQs', href: '/admin/cms/faqs', icon: HelpCircle, desc: 'Frequently asked questions' },
  { label: 'Navigation', href: '/admin/cms/navigation', icon: Menu, desc: 'Menus and links' },
  { label: 'Site Settings', href: '/admin/cms/settings', icon: Settings, desc: 'Brand, SEO, contact info' },
];

export default async function CmsOverviewPage() {
  await requireAuth();

  const [services, products, posts, testimonials, faqs, pages, recentChanges] = await Promise.all([
    db.service.count(),
    db.product.count(),
    db.blog.count(),
    db.testimonial.count(),
    db.fAQ.count(),
    db.page.count(),
    db.auditLog.findMany({
      where: { resource: { in: ['service', 'product', 'blog', 'testimonial', 'faq', 'page', 'navigation', 'siteSetting'] } },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { user: { select: { name: true } } },
    }),
  ]);

  const stats = [
    { label: 'Pages', value: pages, href: '/admin/cms' },
    { label: 'Services', value: services, href: '/admin/cms/services' },
    { label: 'Products', value: products, href: '/admin/cms/products' },
    { label: 'Blog Posts', value: posts, href: '/admin/cms/blog' },
    { label: 'Testimonials', value: testimonials, href: '/admin/cms/testimonials' },
    { label: 'FAQs', value: faqs, href: '/admin/cms/faqs' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#F8FAFC]">Content Management</h1>
        <p className="mt-1 text-sm text-[#94A3B8]">Manage all your website content from one place.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {QUICK_LINKS.map((link) => {
          const Icon = link.icon;
          return (
            <Link key={link.label} href={link.href} className="group">
              <Card className="h-full transition-all hover:border-[#22D3EE]/30 hover:bg-[#111827]/40">
                <CardContent className="flex items-start justify-between p-5">
                  <div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#22D3EE]/10">
                      <Icon className="h-5 w-5 text-[#22D3EE]" />
                    </div>
                    <h3 className="mt-3 font-semibold text-[#F8FAFC]">{link.label}</h3>
                    <p className="mt-1 text-sm text-[#94A3B8]">{link.desc}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[#94A3B8] transition-transform group-hover:translate-x-1 group-hover:text-[#22D3EE]" />
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Content Statistics</CardTitle>
            <CardDescription>Current content across the site</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <Link key={stat.label} href={stat.href} className="rounded-lg border border-[rgba(148,163,184,0.1)] bg-[#111827]/40 p-4 text-center transition-colors hover:border-[#22D3EE]/30">
                  <p className="text-2xl font-bold text-[#F8FAFC]">{stat.value}</p>
                  <p className="mt-1 text-sm text-[#94A3B8]">{stat.label}</p>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Changes</CardTitle>
            <CardDescription>Latest content updates</CardDescription>
          </CardHeader>
          <CardContent>
            {recentChanges.length === 0 ? (
              <EmptyState title="No changes yet" />
            ) : (
              <div className="space-y-4">
                {recentChanges.map((change) => (
                  <div key={change.id} className="flex items-start gap-3">
                    <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-[#8B5CF6]" />
                    <div className="min-w-0">
                      <p className="text-sm text-[#F8FAFC]">
                        <span className="font-medium">{change.user?.name || 'System'}</span>{' '}
                        <span className="text-[#94A3B8]">{change.action} {change.resource}</span>
                      </p>
                      <p className="text-xs text-[#94A3B8]">{formatDate(change.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
