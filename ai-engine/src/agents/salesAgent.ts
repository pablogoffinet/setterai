import { BaseAgent } from './baseAgent';
import { BaseProvider } from '../providers/base';

export class SalesAgent extends BaseAgent {
  constructor(provider: BaseProvider) {
    super(provider);
  }

  async processMessage(message: string, context?: any) {
    const prompt = `You are a professional sales agent. Please respond to the following prospect message in a persuasive but not pushy manner:

Prospect message: "${message}"

Please provide a sales-focused response:`;

    return await this.generateResponse(prompt, {
      temperature: 0.8,
      maxTokens: 300
    });
  }
} 