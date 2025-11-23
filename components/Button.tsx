import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading = false, 
  icon,
  className = '',
  disabled,
  ...props 
}) => {
  const baseStyles = "relative flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 overflow-hidden group active:scale-95";
  
  const variants = {
    primary: "bg-gradient-to-r from-justice-600 to-justice-500 hover:from-justice-500 hover:to-justice-400 text-white shadow-lg shadow-justice-900/20 hover:shadow-[0_0_25px_rgba(14,165,233,0.6)] border border-white/10 hover:border-white/20 hover:-translate-y-0.5",
    secondary: "bg-slate-800 hover:bg-slate-700 text-slate-100 focus:ring-slate-500 border border-slate-700 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:border-slate-500",
    outline: "bg-transparent hover:bg-slate-800/50 text-slate-300 border border-slate-600 focus:ring-slate-500 hover:text-justice-400 hover:border-justice-400 hover:shadow-[0_0_15px_rgba(56,189,248,0.3)]",
    ghost: "bg-transparent hover:bg-slate-800/50 text-slate-400 hover:text-slate-200"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {/* Shimmer effect for primary buttons */}
      {variant === 'primary' && !disabled && !isLoading && (
        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent z-10 pointer-events-none" />
      )}
      
      {isLoading && <Loader2 className="animate-spin w-4 h-4 relative z-20" />}
      {!isLoading && icon && <span className="relative z-20">{icon}</span>}
      <span className="relative z-20">{children}</span>
    </button>
  );
};