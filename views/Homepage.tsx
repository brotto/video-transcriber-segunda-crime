import React from 'react';
import { Logo } from '../components/Logo';
import { Button } from '../components/Button';
import { FileVideo, Shield, Zap, Clock, CheckCircle, ArrowRight, Lock, Scale } from 'lucide-react';

interface HomepageProps {
  onNavigate: (view: 'login' | 'register' | 'privacy' | 'terms') => void;
}

export const Homepage: React.FC<HomepageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Logo size="sm" />
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => onNavigate('login')}
              className="text-slate-300 hover:text-white"
            >
              Entrar
            </Button>
            <Button
              onClick={() => onNavigate('register')}
              icon={<ArrowRight size={18} />}
            >
              Começar Agora
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-justice-900/20 via-slate-950 to-slate-950"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-5"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 leading-tight">
              Transcrição Automática de
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-justice-300 to-justice-500">
                Vídeos Judiciais
              </span>
            </h1>
            <div className="text-left text-lg text-slate-400 mb-8 max-w-3xl mx-auto leading-relaxed space-y-3">
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-justice-400 shrink-0 mt-1" size={20} />
                  <span>Transcrições de vídeos em qualquer formato (de mp4 a webm).</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-justice-400 shrink-0 mt-1" size={20} />
                  <span>Sem registro em banco de dados, tanto dos vídeos quanto das transcrições, preservando completamente a privacidade e sigilo.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-justice-400 shrink-0 mt-1" size={20} />
                  <span>Totalmente gratuita.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-justice-400 shrink-0 mt-1" size={20} />
                  <span>Uso destinado aos servidores e assessores dos Tribunais de Justiça.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-justice-400 shrink-0 mt-1" size={20} />
                  <span>Tecnologia de processamento via Whisper (OpenAI), em servidor privado.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-justice-400 shrink-0 mt-1" size={20} />
                  <span>Em BREVE incluiremos mais ferramentas para uso dos servidores do Poder Judiciário.</span>
                </li>
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => onNavigate('register')}
                icon={<ArrowRight size={20} />}
                className="text-lg px-8 py-4"
              >
                Criar Conta Gratuita
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => onNavigate('login')}
                className="text-lg px-8 py-4"
              >
                Já Tenho Conta
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Funcionalidades Principais
            </h2>
            <p className="text-slate-400 text-lg">
              Tudo que você precisa para gerenciar transcrições de vídeos judiciais
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass-panel rounded-xl p-8 hover:border-justice-500/50 transition-all duration-300">
              <div className="w-14 h-14 bg-justice-500/20 rounded-lg flex items-center justify-center mb-6">
                <FileVideo className="text-justice-400" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Upload de Vídeos Ilimitado
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Faça upload de vídeos de qualquer tamanho e formato. MP4, AVI, MOV e outros formatos suportados.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-panel rounded-xl p-8 hover:border-justice-500/50 transition-all duration-300">
              <div className="w-14 h-14 bg-justice-500/20 rounded-lg flex items-center justify-center mb-6">
                <Zap className="text-justice-400" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Processamento Rápido
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Tecnologia de ponta para transcrição automatizada com alta precisão e velocidade.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-panel rounded-xl p-8 hover:border-justice-500/50 transition-all duration-300">
              <div className="w-14 h-14 bg-justice-500/20 rounded-lg flex items-center justify-center mb-6">
                <Shield className="text-justice-400" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Segurança Total
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Seus dados são protegidos com criptografia SSL/TLS e armazenamento seguro em conformidade com a LGPD.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="glass-panel rounded-xl p-8 hover:border-justice-500/50 transition-all duration-300">
              <div className="w-14 h-14 bg-justice-500/20 rounded-lg flex items-center justify-center mb-6">
                <Scale className="text-justice-400" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Organização por Processo
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Gerencie transcrições por número de processo e nome das partes envolvidas.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="glass-panel rounded-xl p-8 hover:border-justice-500/50 transition-all duration-300">
              <div className="w-14 h-14 bg-justice-500/20 rounded-lg flex items-center justify-center mb-6">
                <Clock className="text-justice-400" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Economia de Tempo
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Reduza horas de trabalho manual. Obtenha transcrições completas em minutos.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="glass-panel rounded-xl p-8 hover:border-justice-500/50 transition-all duration-300">
              <div className="w-14 h-14 bg-justice-500/20 rounded-lg flex items-center justify-center mb-6">
                <Lock className="text-justice-400" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Acesso Controlado
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Autenticação segura com email/senha ou Google. Apenas usuários autorizados têm acesso.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Como Funciona
            </h2>
            <p className="text-slate-400 text-lg">
              Processo simples em 3 etapas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-justice-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Faça Upload do Vídeo
              </h3>
              <p className="text-slate-400">
                Selecione o arquivo de vídeo da audiência ou depoimento e preencha os dados do processo.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-justice-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Processamento Automático
              </h3>
              <p className="text-slate-400">
                Nossa tecnologia processa o vídeo e gera a transcrição automaticamente.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-justice-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Obtenha a Transcrição
              </h3>
              <p className="text-slate-400">
                Visualize, copie e utilize a transcrição completa do vídeo em seu processo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Casos de Uso
            </h2>
            <p className="text-slate-400 text-lg">
              Desenvolvido especificamente para profissionais da área jurídica
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="flex items-start gap-4 p-6 bg-slate-900/50 rounded-xl border border-slate-800">
              <CheckCircle className="text-justice-400 flex-shrink-0 mt-1" size={24} />
              <div>
                <h4 className="text-white font-semibold mb-2">Audiências Judiciais</h4>
                <p className="text-slate-400 text-sm">
                  Transcreva audiências completas com precisão para anexar aos autos.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-slate-900/50 rounded-xl border border-slate-800">
              <CheckCircle className="text-justice-400 flex-shrink-0 mt-1" size={24} />
              <div>
                <h4 className="text-white font-semibold mb-2">Depoimentos de Testemunhas</h4>
                <p className="text-slate-400 text-sm">
                  Registre depoimentos importantes com transcrição fiel.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-slate-900/50 rounded-xl border border-slate-800">
              <CheckCircle className="text-justice-400 flex-shrink-0 mt-1" size={24} />
              <div>
                <h4 className="text-white font-semibold mb-2">Interrogatórios</h4>
                <p className="text-slate-400 text-sm">
                  Documente interrogatórios com exatidão para análise posterior.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-slate-900/50 rounded-xl border border-slate-800">
              <CheckCircle className="text-justice-400 flex-shrink-0 mt-1" size={24} />
              <div>
                <h4 className="text-white font-semibold mb-2">Oitivas</h4>
                <p className="text-slate-400 text-sm">
                  Mantenha registro preciso de todas as oitivas realizadas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy & Security */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-panel rounded-2xl p-12 text-center">
            <Shield className="text-justice-400 mx-auto mb-6" size={64} />
            <h2 className="text-3xl font-bold text-white mb-4">
              Privacidade e Segurança em Primeiro Lugar
            </h2>
            <p className="text-slate-400 text-lg mb-8 max-w-3xl mx-auto">
              Entendemos a sensibilidade dos dados judiciais. Todos os vídeos e transcrições são processados
              com máxima segurança, em conformidade com a Lei Geral de Proteção de Dados (LGPD).
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="ghost"
                onClick={() => onNavigate('privacy')}
                className="text-justice-400 hover:text-justice-300"
              >
                Ver Política de Privacidade
              </Button>
              <Button
                variant="ghost"
                onClick={() => onNavigate('terms')}
                className="text-justice-400 hover:text-justice-300"
              >
                Ver Termos de Serviço
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-justice-900/20 to-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Pronto para Começar?
          </h2>
          <p className="text-xl text-slate-400 mb-8">
            Crie sua conta gratuitamente e comece a transcrever vídeos judiciais hoje mesmo.
          </p>
          <Button
            size="lg"
            onClick={() => onNavigate('register')}
            icon={<ArrowRight size={20} />}
            className="text-lg px-8 py-4"
          >
            Criar Conta Agora
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <Logo size="sm" className="mb-4" />
              <p className="text-slate-400 text-sm">
                Plataforma de transcrição de vídeos desenvolvida para a Segunda Crime de Foz do Iguaçu.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Links Úteis</h4>
              <div className="space-y-2">
                <button
                  onClick={() => onNavigate('privacy')}
                  className="block text-slate-400 hover:text-justice-400 text-sm transition-colors"
                >
                  Política de Privacidade
                </button>
                <button
                  onClick={() => onNavigate('terms')}
                  className="block text-slate-400 hover:text-justice-400 text-sm transition-colors"
                >
                  Termos de Serviço
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Sobre</h4>
              <p className="text-slate-400 text-sm mb-2">
                Segunda Crime de Foz do Iguaçu
              </p>
              <p className="text-slate-400 text-sm">
                Foz do Iguaçu - PR
              </p>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 text-center space-y-2">
            <p className="text-slate-500 text-sm">
              &copy; {new Date().getFullYear()} Video Transcriber - Segunda Crime de Foz. Todos os direitos reservados.
            </p>
            <p className="text-slate-600 text-xs">
              Desenvolvido por <span className="text-slate-400 font-medium">Alexandre Brotto Rangel da Silva</span> - Técnico Judiciário - TJPR
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
