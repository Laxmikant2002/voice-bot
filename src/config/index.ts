import dotenv from 'dotenv';
import { VoiceBotConfig } from '../types';

dotenv.config();

export const config: VoiceBotConfig = {
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  port: parseInt(process.env.PORT || '3000', 10),
  environment: (process.env.NODE_ENV as 'development' | 'production') || 'development',
  useMockResponses: process.env.USE_MOCK_RESPONSES === 'true' || process.env.NODE_ENV === 'test'
};

// Only warn about API keys in production
if (config.environment === 'production' && !config.openaiApiKey && !config.geminiApiKey) {
  console.warn('Warning: No API keys found. In production, either OPENAI_API_KEY or GEMINI_API_KEY is recommended.');
}