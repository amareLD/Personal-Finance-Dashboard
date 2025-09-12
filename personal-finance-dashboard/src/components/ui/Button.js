import { forwardRef } from 'react';

const Button = forwardRef(({ 
  className = '', 
  variant = 'default', 
  size = 'default', 
  children, 
  disabled = false,
  ...props 
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
  
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
    destructive: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600',
    ghost: 'text-gray-700 hover:bg-gray-100 active:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800',
    link: 'text-blue-600 underline-offset-4 hover:underline dark:text-blue-400'
  };

  const sizes = {
    default: 'h-10 px-4 py-2 text-sm',
    sm: 'h-8 px-3 py-1.5 text-xs',
    lg: 'h-12 px-6 py-3 text-base',
    icon: 'h-10 w-10 p-0'
  };

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button
      className={classes}
      ref={ref}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
