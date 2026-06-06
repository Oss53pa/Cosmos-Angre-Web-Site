import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
  bordered?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, hoverable = false, bordered = false, className = '', ...props }, ref) => {
    const hoverClass = hoverable ? 'hover:shadow-cosmos-lg hover:scale-[1.02] cursor-pointer' : '';
    const borderClass = bordered ? 'border border-gray-200' : '';

    return (
      <div
        ref={ref}
        className={`card bg-white rounded-2xl shadow-cosmos transition-all duration-300 ${hoverClass} ${borderClass} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, title, subtitle, action, className = '', ...props }, ref) => {
    return (
      <div ref={ref} className={`card-header p-6 border-b border-gray-100 ${className}`} {...props}>
        {title || subtitle ? (
          <div className="flex items-start justify-between">
            <div>
              {title && (
                <h3 className="text-xl font-poppins font-semibold text-cosmos-blue mb-1">
                  {title}
                </h3>
              )}
              {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
            </div>
            {action && <div className="ml-4">{action}</div>}
          </div>
        ) : (
          children
        )}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  noPadding?: boolean;
}

export const CardBody = React.forwardRef<HTMLDivElement, CardBodyProps>(
  ({ children, noPadding = false, className = '', ...props }, ref) => {
    const paddingClass = noPadding ? '' : 'p-6';

    return (
      <div ref={ref} className={`card-body ${paddingClass} ${className}`} {...props}>
        {children}
      </div>
    );
  }
);

CardBody.displayName = 'CardBody';

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`card-footer p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';

export default Card;
