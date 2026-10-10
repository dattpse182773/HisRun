import { test } from 'node:test';
import assert from 'node:assert/strict';
import { questionReady, resolveRunAnswer } from '../../shared/runLife.js';
test('questions require both running time and distance; rewinding cannot trigger another immediately',()=>{
 const s={health:3,examIndex:0,duration:19,distance:600};
 assert.equal(questionReady(s),false);s.duration=20;assert.equal(questionReady(s),true);
 resolveRunAnswer(s,false);assert.equal(s.health,2);assert.equal(s.distance,550);assert.equal(questionReady(s),false);
 s.duration=50;s.distance=729;assert.equal(questionReady(s),false);s.distance=730;assert.equal(questionReady(s),true);
 s.examIndex=10;assert.equal(questionReady(s),false);
});
test('three lives maximum, wrong answers end at zero and distance cannot become negative',()=>{
 const s={health:3,distance:10,duration:0};resolveRunAnswer(s,true);assert.equal(s.health,3);assert.equal(s.distance,30);
 for(let i=0;i<3;i++)resolveRunAnswer(s,false);assert.equal(s.health,0);assert.equal(s.distance,0);
 resolveRunAnswer(s,true);assert.equal(s.health,1);assert.equal(s.distance,20);
});
