import React from 'react';
import { useTranslation } from 'react-i18next';
import { type LucideIcon } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'gold' | 'dark' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  isFullWidth?: boolean;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      isFullWidth = false,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      children,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const { t } = useTranslation();

    const baseClasses =
      'btn inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses = {
      primary:
        'bg-cosmos-gold text-cosmos-night hover:bg-cosmos-gold-light hover:shadow-lg focus:ring-cosmos-gold',
      secondary:
        'bg-cosmos-night text-cosmos-cream hover:bg-cosmos-night-light hover:shadow-lg focus:ring-cosmos-night',
      outline:
        'border-2 border-cosmos-gold text-cosmos-gold bg-transparent hover:bg-cosmos-gold hover:text-cosmos-night focus:ring-cosmos-gold',
      gold: 'bg-cosmos-gold-light text-cosmos-night hover:bg-cosmos-gold hover:shadow-lg focus:ring-cosmos-gold',
      dark: 'bg-cosmos-night text-cosmos-cream hover:bg-cosmos-night-light hover:shadow-lg focus:ring-cosmos-night',
      danger: 'bg-red-600 text-white hover:bg-red-700 hover:shadow-lg focus:ring-red-600',
      ghost: 'bg-transparent text-cosmos-night hover:bg-cosmos-cream focus:ring-cosmos-gold',
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
      xl: 'px-10 py-5 text-xl',
    };

    const widthClass = isFullWidth ? 'w-full' : '';

    const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`;

    return (
      <button ref={ref} className={combinedClasses} disabled={disabled || isLoading} {...props}>
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>{t('common.loading')}</span>
          </>
        ) : (
          <>
            {LeftIcon && <LeftIcon className="w-5 h-5" aria-hidden="true" />}
            {children}
            {RightIcon && <RightIcon className="w-5 h-5" aria-hidden="true" />}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
