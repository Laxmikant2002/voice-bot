import { Request, Response } from 'express';
import { ChatService } from '../services/chatService';
import { ErrorResponse } from '../types';

const chatService = new ChatService();

export const chatController = {
  async handleMessage(req: Request, res: Response): Promise<void> {
    try {
      console.log('Received message request:', req.body);
      const { message } = req.body;

      if (!message || typeof message !== 'string') {
        const error: ErrorResponse = {
          error: 'Bad Request',
          message: 'Message is required and must be a string',
          statusCode: 400
        };
        console.log('Validation failed:', error);
        res.status(400).json(error);
        return;
      }
      
      console.log('Processing message:', message);
      const response = await chatService.getResponse(message);
      console.log('Response generated:', response);
      res.json(response);
    } catch (error: any) {
      console.error('Error in chat controller:', error);
      const errorResponse: ErrorResponse = {
        error: 'Internal Server Error',
        message: error?.message || 'Failed to process chat message',
        statusCode: 500
      };
      res.status(500).json(errorResponse);
    }
  },

  clearConversation(req: Request, res: Response): void {
    try {
      chatService.clearConversation();
      res.status(200).json({ message: 'Conversation cleared successfully' });
    } catch (error) {
      console.error('Error clearing conversation:', error);
      const errorResponse: ErrorResponse = {
        error: 'Internal Server Error',
        message: 'Failed to clear conversation',
        statusCode: 500
      };
      res.status(500).json(errorResponse);
    }
  }
}; 