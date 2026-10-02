import mongoose from 'mongoose';
import { env } from './env.js';

mongoose.set('bufferCommands', false);
// Build indexes explicitly after connection, never during module import while offline.
mongoose.set('autoCreate', false);
mongoose.set('autoIndex', false);
export async function connectDatabase() {
  await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 5000 });
  await Promise.all(Object.values(mongoose.models).map(model => model.createIndexes()));
  console.log('MongoDB connected');
}
export function isDatabaseConnected() {
  return mongoose.connection.readyState === 1;
}
