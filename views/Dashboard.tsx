import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Logo } from '../components/Logo';
import { UserProfile, VideoSubmissionData } from '../types';
import { WEBHOOK_URL } from '../constants';
import {
  UploadCloud,
  FileVideo,
  LogOut,
  User as UserIcon,
  CheckCircle,
  AlertCircle,
  X,
  FileText,
  Gavel,
  Copy,
  ArrowLeft,
  Loader2,
  Clock,
  Mail
} from 'lucide-react';

interface DashboardProps {
  user: UserProfile;
  onNavigate?: (view: 'privacy' | 'terms') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate }) => {
  const [formData, setFormData] = useState<Omit<VideoSubmissionData, 'videoFile'>>({
    personName: '',
    lawsuitNumber: ''
  });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estados para processamento
  const [isWaiting, setIsWaiting] = useState(false);
  const [transcription, setTranscription] = useState<string>('');
  const [processingStatus, setProcessingStatus] = useState<'waiting' | 'completed' | 'error' | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [sessionId, setSessionId] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Limpar polling quando componente desmonta
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('video/')) {
        setVideoFile(file);
        setErrorMessage('');
      } else {
        alert('Por favor, envie apenas arquivos de vídeo.');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('video/')) {
        setVideoFile(file);
        setErrorMessage('');
      } else {
        alert('Por favor, envie apenas arquivos de vídeo.');
      }
    }
  };

  // Gerar sessionId único
  const generateSessionId = () => {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  };

  // Polling para verificar status da transcrição
  const startPolling = (sid: string) => {
    // Limpar qualquer polling anterior
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    console.log('[Polling] Iniciando para sessionId:', sid);

    // Verificar a cada 3 segundos
    pollingIntervalRef.current = setInterval(async () => {
      try {
        const response = await fetch(`/api/transcription-status?sessionId=${sid}`);
        const data = await response.json();

        console.log('[Polling] Status:', data);

        if (response.status === 404) {
          // Sessão não encontrada ou expirada - continuar aguardando
          return;
        }

        if (data.success && data.status) {
          setProcessingStatus(data.status);

          if (data.status === 'completed') {
            // Transcrição concluída
            setTranscription(data.transcription || '');
            setIsWaiting(false);

            // Parar polling
            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current);
              pollingIntervalRef.current = null;
            }

            console.log('[Polling] Transcrição recebida, parando polling');
          } else if (data.status === 'error') {
            // Erro no processamento
            setErrorMessage(data.errorMessage || 'Erro desconhecido no processamento');
            setIsWaiting(false);

            // Parar polling
            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current);
              pollingIntervalRef.current = null;
            }

            console.log('[Polling] Erro detectado, parando polling');
          }
        }
      } catch (err) {
        console.error('[Polling] Erro:', err);
      }
    }, 3000); // 3 segundos
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile || !formData.personName || !formData.lawsuitNumber) {
        alert("Preencha todos os campos.");
        return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setTranscription('');
    setProcessingStatus(null);

    try {
      // Gerar sessionId único
      const sid = generateSessionId();
      setSessionId(sid);

      console.log('[Submit] SessionId gerado:', sid);

      // Enviar para o webhook n8n
      const payload = new FormData();
      payload.append('sessionId', sid);
      payload.append('personName', formData.personName);
      payload.append('lawsuitNumber', formData.lawsuitNumber);
      payload.append('submittedByEmail', user.email);
      payload.append('submittedById', user.id);
      payload.append('video', videoFile);

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: payload,
      });

      if (!response.ok) {
        throw new Error(`Erro no servidor: ${response.status}`);
      }

      const result = await response.json();
      console.log('[Submit] Resposta do webhook:', result);

      // Entrar em modo de espera
      setIsWaiting(true);
      setProcessingStatus('waiting');

      // Iniciar polling para verificar status
      startPolling(sid);

    } catch (error: any) {
      console.error('[Submit] Erro:', error);
      setErrorMessage(error.message || 'Erro ao enviar o vídeo');
      setIsSubmitting(false);
    } finally {
      // Manter isSubmitting true enquanto aguarda resposta
      setIsSubmitting(false);
    }
  };

  const handleCopyTranscription = async () => {
    if (!transcription) return;

    try {
      await navigator.clipboard.writeText(transcription);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  const handleBackToDashboard = () => {
    setFormData({ personName: '', lawsuitNumber: '' });
    setVideoFile(null);
    setTranscription('');
    setProcessingStatus(null);
    setErrorMessage('');
    setIsWaiting(false);
    setSessionId('');
    if (fileInputRef.current) fileInputRef.current.value = '';

    // Limpar polling
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  // Renderizar status de processamento
  const renderProcessingStatus = () => {
    if (!isWaiting && !processingStatus) return null;

    if (processingStatus === 'waiting') {
      return (
        <div className="mb-6 p-6 bg-blue-500/10 border border-blue-500/20 rounded-lg animate-fadeIn">
          <div className="flex items-center gap-4 mb-4">
            <Loader2 className="animate-spin text-blue-400" size={32} />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-blue-300 mb-1">
                Processando Transcrição...
              </h3>
              <p className="text-blue-200/80 text-sm">
                Aguarde enquanto processamos seu vídeo. Isso pode levar alguns minutos.
              </p>
            </div>
          </div>

          <div className="space-y-3 pl-12">
            <div className="flex items-center gap-3 text-blue-200/70 text-sm">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span>Vídeo recebido pelo servidor</span>
            </div>
            <div className="flex items-center gap-3 text-blue-200/70 text-sm">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-75"></div>
              <span>Extraindo áudio do vídeo</span>
            </div>
            <div className="flex items-center gap-3 text-blue-200/70 text-sm">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-150"></div>
              <span>Transcrevendo fala em texto</span>
            </div>
            <div className="flex items-center gap-3 text-blue-200/70 text-sm">
              <Mail size={16} className="text-blue-400" />
              <span>Uma cópia será enviada para: <strong>{user.email}</strong></span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-blue-500/20 text-xs text-blue-300/60 text-center">
            Não feche esta página. O resultado aparecerá aqui automaticamente.
          </div>
        </div>
      );
    }

    if (processingStatus === 'error') {
      return (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-300 animate-fadeIn">
          <AlertCircle size={20} />
          <div className="flex-1">
            <p className="font-semibold">Erro no processamento</p>
            {errorMessage && (
              <p className="text-sm opacity-80 mt-1">{errorMessage}</p>
            )}
          </div>
          <button onClick={() => setProcessingStatus(null)} className="ml-auto hover:bg-red-500/20 p-1 rounded">
            <X size={16} />
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Top Navigation */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Logo size="sm" />

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 bg-slate-900 py-1.5 px-3 rounded-full border border-slate-800">
              <div className="w-8 h-8 rounded-full bg-justice-900 flex items-center justify-center text-justice-200 border border-justice-700">
                <UserIcon size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-200">{user.name || user.email.split('@')[0]}</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-wide">Usuário Autorizado</span>
              </div>
            </div>

            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="text-red-400 hover:text-red-300 hover:bg-red-950/30"
              icon={<LogOut size={18} />}
            >
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column: Context/Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <Gavel size={20} className="text-justice-400" />
                Nova Transcrição
              </h3>
              <p className="text-slate-400 text-sm mb-4">
                Envie o vídeo da audiência ou depoimento para iniciar o processo de transcrição automática.
              </p>
              <div className="p-4 bg-blue-900/20 border border-blue-800/50 rounded-lg">
                <h4 className="text-blue-200 text-xs font-bold uppercase mb-2">Instruções</h4>
                <ul className="text-blue-300/80 text-xs space-y-2 list-disc pl-4">
                  <li>Certifique-se que o áudio está claro.</li>
                  <li>Formatos aceitos: MP4, MOV, AVI.</li>
                  <li>Tamanho máximo sugerido: 500MB.</li>
                  <li>Aguarde na tela - o resultado aparecerá automaticamente.</li>
                  <li>Uma cópia será enviada para seu email.</li>
                </ul>
              </div>

              <div className="mt-4 p-3 bg-amber-900/20 border border-amber-800/50 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle size={16} className="text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-300/90">
                    <strong className="block mb-1">Privacidade</strong>
                    As transcrições não são armazenadas em nossos servidores. Elas são enviadas diretamente para seu email.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Upload Form or Result */}
          <div className="lg:col-span-2">
            <div className="glass-panel rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
               {/* Background decoration */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-justice-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

              <h2 className="text-2xl font-bold text-white mb-8 relative z-10">Dados do Processo</h2>

              {/* Status de processamento */}
              {renderProcessingStatus()}

              {/* Formulário - esconde quando está aguardando ou concluído */}
              {!isWaiting && processingStatus !== 'completed' && (
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Nome do Envolvido"
                      placeholder="Ex: João da Silva"
                      icon={<UserIcon size={18} />}
                      value={formData.personName}
                      onChange={(e) => setFormData({...formData, personName: e.target.value})}
                      required
                      disabled={isSubmitting}
                    />
                    <Input
                      label="Número do Processo"
                      placeholder="0000000-00-0000.0.00.0000"
                      icon={<FileText size={18} />}
                      value={formData.lawsuitNumber}
                      onChange={(e) => setFormData({...formData, lawsuitNumber: e.target.value})}
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-300 ml-1">
                      Arquivo de Vídeo
                    </label>

                    <div
                      className={`
                        border-2 border-dashed rounded-xl p-8 transition-all duration-300 cursor-pointer
                        flex flex-col items-center justify-center text-center
                        ${isDragOver
                          ? 'border-justice-400 bg-justice-400/10 scale-[1.01]'
                          : videoFile
                            ? 'border-emerald-500/50 bg-emerald-500/5'
                            : 'border-slate-700 hover:border-slate-600 hover:bg-slate-900/50 bg-slate-900/30'}
                        ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => !isSubmitting && fileInputRef.current?.click()}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="video/*"
                        onChange={handleFileChange}
                        disabled={isSubmitting}
                      />

                      {videoFile ? (
                        <div className="animate-in fade-in zoom-in duration-300">
                          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-400">
                            <FileVideo size={32} />
                          </div>
                          <p className="text-emerald-300 font-medium text-lg">{videoFile.name}</p>
                          <p className="text-slate-500 text-sm mt-1">
                            {(videoFile.size / (1024 * 1024)).toFixed(2)} MB prontos para envio
                          </p>
                          {!isSubmitting && (
                            <p className="text-slate-500 text-xs mt-4 hover:text-red-400 transition-colors" onClick={(e) => {
                              e.stopPropagation();
                              setVideoFile(null);
                            }}>
                              Remover arquivo
                            </p>
                          )}
                        </div>
                      ) : (
                        <>
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors ${isDragOver ? 'bg-justice-500/20 text-justice-300' : 'bg-slate-800 text-slate-400'}`}>
                            <UploadCloud size={32} />
                          </div>
                          <p className="text-slate-200 font-medium text-lg">
                            Clique para selecionar ou arraste aqui
                          </p>
                          <p className="text-slate-500 text-sm mt-2 max-w-sm">
                            Suporta MP4, AVI, MOV. Tamanho máximo recomendado de 500MB.
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button
                      type="submit"
                      className="w-full md:w-auto min-w-[200px]"
                      isLoading={isSubmitting}
                      disabled={!videoFile || isSubmitting}
                    >
                      {isSubmitting ? 'Enviando...' : 'Enviar para Processamento'}
                    </Button>
                  </div>
                </form>
              )}

              {/* Transcrição Completa */}
              {processingStatus === 'completed' && transcription && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <CheckCircle className="text-emerald-400" size={24} />
                      Transcrição Concluída
                    </h3>
                    <Button
                      variant="ghost"
                      onClick={handleBackToDashboard}
                      icon={<ArrowLeft size={18} />}
                      className="text-slate-400 hover:text-white"
                    >
                      Nova Transcrição
                    </Button>
                  </div>

                  <div className="bg-emerald-900/20 border border-emerald-700/50 rounded-lg p-4 text-sm text-emerald-200">
                    <Mail size={16} className="inline mr-2" />
                    Uma cópia desta transcrição foi enviada para: <strong>{user.email}</strong>
                  </div>

                  <div className="relative">
                    <div className="bg-slate-900/70 border border-slate-700 rounded-xl p-6 max-h-96 overflow-y-auto">
                      <pre className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap font-mono">
                        {transcription}
                      </pre>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <Button
                        onClick={handleCopyTranscription}
                        icon={copySuccess ? <CheckCircle size={18} /> : <Copy size={18} />}
                        className={copySuccess ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                      >
                        {copySuccess ? 'Copiado!' : 'Copiar Transcrição'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/80 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-400">
            <div className="flex gap-6">
              <button
                onClick={() => onNavigate?.('privacy')}
                className="hover:text-justice-400 transition-colors"
              >
                Política de Privacidade
              </button>
              <button
                onClick={() => onNavigate?.('terms')}
                className="hover:text-justice-400 transition-colors"
              >
                Termos de Serviço
              </button>
            </div>
          </div>
          <div className="text-center mt-4 space-y-1">
            <p className="text-slate-500 text-sm">
              &copy; {new Date().getFullYear()} Segunda Crime de Foz. Todos os direitos reservados.
            </p>
            <p className="text-slate-600 text-xs">
              Criado e desenvolvido por <span className="text-slate-400 font-medium">Alexandre Brotto Rangel da Silva</span> - Técnico Judiciário - TJPR
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
