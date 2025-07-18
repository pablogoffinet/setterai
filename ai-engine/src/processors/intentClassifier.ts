import { BaseProvider } from '../providers/base';

export class IntentClassifier {
  private provider: BaseProvider;

  constructor(provider: BaseProvider) {
    this.provider = provider;
  }

  async classify(text: string) {
    const prompt = `Classify the intent of the following message. Return only one word from: "question", "complaint", "request", "compliment", "other".

Message: "${text}"

Intent:`;

    const result = await this.provider.generateCompletion(prompt, {
      temperature: 0.1,
      maxTokens: 10
    });

    if (result.success && result.response) {
      const intent = result.response.trim().toLowerCase();
      return {
        success: true,
        intent: ['question', 'complaint', 'request', 'compliment', 'other'].includes(intent) ? intent : 'other'
      };
    }

    return {
      success: false,
      error: result.error || 'Failed to classify intent'
    };
  }
} 