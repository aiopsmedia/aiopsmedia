'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { createInvoice, getNextInvoiceNumber } from '@/actions/invoices';
import { PAYMENT_STATUSES, PAYMENT_STATUS_LABELS } from '@/config/constants';
import { formatCurrency } from '@/lib/utils';

export default function InvoiceForm({ clients, projects, initialProjectId }) {
  const router = useRouter();
  const [saving, setSaving] = React.useState(false);
  const [invoiceNumber, setInvoiceNumber] = React.useState('');
  const [clientId, setClientId] = React.useState('');
  const [projectId, setProjectId] = React.useState(initialProjectId || '');
  const [dueDate, setDueDate] = React.useState('');
  const [status, setStatus] = React.useState('PENDING');
  const [discount, setDiscount] = React.useState('0');
  const [taxRate, setTaxRate] = React.useState('18');
  const [notes, setNotes] = React.useState('');
  const [terms, setTerms] = React.useState('Payment due within 15 days of invoice date.');
  const [items, setItems] = React.useState([
    { description: '', quantity: '1', rate: '' },
  ]);

  React.useEffect(() => {
    if (!invoiceNumber) {
      getNextInvoiceNumber().then((res) => {
        if (res.success) setInvoiceNumber(res.invoiceNumber);
      });
    }
  }, [invoiceNumber]);

  const subtotal = items.reduce((sum, it) => sum + (Number(it.quantity) || 0) * (Number(it.rate) || 0), 0);
  const discountNum = Number(discount) || 0;
  const taxRateNum = Number(taxRate) || 0;
  const taxAmount = ((subtotal - discountNum) * taxRateNum) / 100;
  const total = subtotal - discountNum + taxAmount;

  const addItem = () => {
    if (items.length >= 20) return;
    setItems([...items, { description: '', quantity: '1', rate: '' }]);
  };

  const updateItem = (index, key, value) => {
    const next = [...items];
    next[index][key] = value;
    setItems(next);
  };

  const removeItem = (index) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (!clientId.trim()) {
      toast.error('Please select a client');
      return;
    }
    if (!invoiceNumber.trim()) {
      toast.error('Invoice number is required');
      return;
    }
    const validItems = items.filter((it) => it.description.trim() && Number(it.rate) > 0);
    if (validItems.length === 0) {
      toast.error('Add at least one invoice item with description and rate');
      return;
    }

    setSaving(true);
    try {
      const res = await createInvoice({
        invoiceNumber,
        clientId,
        projectId: projectId || null,
        dueDate,
        status,
        discount: discountNum,
        taxRate: taxRateNum,
        notes,
        terms,
        items: validItems.map((it) => ({
          description: it.description,
          quantity: Number(it.quantity),
          rate: Number(it.rate),
        })),
      });

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success('Invoice created');
        router.push(`/admin/invoices/${res.id}`);
      }
    } catch {
      toast.error('Failed to create invoice');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <Label>Invoice Number</Label>
                <Input value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} placeholder="INV-2025-0001" />
              </div>
              <div>
                <Label>Client *</Label>
                <Select value={clientId} onValueChange={setClientId}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Select client" /></SelectTrigger>
                  <SelectContent>
                    {clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.companyName}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Linked Project</Label>
                <Select value={projectId} onValueChange={setProjectId}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Optional" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No project</SelectItem>
                    {projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Due Date</Label>
                <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
              </div>
              <div>
                <Label>Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PAYMENT_STATUSES.map((s) => <SelectItem key={s} value={s}>{PAYMENT_STATUS_LABELS[s]}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-[#F8FAFC]">Invoice Items</h2>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="h-4 w-4" /> Add Item
              </Button>
            </div>

            <div className="space-y-3">
              <div className="hidden grid-cols-[1fr_100px_140px_120px_36px] gap-3 text-xs font-medium uppercase tracking-wider text-[#94A3B8] sm:grid">
                <span>Description</span>
                <span>Qty</span>
                <span>Rate</span>
                <span>Amount</span>
                <span />
              </div>
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_100px_140px_120px_36px]">
                  <Input
                    placeholder={`Item description ${index + 1}`}
                    value={item.description}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                  />
                  <Input
                    type="number"
                    min="1"
                    step="1"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                  />
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Rate"
                    value={item.rate}
                    onChange={(e) => updateItem(index, 'rate', e.target.value)}
                  />
                  <div className="flex items-center justify-end rounded-lg bg-[#111827]/40 px-3 text-sm font-medium text-[#F8FAFC]">
                    {formatCurrency((Number(item.quantity) || 0) * (Number(item.rate) || 0))}
                  </div>
                  <Button type="button" variant="ghost" size="icon" className="h-10 w-10 self-start" onClick={() => removeItem(index)} disabled={items.length === 1}>
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col items-end gap-2">
              <div className="flex w-full max-w-xs items-center justify-between text-sm text-[#94A3B8]">
                <span>Subtotal</span>
                <span className="font-medium text-[#F8FAFC]">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex w-full max-w-xs items-center justify-between gap-2 text-sm text-[#94A3B8]">
                <span>Discount</span>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  className="h-8 w-28 text-right"
                />
              </div>
              <div className="flex w-full max-w-xs items-center justify-between gap-2 text-sm text-[#94A3B8]">
                <span>GST Rate</span>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  className="h-8 w-28 text-right"
                />
              </div>
              <div className="flex w-full max-w-xs items-center justify-between text-sm text-[#94A3B8]">
                <span>Tax Amount</span>
                <span className="font-medium text-[#F8FAFC]">{formatCurrency(taxAmount)}</span>
              </div>
              <div className="flex w-full max-w-xs items-center justify-between border-t border-[rgba(148,163,184,0.15)] pt-2 text-base font-bold text-[#F8FAFC]">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Notes</Label>
                <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Optional notes for the client..." />
              </div>
              <div>
                <Label>Terms &amp; Conditions</Label>
                <Textarea value={terms} onChange={(e) => setTerms(e.target.value)} rows={3} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.push('/admin/invoices')}>Cancel</Button>
          <Button type="submit" disabled={saving} loading={saving}>
            {saving ? 'Creating...' : 'Create Invoice'}
          </Button>
        </div>
      </div>
    </form>
  );
}