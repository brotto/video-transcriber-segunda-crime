/**
 * API Endpoint para receber callback do webhook n8n
 *
 * O webhook n8n chama este endpoint após completar a transcrição
 *
 * URL: https://oj-virtual.app/api/webhook-callback
 *
 * Body esperado:
 * {
 *   transcriptionId: string (UUID),
 *   status: 'completed' | 'error',
 *   transcription?: string,
 *   errorMessage?: string,
 *   processingStartedAt?: string (ISO),
 *   processingCompletedAt?: string (ISO)
 * }
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// Inicializar cliente Supabase com SERVICE ROLE KEY
// IMPORTANTE: Usar service_role para bypass RLS
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Permitir apenas POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    const {
      transcriptionId,
      status,
      transcription,
      errorMessage,
      processingStartedAt,
      processingCompletedAt
    } = req.body;

    // Validação básica
    if (!transcriptionId) {
      return res.status(400).json({
        success: false,
        error: 'transcriptionId is required'
      });
    }

    if (!status || !['completed', 'error', 'processing'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be: completed, error, or processing'
      });
    }

    console.log(`[Webhook Callback] Received for transcription ${transcriptionId}:`, {
      status,
      hasTranscription: !!transcription,
      errorMessage
    });

    // Preparar dados para update
    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    };

    if (status === 'completed' && transcription) {
      updateData.transcription = transcription;
      updateData.processing_completed_at = processingCompletedAt || new Date().toISOString();
    }

    if (status === 'error' && errorMessage) {
      updateData.error_message = errorMessage;
    }

    if (status === 'processing' && processingStartedAt) {
      updateData.processing_started_at = processingStartedAt;
    }

    // Atualizar no Supabase
    const { data, error } = await supabase
      .from('transcriptions')
      .update(updateData)
      .eq('id', transcriptionId)
      .select()
      .single();

    if (error) {
      console.error('[Webhook Callback] Database error:', error);
      return res.status(500).json({
        success: false,
        error: 'Database error',
        details: error.message
      });
    }

    console.log(`[Webhook Callback] Successfully updated transcription ${transcriptionId}`);

    // Retornar sucesso
    return res.status(200).json({
      success: true,
      message: 'Transcrição atualizada com sucesso',
      data: {
        id: data.id,
        status: data.status,
        updatedAt: data.updated_at
      }
    });

  } catch (error: any) {
    console.error('[Webhook Callback] Unexpected error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
}
