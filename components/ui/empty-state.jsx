import { cn } from '@/lib/utils';
import { Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';

function EmptyState({ icon: Icon = Inbox, title, description, action, onAction, className }) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 px-4 text-center", className)}>
      <div className="mb-4 rounded-full bg-[#111827] p-4">
        <Icon className="h-8 w-8 text-[#94A3B8]" />
      </div>
      <h3 className="mb-1 text-lg font-semibold text-[#F8FAFC]">{title}</h3>
      {description && (
        <p className="mb-6 max-w-sm text-sm text-[#94A3B8]">{description}</p>
      )}
      {action && onAction && (
        <Button onClick={onAction} variant="outline" size="sm">
          {action}
        </Button>
      )}
    </div>
  );
}

export { EmptyState };
