import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[#22D3EE]/15 text-[#22D3EE] border border-[#22D3EE]/20",
        success: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
        warning: "bg-amber-500/15 text-amber-400 border border-amber-500/20",
        danger: "bg-red-500/15 text-red-400 border border-red-500/20",
        info: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
        outline: "bg-transparent text-[#94A3B8] border border-[rgba(148,163,184,0.15)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
