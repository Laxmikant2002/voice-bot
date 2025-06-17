import OpenAI from 'openai';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { ChatMessage } from '../types';
import { config } from '../config';

export class ChatService {
  private openai: OpenAI;
  private geminiModel: GenerativeModel | null = null;
  private messages: ChatMessage[] = [];
  private currentGeminiModel = '';

  constructor() {
    this.openai = new OpenAI({
      apiKey: config.openaiApiKey
    });
    
    // Initialize Gemini if API key is provided
    if (config.geminiApiKey) {
      try {
        const genAI = new GoogleGenerativeAI(config.geminiApiKey);
        
        // Try to use gemini-2.0-flash as the primary model (faster responses)
        try {
          this.geminiModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
          this.currentGeminiModel = 'gemini-2.0-flash';
          console.log('Gemini model gemini-2.0-flash initialized successfully');
        } 
        catch (primaryModelError) {
          console.warn('Could not initialize gemini-2.0-flash, trying alternative models:', primaryModelError);
          
          // Try alternative models if the primary one fails
          const fallbackModels = ['gemini-1.5-flash', 'gemini-pro', 'gemini-1.5-pro', 'gemini-1.0-pro'];
          let success = false;
          
          for (const modelName of fallbackModels) {
            try {
              this.geminiModel = genAI.getGenerativeModel({ model: modelName });
              this.currentGeminiModel = modelName;
              console.log(`Fallback to Gemini model ${modelName} successful`);
              success = true;
              break;
            } 
            catch (fallbackError) {
              console.warn(`Failed to initialize ${modelName}:`, fallbackError);
            }
          }
          
          if (!success) {
            throw new Error('All Gemini model initialization attempts failed');
          }
        }
      } catch (error) {
        console.error('Failed to initialize any Gemini model:', error);
        this.geminiModel = null;
        this.currentGeminiModel = '';
      }
    }
  }
  
  async getResponse(message: string): Promise<{ message: string; source?: string }> {
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
        const msgLower = message.toLowerCase();
        
        if (msgLower.includes('superpower')) {
          responseText = "My #1 superpower is definitely deep analytical thinking. I can quickly break down complex problems, see patterns others might miss, and develop systematic approaches to solving challenges. This has helped me tremendously in both my professional work and personal projects.";
          
        } else if (msgLower.includes('grow')) {
          responseText = "The top 3 areas I'd like to grow in are public speaking, technical leadership, and creative problem-solving. I'm working on speaking more confidently in group settings, guiding technical decisions with more authority, and approaching problems with fresh perspectives.";
          
        } else if (msgLower.includes('misconception')) {
          responseText = "The biggest misconception my coworkers have about me is that I'm always serious. While I do take my work seriously, I actually have quite a playful side that comes out once people get to know me. I love a good laugh and bringing humor into the workplace when appropriate.";
          
        } else if (msgLower.includes('boundaries')) {
          responseText = "I push my boundaries by deliberately taking on projects outside my comfort zone. I believe growth happens when we're challenged, so I regularly seek opportunities that require me to learn new skills or work in unfamiliar contexts. It's uncomfortable at first, but the satisfaction of overcoming these challenges is worth it.";
          
        } else if (msgLower.includes('life story')) {
          responseText = "In a few sentences, my life story involves growing up with a passion for solving puzzles, which led me to study technology and data analysis. I've worked across several industries, each time taking on more challenging problems. Outside of work, I enjoy outdoor activities that clear my mind and spending time with family and friends who keep me grounded.";
          
        } else if (msgLower.includes('india') && msgLower.includes('capital')) {
          responseText = "India's capital is New Delhi. As someone who appreciates diverse cultures, I find New Delhi fascinating with its blend of historical monuments and modern infrastructure. It serves as the seat of all three branches of the Indian government.";
          
        } else if (msgLower.includes('hobby') || msgLower.includes('free time')) {
          responseText = "In my free time, I enjoy hiking and landscape photography. There's something about capturing the perfect sunset or mountain vista that helps me disconnect from work and gain new perspectives. I also enjoy coding side projects that solve small problems in my daily life.";
          
        } else if (msgLower.includes('challenge') || msgLower.includes('difficult')) {
          responseText = "The most challenging situation I've faced recently was leading a project with constantly shifting requirements. I overcame it by establishing clear communication channels, setting realistic expectations, and building in flexibility to our timeline. The experience taught me a lot about adaptability.";
          
        } else if (msgLower.includes('book') || msgLower.includes('reading')) {
          responseText = "I've been reading quite a bit on systems thinking lately. The last book that really influenced me was 'Thinking in Systems' by Donella Meadows. It's changed how I approach complex problems both in my professional work and personal life.";
          
        } else if (msgLower.includes('strength') || msgLower.includes('weakness')) {
          responseText = "My greatest strength is my persistence when facing difficult problems. I don't give up easily. My biggest weakness is probably that I sometimes get too focused on perfecting details when a good-enough solution would suffice. I'm working on finding better balance there.";
          
        } else {
          responseText = "That's an interesting question! As someone who values continuous growth and analytical thinking, I'm always looking for new challenges to tackle and ways to push my boundaries. Could you ask me something about my superpower, areas for growth, or how I approach challenges?";
        }      } else {
        try {
          // Use the enhanced fallback mechanism for AI responses
          const response = await this.getAIResponse(systemMessage);
          responseText = response.text;
          
          // Return the response with source info (message history will be updated below)
          return { message: responseText, source: response.source };
        } catch (apiError) {
          console.error('All API attempts failed:', apiError);
          // Final fallback response when all APIs fail
          responseText = "I'm currently having trouble connecting to my knowledge base. As someone who values reliability, this is frustrating, but I'd be happy to try answering your question again in a moment.";
        }
      }
      
