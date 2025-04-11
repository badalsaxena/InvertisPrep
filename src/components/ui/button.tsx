import React from 'react';

type ButtonProps = {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
};

const variantStyles = {
  default: 'bg-indigo-600 text-white hover:bg-indigo-500',
  outline: 'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
  ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
};

const sizeStyles = {
  default: 'h-10 px-4 py-2',
  sm: 'h-8 px-3 py-1 text-sm',
  lg: 'h-12 px-6 py-3 text-lg',
};

export function Button({
  children,
  variant = 'default',
  size = 'default',
  className = '',
  onClick,
  type = 'button',
  disabled = false,
  ...props
}: ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-md font-medium transition-colors 
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 
        focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50
        ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
