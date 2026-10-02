import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';

dotenv.config({ path: fileURLToPath(new URL('../../.env', import.meta.url)), quiet: true });
export const env = {
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hisrun',
  origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  production: process.env.NODE_ENV === 'production',
};
