import { UnipileService } from './unipile.service';
import { logger } from '../utils/logger';
import {
  UnipileLinkedInProfile,
  UnipileApiResponse,
  UnipileInMailBalance,
  UnipileExperience,
  UnipileEducation
} from '../types/unipile';

export class LinkedInUnipileService extends UnipileService {

  /**
   * Obtenir le profil LinkedIn complet
   */
  async getProfile(accountId: string): Promise<UnipileApiResponse<UnipileLinkedInProfile>> {
    try {
      logger.info('Fetching LinkedIn profile', { accountId });
      return await this.getLinkedInProfile(accountId);
    } catch (error) {
      logger.error('Error fetching LinkedIn profile:', error);
      return {
        success: false,
        error: {
          type: 'profile_fetch_error',
          title: 'Failed to fetch profile',
          detail: error instanceof Error ? error.message : 'Unknown error',
          status: 500
        }
      };
    }
  }

  /**
   * Mettre à jour le profil LinkedIn
   */
  async updateProfile(accountId: string, profileData: {
    headline?: string;
    summary?: string;
    location?: { id?: string; name?: string };
    skills?: string[];
    experience?: UnipileExperience[];
    education?: UnipileEducation[];
  }): Promise<UnipileApiResponse<any>> {
    try {
      logger.info('Updating LinkedIn profile', { accountId, fields: Object.keys(profileData) });
      
      // Préparer les données pour l'API Unipile
      const updateData: Partial<UnipileLinkedInProfile> = {
        headline: profileData.headline,
        summary: profileData.summary,
        location: profileData.location,
        skills: profileData.skills,
        experience: profileData.experience,
        education: profileData.education
      };

      return await this.updateLinkedInProfile(accountId, updateData);
    } catch (error) {
      logger.error('Error updating LinkedIn profile:', error);
      return {
        success: false,
        error: {
          type: 'profile_update_error',
          title: 'Failed to update profile',
          detail: error instanceof Error ? error.message : 'Unknown error',
          status: 500
        }
      };
    }
  }

  /**
   * Ajouter une expérience professionnelle
   */
  async addExperience(accountId: string, experience: UnipileExperience): Promise<UnipileApiResponse<any>> {
    try {
      const formData = new URLSearchParams();
      formData.append('type', 'LINKEDIN');
      formData.append('account_id', accountId);
      
      // Ajouter les champs d'expérience
      if (experience.title) formData.append('experience[title]', experience.title);
      if (experience.company) formData.append('experience[company]', experience.company);
      if (experience.location) formData.append('experience[location]', experience.location);
      if (experience.start_date) formData.append('experience[start_date]', experience.start_date);
      if (experience.end_date) formData.append('experience[end_date]', experience.end_date);
      if (experience.is_current !== undefined) formData.append('experience[is_current]', experience.is_current.toString());
      if (experience.description) formData.append('experience[description]', experience.description);
      
      // Ajouter les compétences si présentes
      if (experience.skills) {
        experience.skills.forEach(skill => {
          formData.append('experience[skills]', skill);
        });
      }

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
      logger.error('Error adding LinkedIn experience:', error);
      return {
        success: false,
        error: error as any
      };
    }
  }

  /**
   * Ajouter une formation
   */
  async addEducation(accountId: string, education: UnipileEducation): Promise<UnipileApiResponse<any>> {
    try {
      const formData = new URLSearchParams();
      formData.append('type', 'LINKEDIN');
      formData.append('account_id', accountId);
      
      // Ajouter les champs d'éducation
      if (education.school) formData.append('education[school]', education.school);
      if (education.degree) formData.append('education[degree]', education.degree);
      if (education.field_of_study) formData.append('education[field_of_study]', education.field_of_study);
      if (education.start_date) formData.append('education[start_date]', education.start_date);
      if (education.end_date) formData.append('education[end_date]', education.end_date);
      if (education.description) formData.append('education[description]', education.description);

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
      logger.error('Error adding LinkedIn education:', error);
      return {
        success: false,
        error: error as any
      };
    }
  }

  /**
   * Obtenir le solde InMail
   */
  async getInMailBalance(accountId: string): Promise<UnipileApiResponse<UnipileInMailBalance>> {
    try {
      logger.info('Fetching InMail balance', { accountId });
      return await super.getInMailBalance(accountId);
    } catch (error) {
      logger.error('Error fetching InMail balance:', error);
      return {
        success: false,
        error: {
          type: 'inmail_balance_error',
          title: 'Failed to fetch InMail balance',
          detail: error instanceof Error ? error.message : 'Unknown error',
          status: 500
        }
      };
    }
  }

