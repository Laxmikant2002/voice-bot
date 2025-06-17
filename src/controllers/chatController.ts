import { Request, Response } from 'express';
import { ChatService } from '../services/chatService';
import { ErrorResponse } from '../types';

/**
 * Service instance for processing AI chat requests
 */
const chatService = new ChatService();

/**
 * Chat controller for handling message and streaming endpoints
 */
export const chatController = {
  /**
   * Processes regular (non-streaming) message requests
   */
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
        res.status(400).json(error);
        return;
      }
      
      console.log('Processing message:', message);
      const response = await chatService.getResponse(message);
      
      if (response.source) {
        console.log(`Response came from: ${response.source}`);
      }
      res.json(response);    } catch (error: unknown) {
      console.error('Error in chat controller:', error);
      const errorResponse: ErrorResponse = {
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Failed to process chat message',
        statusCode: 500
      };
      res.status(500).json(errorResponse);
    }
  },

  async streamMessage(req: Request, res: Response): Promise<void> {
    try {
      console.log('Received streaming request:', req.body);
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
        // Configure SSE (Server-Sent Events) connection
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders();
      
      console.log('Processing streaming message:', message);
      
      try {
        const streamGenerator = chatService.getStreamingResponse(message);
        
        for await (const chunk of streamGenerator) {
          res.write(`data: ${JSON.stringify(chunk)}\n\n`);
          
          const response = res as { flush?: () => void };
          if (typeof response.flush === 'function') {
              response.flush();
          }
        }
        
        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        res.end();
      } catch (streamError) {
        console.error('Streaming error:', streamError);
        // Send error as an event
        res.write(`data: ${JSON.stringify({ 
          error: true, 
          message: 'Error during streaming response' 
        })}\n\n`);
        res.end();
      }    } catch (error: unknown) {
      console.error('Error in chat streaming controller:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // If headers haven't been sent yet, send error response
      if (!res.headersSent) {
        const errorResponse: ErrorResponse = {
          error: 'Internal Server Error',
          message: errorMessage || 'Failed to process streaming chat message',
          statusCode: 500
        };
        res.status(500).json(errorResponse);
      } else {
        // If headers were sent, send error as event
        res.write(`data: ${JSON.stringify({ 
          error: true, 
          message: errorMessage || 'Error occurred during stream processing' 
        })}\n\n`);
        res.end();
      }
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