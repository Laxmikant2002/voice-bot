import { ChatMessage } from '../types';
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
