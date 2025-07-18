import React from 'react';
import { cn } from '@/lib/utils';

export interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

const progressSizes = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

const progressVariants = {
  default: 'bg-blue-600',
  success: 'bg-green-600',
  warning: 'bg-yellow-600',
  danger: 'bg-red-600',
};

export function Progress({ 
  value, 
  max = 100, 
  className,
  size = 'md',
  variant = 'default'
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn('w-full bg-gray-200 rounded-full overflow-hidden', className)}>
      <div
        className={cn(
          'transition-all duration-300 ease-in-out',
          progressSizes[size],
          progressVariants[variant]
        )}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
} 