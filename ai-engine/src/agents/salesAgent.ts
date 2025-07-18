import { BaseAgent } from './baseAgent';
import { BaseProvider } from '../providers/base';

export class SalesAgent extends BaseAgent {
  constructor(provider: BaseProvider) {
    super(provider);
  }

  async processMessage(message: string) {
    const prompt = `You are a sales expert. Please help with sales-related questions and strategies based on the following request:

Request: "${message}"

Please provide sales guidance:`;

    return await this.generateResponse(prompt, {
      temperature: 0.7,
      maxTokens: 350
    });
  }
} 