  /**
   * Envoyer un InMail
   */
  async sendInMail(accountId: string, recipientId: string, subject: string, message: string): Promise<UnipileApiResponse<any>> {
    try {
      logger.info('Sending InMail', { accountId, recipientId, subject });
      
      const response = await this.apiClient.post('/linkedin/inmail/send', {
        account_id: accountId,
        recipient_id: recipientId,
        subject,
        message
      });
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      logger.error('Error sending InMail:', error);
      return {
        success: false,
        error: error as any
      };
    }
  }

  /**
   * Envoyer un message de connexion
   */
  async sendConnectionRequest(accountId: string, recipientId: string, message?: string): Promise<UnipileApiResponse<any>> {
    try {
      logger.info('Sending connection request', { accountId, recipientId });
      
      const response = await this.apiClient.post('/linkedin/connections/request', {
        account_id: accountId,
        recipient_id: recipientId,
        message: message || ''
      });
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      logger.error('Error sending connection request:', error);
      return {
        success: false,
        error: error as any
      };
    }
  }

  /**
   * Rechercher des profils LinkedIn
   */
  async searchProfiles(accountId: string, query: {
    keywords?: string;
    location?: string;
    industry?: string;
    company?: string;
    title?: string;
    page?: number;
    limit?: number;
  }): Promise<UnipileApiResponse<any>> {
    try {
      logger.info('Searching LinkedIn profiles', { accountId, query });
      
      const searchParams = new URLSearchParams();
      searchParams.append('account_id', accountId);
      
      if (query.keywords) searchParams.append('keywords', query.keywords);
      if (query.location) searchParams.append('location', query.location);
      if (query.industry) searchParams.append('industry', query.industry);
      if (query.company) searchParams.append('company', query.company);
      if (query.title) searchParams.append('title', query.title);
      if (query.page) searchParams.append('page', query.page.toString());
      if (query.limit) searchParams.append('limit', query.limit.toString());

      const response = await this.apiClient.get(`/linkedin/search/profiles?${searchParams.toString()}`);
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      logger.error('Error searching LinkedIn profiles:', error);
      return {
        success: false,
        error: error as any
      };
    }
  }

  /**
   * Obtenir les statistiques du profil
   */
  async getProfileStats(accountId: string): Promise<UnipileApiResponse<any>> {
    try {
      logger.info('Fetching profile statistics', { accountId });
      
      const response = await this.apiClient.get('/linkedin/profile/stats', {
        params: { account_id: accountId }
      });
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      logger.error('Error fetching profile stats:', error);
      return {
        success: false,
        error: error as any
      };
    }
  }

  /**
   * Obtenir les connexions
   */
  async getConnections(accountId: string, page = 1, limit = 50): Promise<UnipileApiResponse<any>> {
    try {
      logger.info('Fetching LinkedIn connections', { accountId, page, limit });
      
      const response = await this.apiClient.get('/linkedin/connections', {
        params: { 
          account_id: accountId,
          page,
          limit
        }
      });
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      logger.error('Error fetching connections:', error);
      return {
        success: false,
        error: error as any
      };
    }
  }

  /**
   * Publier un post LinkedIn
   */
  async createPost(accountId: string, content: {
    text: string;
    visibility?: 'PUBLIC' | 'CONNECTIONS' | 'LOGGED_IN';
    images?: string[];
  }): Promise<UnipileApiResponse<any>> {
    try {
      logger.info('Creating LinkedIn post', { accountId, contentLength: content.text.length });
      
      const response = await this.apiClient.post('/linkedin/posts', {
        account_id: accountId,
        text: content.text,
        visibility: content.visibility || 'PUBLIC',
        images: content.images || []
      });
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      logger.error('Error creating LinkedIn post:', error);
      return {
        success: false,
        error: error as any
      };
    }
  }

  /**
   * Synchroniser avec un produit LinkedIn spécifique
   */
  async syncLinkedInProduct(accountId: string, product: 'classic' | 'recruiter' | 'sales_navigator', options?: {
    before?: number;
    after?: number;
  }): Promise<UnipileApiResponse<any>> {
    try {
      logger.info('Syncing LinkedIn product', { accountId, product });
      
      return await this.syncAccount(accountId, {
        linkedin_product: product,
        before: options?.before,
        after: options?.after
      });
    } catch (error) {
      logger.error('Error syncing LinkedIn product:', error);
      return {
        success: false,
        error: {
          type: 'sync_error',
          title: 'Failed to sync LinkedIn product',
          detail: error instanceof Error ? error.message : 'Unknown error',
          status: 500
        }
      };
    }
  }
} 