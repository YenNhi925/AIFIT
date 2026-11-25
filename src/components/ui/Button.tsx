import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { Loader2, ArrowRight } from 'lucide-react';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  withArrow?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  withArrow = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'relative inline-flex items-center justify-center font-display font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 rounded-lg gap-1.5',
    md: 'text-sm px-5 py-2.5 rounded-xl gap-2',
    lg: 'text-base px-7 py-3.5 rounded-2xl gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-gold hover:bg-gold-hover text-white shadow-md shadow-gold/20 focus:ring-gold border border-gold-light/30 active:scale-[0.98]',
    secondary:
      'bg-white hover:bg-cream border border-cream-border text-text-primary shadow-sm hover:border-gold/50 focus:ring-gold active:scale-[0.98]',
    danger:
      'bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20 focus:ring-red-500 active:scale-[0.98]',
    ghost:
      'bg-transparent hover:bg-cream/60 text-text-secondary hover:text-text-primary focus:ring-gold',
  };

  return (
    <motion.button
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-current" />
          <span>Đang xử lý...</span>
        </>
      ) : (
        <>
          <span>{children}</span>
          {withArrow && (
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          )}
        </>
      )}
    </motion.button>
  );
};
