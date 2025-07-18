// Types pour l'intégration Unipile API
export interface UnipileAccount {
  id: string;
  type: 'LINKEDIN' | 'EMAIL' | 'WHATSAPP' | 'TELEGRAM' | 'SLACK' | 'DISCORD' | 'SMS';
  status: 'ACTIVE' | 'DISCONNECTED' | 'ERROR';
  provider_id: string;
  metadata: Record<string, any>;
  last_sync_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface UnipileCredentials {
  account_id: string;
  type: 'LINKEDIN' | 'EMAIL' | 'WHATSAPP' | 'TELEGRAM' | 'SLACK' | 'DISCORD' | 'SMS';
  credentials: {
    // LinkedIn
    username?: string;
    password?: string;
    cookies?: string;
    
    // Email
    host?: string;
    port?: number;
    secure?: boolean;
    auth?: {
      user: string;
      pass: string;
    };
    
    // WhatsApp / Telegram
    phone?: string;
    token?: string;
    
    // Slack / Discord
    bot_token?: string;
    webhook_url?: string;
  };
}

export interface UnipileChat {
  id: string;
  account_id: string;
  type: 'INDIVIDUAL' | 'GROUP';
  participants: UnipileParticipant[];
  name?: string;
  picture?: string;
  last_message_at?: Date;
  is_archived: boolean;
  is_muted: boolean;
  metadata: Record<string, any>;
}

export interface UnipileParticipant {
  id: string;
  name?: string;
  profile_picture?: string;
  email?: string;
  phone?: string;
  linkedin_url?: string;
  metadata: Record<string, any>;
}

export interface UnipileMessage {
  id: string;
  chat_id: string;
  account_id: string;
  direction: 'INBOUND' | 'OUTBOUND';
  type: 'TEXT' | 'IMAGE' | 'FILE' | 'AUDIO' | 'VIDEO' | 'LINK';
  content: string;
  attachments?: UnipileAttachment[];
  sender: UnipileParticipant;
  recipients: UnipileParticipant[];
  timestamp: Date;
  status: 'PENDING' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';
  metadata: Record<string, any>;
}

export interface UnipileAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  thumbnail_url?: string;
}

export interface UnipileLinkedInProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  headline?: string;
  summary?: string;
  location?: {
    id?: string;
    name?: string;
    country?: string;
  };
  picture?: string;
  cover_picture?: string;
  experience?: UnipileExperience[];
  education?: UnipileEducation[];
  skills?: string[];
  connections_count?: number;
  follower_count?: number;
}

export interface UnipileExperience {
  id?: string;
  title: string;
  company: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  is_current?: boolean;
  description?: string;
  skills?: string[];
}

export interface UnipileEducation {
  id?: string;
  school: string;
  degree?: string;
  field_of_study?: string;
  start_date?: string;
  end_date?: string;
  description?: string;
}

export interface UnipileWebhookEvent {
  type: 'MESSAGE_RECEIVED' | 'MESSAGE_SENT' | 'MESSAGE_STATUS_UPDATED' | 'CHAT_UPDATED' | 'ACCOUNT_DISCONNECTED';
  account_id: string;
  timestamp: Date;
  data: UnipileMessage | UnipileChat | UnipileAccount;
}

export interface UnipileInMailBalance {
  total: number;
  used: number;
  remaining: number;
  resets_at?: Date;
}

export interface UnipileSyncOptions {
  linkedin_product?: 'classic' | 'recruiter' | 'sales_navigator';
  before?: number; // Epoch timestamp in ms
  after?: number;  // Epoch timestamp in ms
}

export interface UnipileError {
  type: string;
  title: string;
  detail?: string;
  status: number;
  instance?: string;
}

// API Response types
export interface UnipileApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: UnipileError;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    has_next: boolean;
  };
}

export interface UnipileListResponse<T = any> extends UnipileApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    has_next: boolean;
  };
} 