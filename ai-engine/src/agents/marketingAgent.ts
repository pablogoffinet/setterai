import { BaseAgent } from './baseAgent';
import { BaseProvider } from '../providers/base';

export class MarketingAgent extends BaseAgent {
  constructor(provider: BaseProvider) {
    super(provider);
  }

  async processMessage(message: string) {
    const prompt = `You are a marketing expert. Please help create engaging marketing content based on the following request:

Request: "${message}"

Please provide marketing content:`;

    return await this.generateResponse(prompt, {
      temperature: 0.8,
      maxTokens: 400
    });
  }
} 