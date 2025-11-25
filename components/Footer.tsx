import React from 'react';

interface FooterProps {
  onNavigate?: (view: 'privacy' | 'terms') => void;
  showLinks?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, showLinks = true }) => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/80 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showLinks && onNavigate && (
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-sm text-slate-400 mb-4">
            <button
              onClick={() => onNavigate('privacy')}
              className="hover:text-justice-400 transition-colors"
            >
              Política de Privacidade
            </button>
            <span className="hidden sm:inline text-slate-700">•</span>
            <button
              onClick={() => onNavigate('terms')}
              className="hover:text-justice-400 transition-colors"
            >
              Termos de Serviço
            </button>
          </div>
        )}
        <div className="text-center space-y-1">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} Segunda Crime de Foz. Todos os direitos reservados.
          </p>
          <p className="text-slate-600 text-xs">
            Criado e desenvolvido por{' '}
            <span className="text-slate-400 font-medium">Alexandre Brotto Rangel da Silva</span> - Técnico
            Judiciário - TJPR
          </p>
        </div>
      </div>
    </footer>
  );
};
