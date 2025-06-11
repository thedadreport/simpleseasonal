interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

const LoadingSpinner = ({ 
  size = 'md',
  color = 'text-sage-green' 
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex justify-center items-center">
      <div 
        className={`${sizeClasses[size]} ${color} animate-spin rounded-full border-4 border-solid border-t-transparent`}
        role="status" 
        aria-label="Loading"
      />
    </div>
  );
};

export default LoadingSpinner;