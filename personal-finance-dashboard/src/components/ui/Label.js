export const Label = ({ className = '', children, htmlFor, ...props }) => (
  <label
    htmlFor={htmlFor}
    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-gray-300 ${className}`}
    {...props}
  >
    {children}
  </label>
);
