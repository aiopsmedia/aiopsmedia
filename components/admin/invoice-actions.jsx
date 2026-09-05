'use client';

import { Button } from '@/components/ui/button';
import { Printer, Download, Send } from 'lucide-react';

function InvoiceActions({ invoice }) {
  const handleSend = () => {
    window.alert(`Invoice ${invoice.invoiceNumber} would be emailed to ${invoice.client?.email || 'the client'} in the live version.`);
  };

  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="flex flex-wrap gap-2 print:hidden">
      <Button variant="outline" onClick={() => window.print()}>
        <Printer className="h-4 w-4" /> Print
      </Button>
      <Button variant="outline" onClick={handleDownload}>
        <Download className="h-4 w-4" /> Download PDF
      </Button>
      <Button onClick={handleSend}>
        <Send className="h-4 w-4" /> Send Email
      </Button>
    </div>
  );
}

export { InvoiceActions };
