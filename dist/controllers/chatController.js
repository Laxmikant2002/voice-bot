"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatController = void 0;
const chatService_1 = require("../services/chatService");
const chatService = new chatService_1.ChatService();
exports.chatController = {
    async handleMessage(req, res) {
        try {
            console.log('Received message request:', req.body);
            const { message } = req.body;
            if (!message || typeof message !== 'string') {
                const error = {
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
            // Add information about which AI service was used (if provided by the service)
            if (response.source) {
                console.log(`Response came from: ${response.source}`);
            }
            res.json(response);
        }
        catch (error) {
            console.error('Error in chat controller:', error);
            const errorResponse = {
                error: 'Internal Server Error',
                message: error?.message || 'Failed to process chat message',
                statusCode: 500
            };
            res.status(500).json(errorResponse);
        }
    },
    async streamMessage(req, res) {
        try {
            console.log('Received streaming request:', req.body);
            const { message } = req.body;
            if (!message || typeof message !== 'string') {
                const error = {
                    error: 'Bad Request',
                    message: 'Message is required and must be a string',
                    statusCode: 400
                };
                console.log('Validation failed:', error);
                res.status(400).json(error);
                return;
            }
            // Set headers for SSE (Server-Sent Events)
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');
            res.flushHeaders(); // Flush the headers to establish SSE with client
            console.log('Processing streaming message:', message);
            try {
                // Get streaming response generator
                const streamGenerator = chatService.getStreamingResponse(message);
                // Stream each chunk to the client
                for await (const chunk of streamGenerator) {
                    // Format as an SSE event
                    res.write(`data: ${JSON.stringify(chunk)}\n\n`); // Ensure data is sent immediately
                    // In some Express implementations, response might have a flush method
                    const response = res;
                    if (typeof response.flush === 'function') {
                        response.flush();
                    }
                }
                // End the stream with a done event
                res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
                res.end();
            }
            catch (streamError) {
                console.error('Streaming error:', streamError);
                // Send error as an event
                res.write(`data: ${JSON.stringify({
                    error: true,
                    message: 'Error during streaming response'
                })}\n\n`);
                res.end();
            }
        }
        catch (error) {
            console.error('Error in chat streaming controller:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            // If headers haven't been sent yet, send error response
            if (!res.headersSent) {
                const errorResponse = {
                    error: 'Internal Server Error',
                    message: errorMessage || 'Failed to process streaming chat message',
                    statusCode: 500
                };
                res.status(500).json(errorResponse);
            }
            else {
                // If headers were sent, send error as event
                res.write(`data: ${JSON.stringify({
                    error: true,
                    message: errorMessage || 'Error occurred during stream processing'
                })}\n\n`);
                res.end();
            }
        }
    },
    clearConversation(req, res) {
        try {
            chatService.clearConversation();
            res.status(200).json({ message: 'Conversation cleared successfully' });
        }
        catch (error) {
            console.error('Error clearing conversation:', error);
            const errorResponse = {
                error: 'Internal Server Error',
                message: 'Failed to clear conversation',
                statusCode: 500
            };
            res.status(500).json(errorResponse);
        }
    }
};
//# sourceMappingURL=chatController.js.map