import { BaseProvider } from '../providers/base';

export class SentimentAnalyzer {
  private provider: BaseProvider;

  constructor(provider: BaseProvider) {
    this.provider = provider;
  }

  async analyze(text: string) {
    return await this.provider.analyzeSentiment(text);
  }
} 