import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import crypto from 'crypto';
import { logger } from '../utils/logger';
import { environment } from '../config/environment';
import {
  UnipileAccount,
  UnipileCredentials,
  UnipileChat,
  UnipileMessage,
  UnipileLinkedInProfile,
  UnipileApiResponse,
  UnipileListResponse,
  UnipileError,
  UnipileInMailBalance,
  UnipileSyncOptions,
  UnipileWebhookEvent
} from '../types/unipile';

export class UnipileService {
  protected apiClient: AxiosInstance;
  private env = environment;

  constructor() {
    this.apiClient = axios.create({
      baseURL: this.env.UNIPILE_API_URL,
      headers: {
        'X-API-Key': this.env.UNIPILE_API_KEY,
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 seconds timeout
    });

    // Add request interceptor for logging
    this.apiClient.interceptors.request.use(
      (config) => {
        logger.debug('Unipile API Request:', {
          method: config.method?.toUpperCase(),
          url: config.url,
          params: config.params,
        });
        return config;
      },
      (error) => {
        logger.error('Unipile API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.apiClient.interceptors.response.use(
      (response) => {
        logger.debug('Unipile API Response:', {
          status: response.status,
          url: response.config.url,
        });
        return response;
      },
      (error) => {
        const unipileError = this.handleApiError(error);
        logger.error('Unipile API Error:', unipileError);
        return Promise.reject(unipileError);
      }
    );
  }

  private handleApiError(error: any): UnipileError {
    if (error.response?.data) {
      return {
        type: error.response.data.type || 'unknown_error',
        title: error.response.data.title || 'Unknown error',
        detail: error.response.data.detail,
        status: error.response.status || 500,
        instance: error.response.data.instance,
      };
    }

    return {
      type: 'network_error',
      title: 'Network Error',
      detail: error.message || 'Failed to connect to Unipile API',
      status: 500,
    };
  }

  // Account Management
  async connectAccount(credentials: UnipileCredentials): Promise<UnipileApiResponse<UnipileAccount>> {
    try {
      const response = await this.apiClient.post('/accounts', credentials);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error as UnipileError,
      };
    }
  }

  async getAccount(accountId: string): Promise<UnipileApiResponse<UnipileAccount>> {
    try {
      const response = await this.apiClient.get(`/accounts/${accountId}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error as UnipileError,
      };
    }
  }

  async listAccounts(): Promise<UnipileListResponse<UnipileAccount>> {
    try {
      const response = await this.apiClient.get('/accounts');
      return {
        success: true,
        data: response.data.accounts || [],
        pagination: response.data.pagination,
      };
    } catch (error) {
      return {
        success: false,
        error: error as UnipileError,
        data: [],
        pagination: { page: 1, limit: 10, total: 0, has_next: false },
      };
    }
  }

  async disconnectAccount(accountId: string): Promise<UnipileApiResponse<void>> {
    try {
      await this.apiClient.delete(`/accounts/${accountId}`);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error as UnipileError,
      };
    }
  }

  async syncAccount(accountId: string, options?: UnipileSyncOptions): Promise<UnipileApiResponse<any>> {
    try {
      const queryParams = new URLSearchParams();
      if (options?.linkedin_product) {
        queryParams.append('linkedin_product', options.linkedin_product);
      }
      if (options?.before) {
        queryParams.append('before', options.before.toString());
      }
      if (options?.after) {
        queryParams.append('after', options.after.toString());
      }

      const url = `/accounts/${accountId}/sync${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await this.apiClient.get(url);
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error as UnipileError,
      };
    }
  }

  // Chat Management
  async getChats(accountId: string, page = 1, limit = 50): Promise<UnipileListResponse<UnipileChat>> {
    try {
      const response = await this.apiClient.get(`/chats`, {
        params: { account_id: accountId, page, limit },
      });
      
      return {
        success: true,
        data: response.data.chats || [],
        pagination: response.data.pagination,
      };
    } catch (error) {
      return {
        success: false,
        error: error as UnipileError,
        data: [],
        pagination: { page, limit, total: 0, has_next: false },
      };
    }
  }

  async getChat(chatId: string): Promise<UnipileApiResponse<UnipileChat>> {
    try {
      const response = await this.apiClient.get(`/chats/${chatId}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error as UnipileError,
      };
    }
  }

  async getChatAttendees(chatId: string): Promise<UnipileListResponse<any>> {
    try {
      const response = await this.apiClient.get(`/chats/${chatId}/attendees`);
      return {
        success: true,
        data: response.data.attendees || [],
        pagination: response.data.pagination,
      };
    } catch (error) {
      return {
        success: false,
        error: error as UnipileError,
        data: [],
        pagination: { page: 1, limit: 10, total: 0, has_next: false },
      };
    }
  }

  // Message Management
  async getMessages(chatId: string, page = 1, limit = 50): Promise<UnipileListResponse<UnipileMessage>> {
    try {
      const response = await this.apiClient.get(`/chats/${chatId}/messages`, {
        params: { page, limit },
      });
      
      return {
        success: true,
        data: response.data.messages || [],
        pagination: response.data.pagination,
      };
    } catch (error) {
      return {
        success: false,
        error: error as UnipileError,
        data: [],
        pagination: { page, limit, total: 0, has_next: false },
      };
    }
  }

  async sendMessage(chatId: string, content: string, type: 'TEXT' | 'IMAGE' | 'FILE' = 'TEXT'): Promise<UnipileApiResponse<UnipileMessage>> {
    try {
      const response = await this.apiClient.post(`/chats/${chatId}/messages`, {
        content,
        type,
      });
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error as UnipileError,
      };
    }
  }

  // Email Management
  async sendEmail(to: string[], subject: string, content: string, accountId: string): Promise<UnipileApiResponse<any>> {
    try {
      const response = await this.apiClient.post('/emails', {
        account_id: accountId,
        to,
        subject,
        html: content,
      });
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error as UnipileError,
      };
    }
  }

  // LinkedIn Specific
  async getLinkedInProfile(accountId: string): Promise<UnipileApiResponse<UnipileLinkedInProfile>> {
    try {
      const response = await this.apiClient.get(`/users/me/profile`, {
        params: { account_id: accountId, type: 'LINKEDIN' },
      });
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error as UnipileError,
      };
    }
  }

  async updateLinkedInProfile(accountId: string, profileData: Partial<UnipileLinkedInProfile>): Promise<UnipileApiResponse<any>> {
    try {
      const formData = new URLSearchParams();
      formData.append('type', 'LINKEDIN');
      formData.append('account_id', accountId);
      
      if (profileData.headline) formData.append('headline', profileData.headline);
      if (profileData.summary) formData.append('summary', profileData.summary);
      if (profileData.location?.id) formData.append('location[id]', profileData.location.id);
      
      const response = await this.apiClient.patch('/users/me/edit', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error as UnipileError,
      };
    }
  }

  async getInMailBalance(accountId: string): Promise<UnipileApiResponse<UnipileInMailBalance>> {
    try {
      const response = await this.apiClient.get('/linkedin/inmail/balance', {
        params: { account_id: accountId },
      });
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error as UnipileError,
      };
    }
  }

  // Webhook verification
  verifyWebhookSignature(payload: string, signature: string): boolean {
    try {
      const crypto = require('crypto');
      const expectedSignature = crypto
        .createHmac('sha256', this.env.UNIPILE_WEBHOOK_SECRET)
        .update(payload)
        .digest('hex');
      
      return signature === `sha256=${expectedSignature}`;
    } catch (error) {
      logger.error('Error verifying webhook signature:', error);
      return false;
    }
  }

  // Health check via accounts endpoint
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.apiClient.get('/accounts');
      return response.status === 200;
    } catch (error) {
      logger.error('Unipile health check failed:', error);
      return false;
    }
  }
} 