export const Card = ({ className = '', ...props }) => (
  <div
    className={`rounded-xl border bg-white shadow-sm dark:bg-slate-900 dark:border-slate-800 ${className}`}
    {...props}
  />
);

export const CardHeader = ({ className = '', ...props }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props} />
);

export const CardTitle = ({ className = '', ...props }) => (
  <h3
    className={`text-2xl font-semibold leading-none tracking-tight text-gray-900 dark:text-gray-100 ${className}`}
    {...props}
  />
);

export const CardDescription = ({ className = '', ...props }) => (
  <p
    className={`text-sm text-gray-600 dark:text-gray-400 ${className}`}
    {...props}
  />
);

export const CardContent = ({ className = '', ...props }) => (
  <div className={`p-6 pt-0 ${className}`} {...props} />
);

export const CardFooter = ({ className = '', ...props }) => (
  <div className={`flex items-center p-6 pt-0 ${className}`} {...props} />
);
