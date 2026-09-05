import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAuth } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { InvoiceActions } from '@/components/admin/invoice-actions';
import { ArrowLeft } from 'lucide-react';
import { siteConfig } from '@/config';
import { PAYMENT_STATUS_LABELS } from '@/config/constants';

export const metadata = {
  title: 'Invoice Detail - AIOpsMedia Admin',
};

const statusVariant = {
  PENDING: 'warning',
  PARTIAL: 'warning',
  PAID: 'success',
  REFUNDED: 'info',
  CANCELLED: 'outline',
};

export default async function InvoiceDetailPage({ params }) {
  await requireAuth();
  const { id } = await params;

  const invoice = await db.invoice.findUnique({
    where: { id },
    include: {
      client: { select: { companyName: true, contactPerson: true, email: true, phone: true, address: true } },
      project: { select: { id: true, name: true } },
      items: true,
    },
  });

  if (!invoice) notFound();

  const subtotal = Number(invoice.subtotal || 0);
  const discount = Number(invoice.discount || 0);
  const taxAmount = Number(invoice.taxAmount || 0);
  const total = Number(invoice.total || 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-2 -ml-2">
            <Link href="/admin/invoices">
              <ArrowLeft className="h-4 w-4" /> Back to Invoices
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#F8FAFC]">{invoice.invoiceNumber}</h1>
            <Badge variant={statusVariant[invoice.status]}>{PAYMENT_STATUS_LABELS[invoice.status]}</Badge>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 print:hidden">
          <InvoiceActions invoice={invoice} />
        </div>
      </div>

      <Card className="mx-auto max-w-4xl overflow-hidden print:border-0 print:shadow-none">
        <div className="border-b border-[rgba(148,163,184,0.15)] p-8">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#22D3EE] to-[#8B5CF6] text-lg font-bold text-[#050816]">
                  A
                </span>
                <h2 className="text-xl font-bold text-[#F8FAFC]">{siteConfig.name}</h2>
              </div>
              <div className="mt-4 space-y-0.5 text-sm text-[#94A3B8]">
                <p>{siteConfig.address}</p>
                <p>{siteConfig.email}</p>
                <p>{siteConfig.phone}</p>
                <p>{siteConfig.workingHours}</p>
              </div>
            </div>
            <div className="text-right">
              <h3 className="text-2xl font-bold tracking-tight text-[#22D3EE]">INVOICE</h3>
              <div className="mt-3 space-y-1 text-sm">
                <div className="flex justify-end gap-4">
                  <span className="text-[#94A3B8]">Invoice #:</span>
                  <span className="font-medium text-[#F8FAFC]">{invoice.invoiceNumber}</span>
                </div>
                <div className="flex justify-end gap-4">
                  <span className="text-[#94A3B8]">Date:</span>
                  <span className="font-medium text-[#F8FAFC]">{formatDate(invoice.createdAt)}</span>
                </div>
                <div className="flex justify-end gap-4">
                  <span className="text-[#94A3B8]">Due date:</span>
                  <span className="font-medium text-[#F8FAFC]">{invoice.dueDate ? formatDate(invoice.dueDate) : '—'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-[rgba(148,163,184,0.15)] p-8">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">Bill To</h4>
              <p className="mt-2 text-lg font-semibold text-[#F8FAFC]">{invoice.client?.companyName || 'N/A'}</p>
              <div className="mt-1 space-y-0.5 text-sm text-[#94A3B8]">
                {invoice.client?.contactPerson && <p>{invoice.client.contactPerson}</p>}
                {invoice.client?.email && <p>{invoice.client.email}</p>}
                {invoice.client?.phone && <p>{invoice.client.phone}</p>}
                {invoice.client?.address && <p>{invoice.client.address}</p>}
              </div>
            </div>
            <div className="sm:text-right">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">Project</h4>
              {invoice.project ? (
                <p className="mt-2 text-sm font-medium text-[#F8FAFC]">{invoice.project.name}</p>
              ) : (
                <p className="mt-2 text-sm text-[#94A3B8]">—</p>
              )}
              <p className="mt-4 text-xs text-[#94A3B8]">Status: <Badge variant={statusVariant[invoice.status]}>{PAYMENT_STATUS_LABELS[invoice.status]}</Badge></p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[rgba(148,163,184,0.15)] text-xs uppercase tracking-wider text-[#94A3B8]">
                <th className="py-2 pr-4">Description</th>
                <th className="py-2 pr-4 text-right">Qty</th>
                <th className="py-2 pr-4 text-right">Rate</th>
                <th className="py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item) => (
                <tr key={item.id} className="border-b border-[rgba(148,163,184,0.05)]">
                  <td className="py-3 pr-4 text-[#F8FAFC]">{item.description}</td>
                  <td className="py-3 pr-4 text-right text-[#94A3B8]">{Number(item.quantity)}</td>
                  <td className="py-3 pr-4 text-right text-[#94A3B8]">{formatCurrency(item.rate)}</td>
                  <td className="py-3 text-right font-medium text-[#F8FAFC]">{formatCurrency(item.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-6 flex justify-end">
            <div className="w-full max-w-xs space-y-2 text-sm">
              <div className="flex justify-between text-[#94A3B8]">
                <span>Subtotal</span>
                <span className="text-[#F8FAFC]">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#94A3B8]">
                <span>Discount</span>
                <span className="text-[#F8FAFC]">-{formatCurrency(discount)}</span>
              </div>
              <div className="flex justify-between text-[#94A3B8]">
                <span>GST ({invoice.taxRate}%)</span>
                <span className="text-[#F8FAFC]">{formatCurrency(taxAmount)}</span>
              </div>
              <div className="flex justify-between border-t border-[rgba(148,163,184,0.15)] pt-2 text-base font-bold text-[#F8FAFC]">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>

        {(invoice.notes || invoice.terms) && (
          <div className="border-t border-[rgba(148,163,184,0.15)] p-8 pt-6">
            {invoice.notes && (
              <div className="mb-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">Notes</h4>
                <p className="mt-1 text-sm text-[#94A3B8]">{invoice.notes}</p>
              </div>
            )}
            {invoice.terms && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">Terms & Conditions</h4>
                <p className="mt-1 text-sm text-[#94A3B8]">{invoice.terms}</p>
              </div>
            )}
          </div>
        )}

        <div className="border-t border-[rgba(148,163,184,0.15)] p-8 pt-4 text-center text-xs text-[#94A3B8]">
          <p>Thank you for your business with {siteConfig.name}.</p>
          <p className="mt-1">Generated on {formatDateTime(invoice.createdAt)}</p>
        </div>
      </Card>
    </div>
  );
}
