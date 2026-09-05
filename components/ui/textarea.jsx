import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const Textarea = forwardRef(({ className, label, error, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-[#F8FAFC]">
          {label}
        </label>
      )}
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-lg border bg-[#0B1220] px-3 py-2 text-sm text-[#F8FAFC] shadow-sm transition-colors duration-200",
          "placeholder:text-[#94A3B8]/50",
          "focus:outline-none focus:ring-2 focus:ring-[#22D3EE]/50 focus:border-[#22D3EE]/50",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error
            ? "border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50"
            : "border-[rgba(148,163,184,0.15)]",
          className
        )}
        ref={ref}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${props.id}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${props.id}-error`} className="mt-1.5 text-xs text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = "Textarea";

export { Textarea };
