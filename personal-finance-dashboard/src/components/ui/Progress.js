export const Progress = ({ value = 0, max = 100, className = '', indicatorClassName = '' }) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  return (
    <div 
      className={`relative h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700 ${className}`}
    >
      <div
        className={`h-full bg-blue-600 transition-all duration-300 ease-in-out ${indicatorClassName}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};
