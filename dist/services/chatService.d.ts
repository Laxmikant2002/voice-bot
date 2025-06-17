import { ChatMessage } from '../types';
/**
 * ChatService handles interactions with multiple AI providers (OpenAI and Google Gemini)
 * with automatic fallback between them when one fails or returns low-quality responses
 */
export declare class ChatService {
    private openai;
    private geminiModel;
    private messages;
    private currentGeminiModel;
    private apiFailureCount;
    private circuitBreakerThreshold;
    constructor();
    getResponse(message: string): Promise<{
        message: string;
        source?: string;
    }>;
    getStreamingResponse(message: string): AsyncGenerator<{
        chunk: string;
        source: string;
    }>;
    private getAIResponse;
    private getOptimizedGenerationConfig;
    private isQualityResponse;
    private countTokens;
    private truncateHistory;
    private estimateTokens;
    clearConversation(): void;
    getHistory(): ChatMessage[];
    private useFallbackStrategy;
    private getGeminiResponse;
    private getMockResponse;
}
