import { before, after, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { app } from '../src/app.js';
import Question from '../src/models/Question.js';
import { JOURNEY_MAPS, SCHOOL_LEVELS, checkpointsFor, nextMap } from '../../shared/journey.js';
import { WORLD_TOPICS } from '../../shared/playModes.js';
let mongo, rows;
before(async () => { mongo = await MongoMemoryServer.create(); await mongoose.connect(mongo.getUri()); rows = JSON.parse(await readFile(new URL('../src/data/questions/journey.json', import.meta.url))); for(let i=0;i<2;i++) await Question.bulkWrite(rows.map(row => ({updateOne:{filter:{contentKey:row.contentKey},update:{$set:row},upsert:true}}))); });
after(async () => { await mongoose.disconnect(); await mongo?.stop(); });
test('54 questions cover every landmark, school and subject without duplicate seeding', async () => {
 assert.equal(await Question.countDocuments(),54);
 for(const map of JOURNEY_MAPS) for(const landmark of map.landmarks) for(const school of SCHOOL_LEVELS) for(const subject of ['history','geography']) {
 const query={mapId:map.id,landmarkId:landmark.id,schoolLevel:school.id,subject,curriculum:'pre-2018'};
 const {body}=await request(app).get('/api/questions/random').query(query).expect(200);
 for(const [key,value] of Object.entries(query)) assert.equal(body[key],value);
 assert.equal(body.correctAnswer,undefined);assert.equal(body.explanation,undefined);assert.equal(body.sourceUrl,undefined);
 await request(app).get('/api/questions/random').query({...query,exclude:body._id}).expect(404);
 }
});
test('source and explanation appear after answering, never labelled textbook verified',async()=>{
 const row=await Question.findOne({landmarkId:'ben-nha-rong',schoolLevel:'primary'}).select('+correctAnswer');
 const {body}=await request(app).post(`/api/questions/${row._id}/answer`).send({answer:row.correctAnswer}).expect(200);
 assert.equal(body.correct,true);assert.ok(body.sourceUrl.startsWith('https://'));assert.equal(body.textbookVerified,false);assert.ok(body.explanation);
});
test('invalid maps and cross-map landmarks rejected',async()=>{
 for(const query of [{mapId:'map-99'},{schoolLevel:'bad'},{mapId:'map-01',landmarkId:'ben-thanh'},{curriculum:'2018'}]) await request(app).get('/api/questions/random').query(query).expect(400);
});
test('north to south route has reachable gates and ends after map 8',()=>{
 JOURNEY_MAPS.forEach((map,index)=>{ assert.equal(map.number,index+1);if(index)assert.ok(map.latitude<JOURNEY_MAPS[index-1].latitude); for(const gate of checkpointsFor(map.id))assert.ok(gate.distance<map.distance); });
 assert.equal(checkpointsFor('map-08').length,4);assert.equal(nextMap('map-08'),null);assert.equal(nextMap('map-01').id,'map-02');
});
test('world scope samples only world questions and never exposes the answer', async () => {
 const samples = JSON.parse(await readFile(new URL('../src/data/questions/geography.json', import.meta.url)));
 await Question.insertMany(samples);
 const { body } = await request(app).get('/api/questions?scope=world&limit=100').expect(200);
 assert.ok(body.total >= 10);
 body.questions.forEach(row => { assert.ok(WORLD_TOPICS.includes(row.topic)); assert.equal(row.subject, 'geography'); assert.equal(row.correctAnswer, undefined); });
 await request(app).get('/api/questions/random?scope=world&subject=history').expect(400);
 await request(app).get('/api/questions/random?scope=bad').expect(400);
});
