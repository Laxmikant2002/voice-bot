import { Router } from 'express';
import { chatController } from '../controllers/chatController';

const router = Router();

router.post('/message', chatController.handleMessage);
router.post('/clear', chatController.clearConversation);

export default router; 