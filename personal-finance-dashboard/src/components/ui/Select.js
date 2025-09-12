import { forwardRef } from 'react';

const Select = forwardRef(({ 
  className = '', 
  children,
  error = false,
  ...props 
}, ref) => {
  const baseStyles = 'flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100';
  
  const errorStyles = error ? 'border-red-500 focus:ring-red-500' : '';
  
  const classes = `${baseStyles} ${errorStyles} ${className}`;

  return (
    <select
      className={classes}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = 'Select';

export default Select;
