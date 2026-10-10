import { before, after, test } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { app } from '../src/app.js';
import GameResult from '../src/models/GameResult.js';
import User from '../src/models/User.js';
let mongo, player;
const validRun = () => ({ playerId: player._id, runId: randomUUID(), mode: 'mixed', score: 1500, distance: 1000, coins: 20, correctAnswers: 3, wrongAnswers: 1, historyCorrect: 2, geographyCorrect: 1, bestCombo: 2, duration: 40 });
before(async () => {
  mongo = await MongoMemoryServer.create(); await mongoose.connect(mongo.getUri('players_test'));
  await GameResult.createIndexes();
  const result = await request(app).post('/api/users').send({ username: 'Kiểm thử' }).expect(201); player = result.body;
});
after(async () => { await mongoose.disconnect(); await mongo?.stop(); });
test('guest identity contains a private write token but public profile never exposes it', async () => {
  assert.equal(player.token.length, 64);
  const { body } = await request(app).get(`/api/users/${player._id}`).expect(200);
  assert.equal(body.username, 'Kiểm thử'); assert.equal('token' in body, false); assert.equal('tokenHash' in body, false);
  assert.equal(body.stats.totalGames, 0);
});
test('invalid names are rejected', async () => {
  for (const username of ['', 'a', null, '<script>', 'x'.repeat(25)]) await request(app).post('/api/users').send({ username }).expect(400);
});
test('saving a run requires the owner token', async () => {
  await request(app).post('/api/game-results').send(validRun()).expect(401);
  await request(app).post('/api/game-results').set('Authorization', `Bearer ${'a'.repeat(64)}`).send(validRun()).expect(401);
});
test('duplicate and concurrent submission retries never count a run twice', async () => {
  const run = validRun();
  await Promise.all(Array.from({ length: 3 }, () => request(app).post('/api/game-results').set('Authorization', `Bearer ${player.token}`).send(run).expect(200)));
  const { body } = await request(app).get(`/api/users/${player._id}`).expect(200);
  assert.equal(body.stats.totalGames, 1); assert.equal(body.stats.coins, 20); assert.equal(body.stats.highScore, 1500);
  assert.equal(body.recent[0].verified, false);
});
test('new results accumulate exact totals and leaderboard metrics', async () => {
  const run = { ...validRun(), score: 2500, coins: 120 };
  await request(app).post('/api/game-results').set('Authorization', `Bearer ${player.token}`).send(run).expect(200);
  for (const metric of ['score', 'distance', 'knowledge']) {
    const { body } = await request(app).get(`/api/leaderboard/${metric}`).expect(200);
    assert.equal(body.length, 1); assert.equal(body[0].totalGames, 2); assert.equal(body[0].highScore, 2500);
    assert.equal(body[0].totalDistance, 2000); assert.equal(body[0].correctAnswers, 6); assert.equal(body[0].coins, 140);
    assert.equal('tokenHash' in body[0], false);
  }
});
test('inconsistent results, forged score and invalid ObjectIds are rejected', async () => {
  for (const changes of [{ score: -1 }, { score: 9000000 }, { score: 1 }, { duration: 1 }, { correctAnswers: 100 }, { bestCombo: 4 }, { coins: '20' }, { mode: 'bad' }, { runId: 'bad' }]) {
    await request(app).post('/api/game-results').set('Authorization', `Bearer ${player.token}`).send({ ...validRun(), ...changes }).expect(400);
  }
  await request(app).get('/api/users/nope').expect(400); await request(app).get('/api/leaderboard/nope').expect(400);
});
test('ranked leaderboard excludes discovery runs and world completion is validated', async () => {
  const run = { ...validRun(), mode: 'world', completed: true };
  await request(app).post('/api/game-results').set('Authorization', `Bearer ${player.token}`).send(run).expect(200);
  const { body } = await request(app).get('/api/leaderboard/score?mode=mixed').expect(200);
  assert.equal(body[0].totalGames, 2);
  await request(app).get('/api/leaderboard/score?mode=invalid').expect(400);
  await request(app).post('/api/game-results').set('Authorization', `Bearer ${player.token}`).send({ ...run, runId: randomUUID(), distance: 900 }).expect(400);
});
