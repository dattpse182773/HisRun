import { test } from 'node:test';
import assert from 'node:assert/strict';
import { blockedLanes, canAvoid, comboMultiplier, difficultyAt, newRun, scoreOf } from '../src/game/systems/rules.js';
test('every obstacle pattern retains a clear lane at all difficulty levels', () => {
  for (let level = 1; level <= 5; level++) for (let i = 0; i < 1000; i++) {
    const { safe, blocked } = blockedLanes(level);
    assert.ok(safe >= 0 && safe <= 2); assert.ok(!blocked.includes(safe));
    assert.ok(blocked.length <= 2); assert.equal(new Set(blocked).size, blocked.length);
    if (level < 3) assert.equal(blocked.length, 1);
  }
});
test('difficulty advances gently and is capped, including extremely long runs', () => {
  assert.equal(difficultyAt(999).level, 1); assert.equal(difficultyAt(1000).level, 2);
  assert.equal(difficultyAt(4000).speed, 460); assert.equal(difficultyAt(10000000).speed, 460);
  for (const distance of [0, 1000, 2000, 3000, 4000]) {
    const config = difficultyAt(distance);
    assert.ok(config.interval >= 1.3); assert.ok(config.questionDifficulty >= 1 && config.questionDifficulty <= 5);
  }
});
test('jump and slide change obstacle collision rules without defeating tall rocks', () => {
  for (const type of ['log', 'pit', 'trap', 'fence']) {
    assert.equal(canAvoid(type, { bottom: 0, height: 112 }), false);
    assert.equal(canAvoid(type, { bottom: 60, height: 112 }), true);
  }
  assert.equal(canAvoid('branch', { bottom: 0, height: 48 }), true);
  assert.equal(canAvoid('branch', { bottom: 60, height: 112 }), false);
  assert.equal(canAvoid('rock', { bottom: 100, height: 48 }), false);
});
test('knowledge multipliers and score composition match the displayed rules', () => {
  assert.deepEqual([0, 1, 2, 3, 5, 10].map(comboMultiplier), [1, 1, 1.2, 1.5, 2, 3]);
  const state = newRun('history', 7); state.distance = 120.9; state.coins = 8; state.questionPoints = 220;
  assert.equal(scoreOf(state), 420);
});
test('restart returns independent run identifiers, health and power-up state', () => {
  const first = newRun(); first.health = 0; first.powers.shield = 1; first.wrongQuestions.push('old');
  const second = newRun('grade', 9);
  assert.notEqual(first.runId, second.runId); assert.equal(second.health, 3);
  assert.equal(second.powers.shield, 0); assert.equal(second.wrongQuestions.length, 0); assert.equal(second.grade, 9);
});
