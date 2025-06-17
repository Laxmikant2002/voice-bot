import { ChatMessage } from '../types';
export declare class ChatService {
    private openai;
    private geminiModel;
    private messages;
    private currentGeminiModel;
    constructor();
    getResponse(message: string): Promise<{
        message: string;
        source?: string;
    }>;
    private getAIResponse;
    private getOptimizedGenerationConfig;
    private isQualityResponse;
    clearConversation(): void;
    getHistory(): ChatMessage[];
}
