import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Logo } from '../components/Logo';
import { UserProfile, VideoSubmissionData, Transcription, TranscriptionStatus } from '../types';
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
  Clock
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

  // Estados para processamento assíncrono
  const [currentTranscription, setCurrentTranscription] = useState<Transcription | null>(null);
  const [processingStatus, setProcessingStatus] = useState<TranscriptionStatus | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

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

  // Polling para verificar status da transcrição
  const startPolling = (transcriptionId: string) => {
    // Limpar qualquer polling anterior
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    // Verificar a cada 5 segundos
    pollingIntervalRef.current = setInterval(async () => {
      try {
        const { data, error } = await supabase
          .from('transcriptions')
          .select('*')
          .eq('id', transcriptionId)
          .single();

        if (error) {
          console.error('Erro ao buscar transcrição:', error);
          return;
        }

        if (data) {
          setCurrentTranscription(data);
          setProcessingStatus(data.status);

          // Se completou ou deu erro, parar polling
          if (data.status === 'completed' || data.status === 'error') {
            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current);
              pollingIntervalRef.current = null;
            }

            if (data.status === 'error') {
              setErrorMessage(data.error_message || 'Erro desconhecido no processamento');
            }
          }
        }
      } catch (err) {
        console.error('Erro no polling:', err);
      }
    }, 5000); // 5 segundos
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile || !formData.personName || !formData.lawsuitNumber) {
        alert("Preencha todos os campos.");
        return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setCurrentTranscription(null);
    setProcessingStatus(null);

    try {
      // 1. Criar registro no Supabase ANTES de enviar para o webhook
      const { data: transcriptionRecord, error: dbError } = await supabase
        .from('transcriptions')
        .insert({
          person_name: formData.personName,
          lawsuit_number: formData.lawsuitNumber,
          video_filename: videoFile.name,
          video_size: videoFile.size,
          status: 'pending',
          submitted_by_id: user.id,
          submitted_by_email: user.email
        })
        .select()
        .single();

      if (dbError || !transcriptionRecord) {
        throw new Error('Erro ao criar registro no banco de dados');
      }

      console.log('Registro criado no Supabase:', transcriptionRecord.id);

      // 2. Enviar para o webhook n8n com o ID da transcrição
      const payload = new FormData();
      payload.append('transcriptionId', transcriptionRecord.id);
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
      console.log('Resposta do webhook:', result);

      // 3. Iniciar polling para verificar status
      setCurrentTranscription(transcriptionRecord);
      setProcessingStatus('pending');
      startPolling(transcriptionRecord.id);

      // Exibir mensagem de sucesso no envio
      alert('Vídeo enviado com sucesso! O processamento começará em breve.');

    } catch (error: any) {
      console.error('Erro ao enviar:', error);
      setErrorMessage(error.message || 'Erro ao enviar o vídeo');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyTranscription = async () => {
    if (!currentTranscription?.transcription) return;

    try {
      await navigator.clipboard.writeText(currentTranscription.transcription);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  const handleBackToDashboard = () => {
    setFormData({ personName: '', lawsuitNumber: '' });
    setVideoFile(null);
    setCurrentTranscription(null);
    setProcessingStatus(null);
    setErrorMessage('');
    if (fileInputRef.current) fileInputRef.current.value = '';

    // Limpar polling
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  // Renderizar status de processamento
  const renderProcessingStatus = () => {
    if (!processingStatus) return null;

    const statusConfig = {
      pending: {
        icon: <Clock className="animate-pulse" size={20} />,
        text: 'Aguardando processamento...',
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/20'
      },
      processing: {
        icon: <Loader2 className="animate-spin" size={20} />,
        text: 'Processando transcrição...',
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/10',
        borderColor: 'border-yellow-500/20'
      },
      completed: {
        icon: <CheckCircle size={20} />,
        text: 'Transcrição concluída!',
        color: 'text-emerald-400',
        bgColor: 'bg-emerald-500/10',
        borderColor: 'border-emerald-500/20'
      },
      error: {
        icon: <AlertCircle size={20} />,
        text: 'Erro no processamento',
        color: 'text-red-400',
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/20'
      }
    };

    const config = statusConfig[processingStatus];

    return (
      <div className={`mb-6 p-4 ${config.bgColor} border ${config.borderColor} rounded-lg flex items-center gap-3 ${config.color} animate-fadeIn`}>
        {config.icon}
        <div className="flex-1">
          <p className="font-semibold">{config.text}</p>
          {processingStatus === 'processing' && (
            <p className="text-sm opacity-80 mt-1">
              Isso pode levar alguns minutos dependendo do tamanho do vídeo.
            </p>
          )}
          {processingStatus === 'error' && errorMessage && (
            <p className="text-sm opacity-80 mt-1">{errorMessage}</p>
          )}
        </div>
        <button onClick={() => setProcessingStatus(null)} className={`ml-auto hover:${config.bgColor} p-1 rounded`}>
          <X size={16} />
        </button>
      </div>
    );
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
                  <li>O processamento é assíncrono e pode levar alguns minutos.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column: Upload Form */}
          <div className="lg:col-span-2">
            <div className="glass-panel rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
               {/* Background decoration */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-justice-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

              <h2 className="text-2xl font-bold text-white mb-8 relative z-10">Dados do Processo</h2>

              {/* Status de processamento */}
              {renderProcessingStatus()}

              {/* Formulário */}
              {!currentTranscription && (
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Nome do Envolvido"
                      placeholder="Ex: João da Silva"
                      icon={<UserIcon size={18} />}
                      value={formData.personName}
                      onChange={(e) => setFormData({...formData, personName: e.target.value})}
                      required
                    />
                    <Input
                      label="Número do Processo"
                      placeholder="0000000-00-0000.0.00.0000"
                      icon={<FileText size={18} />}
                      value={formData.lawsuitNumber}
                      onChange={(e) => setFormData({...formData, lawsuitNumber: e.target.value})}
                      required
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
                      `}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="video/*"
                        onChange={handleFileChange}
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
                          <p className="text-slate-500 text-xs mt-4 hover:text-red-400 transition-colors" onClick={(e) => {
                            e.stopPropagation();
                            setVideoFile(null);
                          }}>
                            Remover arquivo
                          </p>
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
              {currentTranscription && processingStatus === 'completed' && currentTranscription.transcription && (
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

                  <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 text-sm text-slate-300 space-y-1">
                    <p><strong>Processo:</strong> {currentTranscription.lawsuit_number}</p>
                    <p><strong>Envolvido:</strong> {currentTranscription.person_name}</p>
                    <p><strong>Arquivo:</strong> {currentTranscription.video_filename}</p>
                  </div>

                  <div className="relative">
                    <div className="bg-slate-900/70 border border-slate-700 rounded-xl p-6 max-h-96 overflow-y-auto">
                      <pre className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap font-mono">
                        {currentTranscription.transcription}
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
            <p>&copy; {new Date().getFullYear()} Segunda Crime de Foz. Todos os direitos reservados.</p>
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
        </div>
      </footer>
    </div>
  );
};
