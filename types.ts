export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
}

export type ViewState = 'login' | 'register' | 'dashboard';

export interface VideoSubmissionData {
  personName: string;
  lawsuitNumber: string;
  videoFile: File | null;
}

export interface WebhookResponse {
  success: boolean;
  message: string;
}
