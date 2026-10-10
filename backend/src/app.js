import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { env } from './config/env.js';
import { isDatabaseConnected } from './config/database.js';
import questionRoutes from './routes/questionRoutes.js';
import playerRoutes from './routes/playerRoutes.js';
import examRoutes from './routes/examRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

export const app = express();
app.disable('x-powered-by');
// Render terminates TLS at its reverse proxy; enable only on that platform.
if (process.env.RENDER === 'true') app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({ origin: env.origin }));
app.use(rateLimit({ windowMs: 60000, limit: 120, standardHeaders: 'draft-8', legacyHeaders: false, message: { success: false, message: 'Quá nhiều yêu cầu. Vui lòng thử lại sau một phút.' } }));
app.use(express.json({ limit: '16kb' }));
app.get('/api/health', (req, res) => {
  const connected = isDatabaseConnected();
  res.status(connected ? 200 : 503).json({ status: connected ? 'ok' : 'degraded', database: connected ? 'connected' : 'disconnected', service: 'HisRun API' });
});
app.use('/api/questions', questionRoutes);
app.use('/api/exams', examRoutes);
app.use('/api', playerRoutes);
app.use(notFound);
app.use(errorHandler);
