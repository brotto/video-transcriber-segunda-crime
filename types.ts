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
}
