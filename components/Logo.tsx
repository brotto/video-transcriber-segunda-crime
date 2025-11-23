import React from 'react';
import { Scale, Activity } from 'lucide-react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const iconSize = size === 'sm' ? 24 : size === 'md' ? 32 : 48;
  const textSize = size === 'sm' ? 'text-lg' : size === 'md' ? 'text-2xl' : 'text-4xl';
  const subTextSize = size === 'sm' ? 'text-[10px]' : size === 'md' ? 'text-xs' : 'text-sm';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 bg-justice-500 blur-lg opacity-20 rounded-full"></div>
        <div className="relative bg-gradient-to-br from-justice-500 to-justice-700 p-2 rounded-xl shadow-lg border border-justice-400/30">
          <Scale size={iconSize} className="text-white" strokeWidth={1.5} />
          <div className="absolute -bottom-1 -right-1 bg-slate-900 rounded-full p-0.5 border border-justice-500">
             <Activity size={iconSize / 2} className="text-justice-400" />
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <span className={`font-bold tracking-tight text-slate-100 ${textSize}`}>
          Video<span className="text-justice-400">Transcriber</span>
        </span>
        <span className={`${subTextSize} text-slate-400 uppercase tracking-widest font-medium`}>
          Segunda Crime de Foz
        </span>
      </div>
    </div>
  );
};