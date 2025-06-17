"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatController = void 0;
const chatService_1 = require("../services/chatService");
const chatService = new chatService_1.ChatService();
exports.chatController = {
    async handleMessage(req, res) {
        try {
            const { message } = req.body;
            if (!message || typeof message !== 'string') {
                const error = {
                    error: 'Bad Request',
                    message: 'Message is required and must be a string',
                    statusCode: 400
                };
                res.status(400).json(error);
                return;
            }
            const response = await chatService.getResponse(message);
            res.json(response);
        }
        catch (error) {
            console.error('Error in chat controller:', error);
            const errorResponse = {
                error: 'Internal Server Error',
                message: 'Failed to process chat message',
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