      // Add assistant response to history
      this.messages.push({
        role: 'assistant',
        content: responseText
      });
      
      // If we're using mock responses, indicate that in the response
      const source = useMockResponse ? "Mock Response" : undefined;

      return { message: responseText, source };
    } catch (error) {
      console.error('Error in getResponse:', error);
      throw error;
    }
  }

  // Private method to get response from AI services with quality validation and fallback
  private async getAIResponse(systemMessage: string): Promise<{ text: string; source: string }> {
    const openAIAvailable = config.openaiApiKey && !config.useMockResponses;
    const geminiAvailable = this.geminiModel && config.geminiApiKey && !config.useMockResponses;
    
    // Try OpenAI first if available
    if (openAIAvailable) {
      try {
        console.log('Attempting to use OpenAI API...');
        const completion = await this.openai.chat.completions.create({
          model: "gpt-3.5-turbo",
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
        
        const responseText = completion.choices[0].message.content;
        
        // Validate response quality
        if (this.isQualityResponse(responseText)) {
          console.log('OpenAI provided a quality response');
          return { text: responseText || '', source: "OpenAI" };
        }
        
        console.log('OpenAI response failed quality check, attempting fallback...');
      } 
      catch (openaiError: unknown) {
        const errorMessage = openaiError instanceof Error ? openaiError.message : 'Unknown error';
        console.error(`OpenAI API error (${errorMessage}), attempting fallback...`);
      }
    }
      // Try Gemini if available (either as fallback or primary if OpenAI not available)
    if (geminiAvailable && this.geminiModel) { // Explicit null check for TypeScript
      try {
        console.log(`Attempting to use Gemini API (model: ${this.currentGeminiModel})...`);
        
        // Convert messages for Gemini format
        const geminiMessages = this.messages.map(msg => ({
          role: msg.role,
          parts: [{ text: msg.content }]
        }));
        
        // Add system message at the beginning
        geminiMessages.unshift({
          role: 'user',
          parts: [{ text: `SYSTEM: ${systemMessage}` }]
        });
        
        // Configure generation parameters optimized for the current model
        const generationConfig = this.getOptimizedGenerationConfig();
        
        const result = await this.geminiModel.generateContent({
          contents: geminiMessages,
          generationConfig
        });
        
        const responseText = result.response.text();
        
        // Validate response quality
        if (this.isQualityResponse(responseText)) {
          console.log('Gemini provided a quality response');
          return { text: responseText, source: `Gemini (${this.currentGeminiModel})` };
        }
        
        console.log('Gemini response failed quality check');
        return { text: responseText, source: `Gemini (${this.currentGeminiModel}) - Low Quality` };
      } 
      catch (geminiError: unknown) {
        const errorMessage = geminiError instanceof Error ? geminiError.message : 'Unknown error';
        console.error(`Gemini API error (${errorMessage})`);
        throw new Error(`Both AI services failed or provided low quality responses`);
      }
    }
    
    // If we get here, neither service was available or both failed
    throw new Error('No AI service available or all services failed');
  }

  // Helper method to get optimized generation config based on the current model
  private getOptimizedGenerationConfig() {
    // Base configuration that works for all models
    const baseConfig = {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 300
    };
    
    // Add model-specific optimizations
    if (this.currentGeminiModel.includes('flash')) {
      // Flash models perform better with these settings
      return {
        ...baseConfig,
        temperature: 0.6, // Slightly lower temperature for more focused responses
      };
    }
    
    return baseConfig;
  }

  // Helper method to evaluate the quality of an AI response
  private isQualityResponse(text: string | null | undefined): boolean {
    if (!text) return false;
    
    // Minimum length check - responses should have some substance
    const minLength = 15;
    
    // Check for phrases that indicate low quality or non-answers
    const lowQualityPhrases = [
      "I don't know", 
      "I can't answer", 
      "I'm not sure how to respond",
      "I don't have enough information",
      "As an AI",
      "I'm sorry, but I cannot",
      "I cannot provide"
    ];
    
    // Check for overly generic responses
    const genericPhrases = [
      "That's an interesting question",
      "I'd need more context",
      "It depends on various factors"
    ];

    // Evaluate quality based on criteria
    const hasAdequateLength = text.length > minLength;
    const containsLowQualityPhrases = lowQualityPhrases.some(phrase => 
      text.toLowerCase().includes(phrase.toLowerCase())
    );
    const isOverlyGeneric = genericPhrases.some(phrase => 
      text.toLowerCase().includes(phrase.toLowerCase()) && text.length < 60
    );
    
    return hasAdequateLength && !containsLowQualityPhrases && !isOverlyGeneric;
  }

  clearConversation(): void {
    this.messages = [];
  }

  getHistory(): ChatMessage[] {
    return this.messages;
  }
}
