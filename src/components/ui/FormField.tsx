import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  isPassword?: boolean;
}

export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, helperText, isPassword = false, type = 'text', className = '', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="w-full space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary">
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            type={inputType}
            className={`w-full px-4 py-3 rounded-xl border bg-white/80 backdrop-blur-sm text-text-primary text-sm transition-all outline-none focus:ring-2 ${
              error
                ? 'border-red-500 focus:ring-red-200 focus:border-red-600'
                : 'border-cream-border hover:border-gold/50 focus:border-gold focus:ring-gold/20'
            } ${isPassword ? 'pr-11' : ''} ${className}`}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-md transition-colors"
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}
        </div>

        {error && <p className="text-xs font-medium text-red-600">{error}</p>}
        {!error && helperText && <p className="text-xs text-text-secondary">{helperText}</p>}
      </div>
    );
  }
);

FormField.displayName = 'FormField';
