# Voice Bot with Multi-AI Integration

A TypeScript-based voice-enabled chatbot that uses both OpenAI and Google Gemini APIs to respond to user questions with automatic failover capabilities. The system intelligently falls back to Gemini when OpenAI encounters rate limits or quality issues.



## 🔗 Live Demo: [voice-bot-rqar.onrender.com](https://voice-bot-txpd.onrender.com/)
## 💻 GitHub Repository: [github.com/Laxmikant2002/voice-bot](https://github.com/Laxmikant2002/voice-bot)


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

This indicates that your OpenAI API key has exceeded its quota limit. The system will automatically fall back to using Gemini as designed. This is normal behavior and the voice bot will continue to function correctly by using Gemini instead.

To address this issue:

1. **Update your OpenAI billing**: Visit [OpenAI API Dashboard](https://platform.openai.com/account/billing) to add payment information or increase your quota.

2. **Use Gemini as primary**: To avoid the OpenAI error messages completely, you can configure the system to use Gemini as the primary AI service:
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

**Important**: When you see the OpenAI quota errors in your logs, this confirms that the failover mechanism is working correctly. Your voice bot continues functioning with Gemini responses even when OpenAI calls are failing.

## Common Issues and Solutions

| Issue | Error Message | Solution |
| ----- | ------------ | -------- |
| OpenAI Quota Exceeded | `RateLimitError: 429 You exceeded your current quota` | The system will automatically use Gemini instead. To fix: Add payment info in the OpenAI dashboard or remove the OpenAI key from .env to use only Gemini. |
| PowerShell Command Chaining | `The token '&&' is not a valid statement separator` | Use semicolons instead: `cd "path\to\project"; npm run build` |
| PowerShell Multiple Deletes | `A positional parameter cannot be found that accepts argument...` | Use `Remove-Item -Path "file1", "file2"` format |
| Voice Not Working | Browser shows microphone not accessible | Click the secure/lock icon in your browser and grant microphone permissions |
| Slow Initial Response | First response takes longer than expected | This is normal. The AI services establish a connection on the first request. Subsequent responses will be faster. |
| AWS SDK Warning | `The AWS SDK for JavaScript (v2) is in maintenance mode` | This is just a warning and doesn't affect functionality. You can upgrade to AWS SDK v3 in a future update if desired. |

For any other issues, check the server logs for detailed error information.

## Understanding the OpenAI to Gemini Fallback

This voice bot is designed with a robust fallback mechanism. Here's how it works:

1. **Primary AI Service**: The system first attempts to use OpenAI (if configured)
2. **Automatic Fallback**: If OpenAI fails for any reason (such as quota limits, as seen in the logs), the system automatically switches to Gemini
3. **Quality Checking**: Even when OpenAI returns a response, the system validates the quality and falls back to Gemini if the response is inadequate

When you see logs like this:
```
OpenAI streaming failed: RateLimitError: 429 You exceeded your current quota...
```

This is not an error in the application but rather confirmation that the fallback system is working as designed. The bot will continue to function using Gemini API instead.

### How to Test the Fallback:

1. Set both API keys in your .env file
2. Run the application: `npm run dev`
3. Ask the bot a question
4. In the logs, you'll see which AI service responded (OpenAI or Gemini)
5. If you're experiencing quota limits with OpenAI, you'll see the error followed by a successful Gemini response

This dual-AI approach ensures your voice bot remains operational even when one service is unavailable or has issues.

## License

MIT

## Deployment Guide (Render.com)

### Step 1: Pre-Deployment Checks

Run the pre-deployment check script to ensure your project is ready:

```powershell
# For Windows PowerShell
npm run deploy:check

# For other shells (bash, etc.)
npm run deploy:check
```

This will verify that:
- All required files exist
- The build process works
- Scripts are correctly configured

### Step 2: Push to Git Repository

1. Create a repository on GitHub, GitLab, or any Git provider
2. Initialize git in your project (if not already done):
   
   ```powershell
   # For Windows PowerShell
   git init
   git add .
   git commit -m "Initial commit, ready for deployment"
   git branch -M main
   git remote add origin <your-repository-url>
   git push -u origin main
   ```

### Step 3: Deploy to Render.com

1. Sign up or log in to [Render.com](https://render.com)
2. From your Dashboard, click "New +" and select "Web Service"
3. Connect your Git repository
4. Configure your Web Service:
   - Name: `voice-bot` (or your preferred name)
   - Environment: `Node`
   - Region: Choose the region closest to your users
   - Branch: `main` (or your default branch)
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Plan: `Free`

### Step 4: Configure Environment Variables

Add these environment variables in the Render dashboard:

```
NODE_ENV=production
PORT=10000
OPENAI_API_KEY=your_openai_api_key
GEMINI_API_KEY=your_gemini_api_key
PREFERRED_OPENAI_MODEL=gpt-3.5-turbo
PREFERRED_GEMINI_MODEL=gemini-2.0-flash
USE_MOCK_RESPONSES=false
USE_ENCRYPTED_KEYS=false
```

### Step 5: Deploy and Monitor

1. Click "Create Web Service"
2. Render will automatically build and deploy your application
3. You can monitor the build process in real-time
4. When deployment is complete, your app will be available at the URL provided by Render

### Step 6: Test Your Deployed Application

1. Test the voice bot functionality at your Render URL
2. Check that both OpenAI and Gemini fallback work correctly
3. Verify the streaming functionality works in production

### Terminal Commands for Deployment

```powershell
# For Windows PowerShell

# Install Render CLI (optional)
npm install -g @renderinc/cli

# Login to Render (if using CLI)
render login

# Deploy manually using Render CLI (optional)
render deploy

# Check deployment status
render list

# View logs of your deployed service
render logs
```

#### PowerShell Tips

When working with PowerShell (as seen in your terminal), note these differences:

1. For command chaining, use semicolons `;` instead of `&&`:
   ```powershell
   # INCORRECT in PowerShell:
   cd "c:\path\to\project" && npm run build
   
   # CORRECT in PowerShell:
   cd "c:\path\to\project"; npm run build
   ```

2. For deleting files, use `Remove-Item` instead of `del`:
   ```powershell
   # INCORRECT way to delete multiple files:
   del file1.txt file2.txt
   
   # CORRECT way to delete multiple files:
   Remove-Item -Path "file1.txt", "file2.txt"
   ```

### Important Notes

- **Free Tier Limitations**: The free tier will automatically spin down after 15 minutes of inactivity. The first request after inactivity may take up to 30 seconds as the service spins back up.
- **Resource Limits**: Free tier provides 512 MB RAM, shared CPU, and 750 hours of runtime per month.
- **Custom Domains**: To use a custom domain, you'll need to upgrade to a paid plan.
- **Environment Variables**: Never commit your API keys to Git. Always use Render's environment variables feature.
- **Automatic Deploys**: Render automatically rebuilds and deploys when you push changes to your repository.
- **Logs**: Access application logs directly from the Render dashboard for troubleshooting.
