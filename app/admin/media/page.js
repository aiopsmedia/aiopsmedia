import { requireAuth } from '@/lib/auth/session';
import { db } from '@/lib/db';
import MediaManager from '@/components/admin/media-manager';

export const metadata = {
  title: 'Media Library - AIOpsMedia Admin',
};

export default async function MediaPage() {
  await requireAuth();

  const media = await db.media.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return <MediaManager initialMedia={media} />;
}
