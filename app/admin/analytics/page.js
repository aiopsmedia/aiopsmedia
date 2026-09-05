import { requireAuth } from '@/lib/auth/session';
import { db } from '@/lib/db';
import AnalyticsDashboard from '@/components/admin/analytics-dashboard';

export const metadata = {
  title: 'Analytics - AIOpsMedia Admin',
};

export default async function AnalyticsPage() {
  await requireAuth();

  const gaId = process.env.GOOGLE_ANALYTICS_ID || null;

  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    totalPageViews,
    totalCtaClicks,
    totalContactSubmissions,
    recentPageViews,
    topPaths,
    dailyPageViews,
    dailyCtaClicks,
  ] = await Promise.all([
    db.analyticsEvent.count({ where: { event: 'page_view' } }),
    db.analyticsEvent.count({ where: { event: 'cta_click' } }),
    db.analyticsEvent.count({ where: { event: 'contact_submission' } }),
    db.analyticsEvent.findMany({
      where: { event: 'page_view' },
      orderBy: { createdAt: 'desc' },
      take: 20,
    }),
    db.analyticsEvent.groupBy({
      by: ['path'],
      where: { event: 'page_view', path: { not: null } },
      _count: { _all: true },
      orderBy: { _count: { path: 'desc' } },
      take: 10,
    }),
    db.analyticsEvent.findMany({
      where: {
        event: 'page_view',
        createdAt: { gte: thirtyDaysAgo },
      },
      select: { createdAt: true },
    }),
    db.analyticsEvent.findMany({
      where: {
        event: 'cta_click',
        createdAt: { gte: thirtyDaysAgo },
      },
      select: { createdAt: true },
    }),
  ]);

  // Build daily counts for last 30 days
  const dailyMap = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
    dailyMap[key] = { date: key, pageViews: 0, ctaClicks: 0 };
  }

  recentPageViews.forEach((e) => {
    const key = new Date(e.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
    if (dailyMap[key]) dailyMap[key].pageViews++;
  });

  dailyCtaClicks.forEach((e) => {
    const key = new Date(e.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
    if (dailyMap[key]) dailyMap[key].ctaClicks++;
  });

  const dailySeries = Object.values(dailyMap);

  const topPathsData = topPaths
    .filter((p) => p.path)
    .map((p) => ({ path: p.path, count: p._count._all }));

  return (
    <AnalyticsDashboard
      gaId={gaId}
      totals={{
        pageViews: totalPageViews,
        ctaClicks: totalCtaClicks,
        contactSubmissions: totalContactSubmissions,
      }}
      dailySeries={dailySeries}
      topPaths={topPathsData}
      recentPageViews={recentPageViews}
    />
  );
}
