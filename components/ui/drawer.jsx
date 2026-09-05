'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

function Drawer({ open, onOpenChange, children }) {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      {children}
      {open && (
        <div className="fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in-0"
            onClick={() => onOpenChange(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 left-0 z-50 w-72 bg-[#0B1220] border-r border-[rgba(148,163,184,0.15)] shadow-2xl shadow-black/40 animate-in slide-in-from-left duration-300">
            {children}
          </div>
        </div>
      )}
    </>
  );
}

function DrawerHeader({ className, onClose, children, ...props }) {
  return (
    <div className={cn("flex items-center justify-between px-6 py-4 border-b border-[rgba(148,163,184,0.15)]", className)} {...props}>
      {children}
      {onClose && (
        <button
          onClick={onClose}
          className="rounded-md p-1 text-[#94A3B8] transition-colors hover:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#22D3EE]/50"
          aria-label="Close drawer"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}

function DrawerContent({ className, children, ...props }) {
  return (
    <div className={cn("flex-1 overflow-y-auto px-6 py-4", className)} {...props}>
      {children}
    </div>
  );
}

function DrawerTitle({ className, ...props }) {
  return (
    <h2 className={cn("text-lg font-semibold text-[#F8FAFC]", className)} {...props} />
  );
}

function DrawerFooter({ className, ...props }) {
  return (
    <div className={cn("px-6 py-4 border-t border-[rgba(148,163,184,0.15)]", className)} {...props} />
  );
}

export { Drawer, DrawerHeader, DrawerContent, DrawerTitle, DrawerFooter };
