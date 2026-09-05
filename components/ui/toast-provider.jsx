'use client';

import { Toaster as SonnerToaster } from 'sonner';

function ToastProvider() {
  return (
    <SonnerToaster
      position="top-right"
      theme="dark"
      toastOptions={{
        style: {
          background: '#0B1220',
          border: '1px solid rgba(148,163,184,0.15)',
          color: '#F8FAFC',
        },
        classNames: {
          success: 'border-emerald-500/20',
          error: 'border-red-500/20',
          warning: 'border-amber-500/20',
          info: 'border-[#22D3EE]/20',
        },
      }}
      richColors
      closeButton
    />
  );
}

export { ToastProvider };
