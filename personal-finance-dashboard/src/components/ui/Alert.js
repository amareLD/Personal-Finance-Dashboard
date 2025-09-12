import { X, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';
import Button from './Button';

const alertVariants = {
  default: {
    container: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-200',
    icon: Info
  },
  destructive: {
    container: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-200',
    icon: XCircle
  },
  warning: {
    container: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-200',
    icon: AlertCircle
  },
  success: {
    container: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-200',
    icon: CheckCircle
  }
};

export const Alert = ({ 
  variant = 'default', 
  className = '', 
  children, 
  dismissible = false,
  onDismiss,
  ...props 
}) => {
  const variantStyles = alertVariants[variant];
  const Icon = variantStyles.icon;

  return (
    <div
      className={`relative w-full rounded-lg border p-4 ${variantStyles.container} ${className}`}
      {...props}
    >
      <div className="flex items-start gap-3">
        <Icon className="h-5 w-5 flex-shrink-0" />
        <div className="flex-1">
          {children}
        </div>
        {dismissible && onDismiss && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 p-0 hover:bg-transparent"
            onClick={onDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export const AlertTitle = ({ className = '', children, ...props }) => (
  <h5
    className={`mb-1 font-medium leading-none tracking-tight ${className}`}
    {...props}
  >
    {children}
  </h5>
);

export const AlertDescription = ({ className = '', children, ...props }) => (
  <div
    className={`text-sm opacity-90 ${className}`}
    {...props}
  >
    {children}
  </div>
);
