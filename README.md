# Voice Bot with Multi-AI Integration

A TypeScript-based voice-enabled chatbot that uses both OpenAI and Google Gemini APIs to respond to user questions with automatic failover capabilities. The system intelligently falls back to Gemini when OpenAI encounters rate limits or quality issues.

## Features

- Real-time chat interactions using OpenAI (with auto-fallback to Gemini)
- Smart failover between AI providers for reliability and cost management
- Real-time streaming responses for a better user experience
- Voice response optimization for natural text-to-speech output
- TypeScript implementation for better type safety and maintainability
- Dynamic AI model selection via configuration
- Intelligent conversation context management with token limiting
- Circuit breaker pattern for resilience against API failures
- Enhanced security with optional AWS KMS encryption for API keys

## Project Structure

```
voice-bot/
├── src/
│   ├── config/         # Configuration and environment setup
│   ├── controllers/    # Request handlers with streaming support
│   ├── services/       # AI integration and business logic
│   ├── types/          # TypeScript type definitions
│   ├── routes/         # API routes including streaming endpoints
│   ├── utils/          # Utilities including KMS encryption
│   └── server.ts       # Application entry point
├── public/             # Frontend assets and browser client
│   ├── app.js          # Client-side application with streaming support
│   ├── styles.css      # Styling including streaming animations
│   └── index.html      # Main HTML entry point
├── dist/               # Compiled JavaScript files
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── .env                # Environment variables (create this file)
```

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenAI API key

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd voice-bot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   # Required API Keys (at least one is needed)
   # For quota-limited OpenAI accounts, comment this out to use only Gemini
   OPENAI_API_KEY=your_api_key_here
   
   # Google Gemini API key (recommended as reliable fallback)
   GEMINI_API_KEY=your_gemini_api_key_here
   
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   
   # AI Model Configuration
   PREFERRED_OPENAI_MODEL=gpt-3.5-turbo
   PREFERRED_GEMINI_MODEL=gemini-2.0-flash
   USE_MOCK_RESPONSES=false
   
   # Enhanced Security (optional)
   USE_ENCRYPTED_KEYS=false
   # ENCRYPTED_OPENAI_API_KEY=base64_encoded_encrypted_key_here
   # ENCRYPTED_GEMINI_API_KEY=base64_encoded_encrypted_key_here
   # AWS_REGION=us-east-1
   ```

4. Build the project:
   ```bash
   npm run build
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

- `POST /api/chat/message`
  - Send a message to the chatbot (standard request/response)
  - Request body: `{ "message": "Your question here" }`
  - Response: `{ "message": "AI response", "source": "OpenAI/Gemini model info" }`

- `POST /api/chat/stream`
  - Get a streaming response from the chatbot (real-time)
  - Request body: `{ "message": "Your question here" }`
  - Response: Server-sent events with chunks of the response

- `POST /api/chat/clear`
  - Clear the conversation history

## Development

- Run in development mode with hot reload:
  ```bash
  npm run dev
  ```

- Build the project:
  ```bash
  npm run build
  ```

- Run tests:
  ```bash
  npm test
  ```

- Lint the code:
  ```bash
  npm run lint
  ```

## Production

For production deployment:

1. Set `NODE_ENV=production` in your environment
2. Build the project: `npm run build`
3. Start the server: `npm start`

## Configuration Options

### AI Models
- **OpenAI Models**: Configure via `PREFERRED_OPENAI_MODEL` (default: gpt-3.5-turbo)
  - Options: gpt-3.5-turbo, gpt-4, gpt-4-turbo, etc.
  
- **Gemini Models**: Configure via `PREFERRED_GEMINI_MODEL` (default: gemini-2.0-flash)
  - Options: gemini-2.0-flash, gemini-1.5-flash, gemini-pro, gemini-1.5-pro

### Security Options
- Enable encrypted keys: `USE_ENCRYPTED_KEYS=true` 
- Configure AWS region: `AWS_REGION=your-region`
- Store encrypted keys: `ENCRYPTED_OPENAI_API_KEY` and `ENCRYPTED_GEMINI_API_KEY`

### Development Options
- Enable mock responses: `USE_MOCK_RESPONSES=true`
- Set environment: `NODE_ENV=development` or `NODE_ENV=production`
- Configure port: `PORT=3000`

## Advanced Features

### Multi-AI Failover System
- Primary/fallback architecture between OpenAI and Google Gemini
- Handles quota-limits by automatically switching to alternative provider
- Quality-based failover (not just error handling)
- Cost optimization by using fallback models when primary is unavailable

### Real-time Streaming Responses
- Server-sent events for progressive content delivery
- Real-time typing indicator and response rendering
- Automatic fallback for browsers without streaming support

### Context Management
- Automatic token counting and history truncation
- Prioritized message retention for natural conversations
- Optimized context window utilization

### Voice Optimization
- Text preprocessing for natural speech patterns
- Removal of markdown and special characters
- Enhanced pronunciation of numbers, symbols, and abbreviations
- Natural pausing and sentence structuring

### Enhanced Security
- AWS KMS integration for API key encryption
- Runtime decryption of sensitive credentials
- Zero plaintext storage of API keys

### Resilience Patterns
- Circuit breaker for API failure protection
- Automatic recovery after cooling period
- Graceful degradation during service disruptions

## Troubleshooting

### API Quota Issues

If you see logs like the following:
```
OpenAI streaming failed: RateLimitError: 429 You exceeded your current quota, please check your plan and billing details.
```

This indicates that your OpenAI API key has exceeded its quota limit. The system will automatically fall back to using Gemini as designed. To resolve this:

1. **Update your OpenAI billing**: Visit [OpenAI API Dashboard](https://platform.openai.com/account/billing) to add payment information or increase your quota.

2. **Use Gemini as primary**: If you prefer to use Gemini by default and avoid the failed OpenAI attempts:
   ```
   # In .env file
   # Comment out or remove the OpenAI API key
   # OPENAI_API_KEY=your_key_here
   ```

3. **Force mock responses**: For development without any API costs:
   ```
   # In .env file
   USE_MOCK_RESPONSES=true
   ```

Note: The failover system is working correctly when you see these errors - the bot continues functioning with Gemini responses even though OpenAI calls are failing.

## License

MIT
