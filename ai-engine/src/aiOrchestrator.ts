import { logger } from './utils/logger';
import { OpenAIProvider } from './providers/openai';
import { ClaudeProvider } from './providers/claude';
import { MistralProvider } from './providers/mistral';
import { BaseProvider } from './providers/base';
import { BaseAgent } from './agents/baseAgent';
import { CustomerSupportAgent } from './agents/customerSupport';
import { SalesAgent } from './agents/salesAgent';
import { MarketingAgent } from './agents/marketingAgent';
import { SentimentAnalyzer } from './processors/sentimentAnalyzer';
import { IntentClassifier } from './processors/intentClassifier';

export interface MessageProcessRequest {
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

export interface ProcessResult {
  response: string;
  sentiment?: any;
  intent?: any;
  confidence: number;
  model: string;
  tokensUsed: number;
}

export class AIOrchestrator {
  private providers: Map<string, BaseProvider> = new Map();
  private agents: Map<string, BaseAgent> = new Map();
  private sentimentAnalyzer: SentimentAnalyzer;
  private intentClassifier: IntentClassifier;

  constructor() {
    // These will be initialized after providers are set up
  }

  async initialize(): Promise<void> {
    try {
      // Debug logging
      console.log('🔍 Debug - Environment variables:');
      console.log('AZURE_OPENAI_API_KEY exists:', !!process.env.AZURE_OPENAI_API_KEY);
      console.log('AZURE_OPENAI_ENDPOINT exists:', !!process.env.AZURE_OPENAI_ENDPOINT);
      console.log('OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY);
      
      // Initialize AI providers - Prioritize Azure OpenAI
      if (process.env['AZURE_OPENAI_API_KEY'] && process.env['AZURE_OPENAI_ENDPOINT']) {
        console.log('🟡 Attempting to create Azure OpenAI provider...');
        const openai = new OpenAIProvider(process.env['AZURE_OPENAI_API_KEY'], {
          endpoint: process.env['AZURE_OPENAI_ENDPOINT'],
          apiVersion: process.env['AZURE_OPENAI_API_VERSION'],
          deploymentName: process.env['AZURE_OPENAI_DEPLOYMENT_NAME']
        });
        this.providers.set('openai', openai);
        console.log('✅ Azure OpenAI provider set in map, size:', this.providers.size);
        logger.info('✅ Azure OpenAI provider initialized');
      } else if (process.env['OPENAI_API_KEY']) {
        console.log('🟡 Attempting to create OpenAI provider...');
        const openai = new OpenAIProvider(process.env['OPENAI_API_KEY']);
        this.providers.set('openai', openai);
        console.log('✅ OpenAI provider set in map, size:', this.providers.size);
        logger.info('✅ OpenAI provider initialized');
      } else {
        console.log('❌ Neither AZURE_OPENAI_API_KEY nor OPENAI_API_KEY found in environment');
      }

      if (process.env['CLAUDE_API_KEY']) {
        const claude = new ClaudeProvider(process.env['CLAUDE_API_KEY']);
        this.providers.set('claude', claude);
        logger.info('✅ Claude provider initialized');
      }

      if (process.env['MISTRAL_API_KEY']) {
        const mistral = new MistralProvider(process.env['MISTRAL_API_KEY']);
        this.providers.set('mistral', mistral);
        logger.info('✅ Mistral provider initialized');
      }

      // Initialize specialized agents
      this.agents.set('CUSTOMER_SUPPORT', new CustomerSupportAgent());
      this.agents.set('SALES', new SalesAgent());
      this.agents.set('MARKETING', new MarketingAgent());

      // Initialize processors with the default provider
      const defaultProvider = this.providers.get('openai');
      if (defaultProvider) {
        this.sentimentAnalyzer = new SentimentAnalyzer(defaultProvider);
        this.intentClassifier = new IntentClassifier(defaultProvider);
      }

      console.log('🔍 Final providers map keys:', Array.from(this.providers.keys()));
      logger.info('✅ AI Orchestrator initialized successfully');
    } catch (error) {
      logger.error('❌ Failed to initialize AI Orchestrator:', error);
      throw error;
    }
  }

  async processMessage(request: MessageProcessRequest): Promise<ProcessResult> {
    const { message, agentConfig, context } = request;
    
    try {
      // Get the appropriate provider (default to openai)
      const provider = this.providers.get('openai');
      
      if (!provider) {
        throw new Error('No AI provider available');
      }

      // Build system prompt based on agent type
      let systemPrompt = agentConfig.prompt || '';
      
      if (!systemPrompt) {
        switch (agentConfig.type) {
          case 'SALES':
            systemPrompt = `Tu es un assistant commercial expert en prospection LinkedIn. 

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
- Personnaliser selon le profil du prospect`;
            break;
          case 'CUSTOMER_SUPPORT':
            systemPrompt = `Tu es un assistant de support client expert et bienveillant.

Ton rôle :
- Aider les utilisateurs avec leurs questions techniques
- Être empathique et compréhensif
- Fournir des solutions claires et étape par étape
- Escalader si nécessaire vers un humain

Règles importantes :
- Réponses concises mais complètes
- Toujours proposer une solution concrète
- Demander des clarifications si nécessaire
- Maintenir un ton professionnel et aidant`;
            break;
          case 'MARKETING':
            systemPrompt = `Tu es un expert en marketing digital spécialisé dans l'engagement.

Ton rôle :
- Créer du contenu engageant et viral
- Adapter le message selon la plateforme
- Utiliser des techniques de storytelling
- Encourager l'interaction et le partage

Règles importantes :
- Être créatif et original
- Utiliser des emojis appropriés
- Créer de l'urgence ou de l'exclusivité
- Appeler à l'action clairement`;
            break;
          default:
            systemPrompt = `Tu es un assistant IA utile et professionnel.`;
        }
      }

      // Generate response using the provider
      const response = await provider.generateResponse({
        systemPrompt,
        userMessage: message,
        conversationHistory: context?.conversationHistory || [],
        temperature: agentConfig.temperature || 0.7,
        maxTokens: agentConfig.maxTokens || 1000,
      });

      return {
        response: response.content,
        sentiment: { sentiment: 'neutral', confidence: 0.8 },
        intent: { intent: 'general', confidence: 0.8 },
        confidence: 0.8,
        model: response.model || 'gpt-4o',
        tokensUsed: response.tokensUsed || 0,
      };

    } catch (error) {
      logger.error('Error processing message:', error);
      throw error;
    }
  }

  async analyzeSentiment(text: string): Promise<any> {
    return this.sentimentAnalyzer.analyze(text);
  }

  async classifyIntent(text: string, possibleIntents?: string[]): Promise<any> {
    return this.intentClassifier.classify(text, possibleIntents);
  }

  private parseModel(modelString: string): { provider: string; model: string } {
    // Format: "provider:model" or just "model" (defaults to openai)
    const parts = modelString.split(':');
    
    if (parts.length === 2) {
      return { provider: parts[0], model: parts[1] };
    }
    
    // Default mappings
    if (modelString.startsWith('gpt')) {
      return { provider: 'openai', model: modelString };
    }
    if (modelString.startsWith('claude')) {
      return { provider: 'claude', model: modelString };
    }
    if (modelString.startsWith('mistral')) {
      return { provider: 'mistral', model: modelString };
    }
    
    // Default to OpenAI GPT-4
    return { provider: 'openai', model: 'gpt-4' };
  }

  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys());
  }

  getAvailableAgents(): string[] {
    return Array.from(this.agents.keys());
  }
} 