import test from 'node:test';
import assert from 'node:assert/strict';
import { TOKENS, collectToken, coinValue, effectiveSpeed, TIMED_POWERS, TOKEN_ROTATION } from '../../shared/tokens.js';
import { GEOGRAPHY_LESSONS } from '../../shared/geographyLessons.js';
import { JOURNEY_MAPS } from '../../shared/journey.js';
import { newRun, scoreOf } from '../src/game/systems/rules.js';
test('fast and slow replace each other; timed pickups refresh and never exceed speed limit', () => {
  const state = newRun(); collectToken(state, 'boost'); assert.equal(effectiveSpeed(state), 390);
  collectToken(state, 'clock'); assert.equal(state.powers.boost, 0); assert.equal(effectiveSpeed(state), 195);
  collectToken(state, 'boost'); assert.equal(state.powers.clock, 0);
  state.speed = 460; assert.equal(effectiveSpeed(state), 460);
  collectToken(state, 'doubleCoin'); assert.equal(coinValue(state), 2);
  state.powers.doubleCoin = .2; collectToken(state, 'doubleCoin'); assert.equal(state.powers.doubleCoin, 10);
  for (const key of TIMED_POWERS) state.powers[key] = 0;
  assert.equal(coinValue(state), 1); assert.equal(effectiveSpeed(state), 460);
});
test('negative tokens clamp score and distance and do not reset checkpoint progress', () => {
  const state = newRun(); state.distance = 10; state.gatesVisited = 2;
  collectToken(state, 'penalty'); assert.equal(scoreOf(state), 0); assert.equal(state.penalties, 10);
  collectToken(state, 'rewind'); assert.equal(state.distance, 0); assert.equal(state.gatesVisited, 2); assert.equal(scoreOf(state), 0);
  state.coins = 20; collectToken(state, 'penalty'); assert.equal(state.penalties, 110); assert.equal(scoreOf(state), 90);
  state.health = 3; collectToken(state, 'heart'); assert.equal(state.health, 3);
  assert.equal(newRun().penalties, 0); assert.equal(newRun().tokensCollected, 0);
  assert.deepEqual(new Set(TOKEN_ROTATION), new Set(Object.keys(TOKENS)));
});
test('every map has its own sourced geography lesson and a valid consolidation question', () => {
  assert.equal(Object.keys(GEOGRAPHY_LESSONS).length, JOURNEY_MAPS.length);
  for (const map of JOURNEY_MAPS) {
    const lesson = GEOGRAPHY_LESSONS[map.id];
    for (const field of ['location', 'terrain', 'climate', 'connection', 'takeaway']) assert.ok(lesson[field].length > 30);
    assert.ok(lesson.sources.length > 0 && lesson.sources.every(([,url]) => url.startsWith('https://')));
    assert.equal(lesson.choices.length, 3); assert.ok(lesson.choices[lesson.answer]);
  }
});
