import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Logo } from '../components/Logo';
import { Mail, Lock, User, Chrome, ArrowRight, AlertCircle } from 'lucide-react';
import { ViewState } from '../types';

interface AuthProps {
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
}

export const Auth: React.FC<AuthProps> = ({ currentView, onViewChange }) => {
  const isRegister = currentView === 'register';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isRegister) {
        // Sign Up Logic
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: fullName,
            },
          },
        });

        if (signUpError) throw signUpError;
        
        // Insert into custom users table if needed (Supabase triggers usually handle this, but doing it manually for safety based on requirements)
        if (data.user) {
           const { error: dbError } = await supabase
            .from('users')
            .insert([{ id: data.user.id, email: data.user.email, name: fullName }]);
            
           if (dbError) console.error("DB Insert warning:", dbError); // Don't block auth flow on DB insert fail
        }

        alert('Cadastro realizado! Por favor verifique seu email ou faça login.');
        onViewChange('login');
      } else {
        // Sign In Logic
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;
        // Auth state change is listened to in App.tsx
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro inesperado.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Erro ao conectar com Google.');
    }
  };

  return (
    <div className="min-h-screen w-full flex">
      {/* Left Panel - Visuals */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/90 to-justice-900/40"></div>
        
        <div className="relative z-10 max-w-lg px-12">
          <Logo size="lg" className="mb-8" />
          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
            Tecnologia de ponta a serviço da <span className="text-transparent bg-clip-text bg-gradient-to-r from-justice-300 to-justice-500">Justiça</span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            Agilize o processamento de vídeos judiciais com nossa plataforma segura e intuitiva. 
            Transcrição automatizada e gestão eficiente de evidências.
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-slate-950 p-6 sm:p-12 relative">
        <div className="w-full max-w-md space-y-8 glass-panel p-8 rounded-2xl shadow-2xl shadow-black/50">
          
          <div className="lg:hidden mb-8 flex justify-center">
            <Logo size="md" />
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-2">
              {isRegister ? 'Criar Conta' : 'Bem-vindo de volta'}
            </h1>
            <p className="text-slate-400 text-sm">
              {isRegister 
                ? 'Preencha seus dados para começar.' 
                : 'Insira suas credenciais para acessar o painel.'}
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-start gap-3 text-red-200 text-sm">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-5">
            {isRegister && (
              <Input 
                label="Nome Completo" 
                placeholder="Seu nome" 
                icon={<User size={18} />}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            )}
            
            <Input 
              label="Email Institucional" 
              type="email" 
              placeholder="exemplo@jus.br" 
              icon={<Mail size={18} />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <Input 
              label="Senha" 
              type="password" 
              placeholder="••••••••" 
              icon={<Lock size={18} />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button 
              type="submit" 
              className="w-full" 
              isLoading={loading}
              icon={!loading && <ArrowRight size={18} />}
            >
              {isRegister ? 'Cadastrar' : 'Entrar'}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-950 px-2 text-slate-500">Ou continue com</span>
            </div>
          </div>

          <Button
            variant="secondary"
            className="w-full"
            onClick={handleGoogleLogin}
            icon={<Chrome size={18} />}
          >
            Google
          </Button>

          <div className="text-center text-sm text-slate-400 mt-6">
            {isRegister ? 'Já tem uma conta?' : 'Não tem uma conta?'}
            <button 
              onClick={() => onViewChange(isRegister ? 'login' : 'register')}
              className="ml-2 text-justice-400 hover:text-justice-300 font-medium transition-colors"
            >
              {isRegister ? 'Fazer Login' : 'Cadastre-se'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};