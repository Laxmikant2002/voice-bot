import express from 'express';
import cors from 'cors';
import chatRoutes from './routes/chatRoutes';
import { config } from './config';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/api/chat', chatRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong!',
    statusCode: 500
  });
  next(); // Call next to continue to the next middleware
});

// Start server
app.listen(config.port, () => {
  const protocol = config.environment === 'production' ? 'https' : 'http';
  const serverAddress = `${protocol}://localhost:${config.port}`;
  
  console.log(`Server is running in ${config.environment} mode`);
  console.log(`Access the application at: ${serverAddress}`);
  console.log(`API endpoints available at: ${serverAddress}/api/chat/message`);
  console.log('--------------------------------------------------');
});