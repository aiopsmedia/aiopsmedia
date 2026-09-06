'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, Trash2, ClipboardList, ExternalLink, Mail } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { deleteSubmission } from '@/actions/forms';

export default function FormSubmissions({ form }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = React.useState(null);

  const fields = Array.isArray(form.fields) ? form.fields : [];

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const res = await deleteSubmission(id);
      if (res?.error) toast.error(res.error);
      else {
        toast.success('Submission deleted');
        router.refresh();
      }
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeletingId(null);
    }
  };

  const renderValue = (data, field) => {
    if (!field) return null;
    const value = data?.[field.key];
    if (value === undefined || value === null || value === '') return null;
    if (Array.isArray(value)) {
      if (value.length === 0) return null;
      return (
        <div className="flex flex-wrap gap-1">
          {value.map((v, i) => (
            <span
              key={i}
              className="rounded-md bg-[#22D3EE]/10 px-2 py-0.5 text-xs text-[#22D3EE]"
            >
              {v}
            </span>
          ))}
        </div>
      );
    }
    if (field.type === 'email') {
      return (
        <p className="text-sm text-[#94A3B8]">
          <a
            href={`mailto:${value}`}
            className="inline-flex items-center gap-1 text-[#22D3EE] hover:underline"
          >
            <Mail className="h-3 w-3" /> {value}
          </a>
        </p>
      );
    }
    return <p className="whitespace-pre-wrap break-words text-sm text-[#94A3B8]">{String(value)}</p>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Link
            href="/admin/forms"
            className="mt-1 rounded-lg p-2 text-[#94A3B8] transition-colors hover:bg-[#111827] hover:text-[#F8FAFC]"
            aria-label="Back to forms"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-[#F8FAFC]">{form.name}</h1>
              <Badge variant={form.isActive ? 'success' : 'outline'}>
                {form.isActive ? 'Published' : 'Draft'}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-[#94A3B8]">
              {form.submissions.length} submission{form.submissions.length === 1 ? '' : 's'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/forms/${form.slug}`} target="_blank">
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4" /> Preview
            </Button>
          </Link>
        </div>
      </div>

      {form.submissions.length === 0 ? (
        <Card>
          <EmptyState
            icon={ClipboardList}
            title="No submissions yet"
            description={`Share the form at /forms/${form.slug} to start collecting entries.`}
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {form.submissions.map((sub, index) => {
            const emailField = fields.find((f) => f.type === 'email');
            return (
              <Card key={sub.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-[#F8FAFC]">
                        Submission #{form.submissions.length - index}
                      </p>
                      <p className="mt-0.5 text-xs text-[#94A3B8]">
                        {formatDateTime(sub.createdAt)}
                        {sub.ip ? ` · ${sub.ip}` : ''}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(sub.id)}
                      loading={deletingId === sub.id}
                      className="text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {fields.map((field) => {
                      const value = sub.data?.[field.key];
                      if (value === undefined || value === null || value === '') return null;
                      return (
                        <div
                          key={field.key}
                          className="rounded-lg border border-[rgba(148,163,184,0.1)] bg-[#0B1220] p-3"
                        >
                          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-[#64748B]">
                            {field.label}
                          </p>
                          {renderValue(sub.data, field)}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}