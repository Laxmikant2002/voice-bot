"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    openaiApiKey: process.env.OPENAI_API_KEY || '',
    geminiApiKey: process.env.GEMINI_API_KEY || '',
    port: parseInt(process.env.PORT || '3000', 10),
    environment: process.env.NODE_ENV || 'development',
    useMockResponses: process.env.USE_MOCK_RESPONSES === 'true' || process.env.NODE_ENV === 'test',
    modelPreferences: {
        openai: process.env.PREFERRED_OPENAI_MODEL || 'gpt-3.5-turbo',
        gemini: process.env.PREFERRED_GEMINI_MODEL || 'gemini-2.0-flash'
    }
};
// Only warn about API keys in production
if (exports.config.environment === 'production' && !exports.config.openaiApiKey && !exports.config.geminiApiKey) {
    console.warn('Warning: No API keys found. In production, either OPENAI_API_KEY or GEMINI_API_KEY is recommended.');
}
//# sourceMappingURL=index.js.map