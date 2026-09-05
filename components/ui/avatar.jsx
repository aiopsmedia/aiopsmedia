'use client';

import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cn } from '@/lib/utils';
import { getInitials } from '@/lib/utils';

const Avatar = React.forwardRef(({ className, src, alt, fallback: fallbackProp, ...props }, ref) => {
  const initials = getInitials(fallbackProp || alt);
  return (
    <AvatarPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      <AvatarPrimitive.Image
        src={src}
        alt={alt || ""}
        className="aspect-square h-full w-full object-cover"
      />
      <AvatarPrimitive.Fallback
        delayMs={src ? 600 : 0}
        className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-[#22D3EE]/20 to-[#8B5CF6]/20 text-sm font-semibold text-[#22D3EE]"
      >
        {initials || "?"}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
});
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarGroup = ({ className, children, ...props }) => (
  <div className={cn("flex -space-x-2", className)} {...props}>
    {children}
  </div>
);

export { Avatar, AvatarGroup };
