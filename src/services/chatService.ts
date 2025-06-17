import OpenAI from 'openai';
import { ChatMessage } from '../types';
import { config } from '../config';

export class ChatService {
  private openai: OpenAI;
  private messages: ChatMessage[] = [];

  constructor() {
    this.openai = new OpenAI({
      apiKey: config.openaiApiKey
    });
  }
  async getResponse(message: string): Promise<{ message: string }> {
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

      let responseText;
        // Use config to determine if we should use a mock response
      const useMockResponse = config.useMockResponses || !config.openaiApiKey;
      
      if (useMockResponse) {
        // Provide mock responses for testing without API calls
        if (message.toLowerCase().includes('superpower')) {
          responseText = "My #1 superpower is definitely deep analytical thinking. I can quickly break down complex problems, see patterns others might miss, and develop systematic approaches to solving challenges. This has helped me tremendously in both my professional work and personal projects.";
        } else if (message.toLowerCase().includes('grow')) {
          responseText = "The top 3 areas I'd like to grow in are public speaking, technical leadership, and creative problem-solving. I'm working on speaking more confidently in group settings, guiding technical decisions with more authority, and approaching problems with fresh perspectives.";
        } else if (message.toLowerCase().includes('misconception')) {
          responseText = "The biggest misconception my coworkers have about me is that I'm always serious. While I do take my work seriously, I actually have quite a playful side that comes out once people get to know me. I love a good laugh and bringing humor into the workplace when appropriate.";
        } else if (message.toLowerCase().includes('boundaries')) {
          responseText = "I push my boundaries by deliberately taking on projects outside my comfort zone. I believe growth happens when we're challenged, so I regularly seek opportunities that require me to learn new skills or work in unfamiliar contexts. It's uncomfortable at first, but the satisfaction of overcoming these challenges is worth it.";
        } else if (message.toLowerCase().includes('life story')) {
          responseText = "In a few sentences, my life story involves growing up with a passion for solving puzzles, which led me to study technology and data analysis. I've worked across several industries, each time taking on more challenging problems. Outside of work, I enjoy outdoor activities that clear my mind and spending time with family and friends who keep me grounded.";
        } else {
          responseText = "That's an interesting question! As someone who values continuous growth and analytical thinking, I'm always looking for new challenges to tackle and ways to push my boundaries. Could you ask me something about my superpower, areas for growth, or how I approach challenges?";
        }
      } else {
        try {
          // Generate response with OpenAI
          const completion = await this.openai.chat.completions.create({
            model: "gpt-3.5-turbo", // Using a more widely available model
            messages: [
              { role: "system", content: systemMessage },
              ...this.messages.map(msg => ({ 
                role: msg.role as 'user' | 'assistant', 
                content: msg.content 
              }))
            ],
            temperature: 0.7,
            max_tokens: 300,
          });
          
          responseText = completion.choices[0].message.content || "I'm not sure how to respond to that.";
        } catch (apiError) {
          console.error('OpenAI API error:', apiError);
          // Fallback response if API fails
          responseText = "I'm currently having trouble connecting to my knowledge base. As someone who values reliability, this is frustrating, but I'd be happy to try answering your question again in a moment.";
        }
      }

      // Add assistant response to history
      this.messages.push({
        role: 'assistant',
        content: responseText
      });

      return { message: responseText };
    } catch (error) {
      console.error('Error in getResponse:', error);
      throw error;
    }
  }

  clearConversation(): void {
    this.messages = [];
  }

  getHistory(): ChatMessage[] {
    return this.messages;
  }
} 