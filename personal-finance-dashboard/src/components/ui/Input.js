import { forwardRef } from 'react';

const Input = forwardRef(({ 
  className = '', 
  type = 'text',
  error = false,
  ...props 
}, ref) => {
  const baseStyles = 'flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-400';
  
  const errorStyles = error ? 'border-red-500 focus:ring-red-500' : '';
  
  const classes = `${baseStyles} ${errorStyles} ${className}`;

  return (
    <input
      type={type}
      className={classes}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export default Input;
