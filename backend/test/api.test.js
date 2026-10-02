import { before, after, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { app } from '../src/app.js';
import Question from '../src/models/Question.js';

let mongo;
let known;
before(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri('hisrun_test');
  const seedPath = new URL('../src/scripts/seedQuestions.js', import.meta.url);
  const { fileURLToPath } = await import('node:url');
  for (let i = 0; i < 2; i++) execFileSync(process.execPath, [fileURLToPath(seedPath)], { env: { ...process.env, MONGODB_URI: uri }, timeout: 30000 });
  await mongoose.connect(uri);
  known = await Question.findOne({ topic: 'Ngô Quyền' }).select('+correctAnswer +explanation').lean();
});
after(async () => { await mongoose.disconnect(); await mongo?.stop(); });

test('health reports the actual database connection', async () => {
  const response = await request(app).get('/api/health').expect(200);
  assert.deepEqual(response.body, { status: 'ok', database: 'connected', service: 'HisRun API' });
});
test('seed is repeatable: 40 samples, 20 per subject', async () => {
  assert.equal(await Question.countDocuments(), 40);
  for (const subject of ['history', 'geography']) {
    const rows = JSON.parse(await readFile(new URL(`../src/data/questions/${subject}.json`, import.meta.url), 'utf8'));
    assert.equal(rows.length, 20);
    assert.equal(await Question.countDocuments({ subject }), 20);
  }
});
test('list, random and detail never disclose answers or explanations', async () => {
  for (const path of ['/api/questions', '/api/questions/random', `/api/questions/${known._id}`]) {
    const { body } = await request(app).get(path).expect(200);
    const rows = body.questions || [body];
    for (const row of rows) {
      assert.equal('correctAnswer' in row, false);
      assert.equal('explanation' in row, false);
      assert.equal(row.answers.length, 4);
    }
  }
});
test('random respects subject, grade, difficulty and recent exclusions', async () => {
  const { body } = await request(app).get(`/api/questions/random?subject=history&grade=6&difficulty=1&exclude=${known._id}`).expect(200);
  assert.equal(body.subject, 'history'); assert.equal(body.grade, 6); assert.equal(body.difficulty, 1);
  assert.notEqual(body._id, String(known._id));
  await request(app).get('/api/questions/random?subject=history&grade=6&difficulty=5').expect(404);
});
test('pagination is bounded and deterministic', async () => {
  const first = await request(app).get('/api/questions?limit=2&page=1').expect(200);
  const second = await request(app).get('/api/questions?limit=2&page=2').expect(200);
  assert.equal(first.body.total, 40); assert.equal(first.body.questions.length, 2);
  assert.notEqual(first.body.questions[0]._id, second.body.questions[0]._id);
});
test('backend validates correct and incorrect submissions', async () => {
  const correct = await request(app).post(`/api/questions/${known._id}/answer`).send({ answer: known.correctAnswer }).expect(200);
  assert.deepEqual(correct.body, { correct: true, correctAnswer: known.correctAnswer, explanation: known.explanation });
  const wrong = await request(app).post(`/api/questions/${known._id}/answer`).send({ answer: (known.correctAnswer + 1) % 4 }).expect(200);
  assert.equal(wrong.body.correct, false);
});
test('answer rejects coercion, fractions and out-of-range values', async () => {
  for (const answer of [-1, 4, 'a', '1', null, true, 1.5, {}, []]) await request(app).post(`/api/questions/${known._id}/answer`).send({ answer }).expect(400);
  await request(app).post(`/api/questions/${known._id}/answer`).send({}).expect(400);
});
test('invalid IDs and query filters return safe 400 responses', async () => {
  for (const query of ['grade=3', 'grade=13', 'difficulty=0', 'difficulty=1.5', 'subject=math', 'exclude=bad', 'limit=101', 'page=0', 'grade=6&grade=7']) {
    const { body } = await request(app).get(`/api/questions?${query}`).expect(400);
    assert.equal(body.success, false); assert.equal('stack' in body, false);
  }
  await request(app).get('/api/questions/not-an-id').expect(400);
  await request(app).post('/api/questions/invalid/answer').send({ answer: 1 }).expect(400);
  await request(app).get('/api/questions/000000000000000000000000').expect(404);
});
test('inactive questions cannot be retrieved or answered', async () => {
  await Question.updateOne({ _id: known._id }, { $set: { active: false } });
  await request(app).get(`/api/questions/${known._id}`).expect(404);
  await request(app).post(`/api/questions/${known._id}/answer`).send({ answer: 1 }).expect(404);
  await Question.updateOne({ _id: known._id }, { $set: { active: true } });
});
test('security headers, restricted CORS and centralized JSON errors', async () => {
  const response = await request(app).get('/api/health').set('Origin', 'http://localhost:5173').expect(200);
  assert.equal(response.headers['access-control-allow-origin'], 'http://localhost:5173');
  assert.ok(response.headers['x-content-type-options']);
  const blocked = await request(app).get('/api/health').set('Origin', 'https://untrusted.example');
  assert.notEqual(blocked.headers['access-control-allow-origin'], 'https://untrusted.example');
  const invalid = await request(app).post(`/api/questions/${known._id}/answer`).set('Content-Type', 'application/json').send('{broken').expect(400);
  assert.equal(invalid.body.success, false);
  await request(app).get('/api/missing').expect(404);
});
test('database loss returns degraded health and safe 503, never fake connected', async () => {
  await mongoose.disconnect();
  const { body } = await request(app).get('/api/health').expect(503);
  assert.equal(body.database, 'disconnected');
  await request(app).get('/api/questions/random').expect(503);
});
