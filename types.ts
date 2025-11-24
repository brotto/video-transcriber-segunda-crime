export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
}

export type ViewState = 'homepage' | 'login' | 'register' | 'dashboard' | 'privacy' | 'terms';

export interface VideoSubmissionData {
  personName: string;
  lawsuitNumber: string;
  videoFile: File | null;
}

export interface WebhookResponse {
  success: boolean;
  message: string;
  transcriptionId?: string;
}

export type TranscriptionStatus = 'pending' | 'processing' | 'completed' | 'error';

export interface Transcription {
  id: string;
  person_name: string;
  lawsuit_number: string;
  video_filename: string;
  video_size?: number;
  video_duration?: number;
  status: TranscriptionStatus;
  transcription?: string;
  submitted_by_id: string;
  submitted_by_email: string;
  error_message?: string;
  processing_started_at?: string;
  processing_completed_at?: string;
  created_at: string;
  updated_at: string;
}
