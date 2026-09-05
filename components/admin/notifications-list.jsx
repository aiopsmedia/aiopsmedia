'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { markNotificationRead, markAllNotificationsRead } from '@/actions/notifications';
import { formatRelativeTime } from '@/lib/utils';
import { Bell, BellOff, Check, CheckCheck, Filter } from 'lucide-react';

const TYPE_VARIANTS = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  error: 'danger',
};

export default function NotificationsPageClient({ initialNotifications }) {
  const [notifications, setNotifications] = React.useState(initialNotifications);
  const [filter, setFilter] = React.useState('all');
  const [marking, setMarking] = React.useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filtered = filter === 'all'
    ? notifications
    : filter === 'unread'
      ? notifications.filter((n) => !n.isRead)
      : notifications.filter((n) => n.type === filter);

  async function handleMarkRead(id) {
    setMarking(true);
    const result = await markNotificationRead(id);
    setMarking(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    toast.success('Marked as read');
  }

  async function handleMarkAllRead() {
    setMarking(true);
    const result = await markAllNotificationsRead();
    setMarking(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast.success('All notifications marked as read');
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F8FAFC]">Notifications</h1>
          <p className="mt-1 text-sm text-[#94A3B8]">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={handleMarkAllRead} disabled={marking} variant="outline" size="sm">
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark all read
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {[
          ['all', 'All'],
          ['unread', 'Unread'],
          ['info', 'Info'],
          ['success', 'Success'],
          ['warning', 'Warning'],
          ['error', 'Error'],
        ].map(([value, label]) => (
          <Button
            key={value}
            size="sm"
            variant={filter === value ? 'default' : 'outline'}
            onClick={() => setFilter(value)}
            className={filter === value ? 'bg-[#22D3EE]/15 text-[#22D3EE] border border-[#22D3EE]/20 shadow-none' : ''}
          >
            {label}
          </Button>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="p-8">
              <EmptyState
                title="No notifications"
                description={filter === 'all' ? 'You have no notifications yet.' : `No ${filter} notifications.`}
              />
            </div>
          ) : (
            <div className="divide-y divide-[rgba(148,163,184,0.1)]">
              {filtered.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-4 p-4 transition-colors ${
                    notification.isRead ? 'opacity-60' : 'bg-[#22D3EE]/[0.02]'
                  }`}
                >
                  <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    notification.isRead ? 'bg-[#111827]' : 'bg-[#22D3EE]/10'
                  }`}>
                    {notification.isRead ? (
                      <BellOff className="h-4 w-4 text-[#94A3B8]" />
                    ) : (
                      <Bell className="h-4 w-4 text-[#22D3EE]" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-[#F8FAFC]">{notification.title}</p>
                        {notification.message && (
                          <p className="mt-0.5 text-xs text-[#94A3B8]">{notification.message}</p>
                        )}
                      </div>
                      <Badge variant={TYPE_VARIANTS[notification.type] || 'outline'} className="shrink-0">
                        {notification.type}
                      </Badge>
                    </div>
                    <div className="mt-2 flex items-center gap-3">
                      <span className="text-xs text-[#94A3B8]">{formatRelativeTime(notification.createdAt)}</span>
                      {notification.link && (
                        <a
                          href={notification.link}
                          className="text-xs text-[#22D3EE] hover:underline"
                        >
                          View
                        </a>
                      )}
                      {!notification.isRead && (
                        <button
                          onClick={() => handleMarkRead(notification.id)}
                          disabled={marking}
                          className="text-xs text-[#94A3B8] hover:text-[#F8FAFC]"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
