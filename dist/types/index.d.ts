/**
 * Represents a message in the chat conversation
 */
export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}
/**
 * Response format for chat messages
 */
export interface ChatResponse {
    message: string;
    audioUrl?: string;
}
/**
 * AI model configuration for each provider
 */
export interface ModelPreferences {
    openai: string;
    gemini: string;
}
/**
 * Main configuration for the Voice Bot application
 */
export interface VoiceBotConfig {
    openaiApiKey: string;
    geminiApiKey: string;
    port: number;
    environment: 'development' | 'production';
    useMockResponses: boolean;
    modelPreferences: ModelPreferences;
    useEncryptedKeys?: boolean;
}
/**
 * Standard error response format
 */
export interface ErrorResponse {
    error: string;
    message: string;
    statusCode: number;
}
