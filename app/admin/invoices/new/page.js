import Link from 'next/link';
import { requireAuth } from '@/lib/auth/session';
import { db } from '@/lib/db';
import InvoiceForm from '@/components/admin/invoice-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'New Invoice - AIOpsMedia Admin',
};

export default async function NewInvoicePage({ searchParams }) {
  await requireAuth();
  const sp = await searchParams;
  const initialProjectId = sp?.project || '';

  const [clients, projects] = await Promise.all([
    db.client.findMany({
      select: { id: true, companyName: true },
      orderBy: { companyName: 'asc' },
    }),
    db.project.findMany({
      select: { id: true, name: true, clientId: true },
      orderBy: { createdAt: 'desc' },
      take: 200,
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-2 -ml-2">
          <Link href="/admin/invoices">
            <ArrowLeft className="h-4 w-4" /> Back to Invoices
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-[#F8FAFC]">Create Invoice</h1>
        <p className="mt-1 text-sm text-[#94A3B8]">Generate a new invoice for your client.</p>
      </div>

      <InvoiceForm clients={clients} projects={projects} initialProjectId={initialProjectId} />
    </div>
  );
}