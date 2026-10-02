import { api } from './api.js';
import { readStorage, writeStorage } from './storage.js';
let creating = null;
export async function ensurePlayer() {
  const existing = readStorage('player', null); if (existing?.token) return existing;
  if (!creating) creating = api.createPlayer(readStorage('username', 'Nhà thám hiểm')).then(player => { writeStorage('player', player); return player; }).finally(() => { creating = null; });
  return creating;
}
let syncing = null;
export async function syncResults() {
  if (syncing) return syncing;
  syncing = (async () => {
    const runs = readStorage('pending', []); if (!runs.length) return;
    const player = await ensurePlayer();
    for (const run of runs) {
      await api.saveResult(run, player);
      writeStorage('pending', readStorage('pending', []).filter(row => row.runId !== run.runId));
    }
  })().finally(() => { syncing = null; });
  return syncing;
}
export async function saveRun(result) {
  writeStorage('pending', [...readStorage('pending', []).filter(row => row.runId !== result.runId), result].slice(-30));
  return syncResults();
}
