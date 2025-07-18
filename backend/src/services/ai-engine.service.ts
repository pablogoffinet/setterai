import axios, { AxiosInstance } from 'axios';
import { logger } from '../utils/logger';
import { environment } from '../config/environment';

export interface AIProcessRequest {
  message: string;
  agentConfig: {
    type: 'CUSTOMER_SUPPORT' | 'SALES' | 'MARKETING' | 'CUSTOM';
    model?: string;
    prompt?: string;
    temperature?: number;
    maxTokens?: number;
  };
  context?: {
    conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
    channelType?: string;
    userProfile?: any;
    metadata?: any;
  };
}

export interface AIProcessResponse {
  response: string;
  sentiment?: any;
  intent?: any;
  confidence: number;
  model: string;
  tokensUsed: number;
}

export interface AISentimentResponse {
  sentiment: string;
  confidence: number;
  emotions: Array<{
    emotion: string;
    confidence: number;
  }>;
}

export class AIEngineService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: environment.AI_ENGINE_URL,
      timeout: environment.AI_ENGINE_TIMEOUT || 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        logger.debug('AI Engine Request:', {
          method: config.method?.toUpperCase(),
          url: config.url,
          data: config.data ? { ...config.data, message: config.data.message?.substring(0, 100) + '...' } : undefined,
        });
        return config;
      },
      (error) => {
        logger.error('AI Engine Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => {
        logger.debug('AI Engine Response:', {
          status: response.status,
          url: response.config.url,
          responseSize: JSON.stringify(response.data).length,
        });
        return response;
      },
      (error) => {
        logger.error('AI Engine Error:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });
        return Promise.reject(error);
      }
    );
  }

  /**
   * Vérifier si l'AI Engine est accessible
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.client.get('/health');
      return response.status === 200;
    } catch (error) {
      logger.error('AI Engine health check failed:', error);
      return false;
    }
  }

  /**
   * Traiter un message avec l'IA
   */
  async processMessage(request: AIProcessRequest): Promise<AIProcessResponse> {
    try {
      const response = await this.client.post('/process', request);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'AI processing failed');
      }
    } catch (error) {
      logger.error('Error processing message with AI:', error);
      throw new Error(error instanceof Error ? error.message : 'AI processing failed');
    }
  }

  /**
   * Analyser le sentiment d'un message
   */
  async analyzeSentiment(text: string): Promise<AISentimentResponse> {
    try {
      const response = await this.client.post('/analyze/sentiment', { text });
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Sentiment analysis failed');
      }
    } catch (error) {
      logger.error('Error analyzing sentiment:', error);
      throw new Error(error instanceof Error ? error.message : 'Sentiment analysis failed');
    }
  }

  /**
   * Générer une réponse pour LinkedIn
   */
  async generateLinkedInResponse(
    message: string,
    context?: {
      userProfile?: any;
      conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
    }
  ): Promise<string> {
    const request: AIProcessRequest = {
      message,
      agentConfig: {
        type: 'SALES',
        model: 'gpt-4o',
        temperature: 0.7,
        maxTokens: 500,
        prompt: `Tu es un assistant commercial expert en prospection LinkedIn. 
        
Ton rôle :
- Répondre de manière professionnelle et engageante
- Poser des questions pertinentes pour qualifier le prospect
- Maintenir un ton convivial mais professionnel
- Être concis et aller droit au but
- Adapter ton style selon le contexte de la conversation

Règles importantes :
- Réponses maximum 2-3 phrases
- Toujours terminer par une question ou un appel à l'action
- Ne pas être trop insistant ou commercial
- Personnaliser selon le profil du prospect`
      },
      context: {
        ...context,
        channelType: 'LINKEDIN',
        metadata: {
          platform: 'linkedin',
          objective: 'prospection'
        }
      }
    };

    const result = await this.processMessage(request);
    return result.response;
  }

  /**
   * Générer une réponse pour le support client
   */
  async generateSupportResponse(
    message: string,
    context?: {
      conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
      userProfile?: any;
    }
  ): Promise<string> {
    const request: AIProcessRequest = {
      message,
      agentConfig: {
        type: 'CUSTOMER_SUPPORT',
        model: 'gpt-4o-mini',
        temperature: 0.5,
        maxTokens: 300,
        prompt: `Tu es un assistant de support client expert et bienveillant.

Ton rôle :
- Aider les utilisateurs avec leurs questions techniques
- Être empathique et compréhensif
- Fournir des solutions claires et étape par étape
- Escalader si nécessaire vers un humain

Règles importantes :
- Réponses concises mais complètes
- Toujours proposer une solution concrète
- Demander des clarifications si nécessaire
- Maintenir un ton professionnel et aidant`
      },
      context: {
        ...context,
        channelType: 'SUPPORT',
        metadata: {
          department: 'support',
          priority: 'normal'
        }
      }
    };

    const result = await this.processMessage(request);
    return result.response;
  }

  /**
   * Générer une réponse IA (alias pour processMessage)
   */
  async generateResponse(request: AIProcessRequest): Promise<AIProcessResponse> {
    return this.processMessage(request);
  }
} 