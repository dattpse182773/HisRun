import { before, after, test } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { app } from '../src/app.js';
import ExamRun from '../src/models/ExamRun.js';
import ExamScore from '../src/models/ExamScore.js';
import { eligibleForStudy } from '../../shared/contentPolicy.js';
import { STUDY_BANK } from '../src/data/studyBank.js';
import { provinceBank } from '../src/data/provinceBank.js';
import { PROVINCES } from '../../shared/provinces.js';
import { EXPLORATION_MAPS } from '../../shared/exploration.js';
import { examPool, gradeExam } from '../src/routes/examRoutes.js';
let mongo;
test('live exploration answers are sequential, graded on server and retry-safe', async()=>{
 const {body:run}=await request(app).post('/api/exams').send({mode:'explore',provinceId:'quangninh',count:10}).expect(201);
 const stored=await ExamRun.findOne({token:run.token});
 await request(app).post(`/api/exams/${run.token}/answer`).send({index:1,answer:0}).expect(400);
 const answer=stored.questions[0].correctAnswer;
 const {body:first}=await request(app).post(`/api/exams/${run.token}/answer`).send({index:0,answer}).expect(200);
 assert.equal(first.correct,true);
 const {body:retry}=await request(app).post(`/api/exams/${run.token}/answer`).send({index:0,answer:(answer+1)%4}).expect(200);
 assert.deepEqual(retry,first);
});
before(async () => { mongo = await MongoMemoryServer.create(); await mongoose.connect(mongo.getUri()); await ExamRun.init(); await ExamScore.init(); });
after(async () => { await mongoose.disconnect(); await mongo.stop(); });
test('all 34 maps and all grades have enough distinct valid questions', () => {
 assert.deepEqual(new Set(EXPLORATION_MAPS.map(p => p.id)), new Set(PROVINCES.map(p => p.id)));
 for (const p of PROVINCES) { const bank = provinceBank(p.id); assert.ok(bank.length > 10); assert.ok(bank.every(q => q.provinceId === p.id)); }
 for(let grade = 4; grade <= 12; grade++) assert.ok(STUDY_BANK.filter(q => q.grade === grade).length >= 15);
 const all = [...STUDY_BANK, ...PROVINCES.flatMap(p => provinceBank(p.id))];
 assert.equal(new Set(all.map(q => q.id)).size, all.length);
 for (const q of all) { assert.equal(q.answers.length,4,q.id); assert.equal(new Set(q.answers).size,4,q.id); assert.ok(q.correctAnswer >= 0 && q.correctAnswer < 4,q.id); assert.ok(q.explanation && q.sourceUrl,q.id); }
});
test('strict exam filters reject wrong classes, map IDs and lengths', () => {
 for (const args of [{mode:'study',grade:3,count:10},{mode:'study',grade:'12',count:10},{mode:'study',grade:12,count:30},{mode:'explore',provinceId:'unknown',count:10},{mode:'ranked',count:10},{mode:'world',count:10}]) assert.throws(() => examPool(args));
 assert.throws(() => gradeExam(STUDY_BANK.slice(0,10),[0]));
});
test('grade 12 exam never mixes grades or discloses answer keys; authoritative scoring and retries', async (t) => {
 const fixtures=STUDY_BANK.filter(q=>q.grade===12);
 fixtures.forEach(q=>{ q.provenance={verified:true,kind:'official-exam',curriculum:'pre-2018',title:'Test fixture only',issuer:'Test school',documentUrl:'https://example.test/exam',locator:q.id}; });
 t.after(()=>fixtures.forEach(q=>delete q.provenance));
 const {body:run} = await request(app).post('/api/exams').send({mode:'study',grade:12,count:15}).expect(201);
 assert.equal(run.questions.length,15); assert.equal(new Set(run.questions.map(q => q.id)).size,15);
 assert.ok(run.questions.every(q => q.id.startsWith('study-12-') && !('correctAnswer' in q) && !('explanation' in q)));
 const stored = await ExamRun.findOne({token:run.token});
 const answers = stored.questions.map(q => q.correctAnswer); answers[0] = null;
 const {body:result} = await request(app).post(`/api/exams/${run.token}/submit`).send({answers,score:999999}).expect(200);
 assert.equal(result.correct,14); assert.equal(result.mark,9.3); assert.equal(result.skipped,1); assert.ok(result.summary.length);
 const {body:again} = await request(app).post(`/api/exams/${run.token}/submit`).send({answers:Array(15).fill(0)}).expect(200);
 assert.deepEqual(again,result);
});
test('exploration stays in the selected province and Hanoi is not falsely merged', async () => {
 const {body:run} = await request(app).post('/api/exams').send({mode:'explore',provinceId:'hanoi',count:10}).expect(201);
 assert.equal(run.questions.length,10); assert.ok(run.questions.every(q => q.id.startsWith('province-hanoi-')));
 assert.equal(provinceBank('hanoi')[0].answers[0],'Không sáp nhập cấp tỉnh trong đợt 2025');
 assert.ok(provinceBank('hochiminh')[0].answers[0].includes('Bình Dương'));
});
test('ranked tests have 30 unique prompts and duplicate submission saves one result', async () => {
 const {body:run} = await request(app).post('/api/exams').send({mode:'ranked',count:30}).expect(201);
 assert.equal(new Set(run.questions.map(q => q.question)).size,30);
 const stored = await ExamRun.findOne({token:run.token}); const answers = stored.questions.map(q => q.correctAnswer);
 await Promise.all([1,2].map(() => request(app).post(`/api/exams/${run.token}/submit`).send({answers,name:'Kiểm thử'}).expect(200)));
 assert.equal(await ExamScore.countDocuments({runId:run.token}),1);
 const {body:ranking} = await request(app).get('/api/exams/ranking').expect(200);
 assert.equal(ranking[0].correct,30); assert.equal(ranking[0].runId,undefined);
});
test('study excludes unverified reference material and invalid source kinds', async () => {
 for(const subject of ['history','geography']) await request(app).post('/api/exams').send({mode:'study',grade:12,subject,count:10}).expect(409);
 await request(app).post('/api/exams').send({mode:'study',grade:12,subject:'unknown',count:10}).expect(400);
 const {body:catalog} = await request(app).get('/api/exams/catalog').expect(200);
 assert.deepEqual(catalog.grades.find(g=>g.grade===12).subjects,[{subject:'history',count:0},{subject:'geography',count:0}]);
 assert.ok(STUDY_BANK.every(q=>!eligibleForStudy(q)));
 const q={subject:'history',grade:12,provenance:{verified:true,kind:'official-exam',curriculum:'pre-2018',title:'Fixture',issuer:'School',documentUrl:'https://example.test/exam',locator:'Câu 1'}};
 assert.ok(eligibleForStudy(q));
 assert.equal(eligibleForStudy({...q,provenance:{...q.provenance,kind:'summary'}}),false);
 assert.equal(eligibleForStudy({...q,provenance:{...q.provenance,verified:false}}),false);
 assert.equal(eligibleForStudy({...q,provenance:{...q.provenance,kind:'textbook'}}),false);
 assert.ok(eligibleForStudy({...q,provenance:{...q.provenance,kind:'textbook',edition:'2006'}}));
});
