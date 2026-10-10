import { test } from 'node:test';
import assert from 'node:assert/strict';
import { studyAssessment, WORLD_TOPICS } from '../../shared/playModes.js';
import { readFileSync } from 'node:fs';
test('assessment does not turn unanswered learning into a passing grade', () => {
  assert.equal(studyAssessment(0, 0).mark, null);
  assert.equal(studyAssessment(7, 3).mark, 7);
  assert.equal(studyAssessment(0, 10).mark, 0);
});
test('the existing world bank contains enough different questions for a complete run', () => {
  const questions = JSON.parse(readFileSync(new URL('../../backend/src/data/questions/geography.json', import.meta.url)));
  const world = questions.filter(q => WORLD_TOPICS.includes(q.topic));
  assert.ok(world.length >= 10);
  assert.equal(new Set(world.map(q => q.question)).size, world.length);
});
