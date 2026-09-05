import { forwardRef } from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cn } from '@/lib/utils';

const Label = forwardRef(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      "mb-1.5 block text-sm font-medium text-[#F8FAFC]",
      className
    )}
    {...props}
  />
));
Label.displayName = "Label";

export { Label };
