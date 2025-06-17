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
    environment: process.env.NODE_ENV || 'development'
};
if (!exports.config.openaiApiKey && !exports.config.geminiApiKey) {
    throw new Error('Either OPENAI_API_KEY or GEMINI_API_KEY is required in environment variables');
}
//# sourceMappingURL=index.js.map