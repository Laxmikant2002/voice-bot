# Voice Bot with ChatGPT API

A TypeScript-based voice-enabled chatbot that uses OpenAI's ChatGPT API to respond to user questions in a conversational manner.

## Features

- Real-time chat interactions using ChatGPT API
- TypeScript implementation for better type safety and maintainability
- RESTful API endpoints for chat functionality
- Error handling and input validation
- Environment-based configuration

## Project Structure

```
voice-bot/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Request handlers
│   ├── services/       # Business logic
│   ├── types/         # TypeScript type definitions
│   ├── routes/        # API routes
│   ├── middleware/    # Custom middleware
│   └── utils/         # Utility functions
├── public/            # Static files
├── dist/             # Compiled JavaScript files
├── package.json
├── tsconfig.json
├── nodemon.json
└── .env              # Environment variables (create this file)
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
   OPENAI_API_KEY=your_api_key_here
   PORT=3000
   NODE_ENV=development
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
  - Send a message to the chatbot
  - Request body: `{ "message": "Your question here" }`

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

## License

MIT
