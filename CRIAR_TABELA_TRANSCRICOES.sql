-- ========================================
-- TABELA DE TRANSCRIÇÕES
-- ========================================
-- Armazena os vídeos enviados e suas transcrições

CREATE TABLE IF NOT EXISTS public.transcriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Dados do processo
  person_name TEXT NOT NULL,
  lawsuit_number TEXT NOT NULL,

  -- Dados do vídeo
  video_filename TEXT NOT NULL,
  video_size INTEGER, -- tamanho em bytes
  video_duration INTEGER, -- duração em segundos (se disponível)

  -- Status do processamento
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'error')),

  -- Transcrição
  transcription TEXT,

  -- Dados do usuário que enviou
  submitted_by_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  submitted_by_email TEXT NOT NULL,

  -- Metadados
  error_message TEXT,
  processing_started_at TIMESTAMP WITH TIME ZONE,
  processing_completed_at TIMESTAMP WITH TIME ZONE,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- ÍNDICES PARA PERFORMANCE
-- ========================================

-- Buscar por usuário
CREATE INDEX IF NOT EXISTS idx_transcriptions_user
ON public.transcriptions(submitted_by_id);

-- Buscar por status
CREATE INDEX IF NOT EXISTS idx_transcriptions_status
ON public.transcriptions(status);

-- Buscar por data de criação
CREATE INDEX IF NOT EXISTS idx_transcriptions_created_at
ON public.transcriptions(created_at DESC);

-- Buscar por número do processo
CREATE INDEX IF NOT EXISTS idx_transcriptions_lawsuit
ON public.transcriptions(lawsuit_number);

-- ========================================
-- ROW LEVEL SECURITY (RLS)
-- ========================================

-- Habilitar RLS
ALTER TABLE public.transcriptions ENABLE ROW LEVEL SECURITY;

-- Policy: Usuários podem ver apenas suas próprias transcrições
CREATE POLICY "Users can view own transcriptions"
ON public.transcriptions
FOR SELECT
USING (auth.uid() = submitted_by_id);

-- Policy: Usuários podem criar transcrições
CREATE POLICY "Users can create transcriptions"
ON public.transcriptions
FOR INSERT
WITH CHECK (auth.uid() = submitted_by_id);

-- Policy: Permitir que o webhook (service role) atualize qualquer transcrição
-- IMPORTANTE: Esta policy permite updates sem autenticação quando usando service_role key
CREATE POLICY "Service role can update transcriptions"
ON public.transcriptions
FOR UPDATE
USING (true);

-- ========================================
-- TRIGGER PARA ATUALIZAR updated_at
-- ========================================

CREATE OR REPLACE FUNCTION public.update_transcriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_transcriptions_timestamp
BEFORE UPDATE ON public.transcriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_transcriptions_updated_at();

-- ========================================
-- VERIFICAÇÃO
-- ========================================

-- Verificar se a tabela foi criada
SELECT
  table_name,
  table_type
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name = 'transcriptions';

-- Verificar colunas
SELECT
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'transcriptions'
ORDER BY ordinal_position;

-- Verificar policies
SELECT
  schemaname,
  tablename,
  policyname,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'transcriptions';
