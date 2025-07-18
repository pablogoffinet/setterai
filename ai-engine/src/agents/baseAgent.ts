import { BaseProvider } from '../providers/base';

export abstract class BaseAgent {
  protected provider: BaseProvider;

  constructor(provider: BaseProvider) {
    this.provider = provider;
  }

  abstract processMessage(message: string, context?: any): Promise<{
    success: boolean;
    response?: string;
    error?: string;
  }>;

  protected async generateResponse(prompt: string, options?: any) {
    return await this.provider.generateCompletion(prompt, options);
  }
} 