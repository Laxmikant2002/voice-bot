import { VoiceBotConfig } from '../types';
/**
 * Application configuration with support for encrypted API keys
 */
export declare const config: VoiceBotConfig;
/**
 * Initializes configuration with decrypted API keys from AWS KMS
 */
export declare const initializeEncryptedConfig: () => Promise<void>;
