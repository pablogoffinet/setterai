import { BaseAgent } from './baseAgent';
import { BaseProvider } from '../providers/base';

export class MarketingAgent extends BaseAgent {
  constructor(provider: BaseProvider) {
    super(provider);
  }

  async processMessage(message: string, context?: any) {
    const prompt = `You are a creative marketing agent. Please respond to the following message with engaging marketing content:

Message: "${message}"

Please provide a marketing-focused response:`;

    return await this.generateResponse(prompt, {
      temperature: 0.9,
      maxTokens: 300
    });
  }
} 