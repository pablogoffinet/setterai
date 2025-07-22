declare const process: { env: { [key: string]: string | undefined } };

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://setterai-729q.onrender.com';

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Health check
  async getHealth(): Promise<any> {
    return this.request('/health');
  }

  // Test endpoint
  async getTest(): Promise<any> {
    return this.request('/test');
  }

  // Campaigns
  async getCampaigns(): Promise<any[]> {
    return this.request('/campaigns');
  }

  async createCampaign(data: any): Promise<any> {
    return this.request('/campaigns', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCampaign(id: string): Promise<any> {
    return this.request(`/campaigns/${id}`);
  }

  async updateCampaign(id: string, data: any): Promise<any> {
    return this.request(`/campaigns/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCampaign(id: string): Promise<void> {
    return this.request(`/campaigns/${id}`, {
      method: 'DELETE',
    });
  }

  // Prospects
  async getProspects(): Promise<any[]> {
    return this.request('/prospects');
  }

  async createProspect(data: any): Promise<any> {
    return this.request('/prospects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getProspect(id: string): Promise<any> {
    return this.request(`/prospects/${id}`);
  }

  async updateProspect(id: string, data: any): Promise<any> {
    return this.request(`/prospects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProspect(id: string): Promise<void> {
    return this.request(`/prospects/${id}`, {
      method: 'DELETE',
    });
  }

  // Channels
  async getChannels(): Promise<any[]> {
    return this.request('/channels');
  }

  async createChannel(data: any): Promise<any> {
    return this.request('/channels', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // AI Configuration
  async getAiConfig(): Promise<any> {
    return this.request('/ai-config');
  }

  async updateAiConfig(data: any): Promise<any> {
    return this.request('/ai-config', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Analytics
  async getAnalytics(): Promise<any> {
    return this.request('/analytics');
  }
}

export const apiService = new ApiService();
export default apiService; 