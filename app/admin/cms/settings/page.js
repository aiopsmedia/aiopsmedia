import { requireAuth } from '@/lib/auth/session';
import { db } from '@/lib/db';
import SettingsForm from '@/components/admin/settings-form';
import { siteConfig } from '@/config';

export const metadata = {
  title: 'Site Settings - AIOpsMedia Admin',
};

export default async function SiteSettingsPage() {
  await requireAuth();

  const settings = await db.siteSetting.findMany();

  const grouped = {};
  settings.forEach((s) => {
    const key = s.key;
    grouped[key] = s.value ?? '';
  });

  return <SettingsForm initialSettings={grouped} defaults={siteConfig} />;
}
