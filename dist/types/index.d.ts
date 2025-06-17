export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}
export interface ChatResponse {
    message: string;
    audioUrl?: string;
}
export interface VoiceBotConfig {
    openaiApiKey: string;
    geminiApiKey: string;
    port: number;
    environment: 'development' | 'production';
}
export interface ErrorResponse {
    error: string;
    message: string;
    statusCode: number;
}
