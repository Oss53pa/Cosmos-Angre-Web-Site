import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: React.ReactNode;
  icon?: boolean;
  closable?: boolean;
  onClose?: () => void;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      variant = 'info',
      title,
      children,
      icon = true,
      closable = false,
      onClose,
      className = '',
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = React.useState(true);

    const handleClose = () => {
      setIsVisible(false);
      onClose?.();
    };

    if (!isVisible) return null;

    const variantConfig = {
      info: {
        containerClass: 'bg-blue-50 border-blue-200 text-blue-800',
        iconClass: 'text-blue-500',
        Icon: Info,
      },
      success: {
        containerClass: 'bg-green-50 border-green-200 text-green-800',
        iconClass: 'text-green-500',
        Icon: CheckCircle,
      },
      warning: {
        containerClass: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        iconClass: 'text-yellow-500',
        Icon: AlertCircle,
      },
      error: {
        containerClass: 'bg-red-50 border-red-200 text-red-800',
        iconClass: 'text-red-500',
        Icon: XCircle,
      },
    };

    const config = variantConfig[variant];
    const IconComponent = config.Icon;

    return (
      <div
        ref={ref}
        className={`alert p-4 rounded-xl border ${config.containerClass} ${className}`}
        role="alert"
        {...props}
      >
        <div className="flex items-start gap-3">
          {icon && <IconComponent className={`w-5 h-5 flex-shrink-0 ${config.iconClass}`} />}

          <div className="flex-1">
            {title && <h4 className="font-semibold mb-1">{title}</h4>}
            <div className="text-sm">{children}</div>
          </div>

          {closable && (
            <button
              onClick={handleClose}
              className="flex-shrink-0 hover:opacity-70 transition-opacity"
              aria-label="Close alert"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    );
  }
);

Alert.displayName = 'Alert';

export default Alert;
