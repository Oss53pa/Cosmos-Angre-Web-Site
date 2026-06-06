import React from 'react';
import { type LucideIcon } from 'lucide-react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'gold' | 'night' | 'cream';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  children: React.ReactNode;
  removable?: boolean;
  onRemove?: () => void;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      icon: Icon,
      children,
      removable = false,
      onRemove,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseClasses = 'badge inline-flex items-center gap-1.5 font-medium rounded-full';

    const variantClasses = {
      primary: 'bg-cosmos-night text-cosmos-cream',
      success: 'bg-green-600 text-white',
      warning: 'bg-cosmos-gold text-cosmos-night',
      danger: 'bg-red-600 text-white',
      info: 'bg-cosmos-night-light text-cosmos-cream',
      gold: 'bg-cosmos-gold-light text-cosmos-night',
      night: 'bg-cosmos-night text-cosmos-gold',
      cream: 'bg-cosmos-cream text-cosmos-night',
    };

    const sizeClasses = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-3 py-1 text-sm',
      lg: 'px-4 py-1.5 text-base',
    };

    const iconSizeClasses = {
      sm: 'w-3 h-3',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
    };

    return (
      <span
        ref={ref}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        {...props}
      >
        {Icon && <Icon className={iconSizeClasses[size]} aria-hidden="true" />}
        {children}
        {removable && onRemove && (
          <button
            onClick={onRemove}
            className="ml-1 hover:bg-black hover:bg-opacity-10 rounded-full p-0.5 transition-colors"
            aria-label="Remove"
          >
            <svg
              className={iconSizeClasses[size]}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
