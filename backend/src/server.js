import mongoose from 'mongoose';
import { app } from './app.js';
import { env } from './config/env.js';
import { connectDatabase, isDatabaseConnected } from './config/database.js';

let connecting = false;
async function tryConnect() {
  if (connecting || isDatabaseConnected()) return;
  connecting = true;
  try { await connectDatabase(); }
  catch { console.error('MongoDB unavailable. Check MONGODB_URI and MongoDB service. Retrying in 10 seconds.'); }
  finally { connecting = false; }
}
const server = app.listen(env.port, () => console.log(`HisRun API: http://localhost:${env.port}`));
server.on('error', () => { console.error('Cannot start API. Check PORT availability.'); process.exit(1); });
void tryConnect();
const retry = setInterval(tryConnect, 10000);
async function shutdown() {
  clearInterval(retry);
  const deadline = setTimeout(() => process.exit(1), 5000);
  deadline.unref();
  server.close(async () => { await mongoose.disconnect(); process.exit(0); });
}
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
