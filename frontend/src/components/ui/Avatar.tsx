import React from 'react';
import { cn } from '@/lib/utils';

export interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const avatarSizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

export function Avatar({ 
  src, 
  alt, 
  fallback, 
  size = 'md',
  className 
}: AvatarProps) {
  const [imageError, setImageError] = React.useState(false);
  const shouldShowFallback = !src || imageError;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={cn(
      'relative inline-block rounded-full overflow-hidden bg-gray-200 flex items-center justify-center',
      avatarSizes[size],
      className
    )}>
      {shouldShowFallback ? (
        <span className="font-medium text-gray-600">
          {fallback ? getInitials(fallback) : '?'}
        </span>
      ) : (
        <img
          src={src}
          alt={alt || 'Avatar'}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      )}
    </div>
  );
} 