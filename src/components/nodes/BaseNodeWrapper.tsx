import { ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface BaseNodeWrapperProps {
  title: string;
  icon: ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'quaternary';
  selected?: boolean;
  children: ReactNode;
  isLoading?: boolean;
  error?: string;
  onDelete?: () => void;
}

const variantClasses = {
  primary: {
    border: 'border-node-primary/40',
    header: 'bg-node-primary/5',
    icon: 'text-node-primary',
  },
  secondary: {
    border: 'border-node-secondary/40',
    header: 'bg-node-secondary/5',
    icon: 'text-node-secondary',
  },
  tertiary: {
    border: 'border-node-tertiary/40',
    header: 'bg-node-tertiary/5',
    icon: 'text-node-tertiary',
  },
  quaternary: {
    border: 'border-node-quaternary/40',
    header: 'bg-node-quaternary/5',
    icon: 'text-node-quaternary',
  },
};

export function BaseNodeWrapper({
  title,
  icon,
  variant = 'primary',
  selected,
  children,
  isLoading,
  error,
  onDelete,
}: BaseNodeWrapperProps) {
  const styles = variantClasses[variant];

  return (
    <div
      className={cn(
        'min-w-[280px] max-w-[320px] rounded-lg border node-gradient shadow-lg transition-all duration-200',
        styles.border,
        selected && 'glow-primary ring-1 ring-primary/50'
      )}
    >
      <div className={cn('flex items-center gap-2 px-3 py-2 rounded-t-md border-b border-border/30', styles.header)}>
        <span className={styles.icon}>{icon}</span>
        <span className="font-medium text-sm text-foreground flex-1">{title}</span>
        {isLoading && (
          <div className="h-2 w-2 rounded-full bg-foreground/60 animate-pulse" />
        )}
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      <div className="p-3 space-y-3">
        {children}
        {error && (
          <div className="text-xs text-destructive bg-destructive/10 rounded px-2 py-1">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
