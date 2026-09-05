'use client';

import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22D3EE]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050816] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] text-[#050816] font-semibold shadow-lg shadow-[#22D3EE]/20 hover:shadow-[#22D3EE]/40 hover:brightness-110",
        secondary:
          "bg-[#8B5CF6] text-white hover:bg-[#8B5CF6]/90 shadow-lg shadow-[#8B5CF6]/20",
        outline:
          "border border-[rgba(148,163,184,0.15)] bg-transparent text-[#F8FAFC] hover:bg-[#111827] hover:border-[#22D3EE]/30",
        ghost:
          "text-[#94A3B8] hover:bg-[#111827] hover:text-[#F8FAFC]",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/20",
        link:
          "text-[#22D3EE] underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        sm: "h-8 px-3 text-xs rounded-md",
        default: "h-10 px-5 py-2",
        lg: "h-12 px-8 text-base rounded-xl",
        icon: "h-10 w-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({ className, variant, size, asChild = false, loading = false, disabled, children, ...props }) {
  const Comp = asChild ? Slot : "button";

  if (asChild) {
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        aria-busy={loading || undefined}
        {...props}
      >
        {children}
      </Comp>
    );
  }

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <Loader2 className="animate-spin" />}
      {children}
    </Comp>
  );
}

export { Button, buttonVariants };
