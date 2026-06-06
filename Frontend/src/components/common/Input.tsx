import React from 'react';
import { type LucideIcon } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  isFullWidth?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      isFullWidth = true,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;

    const baseClasses =
      'input w-full px-4 py-3 rounded-xl border transition-all duration-200 outline-none';
    const errorClasses = hasError
      ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:ring-opacity-20'
      : 'border-cosmos-text/20 focus:border-cosmos-gold focus:ring-2 focus:ring-cosmos-gold focus:ring-opacity-20';

    const iconPaddingLeft = LeftIcon ? 'pl-12' : '';
    const iconPaddingRight = RightIcon ? 'pr-12' : '';
    const widthClass = isFullWidth ? 'w-full' : '';

    return (
      <div className={widthClass}>
        {label && (
          <label
            htmlFor={inputId}
            className="label block text-sm font-medium text-cosmos-text mb-2"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {LeftIcon && (
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <LeftIcon className="w-5 h-5 text-cosmos-text/50" />
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={`${baseClasses} ${errorClasses} ${iconPaddingLeft} ${iconPaddingRight} ${className}`}
            {...props}
          />

          {RightIcon && (
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <RightIcon className="w-5 h-5 text-cosmos-text/50" />
            </div>
          )}
        </div>

        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

        {helperText && !error && <p className="mt-2 text-sm text-cosmos-text/60">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
