export interface BaseProvider {
  generateCompletion(prompt: string, options?: any): Promise<{
    success: boolean;
    response?: string;
    error?: string;
    usage?: any;
  }>;
  
  analyzeSentiment(text: string): Promise<{
    success: boolean;
    sentiment?: string;
    error?: string;
  }>;
} 