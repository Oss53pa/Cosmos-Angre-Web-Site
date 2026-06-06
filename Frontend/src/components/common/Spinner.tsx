import React from 'react';

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white' | 'teal' | 'red';
  fullScreen?: boolean;
  label?: string;
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  (
    { size = 'md', color = 'primary', fullScreen = false, label, className = '', ...props },
    ref
  ) => {
    const sizeClasses = {
      sm: 'w-4 h-4 border-2',
      md: 'w-8 h-8 border-4',
      lg: 'w-12 h-12 border-4',
      xl: 'w-16 h-16 border-4',
    };

    const colorClasses = {
      primary: 'border-cosmos-text/20 border-t-cosmos-gold',
      secondary: 'border-cosmos-text/20 border-t-cosmos-accent',
      white: 'border-white border-opacity-30 border-t-white',
      teal: 'border-cosmos-text/20 border-t-cosmos-bronze',
      red: 'border-cosmos-text/20 border-t-cosmos-accent',
    };

    const spinnerElement = (
      <div
        ref={ref}
        className={`spinner inline-block rounded-full animate-spin ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
        role="status"
        aria-label={label || 'Loading'}
        {...props}
      />
    );

    if (fullScreen) {
      return (
        <div className="fixed inset-0 bg-cosmos-night/50 flex items-center justify-center z-50">
          <div className="bg-cosmos-warm rounded-2xl p-8 flex flex-col items-center gap-4">
            {spinnerElement}
            {label && <p className="text-cosmos-text font-medium">{label}</p>}
          </div>
        </div>
      );
    }

    if (label) {
      return (
        <div className="flex flex-col items-center gap-2">
          {spinnerElement}
          <p className="text-cosmos-text/70 text-sm">{label}</p>
        </div>
      );
    }

    return spinnerElement;
  }
);

Spinner.displayName = 'Spinner';

export default Spinner;
