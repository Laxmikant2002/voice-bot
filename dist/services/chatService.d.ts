import { ChatMessage } from '../types';
export declare class ChatService {
    private openai;
    private messages;
    constructor();
    getResponse(message: string): Promise<{
        message: string;
    }>;
    clearConversation(): void;
    getHistory(): ChatMessage[];
}
