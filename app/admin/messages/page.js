import { requireAuth } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { formatDate, formatRelativeTime } from '@/lib/utils';
import Link from 'next/link';

export const metadata = {
  title: 'Messages - AIOpsMedia Admin',
};

export default async function MessagesPage() {
  await requireAuth();

  const messages = await db.lead.findMany({
    where: {
      source: 'OTHER',
      notes: { contains: 'Subject:' },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#F8FAFC]">Messages</h1>
        <p className="mt-1 text-sm text-[#94A3B8]">
          Contact form submissions and enquiries ({messages.length})
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          {messages.length === 0 ? (
            <div className="p-8">
              <EmptyState
                title="No messages"
                description="Contact form submissions will appear here."
              />
            </div>
          ) : (
            <div className="divide-y divide-[rgba(148,163,184,0.1)]">
              {messages.map((msg) => {
                const subjectMatch = msg.notes?.match(/^Subject: (.+)/m);
                const subject = subjectMatch ? subjectMatch[1] : 'No subject';
                const body = msg.notes?.replace(/^Subject: .+\n\n?/m, '') || '';

                return (
                  <div key={msg.id} className="p-4 transition-colors hover:bg-[#22D3EE]/[0.02]">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-[#F8FAFC]">{msg.name}</p>
                          {msg.email && (
                            <span className="text-xs text-[#94A3B8]">&lt;{msg.email}&gt;</span>
                          )}
                          <Badge variant={msg.status === 'NEW' ? 'info' : 'outline'}>
                            {msg.status}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm font-medium text-[#94A3B8]">{subject}</p>
                        <p className="mt-1 line-clamp-2 text-xs text-[#94A3B8]">{body}</p>
                        <p className="mt-2 text-xs text-[#94A3B8]">
                          {formatDate(msg.createdAt)} &middot; {formatRelativeTime(msg.createdAt)}
                        </p>
                      </div>
                      <Link
                        href="/admin/leads"
                        className="shrink-0 text-xs text-[#22D3EE] hover:underline"
                      >
                        View Lead
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
