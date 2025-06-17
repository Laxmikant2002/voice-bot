import dotenv from 'dotenv';
import { VoiceBotConfig } from '../types';
import { KmsUtil } from '../utils/kmsUtil';

dotenv.config();

// Create initial config with encrypted keys
export const config: VoiceBotConfig = {
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  port: parseInt(process.env.PORT || '3000', 10),
  environment: (process.env.NODE_ENV as 'development' | 'production') || 'development',
  useMockResponses: process.env.USE_MOCK_RESPONSES === 'true' || process.env.NODE_ENV === 'test',
  modelPreferences: {
    openai: process.env.PREFERRED_OPENAI_MODEL || 'gpt-3.5-turbo',
    gemini: process.env.PREFERRED_GEMINI_MODEL || 'gemini-2.0-flash'
  },
  useEncryptedKeys: process.env.USE_ENCRYPTED_KEYS === 'true'
};

// Setup function to initialize with decrypted keys
export const initializeEncryptedConfig = async (): Promise<void> => {
  if (!config.useEncryptedKeys) {
    // Do nothing if encryption is not enabled
    console.log('Encrypted keys not enabled, using regular .env keys');
    return;
  }

  try {
    console.log('Initializing with encrypted API keys...');
    const kmsUtil = new KmsUtil(process.env.AWS_REGION);
    
    // Decrypt OpenAI key if available
    if (process.env.ENCRYPTED_OPENAI_API_KEY) {
      config.openaiApiKey = await kmsUtil.decryptApiKey(process.env.ENCRYPTED_OPENAI_API_KEY);
      console.log('OpenAI API key decrypted successfully');
    }
    
    // Decrypt Gemini key if available
    if (process.env.ENCRYPTED_GEMINI_API_KEY) {
      config.geminiApiKey = await kmsUtil.decryptApiKey(process.env.ENCRYPTED_GEMINI_API_KEY);
      console.log('Gemini API key decrypted successfully');
    }
    
  } catch (error) {
    console.error('Error initializing encrypted keys:', error);
    throw new Error('Failed to decrypt API keys. Please check your KMS configuration.');
  }
};

// Only warn about API keys in production
if (config.environment === 'production' && !config.openaiApiKey && !config.geminiApiKey) {
  console.warn('Warning: No API keys found. In production, either OPENAI_API_KEY or GEMINI_API_KEY is recommended.');
}