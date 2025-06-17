"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeEncryptedConfig = exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const kmsUtil_1 = require("../utils/kmsUtil");
/**
 * Load environment variables from .env file
 */
dotenv_1.default.config();
/**
 * Application configuration with support for encrypted API keys
 */
exports.config = {
    openaiApiKey: process.env.OPENAI_API_KEY || '',
    geminiApiKey: process.env.GEMINI_API_KEY || '',
    port: parseInt(process.env.PORT || '3000', 10),
    environment: process.env.NODE_ENV || 'development',
    useMockResponses: process.env.USE_MOCK_RESPONSES === 'true' || process.env.NODE_ENV === 'test',
    modelPreferences: {
        openai: process.env.PREFERRED_OPENAI_MODEL || 'gpt-3.5-turbo',
        gemini: process.env.PREFERRED_GEMINI_MODEL || 'gemini-2.0-flash'
    },
    useEncryptedKeys: process.env.USE_ENCRYPTED_KEYS === 'true'
};
/**
 * Initializes configuration with decrypted API keys from AWS KMS
 */
const initializeEncryptedConfig = async () => {
    if (!exports.config.useEncryptedKeys) {
        // Do nothing if encryption is not enabled
        console.log('Encrypted keys not enabled, using regular .env keys');
        return;
    }
    try {
        console.log('Initializing with encrypted API keys...');
        const kmsUtil = new kmsUtil_1.KmsUtil(process.env.AWS_REGION);
        // Decrypt OpenAI key if available
        if (process.env.ENCRYPTED_OPENAI_API_KEY) {
            exports.config.openaiApiKey = await kmsUtil.decryptApiKey(process.env.ENCRYPTED_OPENAI_API_KEY);
            console.log('OpenAI API key decrypted successfully');
        }
        // Decrypt Gemini key if available
        if (process.env.ENCRYPTED_GEMINI_API_KEY) {
            exports.config.geminiApiKey = await kmsUtil.decryptApiKey(process.env.ENCRYPTED_GEMINI_API_KEY);
            console.log('Gemini API key decrypted successfully');
        }
    }
    catch (error) {
        console.error('Error initializing encrypted keys:', error);
        throw new Error('Failed to decrypt API keys. Please check your KMS configuration.');
    }
};
exports.initializeEncryptedConfig = initializeEncryptedConfig;
// Only warn about API keys in production
if (exports.config.environment === 'production' && !exports.config.openaiApiKey && !exports.config.geminiApiKey) {
    console.warn('Warning: No API keys found. In production, either OPENAI_API_KEY or GEMINI_API_KEY is recommended.');
}
//# sourceMappingURL=index.js.map