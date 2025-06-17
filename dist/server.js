"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const chatRoutes_1 = __importDefault(require("./routes/chatRoutes"));
const config_1 = require("./config");
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.static('public'));
// Routes
app.use('/api/chat', chatRoutes_1.default);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: 'Something went wrong!',
        statusCode: 500
    });
    next(); // Call next to continue to the next middleware
});
// Start server
app.listen(config_1.config.port, () => {
    const protocol = config_1.config.environment === 'production' ? 'https' : 'http';
    const serverAddress = `${protocol}://localhost:${config_1.config.port}`;
    console.log(`Server is running in ${config_1.config.environment} mode`);
    console.log(`Access the application at: ${serverAddress}`);
    console.log(`API endpoints available at: ${serverAddress}/api/chat/message`);
    console.log('--------------------------------------------------');
});
//# sourceMappingURL=server.js.map