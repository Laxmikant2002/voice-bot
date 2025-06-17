import { Request, Response } from 'express';
/**
 * Chat controller for handling message and streaming endpoints
 */
export declare const chatController: {
    /**
     * Processes regular (non-streaming) message requests
     */
    handleMessage(req: Request, res: Response): Promise<void>;
    streamMessage(req: Request, res: Response): Promise<void>;
    clearConversation(req: Request, res: Response): void;
};
