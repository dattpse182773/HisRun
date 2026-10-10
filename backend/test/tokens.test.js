import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { validateResult } from '../src/services/playerService.js';
import { buildFilters } from '../src/services/questionService.js';
const run = () => ({ runId: randomUUID(), mode: 'mixed', distance: 100, coins: 2, correctAnswers: 0, wrongAnswers: 0, historyCorrect: 0, geographyCorrect: 0, bestCombo: 0, duration: 10, score: 20, penalties: 100 });
test('penalty scores can be saved, zero is clamped, legacy results remain accepted', () => {
  assert.equal(validateResult(run()).penalties, 100);
  assert.equal(validateResult({ ...run(), distance: 0, coins: 0, score: 0 }).score, 0);
  assert.equal(validateResult({ ...run(), penalties: undefined, score: 120 }).penalties, 0);
  for (const changes of [{ penalties: -1 }, { penalties: 1.5 }, { penalties: '100' }, { score: -1 }, { score: 2000 }]) assert.throws(() => validateResult({ ...run(), ...changes }));
});
test('challenge questions exclude the current map without weakening ordinary filters', () => {
  const f = buildFilters({ scope: 'challenge', excludedMapId: 'map-02', subject: 'geography', difficulty: '3' });
  assert.deepEqual(f.mapId, { $ne: 'map-02' }); assert.equal(f.difficulty, 3); assert.equal(f.subject, 'geography');
  assert.throws(() => buildFilters({ scope: 'challenge', excludedMapId: 'bad' }));
  assert.throws(() => buildFilters({ excludedMapId: 'map-01' }));
  assert.throws(() => buildFilters({ scope: 'challenge', excludedMapId: 'map-01', mapId: 'map-02' }));
});
