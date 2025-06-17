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