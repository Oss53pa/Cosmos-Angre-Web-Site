import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  isFullWidth?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { label, error, helperText, isFullWidth = true, className = '', id, rows = 4, ...props },
    ref
  ) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;

    const baseClasses =
      'w-full px-4 py-3 rounded-xl border transition-all duration-200 outline-none resize-none';
    const errorClasses = hasError
      ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:ring-opacity-20'
      : 'border-gray-300 focus:border-cosmos-blue focus:ring-2 focus:ring-cosmos-blue focus:ring-opacity-20';

    const widthClass = isFullWidth ? 'w-full' : '';

    return (
      <div className={widthClass}>
        {label && (
          <label
            htmlFor={textareaId}
            className="label block text-sm font-medium text-gray-700 mb-2"
          >
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={`${baseClasses} ${errorClasses} ${className}`}
          {...props}
        />

        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

        {helperText && !error && <p className="mt-2 text-sm text-gray-500">{helperText}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
