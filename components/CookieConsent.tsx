import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { X, Cookie } from 'lucide-react';

export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Verificar se o usuário já aceitou os cookies
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      // Mostrar após 1 segundo
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom duration-500">
      <div className="max-w-6xl mx-auto">
        <div className="glass-panel rounded-xl border-2 border-justice-500/30 shadow-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-justice-500/20 rounded-full flex items-center justify-center">
              <Cookie className="text-justice-300" size={24} />
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">
                Este site utiliza cookies
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Utilizamos cookies essenciais para garantir o funcionamento adequado do sistema de autenticação
                e para melhorar sua experiência. Ao continuar navegando, você concorda com nossa{' '}
                <a
                  href="#privacy"
                  className="text-justice-400 hover:text-justice-300 underline"
                  onClick={(e) => {
                    e.preventDefault();
                    // Será implementado com o sistema de rotas
                  }}
                >
                  Política de Privacidade
                </a>
                {' '}e{' '}
                <a
                  href="#terms"
                  className="text-justice-400 hover:text-justice-300 underline"
                  onClick={(e) => {
                    e.preventDefault();
                    // Será implementado com o sistema de rotas
                  }}
                >
                  Termos de Serviço
                </a>.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleAccept}
                  className="bg-justice-600 hover:bg-justice-700"
                >
                  Aceitar Cookies
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleReject}
                >
                  Apenas Essenciais
                </Button>
              </div>
            </div>

            <button
              onClick={handleReject}
              className="flex-shrink-0 p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
              aria-label="Fechar"
            >
              <X size={20} />
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-700">
            <details className="text-sm text-slate-400">
              <summary className="cursor-pointer hover:text-white transition-colors font-medium">
                Tipos de cookies que utilizamos
              </summary>
              <div className="mt-3 space-y-2 pl-4">
                <div>
                  <strong className="text-slate-300">Cookies Essenciais:</strong>
                  <p className="text-xs mt-1">
                    Necessários para autenticação, segurança e funcionamento básico do sistema.
                    Não podem ser desativados.
                  </p>
                </div>
                <div>
                  <strong className="text-slate-300">Cookies de Preferência:</strong>
                  <p className="text-xs mt-1">
                    Armazenam suas configurações e preferências de uso do sistema.
                  </p>
                </div>
                <div>
                  <strong className="text-slate-300">Local Storage:</strong>
                  <p className="text-xs mt-1">
                    Utilizado para armazenar tokens de autenticação do Supabase de forma segura.
                  </p>
                </div>
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
};
