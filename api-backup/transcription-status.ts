/**
 * Sistema de Sessão Temporária em Memória
 *
 * Armazena temporariamente o status das transcrições
 * Expira automaticamente após 30 minutos
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

// Store em memória (será perdido ao reiniciar, mas é o desejado)
interface TranscriptionSession {
  sessionId: string;
  status: 'waiting' | 'completed' | 'error';
  transcription?: string;
  errorMessage?: string;
  createdAt: number;
  expiresAt: number;
}

// Map para armazenar sessões temporárias
const sessions = new Map<string, TranscriptionSession>();

// Limpar sessões expiradas a cada 5 minutos
setInterval(() => {
  const now = Date.now();
  for (const [sessionId, session] of sessions.entries()) {
    if (now > session.expiresAt) {
      sessions.delete(sessionId);
      console.log(`[Session Cleanup] Removed expired session: ${sessionId}`);
    }
  }
}, 5 * 60 * 1000);

/**
 * GET /api/transcription-status?sessionId=xxx
 * Frontend usa para verificar se há resultado
 *
 * POST /api/transcription-status
 * N8N usa para notificar resultado
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET - Frontend verifica status
  if (req.method === 'GET') {
    const sessionId = req.query.sessionId as string;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: 'sessionId is required'
      });
    }

    const session = sessions.get(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        status: 'not_found',
        message: 'Sessão não encontrada ou expirada'
      });
    }

    // Verificar se expirou
    if (Date.now() > session.expiresAt) {
      sessions.delete(sessionId);
      return res.status(404).json({
        success: false,
        status: 'expired',
        message: 'Sessão expirou'
      });
    }

    // Retornar status
    return res.status(200).json({
      success: true,
      status: session.status,
      transcription: session.transcription,
      errorMessage: session.errorMessage,
      expiresIn: Math.floor((session.expiresAt - Date.now()) / 1000) // segundos
    });
  }

  // POST - N8N notifica resultado
  if (req.method === 'POST') {
    const { sessionId, status, transcription, errorMessage } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: 'sessionId is required'
      });
    }

    if (!status || !['completed', 'error'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be: completed or error'
      });
    }

    console.log(`[Transcription Status] Received notification for session ${sessionId}:`, {
      status,
      hasTranscription: !!transcription
    });

    // Buscar ou criar sessão
    let session = sessions.get(sessionId);

    if (!session) {
      // Criar nova sessão (caso n8n notifique antes do polling começar)
      session = {
        sessionId,
        status: 'waiting',
        createdAt: Date.now(),
        expiresAt: Date.now() + (30 * 60 * 1000) // 30 minutos
      };
      sessions.set(sessionId, session);
    }

    // Atualizar status
    session.status = status;
    if (status === 'completed' && transcription) {
      session.transcription = transcription;
    }
    if (status === 'error' && errorMessage) {
      session.errorMessage = errorMessage;
    }

    console.log(`[Transcription Status] Session ${sessionId} updated to ${status}`);

    return res.status(200).json({
      success: true,
      message: 'Status atualizado com sucesso'
    });
  }

  return res.status(405).json({
    success: false,
    error: 'Method not allowed'
  });
}
