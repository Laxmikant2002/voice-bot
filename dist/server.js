"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const chatRoutes_1 = __importDefault(require("./routes/chatRoutes"));
const config_1 = require("./config");
// Create Express application
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
// Async function to start the server
// Import the initializeEncryptedConfig function
const config_2 = require("./config");
const startServer = async () => {
    try {
        // Initialize encrypted API keys if needed
        if (config_1.config.useEncryptedKeys) {
            await (0, config_2.initializeEncryptedConfig)();
            console.log('Successfully initialized with encrypted API keys');
        }
        // Start the server
        app.listen(config_1.config.port, () => {
            const protocol = config_1.config.environment === 'production' ? 'https' : 'http';
            const serverAddress = `${protocol}://localhost:${config_1.config.port}`;
            console.log(`Server is running in ${config_1.config.environment} mode`);
            console.log(`Access the application at: ${serverAddress}`);
            console.log(`API endpoints available at: ${serverAddress}/api/chat/message`);
            console.log(`Streaming API available at: ${serverAddress}/api/chat/stream`);
            console.log('--------------------------------------------------');
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};
// Start the server
startServer();
//# sourceMappingURL=server.js.map