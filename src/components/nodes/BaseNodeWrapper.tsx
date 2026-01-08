import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BaseNodeWrapperProps {
  title: string;
  icon: ReactNode;
  color: 'purple' | 'cyan' | 'pink' | 'green';
  selected?: boolean;
  children: ReactNode;
  isLoading?: boolean;
  error?: string;
}

const colorClasses = {
  purple: {
    border: 'border-neon-purple/50',
    glow: 'glow-purple',
    header: 'bg-neon-purple/10',
    icon: 'text-neon-purple',
  },
  cyan: {
    border: 'border-neon-cyan/50',
    glow: 'glow-cyan',
    header: 'bg-neon-cyan/10',
    icon: 'text-neon-cyan',
  },
  pink: {
    border: 'border-neon-pink/50',
    glow: 'glow-pink',
    header: 'bg-neon-pink/10',
    icon: 'text-neon-pink',
  },
  green: {
    border: 'border-neon-green/50',
    glow: '',
    header: 'bg-neon-green/10',
    icon: 'text-neon-green',
  },
};

export function BaseNodeWrapper({
  title,
  icon,
  color,
  selected,
  children,
  isLoading,
  error,
}: BaseNodeWrapperProps) {
  const colors = colorClasses[color];

  return (
    <div
      className={cn(
        'min-w-[280px] max-w-[320px] rounded-lg border-2 node-gradient shadow-xl transition-all duration-200',
        colors.border,
        selected && colors.glow,
        isLoading && 'animate-pulse-glow'
      )}
    >
      <div className={cn('flex items-center gap-2 px-3 py-2 rounded-t-md border-b border-border/30', colors.header)}>
        <span className={colors.icon}>{icon}</span>
        <span className="font-medium text-sm text-foreground">{title}</span>
        {isLoading && (
          <div className="ml-auto">
            <div className="h-2 w-2 rounded-full bg-neon-cyan animate-pulse" />
          </div>
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
