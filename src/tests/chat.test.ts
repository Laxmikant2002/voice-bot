import { ChatService } from '../services/chatService';

// Mock OpenAI
jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => {
    return {
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [
              {
                message: {
                  content: 'This is a mocked response for testing purposes.'
                }
              }
            ]
          })
        }
      }
    };
  });
});

describe('ChatService', () => {
  let chatService: ChatService;

  beforeEach(() => {
    chatService = new ChatService();
    // Clear jest mocks between tests
    jest.clearAllMocks();
  });

  const testQuestions = [
    'What should we know about your life story in a few sentences?',
    'What\'s your #1 superpower?'
  ];

  test('should get response from OpenAI', async () => {
    for (const question of testQuestions) {
      const response = await chatService.getResponse(question);
      expect(response).toHaveProperty('message');
      expect(typeof response.message).toBe('string');
      expect(response.message.length).toBeGreaterThan(0);
    }
  });

  test('should clear conversation history', () => {
    chatService.clearConversation();
    // Using the getHistory method to verify conversation is cleared
    expect(chatService.getHistory()).toEqual([]);
  });

  test('should handle empty message', async () => {
    await expect(chatService.getResponse('')).rejects.toThrow();
  });
}); 