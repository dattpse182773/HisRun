import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import net from 'node:net';
import { MongoMemoryServer } from 'mongodb-memory-server';

// Optional development-only launcher. Runs a real local mongod, with persistent data.
const port = 27017;
const portFree = await new Promise(resolve => {
  const probe = net.createServer();
  probe.once('error', () => resolve(false));
  probe.listen(port, '127.0.0.1', () => probe.close(() => resolve(true)));
});
if (!portFree) {
  console.error('Port 27017 already in use. Keep your existing MongoDB service; do not start a second one.');
  process.exit(1);
}
const dbPath = fileURLToPath(new URL('../../.local/mongodb', import.meta.url));
await mkdir(dbPath, { recursive: true });
let mongo;
try {
  mongo = await MongoMemoryServer.create({ instance: { port, ip: '127.0.0.1', dbPath, storageEngine: 'wiredTiger' } });
  console.log('Development MongoDB: mongodb://127.0.0.1:27017/hisrun');
  console.log(`Data persisted in ${dbPath}. Ctrl+C to stop. Not a production service.`);
} catch {
  console.error('Cannot start development MongoDB. Check download access and port 27017, or use MongoDB Community/Atlas.');
  process.exit(1);
}
let stopping = false;
async function stop() {
  if (stopping) return;
  stopping = true;
  await mongo.stop({ doCleanup: false });
  process.exit(0);
}
process.once('SIGINT', stop);
process.once('SIGTERM', stop);
