import { Request, Response } from 'express';
export declare const chatController: {
    handleMessage(req: Request, res: Response): Promise<void>;
    clearConversation(req: Request, res: Response): void;
};
