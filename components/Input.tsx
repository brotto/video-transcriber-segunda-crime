import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, error, icon, className = '', ...props }) => {
  return (
    <div className="w-full space-y-1.5">
      <label className="block text-sm font-medium text-slate-300 ml-1">
        {label}
      </label>
      <div className="relative group">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-justice-400 transition-colors">
            {icon}
          </div>
        )}
        <input
          className={`w-full bg-slate-900/50 border border-slate-700 text-slate-100 rounded-lg px-4 py-3 outline-none focus:border-justice-500 focus:ring-1 focus:ring-justice-500 transition-all placeholder:text-slate-600 ${icon ? 'pl-10' : ''} ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-400 ml-1">{error}</p>}
    </div>
  );
};