import OpenAI from 'openai';
import { logger } from '../utils/logger';

export class OpenAIProvider {
  private client: OpenAI;
  private isAzure: boolean;
  private deploymentName?: string;

  constructor() {
    // Check if we're using Azure OpenAI
    this.isAzure = !!process.env['AZURE_OPENAI_API_KEY'];
    this.deploymentName = process.env['AZURE_OPENAI_DEPLOYMENT_NAME'] || 'gpt-4o';
    
    if (this.isAzure) {
      // Azure OpenAI configuration
      if (!process.env['AZURE_OPENAI_API_KEY'] || !process.env['AZURE_OPENAI_ENDPOINT']) {
        logger.warn('Azure OpenAI configuration incomplete');
      }
      this.client = new OpenAI({
        apiKey: process.env['AZURE_OPENAI_API_KEY'] || 'dummy-key',
        baseURL: `${process.env['AZURE_OPENAI_ENDPOINT']}/openai/deployments/${this.deploymentName}`,
        defaultQuery: { 'api-version': process.env['AZURE_OPENAI_API_VERSION'] || '2024-02-01' },
        defaultHeaders: {
          'api-key': process.env['AZURE_OPENAI_API_KEY'] || 'dummy-key',
        },
      });
      console.log('🔵 Azure OpenAI configured with deployment:', this.deploymentName);
    } else {
      // Regular OpenAI configuration
      if (!process.env['OPENAI_API_KEY']) {
        logger.warn('OpenAI API key not configured');
      }
      this.client = new OpenAI({
        apiKey: process.env['OPENAI_API_KEY'] || 'dummy-key',
      });
      console.log('🟢 Regular OpenAI configured');
    }
  }

  async generateCompletion(prompt: string, options: any = {}) {
    try {
      const apiKey = this.isAzure ? process.env['AZURE_OPENAI_API_KEY'] : process.env['OPENAI_API_KEY'];
      
      if (!apiKey) {
        return {
          success: false,
          error: `${this.isAzure ? 'Azure OpenAI' : 'OpenAI'} API key not configured`
        };
      }

      // For Azure OpenAI, we don't specify the model in the request as it's in the deployment
      const modelToUse = this.isAzure ? undefined : (options.model || 'gpt-3.5-turbo');

      const response = await this.client.chat.completions.create({
        ...(modelToUse && { model: modelToUse }),
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 500,
      });

      return {
        success: true,
        response: response.choices[0]?.message?.content || '',
        usage: response.usage
      };
    } catch (error) {
      logger.error(`${this.isAzure ? 'Azure OpenAI' : 'OpenAI'} API error:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Harmonisation de generateResponse pour compatibilité agents
  async generateResponse(promptOrOptions: any, options?: any) {
    // Si le premier argument est un objet, on suppose l'appel orchestrateur
    if (typeof promptOrOptions === 'object' && promptOrOptions !== null && promptOrOptions.systemPrompt) {
      return this._generateResponseFromOptions(promptOrOptions);
    } else {
      // Appel depuis un agent : (prompt, options?)
      return this.generateCompletion(promptOrOptions, options);
    }
  }

  private async _generateResponseFromOptions(options: {
    systemPrompt: string;
    userMessage: string;
    conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }) {
    try {
      const apiKey = this.isAzure ? process.env['AZURE_OPENAI_API_KEY'] : process.env['OPENAI_API_KEY'];
      if (!apiKey) {
        throw new Error(`${this.isAzure ? 'Azure OpenAI' : 'OpenAI'} API key not configured`);
      }
      // Build messages array
      const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
        { role: 'system', content: options.systemPrompt }
      ];
      // Add conversation history
      if (options.conversationHistory) {
        messages.push(...options.conversationHistory);
      }
      // Add current user message
      messages.push({ role: 'user', content: options.userMessage });
      // For Azure OpenAI, we don't specify the model in the request
      const modelToUse = this.isAzure ? undefined : (options.model || 'gpt-4o-mini');
      const response = await this.client.chat.completions.create({
        ...(modelToUse && { model: modelToUse }),
        messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 1000,
      });
      const content = response.choices[0]?.message?.content || '';
      const usage = response.usage;
      return {
        content,
        model: this.isAzure ? this.deploymentName : modelToUse,
        tokensUsed: usage?.total_tokens || 0,
        promptTokens: usage?.prompt_tokens || 0,
        completionTokens: usage?.completion_tokens || 0,
      };
    } catch (error) {
      logger.error(`${this.isAzure ? 'Azure OpenAI' : 'OpenAI'} generateResponse error:`, error);
      throw error;
    }
  }

  async analyzeSentiment(text: string) {
    const prompt = `Analyze the sentiment of the following text and return only one word: "positive", "negative", or "neutral".\n\nText: "${text}"`;
    const result = await this.generateCompletion(prompt, {
      maxTokens: 10,
      temperature: 0.1
    });
    if (result.success) {
      const sentiment = result.response.trim().toLowerCase();
      return {
        success: true,
        sentiment: ['positive', 'negative', 'neutral'].includes(sentiment) ? sentiment : 'neutral'
      };
    }
    return {
      success: false,
      sentiment: 'neutral',
      error: result.error || 'Failed to analyze sentiment'
    };
  }
} 