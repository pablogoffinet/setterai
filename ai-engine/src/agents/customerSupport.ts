import { BaseAgent } from './baseAgent';
import { BaseProvider } from '../providers/base';

export class CustomerSupportAgent extends BaseAgent {
  constructor(provider: BaseProvider) {
    super(provider);
  }

  async processMessage(message: string, context?: any) {
    const prompt = `You are a helpful customer support agent. Please respond to the following customer message in a professional and helpful manner:

Customer message: "${message}"

Please provide a helpful response:`;

    return await this.generateResponse(prompt, {
      temperature: 0.7,
      maxTokens: 300
    });
  }
} 