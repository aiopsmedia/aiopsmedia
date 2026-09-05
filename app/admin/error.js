'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShieldAlert, RefreshCw, LogOut } from 'lucide-react';

export default function AdminError({ error, retry }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
        <ShieldAlert className="h-8 w-8 text-red-400" />
      </div>
      <h1 className="mt-6 text-2xl font-bold text-[#F8FAFC]">Something went wrong</h1>
      <p className="mt-3 max-w-md text-sm text-[#94A3B8]">
        An error occurred while loading this page. Try again or go back to the dashboard.
      </p>
      <div className="mt-8 flex gap-3">
        <Button onClick={retry}>
          <RefreshCw className="h-4 w-4" /> Try Again
        </Button>
        <Button variant="outline" asChild>
          <Link href="/admin">
            <LogOut className="h-4 w-4" /> Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}