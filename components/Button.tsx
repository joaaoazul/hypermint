import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  isLoading = false,
  size = 'md',
  icon,
  ...props 
}) => {
  const baseStyles = "relative inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden";
  
  const sizeStyles = {
    sm: "text-xs px-3 py-1.5 rounded-lg gap-1.5",
    md: "text-sm px-5 py-2.5 rounded-lg gap-2",
    lg: "text-base px-6 py-3 rounded-xl gap-2.5",
    xl: "text-lg px-8 py-4 rounded-xl gap-3 font-bold",
  };

  const variants = {
    primary: "bg-primary text-black hover:bg-white shadow-[0_0_20px_-5px_rgba(0,240,255,0.4)] hover:shadow-[0_0_25px_-5px_rgba(255,255,255,0.5)] border border-transparent",
    secondary: "bg-surface-highlight text-text-main border border-border hover:border-primary/50 hover:bg-surface hover:text-white",
    outline: "bg-transparent text-primary border border-primary/30 hover:border-primary hover:bg-primary/5",
    ghost: "bg-transparent text-text-muted hover:text-white hover:bg-white/5",
    danger: "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white",
  };

  return (
    <button 
      className={`${baseStyles} ${sizeStyles[size]} ${variants[variant]} ${className}`} 
      disabled={isLoading || props.disabled}
      {...props}
    >
      {/* Shine Effect for Primary */}
      {variant === 'primary' && (
        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />
      )}

      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 h-4 w-4 text-current opacity-70" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="opacity-70">Processing</span>
        </>
      ) : (
        <>
          {icon && <span className="group-hover:scale-110 transition-transform duration-200">{icon}</span>}
          <span className="relative z-0">{children}</span>
        </>
      )}
    </button>
  );
};