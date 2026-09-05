import { cn } from '@/lib/utils';

function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#0B1220] text-[#F8FAFC] shadow-sm",
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }) {
  return (
    <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  );
}

function CardTitle({ className, ...props }) {
  return (
    <h3 className={cn("text-lg font-semibold leading-none tracking-tight text-[#F8FAFC]", className)} {...props} />
  );
}

function CardDescription({ className, ...props }) {
  return (
    <p className={cn("text-sm text-[#94A3B8]", className)} {...props} />
  );
}

function CardContent({ className, ...props }) {
  return (
    <div className={cn("p-6 pt-0", className)} {...props} />
  );
}

function CardFooter({ className, ...props }) {
  return (
    <div className={cn("flex items-center p-6 pt-0 border-t border-[rgba(148,163,184,0.15)]", className)} {...props} />
  );
}

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
