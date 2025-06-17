"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const openai_1 = __importDefault(require("openai"));
const config_1 = require("../config");
class ChatService {
    constructor() {
        this.messages = [];
        this.openai = new openai_1.default({
            apiKey: config_1.config.openaiApiKey
        });
    }
    async getResponse(message) {
        try {
            if (!message.trim()) {
                throw new Error('Message cannot be empty');
            }
            // Add user message to history
            this.messages.push({
                role: 'user',
                content: message
            });
            // Define the persona instructions for ChatGPT
            const systemMessage = `You are responding as the user's personal voice bot. 
      Answer questions about yourself as if you were the user, based on these personal characteristics:
      
      - You're ambitious and goal-oriented
      - Your superpower is deep analytical thinking
      - You want to grow in public speaking, technical leadership, and creative problem-solving
      - People might think you're always serious, but you have a playful side
      - You push your boundaries by taking on challenging projects outside your comfort zone
      
      Answer honestly and authentically, as if you were sharing your own personal experiences and traits.`;
            // Generate response with OpenAI
            const completion = await this.openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    { role: "system", content: systemMessage },
                    ...this.messages.map(msg => ({
                        role: msg.role,
                        content: msg.content
                    }))
                ],
                temperature: 0.7,
                max_tokens: 300,
            });
            const responseText = completion.choices[0].message.content || "I'm not sure how to respond to that.";
            // Add assistant response to history
            this.messages.push({
                role: 'assistant',
                content: responseText
            });
            return { message: responseText };
        }
        catch (error) {
            console.error('Error in getResponse:', error);
            throw error;
        }
    }
    clearConversation() {
        this.messages = [];
    }
    getHistory() {
        return this.messages;
    }
}
exports.ChatService = ChatService;
//# sourceMappingURL=chatService.js.map