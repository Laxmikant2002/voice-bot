"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chatController_1 = require("../controllers/chatController");
const router = (0, express_1.Router)();
router.post('/message', chatController_1.chatController.handleMessage);
router.post('/stream', chatController_1.chatController.streamMessage);
router.post('/clear', chatController_1.chatController.clearConversation);
exports.default = router;
//# sourceMappingURL=chatRoutes.js.map